// ─── Edge Function: sync_events ────────────────────────────────────────────────
// Reçoit un lot d'événements hors-ligne et les insère de façon idempotente.
// Chaque événement porte un clientUUID qui sert de clé d'idempotence.
// Retourne les UUIDs des événements acceptés et ceux rejetés (doublons).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { events, deviceId } = await req.json();
    if (!Array.isArray(events) || events.length === 0) return new Response(JSON.stringify({ error: 'events requis' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Vérifier le statut du bar depuis le premier événement
    const firstEvent = events[0];
    const barId = firstEvent.meta?.barId;
    if (!barId) return new Response(JSON.stringify({ error: 'barId manquant dans meta' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    const { data: bar } = await supabaseClient.from('bars').select('status').eq('id', barId).single();
    if (!bar) return new Response(JSON.stringify({ error: 'Bar non trouvé' }), { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (bar.status === 'suspended') return new Response(JSON.stringify({ error: 'Ce bar est suspendu', accepted: [], duplicates: [] }), { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (bar.status === 'readonly' || bar.status === 'expired') return new Response(JSON.stringify({ error: 'Abonnement expiré : écriture bloquée', accepted: [], duplicates: [] }), { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    const accepted: string[] = [];
    const duplicates: string[] = [];

    for (const event of events) {
      const clientUUID = event.clientUUID;
      if (!clientUUID) continue;

      // Vérifier l'idempotence via audit (le clientUUID est stocké dans details)
      const { data: existing } = await supabaseClient
        .from('audit')
        .select('id')
        .eq('details->>clientUUID', clientUUID)
        .single();

      if (existing) {
        duplicates.push(clientUUID);
        continue;
      }

      // Insérer selon le type d'événement
      switch (event.kind) {
        case 'ticket': {
          const { data: ticket } = await supabaseClient.from('tickets').insert({
            bar_id: barId, manager_id: event.managerId, device_id: deviceId,
            commercial_day: new Date(event.commercialDay), created_at: new Date(event.createdAt),
            total: event.total, cancelled: event.cancelled,
            suspect_hour: event.suspectHour ?? false,
          }).select('id').single();
          if (ticket) {
            accepted.push(clientUUID);
            // Insert lines
            if (event.lines) {
              await supabaseClient.from('ticket_lines').insert(
                event.lines.map((l: any) => ({ ticket_id: ticket.id, product_id: l.productId, product_name: l.productName, qty: l.qty, unit_price: l.unitPrice, promo_applied: l.promoApplied ?? false, line_total: l.lineTotal }))
              );
            }
            // Audit avec clientUUID pour idempotence
            await supabaseClient.from('audit').insert({
              actor_id: event.managerId, actor_role: 'manager', action: 'vente', target_kind: 'ticket', target_id: ticket.id,
              details: { clientUUID, total: event.total, lines_count: event.lines?.length ?? 0 }, device_id: deviceId,
            });
          }
          break;
        }
        case 'ravitaillement': {
          const { data: rav } = await supabaseClient.from('ravitaillements').insert({
            bar_id: barId, manager_id: event.managerId, device_id: deviceId,
            commercial_day: new Date(event.commercialDay), created_at: new Date(event.createdAt),
            validated_at: event.validatedAt ? new Date(event.validatedAt) : null,
            locked: event.locked ?? false, status: event.locked ? 'validated' : 'draft',
          }).select('id').single();
          if (rav) {
            accepted.push(clientUUID);
            if (event.lines) {
              await supabaseClient.from('ravitaillement_lines').insert(
                event.lines.map((l: any) => ({ ravitaillement_id: rav.id, product_id: l.productId, bottles_per_case: l.bottlesPerCase, casiers: l.casiers, bouteilles: l.bouteilles, buy_price_per_bottle: l.buyPricePerBottle }))
              );
            }
            await supabaseClient.from('audit').insert({
              actor_id: event.managerId, actor_role: 'manager', action: 'ravitaillement', target_kind: 'ravitaillement', target_id: rav.id,
              details: { clientUUID }, device_id: deviceId,
            });
          }
          break;
        }
        case 'correction': {
          const { data: corr } = await supabaseClient.from('corrections').insert({
            bar_id: barId, manager_id: event.managerId, device_id: deviceId,
            commercial_day: new Date(event.commercialDay), created_at: new Date(event.createdAt),
            source_ravitaillement_id: event.sourceRavitaillementId,
            product_id: event.productId, delta_casiers: event.deltaCasiers, delta_bouteilles: event.deltaBouteilles,
            buy_price_per_bottle: event.buyPricePerBottle, motif: event.motif,
          }).select('id').single();
          if (corr) {
            accepted.push(clientUUID);
            await supabaseClient.from('audit').insert({
              actor_id: event.managerId, actor_role: 'manager', action: 'correction', target_kind: 'correction', target_id: corr.id,
              details: { clientUUID, motif: event.motif }, device_id: deviceId,
            });
          }
          break;
        }
        case 'casse': {
          const { data: cass } = await supabaseClient.from('casses').insert({
            bar_id: barId, manager_id: event.managerId, device_id: deviceId,
            commercial_day: new Date(event.commercialDay), created_at: new Date(event.createdAt),
            product_id: event.productId, quantity: event.quantity, motif: event.motif, motif_detail: event.motifDetail,
          }).select('id').single();
          if (cass) {
            accepted.push(clientUUID);
            await supabaseClient.from('audit').insert({
              actor_id: event.managerId, actor_role: 'manager', action: 'casse', target_kind: 'casse', target_id: cass.id,
              details: { clientUUID, quantity: event.quantity }, device_id: deviceId,
            });
          }
          break;
        }
        case 'inventaire': {
          const { data: inv } = await supabaseClient.from('inventaires').insert({
            bar_id: barId, manager_id: event.managerId, device_id: deviceId,
            commercial_day: new Date(event.commercialDay), created_at: new Date(event.createdAt),
            is_passation: event.isPassation ?? false, passed: event.passed ?? false,
          }).select('id').single();
          if (inv) {
            accepted.push(clientUUID);
            if (event.counted) {
              await supabaseClient.from('inventaire_lines').insert(
                event.counted.map((c: any) => ({ inventaire_id: inv.id, product_id: c.productId, casiers: c.casiers, bouteilles: c.bouteilles }))
              );
            }
            await supabaseClient.from('audit').insert({
              actor_id: event.managerId, actor_role: 'manager', action: 'inventaire', target_kind: 'inventaire', target_id: inv.id,
              details: { clientUUID, passed: event.passed }, device_id: deviceId,
            });
          }
          break;
        }
        default:
          break;
      }
    }

    // Mettre à jour la dernière synchro du bar
    await supabaseClient.from('bars').update({ synced_at: new Date().toISOString() }).eq('id', barId);

    return new Response(JSON.stringify({ accepted, duplicates, total: events.length }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, accepted: [], duplicates: [] }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }
});

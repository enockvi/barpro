// ─── Edge Function: activate_link ─────────────────────────────────────────────
// Active un lien à usage unique.
// Vérifie : jeton valide, pas déjà utilisé, bar actif, pas expiré.
// Lie l'appareil au bar et au rôle.

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

    const { token, deviceId } = await req.json();
    if (!token || !deviceId) return new Response(JSON.stringify({ error: 'token et deviceId requis' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Trouver le lien
    const { data: link, error: linkErr } = await supabaseClient
      .from('links')
      .select('*, bars(id, status, type, trial_end, subscription_end, whatsapp_owner), owners(id, name), managers(id, name)')
      .eq('token', token)
      .single();

    if (linkErr || !link) return new Response(JSON.stringify({ error: 'Lien invalide' }), { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (link.status !== 'unused') return new Response(JSON.stringify({ error: 'Ce lien a déjà été utilisé' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (link.expires_at && new Date(link.expires_at) < new Date()) return new Response(JSON.stringify({ error: 'Ce lien a expiré' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (link.bars.status === 'suspended') return new Response(JSON.stringify({ error: 'Ce bar est suspendu' }), { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Mettre à jour le lien
    await supabaseClient.from('links')
      .update({ status: 'activated', device_id: deviceId, activated_at: new Date().toISOString() })
      .eq('id', link.id);

    // Activer ou créer l'appareil
    const existingDevice = await supabaseClient
      .from('devices')
      .select('id, role')
      .eq('bar_id', link.bar_id)
      .eq('device_id', deviceId)
      .eq('role', link.role)
      .single();

    let deviceRecord;
    if (existingDevice.data) {
      deviceRecord = existingDevice.data;
      if (existingDevice.data.revoked_at) {
        // Réactiver l'appareil révoqué
        await supabaseClient.from('devices').update({ revoked_at: null, last_synced: new Date().toISOString() }).eq('id', existingDevice.data.id);
      }
    } else {
      const { data: newDevice } = await supabaseClient
        .from('devices')
        .insert({ bar_id: link.bar_id, role: link.role, device_id: deviceId })
        .select('id')
        .single();
      deviceRecord = newDevice;
    }

    // Lier owner/manager si absent
    if (link.role === 'owner' && !link.owners?.id) {
      // Créer un owner si nécessaire
      const { data: newOwner } = await supabaseClient
        .from('owners')
        .insert({ bar_id: link.bar_id, name: link.bars.whatsapp_owner, whatsapp: link.bars.whatsapp_owner })
        .select('id')
        .single();
      if (newOwner) {
        await supabaseClient.from('links').update({ owner_id: newOwner.id }).eq('id', link.id);
      }
    }

    if (link.role === 'manager' && !link.managers?.id) {
      const { data: newManager } = await supabaseClient
        .from('managers')
        .insert({ bar_id: link.bar_id, name: 'Gérant' })
        .select('id')
        .single();
      if (newManager) {
        await supabaseClient.from('links').update({ manager_id: newManager.id }).eq('id', link.id);
        await supabaseClient.from('managers').update({ id: newManager.id }).eq('id', newManager.id);
      }
    }

    // Logger
    await supabaseClient.from('audit').insert({
      actor_id: deviceId,
      actor_role: link.role,
      action: 'activate_link',
      target_kind: 'link',
      target_id: link.id,
      details: { bar_id: link.bar_id, device_id: deviceId },
    });

    return new Response(JSON.stringify({
      success: true,
      device_id: deviceRecord.id,
      bar_status: link.bars.status,
      trial_end: link.bars.trial_end,
      subscription_end: link.bars.subscription_end,
    }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }
});

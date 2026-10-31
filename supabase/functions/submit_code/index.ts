// ─── Edge Function: submit_code ────────────────────────────────────────────────
// Vérifie un code d'abonnement, active ou prolonge l'abonnement.
// Blocage après 5 erreurs consécutives pendant 15 minutes.

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

    const { code, barId, deviceId } = await req.json();
    if (!code || !barId || !deviceId) return new Response(JSON.stringify({ error: 'code, barId et deviceId requis' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Vérifier le blocage
    const { data: lockout } = await supabaseClient
      .from('audit')
      .select('created_at')
      .eq('actor_id', deviceId)
      .eq('action', 'code_failed')
      .eq('details->>bar_id', barId)
      .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(6);

    if (lockout && lockout.length >= 5) {
      const lastFailure = new Date(lockout[0].created_at);
      const remainingMs = 15 * 60 * 1000 - (Date.now() - lastFailure.getTime());
      const remainingMin = Math.ceil(remainingMs / 60000);
      return new Response(JSON.stringify({ error: `Trop de codes faux. Réessayez dans ${remainingMin} minute(s).` }), { status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    }

    // Trouver le code
    const { data: codeRecord, error: codeErr } = await supabaseClient
      .from('codes_abonnement')
      .select('*, bars(id, status)')
      .eq('code', code.toUpperCase())
      .single();

    if (codeErr || !codeRecord) {
      await supabaseClient.from('audit').insert({ actor_id: deviceId, actor_role: 'owner', action: 'code_failed', target_kind: 'code', target_id: null, details: { bar_id: barId, device_id: deviceId }, device_id: deviceId });
      return new Response(JSON.stringify({ error: 'Code invalide' }), { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    }

    if (codeRecord.status !== 'generated') return new Response(JSON.stringify({ error: 'Ce code a déjà été utilisé' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (codeRecord.expires_at && new Date(codeRecord.expires_at) < new Date()) return new Response(JSON.stringify({ error: 'Ce code a expiré' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Activer le code
    const newEnd = new Date(Date.now() + codeRecord.duration_months * 30 * 24 * 60 * 60 * 1000);
    await supabaseClient.from('codes_abonnement')
      .update({ status: 'used', bar_id: barId, owner_id: null, used_at: new Date().toISOString() })
      .eq('id', codeRecord.id);

    // Prolonger le bar
    await supabaseClient.from('bars')
      .update({ subscription_end: newEnd.toISOString(), status: 'normal' })
      .eq('id', barId);

    // Logger
    await supabaseClient.from('audit').insert({
      actor_id: deviceId, actor_role: 'owner', action: 'code_used', target_kind: 'code', target_id: codeRecord.id,
      details: { bar_id: barId, duration_months: codeRecord.duration_months, new_end: newEnd.toISOString() }, device_id: deviceId,
    });

    return new Response(JSON.stringify({ success: true, subscription_end: newEnd.toISOString() }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }
});

// ─── Edge Function: start_trial ────────────────────────────────────────────────
// Démarre un essai gratuit de 7 jours pour un bar.
// Un bar ne bénéficie d'un essai qu'une seule fois.

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

    const { barId, deviceId } = await req.json();
    if (!barId || !deviceId) return new Response(JSON.stringify({ error: 'barId et deviceId requis' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Vérifier que le bar n'a pas déjà eu un essai
    const { data: bar } = await supabaseClient.from('bars').select('id, trial_start, status').eq('id', barId).single();
    if (!bar) return new Response(JSON.stringify({ error: 'Bar non trouvé' }), { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (bar.trial_start) return new Response(JSON.stringify({ error: 'Ce bar a déjà bénéficié d\'un essai' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (bar.status === 'suspended') return new Response(JSON.stringify({ error: 'Ce bar est suspendu' }), { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await supabaseClient.from('bars')
      .update({ trial_start: now.toISOString(), trial_end: trialEnd.toISOString(), status: 'trial' })
      .eq('id', barId);

    await supabaseClient.from('audit').insert({
      actor_id: deviceId, actor_role: 'owner', action: 'start_trial', target_kind: 'bar', target_id: barId,
      details: { trial_end: trialEnd.toISOString() }, device_id: deviceId,
    });

    return new Response(JSON.stringify({ success: true, trial_end: trialEnd.toISOString() }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }
});

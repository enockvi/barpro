// ─── Edge Function: generate_link ─────────────────────────────────────────────
// Génère un lien à usage unique pour un bar.
// Seul le PDG peut appeler cette fonction.
// Le lien expire après 30 jours si non utilisé.

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

    // Vérifier que c'est le PDG
    const { data: { user }, error: authErr } = await supabaseClient.auth.getUser();
    if (authErr || !user) throw new Error('Non authentifié');

    const role = user.user_metadata?.role;
    if (role !== 'pdg') return new Response(JSON.stringify({ error: 'Accès refusé : seul le PDG peut générer des liens' }), { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Récupérer les paramètres
    const { barId, linkRole } = await req.json();
    if (!barId || !linkRole) return new Response(JSON.stringify({ error: 'barId et linkRole requis' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    if (!['owner', 'manager'].includes(linkRole)) return new Response(JSON.stringify({ error: 'linkRole doit être owner ou manager' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Vérifier que le bar existe et n'est pas suspendu
    const { data: bar, error: barErr } = await supabaseClient.from('bars').select('id, status').eq('id', barId).single();
    if (barErr || !bar) return new Response(JSON.stringify({ error: 'Bar non trouvé' }), { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    if (bar.status === 'suspended') return new Response(JSON.stringify({ error: 'Ce bar est suspendu' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    // Générer un jeton unique de 32 caractères
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let token = '';
    for (let i = 0; i < 32; i++) token += chars[Math.floor(Math.random() * chars.length)];

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Insérer le lien
    const { data: link, error: insertErr } = await supabaseClient
      .from('links')
      .insert({ bar_id: barId, token, role: linkRole, expires_at: expiresAt })
      .select('id, token, role, expires_at')
      .single();

    if (insertErr) throw insertErr;

    // Logger dans l'audit
    await supabaseClient.from('audit').insert({
      actor_id: user.id,
      actor_role: 'pdg',
      action: 'generate_link',
      target_kind: 'link',
      target_id: link.id,
      details: { bar_id: barId, link_role: linkRole, expires_at: expiresAt },
    });

    return new Response(JSON.stringify({ link }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }
});

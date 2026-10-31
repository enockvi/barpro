// ─── Edge Function: reference_time ─────────────────────────────────────────────
// Retourne l'heure serveur comme référence. Permet de contrôler les écarts
// d'horloge des appareils clients.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  const now = Date.now();
  return new Response(JSON.stringify({ serverTime: now, iso: new Date(now).toISOString() }), {
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});

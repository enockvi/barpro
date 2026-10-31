// ─── Configuration BarPro ──────────────────────────────────────────────────────
// Les variables d'environnement sont injectées par Vite au build.
// En développement sans variables, l'app utilise le mode local (Dexie uniquement).

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/** Retourne true si Supabase est configuré */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}

/** URL de base des Edge Functions */
export function edgeFunctionUrl(name: string): string {
  return `${supabaseUrl}/functions/v1/${name}`;
}

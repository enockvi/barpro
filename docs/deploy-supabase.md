# Déploiement Supabase — BarPro

## Prérequis
- Compte Supabase sur https://supabase.com
- CLI Supabase installée : npm install -g supabase

## Étapes

### 1. Créer le projet
Dashboard → New project → remplir nom, mot de passe DB, région (Paris/Frankfurt)

### 2. Récupérer les identifiants
Settings → API → copier Project URL et anon/public key

### 3. Appliquer les migrations
Dans le SQL Editor du dashboard, exécuter dans l'ordre :
- supabase/migrations/001_initial_schema.sql
- supabase/migrations/002_rls_policies.sql
- supabase/migrations/003_manager_views.sql
- supabase/migrations/004_triggers_add_only.sql

### 4. Déployer les Edge Functions
supabase functions deploy sync_events --project-ref <your-project-ref>
supabase functions deploy activate_link --project-ref <your-project-ref>
supabase functions deploy generate_link --project-ref <your-project-ref>
supabase functions deploy submit_code --project-ref <your-project-ref>
supabase functions deploy start_trial --project-ref <your-project-ref>
supabase functions deploy reference_time --project-ref <your-project-ref>

### 5. Configurer la PWA
cd pwa && cp .env.example .env.local
Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run build

### 6. Tester
npm run preview puis ouvrir http://localhost:4173

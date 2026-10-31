# Supabase — BarPro Server

Ce dossier contient les migrations SQL, politiques RLS, vues manager et fonctions Edge pour le serveur BarPro.

## Structure

```
supabase/
  migrations/
    001_initial_schema.sql    — Toutes les tables (bars, owners, managers, devices, links,
                                products, tickets, ravitaillements, corrections, casses,
                                inventaires, codes_abonnement, audit)
    002_rls_policies.sql      — Politiques Row Level Security par rôle (pdg, manager, owner)
    003_manager_views.sql     — Vues dédiées au gérant (sans colonnes financières)
    004_triggers_add_only.sql — Triggers bloquant UPDATE/DELETE sur les tables d'événements
  functions/
    generate_link/            — Génère un lien à usage unique (PDG uniquement)
    activate_link/            — Active un lien, lie l'appareil
    submit_code/              — Vérifie un code d'abonnement, bloque après 5 erreurs
    start_trial/              — Démarre l'essai 7 jours (un bar = un essai)
    sync_events/              — Reçoit un lot d'événements, idempotent par clientUUID
    reference_time/           — Retourne l'heure serveur
  tests/
    security_tests.sql        — Tests prouvant les règles de sécurité
```

## Règles de sécurité implémentées

1. **Le gérant ne voit JAMAIS bénéfice, marge, valeur de caisse** — les vues `*_manager` retirent toutes les colonnes financières
2. **Le propriétaire ne peut PAS écrire vente, ravitaillement, casse ni prix** — seules les policies SELECT existent pour owner
3. **La casse n'a aucun champ de décision** — pas de colonne `decision`, valorisation automatique
4. **Ajout seul** — triggers `BEFORE UPDATE OR DELETE` bloquent toute modification des lignes d'événements
5. **Lien à usage unique** — fonction `activate_link` rejette les liens déjà utilisés ou expirés
6. **Code à 5 erreurs max** — blocage 15 minutes après 5 saisies falses
7. **Synchronisation idempotente** — `sync_events` utilise `clientUUID` stocké dans l'audit pour détecter les doublons

## Déploiement

```bash
# Appliquer les migrations
supabase db push --db-url $SUPABASE_URL

# Déployer les fonctions edge
supabase functions deploy generate_link --project-ref your-project
supabase functions deploy activate_link --project-ref your-project
supabase functions deploy submit_code --project-ref your-project
supabase functions deploy start_trial --project-ref your-project
supabase functions deploy sync_events --project-ref your-project
supabase functions deploy reference_time --project-ref your-project

# Lancer les tests de sécurité
psql $SUPABASE_URL -f tests/security_tests.sql
```

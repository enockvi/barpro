# BarPro

Application PWA de gestion de bar et buvette au Bénin.

## Structure

```
barpro/
  core/      → logique métier TypeScript pure (fonctions pures, tests Vitest)
  pwa/       → App Propriétaire + App Gérant (React + Vite + Tailwind + PWA)
  console/   → Console PDG (React + Vite + Tailwind)
  supabase/  → migrations SQL, règles d'accès, fonctions serveur
  design/    → charte graphique + maquettes HTML
  docs/      → cahier des charges V4
```

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer toutes les apps en parallèle
npm run dev

# Ou une seule :
npm run dev:pwa     # http://localhost:5173
npm run dev:console # http://localhost:5174

# Construire
npm run build

# Tester
npm run test
```

## Règles importantes

- Voir `.clinerules` pour les règles permanentes du projet.
- Voir `docs/cahier-v4.md` pour le cahier des charges V4 (source de vérité métier).
- Voir `design/` pour la charte graphique et les maquettes HTML.
- Le gérant ne voit jamais de données financières (bénéfice, marge, valeur de casse).

# Procédure de test T14 — iPhone & Android entrée de gamme

## Prérequis

- Un compte Supabase avec les 6 Edge Functions déployées
- Variables d\'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` définies
- Application construite en mode production (`npm run build`)

---

## Test 1 — Installation sur iPhone (Safari)

1. Ouvrir `https://votre-domaine.barpro.app` dans Safari
2. Appuyer sur le bouton Partager (carré avec flèche vers le haut)
3. Choisir **"Sur l\'écran d\'accueil"** → confirmer
4. L\'icône BarPro apparaît sur l\'écran d\'accueil
5. Lancer l\'appli : elle s\'ouvre en mode standalone (pas de barre Safari)

**Résultat attendu :** L\'application s\'installe et se lance comme une vraie app native.

---

## Test 2 — Installation sur Android (Chrome)

1. Ouvrir `https://votre-domaine.barpro.app` dans Chrome
2. Appuyer sur le menu (⋮) → **"Installer l\'application"**
3. Confirmer l\'installation
4. L\'icône BarPro apparaît dans le tiroir d\'applications
5. Lancer l\'appli

**Résultat attendu :** Même comportement qu\'sur iPhone.

---

## Test 3 — Code de liaison (propriétaire)

1. Le PDG génère un lien depuis la Console BarPro
2. Le propriétaire reçoit le lien par WhatsApp
3. Il clique sur le lien → ouvre dans Safari/Chrome
4. L\'appli détecte le token dans l\'URL et appelle `activate_link`
5. L\'appareil est lié au bar, l\'essai de 7 jours démarre (ou l\'abonnement est activé)
6. Le propriétaire voit le message "Bienvenue propriétaire !" avec la date de fin

**Cas critique :** Cliquer sur le même lien deux fois → erreur "Ce lien a déjà été utilisé".

---

## Test 4 — Code de liaison (gérant)

1. Le propriétaire génère un lien gérant depuis l\'appli
2. Le gérant clique → s\'ouvre dans Chrome/Safari
3. L\'appli détecte le token, appelle `activate_link` avec rôle `manager`
4. Le gérant voit "Bienvenue gérant !"

---

## Test 5 — Saisie de code d\'abonnement

1. Le propriétaire clique sur "J\'ai un code"
2. Il saisit le code reçu par WhatsApp (ex: `ABCD1234EFGH`)
3. L\'appli appelle `submit_code` → active ou prolonge l\'abonnement
4. La date de fin s\'affiche dans l\'écran d\'accueil

**Cas critique :** 5 codes faux consécutifs → blocage 15 minutes.

---

## Test 6 — Essai gratuit de 7 jours

1. Le propriétaire clique sur "Essayez gratuitement"
2. L\'appli appelle `start_trial` → 7 jours démarrent côté serveur
3. L\'essai est lié au bar, pas à l\'appareil
4. Réinstaller l\'appli ne redonne pas d\'essai

---

## Test 7 — Vente hors-ligne + synchronisation

1. Passer en mode avion (couper le Wi-Fi)
2. Faire 10 ventes dans l\'appli → chaque ticket est stocké localement
3. L\'indicateur montre "10 en attente"
4. Réactiver le Wi-Fi
5. L\'application détecte le retour en ligne, appelle `sync_events`
6. L\'indicateur passe à "Synchronisé · HH:MM"
7. Vérifier dans la console Supabase que les 10 tickets sont présents

**Cas critique :** Faire 50 tickets hors-ligne, synchroniser, vérifier qu\'il n\'y a pas de doublons.

---

## Test 8 — Droits financiers

1. Se connecter en tant que gérant
2. Vérifier qu\'aucun montant de `buyPricePerCase`, `marge` ou `bénéfice` n\'apparaît
3. Vérifier que la vue `products_manager` ne contient pas `buy_price_per_case`
4. Se connecter en tant que propriétaire
5. Vérifier qu\'il peut voir les prix mais pas écrire de vente/ravitaillement/casse

---

## Test 9 — Abonnement expiré

1. Simuler une expiration du bar (modifier `subscription_end` dans Supabase)
2. Le propriétaire ouvre l\'appli
3. Bandeau rouge s\'affiche : "Votre abonnement est expiré. Contactez BarPro."
4. Les actions d\'écriture sont bloquées (lecture seule)

---

## Commandes de build

```bash
# Builder avec configuration Supabase
cd /workspaces/barpro/pwa
export VITE_SUPABASE_URL="https://xxxx.supabase.co"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
npm run build
npm run preview

# Builder en mode local (sans Supabase)
npm run build
npm run preview
```

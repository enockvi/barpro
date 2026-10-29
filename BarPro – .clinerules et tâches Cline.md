# BarPro – .clinerules et tâches Cline

Ce document contient le fichier de règles permanent à donner à Cline, puis les tâches à lui confier une par une, dans l'ordre, chacune avec son prompt prêt à coller.

## 1. Mise en place du dépôt

Crée cette structure dans ton Codespace avant la première tâche :

```text
barpro/
  .clinerules              règles permanentes (section 2)
  docs/cahier-v4.md        le cahier des charges V4 (source de vérité)
  design/                  charte graphique (.md) + toutes les maquettes HTML faites avec Claude
  core/                    logique métier en TypeScript pur + tests Vitest
  pwa/                     App Propriétaire et App Gérant (une seule PWA, deux interfaces)
  console/                 Console PDG (application séparée)
  supabase/                migrations SQL, règles d'accès, fonctions serveur
```

Noms des maquettes attendus dans `design/` : console-barpro-bars.html, console-barpro-codes.html, proprietaire-acces.html, proprietaire-accueil.html, proprietaire-ventes.html, proprietaire-stock.html, proprietaire-inventaire.html, proprietaire-statistiques.html, proprietaire-profil.html, gerant-acces.html, gerant-vente.html, gerant-tickets.html, gerant-stock.html, gerant-ravitaillement.html, gerant-casse.html, gerant-inventaire.html, gerant-statistiques.html.

## 2. Fichier .clinerules (à la racine du dépôt)

```text
# BarPro – Règles permanentes pour Cline

## Projet
BarPro est une PWA de gestion de bar et de buvette au Bénin, vendue par abonnement. Trois applications : Console BarPro (PDG, dossier console/), App Propriétaire et App Gérant (dossier pwa/, une seule PWA, deux interfaces selon le rôle). La logique métier vit dans core/.

## Sources de vérité (à lire avant chaque tâche)
1. docs/cahier-v4.md : règles métier. En cas de doute, il l'emporte.
2. design/ : charte graphique et maquettes HTML. Les écrans doivent leur ressembler fidèlement.
3. Si deux sources se contredisent ou si une règle manque, pose la question avant de coder. N'invente pas de règle métier.

## Méthode de travail
- Commence chaque tâche par un plan court : fichiers touchés, ordre, tests. Attends mon accord avant d'agir.
- Une tâche à la fois. Ne sors pas du périmètre demandé. Ne refactorise pas ce qui n'est pas concerné.
- Pour core/ : écris les tests d'abord, puis le code.
- N'ajoute aucune dépendance sans me le demander et sans dire pourquoi. Ne modifie jamais docs/ ni design/.
- À la fin : lance les tests et le build, liste ce qui est fait et ce qui reste, propose un message de commit.

## Technique
- TypeScript strict, pas de any. React + Vite + Tailwind. IndexedDB via Dexie. Service worker via vite-plugin-pwa (Workbox). Tests avec Vitest. PDF avec pdfmake. Graphiques avec Chart.js.
- Code, noms de variables et de fichiers en anglais. Textes d'interface et commentaires en français simple.
- Argent : toujours des entiers en F CFA (pas de décimales, jamais de flottants). Affichage : 1 000 F.
- Dates : stockées en UTC, affichées en Africa/Porto-Novo (UTC+1). La journée commerciale va de 4 h 00 à 3 h 59, calculée par une fonction pure dans core/.
- core/ n'importe ni React, ni le DOM, ni Dexie : fonctions pures et testables.

## Architecture des données
- Tout passe par une interface dataService. Les écrans n'accèdent jamais directement à la base. Implémentation locale d'abord (Dexie), serveur (Supabase) ensuite, sans toucher aux écrans.
- Modèle par événements : chaque vente, ravitaillement, correction, casse et inventaire est une ligne AJOUTÉE. Aucune mise à jour ni suppression des lignes d'événements. Le stock est calculé en bouteilles à partir d'elles et affiché « X casiers + Y bouteilles ».
- Chaque action crée un UUID côté client : un envoi répété ne crée jamais de doublon. Les actions hors-ligne vont dans une file de synchronisation.

## Règles métier non négociables
1. Seul le GÉRANT vend, modifie ses tickets pendant 1 h (puis verrou définitif pour tous), ravitaille, propose les corrections de ravitaillement validé, déclare la casse et fixe prix, promotions et fiches produit.
2. Le PROPRIÉTAIRE ne vend jamais, ne ravitaille jamais, ne déclare jamais de casse, ne modifie jamais un prix. Il consulte, fait l'inventaire sur son téléphone, reçoit rapports et alertes, gère profil, lien et changement de gérant, abonnement et annexes.
3. Le gérant ne reçoit jamais bénéfice, marge, valeur de casse ni rapport financier. Utilise des types séparés (par exemple ManagerProduct sans champs de marge) pour que ces champs n'existent pas dans les données du gérant.
4. Il n'existe ni « somme à verser » ni « bénéfice après casse ». Le propriétaire voit bénéfice brut et casse séparément.
5. Vente à la bouteille uniquement. Promo « N bouteilles pour X F » : total = floor(q/N) × X + (q mod N) × prix unitaire.
6. Stock théorique = dernier inventaire + ravitaillements validés (corrections comprises) − ventes − casse. Écart = compté − théorique, produit par produit, sans compensation. Le stock compté devient la nouvelle référence.
7. Inventaire en aveugle : le stock théorique n'est jamais affiché pendant le comptage ; toute boisson doit être comptée (0 explicite).
8. Ravitaillement validé = verrouillé. Correction par une nouvelle ligne avec motif obligatoire, proposée par le gérant, signalée au propriétaire. La casse n'a aucun champ de décision et est valorisée automatiquement au coût moyen pondéré.
9. Seuil d'alerte = 1 casier par défaut. Vert, jaune (pulsation douce), rouge non cliquable : toujours avec icône et texte.
10. Le délai d'1 h d'un ticket utilise l'heure serveur en ligne et un chronomètre monotone hors-ligne. Un retour d'horloge ou un écart de plus de 5 minutes marque le ticket « heure suspecte ».
11. Un lien est à usage unique, lié à la buvette et au premier appareil ; sa validité suit le statut du bar (normal, lecture seule, suspendu).

## Interface
- Appliquer la charte de design/ : Forêt #0B3322, Citron #8BFA5A, Sous-bois #1F5C3F, Papier #F5F8F3, Alerte #F5B841, Erreur #FF6B5B, Neutre #5E7266 ; Inter et JetBrains Mono (montants, codes, heures) ; rayons 8, 14, 24, 999 ; boutons en capsule ; icônes trait 1,75 px ; mode clair et sombre ; jamais de dégradé.
- Mobile d'abord, cibles tactiles d'au moins 48 px, prefers-reduced-motion respecté, photos WebP sous 60 Ko, fluide sur Android d'entrée de gamme.
- Toute action définitive demande une confirmation. Messages d'erreur en français simple. Ton : direct, chaleureux, précis.

## Interdits
- Pas de localStorage pour les données métier (IndexedDB uniquement).
- Pas de suppression définitive de transactions.
- Pas de données financières dans les écrans ou les requêtes du gérant.
- Pas de secret ni de clé API dans le code : variables d'environnement.
```

## 3. Règles d'or pour travailler avec Cline

- Une tâche = une nouvelle conversation Cline. Cela garde le contexte léger et réduit la consommation de jetons.
- Toujours : plan d'abord, lecture du plan, accord, puis action.
- Un commit Git après chaque tâche validée. Une branche par tâche si tu veux pouvoir revenir en arrière facilement.
- Garde la validation automatique des commandes de terminal désactivée : lis ce que Cline lance.
- Si Cline s'écarte du cahier, réponds : « Relis docs/cahier-v4.md, section X, et corrige. »
- Après chaque tâche, ouvre l'app et teste à la main sur ton téléphone (port public du Codespace).

## 4. Les tâches, dans l'ordre

### T0 – Initialisation du projet

```text
Lis .clinerules et docs/cahier-v4.md (sections 1, 2 et 19). Initialise le dépôt en espaces de travail npm avec les dossiers core/, pwa/ et console/. Dans pwa/ et console/ : Vite + React + TypeScript strict, Tailwind, vite-plugin-pwa, Vitest. Dans core/ : TypeScript pur et Vitest. Configure ESLint, un alias d'import vers core/, les scripts dev, build, test et preview à la racine. Ajoute un README court qui explique comment lancer chaque application. Rien d'autre : pas d'écran métier.
```

**Validation :** `npm run test`, `npm run build` et `npm run dev` fonctionnent sans erreur.

### T1 – Charte graphique et composants de base

```text
Lis .clinerules et la charte dans design/. Dans pwa/ puis partagé avec console/, crée le thème Tailwind (couleurs, polices Inter et JetBrains Mono, rayons, ombres douces, échelle d'espacements de 4 et 8) avec mode clair et sombre (fond sombre #06231A, cartes #0B3322). Crée les composants : Button (capsule), Input, Badge (En stock, Nouveau, Stock bas, Rupture), Card, SegmentedControl, TabBar, StatCard, Money (format 1 000 F en JetBrains Mono), Logo en SVG, icônes lucide-react avec trait 1,75. Ajoute une page /styleguide qui montre tous les composants dans les deux modes. Aucun écran métier.
```

**Validation :** la page `/styleguide` correspond à la charte, en clair et en sombre.

### T2 – Logique métier dans core/ (avec tests)

```text
Lis .clinerules et docs/cahier-v4.md (sections 6, 7, 8, 9, 10, 12). Dans core/, écris d'abord les tests Vitest, puis les fonctions pures : formatage des montants en F CFA ; calcul d'une ligne avec promo ; conversion bouteilles vers casiers + bouteilles et inverse ; journée commerciale (4 h 00 à 3 h 59, Africa/Porto-Novo) ; statut de stock (vert, jaune, rouge) selon le seuil ; coût moyen pondéré ; stock théorique à partir d'une liste d'événements ; écart d'inventaire par produit ; valeur des manquants, des surplus et de la casse ; règle de verrouillage d'un ticket à 1 h ; alerte de cohérence (plus de 90 % de lignes sans écart). Cas de test obligatoires : 4 bouteilles à 400 F avec promo 3 pour 1 000 F = 1 400 F ; vente à 3 h 30 comptée dans la journée de la veille ; ticket modifiable à 59 min et verrouillé à 61 min ; 12 bouteilles à 700 F puis 12 à 800 F donnent un coût moyen de 750 F ; dernier inventaire 24, ravitaillé 12, vendu 30, cassé 1 donne un théorique de 5 et, pour un compté de 3, un écart de −2. Aucune dépendance à React ni au DOM.
```

**Validation :** tous les tests de `core/` passent, y compris les cinq cas obligatoires.

### T3 – Événements et couche de données locale

```text
Lis .clinerules et docs/cahier-v4.md (section 16). Dans pwa/, définis l'interface dataService et son implémentation locale avec Dexie : tables d'événements en ajout seul (tickets et versions, ravitaillements et lignes, corrections, casses, inventaires), produits, appareil, rôle. Chaque action a un UUID client et un identifiant d'appareil. Le stock est calculé via core/. Crée la file de synchronisation (actions en attente, envoi idempotent) avec un faux serveur de test. Crée des types séparés pour le gérant et le propriétaire : le gérant n'a aucun champ de marge, bénéfice, valeur de casse. Ajoute un journal d'audit en ajout seul. Écris des tests : doublon refusé, stock recalculé, 50 actions hors-ligne synchronisées sans doublon.
```

**Validation :** les tests passent et le gérant n'a aucun champ financier dans ses types.

### T4 – Catalogue, fiches produit et import des images Drive

```text
Lis .clinerules, docs/cahier-v4.md (sections 7 et 8) et design/gerant-stock.html. Crée les fiches produit : nom, photo, catégorie, format, bouteilles par casier (obligatoire), prix d'achat par casier, prix de vente, promo, seuil d'alerte, actif ou inactif. Seul le rôle gérant peut les modifier ; chaque changement de prix écrit une ligne d'audit et une alerte pour le propriétaire. Crée un script Google Apps Script dans supabase/../scripts/drive-catalogue.gs qui liste un dossier Drive (sous-dossiers = catégories, nom du fichier = nom de la boisson, format déduit s'il finit par un nombre suivi de cl, ml ou L) et renvoie les images en base64. Crée l'écran d'import : téléchargement, redimensionnement à 400 px, WebP sous 60 Ko, stockage IndexedDB, aucun doublon (clé = id du fichier Drive), progression. Sans URL de script, utilise 12 boissons d'exemple. Un produit sans prix de vente affiche « Prix à renseigner » et n'est pas vendable.
```

**Validation :** l'import crée les fiches, relancer l'import ne crée pas de doublons.

### T5 – Vente (POS) et tickets

```text
Lis .clinerules, docs/cahier-v4.md (sections 6 et 7.3) et design/gerant-vente.html et design/gerant-tickets.html. Construis l'écran Vente du gérant et la liste des tickets avec leur détail : grille de cartes, panier, total avec promo (mention « Promo appliquée »), états vert, jaune et rouge, limite au stock restant, enregistrement du ticket, bouton Annuler juste après la vente, modification pendant 1 h avec compte à rebours et versions conservées, verrou définitif après 1 h, chronomètre monotone hors-ligne, marque « heure suspecte » à la synchronisation. Le propriétaire a seulement une vue en lecture seule des tickets. Utilise core/ pour tous les calculs. Ajoute des tests des composants clés.
```

**Validation :** les cinq règles du cahier (promo, 1 h, couleurs, stock maximum, verrou) se vérifient à la main.

### T6 – Stock et pénurie

```text
Lis .clinerules, docs/cahier-v4.md (section 7), design/gerant-stock.html et design/proprietaire-stock.html. Construis les onglets Stock et Pénurie : bandes par boisson (Acheté, Vendu, Cassé, Reste en casiers + bouteilles), sélecteur de période, fiche détail. Le gérant a le bouton Ravitailler et le partage WhatsApp de la liste de pénurie. Le propriétaire est en consultation et voit en plus marge brute par bouteille et bénéfice brut dans la fiche détail. Pendant un inventaire en cours, les quantités sont masquées chez le gérant (couleurs seulement). Badge de pénurie sur l'onglet.
```

**Validation :** le gérant ne voit aucune marge, le propriétaire la voit.

### T7 – Ravitaillement

```text
Lis .clinerules, docs/cahier-v4.md (section 8) et design/gerant-ravitaillement.html. Construis le ravitaillement du gérant : brouillon, saisie casiers et bouteilles avec prix d'achat par casier, récapitulatif avec le message rouge de vérification, case « J'ai vérifié la liste », validation définitive qui verrouille et fige les prix, recalcul du coût moyen pondéré. Correction : écriture ajoutée par le gérant avec motif obligatoire, mention « Correction », alerte au propriétaire, ligne d'origine jamais modifiée. Liste du jour avec sélecteur de date, PDF généré sur l'appareil (pdfmake) et message WhatsApp pré-écrit. Le propriétaire voit la liste en lecture seule.
```

**Validation :** après validation, aucune ligne n'est modifiable ; la correction crée une nouvelle ligne.

### T8 – Casse

```text
Lis .clinerules, docs/cahier-v4.md (section 9) et design/gerant-casse.html. Construis la déclaration de casse du gérant : boisson, quantité, motif (Cassée, Défaillante, Périmée, Autre avec texte), photo facultative, baisse immédiate du stock, aucune annulation possible, liste sans montants. Aucun champ de décision. Valorisation automatique au coût moyen pondéré visible seulement côté propriétaire, avec l'alerte « Casse déclarée » et la mise en évidence d'une casse inhabituelle.
```

**Validation :** le gérant ne voit aucun montant de casse.

### T9 – Inventaire, rapports et changement de gérant

```text
Lis .clinerules, docs/cahier-v4.md (sections 10 et 11), design/gerant-inventaire.html, design/proprietaire-inventaire.html et design/proprietaire-profil.html. Construis l'inventaire en aveugle (gérant et propriétaire) : refus s'il reste un ravitaillement en brouillon, un seul inventaire à la fois, brouillon repris, toutes les boissons obligatoires, récapitulatif, validation définitive. Fin gérant : message simple et liste du stock compté en PDF. Côté propriétaire : rapport détaillé, rapport financier (sans somme à verser, sans bénéfice après casse), message généré avec variantes, lecture vocale (Web Speech API, français) avec « Écouter » et « Réécouter », alerte de cohérence, PDF, historique. Premier inventaire = stock de départ. Ajoute le nouveau gérant, cas A et cas B, avec inventaire de passation et POS verrouillé tant qu'il n'est pas validé.
```

**Validation :** le gérant ne voit ni écart ni montant ; le rapport suit la formule du cahier.

### T10 – Interface propriétaire

```text
Lis .clinerules, docs/cahier-v4.md (sections 12, 13 et 14) et les maquettes design/proprietaire-accueil.html, proprietaire-ventes.html, proprietaire-statistiques.html, proprietaire-profil.html. Construis l'accueil (cartes du jour, alertes, dernière synchronisation, liste de ravitaillement du jour), l'onglet Ventes (cartes par journée commerciale, détail, export PDF et WhatsApp, rapport provisoire jusqu'à 5 h 00), les statistiques (classement, détail, bénéfice brut, comparaison, courbe, PDF), le profil complet (infos du bar, lien du gérant, appareils, abonnement, annexes et sélecteur de bar, produits et prix en consultation, journal d'audit filtrable, PIN, sauvegarde PDF et CSV, mode clair ou sombre, aide). Statistiques du gérant limitées aux quantités.
```

**Validation :** aucune ligne « bénéfice après casse » nulle part ; le propriétaire ne peut rien saisir de vente.

### T11 – Accès, abonnement et Console PDG

```text
Lis .clinerules, docs/cahier-v4.md (sections 3, 4 et 5) et les maquettes proprietaire-acces.html, gerant-acces.html, console-barpro-bars.html, console-barpro-codes.html. Construis les écrans d'accès (bienvenue, installation Android et iPhone, code de liaison, essai de 7 jours ou code, PIN facultatif, états du bar : normal, bande des 3 jours, lecture seule, suspendu) et la Console PDG dans console/ (connexion avec double vérification, liste des bars, création avec lien et message WhatsApp, renvoi de lien, suspension, prolongation avec motif, changement du WhatsApp, bar démo, génération et suivi des codes, journal, paramètres). Derrière dataService avec données simulées : le vrai serveur vient à la tâche T13.
```

**Validation :** tous les états du bar s'affichent correctement dans les deux applications.

### T12 – PWA, hors-ligne et mises à jour

```text
Lis .clinerules et docs/cahier-v4.md (sections 16, 18 et 19). Finalise la PWA : manifest avec les couleurs de la charte, service worker avec mise en cache des écrans et des images, mise à jour du service worker sans casser la file hors-ligne, indicateur permanent « Synchronisé » ou « X actions en attente », bandeau hors-ligne, alerte « Stock négatif : à vérifier ». Écris le scénario de test : 50 tickets sans réseau, puis synchronisation sans doublon. Explique comment tester avec npm run build puis npm run preview.
```

**Validation :** l'app s'installe, fonctionne en mode avion et se synchronise au retour du réseau.

### T13 – Serveur Supabase

```text
Lis .clinerules et docs/cahier-v4.md (sections 3, 4, 5, 16 et 17). Dans supabase/, écris les migrations SQL : bars, propriétaires, gérants, appareils, liens, produits, tickets et versions, ravitaillements et corrections, casses (sans champ de décision), inventaires, codes d'abonnement, journal d'audit. Journal et événements en ajout seul (triggers qui interdisent update et delete). Politiques d'accès par rôle (RLS) et vues dédiées au gérant sans colonne financière. Fonctions serveur : génération et activation d'un lien à usage unique lié à la buvette, code de liaison, essai de 7 jours côté serveur, saisie de code avec blocage après 5 erreurs, expiration, heure de référence, réception de lots de synchronisation idempotents. Ajoute des tests SQL qui prouvent que le gérant ne peut lire aucune marge ni aucun bénéfice et que le propriétaire ne peut écrire ni vente, ni ravitaillement, ni casse, ni prix.
```

**Validation :** les tests de droits passent ; un lien déjà utilisé est refusé.

### T14 – Branchement du serveur et tests réels

```text
Lis .clinerules. Crée supabaseDataService, qui implémente l'interface dataService et remplace l'implémentation locale sans modifier les écrans (la base locale reste le cache hors-ligne). Branche la synchronisation, les liens, les codes, l'essai et les rôles. Écris la liste de tests d'acceptation de la section 21.2 du cahier et automatise ceux qui peuvent l'être. Donne-moi la procédure de test sur un vrai iPhone et un vrai Android d'entrée de gamme : installation, code de liaison, vente hors-ligne, synchronisation.
```

**Validation :** l'installation sur iPhone et sur Android fonctionne ; un pilote dans 2 ou 3 bars peut commencer.

## 5. Si Cline dérive

| Symptôme | Correction |
| --- | --- |
| Il ajoute un bénéfice dans l'écran du gérant | « Relis la règle 3 de .clinerules et retire-le, y compris des types et des requêtes. » |
| Il modifie ou supprime une ligne d'événement | « Les événements sont en ajout seul : crée une ligne de correction. » |
| Il invente une règle | « Cite la section du cahier qui le dit, sinon pose-moi la question. » |
| Il fait trop de choses d'un coup | « Reviens au plan : une seule tâche, ne touche pas aux autres fichiers. » |
| Les écrans ne ressemblent pas à la maquette | « Compare avec design/\[fichier\].html et aligne l'interface. » |

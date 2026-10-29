# BarPro – Prompts de conception des interfaces (pour Claude)

Ces prompts font produire par Claude toutes les interfaces de BarPro sous forme de fichiers HTML cliquables (artefacts), dans l'ordre demandé : **admin (PDG)**, puis **propriétaire**, puis **gérant**. Ils couvrent toutes les fonctions du cahier des charges V4.

## Comment les utiliser

1. Dans une nouvelle conversation Claude, joins la **charte graphique** (BarPro – Charte graphique.md). Joins aussi le **cahier des charges V4** (export PDF du document) : Claude pourra vérifier qu'il n'oublie rien.
2. Colle d'abord le **Prompt 0** (consignes communes). Il fixe la charte, les règles métier et un jeu de données identique pour tous les fichiers.
3. Colle ensuite les prompts un par un, dans l'ordre. **Un prompt = un fichier HTML**, pour que chaque fichier reste complet et léger. Valide-le avant de passer au suivant.
4. Si Claude oublie une fonction, réponds : « Relis la liste de fonctions du prompt et complète le fichier. »

## Prompt 0 – Consignes communes (à coller en premier)

```text
Tu es designer et développeur front-end senior. Tu vas concevoir les interfaces de BarPro, une application web installable (PWA) de gestion de bar et de buvette au Bénin, vendue par abonnement. Il y a trois applications : la Console BarPro (PDG, ordinateur), l'App Propriétaire et l'App Gérant (téléphone, 390 × 844 px).

CHARTE : applique à la lettre la charte graphique jointe (couleurs Forêt #0B3322, Citron #8BFA5A, Sous-bois #1F5C3F, Papier #F5F8F3 et leur échelle, états Succès, Alerte #F5B841, Erreur #FF6B5B, Neutre #5E7266 ; Inter pour le texte et JetBrains Mono pour montants, codes et horodatages ; rayons 8, 14, 24 et 999 ; boutons en capsule ; icônes à trait fin de 1,75 px en SVG intégré ; logo carré citron avec bouteille et verre, « Bar » + « Pro » en accent, signature By NCK ; ton direct, chaleureux, précis). Mode clair et mode sombre (fond sombre #06231A, cartes #0B3322). Jamais de dégradé.

LIVRABLE : pour chaque prompt, UN seul fichier HTML autonome (HTML, CSS et JavaScript sans bibliothèque externe, polices Google Fonts avec repli), prototype cliquable avec navigation entre écrans et états en JavaScript, données d'exemple en mémoire (aucun localStorage). Tous les textes en français simple. Les photos de boissons sont des tuiles de remplacement (couleur de catégorie + icône bouteille) : elles seront remplacées plus tard par les vraies images.

ERGONOMIE : zones de clic d'au moins 48 px, couleur toujours accompagnée d'une icône et d'un texte, respect de prefers-reduced-motion, montants au format « 1 000 F » (espace, sans décimales), prévention des erreurs (confirmation avant toute action définitive), barre d'onglets en bas sur téléphone.

RÈGLES MÉTIER À RESPECTER PARTOUT
- Seul le gérant vend, modifie ses tickets pendant 1 h, ravitaille, propose les corrections de ravitaillement, déclare la casse et fixe prix et fiches produit. Le propriétaire consulte, fait l'inventaire sur son téléphone, reçoit rapports et alertes, gère profil, gérant, abonnement et annexes. Il ne vend, ne ravitaille, ne déclare de casse ni ne modifie de prix.
- Le gérant ne voit jamais bénéfice, marge, valeur de casse ni rapport financier : ces données ne figurent même pas dans le code de ses fichiers.
- Le propriétaire ne voit jamais de « bénéfice après casse » : bénéfice brut et casse sont séparés. Aucune « somme à verser » n'existe.
- Vente à la bouteille ; stock affiché « X casiers + Y bouteilles ». Promo « N pour X F » : total = floor(q/N) × X + (q mod N) × prix.
- Journée commerciale de 4 h 00 à 3 h 59. Seuil d'alerte = 1 casier. Vert = en stock, jaune à pulsation douce = sous le seuil, rouge non cliquable = épuisé.
- Une action validée est définitive : on corrige par une nouvelle ligne, jamais en effaçant.

DONNÉES D'EXEMPLE IDENTIQUES DANS TOUS LES FICHIERS
Bar : Buvette Chez Mama Africa, Cotonou. Propriétaire : M. Adjovi. Gérant : Rachelle. WhatsApp propriétaire fictif : +229 01 90 00 00 01.
Boissons (catégorie, bouteilles par casier, achat par casier, vente à la bouteille) :
- Castel 65cl, Bières, 12, 8 400 F, 800 F
- Beaufort 65cl, Bières, 12, 8 100 F, 800 F
- La Béninoise 65cl, Bières, 12, 7 800 F, 700 F
- Heineken 33cl, Bières, 24, 14 400 F, 800 F
- Coca-Cola 33cl, Sucreries, 24, 5 760 F, 400 F, promo 3 pour 1 000 F
- Fanta 33cl, Sucreries, 24, 5 760 F, 400 F, promo 3 pour 1 000 F
- Sprite 33cl, Sucreries, 24, 5 760 F, 400 F
- Top Ananas 33cl, Sucreries, 24, 5 520 F, 400 F
- Possotomè 50cl, Eau minérale, 12, 2 400 F, 300 F
- Possotomè 1,5L, Eau minérale, 6, 1 800 F, 500 F
- Cristal 50cl, Eau minérale, 12, 2 400 F, 300 F
- Cristal 1,5L, Eau minérale, 6, 1 800 F, 500 F
États de stock à prévoir : Beaufort épuisé (0), La Béninoise et Fanta sous le seuil, les autres en stock. Prévois quelques tickets du jour, un modifiable (42 min restantes) et d'autres verrouillés.

Réponds seulement « Compris » et attends le premier prompt.
```

# PARTIE 1 – Console BarPro (PDG)

## Prompt A1 – Connexion, liste des bars et fiche d'un bar

```text
Crée le fichier console-barpro-bars.html : la Console BarPro, application web desktop (largeur 1280 px, adaptable à la tablette) réservée au PDG. Ne réutilise pas la barre d'onglets mobile : utilise une barre latérale Forêt avec le logo.

FONCTIONS À INCLURE, SANS EN OUBLIER
1. Connexion : mot de passe fort (indicateur de force) puis double vérification par code à usage unique (6 chiffres). Message d'erreur en français simple, bouton de déconnexion.
2. Liste et suivi des bars, tableau avec les colonnes : Bar (nom, localisation, propriétaire, WhatsApp), Type (bar principal, ou annexe rattachée à un propriétaire), Statut, Date de fin, Dernière activité (dernière synchronisation). Statuts en badges icône + texte : lien envoyé, essai en cours, actif, expire bientôt (3 jours ou moins), expiré, suspendu. Compteurs par statut en haut, recherche par nom, filtre par statut, bouton Export CSV.
3. Création d'un bar : formulaire avec nom du bar, nom du propriétaire, numéro WhatsApp en format international (+229…), localisation. À la validation, la console génère un lien d'accès unique à usage unique et affiche le message WhatsApp pré-écrit contenant le lien, avec les boutons « Envoyer sur WhatsApp » (lien wa.me vers le numéro enregistré) et « Copier le lien ».
4. Fiche d'un bar (panneau latéral ou page) avec les actions : renvoyer un lien (confirmation : l'ancien appareil du propriétaire est révoqué, toutes les transactions restent visibles, envoi uniquement au numéro enregistré) ; suspendre ou réactiver (le bar est alors bloqué avec le message « Contactez BarPro ») ; prolonger manuellement un abonnement avec motif obligatoire ; modifier le numéro WhatsApp du propriétaire (seul le PDG le peut, car les liens sont envoyés à ce numéro) ; voir les annexes du propriétaire ; créer ou réinitialiser un bar de démonstration avec données fictives, qui ne consomme aucun essai.
5. Chaque action sensible demande une confirmation et ajoute une ligne au journal (visible dans le fichier suivant).
Données d'exemple : 8 bars dont un suspendu, un expiré, un essai en cours, une annexe.
```

## Prompt A2 – Codes d'abonnement, journal et paramètres

```text
Crée le fichier console-barpro-codes.html, même style et mêmes données que console-barpro-bars.html (même barre latérale, avec les entrées Bars, Codes, Journal, Paramètres).

FONCTIONS À INCLURE
1. Génération de codes : choix du nombre de mois de 1 à 24 avec raccourcis 1, 3, 6 et 12 mois ; pour une annexe, choix du propriétaire concerné. Le code unique s'affiche de façon lisible en JetBrains Mono (12 caractères, sans 0/O ni 1/I), avec « Copier » et un message WhatsApp pré-écrit prêt à envoyer.
2. Liste des codes avec statut suivi : généré, utilisé (par quel bar, à quelle date), expiré. Recherche et filtre par statut. Un code est à usage unique et se cumule à la date de fin actuelle.
3. Journal des actions de la console, non modifiable et non supprimable : qui a généré quel lien ou quel code, suspension, prolongation avec motif, modification de numéro, renvoi de lien, avec date et heure. Filtres par date et par action.
4. Paramètres : durée de l'essai gratuit (7 jours par défaut, modifiable), durée de validité des liens non utilisés, rappel des règles (seul le PDG génère liens et codes, 5 codes faux bloquent la saisie 15 minutes, données conservées 90 jours après expiration).
5. Mode démo : bouton pour ouvrir un bar de démonstration et le réinitialiser.
```

# PARTIE 2 – App Propriétaire

L'app propriétaire est en consultation et contrôle. Navigation en bas : Accueil, Ventes, Stock, Inventaire, Statistiques, et un onglet « Plus » qui ouvre Profil et Pénurie (cinq onglets visibles au maximum). Un sélecteur de bar est affiché en haut de l'écran quand le propriétaire a des annexes.

## Prompt P1 – Premier accès, essai, codes, PIN et états du bar

```text
Crée le fichier proprietaire-acces.html : tous les écrans d'accès de l'App Propriétaire (téléphone 390 × 844).

FONCTIONS À INCLURE
1. Ouverture du lien reçu par WhatsApp, sans mot de passe. Écran de bienvenue avec le nom du bar et du propriétaire (sans conditions d'utilisation pour le moment).
2. Trois écrans d'introduction courts, puis guide d'installation illustré : Android (ouvrir dans Chrome, menu, « Installer l'application ») et iPhone (ouvrir dans Safari, bouton Partager, « Sur l'écran d'accueil »).
3. Code de liaison court affiché dans le navigateur et à retaper dans l'appli installée quand la session n'apparaît pas (cas fréquent sur iPhone).
4. Choix « Session gratuite » (essai de 7 jours, valable pour le propriétaire et son gérant, même date de fin, un seul essai par bar) ou « J'ai un code ».
5. Saisie du code d'abonnement : succès avec nouvelle date de fin, code invalide, code déjà utilisé, blocage de 15 minutes après 5 codes faux. Le code s'ajoute à la date de fin actuelle.
6. PIN facultatif de 4 à 6 chiffres, désactivé par défaut, écran de verrouillage et blocage de 5 minutes après 5 PIN faux.
7. Lien déjà utilisé : message de refus clair (« Ce lien a déjà été utilisé. Contactez BarPro. »).
8. États du bar à présenter avec un sélecteur de démo : essai en cours, abonnement actif, bande des 3 derniers jours (« Votre abonnement se termine le [date] » avec bouton WhatsApp vers BarPro), expiré (lecture seule : historiques et export PDF accessibles, vente et saisies bloquées, un code réactive), suspendu (« Contactez BarPro »).
9. Indicateur permanent de synchronisation (« Synchronisé » ou « X actions en attente ») et bandeau hors-ligne.
```

## Prompt P2 – Accueil, alertes et multi-bars

```text
Crée le fichier proprietaire-accueil.html : l'écran d'accueil de l'App Propriétaire avec la barre d'onglets et le sélecteur de bar.

FONCTIONS À INCLURE
1. Cartes du jour : chiffre d'affaires, bénéfice brut et casse (montant), affichés séparément, sans aucune ligne « bénéfice après casse ».
2. Alertes, chacune avec icône, texte et lien vers l'écran concerné : pénurie (nombre de produits), casse déclarée, stock négatif (« Stock négatif : à vérifier »), tickets à heure suspecte, changement de prix (ancien et nouveau prix, qui, quand), correction de ravitaillement (produit, quantité, motif), inventaire à consulter, écart de cohérence (plus de 90 % de lignes sans écart).
3. Indicateur « Dernière synchronisation : [heure] » du gérant, pour savoir si les chiffres sont à jour.
4. Liste de ravitaillement du jour en lecture seule (heure, gérant, boissons, quantités, mention « Correction »).
5. Sélecteur de bar en haut et tableau de bord consolidé (chiffre d'affaires total, alertes de tous les bars) pour un propriétaire avec annexes.
6. Badge numérique de pénurie sur l'onglet, bande des 3 derniers jours, mode lecture seule quand l'abonnement est expiré.
```

## Prompt P3 – Ventes : cartes journalières et tickets

```text
Crée le fichier proprietaire-ventes.html : l'onglet Ventes du propriétaire, en consultation uniquement (aucun bouton de vente, de modification ni d'annulation).

FONCTIONS À INCLURE
1. Une carte par journée commerciale (4 h 00 à 3 h 59), la plus récente en haut, mise à jour à chaque vente du gérant : chiffre d'affaires, nombre de tickets (non annulés), bénéfice brut, casse (montant). Mention « Provisoire jusqu'à 5 h 00 » puis « Verrouillé ».
2. Détail d'une journée : liste des tickets, ventes par boisson, casse du jour, ravitaillements du jour. Boutons « Exporter en PDF » et « Envoyer par WhatsApp ».
3. Liste des tickets : numéro, heure, total, statut (modifiable avec compte à rebours, ou verrouillé avec cadenas), recherche par montant ou produit.
4. Détail d'un ticket en lecture seule : lignes (produit, quantité, prix appliqué, promo appliquée), heure, gérant, appareil, total, historique des versions, statut annulé, marque « heure suspecte » quand elle existe. Message : « Seul le gérant peut modifier un ticket. »
```

## Prompt P4 – Stock, pénurie, ravitaillements et produits (consultation)

```text
Crée le fichier proprietaire-stock.html : les onglets Stock et Pénurie du propriétaire, en consultation (aucun bouton Ravitailler, Casse ni modification de prix).

FONCTIONS À INCLURE
1. Stock : une bande par boisson avec photo, nom, Acheté, Vendu, Cassé / défaillant, Reste en « X casiers + Y bouteilles ». Couleurs vert (pastille « En stock »), jaune (icône + « Plus que X »), rouge (icône « Épuisé »). Sélecteur de période : depuis le dernier inventaire, mois en cours, période libre. Les totaux repartent à zéro après chaque inventaire.
2. Fiche détail d'une boisson : ravitaillements concernés (date, gérant, quantité), quantité vendue, casse avec motifs, reste actuel, dernier inventaire (date, quantité comptée), prix d'achat moyen, prix de vente, et, pour le propriétaire seulement, marge brute par bouteille et bénéfice brut sur la période.
3. Pénurie : produits sous le seuil, épuisés d'abord puis jaunes du plus bas au plus haut, avec le reste ; badge numérique sur l'onglet.
4. Sous-onglet Ravitaillements : liste de la journée commerciale avec sélecteur de date, heure, gérant, boissons, quantités, total du jour, mention « Correction » avec motif, bouton « Télécharger en PDF ». Les ravitaillements validés sont verrouillés (cadenas).
5. Sous-onglet Produits et prix en consultation : fiche de chaque boisson (nom, photo, catégorie, format, bouteilles par casier, prix d'achat par casier, prix de vente, promo, seuil d'alerte, actif ou non) et historique des changements de prix (ancien, nouveau, gérant, date). Message : « Les prix sont saisis par le gérant. »
```

## Prompt P5 – Inventaire, rapports, audio et historique

```text
Crée le fichier proprietaire-inventaire.html : l'onglet Inventaire du propriétaire.

FONCTIONS À INCLURE
1. Démarrer son propre inventaire sur son téléphone, en aveugle : une bande par boisson avec photo, nom, champs « Casiers » et « Bouteilles », stock théorique jamais affiché, toutes les boissons à renseigner (0 explicite), bouton de validation inactif tant qu'une boisson n'est pas comptée, brouillon repris, un seul inventaire à la fois, refus s'il reste un ravitaillement en brouillon. Récapitulatif puis validation définitive horodatée.
2. Rapport 1, inventaire détaillé en bouteilles : par boisson, stock au dernier inventaire, ravitaillé, vendu, cassé, stock théorique, stock compté, écart (manquant ou surplus), lignes en écart mises en évidence, synthèse en tête des manquants et surplus, casse inhabituelle signalée. Premier inventaire : « Stock de départ enregistré » sans écart.
3. Rapport 2, inventaire financier : chiffre d'affaires enregistré, valeur des manquants, casse et défaillant (perte de la buvette), valeur des surplus (information). Aucune somme à verser, aucun bénéfice après casse.
4. Message final généré (« Inventaire du [date] réalisé par [gérant]… », variante sans écart, variante avec surplus) affiché à l'écran avec boutons « Écouter » (synthèse vocale), pause et « Réécouter » ; le texte reste toujours visible.
5. Alerte de cohérence quand plus de 90 % des lignes ont un écart nul.
6. Message et audio du nouveau stock : « Après cet inventaire réalisé par [gérant], les boissons comptées deviennent le nouveau stock disponible dans les réfrigérateurs. »
7. Bouton « Télécharger le rapport en PDF » (nom de fichier Inventaire_NomBar_AAAA-MM-JJ_HHMM.pdf, en-tête avec nom du bar, RCCM, lieu, date, auteur, pied de page « Document généré par BarPro »).
8. Historique des inventaires : date, gérant, nombre de manquants, PDF. Les inventaires faits par le gérant arrivent avec l'alerte « Inventaire à consulter ».
```

## Prompt P6 – Statistiques du propriétaire

```text
Crée le fichier proprietaire-statistiques.html : l'onglet Statistiques du propriétaire, avec graphiques dessinés en SVG.

FONCTIONS À INCLURE
1. Sélecteur de période (mois ou année) et sélecteur de bar (un bar ou la somme de tous).
2. Classement des boissons les plus vendues du mois, en bouteilles.
3. Détail par boisson : bouteilles vendues et chiffre d'affaires, par mois ou par année.
4. Bénéfice brut par boisson sur la période.
5. Chiffre d'affaires total avec comparaison au mois précédent.
6. Casse de la période, affichée séparément, sans bénéfice après casse.
7. Courbe d'évolution du chiffre d'affaires par jour (mois) ou par mois (année).
8. Bouton « Télécharger le rapport statistiques » (PDF avec en-tête du bar, période et date de génération). Les statistiques utilisent les journées commerciales et excluent les tickets annulés.
```

## Prompt P7 – Profil, gérant, abonnement, annexes et journal

```text
Crée le fichier proprietaire-profil.html : l'onglet Profil du propriétaire avec tous ses sous-écrans.

FONCTIONS À INCLURE
1. Informations du bar : nom, RCCM (modifiable), lieu, nom du propriétaire, contact WhatsApp (en lecture seule, avec la mention « Seul BarPro peut le modifier »), nom du gérant.
2. Lien du gérant : saisir le nom du gérant, générer ou renvoyer le lien, envoi par WhatsApp avec message pré-écrit.
3. Nouveau gérant, deux cas. Cas A, téléphone perdu ou changé : confirmation « Même gérant, nouvel appareil », nouveau lien, ancien appareil révoqué, avertissement sur les ventes hors-ligne non synchronisées. Cas B, changement de gérant : saisie du nom, message et audio « Avant la prise de service de [nouveau nom], faites un inventaire à [ancien nom]. », boutons « Inventaire » (sur son téléphone ou sur l'appareil de l'ancien gérant) et « Inventaire déjà fait » (liste des inventaires récents, seul un inventaire sans mouvement depuis sa validation est choisissable, sinon « Des mouvements ont eu lieu depuis cet inventaire. Refaites un inventaire. »), liste du stock disponible téléchargeable en PDF, génération du lien du nouveau gérant, révocation de l'ancien.
4. Appareils connectés : voir l'appareil du gérant et le révoquer.
5. Abonnement : date de fin, saisie d'un code, bouton WhatsApp vers BarPro, bande des 3 derniers jours.
6. Annexes : liste des bars du propriétaire, bouton « Ajouter une annexe » qui affiche « Veuillez contacter BarPro » avec un bouton WhatsApp (message pré-écrit incluant le nom du bar principal), puis saisie du code, création d'une annexe vide, nom et lieu, lien du gérant. Chaque annexe a son abonnement, son stock et son gérant, sans essai gratuit. Sélecteur de bar.
7. Produits et prix : accès en consultation aux fiches (voir fichier stock).
8. Journal d'audit en lecture seule, non modifiable : qui, quand, appareil, action, valeurs avant et après ; filtres par date, utilisateur et action ; actions tracées : modification ou annulation de ticket, corrections de ravitaillement, casse, changements de prix, changements de gérant, liens, codes.
9. Sécurité : activer ou désactiver le PIN facultatif. Sauvegarde : export des données du bar en PDF et en CSV. Apparence : mode clair ou sombre. Aide : guide d'installation, contact BarPro, version de l'appli.
```

# PARTIE 3 – App Gérant

L'app gérant est l'outil de travail, pensé pour un usage debout, au comptoir, à une main. Navigation en bas : Vente, Stock, Pénurie, Ravitaillement, Inventaire, Statistiques (six onglets, icônes grandes, texte court).

## Prompt G1 – Premier accès et états de l'appli

```text
Crée le fichier gerant-acces.html : les écrans d'accès et d'état de l'App Gérant (téléphone 390 × 844, avec variante tablette).

FONCTIONS À INCLURE
1. Ouverture du lien envoyé par le propriétaire, sans mot de passe ni PIN : bienvenue, trois écrans d'introduction, guide d'installation illustré (Android Chrome, iPhone Safari), code de liaison à retaper si la session n'apparaît pas dans l'appli installée.
2. Lien déjà utilisé ou ancien lien révoqué : message de refus (« Ce lien n'est plus valide. Demandez-en un nouveau au propriétaire. »).
3. Bande des 3 derniers jours : « L'abonnement se termine le [date]. Contactez le propriétaire. », sans aucun bouton vers BarPro.
4. États : essai en cours, lecture seule à l'expiration (vente, ravitaillement, casse et inventaire bloqués), bloqué si suspendu (« Contactez BarPro »), POS verrouillé pour un nouveau gérant tant que l'inventaire de passation n'est pas validé.
5. Indicateur permanent « Synchronisé » ou « X actions en attente », bandeau hors-ligne, mode sombre automatique selon le téléphone.
```

## Prompt G2 – Vente (POS)

```text
Crée le fichier gerant-vente.html : l'écran Vente du gérant, entièrement fonctionnel avec les données d'exemple.

FONCTIONS À INCLURE
1. Grille de cartes, une par boisson active : grande photo (tuile), nom, prix de vente à la bouteille, étiquette de stock. 2 colonnes sur téléphone, 3 ou 4 sur tablette. Barre de recherche et filtres par catégorie (Bières, Sucreries, Eau minérale).
2. Un clic sur la carte ajoute 1 bouteille ; badge de quantité sur la carte ; bouton « − » sur le badge pour retirer 1 bouteille. Vente à la bouteille uniquement.
3. États des cartes : normal, alerte (jaune à pulsation douce, icône et texte « Plus que X », contour jaune fixe si animations réduites), épuisé (rouge, grisé, icône « Épuisé », aucun clic). Impossible de dépasser le stock : message « Il n'en reste que X ».
4. Barre du panier en bas : lignes (ex. 3 Coca-Cola, 2 Castel), total en F, boutons OK et Vider. Total calculé au clic sur OK avec la règle des promos, mention « Promo appliquée » sur la ligne (test : 4 Coca-Cola = 1 400 F).
5. OK enregistre un ticket (numéro unique, date et heure, journée commerciale, gérant, appareil, lignes avec prix appliqué, total), baisse le stock, affiche une confirmation brève avec le total, vide le panier. Bouton « Annuler » visible après la vente.
6. Bouton « Déclarer une casse » accessible depuis cet écran. Produit sans prix : étiquette « Prix à renseigner », non vendable.
```

## Prompt G3 – Tickets du jour et modification pendant 1 heure

```text
Crée le fichier gerant-tickets.html : la liste des tickets et leur détail, côté gérant.

FONCTIONS À INCLURE
1. « Tickets du jour » : numéro, heure, total, statut (modifiable avec compte à rebours « Modifiable encore 42 min », ou verrouillé avec cadenas), recherche par montant ou produit, chiffre d'affaires du jour (sans bénéfice, sans marge, sans casse). Un ticket vendu avant 4 h appartient à la journée de la veille.
2. Détail d'un ticket : lignes (produit, quantité, prix appliqué, promo), heure, total, statut, compte à rebours, historique des versions, ventes du jour par boisson.
3. Modification pendant 1 heure : changer les quantités, ajouter ou retirer une ligne, ou annuler tout le ticket ; le stock est recalculé ; chaque modification crée une nouvelle version et l'ancienne est conservée.
4. Après 1 heure : ticket verrouillé, aucun bouton de modification, message « Ce ticket ne peut plus être modifié. Une erreur se constate à l'inventaire. »
5. Marque « heure suspecte » possible après synchronisation (horloge reculée ou écart de plus de 5 minutes), visible par le gérant sans détail financier.
```

## Prompt G4 – Stock, fiche produit et pénurie

```text
Crée le fichier gerant-stock.html : les onglets Stock et Pénurie du gérant, avec la gestion des fiches produit.

FONCTIONS À INCLURE
1. Stock : une bande par boisson avec photo, nom, Acheté, Vendu, Cassé / défaillant, Reste en « X casiers + Y bouteilles », couleurs vert, jaune, rouge avec icône + texte, sélecteur de période. Pendant un inventaire en cours, les quantités sont masquées et seules les couleurs restent.
2. Fiche détail d'une boisson : ravitaillements concernés, ventes, casse avec motifs, reste actuel, dernier inventaire, prix d'achat moyen et prix de vente, sans marge ni bénéfice.
3. Fiche produit modifiable par le gérant seul : création depuis le catalogue pré-chargé ou ajout d'une nouvelle boisson (photo prise ou choisie, compressée), nom, catégorie, format, bouteilles par casier (obligatoire), prix d'achat par casier, prix de vente à la bouteille, prix promotionnel « N bouteilles pour X F » facultatif, seuil d'alerte (1 casier par défaut), actif ou inactif (un produit inactif disparaît du POS mais garde son historique). Chaque changement de prix est tracé et signalé au propriétaire (message de confirmation).
4. Pénurie : produits sous le seuil, épuisés d'abord puis jaunes du plus bas au plus haut, avec le reste et un bouton « Ravitailler » qui ouvre le ravitaillement sur ce produit ; badge numérique sur l'onglet ; bouton « Partager la liste de pénurie » par WhatsApp (message pré-écrit).
```

## Prompt G5 – Ravitaillement

```text
Crée le fichier gerant-ravitaillement.html : l'onglet Ravitaillement du gérant, du brouillon à la liste du jour.

FONCTIONS À INCLURE
1. Cartes des boissons comme au POS. Un clic ouvre une fenêtre de saisie : casiers et bouteilles reçus (boutons + et −, pavé numérique) et prix d'achat par casier à renseigner ou confirmer. La ligne s'ajoute au brouillon, modifiable et supprimable tant que le ravitaillement n'est pas validé.
2. Bouton « Terminer » : récapitulatif avec une ligne par boisson (casiers et bouteilles), total général, date, nom du gérant, et message rouge en haut : « Vérifiez correctement la liste du ravitaillement. Une fois validée, elle n'est plus modifiable et sera prise en compte dans l'inventaire. » Boutons « Modifier » (retour au brouillon) et « Valider définitivement » (actif seulement après la case « J'ai vérifié la liste »).
3. Après validation : le stock augmente, le ravitaillement est verrouillé (cadenas), les lignes et le prix d'achat ne sont plus modifiables, le coût moyen pondéré est recalculé.
4. Correction d'un ravitaillement validé : le gérant propose une écriture de correction (en plus ou en moins) avec motif obligatoire, affichée sous la mention « Correction » ; la ligne d'origine n'est jamais modifiée ; message « Le propriétaire sera alerté. »
5. Sous-onglet « Liste de ravitaillement » : journée commerciale en cours, sélecteur de date pour les jours passés, heure, gérant, boissons, quantités, mention « Correction », total du jour, bouton « Envoyer par WhatsApp » (message pré-écrit au propriétaire) et bouton « Télécharger en PDF ».
```

## Prompt G6 – Casse et défaillant

```text
Crée le fichier gerant-casse.html : la déclaration de casse du gérant, accessible depuis Stock et POS.

FONCTIONS À INCLURE
1. Choix de la boisson par carte ou par recherche, quantité en bouteilles, motif : Cassée, Défaillante (bouchon, gaz, goût), Périmée, Autre (précision en texte libre), photo facultative.
2. Confirmation puis validation : le stock baisse immédiatement et la déclaration apparaît dans la colonne « Cassé / défaillant ».
3. Le gérant ne peut pas annuler une déclaration : message clair, aucune action d'annulation.
4. Liste des casses déclarées depuis le dernier inventaire (produit, quantité, motif, heure), sans aucun montant en francs. Message : « La casse est une perte de la buvette. Elle est soldeée à l'inventaire. »
5. Aucune décision à attendre du propriétaire ; il reçoit seulement l'alerte « Casse déclarée ».
```

## Prompt G7 – Inventaire en aveugle

```text
Crée le fichier gerant-inventaire.html : l'onglet Inventaire du gérant.

FONCTIONS À INCLURE
1. Lancement : refus s'il reste un ravitaillement en brouillon (« Validez ou supprimez le ravitaillement en cours. »), un seul inventaire à la fois, reprise d'un brouillon enregistré.
2. Comptage en aveugle : une bande par boisson avec photo, nom, champs « Casiers » et « Bouteilles » ; le stock théorique n'est jamais affiché ; chaque boisson doit être renseignée, y compris avec 0 saisi explicitement ; le bouton de validation reste inactif tant qu'une boisson n'est pas comptée.
3. Récapitulatif des quantités comptées, puis validation définitive horodatée avec confirmation.
4. Fin : seulement le message « Inventaire enregistré. Le propriétaire a été informé. », puis retour au POS. Le gérant ne voit ni écarts, ni montants, ni audio.
5. Bouton « Télécharger la liste du stock compté » (PDF, sans écarts). Historique limité aux listes de stock compté.
6. Inventaire de passation : quand le propriétaire déclare un changement de gérant, bandeau « Inventaire de passation demandé » sur l'appareil de l'ancien gérant.
```

## Prompt G8 – Statistiques du gérant

```text
Crée le fichier gerant-statistiques.html : l'onglet Statistiques du gérant, limité aux quantités.

FONCTIONS À INCLURE
1. Sélecteur de période (mois ou année).
2. Classement des boissons les plus vendues du mois, en bouteilles, du plus vendu au moins vendu.
3. Détail par boisson : nombre de bouteilles vendues par mois ou par année, sans chiffre d'affaires par boisson, sans bénéfice, sans marge, sans casse en francs.
4. Statistiques sur les journées commerciales, tickets annulés exclus. Aucun bouton d'export PDF (réservé au propriétaire).
```

## Prompt final – Page d'index

```text
Crée le fichier index.html : une page d'accueil de la maquette BarPro avec trois sections (Console BarPro, App Propriétaire, App Gérant). Pour chaque section, une carte par fichier créé avec son nom, la liste courte de ses fonctions et un lien. Ajoute en haut une checklist « Couverture du cahier des charges V4 » qui liste chaque grande fonction (sections 3 à 16) et le fichier qui la contient, pour vérifier qu'aucune n'est oubliée.
```

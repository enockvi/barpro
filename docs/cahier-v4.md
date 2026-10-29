BarPro – Cahier des charges V4

BarPro – Cahier des charges V4

Version révisée du 29 octobre 2026. Elle remplace la V3 du 28 octobre 2026.

Changements par rapport à la V3

Rôles. Seul le gérant vend, modifie et annule les tickets. Le propriétaire est un rôle de

contrôle : il n'effectue jamais de vente, de ravitaillement ni de déclaration de casse.

Prix. Les prix d'achat, les prix de vente, les promotions et les fiches produit sont saisis

par le gérant seul. Le propriétaire les consulte et est alerté de chaque changement.

Correction de ravitaillement. Un ravitaillement validé est corrigé par une écriture de

correction proposée par le gérant, avec motif obligatoire. Le propriétaire la consulte et

en est alerté.

Somme à verser. Supprimée de tout le cahier (rapport financier, message audio,

règles).

Bénéfice après casse. Supprimé. Le propriétaire voit le bénéfice brut et la casse

séparément, sans ligne qui les soustrait.

Casse. Le champ « décision (tolérée ou imputée) » est retiré. La casse est valorisée

automatiquement, sans validation du propriétaire. L'alerte « casse à valider » devient «
casse déclarée ».

Liens. Le lien est rattaché à la buvette : sa validité dépend du statut du bar.

Gérant. Ajout du détail des tickets.

Cohérence. Dates harmonisées (décisions du 29 octobre 2026).

1. Présentation, objectifs et périmètre V1

BarPro est une application web installable (PWA) de gestion de bar et de buvette au
Bénin, vendue par abonnement. Elle permet au propriétaire de contrôler ses ventes, son

stock et son gérant à distance, et au gérant de vendre en quelques clics depuis un
téléphone ou une tablette.

1.1 Objectifs

Vendre une boisson en un ou deux clics sur sa photo, sans saisie de texte.

Donner au propriétaire, en temps réel, le chiffre d'affaires, le bénéfice brut et la casse

de chaque jour.

Détecter les bouteilles manquantes grâce à un inventaire comparé automatiquement
aux ventes, ravitaillements et casses.

Page 1 of 35

BarPro – Cahier des charges V4

Fonctionner sans connexion internet, avec synchronisation automatique au retour du

réseau.

Être simple : tout en français, gros boutons, couleurs claires, aucun mot de passe pour

le propriétaire et le gérant en V1.

1.2 Trois applications dans un même produit

Application

Utilisateur

Appareil

Rôle

Console
BarPro

PDG de BarPro
(vous seul)

Navigateur,
ordinateur ou
téléphone

App
Propriétaire

Propriétaire du
bar

Son téléphone (PWA
installée)

App Gérant

Gérant ou
gérante

Téléphone ou tablette
(PWA installée)

Créer les bars, générer les
liens et les codes
d'abonnement

Superviser, contrôler, faire
l'inventaire, consulter les
rapports

Vendre, ravitailler, déclarer la
casse, fixer les prix, faire
l'inventaire

1.3 Inclus en V1

Vente POS avec tickets modifiables 1 h, stock et pénurie, ravitaillement définitif avec fiche

produit, casse, inventaire avec rapports PDF et audio, changement de gérant, tableau de
bord et cartes journalières, statistiques, profil, annexes, abonnements par codes, essai

gratuit de 7 jours, mode hors-ligne, journal d'audit, mode démo.

Exclus de la V1 : voir la section 20.

1.4 Glossaire

Terme

Bouteille

Casier

Définition

Unité de vente au détail. Tout le stock est
enregistré en bouteilles.

Lot de bouteilles. Le nombre de bouteilles par
casier est défini pour chaque produit. Affichage : «
3 casiers + 5 bouteilles ».

Journée commerciale

Période de 4 h 00 à 3 h 59 le lendemain, fuseau
Bénin (UTC+1).

Page 2 of 35

BarPro – Cahier des charges V4

Terme

Définition

Stock théorique

Dernier inventaire + ravitaillements validés −
ventes − casse déclarée.

Écart

Stock compté − stock théorique. Négatif =
manquant, positif = surplus.

Coût moyen pondéré

Prix d'achat moyen par bouteille, pondéré par les
quantités reçues à chaque ravitaillement.

Bénéfice brut

Prix de vente encaissé − prix d'achat (coût moyen
pondéré).

2. Acteurs, rôles et matrice des droits

2.1 Principe

Trois rôles existent. Les droits sont contrôlés par le serveur, pas seulement masqués à

l'écran : un gérant ne reçoit jamais les bénéfices ni les marges, même en inspectant l'appli.
Le propriétaire est un rôle de supervision : il ne vend pas, ne ravitaille pas, ne déclare pas

de casse et ne fixe pas les prix.

2.2 Matrice des droits

Fonction

Gérant

Propriétaire

Vente POS, ticket
modifiable 1 h

Détail des tickets

Modifier ou annuler un
ticket

Oui

Oui

Non

Oui (consultation)

Oui, pendant 1 h

Non

Stock (quantités, pénurie)

Oui

Oui, avec toutes les
informations

PDG
BarPro

Non

Non

Non

Non

Prix d'achat, prix de vente,
promotions, fiches produit

Oui, seul

Consultation seule

Non

Bénéfice et marges

Jamais

Oui (bénéfice brut)

Saisie d'un ravitaillement

Oui

Non

Non

Non

Page 3 of 35

BarPro – Cahier des charges V4

Fonction

Gérant

Propriétaire

PDG
BarPro

Correction d'un
ravitaillement validé

Oui, proposée avec
motif

Consultation et alerte

Non

Déclarer la casse ou un
défaut

Oui

Non

Valeur de la casse

Jamais

Oui (valorisée
automatiquement)

Non

Non

Inventaire (comptage)

Oui, en aveugle,
sans code en V1

Oui, sur son téléphone

Non

Rapports financiers
d'inventaire et audio

Cartes journalières

Non

Oui

Chiffre d'affaires et
nombre de tickets

Chiffre d'affaires, bénéfice
brut, casse

Statistiques

Quantités vendues

Complètes (quantités, CA,
bénéfice brut)

Profil, lien du gérant,
nouveau gérant

Saisir un code
d'abonnement

Créer des bars, générer
liens et codes, suspendre

Non

Non

Non

Oui

Oui

Non

Non

Non

Non

Non

Non

Oui, seul

Le propriétaire ne voit jamais de ligne « bénéfice après casse ». Le gérant ne voit jamais de

bénéfice, de marge ni de valeur de casse.

2.3 Règles transversales

Chaque action (vente, ravitaillement, casse, inventaire, correction) est rattachée au

gérant en poste et à l'appareil utilisé.

Un propriétaire peut avoir plusieurs bars (annexes). Chaque bar a son stock, son

gérant, son lien et son abonnement.

Un gérant est rattaché à un seul bar à la fois.

Page 4 of 35

BarPro – Cahier des charges V4

3. Console d'administration BarPro (PDG uniquement)

La console est une application web distincte, réservée au PDG de BarPro. Elle est

protégée par un mot de passe fort et une double vérification (code à usage unique).
Aucun propriétaire ni gérant ne peut y accéder.

3.1 Création d'un bar

Le PDG saisit : nom du bar, nom du propriétaire, numéro WhatsApp du propriétaire

(format international, ex. +229…) et localisation. La console génère alors :

un lien unique d'accès pour le propriétaire (à usage unique, voir section 5) ;

un message WhatsApp pré-écrit contenant le lien, prêt à envoyer au numéro

enregistré en un clic.

Ces quatre informations pré-remplissent le profil du bar côté propriétaire.

3.2 Génération des codes d'abonnement

Le PDG choisit le nombre de mois (de 1 à 24, avec raccourcis 1, 3, 6 et 12 mois) et, pour

une annexe, le propriétaire concerné.

La console affiche un code unique à communiquer au propriétaire (message

WhatsApp pré-écrit disponible).

Un code est à usage unique, lié à une durée. Son statut est suivi : généré, utilisé (par

quel bar, à quelle date), expiré.

3.3 Liste et suivi des bars

Colonne

Contenu

Bar

Type

Statut

Nom, localisation, propriétaire, WhatsApp

Bar principal ou annexe (rattachée à un
propriétaire)

Lien envoyé, essai en cours, actif, expire bientôt (3
jours ou moins), expiré, suspendu

Date de fin

Date de fin de l'essai ou de l'abonnement

Dernière activité Date de la dernière synchronisation du bar

Recherche par nom, filtre par statut, export CSV.

Page 5 of 35

BarPro – Cahier des charges V4

3.4 Actions du PDG

Renvoyer un lien au propriétaire (téléphone perdu ou payé de nouveau) : l'ancien

appareil du propriétaire est révoqué, toutes les transactions restent visibles.

Suspendre ou réactiver un bar.

Prolonger manuellement un abonnement (geste commercial) avec motif.

Modifier le numéro WhatsApp d'un propriétaire (seul le PDG peut le faire, car les liens
sont envoyés à ce numéro).

Créer un bar de démonstration avec données fictives, réinitialisable, qui ne consomme

aucun essai.

Consulter le journal des actions de la console (qui a généré quel lien ou code, quand).

3.5 Règles

Seul le PDG génère des liens propriétaire et des codes : aucune génération de code

n'est possible depuis l'app propriétaire ou gérant.

Un lien n'est renvoyé qu'au numéro WhatsApp enregistré pour le bar.

4. Abonnements, essai gratuit de 7 jours et codes

4.1 Essai gratuit

À la première ouverture du lien, le propriétaire voit deux boutons : Session gratuite et
J'ai un code.

« Session gratuite » démarre un essai de 7 jours, valable pour le propriétaire et pour son

gérant, avec la même date de fin.

L'horloge de l'essai est tenue par le serveur et liée au bar, jamais au téléphone :

réinstaller l'appli ne donne pas de nouvel essai. Un bar ne bénéficie d'un essai qu'une

seule fois.

La durée de l'essai (7 jours par défaut) est un paramètre modifiable dans la console.

Accompagnement recommandé : faire avec le propriétaire un premier inventaire dans
la semaine, car la vraie valeur de l'appli (écarts et rapport financier) n'apparaît qu'après

le premier cycle de comptage.

4.2 Codes d'abonnement

Règle

Détail

Génération

Par le PDG uniquement, en fonction du nombre de
mois

Page 6 of 35

BarPro – Cahier des charges V4

Règle

Usage

Saisie

Cumul

Détail

Un code ne sert qu'une fois. Il est vérifié par le
serveur

Le propriétaire tape le code. Le serveur ouvre ou
prolonge la session du propriétaire et du gérant

Un nouveau code s'ajoute à la date de fin actuelle :
payer en avance ne fait perdre aucun jour

Erreurs de saisie Après 5 codes faux, la saisie est bloquée 15

minutes

Format

Code court lisible (par exemple 12 caractères sans
0/O ni 1/I), copiable depuis WhatsApp

4.3 Annexes (bars supplémentaires)

1. Le propriétaire clique sur « Ajouter une annexe ».

2. L'appli affiche « Veuillez contacter BarPro » avec un bouton WhatsApp ouvrant une

discussion avec BarPro, message pré-écrit incluant le nom du bar principal.

3. Le PDG génère un code pour l'annexe (nombre de mois choisi).

4. Le propriétaire saisit le code : l'appli crée une annexe vide.

5. Le propriétaire renseigne le nom et le lieu de l'annexe, puis génère le lien de son gérant.

6. Le gérant ouvre le lien : sa session s'ouvre, avec la même date de fin que l'annexe.

Chaque annexe a son abonnement, son stock et son gérant indépendants. L'annexe n'a

pas d'essai gratuit. Le propriétaire passe d'un bar à l'autre par un sélecteur en haut de

l'écran et dispose d'un tableau de bord consolidé (chiffre d'affaires total, alertes).

4.4 Rappel des 3 derniers jours

À chaque ouverture de l'appli, quand il reste 3 jours ou moins, une bande s'affiche en haut

de l'écran :

Propriétaire : « Votre abonnement se termine le [date] » avec un bouton WhatsApp

vers BarPro pour obtenir un code.

Gérant : « L'abonnement se termine le [date]. Contactez le propriétaire. » Aucun
bouton vers BarPro, afin que le gérant ne contacte pas BarPro à la place du

propriétaire.

Hors connexion, l'appli garde la dernière date de fin signée par le serveur et détecte les

retours en arrière de l'horloge du téléphone.

Page 7 of 35

BarPro – Cahier des charges V4

4.5 Expiration

À l'expiration, l'appli passe en lecture seule : vente, ravitaillement, casse et inventaire

sont bloqués. Le propriétaire garde l'accès à ses historiques et à l'export PDF.

Les données sont conservées 90 jours après expiration, puis archivées. Un code valide

les réactive.

Un bar suspendu par le PDG est bloqué de la même façon, avec le message « Contactez

BarPro ».

5. Liens, installation de la PWA et liaison des appareils

5.1 Principe et validité selon la buvette

Le lien est l'équivalent d'un mot de passe : quiconque l'ouvre peut voir la comptabilité du

bar. Il est rattaché à la buvette, pas à la personne. À l'ouverture et à chaque

synchronisation, le serveur vérifie le statut du bar :

Statut du bar

Effet sur le lien et l'appli

Essai en cours ou abonnement actif

Lien valide, appli en mode normal

Expiré

Lien valide mais appli en lecture seule

Suspendu par le PDG

Appli bloquée, message « Contactez BarPro »

Un lien ne fonctionne que pour le bar pour lequel il a été généré. Chaque bar, annexes

comprises, a ses propres liens propriétaire et gérant.

Règle

Détail

Usage unique

Un lien ne peut être activé qu'une fois. Il se lie au
premier appareil qui l'ouvre

Jeton

Renvoi

Chaîne aléatoire longue, stockée chiffrée côté
serveur, invalide après usage

Renvoyer un lien révoque automatiquement
l'ancien appareil. Les données du bar sont
conservées

Destinataire

Le PDG n'envoie un lien propriétaire qu'au numéro
WhatsApp enregistré. Le propriétaire envoie le lien
du gérant par WhatsApp (message pré-écrit)

Page 8 of 35

BarPro – Cahier des charges V4

Règle

Détail

Révocation

Le propriétaire voit la liste des appareils liés et
peut révoquer celui du gérant à tout moment

Connexion requise

L'activation d'un lien nécessite internet une seule
fois. Ensuite l'appli fonctionne hors-ligne

5.2 Premier accès du propriétaire

1. Le propriétaire ouvre le lien reçu par WhatsApp. Aucun mot de passe n'est demandé.

2. Un écran de bienvenue affiche le nom du bar et du propriétaire, sans conditions

d'utilisation pour le moment.

3. Un écran guide l'installation. Android : ouvrir dans Chrome, menu, « Installer

l'application ». iPhone : ouvrir dans Safari, bouton Partager, « Sur l'écran d'accueil ».

4. Si la session ouverte dans le navigateur n'apparaît pas dans l'appli installée (cas

fréquent sur iPhone), l'appli propose un code de liaison court à retaper, affiché dans le

navigateur.

5. Le propriétaire choisit « Session gratuite » ou « J'ai un code ».

6. Il peut activer un code PIN facultatif (4 à 6 chiffres) pour protéger l'appli en cas de

téléphone volé ou prêté. Par défaut, il est désactivé. Après 5 PIN faux, l'appli se

verrouille 5 minutes.

5.3 Premier accès du gérant

1. Dans son profil, le propriétaire clique sur « Lien du gérant », renseigne le nom du gérant

et envoie le lien par WhatsApp (message pré-écrit).

2. Le gérant ouvre le lien sur son téléphone ou sa tablette : même écran d'installation,

même mécanisme de code de liaison.

3. Le gérant n'a ni mot de passe ni PIN en V1. Il voit toutes les fonctions listées à la section

2, sauf le profil.

4. Sa session partage la date de fin du bar (section 4).

5.4 Récapitulatif des appareils

Propriétaire : 1 appareil actif par bar. Pour changer, le PDG renvoie un lien.

Gérant : 1 appareil actif. Pour changer ou en cas de perte, le propriétaire utilise «

Nouveau gérant » (section 11).

Page 9 of 35

BarPro – Cahier des charges V4

6. Vente (POS) et tickets modifiables 1 h

La vente est réservée au gérant. Le propriétaire n'a pas d'écran de vente : il consulte les

tickets.

6.1 Écran de vente

Grille de cartes, une par boisson active : grande photo, nom, prix de vente à la bouteille,

étiquette de stock. 2 colonnes sur téléphone, 3 ou 4 sur tablette.

Un clic sur la carte ajoute 1 bouteille. Un badge sur la carte affiche la quantité choisie.

Un bouton « − » sur le badge retire 1 bouteille.

Les ventes se font uniquement à la bouteille : il n'y a pas de vente au casier.

Barre du panier en bas de l'écran : liste des lignes (ex. 3 vodka, 2 grandes béninoises),

total en F CFA, bouton OK et bouton Vider.

Barre de recherche et filtres par catégorie (bières, liqueurs, sucreries, eaux, etc.).

6.2 Calcul du total

Le total est calculé automatiquement au clic sur OK.

Prix normal : quantité × prix de vente à la bouteille.

Prix promotionnel : défini par produit sous la forme « N bouteilles pour X F » (ex. 3

bouteilles pour 1 000 F). La promotion s'applique par lots complets de N, le reste au prix

normal.

Total produit = ⌊q / N⌋ × X + (q mod N) × prix unitaire

Exemple : prix 400 F, promo 3 pour 1 000 F, 4 bouteilles vendues = 1 000 + 400 = 1 400 F.

Une mention « Promo appliquée » s'affiche sur la ligne concernée.

6.3 États des cartes

État

Condition

Effet sur la carte

Aspect normal

Vente

Oui

Normal

Reste supérieur ou égal au
seuil d'alerte (1 casier par
défaut)

Alerte

Reste inférieur au seuil

Pulsation jaune douce,
icône et texte « Plus que X »

Oui

Épuisé

Reste = 0

Carte rouge, grisée, icône «
Épuisé »

Non, la carte ne
répond plus au clic

Page 10 of 35

BarPro – Cahier des charges V4

L'appli empêche de dépasser le stock restant : si la quantité demandée dépasse le reste,

un message s'affiche (« Il n'en reste que X »).

6.4 Enregistrement du ticket

Au clic sur OK, l'appli enregistre un ticket contenant : numéro unique, date et heure,

journée commerciale, gérant, appareil, lignes (produit, quantité, prix unitaire appliqué,

promo éventuelle) et total. Le stock baisse immédiatement. Une confirmation brève

s'affiche avec le total, puis le panier se vide. Un bouton « Annuler » reste visible après la

vente.

6.5 Modification pendant 1 heure

Un ticket est modifiable par le gérant pendant 1 heure après sa création : changer les

quantités, ajouter ou retirer une ligne, ou annuler tout le ticket. Le stock est recalculé à

chaque modification.

Chaque modification crée une nouvelle version du ticket. Les versions précédentes

sont conservées dans le journal d'audit (section 16).

Un compte à rebours « Modifiable encore 42 min » s'affiche sur chaque ticket.

Au-delà d'1 heure, le ticket est verrouillé : un cadenas s'affiche et plus aucune

modification n'est possible, ni par le gérant, ni par le propriétaire. Une erreur

découverte plus tard se constate à l'inventaire, sous forme d'écart.

6.6 Fiabilité du délai d'1 heure

L'heure de référence est celle du serveur dès que l'appli est connectée.

Hors connexion, le délai est mesuré avec un chronomètre interne qui ne dépend pas de

l'horloge réglable du téléphone.

À la synchronisation, le serveur compare les heures. Si l'écart dépasse 5 minutes ou si

l'horloge a été reculée, le ticket est marqué « heure suspecte » et le propriétaire est

alerté.

6.7 Liste et détail des tickets

Écran « Tickets du jour » : numéro, heure, total, statut (modifiable ou verrouillé),

recherche par montant ou produit. Un ticket vendu avant 4 h appartient à la journée

commerciale de la veille.

Détail d'un ticket (gérant et propriétaire, ce dernier en consultation) : lignes (produit,
quantité, prix appliqué, promo), heure, total, statut, compte à rebours et historique des

versions. Le gérant voit aussi les ventes du jour par boisson.

Page 11 of 35

BarPro – Cahier des charges V4

7. Stock, pénurie et règles de couleurs

7.1 Onglet Stock

L'onglet Stock contient toutes les boissons disponibles, chacune sous forme de bande

horizontale (photo, nom et quatre valeurs). Il est visible chez le gérant et chez le
propriétaire.

Valeur

Acheté

Vendu

Définition

Total des ravitaillements validés depuis le dernier
inventaire

Total vendu depuis le dernier inventaire (en
bouteilles)

Cassé / défaillant

Total déclaré depuis le dernier inventaire

Reste

Stock théorique actuel, affiché en « X casiers + Y
bouteilles »

Les totaux repartent après chaque inventaire : le stock compté devient la nouvelle base

(section 10). Un sélecteur de période permet aussi de consulter le mois en cours ou une

période libre.

7.2 Couleurs des bandes

Le seuil d'alerte est de 1 casier par défaut (le nombre de bouteilles par casier du produit).

Il se règle produit par produit dans la fiche produit, par le gérant.

Couleur Condition

Marquage non coloré

Vert

Reste supérieur ou égal au seuil d'alerte

Pastille « En stock »

Jaune

Reste inférieur au seuil, mais supérieur à 0

Icône d'alerte et texte « Plus que X »

Rouge

Reste égal à 0

Icône « Épuisé »

7.3 Cartes du POS

Les mêmes règles s'appliquent aux cartes de vente : jaune à pulsation douce sous le seuil,

rouge et non cliquable à 0. La pulsation est lente et discrète. Elle est remplacée par un

contour jaune fixe si le téléphone a le réglage « réduire les animations ». L'information n'est

jamais portée par la couleur seule, pour les personnes daltoniennes.

Page 12 of 35

BarPro – Cahier des charges V4

7.4 Détail d'une boisson

Un clic sur une bande ouvre la fiche détail :

Quantité ravitaillée, avec la liste des ravitaillements concernés (date, gérant, quantité).

Quantité vendue (en bouteilles).

Quantité cassée ou défaillante, avec les motifs.

Reste actuel et dernier inventaire (date, quantité comptée).

Prix d'achat moyen et prix de vente.

Propriétaire uniquement : marge brute par bouteille et bénéfice brut sur la période.

7.5 Onglet Pénurie

Liste automatique des boissons dont le reste est inférieur au seuil.

Les produits épuisés (rouge) sont affichés en premier, puis les produits en alerte

(jaune), triés du plus bas au plus haut.

Chez le gérant, chaque ligne affiche le reste et un bouton « Ravitailler » qui ouvre le

ravitaillement sur ce produit. Chez le propriétaire, la liste est en consultation.

Un badge numérique sur l'onglet indique le nombre de produits en pénurie, visible chez

le propriétaire comme chez le gérant.

Le gérant dispose d'un bouton « Partager la liste de pénurie » qui l'envoie par WhatsApp
(message pré-écrit).

8. Ravitaillement (définitif) et fiche produit

Le ravitaillement est réservé au gérant. Le propriétaire consulte les listes et reçoit les

alertes.

8.1 Fiche produit

Chaque boisson a une fiche, créée à partir d'un catalogue pré-chargé de boissons

courantes au Bénin (avec photos) ou ajoutée par le gérant (photo prise ou choisie,

compressée automatiquement).

Champ

Détail

Nom, photo, catégorie

Libres. La catégorie sert au filtre du POS

Format

Ex. 33 cl, 65 cl, grande, petite

Bouteilles par casier

Obligatoire. Base de tous les calculs
casier/bouteille

Page 13 of 35

BarPro – Cahier des charges V4

Champ

Détail

Prix d'achat par casier

Saisi par le gérant. Sert au coût moyen pondéré

Prix de vente à la bouteille Défini par le gérant

Prix promotionnel

« N bouteilles pour X F » (facultatif)

Seuil d'alerte

1 casier par défaut, modifiable

Actif / inactif

Un produit inactif disparaît du POS mais son
historique est conservé

Seul le gérant crée ou modifie une fiche et ses prix. Le propriétaire les consulte. Chaque

changement de prix est tracé dans le journal d'audit et signalé au propriétaire.

8.2 Saisie d'un ravitaillement (brouillon)

1. L'onglet Ravitaillement affiche les cartes des boissons comme au POS.

2. Un clic sur une carte ouvre une fenêtre de saisie : nombre de casiers et nombre de

bouteilles reçus, avec boutons + et − et pavé numérique.

3. La ligne s'ajoute au brouillon. Le gérant répète l'opération pour chaque boisson.

4. Tant que le ravitaillement n'est pas validé, toutes les lignes sont modifiables et

supprimables.

8.3 Écran de vérification et validation définitive

Au clic sur « Terminer », l'appli affiche le récapitulatif : une ligne par boisson (casiers et

bouteilles), total général, date, nom du gérant. Un message en rouge s'affiche en haut : «

Vérifiez correctement la liste du ravitaillement. Une fois validée, elle n'est plus modifiable

et sera prise en compte dans l'inventaire. »

Modifier : retour au brouillon pour changer, ajouter ou retirer des lignes.

Valider définitivement : actif seulement après avoir coché « J'ai vérifié la liste ».

8.4 Après validation et correction

Le stock augmente. Le ravitaillement est verrouillé (cadenas) : aucune ligne ne peut

plus être modifiée ni supprimée, ni par le gérant, ni par le propriétaire.

Le propriétaire voit la même liste, non modifiable.

En cas d'erreur, le gérant propose une écriture de correction : une nouvelle ligne (en

plus ou en moins) avec motif obligatoire, visible dans la liste sous la mention «

Correction » et dans le journal d'audit. La ligne d'origine n'est jamais modifiée.

Page 14 of 35

BarPro – Cahier des charges V4

Le propriétaire ne fait que la consulter : il reçoit une alerte « Correction de

ravitaillement » avec le motif, le produit, la quantité et l'heure. Il n'a aucune validation à

donner.

Un ravitaillement validé, corrections comprises, est pris en compte dans le stock

théorique de l'inventaire suivant.

8.5 Prix d'achat et coût moyen

À chaque ravitaillement, le gérant renseigne ou confirme le prix d'achat par casier de

chaque ligne.

Le prix d'achat saisi est figé dans la ligne validée, comme les quantités. Tout

changement de prix d'achat est tracé et signalé au propriétaire.

Le coût moyen pondéré est recalculé à chaque ravitaillement.

8.6 Sous-onglet « Liste de ravitaillement »

Affiche par défaut les ravitaillements de la journée commerciale en cours, avec

sélecteur de date pour consulter les jours passés.

Pour chaque ravitaillement : heure, gérant, boissons, quantités, mention « Correction »

si applicable. Total du jour en bas.

Bouton Envoyer par WhatsApp (gérant) : message pré-écrit (section 15) envoyé au

numéro WhatsApp du propriétaire.

Bouton Télécharger en PDF : un fichier PDF de la liste du jour.

Chez le propriétaire, la liste du jour apparaît aussi sur l'écran d'accueil, en lecture seule.

9. Casse et défaillant

La déclaration de casse est réservée au gérant. Un bouton « Déclarer une casse » est

accessible depuis le Stock et depuis le POS.

9.1 Déclaration

Choix de la boisson (carte ou recherche), quantité en bouteilles, motif : Cassée,

Défaillante (bouchon, gaz, goût), Périmée, Autre (précision en texte libre). Photo

facultative.

À la validation, le stock baisse immédiatement et la déclaration apparaît dans la

colonne « Cassé / défaillant » du stock.

Le gérant ne peut pas annuler une déclaration de casse. La casse déclarée est soldée à

l'inventaire suivant : elle entre dans le calcul du stock théorique, puis les compteurs

repartent de zéro.

Page 15 of 35

BarPro – Cahier des charges V4

9.2 Valorisation automatique

Chaque casse est valorisée automatiquement au coût moyen pondéré et affichée en
montant sur les cartes du propriétaire (section 12). Le gérant ne voit jamais ces

montants.

La casse et le défaillant sont une perte supportée par la buvette. Le propriétaire n'a

aucune validation ni décision à prendre sur chaque déclaration.

La casse apparaît comme une perte distincte dans les cartes, le rapport d'inventaire et

les statistiques. Elle n'est jamais déduite du bénéfice brut pour former un « bénéfice

après casse ».

9.3 Alertes

Le propriétaire reçoit une alerte « Casse déclarée » dans l'appli à chaque déclaration. Une

casse inhabituelle (quantité élevée pour un produit, répétitions) est signalée en évidence

dans le rapport d'inventaire.

10. Inventaire, rapports détaillé et financier, audio

L'inventaire compare ce que le gérant compte physiquement avec ce que l'appli calcule. Il

est la clé du contrôle : il produit un rapport détaillé en bouteilles, un rapport financier, un

PDF et un audio pour le propriétaire.

10.1 Qui peut le faire

Le gérant, depuis son appareil, sans code en V1.

Le propriétaire, depuis son propre téléphone. Un inventaire lancé sur l'appareil du

gérant est toujours attribué au gérant.

Un seul inventaire peut être en cours à la fois. Un inventaire commencé peut être repris

(brouillon enregistré).

Tout ravitaillement encore en brouillon doit d'abord être validé ou supprimé.

10.2 Comptage en aveugle

L'écran affiche une bande par boisson : photo, nom, deux champs « Casiers » et «

Bouteilles » à remplir.

Le stock théorique n'est jamais affiché pendant le comptage. Pendant un inventaire en

cours, les quantités de l'onglet Stock sont masquées sur l'appareil du gérant (seuls les

états de couleur restent visibles).

Chaque boisson active doit être renseignée, y compris avec 0 saisi explicitement. Le

bouton de validation reste inactif tant qu'une boisson n'est pas comptée.

Page 16 of 35

BarPro – Cahier des charges V4

Un récapitulatif des quantités comptées est présenté avant validation. La validation

est définitive et horodatée.

10.3 Ce que voit le gérant à la fin

Un simple message : « Inventaire enregistré. Le propriétaire a été informé. » Il ne voit ni les

écarts, ni les montants, ni l'audio. Il peut télécharger la liste du stock compté, sans écarts

(PDF).

10.4 Calcul

Stock théorique = Dernier inventaire + Ravitaillements validés (corrections comprises)

− Ventes − Casse déclarée.

Écart = Stock compté − Stock théorique. Écart négatif = bouteilles manquantes. Écart

positif = surplus.

Les ventes sont comptées en bouteilles. La période couvre du dernier inventaire

jusqu'à la validation du nouvel inventaire.

Premier inventaire : il sert de stock initial. Aucun écart n'est calculé, le rapport indique

seulement « Stock de départ enregistré ».

Les écarts sont calculés produit par produit. Aucune compensation automatique n'est

faite entre deux produits différents.

10.5 Rapport 1 : inventaire détaillé en bouteilles

Un tableau par boisson avec : stock au dernier inventaire, ravitaillé, vendu, cassé ou

défaillant, stock théorique, stock compté, écart en bouteilles (manquant ou surplus). Les

lignes en écart sont mises en évidence. Une synthèse en tête liste les boissons

manquantes et les boissons en surplus.

10.6 Rapport 2 : inventaire financier (propriétaire uniquement)

Ligne

Calcul

Chiffre d'affaires enregistré

Total des tickets de la période (promos incluses)

Valeur des manquants

Bouteilles manquantes × prix de vente à la
bouteille

Casse et défaillant

Valeur des surplus

Bouteilles cassées × coût moyen. Perte de la
buvette

Bouteilles en surplus × prix de vente à la bouteille
(information, non déduite)

Page 17 of 35

BarPro – Cahier des charges V4

Le rapport financier ne contient aucune « somme à verser » ni aucun « bénéfice après

casse ». La V1 suppose que toutes les ventes sont encaissées et remises au propriétaire

(pas de crédit client, ni de dépense déduite). La casse est une perte de la buvette.

10.7 Message pour le propriétaire

Le rapport se termine par un texte généré automatiquement, affiché à l'écran et lu par

l'audio. Modèle :

Inventaire du [date] réalisé par [nom du gérant]. Sur la période du [début] au [fin], le

chiffre d'affaires enregistré est de [X] francs. Les bouteilles manquantes

représentent [Y] francs. La casse déclarée, [W] francs, est une perte de la buvette.

[S'il y a des surplus :] Des surplus ont été constatés sur [boissons]. Cela signifie que

ces boissons n'ont probablement pas été enregistrées (ravitaillement ou vente)

entre le [début] et le [fin].

Si aucun écart n'existe : « Aucun écart constaté sur la période. Le chiffre d'affaires

enregistré est de [X] francs. »

Une alerte de cohérence s'affiche si plus de 90 % des lignes ont un écart nul à l'unité près

(comptage possiblement recopié depuis le stock théorique).

10.8 Boutons d'action en bas du rapport

Télécharger le rapport en PDF : un PDF par inventaire (détaillé + financier + message).

Écouter l'audio : lecture vocale du message, avec pause et « Réécouter ». Le texte reste

toujours affiché.

Le même rapport est disponible sur le téléphone du propriétaire dès la

synchronisation.

10.9 Nouveau stock après l'inventaire

À la validation, sur l'appareil du propriétaire, un message s'affiche et un audio est lu : «

Après cet inventaire réalisé par [nom du gérant], les boissons comptées deviennent le

nouveau stock disponible dans les réfrigérateurs. »

En V1, le stock compté devient automatiquement la nouvelle référence. Le gérant ne

choisit pas. L'écart reste conservé dans le rapport.

Les compteurs « Acheté / Vendu / Cassé » de l'onglet Stock repartent de zéro à partir

de ce nouvel inventaire. Le gérant est renvoyé vers le POS.

Page 18 of 35

BarPro – Cahier des charges V4

10.10 Historique

La liste des inventaires (date, gérant, nombre de manquants, PDF) est consultable par le

propriétaire. Le gérant n'y voit que les listes de stock compté, sans écarts ni montants.

11. Nouveau gérant et téléphone perdu

Dans le profil, le bouton Nouveau gérant ouvre un choix entre deux situations distinctes.

11.1 Cas A : téléphone perdu ou changé (même gérant)

1. Le propriétaire confirme « Même gérant, nouvel appareil ».

2. L'appli génère un nouveau lien (message WhatsApp pré-écrit) et révoque

automatiquement l'ancien lien et l'ancien appareil.

3. Le stock, les ventes, l'historique et le nom du gérant sont conservés. Aucun inventaire

n'est exigé.

4. Avertissement affiché au propriétaire : les ventes faites hors-ligne sur l'ancien

téléphone et non encore synchronisées peuvent être perdues. Dès que l'ancien

appareil retrouve internet, le serveur le bloque.

11.2 Cas B : changement de gérant

1. Le propriétaire saisit le nom du nouveau gérant (ou de la nouvelle gérante).

2. L'appli affiche un message et joue un audio : « Avant la prise de service de [nouveau

nom], faites un inventaire à [ancien nom]. »

3. Deux boutons sont proposés. Inventaire lance l'inventaire de passation (section 10),

sur le téléphone du propriétaire ou sur l'appareil de l'ancien gérant ; il est attribué à

l'ancien gérant et son rapport financier clôture sa période. Inventaire déjà fait affiche

la liste des inventaires récents : seul un inventaire sans vente, ravitaillement ni casse

enregistrés depuis sa validation peut être choisi, sinon l'appli répond « Des

mouvements ont eu lieu depuis cet inventaire. Refaites un inventaire. »

4. Un clic sur un inventaire fait apparaître la liste du stock disponible, téléchargeable en

PDF.

5. Une fois l'inventaire de passation confirmé, l'appli génère le lien du nouveau gérant et

révoque le lien de l'ancien.

6. Le POS du nouveau gérant reste verrouillé tant que l'inventaire de passation n'est pas

validé.

Page 19 of 35

BarPro – Cahier des charges V4

11.3 Règles communes

Un seul gérant actif par bar. Chaque vente, ravitaillement, casse, correction et

inventaire garde le nom du gérant en poste au moment de l'action.

Le stock, les prix, les produits et tout l'historique du bar sont conservés dans tous les

cas.

L'opération est inscrite dans le journal d'audit (date, ancien et nouveau gérant).

12. Tableau de bord propriétaire, journée commerciale et clôture 4 h

12.1 Journée commerciale

Une journée commerciale va de 4 h 00 à 3 h 59 le lendemain (fuseau Africa/Porto-Novo,

UTC+1, sans changement d'heure). Toute vente faite entre minuit et 3 h 59 appartient à

la journée de la veille.

La clôture est automatique à 4 h 00 : elle ne dépend pas d'une tâche de nuit, la

répartition des ventes par journée se calcule à l'affichage. Aucune saisie manuelle de

caisse en V1.

Un ticket vendu à 3 h 30 reste modifiable jusqu'à 4 h 30. Le rapport de la journée est

donc provisoire jusqu'à 5 h 00, puis verrouillé.

12.2 Onglet Ventes du propriétaire : cartes journalières

Chaque journée commerciale est représentée par une carte, la plus récente en haut. À

chaque vente enregistrée par le gérant, la carte du jour se met à jour :

Indicateur

Définition

Chiffre d'affaires

Somme des tickets de la journée

Nombre de tickets

Tickets non annulés

Bénéfice brut

Prix de vente encaissé − prix d'achat (coût moyen
pondéré)

Casse / défaillant

Montant de la casse déclarée, valorisée au coût
moyen. Affiché séparément du bénéfice

Un clic sur une carte ouvre le détail : liste des tickets, ventes par boisson, casse du jour,

ravitaillements du jour. Un bouton exporte le rapport journalier en PDF ou l'envoie par

WhatsApp. Cet écran est en consultation : le propriétaire ne vend ni ne corrige.

Page 20 of 35

BarPro – Cahier des charges V4

12.3 Écran d'accueil du propriétaire

Cartes du jour : chiffre d'affaires, bénéfice brut, casse.

Alertes : pénurie, casse déclarée, stock négatif, tickets à heure suspecte, changement

de prix, correction de ravitaillement, inventaire à consulter.

Indicateur « Dernière synchronisation : [heure] » pour savoir si les chiffres du gérant

sont à jour. Liste de ravitaillement du jour en lecture seule.

Avec plusieurs bars : sélecteur de bar et tableau de bord consolidé.

12.4 Ce que voit le gérant

Son écran Ventes affiche les tickets de la journée (avec leur détail) et le chiffre d'affaires

du jour, sans bénéfice, sans marge ni montant de casse.

13. Statistiques

L'onglet Statistiques propose une période (mois ou année, avec sélecteur) et, pour le

propriétaire, un sélecteur de bar.

Écran

Contenu

Gérant

Propriétaire

Classement des
boissons

Boissons les plus vendues du
mois, en quantité (bouteilles)

Oui

Oui

Détail par boisson

Bouteilles vendues et chiffre
d'affaires, par mois ou par
année

Quantités
seulement

Quantités et chiffre
d'affaires

Bénéfice par
boisson

Bénéfice brut par boisson sur
la période

Chiffre d'affaires
total

Total de la buvette sur la
période, avec comparaison au
mois précédent

Non

Non

Oui

Oui

Casse

Évolution

Montant de la casse déclarée
sur la période, affiché
séparément

Courbe du chiffre d'affaires
par jour (mois) ou par mois
(année)

Non

Oui

Non

Oui

Page 21 of 35

BarPro – Cahier des charges V4

Règles

Les statistiques utilisent les journées commerciales (4 h à 3 h 59) et excluent les

tickets annulés. Toutes les quantités sont comptées en bouteilles.

Aucun écran ne présente de « bénéfice après casse ».

Chaque écran du propriétaire est exportable en PDF (« Télécharger le rapport

statistiques ») avec en-tête du bar, période et date de génération. Le PDF est réservé

au propriétaire.

Avec plusieurs bars, un choix permet de voir un bar, ou la somme de tous.

14. Profil et annexes

L'onglet Profil n'existe que chez le propriétaire.

14.1 Informations du bar

Champ

Source

Modifiable par le propriétaire

Nom de la buvette

Créé par le PDG dans la
console

Oui

RCCM

Saisi par le propriétaire

Oui

Lieu (localisation)

Créé par le PDG

Nom du propriétaire

Créé par le PDG

Oui

Oui

Contact WhatsApp du
propriétaire

Créé par le PDG

Non : modification par le PDG
seulement (les liens sont envoyés à
ce numéro)

Nom du gérant

Saisi par le propriétaire

Oui, via « Nouveau gérant »

Le numéro WhatsApp du propriétaire est utilisé pour envoyer directement les rapports

depuis l'appli du gérant (section 15).

14.2 Actions du profil

Nouveau gérant (section 11).

Lien du gérant : générer ou renvoyer le lien d'installation (section 5).

Appareils connectés : voir et révoquer l'appareil du gérant.

Abonnement : date de fin, saisie d'un code, bouton WhatsApp vers BarPro.

Annexes : liste des bars du propriétaire, ajout d'une annexe (section 4.3).

Page 22 of 35

BarPro – Cahier des charges V4

Produits et prix : consultation des fiches produit et des prix (section 8.1). Aucune

modification : elle est réservée au gérant.

Journal d'audit : consultation, filtrable (section 16.3).

Sécurité : activer ou désactiver le PIN facultatif.

Sauvegarde : export des données du bar (PDF et CSV).

Apparence : mode clair ou sombre.

Aide : guide d'installation, contact BarPro, version de l'appli.

15. Audio, PDF et WhatsApp

15.1 Audio

Message

Quand

Où

Type

Rapport d'inventaire
(montants, noms,
boissons)

Après validation
d'un inventaire

Appareil du
propriétaire

Lecture vocale du texte
généré (synthèse
vocale du téléphone,
français)

Nouveau stock après
inventaire

Après le rapport
d'inventaire

Appareil du
propriétaire

Message fixe avec le
nom du gérant

Avant prise de service
du nouveau gérant

Clic sur « Nouveau
gérant » (cas B)

Appareil du
propriétaire

Message fixe avec les
deux noms

Règles :

Les messages fixes sont enregistrés une fois (voix humaine ou voix de synthèse de

bonne qualité) et fonctionnent hors-ligne. Les noms variables sont lus par la synthèse

vocale.

Les navigateurs interdisent la lecture automatique sans geste de l'utilisateur : l'audio

se déclenche juste après un clic (ex. « Valider l'inventaire » ou « Confirmer »). Sinon un

bouton « Écouter » bien visible est proposé.

La qualité de la voix dépend du téléphone. Le texte est toujours affiché en même

temps, avec un bouton « Réécouter ».

Le gérant n'entend jamais l'audio du rapport financier.

Page 23 of 35

BarPro – Cahier des charges V4

15.2 Documents PDF

Document

Contenu

Réservé au
propriétaire

Liste de ravitaillement
du jour

Ravitaillements de la journée
commerciale, corrections comprises

Rapport d'inventaire

Rapport détaillé, rapport financier,
message final

Liste du stock compté

Stock disponible d'un inventaire, sans
écarts

Rapport journalier

Chiffre d'affaires, tickets, ventes par
boisson, casse, bénéfice brut

Rapport statistiques

Statistiques de la période choisie

Liste de pénurie

Produits en alerte ou épuisés

Non

Oui

Non

Oui

Oui

Non

Chaque inventaire produit son propre fichier PDF. En-tête commun : nom du bar, RCCM,

lieu, date et heure, auteur. Pied de page : « Document généré par BarPro ». Nom de fichier

type : Inventaire_NomBar_2026-10-28_1730.pdf. Les PDF sont générés sur l'appareil

(fonctionne sans connexion).

15.3 WhatsApp

Texte pré-écrit : un lien « wa.me » ouvre WhatsApp avec le message déjà rédigé,

adressé au numéro WhatsApp du propriétaire (profil). Il reste un clic à faire (Envoyer).

PDF : un lien WhatsApp ne peut pas joindre un fichier. Sur mobile, l'appli utilise le

partage natif du téléphone (Web Share) pour ouvrir WhatsApp avec le PDF. Si le

partage de fichier n'est pas disponible, le PDF est téléchargé et l'appli explique

comment l'envoyer.

L'envoi totalement automatique de PDF par WhatsApp (API WhatsApp Business,

payante) est hors V1.

Modèle de message pour la liste de ravitaillement :

Bonjour [nom du propriétaire]. Ravitaillement du [date] au bar [nom du bar], validé à

[heure] par [nom du gérant] : [n] casiers et [m] bouteilles au total. Détail : [produit 1] :

[quantité] ; [produit 2] : [quantité]. Message envoyé depuis BarPro.

Page 24 of 35

BarPro – Cahier des charges V4

16. Hors-ligne, synchronisation, journal d'audit et modèle de
données

16.1 Fonctionnement hors-ligne

L'appli est une PWA : les écrans, photos et données utiles sont mis en cache sur

l'appareil (service worker et base locale IndexedDB).

Vente, ravitaillement, casse et inventaire fonctionnent sans internet. Les actions faites

hors-ligne sont placées dans une file d'attente et envoyées automatiquement au retour

du réseau.

Un indicateur permanent affiche « Synchronisé » ou « X actions en attente ». Le

propriétaire voit la dernière synchronisation de l'appareil du gérant.

Chaque action porte un identifiant unique : un envoi répété ne crée jamais de doublon.

16.2 Principe des données : des événements, jamais d'écrasement

Chaque vente, ravitaillement, casse, inventaire et correction est une ligne ajoutée. Rien

n'est écrasé ni supprimé définitivement.

Le stock est calculé à partir de ces lignes. Cela garde les appareils cohérents après une

coupure réseau.

Si deux appareils vendent hors-ligne la même dernière bouteille, le stock peut devenir

négatif après synchronisation : l'appli l'affiche comme une alerte au propriétaire («

Stock négatif : à vérifier »). Ce comportement est conservé tel quel en V1.

Le stock est conservé en bouteilles et affiché en casiers et bouteilles.

16.3 Journal d'audit (visible du propriétaire)

Chaque action est tracée : qui, quand, quel appareil, quelle action, valeurs avant et après.

Sont notamment tracés : modification ou annulation de ticket, corrections de

ravitaillement, déclarations de casse, changements de prix, changements de gérant,

génération et révocation de lien, saisie de code d'abonnement. Le journal n'est ni
modifiable ni supprimable et peut être filtré par date, utilisateur ou action.

16.4 Heure

L'heure de référence est celle du serveur. Hors-ligne, l'heure du téléphone est utilisée

avec un chronomètre interne, puis contrôlée à la synchronisation.

Toute incohérence (horloge reculée, écart de plus de 5 minutes) est signalée au

propriétaire.

Page 25 of 35

BarPro – Cahier des charges V4

16.5 Entités principales

Entité

Bar

Contenu principal

Nom, RCCM, lieu, propriétaire, statut, dates d'essai
et d'abonnement

Propriétaire, Gérant

Nom, WhatsApp, appareil lié, statut du lien

Lien

Appareil

Produit

Jeton, bar de rattachement, rôle, statut (non utilisé,
activé, révoqué), appareil lié

Identifiant, rôle, date de liaison, dernière
synchronisation, révoqué ou non

Nom, photo, format, bouteilles par casier, prix
d'achat, prix de vente, promo, seuil

Ticket et lignes

Numéro, date, journée commerciale, gérant, lignes,
total, versions

Ravitaillement et lignes

Statut (brouillon, validé), gérant, lignes, corrections
(auteur, motif)

Casse

Produit, quantité, motif, photo, gérant, date. Aucun
champ de décision

Inventaire et lignes

Gérant, période, stock compté par produit, stock
théorique, écarts

Code d'abonnement

Code, durée en mois, statut, bar utilisateur, date
d'utilisation

Journal d'audit

Acteur, action, avant, après, date, appareil

La structure est prévue pour accueillir plus tard les consignes de casiers vides, les modes

de paiement et les dépenses sans refonte.

16.6 Sauvegarde et récupération

Sauvegarde automatique quotidienne côté serveur.

Export des données du bar par le propriétaire (PDF et CSV).

En cas de perte de téléphone, le PDG renvoie un lien : le propriétaire retrouve toutes

ses données.

Données conservées 90 jours après expiration de l'abonnement, puis archivées.

Page 26 of 35

BarPro – Cahier des charges V4

17. Sécurité

Page 27 of 35

BarPro – Cahier des charges V4

Sujet

Exigence

Liens d'accès

Droits

Actions réservées au gérant

Usage unique, liés au premier appareil et à la
buvette, jetons longs et aléatoires, expiration si non
utilisés (durée fixée à la conception)

Contrôlés côté serveur (règles d'accès par rôle). Le
serveur n'envoie jamais au gérant les bénéfices,
marges, valeurs de casse et rapports financiers. Il
n'envoie au propriétaire aucune ligne de bénéfice
après casse

Le serveur refuse toute vente, correction de ticket,
ravitaillement, déclaration de casse ou
changement de prix venant d'un appareil
propriétaire

Console BarPro

Mot de passe fort et double vérification. Journal
des actions

Codes d'abonnement

Usage unique, vérifiés par le serveur, blocage après
5 essais faux

PIN propriétaire

Inventaire du gérant

Délai d'1 heure

Traçabilité

Transport

Appareils

Données personnelles

Facultatif, 4 à 6 chiffres, blocage 5 minutes après 5
erreurs

Comptage en aveugle, quantités masquées
pendant le comptage, alerte si plus de 90 % de
lignes sans écart

Horodatage serveur, chronomètre interne hors-
ligne, détection de retour d'horloge, aucune
modification après 1 h

Journal d'audit non modifiable. Aucune
suppression définitive de transactions

HTTPS partout. Données chiffrées en base

Révocation à distance par le propriétaire (gérant)
ou par le PDG (propriétaire)

Collecte limitée au nécessaire (noms, WhatsApp,
localisation du bar). Conditions d'utilisation et
politique de confidentialité reportées pour le
moment (décision du 29 octobre 2026)

Page 28 of 35

BarPro – Cahier des charges V4

Limite assumée : le gérant connaît les prix d'achat et de vente qu'il saisit, il peut donc en

déduire une marge. Ce point est accepté en V1.

18. Ergonomie et design

L'appli doit pouvoir être utilisée par un gérant occupé, debout derrière le comptoir, sur un

téléphone d'entrée de gamme.

Langue : tout en français, vocabulaire simple (vendre, ravitailler, casse, reste).

Cartes : grandes photos, texte lisible, zones de clic d'au moins 48 pixels, 2 colonnes sur

téléphone et 3 à 4 sur tablette.

Montants : F CFA sans décimales avec séparateur d'espace (« 1 000 F »).

Couleurs et accessibilité : vert, jaune et rouge toujours accompagnés d'une icône et

d'un texte. Contraste suffisant. Pulsation douce du jaune, désactivée si l'utilisateur

demande de réduire les animations.

Mode sombre pour le travail de nuit, bascule dans le profil du propriétaire.

Photos : compressées à l'ajout (environ 400 pixels, format WebP, moins de 60 Ko),

chargées à la demande.

Légèreté : l'appli doit rester fluide sur Android d'entrée de gamme (1 à 2 Go de

mémoire) et sur connexion lente.

Prévention des erreurs : confirmation avant toute action définitive (validation d'un

ravitaillement, d'un inventaire), bouton « Annuler » visible après une vente, messages

d'erreur en français simple.

Première utilisation : 3 écrans d'introduction courts et guide d'installation illustré.

Mode démo : un bar fictif avec données d'exemple, réinitialisable, pour présenter

l'appli sans consommer d'essai.

Navigation : barre d'onglets en bas.

Gérant : Vente, Stock, Pénurie, Ravitaillement, Inventaire, Statistiques.

Propriétaire : Accueil, Ventes (cartes journalières), Stock, Pénurie, Inventaire,

Statistiques et Profil. Les onglets Stock et Pénurie sont en consultation, sans écran

de vente ni de saisie de ravitaillement.

19. Architecture technique recommandée

Un serveur central est nécessaire (abonnements, liens, synchronisation entre

propriétaire et gérant), mais chaque appareil garde une copie locale pour fonctionner

sans internet.

Page 29 of 35

BarPro – Cahier des charges V4

Brique

Choix recommandé

Rôle

App propriétaire et
App gérant

PWA unique (React ou Vue),
deux interfaces selon le rôle

Écrans, logique de vente et de
stock

Hors-ligne

Serveur et base

Fonctions serveur

Console BarPro

PDF

Service worker (Workbox) et
IndexedDB (Dexie)

Cache et file d'attente de
synchronisation

Supabase (base Postgres,
règles d'accès par rôle,
fonctions serveur) ou
équivalent

Génération et vérification des
liens et codes, calcul de
l'expiration, horodatage

Application web séparée, sous-
domaine réservé, double
vérification

jsPDF ou pdfmake, générés sur
l'appareil

Données centrales, liens, codes,
horloge de référence

Logique sensible, hors du
téléphone

Administration du PDG

Rapports, listes, statistiques

Graphiques

Chart.js

Statistiques

Audio

Partage

Hébergement

Fichiers enregistrés (messages
fixes) et synthèse vocale du
navigateur (messages
variables)

Liens WhatsApp « wa.me » et
partage natif du navigateur
(Web Share)

Serveur avec sauvegardes
quotidiennes, certificat HTTPS,
nom de domaine BarPro

Alertes et rapport vocal

Envoi des textes et des PDF

Disponibilité

Principes techniques recommandés :

Modèle par événements : chaque action est une ligne ajoutée, le stock est calculé.

Les vues et fonctions serveur du gérant n'exposent aucune colonne financière

(marges, bénéfices, valeur de casse).

Module de calcul isolé de l'interface (stock, écart, promo, journée commerciale) avec

tests unitaires systématiques.

Environnements : développement, recette (tests avec données fictives) et production.

Page 30 of 35

BarPro – Cahier des charges V4

Compatibilité : Chrome récent sur Android (principal) et Safari récent sur iPhone. Les

versions minimales sont à fixer à la conception, avec tests réels sur des téléphones

d'entrée de gamme. L'installation de la PWA et le passage du lien vers l'appli installée

sont à tester en priorité sur iPhone.

Hors V1 côté technique : notifications push, API WhatsApp Business, agrégateur de

paiement.

20. Hors périmètre V1 et évolutions

Sujet

Décision

Remarque

Consignes (casiers et bouteilles
vides)

Exclu

Structure de données prête pour une
version ultérieure

Modes de paiement (espèces, MTN
MoMo, Moov Money, Celtiis Cash)

Reporté

Le chiffre d'affaires suppose des
ventes encaissées sans crédit

Crédit client (dettes)

Reporté

Fréquent en buvette, à étudier avec
les premiers clients

Dépenses et sorties de caisse

Reporté

Pour un bénéfice net réel

Somme à verser par le gérant

Supprimée

Ne figure plus dans l'appli

Code propriétaire sur l'appareil du
gérant pour l'inventaire

Exclu en V1

Remplacé par le comptage en aveugle
et le rapport réservé au propriétaire

Choix Oui ou Non du gérant sur le
nouveau stock

Remplacé

Le stock compté devient
automatiquement la référence

Recomptage demandé par le
propriétaire

Reporté

Clôture manuelle de caisse
(montant remis)

Paiement automatisé des
abonnements

Envoi automatique de PDF par
WhatsApp

Reporté

La clôture est automatique à 4 h

Reporté

Reporté

Codes manuels en V1. Agrégateur
béninois à étudier ensuite

Nécessite l'API WhatsApp Business
(payante)

Notifications push

Reporté

Alertes dans l'appli en V1

Impression de tickets (imprimante)

Non
demandé

Le ticket est un enregistrement
interne

Page 31 of 35

BarPro – Cahier des charges V4

21. Plan de livraison, recette et décisions

21.1 Phases (durées à fixer avec l'équipe de développement)

Phase

Contenu

Condition de passage

0. Maquettes

1. Socle

2. Vente et stock

3. Ravitaillement et
casse

4. Inventaire

5. Pilotage

6. Pilote

Écrans cliquables : POS,
ravitaillement, inventaire, cartes
du propriétaire, console

Console BarPro, liens liés à la
buvette, codes, essai de 7 jours,
liaison des appareils, rôles, hors-
ligne, journal d'audit

Fiches produit, POS, tickets 1 h,
stock, pénurie, couleurs, cartes
journalières

Brouillon, validation définitive,
corrections proposées par le
gérant, listes, PDF et WhatsApp,
casse

Comptage en aveugle, rapports
détaillé et financier, PDF, audio,
nouveau gérant

Statistiques, profil complet,
annexes, bandeau des 3 jours,
mode lecture seule, mode démo

Validation par le PDG

Test d'installation sur Android et
iPhone, 50 tickets hors-ligne
sans doublon

Tests de la règle d'1 h et des
couleurs

Tests de verrouillage et de
partage

Vérification des formules sur
jeux de données connus

Recette complète

Test réel dans 2 ou 3 bars
pendant 2 à 3 semaines

Retours des gérants et
propriétaires intégrés

21.2 Critères d'acceptation (extraits à tester)

Règle

Test attendu

Ticket modifiable 1 h

Modifiable à 59 min, verrouillé à 61 min, même si
l'horloge du téléphone est reculée. Aucune
modification possible après 1 h, y compris par le
propriétaire

Page 32 of 35

BarPro – Cahier des charges V4

Règle

Test attendu

Vente réservée au gérant Un appareil propriétaire ne peut ni vendre, ni

Promotion

Carte jaune

modifier un ticket, ni saisir un ravitaillement, ni
déclarer une casse

4 bouteilles à 400 F avec promo « 3 pour 1 000 F » =
1 400 F

Reste inférieur à 1 casier : pulsation douce, icône,
texte

Carte rouge

Reste à 0 : carte non cliquable

Pénurie

Produit sous le seuil présent dans l'onglet Pénurie

Ravitaillement

Prix

Inventaire

Formule

Après « Valider définitivement », aucune ligne
modifiable. Correction seulement par écriture
proposée par le gérant, avec motif, visible du
propriétaire avec alerte

Seul le gérant modifie les prix. Chaque changement
est tracé et signalé au propriétaire

Validation impossible si une boisson n'est pas
comptée, stock théorique invisible pendant le
comptage

Écart = compté − (dernier inventaire +
ravitaillements − ventes − casse)

Rapport financier

Aucune « somme à verser », aucun « bénéfice après
casse »

Journée commerciale

Vente à 3 h 30 comptée dans la journée de la veille,
rapport verrouillé à 5 h 00

Hors-ligne

50 tickets créés sans réseau, synchronisés sans
doublon

Lien

Essai

Un lien déjà utilisé est refusé. Renvoyer un lien
révoque l'ancien appareil. Le comportement du lien
suit le statut de la buvette (normal, lecture seule,
bloqué)

7 jours décomptés par le serveur, pas de nouvel
essai après réinstallation

Code d'abonnement

Le code s'ajoute à la date de fin. Un code déjà
utilisé est refusé

Page 33 of 35

BarPro – Cahier des charges V4

Règle

Bandeau

Droits financiers

Nouveau gérant

Test attendu

Affiché à 3 jours ou moins, texte différent chez le
gérant et chez le propriétaire

Le gérant ne reçoit jamais de bénéfice, de marge,
de valeur de casse ni de rapport financier

Le lien de l'ancien gérant est refusé, le stock est
conservé

21.3 Décisions validées

Décisions du 29 octobre 2026 :

1. Seul le gérant vend et corrige ses tickets. Le propriétaire ne vend, ne ravitaille et ne

déclare jamais de casse.

2. Prix d'achat et prix de vente : saisis par le gérant seul. Chaque changement est tracé et

signalé au propriétaire.

3. Vente à la bouteille uniquement : pas de prix de casier ni de vente au casier.

4. Correction d'un ravitaillement validé : proposée par le gérant avec motif, consultée par

le propriétaire, tracée et signalée en alerte.

5. Casse : enregistrée par le gérant, non annulable par lui, valorisée automatiquement,

soldée à l'inventaire suivant. Aucune décision du propriétaire.

6. Inventaire du propriétaire : sur son propre téléphone en V1. Inventaire déjà fait :

utilisable seulement sans mouvement depuis sa validation.

7. Numéro WhatsApp du propriétaire : modifiable uniquement par le PDG.

8. Essai de 7 jours : conservé, durée paramétrable dans la console.

9. Lien de connexion validé selon la buvette.

10. Aucune « somme à verser » et aucun « bénéfice après casse » dans l'appli.

11. Stock négatif après synchronisation : conservé tel quel, avec alerte au propriétaire.

12. Le gérant peut déduire la marge à partir des prix qu'il saisit : limite assumée.

13. Conditions d'utilisation et confidentialité : reportées pour le moment.

21.4 Points restant à confirmer

Ticket verrouillé après 1 h : il est définitif pour tous et l'erreur se règle à l'inventaire.

Alternative possible : un ticket d'annulation tracé, créé par le gérant et signalé au

propriétaire.

Alerte « tickets à heure suspecte » : conservée dans les alertes du propriétaire (anti-

fraude sur l'horloge).

Page 34 of 35

BarPro – Cahier des charges V4

Expiration des liens non utilisés : durée à fixer à la conception (48 à 72 h conseillées).

Données personnelles : prévoir une mention simple avant la commercialisation, même

si les conditions complètes sont reportées.

Chiffrement : préciser s'il s'agit du chiffrement au repos de la base ou d'un

chiffrement applicatif supplémentaire.

Page 35 of 35



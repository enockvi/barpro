# Scénario de test T12 — PWA hors-ligne et synchronisation

## Test manuel : 50 tickets sans réseau, puis synchronisation

### Prérequis
```bash
cd /workspaces/barpro/pwa
npm run build
npm run preview   # sert l'app sur http://localhost:4173
```

### Procédure

1. **Ouvrir l'application** dans un navigateur avec l'outil développeur ouvert (Network tab).

2. **Mettre en mode hors-ligne** : dans l'onglet Network, cocher `Offline`.

3. **Effectuer 50 ventes** :
   - Aller dans l'onglet "Vente"
   - Ajouter des produits au panier (cliquer sur les cartes produit)
   - Valider chaque ticket
   - Répéter 50 fois (ou simuler avec la console : `fetch('/api/sync', {...})` n'existe pas encore, donc les actions restent en file)

4. **Vérifier l'indicateur** :
   - Le bandeau rouge "Hors ligne — les actions sont en attente" doit apparaître en haut
   - Dans le header, l'indicateur doit montrer le nombre d'actions en attente (ex: "50 en attente")

5. **Revenir en ligne** :
   - Dans l'onglet Network, décocher `Offline` (passer en `Online`)
   - L'événement `online` se déclenche automatiquement
   - La fonction `autoSyncOnOnline()` appelle `syncBatch()`

6. **Vérifier la synchronisation** :
   - L'indicateur doit passer à "Synchronisé · HH:MM" (vert)
   - Le bandeau hors-ligne disparaît
   - La file d'attente est vide : `getPendingActions()` retourne `[]`
   - Aucun doublon : chaque ticket a un `clientUUID` unique

### Ce qui est testé

| Vérification | Résultat attendu |
|---|---|
| 50 tickets en file d'attente hors-ligne | `pendingCount === 50` |
| Bandeau rouge visible | `OfflineBanner` render |
| Indicateur "X en attente" dans le header | `SyncIndicator` montre pendingCount |
| Synchronisation automatique au retour en ligne | `syncBatch()` appelé par `online` event |
| File vidée après synchro | `pendingCount === 0` |
| Pas de doublon (idempotence) | Chaque `clientUUID` unique, pas de lignes dupliquées |
| `lastSyncAt` mis à jour | Timestamp actuel |

### Tests unitaires (à écrire quand Dexie sera testable en jsdom)

Le fichier `src/__tests__/offlineSync.test.ts` contiendra :
- `enregistre des tickets et les met en file d'attente`
- `syncBatch vide la file d'attente et met à jour le statut`
- `autoSyncOnOnline ne sync pas si hors-ligne`
- `autoSyncOnOnline sync si en ligne`
- `scénario complet : 50 tickets sans réseau, puis synchronisation`

---

## Comment tester avec `npm run build` puis `npm run preview`

```bash
# Build de production
npm run build

# Servir en local (port 4173 par défaut)
npm run preview

# Ouvrir dans un navigateur
open http://localhost:4173

# Ou en mode incognito pour tester l'installation PWA
```

### Vérifications PWA

1. **Installabilité** : l'icône d'installation apparaît dans la barre d'adresse (Chrome/Edge) ou dans le menu (Firefox/Safari)
2. **Installation** : cliquer sur "Installer" → l'app s'ouvre en mode standalone
3. **Mode avion** : couper le Wi-Fi → le bandeau "Hors ligne" apparaît
4. **Ventes hors-ligne** : faire 5+ ventes → l'indicateur montre "5 en attente"
5. **Retour en ligne** : réactiver le Wi-Fi → synchronisation automatique, indicateur vert "Synchronisé"
6. **Manifest** : inspecter `Application > Manifest` dans les outils dev → name, short_name, icons, theme_color corrects
7. **Service worker** : inspecter `Application > Service Workers` → actif, precache 9 entrées

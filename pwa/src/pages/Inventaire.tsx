import { useState, useEffect } from 'react';
import { dataService } from '../db';
import type { Product, InventaireEvent } from '@barpro/core';

interface CountEntry {
  productId: string;
  casiers: number | undefined;
  bouteilles: number | undefined;
}

function Inventaire() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subTab, setSubTab] = useState<'count' | 'history'>('count');
  const [phase, setPhase] = useState<'start' | 'counting' | 'recap' | 'confirm' | 'done'>('start');
  const [counts, setCounts] = useState<Record<string, CountEntry>>({});
  const [inventaires, setInventaires] = useState<InventaireEvent[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    dataService.getProducts().then(setProducts);
    dataService.getInventaires().then(setInventaires);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const startInventory = () => {
    const initial: Record<string, CountEntry> = {};
    products.forEach(p => {
      initial[p.id] = { productId: p.id, casiers: undefined, bouteilles: undefined };
    });
    setCounts(initial);
    setPhase('counting');
  };

  const setQ = (productId: string, key: 'casiers' | 'bouteilles', value: string) => {
    setCounts(prev => {
      const current = prev[productId] ?? { productId, casiers: undefined, bouteilles: undefined };
      const num = value === '' ? undefined : Math.max(0, parseInt(value, 10) || 0);
      return { ...prev, [productId]: { ...current, [key]: num } };
    });
  };

  const isCounted = (entry: CountEntry) => entry.casiers !== undefined && entry.bouteilles !== undefined;
  const countedCount = Object.values(counts).filter(isCounted).length;
  const totalCount = products.length;
  const progress = totalCount > 0 ? Math.round((countedCount / totalCount) * 100) : 0;
  const allCounted = countedCount === totalCount && totalCount > 0;

  const openRecap = () => setPhase('recap');

  const confirmVal = () => setPhase('confirm');

  const finalize = async () => {
    const counted: Array<{ productId: string; casiers: number; bouteilles: number }> = [];
    for (const entry of Object.values(counts)) {
      if (isCounted(entry) && entry.casiers !== undefined && entry.bouteilles !== undefined) {
        counted.push({ productId: entry.productId, casiers: entry.casiers, bouteilles: entry.bouteilles });
      }
    }

    const event: InventaireEvent = {
      kind: 'inventaire',
      id: `inv-${Date.now()}`,
      createdAt: Date.now(),
      commercialDay: Date.now(),
      managerId: 'manager-demo',
      deviceId: 'device-demo',
      isPassation: false,
      counted,
      passed: true,
    };

    await dataService.addInventaire(event);
    
    // Update local stock based on counted quantities
    const updatedProducts = products.map(p => {
      const entry = counts[p.id] ?? { productId: p.id, casiers: undefined, bouteilles: undefined };
      if (entry && isCounted(entry) && entry.casiers !== undefined && entry.bouteilles !== undefined) {
        const newStock = entry.casiers * p.bottlesPerCase + entry.bouteilles;
        return { ...p, stock: newStock };
      }
      return p;
    });
    
    for (const p of updatedProducts) {
      await dataService.saveProduct(p);
    }
    
    setProducts(updatedProducts);
    
    const all = await dataService.getInventaires();
    setInventaires(all);
    
    setPhase('done');
    showToast('Inventaire enregistré. Le propriétaire a été informé.');
  };

  const getPDFName = (date: string) => {
    const d = date.replace(/\//g, '-');
    return `Stock_compte_${d}.pdf`;
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-forest text-white px-4 py-3 sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">Inventaire</h1>
        <p className="text-xs text-white/60 mt-0.5">
          {phase === 'counting' ? 'Comptage en aveugle' : phase === 'done' ? 'Terminé' : 'Prêt'}
        </p>
      </header>

      {/* Sub-tabs */}
      {phase !== 'done' && (
        <div className="bg-white px-4 py-2 flex gap-2 border-b border-line sticky top-20 z-10">
          <button onClick={() => setSubTab('count')} className={`flex-1 py-2 rounded-full text-sm font-semibold ${subTab === 'count' ? 'bg-forest text-citron' : 'text-neutral'}`}>
            Comptage
          </button>
          <button onClick={() => setSubTab('history')} className={`flex-1 py-2 rounded-full text-sm font-semibold ${subTab === 'history' ? 'bg-forest text-citron' : 'text-neutral'}`}>
            Historique
          </button>
        </div>
      )}

      <main className="px-4 py-4 pb-24">
        {subTab === 'history' && phase !== 'done' && (
          <>
            <div className="space-y-3">
              {inventaires.length === 0 ? (
                <div className="text-center text-neutral py-12 text-sm">Aucun inventaire effectué.</div>
              ) : (
                inventaires.map(inv => (
                  <div key={inv.id} className="bg-white rounded-2xl shadow-soft p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-forest-deep">
                        {new Date(inv.createdAt).toLocaleDateString('fr-FR')} · {new Date(inv.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-neutral mt-0.5">{inv.counted.length} boissons comptées</div>
                    </div>
                    <button className="px-3 py-2 rounded-full bg-forest text-white text-xs font-bold">
                      PDF
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {subTab === 'count' && phase === 'start' && (
          <>
            <div className="bg-limeSoft rounded-2xl p-4 mb-4 text-sm text-forest-deep">
              <strong>Démarrer un inventaire</strong>
              <p className="mt-1 text-neutral">Vous comptez chaque boisson en aveugle : le stock théorique n'est pas affiché. Toutes les boissons doivent être renseignées, 0 compris.</p>
            </div>
            <button onClick={startInventory} className="w-full h-12 rounded-full bg-forest text-white font-bold">
              Démarrer l'inventaire
            </button>
          </>
        )}

        {subTab === 'count' && phase === 'counting' && (
          <>
            {/* Progress */}
            <div className="sticky top-20 bg-paper py-3 z-10 mb-4">
              <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-citron rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-neutral mt-1 text-center">
                {countedCount} sur {totalCount} boissons comptées
              </p>
            </div>

            {/* Product list */}
            <div className="space-y-3">
              {products.map(p => {
                const entry = counts[p.id] ?? { productId: p.id, casiers: undefined, bouteilles: undefined };
                const counted = isCounted(entry);
                return (
                  <div key={p.id} className={`bg-white rounded-2xl shadow-soft p-4 flex items-center gap-4 ${counted ? 'ring-2 ring-limeSoft' : ''}`}>
                    {/* Photo */}
                    <div className="w-12 h-12 rounded-xl bg-paper flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {p.photoPath ? (
                        <img src={`/${p.photoPath}`} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="text-xl">🍾</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-forest-deep flex items-center gap-2">
                        {p.name}
                        {counted && <span className="text-[10px] font-bold bg-limeSoft text-forest-deep px-2 py-0.5 rounded-full">Compté</span>}
                      </div>
                      <div className="text-xs text-neutral mt-0.5">{p.format} · {p.bottlesPerCase} par casier</div>
                      
                      {/* Inputs */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-neutral mb-1">CASIERS</label>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            value={entry?.casiers ?? ''}
                            onChange={e => setQ(p.id, 'casiers', e.target.value)}
                            className="w-full h-10 rounded-xl border-0 bg-paper px-3 text-base font-mono text-center outline-none focus:ring-2 focus:ring-sous-bois/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-neutral mb-1">BOUTEILLES</label>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            value={entry?.bouteilles ?? ''}
                            onChange={e => setQ(p.id, 'bouteilles', e.target.value)}
                            className="w-full h-10 rounded-xl border-0 bg-paper px-3 text-base font-mono text-center outline-none focus:ring-2 focus:ring-sous-bois/40"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={openRecap}
                disabled={!allCounted}
                className="w-full h-12 rounded-full bg-citron text-forest-deep font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Voir le récapitulatif
              </button>
              <button
                onClick={() => showToast('Brouillon enregistré')}
                className="w-full h-12 rounded-full border-2 border-forest text-forest font-bold"
              >
                Enregistrer le brouillon
              </button>
            </div>
          </>
        )}

        {subTab === 'count' && phase === 'recap' && (
          <>
            <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
              <div className="text-sm font-bold text-forest-deep mb-3">Récapitulatif du comptage</div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {products.map(p => {
                  const entry = counts[p.id] ?? { productId: p.id, casiers: undefined, bouteilles: undefined };
                  if (!isCounted(entry)) return null;
                  return (
                    <div key={p.id} className="flex justify-between py-2 border-b border-line last:border-0">
                      <span className="text-sm text-forest-deep">{p.name}</span>
                      <span className="font-mono font-bold text-sm">
                        {entry.casiers} c. + {entry.bouteilles} b.
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={confirmVal} className="flex-1 h-12 rounded-full bg-forest text-white font-bold">
                Valider définitivement
              </button>
              <button onClick={() => setPhase('counting')} className="flex-1 h-12 rounded-full bg-paper text-neutral font-bold">
                Modifier
              </button>
            </div>
          </>
        )}

        {subTab === 'count' && phase === 'confirm' && (
          <>
            <div className="bg-amber-50 rounded-2xl p-4 mb-4 text-sm text-amber-800">
              <strong>Confirmer la validation ?</strong>
              <p className="mt-1">L'inventaire est horodaté et ne pourra plus être modifié. Il sera envoyé au propriétaire.</p>
            </div>

            <div className="flex gap-2">
              <button onClick={finalize} className="flex-1 h-12 rounded-full bg-forest text-white font-bold">
                Oui, valider
              </button>
              <button onClick={() => setPhase('recap')} className="flex-1 h-12 rounded-full bg-paper text-neutral font-bold">
                Retour
              </button>
            </div>
          </>
        )}

        {subTab === 'count' && phase === 'done' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-limeSoft grid place-items-center mx-auto mb-4">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0B3322" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-forest-deep mb-2">Inventaire enregistré</h2>
            <p className="text-sm text-neutral">Le propriétaire a été informé.</p>
            <button
              onClick={() => { setPhase('start'); setSubTab('count'); }}
              className="mt-6 w-full h-12 rounded-full bg-citron text-forest-deep font-bold"
            >
              Retour au POS
            </button>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed left-4 right-4 bottom-20 bg-forest text-white px-4 py-3 rounded-2xl text-sm font-semibold text-center z-30 shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Inventaire;

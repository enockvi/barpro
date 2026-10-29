import { useState, useEffect } from 'react';
import { dataService } from '../db';
import type { Product, RavitaillementEvent, CorrectionEvent } from '@barpro/core';
import { formatMoney } from '@barpro/core';

interface DraftLine {
  productId: string;
  productName: string;
  casiers: number;
  bouteilles: number;
  buyPricePerCase: number;
}

function Ravitaillement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subTab, setSubTab] = useState<'draft' | 'list'>('draft');
  const [draft, setDraft] = useState<DraftLine[]>([]);
  const [ravitaillements, setRavitaillements] = useState<RavitaillementEvent[]>([]);
  const [corrections, setCorrections] = useState<CorrectionEvent[]>([]);
  const [pickProduct, setPickProduct] = useState<Product | null>(null);
  const [pickForm, setPickForm] = useState({ casiers: 0, bouteilles: 0, buyPricePerCase: 0 });
  const [editCorrection, setEditCorrection] = useState<{ ravId: string; productId: string; motif: string; deltaCasiers: number; deltaBouteilles: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    dataService.getProducts().then(list => setProducts(list));
    dataService.getRavitaillements().then(list => setRavitaillements(list));
    dataService.getCorrections().then(list => setCorrections(list));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const addToDraft = (product: Product) => {
    setDraft(prev => {
      const existing = prev.find(l => l.productId === product.id);
      if (existing) return prev.map(l => l.productId === product.id ? { ...l, casiers: l.casiers + 1 } : l);
      return [...prev, { productId: product.id, productName: product.name, casiers: 1, bouteilles: 0, buyPricePerCase: product.buyPricePerCase }];
    });
  };

  const removeFromDraft = (productId: string) => {
    setDraft(prev => prev.filter(l => l.productId !== productId));
  };

  const updateDraftLine = (productId: string, updates: Partial<DraftLine>) => {
    setDraft(prev => prev.map(l => l.productId === productId ? { ...l, ...updates } : l));
  };

  const draftTotal = draft.reduce((s, l) => s + l.casiers * l.buyPricePerCase + Math.round(l.bouteilles * l.buyPricePerCase / (products.find(p => p.id === l.productId)?.bottlesPerCase ?? 12)), 0);

  const validateDraft = async () => {
    if (draft.length === 0) return;
    const event: RavitaillementEvent = {
      kind: 'ravitaillement',
      id: `rav-${Date.now()}`,
      createdAt: Date.now(),
      commercialDay: Date.now(),
      managerId: 'manager-demo',
      deviceId: 'device-demo',
      lines: draft.map(l => ({
        productId: l.productId,
        bottlesPerCase: products.find(p => p.id === l.productId)?.bottlesPerCase ?? 12,
        casiers: l.casiers,
        bouteilles: l.bouteilles,
        buyPricePerBottle: Math.round(l.buyPricePerCase / (products.find(p => p.id === l.productId)?.bottlesPerCase ?? 12)),
      })),
      validatedAt: Date.now(),
      locked: true,
    };
    await dataService.addRavitaillement(event);
    setDraft([]);
    const all = await dataService.getRavitaillements();
    setRavitaillements(all);
    showToast('Ravitaillement validé ✓');
  };

  const proposeCorrection = async () => {
    if (!editCorrection || editCorrection.deltaCasiers === 0 && editCorrection.deltaBouteilles === 0) return;
    const product = products.find(p => p.id === editCorrection.productId);
    const event: CorrectionEvent = {
      kind: 'correction',
      id: `corr-${Date.now()}`,
      createdAt: Date.now(),
      commercialDay: Date.now(),
      managerId: 'manager-demo',
      deviceId: 'device-demo',
      sourceRavitaillementId: editCorrection.ravId,
      productId: editCorrection.productId,
      deltaCasiers: editCorrection.deltaCasiers,
      deltaBouteilles: editCorrection.deltaBouteilles,
      buyPricePerBottle: product ? Math.round(product.buyPricePerCase / product.bottlesPerCase) : 0,
      motif: editCorrection.motif,
    };
    await dataService.addCorrection(event);
    setEditCorrection(null);
    const all = await dataService.getCorrections();
    setCorrections(all);
    showToast('Correction proposée — le propriétaire sera alerté.');
  };

  const fmtQ = (c: number, b: number) => c > 0 ? `${c} casier${c > 1 ? 's' : ''}${b > 0 ? ` + ${b} b.` : ''}` : `${b} b.`;
  const lineAmount = (l: DraftLine) => l.casiers * l.buyPricePerCase + Math.round(l.bouteilles * l.buyPricePerCase / 12);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Header */}
      <header className="bg-forest text-white px-4 py-3 sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">Ravitaillement</h1>
        <p className="text-xs text-white/60 mt-0.5">Journée du {new Date().toLocaleDateString('fr-FR')}</p>
      </header>

      {/* Sub-tabs */}
      <div className="bg-white px-4 py-2 flex gap-2 border-b border-line sticky top-20 z-10">
        <button onClick={() => setSubTab('draft')} className={`flex-1 py-2 rounded-full text-sm font-semibold ${subTab === 'draft' ? 'bg-forest text-citron' : 'text-neutral'}`}>
          Ravitaillement
        </button>
        <button onClick={() => setSubTab('list')} className={`flex-1 py-2 rounded-full text-sm font-semibold ${subTab === 'list' ? 'bg-forest text-citron' : 'text-neutral'}`}>
          Liste du jour
        </button>
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {subTab === 'draft' && (
          <>
            {/* Product grid */}
            <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-3">Boissons</div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {products.filter(p => p.active).map(p => {
                const inDraft = draft.find(d => d.productId === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => { setPickProduct(p); setPickForm({ casiers: inDraft?.casiers ?? 0, bouteilles: inDraft?.bouteilles ?? 0, buyPricePerCase: inDraft?.buyPricePerCase ?? p.buyPricePerCase }); }}
                    className="bg-white rounded-2xl shadow-soft overflow-hidden text-left relative active:scale-[0.97] transition-transform"
                  >
                    {inDraft && (
                      <span className="absolute top-2 right-2 bg-forest text-citron font-mono text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {inDraft.casiers}c
                      </span>
                    )}
                    <div className="h-16 bg-paper flex items-center justify-center">
                      {p.photoPath ? (
                        <img src={`/${p.photoPath}`} alt={p.name} className="w-12 h-14 object-contain" loading="lazy" />
                      ) : (
                        <span className="text-2xl">🍾</span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-xs text-forest-deep truncate">{p.name}</div>
                      <div className="text-[10px] text-neutral mt-0.5">{p.bottlesPerCase} par casier</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Draft list */}
            <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-3">Brouillon</div>
            <div className="bg-white rounded-2xl shadow-soft mb-4 overflow-hidden">
              {draft.length === 0 ? (
                <div className="p-6 text-center text-sm text-neutral">Aucune ligne. Touchez une boisson pour saisir le ravitaillement reçu.</div>
              ) : draft.map((l, i) => (
                <div key={i} className="flex items-center gap-3 p-4 border-b border-line last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-forest-deep truncate">{l.productName}</div>
                    <div className="text-xs text-neutral">{fmtQ(l.casiers, l.bouteilles)} · {formatMoney(l.buyPricePerCase)} le casier</div>
                  </div>
                  <span className="font-mono font-bold text-sm text-forest-deep flex-shrink-0">{formatMoney(lineAmount(l))}</span>
                  <button onClick={() => removeFromDraft(l.productId)} className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0" aria-label="Supprimer">×</button>
                </div>
              ))}
              {draft.length > 0 && (
                <div className="flex justify-between items-center p-4 bg-paper">
                  <span className="text-sm font-semibold text-neutral">Total</span>
                  <span className="font-mono text-lg font-bold text-forest-deep">{formatMoney(draftTotal)}</span>
                </div>
              )}
            </div>

            <button
              onClick={validateDraft}
              disabled={draft.length === 0}
              className="w-full h-12 rounded-full bg-citron text-forest-deep font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Terminer
            </button>
            <p className="text-xs text-neutral text-center mt-3">Les lignes restent modifiables tant que le ravitaillement n'est pas validé.</p>
          </>
        )}

        {subTab === 'list' && (
          <>
            <div className="space-y-4">
              {ravitaillements.map(rav => (
                <div key={rav.id} className="bg-white rounded-2xl shadow-soft p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-sm text-forest-deep">Ravitaillement #{rav.id.slice(-4)}</div>
                      <div className="text-xs text-neutral">{new Date(rav.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <span className="text-xs font-bold bg-limeSoft text-forest-deep px-2 py-1 rounded-full">Validé</span>
                  </div>
                  <div className="space-y-2">
                    {rav.lines.map((line, i) => {
                      const product = products.find(p => p.id === line.productId);
                      const bpc = line.bottlesPerCase || product?.bottlesPerCase || 12;
                      return (
                        <div key={i} className="flex justify-between text-sm py-2 border-b border-line last:border-0">
                          <div>
                            <div className="font-semibold text-forest-deep">{product?.name ?? line.productId}</div>
                            <div className="text-xs text-neutral">{fmtQ(line.casiers, line.bouteilles)}</div>
                          </div>
                          <span className="font-mono font-semibold">{formatMoney(line.buyPricePerBottle * (line.casiers * bpc + line.bouteilles))}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Corrections for this ravitaillement */}
                  {(() => {
                    const corr = corrections.filter(c => c.sourceRavitaillementId === rav.id);
                    if (corr.length === 0) return null;
                    return (
                      <div className="mt-3 pt-3 border-t border-line">
                        <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-2">Corrections</div>
                        {corr.map(c => (
                          <div key={c.id} className="flex justify-between text-sm py-1.5">
                            <div>
                              <span className="text-alert font-semibold">Correction</span>
                              <span className="text-neutral text-xs ml-1">— {c.motif}</span>
                            </div>
                            <span className="font-mono text-xs text-neutral">{fmtQ(c.deltaCasiers, c.deltaBouteilles)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Propose correction button */}
                  <button
                    onClick={() => {
                      const firstProd = rav.lines[0]?.productId;
                      if (firstProd) {
                        const p = products.find(pr => pr.id === firstProd);
                        setEditCorrection({ ravId: rav.id, productId: firstProd, motif: '', deltaCasiers: 0, deltaBouteilles: 0 });
                      }
                    }}
                    className="mt-3 w-full h-10 rounded-full border-2 border-forest text-forest font-bold text-sm"
                  >
                    + Proposer une correction
                  </button>
                </div>
              ))}

              {ravitaillements.length === 0 && (
                <div className="text-center text-neutral py-12 text-sm">Aucun ravitaillement aujourd'hui</div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Pick product sheet */}
      {pickProduct && (
        <div className="fixed inset-0 bg-forest/45 z-30 flex items-end">
          <div className="bg-paper w-full rounded-t-[28px] p-5 pb-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setPickProduct(null)} className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <div>
                <h2 className="text-lg font-extrabold text-forest-deep">{pickProduct.name}</h2>
                <p className="text-xs text-neutral">{pickProduct.format} · {pickProduct.bottlesPerCase} par casier</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral mb-1">CASIERS REÇUS</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPickForm(f => ({ ...f, casiers: Math.max(0, f.casiers - 1) }))} className="w-10 h-10 rounded-full bg-paper border-0 text-xl font-bold">−</button>
                  <span className="font-mono text-2xl font-bold text-forest-deep flex-1 text-center">{pickForm.casiers}</span>
                  <button onClick={() => setPickForm(f => ({ ...f, casiers: f.casiers + 1 }))} className="w-10 h-10 rounded-full bg-paper border-0 text-xl font-bold">+</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral mb-1">BOUTEILLES REÇUES</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPickForm(f => ({ ...f, bouteilles: Math.max(0, f.bouteilles - 1) }))} className="w-10 h-10 rounded-full bg-paper border-0 text-xl font-bold">−</button>
                  <span className="font-mono text-2xl font-bold text-forest-deep flex-1 text-center">{pickForm.bouteilles}</span>
                  <button onClick={() => setPickForm(f => ({ ...f, bouteilles: f.bouteilles + 1 }))} className="w-10 h-10 rounded-full bg-paper border-0 text-xl font-bold">+</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral mb-1">PRIX D'ACHAT PAR CASIER (F)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={pickForm.buyPricePerCase}
                  onChange={e => setPickForm(f => ({ ...f, buyPricePerCase: Number(e.target.value) || 0 }))}
                  className="w-full h-12 rounded-xl border-0 bg-white px-4 text-base outline-none focus:ring-2 focus:ring-sous-bois/40 font-mono"
                />
              </div>

              <div className="bg-paper rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-neutral">Montant de la ligne</span>
                <span className="font-mono text-lg font-bold text-forest-deep">
                  {formatMoney(pickForm.casiers * pickForm.buyPricePerCase + Math.round(pickForm.bouteilles * pickForm.buyPricePerCase / pickProduct.bottlesPerCase))}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  const existing = draft.find(d => d.productId === pickProduct.id);
                  if (existing) {
                    updateDraftLine(pickProduct.id, { ...pickForm });
                  } else {
                    setDraft(prev => [...prev, { productId: pickProduct.id, productName: pickProduct.name, ...pickForm }]);
                  }
                  setPickProduct(null);
                }}
                className="flex-1 h-12 rounded-full bg-citron text-forest-deep font-bold"
              >
                {pickProduct ? (draft.find(d => d.productId === pickProduct.id) ? 'Modifier' : 'Ajouter') : 'Confirmer'}
              </button>
              <button onClick={() => setPickProduct(null)} className="flex-1 h-12 rounded-full bg-paper text-neutral font-bold">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Correction sheet */}
      {editCorrection && (
        <div className="fixed inset-0 bg-forest/45 z-30 flex items-end">
          <div className="bg-paper w-full rounded-t-[28px] p-5 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setEditCorrection(null)} className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <h2 className="text-lg font-extrabold text-forest-deep">Correction de ravitaillement</h2>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 mb-4 text-sm text-amber-800">
              Une correction ne modifie jamais la ligne d'origine. Le propriétaire recevra une alerte.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral mb-1">MOTIF (obligatoire)</label>
                <textarea
                  value={editCorrection.motif}
                  onChange={e => setEditCorrection({ ...editCorrection, motif: e.target.value })}
                  placeholder="Ex: Erreur de saisie, surstock, bris..."
                  className="w-full h-20 rounded-xl border-0 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-sous-bois/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral mb-1">Quantité à corriger</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] text-neutral mb-1">Casiers</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditCorrection(e => e ? {...e, deltaCasiers: e.deltaCasiers - 1} : null)} className="w-8 h-8 rounded-full bg-paper border-0 text-sm font-bold">−</button>
                      <span className="font-mono text-lg font-bold flex-1 text-center">{editCorrection.deltaCasiers}</span>
                      <button onClick={() => setEditCorrection(e => e ? {...e, deltaCasiers: e.deltaCasiers + 1} : null)} className="w-8 h-8 rounded-full bg-paper border-0 text-sm font-bold">+</button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-neutral mb-1">Bouteilles</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditCorrection(e => e ? {...e, deltaBouteilles: e.deltaBouteilles - 1} : null)} className="w-8 h-8 rounded-full bg-paper border-0 text-sm font-bold">−</button>
                      <span className="font-mono text-lg font-bold flex-1 text-center">{editCorrection.deltaBouteilles}</span>
                      <button onClick={() => setEditCorrection(e => e ? {...e, deltaBouteilles: e.deltaBouteilles + 1} : null)} className="w-8 h-8 rounded-full bg-paper border-0 text-sm font-bold">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={proposeCorrection}
                disabled={!editCorrection.motif.trim() || (editCorrection.deltaCasiers === 0 && editCorrection.deltaBouteilles === 0)}
                className="flex-1 h-12 rounded-full bg-citron text-forest-deep font-bold disabled:opacity-40"
              >
                Envoyer la correction
              </button>
              <button onClick={() => setEditCorrection(null)} className="flex-1 h-12 rounded-full bg-paper text-neutral font-bold">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-4 right-4 bottom-20 bg-forest text-white px-4 py-3 rounded-2xl text-sm font-semibold text-center z-30 shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Ravitaillement;

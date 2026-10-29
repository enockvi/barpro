import { useState, useEffect } from 'react';
import { dataService } from '../db';
import type { Product, CasseEvent } from '@barpro/core';

const MOTIFS = ['Cassé', 'Gâté'] as const;
type Motif = typeof MOTIFS[number];

interface Declaration {
  productId: string;
  productName: string;
  qty: number;
  motif: Motif | string;
  heure: string;
}

function Casse() {
  const [products, setProducts] = useState<Product[]>([]);
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [motif, setMotif] = useState<Motif | null>(null);
  const [autre, setAutre] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dataService.getProducts().then(setProducts);
    // Load past declarations from casses events
    dataService.getCasses().then(async (events) => {
      const all: Declaration[] = [];
      for (const ev of events) {
        const p = products.find(pr => pr.id === ev.productId);
        if (p) {
          all.push({
            productId: ev.productId,
            productName: p.name,
            qty: ev.quantity,
            motif: ev.motif,
            heure: new Date(ev.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
          });
        }
      }
      setDeclarations(all.sort((a, b) => new Date(b.heure).getTime() - new Date(a.heure).getTime()));
    });
  }, [products]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const filteredProducts = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePick = (product: Product) => {
    setSelectedProduct(product);
    setQty(1);
    setMotif(null);
    setAutre('');
  };

  const handleConfirm = () => {
    if (!motif || (!motif.includes('Autre') && !motif) || (motif === 'Autre' && !autre.trim())) {
      showToast('Veuillez choisir un motif');
      return;
    }
    setShowConfirm(true);
  };

  const handleDeclare = async () => {
    if (!selectedProduct || !motif) return;
    
    const motifFinal = motif === 'Autre' ? autre : motif;
    
    // Save declaration
    const event: CasseEvent = {
      kind: 'casse',
      id: `casse-${Date.now()}`,
      createdAt: Date.now(),
      commercialDay: Date.now(),
      managerId: 'manager-demo',
      deviceId: 'device-demo',
      productId: selectedProduct.id,
      quantity: qty,
      motif: motif === 'Autre' ? 'autre' : (motif as 'cassée' | 'defaillante' | 'perimee' | 'autre'),
      motifDetail: motif === 'Autre' ? autre : undefined,
    };
    
    await dataService.addCasse(event);
    
    // Add to local declarations list
    const newDecl: Declaration = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      qty,
      motif: motifFinal,
      heure: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    };
    setDeclarations(prev => [newDecl, ...prev]);
    
    // Update stock
    const updatedProduct = { ...selectedProduct, stock: Math.max(0, (selectedProduct.stock ?? 0) - qty) };
    await dataService.saveProduct(updatedProduct);
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
    
    // Reset
    setSelectedProduct(null);
    setQty(1);
    setMotif(null);
    setAutre('');
    setShowConfirm(false);
    showToast('Casse déclarée. Stock mis à jour.');
  };

  const fmtQ = (c: number, b: number) => c > 0 ? `${c} casier${c > 1 ? 's' : ''}${b > 0 ? ` + ${b} b.` : ''}` : `${b} b.`;

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-forest text-white px-4 py-3 sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">Déclarer une casse</h1>
      </header>

      <main className="px-4 py-4 pb-24">
        {/* Note */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-4 text-sm text-blue-800">
          La casse est une perte de la buvette. Elle est soldée à l'inventaire. Aucune décision n'est attendue du propriétaire.
        </div>

        {!selectedProduct ? (
          <>
            {/* Search */}
            <input
              type="text"
              placeholder="Rechercher une boisson..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 rounded-full border-0 bg-white shadow-soft px-4 text-base outline-none mb-4 focus:ring-2 focus:ring-sous-bois/40"
            />

            {/* Product grid */}
            <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-3">Sélectionner une boisson</div>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePick(p)}
                  disabled={(p.stock ?? 0) === 0}
                  className={`bg-white rounded-2xl shadow-soft overflow-hidden text-left relative active:scale-[0.97] transition-transform ${(p.stock ?? 0) === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="h-16 bg-paper flex items-center justify-center">
                    {p.photoPath ? (
                      <img src={`/${p.photoPath}`} alt={p.name} className="w-12 h-14 object-contain" loading="lazy" />
                    ) : (
                      <span className="text-2xl">🍾</span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-xs text-forest-deep truncate">{p.name}</div>
                    <div className="text-[10px] text-neutral mt-0.5">{p.stock ?? 0} b. en stock</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Selected product header */}
            <div className="bg-white rounded-2xl shadow-soft p-4 mb-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-forest-deep">{selectedProduct.name}</div>
                <div className="text-xs text-neutral mt-0.5">Stock : {selectedProduct.stock ?? 0} bouteilles</div>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-sm text-neutral font-semibold px-3 py-2 rounded-full border border-forest">
                Changer
              </button>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-2">Quantité cassée (bouteilles)</div>
              <div className="bg-white rounded-2xl shadow-soft p-4 flex items-center justify-center gap-6">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full bg-paper border-0 text-xl font-bold"
                >−</button>
                <span className="font-mono text-2xl font-bold text-forest-deep min-w-[40px] text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(selectedProduct.stock ?? 99, q + 1))}
                  className="w-10 h-10 rounded-full bg-paper border-0 text-xl font-bold"
                >+</button>
              </div>
            </div>

            {/* Motif */}
            <div className="mb-4">
              <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-2">Motif</div>
              <div className="space-y-2">
                {MOTIFS.map(m => (
                  <button
                    key={m}
                    onClick={() => setMotif(m === 'Autre' ? 'Autre' : m)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                      motif === m ? 'border-forest bg-limeSoft text-forest-deep font-bold' : 'border-transparent bg-white text-neutral'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {motif === 'Autre' && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-neutral mb-1">Précisez le motif</label>
                  <textarea
                    value={autre}
                    onChange={e => setAutre(e.target.value)}
                    placeholder="Ex: Bouchon défectueux, goût étranger..."
                    className="w-full h-20 rounded-xl border-0 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-sous-bois/40 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Declare button */}
            <button
              onClick={handleConfirm}
              disabled={!motif}
              className="w-full h-12 rounded-full bg-error/10 text-error font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Déclarer {qty} bouteille{qty > 1 ? 's' : ''}
            </button>
            <p className="text-xs text-neutral text-center mt-3">
              {selectedProduct.name} · le stock baisse immédiatement
            </p>
          </>
        )}

        {/* Declarations history */}
        <div className="mt-6">
          <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-3">Casses depuis le dernier inventaire</div>
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {declarations.length === 0 ? (
              <div className="p-6 text-center text-sm text-neutral">Aucune casse déclarée depuis le dernier inventaire.</div>
            ) : (
              declarations.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-line last:border-0">
                  <div>
                    <div className="font-semibold text-sm text-forest-deep">{d.productName}</div>
                    <div className="text-xs text-neutral">{d.motif} · {d.heure}</div>
                  </div>
                  <span className="font-mono font-bold text-sm text-forest-deep">{d.qty} b.</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-forest/45 z-30 flex items-end">
          <div className="bg-paper w-full rounded-t-[28px] p-5 pb-8">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 grid place-items-center mx-auto mb-3">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9A2A1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 9l6 6M15 9l-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-forest-deep">Confirmer la casse ?</h3>
              <p className="text-sm text-neutral mt-2">
                {qty} × {selectedProduct?.name} · {(motif === 'Autre' ? autre : motif)}
              </p>
              <p className="text-sm font-bold text-error mt-2">Cette déclaration ne peut pas être annulée.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDeclare}
                className="flex-1 h-12 rounded-full bg-error text-white font-bold"
              >
                Valider la déclaration
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-12 rounded-full bg-paper text-neutral font-bold"
              >
                Retour
              </button>
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

export default Casse;

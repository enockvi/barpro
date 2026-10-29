import { useState, useEffect } from 'react';
import { dataService } from '../db';
import type { Product } from '@barpro/core';
import { productStockStatus, stockStatusLabel } from '@barpro/core';

function StockOwner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<'stock' | 'ravit' | 'prod'>('stock');
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    dataService.getProducts().then(setProducts);
  }, []);

  const penCount = products.filter(p => {
    const s = productStockStatus(p.stock ?? 0, p.bottlesPerCase);
    return s === 'low' || s === 'out';
  }).length;

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-forest text-white px-4 py-3 sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">Stock</h1>
      </header>

      {/* Sub-tabs */}
      <div className="bg-white px-4 py-2 flex gap-2 border-b border-line sticky top-14 z-10">
        {[
          { key: 'stock' as const, label: 'Stock' },
          { key: 'ravit' as const, label: 'Ravitaillements' },
          { key: 'prod' as const, label: 'Produits' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
              view === tab.key ? 'bg-forest text-citron' : 'text-neutral'
            }`}
          >
            {tab.label}
            {tab.key === 'stock' && penCount > 0 && (
              <span className="ml-1 text-[10px] bg-error text-white px-1.5 py-0.5 rounded-full">{penCount}</span>
            )}
          </button>
        ))}
      </div>

      <main className="px-4 py-3 pb-24">
        {view === 'stock' && (
          <>
            <div className="bg-forest text-white rounded-2xl p-4 mb-4">
              <div className="text-sm text-white/75">Total en stock</div>
              <div className="font-mono text-3xl font-bold text-citron mt-1">
                {products.reduce((s, p) => s + (p.stock ?? 0), 0).toLocaleString('fr-FR')} <span className="text-base font-normal">bouteilles</span>
              </div>
              <div className="text-xs text-white/60 mt-1">
                {products.filter(p => productStockStatus(p.stock ?? 0, p.bottlesPerCase) === 'out').length} épuisé{products.filter(p => productStockStatus(p.stock ?? 0, p.bottlesPerCase) === 'out').length > 1 ? 's' : ''} · {products.filter(p => productStockStatus(p.stock ?? 0, p.bottlesPerCase) === 'low').length} en alerte
              </div>
            </div>

            <div className="space-y-2">
              {products
                .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="w-full bg-white rounded-2xl shadow-soft p-4 flex items-center gap-4 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-paper flex-shrink-0 overflow-hidden">
                      {p.photoPath ? (
                        <img src={`/${p.photoPath}`} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="text-xl">🍾</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-forest-deep truncate">{p.name}</div>
                      <div className="text-xs text-neutral">{p.format}</div>
                      <StockBadge product={p} />
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono font-bold text-forest-deep">{p.stock ?? 0} b.</div>
                      <div className="text-xs text-neutral">
                        {Math.floor((p.stock ?? 0) / p.bottlesPerCase)} cas.
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </>
        )}

        {view === 'ravit' && (
          <div className="bg-white rounded-2xl shadow-soft p-4">
            <div className="text-sm text-neutral mb-3 font-semibold">Derniers ravitaillements</div>
            <div className="space-y-3">
              {[
                { date: '29/10 · 08h15', prod: 'Castel 65 cl', qty: '+2 casiers', total: '16 800 F' },
                { date: '29/10 · 08h20', prod: 'Fanta 33 cl', qty: '+3 casiers', total: '17 280 F' },
                { date: '28/10 · 14h30', prod: 'Heineken 33 cl', qty: '+1 casier', total: '14 400 F' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-line last:border-0">
                  <div>
                    <div className="font-semibold text-sm text-forest-deep">{r.prod}</div>
                    <div className="text-xs text-neutral">{r.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-forest-deep">{r.qty}</div>
                    <div className="text-xs text-neutral">{r.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'prod' && (
          <div className="space-y-3">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="w-full bg-white rounded-2xl shadow-soft p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-paper flex-shrink-0 overflow-hidden">
                    {p.photoPath ? (
                      <img src={`/${p.photoPath}`} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-xl">🍾</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-forest-deep">{p.name}</div>
                    <div className="text-xs text-neutral">{p.format} · {p.category}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Sheet */}
      {selected && (
        <div className="fixed inset-0 bg-forest/45 z-30 flex items-end">
          <div className="bg-paper w-full rounded-t-[28px] p-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <h2 className="text-lg font-extrabold text-forest-deep">{selected.name}</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <Kv label="Prix vente" value={`${selected.sellPrice?.toLocaleString('fr-FR')} F`} />
                <Kv label="Prix achat/casier" value={`${selected.buyPricePerCase.toLocaleString('fr-FR')} F`} />
                <Kv label="Bouteilles/casier" value={selected.bottlesPerCase.toString()} />
                <Kv label="Stock" value={`${selected.stock ?? 0} b.`} />
              </div>
              {selected.promo && (
                <div className="mt-3 pt-3 border-t border-line">
                  <Kv label="Promotion" value={`${selected.promo.quantity} pour ${selected.promo.price.toLocaleString('fr-FR')} F`} />
                </div>
              )}
            </div>

            <div className="bg-forest text-white rounded-2xl p-4">
              <div className="text-sm text-white/75">Coût moyen pondéré</div>
              <div className="font-mono text-2xl font-bold text-citron mt-1">
                {(selected.buyPricePerCase / selected.bottlesPerCase).toLocaleString('fr-FR')} F/bte
              </div>
              {selected.sellPrice && (
                <div className="text-xs text-white/60 mt-1">
                  Marge : {(selected.sellPrice - selected.buyPricePerCase / selected.bottlesPerCase).toLocaleString('fr-FR')} F/bte
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StockBadge({ product }: { product: Product }) {
  const stk = productStockStatus(product.stock ?? 0, product.bottlesPerCase);
  const sl = stockStatusLabel(stk, product.stock ?? 0);
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${
      stk === 'ok' ? 'bg-limeSoft text-forest-deep' :
      stk === 'low' ? 'bg-amber-100 text-amber-700' :
      'bg-red-100 text-red-700'
    }`}>
      {sl.label}
    </span>
  );
}

function Kv({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-neutral mb-0.5">{label}</div>
      <div className="font-mono font-semibold text-sm text-forest-deep">{value}</div>
    </div>
  );
}

export default StockOwner;

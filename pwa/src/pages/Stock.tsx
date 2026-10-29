import { useState, useEffect } from 'react';
import { dataService } from '../db';
import type { Product } from '@barpro/core';
import { productStockStatus, stockStatusLabel } from '@barpro/core';
import { ProductCard } from '../components/product/ProductCard';

type View = 'stock' | 'penurie';

function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<View>('stock');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    dataService.getProducts().then(list => setProducts(list));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const penCount = products.filter(p => {
    const s = productStockStatus(p.stock ?? 0, p.bottlesPerCase);
    return s === 'low' || s === 'out';
  }).length;

  const filtered = products
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (view === 'penurie') {
        const sa = productStockStatus(a.stock ?? 0, a.bottlesPerCase);
        const sb = productStockStatus(b.stock ?? 0, b.bottlesPerCase);
        if (sa !== sb) return sa === 'out' ? -1 : sb === 'out' ? 1 : 0;
        return (a.stock ?? 0) - (b.stock ?? 0);
      }
      return a.name.localeCompare(b.name);
    });

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
  };

  const saveProduct = async () => {
    if (!editing) return;
    const updated: Product = { ...editing, ...form };
    await dataService.saveProduct(updated);
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditing(null);
    showToast('Produit mis à jour');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Header */}
      <header className="bg-forest text-white px-4 py-3 sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">Stock</h1>
      </header>

      {/* Sub-tabs */}
      <div className="bg-white px-4 py-2 flex gap-2 border-b border-line sticky top-14 z-10">
        <button
          onClick={() => setView('stock')}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
            view === 'stock' ? 'bg-forest text-citron' : 'text-neutral'
          }`}
        >
          Stock
        </button>
        <button
          onClick={() => setView('penurie')}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors relative ${
            view === 'penurie' ? 'bg-forest text-citron' : 'text-neutral'
          }`}
        >
          Pénurie
          {penCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
              {penCount}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-paper sticky top-28 z-10">
        <input
          type="text"
          placeholder="Rechercher une boisson..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 rounded-full border-0 bg-white shadow-soft px-4 text-base outline-none focus:ring-2 focus:ring-sous-bois/40"
        />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-3 pb-24">
        {view === 'stock' && (
          <>
            <div className="text-xs text-neutral mb-3 font-semibold uppercase tracking-wider">
              {filtered.length} produit{filtered.length > 1 ? 's' : ''}
            </div>
            <div className="space-y-3">
              {filtered.map(p => (
                <StockBand key={p.id} product={p} onTap={() => openEdit(p)} />
              ))}
            </div>
          </>
        )}

        {view === 'penurie' && (
          <>
            <div className="bg-amber-50 rounded-2xl p-4 mb-4 text-sm text-amber-800">
              <strong>À réapprovisionner</strong> — épuisés en premier, puis du plus bas au plus haut.
            </div>
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="text-center text-neutral py-12 text-sm">Tout est en stock ✓</div>
              )}
              {filtered.map(p => (
                <StockBand key={p.id} product={p} onTap={() => openEdit(p)} showAlert />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Edit Sheet */}
      {editing && (
        <div className="fixed inset-0 bg-forest/45 z-30 flex items-end">
          <div className="bg-paper w-full rounded-t-[28px] p-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setEditing(null)} className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <h2 className="text-lg font-extrabold text-forest-deep">Fiche produit</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nom" value={form.name ?? ''} onChange={v => setForm(f => ({ ...f, name: v }))} />
                <Field label="Format" value={form.format ?? ''} onChange={v => setForm(f => ({ ...f, format: v }))} />
                <Field label="Bouteilles/casier" type="number" value={form.bottlesPerCase ?? 0} onChange={v => setForm(f => ({ ...f, bottlesPerCase: Number(v) }))} />
                <Field label="Seuil alerte (casiers)" type="number" value={form.alertThreshold ?? 1} onChange={v => setForm(f => ({ ...f, alertThreshold: Number(v) }))} />
                <Field label="Prix vente (F)" type="number" value={form.sellPrice ?? ''} onChange={v => setForm(f => ({ ...f, sellPrice: v === '' ? null : Number(v) }))} />
                <Field label="Prix achat/casier (F)" type="number" value={form.buyPricePerCase ?? 0} onChange={v => setForm(f => ({ ...f, buyPricePerCase: Number(v) }))} />
              </div>
              <div className="mt-3">
                <label className="block text-xs font-semibold text-neutral mb-1">Promotion</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="N bouteilles"
                    className="h-10 rounded-xl border-0 bg-paper px-3 text-sm flex-1 outline-none focus:ring-2 focus:ring-sous-bois/40"
                    value={form.promo?.quantity ?? ''}
                    onChange={e => setForm(f => ({
                      ...f,
                      promo: e.target.value ? { quantity: Number(e.target.value), price: f.promo?.price ?? 0 } : null
                    }))}
                  />
                  <input
                    type="number"
                    placeholder="Prix promo"
                    className="h-10 rounded-xl border-0 bg-paper px-3 text-sm flex-1 outline-none focus:ring-2 focus:ring-sous-bois/40"
                    value={form.promo?.price ?? ''}
                    onChange={e => setForm(f => ({
                      ...f,
                      promo: f.promo ? { ...f.promo, price: Number(e.target.value) } : null
                    }))}
                  />
                </div>
                {form.promo && (
                  <div className="mt-1 text-xs text-sous-bois font-semibold">
                    {form.promo.quantity} pour {form.promo.price.toLocaleString('fr-FR')} F
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={saveProduct} className="flex-1 h-12 rounded-full bg-citron text-forest-deep font-bold">
                Sauvegarder
              </button>
              <button onClick={() => setEditing(null)} className="flex-1 h-12 rounded-full bg-paper text-neutral font-bold">
                Annuler
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

function StockBand({ product, onTap, showAlert = false }: {
  product: Product;
  onTap: () => void;
  showAlert?: boolean;
}) {
  const stock = product.stock ?? 0;
  const stk = productStockStatus(stock, product.bottlesPerCase);
  const sl = stockStatusLabel(stk, stock);
  const casiers = Math.floor(stock / product.bottlesPerCase);
  const bouteilles = stock % product.bottlesPerCase;
  const resteText = bouteilles > 0 ? `${casiers} casier${casiers > 1 ? 's' : ''} + ${bouteilles} b.` : `${casiers} casier${casiers > 1 ? 's' : ''}`;

  return (
    <button
      onClick={onTap}
      className={`w-full bg-white rounded-2xl shadow-soft p-4 flex items-center gap-4 text-left transition-transform active:scale-[0.98] ${
        stk === 'out' ? 'opacity-60' : ''
      } ${showAlert && stk !== 'ok' ? 'ring-2 ring-amber-300' : ''}`}
    >
      {/* Photo */}
      <div className="w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden bg-paper flex items-center justify-center">
        {product.photoPath ? (
          <img src={`/${product.photoPath}`} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-2xl">🍾</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-forest-deep truncate">{product.name}</div>
        <div className="text-xs text-neutral mt-0.5">{product.format}</div>
        <div className="flex items-center gap-1 mt-1">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            stk === 'ok' ? 'bg-limeSoft text-forest-deep' :
            stk === 'low' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {stk === 'ok' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12l5 5L20 7" /></svg>}
            {stk === 'low' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 8v5M12 17h.01" /><path d="M10.3 3.9L2.5 17.5A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>}
            {stk === 'out' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>}
            {sl.label}
          </span>
        </div>
      </div>

      {/* Quantities */}
      <div className="text-right flex-shrink-0">
        <div className="font-mono text-sm font-bold text-forest-deep">{stock} b.</div>
        <div className="text-xs text-neutral mt-0.5">{resteText}</div>
        {product.sellPrice && (
          <div className="font-mono text-xs font-semibold text-forest-deep mt-1">
            {product.sellPrice.toLocaleString('fr-FR')} F
          </div>
        )}
      </div>
    </button>
  );
}

function Field({ label, value, onChange, type = 'text' }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-10 rounded-xl border-0 bg-paper px-3 text-sm outline-none focus:ring-2 focus:ring-sous-bois/40"
      />
    </div>
  );
}

export default Stock;

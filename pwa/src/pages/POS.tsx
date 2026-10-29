import { useState, useEffect } from 'react';
import { dataService } from '../db';
import type { Product, TicketEvent } from '@barpro/core';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../hooks/useCart';

function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showConf, setShowConf] = useState(false);
  const [lastTicket, setLastTicket] = useState<TicketEvent | null>(null);
  const { lines, total, count, toast, showToast, addToCart, changeQty, clearCart } = useCart(products);

  useEffect(() => {
    dataService.getProducts().then(list => setProducts(list.length > 0 ? list : []));
  }, []);

  const categories = ['all', 'Bières', 'Sucreries', 'Eaux minérales'];
  const filtered = products
    .filter(p => filter === 'all' || p.category === filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const handleConfirm = async () => {
    if (lines.length === 0) return;
    const now = Date.now();
    const ticket: TicketEvent = {
      kind: 'ticket',
      id: `t-${now}`,
      createdAt: now,
      commercialDay: now,
      managerId: 'manager-demo',
      deviceId: 'device-demo',
      lines: lines.map(l => ({
        productId: l.productId,
        productName: l.productName,
        qty: l.qty,
        unitPrice: l.unitPrice,
        promoApplied: l.promoApplied,
        lineTotal: l.lineTotal,
      })),
      total,
      cancelled: false,
    };
    await dataService.addTicket(ticket);
    setLastTicket(ticket);
    setShowConf(true);
    clearCart();
  };

  const cartMap = new Map(lines.map(l => [l.productId, l.qty]));

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Header */}
      <header className="bg-forest text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">Vente</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">Jour</span>
          <span className="font-mono font-bold text-citron">{total.toLocaleString('fr-FR')} F</span>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-3 bg-paper sticky top-14 z-10">
        <input
          type="text"
          placeholder="Rechercher une boisson..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 rounded-full border-0 bg-white shadow-soft px-4 text-base outline-none focus:ring-2 focus:ring-sous-bois/40"
        />
      </div>

      {/* Categories */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-paper">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
              filter === cat ? 'bg-forest text-citron' : 'bg-white text-neutral shadow-soft'
            }`}
          >
            {cat === 'all' ? 'Toutes' : cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-48">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              qtyInCart={cartMap.get(p.id) ?? 0}
              onAdd={() => addToCart(p)}
              onMinus={() => changeQty(p.id, -1)}
              onPlus={() => changeQty(p.id, 1)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-neutral py-12 text-sm">Aucune boisson trouvée</div>
        )}
      </div>

      {/* Cart Footer */}
      {lines.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-forest text-white rounded-t-[28px] px-4 pb-6 pt-4 shadow-[0_-10px_30px_rgba(6,35,22,.25)] z-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-sm text-white/75">Total</span>
              <span className="font-mono text-2xl font-bold text-citron">{total.toLocaleString('fr-FR')} F</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={clearCart}
                className="h-12 rounded-full border-0 bg-white/12 text-white font-bold text-sm"
              >
                Vider
              </button>
              <button
                onClick={handleConfirm}
                className="h-12 rounded-full border-0 bg-citron text-forest-deep font-bold text-base"
              >
                Valider ({count} b.)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConf && lastTicket && (
        <div className="fixed inset-0 bg-forest/45 flex items-center justify-center p-6 z-30">
          <div className="bg-paper rounded-[28px] p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-limeSoft grid place-items-center mx-auto mb-4">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0B3322" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-forest-deep">Ticket #{lastTicket.id.slice(-4)}</h2>
            <p className="font-mono text-3xl font-bold text-forest-deep mt-2">{lastTicket.total.toLocaleString('fr-FR')} F</p>
            <p className="text-sm text-neutral mt-2">{lines.reduce((s,l)=>s+l.qty,0)} bouteilles · {lines.length} produit(s)</p>
            <button
              onClick={() => setShowConf(false)}
              className="w-full h-12 rounded-full bg-forest text-white font-bold mt-6"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-4 right-4 top-20 bg-forest text-white px-4 py-3 rounded-2xl text-sm font-semibold text-center z-30 shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}

export default POS;

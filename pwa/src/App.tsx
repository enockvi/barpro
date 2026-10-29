import { useState, useEffect } from 'react';
import { dataService } from './db';
import type { Product } from '@barpro/core';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dataService.getProducts().then(list => {
      if (list.length === 0) {
        import('@barpro/core').then(m => {
          const initial = m.getInitialProducts();
          initial.forEach(p => dataService.saveProduct(p));
          setProducts(initial);
        });
      } else {
        setProducts(list);
      }
    });
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  const startEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setSaved(false); };
  const handleSave = async () => {
    if (!editing) return;
    const updated: Product = { ...editing, ...form };
    await dataService.saveProduct(updated);
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditing(null); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const toggleActive = async (p: Product) => {
    const updated = { ...p, active: !p.active };
    await dataService.saveProduct(updated);
    setProducts(prev => prev.map(x => x.id === p.id ? updated : x));
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-forest text-white py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-extrabold tracking-tight">Bar<span className="text-citron">Pro</span> — Fiches produit</h1>
        {saved && <span className="text-citron text-sm font-semibold">Sauvegardé</span>}
      </header>
      <main className="p-4 max-w-4xl mx-auto space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${filter === cat ? 'bg-forest text-citron' : 'bg-white text-neutral shadow-soft'}`}>
              {cat === 'all' ? 'Toutes' : cat}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map(p => editing?.id === p.id
            ? <EditForm key={p.id} form={form} setForm={setForm} onSave={handleSave} onCancel={() => setEditing(null)} />
            : <ProductCard key={p.id} p={p} onEdit={() => startEdit(p)} onToggle={() => toggleActive(p)} />
          )}
        </div>
      </main>
    </div>
  );
}

function ProductCard({ p, onEdit, onToggle }: { p: Product; onEdit: () => void; onToggle: () => void }) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft p-4 flex items-center gap-4 ${!p.active ? 'opacity-50' : ''}`}>
      {p.photoPath
        ? <img src={`/${p.photoPath}`} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-paper flex-shrink-0" />
        : <div className="w-14 h-14 rounded-xl bg-paper flex items-center justify-center text-2xl flex-shrink-0">🍾</div>}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-forest-deep truncate">{p.name}</div>
        <div className="text-sm text-neutral">{p.format} · {p.size || '—'}</div>
        <div className="font-mono text-sm font-semibold text-forest-deep mt-1">
          {p.sellPrice ? `${p.sellPrice.toLocaleString('fr-FR')} F` : <span className="text-alert">Prix à renseigner</span>}
          {p.promo && <span className="text-xs text-sous-bois ml-2">({p.promo.quantity} pour {p.promo.price.toLocaleString('fr-FR')} F)</span>}
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button onClick={onEdit} className="px-3 py-2 rounded-full bg-forest text-white text-sm font-semibold">Modifier</button>
        <button onClick={onToggle} className={`px-3 py-2 rounded-full text-sm font-semibold ${p.active ? 'bg-error/10 text-error' : 'bg-limeSoft text-forest-deep'}`}>
          {p.active ? 'Désactiver' : 'Activer'}
        </button>
      </div>
    </div>
  );
}

function EditForm({ form, setForm, onSave, onCancel }: {
  form: Partial<Product>; setForm: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  onSave: () => void; onCancel: () => void;
}) {
  const set = (k: string, v: string | number | boolean | null) => setForm((prev: any) => ({ ...prev, [k]: v }));
  return (
    <div className="bg-white rounded-2xl shadow-soft p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nom" value={form.name ?? ''} onChange={v => set('name', v)} />
        <Field label="Catégorie" value={form.category ?? ''} onChange={v => set('category', v)} />
        <Field label="Format" value={form.format ?? ''} onChange={v => set('format', v)} />
        <select className="h-12 rounded-xl border-0 bg-paper px-4 text-base" value={form.size ?? ''} onChange={e => set('size', e.target.value)}>
          <option value="">—</option><option value="Petit">Petit</option><option value="Grand">Grand</option><option value="Cannette">Cannette</option>
        </select>
        <Field label="Bouteilles/casier" type="number" value={form.bottlesPerCase ?? 0} onChange={v => set('bottlesPerCase', Number(v))} />
        <Field label="Prix achat/casier (F)" type="number" value={form.buyPricePerCase ?? 0} onChange={v => set('buyPricePerCase', Number(v))} />
        <Field label="Prix vente (F)" type="number" value={form.sellPrice ?? ''} onChange={v => set('sellPrice', v === '' ? null : Number(v))} />
        <Field label="Seuil alerte (casiers)" type="number" value={form.alertThreshold ?? 1} onChange={v => set('alertThreshold', Number(v))} />
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex-1 h-12 rounded-full bg-citron text-forest-deep font-semibold">Sauvegarder</button>
        <button onClick={onCancel} className="flex-1 h-12 rounded-full bg-paper text-neutral font-semibold">Annuler</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-12 rounded-xl border-0 bg-paper px-4 text-base outline-none focus:ring-2 focus:ring-sous-bois/40" />
    </div>
  );
}

export default App;

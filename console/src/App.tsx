import { useState } from 'react';
import { Logo } from '../../pwa/src/components';

interface Bar {
  id: string;
  name: string;
  owner: string;
  whatsapp: string;
  location: string;
  status: 'normal' | 'trial' | 'soon' | 'expired' | 'suspended';
  link: string;
  code: string;
  manager?: string;
  createdAt: string;
}

function Console() {
  const [bars, setBars] = useState<Bar[]>([
    { id: '1', name: 'Buvette Chez Mama Africa', owner: 'M. Adjovi', whatsapp: '+229 01 90 00 00 01', location: 'Cotonou', status: 'normal', link: 'https://barpro.app/link/abc123', code: 'ABCD1234EFGH', manager: 'Rachelle', createdAt: '15/10/2026' },
    { id: '2', name: 'Buvette Centre', owner: 'M. Kpadé', whatsapp: '+229 01 75 00 00 02', location: 'Cotonou', status: 'trial', link: 'https://barpro.app/link/def456', code: 'WXYZ7890MNOP', createdAt: '28/10/2026' },
    { id: '3', name: 'Buvette Plateau', owner: 'Mme. Houénou', whatsapp: '+229 01 60 00 00 03', location: 'Porto-Novo', status: 'soon', link: 'https://barpro.app/link/ghi789', code: 'QRST4567UVWX', manager: 'Jean', createdAt: '01/10/2026' },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [showPanel, setShowPanel] = useState<Bar | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleCreate = () => {
    const newBar: Bar = {
      id: String(bars.length + 1),
      name: 'Nouvelle buvette',
      owner: '',
      whatsapp: '',
      location: '',
      status: 'trial',
      link: `https://barpro.app/link/${Math.random().toString(36).slice(2)}`,
      code: Math.random().toString(36).substring(2, 14).toUpperCase(),
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };
    setBars([...bars, newBar]);
    setShowCreate(false);
    showToast('Bar créé');
  };

  const handleSuspend = (bar: Bar) => {
    setBars(prev => prev.map(b => b.id === bar.id ? { ...b, status: 'suspended' } : b));
    setShowPanel(null);
    showToast('Bar suspendu');
  };

  const handleReactivate = (bar: Bar) => {
    setBars(prev => prev.map(b => b.id === bar.id ? { ...b, status: 'normal' } : b));
    setShowPanel(null);
    showToast('Bar réactivé');
  };

  const statusBadge = (status: Bar['status']) => {
    const styles = {
      normal: 'bg-limeSoft text-forest-deep',
      trial: 'bg-blue-100 text-blue-800',
      soon: 'bg-amber-100 text-amber-700',
      expired: 'bg-red-100 text-red-700',
      suspended: 'bg-forest text-citron',
    };
    const labels = {
      normal: 'Actif',
      trial: 'Essai',
      soon: 'Fin proche',
      expired: 'Expiré',
      suspended: 'Suspendu',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Sidebar */}
      <aside className="w-64 bg-forest text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Logo size="lg" />
          <div className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Console PDG</div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            { icon: '🏪', label: 'Bars', active: true },
            { icon: '🔑', label: 'Codes', active: false },
            { icon: '📊', label: 'Statistiques', active: false },
            { icon: '📝', label: 'Journal', active: false },
            { icon: '⚙️', label: 'Paramètres', active: false },
          ].map(item => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-citron/14 text-citron' : 'text-white/72 hover:text-white'}`}>
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/60 mb-2">Connecté</div>
          <div className="font-semibold text-sm">PDG BarPro</div>
          <button className="mt-3 w-full h-9 rounded-full border border-white/30 text-white/72 text-xs font-semibold">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-forest-deep">Gestion des bars</h1>
              <p className="text-neutral mt-1">{bars.length} buvette{bars.length > 1 ? 's' : ''} enregistrée{bars.length > 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="h-11 px-5 rounded-full bg-citron text-forest-deep font-bold text-sm">
              + Créer un bar
            </button>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Actifs', count: bars.filter(b => b.status === 'normal').length, color: 'text-forest-deep' },
              { label: 'En essai', count: bars.filter(b => b.status === 'trial').length, color: 'text-blue-600' },
              { label: 'Fin proche', count: bars.filter(b => b.status === 'soon').length, color: 'text-amber-600' },
              { label: 'Expirés', count: bars.filter(b => b.status === 'expired').length, color: 'text-red-600' },
              { label: 'Suspendus', count: bars.filter(b => b.status === 'suspended').length, color: 'text-forest' },
            ].map(counter => (
              <div key={counter.label} className="bg-white rounded-2xl p-4 shadow-soft">
                <div className={`text-2xl font-extrabold ${counter.color}`}>{counter.count}</div>
                <div className="text-xs text-neutral font-semibold mt-1">{counter.label}</div>
              </div>
            ))}
          </div>

          {/* Bars list */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">Bar</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">Propriétaire</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">Gérant</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">Statut</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral uppercase tracking-wider">Créé le</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {bars.map(bar => (
                  <tr key={bar.id} onClick={() => setShowPanel(bar)} className="border-b border-line last:border-0 hover:bg-paper cursor-pointer transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-forest-deep">{bar.name}</div>
                      <div className="text-xs text-neutral mt-0.5">{bar.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{bar.owner}</div>
                      <div className="text-xs text-neutral mt-0.5">{bar.whatsapp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{bar.manager || '—'}</div>
                    </td>
                    <td className="px-6 py-4">{statusBadge(bar.status)}</td>
                    <td className="px-6 py-4 text-neutral">{bar.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-forest/45 z-30 flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-extrabold text-forest-deep mb-4">Créer un nouveau bar</h2>
            <div className="space-y-3 mb-6">
              <input placeholder="Nom du bar" className="w-full h-11 rounded-xl border-0 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-sous-bois/40" />
              <input placeholder="Nom du propriétaire" className="w-full h-11 rounded-xl border-0 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-sous-bois/40" />
              <input placeholder="WhatsApp (ex: +229...)" className="w-full h-11 rounded-xl border-0 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-sous-bois/40" />
              <input placeholder="Localisation" className="w-full h-11 rounded-xl border-0 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-sous-bois/40" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} className="flex-1 h-11 rounded-full bg-citron text-forest-deep font-bold">
                Créer
              </button>
              <button onClick={() => setShowCreate(false)} className="flex-1 h-11 rounded-full bg-paper text-neutral font-bold">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {showPanel && (
        <div className="fixed inset-0 bg-forest/45 z-30 flex justify-end">
          <div className="bg-paper w-full max-w-lg h-full overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-forest-deep">{showPanel.name}</h2>
              <button onClick={() => setShowPanel(null)} className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-5 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-neutral mb-1">Propriétaire</div>
                  <div className="font-semibold text-forest-deep">{showPanel.owner}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral mb-1">WhatsApp</div>
                  <div className="font-semibold text-forest-deep">{showPanel.whatsapp}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral mb-1">Localisation</div>
                  <div className="font-semibold text-forest-deep">{showPanel.location}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral mb-1">Gérant</div>
                  <div className="font-semibold text-forest-deep">{showPanel.manager || 'Non attribué'}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-3">Lien d'accès</div>
              <div className="bg-forest text-citron font-mono text-sm rounded-xl p-4 break-all">
                {showPanel.link}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(showPanel.link); showToast('Lien copié'); }} className="mt-2 text-xs text-neutral font-semibold">
                Copier le lien
              </button>
            </div>

            <div className="mb-6">
              <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-3">Code d'abonnement</div>
              <div className="font-mono text-2xl font-bold text-center bg-forest text-citron rounded-xl p-4 tracking-widest">
                {showPanel.code}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(showPanel.code); showToast('Code copié'); }} className="mt-2 w-full h-10 rounded-full border-2 border-forest text-forest font-bold text-sm">
                Copier le code
              </button>
            </div>

            <div className="space-y-2">
              {showPanel.status === 'suspended' ? (
                <button onClick={() => handleReactivate(showPanel)} className="w-full h-11 rounded-full bg-citron text-forest-deep font-bold">
                  Réactiver le bar
                </button>
              ) : showPanel.status !== 'expired' ? (
                <button onClick={() => handleSuspend(showPanel)} className="w-full h-11 rounded-full bg-error/10 text-error font-bold">
                  Suspendre ce bar
                </button>
              ) : null}
              
              <button onClick={() => setShowPanel(null)} className="w-full h-11 rounded-full bg-paper text-neutral font-bold">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest text-white px-6 py-3 rounded-full text-sm font-semibold shadow-soft z-40">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Console;

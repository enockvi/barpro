import { useState, useEffect } from 'react';
import POS from './pages/POS';
import Tickets from './pages/Tickets';
import Stock from './pages/Stock';
import StockOwner from './pages/StockOwner';
import Ravitaillement from './pages/Ravitaillement';
import Casse from './pages/Casse';
import Inventaire from './pages/Inventaire';
import Stats from './pages/Stats';
import { OfflineBanner, SyncIndicator, NegativeStockAlert } from './components';
import { dataService } from './db';
import type { Product } from '@barpro/core';
import type { SyncStatus } from '@barpro/core';

type Tab = 'pos' | 'tickets' | 'stock' | 'stockOwner' | 'ravit' | 'casse' | 'inventaire' | 'stats';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('pos');
  const [products, setProducts] = useState<Product[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ connected: true, pendingCount: 0, lastSyncAt: null });
  const [dismissedNegativeStock, setDismissedNegativeStock] = useState(false);

  // Charger les produits pour l'alerte stock négatif
  useEffect(() => {
    dataService.getProducts().then(list => setProducts(list));
  }, []);

  // Surveiller le statut de synchronisation
  useEffect(() => {
    const refresh = async () => {
      const s = await dataService.getSyncStatus();
      setSyncStatus(s);
    };
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'pos', label: 'Vente', icon: '🛒' },
    { key: 'tickets', label: 'Tickets', icon: '📋' },
    { key: 'stock', label: 'Stock', icon: '📦' },
    { key: 'stockOwner', label: 'Stock P.', icon: '📊' },
    { key: 'ravit', label: 'Ravit.', icon: '🚚' },
    { key: 'casse', label: 'Casse', icon: '⚠️' },
    { key: 'inventaire', label: 'Invent.', icon: '📋' },
    { key: 'stats', label: 'Stats', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Bandeau hors-ligne */}
      <OfflineBanner />

      {/* Header avec indicateur de synchro */}
      <header className="bg-forest text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">BarPro</h1>
        <SyncIndicator />
      </header>

      {/* Alert stock négatif */}
      {!dismissedNegativeStock && (
        <NegativeStockAlert
          products={products}
          onDismiss={() => setDismissedNegativeStock(true)}
        />
      )}

      <div className="flex-1 overflow-hidden pt-1">
        {activeTab === 'pos' && <POS />}
        {activeTab === 'tickets' && <Tickets />}
        {activeTab === 'stock' && <Stock />}
        {activeTab === 'stockOwner' && <StockOwner />}
        {activeTab === 'ravit' && <Ravitaillement />}
        {activeTab === 'casse' && <Casse />}
        {activeTab === 'inventaire' && <Inventaire />}
        {activeTab === 'stats' && <Stats />}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="bg-white border-t border-line flex sticky bottom-0 z-20 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab.key ? 'text-forest' : 'text-neutral'
            }`}
          >
            {activeTab === tab.key && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-full bg-citron" />
            )}
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;


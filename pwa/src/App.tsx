import { useState } from 'react';
import POS from './pages/POS';
import Tickets from './pages/Tickets';

type Tab = 'pos' | 'tickets';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('pos');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'pos', label: 'Vente', icon: '🛒' },
    { key: 'tickets', label: 'Tickets', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="flex-1 overflow-hidden">
        {activeTab === 'pos' ? <POS /> : <Tickets />}
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
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;

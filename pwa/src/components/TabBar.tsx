import React from 'react';
import { Home, Box, TrendingUp, Package, AlertTriangle, FileText } from 'lucide-react';

export interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface TabBarProps {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}


export const TabBar = ({ tabs, active, onChange, className = '' }: TabBarProps) => (
  <nav
    className={[
      'flex bg-white border-t border-line sticky bottom-0 z-10',
      'pb-[env(safe-area-inset-bottom,8px)]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {tabs.map((tab) => {
      const isActive = active === tab.key;
      return (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={[
            'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px]',
            'text-neutral transition-colors relative',
            isActive && 'text-forest',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {isActive && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-full bg-citron" />
          )}
          <span className="w-6 h-6">{tab.icon}</span>
          <span className="text-[10.5px] font-semibold">{tab.label}</span>
          {tab.badge != null && tab.badge > 0 && (
            <span className="absolute top-1 right-1/4 bg-error text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {tab.badge}
            </span>
          )}
        </button>
      );
    })}
  </nav>
);

export const defaultTabs = (active: string, onChange: (k: string) => void) => [
  { key: 'home', label: 'Accueil', icon: <Home size={24} strokeWidth={1.75} fill="none" /> },
  { key: 'pos', label: 'Vente', icon: <Package size={24} strokeWidth={1.75} fill="none" /> },
  { key: 'stock', label: 'Stock', icon: <Box size={24} strokeWidth={1.75} fill="none" /> },
  { key: 'alerts', label: 'Pénurie', icon: <AlertTriangle size={24} strokeWidth={1.75} fill="none" /> },
  { key: 'inventory', label: 'Inventaire', icon: <FileText size={24} strokeWidth={1.75} fill="none" /> },
  { key: 'stats', label: 'Stats', icon: <TrendingUp size={24} strokeWidth={1.75} fill="none" /> },
].map((t) => ({ ...t, isActive: active === t.key, onChange: () => onChange(t.key) }));

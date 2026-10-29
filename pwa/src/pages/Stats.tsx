import { useState, useEffect } from 'react';
import { dataService } from '../db';
import type { TicketEvent } from '@barpro/core';

interface ProductStats {
  name: string;
  bottles: number;
}

function Stats() {
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [tickets, setTickets] = useState<TicketEvent[]>([]);
  const [productStats, setProductStats] = useState<ProductStats[]>([]);
  const [totalBottles, setTotalBottles] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    dataService.getTickets().then(async (allTickets) => {
      setTickets(allTickets);
      
      // Aggregate by product
      const statsMap = new Map<string, number>();
      let total = 0;
      
      for (const ticket of allTickets) {
        if (ticket.cancelled) continue;
        for (const line of ticket.lines) {
          statsMap.set(line.productName, (statsMap.get(line.productName) ?? 0) + line.qty);
          total += line.qty;
        }
      }
      
      const stats: ProductStats[] = Array.from(statsMap.entries())
        .map(([name, bottles]) => ({ name, bottles }))
        .sort((a, b) => b.bottles - a.bottles);
      
      setProductStats(stats);
      setTotalBottles(total);
    });
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const maxBottles = productStats.length > 0 ? productStats[0]!.bottles : 1;

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-forest text-white px-4 py-3 sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">Statistiques</h1>
        <p className="text-xs text-white/60 mt-0.5">Quantités vendues</p>
      </header>

      {/* Period selector */}
      <div className="bg-white px-4 py-2 flex gap-2 border-b border-line sticky top-20 z-10">
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2 rounded-full text-sm font-semibold ${period === 'month' ? 'bg-forest text-citron' : 'text-neutral'}`}
        >
          Mois
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`flex-1 py-2 rounded-full text-sm font-semibold ${period === 'year' ? 'bg-forest text-citron' : 'text-neutral'}`}
        >
          Année
        </button>
      </div>

      <main className="px-4 py-4 pb-24">
        {/* Hero card */}
        <div className="bg-forest text-white rounded-[24px] p-5 mb-4">
          <div className="text-sm text-white/70 font-semibold">Bouteilles vendues</div>
          <div className="font-mono text-4xl font-bold text-citron mt-1 leading-tight">
            {totalBottles.toLocaleString('fr-FR')}
          </div>
          <div className="text-xs text-white/60 mt-1">
            {period === 'month' ? 'Depuis le 1er du mois' : 'Depuis le 1er janvier'} · tickets annulés exclus
          </div>
        </div>

        {/* Top sold */}
        <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-3">Les plus vendues</div>
        <div className="bg-white rounded-[20px] shadow-soft overflow-hidden mb-4">
          {productStats.slice(0, 6).map((stat, i) => (
            <div key={stat.name} className="flex items-center gap-3 px-4 py-3 border-b border-line last:border-0">
              <span className="font-mono text-xs text-neutral w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-forest-deep truncate">{stat.name}</div>
                <div className="h-1.5 bg-paper rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-citron rounded-full transition-all"
                    style={{ width: `${(stat.bottles / maxBottles) * 100}%` }}
                  />
                </div>
              </div>
              <span className="font-mono font-bold text-sm text-forest-deep flex-shrink-0">
                {stat.bottles.toLocaleString('fr-FR')} b.
              </span>
            </div>
          ))}
          {productStats.length === 0 && (
            <div className="p-6 text-center text-sm text-neutral">Aucune vente enregistrée</div>
          )}
        </div>

        {/* Detail table */}
        <div className="text-xs font-bold text-neutral uppercase tracking-wider mb-3">Détail par boisson</div>
        <div className="bg-white rounded-[18px] shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left px-4 py-3 text-xs font-bold text-neutral uppercase tracking-wider">Boisson</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-neutral uppercase tracking-wider">Bouteilles</th>
              </tr>
            </thead>
            <tbody>
              {productStats.map(stat => (
                <tr key={stat.name} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-forest-deep">{stat.name}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{stat.bottles.toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {productStats.length === 0 && (
            <div className="p-6 text-center text-sm text-neutral">Aucune donnée</div>
          )}
        </div>

        <p className="text-xs text-neutral mt-4 text-center">
          Les statistiques sont calculées par journée commerciale (4 h à 3 h 59). Les tickets annulés sont exclus.
        </p>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed left-4 right-4 bottom-20 bg-forest text-white px-4 py-3 rounded-2xl text-sm font-semibold text-center z-30 shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Stats;

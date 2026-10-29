import { useState, useEffect } from 'react';
import { dataService } from '../db';
import type { TicketEvent } from '@barpro/core';
import { isTicketModifiable, remainingMinutes, isSuspectHour } from '@barpro/core';

function Tickets() {
  const [tickets, setTickets] = useState<TicketEvent[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<TicketEvent | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    dataService.getTickets().then(setTickets);
  }, []);

  const filtered = tickets.filter(t =>
    !search ||
    t.total.toString().includes(search) ||
    t.lines.some(l => l.productName.toLowerCase().includes(search.toLowerCase()))
  );

  const todayCA = tickets.filter(t => !t.cancelled).reduce((s, t) => s + t.total, 0);

  const formatTime = (ms: number) => {
    return new Date(ms).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getTicketStatus = (t: TicketEvent) => {
    if (t.cancelled) return { label: 'Annulé', cls: 'bg-red-100 text-red-700' };
    const mod = isTicketModifiable(t.createdAt);
    if (mod) {
      const mins = remainingMinutes(t.createdAt);
      return { label: `Modifiable ${mins} min`, cls: 'bg-limeSoft text-forest-deep' };
    }
    if (t.suspectHour) return { label: 'Heure suspecte', cls: 'bg-amber-100 text-amber-700' };
    return { label: 'Verrouillé', cls: 'bg-neutral/10 text-neutral' };
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-forest text-white px-4 py-3 sticky top-0 z-20">
        <h1 className="text-lg font-extrabold tracking-tight">Tickets du jour</h1>
      </header>

      <main className="px-4 py-3 pb-24">
        {/* CA Summary */}
        <div className="bg-forest text-white rounded-[22px] p-4 flex justify-between items-center mb-4">
          <span className="text-sm text-white/75">Chiffre d'affaires du jour</span>
          <span className="font-mono text-2xl font-bold text-citron">{todayCA.toLocaleString('fr-FR')} F</span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Rechercher par montant ou produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 rounded-full border-0 bg-white shadow-soft px-4 text-base outline-none mb-4 focus:ring-2 focus:ring-sous-bois/40"
        />

        {/* Ticket List */}
        <div className="space-y-3">
          {filtered.map(t => {
            const status = getTicketStatus(t);
            const mod = isTicketModifiable(t.createdAt);
            return (
              <div key={t.id} className="bg-white rounded-[20px] shadow-soft p-4 flex items-center gap-3">
                <span className="font-mono text-sm text-neutral w-12 flex-shrink-0">#{t.id.slice(-4)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-forest-deep truncate">
                    {t.lines.map(l => `${l.productName} ×${l.qty}`).join(', ')}
                  </div>
                  <div className="text-xs text-neutral">{formatTime(t.createdAt)}</div>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${status.cls}`}>
                    {status.label}
                  </span>
                </div>
                <span className="font-mono font-bold text-base text-forest-deep flex-shrink-0">
                  {t.total.toLocaleString('fr-FR')} F
                </span>
                <button
                  onClick={() => setSelected(t)}
                  className="w-8 h-8 rounded-full bg-paper flex items-center justify-center flex-shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-neutral py-12 text-sm">Aucun ticket aujourd'hui</div>
          )}
        </div>
      </main>

      {/* Ticket Detail Sheet */}
      {selected && (
        <div className="fixed inset-0 bg-forest/45 z-30 flex items-end">
          <div className="bg-paper w-full rounded-t-[28px] p-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <h2 className="text-lg font-extrabold text-forest-deep">Ticket #{selected.id.slice(-4)}</h2>
            </div>

            <div className="bg-white rounded-[20px] shadow-soft p-4 mb-4">
              <div className="text-xs text-neutral mb-2">{formatTime(selected.createdAt)}</div>
              {selected.lines.map((l, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-line last:border-0">
                  <div>
                    <div className="font-semibold text-sm">{l.productName}</div>
                    <div className="text-xs text-neutral">{l.qty} × {l.unitPrice} F</div>
                    {l.promoApplied && <span className="text-[10px] font-bold bg-limeSoft text-forest-deep px-1.5 py-0.5 rounded-full mt-1 inline-block">Promo</span>}
                  </div>
                  <span className="font-mono font-semibold">{l.lineTotal.toLocaleString('fr-FR')} F</span>
                </div>
              ))}
              <div className="flex justify-between items-baseline pt-3 mt-2 border-t border-line">
                <span className="font-semibold text-sm text-neutral">Total</span>
                <span className="font-mono text-2xl font-bold text-forest-deep">{selected.total.toLocaleString('fr-FR')} F</span>
              </div>
            </div>

            {isTicketModifiable(selected.createdAt) && !selected.cancelled && (
              <div className="bg-limeSoft rounded-[18px] p-4 mb-4 flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold text-forest-deep">Modifiable</div>
                  <div className="text-xs text-neutral">{remainingMinutes(selected.createdAt)} min restantes</div>
                </div>
                <button
                  onClick={() => setEditing(selected.id)}
                  className="px-4 h-10 rounded-full bg-forest text-white font-bold text-sm"
                >
                  Modifier
                </button>
              </div>
            )}

            {!isTicketModifiable(selected.createdAt) && !selected.cancelled && (
              <div className="bg-amber-50 rounded-[18px] p-4 mb-4 text-sm text-amber-700">
                Ce ticket ne peut plus être modifié.
              </div>
            )}

            {selected.cancelled && (
              <div className="bg-red-50 rounded-[18px] p-4 mb-4 text-sm text-red-700">
                Ticket annulé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tickets;

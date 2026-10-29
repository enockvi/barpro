import type { RavitaillementEvent, CorrectionEvent, CasseEvent, TicketEvent } from './types';

// ─── Statut du stock ──────────────────────────────────────────────────────────

export type StockStatus = 'ok' | 'low' | 'out';

/**
 * Détermine le statut du stock selon le seuil d'alerte (en bouteilles).
 */
export function getStockStatus(bottles: number, alertThresholdBottles: number): StockStatus {
  if (bottles === 0) return 'out';
  if (bottles < alertThresholdBottles) return 'low';
  return 'ok';
}

// ─── Coût moyen pondéré ───────────────────────────────────────────────────────

/**
 * Calcule le coût moyen pondéré par bouteille à partir des ravitaillements et corrections.
 */
export function weightedAverageCost(
  ravitaillements: RavitaillementEvent[],
  corrections: CorrectionEvent[]
): number {
  let totalCost = 0;
  let totalQty = 0;
  for (const r of ravitaillements) {
    for (const line of r.lines) {
      const qty = line.casiers * line.bottlesPerCase + line.bouteilles;
      totalCost += qty * line.buyPricePerBottle;
      totalQty += qty;
    }
  }
  for (const c of corrections) {
    const qty = c.deltaCasiers + c.deltaBouteilles;
    totalCost += qty * c.buyPricePerBottle;
    totalQty += qty;
  }
  if (totalQty === 0) return 0;
  return Math.round(totalCost / totalQty);
}

// ─── Stock théorique ──────────────────────────────────────────────────────────

/**
 * Calcule le stock théorique en bouteilles.
 * théorique = dernier_inventaire + ravitaillements_validés + corrections − ventes − casses
 */
export function calculateTheoreticalStock(
  lastInventoryBottles: number,
  ravitaillements: RavitaillementEvent[],
  corrections: CorrectionEvent[],
  tickets: TicketEvent[],
  casses: CasseEvent[],
  bottlesPerCase: Record<string, number>
): number {
  let stock = lastInventoryBottles;

  for (const r of ravitaillements) {
    for (const line of r.lines) {
      const bpc = bottlesPerCase[line.productId] ?? 12;
      stock += line.casiers * bpc + line.bouteilles;
    }
  }

  for (const c of corrections) {
    stock += c.deltaCasiers + c.deltaBouteilles;
  }

  for (const t of tickets) {
    if (t.cancelled) continue;
    for (const line of t.lines) {
      stock -= line.qty;
    }
  }

  for (const c of casses) {
    stock -= c.quantity;
  }

  return stock;
}

/**
 * Somme les bouteilles vendues par un ticket.
 */
export function ticketBottles(ticket: TicketEvent): number {
  return ticket.lines.reduce((s, l) => s + l.qty, 0);
}


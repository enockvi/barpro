import type { Promo, TicketLine } from '.';

// ─── Calcul des prix ──────────────────────────────────────────────────────────

/**
 * Calcule le total d'une ligne de ticket avec promo éventuelle.
 * Promo "N pour X F" : total = floor(q/N) × X + (q mod N) × prix_unitaire
 * Sans promo : total = qty × unitPrice
 */
export function calculateLineTotal(unitPrice: number, qty: number, promo: Promo | null): { total: number; promoApplied: boolean } {
  if (promo && promo.quantity > 0 && promo.price >= 0) {
    const groups = Math.floor(qty / promo.quantity);
    const remainder = qty % promo.quantity;
    const total = groups * promo.price + remainder * unitPrice;
    return { total, promoApplied: groups > 0 };
  }
  return { total: qty * unitPrice, promoApplied: false };
}

/**
 * Calcule le total d'un ticket à partir de ses lignes.
 */
export function calculateTicketTotal(lines: TicketLine[]): number {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}

/**
 * Calcule le prix unitaire effectif d'une ligne (avec promo appliquée).
 */
export function effectiveUnitPrice(unitPrice: number, promo: Promo | null, qty: number): number {
  if (!promo || promo.quantity <= 0) return unitPrice;
  const { total } = calculateLineTotal(unitPrice, qty, promo);
  return Math.round(total / qty);
}

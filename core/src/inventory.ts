// ─── Écart d'inventaire & cohérence ──────────────────────────────────────────

/**
 * Calcule l'écart pour un produit : compté - théorique.
 * Positif = surplus, négatif = manquant.
 */
export function calculateInventoryGap(theoretical: number, counted: number): number {
  return counted - theoretical;
}

/**
 * Calcule la valeur monétaire des écarts (manquants et surplus) au coût moyen pondéré.
 */
export function calculateGapValue(gap: number, costPerBottle: number): number {
  return gap * costPerBottle;
}

/**
 * Vérifie l'alerte de cohérence : plus de 90 % des produits sans écart.
 * Retourne true si l'inventaire est cohérent.
 */
export function checkCoherence(gaps: number[]): boolean {
  if (gaps.length === 0) return true;
  const noGap = gaps.filter((g) => g === 0).length;
  return noGap / gaps.length > 0.9;
}

// ─── Règle de verrouillage ticket 1h ─────────────────────────────────────────

const TICKET_MODIFIABLE_MS = 60 * 60 * 1000; // 1 heure
const SUSPECT_HOUR_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Détermine si un ticket est encore modifiable (créé il y a moins de 1h).
 * `now` par défaut = Date.now().
 */
export function isTicketModifiable(createdAt: number, now: number = Date.now()): boolean {
  return now - createdAt < TICKET_MODIFIABLE_MS;
}

/**
 * Retourne les minutes restantes avant verrouillage.
 */
export function remainingMinutes(createdAt: number, now: number = Date.now()): number {
  const remaining = TICKET_MODIFIABLE_MS - (now - createdAt);
  return Math.max(0, Math.ceil(remaining / 60_000));
}

/**
 * Détermine si un ticket a une heure suspecte (écarts > 5 min entre horloge client et serveur).
 */
export function isSuspectHour(serverTime: number, clientTime: number): boolean {
  return Math.abs(serverTime - clientTime) > SUSPECT_HOUR_THRESHOLD_MS;
}

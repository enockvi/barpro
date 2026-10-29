// ─── Journée commerciale ─────────────────────────────────────────────────────

/**
 * Retourne le timestamp UTC du début de la journée commerciale contenant `date`.
 * La journée commerciale va de 04:00 à 03:59 (fuseau Africa/Porto-Novo, UTC+1).
 *
 * Exemples :
 *   2026-10-29T03:30:00Z → 2026-10-28T03:00:00Z  (début jour J-1)
 *   2026-10-29T04:00:00Z → 2026-10-29T03:00:00Z  (début jour J)
 *   2026-10-29T10:00:00Z → 2026-10-29T03:00:00Z
 */
export function getCommercialDay(date: Date): Date {
  // Convert to Africa/Porto-Novo (UTC+1)
  const utcMs = date.getTime();
  const utcMsInPN = utcMs + 1 * 60 * 60 * 1000; // shift to PN time
  const pnDate = new Date(utcMsInPN);
  const hour = pnDate.getUTCHours();
  // Commercial day starts at 04:00 PN = 03:00 UTC
  const startHour = 3; // UTC
  const dayStartUtc = new Date(Date.UTC(
    pnDate.getUTCFullYear(),
    pnDate.getUTCMonth(),
    pnDate.getUTCDate(),
    startHour, 0, 0, 0
  ));
  // If current UTC time is before 03:00, commercial day started yesterday
  if (utcMs < dayStartUtc.getTime()) {
    dayStartUtc.setTime(dayStartUtc.getTime() - 24 * 60 * 60 * 1000);
  }
  return dayStartUtc;
}

/**
 * Calcule le numéro de jour commercial (entier) depuis une référence.
 */
export function commercialDayNumber(date: Date): number {
  const start = getCommercialDay(date);
  return Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

/**
 * Vérifie si un timestamp donné est dans la journée commerciale en cours.
 */
export function isInCurrentCommercialDay(timestamp: number, referenceTime: number = Date.now()): boolean {
  const refDay = getCommercialDay(new Date(referenceTime));
  const tsDay = getCommercialDay(new Date(timestamp));
  return tsDay.getTime() === refDay.getTime();
}

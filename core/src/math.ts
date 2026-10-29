// ─── Formatage ───────────────────────────────────────────────────────────────

/**
 * Formate un montant en F CFA : espace séparateur des milliers, sans décimale.
 * Ex: 1000 → "1 000 F", 248000 → "248 000 F"
 */
export function formatMoney(amount: number): string {
  return `${amount.toLocaleString('fr-FR').replace(/\s/g, ' ')} F`;
}

/**
 * Convertit un nombre de bouteilles en casiers + bouteilles restantes.
 * Ex: 38 bouteilles, 12 par casier → { casiers: 3, bouteilles: 2 }
 */
export function bottlesToCasiers(bottles: number, bottlesPerCase: number): { casiers: number; bouteilles: number } {
  return {
    casiers: Math.floor(bottles / bottlesPerCase),
    bouteilles: bottles % bottlesPerCase,
  };
}

/**
 * Convertit casiers + bouteilles en nombre total de bouteilles.
 * Ex: 3 casiers, 2 bouteilles, 12 par casier → 38
 */
export function casiersToBottles(casiers: number, bouteilles: number, bottlesPerCase: number): number {
  return casiers * bottlesPerCase + bouteilles;
}

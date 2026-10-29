import { describe, it, expect } from 'vitest';
import {
  formatMoney,
  bottlesToCasiers,
  casiersToBottles,
  calculateLineTotal,
  getCommercialDay,
  getStockStatus,
  weightedAverageCost,
  calculateTheoreticalStock,
  calculateInventoryGap,
  checkCoherence,
  isTicketModifiable,
  remainingMinutes,
  isSuspectHour,
} from '../src';

describe('formatMoney', () => {
  it('formatte 1000 en "1 000 F"', () => expect(formatMoney(1000)).toBe('1 000 F'));
  it('formatte 248000 en "248 000 F"', () => expect(formatMoney(248000)).toBe('248 000 F'));
  it('formatte 0 en "0 F"', () => expect(formatMoney(0)).toBe('0 F'));
});

describe('bottlesToCasiers', () => {
  it('38 bte, 12 par casier → 3 casiers + 2', () => expect(bottlesToCasiers(38, 12)).toEqual({ casiers: 3, bouteilles: 2 }));
  it('24 bte, 24 par casier → 1 casier + 0', () => expect(bottlesToCasiers(24, 24)).toEqual({ casiers: 1, bouteilles: 0 }));
  it('5 bte, 12 par casier → 0 casiers + 5', () => expect(bottlesToCasiers(5, 12)).toEqual({ casiers: 0, bouteilles: 5 }));
});

describe('casiersToBottles', () => {
  it('3 casiers + 2, 12 par casier → 38', () => expect(casiersToBottles(3, 2, 12)).toBe(38));
  it('1 casier + 0, 24 par casier → 24', () => expect(casiersToBottles(1, 0, 24)).toBe(24));
});

describe('calculateLineTotal — promo', () => {
  // CAS OBLIGATOIRE : 4×400F avec promo 3 pour 1000F = 1400F
  it('4×400F promo 3 pour 1000F → 1 400 F', () => {
    const r = calculateLineTotal(400, 4, { quantity: 3, price: 1000 });
    expect(r.total).toBe(1400);
    expect(r.promoApplied).toBe(true);
  });
  it('3×400F promo 3 pour 1000F → 1 000 F', () => {
    expect(calculateLineTotal(400, 3, { quantity: 3, price: 1000 }).total).toBe(1000);
  });
  it('2×400F sans promo → 800 F', () => {
    const r = calculateLineTotal(400, 2, null);
    expect(r.total).toBe(800);
    expect(r.promoApplied).toBe(false);
  });
  it('6×400F promo 3 pour 1000F → 2 000 F', () => {
    expect(calculateLineTotal(400, 6, { quantity: 3, price: 1000 }).total).toBe(2000);
  });
});

describe('getStockStatus', () => {
  it('seuil 12, stock 24 → ok', () => expect(getStockStatus(24, 12)).toBe('ok'));
  it('seuil 12, stock 6 → low', () => expect(getStockStatus(6, 12)).toBe('low'));
  it('seuil 12, stock 0 → out', () => expect(getStockStatus(0, 12)).toBe('out'));
  it('seuil 12, stock 11 → low', () => expect(getStockStatus(11, 12)).toBe('low'));
});

describe('weightedAverageCost', () => {
  // CAS OBLIGATOIRE : 12×700 + 12×800 → coût moyen 750F
  it('12 bte à 700F + 12 bte à 800F → 750 F', () => {
    const rav = [
      {
        kind: 'ravitaillement' as const, id: 'r1', createdAt: 0, commercialDay: 0,
        managerId: 'm1', deviceId: 'd1',
        lines: [{ productId: 'p1', bottlesPerCase: 12, casiers: 1, bouteilles: 0, buyPricePerBottle: 700 }],
        validatedAt: 0, locked: true,
      },
      {
        kind: 'ravitaillement' as const, id: 'r2', createdAt: 0, commercialDay: 0,
        managerId: 'm1', deviceId: 'd1',
        lines: [{ productId: 'p1', bottlesPerCase: 12, casiers: 1, bouteilles: 0, buyPricePerBottle: 800 }],
        validatedAt: 0, locked: true,
      },
    ];
    expect(weightedAverageCost(rav, [])).toBe(750);
  });
  it('retourne 0 s\'il n\'y a aucun événement', () => expect(weightedAverageCost([], [])).toBe(0));
});

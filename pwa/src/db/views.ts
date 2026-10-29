import type { Product } from '@barpro/core';

// ─── Types gérant (sans données financières) ──────────────────────────────────

export interface ManagerProduct extends Product {
  // Masqués : buyPricePerCase, sellPrice (présents mais non affichés)
  _hideFinancial: true;
}

// ─── Types propriétaire (avec données financières) ───────────────────────────

export interface OwnerProduct extends Product {
  // Toutes les données financières sont visibles
}

// ─── Vue gérant : produit simplifié ──────────────────────────────────────────

export interface ManagerProductView {
  id: string;
  name: string;
  category: string;
  format: string;
  bottlesPerCase: number;
  sellPrice: number | null;   // visible
  promo: { quantity: number; price: number } | null;  // visible
  stock: number;              // calculé
  status: 'ok' | 'low' | 'out' | 'noprice';
  // ❌ pas de buyPricePerCase, pas de marge, pas de coût
}

// ─── Vue propriétaire : produit complet ──────────────────────────────────────

export interface OwnerProductView extends OwnerProduct {
  stock: number;
  status: 'ok' | 'low' | 'out' | 'noprice';
  avgCost: number;            // coût moyen pondéré (visible seulement pour le propriétaire)
  margin: number | null;      // marge par bouteille (visible seulement pour le propriétaire)
}

/**
 * Transforme un Product complet en vue gérant (supprime les champs financiers).
 */
export function toManagerProduct(p: Product, stock: number): ManagerProductView {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    format: p.format,
    bottlesPerCase: p.bottlesPerCase,
    sellPrice: p.sellPrice,
    promo: p.promo,
    stock,
    status: p.sellPrice === null ? 'noprice' : ('ok' as const),
  };
}

/**
 * Transforme un Product complet en vue propriétaire (ajoute les données financières).
 */
export function toOwnerProduct(p: Product, stock: number, avgCost: number): OwnerProductView {
  const margin = p.sellPrice !== null ? p.sellPrice - avgCost : null;
  return {
    ...p,
    stock,
    status: p.sellPrice === null ? 'noprice' : (stock === 0 ? 'out' : (stock < p.bottlesPerCase ? 'low' : 'ok')),
    avgCost,
    margin,
  };
}

// ─── Types BarPro ───────────────────────────────────────────────────────────
// Tout est en entiers (F CFA, bouteilles). Jamais de flottants.

export interface Promo {
  quantity: number;  // N bouteilles
  price: number;     // X F pour N
}

export interface Product {
  id: string;
  name: string;
  category: string;
  format: string;           // "65 cl", "33 cl", "1,5 L"
  bottlesPerCase: number;   // bpc — obligatoire
  buyPricePerCase: number;  // prix d'achat par casier en F
  sellPrice: number | null; // prix de vente unitaire en F (null = "Prix à renseigner")
  promo: Promo | null;
  alertThreshold: number;   // en casiers (défaut: 1)
  active: boolean;
}

export type EventKind = 'ticket' | 'ravitaillement' | 'correction' | 'casse' | 'inventaire';

export interface TicketEvent {
  kind: 'ticket';
  id: string;
  createdAt: number;        // timestamp UTC
  commercialDay: number;    // timestamp du début de la journée commerciale
  managerId: string;
  deviceId: string;
  lines: TicketLine[];
  total: number;            // total en F
  cancelled: boolean;
  suspectHour?: boolean;
  versions?: TicketVersion[];
}

export interface TicketLine {
  productId: string;
  productName: string;
  qty: number;              // bouteilles
  unitPrice: number;        // prix unitaire appliqué (déjà calculé avec promo)
  promoApplied: boolean;
  lineTotal: number;        // qty * unitPrice
}

export interface TicketVersion {
  changedAt: number;
  changedBy: string;
  reason?: string;
  lines: TicketLine[];
  total: number;
}

export interface RavitaillementEvent {
  kind: 'ravitaillement';
  id: string;
  createdAt: number;
  commercialDay: number;
  managerId: string;
  deviceId: string;
  lines: RavitaillementLine[];
  validatedAt: number | null;
  locked: boolean;
}

export interface RavitaillementLine {
  productId: string;
  bottlesPerCase: number;  // nécessaire pour calculer le stock
  casiers: number;
  bouteilles: number;
  buyPricePerBottle: number;  // coût unitaire à ce ravitaillement
}

export interface CorrectionEvent {
  kind: 'correction';
  id: string;
  createdAt: number;
  commercialDay: number;
  managerId: string;
  deviceId: string;
  sourceRavitaillementId: string | null;  // correction d'un ravitaillement existant
  productId: string;
  deltaCasiers: number;   // positif = +, négatif = -
  deltaBouteilles: number;
  buyPricePerBottle: number;
  motif: string;
}

export interface CasseEvent {
  kind: 'casse';
  id: string;
  createdAt: number;
  commercialDay: number;
  managerId: string;
  deviceId: string;
  productId: string;
  quantity: number;         // bouteilles
  motif: 'cassée' | 'defaillante' | 'perimee' | 'autre';
  motifDetail?: string;
}

export interface InventaireEvent {
  kind: 'inventaire';
  id: string;
  createdAt: number;
  commercialDay: number;
  managerId: string;
  deviceId: string;
  isPassation: boolean;     // inventaire de passation
  counted: InventoryCount[];
  passed: boolean;
}

export interface InventoryCount {
  productId: string;
  casiers: number;
  bouteilles: number;
}

export type BarEvent = TicketEvent | RavitaillementEvent | CorrectionEvent | CasseEvent | InventaireEvent;

// ─── Types pour le gérant (sans données financières) ────────────────────────

export interface ManagerProduct {
  id: string;
  name: string;
  category: string;
  format: string;
  bottlesPerCase: number;
  sellPrice: number | null;
  promo: Promo | null;
  stock: number;            // calculé
  status: 'ok' | 'low' | 'out' | 'noprice';
}

export interface ManagerTicket {
  no: string;
  createdAt: number;
  commercialDay: number;
  lines: { productId: string; productName: string; qty: number; unitPrice: number; promoApplied: boolean }[];
  total: number;
  modifiable: boolean;
  remainingMinutes: number;
  suspectHour: boolean;
}

// ─── Ré-exports des fonctions pures ───────────────────────────────────────────
export { formatMoney, bottlesToCasiers, casiersToBottles } from './math';
export { calculateLineTotal, calculateTicketTotal, effectiveUnitPrice } from './pricing';
export { getCommercialDay, commercialDayNumber, isInCurrentCommercialDay } from './commercialDay';
export { getStockStatus, weightedAverageCost, calculateTheoreticalStock, ticketBottles } from './stock';
export { calculateInventoryGap, calculateGapValue, checkCoherence, isTicketModifiable, remainingMinutes, isSuspectHour } from './inventory';
export type { SyncStatus, DataService, AuditEntry } from './dataService';



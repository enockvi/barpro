// ─── Interface DataService ────────────────────────────────────────────────────
// Les écrans n'accèdent jamais directement à la base. Tout passe par cette interface.
// Implémentation locale (Dexie) puis serveur (Supabase) sans toucher aux écrans.

import type {
  TicketEvent, RavitaillementEvent, CorrectionEvent,
  CasseEvent, InventaireEvent, BarEvent, Product,
} from '.';

export interface SyncStatus {
  connected: boolean;
  pendingCount: number;
  lastSyncAt: number | null;
  error?: string;
}

export interface DataService {
  // Produits
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  saveProduct(product: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;

  // Événements (ajout seul)
  addTicket(event: TicketEvent): Promise<string>;        // retourne clientUUID
  addRavitaillement(event: RavitaillementEvent): Promise<string>;
  addCorrection(event: CorrectionEvent): Promise<string>;
  addCasse(event: CasseEvent): Promise<string>;
  addInventaire(event: InventaireEvent): Promise<string>;

  // Lecture
  getTickets(commercialDay?: number): Promise<TicketEvent[]>;
  getRavitaillements(commercialDay?: number): Promise<RavitaillementEvent[]>;
  getCorrections(commercialDay?: number): Promise<CorrectionEvent[]>;
  getCasses(commercialDay?: number): Promise<CasseEvent[]>;
  getInventaires(): Promise<InventaireEvent[]>;

  // Appareil & rôle
  registerDevice(deviceId: string, role: 'manager' | 'owner'): Promise<void>;
  getDevice(): Promise<{ deviceId: string; role: 'manager' | 'owner' } | null>;

  // Synchronisation
  getPendingActions(): Promise<BarEvent[]>;
  markSynced(clientUUID: string): Promise<void>;
  getSyncStatus(): Promise<SyncStatus>;
  setSyncStatus(status: Partial<SyncStatus>): Promise<void>;

  // Audit (ajout seul)
  addAuditEntry(entry: AuditEntry): Promise<void>;
  getAuditEntries(limit?: number): Promise<AuditEntry[]>;
}

export interface AuditEntry {
  id: string;
  createdAt: number;
  actorId: string;       // managerId ou ownerId
  actorRole: 'manager' | 'owner' | 'pdg';
  action: string;        // "vente", "ravitaillement", "correction", "casse", "inventaire", "prix", ...
  targetKind: string;    // "ticket", "product", ...
  targetId: string;
  details: Record<string, unknown>;
}

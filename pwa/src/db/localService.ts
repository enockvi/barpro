import Dexie, { type Table } from 'dexie';
import type {
  TicketEvent, RavitaillementEvent, CorrectionEvent,
  CasseEvent, InventaireEvent, BarEvent, Product,
  AuditEntry, DataService, SyncStatus,
} from '@barpro/core';

// ─── Schéma IndexedDB ─────────────────────────────────────────────────────────

class BarProDatabase extends Dexie {
  products!: Table<Product, string>;
  tickets!: Table<TicketEvent, string>;
  ravitaillements!: Table<RavitaillementEvent, string>;
  corrections!: Table<CorrectionEvent, string>;
  casses!: Table<CasseEvent, string>;
  inventaires!: Table<InventaireEvent, string>;
  devices!: Table<{ deviceId: string; role: 'manager' | 'owner'; barId: string }, string>;
  pending!: Table<{ clientUUID: string; event: BarEvent; sentAt: number }, string>;
  audit!: Table<AuditEntry, string>;
  syncStatus!: Table<SyncStatus, 'status'>;

  constructor() {
    super('BarProDB');
    this.version(1).stores({
      products: 'id',
      tickets: 'id, commercialDay, cancelled',
      ravitaillements: 'id, commercialDay',
      corrections: 'id, commercialDay',
      casses: 'id, commercialDay',
      inventaires: 'id, commercialDay',
      devices: 'deviceId',
      pending: 'clientUUID',
      audit: 'id, createdAt',
      syncStatus: 'status',
    });
  }
}

const db = new BarProDatabase();

function clientUUID(): string {
  return crypto.randomUUID();
}

// ─── Implémentation DataService locale ─────────────────────────────────────────

export class LocalDataService implements DataService {
  private _deviceId: string | null = null;
  private _role: 'manager' | 'owner' | null = null;

  async getDevice(): Promise<{ deviceId: string; role: 'manager' | 'owner' } | null> {
    if (this._deviceId && this._role) return { deviceId: this._deviceId, role: this._role };
    const rows = await db.devices.toArray();
    const row = rows[0] ?? null;
    if (!row) return null;
    this._deviceId = row.deviceId;
    this._role = row.role;
    return row;
  }

  async registerDevice(deviceId: string, role: 'manager' | 'owner'): Promise<void> {
    this._deviceId = deviceId;
    this._role = role;
    await db.devices.put({ deviceId, role, barId: 'demo' });
  }

  async getProducts(): Promise<Product[]> { return db.products.toArray(); }
  async getProduct(id: string): Promise<Product | null> {
    const p = await db.products.get(id);
    return p ?? null;
  }

  async saveProduct(product: Product): Promise<void> {
    const prev = await db.products.get(product.id);
    await db.products.put(product);
    await db.audit.add({
      id: clientUUID(), createdAt: Date.now(),
      actorId: this._deviceId ?? 'system', actorRole: this._role ?? 'owner',
      action: 'prix', targetKind: 'product', targetId: product.id,
      details: { oldSellPrice: prev?.sellPrice, newSellPrice: product.sellPrice },
    });
  }

  async deleteProduct(id: string): Promise<void> { await db.products.delete(id); }

  async addTicket(event: TicketEvent): Promise<string> {
    await db.tickets.put(event);
    await db.audit.add({
      id: clientUUID(), createdAt: Date.now(),
      actorId: event.managerId, actorRole: 'manager',
      action: 'vente', targetKind: 'ticket', targetId: event.id,
      details: { total: event.total, linesCount: event.lines.length },
    });
    return event.id;
  }

  async addRavitaillement(event: RavitaillementEvent): Promise<string> {
    await db.ravitaillements.put(event);
    await db.audit.add({
      id: clientUUID(), createdAt: Date.now(),
      actorId: event.managerId, actorRole: 'manager',
      action: 'ravitaillement', targetKind: 'ravitaillement', targetId: event.id,
      details: { lines: event.lines.length },
    });
    return event.id;
  }

  async addCorrection(event: CorrectionEvent): Promise<string> {
    await db.corrections.put(event);
    await db.audit.add({
      id: clientUUID(), createdAt: Date.now(),
      actorId: event.managerId, actorRole: 'manager',
      action: 'correction', targetKind: 'correction', targetId: event.id,
      details: { motif: event.motif },
    });
    return event.id;
  }

  async addCasse(event: CasseEvent): Promise<string> {
    await db.casses.put(event);
    await db.audit.add({
      id: clientUUID(), createdAt: Date.now(),
      actorId: event.managerId, actorRole: 'manager',
      action: 'casse', targetKind: 'casse', targetId: event.id,
      details: { quantity: event.quantity, motif: event.motif },
    });
    return event.id;
  }

  async addInventaire(event: InventaireEvent): Promise<string> {
    await db.inventaires.put(event);
    await db.audit.add({
      id: clientUUID(), createdAt: Date.now(),
      actorId: event.managerId, actorRole: 'manager',
      action: 'inventaire', targetKind: 'inventaire', targetId: event.id,
      details: { passed: event.passed },
    });
    return event.id;
  }

  async getTickets(commercialDay?: number): Promise<TicketEvent[]> {
    return commercialDay != null
      ? db.tickets.where('commercialDay').equals(commercialDay).toArray()
      : db.tickets.toArray();
  }
  async getRavitaillements(commercialDay?: number): Promise<RavitaillementEvent[]> {
    return commercialDay != null
      ? db.ravitaillements.where('commercialDay').equals(commercialDay).toArray()
      : db.ravitaillements.toArray();
  }
  async getCorrections(commercialDay?: number): Promise<CorrectionEvent[]> {
    return commercialDay != null
      ? db.corrections.where('commercialDay').equals(commercialDay).toArray()
      : db.corrections.toArray();
  }
  async getCasses(commercialDay?: number): Promise<CasseEvent[]> {
    return commercialDay != null
      ? db.casses.where('commercialDay').equals(commercialDay).toArray()
      : db.casses.toArray();
  }
  async getInventaires(): Promise<InventaireEvent[]> { return db.inventaires.toArray(); }

  async getPendingActions(): Promise<BarEvent[]> {
    return (await db.pending.toArray()).map((r) => r.event);
  }

  async markSynced(uuid: string): Promise<void> { await db.pending.delete(uuid); }

  async enqueuePending(event: BarEvent): Promise<void> {
    await db.pending.add({ clientUUID: clientUUID(), event, sentAt: Date.now() });
  }

  // ─── Synchronisation batch hors-ligne ────────────────────────────────────────
  // En ligne : envoyer un lot complet et marquer chaque UUID comme sync.
  // L'identifiant unique (clientUUID) garantit l'idempotence : un envoi répété
  // ne crée jamais de doublon côté serveur.

  async syncBatch(): Promise<{ sent: number; errors: string[] }> {
    const rows = await db.pending.toArray();
    if (rows.length === 0) return { sent: 0, errors: [] };

    const events = rows.map((r) => r.event);
    const uuids = rows.map((r) => r.clientUUID);
    const errors: string[] = [];

    try {
      // Simuler l'envoi au serveur (placeholder pour T13)
      // En production : await fetch('/api/sync', { method: 'POST', body: JSON.stringify({ events }) })
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Marquer tous comme sync (idempotent : les doublons sont ignorés par le serveur)
      for (const uuid of uuids) {
        await this.markSynced(uuid);
      }

      await this.setSyncStatus({
        connected: true,
        pendingCount: 0,
        lastSyncAt: Date.now(),
      });

      return { sent: events.length, errors };
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Erreur inconnue');
      await this.setSyncStatus({ connected: false, pendingCount: rows.length, error: errors.join('; ') });
      return { sent: 0, errors };
    }
  }

  // Déclencher la synchro quand le réseau revient
  async autoSyncOnOnline(): Promise<void> {
    if (navigator.onLine) {
      await this.syncBatch();
    }
  }

  async getSyncStatus(): Promise<SyncStatus> {
    const row = await db.syncStatus.where('status').equals('current').first();
    return row ?? { connected: navigator.onLine, pendingCount: 0, lastSyncAt: null };
  }

  async setSyncStatus(status: Partial<SyncStatus>): Promise<void> {
    const current = await this.getSyncStatus();
    await db.syncStatus.put({ ...current, ...status } as SyncStatus);
  }

  async addAuditEntry(entry: AuditEntry): Promise<void> { await db.audit.add(entry); }
  async getAuditEntries(limit = 50): Promise<AuditEntry[]> {
    return db.audit.orderBy('createdAt').reverse().limit(limit).toArray();
  }

  async reset(): Promise<void> {
    await db.transaction('rw', db.tables, async () => {
      await db.tickets.clear();
      await db.ravitaillements.clear();
      await db.corrections.clear();
      await db.casses.clear();
      await db.inventaires.clear();
      await db.pending.clear();
      await db.audit.clear();
      await db.products.clear();
    });
  }
}

export const dataService = new LocalDataService();


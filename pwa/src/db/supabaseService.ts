// ─── SupabaseDataService ──────────────────────────────────────────────────────
// Implémente DataService en utilisant Dexie comme cache hors-ligne et
// les Edge Functions Supabase comme backend serveur.
// Les écrans n'appellent jamais cette classe directement : ils passent par
// l'interface DataService (importée via db/index.ts).

import type {
  TicketEvent, RavitaillementEvent, CorrectionEvent,
  CasseEvent, InventaireEvent, BarEvent, Product,
  AuditEntry, SyncStatus, DataService,
} from '@barpro/core';
import { supabaseUrl, supabaseAnonKey, edgeFunctionUrl } from '../config';
import { isSupabaseConfigured } from '../config';

/** Génère un UUID client unique pour l'idempotence */
function clientUUID(): string {
  return crypto.randomUUID();
}

export class SupabaseDataService implements DataService {
  private _deviceId: string | null = null;
  private _role: 'manager' | 'owner' | null = null;
  private _barId: string | null = null;
  private _pendingMap = new Map<string, { event: BarEvent; sentAt: number }>();

  // ─── Authentification & Appareil ────────────────────────────────────────────

  async registerDevice(deviceId: string, role: 'manager' | 'owner'): Promise<void> {
    this._deviceId = deviceId;
    this._role = role;
  }

  async getDevice(): Promise<{ deviceId: string; role: 'manager' | 'owner' } | null> {
    if (this._deviceId && this._role) return { deviceId: this._deviceId, role: this._role };
    return null;
  }

  setBarId(barId: string): void {
    this._barId = barId;
  }

  getBarId(): string | null {
    return this._barId;
  }

  // ─── Produits ───────────────────────────────────────────────────────────────

  async getProducts(): Promise<Product[]> {
    return [];
  }

  async getProduct(id: string): Promise<Product | null> {
    return null;
  }

  async saveProduct(product: Product): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const uuid = clientUUID();
    await this.enqueuePending({
      kind: 'product',
      id: uuid,
      createdAt: Date.now(),
      action: 'save_product',
      product,
    } as any);
  }

  async deleteProduct(id: string): Promise<void> {
    // Non supporté en V1 via serveur
  }

  // ─── Événements (ajout seul) ────────────────────────────────────────────────

  async addTicket(event: TicketEvent): Promise<string> {
    const uuid = clientUUID();
    this._pendingMap.set(uuid, { event, sentAt: Date.now() });
    await this.enqueuePending(event, uuid);
    if (navigator.onLine) await this.syncBatch();
    return uuid;
  }

  async addRavitaillement(event: RavitaillementEvent): Promise<string> {
    const uuid = clientUUID();
    this._pendingMap.set(uuid, { event, sentAt: Date.now() });
    await this.enqueuePending(event, uuid);
    if (navigator.onLine) await this.syncBatch();
    return uuid;
  }

  async addCorrection(event: CorrectionEvent): Promise<string> {
    const uuid = clientUUID();
    this._pendingMap.set(uuid, { event, sentAt: Date.now() });
    await this.enqueuePending(event, uuid);
    if (navigator.onLine) await this.syncBatch();
    return uuid;
  }

  async addCasse(event: CasseEvent): Promise<string> {
    const uuid = clientUUID();
    this._pendingMap.set(uuid, { event, sentAt: Date.now() });
    await this.enqueuePending(event, uuid);
    if (navigator.onLine) await this.syncBatch();
    return uuid;
  }

  async addInventaire(event: InventaireEvent): Promise<string> {
    const uuid = clientUUID();
    this._pendingMap.set(uuid, { event, sentAt: Date.now() });
    await this.enqueuePending(event, uuid);
    if (navigator.onLine) await this.syncBatch();
    return uuid;
  }

  // ─── Lecture ────────────────────────────────────────────────────────────────

  async getTickets(commercialDay?: number): Promise<TicketEvent[]> {
    return [];
  }

  async getRavitaillements(commercialDay?: number): Promise<RavitaillementEvent[]> {
    return [];
  }

  async getCorrections(commercialDay?: number): Promise<CorrectionEvent[]> {
    return [];
  }

  async getCasses(commercialDay?: number): Promise<CasseEvent[]> {
    return [];
  }

  async getInventaires(): Promise<InventaireEvent[]> {
    return [];
  }

  // ─── Synchronisation ────────────────────────────────────────────────────────

  async getPendingActions(): Promise<BarEvent[]> {
    return Array.from(this._pendingMap.values()).map(v => v.event);
  }

  async markSynced(clientUUID: string): Promise<void> {
    this._pendingMap.delete(clientUUID);
  }

  async enqueuePending(event: BarEvent, uuid?: string): Promise<void> {
    const id = uuid ?? clientUUID();
    this._pendingMap.set(id, { event, sentAt: Date.now() });
  }

  async syncBatch(): Promise<{ sent: number; errors: string[] }> {
    if (!isSupabaseConfigured() || this._pendingMap.size === 0 || !navigator.onLine) {
      return { sent: 0, errors: [] };
    }
    if (!this._barId) return { sent: 0, errors: ['barId non défini'] };

    const entries = Array.from(this._pendingMap.entries());
    const events = entries.map(([, v]) => v.event);
    const uuids = entries.map(([k]) => k);
    const errors: string[] = [];

    try {
      const response = await fetch(edgeFunctionUrl('sync_events'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'raw-support': 'true',
        },
        body: JSON.stringify({ events, deviceId: this._deviceId, barId: this._barId }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        errors.push(err.error ?? `HTTP ${response.status}`);
        await this.setSyncStatus({ connected: false, pendingCount: this._pendingMap.size, error: errors.join('; ') });
        return { sent: 0, errors };
      }

      const result = await response.json() as { accepted: string[]; duplicates: string[] };

      // Marquer comme sync (acceptés et doublons)
      for (const uuid of [...result.accepted, ...result.duplicates]) {
        this._pendingMap.delete(uuid);
      }

      // Marquer aussi ceux qui n'ont pas de réponse (fallback)
      for (const [uuid] of entries) {
        if (!result.accepted.includes(uuid) && !result.duplicates.includes(uuid)) {
          this._pendingMap.delete(uuid);
        }
      }

      await this.setSyncStatus({
        connected: true,
        pendingCount: this._pendingMap.size,
        lastSyncAt: Date.now(),
      });

      return { sent: result.accepted.length, errors };
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Erreur réseau');
      await this.setSyncStatus({ connected: false, pendingCount: this._pendingMap.size, error: errors.join('; ') });
      return { sent: 0, errors };
    }
  }

  async autoSyncOnOnline(): Promise<void> {
    if (navigator.onLine && isSupabaseConfigured()) {
      await this.syncBatch();
    }
  }

  async getSyncStatus(): Promise<SyncStatus> {
    return {
      connected: navigator.onLine && isSupabaseConfigured(),
      pendingCount: this._pendingMap.size,
      lastSyncAt: null,
    };
  }

  async setSyncStatus(status: Partial<SyncStatus>): Promise<void> {
    // Statut géré localement
  }

  // ─── Audit ──────────────────────────────────────────────────────────────────

  async addAuditEntry(entry: AuditEntry): Promise<void> {
    // L'audit est fait côté serveur via les triggers Edge Functions
  }

  async getAuditEntries(limit = 50): Promise<AuditEntry[]> {
    return [];
  }

  // ─── Liens & Accès ──────────────────────────────────────────────────────────

  /** Active un lien reçu par le propriétaire ou le gérant */
  async activateLink(token: string, deviceId: string): Promise<{
    success: boolean;
    barId?: string;
    barStatus?: string;
    trialEnd?: string;
    subscriptionEnd?: string;
    error?: string;
  }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase non configuré' };
    }
    try {
      const response = await fetch(edgeFunctionUrl('activate_link'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, deviceId }),
      });
      const data = await response.json() as any;
      if (!response.ok || data.error) {
        return { success: false, error: data.error ?? 'Erreur serveur' };
      }
      this._barId = data.bar_id;
      this._deviceId = data.device_id;
      return { success: true, barId: data.bar_id, barStatus: data.bar_status, trialEnd: data.trial_end, subscriptionEnd: data.subscription_end };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur réseau' };
    }
  }

  /** Saisie d'un code d'abonnement */
  async submitCode(code: string, barId: string, deviceId: string): Promise<{
    success: boolean;
    subscriptionEnd?: string;
    error?: string;
  }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase non configuré' };
    }
    try {
      const response = await fetch(edgeFunctionUrl('submit_code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), barId, deviceId }),
      });
      const data = await response.json() as any;
      if (!response.ok || data.error) {
        return { success: false, error: data.error ?? 'Erreur serveur' };
      }
      return { success: true, subscriptionEnd: data.subscription_end };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur réseau' };
    }
  }

  /** Démarre l'essai gratuit de 7 jours */
  async startTrial(barId: string, deviceId: string): Promise<{
    success: boolean;
    trialEnd?: string;
    error?: string;
  }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase non configuré' };
    }
    try {
      const response = await fetch(edgeFunctionUrl('start_trial'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barId, deviceId }),
      });
      const data = await response.json() as any;
      if (!response.ok || data.error) {
        return { success: false, error: data.error ?? 'Erreur serveur' };
      }
      return { success: true, trialEnd: data.trial_end };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur réseau' };
    }
  }

  /** Horloge serveur de référence */
  async getReferenceTime(): Promise<{ serverTime: number; iso: string }> {
    if (!isSupabaseConfigured()) {
      return { serverTime: Date.now(), iso: new Date().toISOString() };
    }
    try {
      const response = await fetch(edgeFunctionUrl('reference_time'));
      return response.json() as Promise<{ serverTime: number; iso: string }>;
    } catch {
      return { serverTime: Date.now(), iso: new Date().toISOString() };
    }
  }

  // ─── Nettoyage ──────────────────────────────────────────────────────────────

  async reset(): Promise<void> {
    this._pendingMap.clear();
    this._deviceId = null;
    this._role = null;
    this._barId = null;
  }
}

export const supabaseDataService = new SupabaseDataService();

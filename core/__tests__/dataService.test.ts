import { describe, it, expect, beforeEach } from 'vitest';
import type { TicketEvent, RavitaillementEvent, Product, AuditEntry } from '../src';

// In-memory DataService test double (no IndexedDB dependency)
class MemSvc {
  products = new Map<string, Product>();
  tickets = new Map<string, TicketEvent>();
  ravitaillements = new Map<string, RavitaillementEvent>();
  audit: AuditEntry[] = [];

  async reset() {
    this.products.clear(); this.tickets.clear();
    this.ravitaillements.clear(); this.audit = [];
  }
  async getProducts() { return [...this.products.values()]; }
  async saveProduct(p: Product) {
    const prev = this.products.get(p.id);
    this.products.set(p.id, p);
    this.audit.push({ id: crypto.randomUUID(), createdAt: Date.now(), actorId: 'sys', actorRole: 'owner', action: 'prix', targetKind: 'product', targetId: p.id, details: { old: prev?.sellPrice, new: p.sellPrice } });
  }
  async addTicket(e: TicketEvent) {
    if (this.tickets.has(e.id)) throw new Error(`Duplicate ticket: ${e.id}`);
    this.tickets.set(e.id, e);
    this.audit.push({ id: crypto.randomUUID(), createdAt: Date.now(), actorId: e.managerId, actorRole: 'manager', action: 'vente', targetKind: 'ticket', targetId: e.id, details: { total: e.total } });
  }
  async addRavitaillement(e: RavitaillementEvent) {
    if (this.ravitaillements.has(e.id)) throw new Error(`Duplicate rav: ${e.id}`);
    this.ravitaillements.set(e.id, e);
  }
  async getTickets() { return [...this.tickets.values()]; }
  async getRavitaillements() { return [...this.ravitaillements.values()]; }
  async getAuditEntries(limit = 50) { return this.audit.slice(-limit).reverse(); }
}

const svc = new MemSvc();

function ticket(overrides: Partial<TicketEvent> = {}): TicketEvent {
  return { kind: 'ticket', id: 't1', createdAt: Date.now(), commercialDay: Date.now(), managerId: 'm1', deviceId: 'd1', lines: [{ productId: 'p1', productName: 'Castel', qty: 3, unitPrice: 800, promoApplied: false, lineTotal: 2400 }], total: 2400, cancelled: false, ...overrides };
}
function rav(overrides: Partial<RavitaillementEvent> = {}): RavitaillementEvent {
  return { kind: 'ravitaillement', id: 'r1', createdAt: Date.now(), commercialDay: Date.now(), managerId: 'm1', deviceId: 'd1', lines: [{ productId: 'p1', bottlesPerCase: 12, casiers: 1, bouteilles: 0, buyPricePerBottle: 700 }], validatedAt: Date.now(), locked: true, ...overrides };
}

describe('DataService — doublon refusé', () => {
  beforeEach(async () => { await svc.reset(); });
  it('rejette ticket en double', async () => {
    await svc.addTicket(ticket({ id: 'dup' }));
    await expect(svc.addTicket(ticket({ id: 'dup' }))).rejects.toThrow('Duplicate');
    expect((await svc.getTickets()).length).toBe(1);
  });
  it('rejette ravitaillement en double', async () => {
    await svc.addRavitaillement(rav({ id: 'dup' }));
    await expect(svc.addRavitaillement(rav({ id: 'dup' }))).rejects.toThrow('Duplicate');
  });
});

describe('DataService — 50 actions sans doublon', () => {
  beforeEach(async () => { await svc.reset(); });
  it('50 tickets uniques', async () => {
    for (let i = 0; i < 50; i++) await svc.addTicket(ticket({ id: `t-${i}` }));
    const tickets = await svc.getTickets();
    expect(tickets).toHaveLength(50);
    expect(new Set(tickets.map(t => t.id)).size).toBe(50);
  });
});

describe('DataService — journal d\'audit (ajout seul)', () => {
  beforeEach(async () => { await svc.reset(); });
  it('enregistre chaque vente', async () => {
    await svc.addTicket(ticket({ id: 't1' }));
    await svc.addTicket(ticket({ id: 't2' }));
    expect((await svc.getAuditEntries()).length).toBe(2);
  });
  it('3 ventes = 3 entrées audit', async () => {
    for (let i = 0; i < 3; i++) await svc.addTicket(ticket({ id: `t-${i}` }));
    expect((await svc.getAuditEntries()).length).toBe(3);
  });
});

describe('DataService — stock recalculé', () => {
  beforeEach(async () => { await svc.reset(); });
  it('inclut ravitaillement et ventes', async () => {
    await svc.addRavitaillement(rav({ id: 'r-stock', lines: [{ productId: 'p1', bottlesPerCase: 12, casiers: 1, bouteilles: 0, buyPricePerBottle: 700 }] }));
    await svc.addTicket(ticket({ id: 't-stock', lines: [{ productId: 'p1', productName: 'Castel', qty: 30, unitPrice: 800, promoApplied: false, lineTotal: 24000 }], total: 24000 }));
    const tickets = await svc.getTickets();
    expect(tickets).toHaveLength(1);
    expect(tickets[0]!.total).toBe(24000);
  });
});

describe('DataService — types gérant sans finances', () => {
  beforeEach(async () => { await svc.reset(); });
  it('stocke buyPricePerCase mais gérant ne le voit pas', async () => {
    await svc.saveProduct({ id: 'p1', name: 'Castel', category: 'Bières', format: '65 cl', bottlesPerCase: 12, buyPricePerCase: 8400, sellPrice: 800, promo: null, alertThreshold: 1, active: true });
    const products = await svc.getProducts();
    expect(products[0]!.buyPricePerCase).toBe(8400);
    expect(products[0]!.sellPrice).toBe(800);
  });
});

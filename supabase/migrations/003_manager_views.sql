-- ─── Migration 003 — Vues dédiées au gérant (sans colonnes financières) ────────
-- Règle : le gérant ne voit JAMAIS bénéfice, marge, valeur de casse ni rapport financier.
-- Ces vues retirent toutes les colonnes financières des tables.

-- Vue tickets_manager : lignes de ticket sans prix d'achat
CREATE OR REPLACE VIEW tickets_manager AS
SELECT
  t.id,
  t.bar_id,
  t.manager_id,
  t.device_id,
  t.commercial_day,
  t.created_at,
  t.total,
  t.cancelled,
  t.suspect_hour,
  t.version_count
FROM tickets t;

-- Vue ticket_lines_manager : pas de buy_price, pas de ligne financière
CREATE OR REPLACE VIEW ticket_lines_manager AS
SELECT
  tl.id,
  tl.ticket_id,
  tl.product_id,
  tl.product_name,
  tl.qty,
  tl.unit_price,
  tl.promo_applied,
  tl.line_total
FROM ticket_lines tl;

-- Vue ravitaillements_manager : sans buy_price_per_bottle
CREATE OR REPLACE VIEW ravitaillements_manager AS
SELECT
  r.id,
  r.bar_id,
  r.manager_id,
  r.device_id,
  r.commercial_day,
  r.created_at,
  r.validated_at,
  r.locked,
  r.status
FROM ravitaillements r;

-- Vue ravitaillement_lines_manager : pas de buy_price_per_bottle
CREATE OR REPLACE VIEW ravitaillement_lines_manager AS
SELECT
  rl.id,
  rl.ravitaillement_id,
  rl.product_id,
  rl.bottles_per_case,
  rl.casiers,
  rl.bouteilles
FROM ravitaillement_lines rl;

-- Vue corrections_manager : pas de buy_price_per_bottle
CREATE OR REPLACE VIEW corrections_manager AS
SELECT
  c.id,
  c.bar_id,
  c.manager_id,
  c.device_id,
  c.commercial_day,
  c.created_at,
  c.source_ravitaillement_id,
  c.product_id,
  c.delta_casiers,
  c.delta_bouteilles,
  c.motif
FROM corrections c;

-- Vue casses_manager : pas de valorisation financière
-- La casse est valorisée automatiquement côté serveur, le gérant ne voit jamais le montant
CREATE OR REPLACE VIEW casses_manager AS
SELECT
  ca.id,
  ca.bar_id,
  ca.manager_id,
  ca.device_id,
  ca.commercial_day,
  ca.created_at,
  ca.product_id,
  ca.quantity,
  ca.motif,
  ca.motif_detail
FROM casses ca;

-- Vue inventaires_manager : sans stock théorique ni écart
CREATE OR REPLACE VIEW inventaires_manager AS
SELECT
  i.id,
  i.bar_id,
  i.manager_id,
  i.device_id,
  i.commercial_day,
  i.created_at,
  i.is_passation,
  i.passed
FROM inventaires i;

-- Vue inventaire_lines_manager
CREATE OR REPLACE VIEW inventaire_lines_manager AS
SELECT
  il.id,
  il.inventaire_id,
  il.product_id,
  il.casiers,
  il.bouteilles
FROM inventaire_lines il;

-- Vue products_manager : sans buyPricePerCase (marge calculable)
CREATE OR REPLACE VIEW products_manager AS
SELECT
  p.id,
  p.bar_id,
  p.name,
  p.category,
  p.format,
  p.size,
  p.bottles_per_case,
  p.sell_price,
  p.promo_quantity,
  p.promo_price,
  p.alert_threshold,
  p.active,
  p.photo_path
FROM products p;

-- Vue managers_manager : pas de données sensibles
CREATE OR REPLACE VIEW managers_manager AS
SELECT
  m.id,
  m.bar_id,
  m.name,
  m.linked_at,
  m.revoked_at,
  m.last_synced
FROM managers m;

-- Vue owners_manager : pas de données sensibles
CREATE OR REPLACE VIEW owners_manager AS
SELECT
  o.id,
  o.bar_id,
  o.name,
  o.whatsapp,
  o.created_at
FROM owners o;

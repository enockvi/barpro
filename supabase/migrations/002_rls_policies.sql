-- ─── Migration 002 — Politiques RLS par rôle ───────────────────────────────────
-- Règle d'or : le gérant ne voit JAMAIS de données financières.
-- Le propriétaire ne peut PAS écrire de vente, ravitaillement, casse ni prix.

-- Activer RLS sur toutes les tables de données métier
ALTER TABLE bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ravitaillements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ravitaillement_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE casses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventaire_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE codes_abonnement ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit ENABLE ROW LEVEL SECURITY;

-- ── Fonction utilitaire : obtenir le rôle de l'utilisateur courant ────────────
CREATE OR REPLACE FUNCTION get_current_role()
RETURNS TEXT AS $$
  SELECT nullif(current_setting('request.jwt.claim.role', true), '');
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_current_bar_id()
RETURNS UUID AS $$
  SELECT nullif(current_setting('request.jwt.claim.bar_id', true), '')::UUID;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── bars ────────────────────────────────────────────────────────────────────────
-- PDG : tout accès
CREATE POLICY pdg_bars_all ON bars FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

-- Gérant : lecture de son bar uniquement
CREATE POLICY manager_bars_read ON bars FOR SELECT TO authenticated
  USING (id = get_current_bar_id() AND get_current_role() = 'manager');

-- Propriétaire : lecture de son bar uniquement
CREATE POLICY owner_bars_read ON bars FOR SELECT TO authenticated
  USING (id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── owners ──────────────────────────────────────────────────────────────────────
CREATE POLICY pdg_owners_all ON owners FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

CREATE POLICY owner_owners_read ON owners FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── managers ────────────────────────────────────────────────────────────────────
CREATE POLICY pdg_managers_all ON managers FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

CREATE POLICY owner_managers_read ON managers FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── devices ─────────────────────────────────────────────────────────────────────
CREATE POLICY pdg_devices_all ON devices FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

CREATE POLICY manager_devices_write ON devices FOR INSERT TO authenticated
  WITH CHECK (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

CREATE POLICY manager_devices_read ON devices FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

CREATE POLICY owner_devices_read ON devices FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── links ───────────────────────────────────────────────────────────────────────
CREATE POLICY pdg_links_all ON links FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

CREATE POLICY manager_links_read ON links FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

CREATE POLICY owner_links_read ON links FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── products ────────────────────────────────────────────────────────────────────
-- PDG : tout
CREATE POLICY pdg_products_all ON products FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

-- Gérant : lecture + écriture (prix, fiche produit)
CREATE POLICY manager_products_write ON products FOR ALL TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'manager')
  WITH CHECK (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

-- Propriétaire : lecture seule
CREATE POLICY owner_products_read ON products FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── tickets ─────────────────────────────────────────────────────────────────────
-- PDG : tout
CREATE POLICY pdg_tickets_all ON tickets FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

-- Gérant : INSERT + UPDATE (modification dans l'heure) + SELECT
CREATE POLICY manager_tickets_write ON tickets FOR ALL TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'manager')
  WITH CHECK (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

-- Propriétaire : SELECT uniquement
CREATE POLICY owner_tickets_read ON tickets FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ticket_lines : mêmes règles que tickets
CREATE POLICY manager_ticket_lines_write ON ticket_lines FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM tickets t WHERE t.id = ticket_lines.ticket_id
            AND t.bar_id = get_current_bar_id() AND t.manager_id = auth.uid())
    AND get_current_role() = 'manager'
  )
  WITH CHECK (get_current_role() = 'manager');

CREATE POLICY owner_ticket_lines_read ON ticket_lines FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM tickets t WHERE t.id = ticket_lines.ticket_id
            AND t.bar_id = get_current_bar_id() AND get_current_role() = 'owner')
  );

-- ticket_versions : lecture uniquement pour tous
CREATE POLICY ticket_versions_read ON ticket_versions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM tickets t WHERE t.id = ticket_versions.ticket_id
                 AND t.bar_id = get_current_bar_id()));

-- ── ravitaillements ─────────────────────────────────────────────────────────────
CREATE POLICY pdg_ravit_all ON ravitaillements FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

-- Seul le gérant peut écrire
CREATE POLICY manager_ravit_write ON ravitaillements FOR ALL TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'manager')
  WITH CHECK (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

CREATE POLICY owner_ravit_read ON ravitaillements FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ravitaillement_lines
CREATE POLICY manager_ravit_lines_write ON ravitaillement_lines FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM ravitaillements r WHERE r.id = ravitaillement_lines.ravitaillement_id
                 AND r.bar_id = get_current_bar_id() AND r.manager_id = auth.uid()))
  WITH CHECK (get_current_role() = 'manager');

CREATE POLICY owner_ravit_lines_read ON ravitaillement_lines FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM ravitaillements r WHERE r.id = ravitaillement_lines.ravitaillement_id
                 AND r.bar_id = get_current_bar_id() AND get_current_role() = 'owner'));

-- ── corrections ─────────────────────────────────────────────────────────────────
CREATE POLICY pdg_corrections_all ON corrections FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

CREATE POLICY manager_corrections_write ON corrections FOR ALL TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'manager')
  WITH CHECK (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

CREATE POLICY owner_corrections_read ON corrections FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── casses ──────────────────────────────────────────────────────────────────────
CREATE POLICY pdg_casses_all ON casses FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

-- Seul le gérant peut déclarer une casse
CREATE POLICY manager_casses_write ON casses FOR ALL TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'manager')
  WITH CHECK (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

CREATE POLICY owner_casses_read ON casses FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── inventaires ─────────────────────────────────────────────────────────────────
CREATE POLICY pdg_inventaires_all ON inventaires FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

CREATE POLICY manager_inventaires_write ON inventaires FOR ALL TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'manager')
  WITH CHECK (bar_id = get_current_bar_id() AND get_current_role() = 'manager');

CREATE POLICY owner_inventaires_read ON inventaires FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- inventaire_lines
CREATE POLICY manager_inv_lines_write ON inventaire_lines FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM inventaires i WHERE i.id = inventaire_lines.inventaire_id
                 AND i.bar_id = get_current_bar_id()))
  WITH CHECK (get_current_role() = 'manager');

CREATE POLICY owner_inv_lines_read ON inventaire_lines FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM inventaires i WHERE i.id = inventaire_lines.inventaire_id
                 AND i.bar_id = get_current_bar_id() AND get_current_role() = 'owner'));

-- ── codes_abonnement ────────────────────────────────────────────────────────────
CREATE POLICY pdg_codes_all ON codes_abonnement FOR ALL TO authenticated
  USING (get_current_role() = 'pdg')
  WITH CHECK (get_current_role() = 'pdg');

CREATE POLICY owner_codes_read ON codes_abonnement FOR SELECT TO authenticated
  USING (bar_id = get_current_bar_id() AND get_current_role() = 'owner');

-- ── audit ───────────────────────────────────────────────────────────────────────
-- Seul le PDG et le propriétaire peuvent lire le journal
CREATE POLICY pdg_audit_read ON audit FOR SELECT TO authenticated
  USING (get_current_role() = 'pdg');

CREATE POLICY owner_audit_read ON audit FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bars b WHERE b.id = (
      SELECT bar_id FROM devices d WHERE d.device_id = get_current_bar_id()
      AND d.role = 'owner' AND d.revoked_at IS NULL
    ) AND b.status != 'suspended'
  ) AND get_current_role() = 'owner');

-- Aucune insertion via RLS (l'audit se fait via trigger)

-- ─── Migration 004 — Triggers ajout seul (interdit UPDATE et DELETE) ──────────
-- Journal et événements en ajout seul. Toute tentative de modification crée
-- une erreur. Les corrections se font par nouvelle ligne.

CREATE OR REPLACE FUNCTION fn_reject_update_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Les lignes d''événement sont en ajout seul. Créez une correction plutôt que de modifier.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tickets
CREATE TRIGGER trg_tickets_no_update_delete
  BEFORE UPDATE OR DELETE ON tickets
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

CREATE TRIGGER trg_ticket_lines_no_update_delete
  BEFORE UPDATE OR DELETE ON ticket_lines
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

CREATE TRIGGER trg_ticket_versions_no_update_delete
  BEFORE UPDATE OR DELETE ON ticket_versions
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

-- Ravitaillements
CREATE TRIGGER trg_ravitaillements_no_update_delete
  BEFORE UPDATE OR DELETE ON ravitaillements
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

CREATE TRIGGER trg_ravitaillement_lines_no_update_delete
  BEFORE UPDATE OR DELETE ON ravitaillement_lines
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

-- Corrections
CREATE TRIGGER trg_corrections_no_update_delete
  BEFORE UPDATE OR DELETE ON corrections
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

-- Casses
CREATE TRIGGER trg_casses_no_update_delete
  BEFORE UPDATE OR DELETE ON casses
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

-- Inventaires
CREATE TRIGGER trg_inventaires_no_update_delete
  BEFORE UPDATE OR DELETE ON inventaires
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

CREATE TRIGGER trg_inventaire_lines_no_update_delete
  BEFORE UPDATE OR DELETE ON inventaire_lines
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

-- Audit (jamais modifiable)
CREATE TRIGGER trg_audit_no_update_delete
  BEFORE UPDATE OR DELETE ON audit
  FOR EACH ROW EXECUTE FUNCTION fn_reject_update_delete();

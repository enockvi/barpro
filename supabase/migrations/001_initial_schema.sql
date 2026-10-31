-- ─── Migration 001 — Schéma initial BarPro ─────────────────────────────────────
-- Tables centrales. Tous les IDs sont UUID v4.
-- Les événements (tickets, ravitaillements, casses, inventaires, corrections)
-- sont en ajout seul : jamais de UPDATE ni DELETE.

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enumérations ────────────────────────────────────────────────────────────────
CREATE TYPE bar_status AS ENUM ('normal', 'trial', 'readonly', 'suspended', 'expired');
CREATE TYPE link_status AS ENUM ('unused', 'activated', 'revoked');
CREATE TYPE code_status AS ENUM ('generated', 'used', 'expired');
CREATE TYPE ravitaillement_status AS ENUM ('draft', 'validated');
CREATE TYPE casse_motif AS ENUM ('cassée', 'defaillante', 'perimee', 'autre');

-- ── bars ────────────────────────────────────────────────────────────────────────
CREATE TABLE bars (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  rccm             TEXT,
  location         TEXT NOT NULL,
  type             TEXT NOT NULL DEFAULT 'main' CHECK (type IN ('main', 'annexe')),
  status           bar_status NOT NULL DEFAULT 'normal',
  trial_start      TIMESTAMPTZ,
  trial_end        TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  whatsapp_owner   TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  synced_at        TIMESTAMPTZ
);

-- ── owners ──────────────────────────────────────────────────────────────────────
CREATE TABLE owners (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id     UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  whatsapp   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── managers ────────────────────────────────────────────────────────────────────
CREATE TABLE managers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id      UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  linked_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at  TIMESTAMPTZ,
  last_synced TIMESTAMPTZ
);

-- ── devices ─────────────────────────────────────────────────────────────────────
CREATE TABLE devices (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id     UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('manager', 'owner')),
  device_id  TEXT NOT NULL,
  linked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  last_synced TIMESTAMPTZ,
  UNIQUE(bar_id, device_id, role)
);

-- ── links ───────────────────────────────────────────────────────────────────────
CREATE TABLE links (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id        UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  token         TEXT NOT NULL UNIQUE,
  role          TEXT NOT NULL CHECK (role IN ('owner', 'manager')),
  status        link_status NOT NULL DEFAULT 'unused',
  device_id     TEXT,
  owner_id      UUID REFERENCES owners(id),
  manager_id    UUID REFERENCES managers(id),
  activated_at  TIMESTAMPTZ,
  revoked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ
);

-- ── products ────────────────────────────────────────────────────────────────────
CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id              UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  category            TEXT NOT NULL,
  format              TEXT NOT NULL,
  size                TEXT NOT NULL DEFAULT '',
  bottles_per_case    INTEGER NOT NULL CHECK (bottles_per_case > 0),
  buy_price_per_case  INTEGER NOT NULL DEFAULT 0,
  sell_price          INTEGER,
  promo_quantity      INTEGER,
  promo_price         INTEGER,
  alert_threshold     INTEGER NOT NULL DEFAULT 1,
  active              BOOLEAN NOT NULL DEFAULT true,
  photo_path          TEXT,
  drive_file_id       TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── tickets ─────────────────────────────────────────────────────────────────────
CREATE TABLE tickets (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id           UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  manager_id       UUID NOT NULL REFERENCES managers(id) ON DELETE RESTRICT,
  device_id        TEXT NOT NULL,
  commercial_day   TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  total            INTEGER NOT NULL DEFAULT 0,
  cancelled        BOOLEAN NOT NULL DEFAULT false,
  suspect_hour     BOOLEAN DEFAULT false,
  version_count    INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE ticket_lines (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id     UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name  TEXT NOT NULL,
  qty           INTEGER NOT NULL CHECK (qty > 0),
  unit_price    INTEGER NOT NULL,
  promo_applied BOOLEAN NOT NULL DEFAULT false,
  line_total    INTEGER NOT NULL
);

CREATE TABLE ticket_versions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id   UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by  TEXT NOT NULL,
  reason      TEXT,
  total       INTEGER NOT NULL,
  lines_json  JSONB NOT NULL
);

-- ── ravitaillements ─────────────────────────────────────────────────────────────
CREATE TABLE ravitaillements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id          UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  manager_id      UUID NOT NULL REFERENCES managers(id) ON DELETE RESTRICT,
  device_id       TEXT NOT NULL,
  commercial_day  TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  validated_at    TIMESTAMPTZ,
  locked          BOOLEAN NOT NULL DEFAULT false,
  status          ravitaillement_status NOT NULL DEFAULT 'draft'
);

CREATE TABLE ravitaillement_lines (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ravitaillement_id     UUID NOT NULL REFERENCES ravitaillements(id) ON DELETE CASCADE,
  product_id            UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  bottles_per_case      INTEGER NOT NULL,
  casiers               INTEGER NOT NULL CHECK (casiers >= 0),
  bouteilles            INTEGER NOT NULL CHECK (bouteilles >= 0),
  buy_price_per_bottle  INTEGER NOT NULL DEFAULT 0
);

-- ── corrections ─────────────────────────────────────────────────────────────────
CREATE TABLE corrections (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id                    UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  manager_id                UUID NOT NULL REFERENCES managers(id) ON DELETE RESTRICT,
  device_id                 TEXT NOT NULL,
  commercial_day            TIMESTAMPTZ NOT NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_ravitaillement_id  UUID REFERENCES ravitaillements(id) ON DELETE SET NULL,
  product_id                UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  delta_casiers             INTEGER NOT NULL,
  delta_bouteilles          INTEGER NOT NULL,
  buy_price_per_bottle      INTEGER NOT NULL DEFAULT 0,
  motif                     TEXT NOT NULL
);

-- ── casses ──────────────────────────────────────────────────────────────────────
CREATE TABLE casses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id        UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  manager_id    UUID NOT NULL REFERENCES managers(id) ON DELETE RESTRICT,
  device_id     TEXT NOT NULL,
  commercial_day TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  motif         casse_motif NOT NULL,
  motif_detail  TEXT
);

-- ── inventaires ─────────────────────────────────────────────────────────────────
CREATE TABLE inventaires (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id          UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  manager_id      UUID NOT NULL REFERENCES managers(id) ON DELETE RESTRICT,
  device_id       TEXT NOT NULL,
  commercial_day  TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_passation    BOOLEAN NOT NULL DEFAULT false,
  passed          BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE inventaire_lines (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventaire_id UUID NOT NULL REFERENCES inventaires(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  casiers       INTEGER NOT NULL DEFAULT 0,
  bouteilles    INTEGER NOT NULL DEFAULT 0
);

-- ── codes_abonnement ────────────────────────────────────────────────────────────
CREATE TABLE codes_abonnement (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code             TEXT NOT NULL UNIQUE,
  duration_months  INTEGER NOT NULL CHECK (duration_months BETWEEN 1 AND 24),
  status           code_status NOT NULL DEFAULT 'generated',
  bar_id           UUID REFERENCES bars(id) ON DELETE SET NULL,
  owner_id         UUID REFERENCES owners(id) ON DELETE SET NULL,
  generated_by     UUID REFERENCES managers(id),
  generated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at          TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ
);

-- ── audit ───────────────────────────────────────────────────────────────────────
CREATE TABLE audit (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_id    TEXT NOT NULL,
  actor_role  TEXT NOT NULL CHECK (actor_role IN ('manager', 'owner', 'pdg')),
  action      TEXT NOT NULL,
  target_kind TEXT NOT NULL,
  target_id   UUID,
  details     JSONB NOT NULL DEFAULT '{}'::jsonb,
  device_id   TEXT
);

-- ── index ───────────────────────────────────────────────────────────────────────
CREATE INDEX idx_tickets_bar_commercial ON tickets(bar_id, commercial_day);
CREATE INDEX idx_tickets_manager ON tickets(manager_id);
CREATE INDEX idx_ravitaillements_bar_commercial ON ravitaillements(bar_id, commercial_day);
CREATE INDEX idx_corrections_bar_commercial ON corrections(bar_id, commercial_day);
CREATE INDEX idx_casses_bar_commercial ON casses(bar_id, commercial_day);
CREATE INDEX idx_inventaires_bar ON inventaires(bar_id);
CREATE INDEX idx_links_bar_status ON links(bar_id, status);
CREATE INDEX idx_codes_status ON codes_abonnement(status);
CREATE INDEX idx_audit_created ON audit(created_at DESC);
CREATE INDEX idx_audit_actor ON audit(actor_id, action);

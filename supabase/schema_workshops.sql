-- =====================================================
-- SENSORIA KIDS — Workshops Schema
-- Run in: Supabase Dashboard → SQL Editor → Run all
-- =====================================================

-- ─── WORKSHOPS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workshops (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT NOT NULL DEFAULT '',
  date             TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  location         TEXT NOT NULL,
  price            NUMERIC(10,2) NOT NULL DEFAULT 0,
  age_min          INTEGER NOT NULL DEFAULT 4,
  age_max          INTEGER NOT NULL DEFAULT 10,
  max_participants INTEGER NOT NULL DEFAULT 20,
  includes         TEXT[] NOT NULL DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft','active','full','closed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── WORKSHOP REGISTRATIONS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id  UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  parent_name  TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  child_name   TEXT NOT NULL,
  child_age    INTEGER NOT NULL,
  notes        TEXT,
  status       TEXT NOT NULL DEFAULT 'confirmed'
               CHECK (status IN ('confirmed','cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Public: citește atelierele active/pline
CREATE POLICY "public_read_workshops" ON workshops
  FOR SELECT USING (status IN ('active','full'));

-- Autentificat: citește toate (admin)
CREATE POLICY "admin_all_workshops" ON workshops
  FOR ALL USING (auth.role() = 'authenticated');

-- Public: inserează înregistrare
CREATE POLICY "public_insert_registration" ON workshop_registrations
  FOR INSERT WITH CHECK (true);

-- Public: numără înregistrări (pentru afișaj locuri disponibile)
CREATE POLICY "public_count_registrations" ON workshop_registrations
  FOR SELECT USING (true);

-- ─── AUTO-CLOSE WHEN FULL (trigger) ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION check_workshop_capacity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  reg_count   INTEGER;
  max_part    INTEGER;
BEGIN
  SELECT COUNT(*) INTO reg_count
  FROM workshop_registrations
  WHERE workshop_id = NEW.workshop_id AND status = 'confirmed';

  SELECT max_participants INTO max_part
  FROM workshops WHERE id = NEW.workshop_id;

  IF reg_count >= max_part THEN
    UPDATE workshops SET status = 'full', updated_at = now()
    WHERE id = NEW.workshop_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_capacity ON workshop_registrations;
CREATE TRIGGER trg_check_capacity
  AFTER INSERT ON workshop_registrations
  FOR EACH ROW EXECUTE FUNCTION check_workshop_capacity();

-- ─── SEED: primul atelier ────────────────────────────────────────────────────
INSERT INTO workshops (title, slug, description, date, duration_minutes, location, price, age_min, age_max, max_participants, includes, status)
VALUES (
  'Corpul uman explicat',
  'corpul-uman-explicat',
  'O activitate unde curiozitatea copilului tău devine o operă de artă. Nisip colorat, o lecție fascinantă despre corpul uman și 60 de minute de creativitate pură — în aer liber, în inima Bucureștiului.',
  '2026-07-18 17:00:00+03',
  60,
  'Parcul Kisseleff, Scena',
  90,
  4,
  10,
  20,
  ARRAY[
    'Planșă Corpul Uman',
    'Nisip colorat în eprubete',
    'Pungă transparentă cu clapetă',
    'Penseta pentru dezlipire',
    'Lecție despre corpul uman — cititor de la Clubul Curioșilor'
  ],
  'active'
)
ON CONFLICT (slug) DO NOTHING;

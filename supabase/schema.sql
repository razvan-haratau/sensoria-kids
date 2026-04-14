-- =====================================================
-- SENSORIA KIDS — Supabase Schema
-- Run in: Supabase Dashboard → SQL Editor → Run all
-- =====================================================

-- ─── EXTENSIONS ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PRODUCTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name               TEXT NOT NULL,
  description        TEXT NOT NULL DEFAULT '',
  price              NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_price      NUMERIC(10,2),
  show_compare_price BOOLEAN NOT NULL DEFAULT false,
  sku                TEXT UNIQUE NOT NULL,
  stock_qty          INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  category           TEXT NOT NULL,
  age_range          TEXT NOT NULL,
  difficulty         TEXT NOT NULL CHECK (difficulty IN ('Ușor','Mediu','Avansat')),
  images             TEXT[] NOT NULL DEFAULT '{}',
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','draft','out_of_stock')),
  weight             INTEGER,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── ORDERS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  customer_email   TEXT NOT NULL,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL DEFAULT '',
  shipping_address JSONB NOT NULL,
  items            JSONB NOT NULL DEFAULT '[]',
  total            NUMERIC(10,2) NOT NULL,
  shipping_cost    NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status   TEXT NOT NULL DEFAULT 'pending'
                     CHECK (payment_status IN ('pending','paid','failed','refunded')),
  order_status     TEXT NOT NULL DEFAULT 'Nouă'
                     CHECK (order_status IN ('Nouă','În procesare','Expediată','Livrată','Anulată')),
  payment_method   TEXT NOT NULL DEFAULT 'card'
                     CHECK (payment_method IN ('card','ramburs')),
  netopia_ntpid    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── NEWSLETTER SUBSCRIBERS ──────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── SETTINGS (singleton row id=1) ───────────────
CREATE TABLE IF NOT EXISTS settings (
  id                      INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name              TEXT NOT NULL DEFAULT 'Sensoria Kids',
  email                   TEXT NOT NULL DEFAULT 'contact@sensoriakids.ro',
  phone                   TEXT NOT NULL DEFAULT '+40 722 000 000',
  address                 TEXT NOT NULL DEFAULT 'România',
  instagram_url           TEXT NOT NULL DEFAULT 'https://instagram.com/sensoriakids',
  facebook_url            TEXT NOT NULL DEFAULT 'https://facebook.com/sensoriakids',
  free_shipping_threshold NUMERIC(10,2) NOT NULL DEFAULT 150,
  shipping_cost           NUMERIC(10,2) NOT NULL DEFAULT 15,
  low_stock_threshold     INTEGER NOT NULL DEFAULT 5,
  currency                TEXT NOT NULL DEFAULT 'RON',
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── AUTO-UPDATE TRIGGER ─────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS settings_updated_at ON settings;
CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings             ENABLE ROW LEVEL SECURITY;

-- Products: public read, authenticated write
CREATE POLICY "products_public_read"   ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_insert"  ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "products_admin_update"  ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "products_admin_delete"  ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Orders: anyone can insert, only authenticated admin can read/update
CREATE POLICY "orders_public_insert"   ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_admin_read"      ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "orders_admin_update"    ON orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Newsletter: anyone can insert, only admin can read
CREATE POLICY "newsletter_public_insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin_read"    ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');

-- Settings: public read, only admin can update
CREATE POLICY "settings_public_read"   ON settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_update"  ON settings FOR UPDATE USING (auth.role() = 'authenticated');

-- ─── SUPABASE STORAGE ────────────────────────────
-- Run separately in Storage tab:
-- 1. Create bucket: "product-images" (public: true)
-- 2. Add policy: INSERT for authenticated users
-- 3. Add policy: SELECT for everyone (public: true on bucket)

-- ─── SEED: DEFAULT SETTINGS ──────────────────────
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─── SEED: PRODUCTS ──────────────────────────────
INSERT INTO products (name, description, price, compare_price, show_compare_price, sku, stock_qty, category, age_range, difficulty, images, status, weight, created_at, updated_at) VALUES
(
  'Planșă Nisip - Fluturi Colorați',
  'Un kit creativ cu 3 planșe de nisip cu fluturi, perfect pentru copiii care încep să exploreze culorile. Include nisip colorat în 6 culori vibrante și un instrument de aplicare.',
  45, 55, true, 'SNS-001', 23, 'Planșe Simple', '2-4', 'Ușor',
  ARRAY['https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80','https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80'],
  'active', 300, '2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z'
),(
  'Kit Complet - Grădina Fermecată',
  'Kit complet cu 5 planșe de nisip tematice cu flori și animale din grădină. Include nisip în 8 culori, 2 instrumente de aplicare și un suport de expunere.',
  89, 110, true, 'KIT-002', 15, 'Kit Complet', '4-6', 'Ușor',
  ARRAY['https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=600&q=80','https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80'],
  'active', 600, '2024-01-20T10:00:00Z', '2024-01-20T10:00:00Z'
),(
  'Planșă Nisip - Animale Safari',
  'Explorează savana cu 4 planșe de nisip cu animale exotice. Elefanți, girafe, lei și zebre așteaptă să prindă culoare sub mâinile micuților artiști.',
  59, NULL, false, 'SNS-003', 8, 'Planșe Simple', '4-6', 'Mediu',
  ARRAY['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80'],
  'active', 400, '2024-02-01T10:00:00Z', '2024-02-01T10:00:00Z'
),(
  'Kit Complet - Univers și Stele',
  'Călătorește prin galaxie cu 6 planșe de nisip cu planete, stele și rachete. Kit premium cu nisip sidefat în 10 culori, perfect pentru copiii mai mari.',
  125, NULL, false, 'KIT-004', 12, 'Kit Complet', '6-8', 'Mediu',
  ARRAY['https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80'],
  'active', 750, '2024-02-10T10:00:00Z', '2024-02-10T10:00:00Z'
),(
  'Nisip Colorat Premium - Set 12 Culori',
  'Set de reîncărcare cu nisip colorat de înaltă calitate, non-toxic și sigur pentru copii. 12 culori vibrante în pungi resigillabile de 50g fiecare.',
  38, NULL, false, 'NSP-005', 45, 'Nisip Colorat', '2-4', 'Ușor',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
  'active', 700, '2024-02-15T10:00:00Z', '2024-02-15T10:00:00Z'
),(
  'Kit Avansat - Mandale și Geometrie',
  'Pentru copiii creativi și răbdători. 8 planșe complexe de nisip cu motive de mandale și forme geometrice. Include ghid de tehnici avansate de colorare.',
  149, NULL, false, 'KIT-006', 6, 'Kit Complet', '8-10', 'Avansat',
  ARRAY['https://images.unsplash.com/photo-1605106702734-205df224ecce?w=600&q=80'],
  'active', 900, '2024-03-01T10:00:00Z', '2024-03-01T10:00:00Z'
),(
  'Planșă Nisip - Principese și Castele',
  'Trei planșe magice cu principese, castele și unicorni pentru micile prințese. Culorile pastelate și detaliile fine vor captiva imaginația copilului.',
  49, 60, false, 'SNS-007', 0, 'Planșe Simple', '4-6', 'Ușor',
  ARRAY['https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80'],
  'out_of_stock', 350, '2024-03-05T10:00:00Z', '2024-03-05T10:00:00Z'
),(
  'Accesorii Premium - Set Pensule și Spatule',
  'Set de accesorii profesionale pentru planșele de nisip: 5 pensule de diferite grosimi, 3 spatule de nivelare și 1 suflător pentru detalii fine.',
  28, NULL, false, 'ACC-008', 30, 'Accesorii', '6-8', 'Mediu',
  ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80'],
  'active', 150, '2024-03-10T10:00:00Z', '2024-03-10T10:00:00Z'
)
ON CONFLICT (sku) DO NOTHING;

-- ─── ADMIN USER ──────────────────────────────────
-- Create admin in Supabase Dashboard:
-- Authentication → Users → Add user
-- Email: admin@sensoriakids.ro (sau adresa ta reală)
-- Password: alege o parolă puternică
-- After creation, the user can log into /admin using email + password

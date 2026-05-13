-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. Create Shops Table
-- ==========================================
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  config JSONB DEFAULT '{"primaryColor": "#000000"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster routing by slug
CREATE INDEX idx_shops_slug ON shops(slug);

-- ==========================================
-- 2. Create Glasses Table (Products)
-- ==========================================
CREATE TABLE glasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  image_url TEXT NOT NULL,  -- Thumbnail / preview image
  model_url TEXT,           -- Transparent PNG overlay or 3D model path
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster fetching of a shop's glasses
CREATE INDEX idx_glasses_shop_id ON glasses(shop_id);

-- ==========================================
-- 3. Row Level Security (RLS) Policies
-- ==========================================
-- For the MVP, we allow public read access so customers can view shops and products.
-- Write access would typically be restricted to authenticated shop owners via Supabase Auth.

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE glasses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read shop data
CREATE POLICY "Public shops are viewable by everyone."
  ON shops FOR SELECT
  USING (true);

-- Allow anyone to read active glasses data
CREATE POLICY "Active glasses are viewable by everyone."
  ON glasses FOR SELECT
  USING (is_active = true);

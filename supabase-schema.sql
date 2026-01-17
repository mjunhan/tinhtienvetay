-- ==========================================
-- TINHTIENVETAY v0.2.0 - Database Schema
-- ==========================================
-- Database: PostgreSQL (Supabase)
-- Purpose: Dynamic pricing management for shipping calculator
-- ==========================================

-- Table 1: Global Settings (Exchange Rate, Contact Info)
-- ==========================================
CREATE TABLE IF NOT EXISTS global_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO global_settings (key, value, description) VALUES
  ('exchange_rate', '3960', 'Tỷ giá CNY sang VND'),
  ('hotline', '0912345678', 'Số hotline hỗ trợ'),
  ('zalo_link', 'https://zalo.me/tinhtienvetay', 'Link Zalo OA')
ON CONFLICT (key) DO NOTHING;

-- Table 2: Service Fee Rules
-- ==========================================
-- Logic: Service fee % based on order value ranges and deposit %
CREATE TABLE IF NOT EXISTS service_fee_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_order_value NUMERIC NOT NULL,
  max_order_value NUMERIC NOT NULL,
  deposit_percent INTEGER NOT NULL CHECK (deposit_percent IN (70, 80)),
  fee_percent NUMERIC NOT NULL CHECK (fee_percent >= 0 AND fee_percent <= 100),
  method TEXT NOT NULL CHECK (method IN ('TMDT', 'TieuNgach', 'ChinhNgach')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_value_range CHECK (min_order_value <= max_order_value)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_service_fee_method ON service_fee_rules(method);
CREATE INDEX IF NOT EXISTS idx_service_fee_deposit ON service_fee_rules(deposit_percent);

-- Table 3: Shipping Rate Rules
-- ==========================================
-- Flexible table to handle:
-- - TMDT/TieuNgach: value_based (rate per kg based on order value tiers)
-- - ChinhNgach Heavy: weight_based (rate per kg based on weight tiers)
-- - ChinhNgach Bulky: volume_based (rate per m3 based on volume tiers)
CREATE TABLE IF NOT EXISTS shipping_rate_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method TEXT NOT NULL CHECK (method IN ('TMDT', 'TieuNgach', 'ChinhNgach')),
  warehouse TEXT NOT NULL CHECK (warehouse IN ('HN', 'HCM')),
  type TEXT NOT NULL CHECK (type IN ('value_based', 'weight_based', 'volume_based')),
  
  -- For value_based: min/max are VND order values
  -- For weight_based: min/max are kg
  -- For volume_based: min/max are m3
  min_value NUMERIC NOT NULL,
  max_value NUMERIC NOT NULL,
  
  -- Price in VND/kg for weight-based or VND/m3 for volume-based
  price NUMERIC NOT NULL,
  
  -- Optional: Distinguish heavy vs bulky for ChinhNgach
  subtype TEXT CHECK (subtype IN ('heavy', 'bulky', NULL)),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_tier_range CHECK (min_value <= max_value)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shipping_method ON shipping_rate_rules(method);
CREATE INDEX IF NOT EXISTS idx_shipping_warehouse ON shipping_rate_rules(warehouse);
CREATE INDEX IF NOT EXISTS idx_shipping_type ON shipping_rate_rules(type);

-- Enable Row Level Security (RLS)
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_fee_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rate_rules ENABLE ROW LEVEL SECURITY;

-- Public read access (all tables)
CREATE POLICY "Allow public read access on global_settings"
  ON global_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on service_fee_rules"
  ON service_fee_rules FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on shipping_rate_rules"
  ON shipping_rate_rules FOR SELECT
  USING (true);

-- Admin write access will be handled via service role or authenticated users
-- For now, we'll allow all writes (you can restrict this later with auth.uid())
CREATE POLICY "Allow all write access on global_settings"
  ON global_settings FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all write access on service_fee_rules"
  ON service_fee_rules FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all write access on shipping_rate_rules"
  ON shipping_rate_rules FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- Update trigger for updated_at timestamps
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_global_settings_updated_at
  BEFORE UPDATE ON global_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_fee_rules_updated_at
  BEFORE UPDATE ON service_fee_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_rate_rules_updated_at
  BEFORE UPDATE ON shipping_rate_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Comments for documentation
-- ==========================================
COMMENT ON TABLE global_settings IS 'Global application settings like exchange rate and contact info';
COMMENT ON TABLE service_fee_rules IS 'Service fee percentages based on order value ranges, deposit %, and shipping method';
COMMENT ON TABLE shipping_rate_rules IS 'Shipping rates for different methods, warehouses, and tier types (value/weight/volume based)';

COMMENT ON COLUMN shipping_rate_rules.type IS 'value_based: tier by order value (TMDT/TieuNgach), weight_based: tier by kg (ChinhNgach Heavy), volume_based: tier by m3 (ChinhNgach Bulky)';
COMMENT ON COLUMN shipping_rate_rules.subtype IS 'For ChinhNgach: heavy or bulky. NULL for TMDT/TieuNgach';

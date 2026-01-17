-- ==========================================
-- SEED DATA: Migrate from data/pricing.json
-- ==========================================
-- Run this AFTER creating the schema
-- This populates the tables with existing v0.1.0 pricing data
-- ==========================================

-- Seed Service Fee Rules
-- Based on the existing pricing.json structure
-- For TMDT and TieuNgach (Normal shipping)
INSERT INTO service_fee_rules (min_order_value, max_order_value, deposit_percent, fee_percent, method) VALUES
  -- TMDT (0-2M: 3%, 2-5M: 1.5%, 5M+: 1.2%)
  (0, 2000000, 70, 3.0, 'TMDT'),
  (0, 2000000, 80, 2.5, 'TMDT'),
  (2000001, 5000000, 70, 1.5, 'TMDT'),
  (2000001, 5000000, 80, 1.0, 'TMDT'),
  (5000001, 999999999999, 70, 1.2, 'TMDT'),
  (5000001, 999999999999, 80, 0.7, 'TMDT'),
  
  -- TieuNgach (Normal) - Same fee structure as TMDT
  (0, 2000000, 70, 3.0, 'TieuNgach'),
  (0, 2000000, 80, 2.5, 'TieuNgach'),
  (2000001, 5000000, 70, 1.5, 'TieuNgach'),
  (2000001, 5000000, 80, 1.0, 'TieuNgach'),
  (5000001, 999999999999, 70, 1.2, 'TieuNgach'),
  (5000001, 999999999999, 80, 0.7, 'TieuNgach'),
  
  -- ChinhNgach (Official) - 1% for orders >= 30M, fixed 300k for < 30M
  (0, 29999999, 70, 0, 'ChinhNgach'),
  (0, 29999999, 80, 0, 'ChinhNgach'),
  (30000000, 999999999999, 70, 1.0, 'ChinhNgach'),
  (30000000, 999999999999, 80, 1.0, 'ChinhNgach');

-- Seed Shipping Rate Rules
-- TMDT: Value-based (rate per kg changes based on order value)
INSERT INTO shipping_rate_rules (method, warehouse, type, min_value, max_value, price, subtype) VALUES
  -- TMDT - HN (value-based tiers)
  ('TMDT', 'HN', 'value_based', 0, 2000000, 23500, NULL),
  ('TMDT', 'HN', 'value_based', 2000001, 5000000, 20000, NULL),
  ('TMDT', 'HN', 'value_based', 5000001, 999999999999, 19500, NULL),
  
  -- TMDT - HCM
  ('TMDT', 'HCM', 'value_based', 0, 2000000, 28500, NULL),
  ('TMDT', 'HCM', 'value_based', 2000001, 5000000, 25000, NULL),
  ('TMDT', 'HCM', 'value_based', 5000001, 999999999999, 23500, NULL),
  
  -- TieuNgach (Normal) - HN (value-based with actual rates)
  ('TieuNgach', 'HN', 'value_based', 0, 2000000, 19000, NULL),
  ('TieuNgach', 'HN', 'value_based', 2000001, 5000000, 14000, NULL),
  ('TieuNgach', 'HN', 'value_based', 5000001, 999999999999, 8000, NULL),
  
  -- TieuNgach (Normal) - HCM
  ('TieuNgach', 'HCM', 'value_based', 0, 2000000, 24000, NULL),
  ('TieuNgach', 'HCM', 'value_based', 2000001, 5000000, 19000, NULL),
  ('TieuNgach', 'HCM', 'value_based', 5000001, 999999999999, 12000, NULL),
  
  -- ChinhNgach Heavy (weight-based tiers in kg) - HN
  ('ChinhNgach', 'HN', 'weight_based', 0, 100, 7500, 'heavy'),
  ('ChinhNgach', 'HN', 'weight_based', 100, 500, 7000, 'heavy'),
  ('ChinhNgach', 'HN', 'weight_based', 500, 1000, 6500, 'heavy'),
  ('ChinhNgach', 'HN', 'weight_based', 1000, 2000, 6000, 'heavy'),
  ('ChinhNgach', 'HN', 'weight_based', 2000, 999999999, 5500, 'heavy'),
  
  -- ChinhNgach Heavy - HCM
  ('ChinhNgach', 'HCM', 'weight_based', 0, 100, 11500, 'heavy'),
  ('ChinhNgach', 'HCM', 'weight_based', 100, 500, 11000, 'heavy'),
  ('ChinhNgach', 'HCM', 'weight_based', 500, 1000, 10500, 'heavy'),
  ('ChinhNgach', 'HCM', 'weight_based', 1000, 2000, 10000, 'heavy'),
  ('ChinhNgach', 'HCM', 'weight_based', 2000, 999999999, 9500, 'heavy'),
  
  -- ChinhNgach Bulky (volume-based tiers in m3) - HN
  ('ChinhNgach', 'HN', 'volume_based', 0, 10, 1200000, 'bulky'),
  ('ChinhNgach', 'HN', 'volume_based', 10, 20, 1100000, 'bulky'),
  ('ChinhNgach', 'HN', 'volume_based', 20, 30, 1000000, 'bulky'),
  ('ChinhNgach', 'HN', 'volume_based', 30, 999999, 950000, 'bulky'),
  
  -- ChinhNgach Bulky - HCM
  ('ChinhNgach', 'HCM', 'volume_based', 0, 10, 1800000, 'bulky'),
  ('ChinhNgach', 'HCM', 'volume_based', 10, 20, 1700000, 'bulky'),
  ('ChinhNgach', 'HCM', 'volume_based', 20, 30, 1600000, 'bulky'),
  ('ChinhNgach', 'HCM', 'volume_based', 30, 999999, 1550000, 'bulky');

-- ==========================================
-- Verification Queries
-- ==========================================
-- Run these to verify the data was inserted correctly

-- Check global settings
SELECT * FROM global_settings;

-- Check service fee rules count
SELECT method, deposit_percent, COUNT(*) as rule_count
FROM service_fee_rules
GROUP BY method, deposit_percent
ORDER BY method, deposit_percent;

-- Check shipping rate rules count
SELECT method, warehouse, type, COUNT(*) as rule_count
FROM shipping_rate_rules
GROUP BY method, warehouse, type
ORDER BY method, warehouse, type;

-- Example query: Get TMDT shipping rate for HN with order value 3M
SELECT price as rate_per_kg
FROM shipping_rate_rules
WHERE method = 'TMDT'
  AND warehouse = 'HN'
  AND type = 'value_based'
  AND 3000000 BETWEEN min_value AND max_value;

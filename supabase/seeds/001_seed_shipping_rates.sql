-- Clean old data
DELETE FROM shipping_rate_rules;

-- Seed Normal Shipping (TieuNgach)
INSERT INTO shipping_rate_rules (method, type, warehouse, min_value, max_value, price) VALUES
('TieuNgach', 'value_based', 'HN', 0, 2000000, 19000),
('TieuNgach', 'value_based', 'HCM', 0, 2000000, 24000),
('TieuNgach', 'value_based', 'HN', 2000000, 5000000, 14000),
('TieuNgach', 'value_based', 'HCM', 2000000, 5000000, 19000),
('TieuNgach', 'value_based', 'HN', 5000000, 99999999999, 8000),
('TieuNgach', 'value_based', 'HCM', 5000000, 99999999999, 12000);

-- Seed TMDT Shipping
INSERT INTO shipping_rate_rules (method, type, warehouse, min_value, max_value, price) VALUES
('TMDT', 'value_based', 'HN', 0, 2000000, 25000),
('TMDT', 'value_based', 'HCM', 0, 2000000, 30000),
('TMDT', 'value_based', 'HN', 2000000, 99999999999, 22000),
('TMDT', 'value_based', 'HCM', 2000000, 99999999999, 27000);

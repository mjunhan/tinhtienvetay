-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Drop the existing restrictive constraint
ALTER TABLE service_fee_rules
DROP CONSTRAINT IF EXISTS service_fee_rules_deposit_percent_check;

-- 2. Add a new constraint allowing 0-100%
ALTER TABLE service_fee_rules
ADD CONSTRAINT service_fee_rules_deposit_percent_check 
CHECK (deposit_percent >= 0 AND deposit_percent <= 100);

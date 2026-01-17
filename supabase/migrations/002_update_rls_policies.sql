-- ==========================================
-- TINHTIENVETAY v0.2.1 - RLS Policy Update
-- ==========================================
-- Purpose: Refine RLS policies to secure UPDATE operations
-- Migration: 002
-- ==========================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow all write access on global_settings" ON global_settings;
DROP POLICY IF EXISTS "Allow all write access on service_fee_rules" ON service_fee_rules;
DROP POLICY IF EXISTS "Allow all write access on shipping_rate_rules" ON shipping_rate_rules;

-- Create specific UPDATE policies for authenticated users only
CREATE POLICY "Enable update for authenticated users only" 
  ON "public"."global_settings" 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
  ON "public"."service_fee_rules" 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
  ON "public"."shipping_rate_rules" 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Insert policies still allowed for service role (Supabase admin)
CREATE POLICY "Enable insert for authenticated users only" 
  ON "public"."global_settings" 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" 
  ON "public"."service_fee_rules" 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" 
  ON "public"."shipping_rate_rules" 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Delete policies for authenticated users
CREATE POLICY "Enable delete for authenticated users only" 
  ON "public"."global_settings" 
  FOR DELETE 
  TO authenticated 
  USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
  ON "public"."service_fee_rules" 
  FOR DELETE 
  TO authenticated 
  USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
  ON "public"."shipping_rate_rules" 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- ==========================================
-- Comments
-- ==========================================
COMMENT ON POLICY "Enable update for authenticated users only" ON global_settings IS 'v0.2.1: Allow authenticated admin users to update global settings';
COMMENT ON POLICY "Enable update for authenticated users only" ON service_fee_rules IS 'v0.2.1: Allow authenticated admin users to update service fee rules';
COMMENT ON POLICY "Enable update for authenticated users only" ON shipping_rate_rules IS 'v0.2.1: Allow authenticated admin users to update shipping rates';

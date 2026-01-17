-- ==========================================
-- TINHTIENVETAY v0.3.0 - Blog Posts Table
-- ==========================================
-- Purpose: Create posts table for Blog CMS system
-- Migration: 003
-- ==========================================

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view published posts
CREATE POLICY "Public can view published posts" 
  ON "public"."posts" 
  FOR SELECT 
  USING (is_published = true);

-- RLS Policy: Authenticated users (admin) can do everything
CREATE POLICY "Admin can insert posts" 
  ON "public"."posts" 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admin can update posts" 
  ON "public"."posts" 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Admin can delete posts" 
  ON "public"."posts" 
  FOR DELETE 
  TO authenticated 
  USING (true);

CREATE POLICY "Admin can view all posts" 
  ON "public"."posts" 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);

-- Create index on is_published for faster filtering
CREATE INDEX IF NOT EXISTS posts_is_published_idx ON posts(is_published);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Comments
-- ==========================================
COMMENT ON TABLE posts IS 'v0.3.0: Blog posts for "Mẹo nhập hàng" feature';
COMMENT ON COLUMN posts.slug IS 'URL-friendly identifier, auto-generated from title';
COMMENT ON COLUMN posts.excerpt IS 'Short description for blog index cards';
COMMENT ON COLUMN posts.content IS 'Full post content (HTML or Markdown)';
COMMENT ON COLUMN posts.thumbnail_url IS 'Featured image URL for blog cards';
COMMENT ON COLUMN posts.is_published IS 'Whether post is visible to public';

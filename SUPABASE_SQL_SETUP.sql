-- ============================================
-- SUPABASE SETUP SQL
-- ============================================
-- Copy and paste this entire SQL block into
-- Supabase SQL Editor and click Run
-- ============================================

-- Drop existing table and recreate (clean slate)
DROP TABLE IF EXISTS public.links CASCADE;

-- Create links table
CREATE TABLE public.links (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  badge TEXT,
  commission TEXT,
  cta TEXT DEFAULT 'Learn More',
  highlight BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own links"
  ON public.links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
  ON public.links FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
  ON public.links FOR DELETE
  USING (auth.uid() = user_id);

-- Allow public read access (for main website)
CREATE POLICY "Public can view all links"
  ON public.links FOR SELECT
  USING (TRUE);

-- Create indexes for better performance
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_category ON public.links(category);
CREATE INDEX idx_links_created_at ON public.links(created_at DESC);

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Go to https://app.supabase.com
-- 2. Select your project
-- 3. Click "SQL Editor" in left sidebar
-- 4. Click "New Query"
-- 5. Copy and paste this entire SQL block
-- 6. Click "Run"
-- 7. You should see "Success" message
-- 8. Check "Tables" in left sidebar to verify
-- ============================================

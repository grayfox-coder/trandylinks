-- ============================================
-- SUPABASE DIAGNOSTIC QUERIES
-- Run these one at a time to debug the issue
-- ============================================

-- Step 1: Check if links table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'links'
) AS table_exists;

-- Step 2: List all columns in links table (if it exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'links'
ORDER BY ordinal_position;

-- Step 3: Check if RLS is enabled on links table
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'links';

-- Step 4: List all policies on links table
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'links';

-- Step 5: Check table structure with full details
\d public.links

-- Step 6: If table doesn't exist, create it fresh
-- ONLY RUN THIS IF TABLE DOESN'T EXIST
CREATE TABLE IF NOT EXISTS public.links (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  badge TEXT,
  commission TEXT,
  cta TEXT DEFAULT 'Learn More',
  highlight BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create index
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);

-- Step 8: Enable RLS
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Step 9: Drop existing policies (if they exist and are causing issues)
DROP POLICY IF EXISTS "Users can view their own links" ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links" ON public.links;
DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;

-- Step 10: Create policies one by one
CREATE POLICY "Users can view their own links"
  ON public.links
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links"
  ON public.links
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
  ON public.links
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
  ON public.links
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 11: Verify policies were created
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'links'
ORDER BY policyname;

-- Step 12: Test insert (replace with real user_id)
-- INSERT INTO public.links (user_id, title, description, url, category)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Test', 'Test', 'https://test.com', 'test');

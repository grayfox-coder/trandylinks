# Supabase Setup Guide

## Quick Start (Copy & Paste)

### Step 1: Create Table (Run First)

Go to Supabase Dashboard → **SQL Editor** → Click **New Query** → Paste this:

```sql
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

CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
```

**Click "Run"** and wait for success message.

---

### Step 2: Enable RLS (Run Second)

Create a **new query** and paste:

```sql
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
```

**Click "Run"**

---

### Step 3: Create Policies (Run Third)

Create a **new query** and paste all of this:

```sql
-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can view their own links" ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links" ON public.links;
DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;

-- Create new policies
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
```

**Click "Run"**

---

## Step 4: Verify Everything Works

Create a **new query** and paste:

```sql
-- Check table exists
SELECT COUNT(*) as column_count FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'links';

-- Check RLS is enabled
SELECT relrowsecurity FROM pg_class WHERE relname = 'links';

-- Check policies exist
SELECT COUNT(*) as policy_count FROM pg_policies WHERE tablename = 'links';
```

You should see:
- `column_count: 11` (11 columns)
- `relrowsecurity: true` (RLS enabled)
- `policy_count: 4` (4 policies)

---

## Step 5: Configure Your App

Update these two files with your Supabase credentials:

### File 1: `js/supabase-config.js`
Find these lines and replace:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### File 2: `admin/admin-supabase.js`
Find these lines and replace:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

**Where to find your credentials:**
1. Go to Supabase Dashboard
2. Click **Settings** (bottom left)
3. Click **API**
4. Copy **Project URL** and **anon public key**

---

## Troubleshooting

### Error: "column user_id does not exist"

**Root cause:** Your `public.links` table doesn't have a `user_id` column, but the RLS policies are trying to reference it.

**Step 1: Check what columns actually exist**

Run this query in Supabase SQL Editor:

```sql
SELECT column_name, data_type  
FROM information_schema.columns  
WHERE table_schema = 'public' AND table_name = 'links'
ORDER BY ordinal_position;
```

This will show you all columns in your table.

**Step 2: Choose your fix**

#### Option A: Column exists with different name (e.g., `owner_id`, `created_by`)

If you see a column like `owner_id` instead of `user_id`, update your policies:

```sql
DROP POLICY IF EXISTS "Users can view their own links" ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links" ON public.links;
DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;

CREATE POLICY "Users can view their own links"
  ON public.links FOR SELECT
  USING (auth.uid() = owner_id);  -- Replace with your actual column name

CREATE POLICY "Users can insert their own links"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = owner_id);  -- Replace with your actual column name

CREATE POLICY "Users can update their own links"
  ON public.links FOR UPDATE
  USING (auth.uid() = owner_id)  -- Replace with your actual column name
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own links"
  ON public.links FOR DELETE
  USING (auth.uid() = owner_id);  -- Replace with your actual column name
```

#### Option B: Column doesn't exist at all

Add the missing `user_id` column:

```sql
ALTER TABLE public.links
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
```

Then run the original policies from Step 3.

#### Option C: Add column + backfill existing data

If you have existing rows and need to set them to a specific user:

```sql
-- Add the column (nullable first)
ALTER TABLE public.links 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update existing rows (replace with a real user_id)
UPDATE public.links 
SET user_id = '00000000-0000-0000-0000-000000000000'
WHERE user_id IS NULL;

-- Make it NOT NULL
ALTER TABLE public.links 
ALTER COLUMN user_id SET NOT NULL;
```

---

### Error: "relation links does not exist"

The table was deleted or never created.

**Fix:** Run Step 1 again to create the table.

---

### Error: "permission denied"

You might be using the wrong role.

**Fix:** 
1. Make sure you're logged in as the project owner
2. Try running queries as the `postgres` role (if available)

---

### Links Not Showing on Main Site

1. **Check browser console** for errors (F12 → Console)
2. **Verify credentials** are correct in both files
3. **Check admin panel** - make sure you added links
4. **Check Supabase logs** - Dashboard → Logs
5. **Verify RLS policies** - Run: `SELECT * FROM pg_policies WHERE tablename = 'links';`
6. **Check user_id matches** - Make sure the `user_id` in your links table matches your authenticated user ID

---

## Testing

1. Open `/admin/` in your browser
2. Sign up with any email (e.g., `test@example.com`)
3. Add a link in the admin panel
4. Go to `/index.html`
5. Your link should appear!

If it doesn't:
- Check browser console (F12)
- Check that `user_id` in database matches your auth user ID
- Verify RLS policies are correct

---

## Complete SQL (All-in-One)

If you want to run everything at once, use this:

```sql
-- Create table
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

-- Create index
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);

-- Enable RLS
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own links" ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links" ON public.links;
DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;

-- Create policies
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
```

---

## Still Having Issues?

1. Run the diagnostic queries in `docs/SUPABASE_DIAGNOSTIC.sql`
2. Share the output
3. Check Supabase documentation: https://supabase.com/docs/guides/auth/row-level-security

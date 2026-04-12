# 🚀 Complete Supabase Setup Guide

## Overview

This guide will help you set up Supabase to run your link hub fully online with a cloud database.

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create a new project:
   - **Project name:** `my-links` (or any name)
   - **Database password:** Create a strong password
   - **Region:** Choose closest to you
5. Wait for project to initialize (2-3 minutes)

---

## Step 2: Get Your Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

3. Open `supabase-config.js` and replace:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';  // ← Paste Project URL here
const SUPABASE_ANON_KEY = 'your-anon-key-here';           // ← Paste anon key here
```

---

## Step 3: Create Links Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Paste this SQL:

```sql
CREATE TABLE public.links (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
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

CREATE INDEX idx_links_created_at ON public.links(created_at DESC);
```

4. Click **"Run"**
5. You should see: `Success. No rows returned`

---

## Step 4: Enable Public Read Access (Optional)

If you want anyone to read links without authentication:

1. Go to **SQL Editor** → **New Query**
2. Paste:

```sql
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON public.links
  FOR SELECT
  USING (true);
```

3. Click **"Run"**

---

## Step 5: Update Your Files

### Replace these files:

1. **`supabase-config.js`** → Use `supabase-config-fixed.js`
   - Rename: `supabase-config-fixed.js` → `supabase-config.js`
   - Add your credentials (Step 2)

2. **`script.js`** → Use `script-supabase-fixed.js`
   - Rename: `script-supabase-fixed.js` → `script.js`
   - This version fetches from Supabase

3. **`index.html`** → Use `index-fixed.html`
   - Rename: `index-fixed.html` → `index.html`
   - Already has correct paths

---

## Step 6: Test Locally

1. Open `index.html` in browser
2. Check browser console (F12) for errors
3. You should see links loading (if you added any)

---

## Step 7: Add Links via Admin Panel

1. Open `admin.html`
2. Login with password `admin123`
3. Add a link:
   - **Title:** Test Link
   - **URL:** https://example.com
   - **Category:** Recommended
   - **Description:** Test description
   - Click **"Add Link"**

4. Go back to `index.html`
5. **Link should appear immediately!**

---

## Step 8: Deploy to GitHub Pages (Free Hosting)

### 8.1 Create GitHub Repository

1. Go to https://github.com/new
2. Create repository:
   - **Name:** `my-links` (or any name)
   - **Description:** My personal link hub
   - **Public** (required for free Pages)
   - Click **"Create repository"**

### 8.2 Push Your Files

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - My Links hub"

# Add remote (replace USERNAME and REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 8.3 Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `root`
4. Click **"Save"**
5. Wait 1-2 minutes
6. Your site is live at: `https://USERNAME.github.io/REPO`

---

## Step 9: Update Supabase for Production

Since your site is now public, update Supabase security:

1. Go to Supabase dashboard
2. **SQL Editor** → **New Query**
3. Paste:

```sql
-- Make sure public read is allowed
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Allow public read"
  ON public.links FOR SELECT
  USING (true);

-- Prevent direct inserts (use admin panel only)
CREATE POLICY "Prevent public inserts"
  ON public.links FOR INSERT
  WITH CHECK (false);
```

4. Click **"Run"**

---

## 🧪 Testing Checklist

- [ ] Supabase project created
- [ ] Credentials added to `supabase-config.js`
- [ ] Links table created in Supabase
- [ ] `index.html` loads without errors
- [ ] `admin.html` loads without errors
- [ ] Can add links in admin panel
- [ ] Links appear on main site
- [ ] GitHub repository created
- [ ] Files pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Site is live at `https://USERNAME.github.io/REPO`

---

## 📝 File Checklist

Your root folder should have:

```
/
├── index.html                 ✅ Main site
├── admin.html                 ✅ Admin panel
├── script.js                  ✅ Main site JS (Supabase version)
├── admin.js                   ✅ Admin JS
├── supabase-config.js         ✅ Supabase config (with credentials)
├── consent-manager.js         ✅ Consent banner
├── style.css                  ✅ Main styles
├── admin-style.css            ✅ Admin styles
├── .gitignore                 ✅ Git ignore
└── README.md                  ✅ Documentation
```

---

## 🔑 Environment Variables (Optional - For Security)

For production, you can use GitHub Secrets to hide credentials:

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add:
   - **Name:** `SUPABASE_URL`
   - **Value:** Your Supabase URL
4. Repeat for `SUPABASE_ANON_KEY`

Then in `supabase-config.js`:
```javascript
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
```

---

## 🚨 Troubleshooting

### Links not loading?
- Check browser console (F12 → Console)
- Verify Supabase credentials in `supabase-config.js`
- Make sure links table exists in Supabase
- Check that RLS policies allow public read

### Admin panel not working?
- Verify `admin.html` and `admin.js` are in root
- Check password is `admin123`
- Clear browser cache

### GitHub Pages not working?
- Make sure repository is **Public**
- Check **Settings** → **Pages** is enabled
- Wait 2-3 minutes for deployment
- Check branch is set to `main`

### Supabase connection errors?
- Verify credentials are correct
- Check internet connection
- Try refreshing page
- Check Supabase status: https://status.supabase.com

---

## 📚 Useful Links

- **Supabase Docs:** https://supabase.com/docs
- **GitHub Pages:** https://pages.github.com
- **Supabase Status:** https://status.supabase.com
- **GitHub Help:** https://docs.github.com

---

## 🎉 You're Done!

Your link hub is now:
- ✅ Running on Supabase (cloud database)
- ✅ Hosted on GitHub Pages (free)
- ✅ Accessible from anywhere
- ✅ Fully functional admin panel

Share your link: `https://USERNAME.github.io/REPO`

---

## Next Steps

1. **Customize your site:**
   - Update title in `index.html`
   - Update colors in `style.css`
   - Add your links via admin panel

2. **Add more features:**
   - Custom domain (GitHub Pages supports this)
   - Email notifications
   - Analytics

3. **Backup your data:**
   - Export links from admin panel
   - Keep backups in GitHub

Enjoy! 🚀

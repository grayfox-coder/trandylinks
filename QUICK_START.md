# ⚡ Quick Start - 5 Minutes to Live

## What You Need

1. **Supabase Account** (free) - https://supabase.com
2. **GitHub Account** (free) - https://github.com
3. **These files** (already created)

---

## 5-Minute Setup

### Minute 1: Supabase Project
```
1. Go to supabase.com
2. Click "Start your project"
3. Sign up with GitHub
4. Create project named "my-links"
5. Wait for initialization
```

### Minute 2: Get Credentials
```
1. Go to Settings → API
2. Copy "Project URL"
3. Copy "anon public key"
```

### Minute 3: Create Table
```
1. Go to SQL Editor
2. Click "New Query"
3. Paste the SQL from SUPABASE_SETUP_COMPLETE.md
4. Click "Run"
```

### Minute 4: Update Config
```
1. Open supabase-config.js
2. Replace SUPABASE_URL with your URL
3. Replace SUPABASE_ANON_KEY with your key
4. Save
```

### Minute 5: Deploy
```
1. Create GitHub repo
2. Push files: git push
3. Enable Pages in Settings
4. Your site is live!
```

---

## Files to Use

| Old File | New File | Action |
|----------|----------|--------|
| `js/supabase-config.js` | `supabase-config-fixed.js` | Rename to `supabase-config.js` |
| `js/script.js` | `script-supabase-fixed.js` | Rename to `script.js` |
| `index.html` | `index-fixed.html` | Rename to `index.html` |
| `admin.html` | `admin-fixed.html` | Rename to `admin.html` |
| `admin.js` | `admin-fixed.js` | Rename to `admin.js` |

---

## Test It

1. Open `index.html` → Should load
2. Open `admin.html` → Login with `admin123`
3. Add a link
4. Go back to `index.html` → Link appears!

---

## Deploy

```bash
git init
git add .
git commit -m "My Links Hub"
git remote add origin https://github.com/USERNAME/my-links.git
git branch -M main
git push -u origin main
```

Then enable Pages in GitHub Settings.

---

## Your Live Site

`https://USERNAME.github.io/my-links`

---

## Need Help?

See `SUPABASE_SETUP_COMPLETE.md` for detailed instructions.

---

## What's Included

✅ Main website with link display
✅ Admin panel to add/edit/delete links
✅ Supabase cloud database
✅ GitHub Pages hosting (free)
✅ Consent banner for analytics
✅ Dark/light theme toggle
✅ Responsive design
✅ Email capture form

---

## Admin Panel

- **URL:** `/admin.html`
- **Password:** `admin123` (change in admin.js)
- **Features:**
  - Add/edit/delete links
  - Export/import links
  - Change password
  - Clear all links

---

## That's It!

You now have a fully functional link hub running online! 🎉

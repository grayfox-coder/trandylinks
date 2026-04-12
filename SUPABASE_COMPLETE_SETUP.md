# 🚀 Complete Supabase Setup Guide

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

1. Go to **Settings** (bottom left) → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

3. Open `supabase-config.js` and replace:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

With your actual values:
```javascript
const SUPABASE_URL = 'https://abcdef123456.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Step 3: Create Links Table

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_links_created_at ON public.links(created_at DESC);
```

4. Click **"Run"**
5. You should see: `Success. No rows returned`

---

## Step 4: Enable Public Read Access (RLS)

1. Go to **Authentication** → **Policies** (left sidebar)
2. Click on **"links"** table
3. Click **"New Policy"**
4. Select **"For SELECT"** → **"With custom expression"**
5. In the expression box, paste:
```
true
```
6. Click **"Review"** → **"Save policy"**

This allows anyone to read links (but only authenticated users can write).

---

## Step 5: Update script.js to Use Supabase

Replace the localStorage code with Supabase fetch.

**Find this section in script.js:**
```javascript
// Load links from localStorage (admin panel) or use default empty array
let links = JSON.parse(localStorage.getItem('my-links-data')) || [];
```

**Replace with:**
```javascript
// Load links from Supabase
let links = [];

async function loadLinksFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading links:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error loading links:', err);
    return [];
  }
}
```

**Then update the DOMContentLoaded event:**
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // Load links from Supabase
  links = await loadLinksFromSupabase();
  
  initTheme();
  initFTCBanner();
  initLinksGrid();
  initFilters();
  initLoadMore();
  initEmailForm();
  initDisclosureLink();
  
  if (typeof initSupabaseAuth === 'function') {
    initSupabaseAuth();
  }
});
```

**Update filterAndRenderLinks to re-fetch:**
```javascript
async function filterAndRenderLinks(category) {
  // Re-fetch from Supabase every time
  const allLinks = await loadLinksFromSupabase();
  
  state.currentCategory = category;
  state.filteredLinks = category === 'all' 
    ? [...allLinks] 
    : allLinks.filter(link => link.category === category);
  
  state.visibleCount = CONFIG.cardsPerPage;
  renderLinksGrid();
  updateLoadMoreButton();
}
```

---

## Step 6: Update admin.js to Use Supabase

Replace localStorage save with Supabase insert.

**Find handleAddLink:**
```javascript
function handleAddLink(e) {
  e.preventDefault();
  
  const newLink = {
    id: 'link_' + Date.now(),
    // ... other fields
  };
  
  allLinks.push(newLink);
  saveLinks();  // ← Replace this
  // ...
}
```

**Replace with:**
```javascript
async function handleAddLink(e) {
  e.preventDefault();
  
  const newLink = {
    title: document.getElementById('link-title').value,
    description: document.getElementById('link-description').value,
    url: document.getElementById('link-url').value,
    image: document.getElementById('link-image').value,
    category: document.getElementById('link-category').value,
    badge: document.getElementById('link-badge').value || null,
    commission: document.getElementById('link-commission').value || null,
    cta: document.getElementById('link-cta').value || 'Learn More',
    highlight: document.getElementById('link-highlight').checked
  };
  
  // Insert into Supabase
  const { error } = await supabaseClient
    .from('links')
    .insert([newLink]);
  
  if (error) {
    showToast(`❌ Error: ${error.message}`, 'danger');
    return;
  }
  
  addLinkForm.reset();
  await loadLinks();  // Reload from Supabase
  renderLinksTable();
  showToast('✅ Link added successfully!', 'success');
}
```

**Update loadLinks:**
```javascript
async function loadLinks() {
  const { data, error } = await supabaseClient
    .from('links')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading links:', error);
    allLinks = [];
  } else {
    allLinks = data || [];
  }
  
  renderLinksTable();
}
```

**Update deleteLink:**
```javascript
async function deleteLink(linkId) {
  if (confirm('Are you sure you want to delete this link?')) {
    const { error } = await supabaseClient
      .from('links')
      .delete()
      .eq('id', linkId);
    
    if (error) {
      showToast(`❌ Error: ${error.message}`, 'danger');
      return;
    }
    
    await loadLinks();
    showToast('✅ Link deleted', 'success');
  }
}
```

---

## Step 7: Host on GitHub Pages (Free)

### 7a. Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `my-links` (or any name)
3. **Description:** `My personal link hub`
4. **Public** (so it can be hosted)
5. Click **"Create repository"**

### 7b. Push Your Files

```bash
# Navigate to your project folder
cd /path/to/my-links

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - My Links site"

# Add remote (replace USERNAME and REPO)
git remote add origin https://github.com/USERNAME/my-links.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 7c. Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Select `Deploy from a branch`
   - **Branch:** Select `main` and `/root`
5. Click **Save**
6. Wait 1-2 minutes
7. Your site is live at: `https://USERNAME.github.io/my-links`

---

## Step 8: Test Everything

### Test Main Site
1. Open `https://USERNAME.github.io/my-links`
2. Should load without errors
3. Links should display from Supabase

### Test Admin Panel
1. Open `https://USERNAME.github.io/my-links/admin.html`
2. Login with password `admin123`
3. Add a new link
4. Go back to main site
5. **New link should appear immediately!**

---

## Troubleshooting

### Links not loading?
- Check browser console (F12 → Console)
- Verify Supabase credentials in `supabase-config.js`
- Make sure table was created in Supabase
- Check that RLS policy allows SELECT

### Admin panel not working?
- Make sure you're logged in
- Check that Supabase credentials are correct
- Verify table exists in Supabase

### GitHub Pages not updating?
- Wait 2-3 minutes after push
- Hard refresh browser (Ctrl+Shift+R)
- Check GitHub Actions (Settings → Actions) for build errors

---

## Security Notes

⚠️ **Important:**
- Your `SUPABASE_ANON_KEY` is public (it's in your HTML)
- This is safe because Supabase RLS policies control access
- Never put your admin password in code
- Use environment variables for sensitive data in production

---

## Next Steps

1. ✅ Fill `supabase-config.js` with credentials
2. ✅ Create links table in Supabase
3. ✅ Update `script.js` to fetch from Supabase
4. ✅ Update `admin.js` to save to Supabase
5. ✅ Push to GitHub
6. ✅ Enable GitHub Pages
7. ✅ Test everything

**You're now fully online!** 🎉

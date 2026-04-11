# Admin Panel Guide

Your admin panel is ready to use! Access it at `admin/admin.html`.

## 🚀 Quick Start

### Default Login
- **URL**: `admin/admin.html`
- **Password**: `admin123`

### ⚠️ IMPORTANT: Change the Password
1. Open `admin/admin.js`
2. Find line ~18: `password: btoa('admin123'),`
3. Change `'admin123'` to your desired password
4. The password is automatically hashed using Base64

Example:
```javascript
password: btoa('YourNewSecurePassword123'), // Change to your password
```

---

## 📋 Features

### 1. Manage Links
**Tab: My Links**

- View all your links in a table
- Edit any link by clicking the ✏️ button
- Delete links with the 🗑️ button
- See total link count

### 2. Add New Links
**Tab: Add Link**

Fill in the form:
- **Image URL** *: Link to product logo/image (PNG or JPG recommended)
  - Example: `https://example.com/logo.png`
  - Tip: Use images with transparent background for best results
  - Recommended size: 100x100px or larger
- **Title**: Product/link name
- **Category**: Choose from:
  - Recommended
  - Deals
  - AI Tools
  - Hosting
  - Finance
  - Health
  - Resources
- **Badge** (Optional): HOT, FREE, or DEAL
- **Description**: Brief description (2 lines max)
- **Commission Info**: How much you earn
- **CTA**: Button text (e.g., "Join Free", "Learn More")
- **URL**: Your affiliate link
- **Highlight**: Enable green border to highlight

### 3. Edit Existing Links
1. Click the ✏️ button next to any link
2. Edit the modal form
3. Click "Save Changes"

### 4. Settings
**Tab: Settings**

#### Change Password
- Enter a new password (minimum 6 characters)
- Update `admin/admin.js` with the new hashed password
- Note: You'll see the instructions on screen

#### Export Links
- Download all your links as a JSON file
- Useful for backup or transferring to another site

#### Import Links
- Upload a previously exported JSON file
- Imports all links from the file
- Useful for migration/backup restoration

#### Clear All Links
- ⚠️ Deletes ALL links permanently
- Confirmation required
- Cannot be undone

---

## 📊 How Data Works

### Storage
- Links are saved in **localStorage** on the user's browser
- Each browser/device has separate storage
- Data persists across page refreshes
- Admin session persists during the browser session

### Sync Between Admin & Main Site
When you add/edit/delete links in the admin panel:
1. Changes are saved to localStorage
2. Main site automatically loads from localStorage
3. Refresh main site to see updates

---

## 🔗 Data Structure

Each link object has:
```javascript
{
  id: "link_1234567890",        // Auto-generated unique ID
  image: "https://...",          // Image URL (PNG/JPG)
  badge: "HOT",                  // "HOT", "FREE", "DEAL", or ""
  title: "ChatGPT",              // Product name
  description: "AI chat...",     // Brief description
  category: "ai-tools",          // Category
  commission: "Earns $20/ref",   // Commission info
  cta: "Try Now",                // Button text
  url: "https://...",            // Affiliate link
  highlight: true                // Green highlight
}
```

---

## 💾 Backup & Restore

### Regular Backups
1. Go to Settings tab
2. Click "Export Links"
3. Save the JSON file somewhere safe
4. Keep backups on Google Drive, Dropbox, etc.

### Restore from Backup
1. Go to Settings tab
2. Click "Import Links"
3. Select your previously exported JSON file
4. All links will be restored

### Export Example
```json
[
  {
    "id": "link_1704067890",
    "image": "https://openai.com/favicon.png",
    "badge": "HOT",
    "title": "ChatGPT Plus",
    "description": "Get GPT-4 access and faster responses",
    "category": "ai-tools",
    "commission": "Earns $20 per referral",
    "cta": "Try Now",
    "url": "https://chat.openai.com/",
    "highlight": true
  }
]
```

---

## 🔒 Security Tips

### Password Security
1. **Change the default password immediately**
2. Use a strong password (mix of letters, numbers, symbols)
3. Don't share your password
4. The password is Base64 encoded only - consider it a basic protection

### Advanced Security
For production use, consider:
- Using a backend server instead of localStorage
- Implementing proper authentication (OAuth, JWT)
- Adding database encryption
- Using HTTPS only

### LocalStorage Limitations
- Data is **NOT encrypted** in browser storage
- Anyone with access to the browser can see the data
- Clear browser cache/history to clear localStorage
- Different browsers have separate localStorage

---

## 🐛 Troubleshooting

### Forgot Password
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `sessionStorage.clear()`
4. Go to `admin/admin.html`
5. Default password is `admin123`

### Links Not Showing on Main Site
1. Ensure you added links in admin panel
2. Go to main site and **refresh the page**
3. Check browser console for errors (F12 → Console)

### Lost All Links
If you accidentally cleared all links:
1. Check if you have an export file backup
2. Use "Import Links" to restore
3. Or manually re-add links

### Password Reset
1. Open `admin/admin.js` in code editor
2. Change line 18: `password: btoa('admin123'),`
3. Refresh the admin page
4. Login with your new password

---

## 📱 Mobile Admin Access

- Admin panel is mobile-responsive
- Use on tablets and phones
- Touch-friendly buttons and forms
- Sidebar converts to horizontal tabs on mobile

---

## 🚀 Deployment

When deploying to GitHub Pages or hosting:

1. **Keep admin/ excluded** - use .gitignore
2. **Main site is public** - anyone can view (links open affiliate URLs)
3. **localStorage is browser-local** - different devices have separate data
4. **NO backend needed** - everything works on the client

### Deploy Steps
1. Edit your links via admin panel
2. Commit changes to GitHub
3. Push to your hosting service
4. Admin panel available at `yourdomain.com/admin/admin.html`

---

## 📞 Support

### Common Tasks

**Add a new product link**
1. Click "Add Link" tab
2. Fill in product details
3. Click "Add Link"

**Change a link's URL**
1. Click "My Links" tab
2. Find the link
3. Click ✏️ to edit
4. Update URL
5. Save

**Make a link prominent**
1. Edit the link
2. Enable "Highlight" checkbox
3. Link gets green border

**Organize by category**
1. Links auto-filter on main site
2. Users can filter by category
3. Use categories wisely for UX

---

## ✅ Next Steps

1. ✅ Change admin password in `admin/admin.js`
2. ✅ Add your first link
3. ✅ Customize the main site brand
4. ✅ Add analytics IDs (GA4, Clarity)
5. ✅ Test on different devices
6. ✅ Deploy to hosting
7. ✅ Regular backups!

---

**Version**: 1.0
**Last Updated**: 2024

# My Links - Project Structure

```
my-links/
├── admin/                    # Admin panel (local dev only, in .gitignore)
│   ├── admin.html           # Admin dashboard UI
│   ├── admin.css            # Admin styles
│   └── admin.js             # Admin functionality
│
├── css/                      # Stylesheets
│   └── style.css            # Main site styles
│
├── js/                       # JavaScript files
│   └── script.js            # Main site functionality
│
├── docs/                     # Documentation
│   ├── README.md            # Project documentation
│   └── ADMIN_GUIDE.md       # Admin panel guide
│
├── img/                      # Images (if needed)
│   └── (placeholder for future images)
│
├── index.html               # Main site entry point
├── .gitignore               # Git ignore rules
└── .git/                    # Git repository
```

## 📁 Folder Breakdown

### `admin/`
- Local development only
- Not included in git (see .gitignore)
- Contains admin panel for managing links

### `css/`
- Main stylesheet for the site
- Dark theme by default

### `js/`
- `script.js` - Loads links from localStorage, handles filtering, email capture, analytics

### `docs/`
- Project documentation
- Admin panel guide

### `img/`
- Placeholder for images
- Future: logos, screenshots, etc.

## 🚀 Quick Start

1. **View Site**: Open `index.html` in browser
2. **Manage Links**: Go to `admin/admin.html`
3. **Default Password**: `admin123` (change in `admin/admin.js`)

## 📖 Documentation

- [README.md](docs/README.md) - Full project guide
- [ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) - Admin panel instructions

---

**Version**: 2.0 (Reorganized)

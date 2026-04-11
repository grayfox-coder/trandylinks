# My Links

A dark, minimal personal link hub website inspired by Linear.app. Built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no build tools, ready to deploy to GitHub Pages.

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-GitHub%20Pages-blue.svg)

## Features

- **Dark & Minimal Design** — Clean Linear.app-inspired aesthetic
- **Category Filtering** — Filter links by category (All, Recommended, Deals, AI Tools, Hosting, Finance, Health, Resources)
- **Responsive Grid** — 1 column mobile, 2 columns tablet, 3 columns desktop
- **Click Tracking** — Built-in GA4 event tracking for all affiliate clicks
- **Email Capture** — Newsletter signup with localStorage (Brevo-ready)
- **FTC Disclosure** — Dismissible affiliate disclosure banner
- **Dark/Light Mode** — Theme toggle with localStorage persistence
- **Redirect Pages** — Branded /go/ pages with loading animation
- **SEO Ready** — Meta tags, Open Graph, canonical URLs

## Quick Start

### 1. Fork or Download

```bash
# Clone the repository
git clone https://github.com/yourusername/my-links.git
cd my-links
```

Or download the ZIP and extract it.

### 2. Customize Your Brand

Edit `index.html`:
```html
<!-- Line ~75: Change your brand name -->
<h1 class="logo">Your Name or Brand</h1>

<!-- Line ~76: Change your tagline -->
<p class="tagline">Your custom tagline here</p>
```

### 3. Add Your Affiliate Links

Edit `script.js` and find the `links` array (around line 50):

```javascript
const links = [
  {
    id: "link_1",
    image: "https://example.com/logo.png",  // Image URL (PNG/JPG)
    badge: "HOT",                            // "HOT", "FREE", "DEAL", or ""
    title: "Product Name",
    description: "Short description of the product.",
    category: "recommended",                 // See categories below
    commission: "Earns up to 40%",
    cta: "Join Free",                        // Button text
    url: "https://example.com/",             // Affiliate URL
    highlight: true                          // Green border highlight
  },
  // Add more links...
];
```

**Available Categories:**
- `recommended` — Recommended products
- `deals` — Special deals and offers
- `ai-tools` — AI-powered tools
- `hosting` — Web hosting services
- `finance` — Financial services
- `health` — Health & wellness
- `resources` — General resources

### 4. Set Up Analytics

#### Google Analytics 4

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property and get your Measurement ID (G-XXXXXXXXXX)
3. Replace in `index.html` (line ~30):
   ```html
   gtag('config', 'G-XXXXXXXXXX');
   ```
3. Also update in `go/your-product/index.html`

#### Microsoft Clarity

1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Create a new project and get your Project ID
3. Replace in `index.html` (line ~40):
   ```javascript
   "script", "YOUR_CLARITY_ID"
   ```

### 5. Set Up Email Capture (Optional)

#### Option A: Keep Current Setup (localStorage only)
The form stores emails in localStorage. Export them manually:
```javascript
// Open browser console and run:
console.log(localStorage.getItem('affiliatehub-email-submitted'));
```

#### Option B: Integrate Brevo (Recommended)

1. Go to [Brevo](https://www.brevo.com/) (formerly Sendinblue)
2. Create a signup form and copy the HTML embed code
3. In `index.html`, find the comment `<!-- PASTE BREVO EMBED CODE HERE -->`
4. Replace the custom form with your Brevo embed code

### 6. Create More Redirect Pages

The `/go/` folder contains branded redirect pages. To create a new one:

```bash
mkdir go/product-name
cp go/example-product/index.html go/your-product-name/index.html
```

Then edit `go/product-name/index.html`:
```javascript
const CONFIG = {
  redirectUrl: 'https://your-affiliate-link.com',
  productName: 'Product Name',
  delay: 1500
};
```

Update your link in `script.js`:
```javascript
url: "./go/product-name/"
```

### 7. Deploy to GitHub Pages

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/affiliate-hub.git
   git push -u origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main → / (root)
   - Click Save

3. Your site will be live at:
   ```
   https://yourusername.github.io/affiliate-hub/
   ```

## File Structure

```
affiliate-hub/
├── index.html              # Main page
├── style.css               # All styles
├── script.js               # All JavaScript logic
├── README.md               # This file
├── go/                     # Redirect pages folder
│   └── example-product/
│       └── index.html      # Sample redirect page
└── .github/                # GitHub configuration (optional)
    └── workflows/
        └── static.yml      # GitHub Actions workflow
```

## Customization Guide

### Change Colors

Edit CSS variables in `style.css`:
```css
:root {
  --accent: #00c853;        /* Primary green */
  --accent-hover: #00e676;  /* Hover green */
  --bg-primary: #0a0a0a;    /* Background */
  --bg-secondary: #111111;  /* Card background */
}
```

### Change Fonts

1. Update Google Fonts link in `index.html` (line ~25)
2. Update font-family in `style.css`:
   ```css
   body {
     font-family: 'Your Font', sans-serif;
   }
   ```

### Add More Categories

1. Add tab button in `index.html` (line ~95):
   ```html
   <button class="filter-tab" data-category="new-category">New Category</button>
   ```

2. Add to category map in `script.js`:
   ```javascript
   const categoryMap = {
     // ... existing categories
     'new-category': 'New Category'
   };
   ```

### Update SEO Meta Tags

Edit `index.html` (lines ~10-25):
```html
<title>Your Brand | Your Tagline</title>
<meta name="description" content="Your description here">
<meta property="og:title" content="Your Brand">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
<link rel="canonical" href="https://yoursite.com/">
```

## Analytics Events

The following events are automatically tracked:

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `affiliate_click` | CTA button click | `id`, `title`, `url`, `timestamp`, `category` |
| `affiliate_redirect` | Redirect page | `product`, `destination`, `timestamp` |
| `filter_click` | Category tab click | `category` |
| `load_more` | Load more button | `category`, `visible_count` |
| `email_subscribe` | Email form submit | `email_domain` |
| `theme_toggle` | Theme switch | `theme` |
| `ftc_banner_dismissed` | Banner close | - |

View events in Google Analytics: **Reports → Engagement → Events**

## Performance

- **Page Load**: < 2 seconds
- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **No External Dependencies**: Only Google Fonts and Analytics
- **Mobile First**: Fully responsive design

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License — feel free to use for personal or commercial projects.

## Support

For issues or questions:
1. Check the comments in `script.js` (lines 1-40 have detailed instructions)
2. Review this README
3. Open an issue on GitHub

---

**Happy affiliate marketing!** 🚀

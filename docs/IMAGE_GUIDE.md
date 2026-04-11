# Image URL Guide

## 📸 How to Get Image URLs for Your Links

### Option 1: Use Website Favicons
Most websites provide favicons you can link directly:

```
https://openai.com/favicon.ico
https://www.google.com/favicon.ico
https://github.com/favicon.ico
https://www.figma.com/favicon.ico
```

### Option 2: Use Logo Services
These sites provide company logos:

- **Clearbit**: `https://logo.clearbit.com/example.com`
- **Brandfetch**: `https://cdn.brandfetch.io/[company]/w/400/[company]-logo@2x.png?c=1`

### Option 3: Host Your Own Images
Upload images to your hosting and link them:

```
https://yourdomain.com/images/logo.png
```

### Option 4: Use CDNs
Upload to free CDN services:

- **Imgur**: Upload image → Get URL
- **Cloudinary**: Free tier with image hosting
- **Imgbb**: `https://imgbb.com` - Simple image hosting
- **Tinypng**: `https://tinypng.com` - Compress & host images

---

## 🎨 Image Best Practices

### File Format
- **PNG**: Best for logos (supports transparency)
- **JPG**: Good for photos/screenshots
- **WebP**: Better compression (if supported)
- **SVG**: Scalable, works great for logos

### Image Size
- **Minimum**: 100x100 pixels
- **Recommended**: 200x200 pixels
- **Aspect Ratio**: 1:1 (square) works best
- **File Size**: Keep under 500KB

### Transparency
- Use PNG with transparent background for best results
- Logo will show nicely on the green highlight

### URL Tips
- Use **HTTPS** URLs only (not HTTP)
- Test the URL in your browser first
- Use direct image links (not landing pages)
- Avoid URLs that might change or expire

---

## 🔍 Example Image URLs

### AI Tools
```
https://openai.com/favicon.ico (ChatGPT)
https://www.anthropic.com/favicon.ico (Claude)
https://gemini.google.com/favicon.ico (Google Gemini)
https://www.perplexity.ai/favicon.ico (Perplexity)
```

### Developer Tools
```
https://github.com/favicon.ico (GitHub)
https://www.figma.com/favicon.ico (Figma)
https://www.notion.so/favicon.ico (Notion)
https://www.canva.com/favicon.ico (Canva)
```

### Hosting/Domains
```
https://www.namecheap.com/favicon.ico (Namecheap)
https://cloudflare.com/favicon.ico (Cloudflare)
https://www.vercel.com/favicon.ico (Vercel)
```

---

## 📋 How to Find Image URLs

### Method 1: Inspect the Website
1. Visit the company website
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Filter by images
6. Look for logo.png, icon.svg, etc.

### Method 2: Check Common Paths
Many sites host logos at these paths:
- `domain.com/logo.png`
- `domain.com/images/logo.png`
- `domain.com/assets/logo.png`
- `cdn.domain.com/logo.png`

### Method 3: Use Logo Services
Let them find the logo for you:

**Clearbit Logo API**:
```
https://logo.clearbit.com/[company-domain].com
```

Example:
```
https://logo.clearbit.com/openai.com
https://logo.clearbit.com/github.com
https://logo.clearbit.com/figma.com
```

---

## ⚠️ Troubleshooting

### Image Not Showing?
1. Check URL is correct (copy/paste in browser)
2. Make sure it's HTTPS (not HTTP)
3. Check the URL isn't behind authentication
4. Try a different image URL

### Image Looks Blurry?
- Use higher quality/resolution images
- Try PNG instead of JPG
- Make sure image is at least 200x200px

### Image URL Changed/Broken?
1. Go to admin panel → My Links
2. Click edit (✏️) on the broken link
3. Update the image URL
4. Save changes

### Colored Background Shows?
- That's normal if image has white background
- Try to find images with transparent background
- Or use a logo version specifically

---

## 🚀 Quick Start with Favicons

The easiest way to get images is to use website favicons:

1. Replace `example.com` with the actual domain
2. Use this URL:
```
https://example.com/favicon.ico
```

Examples:
- `https://openai.com/favicon.ico`
- `https://github.com/favicon.ico`
- `https://figma.com/favicon.ico`

---

**Pro Tip**: Always test the image URL in your browser before adding it to the admin panel!

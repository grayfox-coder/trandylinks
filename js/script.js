/* ============================================
   MY LINKS - JAVASCRIPT
   ============================================

   HOW TO ADD A NEW LINK:
   ----------------------
   1. Find the "links" array below (around line 30)
   2. Uncomment the template example
   3. Update these fields:
      - id: Unique identifier (e.g., "link_1")
      - icon: Emoji or leave empty for default
      - badge: "HOT", "FREE", "DEAL", or leave empty
      - title: Link title/product name
      - description: Short description (2 lines max)
      - category: One of: "recommended", "deals", "ai-tools", 
                   "hosting", "finance", "health", "resources"
      - commission: Commission info or benefits
      - cta: Button text (e.g., "Join Free", "Get Link")
      - url: Your link or affiliate URL
      - highlight: true/false (adds green border)

   4. Save and refresh your site!

   ============================================ */

// ============================================
// AFFILIATE LINKS DATA ARRAY
// Edit this array to add/remove/update links
// ============================================

// Load links from localStorage (admin panel) or use default empty array
let links = JSON.parse(localStorage.getItem('my-links-data')) || [
  // Add your affiliate links here via the admin panel
  // {
  //   id: "link_1",
  //   icon: "🔗",
  //   badge: "HOT",
  //   title: "Your Product",
  //   description: "Brief description of the product or service.",
  //   category: "recommended",
  //   commission: "Commission details",
  //   cta: "Call to Action",
  //   url: "https://your-affiliate-link.com",
  //   highlight: true
  // },
];

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  cardsPerPage: 9,        // Number of cards to show initially
  cardsPerLoad: 9,        // Number of cards to load on "Load More"
  storageKeys: {
    theme: 'affiliatehub-theme',
    ftcDismissed: 'affiliatehub-ftc-dismissed',
    emailSubmitted: 'affiliatehub-email-submitted'
  }
};

// ============================================
// STATE MANAGEMENT
// ============================================

let state = {
  currentCategory: 'all',
  visibleCount: CONFIG.cardsPerPage,
  filteredLinks: []
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
  ftcBanner: document.getElementById('ftc-banner'),
  ftcDismiss: document.getElementById('ftc-dismiss'),
  themeToggle: document.getElementById('theme-toggle'),
  linksGrid: document.getElementById('links-grid'),
  loadMoreBtn: document.getElementById('load-more'),
  filterTabs: document.querySelectorAll('.filter-tab'),
  emailForm: document.getElementById('email-form'),
  emailInput: document.getElementById('email-input'),
  emailSuccess: document.getElementById('email-success'),
  disclosureLink: document.getElementById('disclosure-link')
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFTCBanner();
  initLinksGrid();
  initFilters();
  initLoadMore();
  initEmailForm();
  initDisclosureLink();
});

// ============================================
// THEME MANAGEMENT (Dark/Light Mode)
// ============================================

function initTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem(CONFIG.storageKeys.theme);
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  // Default is dark (no attribute needed)
  
  // Theme toggle click handler
  elements.themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  if (newTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', newTheme);
  }
  
  localStorage.setItem(CONFIG.storageKeys.theme, newTheme);
  
  // Track theme toggle
  trackEvent('theme_toggle', { theme: newTheme });
}

// ============================================
// FTC BANNER
// ============================================

function initFTCBanner() {
  // Check if user already dismissed the banner
  const isDismissed = localStorage.getItem(CONFIG.storageKeys.ftcDismissed);
  
  if (isDismissed === 'true') {
    elements.ftcBanner.classList.add('hidden');
  }
  
  // Dismiss button click handler
  elements.ftcDismiss.addEventListener('click', dismissFTCBanner);
}

function dismissFTCBanner() {
  elements.ftcBanner.classList.add('hidden');
  localStorage.setItem(CONFIG.storageKeys.ftcDismissed, 'true');
  
  // Track dismissal
  trackEvent('ftc_banner_dismissed');
}

// ============================================
// LINKS GRID RENDERING
// ============================================

function initLinksGrid() {
  // Initial render with all links
  filterAndRenderLinks('all');
}

function filterAndRenderLinks(category) {
  // Filter links by category
  state.currentCategory = category;
  state.filteredLinks = category === 'all' 
    ? [...links] 
    : links.filter(link => link.category === category);
  
  // Reset visible count
  state.visibleCount = CONFIG.cardsPerPage;
  
  // Render the grid
  renderLinksGrid();
  updateLoadMoreButton();
}

function renderLinksGrid() {
  const linksToShow = state.filteredLinks.slice(0, state.visibleCount);
  
  // Clear existing content
  elements.linksGrid.innerHTML = '';
  
  // Render each link card
  linksToShow.forEach((link, index) => {
    const card = createLinkCard(link, index);
    elements.linksGrid.appendChild(card);
  });
  
  // Add click handlers to CTA buttons
  attachCTAHandlers();
}

function createLinkCard(link, index) {
  const card = document.createElement('article');
  card.className = `link-card ${link.highlight ? 'highlight' : ''}`;
  card.setAttribute('data-id', link.id);
  card.setAttribute('data-category', link.category);
  
  // Badge HTML (if present)
  const badgeHTML = link.badge 
    ? `<span class="card-badge ${link.badge.toLowerCase()}">${link.badge}</span>` 
    : '';
  
  card.innerHTML = `
    <div class="card-header">
      <img class="card-image" src="${link.image}" alt="${escapeHtml(link.title)}" onerror="this.style.display='none'">
      ${badgeHTML}
    </div>
    <h3 class="card-title">${escapeHtml(link.title)}</h3>
    <p class="card-description">${escapeHtml(link.description)}</p>
    <div class="card-meta">
      <span class="category-tag">${formatCategory(link.category)}</span>
      <span class="commission-text">${escapeHtml(link.commission)}</span>
    </div>
    <button class="card-cta" data-link-id="${link.id}" data-link-url="${link.url}" data-link-title="${escapeHtml(link.title)}">
      ${escapeHtml(link.cta)}
    </button>
  `;
  
  return card;
}

function attachCTAHandlers() {
  const ctaButtons = elements.linksGrid.querySelectorAll('.card-cta');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', handleCTAClick);
  });
}

function handleCTAClick(event) {
  const button = event.currentTarget;
  const linkId = button.getAttribute('data-link-id');
  const linkUrl = button.getAttribute('data-link-url');
  const linkTitle = button.getAttribute('data-link-title');
  
  // Find the full link data
  const linkData = links.find(l => l.id === linkId);
  
  // Build tracking data
  const trackingData = {
    id: linkId,
    title: linkTitle,
    url: linkUrl,
    timestamp: new Date().toISOString(),
    category: linkData?.category || 'unknown'
  };
  
  // Log to console
  console.log('Affiliate Link Clicked:', trackingData);
  
  // Push GA4 event
  trackEvent('affiliate_click', trackingData);
  
  // Navigate to the link (use setTimeout to allow tracking to fire)
  setTimeout(() => {
    window.open(linkUrl, '_blank');
  }, 100);
}

// ============================================
// CATEGORY FILTERS
// ============================================

function initFilters() {
  elements.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');
      
      // Update active state
      elements.filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Filter and re-render
      filterAndRenderLinks(category);
      
      // Track filter click
      trackEvent('filter_click', { category });
    });
  });
}

// ============================================
// LOAD MORE FUNCTIONALITY
// ============================================

function initLoadMore() {
  elements.loadMoreBtn.addEventListener('click', loadMoreCards);
}

function loadMoreCards() {
  // Increase visible count
  state.visibleCount += CONFIG.cardsPerLoad;
  
  // Re-render
  renderLinksGrid();
  updateLoadMoreButton();
  
  // Track load more
  trackEvent('load_more', { 
    category: state.currentCategory,
    visible_count: state.visibleCount 
  });
}

function updateLoadMoreButton() {
  const hasMore = state.visibleCount < state.filteredLinks.length;
  
  if (hasMore) {
    elements.loadMoreBtn.classList.remove('hidden');
  } else {
    elements.loadMoreBtn.classList.add('hidden');
  }
}

// ============================================
// EMAIL CAPTURE FORM
// ============================================

function initEmailForm() {
  // Check if user already submitted email
  const emailSubmitted = localStorage.getItem(CONFIG.storageKeys.emailSubmitted);
  
  if (emailSubmitted) {
    showEmailSuccess();
  }
  
  elements.emailForm.addEventListener('submit', handleEmailSubmit);
}

function handleEmailSubmit(event) {
  event.preventDefault();
  
  const email = elements.emailInput.value.trim();
  
  if (!email || !isValidEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Store email in localStorage (for now)
  localStorage.setItem(CONFIG.storageKeys.emailSubmitted, email);
  
  // Show success message
  showEmailSuccess();
  
  // Track email submission
  trackEvent('email_subscribe', { email_domain: email.split('@')[1] });
  
  // Here you would typically send to your email service
  // Example for Brevo (Sendinblue):
  // sendToBrevo(email);
}

function showEmailSuccess() {
  elements.emailForm.classList.add('hidden');
  elements.emailSuccess.classList.remove('hidden');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// DISCLOSURE LINK
// ============================================

function initDisclosureLink() {
  elements.disclosureLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Show FTC banner if dismissed
    elements.ftcBanner.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track disclosure click
    trackEvent('disclosure_link_click');
  });
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

function trackEvent(eventName, eventParams = {}) {
  // Google Analytics 4 event
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  }
  
  // Also log to console for debugging
  console.log(`[GA4 Event] ${eventName}:`, eventParams);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatCategory(category) {
  const categoryMap = {
    'recommended': 'Recommended',
    'deals': 'Deals',
    'ai-tools': 'AI Tools',
    'hosting': 'Hosting',
    'finance': 'Finance',
    'health': 'Health',
    'resources': 'Resources'
  };
  
  return categoryMap[category] || category;
}

// ============================================
// BREVO INTEGRATION HELPER (Optional)
// ============================================
/*
function sendToBrevo(email) {
  // Replace with your Brevo API endpoint and key
  const BREVO_API_KEY = 'YOUR_BREVO_API_KEY';
  const LIST_ID = 'YOUR_LIST_ID';
  
  fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      email: email,
      listIds: [LIST_ID],
      updateEnabled: true
    })
  })
  .then(response => response.json())
  .then(data => console.log('Brevo response:', data))
  .catch(error => console.error('Brevo error:', error));
}
*/

// ============================================
// REDIRECT PAGE HELPER (for /go/ pages)
// ============================================
/*
  Usage in redirect pages:
  
  <script>
    // Configuration
    const REDIRECT_URL = 'https://your-affiliate-link.com';
    const PRODUCT_NAME = 'Your Product';
    const DELAY = 1500; // milliseconds
    
    // Track and redirect
    setTimeout(() => {
      if (typeof gtag === 'function') {
        gtag('event', 'affiliate_redirect', {
          product: PRODUCT_NAME,
          destination: REDIRECT_URL
        });
      }
      window.location.href = REDIRECT_URL;
    }, DELAY);
  </script>
*/

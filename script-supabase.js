/* ============================================
   MY LINKS - JAVASCRIPT (SUPABASE VERSION)
   ============================================
   This version fetches links from Supabase
   instead of localStorage
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  cardsPerPage: 9,
  cardsPerLoad: 9,
  storageKeys: {
    theme: 'affiliatehub-theme',
    ftcDismissed: 'affiliatehub-ftc-dismissed',
    emailSubmitted: 'affiliatehub-email-submitted'
  }
};

// ============================================
// STATE MANAGEMENT
// ============================================

let links = [];
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
// LOAD LINKS FROM SUPABASE
// ============================================

async function loadLinksFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading links from Supabase:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error loading links:', err);
    return [];
  }
}

// ============================================
// INITIALIZATION
// ============================================

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
  
  // Initialize Supabase auth if available
  if (typeof initSupabaseAuth === 'function') {
    initSupabaseAuth();
  }
});

// ============================================
// THEME MANAGEMENT (Dark/Light Mode)
// ============================================

function initTheme() {
  const savedTheme = localStorage.getItem(CONFIG.storageKeys.theme);
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
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
  trackEvent('theme_toggle', { theme: newTheme });
}

// ============================================
// FTC BANNER
// ============================================

function initFTCBanner() {
  const isDismissed = localStorage.getItem(CONFIG.storageKeys.ftcDismissed);
  
  if (isDismissed === 'true') {
    elements.ftcBanner.classList.add('hidden');
  }
  
  elements.ftcDismiss.addEventListener('click', dismissFTCBanner);
}

function dismissFTCBanner() {
  elements.ftcBanner.classList.add('hidden');
  localStorage.setItem(CONFIG.storageKeys.ftcDismissed, 'true');
  trackEvent('ftc_banner_dismissed');
}

// ============================================
// LINKS GRID RENDERING
// ============================================

function initLinksGrid() {
  filterAndRenderLinks('all');
}

async function filterAndRenderLinks(category) {
  // Re-fetch from Supabase every time
  links = await loadLinksFromSupabase();
  
  state.currentCategory = category;
  state.filteredLinks = category === 'all' 
    ? [...links] 
    : links.filter(link => link.category === category);
  
  state.visibleCount = CONFIG.cardsPerPage;
  renderLinksGrid();
  updateLoadMoreButton();
}

function renderLinksGrid() {
  const linksToShow = state.filteredLinks.slice(0, state.visibleCount);
  
  elements.linksGrid.innerHTML = '';
  
  linksToShow.forEach((link) => {
    const card = createLinkCard(link);
    elements.linksGrid.appendChild(card);
  });
  
  attachCTAHandlers();
}

function createLinkCard(link) {
  const card = document.createElement('article');
  card.className = `link-card ${link.highlight ? 'highlight' : ''}`;
  card.setAttribute('data-id', link.id);
  card.setAttribute('data-category', link.category);
  
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
  
  const linkData = links.find(l => l.id === parseInt(linkId));
  
  const trackingData = {
    id: linkId,
    title: linkTitle,
    url: linkUrl,
    timestamp: new Date().toISOString(),
    category: linkData?.category || 'unknown'
  };
  
  console.log('Affiliate Link Clicked:', trackingData);
  trackEvent('affiliate_click', trackingData);
  
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
      
      elements.filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      filterAndRenderLinks(category);
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
  state.visibleCount += CONFIG.cardsPerLoad;
  renderLinksGrid();
  updateLoadMoreButton();
  
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
  
  localStorage.setItem(CONFIG.storageKeys.emailSubmitted, email);
  showEmailSuccess();
  trackEvent('email_subscribe', { email_domain: email.split('@')[1] });
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
    elements.ftcBanner.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('disclosure_link_click');
  });
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

function trackEvent(eventName, eventParams = {}) {
  if (!hasAnalyticsConsent()) {
    console.log(`[Tracking Blocked - No Consent] ${eventName}:`, eventParams);
    return;
  }
  
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  }
  
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

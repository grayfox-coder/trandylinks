/* ============================================
   MY LINKS - JAVASCRIPT (FIXED)
   ============================================
   Links are loaded from Supabase and update
   in real-time when admin makes changes.
   ============================================ */

let links = [];

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
// STATE
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
  ftcBanner:      document.getElementById('ftc-banner'),
  ftcDismiss:     document.getElementById('ftc-dismiss'),
  themeToggle:    document.getElementById('theme-toggle'),
  linksGrid:      document.getElementById('links-grid'),
  loadMoreBtn:    document.getElementById('load-more'),
  filterTabs:     document.querySelectorAll('.filter-tab'),
  emailForm:      document.getElementById('email-form'),
  emailInput:     document.getElementById('email-input'),
  emailSuccess:   document.getElementById('email-success'),
  disclosureLink: document.getElementById('disclosure-link')
};

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initFTCBanner();
  initFilters();
  initLoadMore();
  initEmailForm();
  initDisclosureLink();

  // Show loading state while fetching
  if (elements.linksGrid) {
    elements.linksGrid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:2rem;">Loading links…</p>';
  }

  await loadLinksFromSupabase();
  filterAndRenderLinks(state.currentCategory);

  // ✅ FIX: Real-time subscription WITHOUT user_id filter
  //    (main site is public/unauthenticated, filter would break it)
  subscribeToLinksUpdates();
});

// ============================================
// SUPABASE: LOAD LINKS
// ============================================

async function loadLinksFromSupabase() {
  try {
    if (typeof supabaseClient === 'undefined') {
      console.error('❌ supabaseClient is not defined. Check that supabase-config.js is loaded and non-empty.');
      links = [];
      return;
    }

    const { data, error } = await supabaseClient
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading links from Supabase:', error);
      links = [];
      return;
    }

    links = data || [];
    console.log(`✅ Loaded ${links.length} links from Supabase`);
  } catch (err) {
    console.error('Failed to load links:', err);
    links = [];
  }
}

// ============================================
// SUPABASE: REAL-TIME SUBSCRIPTION (FIXED)
// ============================================

function subscribeToLinksUpdates() {
  if (typeof supabaseClient === 'undefined') return;

  supabaseClient
    .channel('public-links-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'links'
        // ✅ NO user_id filter here — main site is unauthenticated
      },
      async (payload) => {
        console.log('Real-time update received:', payload);
        await loadLinksFromSupabase();
        filterAndRenderLinks(state.currentCategory);
      }
    )
    .subscribe();
}

// ============================================
// THEME
// ============================================

function initTheme() {
  const savedTheme = localStorage.getItem(CONFIG.storageKeys.theme);
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  elements.themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
    localStorage.setItem(CONFIG.storageKeys.theme, next);
    trackEvent('theme_toggle', { theme: next });
  });
}

// ============================================
// FTC BANNER
// ============================================

function initFTCBanner() {
  if (localStorage.getItem(CONFIG.storageKeys.ftcDismissed) === 'true') {
    elements.ftcBanner?.classList.add('hidden');
  }
  elements.ftcDismiss?.addEventListener('click', () => {
    elements.ftcBanner?.classList.add('hidden');
    localStorage.setItem(CONFIG.storageKeys.ftcDismissed, 'true');
    trackEvent('ftc_banner_dismissed');
  });
}

// ============================================
// LINKS GRID
// ============================================

function filterAndRenderLinks(category) {
  state.currentCategory = category;
  state.filteredLinks = category === 'all'
    ? [...links]
    : links.filter(l => l.category === category);
  state.visibleCount = CONFIG.cardsPerPage;
  renderLinksGrid();
  updateLoadMoreButton();
}

function renderLinksGrid() {
  if (!elements.linksGrid) return;

  const toShow = state.filteredLinks.slice(0, state.visibleCount);

  if (toShow.length === 0) {
    elements.linksGrid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:2rem;">No links found in this category.</p>';
    return;
  }

  elements.linksGrid.innerHTML = '';
  toShow.forEach((link) => {
    elements.linksGrid.appendChild(createLinkCard(link));
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
      <img class="card-image" src="${link.image || ''}" alt="${escapeHtml(link.title)}" onerror="this.style.display='none'">
      ${badgeHTML}
    </div>
    <h3 class="card-title">${escapeHtml(link.title)}</h3>
    <p class="card-description">${escapeHtml(link.description || '')}</p>
    <div class="card-meta">
      <span class="category-tag">${formatCategory(link.category)}</span>
      <span class="commission-text">${escapeHtml(link.commission || '')}</span>
    </div>
    <button class="card-cta"
      data-link-id="${link.id}"
      data-link-url="${link.url}"
      data-link-title="${escapeHtml(link.title)}">
      ${escapeHtml(link.cta || 'Learn More')}
    </button>
  `;
  return card;
}

function attachCTAHandlers() {
  elements.linksGrid.querySelectorAll('.card-cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const b = e.currentTarget;
      const linkData = links.find(l => l.id == b.getAttribute('data-link-id'));
      trackEvent('affiliate_click', {
        id:        b.getAttribute('data-link-id'),
        title:     b.getAttribute('data-link-title'),
        url:       b.getAttribute('data-link-url'),
        category:  linkData?.category || 'unknown',
        timestamp: new Date().toISOString()
      });
      setTimeout(() => window.open(b.getAttribute('data-link-url'), '_blank'), 100);
    });
  });
}

// ============================================
// FILTERS
// ============================================

function initFilters() {
  elements.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterAndRenderLinks(tab.getAttribute('data-category'));
      trackEvent('filter_click', { category: tab.getAttribute('data-category') });
    });
  });
}

// ============================================
// LOAD MORE
// ============================================

function initLoadMore() {
  elements.loadMoreBtn?.addEventListener('click', () => {
    state.visibleCount += CONFIG.cardsPerLoad;
    renderLinksGrid();
    updateLoadMoreButton();
    trackEvent('load_more', { category: state.currentCategory, visible_count: state.visibleCount });
  });
}

function updateLoadMoreButton() {
  if (!elements.loadMoreBtn) return;
  const hasMore = state.visibleCount < state.filteredLinks.length;
  elements.loadMoreBtn.classList.toggle('hidden', !hasMore);
}

// ============================================
// EMAIL FORM
// ============================================

function initEmailForm() {
  if (localStorage.getItem(CONFIG.storageKeys.emailSubmitted)) {
    showEmailSuccess();
  }
  elements.emailForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = elements.emailInput?.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    localStorage.setItem(CONFIG.storageKeys.emailSubmitted, email);
    showEmailSuccess();
    trackEvent('email_subscribe', { email_domain: email.split('@')[1] });
  });
}

function showEmailSuccess() {
  elements.emailForm?.classList.add('hidden');
  elements.emailSuccess?.classList.remove('hidden');
}

// ============================================
// DISCLOSURE LINK
// ============================================

function initDisclosureLink() {
  elements.disclosureLink?.addEventListener('click', (e) => {
    e.preventDefault();
    elements.ftcBanner?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// ANALYTICS
// ============================================

function trackEvent(eventName, eventParams = {}) {
  if (!hasAnalyticsConsent()) return;
  if (typeof gtag === 'function') gtag('event', eventName, eventParams);
}

// ============================================
// UTILITIES
// ============================================

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

function formatCategory(cat) {
  const map = {
    'recommended': 'Recommended',
    'deals': 'Deals',
    'ai-tools': 'AI Tools',
    'hosting': 'Hosting',
    'finance': 'Finance',
    'health': 'Health',
    'resources': 'Resources'
  };
  return map[cat] || cat;
}
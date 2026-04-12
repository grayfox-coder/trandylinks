/* ============================================
   CONSENT MANAGEMENT
   ============================================
   Handles user consent for analytics tracking
   (GA4 and Microsoft Clarity)
   ============================================ */

// Guard against redeclaration
if (typeof CONSENT_CONFIG === 'undefined') {
  var CONSENT_CONFIG = {
    storageKey: 'affiliatehub-consent',
    consentVersion: '1.0'
  };
}

// Get current consent state
function getConsentState() {
  const stored = localStorage.getItem(CONSENT_CONFIG.storageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Check if user has granted analytics consent
function hasAnalyticsConsent() {
  const consent = getConsentState();
  return consent && consent.analytics === true;
}

// Set consent state
function setConsent(analytics = false) {
  const consentState = {
    analytics,
    timestamp: new Date().toISOString(),
    version: CONSENT_CONFIG.consentVersion
  };
  localStorage.setItem(CONSENT_CONFIG.storageKey, JSON.stringify(consentState));
  
  // Load/unload analytics based on consent
  if (analytics) {
    loadGA4();
    loadClarity();
  } else {
    revokeConsent();
  }
}

// Revoke consent and clean up
function revokeConsent() {
  // Clear GA4 cookies
  clearGA4Cookies();
  
  // Clear Clarity cookies
  clearClarityCookies();
  
  // Update consent state
  const consentState = {
    analytics: false,
    timestamp: new Date().toISOString(),
    version: CONSENT_CONFIG.consentVersion
  };
  localStorage.setItem(CONSENT_CONFIG.storageKey, JSON.stringify(consentState));
}

// Load GA4 script and initialize gtag
function loadGA4() {
  // Prevent duplicate loading
  if (window.gtag) return;
  
  // GA4 configuration - REPLACE WITH YOUR GA4 ID
  const GA4_ID = 'G-3JBPH7TFEG'; // Replace with your GA4 ID
  
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  function gtag() {
    window.dataLayer.push(arguments);
  }
  
  window.gtag = gtag;
  gtag('js', new Date());
  
  // Configure GA4 with proper cookie domain
  gtag('config', GA4_ID, {
    cookie_domain: 'auto', // Let GA4 auto-detect the domain
    cookie_flags: 'SameSite=None;Secure'
  });
  
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);
}

// Load Clarity script
function loadClarity() {
  // Prevent duplicate loading
  if (window.clarity) return;
  
  // Clarity configuration - REPLACE WITH YOUR CLARITY PROJECT ID
  const CLARITY_ID = 'wajawwcwkl'; // Replace with your Clarity ID from clarity.microsoft.com
  
  // Only load if ID is configured (not placeholder)
  if (CLARITY_ID === 'wajawwcwkl') {
    console.warn('Clarity ID not configured. Skipping Clarity initialization. Get your ID from clarity.microsoft.com');
    return;
  }
  
  // Initialize Clarity
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
}

// Clear GA4 cookies
function clearGA4Cookies() {
  // Clear Google Analytics cookies
  const ga4Cookies = ['_ga', '_gid', '_gat', '_ga_*'];
  ga4Cookies.forEach(cookieName => {
    if (cookieName.includes('*')) {
      // Clear wildcard cookies
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('_ga_')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    } else {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

// Clear Clarity cookies
function clearClarityCookies() {
  // Clear Clarity cookies
  const clarityCookies = ['_clck', '_clf', '_clsk'];
  clarityCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

// Show consent banner
function showConsentBanner() {
  // Check if consent has already been given
  const consent = getConsentState();
  if (consent) {
    // Consent already set, load analytics if granted
    if (consent.analytics) {
      loadGA4();
      loadClarity();
    }
    return;
  }
  
  // Create consent banner
  const banner = document.createElement('div');
  banner.id = 'consent-banner';
  banner.className = 'consent-banner';
  banner.innerHTML = `
    <div class="consent-content">
      <div class="consent-text">
        <h3>Privacy & Tracking</h3>
        <p>We use analytics to understand how you use our site and improve your experience. No personal data is sold.</p>
      </div>
      <div class="consent-actions">
        <button id="consent-decline" class="consent-btn consent-decline">Decline</button>
        <button id="consent-accept" class="consent-btn consent-accept">Accept</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Handle accept
  document.getElementById('consent-accept').addEventListener('click', () => {
    setConsent(true);
    banner.remove();
  });
  
  // Handle decline
  document.getElementById('consent-decline').addEventListener('click', () => {
    setConsent(false);
    banner.remove();
  });
}

// Initialize consent on page load
document.addEventListener('DOMContentLoaded', () => {
  showConsentBanner();
});

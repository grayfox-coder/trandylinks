/* ============================================
   ADMIN PANEL JAVASCRIPT
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const ADMIN_CONFIG = {
  // Change this to your desired admin password
  password: btoa('admin123'), // Base64 encoded for security (still change it!)
  storageKey: 'my-links-data',
  sessionKey: 'admin-session'
};

// ============================================
// STATE MANAGEMENT
// ============================================

let currentSession = null;
let allLinks = [];
let editingLinkId = null;

// ============================================
// DOM ELEMENTS
// ============================================

const loginScreen = document.getElementById('login-screen');
const adminScreen = document.getElementById('admin-screen');
const loginForm = document.getElementById('login-form');
const adminPasswordInput = document.getElementById('admin-password');

const logoutBtn = document.getElementById('logout-btn');
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

const addLinkForm = document.getElementById('add-link-form');
const linksTbody = document.getElementById('links-tbody');
const noLinksMessage = document.getElementById('no-links-message');
const totalLinksSpan = document.getElementById('total-links');
const linksTableContainer = document.getElementById('links-table-container');

const editModal = document.getElementById('edit-modal');
const editLinkForm = document.getElementById('edit-link-form');
const modalCloseButtons = document.querySelectorAll('.modal-close');

const passwordForm = document.getElementById('password-form');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const clearAllBtn = document.getElementById('clear-all-btn');

const toast = document.getElementById('toast');

// ============================================
// INITIALIZATION
// ============================================

function init() {
  // Check if user is logged in
  checkSession();
  
  // Load links from storage
  loadLinks();
  
  // Event Listeners
  setupEventListeners();
}

function checkSession() {
  const session = sessionStorage.getItem(ADMIN_CONFIG.sessionKey);
  if (session) {
    currentSession = session;
    showAdminScreen();
  } else {
    showLoginScreen();
  }
}

function setupEventListeners() {
  // Login
  loginForm.addEventListener('submit', handleLogin);
  
  // Logout
  logoutBtn.addEventListener('click', handleLogout);
  
  // Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });
  
  // Add Link
  addLinkForm.addEventListener('submit', handleAddLink);
  
  // Edit Modal
  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', closeEditModal);
  });
  editLinkForm.addEventListener('submit', handleEditLink);
  
  // Settings
  passwordForm.addEventListener('submit', handleChangePassword);
  exportBtn.addEventListener('click', handleExport);
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', handleImport);
  clearAllBtn.addEventListener('click', handleClearAll);
  
  // Add new link from no-content message
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('link-add-new')) {
      e.preventDefault();
      switchTab('add-link');
    }
  });
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin(e) {
  e.preventDefault();
  
  const password = adminPasswordInput.value;
  const hashedPassword = btoa(password);
  
  if (hashedPassword === ADMIN_CONFIG.password) {
    // Set session
    sessionStorage.setItem(ADMIN_CONFIG.sessionKey, true);
    currentSession = true;
    
    // Clear password field
    adminPasswordInput.value = '';
    
    // Show admin screen
    showAdminScreen();
    showToast('✅ Login successful!', 'success');
  } else {
    adminPasswordInput.value = '';
    showToast('❌ Incorrect password', 'danger');
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem(ADMIN_CONFIG.sessionKey);
    currentSession = null;
    showLoginScreen();
    showToast('👋 Logged out', 'success');
  }
}

function showLoginScreen() {
  loginScreen.classList.add('active');
  adminScreen.classList.remove('active');
}

function showAdminScreen() {
  adminScreen.classList.add('active');
  loginScreen.classList.remove('active');
}

// ============================================
// TAB NAVIGATION
// ============================================

function switchTab(tabName) {
  // Update nav items
  navItems.forEach(item => {
    if (item.dataset.tab === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update tab content
  tabContents.forEach(content => {
    if (content.id === tabName) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

// ============================================
// LINKS MANAGEMENT
// ============================================

function loadLinks() {
  const stored = localStorage.getItem(ADMIN_CONFIG.storageKey);
  allLinks = stored ? JSON.parse(stored) : [];
  renderLinksTable();
}

function saveLinks() {
  localStorage.setItem(ADMIN_CONFIG.storageKey, JSON.stringify(allLinks));
  // Also update main site
  window.open('../index.html?refresh=true', '_self');
}

function renderLinksTable() {
  totalLinksSpan.textContent = allLinks.length;
  
  if (allLinks.length === 0) {
    linksTbody.innerHTML = '';
    linksTableContainer.style.display = 'none';
    noLinksMessage.style.display = 'block';
    return;
  }
  
  linksTableContainer.style.display = 'block';
  noLinksMessage.style.display = 'none';
  
  linksTbody.innerHTML = allLinks.map(link => `
    <tr>
      <td class="table-icon">${link.icon || '🔗'}</td>
      <td><strong>${link.title}</strong></td>
      <td>
        <span style="color: var(--text-secondary);">${link.category}</span>
      </td>
      <td>
        <a href="${link.url}" target="_blank" style="color: var(--accent); text-decoration: none; font-size: 0.85rem; word-break: break-all;">
          ${link.url.substring(0, 30)}${link.url.length > 30 ? '...' : ''}
        </a>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" onclick="openEditModal('${link.id}')" title="Edit">
            ✏️
          </button>
          <button class="btn-icon danger" onclick="deleteLink('${link.id}')" title="Delete">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function handleAddLink(e) {
  e.preventDefault();
  
  const newLink = {
    id: 'link_' + Date.now(),
    icon: document.getElementById('link-icon').value || '🔗',
    badge: document.getElementById('link-badge').value,
    title: document.getElementById('link-title').value,
    description: document.getElementById('link-description').value,
    category: document.getElementById('link-category').value,
    commission: document.getElementById('link-commission').value,
    cta: document.getElementById('link-cta').value || 'Learn More',
    url: document.getElementById('link-url').value,
    highlight: document.getElementById('link-highlight').checked
  };
  
  allLinks.push(newLink);
  saveLinks();
  
  // Reset form
  addLinkForm.reset();
  renderLinksTable();
  
  showToast('✅ Link added successfully!', 'success');
}

function openEditModal(linkId) {
  editingLinkId = linkId;
  const link = allLinks.find(l => l.id === linkId);
  
  if (!link) return;
  
  // Populate form
  document.getElementById('edit-link-id').value = link.id;
  document.getElementById('edit-link-icon').value = link.icon;
  document.getElementById('edit-link-title').value = link.title;
  document.getElementById('edit-link-category').value = link.category;
  document.getElementById('edit-link-badge').value = link.badge || '';
  document.getElementById('edit-link-description').value = link.description;
  document.getElementById('edit-link-commission').value = link.commission;
  document.getElementById('edit-link-cta').value = link.cta;
  document.getElementById('edit-link-url').value = link.url;
  document.getElementById('edit-link-highlight').checked = link.highlight;
  
  // Show modal
  editModal.classList.remove('hidden');
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editingLinkId = null;
}

function handleEditLink(e) {
  e.preventDefault();
  
  const linkIndex = allLinks.findIndex(l => l.id === editingLinkId);
  if (linkIndex === -1) return;
  
  allLinks[linkIndex] = {
    id: editingLinkId,
    icon: document.getElementById('edit-link-icon').value || '🔗',
    badge: document.getElementById('edit-link-badge').value,
    title: document.getElementById('edit-link-title').value,
    description: document.getElementById('edit-link-description').value,
    category: document.getElementById('edit-link-category').value,
    commission: document.getElementById('edit-link-commission').value,
    cta: document.getElementById('edit-link-cta').value || 'Learn More',
    url: document.getElementById('edit-link-url').value,
    highlight: document.getElementById('edit-link-highlight').checked
  };
  
  saveLinks();
  closeEditModal();
  renderLinksTable();
  
  showToast('✅ Link updated successfully!', 'success');
}

function deleteLink(linkId) {
  if (confirm('Are you sure you want to delete this link?')) {
    allLinks = allLinks.filter(l => l.id !== linkId);
    saveLinks();
    renderLinksTable();
    showToast('✅ Link deleted', 'success');
  }
}

// ============================================
// SETTINGS
// ============================================

function handleChangePassword(e) {
  e.preventDefault();
  
  const newPassword = document.getElementById('new-password').value;
  
  if (newPassword.length < 6) {
    showToast('❌ Password must be at least 6 characters', 'danger');
    return;
  }
  
  // Update password (in production, send to backend)
  const hashedPassword = btoa(newPassword);
  // This is stored in the code - in production use a backend
  
  showToast('⚠️ Password updated. Update ADMIN_CONFIG.password in admin.js', 'success');
  console.log('New hashed password:', hashedPassword);
  console.log('Update line: password: ' + "'" + hashedPassword + "'");
  
  passwordForm.reset();
}

function handleExport() {
  if (allLinks.length === 0) {
    showToast('❌ No links to export', 'danger');
    return;
  }
  
  const dataStr = JSON.stringify(allLinks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `my-links-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  showToast('✅ Links exported successfully!', 'success');
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      
      if (!Array.isArray(imported)) {
        showToast('❌ Invalid JSON format', 'danger');
        return;
      }
      
      allLinks = imported;
      saveLinks();
      renderLinksTable();
      
      showToast(`✅ Imported ${imported.length} links!`, 'success');
    } catch (error) {
      showToast('❌ Error importing file: ' + error.message, 'danger');
    }
  };
  
  reader.readAsText(file);
  importFile.value = '';
}

function handleClearAll() {
  if (confirm('⚠️ Are you SURE? This will delete ALL links permanently!')) {
    if (confirm('This action cannot be undone. Continue?')) {
      allLinks = [];
      saveLinks();
      renderLinksTable();
      showToast('✅ All links cleared', 'success');
    }
  }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// ============================================
// START
// ============================================

document.addEventListener('DOMContentLoaded', init);

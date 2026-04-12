/* ============================================
   ADMIN PANEL - SUPABASE VERSION
   ============================================
   Saves links directly to Supabase
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const ADMIN_CONFIG = {
  password: btoa('admin123'),
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
  checkSession();
  loadLinks();
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
  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  
  navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });
  
  addLinkForm.addEventListener('submit', handleAddLink);
  
  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', closeEditModal);
  });
  editLinkForm.addEventListener('submit', handleEditLink);
  
  passwordForm.addEventListener('submit', handleChangePassword);
  exportBtn.addEventListener('click', handleExport);
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', handleImport);
  clearAllBtn.addEventListener('click', handleClearAll);
  
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
    sessionStorage.setItem(ADMIN_CONFIG.sessionKey, true);
    currentSession = true;
    adminPasswordInput.value = '';
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
  navItems.forEach(item => {
    if (item.dataset.tab === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  tabContents.forEach(content => {
    if (content.id === tabName) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

// ============================================
// LINKS MANAGEMENT (SUPABASE)
// ============================================

async function loadLinks() {
  try {
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
  } catch (err) {
    console.error('Error loading links:', err);
    allLinks = [];
  }
  
  renderLinksTable();
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
      <td class="table-image">
        <img src="${link.image}" alt="${link.title}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;">
      </td>
      <td><strong>${link.title}</strong></td>
      <td><span style="color: var(--text-secondary);">${link.category}</span></td>
      <td>
        <a href="${link.url}" target="_blank" style="color: var(--accent); text-decoration: none; font-size: 0.85rem; word-break: break-all;">
          ${link.url.substring(0, 30)}${link.url.length > 30 ? '...' : ''}
        </a>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" onclick="openEditModal(${link.id})" title="Edit">✏️</button>
          <button class="btn-icon danger" onclick="deleteLink(${link.id})" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

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
  
  try {
    const { error } = await supabaseClient
      .from('links')
      .insert([newLink]);
    
    if (error) {
      showToast(`❌ Error: ${error.message}`, 'danger');
      return;
    }
    
    addLinkForm.reset();
    await loadLinks();
    showToast('✅ Link added successfully!', 'success');
  } catch (err) {
    showToast(`❌ Error: ${err.message}`, 'danger');
  }
}

function openEditModal(linkId) {
  editingLinkId = linkId;
  const link = allLinks.find(l => l.id === linkId);
  
  if (!link) return;
  
  document.getElementById('edit-link-id').value = link.id;
  document.getElementById('edit-link-image').value = link.image;
  document.getElementById('edit-link-title').value = link.title;
  document.getElementById('edit-link-category').value = link.category;
  document.getElementById('edit-link-badge').value = link.badge || '';
  document.getElementById('edit-link-description').value = link.description;
  document.getElementById('edit-link-commission').value = link.commission;
  document.getElementById('edit-link-cta').value = link.cta;
  document.getElementById('edit-link-url').value = link.url;
  document.getElementById('edit-link-highlight').checked = link.highlight;
  
  editModal.classList.remove('hidden');
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editingLinkId = null;
}

async function handleEditLink(e) {
  e.preventDefault();
  
  const linkData = {
    title: document.getElementById('edit-link-title').value,
    description: document.getElementById('edit-link-description').value,
    url: document.getElementById('edit-link-url').value,
    image: document.getElementById('edit-link-image').value,
    category: document.getElementById('edit-link-category').value,
    badge: document.getElementById('edit-link-badge').value || null,
    commission: document.getElementById('edit-link-commission').value || null,
    cta: document.getElementById('edit-link-cta').value || 'Learn More',
    highlight: document.getElementById('edit-link-highlight').checked
  };
  
  try {
    const { error } = await supabaseClient
      .from('links')
      .update(linkData)
      .eq('id', editingLinkId);
    
    if (error) {
      showToast(`❌ Error: ${error.message}`, 'danger');
      return;
    }
    
    await loadLinks();
    closeEditModal();
    showToast('✅ Link updated successfully!', 'success');
  } catch (err) {
    showToast(`❌ Error: ${err.message}`, 'danger');
  }
}

async function deleteLink(linkId) {
  if (confirm('Are you sure you want to delete this link?')) {
    try {
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
    } catch (err) {
      showToast(`❌ Error: ${err.message}`, 'danger');
    }
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
  
  const hashedPassword = btoa(newPassword);
  showToast('⚠️ Password updated. Update ADMIN_CONFIG.password in admin.js', 'success');
  console.log('New hashed password:', hashedPassword);
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

async function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      
      if (!Array.isArray(imported)) {
        showToast('❌ Invalid JSON format', 'danger');
        return;
      }
      
      const { error } = await supabaseClient
        .from('links')
        .insert(imported);
      
      if (error) {
        showToast(`❌ Error: ${error.message}`, 'danger');
        return;
      }
      
      await loadLinks();
      showToast(`✅ Imported ${imported.length} links!`, 'success');
    } catch (error) {
      showToast(`❌ Error importing file: ${error.message}`, 'danger');
    }
  };
  
  reader.readAsText(file);
  importFile.value = '';
}

async function handleClearAll() {
  if (confirm('⚠️ Are you SURE? This will delete ALL links permanently!')) {
    if (confirm('This action cannot be undone. Continue?')) {
      try {
        const { error } = await supabaseClient
          .from('links')
          .delete()
          .neq('id', 0);  // Delete all rows
        
        if (error) {
          showToast(`❌ Error: ${error.message}`, 'danger');
          return;
        }
        
        await loadLinks();
        showToast('✅ All links cleared', 'success');
      } catch (err) {
        showToast(`❌ Error: ${err.message}`, 'danger');
      }
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

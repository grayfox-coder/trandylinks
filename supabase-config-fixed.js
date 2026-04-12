/* ============================================
   SUPABASE CONFIGURATION
   ============================================
   Replace these with your actual Supabase credentials
   Get them from: https://app.supabase.com → Settings → API
   ============================================ */

// STEP 1: Fill in your Supabase credentials
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth state
let authState = {
  user: null,
  session: null
};

// Initialize Supabase Auth UI
function initSupabaseAuth() {
  const authContainer = document.getElementById('auth-ui');
  if (!authContainer) return;

  authContainer.innerHTML = `
    <div class="supabase-auth-widget">
      <h4>Sign In</h4>
      <form id="supabase-login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required>
        </div>
        <button type="submit" class="submit-btn">Sign In</button>
      </form>
      <div id="auth-message"></div>
      <p>Don't have an account? <a href="#" id="signup-link">Sign Up</a></p>
      <div id="supabase-signup-form" class="hidden">
        <h4>Create Account</h4>
        <form id="supabase-signup-form-inner">
          <div class="form-group">
            <label for="signup-email">Email</label>
            <input type="email" id="signup-email" required>
          </div>
          <div class="form-group">
            <label for="signup-password">Password</label>
            <input type="password" id="signup-password" required>
          </div>
          <button type="submit" class="submit-btn">Sign Up</button>
          <button type="button" id="cancel-signup">Cancel</button>
        </form>
        <div id="signup-message"></div>
      </div>
    </div>
  `;

  const loginForm = document.getElementById('supabase-login-form');

  // Handle login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    const messageDiv = document.getElementById('auth-message');

    if (error) {
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.className = 'error';
    } else {
      messageDiv.textContent = 'Signed in successfully!';
      messageDiv.className = 'success';
      authState.user = data.user;
      authState.session = data.session;
      updateAuthUI();
    }
  });

  // Show signup form
  document.getElementById('signup-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('supabase-signup-form').classList.remove('hidden');
    loginForm.parentElement.style.display = 'none';
  });

  // Handle signup
  document.getElementById('supabase-signup-form-inner').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { error } = await supabaseClient.auth.signUp({ email, password });
    const messageDiv = document.getElementById('signup-message');

    if (error) {
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.className = 'error';
    } else {
      messageDiv.textContent = 'Account created! Please check your email to confirm.';
      messageDiv.className = 'success';
    }
  });

  // Cancel signup
  document.getElementById('cancel-signup').addEventListener('click', () => {
    document.getElementById('supabase-signup-form').classList.add('hidden');
    loginForm.parentElement.style.display = 'block';
  });

  // Auth state change listener
  supabaseClient.auth.onAuthStateChange((event, session) => {
    authState.session = session;
    authState.user = session?.user ?? null;
    updateAuthUI();
  });
}

// Update auth toggle button based on auth state
function updateAuthUI() {
  const authToggle = document.getElementById('auth-toggle');
  if (!authToggle) return;

  if (authState.user) {
    authToggle.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l2 2" />
      </svg>
      <span>${authState.user.email?.split('@')[0] || 'User'}</span>
    `;
    authToggle.title = `Signed in as ${authState.user.email}`;
  } else {
    authToggle.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/>
      </svg>
    `;
    authToggle.title = 'Sign in';
  }
}

// Fetch links from Supabase
async function fetchLinksFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching links from Supabase:', error);
      // Fallback to localStorage if Supabase fails
      return JSON.parse(localStorage.getItem('my-links-data')) || [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error fetching links:', err);
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('my-links-data')) || [];
  }
}

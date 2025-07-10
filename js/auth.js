// Authentication Module for Amalan Tracking App

// Authentication configuration
const AUTH_CONFIG = {
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    REMEMBER_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'auth_user',
    TIMESTAMP_KEY: 'auth_timestamp',
    REMEMBER_KEY: 'auth_remember',
    CREDENTIALS_KEY: 'saved_credentials'
};

// Authentication state
let currentUser = null;
let authToken = null;
let isAuthenticated = false;

/**
 * Initialize authentication system
 */
function initAuth() {
    // Check for existing session
    checkExistingSession();
    
    // Setup auto-logout on session expire
    setupSessionMonitoring();
    
    // Setup visibility change handling
    setupVisibilityHandling();
}

/**
 * Check for existing valid session
 */
function checkExistingSession() {
    const token = StorageUtils.get(AUTH_CONFIG.TOKEN_KEY);
    const timestamp = StorageUtils.get(AUTH_CONFIG.TIMESTAMP_KEY);
    const remember = StorageUtils.get(AUTH_CONFIG.REMEMBER_KEY);
    
    if (!token || !timestamp) {
        clearSession();
        return false;
    }
    
    const now = Date.now();
    const sessionAge = now - timestamp;
    const maxAge = remember ? AUTH_CONFIG.REMEMBER_DURATION : AUTH_CONFIG.SESSION_DURATION;
    
    if (sessionAge > maxAge) {
        clearSession();
        UIUtils.showToast('Sesi telah berakhir, silakan login kembali', 'warning');
        return false;
    }
    
    // Session is valid
    authToken = token;
    currentUser = StorageUtils.get(AUTH_CONFIG.USER_KEY);
    isAuthenticated = true;
    
    // Update timestamp
    StorageUtils.set(AUTH_CONFIG.TIMESTAMP_KEY, now);
    
    return true;
}

/**
 * Setup session monitoring
 */
function setupSessionMonitoring() {
    // Check session every 5 minutes
    setInterval(() => {
        if (isAuthenticated && !checkExistingSession()) {
            handleSessionExpired();
        }
    }, 5 * 60 * 1000);
}

/**
 * Setup page visibility handling
 */
function setupVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && isAuthenticated) {
            // Page became visible, check session
            if (!checkExistingSession()) {
                handleSessionExpired();
            }
        }
    });
}

/**
 * Handle session expiration
 */
function handleSessionExpired() {
    logout();
    UIUtils.showToast('Sesi telah berakhir', 'error');
    
    // Redirect to login if not already there
    if (!window.location.pathname.includes('index.html') && 
        window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
}

/**
 * Perform login
 */
async function login(username, password, rememberMe = false) {
    try {
        // Validate inputs
        if (!username || !password) {
            throw new Error('Username dan password wajib diisi');
        }
        
        // Show loading
        UIUtils.showLoading();
        
        // Call authentication API
        const response = await api.authenticate(username, password);
        
        if (response.success) {
            // Set authentication state
            authToken = response.token || generateSessionToken();
            currentUser = username;
            isAuthenticated = true;
            
            // Save to storage
            StorageUtils.set(AUTH_CONFIG.TOKEN_KEY, authToken);
            StorageUtils.set(AUTH_CONFIG.USER_KEY, username);
            StorageUtils.set(AUTH_CONFIG.TIMESTAMP_KEY, Date.now());
            StorageUtils.set(AUTH_CONFIG.REMEMBER_KEY, rememberMe);
            
            // Save credentials if remember me is checked
            if (rememberMe) {
                saveCreds(username);
            } else {
                clearSavedCredentials();
            }
            
            UIUtils.showToast('Login berhasil!', 'success');
            return { success: true };
            
        } else {
            throw new Error(response.message || 'Login gagal');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        UIUtils.showToast(error.message, 'error');
        return { success: false, message: error.message };
    } finally {
        UIUtils.hideLoading();
    }
}

/**
 * Perform logout
 */
function logout() {
    // Clear authentication state
    authToken = null;
    currentUser = null;
    isAuthenticated = false;
    
    // Clear session storage
    clearSession();
    
    // Clear API cache
    if (window.api) {
        api.clearCache();
    }
    
    UIUtils.showToast('Logout berhasil', 'success');
}

/**
 * Clear session data
 */
function clearSession() {
    StorageUtils.remove(AUTH_CONFIG.TOKEN_KEY);
    StorageUtils.remove(AUTH_CONFIG.USER_KEY);
    StorageUtils.remove(AUTH_CONFIG.TIMESTAMP_KEY);
    StorageUtils.remove(AUTH_CONFIG.REMEMBER_KEY);
}

/**
 * Save credentials for remember me
 */
function saveCreds(username) {
    StorageUtils.set(AUTH_CONFIG.CREDENTIALS_KEY, {
        username: username,
        timestamp: Date.now()
    });
}

/**
 * Load saved credentials
 */
function loadSavedCredentials() {
    const saved = StorageUtils.get(AUTH_CONFIG.CREDENTIALS_KEY);
    
    if (saved && saved.username) {
        const usernameInput = document.getElementById('username');
        const rememberCheckbox = document.getElementById('rememberMe');
        
        if (usernameInput) {
            usernameInput.value = saved.username;
        }
        
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
}

/**
 * Clear saved credentials
 */
function clearSavedCredentials() {
    StorageUtils.remove(AUTH_CONFIG.CREDENTIALS_KEY);
}

/**
 * Generate session token
 */
function generateSessionToken() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isAuthenticated && authToken && currentUser;
}

/**
 * Get current user
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Get auth token
 */
function getAuthToken() {
    return authToken;
}

/**
 * Require authentication (redirect if not logged in)
 */
function requireAuth() {
    if (!isLoggedIn()) {
        UIUtils.showToast('Silakan login terlebih dahulu', 'warning');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

/**
 * Setup login form handling
 */
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('rememberMe');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    
    if (!loginForm) return;
    
    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Get form values
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberCheckbox.checked;
        
        // Validate form
        let hasErrors = false;
        
        if (!username) {
            showFieldError(usernameInput, 'Username wajib diisi');
            hasErrors = true;
        }
        
        if (!password) {
            showFieldError(passwordInput, 'Password wajib diisi');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        // Set button loading state
        UIUtils.setButtonLoading(submitButton, true);
        
        try {
            const result = await login(username, password, rememberMe);
            
            if (result.success) {
                // TAMBAHKAN: Hide loading secara eksplisit sebelum redirect
                UIUtils.hideLoading();
                
                // Tunggu sebentar untuk memastikan loading hilang
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 100);
            }
        } finally {
            UIUtils.setButtonLoading(submitButton, false);
        }
    });
    
    // Real-time validation
    usernameInput.addEventListener('input', () => {
        UIUtils.clearInputError(usernameInput);
    });
    
    passwordInput.addEventListener('input', () => {
        UIUtils.clearInputError(passwordInput);
    });
    
    // Enter key handling
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    });
}

/**
 * Show field error
 */
function showFieldError(input, message) {
    UIUtils.showInputError(input, message);
}

/**
 * Clear all form errors
 */
function clearFormErrors() {
    const inputs = document.querySelectorAll('#loginForm input');
    inputs.forEach(input => {
        UIUtils.clearInputError(input);
    });
}

/**
 * Setup logout button
 */
function setupLogoutButton() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Confirm logout
            if (confirm('Yakin ingin keluar?')) {
                logout();
                window.location.href = 'index.html';
            }
        });
    }
}

/**
 * Update auth UI elements
 */
function updateAuthUI() {
    const userDisplay = document.getElementById('currentUser');
    const loginTime = document.getElementById('loginTime');
    
    if (userDisplay && currentUser) {
        userDisplay.textContent = currentUser;
    }
    
    if (loginTime) {
        const timestamp = StorageUtils.get(AUTH_CONFIG.TIMESTAMP_KEY);
        if (timestamp) {
            const loginDate = new Date(timestamp);
            loginTime.textContent = DateUtils.formatDate(loginDate.toISOString());
        }
    }
}

/**
 * Setup auth state monitoring for current page
 */
function setupAuthMonitoring() {
    // Monitor auth state changes
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        
        if (key === AUTH_CONFIG.TOKEN_KEY) {
            // Auth state changed
            if (!value && isAuthenticated) {
                // Token was cleared, handle logout
                handleSessionExpired();
            }
        }
    };
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setupAuthMonitoring();
    
    // Setup logout button if it exists
    setupLogoutButton();
    
    // Update auth UI if authenticated
    if (isLoggedIn()) {
        updateAuthUI();
    }
});

// Export functions for global use
window.login = login;
window.logout = logout;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.getAuthToken = getAuthToken;
window.requireAuth = requireAuth;
window.setupLoginForm = setupLoginForm;
window.loadSavedCredentials = loadSavedCredentials;
window.clearSavedCredentials = clearSavedCredentials;
window.updateAuthUI = updateAuthUI;
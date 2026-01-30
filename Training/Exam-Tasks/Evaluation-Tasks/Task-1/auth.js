/**
 * Authentication Manager with JWT Token System
 * Handles registration, login, logout, token validation, and auto-logout
 */

// ============================================================================
// SIMPLE CRYPTO (for demo password hashing)
// ============================================================================

class SimpleCrypto {
    /**
     * Simple hash function for password storage (demo only)
     * In production, use bcrypt or similar on the server
     */
    static hash(password) {
        let hash = 0;
        const str = password + 'account_mapping_salt';
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(36);
    }

    /**
     * Verify password against hash
     */
    static verify(password, hash) {
        return this.hash(password) === hash;
    }
}

// ============================================================================
// JWT UTILITY CLASS
// ============================================================================

class JWTManager {
    constructor() {
        this.storageKey = 'account_mapping::auth_token';
        this.userKey = 'account_mapping::auth_user';
    }

    /**
     * Generate a simple JWT-like token
     */
    generateToken(payload) {
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        const now = Date.now();
        const tokenPayload = {
            ...payload,
            iat: Math.floor(now / 1000),
            exp: Math.floor(now / 1000) + (24 * 60 * 60) // 24 hours
        };

        const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
        const signatureData = `${encodedHeader}.${encodedPayload}`;
        const signature = this.base64UrlEncode(this.createSignature(signatureData));

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    /**
     * Decode and validate JWT token
     */
    decodeToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            const payload = JSON.parse(this.base64UrlDecode(parts[1]));

            if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                return null;
            }

            return payload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Validate token and return payload if valid
     */
    validateToken(token) {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = this.decodeToken(token);
        if (!payload || !payload.username || !payload.iat) return null;

        return payload;
    }

    base64UrlEncode(str) {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    base64UrlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        return atob(str);
    }

    createSignature(data) {
        const hash = this.simpleHash(data + 'account_mapping_secret_key');
        return hash;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36) + str.length.toString(36);
    }
}

// ============================================================================
// USER MANAGER - Stores registered users
// ============================================================================

class UserManager {
    constructor() {
        this.usersKey = 'account_mapping::users';
        this.currentSessionKey = 'account_mapping::current_session';
    }

    /**
     * Get all registered users
     */
    getUsers() {
        try {
            const data = localStorage.getItem(this.usersKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    }

    /**
     * Save users to localStorage
     */
    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    /**
     * Check if username exists
     */
    usernameExists(username) {
        const users = this.getUsers();
        return users.hasOwnProperty(username.toLowerCase());
    }

    /**
     * Check if email exists
     */
    emailExists(email) {
        const users = this.getUsers();
        return Object.values(users).some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    /**
     * Register a new user
     */
    register(username, email, password) {
        const users = this.getUsers();
        const usernameLower = username.toLowerCase();

        if (users[usernameLower]) {
            return { success: false, message: 'Username already exists' };
        }

        // Check email
        if (this.emailExists(email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create user
        const user = {
            username: username,
            email: email,
            passwordHash: SimpleCrypto.hash(password),
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        users[usernameLower] = user;
        this.saveUsers(users);

        return { success: true, user: this.sanitizeUser(user) };
    }

    /**
     * Authenticate user with username and password
     */
    authenticate(username, password) {
        const users = this.getUsers();
        const usernameLower = username.toLowerCase();

        if (!users[usernameLower]) {
            return { success: false, message: 'Invalid username or password' };
        }

        const user = users[usernameLower];

        if (!SimpleCrypto.verify(password, user.passwordHash)) {
            return { success: false, message: 'Invalid username or password' };
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);

        return { success: true, user: this.sanitizeUser(user) };
    }

    /**
     * Remove sensitive data from user object
     */
    sanitizeUser(user) {
        return {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        };
    }

    /**
     * Check if any users are registered
     */
    hasUsers() {
        const users = this.getUsers();
        return Object.keys(users).length > 0;
    }
}

// ============================================================================
// AUTHENTICATION MANAGER
// ============================================================================

class AuthManager {
    constructor() {
        this.jwt = new JWTManager();
        this.userManager = new UserManager();
        this.isAuthenticated = this.checkAuth();
        this.currentUser = this.getCurrentUser();
        this.storageEventBound = false;

        this.setupStorageListener();
    }

    /**
     * Register a new user
     */
    register(username, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validate username
                if (!username || username.length < 3 || username.length > 20) {
                    reject({ success: false, message: 'Username must be 3-20 characters' });
                    return;
                }

                if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                    reject({ success: false, message: 'Username can only contain letters, numbers, and underscores' });
                    return;
                }

                // Validate email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                    reject({ success: false, message: 'Please enter a valid email address' });
                    return;
                }

                // Validate password
                if (!password || password.length < 6) {
                    reject({ success: false, message: 'Password must be at least 6 characters' });
                    return;
                }

                // Check if user exists
                if (this.userManager.usernameExists(username)) {
                    reject({ success: false, message: 'Username already exists' });
                    return;
                }

                if (this.userManager.emailExists(email)) {
                    reject({ success: false, message: 'Email already registered' });
                    return;
                }

                // Register user
                const result = this.userManager.register(username, email, password);

                if (result.success) {
                    resolve({
                        success: true,
                        user: result.user,
                        message: 'Account created successfully!'
                    });
                } else {
                    reject(result);
                }
            }, 800);
        });
    }

    /**
     * Login user with username and password
     */
    login(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!username || !password) {
                    reject({ success: false, message: 'Please enter both username and password' });
                    return;
                }

                // Authenticate
                const result = this.userManager.authenticate(username, password);

                if (result.success) {
                    // Generate JWT token (store username only, not email)
                    const tokenPayload = {
                        username: result.user.username,
                        role: 'user',
                        sessionId: this.generateSessionId()
                    };

                    const token = this.jwt.generateToken(tokenPayload);

                    // Store token and user data
                    localStorage.setItem(this.jwt.storageKey, token);
                    localStorage.setItem(this.jwt.userKey, JSON.stringify({
                        username: result.user.username, // Store only username
                        loginTime: new Date().toISOString()
                    }));

                    // Update auth state
                    this.isAuthenticated = true;
                    this.currentUser = { username: result.user.username };

                    resolve({
                        success: true,
                        user: { username: result.user.username },
                        token: token
                    });
                } else {
                    reject(result);
                }
            }, 800);
        });
    }

    /**
     * Logout user and clear credentials
     */
    logout() {
        localStorage.removeItem(this.jwt.storageKey);
        localStorage.removeItem(this.jwt.userKey);

        this.isAuthenticated = false;
        this.currentUser = null;

        this.redirectToLogin();
    }

    /**
     * Check if user is authenticated
     */
    checkAuth() {
        const token = localStorage.getItem(this.jwt.storageKey);
        if (!token) return false;

        const payload = this.jwt.validateToken(token);
        if (!payload) {
            localStorage.removeItem(this.jwt.storageKey);
            localStorage.removeItem(this.jwt.userKey);
            return false;
        }

        return true;
    }

    /**
     * Get current user from storage
     */
    getCurrentUser() {
        if (!this.isAuthenticated) return null;

        const userData = localStorage.getItem(this.jwt.userKey);
        if (!userData) return null;

        try {
            return JSON.parse(userData);
        } catch (error) {
            return null;
        }
    }

    /**
     * Get username for display (only username, not email)
     */
    getDisplayUsername() {
        const user = this.getCurrentUser();
        return user ? user.username : 'User';
    }

    /**
     * Setup storage event listener for cross-tab sync and auto-logout
     */
    setupStorageListener() {
        if (this.storageEventBound) return;

        window.addEventListener('storage', (event) => {
            if (event.key === this.jwt.storageKey) {
                const oldValue = event.oldValue;
                const newValue = event.newValue;

                if (!newValue || newValue !== oldValue) {
                    this.handleTokenManipulation();
                }
            }

            if (event.key === this.jwt.userKey) {
                if (!event.newValue) {
                    this.handleTokenManipulation();
                }
            }
        });

        this.startTokenValidation();
        this.storageEventBound = true;
    }

    /**
     * Handle token manipulation detection
     */
    handleTokenManipulation() {
        const token = localStorage.getItem(this.jwt.storageKey);
        const isValid = this.jwt.validateToken(token);

        if (!token || !isValid) {
            this.isAuthenticated = false;
            this.currentUser = null;
            this.redirectToLogin();
        }
    }

    /**
     * Periodically validate token integrity
     */
    startTokenValidation() {
        setInterval(() => {
            if (this.isAuthenticated) {
                const token = localStorage.getItem(this.jwt.storageKey);
                const isValid = this.jwt.validateToken(token);

                if (!token || !isValid) {
                    this.handleTokenManipulation();
                }
            }
        }, 2000);
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    }

    /**
     * Redirect to main app page
     */
    redirectToApp() {
        if (window.location.pathname.endsWith('login.html')) {
            window.location.href = 'index.html';
        }
    }

    /**
     * Generate a unique session ID
     */
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// ============================================================================
// GLOBAL AUTH INSTANCE
// ============================================================================

const auth = new AuthManager();

// ============================================================================
// LOGIN PAGE FUNCTIONALITY
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('login.html')) {
        if (auth.isAuthenticated) {
            auth.redirectToApp();
            return;
        }

        initializeAuthPage();
    }
});

/**
 * Initialize authentication page with tabs and forms
 */
function initializeAuthPage() {
    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const formContents = document.querySelectorAll('.auth-form-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            // Update tab active state
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update form content visibility
            formContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab + 'Form') {
                    content.classList.add('active');
                }
            });
        });
    });

    // Initialize login form
    initializeLoginForm();

    // Initialize registration form
    initializeRegisterForm();

    // Check if there are any registered users and switch to sign in tab
    const userManager = new UserManager();
    if (userManager.hasUsers()) {
        // Show sign in tab by default (already default, so no action needed)
    }
}

/**
 * Initialize login form functionality
 */
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const togglePasswordBtn = document.querySelector('.toggle-login-password');

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        });
    }

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            const submitBtn = loginForm.querySelector('.btn-auth');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            btnText.classList.add('d-none');
            btnLoader.classList.remove('d-none');
            submitBtn.disabled = true;

            try {
                const result = await auth.login(username, password);

                if (result.success) {
                    showToast('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        auth.redirectToApp();
                    }, 1000);
                }
            } catch (error) {
                showToast(error.message || 'Login failed. Please try again.', 'error');

                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);

                btnText.classList.remove('d-none');
                btnLoader.classList.add('d-none');
                submitBtn.disabled = false;

                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }
}

/**
 * Initialize registration form functionality
 */
function initializeRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('regUsername');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const confirmPasswordInput = document.getElementById('regConfirmPassword');
    const togglePasswordBtn = document.querySelector('.toggle-reg-password');

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        });
    }

    // Password strength checker
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // Handle form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validation
            if (password !== confirmPassword) {
                showToast('Passwords do not match!', 'error');
                confirmPasswordInput.value = '';
                confirmPasswordInput.focus();
                return;
            }

            const submitBtn = registerForm.querySelector('.btn-auth');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            btnText.classList.add('d-none');
            btnLoader.classList.remove('d-none');
            submitBtn.disabled = true;

            try {
                const result = await auth.register(username, email, password);

                if (result.success) {
                    showToast('Account created! You can now sign in.', 'success');

                    // Switch to sign in tab after successful registration
                    setTimeout(() => {
                        const signinTab = document.querySelector('.auth-tab[data-tab="signin"]');
                        if (signinTab) signinTab.click();

                        // Pre-fill username
                        document.getElementById('loginUsername').value = username;
                        document.getElementById('loginPassword').focus();

                        // Reset form
                        registerForm.reset();
                        resetPasswordStrength();

                        // Reset button
                        btnText.classList.remove('d-none');
                        btnLoader.classList.add('d-none');
                        submitBtn.disabled = false;
                    }, 1500);
                }
            } catch (error) {
                showToast(error.message || 'Registration failed. Please try again.', 'error');

                registerForm.classList.add('shake');
                setTimeout(() => {
                    registerForm.classList.remove('shake');
                }, 500);

                btnText.classList.remove('d-none');
                btnLoader.classList.add('d-none');
                submitBtn.disabled = false;
            }
        });
    }
}

/**
 * Update password strength indicator
 */
function updatePasswordStrength(password) {
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    // Reset
    strengthBars.forEach(bar => {
        bar.className = 'strength-bar';
    });

    if (!password) {
        strengthText.textContent = 'Enter a password';
        strengthText.className = 'strength-text';
        return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;

    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength++;

    // Update bars
    for (let i = 0; i < strength && i < 4; i++) {
        strengthBars[i].classList.add('active-' + (i + 1));
    }

    // Update text
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const classes = ['weak', 'fair', 'good', 'strong'];

    strengthText.textContent = labels[strength - 1] || 'Weak';
    strengthText.className = 'strength-text ' + (classes[strength - 1] || 'weak');
}

/**
 * Reset password strength indicator
 */
function resetPasswordStrength() {
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    strengthBars.forEach(bar => {
        bar.className = 'strength-bar';
    });

    strengthText.textContent = 'Enter a password';
    strengthText.className = 'strength-text';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('loginToast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.className = 'toast align-items-center text-white border-0';
    if (type === 'success') {
        toast.classList.add('bg-success');
    } else if (type === 'error') {
        toast.classList.add('bg-danger');
    } else {
        toast.classList.add('bg-info');
    }

    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
}

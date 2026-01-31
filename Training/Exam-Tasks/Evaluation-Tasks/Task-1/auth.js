/**
 * JWT Authentication System
 *
 * - User registration details are stored in localStorage
 * - JWT token is generated fresh on every sign-in
 * - JWT token is stored in localStorage for session management
 */

// ============================================================================
// JWT CLASS
// ============================================================================
class JWT {
    constructor() {
        this.secret = 'account_secret_2024';
    }

    /**
     * Generate a new JWT token
     * Tokens expire after 30 days
     */
    generate(payload) {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const data = {
            ...payload,
            exp: Date.now() + 30 * 24 * 60 * 60 * 1000,  // 30 days expiration
            iat: Date.now()  // Issued at time
        };
        const payloadEnc = btoa(JSON.stringify(data));
        const signature = btoa(this.secret + header + payloadEnc);
        return header + '.' + payloadEnc + '.' + signature;
    }

    /**
     * Verify JWT token and return payload
     * Returns null if token is invalid or expired
     */
    verify(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            const data = JSON.parse(atob(parts[1]));
            // Check expiration
            if (data.exp && data.exp < Date.now()) return null;
            return data;
        } catch { return null; }
    }
}

// ============================================================================
// DEFAULT DEMO USERS
// ============================================================================
const defaultUsers = [
    { id: 'u_001', username: 'admin', email: 'admin@example.com', passwordHash: 'h_k716945' }, // password: admin123
    { id: 'u_002', username: 'demo', email: 'demo@example.com', passwordHash: 'h_k1001699' },  // password: demo123
];

// ============================================================================
// AUTH OBJECT
// ============================================================================
const auth = {
    jwt: new JWT(),
    isAuthenticated: false,
    currentUser: null,
    tokenKey: 'account_jwt',
    usersKey: 'account_users',

    /**
     * Initialize authentication system
     * - Ensures default users exist in localStorage
     * - Checks for valid session
     */
    init() {
        this.ensureDefaultUsers();
        return this.checkSession();
    },

    /**
     * Ensure default users exist in localStorage
     * Called on initialization to populate localStorage with demo users
     */
    ensureDefaultUsers() {
        const existingUsers = this.getUsers();
        if (existingUsers.length === 0) {
            // No users found, initialize with default users
            localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
            console.log('[AUTH] ✓ Default users initialized in localStorage');
        }
    },

    /**
     * Check session by verifying JWT token from localStorage
     * Returns true if valid token exists, false otherwise
     */
    checkSession() {
        const token = localStorage.getItem(this.tokenKey);
        if (token) {
            const payload = this.jwt.verify(token);
            if (payload) {
                // Token is valid, set user info from token payload
                this.isAuthenticated = true;
                this.currentUser = {
                    id: payload.id,
                    username: payload.username,
                    email: payload.email
                };
                console.log('[AUTH] ✓ Valid JWT token found:', this.currentUser.username);
                return true;
            } else {
                // Token is invalid or expired - remove it
                localStorage.removeItem(this.tokenKey);
                console.log('[AUTH] ✗ Invalid or expired token removed');
            }
        }
        this.isAuthenticated = false;
        this.currentUser = null;
        console.log('[AUTH] ✗ No valid session');
        return false;
    },

    getDisplayUsername() {
        return this.currentUser ? this.currentUser.username : 'User';
    },

    redirectToLogin() {
        window.location.href = 'login.html';
    },

    /**
     * Logout - removes JWT token from localStorage
     * User registration data remains in localStorage
     */
    logout() {
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticated = false;
        this.currentUser = null;
        console.log('[AUTH] ✓ Logged out, token removed');
        window.location.href = 'login.html';
    },

    /**
     * Register - creates new user and stores in localStorage
     * After registration, automatically logs in the user
     */
    register(username, email, password) {
        if (!username || username.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters' };
        }
        if (!email || !email.includes('@')) {
            return { success: false, message: 'Enter valid email' };
        }
        if (!password || password.length < 6) {
            return { success: false, message: 'Password must be 6+ characters' };
        }

        // Get existing users from localStorage
        const users = this.getUsers();

        // Check if username already exists
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'Username already exists' };
        }
        // Check if email already exists
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: 'u_' + Date.now(),
            username: username.trim(),
            email: email.trim().toLowerCase(),
            passwordHash: this.hash(password),
            createdAt: new Date().toISOString()
        };

        // Store user in localStorage
        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        console.log('[AUTH] ✓ New user stored in localStorage:', newUser.username);

        // Generate JWT token and login
        return this.loginUser(newUser);
    },

    /**
     * Login - validates credentials and generates fresh JWT token
     * Users are retrieved from localStorage
     */
    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!user) {
            return { success: false, message: 'USER_NOT_FOUND' };
        }
        if (user.passwordHash !== this.hash(password)) {
            return { success: false, message: 'Wrong password' };
        }

        // Generate fresh JWT token on every login
        return this.loginUser(user);
    },

    /**
     * loginUser - generates fresh JWT token and stores it in localStorage
     * A new token is created every time the user signs in
     */
    loginUser(user) {
        // Generate fresh JWT token with user info in payload
        const token = this.jwt.generate({
            id: user.id,
            username: user.username,
            email: user.email
        });

        // Store JWT token in localStorage
        localStorage.setItem(this.tokenKey, token);

        // Set current session state from token
        this.isAuthenticated = true;
        this.currentUser = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        console.log('[AUTH] ✓ Fresh JWT token generated for:', user.username);
        return { success: true };
    },

    /**
     * Get all users from localStorage
     */
    getUsers() {
        try {
            const usersData = localStorage.getItem(this.usersKey);
            return usersData ? JSON.parse(usersData) : [];
        } catch {
            return [];
        }
    },

    /**
     * Get the current JWT token
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    },

    /**
     * Simple hash function for password verification
     */
    hash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(31, h) + str.charCodeAt(i);
            h = h | 0;
        }
        return 'h_' + Math.abs(h).toString(36);
    },

    getPasswordStrength(password) {
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (password.length >= 10) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score <= 2 ? 1 : score <= 3 ? 2 : score <= 4 ? 3 : 4;
    }
};

// ============================================================================
// AUTO-INIT
// ============================================================================
console.log('[AUTH] Script loaded, initializing...');
auth.init();

// ============================================================================
// LOGIN PAGE HANDLERS
// ============================================================================
$(document).ready(function() {
    if (!window.location.pathname.includes('login.html')) return;

    console.log('[AUTH] Login page detected');

    // Already logged in?
    if (auth.isAuthenticated) {
        console.log('[AUTH] Already logged in, redirecting...');
        window.location.href = 'index.html';
        return;
    }

    // Tab switching
    $('.auth-tab').click(function() {
        const tab = $(this).data('tab');
        $('.auth-tab').removeClass('active');
        $(this).addClass('active');
        $('.auth-form').removeClass('active');
        $('#' + tab + 'Form').addClass('active');
        $('.auth-error').remove();
    });

    // Password toggle
    $('.toggle-password').click(function() {
        const target = $(this).data('target');
        const $input = $('#' + target);
        const $icon = $(this).find('i');

        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $icon.removeClass('bi-eye').addClass('bi-eye-slash');
        } else {
            $input.attr('type', 'password');
            $icon.removeClass('bi-eye-slash').addClass('bi-eye');
        }
    });

    // Password strength
    $('#regPassword').on('input', function() {
        const level = auth.getPasswordStrength($(this).val());
        const bars = $('.strength-bars span');
        const text = $('.strength-text');
        bars.removeClass('active-1 active-2 active-3 active-4');
        text.removeClass('weak fair good strong');
        for (let i = 0; i < level; i++) bars.eq(i).addClass('active-' + level);
        const texts = ['Weak', 'Fair', 'Good', 'Strong'];
        text.text(texts[level - 1] + ' password').addClass(texts[level - 1].toLowerCase());
    });

    // SIGN IN
    $('#signinForm').submit(function(e) {
        e.preventDefault();
        console.log('[LOGIN] Form submitted');

        const username = $('#loginUsername').val().trim();
        const password = $('#loginPassword').val();
        const btn = $(this).find('.btn-submit');

        if (!username || !password) {
            showError('Enter username and password');
            return;
        }

        console.log('[LOGIN] Attempting login for:', username);
        btn.addClass('loading').prop('disabled', true);

        const result = auth.login(username, password);
        console.log('[LOGIN] Result:', result);

        btn.removeClass('loading').prop('disabled', false);

        if (result.success) {
            console.log('[LOGIN] ✓ SUCCESS! Redirecting to index.html');
            alert('✓ Login successful!\n\nRedirecting to main page...');
            window.location.href = 'index.html';
        } else if (result.message === 'USER_NOT_FOUND') {
            console.log('[LOGIN] ✗ User not found');
            showError('Account not found. Please sign up first.');
            setTimeout(() => {
                $('.auth-tab[data-tab="signup"]').click();
                $('#regUsername').val(username);
            }, 1500);
        } else {
            console.log('[LOGIN] ✗ Failed:', result.message);
            showError(result.message);
            shakeForm();
        }
    });

    // SIGN UP
    $('#signupForm').submit(function(e) {
        e.preventDefault();
        console.log('[REGISTER] Form submitted');

        const username = $('#regUsername').val().trim();
        const email = $('#regEmail').val().trim();
        const password = $('#regPassword').val();
        const confirm = $('#regConfirmPassword').val();
        const btn = $(this).find('.btn-submit');

        if (!username || !email || !password || !confirm) {
            showError('Fill all fields');
            return;
        }

        if (password !== confirm) {
            showError('Passwords do not match');
            return;
        }

        console.log('[REGISTER] Creating account:', username);
        btn.addClass('loading').prop('disabled', true);

        const result = auth.register(username, email, password);
        console.log('[REGISTER] Result:', result);

        btn.removeClass('loading').prop('disabled', false);

        if (result.success) {
            console.log('[REGISTER] ✓ SUCCESS! Redirecting to index.html');
            alert('✓ Account created!\n\nRedirecting to main page...');
            window.location.href = 'index.html';
        } else {
            console.log('[REGISTER] ✗ Failed:', result.message);
            showError(result.message);
            shakeForm();
        }
    });
});

// ============================================================================
// HELPERS
// ============================================================================
function showError(msg) {
    $('.auth-error').remove();
    $('<div class="auth-error"><i class="bi bi-exclamation-circle"></i>' + msg + '</div>')
        .prependTo('.auth-form.active').hide().slideDown(200);
}

function shakeForm() {
    const $form = $('.auth-form.active');
    $form.addClass('shake');
    setTimeout(() => $form.removeClass('shake'), 400);
}

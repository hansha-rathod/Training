/**
 * JWT Authentication System - Simplified
 */

// ============================================================================
// JWT CLASS
// ============================================================================
class JWT {
    constructor() {
        this.secret = 'account_secret_2024';
    }

    generate(payload) {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const data = { ...payload, exp: Date.now() + 30 * 24 * 60 * 60 * 1000, iat: Date.now() };
        const payloadEnc = btoa(JSON.stringify(data));
        const sig = btoa(this.secret + header + payloadEnc);
        return header + '.' + payloadEnc + '.' + sig;
    }

    verify(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            const data = JSON.parse(atob(parts[1]));
            if (data.exp && data.exp < Date.now()) return null;
            return data;
        } catch { return null; }
    }
}

// ============================================================================
// AUTH OBJECT
// ============================================================================
const auth = {
    jwt: new JWT(),
    isAuthenticated: false,
    currentUser: null,
    tokenKey: 'account_jwt',
    usersKey: 'account_users',

    init() {
        return this.checkSession();
    },

    checkSession() {
        const token = localStorage.getItem(this.tokenKey);
        if (token) {
            const data = this.jwt.verify(token);
            if (data) {
                this.isAuthenticated = true;
                this.currentUser = { id: data.id, username: data.username, email: data.email };
                console.log('[AUTH] ✓ User logged in:', this.currentUser.username);
                return true;
            }
        }
        this.isAuthenticated = false;
        this.currentUser = null;
        console.log('[AUTH] ✗ No session');
        return false;
    },

    getDisplayUsername() {
        return this.currentUser ? this.currentUser.username : 'User';
    },

    redirectToLogin() {
        window.location.href = 'login.html';
    },

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticated = false;
        this.currentUser = null;
        window.location.href = 'login.html';
    },

    register(username, email, password) {
        if (!username || username.length < 3) return { success: false, message: 'Username must be at least 3 characters' };
        if (!email || !email.includes('@')) return { success: false, message: 'Enter valid email' };
        if (!password || password.length < 6) return { success: false, message: 'Password must be 6+ characters' };

        const users = this.getUsers();
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'Username exists' };
        }
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'Email exists' };
        }

        const user = {
            id: 'u_' + Date.now(),
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: this.hash(password)
        };

        users.push(user);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        this.loginUser(user);
        return { success: true };
    },

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!user) return { success: false, message: 'USER_NOT_FOUND' };
        if (user.password !== this.hash(password)) return { success: false, message: 'Wrong password' };

        this.loginUser(user);
        return { success: true };
    },

    loginUser(user) {
        const token = this.jwt.generate({ id: user.id, username: user.username, email: user.email });
        localStorage.setItem(this.tokenKey, token);
        this.isAuthenticated = true;
        this.currentUser = { id: user.id, username: user.username, email: user.email };
        console.log('[AUTH] ✓ Token stored, user logged in:', user.username);
    },

    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
        } catch { return []; }
    },

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

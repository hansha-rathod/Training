/* ===============================
   COOKIE HELPERS
================================ */
function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const key = name + "=";
    const cookies = document.cookie.split(';');

    for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(key) === 0) {
            return c.substring(key.length);
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

/* ===============================
   DOCUMENT READY
================================ */
$(document).ready(function () {
    loadSettings();

    // Currency change
    $('input[name="currency"]').on('change', function () {
        const currency = $(this).val();
        localStorage.setItem('currency', currency);
        setCookie('currency', currency);
    });

    // Theme change
    $('input[name="theme"]').on('change', function () {
        const theme = $(this).val();
        localStorage.setItem('theme', theme);
        setCookie('theme', theme);
        applyTheme();
    });
});

/* ===============================
   LOAD SETTINGS
================================ */
function loadSettings() {
    const currency =
        getCookie('currency') ||
        localStorage.getItem('currency') ||
        '₹';

    const theme =
        getCookie('theme') ||
        localStorage.getItem('theme') ||
        'light';

    // Update UI
    $(`input[name="currency"][value="${currency}"]`).prop('checked', true);
    $(`input[name="theme"][value="${theme}"]`).prop('checked', true);

    // Sync storage
    localStorage.setItem('currency', currency);
    localStorage.setItem('theme', theme);
    setCookie('currency', currency);
    setCookie('theme', theme);

    applyTheme();
}

/* ===============================
   CLEAR PREFERENCES
================================ */
function clearPreferences() {
    Swal.fire({
        title: 'Clear Preferences?',
        text: 'This will reset all settings to default values.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
        if (result.isConfirmed) {

            // Reset storage
            localStorage.setItem('currency', '₹');
            localStorage.setItem('theme', 'light');

            setCookie('currency', '₹');
            setCookie('theme', 'light');

            // Update UI
            $('input[name="currency"][value="₹"]').prop('checked', true);
            $('input[name="theme"][value="light"]').prop('checked', true);

            applyTheme();

            Swal.fire({
                icon: 'success',
                title: 'Cleared!',
                text: 'Preferences reset to default.',
                confirmButtonColor: '#27ae60'
            });
        }
    });
}

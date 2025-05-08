document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const usernameInput = document.getElementById('username');
    const themeSelect = document.getElementById('theme');
    const fontSizeSelect = document.getElementById('fontSize');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const cookieDisplay = document.getElementById('cookieDisplay');

    // Load saved preferences
    loadPreferences();

    // Save button click handler
    saveBtn.addEventListener('click', savePreferences);

    // Clear button click handler
    clearBtn.addEventListener('click', clearCookies);

    // Theme change handler
    themeSelect.addEventListener('change', applyTheme);

    // Font size change handler
    fontSizeSelect.addEventListener('change', applyFontSize);

    // Function to set a cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
        updateCookieDisplay();
    }

    // Function to get a cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Function to delete a cookie
    function deleteCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        updateCookieDisplay();
    }

    // Function to save preferences
    function savePreferences() {
        const username = usernameInput.value;
        const theme = themeSelect.value;
        const fontSize = fontSizeSelect.value;

        setCookie('username', username, 30);
        setCookie('theme', theme, 30);
        setCookie('fontSize', fontSize, 30);

        applyTheme();
        applyFontSize();
    }

    // Function to load preferences
    function loadPreferences() {
        const username = getCookie('username');
        const theme = getCookie('theme');
        const fontSize = getCookie('fontSize');

        if (username) usernameInput.value = username;
        if (theme) themeSelect.value = theme;
        if (fontSize) fontSizeSelect.value = fontSize;

        applyTheme();
        applyFontSize();
        updateCookieDisplay();
    }

    // Function to apply theme
    function applyTheme() {
        const theme = themeSelect.value;
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }

    // Function to apply font size
    function applyFontSize() {
        const fontSize = fontSizeSelect.value;
        document.body.classList.remove('small-font', 'medium-font', 'large-font');
        document.body.classList.add(fontSize + '-font');
    }

    // Function to clear all cookies
    function clearCookies() {
        deleteCookie('username');
        deleteCookie('theme');
        deleteCookie('fontSize');
        
        usernameInput.value = '';
        themeSelect.value = 'light';
        fontSizeSelect.value = 'medium';
        
        document.body.classList.remove('dark-theme');
        document.body.classList.remove('small-font', 'medium-font', 'large-font');
        document.body.classList.add('medium-font');
        
        updateCookieDisplay();
    }

    // Function to update cookie display
    function updateCookieDisplay() {
        const cookies = document.cookie.split(';');
        let displayText = '';
        
        if (cookies[0] === '') {
            displayText = 'No cookies set';
        } else {
            cookies.forEach(cookie => {
                const [name, value] = cookie.trim().split('=');
                displayText += `${name}: ${value}\n`;
            });
        }
        
        cookieDisplay.textContent = displayText;
    }
}); 
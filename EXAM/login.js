// Google Sign-In callback function
function handleGoogleSignIn(response) {
    // This function will be called when a user successfully signs in with Google
    console.log("Google Sign-In successful:", response);
    
    // In a real application, you would send this credential to your server
    // to verify and create a session for the user
    
    const credential = response.credential;
    const decodedToken = parseJwt(credential);
    
    if (decodedToken) {
        // Extract user information
        const { name, email, picture } = decodedToken;
        
        // Show success message
        alert(`Google Sign-In successful!\nWelcome, ${name} (${email})`);
        
        // In a real app, you would redirect to a dashboard or home page
        // window.location.href = 'dashboard.html';
    }
}

// Function to parse JWT token
function parseJwt(token) {
    try {
        // Get the payload part of the JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error parsing JWT:", e);
        return null;
    }
}

// This function will be used when real Apple Sign-In is configured
// For now, we're using the fallback buttons
function initializeAppleSignIn() {
    // In demo mode, we don't need to do anything here
    console.log("Using Apple Sign-In fallback for demo");
}

// Handle Apple Sign-In response
document.addEventListener('AppleIDSignInOnSuccess', (event) => {
    // Handle successful authorization
    console.log("Apple Sign-In successful:", event.detail);
    
    // In a real application, you would send this data to your server
    // to verify and create a session for the user
    
    const { authorization } = event.detail;
    const { email, name } = authorization.user || {};
    
    // Show success message
    alert(`Apple Sign-In successful!\nWelcome, ${name?.firstName || ''} ${name?.lastName || ''} (${email || 'Email not provided'})`);
    
    // In a real app, you would redirect to a dashboard or home page
    // window.location.href = 'dashboard.html';
});

document.addEventListener('AppleIDSignInOnFailure', (event) => {
    // Handle authorization failures
    console.error("Apple Sign-In failed:", event.detail.error);
    alert("Apple Sign-In failed. Please try again or use another sign-in method.");
});

// This function will be used when real Google Sign-In is configured
// For now, we're using the fallback buttons
function checkGoogleSignInConfig() {
    // In demo mode, we always return false to use the fallback buttons
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const googleLoginFallbackBtn = document.getElementById('google-login-fallback');
    const appleLoginFallbackBtn = document.getElementById('apple-login-fallback');
    
    // Initialize Apple Sign-In
    initializeAppleSignIn();
    
    // Check Google Sign-In configuration
    checkGoogleSignInConfig();
    
    // Set initial focus on email input
    if (emailInput) {
        emailInput.focus();
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset error messages
            emailError.textContent = '';
            passwordError.textContent = '';
            
            // Get input values
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Validate email
            if (!email) {
                emailError.textContent = 'Email is required';
                emailInput.focus();
                return;
            }
            
            if (!isValidEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailInput.focus();
                return;
            }
            
            // Validate password
            if (!password) {
                passwordError.textContent = 'Password is required';
                passwordInput.focus();
                return;
            }
            
            if (password.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';
                passwordInput.focus();
                return;
            }
            
            // Simulate API call with a timeout
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitButton.disabled = true;
            
            setTimeout(function() {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // For demo purposes, we'll just show an alert
                alert('Login successful! Welcome back, ' + email);
                
                // In a real app, you would redirect to a dashboard or home page
                // window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
    
    // Clear error messages on input
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            emailError.textContent = '';
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            passwordError.textContent = '';
        });
    }
    
    // Google login fallback button (for development/testing)
    if (googleLoginFallbackBtn) {
        googleLoginFallbackBtn.addEventListener('click', function() {
            // Simulate Google Sign-In
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            
            setTimeout(() => {
                this.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google"><span>Continue with Google (Fallback)</span>';
                
                // Create a mock Google response
                const mockResponse = {
                    credential: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInBpY3R1cmUiOiJodHRwczovL2V4YW1wbGUuY29tL3Byb2ZpbGUuanBnIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
                };
                
                // Call the Google Sign-In handler
                handleGoogleSignIn(mockResponse);
            }, 1500);
        });
    }
    
    // Apple login fallback button (for development/testing)
    if (appleLoginFallbackBtn) {
        appleLoginFallbackBtn.addEventListener('click', function() {
            // Simulate Apple Sign-In
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fab fa-apple"></i><span>Continue with Apple (Fallback)</span>';
                
                // Create a mock Apple response event
                const mockEvent = new CustomEvent('AppleIDSignInOnSuccess', {
                    detail: {
                        authorization: {
                            code: 'mock_auth_code',
                            id_token: 'mock_id_token',
                            state: 'origin:web',
                            user: {
                                email: 'jane.doe@example.com',
                                name: {
                                    firstName: 'Jane',
                                    lastName: 'Doe'
                                }
                            }
                        }
                    }
                });
                
                // Dispatch the mock event
                document.dispatchEvent(mockEvent);
            }, 1500);
        });
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement !== loginForm.querySelector('button[type="submit"]')) {
            if (document.activeElement === emailInput || document.activeElement === passwordInput) {
                e.preventDefault();
                loginForm.querySelector('button[type="submit"]').click();
            }
        }
    });
});
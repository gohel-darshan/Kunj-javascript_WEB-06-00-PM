document.addEventListener('DOMContentLoaded', function() {
    // Get all steps
    const steps = document.querySelectorAll('.step');
    const emailForm = document.getElementById('email-form');
    const verificationForm = document.getElementById('verification-form');
    const newPasswordForm = document.getElementById('new-password-form');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const verificationError = document.getElementById('verification-error');
    const passwordError = document.getElementById('password-error');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const otpInputs = document.querySelectorAll('.otp-input');
    const resendCodeBtn = document.getElementById('resend-code');
    const countdownElement = document.getElementById('countdown');
    const timerElement = document.getElementById('timer');
    const goToLoginBtn = document.getElementById('go-to-login');
    
    // Set initial focus on email input
    if (emailInput) {
        emailInput.focus();
    }
    
    // Navigation functions
    function showStep(stepNumber) {
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Set focus on the first input of the current step
        if (stepNumber === 1 && emailInput) {
            emailInput.focus();
        } else if (stepNumber === 2 && otpInputs.length > 0) {
            otpInputs[0].focus();
        } else if (stepNumber === 3 && newPasswordInput) {
            newPasswordInput.focus();
        }
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Password strength checker
    function checkPasswordStrength(password) {
        const strengthSegments = document.querySelectorAll('.strength-segment');
        const strengthText = document.querySelector('.strength-text');
        
        // Reset all segments
        strengthSegments.forEach(segment => {
            segment.className = 'strength-segment';
        });
        
        if (!password) {
            strengthText.textContent = 'Password strength';
            return 0;
        }
        
        let strength = 0;
        
        // Check length
        if (password.length >= 8) strength++;
        
        // Check for mixed case
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        
        // Check for numbers
        if (password.match(/\d/)) strength++;
        
        // Check for special characters
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        
        // Update UI based on strength
        if (strength === 1) {
            strengthSegments[0].classList.add('weak');
            strengthText.textContent = 'Weak';
        } else if (strength === 2) {
            strengthSegments[0].classList.add('weak');
            strengthSegments[1].classList.add('medium');
            strengthText.textContent = 'Fair';
        } else if (strength === 3) {
            strengthSegments[0].classList.add('medium');
            strengthSegments[1].classList.add('medium');
            strengthSegments[2].classList.add('medium');
            strengthText.textContent = 'Good';
        } else if (strength === 4) {
            strengthSegments.forEach(segment => segment.classList.add('strong'));
            strengthText.textContent = 'Strong';
        }
        
        return strength;
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
    
    // OTP input handling
    otpInputs.forEach((input, index) => {
        // Auto-focus next input
        input.addEventListener('input', function(e) {
            // Ensure only one character is entered
            if (this.value.length > 1) {
                this.value = this.value.charAt(0);
            }
            
            // Move to next input if value is entered
            if (this.value.length === 1) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                } else {
                    // If it's the last input, check if all inputs are filled
                    let allFilled = true;
                    otpInputs.forEach(input => {
                        if (!input.value) {
                            allFilled = false;
                        }
                    });
                    
                    // If all inputs are filled, submit the form automatically
                    if (allFilled && verificationForm) {
                        verificationForm.querySelector('button').click();
                    }
                }
            }
        });
        
        // Handle backspace and left/right arrow keys
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                if (!this.value && index > 0) {
                    otpInputs[index - 1].focus();
                    otpInputs[index - 1].value = '';
                    e.preventDefault();
                }
            } else if (e.key === 'ArrowLeft' && index > 0) {
                otpInputs[index - 1].focus();
                e.preventDefault();
            } else if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
                e.preventDefault();
            }
        });
        
        // Handle paste event for OTP
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text');
            
            if (pasteData) {
                // Filter only numbers
                const numbers = pasteData.replace(/[^0-9]/g, '');
                
                // Fill the OTP inputs
                for (let i = 0; i < Math.min(numbers.length, otpInputs.length); i++) {
                    otpInputs[i].value = numbers[i];
                }
                
                // Focus on the next empty input or the last one
                let focusIndex = Math.min(numbers.length, otpInputs.length - 1);
                otpInputs[focusIndex].focus();
                
                // If all inputs are filled, submit the form
                if (numbers.length >= otpInputs.length && verificationForm) {
                    verificationForm.querySelector('button').click();
                }
            }
        });
        
        // Only allow numbers
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });
    
    // Countdown timer for resend code
    let countdownInterval;
    function startCountdown(seconds) {
        clearInterval(countdownInterval);
        
        resendCodeBtn.style.display = 'none';
        countdownElement.classList.remove('hidden');
        timerElement.textContent = seconds;
        
        countdownInterval = setInterval(() => {
            seconds--;
            timerElement.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                resendCodeBtn.style.display = 'inline';
                countdownElement.classList.add('hidden');
            }
        }, 1000);
    }
    
    // Email form submission
    if (emailForm) {
        emailForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset error message
            emailError.textContent = '';
            
            // Get email value
            const email = emailInput.value.trim();
            
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
            
            // Simulate API call with a timeout
            const submitButton = this.querySelector('button');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            setTimeout(function() {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Move to verification step
                showStep(2);
                
                // Start countdown for resend code
                startCountdown(60);
                
                // Focus on first OTP input
                if (otpInputs.length > 0) {
                    otpInputs[0].focus();
                }
            }, 1500);
        });
    }
    
    // Verification form submission
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset error message
            verificationError.textContent = '';
            
            // Get OTP value
            let otp = '';
            let isComplete = true;
            
            otpInputs.forEach(input => {
                if (!input.value) {
                    isComplete = false;
                }
                otp += input.value;
            });
            
            if (!isComplete) {
                verificationError.textContent = 'Please enter the complete verification code';
                otpInputs[0].focus();
                return;
            }
            
            // For demo, we'll accept any 6-digit code
            if (otp.length !== 6) {
                verificationError.textContent = 'Please enter a valid 6-digit code';
                otpInputs[0].focus();
                return;
            }
            
            // Simulate API call with a timeout
            const submitButton = this.querySelector('button');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            submitButton.disabled = true;
            
            setTimeout(function() {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Move to new password step
                showStep(3);
            }, 1500);
        });
    }
    
    // New password form submission
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset error message
            passwordError.textContent = '';
            
            // Get password values
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            // Validate passwords
            if (!newPassword) {
                passwordError.textContent = 'Please enter a new password';
                newPasswordInput.focus();
                return;
            }
            
            if (checkPasswordStrength(newPassword) < 3) {
                passwordError.textContent = 'Please create a stronger password (include uppercase, lowercase, numbers, and special characters)';
                newPasswordInput.focus();
                return;
            }
            
            if (newPassword !== confirmPassword) {
                passwordError.textContent = 'Passwords do not match';
                confirmPasswordInput.focus();
                return;
            }
            
            // Simulate API call with a timeout
            const submitButton = this.querySelector('button');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
            submitButton.disabled = true;
            
            setTimeout(function() {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Move to success step
                showStep(4);
            }, 1500);
        });
    }
    
    // Password strength check on input
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
            
            // Clear password error when typing
            passwordError.textContent = '';
        });
    }
    
    // Clear error messages on input
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            emailError.textContent = '';
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            passwordError.textContent = '';
            
            // Check if passwords match while typing
            if (this.value && newPasswordInput.value && this.value !== newPasswordInput.value) {
                passwordError.textContent = 'Passwords do not match';
            }
        });
    }
    
    // Resend code button
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simulate resending code
            const emailDisplay = document.querySelector('#step-2 .form-header p');
            if (emailDisplay && emailInput) {
                emailDisplay.textContent = `We've sent a new code to ${emailInput.value}. Please enter it below.`;
            }
            
            // Reset OTP inputs
            otpInputs.forEach(input => {
                input.value = '';
            });
            
            // Focus on first OTP input
            if (otpInputs.length > 0) {
                otpInputs[0].focus();
            }
            
            // Start countdown
            startCountdown(60);
        });
    }
    
    // Back button functionality
    document.querySelector('.back-button a').addEventListener('click', function(e) {
        // We don't need to prevent default here since we want to navigate to login.html
    });
    
    if (document.getElementById('back-to-email')) {
        document.getElementById('back-to-email').addEventListener('click', function(e) {
            e.preventDefault();
            showStep(1);
        });
    }
    
    if (document.getElementById('back-to-verification')) {
        document.getElementById('back-to-verification').addEventListener('click', function(e) {
            e.preventDefault();
            showStep(2);
        });
    }
    
    // Go to login button
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Enter key to submit forms
        if (e.key === 'Enter') {
            const activeStep = document.querySelector('.step.active');
            if (activeStep) {
                const stepId = activeStep.id;
                if (stepId === 'step-1' && document.activeElement !== emailForm.querySelector('button')) {
                    e.preventDefault();
                    emailForm.querySelector('button').click();
                } else if (stepId === 'step-2' && document.activeElement !== verificationForm.querySelector('button')) {
                    // Only submit if all OTP fields are filled
                    let allFilled = true;
                    otpInputs.forEach(input => {
                        if (!input.value) {
                            allFilled = false;
                        }
                    });
                    
                    if (allFilled) {
                        e.preventDefault();
                        verificationForm.querySelector('button').click();
                    }
                } else if (stepId === 'step-3' && document.activeElement !== newPasswordForm.querySelector('button')) {
                    e.preventDefault();
                    newPasswordForm.querySelector('button').click();
                }
            }
        }
    });
});
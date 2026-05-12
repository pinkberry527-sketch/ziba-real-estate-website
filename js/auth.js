
const Auth = (function() {
    'use strict';

    // Configuration - Using Brand Colors
    const config = {
        minPasswordLength: 8,
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxFileSize: 5 * 1024 * 1024, // 5MB
        colors: {
            primary: '#2D463E',
            accent: '#D97706',
            accentHover: '#B45309',
            error: '#EF4444',
            success: '#10B981',
            warning: '#F59E0B',
            info: '#3B82F6'
        },
        transitions: {
            sm: '0.1s ease-in-out',
            md: '0.2s ease-in-out',
            lg: '0.3s ease-in-out',
            xl: '0.4s ease-in-out',
            bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            spring: '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }
    };

    // State
    let state = {
        selectedRole: null,
        passwordVisible: false,
        files: {
            profile: null,
            document: null
        }
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Milliseconds to wait
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: 'success', 'error', 'warning'
     * @param {number} duration - Duration in milliseconds
     */
    function showToast(message, type = 'success', duration = 3000) {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles using brand colors
        const colors = {
            success: config.colors.success,
            error: config.colors.error,
            info: config.colors.info
        };

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: #ffffff;
            padding: 16px 24px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 16px;
            font-weight: 500;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s ease-in-out;
            backdrop-filter: blur(8px);
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });

        // Remove after duration
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Set button loading state
     * @param {HTMLElement} button - Button element
     * @param {boolean} loading - Loading state
     * @param {string} originalText - Original button text
     */
    function setButtonLoading(button, loading, originalText) {
        if (loading) {
            button.dataset.originalText = originalText || button.innerHTML;
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            if (button.dataset.originalText) {
                button.innerHTML = button.dataset.originalText;
            }
        }
    }

    // ============================================
    // VALIDATION FUNCTIONS
    // ============================================

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     * @param {string} password - Password to check
     * @returns {Object} Strength details
     */
    function checkPasswordStrength(password) {
        let strength = 0;
        const checks = {
            length: password.length >= config.minPasswordLength,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;

        let label = 'Weak';
        let className = 'weak';

        if (strength >= 4) {
            label = 'Strong';
            className = 'strong';
        } else if (strength >= 2) {
            label = 'Medium';
            className = 'medium';
        }

        return { strength, label, className, checks };
    }

    /**
     * Show field error
     * @param {HTMLElement} input - Input element
     * @param {string} message - Error message
     */
    function showFieldError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');

        // Remove existing error message
        const existingError = input.parentElement.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error message with brand colors
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;

        input.parentElement.parentElement.appendChild(errorDiv);
    }

    /**
     * Clear field error
     * @param {HTMLElement} input - Input element
     */
    function clearFieldError(input) {
        input.classList.remove('error');
        const errorDiv = input.parentElement.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Show field success
     * @param {HTMLElement} input - Input element
     */
    function showFieldSuccess(input) {
        input.classList.remove('error');
        input.classList.add('success');
        const errorDiv = input.parentElement.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // ============================================
    // PASSWORD FUNCTIONS
    // ============================================

    /**
     * Toggle password visibility
     * @param {HTMLElement} toggleBtn - Toggle button
     * @param {HTMLElement} passwordInput - Password input
     */
    function togglePasswordVisibility(toggleBtn, passwordInput) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = toggleBtn.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        state.passwordVisible = type === 'text';
    }

    /**
     * Update password strength indicator
     * @param {string} password - Password value
     */
    function updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.password-strength-bar');
        const strengthText = document.querySelector('.password-strength-text');
        const strengthContainer = document.querySelector('.password-strength');

        if (!strengthBar || !strengthText) return;

        if (password.length === 0) {
            strengthContainer.classList.remove('visible');
            return;
        }

        strengthContainer.classList.add('visible');
        const { label, className } = checkPasswordStrength(password);

        strengthBar.className = `password-strength-bar ${className}`;
        strengthText.textContent = `Password strength: ${label}`;
        
        // Use brand colors
        const colors = {
            weak: config.colors.error,
            medium: config.colors.warning,
            strong: config.colors.success
        };
        strengthText.style.color = colors[className];
    }

    // ============================================
    // ROLE SELECTION
    // ============================================

    /**
     * Handle role selection
     * @param {string} role - Selected role: 'user' or 'agent'
     */
    function selectRole(role) {
        state.selectedRole = role;

        // Update UI
        document.querySelectorAll('.role-card').forEach(card => {
            card.classList.remove('active');
        });

        const selectedCard = document.querySelector(`[data-role="${role}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }

        // Show/hide agent fields with animation
        const agentFields = document.querySelector('.agent-fields');
        if (agentFields) {
            if (role === 'agent') {
                agentFields.classList.add('visible');
                document.querySelectorAll('.agent-field').forEach(field => {
                    field.setAttribute('required', 'required');
                });
            } else {
                agentFields.classList.remove('visible');
                document.querySelectorAll('.agent-field').forEach(field => {
                    field.removeAttribute('required');
                });
            }
        }

        localStorage.setItem('selectedRole', role);
    }

    // ============================================
    // FILE UPLOAD
    // ============================================

    /**
     * Handle file upload
     * @param {File} file - Uploaded file
     * @param {string} type - Upload type: 'profile' or 'document'
     * @param {HTMLElement} zone - Upload zone element
     */
    function handleFileUpload(file, type, zone) {
        // Validate file type
        if (type === 'profile' && !config.allowedImageTypes.includes(file.type)) {
            showToast('Please upload a valid image file (JPEG, PNG, WebP)', 'error');
            return;
        }

        // Validate file size
        if (file.size > config.maxFileSize) {
            showToast('File size must be less than 5MB', 'error');
            return;
        }

        state.files[type] = file;

        // Update UI
        zone.classList.add('has-file');
        
        // Remove existing preview
        const existingPreview = zone.querySelector('.file-preview');
        if (existingPreview) {
            existingPreview.remove();
        }

        // Create file preview
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        preview.innerHTML = `
            <i class="fas ${type === 'profile' ? 'fa-image' : 'fa-file-alt'}"></i>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button type="button" class="file-remove" data-type="${type}">
                <i class="fas fa-times"></i>
            </button>
        `;

        zone.appendChild(preview);

        // Add remove handler
        preview.querySelector('.file-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile(type, zone);
        });

        showToast(`${type === 'profile' ? 'Profile image' : 'Document'} uploaded successfully`, 'success');
    }

    /**
     * Remove uploaded file
     * @param {string} type - Upload type
     * @param {HTMLElement} zone - Upload zone element
     */
    function removeFile(type, zone) {
        state.files[type] = null;
        zone.classList.remove('has-file');
        
        const preview = zone.querySelector('.file-preview');
        if (preview) {
            preview.remove();
        }

        const input = zone.querySelector('input[type="file"]');
        if (input) {
            input.value = '';
        }
    }

    // ============================================
    // FORM HANDLERS
    // ============================================

    /**
     * Handle registration form submission
     * @param {Event} e - Submit event
     */
    async function handleRegister(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        const fullName = form.querySelector('#fullName').value.trim();
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;
        const confirmPassword = form.querySelector('#confirmPassword').value;

        let isValid = true;

        if (fullName.length < 2) {
            showFieldError(form.querySelector('#fullName'), 'Please enter your full name');
            isValid = false;
        } else {
            showFieldSuccess(form.querySelector('#fullName'));
        }

        if (!isValidEmail(email)) {
            showFieldError(form.querySelector('#email'), 'Please enter a valid email address');
            isValid = false;
        } else {
            showFieldSuccess(form.querySelector('#email'));
        }

        const passwordCheck = checkPasswordStrength(password);
        if (passwordCheck.strength < 3) {
            showFieldError(form.querySelector('#password'), 'Password is too weak');
            isValid = false;
        } else {
            showFieldSuccess(form.querySelector('#password'));
        }

        if (password !== confirmPassword) {
            showFieldError(form.querySelector('#confirmPassword'), 'Passwords do not match');
            isValid = false;
        } else if (confirmPassword) {
            showFieldSuccess(form.querySelector('#confirmPassword'));
        }

        if (!state.selectedRole) {
            showToast('Please select a role', 'error');
            isValid = false;
        }

        if (state.selectedRole === 'agent') {
            const businessName = form.querySelector('#businessName')?.value.trim();
            const phone = form.querySelector('#phone')?.value.trim();

            if (!businessName) {
                showFieldError(form.querySelector('#businessName'), 'Business name is required');
                isValid = false;
            }

            if (!phone || phone.length < 10) {
                showFieldError(form.querySelector('#phone'), 'Valid phone number is required');
                isValid = false;
            }
        }

        if (!isValid) {
            showToast('Please fix the errors above', 'error');
            return;
        }

        setButtonLoading(submitBtn, true, originalText);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const userData = {
            fullName,
            email,
            role: state.selectedRole,
            businessName: form.querySelector('#businessName')?.value || null,
            phone: form.querySelector('#phone')?.value || null
        };
        localStorage.setItem('pendingUser', JSON.stringify(userData));

        setButtonLoading(submitBtn, false);

        if (state.selectedRole === 'agent') {
            window.location.href = 'verify-agent.html';
        } else {
            showToast('Registration successful! Welcome to Ziba.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

    /**
     * Handle login form submission
     * @param {Event} e - Submit event
     */
    async function handleLogin(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;
        const rememberMe = form.querySelector('#rememberMe')?.checked;

        let isValid = true;

        if (!isValidEmail(email)) {
            showFieldError(form.querySelector('#email'), 'Please enter a valid email');
            isValid = false;
        } else {
            clearFieldError(form.querySelector('#email'));
        }

        if (password.length < 1) {
            showFieldError(form.querySelector('#password'), 'Please enter your password');
            isValid = false;
        } else {
            clearFieldError(form.querySelector('#password'));
        }

        if (!isValid) return;

        setButtonLoading(submitBtn, true, originalText);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');
        if (pendingUser.email === email && pendingUser.role === 'agent') {
            setButtonLoading(submitBtn, false);
            window.location.href = 'pending.html';
            return;
        }

        setButtonLoading(submitBtn, false);
        showToast('Login successful! Redirecting...', 'success');

        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        }

        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }

    /**
     * Handle agent verification form submission
     * @param {Event} e - Submit event
     */
    async function handleAgentVerification(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        const bio = form.querySelector('#bio')?.value.trim();

        if (!state.files.profile) {
            showToast('Please upload a profile photo', 'error');
            return;
        }

        if (!state.files.document) {
            showToast('Please upload your ID document', 'error');
            return;
        }

        if (bio && bio.length < 50) {
            showToast('Please write a longer bio (at least 50 characters)', 'error');
            return;
        }

        setButtonLoading(submitBtn, true, originalText);
        await new Promise(resolve => setTimeout(resolve, 2000));

        setButtonLoading(submitBtn, false);
        showToast('Verification submitted successfully!', 'success');

        setTimeout(() => {
            window.location.href = 'pending.html';
        }, 1500);
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize all event listeners
     */
    function init() {
        // Password toggle buttons
        document.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                togglePasswordVisibility(this, input);
            });
        });

        // Password strength indicator
        const passwordInput = document.querySelector('#password');
        if (passwordInput) {
            passwordInput.addEventListener('input', debounce(function() {
                updatePasswordStrength(this.value);
            }, 200));
        }

        // Role selection
        document.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', function() {
                selectRole(this.dataset.role);
            });
        });

        // Restore saved role
        const savedRole = localStorage.getItem('selectedRole');
        if (savedRole) {
            selectRole(savedRole);
        }

        // File upload zones
        document.querySelectorAll('.upload-zone').forEach(zone => {
            const input = zone.querySelector('input[type="file"]');
            const type = zone.dataset.uploadType;

            if (input) {
                input.addEventListener('change', function() {
                    if (this.files.length > 0) {
                        handleFileUpload(this.files[0], type, zone);
                    }
                });
            }

            // Drag and drop
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('dragover');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('dragover');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('dragover');
                
                if (e.dataTransfer.files.length > 0) {
                    handleFileUpload(e.dataTransfer.files[0], type, zone);
                }
            });

            zone.addEventListener('click', () => {
                input?.click();
            });
        });

        // Form submissions
        const registerForm = document.querySelector('#registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }

        const loginForm = document.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
            
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            if (rememberedEmail) {
                const emailInput = loginForm.querySelector('#email');
                if (emailInput) {
                    emailInput.value = rememberedEmail;
                    loginForm.querySelector('#rememberMe')?.setAttribute('checked', 'checked');
                }
            }
        }

        const verifyForm = document.querySelector('#verifyForm');
        if (verifyForm) {
            verifyForm.addEventListener('submit', handleAgentVerification);
            
            const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');
            const businessInput = verifyForm.querySelector('#businessName');
            if (businessInput && pendingUser.businessName) {
                businessInput.value = pendingUser.businessName;
            }
        }

        // Input validation on blur
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    clearFieldError(this);
                }
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearFieldError(this);
                }
            });
        });

        console.log('🔐 Ziba Auth System Initialized with Brand Colors');
    }

    // Public API
    return {
        init,
        showToast,
        selectRole,
        togglePasswordVisibility
    };
})();

// Initialize when DOM is ready
// document.addEventListener('DOMContentLoaded', Auth.init);
// """

// with open(os.path.join(auth_path, "auth.js"), "w") as f:
//     f.write(auth_js_content)

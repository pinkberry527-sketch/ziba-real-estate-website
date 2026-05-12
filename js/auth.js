/**
 * ZIBA REAL ESTATE - AUTHENTICATION SYSTEM
 * Enhanced JavaScript with Robust Data Persistence
 */

// ============================================
// AUTH MODULE
// ============================================
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
    // STORAGE HELPERS (Robust LocalStorage)
    // ============================================

    /**
     * Safe LocalStorage setter with error handling
     */
    function setStorage(key, value) {
        try {
            if (typeof value === 'object') {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.setItem(key, value);
            }
            console.log(`💾 Saved to localStorage: ${key}`);
            return true;
        } catch (e) {
            console.error(`❌ Failed to save ${key}:`, e);
            showToast('Storage error. Please enable cookies/localStorage.', 'error');
            return false;
        }
    }

    /**
     * Safe LocalStorage getter with error handling
     */
    function getStorage(key, parseJson = false) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return null;
            return parseJson ? JSON.parse(item) : item;
        } catch (e) {
            console.error(`❌ Failed to read ${key}:`, e);
            return null;
        }
    }

    /**
     * Safe LocalStorage remover
     */
    function removeStorage(key) {
        try {
            localStorage.removeItem(key);
            console.log(`🗑️ Removed from localStorage: ${key}`);
            return true;
        } catch (e) {
            console.error(`❌ Failed to remove ${key}:`, e);
            return false;
        }
    }

    /**
     * Check if localStorage is available
     */
    function isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

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
     */
    function showToast(message, type = 'success', duration = 3000) {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        const colors = {
            success: config.colors.success,
            error: config.colors.error,
            warning: config.colors.warning,
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

        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Set button loading state
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

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        const checks = {
            length: password.length >= config.minPasswordLength,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
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

    function showFieldError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');

        const existingError = input.parentElement.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;

        input.parentElement.parentElement.appendChild(errorDiv);
    }

    function clearFieldError(input) {
        input.classList.remove('error');
        const errorDiv = input.parentElement.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

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

    function togglePasswordVisibility(toggleBtn, passwordInput) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = toggleBtn.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        state.passwordVisible = type === 'text';
    }

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

    function selectRole(role) {
        state.selectedRole = role;

        document.querySelectorAll('.role-card').forEach(card => {
            card.classList.remove('active');
            card.setAttribute('aria-pressed', 'false');
        });

        const selectedCard = document.querySelector(`[data-role="${role}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
            selectedCard.setAttribute('aria-pressed', 'true');
        }

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

        setStorage('selectedRole', role);
        console.log(`🎯 Role selected: ${role}`);
    }

    // ============================================
    // FILE UPLOAD
    // ============================================

    function handleFileUpload(file, type, zone) {
        if (type === 'profile' && !config.allowedImageTypes.includes(file.type)) {
            showToast('Please upload a valid image file (JPEG, PNG, WebP)', 'error');
            return;
        }

        if (file.size > config.maxFileSize) {
            showToast('File size must be less than 5MB', 'error');
            return;
        }

        state.files[type] = file;

        zone.classList.add('has-file');
        
        const existingPreview = zone.querySelector('.file-preview');
        if (existingPreview) {
            existingPreview.remove();
        }

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

        preview.querySelector('.file-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile(type, zone);
        });

        showToast(`${type === 'profile' ? 'Profile image' : 'Document'} uploaded successfully`, 'success');
        console.log(`📎 File uploaded: ${file.name} (${type})`);
    }

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
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Save user data to localStorage
        const userData = {
            fullName,
            email,
            role: state.selectedRole,
            businessName: form.querySelector('#businessName')?.value || null,
            phone: form.querySelector('#phone')?.value || null,
            registeredAt: new Date().toISOString()
        };
        
        const saved = setStorage('pendingUser', userData);
        
        if (!saved) {
            setButtonLoading(submitBtn, false);
            showToast('Failed to save data. Please try again.', 'error');
            return;
        }

        setButtonLoading(submitBtn, false);

        if (state.selectedRole === 'agent') {
            showToast('Registration complete! Please verify your account.', 'success');
            setTimeout(() => {
                window.location.href = 'verify-agent.html';
            }, 1500);
        } else {
            showToast('Registration successful! Welcome to Ziba.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

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
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check for pending agent approval
        const pendingUser = getStorage('pendingUser', true);
        
        if (pendingUser && pendingUser.email === email && pendingUser.role === 'agent') {
            setButtonLoading(submitBtn, false);
            showToast('Account pending approval. Redirecting...', 'warning');
            setTimeout(() => {
                window.location.href = 'pending.html';
            }, 1500);
            return;
        }

        setButtonLoading(submitBtn, false);
        showToast('Login successful! Redirecting...', 'success');

        if (rememberMe) {
            setStorage('rememberedEmail', email);
        } else {
            removeStorage('rememberedEmail');
        }

        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }

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
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update user data with verification info
        const pendingUser = getStorage('pendingUser', true);
        if (pendingUser) {
            pendingUser.verifiedAt = new Date().toISOString();
            pendingUser.bio = bio;
            pendingUser.status = 'pending_approval';
            setStorage('pendingUser', pendingUser);
        }

        setButtonLoading(submitBtn, false);
        showToast('Verification submitted successfully!', 'success');

        setTimeout(() => {
            window.location.href = 'pending.html';
        }, 1500);
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        console.log('🔐 Ziba Auth System Initializing...');
        
        // Check storage availability
        if (!isStorageAvailable()) {
            console.warn('⚠️ localStorage not available! Data will not persist.');
            showToast('Warning: Browser storage not available', 'warning');
        } else {
            console.log('✅ localStorage is available');
        }

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
            
            // Keyboard support for accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectRole(this.dataset.role);
                }
            });
        });

        // Restore saved role
        const savedRole = getStorage('selectedRole');
        if (savedRole) {
            selectRole(savedRole);
            console.log(`🔄 Restored role: ${savedRole}`);
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
            console.log('✅ Registration form bound');
        }

        const loginForm = document.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
            
            const rememberedEmail = getStorage('rememberedEmail');
            if (rememberedEmail) {
                const emailInput = loginForm.querySelector('#email');
                if (emailInput) {
                    emailInput.value = rememberedEmail;
                    const rememberCheckbox = loginForm.querySelector('#rememberMe');
                    if (rememberCheckbox) {
                        rememberCheckbox.checked = true;
                    }
                }
            }
            console.log('✅ Login form bound');
        }

        const verifyForm = document.querySelector('#verifyForm');
        if (verifyForm) {
            verifyForm.addEventListener('submit', handleAgentVerification);
            
            const pendingUser = getStorage('pendingUser', true);
            const businessInput = verifyForm.querySelector('#businessName');
            if (businessInput && pendingUser && pendingUser.businessName) {
                businessInput.value = pendingUser.businessName;
                console.log(`📝 Pre-filled business name: ${pendingUser.businessName}`);
            }
            console.log('✅ Verification form bound');
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

        // Log current storage state
        const storedUser = getStorage('pendingUser', true);
        if (storedUser) {
            console.log('📦 Stored user:', storedUser);
        }

        console.log('🔐 Ziba Auth System Ready!');
    }

    // Public API
    return {
        init,
        showToast,
        selectRole,
        togglePasswordVisibility,
        storage: {
            set: setStorage,
            get: getStorage,
            remove: removeStorage,
            isAvailable: isStorageAvailable
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', Auth.init);

//   ZIBA REAL ESTATE - AUTHENTICATION SYSTEM


// ─── SETTINGS ────────────────────────────────────────────────────────────────

const MIN_PASSWORD_LENGTH = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Colors used in toast notifications
const COLORS = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
};

// Icons used in toast notifications
const ICONS = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
};

// ─── APP STATE ────────────────────────────────────────────────────────────────

// Tracks the user's current role choice and any uploaded files
const state = {
    selectedRole: null,
    files: { profile: null, document: null },
};

// ─── LOCAL STORAGE HELPERS ───────────────────────────────────────────────────

// Check if the browser supports localStorage before using it
function isStorageAvailable() {
    try {
        localStorage.setItem('__test__', '1');
        localStorage.removeItem('__test__');
        return true;
    } catch {
        return false;
    }
}

// Save a value. Objects are automatically converted to JSON strings.
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
        return true;
    } catch {
        showToast('Storage error. Please enable cookies/localStorage.', 'error');
        return false;
    }
}

// Read a value back. Pass parseJson=true if you saved an object.
function readFromStorage(key, parseJson = false) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return null;
        return parseJson ? JSON.parse(item) : item;
    } catch {
        return null;
    }
}

// Delete a stored value
function deleteFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

// ─── UI HELPERS ──────────────────────────────────────────────────────────────

// Show a temporary pop-up message at the top-right of the screen
function showToast(message, type = 'success', duration = 3000) {
    // Remove any existing toast first
    document.querySelector('.toast-notification')?.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `<i class="fas ${ICONS[type] || ICONS.info}"></i><span>${message}</span>`;

    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: COLORS[type] || COLORS.info,
        color: '#ffffff',
        padding: '16px 24px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '16px',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        zIndex: '9999',
        transform: 'translateX(400px)',
        opacity: '0',
        transition: 'all 0.3s ease-in-out',
    });

    document.body.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    });

    // Slide out after duration, then remove
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Put the button into a "loading" spinner state, or restore it
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
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

// Wait `delay` ms after the last call before running `fn` (avoids rapid-fire calls)
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ─── FORM FIELD FEEDBACK ─────────────────────────────────────────────────────

// Mark a field red and show an error message below it
function showFieldError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');

    // Remove old error message if present
    input.parentElement.parentElement.querySelector('.field-error')?.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    input.parentElement.parentElement.appendChild(errorDiv);
}

// Remove any error styling and message from a field
function clearFieldError(input) {
    input.classList.remove('error');
    input.parentElement.parentElement.querySelector('.field-error')?.remove();
}

// Mark a field green (valid)
function showFieldSuccess(input) {
    input.classList.remove('error');
    input.classList.add('success');
    input.parentElement.parentElement.querySelector('.field-error')?.remove();
}

// ─── PASSWORD ─────────────────────────────────────────────────────────────────

// Toggle between showing and hiding password text
function togglePasswordVisibility(toggleBtn, passwordInput) {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    toggleBtn.querySelector('i').className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
}

// Score a password and return { label, className } for the strength bar
function getPasswordStrength(password) {
    const checks = [
        password.length >= MIN_PASSWORD_LENGTH,
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
    const score = checks.filter(Boolean).length;

    if (score >= 4) return { label: 'Strong', className: 'strong' };
    if (score >= 2) return { label: 'Medium', className: 'medium' };
    return { label: 'Weak', className: 'weak' };
}

// Update the strength bar UI below the password field
function updatePasswordStrengthBar(password) {
    const bar = document.querySelector('.password-strength-bar');
    const text = document.querySelector('.password-strength-text');
    const container = document.querySelector('.password-strength');
    if (!bar || !text) return;

    if (!password) {
        container.classList.remove('visible');
        return;
    }

    container.classList.add('visible');
    const { label, className } = getPasswordStrength(password);
    bar.className = `password-strength-bar ${className}`;
    text.textContent = `Password strength: ${label}`;
    text.style.color = { strong: COLORS.success, medium: COLORS.warning, weak: COLORS.error }[className];
}

// ─── ROLE SELECTION ──────────────────────────────────────────────────────────

// Highlight the chosen role card and show/hide agent-only fields
function selectRole(role) {
    state.selectedRole = role;

    // Un-highlight all cards, then highlight the selected one
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('active');
        card.setAttribute('aria-pressed', 'false');
    });

    const selectedCard = document.querySelector(`[data-role="${role}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
        selectedCard.setAttribute('aria-pressed', 'true');
    }

    // Show extra fields only when the agent role is chosen
    const agentFields = document.querySelector('.agent-fields');
    if (agentFields) {
        const isAgent = role === 'agent';
        agentFields.classList.toggle('visible', isAgent);
        document.querySelectorAll('.agent-field').forEach(field => {
            isAgent ? field.setAttribute('required', 'required') : field.removeAttribute('required');
        });
    }

    saveToStorage('selectedRole', role);
}

// ─── FILE UPLOADS ─────────────────────────────────────────────────────────────

// Validate and attach an uploaded file, then render a preview inside the drop zone
function handleFileUpload(file, type, zone) {
    if (type === 'profile' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showToast('Please upload a valid image (JPEG, PNG, or WebP)', 'error');
        return;
    }
    if (file.size > MAX_FILE_SIZE) {
        showToast('File must be smaller than 5MB', 'error');
        return;
    }

    state.files[type] = file;
    zone.classList.add('has-file');

    // Replace any existing preview
    zone.querySelector('.file-preview')?.remove();

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
    preview.querySelector('.file-remove').addEventListener('click', e => {
        e.stopPropagation();
        removeFile(type, zone);
    });

    showToast(`${type === 'profile' ? 'Profile image' : 'Document'} uploaded`, 'success');
}

// Clear a file from state and reset the drop zone
function removeFile(type, zone) {
    state.files[type] = null;
    zone.classList.remove('has-file');
    zone.querySelector('.file-preview')?.remove();

    const input = zone.querySelector('input[type="file"]');
    if (input) input.value = '';
}

// ─── FORM HANDLERS ───────────────────────────────────────────────────────────

async function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    const fullName = form.querySelector('#fullName').value.trim();
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;

    let valid = true;

    // Validate each field and mark it accordingly
    if (fullName.length < 2) {
        showFieldError(form.querySelector('#fullName'), 'Please enter your full name');
        valid = false;
    } else {
        showFieldSuccess(form.querySelector('#fullName'));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError(form.querySelector('#email'), 'Please enter a valid email address');
        valid = false;
    } else {
        showFieldSuccess(form.querySelector('#email'));
    }

    if (getPasswordStrength(password).label === 'Weak') {
        showFieldError(form.querySelector('#password'), 'Password is too weak');
        valid = false;
    } else {
        showFieldSuccess(form.querySelector('#password'));
    }

    if (password !== confirmPassword) {
        showFieldError(form.querySelector('#confirmPassword'), 'Passwords do not match');
        valid = false;
    } else if (confirmPassword) {
        showFieldSuccess(form.querySelector('#confirmPassword'));
    }

    if (!state.selectedRole) {
        showToast('Please select a role', 'error');
        valid = false;
    }

    if (state.selectedRole === 'agent') {
        const businessName = form.querySelector('#businessName')?.value.trim();
        const phone = form.querySelector('#phone')?.value.trim();
        if (!businessName) {
            showFieldError(form.querySelector('#businessName'), 'Business name is required');
            valid = false;
        }
        if (!phone || phone.length < 10) {
            showFieldError(form.querySelector('#phone'), 'A valid phone number is required');
            valid = false;
        }
    }

    if (!valid) {
        showToast('Please fix the errors above', 'error');
        return;
    }

    setButtonLoading(submitBtn, true);
    await new Promise(r => setTimeout(r, 2000)); // Simulated API call

    const userData = {
        fullName,
        email,
        role: state.selectedRole,
        businessName: form.querySelector('#businessName')?.value || null,
        phone: form.querySelector('#phone')?.value || null,
        registeredAt: new Date().toISOString(),
    };

    if (!saveToStorage('pendingUser', userData)) {
        setButtonLoading(submitBtn, false);
        showToast('Failed to save data. Please try again.', 'error');
        return;
    }

    setButtonLoading(submitBtn, false);

    if (state.selectedRole === 'agent') {
        showToast('Registration complete! Please verify your account.', 'success');
        setTimeout(() => { window.location.href = 'verify-agent.html'; }, 1500);
    } else {
        showToast('Registration successful! Welcome to Ziba.', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const rememberMe = form.querySelector('#rememberMe')?.checked;

    let valid = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError(form.querySelector('#email'), 'Please enter a valid email');
        valid = false;
    } else {
        clearFieldError(form.querySelector('#email'));
    }

    if (!password) {
        showFieldError(form.querySelector('#password'), 'Please enter your password');
        valid = false;
    } else {
        clearFieldError(form.querySelector('#password'));
    }

    if (!valid) return;

    setButtonLoading(submitBtn, true);
    await new Promise(r => setTimeout(r, 1500)); // Simulated API call

    // If this email belongs to a pending agent, redirect them to the waiting page
    const pendingUser = readFromStorage('pendingUser', true);
    if (pendingUser?.email === email && pendingUser?.role === 'agent') {
        setButtonLoading(submitBtn, false);
        showToast('Account pending approval. Redirecting...', 'warning');
        setTimeout(() => { window.location.href = 'pending.html'; }, 1500);
        return;
    }

    setButtonLoading(submitBtn, false);
    showToast('Login successful! Redirecting...', 'success');

    rememberMe ? saveToStorage('rememberedEmail', email) : deleteFromStorage('rememberedEmail');
    setTimeout(() => { window.location.href = '../index.html'; }, 1000);
}

async function handleAgentVerification(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const bio = form.querySelector('#bio')?.value.trim();

    if (!state.files.profile) { showToast('Please upload a profile photo', 'error'); return; }
    if (!state.files.document) { showToast('Please upload your ID document', 'error'); return; }
    if (bio && bio.length < 50) { showToast('Bio must be at least 50 characters', 'error'); return; }

    setButtonLoading(submitBtn, true);
    await new Promise(r => setTimeout(r, 2000)); // Simulated API call

    // Mark the stored user as pending approval
    const pendingUser = readFromStorage('pendingUser', true);
    if (pendingUser) {
        pendingUser.bio = bio;
        pendingUser.status = 'pending_approval';
        pendingUser.verifiedAt = new Date().toISOString();
        saveToStorage('pendingUser', pendingUser);
    }

    setButtonLoading(submitBtn, false);
    showToast('Verification submitted!', 'success');
    setTimeout(() => { window.location.href = 'pending.html'; }, 1500);
}

// ─── INITIALISATION ──────────────────────────────────────────────────────────

function init() {
    // Warn if the browser blocks localStorage (e.g. private mode or strict settings)
    if (!isStorageAvailable()) {
        showToast('Warning: Browser storage not available', 'warning');
    }

    // Show/hide password when the eye icon is clicked
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            togglePasswordVisibility(btn, btn.parentElement.querySelector('input'));
        });
    });

    // Update the strength bar as the user types a password
    document.querySelector('#password')?.addEventListener(
        'input',
        debounce(function () { updatePasswordStrengthBar(this.value); }, 200)
    );

    // Role cards — click or keyboard (Enter/Space) to select
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => selectRole(card.dataset.role));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRole(card.dataset.role); }
        });
    });

    // Restore the role the user previously chose
    const savedRole = readFromStorage('selectedRole');
    if (savedRole) selectRole(savedRole);

    // Set up drag-and-drop file upload zones
    document.querySelectorAll('.upload-zone').forEach(zone => {
        const input = zone.querySelector('input[type="file"]');
        const type = zone.dataset.uploadType;

        input?.addEventListener('change', function () {
            if (this.files[0]) handleFileUpload(this.files[0], type, zone);
        });

        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0], type, zone);
        });
        zone.addEventListener('click', () => input?.click());
    });

    // Bind forms
    document.querySelector('#registerForm')?.addEventListener('submit', handleRegister);

    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        // Pre-fill email if "Remember me" was used last time
        const savedEmail = readFromStorage('rememberedEmail');
        if (savedEmail) {
            loginForm.querySelector('#email').value = savedEmail;
            const cb = loginForm.querySelector('#rememberMe');
            if (cb) cb.checked = true;
        }
    }

    const verifyForm = document.querySelector('#verifyForm');
    if (verifyForm) {
        verifyForm.addEventListener('submit', handleAgentVerification);
        // Pre-fill business name from registration data
        const pendingUser = readFromStorage('pendingUser', true);
        const businessInput = verifyForm.querySelector('#businessName');
        if (businessInput && pendingUser?.businessName) {
            businessInput.value = pendingUser.businessName;
        }
    }

    // Clear field errors as the user corrects their input
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', () => { if (input.value.trim()) clearFieldError(input); });
        input.addEventListener('input', () => { if (input.classList.contains('error')) clearFieldError(input); });
    });
}

document.addEventListener('DOMContentLoaded', init);
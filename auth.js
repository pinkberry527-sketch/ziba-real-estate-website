/* ==========================================================
   Ziba Auth — shared logic for auth.html, verify.html, pending.html
   ========================================================== */

const Auth = (() => {

    /* ---------- Toasts ---------- */
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const icons = { success: 'fa-check-circle', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }

    /* ---------- Field error helper ---------- */
    function setFieldError(input, message) {
        clearFieldError(input);
        input.classList.add('error');
        const err = document.createElement('p');
        err.className = 'field-error';
        err.innerHTML = `<i class="fas fa-circle-exclamation"></i> ${message}`;
        input.closest('.form-group').appendChild(err);
    }
    function clearFieldError(input) {
        input.classList.remove('error');
        const group = input.closest('.form-group');
        const existing = group && group.querySelector('.field-error');
        if (existing) existing.remove();
    }

    /* ---------- Password visibility ---------- */
    function initPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.parentElement.querySelector('input');
                const icon = btn.querySelector('i');
                const isHidden = input.type === 'password';
                input.type = isHidden ? 'text' : 'password';
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        });
    }

    /* ---------- Password strength ---------- */
    function scorePassword(pw) {
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
        if (/\d/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    }
    function initPasswordStrength() {
        const pwInput = document.getElementById('registerPassword');
        if (!pwInput) return;
        const bar = document.querySelector('.password-strength-bar');
        const wrap = document.querySelector('.password-strength');
        const text = document.querySelector('.password-strength-text');

        pwInput.addEventListener('input', () => {
            const val = pwInput.value;
            if (!val) { wrap.classList.remove('visible'); text.textContent = ''; return; }
            wrap.classList.add('visible');
            const score = scorePassword(val);
            bar.className = 'password-strength-bar';
            if (score <= 2) { bar.classList.add('weak'); text.textContent = 'Weak — add length, numbers, symbols'; }
            else if (score <= 3) { bar.classList.add('medium'); text.textContent = 'Getting there'; }
            else { bar.classList.add('strong'); text.textContent = 'Strong password'; }
        });
    }

    /* ---------- Role selection (buyer vs agent) ---------- */
    function initRoleSelection() {
        const cards = document.querySelectorAll('.role-card');
        const agentFields = document.querySelector('.agent-fields');
        if (!cards.length) return;

        function selectRole(card) {
            cards.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
            card.classList.add('active');
            card.setAttribute('aria-pressed', 'true');
            if (agentFields) agentFields.classList.toggle('visible', card.dataset.role === 'agent');
        }

        cards.forEach(card => {
            card.addEventListener('click', () => selectRole(card));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRole(card); }
            });
        });
    }

    function getSelectedRole() {
        const active = document.querySelector('.role-card.active');
        return active ? active.dataset.role : null;
    }

    /* ---------- File upload zones (used on verify.html) ---------- */
    function initUploadZones() {
        document.querySelectorAll('.upload-zone').forEach(zone => {
            const input = zone.querySelector('.upload-input');
            if (!input) return;

            const showPreview = (file) => {
                zone.classList.add('has-file');
                let preview = zone.querySelector('.file-preview');
                if (!preview) {
                    preview = document.createElement('div');
                    preview.className = 'file-preview';
                    zone.appendChild(preview);
                }
                const sizeKb = (file.size / 1024).toFixed(0);
                preview.innerHTML = `
                    <i class="fas fa-circle-check"></i>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${sizeKb} KB</div>
                    </div>
                    <button type="button" class="file-remove" aria-label="Remove file"><i class="fas fa-xmark"></i></button>
                `;
                preview.querySelector('.file-remove').addEventListener('click', (e) => {
                    e.stopPropagation();
                    input.value = '';
                    zone.classList.remove('has-file');
                    preview.remove();
                });
            };

            input.addEventListener('change', () => { if (input.files[0]) showPreview(input.files[0]); });
            zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('dragover');
                if (e.dataTransfer.files[0]) {
                    input.files = e.dataTransfer.files;
                    showPreview(e.dataTransfer.files[0]);
                }
            });
        });
    }

    /* ---------- Generic [data-toast] triggers (oauth stubs, forgot password) ---------- */
    function initToastStubs() {
        document.querySelectorAll('[data-toast]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                showToast(el.dataset.toast, 'info');
            });
        });
    }

    /* ---------- Flip card (sign in <-> sign up) ---------- */
    function initFlipCard() {
        const card = document.getElementById('flipCard');
        if (!card) return;

        document.querySelectorAll('[data-flip]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const target = trigger.dataset.flip;
                card.classList.toggle('is-flipped', target === 'signup');
                syncFlipCardHeight();
            });
        });

        // Faces are position:absolute (needed for the 3D flip), which means
        // the card itself has no natural height — without this it either
        // clips the taller face or leaves a scrollbar. Measure both faces'
        // real content height and use the larger one.
        function syncFlipCardHeight() {
            const faces = card.querySelectorAll('.auth-face');
            let tallest = 0;
            faces.forEach(face => {
                const halves = face.querySelectorAll('.auth-form-half, .auth-cta-half');
                let faceHeight = 0;
                halves.forEach(h => { faceHeight = Math.max(faceHeight, h.scrollHeight); });
                tallest = Math.max(tallest, faceHeight);
            });
            if (tallest > 0) card.style.height = tallest + 'px';
        }

        syncFlipCardHeight();
        window.addEventListener('resize', syncFlipCardHeight);
        // Fonts/icons loading late can change measured heights slightly.
        window.addEventListener('load', syncFlipCardHeight);
    }

    /* ---------- Remember me ---------- */
    const REMEMBER_KEY = 'rememberedEmail';

    function initRememberMe() {
        const emailInput = document.getElementById('loginEmail');
        const rememberBox = document.getElementById('rememberMe');
        if (!emailInput || !rememberBox) return;

        const saved = localStorage.getItem(REMEMBER_KEY);
        if (saved) {
            emailInput.value = saved;
            rememberBox.checked = true;
        }
    }

    function applyRememberMe(email, remember) {
        // We only ever store the email locally, never the password —
        // passwords should never sit in localStorage in plain text.
        if (remember) localStorage.setItem(REMEMBER_KEY, email);
        else localStorage.removeItem(REMEMBER_KEY);
    }

    /* ---------- Login form ---------- */
    function initLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');
            const remember = document.getElementById('rememberMe').checked;
            let valid = true;

            if (!/^\S+@\S+\.\S+$/.test(email.value)) { setFieldError(email, 'Enter a valid email address'); valid = false; }
            else clearFieldError(email);

            if (!password.value) { setFieldError(password, 'Enter your password'); valid = false; }
            else clearFieldError(password);

            if (!valid) return;

            applyRememberMe(email.value, remember);

            const btn = form.querySelector('.auth-button');
            btn.classList.add('loading');
            btn.disabled = true;

            // NOTE: this is a frontend-only demo. Swap this timeout for a real
            // call to your auth API, then redirect based on its response.
            setTimeout(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                showToast('Signed in successfully', 'success');
                setTimeout(() => { window.location.href = 'lp.html'; }, 700);
            }, 900);
        });
    }

    /* ---------- Register form ---------- */
    function initRegisterForm() {
        const form = document.getElementById('registerForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('registerEmail');
            const password = document.getElementById('registerPassword');
            const confirm = document.getElementById('confirmPassword');
            const role = getSelectedRole();
            let valid = true;

            if (!fullName.value.trim()) { setFieldError(fullName, 'Enter your full name'); valid = false; }
            else clearFieldError(fullName);

            if (!/^\S+@\S+\.\S+$/.test(email.value)) { setFieldError(email, 'Enter a valid email address'); valid = false; }
            else clearFieldError(email);

            if (password.value.length < 8) { setFieldError(password, 'Use at least 8 characters'); valid = false; }
            else clearFieldError(password);

            if (confirm.value !== password.value || !confirm.value) { setFieldError(confirm, 'Passwords do not match'); valid = false; }
            else clearFieldError(confirm);

            if (!role) { showToast('Choose whether you\'re a buyer or an agent', 'error'); valid = false; }

            if (!valid) return;

            const btn = form.querySelector('.auth-button');
            btn.classList.add('loading');
            btn.disabled = true;

            setTimeout(() => {
                btn.classList.remove('loading');
                btn.disabled = false;

                localStorage.setItem('pendingUser', JSON.stringify({
                    fullName: fullName.value.trim(),
                    email: email.value.trim(),
                    role
                }));

                if (role === 'agent') {
                    showToast('Account created — let\'s verify your business next', 'success');
                    setTimeout(() => { window.location.href = 'verify-agent.html'; }, 700);
                } else {
                    showToast('Welcome to Ziba!', 'success');
                    setTimeout(() => { window.location.href = 'lp.html'; }, 700);
                }
            }, 900);
        });
    }

    /* ---------- Agent verification form + dual-approval email ---------- */

    function initVerifyForm() {
    const form = document.getElementById('verifyForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const businessName = document.getElementById('businessName');
        const bio = document.getElementById('bio');
        let valid = true;

        if (!businessName.value.trim()) { setFieldError(businessName, 'Business name is required'); valid = false; }
        else clearFieldError(businessName);

        if (!valid) return;

        const btn = form.querySelector('.auth-button');
        btn.classList.add('loading');
        btn.disabled = true;

        const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');
        const refId = 'ZBA-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const applicationData = {
            fullName: pendingUser.fullName || 'Unknown applicant',
            email: pendingUser.email || 'Unknown email',
            businessName: businessName.value.trim(),
            bio: bio.value.trim() || 'Not provided',
            referenceId: refId,
            submittedAt: new Date().toLocaleString()
        };

        localStorage.setItem('pendingApplication', JSON.stringify(applicationData));

        sendApprovalEmails(applicationData)
            .then(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                showToast('Submitted — we\'ve emailed the review team', 'success');
                setTimeout(() => { window.location.href = 'pending.html'; }, 700);
            })
            .catch((err) => {
                console.error('Approval email failed:', err);
                alert('EmailJS error: ' + (err.text || JSON.stringify(err)));
                btn.classList.remove('loading');
                btn.disabled = false;
                showToast('Submitted, but the notification email failed to send', 'error');
                setTimeout(() => { window.location.href = 'pending.html'; }, 1200);
            });
    });
}
    /* ---------- Dual approval email via EmailJS ----------
       Fill in your own EmailJS service ID, template ID, and public key below
       (same account you used for the portfolio contact form). The template
       should accept: to_email, applicant_name, applicant_email, business_name,
       bio, reference_id, submitted_at — and send to BOTH reviewer addresses,
       either as two template recipients or by calling send() twice.
       Docs: https://www.emailjs.com/docs/sdk/send/
    ------------------------------------------------------------ */
    const EMAILJS_SERVICE_ID = 'service_x7ot6ir';
    const EMAILJS_TEMPLATE_ID = 'template_oi34jb8';
    const EMAILJS_PUBLIC_KEY = 'eSLhNLNgbra3g3ODD';
    const REVIEWER_EMAILS = ['drsshamsudeen@gmail.com', 'idehenruth5@gmail.com'];

    function sendApprovalEmails(applicationData) {
        if (typeof emailjs === 'undefined') {
            return Promise.reject(new Error('emailjs SDK not loaded — add the CDN script tag to this page'));
        }
        const sends = REVIEWER_EMAILS.map(reviewerEmail =>
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: reviewerEmail,
                applicant_name: applicationData.fullName,
                applicant_email: applicationData.email,
                business_name: applicationData.businessName,
                bio: applicationData.bio,
                reference_id: applicationData.referenceId,
                submitted_at: applicationData.submittedAt
            }, EMAILJS_PUBLIC_KEY)
        );
        return Promise.all(sends);
    }

    /* ---------- Init ---------- */
    function init() {
        initPasswordToggles();
        initPasswordStrength();
        initRoleSelection();
        initUploadZones();
        initToastStubs();
        initFlipCard();
        initRememberMe();
        initLoginForm();
        initRegisterForm();
        initVerifyForm();
    }

    document.addEventListener('DOMContentLoaded', init);

    return { showToast };
})();
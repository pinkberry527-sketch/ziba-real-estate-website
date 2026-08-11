/* ==========================================================
   Ziba Auth — shared logic for auth.html, verify.html, pending.html
   ========================================================== */

const Auth = (() => {

    /* ---------- Toasts ---------- */
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-circle-exclamation',
            info: 'fa-circle-info'
        };
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
            if (!val) {
                wrap.classList.remove('visible');
                text.textContent = '';
                return;
            }
            wrap.classList.add('visible');
            const score = scorePassword(val);
            bar.className = 'password-strength-bar';
            if (score <= 2) {
                bar.classList.add('weak');
                text.textContent = 'Weak — add length, numbers, symbols';
            } else if (score <= 3) {
                bar.classList.add('medium');
                text.textContent = 'Getting there';
            } else {
                bar.classList.add('strong');
                text.textContent = 'Strong password';
            }
        });
    }

    /* ---------- Role selection (buyer vs agent) ---------- */
    function initRoleSelection() {
        const cards = document.querySelectorAll('.role-card');
        const agentFields = document.querySelector('.agent-fields');
        if (!cards.length) return;

        function selectRole(card) {
            cards.forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-pressed', 'false');
            });
            card.classList.add('active');
            card.setAttribute('aria-pressed', 'true');
            if (agentFields) agentFields.classList.toggle('visible', card.dataset.role === 'agent');
        }

        cards.forEach(card => {
            card.addEventListener('click', () => selectRole(card));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectRole(card);
                }
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

            input.addEventListener('change', () => {
                if (input.files[0]) showPreview(input.files[0]);
            });
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('dragover');
            });
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
                halves.forEach(h => {
                    faceHeight = Math.max(faceHeight, h.scrollHeight);
                });
                tallest = Math.max(tallest, faceHeight);
            });
            if (tallest > 0) card.style.height = (tallest + 4) + 'px';
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

    /* ---------- Wait for firebase-config.js (loads as an async module, so
       it may not be ready the instant a fast click submits a form) ---------- */
    function ensureZibaDB(timeoutMs = 4000) {
        if (typeof window.ZibaDB !== 'undefined') return Promise.resolve();
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = setInterval(() => {
                if (typeof window.ZibaDB !== 'undefined') {
                    clearInterval(check);
                    resolve();
                } else if (Date.now() - start > timeoutMs) {
                    clearInterval(check);
                    reject(new Error('Firebase did not load in time'));
                }
            }, 100);
        });
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

            if (!/^\S+@\S+\.\S+$/.test(email.value)) {
                setFieldError(email, 'Enter a valid email address');
                valid = false;
            } else clearFieldError(email);

            if (!password.value) {
                setFieldError(password, 'Enter your password');
                valid = false;
            } else clearFieldError(password);

            if (!valid) return;

            const btn = form.querySelector('.auth-button');
            btn.classList.add('loading');
            btn.disabled = true;

            ensureZibaDB().then(() => {
                applyRememberMe(email.value, remember);

                window.ZibaDB.loginUser(email.value, password.value)
                    .then((profile) => {
                        btn.classList.remove('loading');
                        btn.disabled = false;
                        showToast('Signed in successfully', 'success');

                        if (profile.role === 'agent') {
                            if (profile.agentStatus === 'approved') {
                                setTimeout(() => {
                                    window.location.href = 'dash.html';
                                }, 700);
                            } else {
                                // Not approved yet (or rejected/suspended) — send
                                // them to the status page. Their profile already
                                // carries the application ID, saved there at
                                // submission time, so no extra lookup is needed
                                // (and no list-query, which security rules can't
                                // safely scope to "your own applications only").
                                if (profile.latestApplicationId) {
                                    localStorage.setItem('applicationId', profile.latestApplicationId);
                                }
                                setTimeout(() => {
                                    window.location.href = 'pending.html';
                                }, 700);
                            }
                        } else {
                            setTimeout(() => {
                                window.location.href = 'dashuser.html';
                            }, 700);
                        }
                    })
                    .catch((err) => {
                        console.error('Login failed:', err);
                        btn.classList.remove('loading');
                        btn.disabled = false;
                        showToast('Sign-in failed — check your email and password', 'error');
                    });
            }).catch(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                showToast('Could not connect — check your internet connection and try again', 'error');
            });
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

            if (!fullName.value.trim()) {
                setFieldError(fullName, 'Enter your full name');
                valid = false;
            } else clearFieldError(fullName);

            if (!/^\S+@\S+\.\S+$/.test(email.value)) {
                setFieldError(email, 'Enter a valid email address');
                valid = false;
            } else clearFieldError(email);

            if (password.value.length < 8) {
                setFieldError(password, 'Use at least 8 characters');
                valid = false;
            } else clearFieldError(password);

            if (confirm.value !== password.value || !confirm.value) {
                setFieldError(confirm, 'Passwords do not match');
                valid = false;
            } else clearFieldError(confirm);

            if (!role) {
                showToast('Choose whether you\'re a buyer or an agent', 'error');
                valid = false;
            }

            if (!valid) return;

            const btn = form.querySelector('.auth-button');
            btn.classList.add('loading');
            btn.disabled = true;

            ensureZibaDB().then(() => {
                window.ZibaDB.registerUser(email.value.trim(), password.value, {
                        fullName: fullName.value.trim(),
                        email: email.value.trim(),
                        role
                    })
                    .then(() => {
                        btn.classList.remove('loading');
                        btn.disabled = false;

                        if (role === 'agent') {
                            showToast('Account created — let\'s verify your business next', 'success');
                            setTimeout(() => {
                                window.location.href = 'verify-agent.html';
                            }, 700);
                        } else {
                            showToast('Welcome to Ziba!', 'success');
                            setTimeout(() => {
                                window.location.href = 'dashuser.html';
                            }, 700);
                        }
                    })
                    .catch((err) => {
                        console.error('Registration failed:', err);
                        btn.classList.remove('loading');
                        btn.disabled = false;
                        if (err.code === 'auth/email-already-in-use') {
                            setFieldError(email, 'An account with this email already exists');
                        } else {
                            showToast('Could not create account — try again', 'error');
                        }
                    });
            }).catch(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                showToast('Could not connect — check your internet connection and try again', 'error');
            });
        });
    }

    /* ---------- File → base64 (no Storage/billing plan needed) ----------
       Firestore documents cap out at 1MB total, and base64 text runs about
       33% larger than the original file, so images get compressed down
       before encoding. PDFs can't be shrunk the same way — those just get
       a straight size check with a clear error if they're too big.
    ------------------------------------------------------------ */

    function compressImageToDataURL(file, maxDim, quality) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Could not read file'));
            reader.onload = () => {
                img.onerror = () => reject(new Error('Could not read image'));
                img.onload = () => {
                    let {
                        width,
                        height
                    } = img;
                    if (width > maxDim || height > maxDim) {
                        const scale = maxDim / Math.max(width, height);
                        width = Math.round(width * scale);
                        height = Math.round(height * scale);
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Could not read file'));
            reader.readAsDataURL(file);
        });
    }

    const MAX_DATA_URL_LENGTH = 500000; // ~500KB, leaves headroom under Firestore's 1MB doc cap

    // Photo: always an image — compress it, trying progressively harder if
    // the first pass is still too big.
    async function processPhoto(file) {
        let dataUrl = await compressImageToDataURL(file, 800, 0.7);
        if (dataUrl.length > MAX_DATA_URL_LENGTH) {
            dataUrl = await compressImageToDataURL(file, 500, 0.5);
        }
        if (dataUrl.length > MAX_DATA_URL_LENGTH) {
            throw new Error('Photo is too large even after compression — try a smaller image');
        }
        return dataUrl;
    }

    // ID document: image or PDF. Images get compressed like the photo;
    // PDFs are read as-is with a straight size check since they can't be
    // shrunk client-side.
    async function processIdDocument(file) {
        if (file.type === 'application/pdf') {
            const dataUrl = await readFileAsDataURL(file);
            if (dataUrl.length > MAX_DATA_URL_LENGTH) {
                throw new Error('PDF is too large — please upload one under ~350KB, or a photo of the document instead');
            }
            return dataUrl;
        }
        let dataUrl = await compressImageToDataURL(file, 1000, 0.75);
        if (dataUrl.length > MAX_DATA_URL_LENGTH) {
            dataUrl = await compressImageToDataURL(file, 700, 0.5);
        }
        if (dataUrl.length > MAX_DATA_URL_LENGTH) {
            throw new Error('Document image is too large even after compression — try a smaller image');
        }
        return dataUrl;
    }

    /* ---------- Agent verification form + dual-approval email ---------- */
    function initVerifyForm() {
        const form = document.getElementById('verifyForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const businessName = document.getElementById('businessName');
            const phone = document.getElementById('phone');
            const bio = document.getElementById('bio');
            let valid = true;

            if (!businessName.value.trim()) {
                setFieldError(businessName, 'Business name is required');
                valid = false;
            } else clearFieldError(businessName);

            if (!phone.value.trim()) {
                setFieldError(phone, 'Phone number is required so buyers can reach you');
                valid = false;
            } else clearFieldError(phone);

            if (!valid) return;

            const photoFile = document.getElementById('profilePhoto').files[0] || null;
            const docFile = document.getElementById('idDocument').files[0] || null;

            const btn = form.querySelector('.auth-button');
            btn.classList.add('loading');
            btn.disabled = true;

            ensureZibaDB().then(() => {
                const currentUser = window.ZibaDB.getCurrentUser();
                if (!currentUser) {
                    btn.classList.remove('loading');
                    btn.disabled = false;
                    showToast('Your session expired — please sign in again', 'error');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 900);
                    return;
                }

                window.ZibaDB.getUserProfile(currentUser.uid).then((profile) => {
                    const refId = 'ZBA-' + Math.random().toString(36).substr(2, 6).toUpperCase();

                    // Both files are optional — missing ones just resolve to null
                    // rather than blocking the submission.
                    const preparePhoto = photoFile ? processPhoto(photoFile) : Promise.resolve(null);
                    const prepareDoc = docFile ? processIdDocument(docFile) : Promise.resolve(null);

                    Promise.all([preparePhoto, prepareDoc]).then(([photoBase64, idDocumentBase64]) => {
                        const applicationData = {
                            uid: currentUser.uid,
                            fullName: (profile && profile.fullName) || 'Unknown applicant',
                            email: currentUser.email,
                            businessName: businessName.value.trim(),
                            phone: phone.value.trim(),
                            bio: bio.value.trim() || 'Not provided',
                            referenceId: refId,
                            submittedAt: new Date().toLocaleString(),
                            photoBase64: photoBase64 || null,
                            idDocumentBase64: idDocumentBase64 || null,
                            idDocumentIsPdf: docFile ? docFile.type === 'application/pdf' : false,
                            idDocumentName: docFile ? docFile.name : null
                        };

                        // The database write is the real submission — status lives
                        // there now, not in localStorage. The email is just a
                        // heads-up ping, so its failure shouldn't block the applicant.
                        window.ZibaDB.submitApplication(applicationData)
                            .then((applicationId) => {
                                localStorage.setItem('applicationId', applicationId);

                                sendApprovalEmails(applicationData).catch((err) => {
                                    console.error('Approval email failed (application was still saved):',
                                        err);
                                });

                                btn.classList.remove('loading');
                                btn.disabled = false;
                                showToast('Submitted for review', 'success');
                                setTimeout(() => {
                                    window.location.href = 'pending.html';
                                }, 700);
                            })
                            .catch((err) => {
                                console.error('Saving application failed:', err);
                                btn.classList.remove('loading');
                                btn.disabled = false;
                                showToast('Could not submit — check your connection and try again', 'error');
                            });
                    }).catch((err) => {
                        console.error('File processing failed:', err);
                        btn.classList.remove('loading');
                        btn.disabled = false;
                        showToast(err.message || 'Could not process your files — try smaller files', 'error');
                    });
                }).catch((err) => {
                    console.error('Could not load your profile:', err);
                    btn.classList.remove('loading');
                    btn.disabled = false;
                    showToast('Could not submit — try refreshing and signing in again', 'error');
                });
            }).catch(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                showToast('Could not connect — check your internet connection and try again', 'error');
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
    const EMAILJS_TEMPLATE_ID = 'template-oi34jb8';
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

    return {
        showToast
    };
})();
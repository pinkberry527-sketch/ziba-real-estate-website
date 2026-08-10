/* ============================================================
   ZIBA AGENT DASHBOARD — APPLICATION LOGIC
   ============================================================ */

const state = {
    currentPage: 'dashboard',
    agentUid: null,
    agentName: 'Agent',
    agentInitials: 'A',
    agentEmail: '',
    agentPhone: '',
    listingsLoaded: false,
    properties: [
        
    ],
    activities: [

    ]
};

const icons = {
    home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    layout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    list: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    chart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    activity: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    eye: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    message: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    edit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    dollar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    inbox: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    mapPin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    tag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    trendingUp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    layers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    checkCircle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    alertTriangle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    arrowUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>',
    arrowDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
    logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// NOTE: initialization no longer runs automatically on DOMContentLoaded.
// The page's auth-guard script (in dash.html) confirms this visitor is a
// signed-in, approved agent first, then calls window.ZibaInitDashboard()
// with their real profile (including uid). This keeps listing data from
// ever rendering before we actually know who's looking at it.
window.ZibaInitDashboard = function (agentProfile) {
    state.agentUid = agentProfile && agentProfile.uid;
    state.agentName = (agentProfile && agentProfile.fullName) || 'Agent';
    state.agentEmail = (agentProfile && agentProfile.email) || '';
    state.agentPhone = (agentProfile && agentProfile.phone) || '';
    state.agentInitials = getInitials(state.agentName);
    renderSidebarIdentity();
    updateBadge();
    renderPage();
    bindEvents();

    // Live-updates whenever a listing is created/edited/deleted anywhere —
    // by this dashboard or, later, any other client. No manual re-fetching.
    if (state.agentUid && typeof window.ZibaDB !== 'undefined') {
        window.ZibaDB.watchAgentListings(state.agentUid, (listings) => {
            state.properties = listings;
            state.listingsLoaded = true;
            updateBadge();
            renderPage();
        });
    }
};

function getInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'A';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ---------- Property photo compression (same approach as verify-agent's
   uploads — resized + JPEG-compressed client-side, no Storage needed) ---------- */
function compressImageToDataURL(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read file'));
        reader.onload = () => {
            img.onerror = () => reject(new Error('Could not read image'));
            img.onload = () => {
                let { width, height } = img;
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

async function processPropertyPhoto(file) {
    let dataUrl = await compressImageToDataURL(file, 1000, 0.72);
    if (dataUrl.length > 600000) {
        dataUrl = await compressImageToDataURL(file, 700, 0.55);
    }
    return dataUrl;
}

/* ---------- Photo upload zone wiring (used by both Add and Edit modals) ---------- */
function initPhotoUploadZone(zoneId, inputId, placeholderId, previewId) {
    const zone = $(`#${zoneId}`);
    const input = $(`#${inputId}`);
    const placeholder = $(`#${placeholderId}`);
    const preview = $(`#${previewId}`);
    if (!zone || !input) return;

    zone.addEventListener('click', () => input.click());

    input.addEventListener('change', async () => {
        const file = input.files[0];
        if (!file) return;
        try {
            const dataUrl = await processPropertyPhoto(file);
            preview.src = dataUrl;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            zone.dataset.imageValue = dataUrl;
        } catch (err) {
            console.error('Photo processing failed:', err);
            showToast('Could not process that photo — try a different file', 'error');
        }
    });
}

function resetPhotoUploadZone(zoneId, inputId, placeholderId, previewId, existingImage) {
    const zone = $(`#${zoneId}`);
    const input = $(`#${inputId}`);
    const placeholder = $(`#${placeholderId}`);
    const preview = $(`#${previewId}`);
    if (!zone) return;

    input.value = '';
    if (existingImage) {
        preview.src = existingImage;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        zone.dataset.imageValue = existingImage;
    } else {
        preview.style.display = 'none';
        placeholder.style.display = 'flex';
        zone.dataset.imageValue = '';
    }
}

function renderSidebarIdentity() {
    const avatar = $('#sidebarUserAvatar');
    const name = $('#sidebarUserName');
    if (avatar) avatar.textContent = state.agentInitials;
    if (name) name.textContent = state.agentName;
}

function updateBadge() {
    const badge = $('#agentListingBadge');
    if (badge) badge.textContent = state.properties.length;
}

function navigateTo(page) {
    state.currentPage = page;
    $('#breadcrumb').textContent = getPageTitle(page);
    $$('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
    renderPage();
    $('#sidebar').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getPageTitle(page) {
    const titles = {
        'dashboard': 'Dashboard',
        'listings': 'My Listings',
        'add-property': 'Add Property',
        'analytics': 'Analytics',
        'activity': 'Activity'
    };
    return titles[page] || 'Dashboard';
}

function renderPage() {
    const content = $('#content');
    content.innerHTML = '';
    switch (state.currentPage) {
        case 'dashboard': renderDashboard(content); break;
        case 'listings': renderListings(content); break;
        case 'add-property': openAddModal(); navigateTo('listings'); break;
        case 'analytics': renderAnalytics(content); break;
        case 'activity': renderActivity(content); break;
        default: renderDashboard(content);
    }
}

function renderDashboard(container) {
    const totalListings = state.properties.length;
    const activeListings = state.properties.filter(p => p.status === 'Active').length;
    const totalInquiries = state.properties.reduce((sum, p) => sum + p.inquiries, 0);
    const totalViews = state.properties.reduce((sum, p) => sum + p.views, 0);
    const firstName = state.agentName.split(' ')[0];

    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">Welcome, ${firstName}</h1>
                <p class="page-subtitle">Here is your portfolio overview.</p>
            </div>
            <button class="btn btn--primary" id="quickAddBtn">
                ${icons.plus} Add Property
            </button>
        </div>

        <div class="grid grid--4 stagger-children">
            <div class="card card--stat">
                <div class="stat-icon stat-icon--primary">${icons.home}</div>
                <div class="stat-value">${totalListings}</div>
                <div class="stat-label">Total Listings</div>
                <div class="stat-change stat-change--up">${icons.arrowUp} 0% this month</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--accent">${icons.dollar}</div>
                <div class="stat-value">${activeListings}</div>
                <div class="stat-label">Active Listings</div>
                <div class="stat-change stat-change--up">${icons.arrowUp} 0% this month</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--info">${icons.message}</div>
                <div class="stat-value">${totalInquiries}</div>
                <div class="stat-label">Total Inquiries</div>
                <div class="stat-change stat-change--up">${icons.arrowUp} 0% this week</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--success">${icons.eye}</div>
                <div class="stat-value">${totalViews.toLocaleString()}</div>
                <div class="stat-label">Total Views</div>
                <div class="stat-change stat-change--up">${icons.arrowUp} 0% this week</div>
            </div>
        </div>

        <div class="grid grid--2" style="margin-top: 32px;">
            <div class="card animate-fade-in">
                <div class="card-header">
                    <h3 class="card-title">Recent Listings</h3>
                    <button class="btn btn--sm btn--secondary" onclick="navigateTo('listings')">View All</button>
                </div>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr><th></th><th>Property</th><th>Type</th><th>Price</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${state.properties.slice(0, 5).map(p => `
                                <tr>
                                    <td style="width:56px;">${renderThumb(p)}</td>
                                    <td><strong>${p.title}</strong><br><span style="font-size:12px;color:var(--nutral-gray-color)">${p.location}</span></td>
                                    <td><span class="listing-badge listing-badge--${p.listingType.toLowerCase()}">${p.listingType}</span></td>
                                    <td style="font-weight:600;color:var(--accent-color)">${p.price}</td>
                                    <td>${renderStatusBadge(p.status)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card animate-fade-in">
                <div class="card-header">
                    <h3 class="card-title">Recent Activity</h3>
                    <button class="btn btn--sm btn--secondary" onclick="navigateTo('activity')">View All</button>
                </div>
                <div class="activity-list">
                    ${state.activities.slice(0, 5).map(a => `
                        <div class="activity-item">
                            <div class="activity-icon stat-icon--${getActivityColor(a.type)}">${icons[a.icon]}</div>
                            <div class="activity-content">
                                <div class="activity-text">${a.text}</div>
                                <div class="activity-time">${a.time}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    $('#quickAddBtn')?.addEventListener('click', openAddModal);
}

function getActivityColor(type) {
    const map = { listing: 'primary', inquiry: 'info', sale: 'success', view: 'warning', edit: 'accent' };
    return map[type] || 'primary';
}

function renderListings(container) {
    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">My Listings</h1>
                <p class="page-subtitle">Manage all your property listings in one place.</p>
            </div>
            <button class="btn btn--primary" id="addListingBtn">
                ${icons.plus} Add Property
            </button>
        </div>

        <div class="card animate-fade-in">
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Listing</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Views</th>
                            <th>Inquiries</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${!state.listingsLoaded ? `
                            <tr><td colspan="9">
                                <div class="empty-state">
                                    <div class="auth-gate__spinner" style="margin: 0 auto;"></div>
                                    <p class="empty-state__text" style="margin-top:12px;">Loading your listings&hellip;</p>
                                </div>
                            </td></tr>
                        ` : state.properties.length === 0 ? `
                            <tr><td colspan="9">
                                <div class="empty-state">
                                    <div class="empty-state__icon">${icons.home}</div>
                                    <h3 class="empty-state__title">No Listings Yet</h3>
                                    <p class="empty-state__text">Start by adding your first property listing.</p>
                                    <button class="btn btn--primary" onclick="openAddModal()">${icons.plus} Add Property</button>
                                </div>
                            </td></tr>
                        ` : state.properties.map(p => `
                            <tr>
                                <td style="width:56px;">${renderThumb(p)}</td>
                                <td>
                                    <strong>${p.title}</strong>
                                    <br><span style="font-size:12px;color:var(--nutral-gray-color)">${p.location}</span>
                                </td>
                                <td>${p.type}</td>
                                <td><span class="listing-badge listing-badge--${p.listingType.toLowerCase()}">${p.listingType}</span></td>
                                <td style="font-weight:600;color:var(--accent-color)">${p.price}</td>
                                <td>${renderStatusBadge(p.status)}</td>
                                <td>${p.views}</td>
                                <td>${p.inquiries}</td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn btn--icon btn--secondary" onclick="openEditModal('${p.id}')" title="Edit">
                                            ${icons.edit}
                                        </button>
                                        <button class="btn btn--icon btn--danger" onclick="deleteProperty('${p.id}')" title="Delete">
                                            ${icons.trash}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    $('#addListingBtn')?.addEventListener('click', openAddModal);
}

function renderStatusBadge(status) {
    const slug = status.toLowerCase();
    return `<span class="status-badge status-badge--${slug}">${status}</span>`;
}

function renderThumb(p) {
    if (p.image) {
        return `<img class="listing-thumb" src="${p.image}" alt="${p.title}">`;
    }
    return `<div class="listing-thumb listing-thumb--placeholder">${icons.home}</div>`;
}

function renderAnalytics(container) {
    const totalListings = state.properties.length;
    const saleCount = state.properties.filter(p => p.listingType === 'Sale').length;
    const rentCount = state.properties.filter(p => p.listingType === 'Rent').length;
    const avgViews = totalListings > 0 ? Math.round(state.properties.reduce((s, p) => s + p.views, 0) / totalListings) : 0;

    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">Analytics</h1>
                <p class="page-subtitle">Performance metrics for your property portfolio.</p>
            </div>
        </div>

        <div class="grid grid--4 stagger-children">
            <div class="card card--stat">
                <div class="stat-icon stat-icon--primary">${icons.layers}</div>
                <div class="stat-value">${totalListings}</div>
                <div class="stat-label">Total Properties</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--accent">${icons.tag}</div>
                <div class="stat-value">${saleCount}</div>
                <div class="stat-label">For Sale</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--info">${icons.calendar}</div>
                <div class="stat-value">${rentCount}</div>
                <div class="stat-label">For Rent</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--success">${icons.trendingUp}</div>
                <div class="stat-value">${avgViews}</div>
                <div class="stat-label">Avg. Views / Property</div>
            </div>
        </div>

        <div class="grid grid--2" style="margin-top: 32px;">
            <div class="card animate-fade-in">
                <div class="card-header">
                    <h3 class="card-title">Listing Performance</h3>
                </div>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr><th>Property</th><th>Views</th><th>Inquiries</th><th>Conversion</th></tr>
                        </thead>
                        <tbody>
                            ${state.properties.map(p => {
        const conv = p.views > 0 ? ((p.inquiries / p.views) * 100).toFixed(1) : '0.0';
        return `
                                    <tr>
                                        <td><strong>${p.title}</strong></td>
                                        <td>${p.views}</td>
                                        <td>${p.inquiries}</td>
                                        <td><span style="font-weight:600;color:var(--success-color)">${conv}%</span></td>
                                    </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card animate-fade-in">
                <div class="card-header">
                    <h3 class="card-title">Revenue Overview</h3>
                </div>
                <div style="padding: 20px 0;">
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--border-color);">
                        <span style="color:var(--nutral-gray-color)">Total Listings Value</span>
                        <span style="font-family:var(--heading-font-family);font-size:var(--text-size-lg);font-weight:var(--font-weight-bold);color:var(--text-color-dark)">NULL</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--border-color);">
                        <span style="color:var(--nutral-gray-color)">Monthly Rental Income</span>
                        <span style="font-family:var(--heading-font-family);font-size:var(--text-size-lg);font-weight:var(--font-weight-bold);color:var(--accent-color)">NULL</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--border-color);">
                        <span style="color:var(--nutral-gray-color)">Avg. Inquiry Response</span>
                        <span style="font-family:var(--heading-font-family);font-size:var(--text-size-lg);font-weight:var(--font-weight-bold);color:var(--success-color)">NULL</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;">
                        <span style="color:var(--nutral-gray-color)">Client Satisfaction</span>
                        <span style="font-family:var(--heading-font-family);font-size:var(--text-size-lg);font-weight:var(--font-weight-bold);color:var(--info-color)">NULL</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderActivity(container) {
    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">Activity Feed</h1>
                <p class="page-subtitle">Track all your recent actions and updates.</p>
            </div>
        </div>

        <div class="card animate-fade-in">
            <div class="activity-list" style="padding: 8px 0;">
                ${state.activities.map(a => `
                    <div class="activity-item">
                        <div class="activity-icon stat-icon--${getActivityColor(a.type)}">${icons[a.icon]}</div>
                        <div class="activity-content">
                            <div class="activity-text">${a.text}</div>
                            <div class="activity-time">${a.time}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openAddModal() {
    $('#addPropertyForm').reset();
    resetPhotoUploadZone('propImageZone', 'propImage', 'propImagePlaceholder', 'propImagePreview', null);
    $('#addPropertyModal').classList.add('active');
}

function openEditModal(propId) {
    const p = state.properties.find(x => x.id === propId);
    if (!p) return;
    $('#editPropId').value = p.id;
    $('#editPropTitle').value = p.title;
    $('#editPropPrice').value = p.price;
    $('#editPropLocation').value = p.location;
    $('#editPropType').value = p.type;
    $('#editPropListingType').value = p.listingType;
    $('#editPropStatus').value = p.status;
    $('#editPropBedrooms').value = p.bedrooms || 0;
    $('#editPropBathrooms').value = p.bathrooms || 0;
    $('#editPropSize').value = p.size || 0;
    $('#editPropFurnished').value = p.furnished || 'No';
    $('#editPropServiced').value = p.serviced || 'No';
    $('#editPropDescription').value = p.description;
    resetPhotoUploadZone('editPropImageZone', 'editPropImage', 'editPropImagePlaceholder', 'editPropImagePreview', p.image || null);
    $('#editPropertyModal').classList.add('active');
}

function closeModal(modalId) {
    $(`#${modalId}`).classList.remove('active');
}

function addProperty(data) {
    if (typeof window.ZibaDB === 'undefined' || !state.agentUid) {
        showToast('Not connected — try refreshing the page', 'error');
        return Promise.reject(new Error('not connected'));
    }
    return window.ZibaDB.createListing({
        ...data,
        uid: state.agentUid,
        agentName: state.agentName,
        contactName: state.agentName,
        contactEmail: state.agentEmail,
        contactPhone: state.agentPhone
    }).then(() => {
        state.activities.unshift({
            id: Date.now(),
            type: 'listing',
            text: `Listed <strong>${data.title}</strong> for ${data.price}`,
            time: 'Just now',
            icon: 'home'
        });
        showToast('Property listed successfully!', 'success');
        // The live listener will bring in the new listing and re-render —
        // no need to touch state.properties here.
    }).catch((err) => {
        console.error('Could not create listing:', err);
        showToast('Could not save the listing — try again', 'error');
        throw err;
    });
}

function updateProperty(id, data) {
    if (typeof window.ZibaDB === 'undefined') {
        showToast('Not connected — try refreshing the page', 'error');
        return Promise.reject(new Error('not connected'));
    }
    return window.ZibaDB.updateListing(id, data).then(() => {
        state.activities.unshift({
            id: Date.now(),
            type: 'edit',
            text: `Updated <strong>${data.title}</strong>`,
            time: 'Just now',
            icon: 'edit'
        });
        showToast('Property updated successfully!', 'success');
    }).catch((err) => {
        console.error('Could not update listing:', err);
        showToast('Could not save changes — try again', 'error');
        throw err;
    });
}

function deleteProperty(id) {
    const p = state.properties.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`Are you sure you want to delete "${p.title}"?`)) return;

    if (typeof window.ZibaDB === 'undefined') {
        showToast('Not connected — try refreshing the page', 'error');
        return;
    }
    window.ZibaDB.deleteListing(id).then(() => {
        state.activities.unshift({
            id: Date.now(),
            type: 'edit',
            text: `Deleted <strong>${p.title}</strong>`,
            time: 'Just now',
            icon: 'trash'
        });
        showToast('Property deleted', 'info');
    }).catch((err) => {
        console.error('Could not delete listing:', err);
        showToast('Could not delete the listing — try again', 'error');
    });
}

function showToast(message, type = 'info') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const iconMap = { success: 'checkCircle', error: 'alertTriangle', warning: 'alertTriangle', info: 'info' };
    toast.innerHTML = `
        <div class="toast-icon">${icons[iconMap[type]]}</div>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">${icons.x}</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function bindEvents() {
    // Photo upload zones (Add + Edit modals)
    initPhotoUploadZone('propImageZone', 'propImage', 'propImagePlaceholder', 'propImagePreview');
    initPhotoUploadZone('editPropImageZone', 'editPropImage', 'editPropImagePlaceholder', 'editPropImagePreview');

    // Sidebar nav clicks
    $$('.nav-item').forEach(el => {
        el.addEventListener('click', () => {
            navigateTo(el.dataset.page);
        });
    });

    // Mobile menu
    $('#menuToggle').addEventListener('click', () => {
        $('#sidebar').classList.toggle('open');
    });
    $('#sidebarClose').addEventListener('click', () => {
        $('#sidebar').classList.remove('open');
    });

    // Sign out
    $('#sidebarSignOut')?.addEventListener('click', () => {
        if (typeof window.ZibaDB === 'undefined') {
            window.location.href = '/HTML/login.html';
            return;
        }
        window.ZibaDB.signOutUser().then(() => {
            window.location.href = '/HTML/login.html';
        });
    });

    // Close modals on overlay click
    $$('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });

    // Close modal buttons
    $('#closeAddModal').addEventListener('click', () => closeModal('addPropertyModal'));
    $('#closeEditModal').addEventListener('click', () => closeModal('editPropertyModal'));
    $('#cancelAddBtn').addEventListener('click', () => closeModal('addPropertyModal'));
    $('#cancelEditBtn').addEventListener('click', () => closeModal('editPropertyModal'));

    // Add property form
    $('#addPropertyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            title: $('#propTitle').value,
            price: $('#propPrice').value,
            location: $('#propLocation').value,
            type: $('#propType').value,
            listingType: $('#propListingType').value,
            status: $('#propStatus').value,
            bedrooms: Number($('#propBedrooms').value) || 0,
            bathrooms: Number($('#propBathrooms').value) || 0,
            size: Number($('#propSize').value) || 0,
            furnished: $('#propFurnished').value,
            serviced: $('#propServiced').value,
            description: $('#propDescription').value,
            image: $('#propImageZone').dataset.imageValue || null
        };
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Saving…';
        addProperty(data)
            .then(() => closeModal('addPropertyModal'))
            .catch(() => {}) // error already toasted inside addProperty; keep modal open to retry
            .finally(() => {
                btn.disabled = false;
                btn.textContent = originalText;
            });
    });

    // Edit property form
    $('#editPropertyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('#editPropId').value;
        const data = {
            title: $('#editPropTitle').value,
            price: $('#editPropPrice').value,
            location: $('#editPropLocation').value,
            type: $('#editPropType').value,
            listingType: $('#editPropListingType').value,
            status: $('#editPropStatus').value,
            bedrooms: Number($('#editPropBedrooms').value) || 0,
            bathrooms: Number($('#editPropBathrooms').value) || 0,
            size: Number($('#editPropSize').value) || 0,
            furnished: $('#editPropFurnished').value,
            serviced: $('#editPropServiced').value,
            description: $('#editPropDescription').value,
            image: $('#editPropImageZone').dataset.imageValue || null
        };
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Saving…';
        updateProperty(id, data)
            .then(() => closeModal('editPropertyModal'))
            .catch(() => {}) // error already toasted inside updateProperty; keep modal open to retry
            .finally(() => {
                btn.disabled = false;
                btn.textContent = originalText;
            });
    });

    // Keyboard: Escape to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $$('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });
}
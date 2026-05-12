// ==================== STATE ====================
const state = {
    role: 'agent',
    currentPage: 'dashboard',
    properties: [



    ],
    savedProperties: [],
    recentViews: [],
    activities: [

    ]
};




// ==================== ICONS (SVG) ====================
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
    building: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="9" y1="12" x2="9.01" y2="12"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="9" y1="16" x2="9.01" y2="16"/><line x1="15" y1="16" x2="15.01" y2="16"/></svg>',
    inbox: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    mapPin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    bed: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="M5 20V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12"/><path d="M2 12h20"/></svg>',
    bath: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16"/><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M6 12V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"/></svg>',
    area: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
    arrowUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>',
    arrowDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
    tag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    trendingUp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    layers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    checkCircle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    alertTriangle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

// ==================== NAVIGATION CONFIG ====================
const navConfig = {
    agent: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout' },
        { id: 'listings', label: 'My Listings', icon: 'list', badge: () => state.properties.length },
        { id: 'add-property', label: 'Add Property', icon: 'plus' },
        { id: 'analytics', label: 'Analytics', icon: 'chart' },
        { id: 'activity', label: 'Activity', icon: 'activity' }
    ],
    user: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout' },
        { id: 'browse', label: 'Browse Properties', icon: 'search' },
        { id: 'saved', label: 'Saved', icon: 'heart', badge: () => state.savedProperties.length },
        { id: 'recent', label: 'Recent Views', icon: 'eye' },
        { id: 'inquiries', label: 'My Inquiries', icon: 'message' }
    ]
};

// ==================== DOM REFERENCES ====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    renderSidebar();
    renderPage();
    bindEvents();
    updateRoleUI();
}

// ==================== SIDEBAR ====================
function renderSidebar() {
    const nav = $('#sidebarNav');
    const items = navConfig[state.role];
    nav.innerHTML = items.map(item => {
        const badge = item.badge ? `<span class="nav-badge">${item.badge()}</span>` : '';
        const activeClass = state.currentPage === item.id ? 'active' : '';
        return `
            <div class="nav-item ${activeClass}" data-page="${item.id}">
                ${icons[item.icon]}
                <span>${item.label}</span>
                ${badge}
            </div>
        `;
    }).join('');

    $$('.nav-item').forEach(el => {
        el.addEventListener('click', () => {
            const page = el.dataset.page;
            navigateTo(page);
        });
    });

    $('#userRoleLabel').textContent = state.role === 'agent' ? 'Agent' : 'User';
}

// ==================== NAVIGATION ====================
function navigateTo(page) {
    state.currentPage = page;
    $('#breadcrumb').textContent = getPageTitle(page);
    renderSidebar();
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
        'activity': 'Activity',
        'browse': 'Browse Properties',
        'saved': 'Saved Properties',
        'recent': 'Recent Views',
        'inquiries': 'My Inquiries'
    };
    return titles[page] || 'Dashboard';
}




// ==================== RENDER PAGE ====================
function renderPage() {
    const content = $('#content');
    content.innerHTML = '';

    if (state.role === 'agent') {
        switch (state.currentPage) {
            case 'dashboard': renderAgentDashboard(content); break;
            case 'listings': renderAgentListings(content); break;
            case 'add-property': openAddModal(); navigateTo('listings'); break;
            case 'analytics': renderAgentAnalytics(content); break;
            case 'activity': renderAgentActivity(content); break;
            default: renderAgentDashboard(content);
        }
    } else {
        switch (state.currentPage) {
            case 'dashboard': renderUserDashboard(content); break;
            case 'browse': renderUserBrowse(content); break;
            case 'saved': renderUserSaved(content); break;
            case 'recent': renderUserRecent(content); break;
            case 'inquiries': renderUserInquiries(content); break;
            default: renderUserDashboard(content);
        }
    }
}

// ==================== AGENT: DASHBOARD ====================
function renderAgentDashboard(container) {
    const totalListings = state.properties.length;
    const activeListings = state.properties.filter(p => p.status === 'Active').length;
    const totalInquiries = state.properties.reduce((sum, p) => sum + p.inquiries, 0);
    const totalViews = state.properties.reduce((sum, p) => sum + p.views, 0);

    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">Dashboard</h1>
                <p class="page-subtitle">Welcome back, Tobi. Here is your portfolio overview.</p>
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
                            <tr><th>Property</th><th>Type</th><th>Price</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${state.properties.slice(0, 5).map(p => `
                                <tr>
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

// ==================== AGENT: LISTINGS ====================
function renderAgentListings(container) {
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
                        ${state.properties.length === 0 ? `
                            <tr><td colspan="8">
                                <div class="empty-state">
                                    <div class="empty-state__icon">${icons.home}</div>
                                    <h3 class="empty-state__title">No Listings Yet</h3>
                                    <p class="empty-state__text">Start by adding your first property listing.</p>
                                    <button class="btn btn--primary" onclick="openAddModal()">${icons.plus} Add Property</button>
                                </div>
                            </td></tr>
                        ` : state.properties.map(p => `
                            <tr>
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

// ==================== AGENT: ANALYTICS ====================
function renderAgentAnalytics(container) {
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

// ==================== AGENT: ACTIVITY ====================
function renderAgentActivity(container) {
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

// ==================== USER: DASHBOARD ====================
function renderUserDashboard(container) {
    const savedCount = state.savedProperties.length;
    const recentCount = state.recentViews.length;

    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">My Dashboard</h1>
                <p class="page-subtitle">Your personalized property experience starts here.</p>
            </div>
            <button class="btn btn--primary" onclick="navigateTo('browse')">
                ${icons.search} Browse Properties
            </button>
        </div>

        <div class="grid grid--4 stagger-children">
            <div class="card card--stat">
                <div class="stat-icon stat-icon--primary">${icons.eye}</div>
                <div class="stat-value">${recentCount}</div>
                <div class="stat-label">Properties Viewed</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--accent">${icons.heart}</div>
                <div class="stat-value">${savedCount}</div>
                <div class="stat-label">Saved Properties</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--info">${icons.message}</div>
                <div class="stat-value">${state.properties.filter(p => p.inquiries > 0).length}</div>
                <div class="stat-label">Active Inquiries</div>
            </div>
            <div class="card card--stat">
                <div class="stat-icon stat-icon--success">${icons.home}</div>
                <div class="stat-value">${state.properties.length}</div>
                <div class="stat-label">Available Listings</div>
            </div>
        </div>

        <div class="grid grid--2" style="margin-top: 32px;">
            <div class="card animate-fade-in">
                <div class="card-header">
                    <h3 class="card-title">Recommended For You</h3>
                    <button class="btn btn--sm btn--secondary" onclick="navigateTo('browse')">Browse All</button>
                </div>
                <div class="recent-views-list">
                    ${state.properties.slice(0, 4).map(p => `
                        <div class="recent-view-item" onclick="openPropertyDetails('${p.id}')">
                            <div class="recent-view-thumb">${icons.home}</div>
                            <div class="recent-view-info">
                                <div class="recent-view-title">${p.title}</div>
                                <div class="recent-view-location">${p.location}</div>
                            </div>
                            <div class="recent-view-price">${p.price}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card animate-fade-in">
                <div class="card-header">
                    <h3 class="card-title">Recent Views</h3>
                    <button class="btn btn--sm btn--secondary" onclick="navigateTo('recent')">View All</button>
                </div>
                <div class="recent-views-list">
                    ${state.recentViews.length === 0 ? `
                        <div class="empty-state" style="padding: 40px 0;">
                            <div class="empty-state__icon">${icons.eye}</div>
                            <h3 class="empty-state__title">No Recent Views</h3>
                            <p class="empty-state__text">Start browsing to see properties here.</p>
                        </div>
                    ` : state.recentViews.slice(0, 5).map(id => {
        const p = state.properties.find(x => x.id === id);
        if (!p) return '';
        return `
                            <div class="recent-view-item" onclick="openPropertyDetails('${p.id}')">
                                <div class="recent-view-thumb">${icons.home}</div>
                                <div class="recent-view-info">
                                    <div class="recent-view-title">${p.title}</div>
                                    <div class="recent-view-location">${p.location}</div>
                                </div>
                                <div class="recent-view-price">${p.price}</div>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// ==================== USER: BROWSE ====================
function renderUserBrowse(container) {
    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">Browse Properties</h1>
                <p class="page-subtitle">Discover your next home from our curated collection.</p>
            </div>
        </div>

        <div class="search-bar animate-fade-in">
            <div class="search-bar__input-wrap">
                ${icons.search}
                <input type="text" class="search-bar__input" id="searchInput" placeholder="Search by title, location, or type...">
            </div>
            <div class="search-bar__filters">
                <select class="filter-select" id="filterType">
                    <option value="">All Types</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Commercial">Commercial</option>
                </select>
                <select class="filter-select" id="filterListing">
                    <option value="">All Listings</option>
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                </select>
                <select class="filter-select" id="filterStatus">
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>
        </div>

        <div class="grid grid--3" id="browseGrid">
            ${renderPropertyCards(state.properties)}
        </div>
    `;

    const searchInput = $('#searchInput');
    const filterType = $('#filterType');
    const filterListing = $('#filterListing');
    const filterStatus = $('#filterStatus');

    const doFilter = () => {
        const q = searchInput.value.toLowerCase();
        const t = filterType.value;
        const l = filterListing.value;
        const s = filterStatus.value;

        const filtered = state.properties.filter(p => {
            const matchQ = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
            const matchT = !t || p.type === t;
            const matchL = !l || p.listingType === l;
            const matchS = !s || p.status === s;
            return matchQ && matchT && matchL && matchS;
        });

        $('#browseGrid').innerHTML = renderPropertyCards(filtered);
    };

    searchInput?.addEventListener('input', doFilter);
    filterType?.addEventListener('change', doFilter);
    filterListing?.addEventListener('change', doFilter);
    filterStatus?.addEventListener('change', doFilter);
}

function renderPropertyCards(properties) {
    if (properties.length === 0) {
        return `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state__icon">${icons.search}</div>
                <h3 class="empty-state__title">No Properties Found</h3>
                <p class="empty-state__text">Try adjusting your search or filters.</p>
            </div>
        `;
    }
    return properties.map(p => {
        const isSaved = state.savedProperties.includes(p.id);
        return `
            <div class="property-card animate-fade-in" data-id="${p.id}">
                <div class="property-card__image">
                    <div class="property-card__image-pattern"></div>
                    <div class="property-card__image-icon">${icons.home}</div>
                    <span class="listing-badge listing-badge--${p.listingType.toLowerCase()} property-card__image-badge">${p.listingType}</span>
                    <button class="property-card__image-fav ${isSaved ? 'active' : ''}" onclick="event.stopPropagation(); toggleSave('${p.id}')" title="${isSaved ? 'Remove from saved' : 'Save property'}">
                        ${icons.heart}
                    </button>
                </div>
                <div class="property-card__content">
                    <div class="property-card__price">${p.price}</div>
                    <div class="property-card__title">${p.title}</div>
                    <div class="property-card__location">
                        ${icons.mapPin} ${p.location}
                    </div>
                    <div class="property-card__meta">
                        <div class="property-card__meta-item">${icons.tag} ${p.type}</div>
                        <div class="property-card__meta-item">${icons.eye} ${p.views} views</div>
                    </div>
                </div>
                <div class="property-card__actions">
                    <button class="btn btn--secondary btn--sm" style="flex:1;" onclick="event.stopPropagation(); openPropertyDetails('${p.id}')">
                        ${icons.eye} View Details
                    </button>
                    <button class="btn btn--primary btn--sm" style="flex:1;" onclick="event.stopPropagation(); openInquiryModal('${p.id}')">
                        ${icons.message} Inquire
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== USER: SAVED ====================
function renderUserSaved(container) {
    const saved = state.properties.filter(p => state.savedProperties.includes(p.id));

    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">Saved Properties</h1>
                <p class="page-subtitle">Your favorite listings, all in one place.</p>
            </div>
        </div>

        <div class="saved-grid" id="savedGrid">
            ${saved.length === 0 ? `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state__icon">${icons.heart}</div>
                    <h3 class="empty-state__title">No Saved Properties</h3>
                    <p class="empty-state__text">Browse properties and click the heart icon to save them here.</p>
                    <button class="btn btn--primary" onclick="navigateTo('browse')">${icons.search} Browse Now</button>
                </div>
            ` : renderPropertyCards(saved)}
        </div>
    `;
}

// ==================== USER: RECENT VIEWS ====================
function renderUserRecent(container) {
    const recent = state.recentViews.map(id => state.properties.find(p => p.id === id)).filter(Boolean);

    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">Recent Views</h1>
                <p class="page-subtitle">Properties you have recently explored.</p>
            </div>
        </div>

        <div class="card animate-fade-in">
            <div class="recent-views-list" style="padding: 8px 0;">
                ${recent.length === 0 ? `
                    <div class="empty-state" style="padding: 40px 0;">
                        <div class="empty-state__icon">${icons.eye}</div>
                        <h3 class="empty-state__title">No Recent Views</h3>
                        <p class="empty-state__text">Start browsing to track your viewed properties.</p>
                        <button class="btn btn--primary" onclick="navigateTo('browse')">${icons.search} Browse Properties</button>
                    </div>
                ` : recent.map(p => `
                    <div class="recent-view-item" onclick="openPropertyDetails('${p.id}')">
                        <div class="recent-view-thumb">${icons.home}</div>
                        <div class="recent-view-info">
                            <div class="recent-view-title">${p.title}</div>
                            <div class="recent-view-location">${p.location}</div>
                        </div>
                        <div class="recent-view-price">${p.price}</div>
                        <button class="btn btn--icon btn--secondary" onclick="event.stopPropagation(); openInquiryModal('${p.id}')" title="Inquire">
                            ${icons.message}
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== USER: INQUIRIES ====================
function renderUserInquiries(container) {
    container.innerHTML = `
        <div class="page-header animate-fade-in">
            <div>
                <h1 class="page-title">My Inquiries</h1>
                <p class="page-subtitle">Track all your property inquiries and messages.</p>
            </div>
        </div>

        <div class="card animate-fade-in">
            <div class="empty-state" style="padding: 60px 0;">
                <div class="empty-state__icon">${icons.inbox}</div>
                <h3 class="empty-state__title">No Inquiries Yet</h3>
                <p class="empty-state__text">Send an inquiry on any property to start a conversation with the agent.</p>
                <button class="btn btn--primary" onclick="navigateTo('browse')">${icons.search} Browse Properties</button>
            </div>
        </div>
    `;
}

// ==================== PROPERTY ACTIONS ====================
function toggleSave(propId) {
    const idx = state.savedProperties.indexOf(propId);
    if (idx > -1) {
        state.savedProperties.splice(idx, 1);
        showToast('Removed from saved properties', 'info');
    } else {
        state.savedProperties.push(propId);
        showToast('Added to saved properties', 'success');
    }
    renderSidebar();
    if (state.currentPage === 'saved' || state.currentPage === 'browse') renderPage();
}

function openPropertyDetails(propId) {
    const p = state.properties.find(x => x.id === propId);
    if (!p) return;

    const rvIdx = state.recentViews.indexOf(propId);
    if (rvIdx > -1) state.recentViews.splice(rvIdx, 1);
    state.recentViews.unshift(propId);
    if (state.recentViews.length > 20) state.recentViews.pop();

    const isSaved = state.savedProperties.includes(propId);
    const modal = $('#propertyDetailsModal');
    $('#detailTitle').textContent = p.title;
    $('#detailBody').innerHTML = `
        <div class="detail-header">
            <div>
                <div class="detail-price">${p.price}</div>
                <div class="detail-meta">
                    <span class="listing-badge listing-badge--${p.listingType.toLowerCase()}">${p.listingType}</span>
                    ${renderStatusBadge(p.status)}
                    <span style="color:var(--nutral-gray-color);font-size:var(--text-size-sm)">${p.type}</span>
                </div>
            </div>
            <button class="property-card__image-fav ${isSaved ? 'active' : ''}" onclick="toggleSave('${p.id}'); this.classList.toggle('active')" style="position:static;" title="${isSaved ? 'Remove from saved' : 'Save property'}">
                ${icons.heart}
            </button>
        </div>

        <div class="detail-section">
            <h4 class="detail-section-title">${icons.mapPin} Location</h4>
            <p class="detail-description">${p.location}</p>
        </div>

        <div class="detail-section">
            <h4 class="detail-section-title">Description</h4>
            <p class="detail-description">${p.description}</p>
        </div>

        <div class="detail-section">
            <h4 class="detail-section-title">Property Details</h4>
            <div class="detail-info-grid">
                <div class="detail-info-item">
                    <span class="detail-info-label">Property Type</span>
                    <span class="detail-info-value">${p.type}</span>
                </div>
                <div class="detail-info-item">
                    <span class="detail-info-label">Listing Type</span>
                    <span class="detail-info-value">${p.listingType}</span>
                </div>
                <div class="detail-info-item">
                    <span class="detail-info-label">Status</span>
                    <span class="detail-info-value">${p.status}</span>
                </div>
                <div class="detail-info-item">
                    <span class="detail-info-label">Listed On</span>
                    <span class="detail-info-value">${p.createdAt}</span>
                </div>
                <div class="detail-info-item">
                    <span class="detail-info-label">Views</span>
                    <span class="detail-info-value">${p.views}</span>
                </div>
                <div class="detail-info-item">
                    <span class="detail-info-label">Inquiries</span>
                    <span class="detail-info-value">${p.inquiries}</span>
                </div>
            </div>
        </div>

        <div class="form-actions" style="margin-top: 24px;">
            <button class="btn btn--secondary" onclick="closeModal('propertyDetailsModal')">Close</button>
            <button class="btn btn--primary" onclick="closeModal('propertyDetailsModal'); openInquiryModal('${p.id}')">
                ${icons.message} Send Inquiry
            </button>
        </div>
    `;

    modal.classList.add('active');
}

// ==================== MODALS ====================
function openAddModal() {
    $('#addPropertyForm').reset();
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
    $('#editPropDescription').value = p.description;
    $('#editPropertyModal').classList.add('active');
}

function openInquiryModal(propId) {
    $('#inquiryForm').reset();
    $('#inquiryPropId').value = propId;
    $('#inquiryModal').classList.add('active');
}

function closeModal(modalId) {
    $(`#${modalId}`).classList.remove('active');
}

// ==================== PROPERTY CRUD ====================
function addProperty(data) {
    const newProp = {
        id: 'prop-' + Date.now(),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        views: 0,
        inquiries: 0
    };
    state.properties.unshift(newProp);
    state.activities.unshift({
        id: Date.now(),
        type: 'listing',
        text: `Listed <strong>${data.title}</strong> for ${data.price}`,
        time: 'Just now',
        icon: 'home'
    });
    showToast('Property listed successfully!', 'success');
    renderSidebar();
    renderPage();
}

function updateProperty(id, data) {
    const idx = state.properties.findIndex(p => p.id === id);
    if (idx === -1) return;
    state.properties[idx] = { ...state.properties[idx], ...data };
    state.activities.unshift({
        id: Date.now(),
        type: 'edit',
        text: `Updated <strong>${data.title}</strong>`,
        time: 'Just now',
        icon: 'edit'
    });
    showToast('Property updated successfully!', 'success');
    renderSidebar();
    renderPage();
}

function deleteProperty(id) {
    const p = state.properties.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`Are you sure you want to delete "${p.title}"?`)) return;
    state.properties = state.properties.filter(x => x.id !== id);
    state.savedProperties = state.savedProperties.filter(x => x !== id);
    state.recentViews = state.recentViews.filter(x => x !== id);
    state.activities.unshift({
        id: Date.now(),
        type: 'edit',
        text: `Deleted <strong>${p.title}</strong>`,
        time: 'Just now',
        icon: 'trash'
    });
    showToast('Property deleted', 'info');
    renderSidebar();
    renderPage();
}

// ==================== TOASTS ====================
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

// ==================== ROLE SWITCHING ====================
function setRole(role) {
    state.role = role;
    state.currentPage = 'dashboard';
    updateRoleUI();
    renderSidebar();
    renderPage();
}

function updateRoleUI() {
    $('#roleAgent').classList.toggle('active', state.role === 'agent');
    $('#roleUser').classList.toggle('active', state.role === 'user');
}

// ==================== EVENT BINDING ====================
function bindEvents() {
    // Role switcher
    $('#roleAgent').addEventListener('click', () => setRole('agent'));
    $('#roleUser').addEventListener('click', () => setRole('user'));

    // Mobile menu
    $('#menuToggle').addEventListener('click', () => {
        $('#sidebar').classList.toggle('open');
    });
    $('#sidebarClose').addEventListener('click', () => {
        $('#sidebar').classList.remove('open');
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
    $('#closeDetailModal').addEventListener('click', () => closeModal('propertyDetailsModal'));
    $('#closeInquiryModal').addEventListener('click', () => closeModal('inquiryModal'));
    $('#cancelAddBtn').addEventListener('click', () => closeModal('addPropertyModal'));
    $('#cancelEditBtn').addEventListener('click', () => closeModal('editPropertyModal'));
    $('#cancelInquiryBtn').addEventListener('click', () => closeModal('inquiryModal'));

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
            description: $('#propDescription').value
        };
        addProperty(data);
        closeModal('addPropertyModal');
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
            description: $('#editPropDescription').value
        };
        updateProperty(id, data);
        closeModal('editPropertyModal');
    });

    // Inquiry form
    $('#inquiryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const propId = $('#inquiryPropId').value;
        const p = state.properties.find(x => x.id === propId);
        if (p) {
            p.inquiries++;
            state.activities.unshift({
                id: Date.now(),
                type: 'inquiry',
                text: `New inquiry on <strong>${p.title}</strong> from ${$('#inquiryName').value}`,
                time: 'Just now',
                icon: 'message'
            });
        }
        showToast('Inquiry sent successfully!', 'success');
        closeModal('inquiryModal');
        renderSidebar();
        if (state.role === 'agent') renderPage();
    });

    // Keyboard: Escape to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $$('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });
}


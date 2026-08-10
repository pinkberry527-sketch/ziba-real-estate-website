/* ============================================================
   ZIBA USER DASHBOARD — APPLICATION LOGIC
   ============================================================ */

const state = {
    currentPage: 'dashboard',
    // Populated live from Firestore once ZibaDB is ready — was previously
    // captured once at parse time from property.js's global `properties`,
    // which is empty at that instant since Firestore hasn't responded yet.
    properties: [],
    propertiesLoaded: false,
    // Shared with property.html / property_details.html via the same
    // localStorage keys, so saving a property anywhere on the site shows
    // up here too instead of two disconnected "saved" concepts.
    savedProperties: readWishlist(),
    recentViews: readRecentViews()
};

function readWishlist() {
    try { return JSON.parse(localStorage.getItem('zibaWishlist') || '[]'); }
    catch { return []; }
}
function writeWishlist(ids) {
    localStorage.setItem('zibaWishlist', JSON.stringify(ids));
}
function readRecentViews() {
    try { return JSON.parse(localStorage.getItem('zibaRecentViews') || '[]'); }
    catch { return []; }
}
function writeRecentViews(ids) {
    localStorage.setItem('zibaRecentViews', JSON.stringify(ids));
}

const icons = {
    home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    layout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    eye: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    message: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    inbox: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    mapPin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    tag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    checkCircle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    alertTriangle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    updateBadge();
    renderPage();
    bindEvents();

    const waitForDb = setInterval(() => {
        if (typeof window.ZibaDB === 'undefined') return;
        clearInterval(waitForDb);

        window.ZibaDB.watchActiveListings((listings) => {
            state.properties = listings.map(listingToDisplayProperty);
            state.propertiesLoaded = true;
            if (state.currentPage !== 'dashboard') renderPage();
            else renderPage(); // dashboard stats also depend on this data
        });
    }, 100);
}

// Maps a raw Firestore listing onto the shape this dashboard's rendering
// already expects, keeping real values (views/inquiries/createdAt) instead
// of the random placeholder numbers this used to generate.
function listingToDisplayProperty(listing) {
    const createdLabel = listing.createdAt && listing.createdAt.toDate
        ? listing.createdAt.toDate().toLocaleDateString()
        : '--';
    return {
        id: listing.id,
        title: listing.title || 'Untitled property',
        location: listing.location || '',
        price: listing.price || '',
        type: listing.type || '',
        listingType: listing.listingType || 'Sale',
        status: listing.status || 'Active',
        views: listing.views || 0,
        inquiries: listing.inquiries || 0,
        createdAt: createdLabel,
        description: listing.description || '',
        image: listing.image || null,
        uid: listing.uid || null,
        contactName: listing.contactName || listing.agentName || 'Listing agent',
        contactEmail: listing.contactEmail || '',
        contactPhone: listing.contactPhone || ''
    };
}

function updateBadge() {
    $('#userSavedBadge').textContent = state.savedProperties.length;
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
        'browse': 'Browse Properties',
        'saved': 'Saved Properties',
        'recent': 'Recent Views',
        'inquiries': 'My Inquiries'
    };
    return titles[page] || 'Dashboard';
}

function renderPage() {
    const content = $('#content');
    content.innerHTML = '';
    switch (state.currentPage) {
        case 'dashboard': renderDashboard(content); break;
        case 'browse': renderBrowse(content); break;
        case 'saved': renderSaved(content); break;
        case 'recent': renderRecent(content); break;
        case 'inquiries': renderInquiries(content); break;
        default: renderDashboard(content);
    }
}

function renderDashboard(container) {
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

function renderBrowse(container) {
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
                <div class="property-card__image" style="${p.image ? `background-image: url('${p.image}'); background-size: cover; background-position: center;` : ''}">
                    ${!p.image ? `<div class="property-card__image-pattern"></div>
                    <div class="property-card__image-icon">${icons.home}</div>` : ''}
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

function renderSaved(container) {
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

function renderRecent(container) {
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

function renderInquiries(container) {
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

function toggleSave(propId) {
    const idx = state.savedProperties.indexOf(propId);
    if (idx > -1) {
        state.savedProperties.splice(idx, 1);
        showToast('Removed from saved properties', 'info');
    } else {
        state.savedProperties.push(propId);
        showToast('Added to saved properties', 'success');
    }
    writeWishlist(state.savedProperties);
    updateBadge();
    if (state.currentPage === 'saved' || state.currentPage === 'browse') renderPage();
}

function openPropertyDetails(propId) {
    const p = state.properties.find(x => x.id === propId);
    if (!p) return;

    const rvIdx = state.recentViews.indexOf(propId);
    if (rvIdx > -1) state.recentViews.splice(rvIdx, 1);
    state.recentViews.unshift(propId);
    if (state.recentViews.length > 20) state.recentViews.pop();
    writeRecentViews(state.recentViews);

    const isSaved = state.savedProperties.includes(propId);
    const modal = $('#propertyDetailsModal');
    $('#detailTitle').textContent = p.title;
    $('#detailBody').innerHTML = `
        ${p.image ? `<img src="${p.image}" alt="${p.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">` : ''}
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
            <h4 class="detail-section-title">Listed by</h4>
            <p class="detail-description">${p.contactName}${p.contactEmail ? ` &middot; <a href="mailto:${p.contactEmail}">${p.contactEmail}</a>` : ''}${p.contactPhone ? ` &middot; <a href="tel:${p.contactPhone}">${p.contactPhone}</a>` : ''}</p>
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

function renderStatusBadge(status) {
    const slug = status.toLowerCase();
    return `<span class="status-badge status-badge--${slug}">${status}</span>`;
}

function openInquiryModal(propId) {
    $('#inquiryForm').reset();
    $('#inquiryPropId').value = propId;
    if (typeof window.ZibaDB !== 'undefined') {
        const user = window.ZibaDB.getCurrentUser();
        if (user) $('#inquiryEmail').value = user.email;
    }
    $('#inquiryModal').classList.add('active');
}

function closeModal(modalId) {
    $(`#${modalId}`).classList.remove('active');
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

    // Close modals on overlay click
    $$('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });

    // Close modal buttons
    $('#closeDetailModal').addEventListener('click', () => closeModal('propertyDetailsModal'));
    $('#closeInquiryModal').addEventListener('click', () => closeModal('inquiryModal'));
    $('#cancelInquiryBtn').addEventListener('click', () => closeModal('inquiryModal'));

    // Inquiry form
    $('#inquiryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const propId = $('#inquiryPropId').value;
        const p = state.properties.find(x => x.id === propId);
        if (!p) return;

        if (typeof window.ZibaDB === 'undefined') {
            showToast('Not connected — try refreshing the page', 'error');
            return;
        }
        const user = window.ZibaDB.getCurrentUser();
        if (!user) {
            showToast('Please sign in to send an inquiry', 'error');
            closeModal('inquiryModal');
            window.location.href = 'login.html';
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;

        window.ZibaDB.submitInquiry({
            listingId: p.id,
            listingTitle: p.title,
            agentUid: p.uid,
            buyerUid: user.uid,
            name: $('#inquiryName').value.trim(),
            email: $('#inquiryEmail').value.trim(),
            phone: $('#inquiryPhone').value.trim(),
            message: $('#inquiryMessage').value.trim()
        }).then(() => {
            showToast('Inquiry sent successfully!', 'success');
            closeModal('inquiryModal');
        }).catch((err) => {
            console.error('Could not send inquiry:', err);
            showToast('Could not send your inquiry — try again', 'error');
        }).finally(() => {
            btn.disabled = false;
        });
    });

    // Keyboard: Escape to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $$('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });
}
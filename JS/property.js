/* ============================================================
   ZIBA — property browsing, filtering, wishlist, and details.
   Now backed by real Firestore listings instead of a static array.
   ============================================================ */

// Populated live from Firestore — starts empty until the first snapshot
// arrives, same reactive shape the rest of this file already expects.
let properties = [];

const NO_PHOTO_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
  '<rect width="400" height="300" fill="#E5E7EB"/>' +
  '<path d="M150 190l35-45 25 30 35-50 55 65H150z" fill="#9CA3AF"/>' +
  '<circle cx="170" cy="110" r="18" fill="#9CA3AF"/>' +
  '</svg>'
);

// Maps a raw Firestore listing doc onto the field shape the rest of this
// file (cards, filters, details page) already expects — keeps everything
// below unchanged rather than rewriting every render function.
function mapListingToProperty(listing) {
  const listingTypeToCategory = { Sale: 'sales', Rent: 'lease', Stay: 'stay' };
  const createdMs = listing.createdAt && listing.createdAt.toMillis ? listing.createdAt.toMillis() : null;
  const isRecent = createdMs ? (Date.now() - createdMs) < (14 * 24 * 60 * 60 * 1000) : false;

  return {
    id: listing.id,
    title: listing.title || 'Untitled property',
    location: listing.location || '',
    price: listing.price || '',
    type: (listing.type || '').toLowerCase(),
    category: listingTypeToCategory[listing.listingType] || 'sales',
    bedrooms: listing.bedrooms || 0,
    bathrooms: listing.bathrooms || 0,
    size: listing.size || 0,
    furnished: listing.furnished || 'No',
    serviced: listing.serviced || 'No',
    image: listing.image || NO_PHOTO_SVG,
    badge: isRecent ? 'NEW' : '',
    description: listing.description || '',
    longDescription: listing.description || '',
    // Passed straight through for the details page's contact/report UI —
    // not used by the card grid, but kept on the same object rather than
    // doing a second lookup later.
    uid: listing.uid || null,
    contactName: listing.contactName || listing.agentName || 'Listing agent',
    contactEmail: listing.contactEmail || '',
    contactPhone: listing.contactPhone || ''
  };
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('zibaWishlist') || '[]');
  } catch {
    return [];
  }
}


function setWishlist(items) {
  localStorage.setItem('zibaWishlist', JSON.stringify(items));
}

function updateWishlistCount() {
  const count = getWishlist().length;
  const badge = document.getElementById('wishlistCount');
  if (badge) badge.textContent = count;
}

function isInWishlist(id) {
  return getWishlist().includes(id);
}

function toggleWishlist(id) {
  const items = getWishlist();
  const index = items.indexOf(id);
  if (index === -1) {
    items.push(id);
  } else {
    items.splice(index, 1);
  }
  setWishlist(items);
  updateWishlistCount();
  updateWishlistButtons();
}

function renderPropertyCards() {
  const list = document.getElementById('propertyList');
  if (!list) return;

  if (!properties.length) {
    list.innerHTML = `<p class="no-results" style="padding:40px 0;text-align:center;color:#6B7280;">No properties listed yet — check back soon.</p>`;
    return;
  }

  list.innerHTML = properties.map((property) => {
    return `
      <div class="card" data-id="${property.id}" data-location="${property.location}" data-category="${property.category}" data-type="${property.type}" data-bedrooms="${property.bedrooms}" data-bathrooms="${property.bathrooms}" data-size="${property.size}" data-price="${Number(String(property.price).replace(/[^0-9]/g, ''))}" data-furnished="${property.furnished.toLowerCase()}" data-serviced="${property.serviced.toLowerCase()}">
        <div class="card-image">
          <img src="${property.image}" alt="${property.title}">
          <div class="card-badges">
            <span class="badge">${property.badge}</span>
            <button class="wishlist-btn wishlist-icon" data-id="${property.id}" aria-label="Add to wishlist"><i class="fa fa-heart"></i></button>
          </div>
          <div class="price">${property.price}</div>
        </div>
        <div class="card-content">
          <h3>${property.title}</h3>
          <p class="location">${property.location}</p>
          <div class="features">
            <span>${property.bedrooms} Bed</span>
            <span>${property.bathrooms} Bath</span>
            <span>${property.size} sqm</span>
          </div>
          <div class="card-actions">
            <a href="property_details.html?id=${property.id}" class="view-btn">View Property</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  attachWishlistEvents();
  updateWishlistButtons();
}

function updateWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach((button) => {
    const id = button.dataset.id;
    if (!id) return;
    const active = isInWishlist(id);
    button.classList.toggle('active', active);

    if (button.classList.contains('wishlist-icon')) {
      button.innerHTML = `<i class="fa fa-heart"></i>`;
    } else {
      button.innerHTML = `<i class="fa fa-heart"></i> ${active ? 'Saved' : 'Add to wishlist'}`;
    }
  });

  if (document.querySelector('.wishlist-dropdown.open')) {
    renderWishlistSummary();
  }
}

function getWishlistProperties() {
  return getWishlist()
    .map((id) => properties.find((property) => property.id === id))
    .filter(Boolean);
}

function renderWishlistSummary() {
  const dropdown = document.getElementById('wishlistDropdown');
  const itemsContainer = document.getElementById('wishlistItems');
  const emptyMessage = document.querySelector('.wishlist-empty');
  if (!dropdown || !itemsContainer || !emptyMessage) return;

  const wishlistProperties = getWishlistProperties();
  itemsContainer.innerHTML = wishlistProperties
    .map((property) => {
      return `
        <div class="wishlist-item">
          <img src="${property.image}" alt="${property.title}">
          <div class="wishlist-item-info">
            <a class="wishlist-item-title" href="property_details.html?id=${property.id}">${property.title}</a>
            <span class="wishlist-item-location">${property.location}</span>
            <span class="wishlist-item-price">${property.price}</span>
          </div>
        </div>
      `;
    })
    .join('');

  emptyMessage.style.display = wishlistProperties.length ? 'none' : 'block';
  if (!wishlistProperties.length) {
    itemsContainer.innerHTML = '';
  }
}

function toggleWishlistDropdown() {
  const dropdown = document.getElementById('wishlistDropdown');
  const button = document.querySelector('.wishlist-summary-btn');
  if (!dropdown || !button) return;

  const show = !dropdown.classList.contains('open');
  dropdown.classList.toggle('open', show);
  button.setAttribute('aria-expanded', show.toString());
  dropdown.setAttribute('aria-hidden', (!show).toString());

  if (show) {
    renderWishlistSummary();
  }
}

function closeWishlistDropdown() {
  const dropdown = document.getElementById('wishlistDropdown');
  const button = document.querySelector('.wishlist-summary-btn');
  if (!dropdown || !button) return;

  dropdown.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
  dropdown.setAttribute('aria-hidden', 'true');
}

function clearWishlist() {
  setWishlist([]);
  updateWishlistCount();
  updateWishlistButtons();
  renderWishlistSummary();
}

function attachWishlistEvents() {
  document.querySelectorAll('.wishlist-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const propertyId = button.dataset.id;
      if (!propertyId) return;
      toggleWishlist(propertyId);
    });
  });
}

function filterProperties(event) {
  if (event) event.preventDefault();

  const locationValue = document.getElementById('location')?.value.trim().toLowerCase() || '';
  const categoryValue = document.getElementById('category')?.value.trim().toLowerCase() || '';
  const typeValue = document.getElementById('types')?.value.toLowerCase() || '';
  const bedroomValue = document.getElementById('bedroom')?.value.toLowerCase() || '';
  const minPriceValue = document.getElementById('min-price')?.value.replace(/[^0-9]/g, '') || '';
  const maxPriceValue = document.getElementById('max-price')?.value.replace(/[^0-9]/g, '') || '';
  const furnishedValue = document.getElementById('furnished')?.value.toLowerCase() || '';
  const servicedValue = document.getElementById('serviced')?.value.toLowerCase() || '';

let resultCount = 0;
    document.querySelectorAll('.property-list .card').forEach((card) => {
    const cardLocation = card.dataset.location?.toLowerCase() || '';
    const cardCategory = card.dataset.category?.toLowerCase() || '';
    const cardType = card.dataset.type?.toLowerCase() || '';
    const cardBedrooms = card.dataset.bedrooms?.toLowerCase() || '';
    const cardPrice = Number(card.dataset.price || card.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || '0');
    const cardFurnished = card.dataset.furnished?.toLowerCase() || '';
    const cardServiced = card.dataset.serviced?.toLowerCase() || '';

    const locationMatches = locationValue ? cardLocation.includes(locationValue) : true;
    const categoryMatches = categoryValue ? cardCategory.includes(categoryValue) : true;
    const typeMatches = typeValue ? cardType.includes(typeValue) : true;
    const bedroomMatches = bedroomValue ? Number(cardBedrooms) >= Number(bedroomValue) : true;
    const minPriceMatches = minPriceValue ? cardPrice >= Number(minPriceValue) : true;
    const maxPriceMatches = maxPriceValue ? cardPrice <= Number(maxPriceValue) : true;
    const furnishedMatches = furnishedValue ? cardFurnished === furnishedValue : true;
    const servicedMatches = servicedValue ? cardServiced === servicedValue : true;

    const showCard = locationMatches && categoryMatches && typeMatches && bedroomMatches && minPriceMatches && maxPriceMatches && furnishedMatches && servicedMatches;
    card.style.display = showCard ? 'block' : 'none';
    if (showCard) resultCount += 1;
  });

  const summaryText = resultCount > 0 ? `Result 1-${resultCount} of ${resultCount}` : 'No results found';
  document.querySelectorAll('.properties-main .pagination p').forEach((paragraph) => {
    paragraph.textContent = summaryText;
  });

  const displayLocation = document.getElementById('location')?.value.trim() || 'Lagos';
  let displayCategory = document.getElementById('category')?.value.trim() || 'Sale';
  
  if (displayCategory.toLowerCase().includes('sale')) displayCategory = 'For Sale';
  else if (displayCategory.toLowerCase().includes('leas')) displayCategory = 'For Rent';
  else if (displayCategory.toLowerCase().includes('stay')) displayCategory = 'For Stay';
  else displayCategory = 'For Sale';

  const capitalizedLocation = displayLocation.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const newTitle = `Property ${displayCategory} In ${capitalizedLocation}`;

  document.querySelectorAll('.sale-header-content h1').forEach(h1 => {
    h1.textContent = newTitle;
  });
}

/* ---------- Property details page: fetched fresh, not from the shared
   array — a one-time read is simpler and faster than waiting on a live
   collection sync for a page that only needs one document. ---------- */
function renderPropertyDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('propertyDetails');
  if (!id) return;

  if (typeof window.ZibaDB === 'undefined') {
    if (container) container.innerHTML = '<p>Could not connect — please refresh the page.</p>';
    return;
  }

  window.ZibaDB.getListing(id).then((listing) => {
    if (!listing) {
      if (container) container.innerHTML = '<p>Property not found. Please return to the listings.</p>';
      return;
    }

    const property = mapListingToProperty(listing);

    document.getElementById('detailImage').src = property.image;
    document.getElementById('detailTitle').textContent = property.title;
    document.getElementById('detailLocation').textContent = property.location;
    document.getElementById('detailPrice').textContent = property.price;
    document.getElementById('detailDescription').textContent = property.description;
    document.getElementById('detailLongDescription').textContent = property.longDescription;
    document.getElementById('detailBedrooms').textContent = property.bedrooms;
    document.getElementById('detailBathrooms').textContent = property.bathrooms;
    document.getElementById('detailSize').textContent = `${property.size} sqm`;
    document.getElementById('detailType').textContent = property.type;
    document.getElementById('detailBadge').textContent = property.badge;

    const detailWishlistBtn = document.getElementById('detailWishlistBtn');
    if (detailWishlistBtn) {
      detailWishlistBtn.dataset.id = property.id;
      detailWishlistBtn.classList.toggle('active', isInWishlist(property.id));
      detailWishlistBtn.innerHTML = isInWishlist(property.id) ? '<i class="fa fa-heart"></i> Saved' : '<i class="fa fa-heart"></i> Add to wishlist';
      detailWishlistBtn.addEventListener('click', () => {
        toggleWishlist(property.id);
        detailWishlistBtn.classList.toggle('active', isInWishlist(property.id));
        detailWishlistBtn.innerHTML = isInWishlist(property.id) ? '<i class="fa fa-heart"></i> Saved' : '<i class="fa fa-heart"></i> Add to wishlist';
      });
    }

    renderAgentContact(property);
    window.ZibaDB.incrementListingViews(id); // best-effort, not awaited
  }).catch((err) => {
    console.error('Could not load property:', err);
    if (container) container.innerHTML = '<p>Something went wrong loading this property. Please try again.</p>';
  });
}

/* ---------- Agent contact card + report-agent modal (property_details.html) ---------- */

function renderAgentContact(property) {
  const wrap = document.getElementById('agentContactCard');
  if (!wrap) return; // page doesn't have this section — nothing to do

  const emailLink = property.contactEmail
    ? `<a href="mailto:${property.contactEmail}"><i class="fa fa-envelope"></i> ${property.contactEmail}</a>`
    : '<span class="agent-contact-missing">Email not provided</span>';
  const phoneLink = property.contactPhone
    ? `<a href="tel:${property.contactPhone}"><i class="fa fa-phone"></i> ${property.contactPhone}</a>`
    : '<span class="agent-contact-missing">Phone not provided</span>';

  wrap.innerHTML = `
    <h3>Listed by</h3>
    <p class="agent-contact-name">${property.contactName}</p>
    <div class="agent-contact-links">
      ${emailLink}
      ${phoneLink}
    </div>
    <button type="button" class="report-agent-btn" id="reportAgentBtn">
      <i class="fa fa-flag"></i> Report this listing
    </button>
  `;

  document.getElementById('reportAgentBtn')?.addEventListener('click', () => openReportModal(property));
}

function openReportModal(property) {
  if (typeof window.ZibaDB === 'undefined') return;

  const user = window.ZibaDB.getCurrentUser();
  if (!user) {
    alert('Please sign in to report a listing.');
    window.location.href = 'login.html';
    return;
  }

  const existing = document.getElementById('reportModalOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'reportModalOverlay';
  overlay.className = 'report-modal-overlay';
  overlay.innerHTML = `
    <div class="report-modal">
      <button type="button" class="report-modal-close" id="reportModalClose" aria-label="Close">&times;</button>
      <h3>Report this listing</h3>
      <p>Let us know if something looks wrong — our team reviews every report.</p>
      <form id="reportForm">
        <label for="reportReason">Reason</label>
        <select id="reportReason" required>
          <option value="">Select a reason</option>
          <option value="Fraud or scam">Fraud or scam</option>
          <option value="Misleading listing">Misleading listing</option>
          <option value="Inappropriate content">Inappropriate content</option>
          <option value="Agent unresponsive or unprofessional">Agent unresponsive or unprofessional</option>
          <option value="Other">Other</option>
        </select>
        <label for="reportDetails">Details</label>
        <textarea id="reportDetails" rows="4" placeholder="Tell us more (optional)"></textarea>
        <button type="submit" class="report-submit-btn">Submit report</button>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('reportModalClose').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const reason = document.getElementById('reportReason').value;
    const details = document.getElementById('reportDetails').value.trim();
    const btn = e.target.querySelector('.report-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    window.ZibaDB.submitReport({
      listingId: property.id,
      listingTitle: property.title,
      agentUid: property.uid,
      agentName: property.contactName,
      reporterUid: user.uid,
      reporterEmail: user.email,
      reason,
      details: details || 'No further details provided',
      createdAtLabel: new Date().toLocaleString()
    }).then(() => {
      overlay.innerHTML = `<div class="report-modal"><p>Thanks — our team will look into this.</p></div>`;
      setTimeout(() => overlay.remove(), 1800);
    }).catch((err) => {
      console.error('Could not submit report:', err);
      btn.disabled = false;
      btn.textContent = 'Submit report';
      alert('Could not submit your report — please try again.');
    });
  });
}

function attachMobileNavToggle() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open.toString());
  });
}

function initSlider() {
  const slides = document.querySelectorAll('.slider .slide');
  if (slides.length === 0) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000);
}

function waitForZibaDB(callback) {
  if (typeof window.ZibaDB !== 'undefined') { callback(); return; }
  const check = setInterval(() => {
    if (typeof window.ZibaDB === 'undefined') return;
    clearInterval(check);
    callback();
  }, 100);
}

function initializePage() {
  updateWishlistCount();
  initSlider();

  if (document.getElementById('propertyList')) {
    waitForZibaDB(() => {
      window.ZibaDB.watchActiveListings((listings) => {
        properties = listings.map(mapListingToProperty);
        renderPropertyCards();
        filterProperties();
      });
    });

    // Pre-fill search inputs from URL parameters if present
    const params = new URLSearchParams(window.location.search);
    if (params.has('location')) {
      const locInput = document.getElementById('location');
      if (locInput) locInput.value = params.get('location');
    }
    if (params.has('type')) {
      const typeInput = document.getElementById('types');
      if (typeInput) typeInput.value = params.get('type');
    }
    if (params.has('category')) {
      const catInput = document.getElementById('category');
      if (catInput) catInput.value = params.get('category');
    }

    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', filterProperties);
    }
  }

  if (document.getElementById('propertyDetails')) {
    waitForZibaDB(renderPropertyDetails);
  }

  const wishlistSummaryBtn = document.querySelector('.wishlist-summary-btn');
  if (wishlistSummaryBtn) {
    wishlistSummaryBtn.addEventListener('click', (event) => {
      event.preventDefault();
      toggleWishlistDropdown();
    });
  }

  const clearWishlistBtn = document.querySelector('.wishlist-clear');
  if (clearWishlistBtn) {
    clearWishlistBtn.addEventListener('click', clearWishlist);
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav_extra') && !event.target.closest('.wishlist-dropdown') && !event.target.closest('.nav-toggle')) {
      closeWishlistDropdown();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeWishlistDropdown();
    }
  });

  attachMobileNavToggle();
}

document.addEventListener('DOMContentLoaded', initializePage);
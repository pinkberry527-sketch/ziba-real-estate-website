const properties = [
  {
    id: 'property-1',
    title: 'Luxury 5-Bedroom Duplex',
    location: 'V.I, Lagos',
    price: '#750,000,000',
    type: 'Duplex',
    category: 'For Sale',
    bedrooms: 5,
    bathrooms: 6,
    size: 1075,
    furnished: 'No',
    serviced: 'No',
    image: '../asset/img1.jpg',
    badge: 'NEW',
    description: 'A premium duplex with private terraces, large living spaces, and elegant finishes. Ideal for family living or investment in Lagos.',
    longDescription: 'This stunning duplex offers expansive rooms, ample natural light, and polished interiors. Close to major amenities and designed for modern lifestyle comfort without sacrificing luxury.'
  },
  {
    id: 'property-2',
    title: 'Luxury 4-Bedroom Duplex',
    location: 'V.I, Lagos',
    price: '#900,000,000',
    type: 'Duplex',
    category: 'For Sale',
    bedrooms: 4,
    bathrooms: 5,
    size: 1425,
    furnished: 'No',
    serviced: 'No',
    image: '../asset/img2.jpg',
    badge: 'NEW',
    description: 'A grand 4-bedroom duplex situated in a prime Lagos neighborhood, with generous amenities and luxurious finishes.',
    longDescription: 'Beautiful design meets comfort in this high-end duplex property. Spacious bedrooms, premium fixtures, and a location that delivers convenience and prestige.'
  },
  {
    id: 'property-3',
    title: 'Luxury 5-Bedroom Terrace Duplex',
    location: 'Lekki, Lagos',
    price: '#350,000,000',
    type: 'Terrace Duplex',
    category: 'For Sale',
    bedrooms: 5,
    bathrooms: 5,
    size: 175,
    furnished: 'No',
    serviced: 'No',
    image: '../asset/img3.avif',
    badge: 'NEW',
    description: 'A modern terrace duplex in Lekki designed for comfort and quality living. Excellent for families and long-term ownership.',
    longDescription: 'Smart layout, beautiful exterior lines, and thoughtful finishes define this terrace duplex. It is a strong value for buyers who want style and functionality.'
  },
  {
    id: 'property-4',
    title: 'Luxury 4-Bedroom Terrace Duplex',
    location: 'Lekki, Lagos',
    price: '#150,000,000',
    type: 'Terrace Duplex',
    category: 'For Sale',
    bedrooms: 4,
    bathrooms: 5,
    size: 125,
    furnished: 'No',
    serviced: 'No',
    image: '../asset/img4.jpg',
    badge: 'NEW',
    description: 'An affordable terrace duplex with high-end exterior finishes and a welcoming, open living layout.',
    longDescription: 'This property balances quality and value. It offers the kind of design and comfort expected from a modern Lekki residence while remaining grounded in efficiency and practicality.'
  },
  {
    id: 'property-5',
    title: 'Luxury 4-Bedroom Duplex',
    location: 'Lekki, Lagos',
    price: '#180,000,000',
    type: 'Duplex',
    category: 'For Sale',
    bedrooms: 4,
    bathrooms: 4,
    size: 175,
    furnished: 'No',
    serviced: 'No',
    image: '../asset/img5.jpg',
    badge: 'NEW',
    description: 'A premium 4-bedroom duplex with smart living space and a premium Lagos address.',
    longDescription: 'Clean lines, quality finishes, and a functional design make this property excellent for both families and investors. The layout is bright and easy to maintain.'
  },
  {
    id: 'property-6',
    title: 'Luxury 4-Bedroom Duplex',
    location: 'Lekki, Lagos',
    price: '#150,000,000',
    type: 'Duplex',
    category: 'For Sale',
    bedrooms: 4,
    bathrooms: 4,
    size: 175,
    furnished: 'No',
    serviced: 'No',
    image: '../asset/img6.jpeg',
    badge: 'NEW',
    description: 'High-quality duplex offering comfortable living areas and a strong location near Lekki amenities.',
    longDescription: 'A warm and practical property with modern finishes. It suits buyers seeking a solid investment with an attractive, well-balanced floor plan.'
  },
  {
    id: 'property-7',
    title: 'Luxury 4-Bedroom Duplex',
    location: 'V.I, Lagos',
    price: '#350,000,000',
    type: 'Duplex',
    category: 'For Sale',
    bedrooms: 4,
    bathrooms: 4,
    size: 175,
    furnished: 'No',
    serviced: 'No',
    image: '../asset/img1.jpg',
    badge: 'NEW',
    description: 'A refined duplex located in Victoria Island with balanced living and entertainment areas.',
    longDescription: 'This property features a polished layout and premium finishes suitable for a discerning buyer. It presents an attractive residence with strong location value.'
  },
  {
    id: 'property-8',
    title: 'Luxury 5-Bedroom Duplex',
    location: 'Lekki, Lagos',
    price: '#250,000,000',
    type: 'Duplex',
    category: 'For Sale',
    bedrooms: 5,
    bathrooms: 6,
    size: 1275,
    furnished: 'No',
    serviced: 'No',
    image: '../asset/img2.jpg',
    badge: 'NEW',
    description: 'A spacious 5-bedroom duplex with generous room sizes and a commanding Lekki address.',
    longDescription: 'The strong design, bright interiors, and comfortable layout make this property ideal for larger families or buyers seeking long term value in Lagos.'
  }
];

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

  list.innerHTML = properties.map((property) => {
    return `
      <div class="card" data-id="${property.id}" data-location="${property.location}" data-category="${property.category}" data-type="${property.type}" data-bedrooms="${property.bedrooms}" data-bathrooms="${property.bathrooms}" data-size="${property.size}" data-price="${Number(property.price.replace(/[^0-9]/g, ''))}" data-furnished="${property.furnished.toLowerCase()}" data-serviced="${property.serviced.toLowerCase()}">
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
            <a href="property-details.html?id=${property.id}" class="view-btn">View Property</a>
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
            <a class="wishlist-item-title" href="property-details.html?id=${property.id}">${property.title}</a>
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
    const bedroomMatches = bedroomValue ? cardBedrooms === bedroomValue : true;
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
}

function renderPropertyDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const property = properties.find((item) => item.id === id);
  if (!property) {
    document.getElementById('propertyDetails').innerHTML = '<div><p>Property not found. Please return to the listings.</p></div>';
    return;
  }

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

function initializePage() {
  updateWishlistCount();

  if (window.location.pathname.endsWith('lp.html') || window.location.pathname.endsWith('/')) {
    renderPropertyCards();
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', filterProperties);
      filterProperties();
    }
  }

  if (window.location.pathname.endsWith('property-details.html')) {
    renderPropertyDetails();
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

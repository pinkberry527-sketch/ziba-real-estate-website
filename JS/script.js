const counters = document.querySelectorAll(".counter");
const statSection = document.getElementById("stat-section");
let started = false;

if (statSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If the section is in view and we haven't started yet
        if (entry.isIntersecting && !started) {
          started = true; // Make sure the animation only runs once

          counters.forEach((counter) => {
            const updateCount = () => {
              const target = +counter.getAttribute("data-target");
              const count = +counter.innerText.replace("+", "");

              // Calculate increment size based on target (makes all counters finish around the same time)
              const inc = target / 200;

              if (count < target) {
                // Add increment, update DOM, and set a tiny delay for next frame
                counter.innerText = Math.ceil(count + inc) + "+";
                setTimeout(updateCount, 10);
              } else {
                // Ensure we land exactly on the target number
                counter.innerText = target + "+";
              }
            };

            updateCount();
          });
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the section is visible
    },
  );

  observer.observe(statSection);
}
// Populated live from Firestore's real listings — replaces the old
// hardcoded sample array. Shows the newest active listings first.
let propertyList = [];

const featuredList = document.getElementById("featured_list");
const filterItems = document.querySelectorAll(".filter_item[data-type]");

const NO_PHOTO_SVG_FEATURED = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
  '<rect width="400" height="300" fill="#E5E7EB"/>' +
  '<path d="M150 190l35-45 25 30 35-50 55 65H150z" fill="#9CA3AF"/>' +
  '<circle cx="170" cy="110" r="18" fill="#9CA3AF"/>' +
  '</svg>'
);

function mapListingToFeatured(listing) {
  return {
    id: listing.id,
    property: listing.title || 'Untitled property',
    location: listing.location || '',
    price: listing.price || '',
    Type: listing.type || '',
    category: listing.listingType === 'Rent' ? 'Leasing' : (listing.listingType === 'Stay' ? 'Stay' : 'Sales'),
    image: listing.image || NO_PHOTO_SVG_FEATURED,
  };
}

const renderProperties = (properties) => {
  if (!featuredList) return;

  if (!properties.length) {
    featuredList.innerHTML = `<p style="padding:24px;color:#6B7280;">No properties listed yet — check back soon.</p>`;
    return;
  }

  featuredList.innerHTML = "";
  properties.forEach((property) => {
    featuredList.innerHTML += `
    <div class="list_item">
      <i class="fa-regular fa-heart favorite_icon" data-id="${property.id}"></i>
      <img src="${property.image}" alt="${property.property}" />
      <div class="list_item_content">
        <h3>${property.property}</h3>
        <p>${property.location}</p>
        <p>${property.price}</p>
        <div class="list_item_content_footer">
          <a href="property_details.html?id=${property.id}"><button type="button">View Details</button></a>
        </div>
      </div>
    </div>
    `;
  });
};

// Toggle favorite icon via event delegation — also keeps the shared
// wishlist (used on property.html / property_details.html) in sync, since
// both surfaces read from the same 'zibaWishlist' localStorage key.
if (featuredList) {
  featuredList.addEventListener("click", (e) => {
    if (e.target.classList.contains("favorite_icon")) {
      e.target.classList.toggle("fa-regular");
      e.target.classList.toggle("fa-solid");
      e.target.classList.toggle("filled");

      const id = e.target.dataset.id;
      if (id) {
        try {
          const list = JSON.parse(localStorage.getItem('zibaWishlist') || '[]');
          const idx = list.indexOf(id);
          if (idx === -1) list.push(id); else list.splice(idx, 1);
          localStorage.setItem('zibaWishlist', JSON.stringify(list));
        } catch { /* ignore — wishlist sync is a nice-to-have, not critical */ }
      }
    }
  });
}

function waitForZibaDBFeatured(callback) {
  if (typeof window.ZibaDB !== 'undefined') { callback(); return; }
  const check = setInterval(() => {
    if (typeof window.ZibaDB === 'undefined') return;
    clearInterval(check);
    callback();
  }, 100);
}

if (featuredList) {
  waitForZibaDBFeatured(() => {
    window.ZibaDB.watchActiveListings((listings) => {
      propertyList = listings.slice(0, 12).map(mapListingToFeatured);
      const activeFilter = document.querySelector('.filter_item.active');
      const activeType = activeFilter ? activeFilter.getAttribute('data-type') : 'All';
      applyFeaturedFilter(activeType);
    });
  });
}

function applyFeaturedFilter(type) {
  if (!type || type === 'All') {
    renderProperties(propertyList);
  } else {
    // Substring, case-insensitive match — real listings use whatever type
    // vocabulary the agent picked (House/Apartment/Villa/Land/Commercial/
    // etc.), so this stays robust without needing the two vocabularies to
    // match exactly.
    const needle = type.toLowerCase();
    renderProperties(propertyList.filter((property) =>
      (property.Type || '').toLowerCase().includes(needle) || needle.includes((property.Type || '').toLowerCase())
    ));
  }
}

filterItems.forEach((item) => {
  item.addEventListener("click", () => {
    filterItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    applyFeaturedFilter(item.getAttribute("data-type"));
  });
});

const menuToggle = document.getElementById("mobile_nav_btn");
const mobileMenu = document.querySelector(".mobile_nav");
const closeMenu = document.getElementById("mobile_nav_close");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

if (closeMenu) {
  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
}

const faqItems = document.querySelectorAll(".frequently_asked_questions_item");
faqItems.forEach((item) => {
  const h3 = item.querySelector("h3");
  h3.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

const filterBtn = document.getElementById("filter_btn");
const searchOptions = document.getElementById("search_options");
const closeFilterBtn = document.getElementById("close_filter_btn");

if (filterBtn) {
  filterBtn.addEventListener("click", () => {
    searchOptions.classList.add("active");
  });
}

if (closeFilterBtn) {
  closeFilterBtn.addEventListener("click", () => {
    searchOptions.classList.remove("active");
  });
}

const agentList = [
  {
    agent_name: "John",
    company_name: "John Doe Real Estate",
    image: "../assets/agent1.jpg",
    verified: true,
    phone: "08012345678",
    location: "Ikoyi",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Tayo",
    company_name: "Tayo Real Estate",
    image: "../assets/agent2.jpg",
    verified: true,
    phone: "08012345678",
    location: "Ikoyi",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Tayo",
    company_name: "Tayo Real Estate",
    image: "../assets/agent3.jpg",
    verified: true,
    phone: "08012345678",
    location: "Banana Island",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Tayo",
    company_name: "Tayo Real Estate",
    image: "../assets/agent4.jpg",
    verified: false,
    phone: "08012345678",
    location: "Banana Island",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Tayo",
    company_name: "Tayo Real Estate",
    image: "../assets/agent1.jpg",
    verified: false,
    phone: "08012345678",
    location: "Lekki",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Tayo",
    company_name: "Tayo Real Estate",
    image: "../assets/agent2.jpg",
    verified: true,
    phone: "08012345678",
    location: "Lekki",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Tayo",
    company_name: "Tayo Real Estate",
    image: "../assets/agent3.jpg",
    verified: true,
    phone: "08012345678",
    location: "Eko Atlantic",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Deji",
    company_name: "Deji Real Estate",
    image: "../assets/agent4.jpg",
    verified: true,
    phone: "08012345678",
    location: "Eko Atlantic",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Folake",
    company_name: "Folake Real Estate",
    image: "../assets/agent3.jpg",
    verified: true,
    phone: "08012345678",
    location: "Victoria Island",
    listed: 5,
    rating: 4.5,
  },
  {
    agent_name: "Adekunle",
    company_name: "Adekunle Real Estate",
    image: "../assets/agent2.jpg",
    verified: true,
    phone: "08012345678",
    location: "Victoria Island",
    listed: 5,
    rating: 4.5,
  },
];

const agentsListContainer = document.getElementById("agents_list");
const searhInput = document.getElementById("search");

function renderAgents(agents) {
  if (!agentsListContainer) return;
  agentsListContainer.innerHTML = ""; // Clear container before rendering
  agents.forEach((agent) => {
    const agentCard = document.createElement("div");
    agentCard.classList.add("agent_card");
    agentCard.innerHTML = `
    <div class="agent_card_image">
      <img src="${agent.image}" alt="">
    </div>
    <div class="agent_card_content">
      <h3>${agent.agent_name} ${agent.verified ? "<i class='fa-solid fa-circle-check' style='color: var(--success-color); font-size: 0.8em;'></i>" : ""}</h3>
      <p>${agent.company_name}</p>
      <p>${agent.location}</p>
      <p>${agent.phone}</p>
      <hr>
      <div class="agent_card_content_footer">
        <div class="agent_card_content_footer_listed">
          <i class="fa-solid fa-house"></i>
          <p>${agent.listed}</p>
        </div>
        <div class="agent_card_content_footer_rating">
          <div class="star_rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <p>${agent.rating}</p>

        </div>
        
      </div>
      <div class="agent_card_footer">
        <button>View Details</button>
      </div>
    </div>
    `;
    agentsListContainer.appendChild(agentCard);
  });
}

// Initial render with only the first 4 agents
if (agentsListContainer) {
  renderAgents(agentList.slice(0, 4));
}

// Search functionality
if (searhInput) {
  searhInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm === "") {
      // Revert to default 4 when search is cleared
      renderAgents(agentList.slice(0, 4));
    } else {
      // Filter by agent name or company name
      const filteredAgents = agentList.filter(
        (agent) =>
          agent.agent_name.toLowerCase().includes(searchTerm) ||
          agent.company_name.toLowerCase().includes(searchTerm),
      );
      renderAgents(filteredAgents);
    }
  });
}

// Sidebar Filter functionality
const searchBtn = document.getElementById("search_btn");
const filterLocation = document.getElementById("filter_location");
const filterVerified = document.getElementById("filter_verified");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const locationTerm = filterLocation
      ? filterLocation.value.toLowerCase().trim()
      : "";
    const verifiedStatus = filterVerified ? filterVerified.value : "";

    let filteredAgents = agentList;

    if (locationTerm) {
      filteredAgents = filteredAgents.filter((agent) =>
        agent.location.toLowerCase().includes(locationTerm),
      );
    }

    if (verifiedStatus) {
      const isVerified = verifiedStatus === "true";
      filteredAgents = filteredAgents.filter(
        (agent) => agent.verified === isVerified,
      );
    }

    // Render the filtered agents
    renderAgents(filteredAgents);

    // Optionally close the sidebar after searching
    if (searchOptions) {
      searchOptions.classList.remove("active");
    }
  });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navBar = document.querySelector('.nav_bar');
    if (navBar) {
        if (window.scrollY >= 10) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }
    }
});
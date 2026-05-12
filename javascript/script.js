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
const propertyList = [
  {
    property: "4 Bedroom Duplex",
    location: "Ikoyi",
    price: "$500,000",
    Type: "House",
    category: "Sales",
    image: "../assets/property 1.jpg",
  },
  {
    property: "5 Bedroom Duplex",
    location: "Lekki",
    price: "$250,000",
    Type: "House",
    category: "Sales",
    image: "../assets/property 2.jpg",
  },
  {
    property: "3 Bedroom Duplex",
    location: "Banana Island",
    price: "$1,200,000",
    Type: "House",
    category: "Sales",
    image: "../assets/property 3.jpg",
  },
  {
    property: "100 by 100 plot of land",
    location: "Ibeju-Lekki",
    price: "$150,000",
    Type: "Land",
    category: "Sales",
    image: "../assets/land1.jpg",
  },
  {
    property: "100 by 100 plot of land",
    location: "Epe",
    price: "$100,000",
    Type: "Land",
    category: "Sales",
    image: "../assets/land 2.jpg",
  },
  {
    property: "50 by 100 plot of land",
    location: "Epe",
    price: "$80,000",
    Type: "Land",
    category: "Sales",
    image: "../assets/land 3.jpg",
  },
  {
    property: "4 Bedroom Apartment",
    location: "Ikoyi",
    price: "$500,000",
    Type: "Apartment",
    category: "Sales",
    image: "../assets/app 1.jpg",
  },
  {
    property: "4 Bedroom Apartment",
    location: "Ikoyi",
    price: "$500,000",
    Type: "Apartment",
    category: "Sales",
    image: "../assets/app 2.jpg",
  },
  {
    property: "4 Bedroom Apartment",
    location: "Ikoyi",
    price: "$500,000",
    Type: "Apartment",
    category: "Sales",
    image: "../assets/app 3.jpg",
  },
  {
    property: "office space",
    location: "Victoria Island",
    price: "$500,000",
    Type: "Commercial Property",
    category: "Sales",
    image: "../assets/cp1.jpg",
  },
  {
    property: "office space",
    location: "Victoria Island",
    price: "$500,000",
    Type: "Commercial Property",
    category: "Sales",
    image: "../assets/cp 2.jpg",
  },
  {
    property: "office space",
    location: "Victoria Island",
    price: "$500,000",
    Type: "Commercial Property",
    category: "Sales",
    image: "../assets/cp 3.jpg",
  },
];
const featuredList = document.getElementById("featured_list");
const filterItems = document.querySelectorAll(".filter_item[data-type]");

const renderProperties = (properties) => {
  if (!featuredList) return;
  featuredList.innerHTML = "";
  properties.forEach((property) => {
    featuredList.innerHTML += `
    <div class="list_item">
      <i class="fa-regular fa-heart favorite_icon"></i>
      <img src="${property.image}" alt="" />
      <div class="list_item_content">
        <h3>${property.property}</h3>
        <p>${property.location}</p>
        <p>${property.price}</p>
        <div class="list_item_content_footer">
          <button>View Details</button>
        </div>
      </div>
    </div>
    `;
  });
};

// Toggle favorite icon via event delegation
if (featuredList) {
  featuredList.addEventListener("click", (e) => {
    if (e.target.classList.contains("favorite_icon")) {
      e.target.classList.toggle("fa-regular");
      e.target.classList.toggle("fa-solid");
      e.target.classList.toggle("filled");
    }
  });
}

// Initial render of all properties
renderProperties(propertyList);

filterItems.forEach((item) => {
  item.addEventListener("click", () => {
    filterItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const type = item.getAttribute("data-type");
    let filteredProperties;

    if (type === "All" || !type) {
      filteredProperties = propertyList;
    } else {
      filteredProperties = propertyList.filter(
        (property) => property.Type === type,
      );
    }

    renderProperties(filteredProperties);
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

const counters = document.querySelectorAll('.counter');
const statSection = document.getElementById('stat-section');
let started = false;

if (statSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // If the section is in view and we haven't started yet
      if (entry.isIntersecting && !started) {
        started = true; // Make sure the animation only runs once

        counters.forEach((counter) => {
          const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace('+', '');
            
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
  }, { 
    threshold: 0.5 // Trigger when 50% of the section is visible
  }); 

  observer.observe(statSection);
}
const propertyList=[
  {
    property:"4 Bedroom Duplex",
    location:"Ikoyi",
    price: "$500,000",
    Type:"House",
    category:"Sales",
    image:"../assets/property 1.jpg"  
  },
  {
    property:"5 Bedroom Duplex",
    location:"Lekki",
    price: "$250,000",
    Type:"House",
    category:"Sales",
    image:"../assets/property 2.jpg"
  },
  {
    property:"3 Bedroom Duplex",
    location:"Banana Island",
    price: "$1,200,000",
    Type:"House",
    category:"Sales",
    image:"../assets/property 3.jpg"
  },
  {
    property:"100 by 100 plot of land",
    location:"Ibeju-Lekki",
    price: "$150,000",
    Type:"Land",
    category:"Sales",
    image:"../assets/land1.jpg"
  },
  {
    property:"100 by 100 plot of land",
    location:"Epe",
    price: "$100,000",
    Type:"Land",
    category:"Sales",
    image:"../assets/land 2.jpg"
  },
  {
    property:"50 by 100 plot of land",
    location:"Epe",
    price: "$80,000",
    Type:"Land",
    category:"Sales",
    image:"../assets/land 3.jpg"
  },
  {
    property:"4 Bedroom Apartment",
    location:"Ikoyi",
    price: "$500,000",
    Type:"Apartment",
    category:"Sales",
    image:"../assets/app 1.jpg"
  },
  {
    property:"4 Bedroom Apartment",
    location:"Ikoyi",
    price: "$500,000",
    Type:"Apartment",
    category:"Sales",
    image:"../assets/app 2.jpg"
  },
  {
    property:"4 Bedroom Apartment",
    location:"Ikoyi",
    price: "$500,000",
    Type:"Apartment",
    category:"Sales",
    image:"../assets/app 3.jpg"
  },
  {
    property:"office space",
    location:"Victoria Island",
    price: "$500,000",
    Type:"Commercial Property",
    category:"Sales",
    image:"../assets/cp1.jpg"
  },
  {
    property:"office space",
    location:"Victoria Island",
    price: "$500,000",
    Type:"Commercial Property",
    category:"Sales",
    image:"../assets/cp 2.jpg"
  },
  {
    property:"office space",
    location:"Victoria Island",
    price: "$500,000",
    Type:"Commercial Property",
    category:"Sales",
    image:"../assets/cp 3.jpg"
  }
]
const featuredList = document.getElementById("featured_list");
const filterItems = document.querySelectorAll(".filter_item[data-type]");

const renderProperties = (properties) => {
  if (!featuredList) return;
  featuredList.innerHTML = "";
  properties.forEach(property => {
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

filterItems.forEach(item => {
  item.addEventListener("click", () => {
    filterItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    
    const type = item.getAttribute("data-type");
    let filteredProperties;
    
    if (type === "All" || !type) {
      filteredProperties = propertyList;
    } else {
      filteredProperties = propertyList.filter(property => property.Type === type);
    }
    
    renderProperties(filteredProperties);
  });
});

// State Management
let cart = JSON.parse(localStorage.getItem('freshbasket_cart')) || [];
let activeCategory = 'all';
let searchQuery = '';
let shopPhoneNumber = localStorage.getItem('freshbasket_whatsapp_num') || '+919876543210';
let currentTheme = localStorage.getItem('freshbasket_theme') || 'light';

// Location & Mapping State
let userCoordinates = null;
let leafletMap = null;
let leafletMarker = null;

// Constant Constants
const DELIVERY_FEE = 40;

// Initialize Web App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderCategories();
  renderProducts();
  updateCartUI();
  setupEventListeners();
  initWhatsappConfigFields();
});

// Theme Management
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  const themeToggleIcon = document.querySelector('#theme-toggle-btn span');
  if (themeToggleIcon) {
    themeToggleIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('freshbasket_theme', currentTheme);
  
  const themeToggleIcon = document.querySelector('#theme-toggle-btn span');
  if (themeToggleIcon) {
    themeToggleIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }
  
  showToast(`Switched to ${currentTheme} mode`);
}

// Render Category Filter Bar
function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛒' },
    { id: 'fruits', name: 'Fruits', icon: '🍓' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
    { id: 'bakery', name: 'Bakery', icon: '🍞' },
    { id: 'pantry', name: 'Pantry & Brew', icon: '☕' }
  ];

  container.innerHTML = categories.map(cat => `
    <button class="category-btn ${activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.icon}</span>
      <span>${cat.name}</span>
    </button>
  `).join('');

  // Add click listeners to category buttons
  container.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });
}

// Render Products Grid
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // Filter products based on search query and active category
  let filtered = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🔍</span>
        <h3 class="empty-title">No products found</h3>
        <p class="empty-subtitle">Try adjusting your search query or filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    // Create badges
    let badgeHTML = '';
    if (!product.inStock) {
      badgeHTML = `<span class="product-badge out-of-stock">Out of Stock</span>`;
    } else if (product.badge) {
      const badgeClass = product.badge.toLowerCase().replace(/\s+/g, '-');
      badgeHTML = `<span class="product-badge ${badgeClass}">${product.badge}</span>`;
    }

    // Stars render helper
    const fullStars = Math.floor(product.rating);
    const starsHTML = '⭐'.repeat(fullStars) + (product.rating % 1 !== 0 ? '✨' : '');

    return `
      <div class="product-card" id="product-${product.id}">
        ${badgeHTML}
        <div class="product-card-top">
          ${product.image}
        </div>
        <div class="product-category">${product.category}</div>
        <h3 class="product-name" title="${product.name}">${product.name}</h3>
        <div class="product-rating">
          ${starsHTML} <span class="rating-num">${product.rating}</span>
          <span class="product-reviews">(${product.reviews})</span>
        </div>
        <p class="product-desc" title="${product.description}">${product.description}</p>
        
        <div class="product-card-bottom">
          <div class="product-price-wrapper">
            <span class="product-price">₹${product.price}</span>
            <span class="product-unit">${product.unit}</span>
          </div>
          
          <div class="action-btn-container">
            ${!product.inStock 
              ? `<button class="btn-add-cart disabled" disabled>Unavailable</button>`
              : quantity > 0 
                ? `
                  <div class="qty-selector">
                    <button class="qty-btn minus" onclick="updateQty(${product.id}, -1)">−</button>
                    <span class="qty-count">${quantity}</span>
                    <button class="qty-btn plus" onclick="updateQty(${product.id}, 1)">+</button>
                  </div>
                `
                : `<button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <span>+</span> Add
                   </button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Shopping Cart Actions
window.addToCart = (productId) => {
  const product = products.find(p => p.id === productId);
  if (!product || !product.inStock) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      unit: product.unit
    });
  }

  saveCart();
  updateCartUI();
  renderProducts();
  
  // Bounce animation on header cart button
  const cartBtn = document.getElementById('header-cart-btn');
  if (cartBtn) {
    cartBtn.classList.add('bounce-animation');
    setTimeout(() => cartBtn.classList.remove('bounce-animation'), 400);
  }

  showToast(`Added ${product.name} to cart`);
};

window.updateQty = (productId, change) => {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += change;

  if (cart[itemIndex].quantity <= 0) {
    const itemName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    showToast(`Removed ${itemName} from cart`);
  }

  saveCart();
  updateCartUI();
  renderProducts();
};

function saveCart() {
  localStorage.setItem('freshbasket_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartBadge = document.getElementById('cart-badge');
  const cartCountText = document.getElementById('cart-count-text');
  const cartList = document.getElementById('cart-items-list');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartDelivery = document.getElementById('cart-delivery');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Count items
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartBadge) {
    cartBadge.textContent = itemCount;
    cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
  }
  if (cartCountText) {
    cartCountText.textContent = `${itemCount} Item${itemCount !== 1 ? 's' : ''}`;
  }

  // Calculate prices
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
  if (cartDelivery) cartDelivery.textContent = subtotal > 0 ? `₹${delivery}` : `₹0`;
  if (cartTotal) cartTotal.textContent = `₹${total}`;

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }

  // Render items list
  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div style="text-align: center; margin-top: 3rem; color: var(--text-muted);">
        <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">🛒</span>
        <h4 style="margin-bottom: 0.5rem; color: var(--text-main);">Your cart is empty</h4>
        <p style="font-size: 0.875rem;">Browse products and add them to your cart to checkout.</p>
      </div>
    `;
    return;
  }

  cartList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">${item.image}</div>
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-price-desc">₹${item.price} × ${item.quantity} ${item.unit}</div>
        <div style="margin-top: 0.5rem;">
          <div class="qty-selector" style="display: inline-flex; scale: 0.9; transform-origin: left center;">
            <button class="qty-btn minus" onclick="updateQty(${item.id}, -1)">−</button>
            <span class="qty-count">${item.quantity}</span>
            <button class="qty-btn plus" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
      </div>
      <div class="cart-item-total">₹${item.price * item.quantity}</div>
    </div>
  `).join('');
}

// Geolocation & Mapping Handler
function detectUserLocation() {
  const detectBtn = document.getElementById('detect-location-btn');
  const locationBadge = document.getElementById('location-badge');
  const coordinatesText = document.getElementById('coordinates-text');
  const mapContainer = document.getElementById('map-container');

  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by your browser", "error");
    return;
  }

  detectBtn.classList.add('loading');
  detectBtn.disabled = true;
  detectBtn.innerHTML = `<span>⏳</span> Detecting...`;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      updateLocationState(lat, lng, accuracy);
      showToast("Location successfully captured!");
    },
    (error) => {
      detectBtn.classList.remove('loading');
      detectBtn.disabled = false;
      detectBtn.innerHTML = `<span>📍</span> Detect Location`;
      
      let errMsg = "Unable to retrieve your location.";
      if (error.code === error.PERMISSION_DENIED) {
        errMsg = "Location permission denied. Please enter details manually or enable GPS.";
      }
      showToast(errMsg, "error");
      
      // Keep UI updated for empty location
      if (locationBadge) {
        locationBadge.className = 'location-badge empty';
        locationBadge.innerHTML = '<span>❌</span> Detection Failed';
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function updateLocationState(lat, lng, accuracy, isFromDrag = false) {
  userCoordinates = { lat, lng };
  
  const detectBtn = document.getElementById('detect-location-btn');
  const locationBadge = document.getElementById('location-badge');
  const coordinatesText = document.getElementById('coordinates-text');
  const mapContainer = document.getElementById('map-container');
  const formLatInput = document.getElementById('checkout-lat');
  const formLngInput = document.getElementById('checkout-lng');

  // Fill hidden or read-only form elements
  if (formLatInput) formLatInput.value = lat.toFixed(6);
  if (formLngInput) formLngInput.value = lng.toFixed(6);

  // Update button look
  if (detectBtn) {
    detectBtn.classList.remove('loading');
    detectBtn.disabled = false;
    detectBtn.innerHTML = `<span>📍</span> Recalibrate Location`;
  }

  // Update success badge
  if (locationBadge) {
    locationBadge.className = 'location-badge success';
    locationBadge.innerHTML = `<span>✅</span> Location Attached`;
  }

  // Show Coordinates display text
  if (coordinatesText) {
    coordinatesText.innerHTML = `Captured Coordinates: <strong>${lat.toFixed(6)}, ${lng.toFixed(6)}</strong> (drag pin to refine)`;
  }

  // Load Map Container
  if (mapContainer) {
    mapContainer.style.display = 'block';
    
    // Let Leaflet know map size might have changed since display block
    setTimeout(() => {
      initOrUpdateLeafletMap(lat, lng);
    }, 100);
  }
}

function initOrUpdateLeafletMap(lat, lng) {
  if (leafletMap) {
    // Map exists, pan to new location and place marker
    leafletMap.setView([lat, lng], 16);
    if (leafletMarker) {
      leafletMarker.setLatLng([lat, lng]);
    } else {
      createDraggableMarker(lat, lng);
    }
  } else {
    // Initialize map
    leafletMap = L.map('map-container').setView([lat, lng], 16);
    
    // Add default OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);

    createDraggableMarker(lat, lng);
  }
}

function createDraggableMarker(lat, lng) {
  // Use custom Green Leaflet Marker icon to fit theme
  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  leafletMarker = L.marker([lat, lng], { 
    draggable: true,
    icon: greenIcon
  }).addTo(leafletMap);
  
  leafletMarker.bindPopup("<b>Delivery Spot</b><br>Drag this to mark your exact doorstep.").openPopup();

  // Listen to drag event on marker
  leafletMarker.on('dragend', () => {
    const latlng = leafletMarker.getLatLng();
    updateLocationState(latlng.lat, latlng.lng, null, true);
  });
}

// WhatsApp Order Builder & Dispatcher
function handleOrderSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const landmark = document.getElementById('checkout-landmark').value.trim();
  const notes = document.getElementById('checkout-notes').value.trim();

  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  if (!name || !phone || !address) {
    showToast("Please fill in all mandatory fields", "error");
    return;
  }

  // Construct items summary
  let itemsText = "";
  let subtotal = 0;
  cart.forEach(item => {
    const itemCost = item.price * item.quantity;
    subtotal += itemCost;
    itemsText += `• ${item.quantity}x ${item.name} (${item.unit}) - ₹${itemCost}\n`;
  });

  const total = subtotal + DELIVERY_FEE;

  // Format delivery address
  let deliveryDetails = `${address}`;
  if (landmark) {
    deliveryDetails += ` (Landmark: ${landmark})`;
  }

  // Add Location Sharing details
  let locationText = "Not Shared (Standard delivery address only)";
  if (userCoordinates) {
    const mapsLink = `https://www.google.com/maps?q=${userCoordinates.lat},${userCoordinates.lng}`;
    locationText = `📍 Click to view map: ${mapsLink}`;
  }

  // Construct final WhatsApp Message Template
  const orderMessage = 
`🛒 *NEW DELIVERY ORDER - FRESHBASKET* 🛒
----------------------------------
👤 *CUSTOMER DETAILS:*
• *Name:* ${name}
• *Phone:* ${phone}
• *Address:* ${deliveryDetails}

📍 *DELIVERY LOCATION GPS:*
${locationText}
----------------------------------
📦 *ITEMS ORDERED:*
${itemsText}
----------------------------------
💵 *ORDER SUMMARY:*
• Subtotal: ₹${subtotal}
• Delivery Fee: ₹${DELIVERY_FEE}
• *GRAND TOTAL: ₹${total}*
• *Payment Method:* Cash on Delivery (COD)

${notes ? `💬 *SPECIAL NOTES:* \n"${notes}"` : ''}
----------------------------------
Thank you for shopping with FreshBasket!`;

  // Encode message
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(shopPhoneNumber)}&text=${encodeURIComponent(orderMessage)}`;
  
  // Open WhatsApp
  window.open(whatsappUrl, '_blank');

  // Success Feedback
  showToast("Order compiled! Redirecting to WhatsApp...");
  
  // Clear cart on success
  cart = [];
  saveCart();
  updateCartUI();
  renderProducts();

  // Close Checkout Modal
  closeCheckoutModal();
}

// Event Listeners Registration
function setupEventListeners() {
  // Search bar
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Cart Drawer open/close
  const cartBtn = document.getElementById('header-cart-btn');
  const cartClose = document.getElementById('cart-close-btn');
  const cartOverlay = document.getElementById('cart-overlay');

  if (cartBtn && cartOverlay) {
    cartBtn.addEventListener('click', () => {
      cartOverlay.classList.add('open');
    });
  }

  if (cartClose && cartOverlay) {
    cartClose.addEventListener('click', () => {
      cartOverlay.classList.remove('open');
    });
  }

  // Close overlays on clicking background
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        cartOverlay.classList.remove('open');
      }
    });
  }

  // Checkout modal open/close
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutClose = document.getElementById('checkout-close-btn');

  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener('click', () => {
      // Close cart drawer first
      if (cartOverlay) cartOverlay.classList.remove('open');
      
      checkoutModal.classList.add('open');
      // Set default focus
      setTimeout(() => document.getElementById('checkout-name')?.focus(), 150);
    });
  }

  if (checkoutClose && checkoutModal) {
    checkoutClose.addEventListener('click', () => {
      closeCheckoutModal();
    });
  }

  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        closeCheckoutModal();
      }
    });
  }

  // Geolocation button
  const detectBtn = document.getElementById('detect-location-btn');
  if (detectBtn) {
    detectBtn.addEventListener('click', detectUserLocation);
  }

  // Order Form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleOrderSubmit);
  }

  // Settings Panel triggers
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const settingsClose = document.getElementById('settings-close-btn');

  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('open');
    });
  }

  if (settingsClose && settingsModal) {
    settingsClose.addEventListener('click', () => {
      settingsModal.classList.remove('open');
    });
  }

  // Theme Toggle Button
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

function closeCheckoutModal() {
  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutModal) {
    checkoutModal.classList.remove('open');
  }
}

// Toast Utility
function showToast(message, type = "success") {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '🟢' : '🔴'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation reflow
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove toast after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Config Panel Helpers for Whatsapp testing
function initWhatsappConfigFields() {
  const inputs = document.querySelectorAll('.config-whatsapp-input');
  const btns = document.querySelectorAll('.btn-save-whatsapp');

  inputs.forEach(input => {
    input.value = shopPhoneNumber;
  });

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const formWrapper = e.target.closest('.whatsapp-config-wrapper');
      const input = formWrapper.querySelector('.config-whatsapp-input');
      const newNum = input.value.trim();
      
      if (newNum) {
        shopPhoneNumber = newNum;
        localStorage.setItem('freshbasket_whatsapp_num', newNum);
        
        // Sync any other inputs
        document.querySelectorAll('.config-whatsapp-input').forEach(inp => {
          inp.value = newNum;
        });

        showToast(`WhatsApp phone set to: ${newNum}`);
        
        // Close modal if open
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) settingsModal.classList.remove('open');
      } else {
        showToast("Phone number cannot be empty!", "error");
      }
    });
  });
}

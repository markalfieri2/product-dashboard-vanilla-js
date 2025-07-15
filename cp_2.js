/**
 * Technology Products Dashboard
 * Fetches and displays product data with error handling
 */

// Global variable to store products
let techProducts = [];

/**
 * Custom error handler for displaying user-friendly messages
 * @param {string} message - Error message to display
 */
function handleError(message) {
  const container = document.querySelector("#product-container");
  container.innerHTML = `
    <div class="error-message" style="
      text-align: center; 
      padding: 2rem; 
      background: rgba(255, 0, 0, 0.1); 
      border: 2px solid #ff4444; 
      border-radius: 10px; 
      color: #cc0000;
      font-size: 1.2rem;
    ">
      <h2>⚠️ Error Loading Products</h2>
      <p>${message}</p>
      <button onclick="location.reload()" style="
        margin-top: 1rem; 
        padding: 0.5rem 1rem; 
        background: #ff4444; 
        color: white; 
        border: none; 
        border-radius: 5px; 
        cursor: pointer;
      ">Try Again</button>
    </div>
  `;
}

/**
 * Promise-based fetch implementation using .then() and .catch()
 * Fetches product data from JSON file
 */
function fetchProductsPromise() {
  console.log("🔄 Fetching products using Promise-based approach...");
  
  fetch('./products.json')
    .then(response => {
      console.log("📡 Response received:", response.status);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    })
    .then(data => {
      console.log("✅ Products loaded successfully:", data.length, "items");
      techProducts = data;
      displayProducts();
    })
    .catch(error => {
      console.error("❌ Promise fetch error:", error);
      handleError(`Failed to load products: ${error.message}`);
    });
}

/**
 * Async/Await fetch implementation with try/catch
 * Alternative method for fetching product data
 */
async function fetchProductsAsync() {
  console.log("🔄 Fetching products using Async/Await approach...");
  
  try {
    // Fetch data from JSON file
    const response = await fetch('./products.json');
    
    console.log("📡 Response received:", response.status);
    
    // Check if response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse JSON data
    const data = await response.json();
    
    console.log("✅ Products loaded successfully:", data.length, "items");
    
    // Store products and display them
    techProducts = data;
    displayProducts();
    
  } catch (error) {
    console.error("❌ Async/Await fetch error:", error);
    
    // Handle different types of errors
    if (error.name === 'TypeError') {
      handleError("Network error - please check your connection and try again.");
    } else {
      handleError(`Failed to load products: ${error.message}`);
    }
  }
}

/**
 * Renders product cards to the DOM
 * Creates clickable product cards with hover effects
 */
function displayProducts() {
  console.log("🎨 Rendering", techProducts.length, "products...");
  
  const container = document.querySelector("#product-container");
  
  // Check if products exist
  if (!techProducts || techProducts.length === 0) {
    handleError("No products available to display.");
    return;
  }
  
  // Generate HTML for all products
  container.innerHTML = `
    <div class="products-grid">
      ${techProducts.map((product, index) => `
        <div class="product-card" 
             onclick="window.open('${product.amazonLink}', '_blank')" 
             title="Buy on Amazon"
             data-product-id="${index}">
          <img src="${product.image}" 
               alt="${product.name}" 
               loading="lazy" 
               onerror="this.src='https://via.placeholder.com/300x200/ccc/666?text=Image+Not+Found'"
               style="width: 100%; height: 200px; object-fit: contain; background: white;"/>
          <h3>${product.name}</h3>
          <p class="specs">${product.specs}</p>
          <p class="category">${product.category}</p>
          <p class="price">$${(product.price / 100).toFixed(2)}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  console.log("✅ Products rendered successfully!");
}

/**
 * Initialize the application when DOM is fully loaded
 * Uses async/await method by default, with promise fallback
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log("🚀 Technology Products Dashboard initialized");
  
  // Show loading message
  const container = document.querySelector("#product-container");
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem; font-size: 1.2rem;">
      <div style="display: inline-block; animation: spin 1s linear infinite;">⏳</div>
      Loading products...
    </div>
  `;
  
  // Try async/await first, fall back to promises if needed
  try {
    fetchProductsAsync();
  } catch (error) {
    console.warn("Async method failed, trying Promise method...");
    fetchProductsPromise();
  }
});

// Add spinning animation for loading indicator
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);


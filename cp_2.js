function fetchProductsThen() {
  fetch("https://www.course-api.com/javascript-store-products")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((product) => {
        console.log(product.name);
      });
    })
    .catch((error) => {
      console.error("Fetch failed:", error.message);
    });
}

async function fetchProductsAsync() {
  try {
    const response = await fetch("https://www.course-api.com/javascript-store-products");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    displayProducts(data);
  } catch (error) {
    handleError(error);
  }
}

// Add the missing handleError function
function handleError(error) {
  console.error("Error fetching products:", error.message);
  const container = document.querySelector("#product-container");
  if (container) {
    container.innerHTML = '<p>Failed to load products. Please try again later.</p>';
  }
}

function displayProducts(products) {
  const container = document.querySelector("#product-container");
  const sliced = products.slice(0, 5);
  container.innerHTML = ""; // Clear before appending

  sliced.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h2>${product.name}</h2>
      <p>$${(product.price / 100).toFixed(2)}</p>
    `;

    container.appendChild(card);
  });
}

// Only call one of these functions to avoid duplicate requests
// fetchProductsThen();
fetchProductsAsync();


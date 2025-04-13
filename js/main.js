`use strict`;

const products = [
  {
    id: 1,
    name: `Medicube - Collagen Night Wrapping Mask, 75Ml`,
    price: 19.99,
    image: `images/medicube.png`,
  },
  {
    id: 2,
    name: `Bobana- charcoal peel off face mask, 120 gm`,
    price: 10.99,
    image: `images/bobana-charocal-peel.png`,
  },
  {
    id: 3,
    name: `Cosrx The Niacinamide 15 Serum`,
    price: 25.99,
    image: `images/cosrx.png`,
  },
  {
    id: 4,
    name: `DISAAR Beauty Disaar vitamin c face serum 30 ml`,
    price: 13.99,
    image: `images/disaar.png`,
  },
  {
    id: 5,
    name: `Bobana whitening milk mask, with vitamin e 250gm`,
    price: 5.99,
    image: `images/Bobanna-whitening.png`,
  },
  {
    id: 6,
    name: `Star Ville Hyaluronic Acid Serum`,
    price: 21.99,
    image: `images/star-ville.png`,
  },
];

const cart = JSON.parse(localStorage.getItem(`cart`)) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
document.addEventListener("DOMContentLoaded", function (e) {
  const productList = document.getElementById("product-list");
  const cartCount = document.getElementById(`cart-count`);
  const cartModal = document.getElementById(`cart-modal`);
  const closeCartBtn = document.getElementById(`close-cart`);
  const cartItemsContainer = document.getElementById(`cart-items`);
  const cartTotal = document.getElementById(`cart-total`);
  const checkoutBtn = document.getElementById(`checkout-btn`);
  const cartBtn = document.getElementById(`cart-btn`);
  const favoritesBtn = document.getElementById("favorites-btn");
  const favoritesModal = document.getElementById("favorites-modal");
  const closeFavoritesBtn = document.getElementById("close-favorites");

  updateCartCount();

  document.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`add-to-cart`)) {
      const id = parseInt(e.target.dataset.id);
      const existingItem = cart.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        const product = products.find((item) => item.id === id);
        if (product) {
          cart.push({ ...product, quantity: 1 });
        } else {
          console.error(`Product with ID ${id} not found.`);
        }
      }

      updateCartAndRender();
      e.target.textContent = "Added!";
      setTimeout(() => {
        e.target.textContent = "Add to Cart";
      }, 1000);
    }
  });

  function updateCartCount() {
    if (cartCount) {
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalQuantity;
      cartCount.style.display = totalQuantity > 0 ? "inline-block" : "none";
    }
  }

  // Open cart modal
  cartBtn.addEventListener(`click`, () => {
    renderCartItems();
    cartModal.classList.remove(`hidden`);
    document.body.style.overflow = "hidden";
  });

  // Function to close the modal
  const closeModal = () => {
    cartModal.classList.add(`hidden`);
    document.body.style.overflow = "";

    if (cartItemsContainer) {
      cartItemsContainer.removeEventListener("click", handleCartItemInteraction);
    }
  };

  // Close cart with x button
  closeCartBtn.addEventListener(`click`, closeModal);

  // Close cart by clicking on the background overlay
  cartModal.addEventListener(`click`, (e) => {
    if (e.target === cartModal) {
      closeModal();
    }
  });

  // Close cart by pressing ESC key
  document.addEventListener(`keydown`, (e) => {
    if (e.key === `Escape` && !cartModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // render cart iteams
  function renderCartItems() {
    cartItemsContainer.innerHTML = ``;
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class='text-gray-500'>Your cart is empty.</p>`;
      cartTotal.textContent = `0.00`;
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
      return;
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
    let total = 0;

    cartItemsContainer.addEventListener("click", handleCartItemInteraction);

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const itemHTML = `
        <div class="flex items-center justify-between bg-gray-100 p-4 rounded">
          <div class="flex items-center gap-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
            <div>
              <p class="font-semibold">${item.name}</p>
              <p class="text-gray-600 text-sm">$${item.price.toFixed(2)}</p>
            </div>
            </div>
            <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 mt-2">
            <button class="decrease-quantity bg-gray-200 px-2 rounded" data-index="${index}">-</button>
              <span>${item.quantity}</span>
              <button class="increase-quantity bg-gray-200 px-2 rounded" data-index="${index}">+</button>
            </div>
          <button class="remove-item text-red-500 font-bold hover:text-red-700 text-lg" data-index="${index}" aria-label="Remove ${
        item.name
      } from cart">×</button>
          </div>
        </div>
      `;
      cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
    });
    cartTotal.textContent = total.toFixed(2);
  }

  function handleCartItemInteraction(e) {
    const target = e.target;
    const index = parseInt(target.dataset.index);

    if (isNaN(index)) return;

    if (target.classList.contains("increase-quantity")) {
      cart[index].quantity++;
      updateCartAndRender();
    } else if (target.classList.contains("decrease-quantity")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
      updateCartAndRender();
    } else if (target.classList.contains("remove-item")) {
      cart.splice(index, 1);
      updateCartAndRender();
    }
  }
  function updateCartAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    if (!cartModal.classList.contains("hidden")) {
      renderCartItems();
    }
  }

  const searchInput = document.getElementById("search-input");

  function renderProducts(filterTerm = "") {
    productList.innerHTML = "";

    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(filterTerm.toLowerCase())
    );

    if (filteredProducts.length === 0) {
      productList.innerHTML = `<p class="col-span-full text-center text-gray-500">No products found matching "${filterTerm}".</p>`; // Optional: message when no products match
      return;
    }
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    filteredProducts.forEach((product) => {
      const productCard = `<div class="bg-white p-4 rounded shadow hover:shadow-2xl relative">
        
        <button 
      class="favorite-btn absolute top-2 right-2 text-2xl"
      data-id="${product.id}"
      aria-label="${
        favorites.includes(product.id) ? "Remove from favorites" : "Add to favorites"
      }"
    >
      <i class="${
        favorites.includes(product.id) ? "fa-solid text-red-500" : "fa-regular"
      } fa-heart"></i>
    </button>

        <img src="${product.image}" alt="${
        product.name
      }" class="w-full h-96 object-cover rounded">
        <h2 class="mt-2 text-lg font-semibold">${product.name}</h2>
        <p class="text-gray-600">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart mt-4 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-800" data-id="${
          product.id
        }">
          Add to Cart
        </button>
      </div>`;
      productList.insertAdjacentHTML("beforeend", productCard);
    });
  }

  renderProducts();

  searchInput.addEventListener("input", function (e) {
    const filterTerm = e.target.value;
    renderProducts(filterTerm);
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".favorite-btn")) {
      const btn = e.target.closest(".favorite-btn");
      const productId = parseInt(btn.dataset.id);
      const heartIcon = btn.querySelector("i");

      // Toggle favorite
      if (favorites.includes(productId)) {
        favorites = favorites.filter((id) => id !== productId);
        heartIcon.classList.replace("fa-solid", "fa-regular");
        heartIcon.classList.remove("text-red-500");
      } else {
        favorites.push(productId);
        heartIcon.classList.replace("fa-regular", "fa-solid");
        heartIcon.classList.add("text-red-500");
      }

      // Update aria-label and localStorage
      btn.setAttribute(
        "aria-label",
        `${favorites.includes(productId) ? "Remove from favorites" : "Add to favorites"}`
      );
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  });

  favoritesBtn.addEventListener("click", renderFavorites);
  function renderFavorites() {
    const favoritesList = document.getElementById("favorites-list");
    favoritesList.innerHTML = "";

    const favoritedProducts = products.filter((product) => favorites.includes(product.id));

    if (favoritedProducts.length === 0) {
      favoritesList.innerHTML = `<p class="text-gray-500">No favorites yet!</p>`;
      return;
    }

    favoritedProducts.forEach((product) => {
      const favoriteItem = `
      <div class="bg-white p-4 rounded shadow">
        <img src="${product.image}" alt="${
        product.name
      }" class="w-full h-48 object-cover rounded">
        <h3 class="mt-2 font-semibold">${product.name}</h3>
        <p class="text-gray-600">$${product.price.toFixed(2)}</p>
      </div>
    `;
      favoritesList.insertAdjacentHTML("beforeend", favoriteItem);
    });

    favoritesModal.classList.remove("hidden");

    closeFavoritesBtn.addEventListener("click", () => favoritesModal.classList.add("hidden"));

    document.addEventListener(`keydown`, (e) => {
      if (e.key === `Escape`) {
        favoritesModal.classList.add(`hidden`);
      }
    });
    favoritesModal.addEventListener("click", (e) => {
      if (e.target === favoritesModal) {
        favoritesModal.classList.add("hidden");
      }
    });
  }
});

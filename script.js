
// =============================================
// GRWS — GET READY WITH US
// E-COMMERCE WEBSITE JAVASCRIPT
// =============================================


// 1. MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}


// 2. SEARCH BAR
const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

if (searchToggle && searchPanel) {
  searchToggle.addEventListener("click", () => {
    searchPanel.classList.toggle("active");

    if (searchPanel.classList.contains("active")) {
      searchInput.focus();
    }
  });
}

function searchProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const products = document.querySelectorAll(".product-card");

  let matchCount = 0;

  products.forEach(product => {
    const productName =
      product.querySelector("h3")?.textContent.toLowerCase() || "";

    const category =
      product.querySelector(".product-category")?.textContent.toLowerCase() || "";

    const isMatch =
      productName.includes(query) || category.includes(query);

    product.style.display = isMatch ? "" : "none";

    if (isMatch) matchCount++;
  });

  if (query) {
    document.getElementById("new-arrivals").scrollIntoView({
      behavior: "smooth"
    });

    showToast(
      matchCount
        ? `${matchCount} matching product(s) found`
        : "No matching products found"
    );
  }
}

if (searchButton) {
  searchButton.addEventListener("click", searchProducts);
}

if (searchInput) {
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      searchProducts();
    }
  });
}


// 3. SCROLL REVEAL ANIMATION
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
}


// 4. SHOPPING CART
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartSidebar = document.getElementById("cartSidebar");
const cartBackdrop = document.getElementById("cartBackdrop");

const cartCount = document.getElementById("cartCount");
const cartHeadingCount = document.getElementById("cartHeadingCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

let cart = [];

function openCart() {
  cartSidebar.classList.add("active");
  cartBackdrop.classList.add("active");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartSidebar.classList.remove("active");
  cartBackdrop.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

if (cartToggle) {
  cartToggle.addEventListener("click", openCart);
}

if (cartClose) {
  cartClose.addEventListener("click", closeCart);
}

if (cartBackdrop) {
  cartBackdrop.addEventListener("click", closeCart);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    searchPanel?.classList.remove("active");
  }
});


// ADD PRODUCT TO CART
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();
  showToast(`${name} added to your bag`);
}


// ADD TO BAG BUTTONS
document.querySelectorAll(".quick-add").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (!name || !Number.isFinite(price) || price < 0) {
      showToast("Product information is missing");
      return;
    }

    addToCart(name, price);
  });
});


// UPDATE CART DISPLAY
function updateCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;
  cartHeadingCount.textContent = totalQuantity;
  cartTotal.textContent = `Rs. ${totalPrice.toLocaleString("en-PK")}`;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your bag is currently empty.</p>';
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent =
      `Rs. ${(item.price * item.quantity).toLocaleString("en-PK")}`;

    info.append(name, price);

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";

    const decrease = document.createElement("button");
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Decrease ${item.name}`);
    decrease.addEventListener("click", () => {
      changeQuantity(index, -1);
    });

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increase = document.createElement("button");
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Increase ${item.name}`);
    increase.addEventListener("click", () => {
      changeQuantity(index, 1);
    });

    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.innerHTML = '<i class="fa-solid fa-trash"></i>';
    remove.setAttribute("aria-label", `Remove ${item.name}`);
    remove.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
      showToast("Product removed");
    });

    actions.append(decrease, quantity, increase, remove);
    cartItem.append(info, actions);
    cartItems.appendChild(cartItem);
  });
}


// CHANGE QUANTITY
function changeQuantity(index, amount) {
  if (!cart[index]) return;

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}


// 5. TOAST NOTIFICATION
const toast = document.getElementById("toast");
let toastTimeout;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


// 6. NEWSLETTER FORM
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!newsletterEmail.checkValidity()) {
      newsletterEmail.reportValidity();
      return;
    }

    // DEMO ONLY:
    // Connect a real newsletter service or backend here.
    newsletterMessage.textContent =
      "Thanks for your interest! Newsletter integration is not active yet.";

    newsletterForm.reset();
  });
}


// 7. CHECKOUT BUTTON
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Your shopping bag is empty");
      return;
    }

    // REAL CHECKOUT:
    // Connect payment gateway, order processing
    // and backend before accepting real orders.
    showToast("Checkout is not connected yet");
  });
}


// 8. INITIALIZE CART
updateCart();
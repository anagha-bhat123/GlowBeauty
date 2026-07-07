// ===============================
// GLOW BEAUTY - SCRIPT.JS
// ===============================

// ---------- LOCAL STORAGE ----------

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ---------- UPDATE COUNTERS ----------

function updateCounters() {
  const cartCount = document.getElementById("cartCount");
  const wishlistCount = document.getElementById("wishlistCount");
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.innerText = totalQty;
  if (wishlistCount) wishlistCount.innerText = wishlist.length;
}

updateCounters();

// ===============================
// ADD TO CART
// ===============================

document.addEventListener("click", function (e) {
  const addBtn = e.target.closest(".addCart");
  if (!addBtn) return;

  // Handle add-to-cart from the Quick View modal
  const modal = addBtn.closest("#quickViewModal");
  if (modal) {
    const name = document.getElementById("modalTitle").innerText;
    const priceText = document.getElementById("modalPrice").innerText;
    const price = parseInt(priceText.replace(/[^\d]/g, ""));
    const image = document.getElementById("modalImage").src;
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id: Date.now(), name, price, image, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounters();
    Swal.fire({ icon: "success", title: "Added to Cart", text: name + " added successfully!", confirmButtonColor: "#ff4f81" });
    return;
  }

  // Handle add-to-cart from product cards
  const card = addBtn.closest(".product-card");
  if (!card) return;

  const product = {
    id: Date.now(),
    name: card.querySelector("h5").innerText,
    price: parseInt(card.querySelector(".product-price").innerText.replace(/[^\d]/g, "")),
    image: card.querySelector("img").src,
    qty: 1
  };

  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCounters();

  Swal.fire({ icon: "success", title: "Added to Cart", text: product.name + " added successfully!", confirmButtonColor: "#ff4f81" });
});

// ===============================
// ADD TO WISHLIST
// ===============================

document.addEventListener("click", function (e) {
  const wishBtn = e.target.closest(".wishlistBtn");
  if (!wishBtn) return;

  const card = wishBtn.closest(".product-card");
  if (!card) return;

  const product = {
    id: Date.now(),
    name: card.querySelector("h5").innerText,
    price: parseInt(card.querySelector(".product-price").innerText.replace(/[^\d]/g, "")),
    image: card.querySelector("img").src
  };

  const exists = wishlist.find(item => item.name === product.name);
  if (exists) {
    Swal.fire({ icon: "info", title: "Already Added", text: "Product already exists in wishlist.", confirmButtonColor: "#ff4f81" });
    return;
  }

  wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateCounters();

  // Fill the heart icon
  wishBtn.classList.remove("btn-outline-danger");
  wishBtn.classList.add("btn-danger");

  Swal.fire({ icon: "success", title: "Wishlist", text: product.name + " added to wishlist!", confirmButtonColor: "#ff4f81" });
});

// ===============================
// QUICK VIEW
// ===============================

document.addEventListener("click", function (e) {
  const qBtn = e.target.closest(".quickView");
  if (!qBtn) return;

  const card = qBtn.closest(".product-card");
  if (!card) return;

  document.getElementById("modalImage").src = card.querySelector("img").src;
  document.getElementById("modalTitle").innerText = card.querySelector("h5").innerText;
  const priceEl = card.querySelector(".product-price");
  document.getElementById("modalPrice").innerText = priceEl ? priceEl.innerText : "";

  const modal = new bootstrap.Modal(document.getElementById("quickViewModal"));
  modal.show();
});

// ===============================
// HOME PAGE SEARCH (if present)
// ===============================

const search = document.getElementById("searchProduct");
if (search) {
  search.addEventListener("keyup", function () {
    let value = this.value.toLowerCase();
    document.querySelectorAll(".product").forEach(product => {
      product.style.display = product.innerText.toLowerCase().includes(value) ? "" : "none";
    });
  });
}

// ===============================
// CATEGORY FILTER
// ===============================

const category = document.getElementById("categoryFilter");
if (category) {
  category.addEventListener("change", function () {
    let value = this.value;
    document.querySelectorAll(".product").forEach(card => {
      card.style.display = (value === "all" || card.dataset.category === value) ? "" : "none";
    });
  });
}


// ===============================
// SCROLL TO TOP
// ===============================

const topBtn = document.createElement("button");
topBtn.innerHTML = "↑";
topBtn.id = "topBtn";
topBtn.className = "btn btn-danger rounded-circle";
topBtn.style.cssText = "position:fixed;right:20px;bottom:20px;display:none;width:50px;height:50px;z-index:999;font-size:20px;";
document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 250 ? "block" : "none";
});
topBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

// ===============================
// PAGE FADE-IN
// ===============================

window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "0.5s";
    document.body.style.opacity = "1";
  }, 100);
});


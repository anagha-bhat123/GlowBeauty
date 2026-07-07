// ===============================================
// GLOW BEAUTY — nykaa.js
// Site-wide Nykaa-style header strip, category bar,
// countdown, and "Recently Viewed" tracking.
// Included on every page right after style.css so
// no page markup/structure needs to change.
// ===============================================

document.addEventListener("DOMContentLoaded", function () {

  // ---------- 1. ANNOUNCEMENT BAR ----------
  var msg =
    'FREE SHIPPING on orders above <b>&#8377;999</b>' +
    '&nbsp;&nbsp;|&nbsp;&nbsp; USE CODE <b>GLOW10</b> FOR 10% OFF' +
    '&nbsp;&nbsp;|&nbsp;&nbsp; EASY 7-DAY RETURNS' +
    '&nbsp;&nbsp;|&nbsp;&nbsp; 100% AUTHENTIC PRODUCTS';

  var announce = document.createElement("div");
  announce.className = "nk-announce";
  announce.innerHTML =
    '<div class="nk-track">' + msg + '&nbsp;&nbsp;&nbsp;&nbsp;' + msg + '</div>';
  document.body.insertBefore(announce, document.body.firstChild);

  // ---------- 2. STYLE THE BRAND WORDMARK ----------
  var brand = document.querySelector(".navbar-brand");
  if (brand && !brand.querySelector("small")) {
    var text = brand.textContent.trim();
    brand.innerHTML = text + "<small>BEAUTY &amp; FASHION</small>";
  }

  // ---------- 3. CATEGORY STRIP (Nykaa Fashion style) ----------
  var nav = document.querySelector("nav.navbar");
  if (nav) {
    var cats = [
      { label: "Makeup", href: "products.html" },
      { label: "Skincare", href: "products.html" },
      { label: "Hair Care", href: "products.html" },
      { label: "Fragrance", href: "products.html" },
      { label: "Sale", href: "products.html", sale: true }
    ];
    var bar = document.createElement("div");
    bar.className = "nk-catbar";
    var inner = document.createElement("div");
    inner.className = "nk-catbar-inner";
    cats.forEach(function (c) {
      var a = document.createElement("a");
      a.href = c.href;
      a.textContent = c.label;
      if (c.sale) a.className = "nk-sale";
      inner.appendChild(a);
    });
    bar.appendChild(inner);
    nav.parentNode.insertBefore(bar, nav.nextSibling);
  }

  // ---------- 4. FLASH SALE COUNTDOWN ----------
  document.querySelectorAll(".nk-timer").forEach(function (timer) {
    var end = Date.now() + 1000 * 60 * 60 * 6; // 6 hour rolling sale window
    function tick() {
      var diff = Math.max(0, end - Date.now());
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var pad = function (n) { return n < 10 ? "0" + n : n; };
      timer.innerHTML =
        "<span>" + pad(h) + "</span><span>" + pad(m) + "</span><span>" + pad(s) + "</span>";
    }
    tick();
    setInterval(tick, 1000);
  });

  // ---------- 5. RECENTLY VIEWED TRACKING ----------
  function trackRecentlyViewed(card) {
    try {
      var nameEl = card.querySelector("h5");
      var priceEl = card.querySelector(".product-price");
      var imgEl = card.querySelector("img");
      if (!nameEl || !priceEl || !imgEl) return;
      var item = {
        name: nameEl.innerText.trim(),
        price: priceEl.innerText.trim(),
        image: imgEl.getAttribute("src")
      };
      var list = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      list = list.filter(function (p) { return p.name !== item.name; });
      list.unshift(item);
      list = list.slice(0, 8);
      localStorage.setItem("recentlyViewed", JSON.stringify(list));
    } catch (e) { /* no-op */ }
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".quickView, .addCart, .wishlistBtn");
    if (!trigger) return;
    var card = trigger.closest(".product-card");
    if (card) trackRecentlyViewed(card);
  });

  // ---------- 6. RENDER "RECENTLY VIEWED" STRIP ----------
  var recentHolder = document.getElementById("nkRecentlyViewed");
  if (recentHolder) {
    var recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    if (recent.length > 0) {
      recentHolder.closest("section").style.display = "";
      var row = recentHolder;
      row.innerHTML = "";
      recent.forEach(function (p) {
        var col = document.createElement("div");
        col.className = "col-6 col-md-3 col-lg-2";
        col.innerHTML =
          '<div class="nk-recent-strip">' +
            '<img src="' + p.image + '" class="w-100 rounded mb-2" alt="' + p.name + '">' +
            '<div style="font-size:12.5px;font-weight:600;color:var(--ink);">' + p.name + '</div>' +
            '<div class="product-price" style="font-size:13px;">' + p.price + '</div>' +
          '</div>';
        row.appendChild(col);
      });
    } else {
      recentHolder.closest("section").style.display = "none";
    }
  }

});

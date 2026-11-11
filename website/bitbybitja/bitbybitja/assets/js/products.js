/* BitByBit — fridge magnet catalogue, filters, and quick-view dialog. */
(function () {
  "use strict";

  var BB = (window.BitByBit = window.BitByBit || {});

  var CATEGORIES = {
    snowmelts: "Snowmelts",
    "itty-bitty-canvas": "Itty Bitty Canvas",
    canadots: "Canadots",
    meltimals: "Meltimals"
  };

  var PRODUCTS = [
    {
      id: "snowmelts-christmas-star",
      name: "Christmas Star",
      category: "snowmelts",
      price: 7,
      image: "assets/img/products/christmas-star.jpg",
      alt: "Christmas Star fridge magnet made from perler beads",
      badge: "Limited edition",
      badgeClass: "tag--pink",
      blurb:
        "A perler-bead Christmas star — festive holiday decor and an easy stocking stuffer."
    },
    {
      id: "snowmelts-gingerbread-man",
      name: "Gingerbread Man",
      category: "snowmelts",
      price: 7,
      image: "assets/img/products/gingerbread-man.jpg",
      alt: "Gingerbread Man fridge magnet made from perler beads",
      badge: "Limited edition",
      badgeClass: "tag--pink",
      blurb:
        "A cheerful gingerbread man fused bead by bead — a sweet little holiday magnet."
    },
    {
      id: "snowmelts-snowman",
      name: "Snowman",
      category: "snowmelts",
      price: 7,
      image: "assets/img/products/snowman.jpg",
      alt: "Snowman fridge magnet made from perler beads",
      badge: "Limited edition",
      badgeClass: "tag--pink",
      blurb:
        "A frosty perler-bead snowman for the holiday season — no melting required."
    },
    {
      id: "itty-bitty-canvas-starry-night",
      name: "Starry Night",
      category: "itty-bitty-canvas",
      price: 5,
      image: "assets/img/products/starry-night.jpg",
      alt: "Starry Night fridge magnet recreated in perler beads",
      blurb:
        "Van Gogh's Starry Night rebuilt bead by bead — a tiny masterpiece for the fridge."
    },
    {
      id: "itty-bitty-canvas-mona-lisa",
      name: "Mona Lisa",
      category: "itty-bitty-canvas",
      price: 5,
      image: "assets/img/products/mona-lisa.jpg",
      alt: "Mona Lisa fridge magnet recreated in perler beads",
      blurb:
        "The Mona Lisa in perler beads — a fridge-sized smile that never gets old."
    },
    {
      id: "itty-bitty-canvas-great-wave",
      name: "Great Wave",
      category: "itty-bitty-canvas",
      price: 7,
      image: "assets/img/products/great-wave.jpg",
      alt: "Great Wave fridge magnet recreated in perler beads",
      blurb:
        "Hokusai's Great Wave, rebuilt in chunky pixels for your fridge door."
    },
    {
      id: "canadots-canada-flag",
      name: "Canada Flag",
      category: "canadots",
      price: 5,
      image: "assets/img/products/canada-flag.jpg",
      alt: "Canadian flag fridge magnet made from perler beads",
      blurb:
        "The maple leaf in perler beads — Canadian culture in the palm of your hand."
    },
    {
      id: "canadots-maple-syrup",
      name: "Maple Syrup",
      category: "canadots",
      price: 5,
      image: "assets/img/products/maple-syrup.jpg",
      alt: "Maple syrup bottle fridge magnet made from perler beads",
      blurb:
        "A perler-bead maple syrup bottle — a sweet Canadian icon for the fridge."
    },
    {
      id: "canadots-beaver",
      name: "Beaver",
      category: "canadots",
      price: 5,
      image: "assets/img/products/beaver.jpg",
      alt: "Beaver fridge magnet made from perler beads",
      blurb:
        "A perler-bead beaver — a Canadian icon for the fridge."
    },
    {
      id: "meltimals-cat",
      name: "Cat",
      category: "meltimals",
      price: 5,
      image: "assets/img/products/cat.jpg",
      alt: "Cat fridge magnet made from perler beads",
      blurb:
        "A perler-bead cat from the Meltimals line — no fur, no mess, all charm."
    },
    {
      id: "meltimals-crab",
      name: "Crab",
      category: "meltimals",
      price: 5,
      image: "assets/img/products/crab.jpg",
      alt: "Crab fridge magnet made from perler beads",
      blurb:
        "A perler-bead crab from the Meltimals line — no fur, no mess, all charm."
    },
    {
      id: "meltimals-penguin",
      name: "Penguin",
      category: "meltimals",
      price: 5,
      image: "assets/img/products/penguin.jpg",
      alt: "Penguin fridge magnet made from perler beads",
      blurb:
        "A perler-bead penguin from the Meltimals line — no fur, no mess, all charm."
    },
    {
      id: "meltimals-grey-penguin",
      name: "Grey Penguin",
      category: "meltimals",
      price: 5,
      image: "assets/img/products/grey-penguin.jpg",
      alt: "Grey penguin fridge magnet made from perler beads",
      blurb:
        "A grey perler-bead penguin from the Meltimals line — no fur, no mess, all charm."
    }
  ];

  var FEATURED_IDS = [
    "snowmelts-christmas-star",
    "itty-bitty-canvas-great-wave",
    "canadots-canada-flag",
    "meltimals-penguin"
  ];

  function money(price) {
    if (price === null || price === undefined || price === "") return "Price TBD";
    return "$" + Number(price).toFixed(2) + " CAD";
  }

  function productById(id) {
    for (var i = 0; i < PRODUCTS.length; i += 1) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function productSpecs(product) {
    return [
      ["Collection", CATEGORIES[product.category]],
      ["Format", "Fridge magnet"],
      ["Finish", "Hand-fused perler beads"],
      ["Price", money(product.price)]
    ];
  }

  function cardHTML(product) {
    var badge = product.badge
      ? '<span class="tag ' + product.badgeClass + '">' + BB.escapeHTML(product.badge) + "</span>"
      : "";
    return (
      '<article class="product-card">' +
      '<button type="button" data-quick-view="' + BB.escapeHTML(product.id) + '" ' +
      'aria-label="Quick view: ' + BB.escapeHTML(product.name) + ", " + money(product.price) + '">' +
      '<span class="product-media">' +
      '<img src="' + BB.escapeHTML(product.image) + '" alt="' + BB.escapeHTML(product.alt) + '" ' +
      'width="800" height="600" loading="lazy">' +
      '<span class="product-badges">' + badge + "</span>" +
      '<span class="product-quick">Quick view +</span>' +
      "</span>" +
      '<span class="product-body">' +
      '<span class="product-category">' + BB.escapeHTML(CATEGORIES[product.category]) + "</span>" +
      '<span class="product-name">' + BB.escapeHTML(product.name) + "</span>" +
      '<span class="product-price">' + money(product.price) + "</span>" +
      "</span>" +
      "</button>" +
      "</article>"
    );
  }

  BB.products = PRODUCTS;
  BB.productById = productById;

  function renderProducts(container, list) {
    if (!container) return;
    container.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : '<p class="product-empty">No magnets in this collection yet. Check back soon.</p>';
  }

  /* ----------------------------------------------------------------------
     Quick-view dialog
     ---------------------------------------------------------------------- */

  var dialog = null;

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.className = "modal modal--wide";
    dialog.id = "product-dialog";
    dialog.setAttribute("aria-labelledby", "product-dialog-name");
    dialog.innerHTML =
      '<div class="modal__header">' +
      '<div><h2 id="product-dialog-title">Product details</h2>' +
      '<p>Fridge magnet · handmade in small batches</p></div>' +
      '<button type="button" class="modal__close" data-close aria-label="Close product details">×</button>' +
      "</div>" +
      '<div class="modal__body">' +
      '<div class="product-dialog__layout">' +
      '<div class="product-dialog__media"><img data-qv-image src="" alt="" width="800" height="600"></div>' +
      '<div class="product-dialog__info">' +
      '<p class="product-category" data-qv-category></p>' +
      '<h2 id="product-dialog-name" data-qv-name></h2>' +
      '<p class="product-dialog__price" data-qv-price></p>' +
      '<p class="product-dialog__desc" data-qv-desc></p>' +
      '<dl class="spec-list" data-qv-specs></dl>' +
      '<div class="product-dialog__actions">' +
      '<a class="btn btn--pink" href="schedule.html">See sales days</a>' +
      '<a class="btn btn--paper" data-qv-email href="mailto:bitbybitja@gmail.com">Ask about this magnet</a>' +
      "</div>" +
      '<p class="product-dialog__note">All prices are in Canadian dollars (CAD). ' +
      "These magnets are sold in person at our sales days — there is no online checkout.</p>" +
      "</div>" +
      "</div>" +
      "</div>";
    document.body.appendChild(dialog);
    BB.bindModal(dialog);
    dialog.addEventListener("click", function (event) {
      if (event.target.closest("[data-close]")) dialog.close();
    });
    return dialog;
  }

  function openQuickView(id) {
    var product = productById(id);
    if (!product) return;
    var d = ensureDialog();
    d.querySelector("[data-qv-image]").src = product.image;
    d.querySelector("[data-qv-image]").alt = product.alt;
    d.querySelector("[data-qv-category]").textContent = CATEGORIES[product.category];
    d.querySelector("[data-qv-name]").textContent = product.name;
    d.querySelector("[data-qv-price]").textContent = money(product.price);
    d.querySelector("[data-qv-desc]").textContent = product.blurb;

    var specs = d.querySelector("[data-qv-specs]");
    specs.innerHTML = "";
    productSpecs(product).forEach(function (spec) {
      var row = document.createElement("div");
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = spec[0];
      dd.textContent = spec[1];
      row.appendChild(dt);
      row.appendChild(dd);
      specs.appendChild(row);
    });

    var email = d.querySelector("[data-qv-email]");
    email.href =
      "mailto:bitbybitja@gmail.com?subject=" +
      encodeURIComponent("Magnet question — " + product.name);

    d.showModal();
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-quick-view]");
    if (!trigger) return;
    event.preventDefault();
    openQuickView(trigger.getAttribute("data-quick-view"));
  });

  /* ----------------------------------------------------------------------
     Page wiring
     ---------------------------------------------------------------------- */

  var latest = document.getElementById("latest-products");
  if (latest) {
    var featured = FEATURED_IDS.map(productById).filter(Boolean);
    renderProducts(latest, featured);
  }

  var grid = document.getElementById("product-grid");
  if (grid) {
    var filterButtons = Array.prototype.slice.call(
      document.querySelectorAll("[data-filter]")
    );
    var count = document.getElementById("product-count");
    var params = new URLSearchParams(window.location.search);
    var active = params.get("category");
    if (!CATEGORIES[active]) active = "all";

    function updateCount(list) {
      if (!count) return;
      count.textContent =
        list.length + " fridge " + (list.length === 1 ? "magnet" : "magnets");
    }

    function applyFilter(category, updateUrl) {
      active = CATEGORIES[category] ? category : "all";
      var list =
        active === "all"
          ? PRODUCTS
          : PRODUCTS.filter(function (product) {
              return product.category === active;
            });

      filterButtons.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          button.getAttribute("data-filter") === active ? "true" : "false"
        );
      });

      renderProducts(grid, list);
      updateCount(list);

      if (updateUrl) {
        var url = new URL(window.location.href);
        if (active === "all") url.searchParams.delete("category");
        else url.searchParams.set("category", active);
        window.history.replaceState({}, "", url);
      }
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.getAttribute("data-filter"), true);
      });
    });

    applyFilter(active, false);
  }
})();

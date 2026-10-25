/* BitByBit — editable home-page banner (saved in this browser) */
(function () {
  "use strict";

  var BB = window.BitByBit;
  if (!BB) return;

  var hero = document.getElementById("hero");
  var heroImage = document.getElementById("hero-image");
  var openButton = document.getElementById("customize-banner");
  var dialog = document.getElementById("banner-editor");
  var form = document.getElementById("banner-form");
  if (!hero || !heroImage || !openButton || !dialog || !form) return;

  var eyebrowEl = document.getElementById("hero-eyebrow");
  var titleEl = document.getElementById("hero-title");
  var textEl = document.getElementById("hero-text");
  var ctaEl = document.getElementById("hero-cta");
  var errorEl = document.getElementById("banner-error");
  var thumb = document.getElementById("banner-image-thumb");
  var imageUrl = document.getElementById("banner-image-url");
  var fileInput = document.getElementById("banner-image-file");

  var STORAGE_KEY = "bitbybit.banner.v1";
  var ACCENTS = ["#ff4f8b", "#4d7cff", "#3ddc97", "#ffd23f", "#9b6bff"];

  var DEFAULTS = {
    eyebrow: "Junior Achievement Company Program",
    title: "Small beads.\nBig impact.",
    text:
      "Pixel-perfect art, fused bead by bead by high schoolers. Keychains, magnets, and desk friends — made for your setup and for a good cause.",
    ctaLabel: "Browse the lineup",
    ctaHref: "products.html",
    accent: "#ff4f8b",
    image: "assets/img/banner-placeholder.svg"
  };

  var state = loadState();
  var beforeEdit = null;
  var saved = false;
  var draftImage = state.image;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function safeImage(value) {
    var raw = String(value || "").trim();
    if (!raw) return DEFAULTS.image;
    if (/[\u0000-\u001f\u007f]/.test(raw)) return DEFAULTS.image;
    if (/^(javascript|vbscript):/i.test(raw)) return DEFAULTS.image;
    if (/^data:/i.test(raw) && !/^data:image\//i.test(raw)) return DEFAULTS.image;
    return raw;
  }

  function normalize(raw) {
    var next = clone(DEFAULTS);
    if (!raw || typeof raw !== "object") return next;

    ["eyebrow", "title", "text", "ctaLabel", "ctaHref", "image", "accent"].forEach(
      function (key) {
        if (typeof raw[key] === "string") next[key] = raw[key];
      }
    );

    next.title = next.title.trim() || DEFAULTS.title;
    next.ctaLabel = next.ctaLabel.trim() || DEFAULTS.ctaLabel;
    next.ctaHref = BB.safeHref(next.ctaHref, DEFAULTS.ctaHref);
    next.image = safeImage(next.image);
    if (ACCENTS.indexOf(next.accent) === -1) next.accent = DEFAULTS.accent;
    return next;
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULTS);
      return normalize(JSON.parse(raw));
    } catch (error) {
      return clone(DEFAULTS);
    }
  }

  heroImage.addEventListener("error", function () {
    if (heroImage.getAttribute("src") !== DEFAULTS.image) {
      heroImage.src = DEFAULTS.image;
    }
  });

  function apply(next) {
    eyebrowEl.textContent = next.eyebrow;
    eyebrowEl.hidden = !next.eyebrow;
    titleEl.textContent = next.title;
    textEl.textContent = next.text;
    textEl.hidden = !next.text;
    ctaEl.textContent = next.ctaLabel;
    ctaEl.href = BB.safeHref(next.ctaHref, DEFAULTS.ctaHref);
    hero.style.setProperty("--hero-accent", next.accent);
    if (heroImage.getAttribute("src") !== next.image) heroImage.src = next.image;
  }

  function readForm() {
    var checked = form.querySelector('input[name="accent"]:checked');
    return {
      eyebrow: form.eyebrow.value.trim(),
      title: form.headline.value.trim(),
      text: form.text.value.trim(),
      ctaLabel: form.ctaLabel.value.trim() || DEFAULTS.ctaLabel,
      ctaHref: BB.safeHref(form.ctaHref.value.trim(), DEFAULTS.ctaHref),
      accent: checked ? checked.value : DEFAULTS.accent,
      image: draftImage || DEFAULTS.image
    };
  }

  function populate(next) {
    form.eyebrow.value = next.eyebrow;
    form.headline.value = next.title;
    form.text.value = next.text;
    form.ctaLabel.value = next.ctaLabel;
    form.ctaHref.value = next.ctaHref;
    form.querySelectorAll('input[name="accent"]').forEach(function (input) {
      input.checked = input.value === next.accent;
    });
    imageUrl.value = next.image.indexOf("data:") === 0 ? "" : next.image;
    thumb.src = next.image;
    draftImage = next.image;
    errorEl.hidden = true;
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function openEditor() {
    beforeEdit = clone(state);
    saved = false;
    populate(state);
    apply(readForm());
    dialog.showModal();
    window.setTimeout(function () {
      form.eyebrow.focus();
      form.eyebrow.select();
    }, 20);
  }

  function closeEditor() {
    if (dialog.open) dialog.close();
  }

  openButton.addEventListener("click", openEditor);

  dialog.querySelectorAll("[data-banner-cancel]").forEach(function (button) {
    button.addEventListener("click", closeEditor);
  });

  dialog.addEventListener("close", function () {
    if (saved || !beforeEdit) {
      beforeEdit = null;
      return;
    }
    state = beforeEdit;
    draftImage = state.image;
    apply(state);
    beforeEdit = null;
  });

  form.addEventListener("input", function (event) {
    if (event.target === imageUrl) {
      draftImage = safeImage(imageUrl.value);
      thumb.src = draftImage;
    }
    apply(readForm());
    clearError();
  });

  form.addEventListener("change", function () {
    apply(readForm());
  });

  document
    .getElementById("banner-image-reset")
    .addEventListener("click", function () {
      draftImage = DEFAULTS.image;
      imageUrl.value = "";
      thumb.src = DEFAULTS.image;
      apply(readForm());
      clearError();
    });

  document.getElementById("banner-reset").addEventListener("click", function () {
    draftImage = DEFAULTS.image;
    populate(clone(DEFAULTS));
    apply(readForm());
    clearError();
  });

  function loadImageSource(file) {
    return new Promise(function (resolve, reject) {
      var objectUrl = URL.createObjectURL(file);
      var image = new Image();
      image.onload = function () {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("That file could not be read as an image."));
      };
      image.src = objectUrl;
    });
  }

  function compressImage(file) {
    if (!file.type || file.type.indexOf("image/") !== 0) {
      return Promise.reject(new Error("Choose an image file (PNG, JPG, WebP, or GIF)."));
    }
    if (file.size > 12 * 1024 * 1024) {
      return Promise.reject(new Error("That image is larger than 12 MB. Try a smaller file."));
    }

    return loadImageSource(file).then(function (image) {
      var maxWidth = 1920;
      var maxHeight = 1080;
      var width = image.naturalWidth || image.width;
      var height = image.naturalHeight || image.height;
      var scale = Math.min(1, maxWidth / width, maxHeight / height);
      var canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      var context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      var encoded = canvas.toDataURL("image/webp", 0.86);
      if (encoded.length > 2200000) encoded = canvas.toDataURL("image/jpeg", 0.76);
      return encoded;
    });
  }

  fileInput.addEventListener("change", function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    clearError();
    compressImage(file)
      .then(function (dataUrl) {
        draftImage = dataUrl;
        imageUrl.value = "";
        thumb.src = dataUrl;
        apply(readForm());
      })
      .catch(function (error) {
        showError(error.message || "That image could not be loaded.");
      })
      .finally(function () {
        fileInput.value = "";
      });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var next = readForm();

    if (!next.title) {
      showError("Add a headline before saving the banner.");
      form.headline.focus();
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      showError(
        "This browser could not store the banner (the image may be too large). " +
          "Try a smaller upload or use an image URL."
      );
      return;
    }

    state = next;
    saved = true;
    apply(state);
    dialog.close();
    BB.toast("Banner updated — saved in this browser.");
  });

  apply(state);
})();

/* BitByBit — shared behavior: mobile nav, dialogs, toast, footer year */
(function () {
  "use strict";

  var BB = (window.BitByBit = window.BitByBit || {});

  /* ----------------------------------------------------------------------
     Small utilities
     ---------------------------------------------------------------------- */

  BB.escapeHTML = function (value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  };

  BB.safeHref = function (value, fallback) {
    var raw = String(value || "").trim();
    if (!raw) return fallback || "#";
    if (/^(javascript|vbscript|data):/i.test(raw)) return fallback || "#";
    return raw;
  };

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */

  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var mobileQuery = window.matchMedia("(max-width: 960px)");

  function navIsOpen() {
    return !!(siteNav && siteNav.classList.contains("is-open"));
  }

  function syncNavInert() {
    if (!siteNav) return;
    if (mobileQuery.matches) {
      siteNav.inert = !navIsOpen();
    } else {
      siteNav.inert = false;
    }
  }

  function setNav(open, restoreFocus) {
    if (!siteNav || !navToggle) return;
    siteNav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open && mobileQuery.matches);
    syncNavInert();
    if (!open && restoreFocus) navToggle.focus();
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNav(!navIsOpen(), false);
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false, false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navIsOpen()) setNav(false, true);
    });

    document.addEventListener("click", function (event) {
      if (!navIsOpen()) return;
      if (siteNav.contains(event.target) || navToggle.contains(event.target)) return;
      setNav(false, false);
    });

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", function () {
        setNav(false, false);
        syncNavInert();
      });
    }

    syncNavInert();
  }

  /* ----------------------------------------------------------------------
     Dialog backdrop clicks
     ---------------------------------------------------------------------- */

  BB.bindModal = function (dialog) {
    if (!dialog || dialog.dataset.backdropBound === "true") return;
    dialog.dataset.backdropBound = "true";
    dialog.addEventListener("click", function (event) {
      if (event.target !== dialog) return;
      var rect = dialog.getBoundingClientRect();
      var outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (outside) dialog.close();
    });
  };

  document.querySelectorAll("dialog.modal").forEach(BB.bindModal);

  /* ----------------------------------------------------------------------
     Toast
     ---------------------------------------------------------------------- */

  var toastEl = null;
  var toastMessage = null;
  var toastAction = null;
  var toastTimer = null;
  var toastHandler = null;

  function ensureToast() {
    if (toastEl) return;
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    toastEl.hidden = true;

    toastMessage = document.createElement("span");
    toastAction = document.createElement("button");
    toastAction.type = "button";
    toastAction.className = "toast__action";
    toastAction.hidden = true;

    toastEl.appendChild(toastMessage);
    toastEl.appendChild(toastAction);
    document.body.appendChild(toastEl);

    toastAction.addEventListener("click", function () {
      var handler = toastHandler;
      hideToast();
      if (typeof handler === "function") handler();
    });
  }

  function hideToast() {
    if (!toastEl) return;
    window.clearTimeout(toastTimer);
    toastEl.hidden = true;
    toastHandler = null;
  }

  BB.toast = function (message, options) {
    ensureToast();
    var opts = options || {};
    window.clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toastHandler = typeof opts.onAction === "function" ? opts.onAction : null;

    if (opts.actionLabel && toastHandler) {
      toastAction.hidden = false;
      toastAction.textContent = opts.actionLabel;
    } else {
      toastAction.hidden = true;
      toastAction.textContent = "";
    }

    toastEl.hidden = false;
    toastTimer = window.setTimeout(hideToast, opts.duration || (toastHandler ? 7000 : 4500));
  };

  BB.hideToast = hideToast;

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ----------------------------------------------------------------------
     Open a targeted FAQ answer when linked to with a hash
     ---------------------------------------------------------------------- */

  function revealHashTarget() {
    if (!window.location.hash) return;
    var id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch (error) {
      return;
    }
    var target = document.getElementById(id);
    if (!target) return;
    var details = target.closest("details");
    if (details) details.open = true;
    window.setTimeout(function () {
      target.scrollIntoView({ block: "center" });
    }, 40);
  }

  revealHashTarget();
  window.addEventListener("hashchange", revealHashTarget);
})();

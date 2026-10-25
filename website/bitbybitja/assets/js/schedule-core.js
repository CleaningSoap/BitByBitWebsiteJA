/* BitByBit — shared sales-calendar helpers and read-only/editor renderers */
(function () {
  "use strict";

  var BB = (window.BitByBit = window.BitByBit || {});

  var CATEGORIES = {
    sale: { label: "Pop-up sale", color: "#ff4f8b", bg: "#ffe1eb" },
    market: { label: "Community market", color: "#4d7cff", bg: "#e2e9ff" },
    school: { label: "School store", color: "#3ddc97", bg: "#dcf9ec" },
    custom: { label: "Custom pickup", color: "#ffd23f", bg: "#fff4c4" },
    other: { label: "Other", color: "#9b6bff", bg: "#efe6ff" }
  };

  var MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function keyOf(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function parseKey(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(key || ""))) return null;
    var parts = key.split("-").map(Number);
    var date = new Date(parts[0], parts[1] - 1, parts[2]);
    if (
      date.getFullYear() !== parts[0] ||
      date.getMonth() !== parts[1] - 1 ||
      date.getDate() !== parts[2]
    ) {
      return null;
    }
    return date;
  }

  function addDays(date, amount) {
    var next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + amount);
    return next;
  }

  function formatLong(key) {
    var date = parseKey(key);
    if (!date) return key;
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }

  function formatTime(value) {
    if (!value) return "All day";
    var parts = String(value).split(":");
    var hours = Number(parts[0]);
    var minutes = parts[1] || "00";
    if (isNaN(hours)) return value;
    var suffix = hours >= 12 ? "PM" : "AM";
    var display = hours % 12 || 12;
    return display + (minutes === "00" ? "" : ":" + minutes) + " " + suffix;
  }

  function formatRange(event) {
    if (!event.start) return "All day";
    if (event.end) return formatTime(event.start) + "–" + formatTime(event.end);
    return formatTime(event.start);
  }

  function sortEvents(list) {
    return list.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return (a.start || "00:00").localeCompare(b.start || "00:00");
    });
  }

  function sanitizeEvent(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (!parseKey(raw.date)) return null;
    if (typeof raw.title !== "string" || !raw.title.trim()) return null;
    var start = /^\d{2}:\d{2}$/.test(String(raw.start || "")) ? raw.start : "";
    var end = /^\d{2}:\d{2}$/.test(String(raw.end || "")) ? raw.end : "";
    return {
      id: String(raw.id || "evt-" + Date.now() + "-" + Math.random().toString(16).slice(2)),
      date: raw.date,
      start: start,
      end: end,
      title: raw.title.trim().slice(0, 90),
      category: CATEGORIES[raw.category] ? raw.category : "other",
      location: typeof raw.location === "string" ? raw.location.trim().slice(0, 140) : "",
      notes: typeof raw.notes === "string" ? raw.notes.trim().slice(0, 600) : ""
    };
  }

  function sanitizeEvents(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(sanitizeEvent).filter(Boolean);
  }

  function categoryStyle(category) {
    var meta = CATEGORIES[category] || CATEGORIES.other;
    return "--chip-color:" + meta.color + ";--chip-bg:" + meta.bg;
  }

  function tagClass(category) {
    if (category === "sale") return "tag--pink";
    if (category === "market") return "tag--blue";
    if (category === "school") return "tag--mint";
    return "tag--ghost";
  }

  function chipHTML(event, editable) {
    var category = CATEGORIES[event.category] || CATEGORIES.other;
    var when = formatRange(event);
    var inner =
      '<span class="event-chip__time">' +
      BB.escapeHTML(formatTime(event.start)) +
      "</span>" +
      '<span class="event-chip__title">' +
      BB.escapeHTML(event.title) +
      "</span>";

    if (!editable) {
      return (
        '<div class="event-chip event-chip--static" style="' +
        categoryStyle(event.category) +
        '" title="' +
        BB.escapeHTML(event.title + " · " + when + (event.location ? " · " + event.location : "")) +
        '">' +
        inner +
        "</div>"
      );
    }

    var label =
      "Edit " + event.title + ", " + when + (event.location ? ", " + event.location : "");
    return (
      '<button type="button" class="event-chip" data-event-id="' +
      BB.escapeHTML(event.id) +
      '" style="' +
      categoryStyle(event.category) +
      '" aria-label="' +
      BB.escapeHTML(label) +
      '">' +
      inner +
      "</button>"
    );
  }

  function dayHTML(date, dayEvents, editable) {
    var key = keyOf(date);
    var isToday = key === keyOf(new Date());
    var chips = dayEvents.length
      ? '<div class="cal-events">' + dayEvents.map(function (event) {
          return chipHTML(event, editable);
        }).join("") + "</div>"
      : "";
    var addButton = editable
      ? '<button type="button" class="cal-day__add" data-add-date="' +
        key +
        '" aria-label="Add a sales day on ' +
        BB.escapeHTML(formatLong(key)) +
        '">+</button>'
      : "";
    return (
      '<div class="cal-day' +
      (isToday ? " cal-day--today" : "") +
      '" data-date="' +
      key +
      '">' +
      '<span class="cal-daynum">' +
      date.getDate() +
      "</span>" +
      chips +
      addButton +
      "</div>"
    );
  }

  function renderMonth(options) {
    var grid = options.grid;
    var monthLabel = options.monthLabel;
    var events = options.events || [];
    var cursor = options.cursor;
    var editable = Boolean(options.editable);
    if (!grid || !monthLabel) return { monthEventCount: 0 };

    var year = cursor.getFullYear();
    var month = cursor.getMonth();
    var first = new Date(year, month, 1);
    var offset = first.getDay();
    var totalDays = new Date(year, month + 1, 0).getDate();
    var totalCells = Math.ceil((offset + totalDays) / 7) * 7;

    var label = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric"
    }).format(cursor);
    monthLabel.textContent = label;

    var byDate = {};
    events.forEach(function (event) {
      if (!byDate[event.date]) byDate[event.date] = [];
      byDate[event.date].push(event);
    });
    Object.keys(byDate).forEach(function (key) {
      sortEvents(byDate[key]);
    });

    var monthEventCount = 0;
    var html = "";
    var i;
    for (i = 0; i < offset; i += 1) {
      html += '<div class="cal-day cal-day--blank" aria-hidden="true"></div>';
    }
    for (i = 1; i <= totalDays; i += 1) {
      var date = new Date(year, month, i);
      var dayEvents = byDate[keyOf(date)] || [];
      monthEventCount += dayEvents.length;
      html += dayHTML(date, dayEvents, editable);
    }
    for (i = offset + totalDays; i < totalCells; i += 1) {
      html += '<div class="cal-day cal-day--blank" aria-hidden="true"></div>';
    }

    grid.innerHTML = html;
    grid.classList.toggle("calendar--editable", editable);
    grid.setAttribute(
      "aria-label",
      label + (editable ? " sales-day editor" : " sales-day calendar")
    );
    return { monthEventCount: monthEventCount };
  }

  function renderUpcoming(options) {
    var container = options.container;
    var events = options.events || [];
    var editable = Boolean(options.editable);
    var emptyText = options.emptyText || "No upcoming sales days yet.";
    if (!container) return 0;

    var todayKey = keyOf(new Date());
    var upcoming = sortEvents(
      events.filter(function (event) {
        return event.date >= todayKey;
      })
    ).slice(0, 4);

    if (!upcoming.length) {
      container.innerHTML =
        '<p class="upcoming-empty">' + BB.escapeHTML(emptyText) + "</p>";
      return 0;
    }

    container.innerHTML = upcoming
      .map(function (event) {
        var date = parseKey(event.date);
        var meta = CATEGORIES[event.category] || CATEGORIES.other;
        var inner =
          '<span class="upcoming-date"><strong>' +
          pad(date.getDate()) +
          "</strong><span>" +
          MONTHS_SHORT[date.getMonth()] +
          "</span></span>" +
          '<span class="upcoming-copy">' +
          "<strong>" +
          BB.escapeHTML(event.title) +
          "</strong>" +
          "<span>" +
          BB.escapeHTML(formatRange(event)) +
          " · " +
          BB.escapeHTML(event.location || "Location TBA") +
          "</span>" +
          '<span class="tag ' +
          tagClass(event.category) +
          '">' +
          BB.escapeHTML(meta.label) +
          "</span></span>";

        if (!editable) {
          return '<div class="upcoming-item upcoming-item--static">' + inner + "</div>";
        }
        return (
          '<button type="button" class="upcoming-item" data-event-id="' +
          BB.escapeHTML(event.id) +
          '">' +
          inner +
          "</button>"
        );
      })
      .join("");

    return upcoming.length;
  }

  BB.calendar = {
    CATEGORIES: CATEGORIES,
    pad: pad,
    keyOf: keyOf,
    parseKey: parseKey,
    addDays: addDays,
    formatLong: formatLong,
    formatTime: formatTime,
    formatRange: formatRange,
    sortEvents: sortEvents,
    sanitizeEvents: sanitizeEvents,
    renderMonth: renderMonth,
    renderUpcoming: renderUpcoming
  };
})();

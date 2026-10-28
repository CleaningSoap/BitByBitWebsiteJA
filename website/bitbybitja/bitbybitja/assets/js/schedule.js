/* BitByBit — read-only public sales-day calendar */
(function () {
  "use strict";

  var BB = window.BitByBit;
  if (!BB || !BB.calendar) return;

  var grid = document.getElementById("cal-grid");
  var monthLabel = document.getElementById("cal-month");
  var upcomingList = document.getElementById("upcoming-list");
  var hint = document.getElementById("calendar-hint");
  var emptyNote = document.getElementById("calendar-empty-note");
  var updatedNote = document.getElementById("schedule-updated");
  var status = document.getElementById("calendar-status");
  if (!grid || !monthLabel || !upcomingList) return;

  var published = window.BITBYBIT_SCHEDULE || {};
  var events = BB.calendar.sanitizeEvents(published.events);
  var now = new Date();
  var cursor = new Date(now.getFullYear(), now.getMonth(), 1);

  // Open on the next month that actually has a sales day, so upcoming dates
  // are visible without paging forward manually.
  var currentMonth = BB.calendar.keyOf(cursor).slice(0, 7);
  var hasThisMonth = events.some(function (event) {
    return event.date.slice(0, 7) === currentMonth;
  });
  if (!hasThisMonth) {
    var nextEvent = events
      .filter(function (event) {
        return event.date >= BB.calendar.keyOf(now);
      })
      .sort(function (a, b) {
        return a.date < b.date ? -1 : 1;
      })[0];
    if (nextEvent) {
      var nextDate = BB.calendar.parseKey(nextEvent.date);
      cursor = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1);
    }
  }

  if (emptyNote) emptyNote.hidden = events.length > 0;

  if (updatedNote) {
    if (published.updated) {
      var updated = new Date(published.updated);
      if (!isNaN(updated.getTime())) {
        updatedNote.textContent =
          "Last published " +
          new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          }).format(updated) +
          ".";
      } else {
        updatedNote.hidden = true;
      }
    } else {
      updatedNote.hidden = true;
    }
  }

  function announce(message) {
    if (!status) return;
    status.textContent = "";
    window.setTimeout(function () {
      status.textContent = message;
    }, 30);
  }

  function render() {
    var result = BB.calendar.renderMonth({
      grid: grid,
      monthLabel: monthLabel,
      events: events,
      cursor: cursor,
      editable: false
    });

    if (hint) {
      hint.textContent = result.monthEventCount
        ? "Sales days are posted by the BitByBit team."
        : "No sales days are scheduled this month.";
    }

    BB.calendar.renderUpcoming({
      container: upcomingList,
      events: events,
      editable: false,
      emptyText: "No sales days announced yet. Check back soon."
    });
  }

  document.getElementById("cal-prev").addEventListener("click", function () {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
    render();
    announce("Showing " + monthLabel.textContent);
  });

  document.getElementById("cal-next").addEventListener("click", function () {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    render();
    announce("Showing " + monthLabel.textContent);
  });

  document.getElementById("cal-today").addEventListener("click", function () {
    var today = new Date();
    cursor = new Date(today.getFullYear(), today.getMonth(), 1);
    render();
    announce("Showing " + monthLabel.textContent);
  });

  render();
})();

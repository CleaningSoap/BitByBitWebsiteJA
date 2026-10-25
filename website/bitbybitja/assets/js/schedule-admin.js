/* BitByBit — private team calendar editor.
   Public visitors never load this file or its edit controls.
   The access code below is a convenience gate, not real security. */
(function () {
  "use strict";

  var BB = window.BitByBit;
  if (!BB || !BB.calendar) return;

  var C = BB.calendar;
  var gate = document.getElementById("admin-gate");
  var app = document.getElementById("admin-app");
  var gateForm = document.getElementById("admin-gate-form");
  var codeInput = document.getElementById("admin-code");
  var gateError = document.getElementById("admin-gate-error");
  if (!gate || !app || !gateForm || !codeInput) return;

  var TEAM_CODE = "bitbybit-team";
  var UNLOCK_KEY = "bitbybit.schedule.adminUnlocked";
  var DRAFT_KEY = "bitbybit.schedule.draft.v1";

  var published = C.sanitizeEvents((window.BITBYBIT_SCHEDULE || {}).events);
  var draft = loadDraft();
  var events = draft.events;
  var draftExists = draft.exists;
  var cursor = new Date();
  cursor = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  var editingId = null;
  var initialized = false;
  var fields = null;

  var grid = document.getElementById("admin-grid");
  var monthLabel = document.getElementById("admin-month");
  var upcomingList = document.getElementById("admin-upcoming");
  var hint = document.getElementById("admin-hint");
  var status = document.getElementById("admin-status");
  var dialog = document.getElementById("event-dialog");
  var form = document.getElementById("event-form");
  var dialogTitle = document.getElementById("event-dialog-title");
  var errorEl = document.getElementById("event-error");
  var deleteButton = document.getElementById("event-delete");
  var draftState = document.getElementById("admin-draft-state");
  var publishedState = document.getElementById("admin-published-state");

  /* ----------------------------------------------------------------------
     Gate
     ---------------------------------------------------------------------- */

  function isUnlocked() {
    try {
      return window.sessionStorage.getItem(UNLOCK_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function setUnlocked(value) {
    try {
      if (value) window.sessionStorage.setItem(UNLOCK_KEY, "true");
      else window.sessionStorage.removeItem(UNLOCK_KEY);
    } catch (error) {
      /* session storage is optional for this convenience gate */
    }
  }

  function showEditor() {
    gate.hidden = true;
    app.hidden = false;
    if (!initialized) {
      initialized = true;
      initEditor();
    }
  }

  gateForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (codeInput.value.trim() === TEAM_CODE) {
      gateError.hidden = true;
      setUnlocked(true);
      showEditor();
    } else {
      gateError.textContent = "That code does not match. Try again.";
      gateError.hidden = false;
      codeInput.select();
    }
  });

  if (isUnlocked()) {
    showEditor();
  } else {
    window.setTimeout(function () {
      codeInput.focus();
    }, 30);
  }

  /* ----------------------------------------------------------------------
     Draft storage
     ---------------------------------------------------------------------- */

  function loadDraft() {
    try {
      var raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw !== null) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.events)) {
          return { events: C.sanitizeEvents(parsed.events), exists: true };
        }
      }
    } catch (error) {
      /* fall back to the published schedule */
    }
    return { events: published.slice(), exists: false };
  }

  function persistDraft() {
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ version: 1, events: events })
      );
      draftExists = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  function newId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "evt-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function announce(message) {
    if (!status) return;
    status.textContent = "";
    window.setTimeout(function () {
      status.textContent = message;
    }, 30);
  }

  function updateStates() {
    if (draftState) {
      draftState.textContent =
        events.length +
        (events.length === 1 ? " draft event" : " draft events") +
        (draftExists ? " · saved locally" : " · from published schedule");
    }
    if (publishedState) {
      publishedState.textContent =
        published.length +
        (published.length === 1 ? " published event" : " published events") +
        " in assets/js/schedule-data.js";
    }
  }

  /* ----------------------------------------------------------------------
     Editor
     ---------------------------------------------------------------------- */

  function initEditor() {
    if (!grid || !monthLabel || !upcomingList || !form || !dialog) return;

    fields = {
      title: form.elements.namedItem("title"),
      category: form.elements.namedItem("category"),
      date: form.elements.namedItem("date"),
      start: form.elements.namedItem("start"),
      end: form.elements.namedItem("end"),
      location: form.elements.namedItem("location"),
      notes: form.elements.namedItem("notes")
    };

    Object.keys(C.CATEGORIES).forEach(function (key) {
      var option = document.createElement("option");
      option.value = key;
      option.textContent = C.CATEGORIES[key].label;
      fields.category.appendChild(option);
    });

    dialog.querySelectorAll("[data-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        dialog.close();
      });
    });

    dialog.addEventListener("close", function () {
      editingId = null;
      clearError();
    });

    form.addEventListener("input", clearError);

    form.addEventListener("submit", handleSave);
    deleteButton.addEventListener("click", handleDelete);

    document.getElementById("admin-prev").addEventListener("click", function () {
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
      render();
      announce("Showing " + monthLabel.textContent);
    });

    document.getElementById("admin-next").addEventListener("click", function () {
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      render();
      announce("Showing " + monthLabel.textContent);
    });

    document.getElementById("admin-today").addEventListener("click", function () {
      var today = new Date();
      cursor = new Date(today.getFullYear(), today.getMonth(), 1);
      render();
      announce("Showing " + monthLabel.textContent);
    });

    document.getElementById("admin-new").addEventListener("click", function () {
      openEditor(null, defaultDateKey());
    });

    grid.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-event-id]");
      if (chip) {
        var found = eventById(chip.getAttribute("data-event-id"));
        if (found) openEditor(found, found.date);
        return;
      }

      var add = event.target.closest("[data-add-date]");
      if (add) {
        openEditor(null, add.getAttribute("data-add-date"));
        return;
      }

      var cell = event.target.closest(".cal-day[data-date]");
      if (cell) openEditor(null, cell.getAttribute("data-date"));
    });

    upcomingList.addEventListener("click", function (event) {
      var item = event.target.closest("[data-event-id]");
      if (!item) return;
      var found = eventById(item.getAttribute("data-event-id"));
      if (found) openEditor(found, found.date);
    });

    document.getElementById("admin-download").addEventListener("click", downloadPublished);
    document.getElementById("admin-reset").addEventListener("click", resetDraft);
    document.querySelectorAll("[data-admin-lock]").forEach(function (button) {
      button.addEventListener("click", function () {
        setUnlocked(false);
        window.location.reload();
      });
    });

    render();
  }

  function render() {
    var result = C.renderMonth({
      grid: grid,
      monthLabel: monthLabel,
      events: events,
      cursor: cursor,
      editable: true
    });

    if (hint) {
      hint.textContent = result.monthEventCount
        ? "Click an event to edit it, or click an empty day to add another."
        : "No sales days in this month. Click a day or + to add one.";
    }

    C.renderUpcoming({
      container: upcomingList,
      events: events,
      editable: true,
      emptyText: "No upcoming sales days in this draft. Add one from the calendar."
    });

    updateStates();
  }

  function eventById(id) {
    for (var i = 0; i < events.length; i += 1) {
      if (events[i].id === id) return events[i];
    }
    return null;
  }

  function defaultDateKey() {
    var now = new Date();
    if (cursor.getFullYear() === now.getFullYear() && cursor.getMonth() === now.getMonth()) {
      return C.keyOf(now);
    }
    return C.keyOf(cursor);
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function openEditor(event, dateKey) {
    editingId = event ? event.id : null;
    form.reset();
    clearError();
    dialogTitle.textContent = event ? "Edit sales day" : "New sales day";
    deleteButton.hidden = !event;

    fields.title.value = event ? event.title : "";
    fields.category.value = event ? event.category : "sale";
    fields.date.value = event ? event.date : dateKey;
    fields.start.value = event ? event.start : "";
    fields.end.value = event ? event.end : "";
    fields.location.value = event ? event.location : "";
    fields.notes.value = event ? event.notes : "";

    dialog.showModal();
    window.setTimeout(function () {
      fields.title.focus();
    }, 20);
  }

  function handleSave(event) {
    event.preventDefault();

    var title = fields.title.value.trim();
    var date = fields.date.value;
    var start = fields.start.value;
    var end = fields.end.value;

    if (!title) {
      showError("Add a title for this sales day.");
      fields.title.focus();
      return;
    }
    if (!C.parseKey(date)) {
      showError("Choose a valid date.");
      fields.date.focus();
      return;
    }
    if (start && end && end <= start) {
      showError("The end time needs to be after the start time.");
      fields.end.focus();
      return;
    }

    var next = {
      id: editingId || newId(),
      date: date,
      start: start,
      end: end,
      title: title.slice(0, 90),
      category: C.CATEGORIES[fields.category.value] ? fields.category.value : "other",
      location: fields.location.value.trim().slice(0, 140),
      notes: fields.notes.value.trim().slice(0, 600)
    };

    var wasEditing = Boolean(editingId);
    var previous = null;
    var editedIndex = -1;

    if (wasEditing) {
      for (var i = 0; i < events.length; i += 1) {
        if (events[i].id === editingId) {
          previous = events[i];
          editedIndex = i;
          events[i] = next;
          break;
        }
      }
    } else {
      events.push(next);
    }

    if (!persistDraft()) {
      if (wasEditing && editedIndex !== -1) {
        events[editedIndex] = previous;
      } else {
        events = events.filter(function (item) {
          return item.id !== next.id;
        });
      }
      showError("This browser could not save the draft. Local storage may be blocked or full.");
      return;
    }

    var dateObj = C.parseKey(date);
    cursor = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    dialog.close();
    render();
    announce((wasEditing ? "Updated " : "Added ") + title + " on " + C.formatLong(date));
    BB.toast(wasEditing ? "Draft updated." : "Sales day added to the draft.");
  }

  function handleDelete() {
    if (!editingId) return;

    var index = -1;
    for (var i = 0; i < events.length; i += 1) {
      if (events[i].id === editingId) {
        index = i;
        break;
      }
    }
    if (index === -1) return;

    var removed = events[index];
    events.splice(index, 1);
    if (!persistDraft()) {
      events.splice(index, 0, removed);
      showError("This browser could not update the draft.");
      return;
    }

    dialog.close();
    render();
    announce("Removed " + removed.title);
    BB.toast("Sales day removed from the draft.", {
      actionLabel: "Undo",
      onAction: function () {
        events.push(removed);
        if (persistDraft()) {
          render();
          BB.toast("Sales day restored to the draft.");
        } else {
          events = events.filter(function (item) {
            return item.id !== removed.id;
          });
          updateStates();
          BB.toast("Could not restore that sales day.");
        }
      }
    });
  }

  function resetDraft() {
    if (!window.confirm("Reset the draft to the published schedule? This removes all local draft edits.")) {
      return;
    }
    events = published.slice();
    draftExists = false;
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      /* the in-memory reset still applies */
    }
    render();
    BB.toast("Draft reset to the published schedule.");
  }

  function downloadPublished() {
    var payload = {
      version: 1,
      updated: new Date().toISOString(),
      events: events
    };
    var code =
      "/* BitByBit — published sales-day schedule.\n" +
      "   Generated by the team editor. Replace assets/js/schedule-data.js with this file. */\n" +
      "window.BITBYBIT_SCHEDULE = " +
      JSON.stringify(payload, null, 2) +
      ";\n";

    var blob = new Blob([code], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "schedule-data.js";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
    BB.toast("Downloaded schedule-data.js. Replace the published file to go live.");
  }
})();

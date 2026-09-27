/* Marzley homepage interactions.
   The work list is a vanilla-JS port of the "interactive list preview" component:
   a white highlight bar follows the hovered row, the row's screenshot reveals from
   its centre (clip-path) and drifts with the cursor. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Motion is off when the visitor's device asks for it or they chose "Stop animations".
  var motionOff = function () {
    return reduceMotionQuery.matches || document.documentElement.classList.contains("a11y-still");
  };
  var hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)");

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && nav.classList.contains("is-open")) {
        toggle.click();
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || motionOff()) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- work list hover preview ---------- */
  function initWorkList() {
    var work = document.querySelector(".work");
    if (!work || typeof window.gsap === "undefined") return;

    var gsap = window.gsap;
    var list = work.querySelector(".work-list");
    var highlight = work.querySelector(".work-highlight");
    var layer = work.querySelector(".work-previews");
    var rows = Array.prototype.slice.call(work.querySelectorAll(".work-row"));

    var DURATION = 0.6;
    var SMOOTHNESS = 0.35;
    var LERP = 0.18;
    var OFFSET = 20;
    var HIDDEN = "inset(50%)";
    var VISIBLE = "inset(0%)";

    // Build one preview image per row from its data-img attribute.
    var previews = rows.map(function (row) {
      var box = document.createElement("div");
      box.className = "work-preview";
      var img = document.createElement("img");
      img.src = row.getAttribute("data-img");
      img.alt = "";
      img.decoding = "async";
      box.appendChild(img);
      layer.appendChild(box);
      return box;
    });

    var generation = previews.map(function () { return 0; });
    var pendingLeave = previews.map(function () { return false; });
    var activeIndex = null;
    var zIndex = 10;
    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var frame = null;

    function reduceMotion() { return motionOff(); }

    function resetPreviews() {
      previews.forEach(function (el) {
        gsap.killTweensOf(el);
        gsap.set(el, reduceMotion()
          ? { clipPath: VISIBLE, opacity: 0, visibility: "hidden" }
          : { clipPath: HIDDEN, opacity: 1, visibility: "hidden" });
      });
      gsap.set(highlight, { opacity: 0, y: 0, height: 0 });
      gsap.set(layer, { x: 0, y: 0 });
      target = { x: 0, y: 0 };
      current = { x: 0, y: 0 };
    }

    function tick() {
      if (!reduceMotion()) {
        current.x += (target.x - current.x) * LERP;
        current.y += (target.y - current.y) * LERP;
        gsap.set(layer, { x: current.x, y: current.y });
      }
      frame = requestAnimationFrame(tick);
    }

    function hideImage(index) {
      var el = previews[index];
      var gen = ++generation[index];
      var rm = reduceMotion();
      gsap.killTweensOf(el);
      gsap.to(el, {
        clipPath: rm ? VISIBLE : HIDDEN,
        opacity: 0,
        duration: rm ? SMOOTHNESS : DURATION,
        ease: rm ? "power2.out" : "power3.inOut",
        onComplete: function () {
          if (generation[index] === gen) gsap.set(el, { visibility: "hidden" });
        }
      });
    }

    function moveHighlight(row) {
      var listBox = list.getBoundingClientRect();
      var rowBox = row.getBoundingClientRect();
      gsap.to(highlight, {
        y: rowBox.top - listBox.top,
        height: rowBox.height,
        opacity: 1,
        duration: SMOOTHNESS,
        ease: "power3.out",
        overwrite: "auto"
      });
    }

    function activate(index) {
      var el = previews[index];
      var rm = reduceMotion();
      var previous = activeIndex;

      pendingLeave[index] = false;

      if (rm && previous !== null && previous !== index) {
        pendingLeave[previous] = false;
        hideImage(previous);
      }

      zIndex += 1;
      var gen = ++generation[index];
      gsap.killTweensOf(el);
      gsap.set(el, {
        zIndex: zIndex,
        visibility: "visible",
        clipPath: rm ? VISIBLE : HIDDEN,
        opacity: rm ? 0 : 1
      });
      gsap.to(el, {
        clipPath: VISIBLE,
        opacity: 1,
        duration: rm ? SMOOTHNESS : DURATION,
        ease: rm ? "power2.out" : "power2.inOut",
        onComplete: function () {
          if (generation[index] !== gen || !pendingLeave[index]) return;
          pendingLeave[index] = false;
          hideImage(index);
        }
      });

      if (previous !== null && previous !== index) rows[previous].classList.remove("is-active");
      rows[index].classList.add("is-active");
      activeIndex = index;
      moveHighlight(rows[index]);
    }

    function deactivate(index) {
      if (gsap.isTweening(previews[index])) {
        pendingLeave[index] = true;
        return;
      }
      hideImage(index);
    }

    function clearActive() {
      if (activeIndex !== null) rows[activeIndex].classList.remove("is-active");
      activeIndex = null;
      gsap.to(highlight, { opacity: 0, duration: SMOOTHNESS, ease: "power2.out", overwrite: "auto" });
      target = { x: 0, y: 0 };
    }

    rows.forEach(function (row, index) {
      row.addEventListener("mouseenter", function () { if (hoverQuery.matches) activate(index); });
      row.addEventListener("mouseleave", function () { if (hoverQuery.matches) deactivate(index); });
      // Keyboard users get the same preview when tabbing through projects.
      row.addEventListener("focus", function () { if (hoverQuery.matches) activate(index); });
      row.addEventListener("blur", function () {
        if (!hoverQuery.matches) return;
        deactivate(index);
        if (!list.contains(document.activeElement)) clearActive();
      });
    });

    list.addEventListener("mouseleave", function () { if (hoverQuery.matches) clearActive(); });

    work.addEventListener("mousemove", function (event) {
      if (reduceMotion() || !hoverQuery.matches) return;
      var box = work.getBoundingClientRect();
      target = {
        x: ((event.clientX - box.left) / box.width - 0.5) * OFFSET,
        y: ((event.clientY - box.top) / box.height - 0.5) * OFFSET
      };
    });

    function onModeChange() {
      if (activeIndex !== null) rows[activeIndex].classList.remove("is-active");
      activeIndex = null;
      resetPreviews();
    }

    reduceMotionQuery.addEventListener && reduceMotionQuery.addEventListener("change", onModeChange);
    hoverQuery.addEventListener && hoverQuery.addEventListener("change", onModeChange);

    resetPreviews();
    frame = requestAnimationFrame(tick);
  }

  initWorkList();

  /* ---------- contact form (Formspree, with WhatsApp / email fallback) ---------- */
  var form = document.getElementById("booking-form");
  if (form) {
    var statusBox = document.getElementById("booking-status");
    var feedback = document.getElementById("booking-feedback");
    var fallback = document.getElementById("booking-fallback");
    var submit = document.getElementById("booking-submit");
    var waLinks = [document.getElementById("booking-wa"), document.getElementById("fallback-wa")];
    var mailLink = document.getElementById("fallback-mail");
    var WA_NUMBER = "254745789590";
    var EMAIL = "marzleytechsolutionltd@gmail.com";

    var fieldValue = function (name) {
      var el = form.elements[name];
      return el && el.value ? el.value.trim() : "";
    };

    var buildMessage = function () {
      var lines = ["Hello Marzley, I'd like to request a service."];
      if (fieldValue("name")) lines.push("Name: " + fieldValue("name"));
      if (fieldValue("_replyto")) lines.push("Email: " + fieldValue("_replyto"));
      if (fieldValue("phone")) lines.push("Phone: " + fieldValue("phone"));
      if (fieldValue("service")) lines.push("Service: " + fieldValue("service"));
      if (fieldValue("message")) lines.push("", fieldValue("message"));
      return lines.join("\n");
    };

    var refreshLinks = function () {
      var text = encodeURIComponent(buildMessage());
      waLinks.forEach(function (a) { if (a) a.href = "https://wa.me/" + WA_NUMBER + "?text=" + text; });
      if (mailLink) {
        var subject = encodeURIComponent("Service request" + (fieldValue("service") ? ": " + fieldValue("service") : ""));
        mailLink.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + text;
      }
    };

    var showStatus = function (text, kind, withFallback) {
      statusBox.hidden = false;
      feedback.textContent = text;
      feedback.className = "form-feedback" + (kind ? " " + kind : "");
      fallback.hidden = !withFallback;
      if (waLinks[0]) waLinks[0].hidden = !!withFallback;
    };

    form.addEventListener("input", refreshLinks);
    form.addEventListener("change", refreshLinks);
    refreshLinks();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      refreshLinks();
      statusBox.hidden = true;
      if (waLinks[0]) waLinks[0].hidden = false;
      submit.disabled = true;
      submit.textContent = "Sending…";

      var controller = "AbortController" in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (controller) controller.abort(); }, 15000);

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            refreshLinks();
            showStatus("Request sent. I'll get back to you shortly.", "ok", false);
            return;
          }
          return response.json().catch(function () { return null; }).then(function (err) {
            var detail = err && err.errors ? err.errors.map(function (e) { return e.message; }).join(", ") + ". " : "";
            showStatus(detail + "The form couldn't send your request. Your message is still here, so send it on WhatsApp or by email instead:", "err", true);
          });
        })
        .catch(function () {
          showStatus("The form couldn't connect. Your message is still here, so send it on WhatsApp or by email instead:", "err", true);
        })
        .then(function () {
          clearTimeout(timer);
          submit.disabled = false;
          submit.textContent = "Send request";
        });
    });
  }

  /* ---------- "Continue with Google" to fill the contact form ---------- */
  // Uses Google Identity Services with the public client ID only. The token is
  // decoded in the browser just to read the name and email; it is not stored or sent anywhere.
  var googleBox = document.getElementById("google-fill");
  var clientIdMeta = document.querySelector('meta[name="google-signin-client_id"]');
  if (googleBox && clientIdMeta && location.protocol === "https:") {
    var googleStatus = document.getElementById("google-fill-status");
    var googleClear = document.getElementById("google-clear");
    var nameInput = document.getElementById("f-name");
    var emailInput = document.getElementById("f-email");

    var decodeJwt = function (token) {
      var part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      while (part.length % 4) part += "=";
      var json = decodeURIComponent(atob(part).split("").map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
      return JSON.parse(json);
    };

    var fire = function (el) { el.dispatchEvent(new Event("input", { bubbles: true })); };

    var onCredential = function (response) {
      try {
        var data = decodeJwt(response.credential);
        if (data.name) { nameInput.value = data.name; fire(nameInput); }
        if (data.email) { emailInput.value = data.email; fire(emailInput); }
        googleStatus.textContent = "Filled in as " + (data.name || data.email) + ". Add your project details below.";
        googleClear.hidden = false;
        var message = document.getElementById("f-message");
        if (message) message.focus();
      } catch (e) {
        googleStatus.textContent = "Couldn't read your Google details. Please type them in.";
      }
    };

    googleClear.addEventListener("click", function () {
      nameInput.value = ""; emailInput.value = "";
      fire(nameInput); fire(emailInput);
      googleClear.hidden = true;
      googleStatus.textContent = "Fill in your name and email with your Google account.";
      if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
      nameInput.focus();
    });

    var tries = 0;
    var startGoogle = function () {
      if (!(window.google && google.accounts && google.accounts.id)) {
        if (++tries < 40) setTimeout(startGoogle, 250);
        return;
      }
      google.accounts.id.initialize({
        client_id: clientIdMeta.content,
        callback: onCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: "use"
      });
      google.accounts.id.renderButton(document.getElementById("google-button"), {
        type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "pill", logo_alignment: "left"
      });
      googleBox.hidden = false;
    };
    startGoogle();
  }

  /* ---------- accessibility menu ---------- */
  var a11yToggle = document.getElementById("a11y-toggle");
  var a11yPanel = document.getElementById("a11y-panel");
  if (a11yToggle && a11yPanel) {
    var htmlEl = document.documentElement;
    var A11Y_KEY = "marzley-a11y";
    var SIZES = { "-1": "90%", "0": "100%", "1": "112%", "2": "125%", "3": "140%" };
    var a11yState = {};
    try { a11yState = JSON.parse(localStorage.getItem(A11Y_KEY) || "{}") || {}; } catch (e) { a11yState = {}; }

    var saveA11y = function () {
      try { localStorage.setItem(A11Y_KEY, JSON.stringify(a11yState)); } catch (e) {}
    };

    var loadReadableFont = function () {
      if (document.getElementById("a11y-font-link")) return;
      var link = document.createElement("link");
      link.id = "a11y-font-link";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap";
      document.head.appendChild(link);
    };

    var sizeValue = document.getElementById("a11y-size-value");
    var sizeButtons = a11yPanel.querySelectorAll("[data-size-step]");
    var applySize = function () {
      var size = Number(a11yState.size || 0);
      if (size === 0) htmlEl.removeAttribute("data-a11y-size");
      else htmlEl.setAttribute("data-a11y-size", String(size));
      sizeValue.textContent = SIZES[String(size)];
      sizeButtons.forEach(function (b) {
        var step = Number(b.getAttribute("data-size-step"));
        b.disabled = (step < 0 && size <= -1) || (step > 0 && size >= 3);
      });
    };

    var optionButtons = a11yPanel.querySelectorAll("[data-a11y]");
    var applyOptions = function () {
      optionButtons.forEach(function (btn) {
        var key = btn.getAttribute("data-a11y");
        var on = a11yState[key] === true;
        htmlEl.classList.toggle("a11y-" + key, on);
        btn.setAttribute("aria-pressed", String(on));
      });
      if (a11yState.font) loadReadableFont();
    };

    optionButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-a11y");
        a11yState[key] = !a11yState[key];
        if (!a11yState[key]) delete a11yState[key];
        applyOptions();
        saveA11y();
      });
    });

    sizeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = Math.max(-1, Math.min(3, Number(a11yState.size || 0) + Number(btn.getAttribute("data-size-step"))));
        if (next === 0) delete a11yState.size; else a11yState.size = next;
        applySize();
        saveA11y();
      });
    });

    // Reading guide follows the pointer (and the focused element for keyboard users)
    var guide = document.getElementById("reading-guide");
    var moveGuide = function (y) { if (guide) guide.style.transform = "translateY(" + Math.max(0, y - 23) + "px)"; };
    document.addEventListener("mousemove", function (e) {
      if (htmlEl.classList.contains("a11y-guide")) moveGuide(e.clientY);
    }, { passive: true });
    document.addEventListener("focusin", function (e) {
      if (!htmlEl.classList.contains("a11y-guide") || !e.target.getBoundingClientRect) return;
      var r = e.target.getBoundingClientRect();
      moveGuide(r.top + r.height / 2);
    });

    // Read on hover (browser speech): reads only the text the visitor points at, taps or focuses
    var readBtn = document.getElementById("a11y-read");
    var hint = document.getElementById("a11y-hint");
    var synth = window.speechSynthesis;
    var hoverReading = false;
    var readTimer = null;
    var lastSpoken = null;
    var READABLE = "h1, h2, h3, h4, h5, h6, p, li, dt, dd, summary, blockquote, figcaption, label, legend, a, button, output, .name, .desc, .cat, .badge, .price, .stat";
    var setReading = function (on) {
      hoverReading = on;
      readBtn.setAttribute("aria-pressed", String(on));
      htmlEl.classList.toggle("a11y-reading", on);
      if (!on) {
        if (synth) synth.cancel();
        clearTimeout(readTimer);
        if (lastSpoken) lastSpoken.classList.remove("is-speaking");
        lastSpoken = null;
      }
    };
    var textOf = function (el) {
      var label = el.getAttribute("aria-label");
      var t = (label || el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
      if (!t && el.tagName === "IMG") t = el.alt || "";
      return t.slice(0, 600);
    };
    var speakElement = function (el) {
      if (!el || el === lastSpoken) return;
      var text = textOf(el);
      if (!text) return;
      synth.cancel();
      if (lastSpoken) lastSpoken.classList.remove("is-speaking");
      lastSpoken = el;
      el.classList.add("is-speaking");
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-GB";
      utter.onend = utter.onerror = function () {
        el.classList.remove("is-speaking");
        if (lastSpoken === el) lastSpoken = null;
      };
      synth.speak(utter);
    };
    var targetFrom = function (node) {
      if (!node || !node.closest) return null;
      if (node.closest("[aria-hidden='true'], .reading-guide")) return null;
      var el = node.closest(READABLE);
      return el;
    };
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      readBtn.disabled = true;
      hint.textContent = "Read on hover isn't supported in this browser.";
    } else {
      readBtn.addEventListener("click", function () {
        setReading(!hoverReading);
        if (hoverReading) {
          var intro = new SpeechSynthesisUtterance("Read on hover is on. Point at any text to hear it.");
          intro.lang = "en-GB";
          synth.cancel();
          synth.speak(intro);
        }
      });
      document.addEventListener("mouseover", function (e) {
        if (!hoverReading) return;
        var el = targetFrom(e.target);
        clearTimeout(readTimer);
        if (el) readTimer = setTimeout(function () { speakElement(el); }, 350);
      });
      document.addEventListener("pointerdown", function (e) {
        if (hoverReading && e.pointerType !== "mouse") speakElement(targetFrom(e.target));
      });
      document.addEventListener("focusin", function (e) {
        if (hoverReading) speakElement(targetFrom(e.target) || e.target);
      });
      window.addEventListener("pagehide", function () { synth.cancel(); });
    }

    // Open / close with focus handling
    var closeBtn = document.getElementById("a11y-close");
    var openPanel = function () {
      a11yPanel.hidden = false;
      a11yToggle.setAttribute("aria-expanded", "true");
      closeBtn.focus();
    };
    var closePanel = function (returnFocus) {
      a11yPanel.hidden = true;
      a11yToggle.setAttribute("aria-expanded", "false");
      if (returnFocus) a11yToggle.focus();
    };
    // ----- movable button: drag (or arrow keys) along any screen edge -----
    var DOCK_KEY = "marzley-a11y-dock";
    var BTN = 52, HEADER = 72, GAP = 8;
    var dock = { edge: "left", pos: 0.5 };
    try {
      var savedDock = JSON.parse(localStorage.getItem(DOCK_KEY) || "null");
      if (savedDock && /^(left|right|top|bottom)$/.test(savedDock.edge)) dock = savedDock;
    } catch (e) {}
    var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
    var placeToggle = function () {
      var vw = window.innerWidth, vh = window.innerHeight;
      var left, top;
      if (dock.edge === "left" || dock.edge === "right") {
        top = clamp(dock.pos * vh - BTN / 2, HEADER + GAP, vh - BTN - GAP);
        left = dock.edge === "left" ? 0 : vw - BTN;
      } else {
        left = clamp(dock.pos * vw - BTN / 2, GAP, vw - BTN - GAP);
        top = dock.edge === "top" ? HEADER : vh - BTN;
      }
      a11yToggle.style.left = left + "px";
      a11yToggle.style.top = top + "px";
      a11yToggle.style.transform = "";
      a11yToggle.classList.remove("edge-left", "edge-right", "edge-top", "edge-bottom");
      a11yToggle.classList.add("edge-" + dock.edge);
    };
    var saveDock = function () { try { localStorage.setItem(DOCK_KEY, JSON.stringify(dock)); } catch (e) {} };
    var positionPanel = function () {
      if (a11yPanel.hidden || window.innerWidth <= 700) return;
      var r = a11yToggle.getBoundingClientRect();
      var vw = window.innerWidth, vh = window.innerHeight;
      var pw = a11yPanel.offsetWidth, ph = a11yPanel.offsetHeight;
      var left, top;
      if (dock.edge === "left") { left = r.right + 12; top = r.top + r.height / 2 - ph / 2; }
      else if (dock.edge === "right") { left = r.left - pw - 12; top = r.top + r.height / 2 - ph / 2; }
      else if (dock.edge === "top") { top = r.bottom + 12; left = r.left + r.width / 2 - pw / 2; }
      else { top = r.top - ph - 12; left = r.left + r.width / 2 - pw / 2; }
      a11yPanel.style.left = clamp(left, 12, vw - pw - 12) + "px";
      a11yPanel.style.top = clamp(top, HEADER, Math.max(HEADER, vh - ph - 12)) + "px";
    };
    var snapTo = function (x, y) {
      var vw = window.innerWidth, vh = window.innerHeight;
      var d = { left: x, right: vw - x, top: y - HEADER, bottom: vh - y };
      var edge = Object.keys(d).reduce(function (a, b) { return d[a] <= d[b] ? a : b; });
      dock = { edge: edge, pos: edge === "left" || edge === "right" ? y / vh : x / vw };
      placeToggle();
      saveDock();
      positionPanel();
    };

    var drag = null, suppressClick = false;
    a11yToggle.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
    });
    document.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 8) return;
      if (!drag.moved) {
        drag.moved = true;
        try { a11yToggle.setPointerCapture(e.pointerId); } catch (err) {}
        a11yToggle.classList.add("is-dragging");
        if (!a11yPanel.hidden) closePanel(false);
      }
      a11yToggle.style.left = clamp(e.clientX - BTN / 2, 0, window.innerWidth - BTN) + "px";
      a11yToggle.style.top = clamp(e.clientY - BTN / 2, 0, window.innerHeight - BTN) + "px";
    });
    var endDrag = function (e) {
      if (!drag) return;
      if (drag.moved) {
        a11yToggle.classList.remove("is-dragging");
        snapTo(e.clientX, e.clientY);
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 0);
      }
      drag = null;
    };
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", function () {
      if (drag && drag.moved) { a11yToggle.classList.remove("is-dragging"); placeToggle(); }
      drag = null;
    });
    a11yToggle.addEventListener("click", function (e) {
      if (suppressClick) { e.preventDefault(); return; }
      if (a11yPanel.hidden) { openPanel(); positionPanel(); } else closePanel(false);
    });
    // Keyboard: arrows slide along the edge; pressing toward the opposite side jumps to that edge
    a11yToggle.addEventListener("keydown", function (e) {
      var step = 0.06, handled = true, vertical = dock.edge === "left" || dock.edge === "right";
      if (e.key === "ArrowUp") { if (vertical) dock.pos -= step; else dock.edge = "top"; }
      else if (e.key === "ArrowDown") { if (vertical) dock.pos += step; else dock.edge = "bottom"; }
      else if (e.key === "ArrowLeft") { if (vertical) dock.edge = "left"; else dock.pos -= step; }
      else if (e.key === "ArrowRight") { if (vertical) dock.edge = "right"; else dock.pos += step; }
      else handled = false;
      if (!handled) return;
      e.preventDefault();
      dock.pos = clamp(dock.pos, 0, 1);
      placeToggle();
      saveDock();
      positionPanel();
    });
    window.addEventListener("resize", function () { placeToggle(); positionPanel(); });
    placeToggle();
    closeBtn.addEventListener("click", function () { closePanel(true); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !a11yPanel.hidden) closePanel(true);
    });
    document.addEventListener("click", function (e) {
      if (!a11yPanel.hidden && !a11yPanel.contains(e.target) && !a11yToggle.contains(e.target)) closePanel(false);
    });

    document.getElementById("a11y-reset").addEventListener("click", function () {
      a11yState = {};
      saveA11y();
      if (synth) synth.cancel();
      if (readBtn) setReading(false);
      applySize();
      applyOptions();
    });

    applySize();
    applyOptions();
  }

  /* ---------- live M-Pesa test payment (KSh 1) with simulation fallback ---------- */
  var demoForm = document.getElementById("demo-checkout");
  if (demoForm) {
    var demoPhone = document.getElementById("demo-phone");
    var demoError = document.getElementById("demo-error");
    var demoPay = document.getElementById("demo-pay");
    var demoSimBtn = document.getElementById("demo-sim");
    var screens = {
      idle: document.getElementById("phone-idle"),
      live: document.getElementById("phone-live"),
      stk: document.getElementById("phone-stk"),
      processing: document.getElementById("phone-processing"),
      sms: document.getElementById("phone-sms"),
      cancelled: document.getElementById("phone-cancelled")
    };
    var show = function (name) {
      Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
    };
    var phoneTime = document.getElementById("phone-time");
    var tickPhone = function () {
      try {
        phoneTime.textContent = new Intl.DateTimeFormat("en-KE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Nairobi" }).format(new Date());
      } catch (e) {
        var d = new Date(); phoneTime.textContent = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      }
    };
    tickPhone(); setInterval(tickPhone, 30000);

    var normalise = function (raw) {
      var digits = raw.replace(/\D/g, "");
      if (/^0[17]\d{8}$/.test(digits)) return "254" + digits.slice(1);
      if (/^254[17]\d{8}$/.test(digits)) return digits;
      if (/^[17]\d{8}$/.test(digits)) return "254" + digits;
      return null;
    };
    var maskOf = function (msisdn) { return "0" + msisdn.slice(3, 6) + " ••• " + msisdn.slice(-3); };
    var smsText = document.getElementById("sms-text");
    var cancelText = document.getElementById("cancel-text");
    var pollTimer = null;
    var busy = false;

    var finish = function () { busy = false; demoPay.disabled = false; };
    var resetDemo = function () {
      clearTimeout(pollTimer);
      finish();
      show("idle");
    };
    var failWith = function (message) {
      cancelText.textContent = message;
      show("cancelled");
      finish();
      document.getElementById("demo-again-2").focus();
    };
    var REASONS = {
      1: "The payment didn't go through because the M-Pesa balance is too low.",
      1032: "You cancelled the M-Pesa prompt. No money was deducted.",
      1037: "The prompt timed out before a PIN was entered. No money was deducted.",
      2001: "The PIN entered was wrong. No money was deducted."
    };

    var pollStatus = function (id, tries) {
      fetch("status.php?id=" + encodeURIComponent(id), { headers: { Accept: "application/json" }, cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (s) {
          if (s.status === "paid") {
            smsText.textContent = (s.receipt || "Payment") + " Confirmed. Ksh" + (s.amount || 1) +
              ".00 paid to MARZLEY TECH SOLUTIONS. Thank you for trying a live M-Pesa checkout!";
            show("sms");
            finish();
            document.getElementById("demo-again").focus();
          } else if (s.status === "failed") {
            failWith(REASONS[s.code] || s.message || "The payment didn't go through. No money was deducted.");
          } else if (tries > 0) {
            pollTimer = setTimeout(function () { pollStatus(id, tries - 1); }, 3000);
          } else {
            failWith("We haven't received a confirmation yet. If you entered your PIN, you'll still get the M-Pesa SMS.");
          }
        })
        .catch(function () {
          if (tries > 0) pollTimer = setTimeout(function () { pollStatus(id, tries - 1); }, 3000);
          else failWith("We couldn't check the payment status. If you paid, you'll get the M-Pesa SMS.");
        });
    };

    var unavailable = function (message) {
      demoError.textContent = message;
      demoSimBtn.hidden = false;
      show("idle");
      finish();
    };

    demoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      var msisdn = normalise(demoPhone.value);
      if (!msisdn) {
        demoError.textContent = "Enter a Safaricom number like 0712 345 678.";
        demoPhone.focus();
        return;
      }
      demoError.textContent = "";
      demoSimBtn.hidden = true;
      busy = true;
      demoPay.disabled = true;
      show("processing");

      var body = new FormData();
      body.append("phone", "0" + msisdn.slice(3));
      body.append("amount", "1");
      var controller = "AbortController" in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (controller) controller.abort(); }, 35000);

      fetch("stkpush.php", { method: "POST", body: body, headers: { Accept: "application/json" }, signal: controller ? controller.signal : undefined })
        .then(function (r) {
          return r.text().then(function (t) {
            var data = null;
            try { data = JSON.parse(t); } catch (err) { data = null; }
            return { ok: r.ok, data: data };
          });
        })
        .then(function (res) {
          clearTimeout(timer);
          var d = res.data;
          if (!d) return unavailable("Live payments aren't available on this page right now.");
          if (res.ok && String(d.ResponseCode) === "0" && d.CheckoutRequestID) {
            document.getElementById("live-msg").textContent = "A KSh 1 M-Pesa prompt was sent to " + maskOf(msisdn) +
              ". Enter your PIN on your phone to pay.";
            show("live");
            pollStatus(d.CheckoutRequestID, 30);
            return;
          }
          unavailable(d.error || d.errorMessage || d.CustomerMessage || "M-Pesa couldn't send the prompt. Please try again.");
        })
        .catch(function () {
          clearTimeout(timer);
          unavailable("Couldn't reach the payment service. Check your connection and try again.");
        });
    });

    // ----- simulation (used when live payments aren't available) -----
    var simulate = function () {
      var msisdn = normalise(demoPhone.value) || "254712345678";
      demoError.textContent = "";
      demoSimBtn.hidden = true;
      busy = true;
      demoPay.disabled = true;
      document.getElementById("stk-dots").textContent = "____";
      show("processing");
      setTimeout(function () {
        show("stk");
        document.getElementById("stk-send").focus();
        document.getElementById("stk-send").setAttribute("data-mask", maskOf(msisdn));
      }, 1000);
    };
    demoSimBtn.addEventListener("click", simulate);
    document.getElementById("stk-send").addEventListener("click", function () {
      var masked = this.getAttribute("data-mask") || "your number";
      document.getElementById("stk-dots").textContent = "••••";
      setTimeout(function () {
        show("processing");
        setTimeout(function () {
          var letters = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789", code = "T";
          for (var i = 0; i < 9; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
          smsText.textContent = code + " Confirmed. Ksh1.00 paid to MARZLEY TECH SOLUTIONS from " + masked +
            ". This was a simulation: no money was moved.";
          show("sms");
          finish();
          document.getElementById("demo-again").focus();
        }, 1400);
      }, 400);
    });
    document.getElementById("stk-cancel").addEventListener("click", function () {
      failWith("Request cancelled by user. No money was deducted.");
    });
    ["demo-again", "demo-again-2"].forEach(function (id) {
      document.getElementById(id).addEventListener("click", function () { resetDemo(); demoPhone.focus(); });
    });
  }

  /* ---------- project planner ---------- */
  var planner = document.getElementById("planner-app");
  if (planner) {
    var steps = Array.prototype.slice.call(planner.querySelectorAll(".planner-step"));
    var bar = document.getElementById("planner-bar");
    var countEl = document.getElementById("planner-count");
    var backBtn = document.getElementById("planner-back");
    var nextBtn = document.getElementById("planner-next");
    var navBox = document.getElementById("planner-nav");
    var resultBox = document.getElementById("planner-result");
    var current = 0;
    var fmtKsh = function (n) { return "KSh " + n.toLocaleString("en-KE"); };
    var EXTRAS = {
      hosting: { label: "Domain & hosting (first year)", price: 3000 },
      logo: { label: "Logo & branding", price: 2500 },
      seo: { label: "SEO so you show up on Google", price: 5000 },
      security: { label: "Security & backups", price: 3500 }
    };
    var PACKAGES = {
      landing: { name: "Landing page", price: 15000, items: ["1–3 responsive pages", "Contact page", "Modern, mobile-first design"] },
      business: { name: "Small business website", price: 25000, items: ["Home, About, Services and Contact pages", "Social & Google integrations", "Analytics setup"] },
      ecommerce: { name: "E-commerce website", price: 40000, items: ["Product catalog & order management", "Live chat & delivery setup", "M-Pesa & PayPal payments"] },
      corporate: { name: "Corporate website or custom system", price: 60000, items: ["Custom design, unlimited pages", "Database, CRM & system integrations", "Admin tools and dashboards"] }
    };
    var EXAMPLES = {
      landing: { name: "Personal Portfolio", href: "#work" },
      business: { name: "Job Cyber", href: "#work" },
      ecommerce: { name: "Marzley E-Commerce", href: "#work" },
      corporate: { name: "CBET Planner", href: "https://cbetplanner.co.ke/" }
    };

    var val = function (name) {
      var el = planner.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    };
    // Step 2 (size) and 3 (payments) don't apply to "learn"; size doesn't apply to "shop"/"system".
    var applicable = function (i) {
      var goal = val("goal");
      if (i === 1) return goal === "showcase" || goal === "simple";
      if (i === 2) return goal !== "learn";
      if (i === 3) return goal !== "learn";
      return true;
    };
    var visibleSteps = function () {
      return steps.map(function (_, i) { return i; }).filter(applicable);
    };
    var answered = function (i) {
      if (i === 3) return true; // extras are optional
      var name = ["goal", "size", "pay"][i];
      return !!val(name);
    };

    var render = function () {
      var order = visibleSteps();
      var pos = order.indexOf(current);
      steps.forEach(function (s, i) { s.hidden = i !== current; });
      resultBox.hidden = true;
      navBox.hidden = false;
      countEl.hidden = false;
      countEl.textContent = "Question " + (pos + 1) + " of " + order.length;
      bar.style.width = ((pos + 1) / (order.length + 1) * 100) + "%";
      backBtn.disabled = pos === 0;
      nextBtn.disabled = !answered(current);
      nextBtn.textContent = pos === order.length - 1 ? "See my plan" : "Next";
    };

    var recommend = function () {
      var goal = val("goal"), size = val("size"), pay = val("pay");
      if (goal === "learn") return null;
      if (goal === "shop") return "ecommerce";
      if (goal === "system") return "corporate";
      if (goal === "simple") return size === "large" ? "business" : "landing";
      if (size === "large") return "corporate";
      if (size === "small" && pay === "none") return "landing";
      return "business";
    };

    var showResult = function () {
      steps.forEach(function (s) { s.hidden = true; });
      navBox.hidden = true;
      countEl.hidden = true;
      bar.style.width = "100%";
      var list = document.getElementById("result-list");
      list.innerHTML = "";
      var addItem = function (t) { var li = document.createElement("li"); li.textContent = t; list.appendChild(li); };
      var pay = val("pay");
      var extras = Array.prototype.map.call(planner.querySelectorAll('input[name="extra"]:checked'), function (x) { return x.value; });
      var key = recommend();
      var lines = ["Hello Marzley, I used the project planner on your website."];
      var example = document.getElementById("result-example");

      if (!key) {
        document.getElementById("result-title").textContent = "Training & mentorship";
        document.getElementById("result-price").textContent = "Ask about the next class";
        ["Practical, project-based lessons", "Web development, programming and design", "Mentorship from a working developer"].forEach(addItem);
        example.textContent = "Over 200 students trained so far.";
        lines.push("I'm interested in training and mentorship.");
      } else {
        var pkg = PACKAGES[key];
        var total = pkg.price;
        pkg.items.forEach(addItem);
        if (pay !== "none" && key !== "ecommerce") addItem(pay === "all" ? "M-Pesa and card payments (quoted with your project)" : "M-Pesa payments (quoted with your project)");
        extras.forEach(function (x) { total += EXTRAS[x].price; addItem(EXTRAS[x].label + " · " + fmtKsh(EXTRAS[x].price)); });
        document.getElementById("result-title").textContent = pkg.name;
        document.getElementById("result-price").textContent = "Estimated from " + fmtKsh(total);
        var ex = EXAMPLES[key];
        example.innerHTML = "";
        example.appendChild(document.createTextNode("Similar project I've built: "));
        var a = document.createElement("a");
        a.href = ex.href; a.textContent = ex.name;
        if (/^https?:/.test(ex.href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
        example.appendChild(a);
        lines.push("Recommended: " + pkg.name + " (from " + fmtKsh(pkg.price) + ").");
        if (pay && pay !== "none") lines.push("Payments: " + (pay === "all" ? "M-Pesa and cards" : "M-Pesa"));
        if (extras.length) lines.push("Extras: " + extras.map(function (x) { return EXTRAS[x].label; }).join(", "));
        lines.push("Estimated from " + fmtKsh(total) + ".");
      }
      document.getElementById("result-wa").href = "https://wa.me/254745789590?text=" + encodeURIComponent(lines.join("\n"));
      resultBox.hidden = false;
      resultBox.focus();
    };

    planner.addEventListener("change", function (e) {
      if (e.target.name === "goal") {
        // changing the goal resets later answers that may no longer apply
        planner.querySelectorAll('input[name="size"], input[name="pay"]').forEach(function (x) { x.checked = false; });
      }
      render();
    });
    nextBtn.addEventListener("click", function () {
      var order = visibleSteps();
      var pos = order.indexOf(current);
      if (pos === order.length - 1) { showResult(); return; }
      current = order[pos + 1];
      render();
      var first = steps[current].querySelector("input");
      if (first) first.focus();
    });
    backBtn.addEventListener("click", function () {
      var order = visibleSteps();
      var pos = order.indexOf(current);
      if (pos > 0) { current = order[pos - 1]; render(); }
    });
    document.getElementById("planner-restart").addEventListener("click", function () {
      planner.querySelectorAll("input").forEach(function (x) { x.checked = false; });
      current = 0;
      render();
      var first = steps[0].querySelector("input");
      if (first) first.focus();
    });
    render();
  }

  /* ---------- 24/7 availability with live Kenya time ---------- */
  var openBox = document.getElementById("open-status");
  if (openBox) {
    var openDetail = document.getElementById("open-detail");
    var updateOpen = function () {
      var clock;
      try {
        clock = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Nairobi", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
      } catch (e) {
        var d = new Date(Date.now() + (3 * 60 + new Date().getTimezoneOffset()) * 60000);
        clock = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      }
      openBox.className = "open-status is-open";
      openDetail.textContent = "It's " + clock + " in Kenya and we're available. We offer our services 24 hours, 7 days a week. Contact us online anytime.";
    };
    updateOpen();
    setInterval(updateOpen, 60000);
  }

  /* ---------- donate (Paystack) ---------- */
  var donate = document.getElementById("donate-btn");
  if (donate) {
    donate.addEventListener("click", function () {
      if (typeof window.PaystackPop === "undefined") {
        window.open("https://paystack.shop/pay/yxq9x-qg6d", "_blank", "noopener");
        return;
      }
      var amount = Number(prompt("Enter the amount you want to donate (KSh):"));
      if (!amount || amount <= 0) return;
      var email = prompt("Your email address (for the receipt):");
      if (!email || email.indexOf("@") === -1) return;
      window.PaystackPop.setup({
        key: "pk_live_60a185fa3aad8a497acdd0013d119219ca5a19c2",
        email: email,
        amount: Math.round(amount * 100),
        currency: "KES",
        callback: function (response) {
          alert("Thank you for your support! Reference: " + response.reference);
        }
      }).openIframe();
    });
  }

  /* ---------- app download: "coming soon" until the APK is uploaded ---------- */
  var appSoon = document.getElementById("app-soon");
  var appSoonTimer;
  var showAppSoon = function () {
    if (!appSoon) return;
    appSoon.hidden = false;
    clearTimeout(appSoonTimer);
    appSoonTimer = setTimeout(function () { appSoon.hidden = true; }, 6000);
  };
  var appSoonClose = document.getElementById("app-soon-close");
  if (appSoonClose) appSoonClose.addEventListener("click", function () { appSoon.hidden = true; });
  document.querySelectorAll("[data-app-download]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var href = link.getAttribute("href");
      fetch(href, { method: "HEAD", cache: "no-store" })
        .then(function (res) {
          var type = res.headers.get("content-type") || "";
          if (res.ok && type.indexOf("text/html") === -1) window.location.href = href;
          else showAppSoon();
        })
        .catch(showAppSoon);
    });
  });

  /* ---------- hide projects whose screenshot is missing ---------- */
  var updateChipCounts = function () {
    var items = document.querySelectorAll(".work-list li");
    document.querySelectorAll(".work-filters .chip").forEach(function (chip) {
      var f = chip.getAttribute("data-filter");
      var n = 0;
      items.forEach(function (li) { if (f === "all" || li.getAttribute("data-cat") === f) n += 1; });
      var badge = chip.querySelector("span");
      if (badge) badge.textContent = String(n);
      chip.hidden = n === 0;
    });
    var nums = document.querySelectorAll(".work-list .num");
    nums.forEach(function (el, i) { el.textContent = (i + 1 < 10 ? "0" : "") + (i + 1); });
  };
  document.querySelectorAll(".work-list li").forEach(function (li) {
    var row = li.querySelector(".work-row");
    if (!row) return;
    var probe = new Image();
    probe.onerror = function () { li.remove(); updateChipCounts(); };
    probe.src = row.getAttribute("data-img");
  });

  /* ---------- project filters ---------- */
  var chips = document.querySelectorAll(".work-filters .chip");
  var workList = document.querySelector(".work-list");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", String(on));
      });
      if (workList) workList.dispatchEvent(new Event("mouseleave"));
      document.querySelectorAll(".work-list li").forEach(function (li) {
        li.hidden = filter !== "all" && li.getAttribute("data-cat") !== filter;
      });
    });
  });

  /* ---------- count-up stats ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && !motionOff()) {
    counters.forEach(function (el) { el.textContent = "0"; });
    var start = null;
    var DURATION_MS = 1600;
    var step = function (ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / DURATION_MS);
      var eased = 1 - Math.pow(1 - t, 3);
      counters.forEach(function (el) {
        el.textContent = String(Math.round(Number(el.getAttribute("data-count")) * eased));
      });
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- header shadow + current section in nav ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window && nav) {
    var links = {};
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) {
          links[id].classList.toggle("is-current", links[id] === link);
          if (links[id] === link) links[id].setAttribute("aria-current", "true");
          else links[id].removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- dark mode toggle ---------- */
  var themeBtn = document.querySelector(".theme-toggle");
  var root = document.documentElement;
  var syncThemeBtn = function () {
    if (!themeBtn) return;
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.setAttribute("aria-label", dark ? "Light mode" : "Dark mode");
    var icon = themeBtn.querySelector("i");
    if (icon) icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  };
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") !== "dark";
      if (dark) root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
      try { localStorage.setItem("marzley-theme", dark ? "dark" : "light"); } catch (e) {}
      syncThemeBtn();
    });
    syncThemeBtn();
  }

  /* ---------- scroll progress + back to top ---------- */
  var bar = document.querySelector(".scroll-progress span");
  var toTop = document.querySelector(".to-top");
  var onProgress = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (bar) bar.style.transform = "scaleX(" + p + ")";
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight);
  };
  window.addEventListener("scroll", onProgress, { passive: true });
  window.addEventListener("resize", onProgress);
  onProgress();

  /* ---------- hero role rotator ---------- */
  var roleEl = document.getElementById("role-word");
  var roles = ["web developer", "UI/UX designer", "systems builder", "IT trainer"];
  if (roleEl) {
    var roleIndex = 0;
    setInterval(function () {
      if (motionOff()) return;
      roleEl.classList.add("is-out");
      setTimeout(function () {
        roleIndex = (roleIndex + 1) % roles.length;
        roleEl.textContent = roles[roleIndex];
        roleEl.classList.remove("is-out");
      }, 300);
    }, 2600);
  }

  /* ---------- quote calculator ---------- */
  var calc = document.getElementById("quote-calc");
  if (calc) {
    var totalEl = document.getElementById("calc-total");
    var sendEl = document.getElementById("calc-send");
    var fmt = function (n) { return "KSh " + n.toLocaleString("en-KE"); };
    var updateCalc = function () {
      var pkg = calc.querySelector('input[name="pkg"]:checked');
      var addons = calc.querySelectorAll('input[name="addon"]:checked');
      var total = pkg ? Number(pkg.value) : 0;
      var lines = [];
      if (pkg) lines.push("- " + pkg.getAttribute("data-name") + " (" + fmt(Number(pkg.value)) + ")");
      addons.forEach(function (a) {
        total += Number(a.value);
        lines.push("- " + a.getAttribute("data-name") + " (" + fmt(Number(a.value)) + ")");
      });
      totalEl.textContent = fmt(total);
      var msg = "Hello Marzley, I'd like a quote for:\n" + lines.join("\n") + "\nEstimated from " + fmt(total) + ".";
      sendEl.href = "https://wa.me/254745789590?text=" + encodeURIComponent(msg);
    };
    calc.addEventListener("change", updateCalc);
    calc.addEventListener("submit", function (e) { e.preventDefault(); });
    updateCalc();
  }

  /* ---------- 3D tilt with glare ---------- */
  var tiltQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  document.querySelectorAll("[data-tilt]").forEach(function (el) {
    var glare = document.createElement("span");
    glare.className = "tilt-glare";
    glare.setAttribute("aria-hidden", "true");
    el.appendChild(glare);
    var MAX = el.classList.contains("hero-photo-wrap") ? 12 : 7;
    var frame = null;
    el.addEventListener("mousemove", function (event) {
      if (!tiltQuery.matches || motionOff()) return;
      var box = el.getBoundingClientRect();
      var px = (event.clientX - box.left) / box.width;
      var py = (event.clientY - box.top) / box.height;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        el.classList.add("is-tilting");
        el.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * MAX).toFixed(2) + "deg) rotateY(" +
          ((px - 0.5) * MAX).toFixed(2) + "deg) translateZ(8px)";
        el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      });
    });
    el.addEventListener("mouseleave", function () {
      if (frame) cancelAnimationFrame(frame);
      el.classList.remove("is-tilting");
      el.style.transform = "";
    });
  });

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

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
    var EMAIL = "marzleytechsolutions@gmail.com";

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

    // Read aloud (browser speech)
    var readBtn = document.getElementById("a11y-read");
    var hint = document.getElementById("a11y-hint");
    var synth = window.speechSynthesis;
    var speaking = false;
    var setReading = function (on) {
      speaking = on;
      readBtn.setAttribute("aria-pressed", String(on));
      readBtn.querySelector("span").textContent = on ? "Stop reading" : "Read aloud";
    };
    var pageText = function () {
      var parts = [];
      document.querySelectorAll("main h1, main h2, main h3, main p, main li .name, main li .desc, main summary").forEach(function (el) {
        if (el.closest("[aria-hidden='true'], [hidden]")) return;
        var t = el.innerText.replace(/\s+/g, " ").trim();
        if (t) parts.push(t);
      });
      return parts.join(". ");
    };
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      readBtn.disabled = true;
      hint.textContent = "Read aloud isn't supported in this browser.";
    } else {
      var lastSelection = "";
      document.addEventListener("selectionchange", function () {
        var sel = String(window.getSelection() || "").trim();
        if (sel && !a11yPanel.contains(document.activeElement)) lastSelection = sel;
      });
      readBtn.addEventListener("click", function () {
        if (speaking) { synth.cancel(); setReading(false); return; }
        var text = String(window.getSelection() || "").trim() || lastSelection || pageText();
        lastSelection = "";
        var utter = new SpeechSynthesisUtterance(text.slice(0, 12000));
        utter.lang = "en-GB";
        utter.rate = 1;
        utter.onend = function () { setReading(false); };
        utter.onerror = function () { setReading(false); };
        synth.cancel();
        synth.speak(utter);
        setReading(true);
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
    a11yToggle.addEventListener("click", function () {
      if (a11yPanel.hidden) openPanel(); else closePanel(false);
    });
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

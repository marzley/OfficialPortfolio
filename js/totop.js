/* Back-to-top button for the Learning hub, its lesson pages and the client portal.
 * (The main website has its own copy of this in js/home.js.)
 * The button appears after one screen of scrolling. A click scrolls to the top and moves keyboard focus there too. */
(function () {
  var btn = document.querySelector(".to-top");
  if (!btn) return;
  var queued = false;
  function update() {
    queued = false;
    btn.classList.toggle("is-visible", window.scrollY > window.innerHeight);
  }
  function onScroll() {
    if (!queued) { queued = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
    var first = document.querySelector("header a[href]");
    if (first && first.focus) first.focus({ preventScroll: true });
  });
  update();
})();

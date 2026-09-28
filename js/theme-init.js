/* Runs before the page draws: apply the saved theme and accessibility settings. */
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try { if (localStorage.getItem("marzley-theme") === "dark") root.setAttribute("data-theme", "dark"); } catch (e) {}
  try {
    var a11y = JSON.parse(localStorage.getItem("marzley-a11y") || "{}");
    Object.keys(a11y).forEach(function (k) { if (a11y[k] === true) root.classList.add("a11y-" + k); });
    if (a11y.size) root.setAttribute("data-a11y-size", a11y.size);
  } catch (e) {}
})();

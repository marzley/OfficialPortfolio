/* Used by the printable quote, invoice, receipt and certificate windows. */
window.addEventListener("load", function () {
  var btn = document.querySelector(".bar button");
  if (btn) btn.addEventListener("click", function () { window.print(); });
  setTimeout(function () { window.focus(); window.print(); }, 300);
});

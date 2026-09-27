/* Any button with data-print opens the print dialog (Save as PDF). */
document.querySelectorAll("[data-print]").forEach(function (b) {
  b.hidden = false;
  b.addEventListener("click", function () { window.print(); });
});

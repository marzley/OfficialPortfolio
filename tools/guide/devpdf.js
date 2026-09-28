const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'dev.html'));
  await p.waitForTimeout(1500);
  await p.pdf({
    path: path.join(__dirname, 'Marzley-Tech-Developer-Guide.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%;font-family:Inter,Arial,sans-serif;font-size:8px;color:#94a3b8;padding:0 15mm;display:flex;justify-content:space-between"><span>Marzley Tech Solutions · Developer guide</span><span>marzleytechsolutions.co.ke · 0745 789 590 · Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>'
  });
  await b.close();
})();

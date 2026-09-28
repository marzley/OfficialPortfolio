// Screenshots for the user guide, taken from the local test server
const { chromium } = require('playwright');
const B = 'http://127.0.0.1:8799/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
  await ctx.addInitScript(() => { try { localStorage.setItem('marzley-consent', 'denied'); } catch (e) {} });
  const p = await ctx.newPage();
  const clean = async () => { await p.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')); document.querySelectorAll('[class*=cookie],[id*=cookie],[class*=consent],[id*=consent],.wa-float,.chat-launcher,.chat-fab,.a11y-toggle,.a11y-btn,[data-chat],#chat-toggle,.a11y-fab,#a11y-toggle').forEach(e => e.style.display = 'none'); }); await p.waitForTimeout(500); };
  const shot = async (url, name, sel, opts = {}) => {
    await p.goto(B + url); await p.waitForTimeout(opts.wait || 1500); await clean();
    if (opts.before) await opts.before(p);
    if (sel) { const l = p.locator(sel).first(); await l.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); await l.screenshot({ path: name + '.png' }); }
    else await p.screenshot({ path: name + '.png' });
  };
  await shot('', 'home');
  await shot('services', 'services', '.services');
  await shot('pricing', 'pricing', '#pricing');
  await shot('website-check', 'check', '#check');
  await shot('work', 'work', '.work');
  await shot('blog', 'blog', null);
  await shot('learn/', 'learn', null, { wait: 2500 });
  await shot('learn/?track=python&lesson=introduction', 'lesson', null, { wait: 2500 });
  await shot('learn/?page=practice&lang=python', 'practice', null, { wait: 1500, before: async (p) => {
    await p.evaluate(() => document.querySelector('.CodeMirror').CodeMirror.setValue('name = "Amina"\nprint(nmae)'));
    await p.locator('#p-run').click(); await p.waitForTimeout(20000);
    await p.evaluate(() => window.scrollTo(0, 120));
  } });
  await shot('learn/?page=videos', 'videos', null, { wait: 2500 });
  await shot('portal/', 'portal-signin', null, { wait: 2000 });
  // Client dashboard via the local-only test login
  await p.goto(B + 'portal/'); await p.waitForTimeout(1200);
  await p.evaluate(async () => {
    const r = await fetch('api.php?action=dev_login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'guide.client@example.com', name: 'Wanjiku Mwangi' }), credentials: 'same-origin' });
    return r.status;
  });
  await p.goto(B + 'portal/'); await p.waitForTimeout(1500);
  await p.evaluate(async () => {
    const me = await (await fetch('api.php?action=me', { credentials: 'same-origin' })).json().catch(() => ({}));
    const csrf = me.csrf || (me.data && me.data.csrf) || '';
    await fetch('api.php?action=profile_save', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify({ name: 'Wanjiku Mwangi', phone: '0712345678' }), credentials: 'same-origin' });
  });
  await p.goto(B + 'portal/'); await p.waitForTimeout(2500); await clean();
  await p.screenshot({ path: 'portal-dash.png' });
  for (const tab of ['referrals', 'payments', 'request']) {
    const t = p.locator('#ctab-' + tab);
    if (await t.count()) { await t.click(); await p.waitForTimeout(900); await p.screenshot({ path: 'portal-' + tab + '.png' }); }
  }
  await b.close();
})();

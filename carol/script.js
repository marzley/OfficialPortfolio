/* =====================================================================
   FOR CAROL 💖  —  an interactive romantic comedy / proposal
   Edit the CONFIG below to personalise names, ask and WhatsApp number.
   ===================================================================== */
(() => {
'use strict';

const CFG = {
  full:  'Caroline Njeri Karanja',
  short: 'Carol',
  from:  'Your Most Unserious Boyfriend',
  // Put his WhatsApp number here in international format, no "+" (e.g. '2547XXXXXXXX')
  // so her "I said YES" message goes straight to him. Leave '' to let her pick the contact.
  whatsapp: '2547545789590',
};

/* ------------------------------ helpers ------------------------------ */
const $ = (s, r = document) => r.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (a, b) => Math.random() * (b - a) + a;

/* ------------------------------ sound -------------------------------- */
let ac = null, soundOn = true;
function tone(freqs, dur = .14, type = 'sine', vol = .05) {
  if (!soundOn) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const t = ac.currentTime;
    freqs.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * dur);
      g.gain.linearRampToValueAtTime(vol, t + i * dur + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t + i * dur + dur * 3);
      o.connect(g); g.connect(ac.destination);
      o.start(t + i * dur); o.stop(t + i * dur + dur * 3);
    });
  } catch (e) { /* audio is optional */ }
}
const chime = () => tone([659, 880]);
const ding  = () => tone([523, 659, 784, 1047], .11);
const buzz  = () => tone([190, 150, 190], .16, 'sawtooth', .035);
const tada  = () => tone([523, 659, 784, 1047, 1319], .1, 'triangle', .06);

/* ------------------------------ confetti ----------------------------- */
const cv = $('#confetti'), cx = cv.getContext('2d');
let parts = [], raf = 0;
function sizeCv() { cv.width = innerWidth; cv.height = innerHeight; }
addEventListener('resize', sizeCv); sizeCv();
const COLS = ['#ff4d8d', '#f6c667', '#ffffff', '#9b7bff', '#46d6c8', '#ff8a5c'];
function confetti(n = 150) {
  for (let i = 0; i < n; i++) parts.push({
    x: rand(0, cv.width), y: -10, vx: rand(-4, 4), vy: rand(2, 6), g: .16,
    s: rand(5, 11), r: rand(0, 6), vr: rand(-.3, .3), c: COLS[i % COLS.length], life: 260, rect: true
  });
  if (!raf) loop();
}
function firework(x = rand(80, innerWidth - 80), y = rand(100, innerHeight * .55)) {
  const col = COLS[Math.floor(rand(0, COLS.length))];
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2, sp = rand(2, 6);
    parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: .06, s: rand(2.5, 4.5), r: 0, vr: 0, c: col, life: 90, rect: false });
  }
  if (!raf) loop();
}
function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts = parts.filter(p => p.life-- > 0 && p.y < cv.height + 30);
  for (const p of parts) {
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
    cx.globalAlpha = Math.min(1, p.life / 30);
    if (p.rect) cx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6);
    else { cx.beginPath(); cx.arc(0, 0, p.s, 0, 6.3); cx.fill(); }
    cx.restore();
  }
  raf = parts.length ? requestAnimationFrame(loop) : 0;
  if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
}

/* --------------------------- floating hearts ------------------------- */
const fx = $('#fx');
setInterval(() => {
  if (document.hidden) return;
  const dark = document.body.classList.contains('dark');
  const h = el('span', 'fx-heart', ['💖', '💗', '✨', '💕', '🌹', '💘'][Math.floor(rand(0, 6))]);
  h.style.left = rand(0, 100) + 'vw';
  h.style.fontSize = rand(14, dark ? 20 : 30) + 'px';
  h.style.animationDuration = rand(7, 13) + 's';
  fx.appendChild(h);
  h.addEventListener('animationend', () => h.remove());
}, 900);

/* --------------------- recurring surname joke ------------------------ */
const SURNAME_STATES = [
  'Karanja <b>(provisional)</b>', 'Wanyoike <b>(under appeal)</b>', 'Carol <b>(undisputed)</b>',
  'Karanja / Wanyoike <b>(management is confused)</b>', 'Pending <b>(awaiting tea and a decision)</b>',
  'Karanja <b>(unless she says otherwise)</b>', 'Wanyoike <b>(a rumour)</b>', 'Whatever she chooses <b>(final answer)</b>'
];
const tick = $('#tick');
function setTicker(i) { tick.innerHTML = `📁 Surname status: ${SURNAME_STATES[i % SURNAME_STATES.length]}`; }
const FN = '<span class="fn">*Surname still under review by the management.</span>';

/* ------------------------------ engine ------------------------------- */
const screens = [];
let idx = 0;
const stage = $('#stage');

const api = { next: () => go(idx + 1), go: i => go(i), confetti, firework, chime, ding, buzz, tada };

function nextBtn(box, label = 'Continue 💗', delay = 0, cls = '') {
  const w = el('div', 'btns rv'); w.style.setProperty('--d', delay + 's');
  const b = el('button', 'btn ' + cls, label);
  b.onclick = () => { chime(); api.next(); };
  w.appendChild(b); box.appendChild(w); return w;
}
function lines(arr, step = .9, start = .2) {
  return arr.map((l, i) => `<p class="rv" style="--d:${(start + i * step).toFixed(2)}s">${l}</p>`).join('');
}
function btn(label, cls, cb) { const b = el('button', 'btn ' + (cls || ''), label); b.onclick = cb; return b; }

function go(i) {
  if (i < 0) i = 0;
  if (i >= screens.length) i = screens.length - 1;
  const old = stage.firstElementChild;
  const doGo = () => {
    idx = i;
    const s = screens[i];
    document.body.className = s.theme || 'rose';
    $('#chap').textContent = s.ch || '';
    $('#bar i').style.width = ((i + 1) / screens.length * 100) + '%';
    setTicker(s.tk != null ? s.tk : i);
    stage.innerHTML = '';
    document.querySelectorAll('.runaway').forEach(n => n.remove());
    const card = el('section', 'card');
    stage.appendChild(card);
    s.render(card, api);
    scrollTo(0, 0);
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {}
  };
  if (old) { old.classList.add('leaving'); setTimeout(doGo, 260); } else doGo();
}

/* -------------------------- screen builders -------------------------- */
function add(s) { screens.push(s); }

function story({ ch, theme, kicker, title, script, big, lines: L, btnLabel, tk, after, h = 'h1', extra }) {
  add({ ch, theme, tk, render(b) {
    let html = '';
    if (kicker) html += `<div class="kick rv">${kicker}</div>`;
    if (script) html += `<div class="script rv">${script}</div>`;
    if (big) html += `<div class="big rv pop">${big}</div>`;
    if (title) html += `<${h} class="rv" style="--d:.3s">${title}</${h}>`;
    if (L) html += lines(L, .95, .8);
    b.innerHTML = html;
    if (extra) extra(b, api);
    nextBtn(b, btnLabel, (L ? .8 + L.length * .95 : 1.1));
    if (after) after(b, api);
  } });
}

function choice({ ch, theme, kicker, title, intro, opts, btnLabel, foot, tk }) {
  add({ ch, theme, tk, render(b) {
    b.innerHTML = `<div class="kick rv">${kicker || ''}</div><h2 class="rv" style="--d:.2s">${title}</h2>` + (intro ? `<p class="rv" style="--d:.5s">${intro}</p>` : '');
    const box = el('div', 'rv'); box.style.setProperty('--d', '.7s');
    const resp = el('div', ''); let nb = null;
    opts.forEach(o => {
      const x = el('button', 'opt', o.t);
      x.onclick = () => {
        box.querySelectorAll('.opt').forEach(n => n.classList.remove('picked')); x.classList.add('picked');
        resp.className = 'resp'; resp.style.animation = 'none'; void resp.offsetWidth; resp.style.animation = '';
        resp.innerHTML = o.r; (o.good ? ding : chime)();
        if (!nb) nb = nextBtn(b, btnLabel || 'Next 💗', 0);
      };
      box.appendChild(x);
    });
    b.appendChild(box); b.appendChild(resp);
    if (foot) b.insertAdjacentHTML('beforeend', foot);
  } });
}

/* =====================================================================
   PROLOGUE — A SECRET CONFESSION
   ===================================================================== */
add({ ch: 'Prologue', theme: 'dark', tk: 7, render(b) {
  b.innerHTML = `
    <div class="script rv" style="--d:.5s">Hey...</div>
    <h1 class="rv" style="--d:2s">there's someone I'm so in love with.</h1>
    <p class="rv" style="--d:4s">Would you like to know her name?</p>`;
  const w = el('div', 'btns rv'); w.style.setProperty('--d', '5.4s');
  const yes = btn('YES! Tell me already!', '', () => { ding(); api.next(); });
  const msg = el('p', 'pink'); msg.style.minHeight = '3em';
  const no = btn("No, I'm not interested 😂", 'alt', () => {
    buzz(); no.classList.add('shake'); setTimeout(() => no.classList.remove('shake'), 500);
    msg.textContent = "Interesting answer. The system has ignored it and is proceeding anyway... 😌";
    no.disabled = true; setTimeout(api.next, 2600);
  });
  w.append(yes, no); b.append(w, msg);
} });

story({ ch: 'Chapter 1 · The Confession', theme: 'dark', kicker: 'Before we proceed', title: 'Well... before I reveal her name,',
  lines: ['I need to establish a few facts.', 'Please keep your hands inside the website at all times. 🎢'] });

story({ ch: 'Chapter 1 · The Confession', theme: 'dark', kicker: 'Fact #1', big: '😇', title: 'She is real.',
  lines: ['Allegedly human. Heaven has reportedly filed a missing-person report.', 'Nobody has been able to prove otherwise.'] });

story({ ch: 'Chapter 1 · The Confession', theme: 'dark', kicker: 'Fact #2', big: '😊', title: 'Her smile reschedules my entire day.',
  lines: ['I had plans. Then she smiled.', 'The plans have been cancelled. I am now fully booked for staring.'] });

story({ ch: 'Chapter 1 · The Confession', theme: 'dark', kicker: 'Fact #3', big: '📚', title: 'She teaches History and Kiswahili.',
  lines: ['So she knows exactly how long she has been in my head.', 'Answer: since the beginning of recorded history, and also kabisa. 😂'] });

add({ ch: 'Chapter 1 · The Confession', theme: 'dark', render(b) {
  b.innerHTML = `<div class="kick rv">Final fact</div><h1 class="rv" style="--d:.3s">I am not responsible for what happens next.</h1>
    <p class="rv" style="--d:1.2s">Brace yourself. Hold your phone tightly. Drink some water. 💧</p>`;
  const w = el('div', 'btns rv'); w.style.setProperty('--d', '2.2s');
  w.appendChild(btn('🥁 REVEAL HER', 'pulse', () => { tada(); api.next(); }));
  b.appendChild(w);
} });

add({ ch: 'Chapter 1 · The Confession', theme: 'plum', tk: 0, render(b) {
  b.innerHTML = `<div class="kick">Ladies and gentlemen...</div><h1 id="nm" style="letter-spacing:.04em"></h1>`;
  const nm = $('#nm', b);
  const txt = CFG.full.toUpperCase() + '!';
  let i = 0;
  const t = setInterval(() => {
    nm.textContent = txt.slice(0, ++i);
    if (i % 3 === 0) tone([400 + i * 25], .05, 'triangle', .03);
    if (i >= txt.length) {
      clearInterval(t); confetti(220); tada(); nm.classList.add('pop');
      b.insertAdjacentHTML('beforeend', `<p class="rv" style="--d:.6s">The woman. The legend. The one. 💖</p>`);
      nextBtn(b, 'Wait... what? 😳', 1.4);
    }
  }, 95);
} });

add({ ch: 'Chapter 1 · The Confession', theme: 'rose', tk: 3, render(b) {
  b.innerHTML = `<h1 class="rv">Oops! Caroline Njeri <span class="gold">Wanyoike</span>... wait, Caroline Njeri <span class="gold">Karanja</span>! 😂😂</h1>
    <p class="rv" style="--d:1s">Madam, which surname would you prefer? Kindly advise the management before we proceed with this relationship.</p>`;
  const box = el('div', 'btns rv'); box.style.setProperty('--d', '1.8s');
  const resp = el('div', ''); let nb = null;
  const opts = [
    ['Caroline Njeri Karanja 😂', "Karanja confirmed. The records department has been given a stern warning and a cup of tea."],
    ['Caroline Njeri Wanyoike', "Wanyoike?! The management has called an emergency board meeting. Snacks were not provided. Outrage is high."],
    ['Just call me Carol, please!', "Approved instantly. Short, powerful, unforgettable. Paperwork can no longer argue with that."],
    ['Let us discuss this privately!', "Request accepted. Venue: my heart. Time: forever. Bring snacks. The meeting will be long. 💕"],
  ];
  opts.forEach(([t, r]) => {
    const x = btn(t, 'alt', () => {
      chime(); resp.className = 'resp'; resp.innerHTML = r + FN;
      if (!nb) nb = nextBtn(b, 'Proceed with the investigation 🕵️‍♂️', 0);
    });
    box.appendChild(x);
  });
  b.append(box, resp);
} });

/* =====================================================================
   CHAPTER 2 — THE OFFICIAL INVESTIGATION
   ===================================================================== */
story({ ch: 'Chapter 2 · The Investigation', theme: 'navy', kicker: 'Breaking news 🚨', title: 'THE INTERNATIONAL DEPARTMENT OF EXTREME LOVE AND GIRLFRIEND AFFAIRS',
  h: 'h2', lines: [
    'has launched an <span class="hl">official investigation</span>.',
    'Reason: one particular lady has <span class="hl">completely taken over</span> someone\'s heart, without a licence, without a permit, and without even looking guilty.',
    'Detectives have been dispatched. Snacks have been ordered. 🍿'] });

add({ ch: 'Chapter 2 · The Investigation', theme: 'navy', render(b) {
  b.innerHTML = `<div class="paper rv">
    <div class="letterhead">International Department of Extreme Love &amp; Girlfriend Affairs</div>
    <h2>CONFIDENTIAL CASE FILE</h2>
    <div class="row"><b>Subject:</b><span>Caroline Njeri</span></div>
    <div class="row"><b>Occupation:</b><span>Professional heart stealer.</span></div>
    <div class="row"><b>Specialisation:</b><span>Being beautiful without permission.</span></div>
    <div class="row"><b>Known aliases:</b><span>Carol, Caroline, Madam Historian.</span></div>
    <div class="row"><b>Current status:</b><span>Extremely loved.</span></div>
    <div class="row me"><b>Suspect:</b><span>Me.</span></div>
    <div class="row me"><b>Crime:</b><span>Falling madly in love with her.</span></div>
    <div style="text-align:center"><div class="stamp" id="stp">Case file no. 001 — Love without bail</div></div>
  </div>`;
  setTimeout(() => { $('#stp', b).classList.add('go'); buzz(); tone([120], .3, 'square', .05); }, 1400);
  nextBtn(b, 'I plead guilty 🙋‍♂️', 2.6);
} });

/* =====================================================================
   CHAPTER 3 — THE BEAUTY INVESTIGATION
   ===================================================================== */
const BCH = 'Chapter 3 · The Beauty Report';

// 1 Face card
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Exhibit A</div><h2>The Face Card Investigation</h2>
    <div class="scan" id="sc"><div class="chip"></div><div class="num">0000 1000 / 10</div><div class="nm">${CFG.short} · Unlimited</div></div>
    <div class="log" id="lg"></div><div id="act"></div>`;
  const act = $('#act', b), lg = $('#lg', b), sc = $('#sc', b);
  act.appendChild(btn('Run the Face Card scan 🔍', '', async function () {
    this.disabled = true; sc.classList.add('go');
    const steps = ['> scanning cheekbones... [OK]', '> checking confidence... [OK]', '> measuring natural glow... [OK]',
      '> ERROR: scale exceeded 10', '> recalibrating scale to 1000...', '> RESULT: face card NEVER declines ✅'];
    for (const s of steps) { lg.innerHTML += s + '<br>'; chime(); await sleep(750); }
    sc.classList.remove('go'); confetti(80); tada();
    lg.insertAdjacentHTML('beforeend', '<br><b>FACE CARD: 1000/10</b>');
    nextBtn(b, 'Approved! Next exhibit ➡️', .3);
  }));
} });

// 2 Smile licence
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Exhibit B</div><h2>The Smile That Needs Government Regulation</h2>
    <p>Every smile above a safe level requires a licence. Let's check yours.</p><div id="out"></div><div class="btns" id="act"></div>`;
  const out = $('#out', b), act = $('#act', b);
  act.appendChild(btn('Apply for a Smile Licence 📝', '', function () {
    this.remove(); buzz();
    out.innerHTML = `<div class="paper pop"><div class="letterhead">Ministry of Dangerous Smiles</div><h2>APPLICATION RESULT</h2>
      <p><b class="red">REJECTED.</b> Applicant's smile is classified as <i>too powerful for civilians</i>. Several hearts have already been compromised (one confirmed: mine).</p></div>`;
    act.appendChild(btn('Appeal the decision ⚖️', 'alt', function () {
      this.remove(); ding();
      out.insertAdjacentHTML('beforeend', `<div class="resp">✅ <b>Appeal granted.</b> Smiling is permitted <u>only</u> if pointed at the boyfriend, at least daily, and preferably at 2 a.m.</div>`);
      nextBtn(b, 'Next ➡️', .4);
    }));
  }));
} });

// 3 Eyes monument
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Exhibit C</div><h2>Eyes That Deserve Their Own National Monument</h2>
    <div class="curtains" id="cu"><span class="pop" style="opacity:0" id="eyes">👀</span></div><div id="act"></div><div id="plq"></div>`;
  $('#act', b).appendChild(btn('Unveil the monument 🎀', '', function () {
    this.remove(); ding(); $('#cu', b).classList.add('open'); setTimeout(() => $('#eyes', b).style.opacity = 1, 900);
    setTimeout(() => {
      confetti(90);
      $('#plq', b).innerHTML = `<div class="paper pop" style="margin-top:12px"><div class="letterhead">Plaque</div><p><b>THE NATIONAL MONUMENT OF CAROL'S EYES.</b><br>Open daily. Visitors are advised to bring sunglasses, a reason to stay, and no plans for the next three hours.</p></div>`;
      nextBtn(b, 'Next ➡️', .5);
    }, 1500);
  }));
} });

// 4 Cameras
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Exhibit D</div><h2>The Beauty That Makes Cameras Work Overtime</h2>
    <div class="big" id="cam">📸</div><p id="cnt">Photos taken: 0</p><p class="pink" id="cm" style="min-height:3.2em">Tap the camera. Go on.</p><div id="act"></div>`;
  let n = 0, nb = null;
  const msgs = { 1: 'Perfect shot. Obviously.', 2: 'Another perfect shot. Suspicious consistency.', 3: 'Camera says: "There are no bad angles. I checked."', 4: 'Camera is sweating. Battery at 3%.', 5: '📸 "I quit. Too many perfect shots. Send help."' };
  $('#cam', b).onclick = () => {
    n++; chime(); $('#cam', b).classList.remove('pop'); void $('#cam', b).offsetWidth; $('#cam', b).classList.add('pop');
    $('#cnt', b).textContent = `Photos taken: ${n * 49}`; $('#cm', b).textContent = msgs[Math.min(n, 5)];
    if (n === 5) { buzz(); confetti(60); if (!nb) nb = nextBtn(b, 'Next ➡️', .3); }
  };
  $('#cam', b).style.cursor = 'pointer';
} });

// 5 Elegance
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Exhibit E</div><h2>The Walking Definition of Elegance</h2>
    <div class="paper rv"><div class="letterhead">Official Dictionary of Everything</div>
      <h2 style="text-align:left;margin:0">el·e·gance <span style="font-size:.9rem;font-weight:500">/ˈɛlɪɡ(ə)ns/ noun</span></h2>
      <p>1. Graceful, stylish beauty of appearance or manner.</p>
      <p>2. <b>See: ${CFG.short}.</b></p>
      <p id="syn" style="display:none"><i>Synonyms:</i> grace, class, poise, sophistication, "how does she walk like that?", "my girlfriend", national treasure.</p>
    </div><div id="act" class="btns"></div>`;
  $('#act', b).appendChild(btn('Show synonyms 📖', 'alt', function () {
    this.remove(); $('#syn', b).style.display = 'block'; ding(); nextBtn(b, 'Next ➡️', .3);
  }));
} });

// 6 Scientists
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Exhibit F</div><h2>A Beauty Report That Left Scientists Speechless</h2>
    <p>We asked three leading scientists to comment on the findings.</p><div class="chat" id="chat"></div><div id="act" class="btns"></div>`;
  const qs = [['🧑‍🔬 Professor A', '"I have no words."'], ['👩‍🔬 Professor B', '"Neither do I. I tried. The dictionary gave up."'], ['🧑‍🔬 Professor C', '*faints* …"is she single?" "No." "Understood." *faints again*']];
  let i = 0, nb = null;
  const ask = btn('Ask for a comment 🎤', '', () => {
    const [who, q] = qs[i++]; chime();
    $('#chat', b).insertAdjacentHTML('beforeend', `<div class="bub l"><small class="pink">${who}</small><br>${q}</div>`);
    if (i >= qs.length) { ask.remove(); confetti(50); nb = nextBtn(b, 'Next ➡️', .3); }
  });
  $('#act', b).appendChild(ask);
} });

// 7 Mirror
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Exhibit G</div><h2>Why Even the Mirror Must Be Proud</h2><div class="chat" id="chat"></div><div id="act" class="btns"></div>`;
  const chat = $('#chat', b), act = $('#act', b);
  const talk = (cls, t) => chat.insertAdjacentHTML('beforeend', `<div class="bub ${cls}">${t}</div>`);
  const b1 = btn('"Mirror, mirror… who is the fairest?"', '', () => {
    b1.remove(); chime(); talk('r', 'Mirror, mirror… who is the fairest?');
    setTimeout(() => { talk('l', '🪞 Easy. Carol. Next question.'); }, 700);
    setTimeout(() => act.appendChild(b2), 1300);
  });
  const b2 = btn('"Are you sure?"', 'alt', () => {
    b2.remove(); chime(); talk('r', 'Are you sure?');
    setTimeout(() => talk('l', '🪞 Madam, I am literally made to reflect. I get to look at her every morning. I have never been prouder.'), 700);
    setTimeout(() => { ding(); nextBtn(b, 'Next ➡️', 0); }, 1500);
  });
  act.appendChild(b1);
} });

// 8 Danger
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Exhibit H</div><h2>The Danger of Looking at Carol for Too Long</h2>
    <p>Safety test: look at her photo for as long as possible. Observe the boyfriend's condition.</p>
    <div class="meters"><div class="meter"><label>Boyfriend's focus on his task <em id="pc">100%</em></label><div class="track"><div class="fill" id="fl" style="width:100%;transition:width .4s"></div></div></div></div>
    <p class="pink" id="st" style="min-height:3em">Status: functioning normally.</p><div id="act" class="btns"></div>`;
  let v = 100, nb = null;
  const states = ['Status: functioning normally.', 'Status: slightly distracted. Mouth open.', 'Status: has forgotten what he was saying.', 'Status: now smiling at nothing.', '🚨 CRITICAL: boyfriend has forgotten his own name.'];
  const look = btn('Keep looking at Carol 👀', '', () => {
    v = Math.max(0, v - 20); chime();
    $('#fl', b).style.width = v + '%'; $('#pc', b).textContent = v + '%';
    $('#st', b).textContent = states[Math.min(4, (100 - v) / 20 | 0)];
    if (v === 0) { look.remove(); buzz(); confetti(60); $('#st', b).classList.add('shake'); nb = nextBtn(b, 'Rescue him ➡️', .4); }
  });
  $('#act', b).appendChild(look);
} });

// 9 Scoreboard
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">The official scoreboard</div><h2>Beauty Ratings</h2><div class="meters" id="m"></div>`;
  const R = [['Face card', '1000/10', 100], ['Smile', 'Beyond scientific measurement', 100], ['Elegance', 'National treasure', 98],
    ['Beauty', 'Case closed.', 100], ['Ability to distract me', 'Extremely dangerous ⚠️', 100]];
  R.forEach(([n, v, p], i) => b.querySelector('#m').insertAdjacentHTML('beforeend',
    `<div class="meter rv" style="--d:${i * .35}s"><label>${n}<em>${v}</em></label><div class="track"><div class="fill" data-p="${p}"></div></div></div>`));
  setTimeout(() => b.querySelectorAll('.fill').forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.p + '%'; chime(); }, i * 350)), 400);
  nextBtn(b, 'I agree with the results ✅', 3);
} });

// 10 Compliment buttons
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Interactive compliment machine</div><h2>Press the buttons. Collect at least 5. 💌</h2><div class="grid" id="g"></div><p id="c" class="pink" style="margin-top:14px">Collected: 0 / 5</p>`;
  const C = ['You are stunning 😍', 'Your smile is illegal', 'You glow like a sunrise', 'You look good even when annoyed', 'Your laugh is my favourite sound',
    'You make beauty look effortless', 'You are my favourite view', 'Even your frown is classy', 'You are a masterpiece', 'You are gorgeous inside and out'];
  let got = 0, nb = null;
  C.forEach((c, i) => {
    const x = el('button', 'cbtn', `💗 Press #${i + 1}`);
    x.onclick = () => { if (x.classList.contains('on')) return; x.classList.add('on'); x.textContent = c; ding(); got++; $('#c', b).textContent = `Collected: ${got} / 5`; if (got >= 5 && !nb) { confetti(70); nb = nextBtn(b, 'Next ➡️', .2); } };
    $('#g', b).appendChild(x);
  });
} });

// 11 Beauty certificate
add({ ch: BCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="cert pop"><h2>CERTIFICATE OF EXTREME BEAUTY</h2><p>This certifies that</p><div class="name">${CFG.full}</div>
    <p>has been officially inspected, examined, re-examined and found <b>breathtakingly beautiful</b> by an international panel of one very biased boyfriend.</p>
    <div class="seal">🏅</div><small>Signed: ${CFG.from}</small><small>Surname subject to final decision*</small></div>`;
  confetti(120); tada(); nextBtn(b, 'Frame it 🖼️', 1.5);
} });

/* =====================================================================
   CHAPTER 4 — THE GRADUATE
   ===================================================================== */
const ACH = 'Chapter 4 · The Graduate';
add({ ch: ACH, theme: 'navy', tk: 2, render(b) {
  b.innerHTML = `<div class="cap">🎓</div><h1 class="rv" style="--d:.5s">YOUR HONOUR, THE GRADUATE HAS ENTERED THE BUILDING!</h1>
    <p class="rv" style="--d:1.4s">Please rise. 🎺 Everyone, please rise.</p>`;
  setTimeout(() => { confetti(200); tada(); }, 700);
  setTimeout(() => confetti(120), 2400);
  nextBtn(b, 'Read the citation 📜', 2);
} });

add({ ch: ACH, theme: 'navy', render(b) {
  b.innerHTML = `<div class="cert pop">
    <h2>Bachelor of Arts in Education</h2>
    <p>This is to certify that</p><div class="name">${CFG.full}</div>
    <p>has completed the required lectures, assignments, examinations and all those moments that needed determination, and has <b>done it</b>. 🎓</p>
    <div class="seal">📜</div><small>Major subjects: History &amp; Kiswahili</small></div>
    <p class="rv" style="--d:1s;margin-top:20px">From attending lectures to completing assignments, from examinations to every moment that tested you, <b class="gold">you did it.</b></p>
    <p class="rv" style="--d:2.2s">And not just any graduate. A beautiful, intelligent, hardworking woman who has earned her place through dedication and perseverance.</p>
    <p class="rv gold" style="--d:3.4s"><b>Madam, we are proud of you.</b></p>`;
  setTimeout(() => confetti(150), 400);
  nextBtn(b, 'Visit the departments 🏛️', 4.2);
} });

add({ ch: ACH, theme: 'navy', render(b) {
  b.innerHTML = `<div class="kick">Faculty tour</div><h2>Choose a Department</h2><div class="tabs" id="tb"></div><div class="panel-box" id="pb"><p class="dim">Tap each department to read its official statement.</p></div>`;
  const D = [
    ['🏺 History', 'The History Department', `Apparently, you can explain centuries of history, historical events and ancient civilisations, but you still haven't explained how you managed to conquer my heart.`],
    ['🗣️ Kiswahili', 'The Kiswahili Department', `Unaweza kufundisha Kiswahili vizuri sana, lakini kuna swali moja bado hujanijibu: <b>Uliwezaje kunifanya nikupende hivi?</b>`],
    ['🍎 Education', 'The Education Department', `You are qualified to educate future generations, but I volunteer to remain your most stubborn student.`],
  ];
  const seen = new Set(); let nb = null;
  D.forEach(([lab, ttl, txt], i) => {
    const t = el('button', 'tab', lab);
    t.onclick = () => {
      b.querySelectorAll('.tab').forEach(n => n.classList.remove('on')); t.classList.add('on'); chime();
      $('#pb', b).innerHTML = `<h2 class="pop">${ttl}</h2><p class="pop">${txt}</p>`;
      seen.add(i); if (seen.size === 3 && !nb) nb = nextBtn(b, 'Submit my assignment 📝', .3);
    };
    $('#tb', b).appendChild(t);
  });
} });

add({ ch: ACH, theme: 'navy', render(b) {
  b.innerHTML = `<div class="kick">Final assessment</div><h2>Love Assignment: Submitted ✍️</h2>
    <div id="out"></div><div class="btns" id="act"></div>`;
  $('#act', b).appendChild(btn('Madam Trainer, please mark my love assignment', 'gold', async function () {
    this.remove(); const out = $('#out', b);
    out.innerHTML = `<div class="paper marking"><div class="letterhead">Marking in progress…</div><div id="mk"></div></div>`;
    const items = ['Q1. Does he love Carol? <span class="red">✔ ✔ ✔</span>', 'Q2. Does he miss Carol every day? <span class="red">✔ ✔ ✔</span>', 'Q3. Is he still a bit of a clown? <span class="red">✔ (full marks, sadly)</span>',
      'Q4. Would he choose her again? <span class="red">✔ ✔ ✔ ✔</span>', 'Total: <span class="red">100/100</span>'];
    for (const it of items) { $('#mk', b).insertAdjacentHTML('beforeend', `<p class="pop">${it}</p>`); chime(); await sleep(900); }
    out.insertAdjacentHTML('beforeend', `<div class="cert pop" style="margin-top:16px"><h2>Assessment result:</h2><div class="name" style="font-size:clamp(1.6rem,6vw,2.4rem)">DISTINCTION IN LOVING CAROL</div><div class="seal">🏆</div></div>`);
    confetti(180); tada(); nextBtn(b, 'Next chapter ➡️', 1);
  }));
} });

/* =====================================================================
   CHAPTER 5 — WHY DOES THIS MAN KEEP DISTURBING CAROL?
   ===================================================================== */
const DCH = 'Chapter 5 · Why He Disturbs Her';
add({ ch: DCH, theme: 'wine', render(b) {
  b.innerHTML = `<div class="kick">⚠️ Serious allegations</div><h1 class="rv">WHY DOES THIS MAN KEEP DISTURBING CAROL?</h1>
    <p class="rv" style="--d:.9s">Your boyfriend has a very serious problem.</p>
    <p class="rv" style="--d:2s">He wakes up and instead of minding his business, he starts looking for ways to disturb one <b class="gold">${CFG.full}</b>.</p>
    <p class="rv" style="--d:3.4s">No reason is too small. No opportunity is wasted.</p>
    <p class="rv" style="--d:4.8s">If she is happy, he finds a way to tease her.<br>If she is quiet, he asks unnecessary questions.<br>If she is serious, he suddenly becomes a comedian.<br>If she says she's annoyed, somehow that becomes another opportunity to laugh.</p>
    <p class="rv" style="--d:7.4s">And the worst part?</p>
    <p class="rv gold" style="--d:8.6s"><b>He knows exactly what he's doing. 😂😂</b></p>`;
  nextBtn(b, 'Let me defend myself 🙋‍♂️', 9.6);
} });

choice({ ch: DCH, theme: 'wine', kicker: 'Interrogation 1 of 5', title: 'When Carol is serious, what does he do?', opts: [
  { t: 'A) Respects the silence like a gentleman', r: 'Hahaha. Next answer, please. 😂 That is not the boyfriend we know.' },
  { t: 'B) Makes a joke at the worst possible moment', r: '✅ Correct. Perfect timing is his talent. Wrong timing is his speciality.', good: 1 },
  { t: 'C) Stares at her until she cracks', r: '✅ Also correct. He is a professional starer. Success rate: 100%.', good: 1 },
  { t: 'D) Asks "Are you okay? Are you sure? Are you OK-ok?"', r: 'Five times. In different voices. He thinks it helps.' }] });

choice({ ch: DCH, theme: 'wine', kicker: 'Interrogation 2 of 5', title: 'When Carol is annoyed, does he apologise immediately?', opts: [
  { t: 'A) Yes, instantly', r: 'The court notes: that is a lie. Under oath, too. 😂' },
  { t: 'B) He laughs first, apologises later', r: '✅ Correct. The laughing is involuntary. The apology is sincere. The timing is a crime.', good: 1 },
  { t: 'C) He apologises with a fresh joke inside', r: 'Apology arrives. Annoyance doubles. Everyone is confused but secretly smiling.' },
  { t: 'D) He needs 3–5 business days', r: 'Processing fee: one hug. Delivery: immediately after.' }] });

choice({ ch: DCH, theme: 'wine', kicker: 'Interrogation 3 of 5', title: 'Does he sometimes create imaginary arguments just to get her attention?', opts: [
  { t: 'A) Never! He is an angel.', r: 'Objection! The angel in question has horns. Small ones. Adorable ones. 😈' },
  { t: 'B) Occasionally', r: 'The court notes "occasionally" has been used by the accused to mean "daily".' },
  { t: 'C) Daily. Freshly manufactured.', r: '✅ Correct. Arguments are made from scratch, with love, and zero real ingredients.', good: 1 },
  { t: 'D) He pleads the fifth', r: 'The fifth was taken away by Carol a long time ago.' }] });

choice({ ch: DCH, theme: 'wine', kicker: 'Interrogation 4 of 5', title: 'Who is more stubborn?', opts: [
  { t: 'A) Carol', r: 'Carol says: "I am not stubborn." Carol says it three more times, louder. 😂' },
  { t: 'B) The boyfriend', r: 'He says "I am flexible". He has never moved in an argument. Not once.' },
  { t: 'C) Both. Two goats on one bridge.', r: '✅ Scientists agree. Neither will move. Eventually both fall in the river laughing.', good: 1 },
  { t: 'D) Neither. The other one is lying.', r: 'The most stubborn answer possible. Both are guilty!' }] });

choice({ ch: DCH, theme: 'wine', kicker: 'Interrogation 5 of 5', title: 'Who wins arguments?', opts: [
  { t: 'A) Carol, obviously', r: 'Correct, but only because he lets her. (He will deny this.)' },
  { t: 'B) The boyfriend', r: 'Rejected. Reason: he loses every time he sees her smile.' },
  { t: 'C) Whoever gets hungry first', r: '✅ Scientifically accurate. Food always wins.', good: 1 },
  { t: 'D) Nobody. It ends with laughing.', r: '✅ That is the real answer. It always ends with laughing. 💞', good: 1 }] });

story({ ch: DCH, theme: 'wine', kicker: 'The verdict', title: 'Conclusion',
  lines: ['This relationship is being managed by <span class="hl">two stubborn individuals</span> and <span class="hl">one extremely unserious boyfriend.</span> 😂'] , btnLabel: 'But wait... 🥺' });

add({ ch: DCH, theme: 'wine', render(b) {
  b.innerHTML = `<div class="big pop">🤍</div><h2 class="rv" style="--d:.4s">Okay. Serious voice now.</h2>
    <p class="rv" style="--d:1.2s">Behind every joke is a man who <b class="gold">genuinely adores you</b>.</p>
    <p class="rv" style="--d:2.4s">I tease you because I love seeing you smile, not because I ever want to hurt your feelings.</p>
    <p class="rv" style="--d:3.6s">Your reaction, your laugh, even your "stop disturbing me!", is my favourite thing in the world.</p>
    <p class="rv pink" style="--d:4.8s"><i>(I will still disturb you tomorrow though. Just so you know.)</i></p>`;
  setTimeout(() => { chime(); }, 2400);
  nextBtn(b, 'Awww. Okay. Continue 🥹', 5.8);
} });

/* =====================================================================
   CHAPTER 6 — THE CAROL APPRECIATION AWARDS
   ===================================================================== */
const WCH = 'Chapter 6 · The Awards';
story({ ch: WCH, theme: 'plum', big: '🏆', kicker: 'Tonight, live from my heart', title: 'THE CAROL APPRECIATION AWARDS',
  lines: ['The red carpet is rolled out. 🔴', 'The nominees are… well, there is only one nominee. The others declined out of respect.', 'Please silence your phones. Except to cry.'] , btnLabel: 'Open the envelopes ✉️' });

const AWARDS = [
  ['Most Beautiful Human Being', '👑', 'Judges searched high and low for a competitor. They are still searching. The mirror abstained from voting out of jealousy.', '"I would like to thank my mirror. It tried its best."'],
  ['Best Smile in the Universe', '😁', 'The sun was asked to shine brighter for comparison. It filed a complaint and went to sulk behind a cloud.', '"I smile because he is staring. It is the only way to make him stop. (It doesn\'t.)"'],
  ['Outstanding Achievement in Stealing Hearts', '💘', 'One heart stolen. No weapon used. No escape attempted. The victim refuses to be returned.', '"I did not steal it. He gave it to me. I am simply a very good keeper."'],
  ['Best History and Kiswahili Educator', '📚', 'Knows the past, speaks the language, and shapes the future. Cannot explain why he is this in love, but she is working on it.', '"Asanteni sana. Sasa tafadhali kaeni kimya, darasa linaendelea."'],
  ['Most Likely to Make Her Boyfriend Smile at His Phone', '📱', 'Incident reports: countless. Witnesses: strangers who saw a grown man grinning at a screen like a fool.', '"I am only responsible for the messages. Not for his face."'],
  ['Queen of Making Someone\'s Day', '🌤️', 'One message and the whole weather changes. Meteorologists are baffled. Umbrellas have been returned.', '"I accept this award on behalf of my sweet messages and his weak heart."'],
  ['Lifetime Achievement in Being Adorable', '🧸', 'Nominations closed in one second. No other candidates could be found. The category has been renamed "Carol".', '"I have been adorable since birth. This is not an achievement. It is a lifestyle."'],
];
AWARDS.forEach(([name, ic, desc, speech], i) => add({ ch: WCH, theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Award ${i + 1} of ${AWARDS.length}</div>
    <div class="cert pop" id="aw"><div class="ribbon">Winner</div><div class="trophy float">${ic}</div><h2>${name}</h2>
      <div class="name">${CFG.short}</div><p>${desc}</p><small>Signed: ${CFG.from}</small></div>
    <div id="sp"></div><div class="btns" id="act"></div>`;
  $('#act', b).appendChild(btn('Accept award 🎤', 'gold', function () {
    this.remove(); tada(); confetti(110);
    $('#sp', b).innerHTML = `<div class="resp"><b class="gold">Acceptance speech:</b><br>${speech}</div>`;
    nextBtn(b, i === AWARDS.length - 1 ? 'Final exam time 📝' : 'Next award ➡️', .4);
  }));
} }));

/* =====================================================================
   CHAPTER 7 — THE CAROL EXAMINATION
   ===================================================================== */
const ECH = 'Chapter 7 · The Examination';
story({ ch: ECH, theme: 'navy', kicker: 'Madam Trainer, this one is for you', title: 'FINAL EXAMINATION: HOW WELL DO YOU KNOW YOUR BOYFRIEND?',
  h: 'h2', lines: ['Time allowed: forever.', 'Instructions: answer honestly. No whispering. No googling. No asking your friends.', 'There are no wrong answers. (There are, but we will adjust the marks in your favour.)'], btnLabel: 'Begin the exam ✏️' });

const EXAM = [
  ['Why does your boyfriend sometimes disturb you?', [
    ['A) He is bored', 'Wrong. He has 47 hobbies and every one of them is you.'],
    ['B) Because he loves your reaction', '✅ Correct! Your reaction is his favourite TV show. No ads.', 1],
    ['C) He forgot his manners at home', 'Partially true, but that is not the main reason.'],
    ['D) All of the above, but mostly B', '✅ Excellent. A true scholar.', 1]]],
  ['What happens when you ignore his messages?', [
    ['A) He respects your privacy', 'Hahaha. No. Next.'],
    ['B) He sends "Hello? Are you alive?"', '✅ Correct. Followed by a sad emoji and a 6-paragraph speech.', 1],
    ['C) He starts a documentary titled "Why She Left Me On Read"', 'Release date: tomorrow. Budget: his dignity.'],
    ['D) He sends one more message so it is "unfair" to ignore', '✅ Strategic genius. Fully correct.', 1]]],
  ['Who is more likely to start unnecessary arguments?', [
    ['A) Carol', 'Carol is innocent. (Mostly.) (Okay, sometimes.)'],
    ['B) The boyfriend, obviously', '✅ Correct, and he is proudly unrepentant.', 1],
    ['C) The wind', 'The wind has a solid alibi. It was blowing elsewhere.'],
    ['D) Both, then they forget what it was about', '✅ The truest answer. Case closed.', 1]]],
  ['What is his favourite thing about you?', [
    ['A) Your smile', 'Correct! Along with 400 other things.', 1],
    ['B) Your heart', 'Correct! Also your kindness and your patience with him.', 1],
    ['C) Your brain', 'Correct! He is both intimidated and impressed.', 1],
    ['D) "That is a trick question, the list is longer than the exam."', '✅ Perfect answer. Teachers love this one.', 1]]],
  ['Does he genuinely enjoy making you smile?', [
    ['A) Yes', '✅ Correct. Every. Single. Time.', 1],
    ['B) Yes, more than anything', '✅ Correct and slightly overachieving.', 1],
    ['C) Yes, it is his full-time job', '✅ And he has no plans to resign.', 1],
    ['D) No', 'Error. This option has been removed by the administration. 😂']]],
];
EXAM.forEach(([q, opts], qi) => choice({ ch: ECH, theme: 'navy', kicker: `Question ${qi + 1} of ${EXAM.length}`, title: q,
  opts: opts.map(o => ({ t: o[0], r: o[1], good: o[2] })), btnLabel: qi === EXAM.length - 1 ? 'Submit exam 📮' : 'Next question ➡️' }));

add({ ch: ECH, theme: 'navy', render(b) {
  b.innerHTML = `<div class="kick">Results are in</div><h2>Marking... ✍️</h2><div class="big" id="sc">…</div><div id="out"></div>`;
  let n = 0;
  const t = setInterval(() => {
    n = Math.min(100, n + 7); $('#sc', b).textContent = n + '%'; if (n >= 100) {
      clearInterval(t); confetti(200); tada();
      $('#out', b).innerHTML = `<div class="cert pop"><h2>🎉 Congratulations!</h2><p>You have passed with a <b>distinction in being loved.</b></p><div class="seal">🎓</div><small>(Marks were adjusted in your favour. The examiner is biased and refuses to apologise.)</small></div>`;
      nextBtn(b, 'Next ➡️', 1.2);
    }
  }, 80);
} });

// Surname referendum
add({ ch: ECH, theme: 'rose', tk: 4, render(b) {
  b.innerHTML = `<div class="kick">Bonus: the national referendum 🗳️</div><h2>Which surname shall prevail?</h2>
    <p>The nation has voted. Results are final* (as final as a surname can be).</p><div class="poll" id="pl"></div><div id="note"></div>`;
  const P = [['Team Karanja', 50], ['Team Wanyoike', 50], ['Team "Just Carol"', 100], ['Team "We\'ll discuss it privately"', 100]];
  P.forEach(([n, v], i) => $('#pl', b).insertAdjacentHTML('beforeend', `<div class="meter rv" style="--d:${i * .3}s"><label>${n}<em>${v}%</em></label><div class="track"><div class="fill" data-p="${v}"></div></div></div>`));
  setTimeout(() => b.querySelectorAll('.fill').forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.p + '%'; chime(); }, i * 400)), 400);
  setTimeout(() => { $('#note', b).innerHTML = `<div class="resp">📢 Total exceeds 200% due to <b>excessive enthusiasm</b>. Election commission has declared: <b>"Carol decides."</b> Management will comply.${FN}</div>`; nextBtn(b, 'Fair enough ➡️', .4); }, 2800);
} });

/* =====================================================================
   CHAPTER 8 — LOVE STATISTICS DEPARTMENT
   ===================================================================== */
add({ ch: 'Chapter 8 · Love Statistics', theme: 'plum', render(b) {
  b.innerHTML = `<div class="kick">Department of Love Statistics</div><h2>Live Data, Freshly Calculated 📊</h2><div class="stats" id="st"></div>`;
  const S = [
    ['Times I have thought about you', 'Uncountable', 'num'],
    ['Times your smile has distracted me', 'Classified 🔒', 'num'],
    ['Times I have wanted to annoy you', 'Daily 😈', 'num'],
    ['Reasons I love you', 'Infinite ∞', 'num'],
    ['Replacements available', 'Zero. 0️⃣', 'down'],
    ['Times I would choose you again', 'Every single time 💞', 'num'],
  ];
  S.forEach(([t, v, mode], i) => {
    const c = el('div', 'stat rv', `<div class="v">0</div><div class="t">${t}</div>`); c.style.setProperty('--d', (i * .4) + 's');
    $('#st', b).appendChild(c);
    const vEl = c.querySelector('.v');
    setTimeout(() => {
      let n = mode === 'down' ? 99 : 0, k = 0;
      const iv = setInterval(() => {
        k++;
        vEl.textContent = mode === 'down' ? Math.max(0, n -= 9) : Math.floor(rand(1000, 99999));
        if (k > 16) { clearInterval(iv); vEl.textContent = v; vEl.classList.add('pop'); ding(); }
      }, 70);
    }, 500 + i * 450);
  });
  nextBtn(b, 'The data speaks 📈', 4.2);
} });

/* =====================================================================
   CHAPTER 9 — THE FINE PRINT (the bits I added myself)
   ===================================================================== */
const FCH = 'Chapter 9 · The Fine Print';
add({ ch: FCH, theme: 'rose', render(b) {
  b.innerHTML = `<div class="kick">Legal department</div><h2>Terms &amp; Conditions of Dating Me</h2><p>Please read carefully. (Or just tick everything. Everyone does.)</p><div id="cl"></div><div class="btns" id="act"></div>`;
  const T = ['I agree to be teased at least once a day. Minimum.', 'I agree that "stop disturbing me" is a love language.', 'I agree that he will always steal the last chip. And that I will let him.',
    'I agree to keep smiling in his direction.', 'I agree that the surname question is still pending.', 'I agree to be loved extremely, loudly, and with no refund policy.'];
  let ticked = 0; const accept = btn('Accept all terms ✅', '', () => { ding(); confetti(50); api.next(); }); accept.disabled = true;
  T.forEach(t => {
    const l = el('label', 'check', `<input type="checkbox"><span>${t}</span>`);
    l.querySelector('input').onchange = e => { ticked += e.target.checked ? 1 : -1; chime(); accept.disabled = ticked < T.length; };
    $('#cl', b).appendChild(l);
  });
  const decline = btn('Decline 🚫', 'alt', function () { buzz(); this.classList.add('shake'); setTimeout(() => this.classList.remove('shake'), 500); this.textContent = 'Clause 7: Declining is not an option 😂'; });
  $('#act', b).append(accept, decline);
} });

add({ ch: FCH, theme: 'wine', render(b) {
  b.innerHTML = `<div class="kick">Security check</div><h2>Lie Detector Test 🕵️‍♀️</h2>
    <p>Press and hold the button below, and say out loud: <b class="gold">"I do not love him."</b></p>
    <div class="meters"><div class="meter"><label>Truth meter <em id="pc">0%</em></label><div class="track"><div class="fill" id="fl" style="width:0;transition:width .1s"></div></div></div></div>
    <div class="hold" id="hd">HOLD</div><p class="pink" id="rs" style="min-height:4em"></p>`;
  let v = 0, iv = null, done = false;
  const hd = $('#hd', b);
  const start = e => { e.preventDefault(); if (done) return; clearInterval(iv); iv = setInterval(() => { v = Math.min(100, v + 4); $('#fl', b).style.width = v + '%'; $('#pc', b).textContent = v + '%'; if (v >= 100) finish(); }, 60); };
  const stop = () => { if (done) return; clearInterval(iv); iv = setInterval(() => { v = Math.max(0, v - 8); $('#fl', b).style.width = v + '%'; $('#pc', b).textContent = v + '%'; if (v <= 0) clearInterval(iv); }, 60); };
  function finish() {
    done = true; clearInterval(iv); buzz(); document.body.classList.add('alarm');
    hd.textContent = '🚨'; $('#rs', b).innerHTML = '<b>🚨 LIE DETECTED 🚨</b><br>Heart rate: 190 bpm. Blushing level: maximum. Pupils: heart-shaped. Statement: <u>rejected.</u>';
    setTimeout(() => document.body.classList.remove('alarm'), 1800); confetti(80);
    nextBtn(b, 'Okay fine, I love him 🙈', .8);
  }
  ['pointerdown'].forEach(ev => hd.addEventListener(ev, start));
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => hd.addEventListener(ev, stop));
} });

choice({ ch: FCH, theme: 'wine', kicker: 'The State vs. The Boyfriend', title: '⚖️ Court is in session. The Honourable Judge Carol presides.',
  intro: 'Charges: disturbing Carol (guilty), making Carol smile (guilty), loving Carol dangerously (guilty). The accused awaits sentencing. What shall the sentence be?',
  opts: [
    { t: 'Life imprisonment in my arms', r: '✅ Sentence accepted. The prisoner requests a cell with no windows and a very long hug. 🔒💞', good: 1 },
    { t: 'Community service: carry my bags and my snacks', r: 'Granted. He has already started. He is secretly very happy about it.', good: 1 },
    { t: 'Forgive him, and let him keep disturbing me', r: '✅ The court is moved. The accused weeps with joy and immediately disturbs the judge.', good: 1 },
    { t: 'Dismiss the case. He is too cute to prosecute.', r: 'Case dismissed. Court adjourned for ice cream. 🍦', good: 1 }], btnLabel: 'Court adjourned ➡️' });

add({ ch: FCH, theme: 'rose', render(b) {
  b.innerHTML = `<div class="kick">Tap to reveal</div><h2>Reasons I Love You (Abridged Edition) 💌</h2><p>Flip at least four. The full list would take years and cause traffic.</p><div class="grid" id="g"></div>`;
  const R = ['Your laugh. It fixes bad days.', 'Your mind. Teaching is a gift and you were born with it.', 'Your perseverance. That degree was not easy, and you did it.', 'Your heart. It is bigger than you let on.',
    'The way you pretend to be annoyed and fail at hiding your smile.', 'How you make ordinary days feel like holidays.', 'The way you say my name.', 'You make me want to be a better man.'];
  let n = 0, nb = null;
  R.forEach((r, i) => {
    const c = el('div', 'fc', `<div><div class="f">${['💗', '🌹', '✨', '💎', '🌸', '🎀', '💫', '🦋'][i]}</div><div class="b">${r}</div></div>`);
    c.onclick = () => { if (c.classList.contains('on')) return; c.classList.add('on'); ding(); n++; if (n >= 4 && !nb) nb = nextBtn(b, 'Take me to the last chapter 🥺', .6); };
    $('#g', b).appendChild(c);
  });
} });

/* =====================================================================
   FINAL CHAPTER — THE QUESTION
   ===================================================================== */
const QCH = 'Final Chapter · The Question';
add({ ch: QCH, theme: 'dark', tk: 7, render(b) {
  b.innerHTML = `<div class="script rv">Okay...</div><h1 class="rv" style="--d:1.2s">No more jokes.</h1>
    <p class="rv" style="--d:2.6s"><i>(Okay, maybe one more later.)</i></p>
    <p class="rv" style="--d:4s">Please read this part slowly. 🤍</p>`;
  nextBtn(b, 'I am ready 🤍', 5);
} });

add({ ch: QCH, theme: 'dark', render(b) {
  const L = [
    `Caroline,`,
    `I joke a lot. I tease you, I disturb you, I find a reason to make you roll your eyes. But I want you to know that underneath every joke is something very real.`,
    `You are the person I think about when I wake up and the last one on my mind before I sleep. You work hard, you carry yourself with grace, and you finished your degree with dedication that I admire more than I can explain.`,
    `Somehow you make me calmer, happier, and a better version of myself, even on days when I am being impossible.`,
    `I do not need a perfect love story. I just need one with you in it, laughing, arguing about who is stubborn, and agreeing at the end that we are both right.`
  ];
  b.innerHTML = `<div class="letter" id="lt"></div>`;
  let i = 0; const lt = $('#lt', b);
  (function nextPara() {
    if (i >= L.length) { nextBtn(b, 'And so... 💍', .6); return; }
    const p = el('p', 'cursor'); lt.appendChild(p);
    const txt = L[i++]; let c = 0;
    const iv = setInterval(() => {
      p.textContent = txt.slice(0, ++c);
      if (c >= txt.length) { clearInterval(iv); p.classList.remove('cursor'); setTimeout(nextPara, 700); }
    }, 22);
  })();
} });

add({ ch: QCH, theme: 'wine', tk: 7, render(b) {
  b.innerHTML = `<div class="ring pulse">💍</div>
    <h1 class="rv" style="--d:.4s">${CFG.full}.</h1>
    <p class="rv" style="--d:1.2s">Or Wanyoike. Or Carol. Whichever surname you choose, there is only one name I want beside mine: <b class="gold">yours</b>.</p>
    <h2 class="rv gold" style="--d:2.6s">Will you be mine, forever?</h2>
    <p class="rv" style="--d:3.4s">Will you let me keep loving you, teasing you, and disturbing you for the rest of my life?</p>
    <div class="btns rv" style="--d:4.4s" id="bt"></div><p class="pink" id="nm" style="min-height:2.4em;margin-top:10px"></p>`;
  const bt = $('#bt', b), msg = $('#nm', b);
  const yes = btn('YES! 💖', 'big-yes', () => { api.next(); });
  yes.onclick = () => { tada(); api.next(); };
  const no = btn('No 🙄', 'alt', null);
  const NOES = ['Wrong button 😂', 'Nice try, madam.', 'The No button has been disabled by management.', 'It is shy. It keeps running away.', 'Error: this option does not exist 😌', 'FINE. It has converted itself to YES.'];
  let n = 0;
  const flee = e => {
    if (e) e.preventDefault();
    msg.textContent = NOES[Math.min(n, NOES.length - 1)]; buzz(); n++;
    if (n >= NOES.length) { no.className = 'btn big-yes'; no.textContent = 'YES! 💖'; no.style.position = ''; no.style.left = no.style.top = ''; no.classList.remove('runaway'); no.onclick = yes.onclick; no.removeEventListener('pointerenter', flee); return; }
    no.classList.add('runaway');
    no.style.left = rand(10, Math.max(20, innerWidth - 140)) + 'px';
    no.style.top = rand(90, Math.max(120, innerHeight - 120)) + 'px';
  };
  no.addEventListener('pointerenter', flee); no.onclick = flee;
  bt.append(yes, no);
} });

add({ ch: QCH, theme: 'wine', tk: 7, render(b) {
  b.innerHTML = `<div class="big pop">🎉</div><h1 class="rv" style="--d:.3s">SHE SAID YES!!! 😭💖</h1>
    <div class="cert rv" style="--d:1s;margin:18px 0"><h2>CASE FILE NO. 001: CLOSED</h2><p>Defendant sentenced to <b>love without bail</b>, served in the arms of <b>${CFG.full}</b>.</p><div class="seal">🔒💞</div><small>Surname status: whatever she chooses ❤️</small></div>
    <p class="rv" style="--d:1.8s">Thank you for being you, Carol. I promise to love you loudly, tease you lovingly, and disturb you every single day. 😂</p>
    <p class="rv gold" style="--d:2.6s"><b>I love you. Nakupenda sana, mpenzi wangu. 💞</b></p>
    <p class="rv" style="--d:3.4s">— ${CFG.from}</p>
    <div class="btns rv" style="--d:4s" id="bt"></div>`;
  let n = 0; tada();
  const fw = setInterval(() => { firework(); if (++n > 40) clearInterval(fw); }, 450);
  confetti(260);
  const msg = encodeURIComponent('I said YES!!! 💖 Case file no. 001 is officially closed. (Surname still under review 😂)');
  const wa = el('a', 'btn gold', 'Reply: tell him YES 💬'); wa.href = `https://wa.me/${CFG.whatsapp}?text=${msg}`; wa.target = '_blank'; wa.rel = 'noopener'; wa.style.textDecoration = 'none';
  $('#bt', b).append(wa, btn('Replay from the start 🔁', 'alt', () => api.go(0)));
} });

/* ----------------------------- UI wiring ----------------------------- */
$('#snd').onclick = function () { soundOn = !soundOn; this.textContent = soundOn ? '🔔' : '🔕'; };
$('#menu').onclick = () => {
  const list = $('#chapters'); list.innerHTML = '';
  const seen = new Set();
  screens.forEach((s, i) => { if (!seen.has(s.ch)) { seen.add(s.ch); const x = el('button', '', s.ch); x.onclick = () => { $('#panel').hidden = true; go(i); }; list.appendChild(x); } });
  $('#panel').hidden = false;
};
$('#closePanel').onclick = () => { $('#panel').hidden = true; };
$('#panel').onclick = e => { if (e.target.id === 'panel') $('#panel').hidden = true; };

const start = parseInt((location.hash || '').slice(1), 10);
go(Number.isFinite(start) && start > 0 ? start - 1 : 0);
window.__carol = { go, count: () => screens.length };
})();

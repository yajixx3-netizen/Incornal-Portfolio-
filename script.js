// 1. Boot loader
const lines = ['> booting portfolio.exe', '> loading skills...', '> compiling creativity...', '> welcome, visitor.'];
const boot = document.getElementById('boot'), fill = document.getElementById('loadFill'), pct = document.getElementById('loadPct');
let p = 0, li = 0;
const bootTimer = setInterval(() => {
  p = Math.min(100, p + Math.random() * 9 + 3);
  fill.style.width = p + '%'; pct.textContent = Math.floor(p) + '%';
  const want = Math.min(lines.length, Math.ceil(p / 25));
  while (li < want) boot.textContent += lines[li++] + '\n';
  if (p >= 100) { clearInterval(bootTimer); setTimeout(() => { document.getElementById('loader').classList.add('done'); startHero(); }, 400); }
}, 90);

// 2. Name: split letters (3D flip) — starts after loader
let idx = 0;
document.querySelectorAll('.row').forEach(r => {
  [...r.dataset.text].forEach(c => {
    const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', idx++);
    s.style.animationPlayState = 'paused';
    s.innerHTML = c === ' ' ? '&nbsp;' : c; r.appendChild(s);
  });
});

// 3. Typewriter roles
const roles = ['IT Support', 'Software Development', 'Computer Networking', 'Troubleshooting', 'Computer Systems'];
const typed = document.getElementById('typed');
let ri = 0, ci = 0, del = false;
function type() {
  const w = roles[ri];
  typed.textContent = w.slice(0, ci += del ? -1 : 1);
  let d = del ? 40 : 90;
  if (!del && ci === w.length) { del = true; d = 1400; }
  else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 400; }
  setTimeout(type, d);
}
function startHero() {
  document.querySelectorAll('.ch').forEach(c => c.style.animationPlayState = 'running');
  type();
}

// 4. Reveal + counters + terminal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  e.target.querySelectorAll('[data-count]').forEach(el => {
    const t = +el.dataset.count; let n = 0;
    const iv = setInterval(() => { el.textContent = ++n; if (n >= t) clearInterval(iv); }, 1200 / t);
  });
}), { threshold: .2 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
document.querySelectorAll('.terminal li').forEach((li, i) => li.style.transitionDelay = i * 180 + 'ms');

// 5. Scroll: progress, timeline fill, dot nav
const bar = document.querySelector('.progress'), tFill = document.getElementById('tFill'), tl = document.getElementById('timeline');
const dots = [...document.querySelectorAll('#dots a')];
const secs = dots.map(a => document.querySelector(a.getAttribute('href')));
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = scrollY / max * 100 + '%';
  const r = tl.getBoundingClientRect();
  tFill.style.height = Math.min(100, Math.max(0, (innerHeight * .7 - r.top) / r.height * 100)) + '%';
  let cur = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .5) cur = i; });
  dots.forEach((d, i) => d.classList.toggle('on', i === cur));
}, { passive: true });

// 6. Custom cursor
const cur = document.getElementById('cursor');
addEventListener('mousemove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });
document.querySelectorAll('a,.panel,.pill').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

// 7. Magnetic buttons + pill tilt
document.querySelectorAll('.magnetic').forEach(m => {
  m.addEventListener('mousemove', e => { const b = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .35}px,${(e.clientY - b.top - b.height / 2) * .35}px)`; });
  m.addEventListener('mouseleave', () => m.style.transform = '');
});

// 8. Expanding career panels
const panels = document.querySelectorAll('.panel');
panels.forEach(pn => pn.addEventListener('mouseenter', () => { panels.forEach(x => x.classList.remove('active')); pn.classList.add('active'); }));
panels.forEach(pn => pn.addEventListener('click', () => { panels.forEach(x => x.classList.remove('active')); pn.classList.add('active'); }));

// 9. Gold ember particles
const cv = document.getElementById('embers'), cx = cv.getContext('2d');
let W, H, parts = [];
function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
size(); addEventListener('resize', size);
for (let i = 0; i < 55; i++) parts.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 2 + .5, v: Math.random() * .6 + .2, c: Math.random() > .5 ? '212,175,55' : '224,38,54' });
(function draw() {
  cx.clearRect(0, 0, W, H);
  parts.forEach(q => {
    q.y -= q.v; q.x += Math.sin(q.y / 40) * .3;
    if (q.y < -5) { q.y = H + 5; q.x = Math.random() * W; }
    cx.beginPath(); cx.arc(q.x, q.y, q.r, 0, 7); cx.fillStyle = `rgba(${q.c},.55)`; cx.shadowBlur = 8; cx.shadowColor = `rgb(${q.c})`; cx.fill();
  });
  requestAnimationFrame(draw);
})();

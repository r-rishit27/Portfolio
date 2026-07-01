/* ── Custom Cursor (simple) ───────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', e => {
  dotX = e.clientX; dotY = e.clientY;
  dot.style.left = dotX + 'px';
  dot.style.top  = dotY + 'px';
}, { passive: true });

(function lerpRing() {
  ringX += (dotX - ringX) * 0.12;
  ringY += (dotY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(lerpRing);
})();

document.addEventListener('mousedown', () => ring.classList.add('clicked'));
document.addEventListener('mouseup',   () => ring.classList.remove('clicked'));

document.querySelectorAll('a, button, .skill-chips span').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ── Typewriter ───────────────────────────────────── */
const phrases = [
  'intelligent AI systems',
  'agentic workflows',
  'ideas into products',
  'things that scale',
  'the future of enterprise',
];
const tw = document.getElementById('typewriter');
let phraseIdx = 0, charIdx = 0, deleting = false, pause = 0;

function typeTick() {
  const phrase = phrases[phraseIdx];
  if (pause > 0) { pause--; setTimeout(typeTick, 50); return; }
  if (!deleting) {
    tw.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) { deleting = true; pause = 40; }
    setTimeout(typeTick, 70);
  } else {
    tw.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; pause = 10; }
    setTimeout(typeTick, 40);
  }
}
setTimeout(typeTick, 900);

/* ── Nav scroll ───────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile menu ──────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Reveal on scroll ─────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...(el.parentElement?.querySelectorAll('.reveal:not(.visible)') || [])];
    const idx = siblings.indexOf(el);
    setTimeout(() => el.classList.add('visible'), Math.min(idx * 80, 280));
    revealObs.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Counter animation ────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const start  = performance.now();
  const dur    = 1800;
  const ease   = t => 1 - Math.pow(1 - t, 3);
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = Math.round(ease(p) * target);
    el.textContent = v >= 1000 ? v.toLocaleString() : v;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target >= 1000 ? target.toLocaleString() : target;
  })(start);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObs.observe(el));

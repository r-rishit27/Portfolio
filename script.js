/* ── Custom Cursor ────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
let raf;

document.addEventListener('mousemove', e => {
  dotX = e.clientX; dotY = e.clientY;
  dot.style.left  = dotX + 'px';
  dot.style.top   = dotY + 'px';
}, { passive: true });

function lerpCursor() {
  ringX += (dotX - ringX) * 0.13;
  ringY += (dotY - ringY) * 0.13;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  raf = requestAnimationFrame(lerpCursor);
}
lerpCursor();

document.addEventListener('mousedown', () => ring.classList.add('clicked'));
document.addEventListener('mouseup',   () => ring.classList.remove('clicked'));

document.querySelectorAll('a, button, [data-cursor], .tilt-card, .skill-chips span').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ── Particle Canvas ──────────────────────────────── */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

function randomRange(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x    = randomRange(0, canvas.width);
    this.y    = init ? randomRange(0, canvas.height) : canvas.height + 10;
    this.size = randomRange(0.5, 2);
    this.speed = randomRange(0.15, 0.5);
    this.opacity = randomRange(0.2, 0.7);
    this.hue  = randomRange(220, 280);
  }
  update() {
    this.y -= this.speed;
    this.opacity -= 0.0008;
    if (this.y < -10 || this.opacity <= 0) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── Typewriter ───────────────────────────────────── */
const phrases = [
  'intelligent agents',
  'agentic payments',
  'AI ecosystems',
  'the future of finance',
  'things that ship',
];
const tw = document.getElementById('typewriter');
let phraseIdx = 0, charIdx = 0, deleting = false, pauseFrames = 0;

function typeTick() {
  const phrase = phrases[phraseIdx];
  if (pauseFrames > 0) { pauseFrames--; setTimeout(typeTick, 50); return; }

  if (!deleting) {
    tw.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) { deleting = true; pauseFrames = 36; }
    setTimeout(typeTick, 68);
  } else {
    tw.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      pauseFrames = 8;
    }
    setTimeout(typeTick, 38);
  }
}
setTimeout(typeTick, 800);

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
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...(el.parentElement?.querySelectorAll('.reveal:not(.visible)') || [])];
    const idx = siblings.indexOf(el);
    setTimeout(() => el.classList.add('visible'), Math.min(idx * 90, 320));
    revealObs.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── Counter animation ────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const dur    = 2000;
  const start  = performance.now();
  const ease   = t => 1 - Math.pow(1 - t, 4);
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = Math.round(ease(p) * target);
    el.textContent = v >= 1000 ? v.toLocaleString() : v;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target >= 1000 ? target.toLocaleString() : target;
  })(start);
}

const counterEls = document.querySelectorAll('.stat-num[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

/* ── 3D Tilt on cards ─────────────────────────────── */
const TILT_STRENGTH = 8;

document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r    = card.getBoundingClientRect();
    const x    = e.clientX - r.left;
    const y    = e.clientY - r.top;
    const cx   = r.width  / 2;
    const cy   = r.height / 2;
    const rotX = ((y - cy) / cy) * -TILT_STRENGTH;
    const rotY = ((x - cx) / cx) *  TILT_STRENGTH;
    card.style.transform     = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    card.style.transition    = 'transform 0.1s ease';
    card.style.boxShadow     = `${-rotY * 1.5}px ${rotX * 1.5}px 40px rgba(0,0,0,0.35)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.boxShadow  = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease';
  });
});

/* ── Magnetic buttons ─────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    btn.style.transform  = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    btn.style.transition = 'transform 0.15s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform  = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
});

/* ── Scroll-linked hero parallax ──────────────────── */
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (sy < window.innerHeight) {
    heroContent.style.transform = `translateY(${sy * 0.18}px)`;
    heroContent.style.opacity   = 1 - sy / (window.innerHeight * 0.8);
  }
}, { passive: true });

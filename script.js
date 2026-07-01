/* ── Nav scroll effect ────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile menu ──────────────────────────────── */
const hamburger = document.getElementById('hamburger');
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

/* ── Intersection observer for reveal ─────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblings = [...el.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay = siblings.indexOf(el) * 80;
      setTimeout(() => el.classList.add('visible'), Math.min(delay, 300));
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Animated counters ────────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(easeOut(progress) * target);
    el.textContent = value >= 1000 ? value.toLocaleString() : value;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target >= 1000 ? target.toLocaleString() : target;
  }
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('.stat-num[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

/* ── Active nav link on scroll ────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? '#fff'
          : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* ── Smooth active indicator underline ────────── */
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => link.style.color = '#fff');
  link.addEventListener('mouseleave', () => link.style.color = '');
});

/* ── Cursor glow trail (subtle) ───────────────── */
let lastX = 0, lastY = 0;
const glows = document.querySelectorAll('.glow');
document.addEventListener('mousemove', (e) => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  if (Math.abs(dx) + Math.abs(dy) < 4) return;
  lastX = e.clientX;
  lastY = e.clientY;
  const hero = document.getElementById('hero');
  const rect = hero.getBoundingClientRect();
  if (e.clientY < rect.bottom) {
    const xPct = (e.clientX / window.innerWidth) * 20 - 10;
    const yPct = (e.clientY / window.innerHeight) * 20 - 10;
    glows[0].style.transform = `translate(${xPct * 0.5}px, ${yPct * 0.5}px)`;
    glows[1].style.transform = `translate(${-xPct * 0.3}px, ${-yPct * 0.3}px)`;
  }
}, { passive: true });

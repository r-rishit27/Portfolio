document.addEventListener('DOMContentLoaded', function () {

  /* ── Safety fallback: show all reveals after 1.5s no matter what ── */
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      el.classList.add('visible');
    });
  }, 1500);

  /* ── Typewriter ─────────────────────────────────── */
  var phrases = [
    'intelligent AI systems',
    'agentic workflows',
    'ideas into products',
    'things that scale',
    'the future of enterprise',
  ];
  var tw = document.getElementById('typewriter');
  if (tw) {
    var phraseIdx = 0, charIdx = 0, deleting = false, pause = 0;
    function typeTick() {
      var phrase = phrases[phraseIdx];
      if (pause > 0) { pause--; setTimeout(typeTick, 50); return; }
      if (!deleting) {
        tw.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) { deleting = true; pause = 40; }
        setTimeout(typeTick, 70);
      } else {
        tw.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          pause = 10;
        }
        setTimeout(typeTick, 40);
      }
    }
    setTimeout(typeTick, 900);
  }

  /* ── Nav scroll ─────────────────────────────────── */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Mobile menu ────────────────────────────────── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── Reveal on scroll ───────────────────────────── */
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.from(el.parentElement
          ? el.parentElement.querySelectorAll('.reveal:not(.visible)')
          : []);
        var idx = siblings.indexOf(el);
        setTimeout(function () { el.classList.add('visible'); }, Math.min(idx * 80, 280));
        revealObs.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    /* Fallback for browsers without IntersectionObserver */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Counter animation ──────────────────────────── */
  function animateCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var start  = performance.now();
    var dur    = 1800;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var v = Math.round(ease(p) * target);
      el.textContent = v >= 1000 ? v.toLocaleString() : v;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target >= 1000 ? target.toLocaleString() : target;
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num[data-count]').forEach(function (el) {
      counterObs.observe(el);
    });
  }

  /* ── Contact Form (Web3Forms) ───────────────── */
  var form       = document.getElementById('contactForm');
  var submitBtn  = document.getElementById('formSubmit');
  var submitText = document.getElementById('submitText');
  var status     = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitText.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';

      var data = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.success) {
          status.className = 'form-status success';
          status.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
          form.reset();
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      })
      .catch(function (err) {
        status.className = 'form-status error';
        status.textContent = '✗ Something went wrong. Please email me directly at r.rishit27@gmail.com';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
      });
    });
  }

});

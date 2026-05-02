/* ═══════════════════════════════════════════════════════
   LA PLANA TENNIS ACADEMY — Main JS
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navbar ──────────────────────────────────────── */
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('navBurger');
  const navMenu = document.getElementById('navLinks');

  function syncNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 56);
  }
  window.addEventListener('scroll', syncNavbar, { passive: true });
  syncNavbar();

  burger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('click', e => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !burger.contains(e.target)) closeMenu();
  });
  function closeMenu() {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }


  /* ── Active nav link ────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nl');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`)
        );
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => sectionObs.observe(s));


  /* ── Smooth scroll ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });


  /* ── Scroll reveal ──────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const idx  = getStaggerIndex(el);
      const delay = Math.min(idx * 90, 400);
      setTimeout(() => el.classList.add('in'), delay);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  function getStaggerIndex(el) {
    const parent = el.parentElement;
    return Array.from(parent.children)
      .filter(c => c.classList.contains('reveal'))
      .indexOf(el);
  }


  /* ── Hero counter animation ─────────────────────── */
  const heroNums = document.querySelector('.hero-numbers');
  if (heroNums) {
    let ran = false;
    const counterObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || ran) return;
      ran = true;
      document.querySelectorAll('.hn-n[data-target]').forEach(el => {
        animateCount(el, parseInt(el.dataset.target, 10), el.textContent.replace(/\d/g, ''));
      });
    }, { threshold: 0.6 });
    counterObs.observe(heroNums);
  }

  function animateCount(el, target, suffix) {
    const duration = 1400;
    const fps = 60;
    const steps = Math.round(duration / (1000 / fps));
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.round(easeOut(step / steps) * target);
      el.textContent = current + suffix;
      if (step >= steps) {
        el.textContent = target + suffix;
        clearInterval(timer);
      }
    }, 1000 / fps);
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }


  /* ── Contact form ────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const suc = document.getElementById('cfSuccess');
      btn.disabled = true;
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp; Enviando…';
      setTimeout(() => {
        suc.classList.add('show');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = orig;
        suc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });
  }


  /* ── Hover lift on pricing cards ───────────────── */
  document.querySelectorAll('.prog-card, .price-card, .why-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = '';
    });
  });

})();

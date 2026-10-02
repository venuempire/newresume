/* Portfolio interactions: menu, active link, scroll progress, reveal, back-to-top, year */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');

  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const progress = document.getElementById('progress');
  const totop = document.getElementById('totop');
  const links = [...menu.querySelectorAll('a[href^="#"]')];

  // Current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  links.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 820) setMenu(false); });

  // Navbar state, scroll progress, back-to-top
  const onScroll = () => {
    const y = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    totop.classList.toggle('show', y > 600);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Active navigation link
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  // Reveal on scroll for section content
  const targets = document.querySelectorAll('.card, .timeline li, .certs li, .strengths li, .about p');
  targets.forEach((t) => t.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('in'));
  }
})();

/* Motion & 3D upgrade: ribbon, tilt cards, hero parallax, auto-sliding certifications */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Duplicate ribbon content for a seamless loop
  const track = document.querySelector('.track');
  if (track) track.innerHTML += track.innerHTML;
  if (reduce) return;

  // 3D tilt + cursor glow on cards (pointer devices only)
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card, .certs li, .strengths li').forEach((el) => {
      el.classList.add('tilt');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', (x - 0.5) * 10 + 'deg');
        el.style.setProperty('--rx', (0.5 - y) * 10 + 'deg');
        el.style.setProperty('--mx', x * 100 + '%');
        el.style.setProperty('--my', y * 100 + '%');
      });
      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Hero 3D scene follows the cursor
  const hero = document.querySelector('.hero'), scene = document.querySelector('.scene');
  if (hero && scene) {
    hero.addEventListener('mousemove', (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      scene.style.transform = `rotateY(${x * 26}deg) rotateX(${-y * 26}deg)`;
    });
  }

  // Auto-sliding certifications (pauses on hover, focus or touch)
  const certs = document.querySelector('.certs');
  if (certs) {
    let paused = false;
    ['mouseenter', 'focusin', 'touchstart'].forEach((ev) => certs.addEventListener(ev, () => (paused = true)));
    ['mouseleave', 'focusout', 'touchend'].forEach((ev) => certs.addEventListener(ev, () => (paused = false)));
    setInterval(() => {
      if (paused) return;
      const step = certs.firstElementChild.offsetWidth + 16;
      const atEnd = certs.scrollLeft + certs.clientWidth >= certs.scrollWidth - 4;
      certs.scrollTo({ left: atEnd ? 0 : certs.scrollLeft + step, behavior: 'smooth' });
    }, 3000);
  }
})();

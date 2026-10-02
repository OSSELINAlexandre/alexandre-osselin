(function () {
  var root = document.documentElement;
  var themes = ['tokyo-night', 'matte-black', 'flexoki-light'];
  var nameEl = document.getElementById('theme-name');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setTheme(t) {
    root.dataset.theme = t;
    if (nameEl) nameEl.textContent = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  function cycle() {
    var i = themes.indexOf(root.dataset.theme);
    setTheme(themes[(i + 1) % themes.length]);
  }
  setTheme(themes.indexOf(root.dataset.theme) >= 0 ? root.dataset.theme : 'tokyo-night');
  document.getElementById('theme-btn').addEventListener('click', cycle);
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.key === 't' || e.key === 'T') cycle();
  });

  // typed effect
  var typed = document.getElementById('typed');
  var out = document.getElementById('hero-out');
  var text = 'whoami';
  if (reduce) { typed.textContent = text; }
  else {
    out.classList.add('hidden');
    var i = 0;
    (function step() {
      typed.textContent = text.slice(0, i);
      if (i++ < text.length) setTimeout(step, 85);
      else setTimeout(function () { out.classList.remove('hidden'); }, 150);
    })();
  }

  // reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  // active nav
  var links = document.querySelectorAll('.nav ul a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { nio.observe(s); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();

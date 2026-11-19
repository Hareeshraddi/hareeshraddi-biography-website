/* ============================================================
   HAREESHRADDI DANI — BIOGRAPHY WEBSITE INTERACTIONS
   Vanilla JS · commented & beginner-friendly
   Sections: loader, stars, name reveal, gold-dust canvas,
   aura, parallax, reveals, chapters, meters, tilt, form
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. CINEMATIC LOADER ---------- */
  var loader = document.getElementById('loader');
  var fill = document.getElementById('loaderFill');
  var p = 0;
  var tick = setInterval(function () {
    p += Math.random() * 20 + 9;
    if (p >= 100) { p = 100; clearInterval(tick); setTimeout(finish, 300); }
    fill.style.width = p + '%';
  }, 230);

  function finish() {
    loader.classList.add('done');
    document.body.classList.add('loaded');
    document.querySelectorAll('.reveal-hero').forEach(function (el) {
      var d = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () { el.classList.add('in'); }, 150 + d * 150);
    });
  }
  setTimeout(function () {
    if (!loader.classList.contains('done')) { clearInterval(tick); finish(); }
  }, 4500);

  /* ---------- 2. NAME — staggered serif reveal ---------- */
  document.querySelectorAll('#storyName .name-line').forEach(function (line, li) {
    var text = line.getAttribute('data-text') || '';
    text.split('').forEach(function (ch, i) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = (0.6 + li * 0.4 + i * 0.05) + 's';
      line.appendChild(s);
    });
  });

  /* ---------- 3. PHOTO FALLBACK ---------- */
  var img = document.getElementById('profileImg');
  var ph = document.getElementById('photoPlaceholder');
  function showPh() { img.style.display = 'none'; ph.classList.add('show'); }
  img.addEventListener('error', showPh);
  if (img.complete && img.naturalWidth === 0) showPh();

  /* ---------- 4. STARFIELD (tiny twinkling stars) ---------- */
  var starsBox = document.getElementById('stars');
  if (starsBox && !prefersReduced) {
    for (var s = 0; s < 70; s++) {
      var star = document.createElement('i');
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.opacity = (Math.random() * 0.5 + 0.15).toFixed(2);
      var sz = Math.random() > 0.85 ? 3 : 2;
      star.style.width = sz + 'px'; star.style.height = sz + 'px';
      starsBox.appendChild(star);
    }
  }

  /* ---------- 5. GOLD-DUST PARTICLES (prologue canvas) ---------- */
  var canvas = document.getElementById('dust');
  if (canvas && !prefersReduced) {
    var ctx = canvas.getContext('2d');
    var W, H, parts = [];
    var COUNT = window.innerWidth < 640 ? 40 : 80;
    var COLORS = ['245,198,107', '232,121,249', '139,92,246', '245,241,232'];

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width; H = canvas.height = r.height;
    }
    resize();
    window.addEventListener('resize', resize);

    function spawn(i, randomY) {
      parts[i] = {
        x: Math.random() * W,
        y: randomY ? Math.random() * H : H + 10,
        r: Math.random() * 2.4 + 0.7,
        vy: -(Math.random() * 0.5 + 0.18),   // float upward like embers
        vx: (Math.random() - 0.5) * 0.3,
        sway: Math.random() * Math.PI * 2,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: Math.random() * 0.55 + 0.2
      };
    }
    for (var i = 0; i < COUNT; i++) spawn(i, true);

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var j = 0; j < parts.length; j++) {
        var pt = parts[j];
        pt.sway += 0.015;
        pt.x += pt.vx + Math.sin(pt.sway) * 0.25;
        pt.y += pt.vy;
        if (pt.y < -12) spawn(j, false);
        if (pt.x < -12) pt.x = W + 12;
        if (pt.x > W + 12) pt.x = -12;
        var glow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.r * 4);
        glow.addColorStop(0, 'rgba(' + pt.c + ',' + pt.a + ')');
        glow.addColorStop(1, 'rgba(' + pt.c + ',0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(' + pt.c + ',' + Math.min(1, pt.a + 0.3) + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 6. CURSOR AURA ---------- */
  if (isFinePointer && !prefersReduced) {
    var aura = document.getElementById('aura');
    var ax = -999, ay = -999, tx = -999, ty = -999;
    document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function follow() {
      ax += (tx - ax) * 0.09; ay += (ty - ay) * 0.09;
      aura.style.left = ax + 'px'; aura.style.top = ay + 'px';
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- 7. PORTRAIT PARALLAX ---------- */
  var stage = document.getElementById('portraitStage');
  if (stage && isFinePointer && !prefersReduced) {
    var hero = document.getElementById('prologue');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = 'perspective(900px) rotateY(' + (px * 12) + 'deg) rotateX(' + (-py * 12) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () {
      stage.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
    });
    stage.style.transition = 'transform .25s ease-out';
  }

  /* ---------- 8. SCROLL REVEALS ---------- */
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var d = parseInt(en.target.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { en.target.classList.add('in'); }, d * 130);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

  /* ---------- 9. READING PROGRESS + CHAPTER TRACKING ---------- */
  var bar = document.querySelector('#readProgress span');
  var links = document.querySelectorAll('.nav-link');
  var pill = document.getElementById('chapterPill');
  var chapters = [
    { id: 'prologue', label: 'CH. 00 — PROLOGUE' },
    { id: 'story', label: 'CH. 01 — MY STORY' },
    { id: 'why-cs', label: 'CH. 02 — WHY CS' },
    { id: 'journey', label: 'CH. 03 — JOURNEY' },
    { id: 'learning', label: 'CH. 04 — LEARNING' },
    { id: 'passions', label: 'CH. 05 — PASSIONS' },
    { id: 'growth', label: 'CH. 06 — GROWTH' },
    { id: 'vision', label: 'CH. 07 — VISION' },
    { id: 'contact', label: 'EPILOGUE — CONTACT' }
  ];
  var jFill = document.getElementById('journeyFill');

  function onScroll() {
    var st = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (st / max) * 100 : 0) + '%';

    var current = 'prologue';
    chapters.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (el && st >= el.offsetTop - window.innerHeight * 0.45) current = c.id;
    });
    links.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('data-section') === current);
    });
    var found = chapters.filter(function (c) { return c.id === current; })[0];
    if (found && pill) pill.textContent = found.label;

    // journey line fill
    var j = document.querySelector('.journey');
    if (j && jFill) {
      var r = j.getBoundingClientRect();
      var pr = 1 - (r.bottom - window.innerHeight * 0.6) / r.height;
      jFill.style.height = Math.max(0, Math.min(1, pr)) * 100 + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 10. TRAIT BARS + PASSION METERS ---------- */
  var meterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.querySelectorAll('.trait').forEach(function (t, i) {
        setTimeout(function () {
          t.querySelector('.tbar i').style.width = t.getAttribute('data-w') + '%';
        }, i * 180);
      });
      en.target.querySelectorAll('.passion-meter span').forEach(function (m, i) {
        setTimeout(function () {
          m.style.width = getComputedStyle(m).getPropertyValue('--w');
        }, i * 180);
      });
      meterObs.unobserve(en.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.trait-card, .passion-grid').forEach(function (el) { meterObs.observe(el); });

  /* ---------- 11. TILT on growth cards ---------- */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(1000px) rotateY(' + (px * 5) + 'deg) rotateX(' + (-py * 5) + 'deg) translateY(-5px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- 12. MAGNETIC BUTTONS ---------- */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.16 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.16 + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- 13. MOBILE MENU ---------- */
  var burger = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 14. HELLO FORM → email ---------- */
  document.getElementById('helloForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    var subject = encodeURIComponent('Hello from ' + f.name.value + ' — via your story site');
    var body = encodeURIComponent('Hi Hareeshraddi,\n\n' + f.message.value + '\n\n— ' + f.name.value + ' (' + f.email.value + ')');
    window.location.href = 'mailto:hareeshraddi2005@gmail.com?subject=' + subject + '&body=' + body;
  });

  /* ---------- 15. BACK TO TOP ---------- */
  document.getElementById('toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

})();

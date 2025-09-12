/* =========================================================
   BIOTEKPHARM — Professional JS (clean, robust, UX-friendly)
   Author: ChatGPT (refactor)
   What you get:
   - Safe init + guards, no hard fails
   - Navbar blur + autohide on mobile, active-link sync
   - Smooth anchor scroll with dynamic offset
   - Lang switcher: supports [data-i18n] and .i18n-db (data-uz/ru/en)
   - History/Partners reveal with IntersectionObserver (default visible)
   - Back-to-top, Preloader, Current year
   - Google Maps lazy load when #locations enters viewport
   - Respects prefers-reduced-motion, throttled scroll handlers
========================================================= */

(() => {
  // ---------- Utilities ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const raf = (fn) => requestAnimationFrame(fn);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Throttle using rAF (for scroll/resize)
  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      raf(() => { fn(...args); ticking = false; });
    };
  };

  // ---------- Bootstrap ----------
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-ready');
  });

  // ---------- Preloader (optional, guarded) ----------
  const preloader = $('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('fade-out');
      setTimeout(() => (preloader.style.display = 'none'), 500);
    });
  }

  // ---------- Navbar: blur on scroll + autohide on mobile ----------
  const navbar = $('.navbar');
  const backToTop = $('.back-to-top');
  let lastY = window.scrollY;

  const SCROLL_TRIG = 48;
  const handleNav = () => {
    if (!navbar) return;
    const y = window.scrollY;

    navbar.classList.toggle('scrolled', y > SCROLL_TRIG);

    // mobile autohide
    if (window.innerWidth < 992) {
      const goingUp = y < lastY;
      navbar.style.transform = (goingUp || y < 10) ? 'translateY(0)' : 'translateY(-110%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    // back-to-top toggle
    if (backToTop) backToTop.classList.toggle('visible', y > 600);

    lastY = y;
  };

  const handleNavThrottled = rafThrottle(handleNav);
  handleNav(); // initial
  on(window, 'scroll', handleNavThrottled, { passive: true });
  on(window, 'resize', handleNavThrottled);

  // ---------- Mobile menu ----------
  const mobileMenuBtn = $('#mobile-menu');
  const navList = $('.nav-list');

  on(mobileMenuBtn, 'click', () => {
    mobileMenuBtn.classList.toggle('active');
    navList && navList.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Close drawer on any nav-link click
  $$('.nav-link').forEach((a) =>
    on(a, 'click', () => {
      mobileMenuBtn && mobileMenuBtn.classList.remove('active');
      navList && navList.classList.remove('active');
      document.body.classList.remove('nav-open');
    })
  );

  // Escape closes drawer
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') {
      mobileMenuBtn && mobileMenuBtn.classList.remove('active');
      navList && navList.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });

  // ---------- Smooth scroll with offset ----------
  const dynamicOffset = () => (navbar ? navbar.offsetHeight + 8 : 64);

  $$("a[href^='#']").forEach((anchor) => {
    on(anchor, 'click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = $(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - dynamicOffset();
      window.scrollTo({ top, behavior: isReducedMotion ? 'auto' : 'smooth' });

      // update URL hash without jump
      history.pushState(null, '', href);
    });
  });

  // If open with a hash — adjust scroll after load
  window.addEventListener('load', () => {
    if (location.hash) {
      const target = $(location.hash);
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - dynamicOffset();
        window.scrollTo({ top, behavior: 'auto' });
      }
    }
  });

  // ---------- Active link highlight ----------
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 }
    );
    sections.forEach((s) => io.observe(s));
  }

  // ---------- Back to top ----------
  on(backToTop, 'click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });
  });

  // ---------- Current year ----------
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Language switcher ----------
  const langBtn = $('#langBtn');
  const langMenu = $('#langMenu');
  const currentLangEl = $('#currentLang');
  const DEFAULT_LANG = 'uz';

  const setLangChip = (lang) => {
    if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
  };

  // Apply translations:
  // 1) data-i18n (flat dictionary: window.translations[lang][key])
  // 2) .i18n-db (per-element data-uz/data-ru/data-en fallbacks)
  const applyTranslations = (lang) => {
    // data-i18n
    const dict = window.translations?.[lang];
    if (dict) {
      $$('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const val = dict[key];
        if (!val) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
        else el.innerHTML = val;
      });
    }
    // i18n-db
    $$('.i18n-db').forEach((el) => {
      const val =
        el.getAttribute(`data-${lang}`) ||
        el.getAttribute('data-uz') || el.textContent;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.textContent = val;
    });
  };

  const changeLanguage = (lang) => {
    localStorage.setItem('preferredLang', lang);
    setLangChip(lang);
    applyTranslations(lang);
    document.documentElement.setAttribute('lang', lang);
  };

  // Expose for other scripts if needed
  window.changeLanguage = changeLanguage;

  // UI events
  on(langBtn, 'click', (e) => {
    e.stopPropagation();
    langMenu?.classList.toggle('show');
    langBtn.setAttribute('aria-expanded', langMenu?.classList.contains('show') ? 'true' : 'false');
  });

  $$('#langMenu li').forEach((li) =>
    on(li, 'click', () => {
      const lang = li.getAttribute('data-lang') || DEFAULT_LANG;
      changeLanguage(lang);
      langMenu?.classList.remove('show');
      langBtn?.setAttribute('aria-expanded', 'false');
    })
  );

  // Close on outside click
  on(document, 'click', (e) => {
    if (langMenu && !langMenu.contains(e.target) && !langBtn?.contains(e.target)) {
      langMenu.classList.remove('show');
      langBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  // Init saved language
  const savedLang = localStorage.getItem('preferredLang') || DEFAULT_LANG;
  setLangChip(savedLang);
  applyTranslations(savedLang);

  // ---------- History cards: reveal (default visible; animate only if .js-ready) ----------
// HISTORY: reveal (in-view) — minimal
(() => {
  const rows = document.querySelectorAll('.h-item');
  if (!rows.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

  rows.forEach((r, i) => {
    r.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
    io.observe(r);
  });
})();


  // ---------- Partners rows: reveal (default visible; animate with .js-ready) ----------
  (() => {
    const rows = $$('.partners-row');
    if (!rows.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    rows.forEach((r) => io.observe(r));
  })();

  // ---------- Timeline (optional block; auto-detect if present) ----------
  (() => {
    const timeline = $('#timeline');
    const progress = $('#timelineProgress');
    const rows = $$('.t-row', timeline || document);
    if (!timeline || !rows.length) return;

    // stagger var for CSS-driven animation
    rows.forEach((row, i) => row.style.setProperty('--stagger', `${i * 90}ms`));

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
        { threshold: 0.25 }
      );
      rows.forEach((r) => io.observe(r));
    }

    const updateProgress = () => {
      if (!progress) return;
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = Math.max(0, vh - rect.top);
      const total = rect.height + vh;
      const ratio = clamp(start / total, 0, 1);
      progress.style.height = ratio * rect.height + 'px';
    };

    const updateProgressThrottled = rafThrottle(updateProgress);
    updateProgress();
    on(window, 'scroll', updateProgressThrottled, { passive: true });
    on(window, 'resize', updateProgressThrottled);
  })();

  // ---------- Google Maps: lazy load when #locations appears ----------
/* === LOCATIONS v3 — PNG sahna uchun pro interaktiv JS === */
(() => {
  const stage = document.querySelector('.locations-v3 .loc-stage');
  if (!stage) return;

  const pins = Array.from(stage.querySelectorAll('.pin'));
  const card = stage.querySelector('.loc-card');
  if (!pins.length || !card) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // UI elements inside card
  const cityEl  = card.querySelector('.loc-card__city');
  const elAddr  = card.querySelector('.js-address');
  const elPhone = card.querySelector('.js-phone');
  const elHours = card.querySelector('.js-hours');
  const openEl  = card.querySelector('#openBadge');
  const dirBtn  = card.querySelector('#dirBtn');
  const copyBtn = card.querySelector('#copyAddr');
  const shareBtn= card.querySelector('#shareAddr');

  // Ma'lumotlar (backend bilan sinxron kodingiz bo'yicha)
  const DATA = {
    samarqand: {
      city: "Samarqand",
      address: "Yuqori Turkman, Oʻzbekiston ko‘chasi, 158-uy",
      phone: "+998 90 657 05 00",
      hours: "Dushanba–Juma: 9:00 – 18:00",
      lat: 39.6542, lng: 66.9597
    },
    tashkent: {
      city: "Toshkent",
      address: "Mirzo Ulug'bek tumani, Sayram 7-proyezd, 50-uy",
      phone: "+998 90 123 45 67",
      hours: "Dushanba–Juma: 9:00 – 18:00",
      lat: 41.2995, lng: 69.2401
    },
    fergana: {
      city: "Fargʻona",
      address: "Urta Shura MFY, Charogon ko'chasi, 21-uy",
      phone: "+998 90 937 06 04",
      hours: "Dushanba–Juma: 9:00 – 18:00",
      lat: 40.3880, lng: 71.7870
    },
    xorazm: {
      city: "Xorazm",
      address: "Sanoatchilar ko'chasi, 12D-uy",
      phone: "+998 90 657 05 00",
      hours: "Dushanba–Juma: 9:00 – 18:00",
      lat: 41.3565, lng: 60.8567
    }
  };

  /* ---------- Helpers ---------- */
  const $on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // 9:00–18:00 ichidami? (oddiy versiya)
  const isOpenNow = () => {
    const d = new Date();
    const h = d.getHours() + d.getMinutes()/60;
    return h >= 9 && h <= 18; // kerak bo‘lsa backenddan keladigan jadvalga moslashtiring
  };

  const updateOpenBadge = () => {
    const open = isOpenNow();
    openEl.textContent = open ? 'Open' : 'Closed';
    openEl.classList.toggle('is-closed', !open);
  };

  const updateDirections = (lat, lng) => {
    if (!dirBtn) return;
    dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  // Kartani aktiv pin koordinatalariga “langar” qilish (desktop),
  // mobil’da esa CSS qoidasiga ko‘ra pastda dok bo‘ladi.
  const placeCard = (pin) => {
    if (!pin) return;
    card.style.setProperty('--cx', pin.style.getPropertyValue('--x') || '50%');
    card.style.setProperty('--cy', pin.style.getPropertyValue('--y') || '50%');
  };

  const fillCard = (key) => {
    const d = DATA[key];
    if (!d) return;
    cityEl.textContent  = d.city;
    elAddr.textContent  = d.address;
    elPhone.textContent = d.phone;
    elHours.textContent = d.hours;
    updateOpenBadge();
    updateDirections(d.lat, d.lng);
  };

  const setPressed = (hit) => {
    pins.forEach(p => p.setAttribute('aria-pressed', (p === hit) ? 'true' : 'false'));
  };

  let activeKey = null;
  const activate = (key, pushHash = true) => {
    const pin = pins.find(p => p.dataset.region === key) || pins[0];
    if (!pin) return;
    activeKey = pin.dataset.region;
    pins.forEach(p => p.classList.toggle('is-active', p === pin));
    setPressed(pin);
    fillCard(activeKey);
    placeCard(pin);
    card.classList.add('show');

    if (pushHash) {
      const url = new URL(location.href);
      url.searchParams.set('loc', activeKey); // ?loc=samarqand
      history.replaceState(null, '', url);
    }
  };

  // Deep-link: ?loc=... yoki #loc=...
  const getInitialKey = () => {
    const url = new URL(location.href);
    const qp = url.searchParams.get('loc');
    if (qp && DATA[qp]) return qp;
    const hash = (location.hash || '').toLowerCase();
    const m = hash.match(/loc[-=](\w+)/);
    if (m && DATA[m[1]]) return m[1];
    return (pins[0] && pins[0].dataset.region) || 'samarqand';
  };

  /* ---------- Init ---------- */
  activate(getInitialKey(), false);

  // Interaktivlik: click/tap + klaviatura
  pins.forEach(p => {
    $on(p, 'click', () => { activate(p.dataset.region); stopRotate(); });
    $on(p, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.click(); }
    });
  });

  // Copy / Share
  $on(copyBtn, 'click', async () => {
    try {
      await navigator.clipboard?.writeText(`${cityEl.textContent}: ${elAddr.textContent}`);
      copyBtn.classList.add('is-ok'); setTimeout(()=>copyBtn.classList.remove('is-ok'), 800);
    } catch {}
  });

  $on(shareBtn, 'click', async () => {
    const title = cityEl.textContent.trim();
    const text  = `${title}: ${elAddr.textContent.trim()} — ${elPhone.textContent.trim()}`;
    const url = new URL(location.href);
    url.searchParams.set('loc', activeKey || 'samarqand');
    if (navigator.share) {
      try { await navigator.share({ title, text, url: url.toString() }); } catch {}
    } else {
      try { await navigator.clipboard?.writeText(url.toString()); } catch {}
    }
  });

  // Auto-rotate (reduce-motion bo‘lsa yoqilmaydi)
  let rotTimer = null;
  const next = () => {
    const i = pins.findIndex(p => p.dataset.region === activeKey);
    const n = pins[(i + 1) % pins.length];
    activate(n.dataset.region);
  };
  const startRotate = () => { if (!isReducedMotion && !rotTimer) rotTimer = setInterval(next, 6000); };
  const stopRotate  = () => { if (rotTimer) { clearInterval(rotTimer); rotTimer = null; } };

  startRotate();
  $on(stage, 'pointerenter', stopRotate);
  $on(stage, 'pointerleave', startRotate);

  // Resize’da kartani joyini yangilash (pin o‘zgarmasa ham)
  const onResize = () => {
    const pin = pins.find(p => p.dataset.region === activeKey) || pins[0];
    placeCard(pin);
  };
  window.addEventListener('resize', onResize);

  // Sahifada yuqoriga qaytganda yoki visibility o‘zgarganda auto-rotate optimizatsiya
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopRotate();
    else startRotate();
  });
})();


  // ---------- Safety: disable animations for reduced motion ----------
  if (isReducedMotion) {
    document.body.classList.add('reduce-motion');
  }
})();



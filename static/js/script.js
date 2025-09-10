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
  (() => {
    const rows = $$('.h-item');
    if (!rows.length || !('IntersectionObserver' in window)) return;

    // stagger delays (cap to 400ms)
    rows.forEach((row, i) => (row.style.transitionDelay = `${Math.min(i * 90, 400)}ms`));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    rows.forEach((r) => io.observe(r));
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
  (() => {
    const mapHost = $('#google-map');
    const locationsSection = $('#locations');
    if (!mapHost || !locationsSection) return;

    const initMap = () => {
      // already initialized?
      if (mapHost.dataset.mapInited === '1') return;
      mapHost.dataset.mapInited = '1';

      const defaultLocation = { lat: 39.6542, lng: 66.9597 }; // Samarkand
      const map = new google.maps.Map(mapHost, {
        zoom: 12,
        center: defaultLocation,
        styles: [
          { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
          { featureType: 'road', elementType: 'all', stylers: [{ saturation: -100 }, { lightness: 45 }] },
          { featureType: 'water', elementType: 'all', stylers: [{ color: '#c9e7ff' }, { visibility: 'on' }] },
        ],
        disableDefaultUI: false,
      });

      const cards = $$('.location-card');
      const windows = [];

      const highlightCard = (region) => {
        cards.forEach((c) => c.classList.toggle('active', c.dataset.region === region));
      };

      cards.forEach((card) => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        const title = card.querySelector('h3')?.textContent || '';

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title,
          // NOTE: customize marker if needed
        });

        const info = new google.maps.InfoWindow({
          content: `
            <div style="padding:10px;max-width:260px">
              <h3 style="margin:0 0 6px;color:#3a86ff;">${title}</h3>
              <p style="margin:0 0 5px;">${card.querySelectorAll('p')[0]?.textContent || ''}</p>
              <p style="margin:0 0 5px;">${card.querySelectorAll('p')[1]?.textContent || ''}</p>
              <p style="margin:0;">${card.querySelectorAll('p')[2]?.textContent || ''}</p>
            </div>`,
        });
        windows.push(info);

        marker.addListener('click', () => {
          windows.forEach((w) => w.close());
          info.open(map, marker);
          map.panTo(marker.getPosition());
          map.setZoom(14);
          highlightCard(card.dataset.region);
        });

        on(card, 'click', () => {
          windows.forEach((w) => w.close());
          info.open(map, marker);
          map.panTo({ lat, lng });
          map.setZoom(14);
          highlightCard(card.dataset.region);
        });
      });

      // Bonus: pan to card in view (nice on scroll)
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              const lat = parseFloat(e.target.dataset.lat);
              const lng = parseFloat(e.target.dataset.lng);
              map.panTo({ lat, lng });
              highlightCard(e.target.dataset.region);
            });
          },
          { threshold: 0.5, rootMargin: '0px 0px -50% 0px' }
        );
        $$('.location-card').forEach((c) => obs.observe(c));
      }
    };

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }
      const apiKey =
        document.documentElement.dataset.gmapsKey || // <html data-gmaps-key="...">
        'YOUR_GOOGLE_MAPS_API_KEY'; // fallback — almashtiring

      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      s.async = true;
      s.defer = true;
      s.onload = initMap;
      document.head.appendChild(s);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            loadGoogleMaps();
            io.disconnect(); // load once
          });
        },
        { threshold: 0.15 }
      );
      io.observe(locationsSection);
    } else {
      // no IO support: load immediately
      loadGoogleMaps();
    }
  })();

  // ---------- Safety: disable animations for reduced motion ----------
  if (isReducedMotion) {
    document.body.classList.add('reduce-motion');
  }
})();


// === LOCATIONS v3 (PNG bilan) ===
(() => {
  const stage = document.querySelector('.locations-v3 .loc-stage');
  if (!stage) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pins = Array.from(stage.querySelectorAll('.pin'));
  const card = stage.querySelector('.loc-card');
  const cityEl = card.querySelector('.loc-card__city');
  const elAddr = card.querySelector('.js-address');
  const elPhone = card.querySelector('.js-phone');
  const elHours = card.querySelector('.js-hours');
  const openEl = document.getElementById('openBadge');
  const dirBtn = document.getElementById('dirBtn');

  // Ma'lumotlar (kerak bo‘lsa backenddan to‘ldiring)
  const DATA = {
    samarqand: {
      city: "Samarqand",
      address: "Yuqori Turkman, Oʻzbekiston ko‘chasi, 158-uy",
      phone: "+998 90 657 05 00",
      hours: "Dushanba–Juma: 9:00 – 18:00",
      lat: 39.6542, lng: 66.9597,
    },
    tashkent: {
      city: "Toshkent",
      address: "Mirzo Ulug'bek tumani, Sayram 7-proyezd, 50-uy",
      phone: "+998 90 123 45 67",
      hours: "Dushanba–Juma: 9:00 – 18:00",
      lat: 41.2995, lng: 69.2401,
    },
    fergana: {
      city: "Fargʻona",
      address: "Urta Shura MFY, Charogon ko'chasi, 21-uy",
      phone: "+998 90 937 06 04",
      hours: "Dushanba–Juma: 9:00 – 18:00",
      lat: 40.3880, lng: 71.7870,
    },
    xorazm: {
      city: "Xorazm",
      address: "Sanoatchilar ko'chasi, 12D-uy",
      phone: "+998 90 657 05 00",
      hours: "Dushanba–Juma: 9:00 – 18:00",
      lat: 41.3565, lng: 60.8567,
    },
  };

  // Hozir ochiqmi? (soddalashtirilgan)
  function isOpen(hoursStr){
    // agar format doimiy bo‘lsa, quydagicha qattiq belgilash mumkin
    const now = new Date();
    const h = now.getHours() + now.getMinutes()/60;
    const open = 9, close = 18; // haftalik bir xil deb faraz
    return h >= open && h <= close;
  }

  function updateOpenBadge(hoursStr){
    const open = isOpen(hoursStr);
    openEl.textContent = open ? 'Open' : 'Closed';
    openEl.classList.toggle('is-closed', !open);
  }

  function updateDirections(region){
    const d = DATA[region]; if (!d) return;
    dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;
  }

  function placeCard(pin) {
    const x = pin.style.getPropertyValue('--x') || '50%';
    const y = pin.style.getPropertyValue('--y') || '50%';
    card.style.setProperty('--cx', x);
    card.style.setProperty('--cy', y);
  }

  function fillCard(region) {
    const d = DATA[region]; if (!d) return;
    cityEl.textContent = d.city;
    elAddr.textContent = d.address;
    elPhone.textContent = d.phone;
    elHours.textContent = d.hours;
    updateOpenBadge(d.hours);
    updateDirections(region);
  }

  function activate(region) {
    const pin = pins.find(p => p.dataset.region === region);
    if (!pin) return;
    pins.forEach(p => {
      const active = p === pin;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    fillCard(region);
    placeCard(pin);
    card.classList.add('show');
  }

  // Boshlang‘ich holat
  const first = pins.find(p => p.classList.contains('is-active')) || pins[0];
  pins.forEach(p => p.setAttribute('aria-pressed', p === first ? 'true' : 'false'));
  activate(first.dataset.region);

  // Interaktivlik
  pins.forEach(p => {
    p.addEventListener('click', () => { activate(p.dataset.region); stopRotate(); });
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.click(); }
    });
  });

  // Copy / Share
  const $ = (s, r=document) => r.querySelector(s);
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  on($('#copyAddr'), 'click', async () => {
    try{ await navigator.clipboard?.writeText(elAddr.textContent.trim()); }catch{}
  });
  on($('#shareAddr'), 'click', async () => {
    const city = cityEl.textContent.trim();
    const txt = `${city}: ${elAddr.textContent.trim()} — ${elPhone.textContent.trim()}`;
    if (navigator.share){ try{ await navigator.share({ title: city, text: txt }); }catch{} }
  });

  // Auto-rotate (reduce-motion hurmati)
  let idx = pins.indexOf(first);
  let rotTimer = null;
  const next = () => { idx = (idx + 1) % pins.length; activate(pins[idx].dataset.region); };
  const startRotate = () => { if (!isReducedMotion) rotTimer = setInterval(next, 6000); };
  const stopRotate  = () => { if (rotTimer) { clearInterval(rotTimer); rotTimer = null; } };
  startRotate();
  stage.addEventListener('pointerenter', stopRotate);
  stage.addEventListener('pointerleave', startRotate);

  // Re-center on resize
  window.addEventListener('resize', () => {
    const active = pins.find(p => p.classList.contains('is-active'));
    active && placeCard(active);
  });
})();

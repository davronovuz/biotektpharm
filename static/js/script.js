/* =========================================================
   BIOTEKPHARM — Professional JS (clean, robust, UX-friendly)
   What you get:
   - Safe init + guards
   - Navbar blur + autohide on mobile, active-link sync
   - Smooth anchor scroll with dynamic offset
   - Lang switcher (.nav-item.lang -> .open) + [data-i18n] / .i18n-db
   - History/Partners reveal (IntersectionObserver)
   - Back-to-top, Preloader, Current year
   - Locations v3 (PNG stage) — pins + info card (auto-rotate, a11y)
   - Respects prefers-reduced-motion
========================================================= */

(() => {
  // ---------- Utilities ----------
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const raf = (fn) => requestAnimationFrame(fn);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // ---------- Preloader (optional) ----------
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
  const mobileMenuBtn = $('#mobile-menu') || $('.menu-toggle'); // fallback
  const navList = $('.nav-list');

  on(mobileMenuBtn, 'click', () => {
    mobileMenuBtn.classList.toggle('active');
    navList && navList.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Close drawer on nav-link click
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
      history.pushState(null, '', href); // update hash
    });
  });

  // Adjust scroll if page loads with hash
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

  // ---------- Language switcher (CSS’ga mos: .nav-item.lang.open) ----------
  const langBtn = $('#langBtn');
  const langMenu = $('#langMenu');
  const langItem = langBtn ? langBtn.closest('.nav-item.lang') : null;
  const currentLangEl = $('#currentLang');
  const DEFAULT_LANG = 'uz';

  const setLangChip = (lang) => { if (currentLangEl) currentLangEl.textContent = lang.toUpperCase(); };

  // Apply translations:
  // 1) data-i18n (flat dictionary: window.translations[lang][key])
  // 2) .i18n-db (per-element data-uz/data-ru/data-en fallbacks)
  const applyTranslations = (lang) => {
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
    $$('.i18n-db').forEach((el) => {
      const val = el.getAttribute(`data-${lang}`) || el.getAttribute('data-uz') || el.textContent;
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
  window.changeLanguage = changeLanguage; // optional global

  // UI events
  on(langBtn, 'click', (e) => {
    e.stopPropagation();
    if (!langItem) return;
    langItem.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', langItem.classList.contains('open') ? 'true' : 'false');
  });

  $$('#langMenu li').forEach((li) =>
    on(li, 'click', () => {
      const lang = li.getAttribute('data-lang') || DEFAULT_LANG;
      changeLanguage(lang);
      if (langItem) langItem.classList.remove('open');
      langBtn?.setAttribute('aria-expanded', 'false');
    })
  );

  // Close on outside click
  on(document, 'click', (e) => {
    if (!langItem) return;
    if (!langItem.contains(e.target)) {
      langItem.classList.remove('open');
      langBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  // Init saved language
  const savedLang = localStorage.getItem('preferredLang') || DEFAULT_LANG;
  setLangChip(savedLang);
  applyTranslations(savedLang);

  // ---------- HISTORY: reveal (in-view) ----------
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

  // ---------- PARTNERS: reveal rows ----------
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

  // ---------- Timeline (optional, auto-detect) ----------
  (() => {
    const timeline = $('#timeline');
    const progress = $('#timelineProgress');
    const rows = $$('.t-row', timeline || document);
    if (!timeline || !rows.length) return;

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

  // ---------- LOCATIONS v3 — PNG sahna (pins + info card) ----------
  (() => {
    const stage = document.querySelector('.locations-v3 .loc-stage');
    if (!stage) return;

    const pins = Array.from(stage.querySelectorAll('.pin'));
    const card = stage.querySelector('.loc-card');
    if (!pins.length || !card) return;

    const isRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // UI elements inside card
    const cityEl  = card.querySelector('.loc-card__city');
    const elAddr  = card.querySelector('.js-address');
    const elPhone = card.querySelector('.js-phone');
    const elHours = card.querySelector('.js-hours');
    const openEl  = card.querySelector('#openBadge');
    const dirBtn  = card.querySelector('#dirBtn');
    const copyBtn = card.querySelector('#copyAddr');
    const shareBtn= card.querySelector('#shareAddr');

    // Data (sample — backendga moslashtiring)
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

    const $on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

    const isOpenNow = () => {
      const d = new Date();
      const h = d.getHours() + d.getMinutes()/60;
      return h >= 9 && h <= 18;
    };

    const updateOpenBadge = () => {
      if (!openEl) return;
      const open = isOpenNow();
      openEl.textContent = open ? 'Open' : 'Closed';
      openEl.classList.toggle('is-closed', !open);
    };

    const updateDirections = (lat, lng) => {
      if (!dirBtn) return;
      dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    };

    const placeCard = (pin) => {
      if (!pin) return;
      card.style.setProperty('--cx', pin.style.getPropertyValue('--x') || '50%');
      card.style.setProperty('--cy', pin.style.getPropertyValue('--y') || '50%');
    };

    const fillCard = (key) => {
      const d = DATA[key];
      if (!d) return;
      cityEl && (cityEl.textContent = d.city);
      elAddr && (elAddr.textContent = d.address);
      elPhone && (elPhone.textContent = d.phone);
      elHours && (elHours.textContent = d.hours);
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

    const getInitialKey = () => {
      const url = new URL(location.href);
      const qp = url.searchParams.get('loc');
      if (qp && DATA[qp]) return qp;
      const hash = (location.hash || '').toLowerCase();
      const m = hash.match(/loc[-=](\w+)/);
      if (m && DATA[m[1]]) return m[1];
      return (pins[0] && pins[0].dataset.region) || 'samarqand';
    };

    // Init
    activate(getInitialKey(), false);

    // Interactions
    pins.forEach(p => {
      $on(p, 'click', () => { activate(p.dataset.region); stopRotate(); });
      $on(p, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.click(); }
      });
    });

    // Copy / Share
    $on(copyBtn, 'click', async () => {
      try {
        await navigator.clipboard?.writeText(`${cityEl?.textContent || ''}: ${elAddr?.textContent || ''}`);
        copyBtn.classList.add('is-ok'); setTimeout(()=>copyBtn.classList.remove('is-ok'), 800);
      } catch {}
    });

    $on(shareBtn, 'click', async () => {
      const title = (cityEl?.textContent || '').trim();
      const text  = `${title}: ${(elAddr?.textContent || '').trim()} — ${(elPhone?.textContent || '').trim()}`;
      const url = new URL(location.href);
      url.searchParams.set('loc', activeKey || 'samarqand');
      if (navigator.share) {
        try { await navigator.share({ title, text, url: url.toString() }); } catch {}
      } else {
        try { await navigator.clipboard?.writeText(url.toString()); } catch {}
      }
    });

    // Auto-rotate (skip if reduced motion)
    let rotTimer = null;
    const next = () => {
      const i = pins.findIndex(p => p.dataset.region === activeKey);
      const n = pins[(i + 1) % pins.length];
      activate(n.dataset.region);
    };
    const startRotate = () => { if (!isRM && !rotTimer) rotTimer = setInterval(next, 6000); };
    const stopRotate  = () => { if (rotTimer) { clearInterval(rotTimer); rotTimer = null; } };

    startRotate();
    $on(stage, 'pointerenter', stopRotate);
    $on(stage, 'pointerleave', startRotate);

    // Keep card anchored on resize
    const onResize = () => {
      const pin = pins.find(p => p.dataset.region === activeKey) || pins[0];
      placeCard(pin);
    };
    window.addEventListener('resize', onResize);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopRotate();
      else startRotate();
    });
  })();

  // ---------- Reduced motion flag ----------
  if (isReducedMotion) document.body.classList.add('reduce-motion');
})();

/* =============================================================
   PARTNERS — Flip/Reveal (mouse + touch + a11y)
   Single, clean module (duplicate removed)
============================================================= */
(function PartnersFlipModule(){
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const cards = qsa('.partner-card');
  if (!cards.length) return;

  const isMouse = (e) => e.pointerType === 'mouse' || e.type === 'mouseenter' || e.type === 'mouseleave';
  const closeAll = (except=null) => {
    cards.forEach(c => { if (c !== except) { c.classList.remove('is-open','is-armed','is-hover'); c.setAttribute('aria-expanded','false'); } });
  };

  cards.forEach((card) => {
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-expanded','false');

    const href   = card.getAttribute('href');
    const target = card.getAttribute('target');

    const open = (byUser=true) => {
      card.classList.add('is-open');
      if (byUser) card.classList.add('is-armed');
      card.setAttribute('aria-expanded','true');
    };
    const close = () => {
      card.classList.remove('is-open','is-armed');
      card.setAttribute('aria-expanded','false');
    };
    const follow = () => {
      if (!href || href === '#') return;
      if (target === '_blank') window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    };

    // Hover (desktop)
    card.addEventListener('pointerenter', (e) => { if (isMouse(e)) card.classList.add('is-hover'); });
    card.addEventListener('pointerleave', (e) => { if (isMouse(e)) { card.classList.remove('is-hover'); close(); } });

    // Touch: first tap reveals, second tap follows
    card.addEventListener('pointerdown', (e) => {
      if (isMouse(e)) return; // desktop handled by hover/click
      if (!card.classList.contains('is-armed')) {
        e.preventDefault(); // stop immediate nav
        closeAll(card);
        open(true);
      }
    }, { passive:false });

    card.addEventListener('click', (e) => {
      if (card.classList.contains('is-armed')) {
        e.preventDefault();
        follow();
      }
    });

    // Keyboard
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (card.classList.contains('is-open')) follow();
        else { closeAll(card); open(true); }
      } else if (e.key === 'Escape') close();
    });

    // Blur closes
    card.addEventListener('blur', () => { setTimeout(()=>{ if (!card.matches(':focus')) close(); }, 0); });
  });

  // Click outside closes all
  document.addEventListener('click', (e) => {
    const hit = e.target.closest('.partner-card');
    if (!hit) closeAll();
  });
})();



<script>
  (function () {
    const $ = (s, r=document) => r.querySelector(s);
    const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

    const pins = $$('.pin');
    const card = $('.loc-card');
    const cityEl = $('#locCity');
    const addrEl = $('#locAddress');
    const phoneEl = $('#locPhone');
    const hoursEl = $('#locHours');
    const badge = $('#openBadge');
    const btnCopy = $('#copyAddr');
    const btnShare = $('#shareAddr');
    const btnDir = $('#dirBtn');

    // Initial: build directions link from address
    function setDirectionsLink(address) {
      const q = encodeURIComponent(address);
      btnDir.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    }

    function setPhoneHref(phoneText){
      // Normalize to digits for tel:
      const tel = phoneText.replace(/[^\d+]/g,'');
      phoneEl.href = `tel:${tel}`;
    }

    function isOpenNow(hoursText){
      // Juda oddiy tekshiruv: 9:00–18:00 oralig‘ida ochiq (brauzer lokal vaqti bo‘yicha)
      const match = hoursText.match(/(\d{1,2}):?(\d{2})?\s*[\u2013\-]\s*(\d{1,2}):?(\d{2})?/);
      if(!match) return true; // aniqlanmasa — Open
      const now = new Date();
      const startH = parseInt(match[1],10);
      const startM = parseInt(match[2] || '0',10);
      const endH   = parseInt(match[3],10);
      const endM   = parseInt(match[4] || '0',10);

      const start = new Date(now); start.setHours(startH, startM, 0, 0);
      const end   = new Date(now); end.setHours(endH,   endM,   0, 0);
      return now >= start && now <= end;
    }

    function updateBadge(open){
      badge.textContent = open ? 'Open' : 'Closed';
      badge.classList.toggle('is-closed', !open);
    }

    function activatePin(pin){
      pins.forEach(p => { p.classList.remove('is-active'); p.setAttribute('aria-pressed','false'); });
      pin.classList.add('is-active');
      pin.setAttribute('aria-pressed','true');

      const city = pin.querySelector('.pin-label')?.textContent?.trim() || pin.dataset.region;
      const address = pin.dataset.address || addrEl.textContent.trim();
      const phone = pin.dataset.phone || phoneEl.textContent.trim();
      const hours = pin.dataset.hours || hoursEl.textContent.trim();

      cityEl.textContent = city;
      addrEl.textContent = address;
      phoneEl.textContent = phone;
      hoursEl.textContent = hours;

      setPhoneHref(phone);
      setDirectionsLink(address);
      updateBadge(isOpenNow(hours));

      // kartani pin markaziga yaqinlashtirish (CSS custom props)
      const styles = getComputedStyle(pin);
      const x = styles.getPropertyValue('--x').trim();
      const y = styles.getPropertyValue('--y').trim();
      card.style.setProperty('--cx', x || '50%');
      card.style.setProperty('--cy', y || '50%');
      card.classList.add('show');
    }

    pins.forEach(pin => pin.addEventListener('click', () => activatePin(pin)));
    pins.forEach(pin => pin.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activatePin(pin); }
    }));

    // Copy address
    btnCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(addrEl.textContent.trim());
        btnCopy.textContent = 'Copied!';
        setTimeout(() => btnCopy.textContent = 'Copy', 1200);
      } catch {
        alert('Clipboard ruxsat berilmadi.');
      }
    });

    // Share API (fallback URL copy)
    btnShare.addEventListener('click', async () => {
      const title = `Manzil — ${cityEl.textContent}`;
      const text = `${cityEl.textContent}: ${addrEl.textContent}`;
      const url = btnDir.href;
      if (navigator.share) {
        try { await navigator.share({ title, text, url }); } catch {}
      } else {
        try {
          await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
          btnShare.textContent = 'Link Copied!';
          setTimeout(() => btnShare.textContent = 'Share', 1200);
        } catch {
          alert(url);
        }
      }
    });

    // Init (faol pin)
    const active = $('.pin.is-active') || pins[0];
    if(active) activatePin(active);
  })();
</script>

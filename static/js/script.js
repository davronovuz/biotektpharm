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




(() => {
  const svg   = document.querySelector('.loc-canvas');
  const stage = document.querySelector('.loc-stage');
  const card  = document.querySelector('.loc-card');
  if (!svg || !card) return;

  const pins  = Array.from(svg.querySelectorAll('.pin'));
  if (!pins.length) return;

  const cityEl  = document.getElementById('locCity');
  const addrEl  = document.getElementById('locAddress');
  const phoneEl = document.getElementById('locPhone');
  const hoursEl = document.getElementById('locHours');
  const openEl  = document.getElementById('openBadge');
  const dirBtn  = document.getElementById('dirBtn');
  const copyBtn = document.getElementById('copyAddr');
  const shareBtn= document.getElementById('shareAddr');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isOpenNow(){
    const d=new Date(); const h=d.getHours()+d.getMinutes()/60; return h>=9 && h<=18;
  }
  function updateOpenBadge(){
    const open = isOpenNow();
    openEl.textContent = open ? 'Open' : 'Closed';
    openEl.classList.toggle('is-closed', !open);
  }
  function updateDirections(lat,lng){
    if (dirBtn) dirBtn.href=`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  // Pin markazidan karta joyini hisoblash
  function placeCardByPin(pinG){
    const pt = svg.createSVGPoint(); pt.x=0; pt.y=0;
    const scr = pt.matrixTransform(pinG.getScreenCTM());       // ekran koordinatasi
    const r   = stage.getBoundingClientRect();
    const cx  = ((scr.x - r.left)/r.width)*100;
    const cy  = ((scr.y - r.top)/r.height)*100;
    card.style.setProperty('--cx', cx + '%');
    card.style.setProperty('--cy', cy + '%');
  }

  let activePin = null;
  function activate(pin, pushState=true){
    if (!pin) return;
    activePin = pin;
    pins.forEach(p=>p.classList.toggle('is-active', p===pin));

    // Kartadagi matnlar
    const city  = pin.dataset.city   || '';
    const addr  = pin.dataset.address|| '';
    const phone = pin.dataset.phone  || '';
    const hours = pin.dataset.hours  || '';
    const lat   = pin.dataset.lat    || '';
    const lng   = pin.dataset.lng    || '';

    cityEl.textContent = city;
    addrEl.textContent = addr;
    phoneEl.textContent= phone;
    phoneEl.href = 'tel:' + phone.replace(/\s+/g,'');
    hoursEl.textContent = hours;
    updateOpenBadge();
    updateDirections(lat,lng);

    placeCardByPin(pin);

    if (pushState){
      const url=new URL(location.href); url.searchParams.set('loc', (city||'').toLowerCase());
      history.replaceState(null,'',url);
    }
  }

  // Interaktivlik
  pins.forEach(pin=>{
    pin.addEventListener('click', ()=>{ activate(pin); stopRotate(); });
    pin.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pin.click(); }});
  });

  // Boshlang‘ich aktiv pin
  activate(svg.querySelector('.pin.is-active') || pins[0], false);

  // O‘lcham o‘zgarsa – kartani qayta joyla
  window.addEventListener('resize', ()=>{ if(activePin) placeCardByPin(activePin); });

  // Copy / Share
  copyBtn?.addEventListener('click', async ()=>{
    try{ await navigator.clipboard?.writeText(`${cityEl.textContent}: ${addrEl.textContent}`); }catch(e){}
  });
  shareBtn?.addEventListener('click', async ()=>{
    const url = new URL(location.href);
    if (navigator.share){
      try{ await navigator.share({title: cityEl.textContent, text: `${addrEl.textContent} — ${phoneEl.textContent}`, url: url.toString()}); }catch(e){}
    } else {
      try{ await navigator.clipboard?.writeText(url.toString()); }catch(e){}
    }
  });

  // Auto-rotate (hoverda pauza)
  let timer=null;
  const next=()=>{
    const i=pins.indexOf(activePin); const n=pins[(i+1)%pins.length]; activate(n,false);
  };
  function startRotate(){ if(!prefersReduced && !timer) timer=setInterval(next,6000); }
  function stopRotate(){ if(timer){ clearInterval(timer); timer=null; } }
  startRotate();
  stage.addEventListener('pointerenter', stopRotate);
  stage.addEventListener('pointerleave', startRotate);

  // (ixtiyoriy) Shift+click – koordinata helper (console’da chiqadi)
  svg.addEventListener('click', (e)=>{
    if(!e.shiftKey) return;
    const pt = svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY;
    const v = pt.matrixTransform(svg.getScreenCTM().inverse());
    console.log('SVG coords:', Math.round(v.x), Math.round(v.y));
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




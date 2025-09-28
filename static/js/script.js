/* =========================================================
   BIOTEKPHARM — Single-file, modular, conflict-free JS
   Namespaces:
   - BIOTEK.i18n       (til: UZ/RU/EN, data-i18n + .i18n-db)
   - BIOTEK.ui         (navbar, smooth scroll, back-to-top, preloader, year)
   - BIOTEK.reveal     (history/partners ko‘rinishi)
   - BIOTEK.locations  (SVG pins + info-card)
   - BIOTEK.partners   (flip/reveal cards)
========================================================= */
;(() => {
  // Root namespace
  const BIOTEK = (window.BIOTEK = window.BIOTEK || {});

  // -------------- Utils (shared) --------------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const raf = (fn) => requestAnimationFrame(fn);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      raf(() => {
        fn(...args);
        ticking = false;
      });
    };
  };

  // ======================================================
  // i18n — single source of truth
  // ======================================================
  BIOTEK.i18n = (() => {
    // 1) Dictionaries
    const translations = {
      uz: {
        home: "Bosh sahifa", about: "Kompaniya", history: "Tarix", services: "Xizmatlar",
        locations_kicker: "Butun Oʻzbekiston boʻylab ofis va omborlarimiz",
        locations_title: "Bizning joylashuvlar",
        partners: "Hamkorlar", locations: "Manzil", contact: "Aloqa",
        about_title: "Kompaniya haqida", history_title: "Bizning tarix", products: "Mahsulotlar",
        contact_title: "Biz bilan bog'laning",
        contact_subtitle: "Har qanday savol yoki taklif uchun biz bilan bog'laning",
        contact_side_title: "Aloqa",
        footer_about: "O'zbekiston farmatsevtika bozorining yetakchi distribyutor kompaniyasi",
        footer_links: "Tez havolalar", footer_contact: "Aloqa",
        privacy_policy: "Maxfiylik siyosati", terms: "Foydalanish shartlari",
        address_text: "Samarqand, Yuqori Turkman ko'chasi, 158-uy",
        form_name: "Ism", form_email: "E-mail", form_phone: "Telefon (ixtiyoriy)",
        form_message: "Xabar", form_submit: "Yuborish",
        err_name: "Ism kiriting", err_email: "To‘g‘ri e-mail kiriting", err_msg: "Xabarni yozing",
        loc_copy: "Nusxa olish", loc_share: "Ulashish", loc_route: "Yo‘lni ko‘rsat",
        status_open: "Ochiq", status_closed: "Yopiq",
        __title: "BiotekPharm - Farmatsevtika Yetakchisi",
        __desc:  "BiotekPharm - O'zbekistonda farmatsevtika sohasining yetakchi distribyutor kompaniyasi"
      },
      ru: {
        home: "Главная", about: "Компания", history: "История", services: "Услуги",
        locations_kicker: "Наши офисы и склады по всему Узбекистану",
        locations_title: "Наши локации",
        partners: "Партнёры", locations: "Адреса", contact: "Контакты",
        about_title: "О компании", history_title: "Наша история", products: "Продукты",
        contact_title: "Свяжитесь с нами",
        contact_subtitle: "Свяжитесь с нами по любым вопросам или предложениям",
        contact_side_title: "Контакты",
        footer_about: "Ведущая дистрибьюторская компания на фармрынке Узбекистана",
        footer_links: "Быстрые ссылки", footer_contact: "Контакты",
        privacy_policy: "Политика конфиденциальности", terms: "Условия использования",
        address_text: "Самарканд, ул. Yuqori Turkman, дом 158",
        form_name: "Имя", form_email: "E-mail", form_phone: "Телефон (необязательно)",
        form_message: "Сообщение", form_submit: "Отправить",
        err_name: "Введите имя", err_email: "Введите корректный E-mail", err_msg: "Введите сообщение",
        loc_copy: "Копировать", loc_share: "Поделиться", loc_route: "Показать маршрут",
        status_open: "Открыто", status_closed: "Закрыто",
        __title: "BiotekPharm — Лидер фармацевтической дистрибуции",
        __desc:  "BiotekPharm — ведущий дистрибьютор фармацевтического рынка Узбекистана"
      },
      en: {
        home: "Home", about: "Company", history: "History", services: "Services",
        locations_kicker: "Our offices and warehouses across Uzbekistan",
        locations_title: "Our Locations",
        partners: "Partners", locations: "Locations", contact: "Contact",
        about_title: "About the Company", history_title: "Our History", products: "Products",
        contact_title: "Get in Touch",
        contact_subtitle: "Contact us for any questions or proposals",
        contact_side_title: "Contact",
        footer_about: "Leading pharmaceutical distribution company in Uzbekistan",
        footer_links: "Quick links", footer_contact: "Contact",
        privacy_policy: "Privacy Policy", terms: "Terms of Use",
        address_text: "Samarkand, Yuqori Turkman street, 158",
        form_name: "Name", form_email: "E-mail", form_phone: "Phone (optional)",
        form_message: "Message", form_submit: "Send",
        err_name: "Please enter your name", err_email: "Enter a valid e-mail", err_msg: "Type your message",
        loc_copy: "Copy", loc_share: "Share", loc_route: "Get directions",
        status_open: "Open", status_closed: "Closed",
        __title: "BiotekPharm — Pharmaceutical Distribution Leader",
        __desc:  "BiotekPharm is a leading pharmaceutical distributor in Uzbekistan"
      }
    };

    const FLAG_BY_LANG = {
      uz: "https://flagcdn.com/uz.svg",
      ru: "https://flagcdn.com/ru.svg",
      en: "https://flagcdn.com/gb.svg"
    };

    // 2) Apply
    function apply(lang) {
      const dict = translations[lang];
      if (!dict) return;

      // data-i18n
      $$("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        const val = dict[key];
        if (val == null) return;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.placeholder = val;
        else el.innerHTML = val;
      });

      // .i18n-db (modeldan kelgan dinamik textlar)
      $$(".i18n-db").forEach((el) => {
        const val =
          el.getAttribute(`data-${lang}`) ||
          el.getAttribute("data-uz") ||
          el.textContent;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.placeholder = val;
        else el.textContent = val;
      });

      // title + meta description
      if (dict.__title) document.title = dict.__title;
      if (dict.__desc) {
        const meta = $('meta[name="description"]');
        if (meta) meta.setAttribute("content", dict.__desc);
      }

      // form placeholders by id (zaxira)
      const setPh = (id, key) => {
        const el = $("#" + id);
        if (el && dict[key] != null) el.placeholder = dict[key];
      };
      setPh("name", "form_name");
      setPh("email", "form_email");
      setPh("phone", "form_phone");
      setPh("message", "form_message");

      // submit button (zaxira)
      const submitBtn = $("button[type='submit'][data-i18n='form_submit']");
      if (submitBtn && dict.form_submit) submitBtn.textContent = dict.form_submit;

      // locations buttons/badge
      const copyBtn  = $("#copyAddr");
      const shareBtn = $("#shareAddr");
      const dirBtn   = $("#dirBtn");
      const openBadge= $("#openBadge");
      if (copyBtn  && dict.loc_copy)  copyBtn.textContent  = dict.loc_copy;
      if (shareBtn && dict.loc_share) shareBtn.textContent = dict.loc_share;
      if (dirBtn   && dict.loc_route) dirBtn.textContent   = dict.loc_route;
      if (openBadge){
        const isClosed = openBadge.classList.contains("is-closed");
        openBadge.textContent = isClosed ? (dict.status_closed || "Closed")
                                         : (dict.status_open   || "Open");
      }

      // <html lang="">
      document.documentElement.setAttribute("lang", lang);

      // Flag + chip
      const currentLang = $("#currentLang");
      if (currentLang) currentLang.textContent = lang.toUpperCase();
      const btn = $("#langBtn");
      if (btn){
        const img = btn.querySelector("img.flag");
        if (img && FLAG_BY_LANG[lang]) img.src = FLAG_BY_LANG[lang];
      }
    }

    function set(lang) {
      const supported = ["uz", "ru", "en"];
      if (!supported.includes(lang)) lang = "uz";
      localStorage.setItem("preferredLang", lang);
      apply(lang);
    }

    function init() {
      const langBtn = $("#langBtn");
      const langMenu = $("#langMenu");
      const saved = localStorage.getItem("preferredLang") || "uz";
      apply(saved);

      // toggle menu
      on(langBtn, "click", (e) => {
        e.stopPropagation();
        const wrap = langBtn.closest(".nav-item.lang");
        if (!wrap) return;
        const open = !wrap.classList.contains("open");
        wrap.classList.toggle("open", open);
        langBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });

      // choose language
      $$("#langMenu li").forEach((li) =>
        on(li, "click", () => {
          const lang = li.getAttribute("data-lang") || "uz";
          set(lang);
          const wrap = langBtn && langBtn.closest(".nav-item.lang");
          if (wrap) wrap.classList.remove("open");
          if (langBtn) langBtn.setAttribute("aria-expanded", "false");
        })
      );

      // click outside closes
      on(document, "click", (e) => {
        const wrap = langBtn && langBtn.closest(".nav-item.lang");
        if (!wrap) return;
        if (!wrap.contains(e.target)) {
          wrap.classList.remove("open");
          langBtn?.setAttribute("aria-expanded", "false");
        }
      });

      // public API (agar kerak bo‘lsa)
      window.changeLanguage = set;
    }

    return { init, set, apply };
  })();

  // ======================================================
  // UI — navbar, scroll, preloader, year, back-to-top
  // ======================================================
  BIOTEK.ui = (() => {
    const SCROLL_TRIG = 48;

    function handleNav() {
      const navbar = $(".navbar");
      const backToTop = $(".back-to-top");
      if (!navbar) return;

      const y = window.scrollY;
      navbar.classList.toggle("scrolled", y > SCROLL_TRIG);

      // mobile autohide
      if (window.innerWidth < 992) {
        const goingUp = y < (handleNav._lastY ?? 0);
        navbar.style.transform = goingUp || y < 10 ? "translateY(0)" : "translateY(-110%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }

      if (backToTop) backToTop.classList.toggle("visible", y > 600);
      handleNav._lastY = y;
    }

    function initNav() {
      const navbar = $(".navbar");
      const backToTop = $(".back-to-top");
      const handleNavThrottled = rafThrottle(handleNav);
      handleNav();
      on(window, "scroll", handleNavThrottled, { passive: true });
      on(window, "resize", handleNavThrottled);

      // back to top
      on(backToTop, "click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
      });

      // mobile drawer
      const mobileMenuBtn = $("#mobile-menu") || $(".menu-toggle");
      const navList = $(".nav-list");

      on(mobileMenuBtn, "click", () => {
        mobileMenuBtn.classList.toggle("active");
        navList && navList.classList.toggle("active");
        document.body.classList.toggle("nav-open");
      });

      $$(".nav-link").forEach((a) =>
        on(a, "click", () => {
          mobileMenuBtn && mobileMenuBtn.classList.remove("active");
          navList && navList.classList.remove("active");
          document.body.classList.remove("nav-open");
        })
      );

      on(document, "keydown", (e) => {
        if (e.key === "Escape") {
          mobileMenuBtn && mobileMenuBtn.classList.remove("active");
          navList && navList.classList.remove("active");
          document.body.classList.remove("nav-open");
        }
      });
    }

    function initSmoothAnchors() {
      const navbar = $(".navbar");
      const offset = () => (navbar ? navbar.offsetHeight + 8 : 64);

      $$("a[href^='#']").forEach((a) => {
        on(a, "click", (e) => {
          const href = a.getAttribute("href");
          if (!href || href === "#") return;
          const target = $(href);
          if (!target) return;
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset();
          window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
          history.pushState(null, "", href);
        });
      });

      // hash load offset fix
      on(window, "load", () => {
        if (location.hash) {
          const target = $(location.hash);
          if (target) {
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset();
            window.scrollTo({ top, behavior: "auto" });
          }
        }
      });
    }

    function initActiveLink() {
      const navLinks = $$(".nav-link");
      const sections = $$("section[id]");
      if (!("IntersectionObserver" in window) || !sections.length) return;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("id");
            navLinks.forEach((l) =>
              l.classList.toggle("active", l.getAttribute("href") === `#${id}`)
            );
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
      );
      sections.forEach((s) => io.observe(s));
    }

    function initPreloader() {
      const preloader = $(".preloader");
      if (!preloader) return;
      on(window, "load", () => {
        preloader.classList.add("fade-out");
        setTimeout(() => (preloader.style.display = "none"), 500);
      });
    }

    function setYear() {
      const year = $("#year");
      if (year) year.textContent = new Date().getFullYear();
      if (prefersReduced) document.body.classList.add("reduce-motion");
    }

    function init() {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("js-ready");
      });
      initPreloader();
      initNav();
      initSmoothAnchors();
      initActiveLink();
      setYear();
    }

    return { init };
  })();

  // ======================================================
  // Reveal (history + partners rows)
  // ======================================================
  BIOTEK.reveal = (() => {
    function inViewOnce(selector, options) {
      const items = $$(selector);
      if (!items.length || !("IntersectionObserver" in window)) return;
      const io = new IntersectionObserver(
        (ents) => {
          ents.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          });
        },
        options
      );
      items.forEach((r, i) => {
        r.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
        io.observe(r);
      });
    }

    function init() {
      inViewOnce(".h-item", { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });
      inViewOnce(".partners-row", { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
    }

    return { init };
  })();

const stage   = document.getElementById('stage');
const card    = document.getElementById('card');
const elTitle = document.getElementById('cardTitle');
const elAddr  = document.getElementById('cardAddr');
const elPhone = document.getElementById('cardPhone');
const elTime  = document.getElementById('cardTime');
const pins    = Array.from(stage.querySelectorAll('.pin'));

const routeSVG  = document.getElementById('route');
const routeDash = document.getElementById('routeDash');
const routeShad = document.getElementById('routeShadow');

/* =========================
   ROUTE CONFIG – to'liq nazorat
   ========================= */
const ROUTE = {
  // Umumiy siljitish (foiz birligi): x +/− (o'ng/chap), y +/− (past/yuqori)
  shift: { x: -20, y: 60 },

  // Pin yopish nuqtasi (0..1): 1 – pin pastki qismi, 0.9 – sal yuqori
  attach: 0.92,

  // Nuqtalar (istalgancha). Har bir element:
  //  - {ref:"pin", index:0..N, dx:0, dy:0, attach:0..1}  yoki
  //  - {x: foiz, y: foiz}  to'g'ridan-to'g'ri koordinata
  // Pastdagini xohlagancha tahrir qilasiz:
  points: [
    { ref: "pin", index: 0 },                 // Xorazm
    { ref: "pin", index: 1, dy: -2 },         // Samarqand (biroz yuqoriroq)
    { x: 70, y: 52 },                         // oraliq nuqta (manual)
    { ref: "pin", index: 2, dx: 2, dy: -4 },  // Toshkent (biroz o'ngga, yuqoriga)
    { ref: "pin", index: 3 }                  // Farg'ona
  ],

  // Segment sozlamalari (har bo'lak orasidagi egri kuchi va ko'tarish)
  curvature: { default: 0.28, perSeg: { 0: 0.30, 1: 0.28, 2: 0.27, 3: 0.26 } },
  lift:      { default: 7,    perSeg: { 0: 8,    1: 7,    2: 7,    3: 6 } }
};
/* ====== END CONFIG ====== */

// ---- Util: CSS variable o'zgartirish (xohlasangiz JSdan ham boshqarasiz) ----
function setCSSVar(name, value){ document.documentElement.style.setProperty(name, value); }

// ---- Card ----
function updateCard(pin){
  elTitle.textContent = pin.dataset.name || '';
  elAddr.textContent  = pin.dataset.addr || '';
  const raw = (pin.dataset.phone || '').trim();
  elPhone.textContent = raw;
  elPhone.href = 'tel:' + raw.replace(/[^0-9+]/g,'');
  elTime.textContent  = pin.dataset.time || '';
}
function placeCard(pin){
  const style = getComputedStyle(card);
  if(style.position === 'static') return; // mobile
  const s = stage.getBoundingClientRect();
  const p = pin.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  let left = p.left - s.left - c.width/2 + p.width/2;
  let top  = p.top  - s.top  - c.height - 14;
  const pad = 10;
  left = Math.max(pad, Math.min(left, s.width - c.width - pad));
  top  = Math.max(pad, Math.min(top,  s.height - c.height - pad));
  card.style.left = left + 'px';
  card.style.top  = top  + 'px';
}
function setActive(pin){
  pins.forEach(p=>p.removeAttribute('data-active'));
  pin.setAttribute('data-active','');
  updateCard(pin); placeCard(pin);
  drawRoute(); // har safar qayta chizamiz
}

// ---- Route helpers ----
function getPinCenterPct(pin, attach=ROUTE.attach){
  const s = stage.getBoundingClientRect();
  const r = pin.getBoundingClientRect();
  const x = ((r.left + r.width/2) - s.left) / s.width  * 100;
  const y = ((r.top  + r.height*attach) - s.top) / s.height * 100;
  return { x, y };
}
function parsePoint(def){
  if('x' in def && 'y' in def){
    return { x: def.x + ROUTE.shift.x, y: def.y + ROUTE.shift.y };
  }
  if(def.ref === 'pin' && typeof def.index === 'number' && pins[def.index]){
    const base = getPinCenterPct(pins[def.index], def.attach ?? ROUTE.attach);
    return {
      x: base.x + (def.dx || 0) + ROUTE.shift.x,
      y: base.y + (def.dy || 0) + ROUTE.shift.y
    };
  }
  return null;
}
function cubicSeg(p0, p1, k, lift){
  const dx = p1.x - p0.x, dy = p1.y - p0.y;
  const c1 = { x: p0.x + dx * k, y: p0.y + dy * k - lift };
  const c2 = { x: p1.x - dx * k, y: p1.y - dy * k - lift };
  return `C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}
function drawRoute(){
  if(!routeSVG) return;
  // pointlar ro'yxatini yechib olamiz
  const pts = ROUTE.points.map(parsePoint).filter(Boolean);
  if(pts.length < 2) return;

  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} `;
  for(let i=0;i<pts.length-1;i++){
    const k = ROUTE.curvature.perSeg[i] ?? ROUTE.curvature.default;
    const l = ROUTE.lift.perSeg[i]      ?? ROUTE.lift.default;
    d += cubicSeg(pts[i], pts[i+1], k, l) + ' ';
  }
  routeDash.setAttribute('d', d.trim());
  routeShad.setAttribute('d', d.trim());
}

// ---- Init ----
let active = pins[0];
if(active){ setActive(active); }

pins.forEach(pin=>{
  ['mouseenter','focus','click','touchstart'].forEach(evt=>{
    pin.addEventListener(evt, ()=>{ active = pin; setActive(pin); });
  });
});
window.addEventListener('load',  ()=>{ drawRoute(); if(active) placeCard(active); });
window.addEventListener('resize',()=>{ drawRoute(); if(active) placeCard(active); });



/* BIOTEK.locations – faqat .map-sec ichida ishlaydi */
(function(){
  const BIOTEK = (window.BIOTEK = window.BIOTEK || {});
  BIOTEK.locations = (function(){
    let stage, card, elTitle, elAddr, elPhone, elTime, pins, routeDash, routeShad;

    /* Yo‘nalish konfiguratsiyasi (istalgan payt o‘zgartirasiz) */
    const ROUTE = {
      shift:  { x: -20, y: 60 },    // umumiy siljitish (%)
      attach: 0.92,                 // pinning pastki nuqtasi (0..1)
      points: [
        { ref:"pin", index:0 },                 // Xorazm
        { ref:"pin", index:1, dy:-2 },          // Samarqand
        { x: 70, y: 52 },                       // oraliq nuqta
        { ref:"pin", index:2, dx:2, dy:-4 },    // Toshkent
        { ref:"pin", index:3 }                  // Farg'ona
      ],
      curvature:{ default:0.28, perSeg:{0:0.30,1:0.28,2:0.27,3:0.26} },
      lift:     { default:7,    perSeg:{0:8,   1:7,   2:7,   3:6} }
    };

    function q(s, r=document){ return r.querySelector(s); }
    function qa(s, r=document){ return Array.from(r.querySelectorAll(s)); }

    function updateCard(pin){
      elTitle.textContent = pin.dataset.name || '';
      elAddr.textContent  = pin.dataset.addr || '';
      const raw = (pin.dataset.phone || '').trim();
      elPhone.textContent = raw;
      elPhone.href = 'tel:' + raw.replace(/[^0-9+]/g,'');
      elTime.textContent  = pin.dataset.time || '';
    }
    function placeCard(pin){
      const style = getComputedStyle(card);
      if(style.position === 'static') return; // mobile
      const s = stage.getBoundingClientRect();
      const p = pin.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      let left = p.left - s.left - c.width/2 + p.width/2;
      let top  = p.top  - s.top  - c.height - 14;
      const pad = 10;
      left = Math.max(pad, Math.min(left, s.width - c.width - pad));
      top  = Math.max(pad, Math.min(top,  s.height - c.height - pad));
      card.style.left = left + 'px';
      card.style.top  = top  + 'px';
    }
    function setActive(pin){
      pins.forEach(p=>p.removeAttribute('data-active'));
      pin.setAttribute('data-active','');
      updateCard(pin); placeCard(pin);
      drawRoute();
    }

    // --- route helpers ---
    function getPinCenterPct(pin, attach=ROUTE.attach){
      const s = stage.getBoundingClientRect();
      const r = pin.getBoundingClientRect();
      const x = ((r.left + r.width/2) - s.left) / s.width  * 100;
      const y = ((r.top  + r.height*attach) - s.top) / s.height * 100;
      return { x, y };
    }
    function parsePoint(def){
      if('x' in def && 'y' in def){
        return { x: def.x + ROUTE.shift.x, y: def.y + ROUTE.shift.y };
      }
      if(def.ref === 'pin' && typeof def.index === 'number' && pins[def.index]){
        const base = getPinCenterPct(pins[def.index], def.attach ?? ROUTE.attach);
        return {
          x: base.x + (def.dx || 0) + ROUTE.shift.x,
          y: base.y + (def.dy || 0) + ROUTE.shift.y
        };
      }
      return null;
    }
    function cubicSeg(p0, p1, k, lift){
      const dx = p1.x - p0.x, dy = p1.y - p0.y;
      const c1 = { x: p0.x + dx * k, y: p0.y + dy * k - lift };
      const c2 = { x: p1.x - dx * k, y: p1.y - dy * k - lift };
      return `C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
    }
    function drawRoute(){
      const pts = ROUTE.points.map(parsePoint).filter(Boolean);
      if(pts.length < 2) return;
      let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} `;
      for(let i=0;i<pts.length-1;i++){
        const k = ROUTE.curvature.perSeg[i] ?? ROUTE.curvature.default;
        const l = ROUTE.lift.perSeg[i]      ?? ROUTE.lift.default;
        d += cubicSeg(pts[i], pts[i+1], k, l) + ' ';
      }
      routeDash.setAttribute('d', d.trim());
      routeShad.setAttribute('d', d.trim());
    }

    function init(){
      const wrap = q('.map-sec');
      if(!wrap) return; // bu bo‘lim yo‘q bo‘lsa o'tkazib yuboramiz

      stage    = q('#stage', wrap);
      card     = q('#card',  wrap);
      elTitle  = q('#cardTitle', wrap);
      elAddr   = q('#cardAddr',  wrap);
      elPhone  = q('#cardPhone', wrap);
      elTime   = q('#cardTime',  wrap);
      pins     = qa('.pin', stage);

      const routeSVG  = q('#route', wrap);
      routeDash = q('#routeDash', routeSVG);
      routeShad = q('#routeShadow', routeSVG);

      // default active
      if(pins.length){ setActive(pins[0]); }

      // events
      pins.forEach(pin=>{
        ['mouseenter','focus','click','touchstart'].forEach(evt=>{
          pin.addEventListener(evt, ()=> setActive(pin), {passive:true});
        });
      });

      window.addEventListener('load',  ()=>{ drawRoute(); if(pins[0]) placeCard(pins[0]); });
      window.addEventListener('resize',()=>{ drawRoute(); const a = wrap.querySelector('.pin[data-active]')||pins[0]; if(a) placeCard(a); });
    }

    return { init };
  })();

  // Avtomatik ishga tushirish (bor bo‘lsa)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => BIOTEK.locations.init());
  } else {
    BIOTEK.locations.init();
  }
})();













  // ======================================================
  // Partners (flip/reveal cards)
  // ======================================================
  BIOTEK.partners = (() => {
    function init() {
      const cards = $$(".partner-card");
      if (!cards.length) return;

      const isMouse = (e) =>
        e.pointerType === "mouse" || e.type === "mouseenter" || e.type === "mouseleave";
      const closeAll = (except = null) => {
        cards.forEach((c) => {
          if (c !== except) {
            c.classList.remove("is-open", "is-armed", "is-hover");
            c.setAttribute("aria-expanded", "false");
          }
        });
      };

      cards.forEach((card) => {
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-expanded", "false");

        const href = card.getAttribute("href");
        const target = card.getAttribute("target");

        const open = (byUser = true) => {
          card.classList.add("is-open");
          if (byUser) card.classList.add("is-armed");
          card.setAttribute("aria-expanded", "true");
        };
        const close = () => {
          card.classList.remove("is-open", "is-armed");
          card.setAttribute("aria-expanded", "false");
        };
        const follow = () => {
          if (!href || href === "#") return;
          if (target === "_blank") window.open(href, "_blank", "noopener");
          else window.location.href = href;
        };

        // Hover (desktop)
        on(card, "pointerenter", (e) => { if (isMouse(e)) card.classList.add("is-hover"); });
        on(card, "pointerleave", (e) => {
          if (isMouse(e)) { card.classList.remove("is-hover"); close(); }
        });

        // Touch
        on(card, "pointerdown", (e) => {
          if (isMouse(e)) return;
          if (!card.classList.contains("is-armed")) {
            e.preventDefault();
            closeAll(card);
            open(true);
          }
        }, { passive: false });

        on(card, "click", (e) => {
          if (card.classList.contains("is-armed")) {
            e.preventDefault();
            follow();
          }
        });

        // Keyboard
        on(card, "keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (card.classList.contains("is-open")) follow();
            else { closeAll(card); open(true); }
          } else if (e.key === "Escape") {
            close();
          }
        });

        // Blur closes
        on(card, "blur", () => {
          setTimeout(() => { if (!card.matches(":focus")) close(); }, 0);
        });
      });

      // Outside click
      on(document, "click", (e) => {
        const hit = e.target.closest(".partner-card");
        if (!hit) closeAll();
      });
    }

    return { init };
  })();

  // ======================================================
  // Boot
  // ======================================================
  function boot() {
    BIOTEK.ui.init();
    BIOTEK.i18n.init();
    BIOTEK.reveal.init();
    BIOTEK.locations.init();
    BIOTEK.partners.init();
  }

  // Start
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

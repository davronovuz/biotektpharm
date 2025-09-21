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
        address_text: "Samarqand, O'zbekiston ko'chasi, 158-uy",
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
        address_text: "Самарканд, ул. Узбекистан, дом 158",
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
        address_text: "Samarkand, Uzbekistan street, 158",
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

  // ======================================================
  // Locations (SVG map + pins + info-card)
  // ======================================================
  BIOTEK.locations = (() => {
    function isOpenNow() {
      const d = new Date();
      const h = d.getHours() + d.getMinutes() / 60;
      return h >= 9 && h <= 18;
    }

    function init() {
      const scope = $(".locations-v3");
      if (!scope) return;

      const svg   = scope.querySelector(".loc-canvas");
      const stage = scope.querySelector(".loc-stage");
      const card  = scope.querySelector(".loc-card");
      if (!svg || !card) return;

      const pins = Array.from(svg.querySelectorAll(".pin"));
      if (!pins.length) return;

      const cityEl  = $("#locCity");
      const addrEl  = $("#locAddress");
      const phoneEl = $("#locPhone");
      const hoursEl = $("#locHours");
      const openEl  = $("#openBadge");
      const dirBtn  = $("#dirBtn");
      const copyBtn = $("#copyAddr");
      const shareBtn= $("#shareAddr");

      function updateOpenBadge() {
        if (!openEl) return;
        const ok = isOpenNow();
        const lang = document.documentElement.getAttribute("lang") || "uz";
        const dict = (BIOTEK.i18n && BIOTEK.i18n.apply) ? null : null; // badge text i18n.apply allaqachon bekor qiladi
        openEl.textContent = ok ? "Open" : "Closed";
        openEl.classList.toggle("is-closed", !ok);
        // i18n modul set() chaqirilganda badge matni yangilanadi
      }

      function updateDirections(lat, lng) {
        if (dirBtn) dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      }

      function placeCardByPin(pinG) {
        const pt = svg.createSVGPoint();
        pt.x = 0; pt.y = 0;
        const scr = pt.matrixTransform(pinG.getScreenCTM());
        const r = stage.getBoundingClientRect();
        const cx = ((scr.x - r.left) / r.width) * 100;
        const cy = ((scr.y - r.top) / r.height) * 100;
        card.style.setProperty("--cx", cx + "%");
        card.style.setProperty("--cy", cy + "%");
      }

      let activePin = null;
      function activate(pin, push = true) {
        if (!pin) return;
        activePin = pin;
        pins.forEach((p) => p.classList.toggle("is-active", p === pin));

        const city  = pin.dataset.city || "";
        const addr  = pin.dataset.address || "";
        const phone = pin.dataset.phone || "";
        const hours = pin.dataset.hours || "";
        const lat   = pin.dataset.lat   || "";
        const lng   = pin.dataset.lng   || "";

        if (cityEl)  cityEl.textContent  = city;
        if (addrEl)  addrEl.textContent  = addr;
        if (phoneEl) { phoneEl.textContent = phone; phoneEl.href = phone ? "tel:" + phone.replace(/\s+/g, "") : "#"; }
        if (hoursEl) hoursEl.textContent = hours;

        updateOpenBadge();
        updateDirections(lat, lng);
        placeCardByPin(pin);

        if (push) {
          const url = new URL(location.href);
          url.searchParams.set("loc", city.toLowerCase());
          history.replaceState(null, "", url);
        }
      }

      pins.forEach((pin) => {
        on(pin, "click", () => { activate(pin); stopRotate(); });
        on(pin, "keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pin.click(); }
        });
      });

      // initial
      activate(svg.querySelector(".pin.is-active") || pins[0], false);

      on(window, "resize", () => { if (activePin) placeCardByPin(activePin); });

      on(copyBtn, "click", async () => {
        try { await navigator.clipboard?.writeText(`${cityEl?.textContent}: ${addrEl?.textContent}`); } catch (e) {}
      });

      on(shareBtn, "click", async () => {
        const url = new URL(location.href);
        if (navigator.share) {
          try {
            await navigator.share({
              title: cityEl?.textContent,
              text: `${addrEl?.textContent} — ${phoneEl?.textContent}`,
              url: url.toString()
            });
          } catch (e) {}
        } else {
          try { await navigator.clipboard?.writeText(url.toString()); } catch (e) {}
        }
      });

      // auto-rotate
      let timer = null;
      const nextPin = () => {
        const i = pins.indexOf(activePin);
        const next = pins[(i + 1) % pins.length];
        activate(next, false);
      };
      function startRotate(){ if(!prefersReduced && !timer) timer = setInterval(nextPin, 6000); }
      function stopRotate(){ if(timer){ clearInterval(timer); timer = null; } }
      startRotate();
      on(stage, "pointerenter", stopRotate);
      on(stage, "pointerleave", startRotate);

      // dev helper: shift+click -> SVG coords
      on(svg, "click", (e) => {
        if (!e.shiftKey) return;
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        const v  = pt.matrixTransform(svg.getScreenCTM().inverse());
        console.log("SVG coords:", Math.round(v.x), Math.round(v.y));
      });
    }

    return { init };
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

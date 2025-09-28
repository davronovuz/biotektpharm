/* =========================================================
   BIOTEKPHARM — Single-file, modular, conflict-free JS
   Namespaces:
   - BIOTEK.i18n       (UZ/RU/EN, data-i18n + .i18n-db)
   - BIOTEK.ui         (navbar, smooth scroll, back-to-top, preloader, year)
   - BIOTEK.reveal     (history/partners ko‘rinishi)
   - BIOTEK.locations  (map pins + info-card + route)
   - BIOTEK.partners   (flip/reveal cards)
========================================================= */
;(() => {
  const BIOTEK = (window.BIOTEK = window.BIOTEK || {});
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const raf = (fn) => requestAnimationFrame(fn);
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rafThrottle = (fn) => { let t=false; return (...a)=>{ if(t) return; t=true; raf(()=>{ fn(...a); t=false; }); }; };

  /* ===================== i18n ===================== */
  BIOTEK.i18n = (() => {
    const translations = {
      uz:{home:"Bosh sahifa",about:"Kompaniya",history:"Tarix",services:"Xizmatlar",
        locations_kicker:"Butun Oʻzbekiston boʻylab ofis va omborlarimiz",
        locations_title:"Bizning joylashuvlar",partners:"Hamkorlar",locations:"Manzil",
        contact:"Aloqa",about_title:"Kompaniya haqida",history_title:"Bizning tarix",
        products:"Mahsulotlar",contact_title:"Biz bilan bog'laning",
        contact_subtitle:"Har qanday savol yoki taklif uchun biz bilan bog'laning",
        contact_side_title:"Aloqa",footer_about:"O'zbekiston farmatsevtika bozorining yetakchi distribyutor kompaniyasi",
        footer_links:"Tez havolalar",footer_contact:"Aloqa",privacy_policy:"Maxfiylik siyosati",
        terms:"Foydalanish shartlari",address_text:"Samarqand, Yuqori Turkman ko'chasi, 158-uy",
        form_name:"Ism",form_email:"E-mail",form_phone:"Telefon (ixtiyoriy)",form_message:"Xabar",form_submit:"Yuborish",
        err_name:"Ism kiriting",err_email:"To‘g‘ri e-mail kiriting",err_msg:"Xabarni yozing",
        loc_copy:"Nusxa olish",loc_share:"Ulashish",loc_route:"Yo‘lni ko‘rsat",
        status_open:"Ochiq",status_closed:"Yopiq",
        __title:"BiotekPharm - Farmatsevtika Yetakchisi",
        __desc:"BiotekPharm - O'zbekistonda farmatsevtika sohasining yetakchi distribyutor kompaniyasi"},
      ru:{home:"Главная",about:"Компания",history:"История",services:"Услуги",
        locations_kicker:"Наши офисы и склады по всему Узбекистану",
        locations_title:"Наши локации",partners:"Партнёры",locations:"Адреса",contact:"Контакты",
        about_title:"О компании",history_title:"Наша история",products:"Продукты",
        contact_title:"Свяжитесь с нами",contact_subtitle:"Свяжитесь с нами по любым вопросам или предложениям",
        contact_side_title:"Контакты",footer_about:"Ведущая дистрибьюторская компания на фармрынке Узбекистана",
        footer_links:"Быстрые ссылки",footer_contact:"Контакты",privacy_policy:"Политика конфиденциальности",
        terms:"Условия использования",address_text:"Самарканд, ул. Yuqori Turkman, дом 158",
        form_name:"Имя",form_email:"E-mail",form_phone:"Телефон (необязательно)",form_message:"Сообщение",form_submit:"Отправить",
        err_name:"Введите имя",err_email:"Введите корректный E-mail",err_msg:"Введите сообщение",
        loc_copy:"Копировать",loc_share:"Поделиться",loc_route:"Показать маршрут",
        status_open:"Открыто",status_closed:"Закрыто",
        __title:"BiotekPharm — Лидер фармацевтической дистрибуции",
        __desc:"BiotekPharm — ведущий дистрибьютор фармацевтического рынка Узбекистана"},
      en:{home:"Home",about:"Company",history:"History",services:"Services",
        locations_kicker:"Our offices and warehouses across Uzbekistan",
        locations_title:"Our Locations",partners:"Partners",locations:"Locations",contact:"Contact",
        about_title:"About the Company",history_title:"Our History",products:"Products",
        contact_title:"Get in Touch",contact_subtitle:"Contact us for any questions or proposals",
        contact_side_title:"Contact",footer_about:"Leading pharmaceutical distribution company in Uzbekistan",
        footer_links:"Quick links",footer_contact:"Contact",privacy_policy:"Privacy Policy",terms:"Terms of Use",
        address_text:"Samarkand, Yuqori Turkman street, 158",form_name:"Name",form_email:"E-mail",
        form_phone:"Phone (optional)",form_message:"Message",form_submit:"Send",
        err_name:"Please enter your name",err_email:"Enter a valid e-mail",err_msg:"Type your message",
        loc_copy:"Copy",loc_share:"Share",loc_route:"Get directions",
        status_open:"Open",status_closed:"Closed",
        __title:"BiotekPharm — Pharmaceutical Distribution Leader",
        __desc:"BiotekPharm is a leading pharmaceutical distributor in Uzbekistan"}
    };
    const FLAG_BY_LANG = { uz:"https://flagcdn.com/uz.svg", ru:"https://flagcdn.com/ru.svg", en:"https://flagcdn.com/gb.svg" };
    const getLang = () => localStorage.getItem("preferredLang") || document.documentElement.getAttribute("lang") || "uz";

    function apply(lang){
      const dict = translations[lang]; if(!dict) return;

      $$("[data-i18n]").forEach(el=>{
        const key = el.getAttribute("data-i18n"); if(!key) return;
        const v = dict[key]; if(v==null) return;
        (el.tagName==="INPUT"||el.tagName==="TEXTAREA") ? el.setAttribute("placeholder",v) : el.innerHTML = v;
      });

      $$(".i18n-db").forEach(el=>{
        const v = el.getAttribute(`data-${lang}`) || el.getAttribute("data-uz") || el.textContent;
        (el.tagName==="INPUT"||el.tagName==="TEXTAREA") ? el.setAttribute("placeholder",v) : (el.textContent=v);
      });

      if (dict.__title) document.title = dict.__title;
      if (dict.__desc) { const m=$('meta[name="description"]'); if(m) m.setAttribute("content",dict.__desc); }

      // form placeholders (fallback)
      const setPh = (id, key)=>{ const el=$("#"+id); if(el && dict[key]!=null) el.placeholder = dict[key]; };
      setPh("name","form_name"); setPh("email","form_email"); setPh("phone","form_phone"); setPh("message","form_message");
      const submitBtn = $("button[type='submit'][data-i18n='form_submit']"); if(submitBtn && dict.form_submit) submitBtn.textContent = dict.form_submit;

      document.documentElement.setAttribute("lang", lang);
      const currentLang = $("#currentLang"); if(currentLang) currentLang.textContent = lang.toUpperCase();
      const btn = $("#langBtn"); if(btn){ const img = btn.querySelector("img.flag"); if(img && FLAG_BY_LANG[lang]) img.src = FLAG_BY_LANG[lang]; }

      // xabar: til yangilandi — locations bo'limi eshitadi
      document.dispatchEvent(new CustomEvent("biotek:langchange",{detail:{lang}}));
    }
    function set(lang){ const s=["uz","ru","en"]; if(!s.includes(lang)) lang="uz"; localStorage.setItem("preferredLang",lang); apply(lang); }
    function init(){
      const langBtn = $("#langBtn"), langMenu = $("#langMenu");
      apply(getLang());
      on(langBtn,"click",(e)=>{ e.stopPropagation(); const wrap=langBtn.closest(".nav-item.lang"); if(!wrap) return; const open=!wrap.classList.contains("open"); wrap.classList.toggle("open",open); langBtn.setAttribute("aria-expanded",open?"true":"false"); });
      $$("#langMenu li").forEach(li=> on(li,"click",()=>{ const lang = li.getAttribute("data-lang")||"uz"; set(lang); const wrap=langBtn?.closest(".nav-item.lang"); wrap?.classList.remove("open"); langBtn?.setAttribute("aria-expanded","false"); }));
      on(document,"click",(e)=>{ const wrap=langBtn?.closest(".nav-item.lang"); if(!wrap) return; if(!wrap.contains(e.target)){ wrap.classList.remove("open"); langBtn?.setAttribute("aria-expanded","false"); } });
      window.changeLanguage = set; // optional public API
    }
    return { init, set, apply, getLang };
  })();

  /* ===================== UI ===================== */
  BIOTEK.ui = (() => {
    const SCROLL_TRIG = 48;
    function handleNav(){
      const navbar=$(".navbar"), btt=$(".back-to-top"); if(!navbar) return;
      const y=scrollY; navbar.classList.toggle("scrolled", y>SCROLL_TRIG);
      if (innerWidth<992){ const goingUp=y < (handleNav._lastY ?? 0); navbar.style.transform = (goingUp||y<10)?"translateY(0)":"translateY(-110%)"; } else { navbar.style.transform="translateY(0)"; }
      btt?.classList.toggle("visible", y>600); handleNav._lastY=y;
    }
    function initNav(){
      const btt=$(".back-to-top"); const th=rafThrottle(handleNav); handleNav();
      on(window,"scroll",th,{passive:true}); on(window,"resize",th);
      on(btt,"click",(e)=>{ e.preventDefault(); scrollTo({top:0,behavior: prefersReduced?"auto":"smooth"}); });
      const mobileBtn=$("#mobile-menu")||$(".menu-toggle"), navList=$(".nav-list");
      on(mobileBtn,"click",()=>{ mobileBtn.classList.toggle("active"); navList?.classList.toggle("active"); document.body.classList.toggle("nav-open"); });
      $$(".nav-link").forEach(a=> on(a,"click",()=>{ mobileBtn?.classList.remove("active"); navList?.classList.remove("active"); document.body.classList.remove("nav-open"); }));
      on(document,"keydown",(e)=>{ if(e.key==="Escape"){ mobileBtn?.classList.remove("active"); navList?.classList.remove("active"); document.body.classList.remove("nav-open"); }});
    }
    function initSmoothAnchors(){
      const navbar=$(".navbar"); const offset=()=> (navbar? navbar.offsetHeight+8:64);
      $$("a[href^='#']").forEach(a=> on(a,"click",(e)=>{ const href=a.getAttribute("href"); if(!href||href==="#") return; const t=$(href); if(!t) return; e.preventDefault(); const top=t.getBoundingClientRect().top+pageYOffset-offset(); scrollTo({top,behavior: prefersReduced?"auto":"smooth"}); history.pushState(null,"",href); }));
      on(window,"load",()=>{ if(location.hash){ const t=$(location.hash); if(t){ const top=t.getBoundingClientRect().top+pageYOffset-offset(); scrollTo({top,behavior:"auto"}); } }});
    }
    function initActiveLink(){
      const links=$$(".nav-link"), secs=$$("section[id]"); if(!("IntersectionObserver" in window)||!secs.length) return;
      const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(!e.isIntersecting) return; const id=e.target.getAttribute("id"); links.forEach(l=> l.classList.toggle("active", l.getAttribute("href")==="#"+id)); }); },{rootMargin:"-40% 0px -50% 0px",threshold:0.01});
      secs.forEach(s=> io.observe(s));
    }
    function initPreloader(){ const p=$(".preloader"); if(!p) return; on(window,"load",()=>{ p.classList.add("fade-out"); setTimeout(()=> p.style.display="none",500); }); }
    function setYear(){ const y=$("#year"); if(y) y.textContent=new Date().getFullYear(); if(prefersReduced) document.body.classList.add("reduce-motion"); }
    function init(){ document.addEventListener("DOMContentLoaded",()=> document.body.classList.add("js-ready")); initPreloader(); initNav(); initSmoothAnchors(); initActiveLink(); setYear(); }
    return { init };
  })();

  /* ===================== Reveal ===================== */
  BIOTEK.reveal = (() => {
    function inViewOnce(sel,opt){ const items=$$(sel); if(!items.length||!("IntersectionObserver" in window)) return;
      const io=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(!e.isIntersecting) return; e.target.classList.add("in-view"); io.unobserve(e.target); }); },opt);
      items.forEach((r,i)=>{ r.style.transitionDelay=`${Math.min(i*90,360)}ms`; io.observe(r); });
    }
    function init(){ inViewOnce(".h-item",{threshold:.18,rootMargin:"0px 0px -10% 0px"}); inViewOnce(".partners-row",{threshold:.15,rootMargin:"0px 0px -10% 0px"}); }
    return { init };
  })();

  /* ===================== Locations ===================== */
  BIOTEK.locations = (() => {
    let wrap, stage, card, elTitle, elAddr, elPhone, elTime, pins, routeDash, routeShad;

    const ROUTE = {
      shift:{x:-20,y:60}, attach:0.92,
      points:[
        {ref:"pin",index:0},
        {ref:"pin",index:1,dy:-2},
        {x:70,y:52},
        {ref:"pin",index:2,dx:2,dy:-4},
        {ref:"pin",index:3}
      ],
      curvature:{default:0.28,perSeg:{0:0.30,1:0.28,2:0.27,3:0.26}},
      lift:{default:7,perSeg:{0:8,1:7,2:7,3:6}}
    };

    const getLang = () => BIOTEK.i18n?.getLang?.() || document.documentElement.getAttribute("lang") || "uz";

    // *** IMPORTANT: dataset o‘rniga getAttribute + lang-aware pick ***
    const pick = (pin, base) =>
      pin.getAttribute(`data-${base}-${getLang()}`) ||
      pin.getAttribute(`data-${base}`) || "";

    function updateCard(pin){
      const name = pick(pin,"name");
      const addr = pick(pin,"addr");
      const time = pick(pin,"time");
      const phoneRaw = (pin.getAttribute("data-phone") || "").trim();

      if (name) elTitle.textContent = name;
      if (addr) elAddr.textContent  = addr;
      if (time) elTime.textContent  = time;

      elPhone.textContent = phoneRaw;
      elPhone.href = "tel:" + phoneRaw.replace(/[^0-9+]/g,"");
    }

    function placeCard(pin){
      const style = getComputedStyle(card);
      if (style.position === "static") return; // mobile (CSS da statik)
      const s = stage.getBoundingClientRect();
      const p = pin.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const pad = 10;
      let left = p.left - s.left - c.width/2 + p.width/2;
      let top  = p.top  - s.top  - c.height - 14;
      left = Math.max(pad, Math.min(left, s.width - c.width - pad));
      top  = Math.max(pad, Math.min(top,  s.height - c.height - pad));
      card.style.left = left + "px";
      card.style.top  = top  + "px";
    }

    function setActive(pin){
      pins.forEach(p=> p.removeAttribute("data-active"));
      pin.setAttribute("data-active","");
      updateCard(pin);
      placeCard(pin);
      drawRoute();
    }

    function getPinCenterPct(pin, attach=ROUTE.attach){
      const s = stage.getBoundingClientRect();
      const r = pin.getBoundingClientRect();
      return {
        x: ((r.left + r.width/2) - s.left) / s.width  * 100,
        y: ((r.top  + r.height*attach) - s.top) / s.height * 100
      };
    }
    function parsePoint(def){
      if('x' in def && 'y' in def) return { x:def.x+ROUTE.shift.x, y:def.y+ROUTE.shift.y };
      if(def.ref==="pin" && typeof def.index==="number" && pins[def.index]){
        const base = getPinCenterPct(pins[def.index], def.attach ?? ROUTE.attach);
        return { x: base.x + (def.dx||0) + ROUTE.shift.x, y: base.y + (def.dy||0) + ROUTE.shift.y };
      }
      return null;
    }
    function cubicSeg(p0,p1,k,l){
      const dx=p1.x-p0.x, dy=p1.y-p0.y;
      const c1={x:p0.x+dx*k,y:p0.y+dy*k-l};
      const c2={x:p1.x-dx*k,y:p1.y-dy*k-l};
      return `C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
    }
    function drawRoute(){
      if(!routeDash || !routeShad) return;
      const pts = ROUTE.points.map(parsePoint).filter(Boolean);
      if (pts.length < 2) return;
      let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} `;
      for(let i=0;i<pts.length-1;i++){
        const k = ROUTE.curvature.perSeg[i] ?? ROUTE.curvature.default;
        const l = ROUTE.lift.perSeg[i]      ?? ROUTE.lift.default;
        d += cubicSeg(pts[i], pts[i+1], k, l) + " ";
      }
      routeDash.setAttribute("d", d.trim());
      routeShad.setAttribute("d", d.trim());
    }

    // pin tagidagi pill textlarini lokalizatsiya qiladi
    function updatePinPills(){
      const lang = getLang();
      pins.forEach(p=>{
        const pill = p.querySelector(".pin-pill");
        if (!pill) return;
        const t = p.getAttribute(`data-name-${lang}`) || p.getAttribute("data-name") || pill.textContent;
        pill.textContent = t;
      });
    }

    function init(){
      wrap = $(".map-sec"); if(!wrap) return;
      stage = $("#stage", wrap) || wrap.querySelector("#stage"); if(!stage) return;
      card  = $("#card",  wrap);
      elTitle = $("#cardTitle",wrap);
      elAddr  = $("#cardAddr",wrap);
      elPhone = $("#cardPhone",wrap);
      elTime  = $("#cardTime",wrap);
      pins = $$(".pin", stage);

      const routeSVG = $("#route", wrap);
      routeDash = $("#routeDash", routeSVG);
      routeShad = $("#routeShadow", routeSVG);

      if (pins.length){
        // boshlang‘ich card (birinchi pin)
        setActive(pins[0]);
      }

      pins.forEach(pin=>{
        ["mouseenter","focus","click","touchstart"].forEach(evt=>{
          pin.addEventListener(evt, ()=> setActive(pin), { passive:true });
        });
      });

      // language o‘zgarsa — pill va card ni yangilash
      on(document,"biotek:langchange",()=>{ updatePinPills(); const a=wrap.querySelector(".pin[data-active]")||pins[0]; if(a){ updateCard(a); } });

      // load/resize
      on(window,"load", ()=>{ updatePinPills(); drawRoute(); const a=wrap.querySelector(".pin[data-active]")||pins[0]; if(a) placeCard(a); });
      on(window,"resize",()=>{ drawRoute(); const a=wrap.querySelector(".pin[data-active]")||pins[0]; if(a) placeCard(a); });
    }
    return { init };
  })();

  /* ===================== Partners ===================== */
  BIOTEK.partners = (() => {
    function init(){
      const cards=$$(".partner-card"); if(!cards.length) return;
      const isMouse=(e)=> e.pointerType==="mouse"||e.type==="mouseenter"||e.type==="mouseleave";
      const closeAll=(except=null)=> cards.forEach(c=>{ if(c!==except){ c.classList.remove("is-open","is-armed","is-hover"); c.setAttribute("aria-expanded","false"); }});
      cards.forEach(card=>{
        card.setAttribute("role","button"); card.setAttribute("tabindex","0"); card.setAttribute("aria-expanded","false");
        const href=card.getAttribute("href"), target=card.getAttribute("target");
        const open=(byUser=true)=>{ card.classList.add("is-open"); if(byUser) card.classList.add("is-armed"); card.setAttribute("aria-expanded","true"); };
        const close=()=>{ card.classList.remove("is-open","is-armed"); card.setAttribute("aria-expanded","false"); };
        const follow=()=>{ if(!href||href==="#") return; (target==="_blank")? window.open(href,"_blank","noopener"): (window.location.href=href); };
        on(card,"pointerenter",(e)=>{ if(isMouse(e)) card.classList.add("is-hover"); });
        on(card,"pointerleave",(e)=>{ if(isMouse(e)){ card.classList.remove("is-hover"); close(); }});
        on(card,"pointerdown",(e)=>{ if(isMouse(e)) return; if(!card.classList.contains("is-armed")){ e.preventDefault(); closeAll(card); open(true); } },{passive:false});
        on(card,"click",(e)=>{ if(card.classList.contains("is-armed")){ e.preventDefault(); follow(); }});
        on(card,"keydown",(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); if(card.classList.contains("is-open")) follow(); else { closeAll(card); open(true);} } else if(e.key==="Escape"){ close(); }});
        on(card,"blur",()=>{ setTimeout(()=>{ if(!card.matches(":focus")) close(); },0); });
      });
      on(document,"click",(e)=>{ const hit=e.target.closest(".partner-card"); if(!hit) closeAll(); });
    }
    return { init };
  })();

  /* ===================== Boot ===================== */
  function boot(){ BIOTEK.ui.init(); BIOTEK.i18n.init(); BIOTEK.reveal.init(); BIOTEK.locations.init(); BIOTEK.partners.init(); }
  if (document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", boot); } else { boot(); }
})();

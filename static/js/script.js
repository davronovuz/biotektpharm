/* BIOTEKPHARM — main script (clean)
   - Transparent navbar with blur on scroll
   - Smooth scroll with offset
   - Active link highlight (IntersectionObserver)
   - Language switcher (#langBtn / #langMenu / #currentLang)
   - Timeline reveal + progress line
   - Google Maps lazy loader (initMap)
   - Optional: Back-to-top, Preloader guard, Year setter
*/

(() => {
  // ===== Helpers =====
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // ===== Preloader (guarded) =====
  const preloader = $(".preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.classList.add("fade-out");
      setTimeout(() => (preloader.style.display = "none"), 500);
    });
  }

  // ===== Mobile menu =====
  const mobileMenu = $("#mobile-menu");
  const navList = $(".nav-list");
  on(mobileMenu, "click", () => {
    mobileMenu.classList.toggle("active");
    navList && navList.classList.toggle("active");
    document.body.classList.toggle("nav-open");
  });
  // Close on nav-link click
  $$(".nav-link").forEach((a) =>
    on(a, "click", () => {
      mobileMenu && mobileMenu.classList.remove("active");
      navList && navList.classList.remove("active");
      document.body.classList.remove("nav-open");
    })
  );

  // ===== Navbar scroll (blur + contrast) =====
  const navbar = $(".navbar");
  let lastY = window.scrollY;
  const SCROLL_TRIG = 48;
  const handleNav = () => {
    const y = window.scrollY;
    if (navbar) {
      navbar.classList.toggle("scrolled", y > SCROLL_TRIG);
      // smart hide (optional): show when scrolling up, hide when down on mobile
      if (window.innerWidth < 992) {
        const goingUp = y < lastY;
        navbar.style.transform = goingUp || y < 10 ? "translateY(0)" : "translateY(-110%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }
    }
    lastY = y;
    // back-to-top
    const btt = $(".back-to-top");
    if (btt) btt.classList.toggle("visible", y > 600);
  };
  handleNav();
  window.addEventListener("scroll", handleNav, { passive: true });
  window.addEventListener("resize", handleNav);

  // ===== Smooth scrolling with offset =====
  const offset = () => (navbar ? navbar.offsetHeight + 8 : 64);
  $$("a[href^='#']").forEach((anchor) => {
    on(anchor, "click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset();
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  // ===== Active link highlight (Observer) =====
  const navLinks = $$(".nav-link");
  const sections = $$("section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach((s) => io.observe(s));
  }

  // ===== Language switcher (navbar variant) =====
  const langBtn = $("#langBtn");
  const langMenu = $("#langMenu");
  const currentLang = $("#currentLang");

  on(langBtn, "click", (e) => {
    e.stopPropagation();
    langMenu && langMenu.classList.toggle("show");
    langBtn.setAttribute("aria-expanded", langMenu?.classList.contains("show"));
  });
  $$("#langMenu li").forEach((li) =>
    on(li, "click", () => {
      const lang = li.getAttribute("data-lang") || "uz";
      localStorage.setItem("preferredLang", lang);
      if (currentLang) currentLang.textContent = lang.toUpperCase();
      // If a global translate function exists in your app, call it
      if (typeof window.changeLanguage === "function") {
        window.changeLanguage(lang);
      } else {
        // minimal: swap [data-i18n] via window.translations if present
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
      }
      langMenu && langMenu.classList.remove("show");
    })
  );
  on(document, "click", (e) => {
    if (langMenu && !langMenu.contains(e.target) && !langBtn?.contains(e.target)) {
      langMenu.classList.remove("show");
      langBtn && langBtn.setAttribute("aria-expanded", "false");
    }
  });
  // init saved
  const savedLang = localStorage.getItem("preferredLang") || "uz";
  if (currentLang) currentLang.textContent = savedLang.toUpperCase();

  // ===== Timeline: reveal + progress line =====
  const timeline = $("#timeline");
  const progress = $("#timelineProgress");
  const rows = $$(".t-row", timeline || document);

  // stagger var for CSS
  rows.forEach((row, i) => row.style.setProperty("--stagger", `${i * 90}ms`));

  if (rows.length && "IntersectionObserver" in window) {
    const io2 = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
      { threshold: 0.25 }
    );
    rows.forEach((r) => io2.observe(r));
  }

  const updateProgress = () => {
    if (!timeline || !progress) return;
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = Math.max(0, vh - rect.top);
    const total = rect.height + vh;
    const ratio = Math.min(1, Math.max(0, start / total));
    progress.style.height = ratio * rect.height + "px";
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  // ===== Back to top =====
  const btt = $(".back-to-top");
  on(btt, "click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===== Year =====
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // ===== Optional: Three.js mini-scene (guarded) =====
  const threeCanvas = $("#3d-map-canvas");
  if (threeCanvas && window.THREE) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        threeCanvas.clientWidth / threeCanvas.clientHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);
      threeCanvas.appendChild(renderer.domElement);

      const geometry = new THREE.PlaneGeometry(10, 10);
      const loader = new THREE.TextureLoader();
      const textureUrl = threeCanvas.dataset.tex || ""; // add data-tex on HTML if needed
      const material = new THREE.MeshBasicMaterial({ map: textureUrl ? loader.load(textureUrl) : null, transparent: true });
      const map = new THREE.Mesh(geometry, material);
      scene.add(map);

      const amb = new THREE.AmbientLight(0xffffff, 0.6);
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(0, 1, 1);
      scene.add(amb, dir);

      camera.position.z = 5;

      const animate = () => { requestAnimationFrame(animate); renderer.render(scene, camera); };
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = threeCanvas.clientWidth / threeCanvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);
      });
    } catch (e) { console.warn("Three.js init skipped:", e); }
  }

  // ===== Google Maps (lazy) =====
  const gmContainer = $("#google-map");
  if (gmContainer) {
    window.initMap = function initMap() {
      const defaultLocation = { lat: 39.6542, lng: 66.9597 }; // Samarkand
      const map = new google.maps.Map(gmContainer, {
        zoom: 12,
        center: defaultLocation,
        styles: [
          { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "all", stylers: [{ saturation: -100 }, { lightness: 45 }] },
          { featureType: "water", elementType: "all", stylers: [{ color: "#c9e7ff" }, { visibility: "on" }] }
        ],
      });

      const cards = $$(".location-card");
      const markers = [];
      const windows = [];

      const highlightCard = (region) => {
        cards.forEach((c) => c.classList.toggle("active", c.dataset.region === region));
      };

      cards.forEach((card) => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: card.querySelector("h3")?.textContent || "",
          icon: { url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(32, 32) },
        });
        markers.push(marker);

        const info = new google.maps.InfoWindow({
          content: `
            <div style="padding:10px;max-width:260px">
              <h3 style="margin:0 0 6px;color:#3a86ff;">${card.querySelector("h3")?.textContent || ""}</h3>
              <p style="margin:0 0 5px;">${card.querySelectorAll("p")[0]?.textContent || ""}</p>
              <p style="margin:0 0 5px;">${card.querySelectorAll("p")[1]?.textContent || ""}</p>
              <p style="margin:0;">${card.querySelectorAll("p")[2]?.textContent || ""}</p>
            </div>`,
        });
        windows.push(info);

        marker.addListener("click", () => {
          windows.forEach((w) => w.close());
          info.open(map, marker);
          map.panTo(marker.getPosition());
          map.setZoom(14);
          highlightCard(card.dataset.region);
        });

        on(card, "click", () => {
          windows.forEach((w) => w.close());
          info.open(map, marker);
          map.panTo({ lat, lng });
          map.setZoom(14);
          highlightCard(card.dataset.region);
        });
      });

      // Observe cards to pan when they come into view
      if ("IntersectionObserver" in window) {
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
          { threshold: 0.5, rootMargin: "0px 0px -50% 0px" }
        );
        cards.forEach((c) => obs.observe(c));
      }
    };

    // Lazy load Google Maps once
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) return; // already loaded
      const s = document.createElement("script");
      s.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBmo3O_UNMmmuyQOL2U4CCO1W2VDCLLqmA&callback=initMap";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    };

    // load immediately; could also lazy by IntersectionObserver on #locations
    loadGoogleMaps();
  }
})();



// ===== History cards: reveal on scroll + small stagger =====
(function(){
  const rows = document.querySelectorAll('.h-item');
  if(!rows.length) return;

  // Stagger kechikish
  rows.forEach((row, i) => row.style.transitionDelay = `${Math.min(i*90, 400)}ms`);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

  rows.forEach(r=>io.observe(r));
})();

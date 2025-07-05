document.addEventListener("DOMContentLoaded", function() {
    // ===== Preloader =====
    const preloader = document.querySelector(".preloader");
    window.addEventListener("load", () => {
        preloader.classList.add("fade-out");
        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    });

    // ===== Mobile Menu Toggle =====
    const mobileMenu = document.getElementById("mobile-menu");
    const navList = document.querySelector(".nav-list");

    mobileMenu.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        navList.classList.toggle("active");
    });

    // Close menu when clicking on nav links
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
            navList.classList.remove("active");
        });
    });

    // ===== Navbar Scroll Effect =====
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });

    // ===== Active Link Highlighting =====
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // ===== Language Switcher =====
    const languageSwitcher = document.querySelector(".language-switcher");
    const selectedLanguage = document.querySelector(".selected-language");
    const languageDropdown = document.querySelector(".language-dropdown");
    const currentLang = document.getElementById("current-lang");

    // Language data
    const translations = {
        uz: {
            home: "Bosh sahifa",
            about: "Kompaniya",
            products: "Mahsulotlar",
            services: "Xizmatlar",
            partners: "Hamkorlar",
            contact: "Aloqa",
            hero_title: "Dori-darmon yetkazib berishda <span>yetakchi</span>",
            hero_subtitle: "Butun dunyo bo'ylab sifat va barcha normal talablarga rioya qilgan holda ishonchli farmatsevtika mahsulotlarini yetkazib berish",
            our_products: "Mahsulotlarimiz",
            phone: "Telefon",
            email: "Elektron pochta",
            address: "Manzil",
            address_text: "Toshkent shahri, Yunusobod tumani, Navoiy ko'chasi 45",
            working_hours: "Ish vaqti",
            working_hours_text: "Dushanba-Juma: 9:00 - 18:00",
            form_name: "Ismingiz",
            form_email: "Elektron pochta",
            form_phone: "Telefon (ixtiyoriy)",
            form_subject: "Mavzu",
            form_message: "Xabar",
            form_submit: "Xabarni yuborish",
            all_rights: "Barcha huquqlar himoyalangan",
            footer_about: "Dori-darmon yetkazib berish sohasida yetakchi kompaniya",
            footer_links: "Tez havolalar",
            footer_products: "Mahsulotlar",
            footer_contact: "Aloqa",
            about_title: "Kompaniya haqida",
            about_subtitle: "BiotekPharm - bu xalqaro farmatsevtika mahsulotlarini yetkazib berish sohasida ishonchli hamkor",
            about_card1_title: "Xalqaro yetkazib berish",
            about_card1_text: "30 dan ortiq mamlakatlardagi hamkorlar bilan ishlash tajribasi",
            about_card2_title: "Sifat kafolati",
            about_card2_text: "Yetkazib berishning barcha bosqichlarida qat'iy sifat nazorati",
            about_card3_title: "Muddatlarga rioya qilish",
            about_card3_text: "Belgilangan muddatlarda majburiyatlarning aniq bajarilishi",
            about_card4_title: "Normativ muvofiqlik",
            about_card4_text: "Xalqaro farmatsevtika standartlarining to'liq qo'llanilishi",
            products_title: "Mahsulotlarimiz",
            products_subtitle: "Keng qirrali farmatsevtika mahsulotlari assortimenti",
            all_products: "Hammasi",
            antibiotics: "Antibiotiklar",
            cardiovascular: "Kardiologiya",
            neurology: "Nevrologiya",
            oncology: "Onkologiya",
            services_title: "Xizmatlarimiz",
            services_subtitle: "Biz taklif qiladigan asosiy xizmatlar",
            service1_title: "Mahsulot ro'yxatdan o'tkazish",
            service1_text: "Mahsulotlarni mahalliy va xalqaro bozorlarda ro'yxatdan o'tkazish",
            service2_title: "Logistika xizmatlari",
            service2_text: "Harorat nazorati ostida xavfsiz yetkazib berish",
            service3_title: "Bojxona rasmiylashtirish",
            service3_text: "Barcha bojxona protseduralarini amalga oshirish",
            service4_title: "Sifat nazorati",
            service4_text: "Har bir partiyani qat'iy sifat nazoratidan o'tkazish",
            partners_title: "Hamkorlarimiz",
            partners_subtitle: "Biz butun dunyo bo'ylab etakchi farmatsevtika kompaniyalari bilan ishlaymiz",
            sales: "Sotuv bo'yicha",
            partnership: "Hamkorlik",
            information: "Ma'lumot"
        },
        ru: {
            home: "Главная",
            about: "Компания",
            products: "Продукты",
            services: "Услуги",
            partners: "Партнеры",
            contact: "Контакты",
            hero_title: "Лидер в поставках <span>фармацевтической продукции</span>",
            hero_subtitle: "Надежные поставки фармацевтической продукции по всему миру с соблюдением качества и всех нормативных требований",
            our_products: "Наши продукты",
            phone: "Телефон",
            email: "Электронная почта",
            address: "Адрес",
            address_text: "г. Ташкент, Юнусабадский район, ул. Навои, 45",
            working_hours: "Время работы",
            working_hours_text: "Пн-Пт: 9:00 - 18:00",
            form_name: "Ваше имя",
            form_email: "Электронная почта",
            form_phone: "Телефон (необязательно)",
            form_subject: "Тема",
            form_message: "Сообщение",
            form_submit: "Отправить сообщение",
            all_rights: "Все права защищены",
            footer_about: "Ведущая компания в сфере поставок фармацевтической продукции",
            footer_links: "Быстрые ссылки",
            footer_products: "Продукты",
            footer_contact: "Контакты",
            about_title: "О компании",
            about_subtitle: "BiotekPharm - надежный партнер в сфере поставок международных фармацевтических продуктов",
            about_card1_title: "Международные поставки",
            about_card1_text: "Опыт работы с партнерами в более чем 30 странах",
            about_card2_title: "Гарантия качества",
            about_card2_text: "Строгий контроль качества на всех этапах поставки",
            about_card3_title: "Соблюдение сроков",
            about_card3_text: "Точное выполнение обязательств в установленные сроки",
            about_card4_title: "Нормативное соответствие",
            about_card4_text: "Полное соблюдение международных фармацевтических стандартов",
            products_title: "Наши продукты",
            products_subtitle: "Широкий ассортимент фармацевтической продукции",
            all_products: "Все",
            antibiotics: "Антибиотики",
            cardiovascular: "Кардиология",
            neurology: "Неврология",
            oncology: "Онкология",
            services_title: "Наши услуги",
            services_subtitle: "Основные услуги, которые мы предлагаем",
            service1_title: "Регистрация продукции",
            service1_text: "Регистрация продукции на местных и международных рынках",
            service2_title: "Логистические услуги",
            service2_text: "Безопасная доставка с температурным контролем",
            service3_title: "Таможенное оформление",
            service3_text: "Оформление всех таможенных процедур",
            service4_title: "Контроль качества",
            service4_text: "Строгий контроль качества каждой партии",
            partners_title: "Наши партнеры",
            partners_subtitle: "Мы работаем с ведущими фармацевтическими компаниями по всему миру",
            sales: "Продажи",
            partnership: "Партнерство",
            information: "Информация"
        },
        en: {
            home: "Home",
            about: "Company",
            products: "Products",
            services: "Services",
            partners: "Partners",
            contact: "Contact",
            hero_title: "Leading in <span>pharmaceutical delivery</span>",
            hero_subtitle: "Reliable delivery of pharmaceutical products worldwide with quality and compliance to all regulatory requirements",
            our_products: "Our Products",
            phone: "Phone",
            email: "Email",
            address: "Address",
            address_text: "45 Navoi Street, Yunusabad District, Tashkent",
            working_hours: "Working Hours",
            working_hours_text: "Monday-Friday: 9:00 AM - 6:00 PM",
            form_name: "Your Name",
            form_email: "Email Address",
            form_phone: "Phone (optional)",
            form_subject: "Subject",
            form_message: "Message",
            form_submit: "Send Message",
            all_rights: "All Rights Reserved",
            footer_about: "Leading company in pharmaceutical product delivery",
            footer_links: "Quick Links",
            footer_products: "Products",
            footer_contact: "Contact",
            about_title: "About Company",
            about_subtitle: "BiotekPharm - a reliable partner in international pharmaceutical product delivery",
            about_card1_title: "International Delivery",
            about_card1_text: "Experience working with partners in over 30 countries",
            about_card2_title: "Quality Assurance",
            about_card2_text: "Strict quality control at all stages of delivery",
            about_card3_title: "Timely Delivery",
            about_card3_text: "Accurate fulfillment of obligations within agreed timelines",
            about_card4_title: "Regulatory Compliance",
            about_card4_text: "Full compliance with international pharmaceutical standards",
            products_title: "Our Products",
            products_subtitle: "Wide range of pharmaceutical products",
            all_products: "All",
            antibiotics: "Antibiotics",
            cardiovascular: "Cardiovascular",
            neurology: "Neurology",
            oncology: "Oncology",
            services_title: "Our Services",
            services_subtitle: "Main services we offer",
            service1_title: "Product Registration",
            service1_text: "Product registration in local and international markets",
            service2_title: "Logistics Services",
            service2_text: "Safe delivery with temperature control",
            service3_title: "Customs Clearance",
            service3_text: "Handling all customs procedures",
            service4_title: "Quality Control",
            service4_text: "Strict quality control for each batch",
            partners_title: "Our Partners",
            partners_subtitle: "We work with leading pharmaceutical companies worldwide",
            sales: "Sales",
            partnership: "Partnership",
            information: "Information"
        }
    };

    // Change language function
    function changeLanguage(lang) {
        // Update current language display
        currentLang.textContent = lang.toUpperCase();

        // Save to localStorage
        localStorage.setItem("preferredLang", lang);

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Update all elements with data-i18n attribute
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                    element.placeholder = translations[lang][key];
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
    }

    // Language switcher toggle
    selectedLanguage.addEventListener("click", () => {
        languageDropdown.classList.toggle("show");
    });

    // Language selection
    document.querySelectorAll(".language-dropdown li").forEach(item => {
        item.addEventListener("click", function() {
            const lang = this.getAttribute("data-lang");
            changeLanguage(lang);
            languageDropdown.classList.remove("show");
        });
    });

    // Close language dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!languageSwitcher.contains(e.target)) {
            languageDropdown.classList.remove("show");
        }
    });

    // Initialize with saved language or default
    const savedLang = localStorage.getItem("preferredLang") || "uz";
    changeLanguage(savedLang);

    // ===== Theme Toggle =====
    const themeToggle = document.querySelector(".theme-toggle");
    const themeIcons = {
        sun: document.querySelector(".theme-icon.sun"),
        moon: document.querySelector(".theme-icon.moon")
    };

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);

    // Set initial icon state
    if (savedTheme === "light") {
        themeIcons.sun.classList.add("active");
        themeIcons.moon.classList.remove("active");
    } else {
        themeIcons.sun.classList.remove("active");
        themeIcons.moon.classList.add("active");
    }

    // Toggle theme
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";

        document.body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        // Toggle icons
        themeIcons.sun.classList.toggle("active", newTheme === "light");
        themeIcons.moon.classList.toggle("active", newTheme === "dark");
    });

    // ===== Products Filter =====
    const categoryBtns = document.querySelectorAll(".category-btn");
    const productsGrid = document.querySelector(".products-grid");

    // Sample products data
    const products = [
        {
            id: 1,
            title: "Amoxicillin",
            title_ru: "Амоксициллин",
            title_en: "Amoxicillin",
            description: "Keng spektrli antibiotik, yuqori nafas yo'llari infektsiyalari uchun",
            description_ru: "Антибиотик широкого спектра действия для лечения инфекций верхних дыхательных путей",
            description_en: "Broad-spectrum antibiotic for upper respiratory tract infections",
            category: "antibiotics",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            title: "Azithromycin",
            title_ru: "Азитромицин",
            title_en: "Azithromycin",
            description: "Makrolidlar guruhiga mansub antibiotik, bronxit va pnevmoniya uchun",
            description_ru: "Антибиотик группы макролидов для лечения бронхита и пневмонии",
            description_en: "Macrolide antibiotic for bronchitis and pneumonia",
            category: "antibiotics",
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            title: "Atorvastatin",
            title_ru: "Аторвастатин",
            title_en: "Atorvastatin",
            description: "Xolesterin darajasini pasaytiradi, yurak-qon tomir kasalliklarining oldini oladi",
            description_ru: "Снижает уровень холестерина, предотвращает сердечно-сосудистые заболевания",
            description_en: "Lowers cholesterol levels, prevents cardiovascular diseases",
            category: "cardiovascular",
            image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 4,
            title: "Metoprolol",
            title_ru: "Метопролол",
            title_en: "Metoprolol",
            description: "Beta-blokator, arterial gipertenziya va angina pektoris davolash uchun",
            description_ru: "Бета-блокатор для лечения артериальной гипертензии и стенокардии",
            description_en: "Beta-blocker for arterial hypertension and angina pectoris",
            category: "cardiovascular",
            image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 5,
            title: "Donepezil",
            title_ru: "Донепезил",
            title_en: "Donepezil",
            description: "Altsgeymer kasalligida kognitiv funksiyalarni yaxshilaydi",
            description_ru: "Улучшает когнитивные функции при болезни Альцгеймера",
            description_en: "Improves cognitive function in Alzheimer's disease",
            category: "neurology",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 6,
            title: "Paclitaxel",
            title_ru: "Паклитаксел",
            title_en: "Paclitaxel",
            description: "Keng qo'llaniladigan antineoplastik preparat, ko'pgina o'smalarga qarshi",
            description_ru: "Широко применяемый противоопухолевый препарат против многих новообразований",
            description_en: "Widely used antineoplastic agent against many tumors",
            category: "oncology",
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&id=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        }
    ];

    // Render products function
    function renderProducts(filteredProducts) {
        productsGrid.innerHTML = "";

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
            return;
        }

        const currentLang = document.documentElement.lang;

        filteredProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";

            let title = product.title;
            let description = product.description;

            if (currentLang === "ru") {
                title = product.title_ru || product.title;
                description = product.description_ru || product.description;
            } else if (currentLang === "en") {
                title = product.title_en || product.title;
                description = product.description_en || product.description;
            }

            productCard.innerHTML = `
                <img src="${product.image}" alt="${title}" class="product-img" loading="lazy">
                <div class="product-info">
                    <span class="product-category" data-i18n="${product.category}">${product.category}</span>
                    <h3 class="product-title">${title}</h3>
                    <p class="product-description">${description}</p>
                </div>
            `;

            productsGrid.appendChild(productCard);
        });

        // Update category translations
        document.querySelectorAll(".product-category").forEach(element => {
            const key = element.getAttribute("data-i18n");
            if (translations[currentLang] && translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });
    }

    // Initial render
    renderProducts(products);

    // Filter products by category
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.dataset.category;
            if (category === "all") {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });

    // ===== Contact Form =====
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = {
                name: this.querySelector("#name").value,
                email: this.querySelector("#email").value,
                phone: this.querySelector("#phone").value,
                subject: this.querySelector("#subject").value,
                message: this.querySelector("#message").value
            };

            // Here you would typically send the data to a server
            console.log("Form submitted:", formData);

            // Show success message
            alert("Thank you for your message! We will contact you soon.");

            // Reset form
            this.reset();
        });
    }

    // ===== Partners Animation =====
    const partnerSlides = document.querySelectorAll(".partner-slide");

    function animatePartners() {
        partnerSlides.forEach((slide, index) => {
            setTimeout(() => {
                slide.style.transform = "translateY(-10px)";
                setTimeout(() => {
                    slide.style.transform = "translateY(0)";
                }, 500);
            }, 200 * index);
        });
    }

    // Animate every 5 seconds
    setInterval(animatePartners, 5000);
    animatePartners(); // Initial animation

    // ===== Current Year =====
    document.getElementById("year").textContent = new Date().getFullYear();
});
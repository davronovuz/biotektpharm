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
            history: "Tarix",
            products: "Mahsulotlar",
            services: "Xizmatlar",
            partners: "Hamkorlar",
            contact: "Aloqa",
            hero_title: "Sog'liq uchun <span>ishonchli</span> yechimlar",
            hero_subtitle: "20 yillik tajribaga ega O'zbekistonning yetakchi farmatsevtika distribyutori",
            our_products: "Mahsulotlarimiz",
            phone: "Telefon",
            email: "Elektron pochta",
            address: "Manzil",
            address_text: "Samarqand, O'zbekiston ko'chasi, 158-uy",
            working_hours: "Ish vaqti",
            working_hours_text: "Dushanba-Juma: 9:00 - 18:00",
            form_name: "Ismingiz",
            form_email: "Elektron pochta",
            form_phone: "Telefon (ixtiyoriy)",
            form_subject: "Mavzu",
            form_message: "Xabaringiz",
            form_submit: "Xabarni yuborish",
            all_rights: "Barcha huquqlar himoyalangan",
            footer_about: "O'zbekiston farmatsevtika bozorining yetakchi distribyutor kompaniyasi",
            footer_links: "Tez havolalar",
            footer_products: "Mahsulotlar",
            footer_contact: "Aloqa",
            about_title: "Kompaniya haqida",
            about_subtitle: "Bizning missiya va qadriyatlarimiz",
            mission_title: "Missiyamiz",
            mission_text: "O'zbekiston aholisiga sifatli va arzon narxdagi dori-darmonlarni yetkazib berish",
            vision_title: "Ko'zlagan maqsadimiz",
            vision_text: "Mintaqadagi eng yirik va ishonchli farmatsevtika distribyutori bo'lish",
            values_title: "Qadriyatlarimiz",
            values_text: "Ishonchlilik, sifat, mijozlar uchun qadrlash",
            history_title: "Bizning tarix",
            history_subtitle: "Ishonch va sifat yo'lida 20 yillik safar",
            stat_products: "Mahsulotlar",
            stat_clients: "Mijozlar",
            stat_suppliers: "Yetkazib beruvchilar",
            stat_partners: "Xalqaro hamkorlar",
            products_title: "Mahsulotlarimiz",
            products_subtitle: "Keng qirrali farmatsevtika mahsulotlari",
            all_products: "Hammasi",
            antibiotics: "Antibiotiklar",
            cardiovascular: "Yurak-damar",
            neurology: "Nevrologiya",
            oncology: "Onkologiya",
            vitamins: "Vitaminlar",
            view_all: "Barcha mahsulotlarni ko'rish",
            services_title: "Xizmatlarimiz",
            services_subtitle: "Biz mijozlarimizga qanday xizmat ko'rsatamiz",
            service1_title: "Mahsulot ro'yxatdan o'tkazish",
            service1_text: "Mahsulotlarni mahalliy va xalqaro bozorlarda ro'yxatdan o'tkazish",
            service2_title: "Logistika xizmatlari",
            service2_text: "Harorat nazorati ostida xavfsiz yetkazib berish",
            service3_title: "Bojxona rasmiylashtirish",
            service3_text: "Barcha bojxona protseduralarini amalga oshirish",
            service4_title: "Sifat nazorati",
            service4_text: "Har bir partiyani qat'iy sifat nazoratidan o'tkazish",
            service5_title: "Sklad xizmatlari",
            service5_text: "15,000 m² maydondagi zamonaviy omborlarimiz",
            service6_title: "24/7 mijozlar uchun qo'llab-quvvatlash",
            service6_text: "Har qanday savolingizga javob beramiz",
            learn_more: "Batafsil",
            partners_title: "Hamkorlarimiz",
            partners_subtitle: "Biz butun dunyo bo'ylab etakchi farmatsevtika kompaniyalari bilan ishlaymiz",
            locations_title: "Bizning joylashuvlar",
            locations_subtitle: "Butun O'zbekiston bo'ylab ofis va omborlarimiz",
            testimonials_title: "Mijozlarimiz fikrlari",
            testimonials_subtitle: "Bizning mijozlarimiz biz haqimizda nima deyishadi",
            testimonial1_text: "\"BIOTEK FARM bilan 5 yildan beri hamkorlik qilamiz. Har doim sifatli mahsulotlar va ishonchli yetkazib berish tizimi uchun minnatdormiz.\"",
            testimonial2_text: "\"Yetkazib berish muddatlari juda aniq. Har qanday muammoda 24/7 qo'llab-quvvatlash xizmati mavjud. Haqiqiy professional jamoa!\"",
            testimonial3_text: "\"Xalqaro farmatsevtika kompaniyasi sifatida BIOTEK FARM bilan ishlashdan mamnunmiz. Barcha shartnoma majburiyatlarini vaqtida bajaryapti.\"",
            pharmacy_owner: "Dorixona egasi",
            hospital_director: "Shifoxona direktori",
            international_partner: "Xalqaro hamkor",
            sales: "Sotuv bo'yicha",
            partnership: "Hamkorlik",
            information: "Ma'lumot",
            support: "Qo'llab-quvvatlash",
            privacy_policy: "Maxfiylik siyosati",
            terms: "Foydalanish shartlari",
            founder_title: "Asoschi va Direktor",
            years_exp: "yillik tajriba"
        },
        ru: {
            home: "Главная",
            about: "Компания",
            history: "История",
            products: "Продукты",
            services: "Услуги",
            partners: "Партнеры",
            contact: "Контакты",
            hero_title: "Надежные <span>решения</span> для здоровья",
            hero_subtitle: "Ведущий дистрибьютор фармацевтической продукции в Узбекистане с 20-летним опытом",
            our_products: "Наши продукты",
            phone: "Телефон",
            email: "Электронная почта",
            address: "Адрес",
            address_text: "Самарканд, улица Узбекистан, 158",
            working_hours: "Время работы",
            working_hours_text: "Пн-Пт: 9:00 - 18:00",
            form_name: "Ваше имя",
            form_email: "Электронная почта",
            form_phone: "Телефон (необязательно)",
            form_subject: "Тема",
            form_message: "Ваше сообщение",
            form_submit: "Отправить сообщение",
            all_rights: "Все права защищены",
            footer_about: "Ведущая дистрибьюторская компания фармацевтической продукции в Узбекистане",
            footer_links: "Быстрые ссылки",
            footer_products: "Продукты",
            footer_contact: "Контакты",
            about_title: "О компании",
            about_subtitle: "Наша миссия и ценности",
            mission_title: "Наша миссия",
            mission_text: "Обеспечение населения Узбекистана качественными и доступными лекарственными средствами",
            vision_title: "Наше видение",
            vision_text: "Стать крупнейшим и самым надежным фармацевтическим дистрибьютором в регионе",
            values_title: "Наши ценности",
            values_text: "Надежность, качество, уважение к клиентам",
            history_title: "Наша история",
            history_subtitle: "20-летний путь доверия и качества",
            stat_products: "Продукты",
            stat_clients: "Клиенты",
            stat_suppliers: "Поставщики",
            stat_partners: "Международные партнеры",
            products_title: "Наши продукты",
            products_subtitle: "Широкий ассортимент фармацевтической продукции",
            all_products: "Все",
            antibiotics: "Антибиотики",
            cardiovascular: "Сердечно-сосудистые",
            neurology: "Неврология",
            oncology: "Онкология",
            vitamins: "Витамины",
            view_all: "Посмотреть все продукты",
            services_title: "Наши услуги",
            services_subtitle: "Как мы обслуживаем наших клиентов",
            service1_title: "Регистрация продукции",
            service1_text: "Регистрация продукции на местных и международных рынках",
            service2_title: "Логистические услуги",
            service2_text: "Безопасная доставка с температурным контролем",
            service3_title: "Таможенное оформление",
            service3_text: "Оформление всех таможенных процедур",
            service4_title: "Контроль качества",
            service4_text: "Строгий контроль качества каждой партии",
            service5_title: "Складские услуги",
            service5_text: "Современные склады площадью 15,000 м²",
            service6_title: "Поддержка клиентов 24/7",
            service6_text: "Ответим на любые ваши вопросы",
            learn_more: "Подробнее",
            partners_title: "Наши партнеры",
            partners_subtitle: "Мы работаем с ведущими фармацевтическими компаниями по всему миру",
            locations_title: "Наши локации",
            locations_subtitle: "Офисы и склады по всему Узбекистану",
            testimonials_title: "Отзывы клиентов",
            testimonials_subtitle: "Что говорят о нас наши клиенты",
            testimonial1_text: "\"Мы сотрудничаем с BIOTEK FARM уже 5 лет. Всегда благодарны за качественную продукцию и надежную систему доставки.\"",
            testimonial2_text: "\"Сроки поставки очень точные. При любых проблемах доступна поддержка 24/7. Настоящая профессиональная команда!\"",
            testimonial3_text: "\"Как международная фармацевтическая компания, мы довольны сотрудничеством с BIOTEK FARM. Все договорные обязательства выполняются в срок.\"",
            pharmacy_owner: "Владелец аптеки",
            hospital_director: "Директор больницы",
            international_partner: "Международный партнер",
            sales: "Продажи",
            partnership: "Партнерство",
            information: "Информация",
            support: "Поддержка",
            privacy_policy: "Политика конфиденциальности",
            terms: "Условия использования",
            founder_title: "Основатель и Директор",
            years_exp: "лет опыта"
        },
        en: {
            home: "Home",
            about: "Company",
            history: "History",
            products: "Products",
            services: "Services",
            partners: "Partners",
            contact: "Contact",
            hero_title: "Reliable <span>solutions</span> for health",
            hero_subtitle: "Leading pharmaceutical distributor in Uzbekistan with 20 years of experience",
            our_products: "Our Products",
            phone: "Phone",
            email: "Email",
            address: "Address",
            address_text: "Samarkand, Uzbekistan street, 158",
            working_hours: "Working Hours",
            working_hours_text: "Mon-Fri: 9:00 AM - 6:00 PM",
            form_name: "Your Name",
            form_email: "Email Address",
            form_phone: "Phone (optional)",
            form_subject: "Subject",
            form_message: "Your Message",
            form_submit: "Send Message",
            all_rights: "All Rights Reserved",
            footer_about: "Leading pharmaceutical distribution company in Uzbekistan",
            footer_links: "Quick Links",
            footer_products: "Products",
            footer_contact: "Contact",
            about_title: "About Company",
            about_subtitle: "Our mission and values",
            mission_title: "Our Mission",
            mission_text: "Providing quality and affordable medicines to the population of Uzbekistan",
            vision_title: "Our Vision",
            vision_text: "To become the largest and most reliable pharmaceutical distributor in the region",
            values_title: "Our Values",
            values_text: "Reliability, quality, respect for customers",
            history_title: "Our History",
            history_subtitle: "20-year journey of trust and quality",
            stat_products: "Products",
            stat_clients: "Clients",
            stat_suppliers: "Suppliers",
            stat_partners: "International Partners",
            products_title: "Our Products",
            products_subtitle: "Wide range of pharmaceutical products",
            all_products: "All",
            antibiotics: "Antibiotics",
            cardiovascular: "Cardiovascular",
            neurology: "Neurology",
            oncology: "Oncology",
            vitamins: "Vitamins",
            view_all: "View All Products",
            services_title: "Our Services",
            services_subtitle: "How we serve our customers",
            service1_title: "Product Registration",
            service1_text: "Product registration in local and international markets",
            service2_title: "Logistics Services",
            service2_text: "Safe delivery with temperature control",
            service3_title: "Customs Clearance",
            service3_text: "Handling all customs procedures",
            service4_title: "Quality Control",
            service4_text: "Strict quality control for each batch",
            service5_title: "Warehouse Services",
            service5_text: "Modern warehouses with 15,000 m² area",
            service6_title: "24/7 Customer Support",
            service6_text: "Answering all your questions",
            learn_more: "Learn More",
            partners_title: "Our Partners",
            partners_subtitle: "We work with leading pharmaceutical companies worldwide",
            locations_title: "Our Locations",
            locations_subtitle: "Offices and warehouses across Uzbekistan",
            testimonials_title: "Customer Testimonials",
            testimonials_subtitle: "What our customers say about us",
            testimonial1_text: "\"We have been cooperating with BIOTEK FARM for 5 years. Always grateful for quality products and reliable delivery system.\"",
            testimonial2_text: "\"Delivery times are very accurate. For any issues, 24/7 support is available. A truly professional team!\"",
            testimonial3_text: "\"As an international pharmaceutical company, we are satisfied with cooperation with BIOTEK FARM. All contractual obligations are fulfilled on time.\"",
            pharmacy_owner: "Pharmacy Owner",
            hospital_director: "Hospital Director",
            international_partner: "International Partner",
            sales: "Sales",
            partnership: "Partnership",
            information: "Information",
            support: "Support",
            privacy_policy: "Privacy Policy",
            terms: "Terms of Use",
            founder_title: "Founder & Director",
            years_exp: "years of experience"
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

        // Update products based on language
        renderProducts(products);
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
    const themeIcons = themeToggle.querySelectorAll("i");

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Set initial icon state
    themeIcons.forEach(icon => {
        if ((savedTheme === "light" && icon.classList.contains("fa-sun")) ||
            (savedTheme === "dark" && icon.classList.contains("fa-moon"))) {
            icon.classList.add("active");
        } else {
            icon.classList.remove("active");
        }
    });

    // Toggle theme
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        // Toggle icons
        themeIcons.forEach(icon => {
            if ((newTheme === "light" && icon.classList.contains("fa-sun")) ||
                (newTheme === "dark" && icon.classList.contains("fa-moon"))) {
                icon.classList.add("active");
            } else {
                icon.classList.remove("active");
            }
        });
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
            image: "assets/products/amoxicillin.jpg"
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
            image: "assets/products/azithromycin.jpg"
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
            image: "assets/products/atorvastatin.jpg"
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
            image: "assets/products/metoprolol.jpg"
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
            image: "assets/products/donepezil.jpg"
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
            image: "assets/products/paclitaxel.jpg"
        },
        {
            id: 7,
            title: "Vitamin C",
            title_ru: "Витамин C",
            title_en: "Vitamin C",
            description: "Immunitetni mustahkamlovchi va antioksidant ta'sirga ega vitamin",
            description_ru: "Витамин, укрепляющий иммунитет и обладающий антиоксидантным действием",
            description_en: "Vitamin that strengthens immunity and has antioxidant effect",
            category: "vitamins",
            image: "assets/products/vitamin-c.jpg"
        },
        {
            id: 8,
            title: "Vitamin D3",
            title_ru: "Витамин D3",
            title_en: "Vitamin D3",
            description: "Suyaklar salomatligi va immunitet uchun muhim vitamin",
            description_ru: "Важный витамин для здоровья костей и иммунитета",
            description_en: "Important vitamin for bone health and immunity",
            category: "vitamins",
            image: "assets/products/vitamin-d3.jpg"
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

    // ===== Stats Counter =====
    const statNumbers = document.querySelectorAll(".stat-number");
    const statsSection = document.querySelector(".stats");

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-count"));
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                stat.textContent = Math.floor(current);

                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                }
            }, 16);
        });
    }

    // Start animation when stats section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);

    // ===== Timeline Animation =====
    const timeline = document.querySelector(".timeline");
    const timelineProgress = document.querySelector(".timeline-progress");

    function animateTimeline() {
        const timelineHeight = timeline.offsetHeight;
        const scrollPosition = window.scrollY;
        const timelineOffset = timeline.offsetTop;
        const timelineStart = timelineOffset - window.innerHeight * 0.8;

        if (scrollPosition > timelineStart) {
            const progress = (scrollPosition - timelineStart) / (timelineHeight * 0.7);
            const percentage = Math.min(progress * 100, 100);
            timelineProgress.style.height = `${percentage}%`;
        }
    }

    window.addEventListener("scroll", animateTimeline);

    // ===== Back to Top Button =====
    const backToTop = document.querySelector(".back-to-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    backToTop.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // ===== Current Year =====
    document.getElementById("year").textContent = new Date().getFullYear();

    // ===== Particles.js =====
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#3a86ff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#3a86ff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    // ===== Map Interaction =====
    const mapAreas = document.querySelectorAll("area");
    const locationCards = document.querySelectorAll(".location-card");

    mapAreas.forEach(area => {
        area.addEventListener("mouseover", () => {
            const region = area.getAttribute("data-region");
            locationCards.forEach(card => {
                card.classList.remove("active");
                if (card.getAttribute("data-region") === region) {
                    card.classList.add("active");
                }
            });
        });
    });

    // ===== Testimonials Slider =====
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    const slider = document.querySelector(".testimonials-slider");

    slider.addEventListener("mousedown", dragStart);
    slider.addEventListener("touchstart", dragStart);
    slider.addEventListener("mouseup", dragEnd);
    slider.addEventListener("touchend", dragEnd);
    slider.addEventListener("mouseleave", dragEnd);
    slider.addEventListener("mousemove", drag);
    slider.addEventListener("touchmove", drag);

    function dragStart(e) {
        if (e.type === "touchstart") {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
            e.preventDefault();
        }

        isDragging = true;
        slider.style.cursor = "grabbing";
        slider.style.scrollBehavior = "auto";
    }

    function drag(e) {
        if (!isDragging) return;

        const currentPosition = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
        const diff = currentPosition - startPos;

        slider.scrollLeft = prevTranslate - diff;
    }

    function dragEnd() {
        isDragging = false;
        slider.style.cursor = "grab";
        slider.style.scrollBehavior = "smooth";
        prevTranslate = slider.scrollLeft;
    }
});
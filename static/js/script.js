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
            history: "Tarix",
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
            locations: "Manzillar",
            address_text: "Samarqand tumani Yuqori Turkman, O'zbekiston ko'chasi, 158-uy",
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
            view_all: "Barcha mahsulotlarni ko'rish",
            service5_title: "Sklad xizmatlari",
            service5_text: "15,000 m² maydondagi zamonaviy omborlarimiz",
            service6_title: "24/7 mijozlar uchun qo'llab-quvvatlash",
            service6_text: "Har qanday savolingizga javob beramiz",
            service7_title: "Dorixonalar tarmog'i",
            service7_text: "Samarqand shahrida 15 dan ziyod dorixonalar",
            partners_title: "Hamkorlarimiz",
            partners_subtitle: "Biz butun dunyo bo'ylab etakchi farmatsevtika kompaniyalari bilan ishlaymiz",
            sales: "Sotuv bo'yicha",
            partnership: "Hamkorlik",
            information: "Ma'lumot",
            mission_title: "Missiyamiz",
            mission_text: "O'zbekiston aholisiga sifatli va arzon narxdagi dori-darmonlarni yetkazib berish",
            vision_title: "Ko'zlagan maqsadimiz",
            vision_text: "Mintaqadagi yirik va ishonchli farmatsevtika distribyutori bo'lish",
            values_title: "Qadriyatlarimiz",
            values_text: "Ishonchlilik, sifat, mijozlar uchun qadrlash",
            about_content_title: "BIOTEK FARM haqida",
            about_content_text: "2017 yilda tashkil etilgan BIOTEK FARM O'zbekiston farmatsevtika bozorining yetakchi distribyutorlaridan biridir. Biz 5000 dan ortiq dori vositalari, 3200 dan ortiq faol mijozlar va 20 dan ortiq xalqaro hamkorlarga ega bo'lgan ishonchli kompaniyamiz.",
            history_title: "Bizning tarix",
            history_subtitle: "20 yillik muvaffaqiyatli safar",

            timeline1_title: "2005-yil Yumax Farm tashkil etildi",
            timeline1_text: "Samarqandda birinchi dorixonani ochdik",

            timeline2_title: "2012-yil Ulgurji savdoga o'tish",
            timeline2_text: "4 ta viloyatda ombor va ofislar ochdik",

            timeline3_title: "2017-yil BIOTEK FARM asos solindi",
            timeline3_text: "Xalqaro distribyutorlik faoliyatini boshladik",

            timeline4_title: "2019-yil MaxMed Group tashkil etildi",
            timeline4_text: "40 ta malakali xodimli promotsion kompaniya",

            timeline5_title: "2021-2024 -yillar Mintaqaviy kengayish",
            timeline5_text: "Toshkent, Farg'ona va Urganchda yangi ofislar",

            timeline6_title: "Bugun Yetakchi 10 distribyutor",
            timeline6_text: "O'zbekistonning yirik farmatsevtika distribyutorlaridan biri",
            locations_title: "Bizning joylashuvlar",
            locations_subtitle: "Butun O'zbekiston bo'ylab ofis va omborlarimiz",
            location_tashkent: "Toshkent",
            address_tashkent: "Mirzo Ulug'bek, Sayram 7-proyezd, 50-uy",
            phone_tashkent: "+998 90 123 45 67",
            hours_tashkent: "Dushanba-Juma: 9:00 - 18:00",

            location_samarkand: "Samarqand",
            address_samarkand: "Yuqori Turkman, O'zbekiston ko'chasi, 158-uy",
            phone_samarkand: "+998 90 657 05 00",
            hours_samarkand: "Dushanba-Juma: 9:00 - 18:00",

            location_fergana: "Farg'ona",
            address_fergana: "Urta Shura MFY, Charogon ko'chasi, 21-uy",
            phone_fergana: "+998 90 937 06 04",
            hours_fergana: "Dushanba-Juma: 9:00 - 18:00",

            location_urgench: "Urganch",
            address_urgench: "Ashxobod MFY, Sanoatchilar ko'chasi, 12 D-uy",
            phone_urgench: "+998 90 123 45 68",
            hours_urgench: "Dushanba-Juma: 9:00 - 18:00",
            contact_title: "Biz bilan bog'laning",
            contact_subtitle: "Har qanday savol yoki taklif uchun biz bilan bog'laning",
            address_text: "Samarqand, Yuqori Turkman, ko'chasi, 158-uy",
            privacy_policy: "Maxfiylik siyosati",
            terms: "Foydalanish shartlari"


        },
        ru: {
            history: "История",
            locations: "Филиалы",
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
            view_all: "Посмотреть все продукты",
            service5_title: "Складские услуги",
            service5_text: "Современные склады площадью 15 000 м²",
            service6_title: "Поддержка клиентов 24/7",
            service6_text: "Отвечаем на любые ваши вопросы",
            service7_title: "Сеть аптек",
            service7_text: "Более 15 аптек в городе Самарканд",
            partners_title: "Наши партнеры",
            partners_subtitle: "Мы работаем с ведущими фармацевтическими компаниями по всему миру",
            sales: "Продажи",
            partnership: "Партнерство",
            information: "Информация",
            mission_title: "Наша миссия",
            mission_text: "Обеспечить население Узбекистана качественными и доступными лекарственными средствами",
            vision_title: "Наше видение",
            vision_text: "Стать крупнейшим и надежным фармацевтическим дистрибьютором в регионе",
            values_title: "Наши ценности",
            values_text: "Надежность, качество, забота о клиентах",
            about_content_title: "О BIOTEK FARM",
            about_content_text: "Основанная в 2017 году компания BIOTEK FARM является одним из ведущих дистрибьюторов на фармацевтическом рынке Узбекистана. Мы — надежная компания с более чем 5000 наименований лекарств, 3200 активных клиентов и более 20 международных партнеров.",
            history_title: "Наша история",
            history_subtitle: "20 лет успешного пути",

            timeline1_title: "2005 год — Основана Yumax Farm",
            timeline1_text: "Мы открыли первую аптеку в Самарканде",

            timeline2_title: "2012 год — Переход на оптовую торговлю",
            timeline2_text: "Открыли склады и офисы в 4 регионах",

            timeline3_title: "2017 год — Основана BIOTEK FARM",
            timeline3_text: "Начали международную дистрибьюторскую деятельность",

            timeline4_title: "2019 год — Основана MaxMed Group",
            timeline4_text: "Промоционная компания с 40 квалифицированными сотрудниками",

            timeline5_title: "2021–2024 годы — Региональное расширение",
            timeline5_text: "Новые офисы в Ташкенте, Фергане и Ургенче",

            timeline6_title: "Сегодня — Топ-10 дистрибьюторов",
            timeline6_text: "Одна из крупнейших фармацевтических дистрибьюторов в Узбекистане",
            locations_title: "Наши локации",
            locations_subtitle: "Офисы и склады по всему Узбекистану",
            location_tashkent: "Ташкент",
            address_tashkent: "Мирзо Улугбек, Сайрам 7-проезд, дом 50",
            phone_tashkent: "+998 90 123 45 67",
            hours_tashkent: "Понедельник-Пятница: 9:00 - 18:00",

            location_samarkand: "Самарканд",
            address_samarkand: "Юкори Туркман, улица Узбекистана, дом 158",
            phone_samarkand: "+998 90 657 05 00",
            hours_samarkand: "Понедельник-Пятница: 9:00 - 18:00",

            location_fergana: "Фергана",
            address_fergana: "Урта Шура МФЙ, улица Чарогон, дом 21",
            phone_fergana: "+998 90 937 06 04",
            hours_fergana: "Понедельник-Пятница: 9:00 - 18:00",

            location_urgench: "Ургенч",
            address_urgench: "Ашхабад МФЙ, улица Саночилар, дом 12Д",
            phone_urgench: "+998 90 123 45 68",
            hours_urgench: "Понедельник-Пятница: 9:00 - 18:00",
            contact_title: "Связаться с нами",
            contact_subtitle: "Свяжитесь с нами по любому вопросу или предложению",
            address_text: "Самарканд, Юкори Туркман, улица , дом 158",
            privacy_policy: "Политика конфиденциальности",
            terms: "Условия использования"



        },
        en: {
            about_content_title: "О BIOTEK FARM",
            about_content_text: "Основанная в 2017 году компания BIOTEK FARM является одним из ведущих дистрибьюторов на фармацевтическом рынке Узбекистана. Мы — надежная компания с более чем 5000 наименований лекарств, 3200 активных клиентов и более 20 международных партнеров.",
            history: "History",
            locations: "Locations",
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
            information: "Information",
            mission_title: "Our Mission",
            mission_text: "To provide the population of Uzbekistan with high-quality and affordable medicines",
            vision_title: "Our Vision",
            vision_text: "To become a leading and trusted pharmaceutical distributor in the region",
            values_title: "Our Values",
            values_text: "Reliability, quality, customer care",
            about_content_title: "About BIOTEK FARM",
            about_content_text: "Founded in 2017, BIOTEK FARM is one of the leading distributors in Uzbekistan’s pharmaceutical market. We are a trusted company with over 5,000 medicines, 3,200 active clients, and more than 20 international partners.",
            history_title: "Our History",
            history_subtitle: "20 years of successful journey",

            timeline1_title: "2005 — Yumax Farm was founded",
            timeline1_text: "We opened our first pharmacy in Samarkand",

            timeline2_title: "2012 — Transition to wholesale",
            timeline2_text: "Opened warehouses and offices in 4 regions",

            timeline3_title: "2017 — BIOTEK FARM was established",
            timeline3_text: "Started international distribution operations",

            timeline4_title: "2019 — MaxMed Group was established",
            timeline4_text: "Promotional company with 40 qualified employees",

            timeline5_title: "2021–2024 — Regional expansion",
            timeline5_text: "New offices in Tashkent, Fergana, and Urgench",

            timeline6_title: "Today — Top 10 Distributor",
            timeline6_text: "One of the largest pharmaceutical distributors in Uzbekistan",
            view_all: "View all products",

            service5_title: "Warehouse Services",
            service5_text: "Modern warehouses covering 15,000 m²",

            service6_title: "24/7 Customer Support",
            service6_text: "We answer any of your questions",

            service7_title: "Pharmacy Network",
            service7_text: "Over 15 pharmacies in Samarkand city",
            locations_title: "Our Locations",
            locations_subtitle: "Offices and warehouses across Uzbekistan",
            location_tashkent: "Tashkent",
            address_tashkent: "Mirzo Ulugbek, Sayram 7th drive, house 50",
            phone_tashkent: "+998 90 123 45 67",
            hours_tashkent: "Mon–Fri: 9:00 AM - 6:00 PM",

            location_samarkand: "Samarkand",
            address_samarkand: "Yuqori Turkman, Uzbekistan street, house 158",
            phone_samarkand: "+998 90 657 05 00",
            hours_samarkand: "Mon–Fri: 9:00 AM - 6:00 PM",

            location_fergana: "Fergana",
            address_fergana: "Urta Shura MFY, Charogon street, house 21",
            phone_fergana: "+998 90 937 06 04",
            hours_fergana: "Mon–Fri: 9:00 AM - 6:00 PM",

            location_urgench: "Urgench",
            address_urgench: "Ashxobod MFY, Sanoatchilar street, house 12 D",
            phone_urgench: "+998 90 123 45 68",
            hours_urgench: "Mon–Fri: 9:00 AM - 6:00 PM",
            contact_title: "Contact Us",
            contact_subtitle: "Reach out to us for any questions or suggestions",
            address_text: "Samarkand, Yukori Turkman, Street, House 158",
            privacy_policy: "Privacy Policy",
            terms: "Terms of Use"





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

document.addEventListener('DOMContentLoaded', function() {
    // 3D sahna yaratish
    const container = document.getElementById('3d-map-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Xarita geometriyasi
    const geometry = new THREE.PlaneGeometry(10, 10);
    const texture = new THREE.TextureLoader().load("{% static 'images/uz-texture.jpg' %}");
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const map = new THREE.Mesh(geometry, material);
    scene.add(map);

    // Yoritish
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Kamera pozitsiyasi
    camera.position.z = 5;

    // Filiallar joylashuvi
    const branchPositions = {
        tashkent: { x: -2, y: 3, z: 0 },
        samarkand: { x: 1, y: 1, z: 0 },
        fergana: { x: 3, y: 2, z: 0 },
        urgench: { x: 2, y: -2, z: 0 }
    };

    // Filial markerlari
    Object.keys(branchPositions).forEach(branch => {
        const markerGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(branchPositions[branch].x, branchPositions[branch].y, branchPositions[branch].z);
        scene.add(marker);
    });

    // Animatsiya
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Filiallarni tanlash
    document.querySelectorAll('.location-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const region = this.dataset.region;
            // Tanlangan filialga animatsiya
        });
    });

    // O'lcham o'zgarishiga moslashuv
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});


// Initialize Google Maps
function initMap() {
    // Default to Samarkand coordinates
    const defaultLocation = { lat: 39.6542, lng: 66.9597 };

    // Create the map
    const map = new google.maps.Map(document.getElementById("google-map"), {
        zoom: 12,
        center: defaultLocation,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#c9e7ff"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ]
    });

    // Create markers for each location
    const markers = [];
    const locationCards = document.querySelectorAll('.location-card');

    locationCards.forEach(card => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        const region = card.dataset.region;

        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: card.querySelector('h3').textContent,
            icon: {
                url: `https://maps.google.com/mapfiles/ms/icons/red-dot.png`,
                scaledSize: new google.maps.Size(32, 32)
            }
        });

        markers.push(marker);

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 5px; color: #3a86ff;">${card.querySelector('h3').textContent}</h3>
                    <p style="margin: 0 0 5px;"><i class="fas fa-map-marker-alt"></i> ${card.querySelectorAll('p')[0].textContent}</p>
                    <p style="margin: 0 0 5px;"><i class="fas fa-phone"></i> ${card.querySelectorAll('p')[1].textContent}</p>
                    <p style="margin: 0;"><i class="fas fa-clock"></i> ${card.querySelectorAll('p')[2].textContent}</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
            // Highlight corresponding card
            highlightCard(region);
        });

        // Card click handler
        card.addEventListener('click', () => {
            // Center map on this location
            map.panTo({ lat, lng });
            map.setZoom(14);

            // Open info window
            infoWindow.open(map, marker);

            // Highlight this card
            highlightCard(region);
        });
    });

    // Function to highlight the selected card
    function highlightCard(region) {
        locationCards.forEach(card => {
            card.classList.remove('active');
            if (card.dataset.region === region) {
                card.classList.add('active');
                // Scroll to this card if not fully visible
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Intersection Observer for scroll-triggered map updates
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const lat = parseFloat(card.dataset.lat);
                    const lng = parseFloat(card.dataset.lng);

                    // Smoothly pan to this location
                    map.panTo({ lat, lng });

                    // Highlight this card
                    highlightCard(card.dataset.region);
                }
            });
        },
        {
            threshold: 0.5, // Trigger when 50% of card is visible
            rootMargin: '0px 0px -50% 0px' // Adjust viewport area
        }
    );

    // Observe all location cards
    locationCards.forEach(card => {
        observer.observe(card);
    });
}





window.addEventListener('scroll',()=>{
  const nav=document.querySelector('.navbar');
  if(window.scrollY>10){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
});
const btn=document.getElementById('mobile-menu');
const list=document.querySelector('.nav-list');
btn && btn.addEventListener('click',()=> list.classList.toggle('active'));


// Load Google Maps API
function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = https://maps.googleapis.com/maps/api/js?key=AIzaSyBmo3O_UNMmmuyQOL2U4CCO1W2VDCLLqmA&callback=initMap;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Load the map when the page is ready
document.addEventListener('DOMContentLoaded', loadGoogleMaps);
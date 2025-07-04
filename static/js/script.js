// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Active link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Product filtering
const categoryBtns = document.querySelectorAll('.category-btn');
const productsGrid = document.querySelector('.products-grid');

// Sample product data
const products = [
    {
        id: 1,
        title: "Amoxicillin",
        description: "Keng spektrli antibiotik, yuqori nafas yo'llari infektsiyalari uchun",
        category: "antibiotics",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Azithromycin",
        description: "Makrolidlar guruhiga mansub antibiotik, bronxit va pnevmoniya uchun",
        category: "antibiotics",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Atorvastatin",
        description: "Xolesterin darajasini pasaytiradi, yurak-qon tomir kasalliklarining oldini oladi",
        category: "cardiovascular",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        title: "Metoprolol",
        description: "Beta-blokator, arterial gipertenziya va angina pektoris davolash uchun",
        category: "cardiovascular",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        title: "Donepezil",
        description: "Altsgeymer kasalligida kognitiv funksiyalarni yaxshilaydi",
        category: "neurology",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        title: "Paclitaxel",
        description: "Keng qo'llaniladigan antineoplastik preparat, ko'pgina o'smalarga qarshi",
        category: "oncology",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    }
];

// Display all products initially
displayProducts(products);

// Filter products by category
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const category = btn.dataset.category;

        if (category === 'all') {
            displayProducts(products);
        } else {
            const filteredProducts = products.filter(product => product.category === category);
            displayProducts(filteredProducts);
        }
    });
});

// Function to display products
function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <span class="product-category" data-i18n="${product.category}">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Multilingual Support
const languageSwitcher = {
    currentLang: 'uz',

    translations: {
        'uz': {
            'tagline': 'Dori-darmon yetkazib berishda yetakchi',
            'home': 'Bosh sahifa',
            'about': 'Kompaniya haqida',
            'products': 'Mahsulotlar',
            'supply': 'Yetkazib berish',
            'partners': 'Hamkorlar',
            'contact': 'Aloqa',
            'contact_us': 'Biz bilan bog\'lanish',
            'hero_title': 'Dori-darmon yetkazib berishda yetakchi',
            'hero_subtitle': 'Butun dunyo bo\'ylab sifat va barcha normal talablarga rioya qilgan holda ishonchli farmatsevtika mahsulotlarini yetkazib berish',
            'our_products': 'Mahsulotlarimiz',
            'about_title': 'Kompaniya haqida',
            'about_subtitle': 'PharmaLeader - bu xalqaro farmatsevtika mahsulotlarini yetkazib berish sohasida ishonchli hamkor',
            'about_card1_title': 'Xalqaro yetkazib berish',
            'about_card1_text': '30 dan ortiq mamlakatlardagi hamkorlar bilan ishlash tajribasi',
            'about_card2_title': 'Sifat kafolati',
            'about_card2_text': 'Yetkazib berishning barcha bosqichlarida qat\'iy sifat nazorati',
            'about_card3_title': 'Muddatlarga rioya qilish',
            'about_card3_text': 'Belgilangan muddatlarda majburiyatlarning aniq bajarilishi',
            'about_card4_title': 'Normativ muvofiqlik',
            'about_card4_text': 'Xalqaro farmatsevtika standartlarining to\'liq qo\'llanilishi',
            'products_title': 'Mahsulotlarimiz',
            'products_subtitle': 'Keng qirrali farmatsevtika mahsulotlari assortimenti',
            'all_products': 'Hammasi',
            'antibiotics': 'Antibiotiklar',
            'cardiovascular': 'Kardiologiya',
            'neurology': 'Nevrologiya',
            'oncology': 'Onkologiya',
            'supply_title': 'Yetkazib berish xizmatlari',
            'supply_subtitle': 'Biz xalqaro farmatsevtika mahsulotlarini yetkazib berish bo\'yicha kompleks yechimlarni taklif qilamiz:',
            'supply_item1': 'To\'liq bojxona rasmiylashtirish',
            'supply_item2': 'Sertifikatlash va ro\'yxatdan o\'tkazish',
            'supply_item3': 'Logistika va tashish',
            'supply_item4': 'Harorat rejimiga rioya qilgan holda saqlash',
            'supply_item5': 'Yuklarni sug\'urtalash',
            'request_quote': 'So\'rov yuborish',
            'partners_title': 'Hamkorlarimiz',
            'partners_subtitle': 'Biz butun dunyo bo\'ylab etakchi farmatsevtika kompaniyalari bilan ishlaymiz',
            'contact_title': 'Biz bilan bog\'laning',
            'contact_subtitle': 'Har qanday savol yoki taklif uchun biz bilan bog\'laning',
            'phone': 'Telefon',
            'email': 'Elektron pochta',
            'address': 'Manzil',
            'address_text': 'Toshkent shahri, Yunusobod tumani, Navoiy ko\'chasi 45',
            'working_hours': 'Ish vaqti',
            'working_hours_text': 'Dushanba-Juma: 9:00 - 18:00',
            'form_name': 'Ismingiz',
            'form_email': 'Elektron pochta',
            'form_phone': 'Telefon (ixtiyoriy)',
            'form_message': 'Xabar',
            'form_submit': 'Xabarni yuborish',
            'footer_about': 'Dori-darmon yetkazib berish sohasida yetakchi kompaniya',
            'footer_links': 'Tez havolalar',
            'footer_products': 'Mahsulotlar',
            'footer_contact': 'Aloqa',
            'all_rights': 'Barcha huquqlar himoyalangan'
        },
        'ru': {
            'tagline': 'Лидер поставок лекарственных средств',
            'home': 'Главная',
            'about': 'О компании',
            'products': 'Продукция',
            'supply': 'Поставки',
            'partners': 'Партнеры',
            'contact': 'Контакты',
            'contact_us': 'Связаться с нами',
            'hero_title': 'Лидер поставок лекарственных средств',
            'hero_subtitle': 'Надежные поставки фармацевтической продукции по всему миру с гарантией качества и соблюдением всех нормативных требований',
            'our_products': 'Наша продукция',
            'about_title': 'О компании',
            'about_subtitle': 'PharmaLeader - это надежный партнер в сфере международных поставок фармацевтической продукции',
            'about_card1_title': 'Международные поставки',
            'about_card1_text': 'Опыт работы с партнерами из более чем 30 стран мира',
            'about_card2_title': 'Гарантия качества',
            'about_card2_text': 'Строгий контроль качества на всех этапах поставки',
            'about_card3_title': 'Соблюдение сроков',
            'about_card3_text': 'Точное выполнение обязательств в установленные сроки',
            'about_card4_title': 'Нормативное соответствие',
            'about_card4_text': 'Полное соблюдение международных фармацевтических стандартов',
            'products_title': 'Наша продукция',
            'products_subtitle': 'Широкий ассортимент фармацевтической продукции',
            'all_products': 'Все',
            'antibiotics': 'Антибиотики',
            'cardiovascular': 'Кардиология',
            'neurology': 'Неврология',
            'oncology': 'Онкология',
            'supply_title': 'Услуги по поставкам',
            'supply_subtitle': 'Мы предлагаем комплексные решения для международных поставок фармацевтической продукции:',
            'supply_item1': 'Полное таможенное оформление',
            'supply_item2': 'Сертификация и регистрация',
            'supply_item3': 'Логистика и транспортировка',
            'supply_item4': 'Хранение с соблюдением температурного режима',
            'supply_item5': 'Страхование грузов',
            'request_quote': 'Запросить предложение',
            'partners_title': 'Наши партнеры',
            'partners_subtitle': 'Мы работаем с ведущими фармацевтическими компаниями по всему миру',
            'contact_title': 'Свяжитесь с нами',
            'contact_subtitle': 'По любым вопросам или предложениям свяжитесь с нами',
            'phone': 'Телефон',
            'email': 'Электронная почта',
            'address': 'Адрес',
            'address_text': 'г. Ташкент, Юнусабадский район, ул. Навои 45',
            'working_hours': 'Режим работы',
            'working_hours_text': 'Понедельник-Пятница: 9:00 - 18:00',
            'form_name': 'Ваше имя',
            'form_email': 'Электронная почта',
            'form_phone': 'Телефон (необязательно)',
            'form_message': 'Сообщение',
            'form_submit': 'Отправить сообщение',
            'footer_about': 'Лидер поставок лекарственных средств',
            'footer_links': 'Быстрые ссылки',
            'footer_products': 'Продукция',
            'footer_contact': 'Контакты',
            'all_rights': 'Все права защищены'
        },
        'en': {
            'tagline': 'Leader in pharmaceutical supplies',
            'home': 'Home',
            'about': 'About',
            'products': 'Products',
            'supply': 'Supply',
            'partners': 'Partners',
            'contact': 'Contact',
            'contact_us': 'Contact Us',
            'hero_title': 'Leader in pharmaceutical supplies',
            'hero_subtitle': 'Reliable worldwide delivery of pharmaceutical products with quality assurance and compliance with all regulatory requirements',
            'our_products': 'Our Products',
            'about_title': 'About Company',
            'about_subtitle': 'PharmaLeader is a reliable partner in international pharmaceutical supplies',
            'about_card1_title': 'International Supply',
            'about_card1_text': 'Experience working with partners from more than 30 countries',
            'about_card2_title': 'Quality Assurance',
            'about_card2_text': 'Strict quality control at all stages of supply',
            'about_card3_title': 'Timely Delivery',
            'about_card3_text': 'Accurate fulfillment of obligations within established deadlines',
            'about_card4_title': 'Regulatory Compliance',
            'about_card4_text': 'Full compliance with international pharmaceutical standards',
            'products_title': 'Our Products',
            'products_subtitle': 'Wide range of pharmaceutical products',
            'all_products': 'All',
            'antibiotics': 'Antibiotics',
            'cardiovascular': 'Cardiovascular',
            'neurology': 'Neurology',
            'oncology': 'Oncology',
            'supply_title': 'Supply Services',
            'supply_subtitle': 'We offer comprehensive solutions for international pharmaceutical supplies:',
            'supply_item1': 'Full customs clearance',
            'supply_item2': 'Certification and registration',
            'supply_item3': 'Logistics and transportation',
            'supply_item4': 'Temperature-controlled storage',
            'supply_item5': 'Cargo insurance',
            'request_quote': 'Request a Quote',
            'partners_title': 'Our Partners',
            'partners_subtitle': 'We work with leading pharmaceutical companies worldwide',
            'contact_title': 'Contact Us',
            'contact_subtitle': 'For any questions or inquiries please contact us',
            'phone': 'Phone',
            'email': 'Email',
            'address': 'Address',
            'address_text': '45 Navoi Street, Yunusabad District, Tashkent',
            'working_hours': 'Working Hours',
            'working_hours_text': 'Monday-Friday: 9:00 AM - 6:00 PM',
            'form_name': 'Your Name',
            'form_email': 'Email',
            'form_phone': 'Phone (optional)',
            'form_message': 'Message',
            'form_submit': 'Send Message',
            'footer_about': 'Leader in pharmaceutical supplies',
            'footer_links': 'Quick Links',
            'footer_products': 'Products',
            'footer_contact': 'Contact',
            'all_rights': 'All Rights Reserved'
        }
    },

    init: function() {
        this.loadLanguage();
        this.setupEventListeners();
    },

    loadLanguage: function() {
        const savedLang = localStorage.getItem('preferredLang') || 'uz';
        this.switchLanguage(savedLang);

        // Set the select value
        const select = document.getElementById('language-select');
        if (select) {
            select.value = savedLang;
        }
    },

    switchLanguage: function(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLang', lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[lang] && this.translations[lang][key]) {
                element.textContent = this.translations[lang][key];
            }
        });
    },

    setupEventListeners: function() {
        const select = document.getElementById('language-select');
        if (select) {
            select.addEventListener('change', () => {
                const lang = select.value;
                this.switchLanguage(lang);
            });
        }
    }
};

// Initialize language switcher
languageSwitcher.init();

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Here you would typically send the form data to your backend
        console.log('Form submitted:', { name, email, phone, message });

        // Show success message
        alert(languageSwitcher.translations[languageSwitcher.currentLang]['form_submit'] + ' ' +
              (languageSwitcher.currentLang === 'uz' ? 'muvaffaqiyatli amalga oshirildi!' :
               languageSwitcher.currentLang === 'ru' ? 'успешно отправлено!' : 'successful!'));

        // Reset form
        this.reset();
    });
}
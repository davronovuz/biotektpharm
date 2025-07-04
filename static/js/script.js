document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
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

    // Language Switcher
    const languageSwitcher = document.querySelector('.language-switcher');
    const selectedLanguage = document.querySelector('.selected-language');
    const languageDropdown = document.querySelector('.language-dropdown');
    const currentFlag = document.getElementById('current-flag');
    const currentLang = document.getElementById('current-lang');

    selectedLanguage.addEventListener('click', () => {
        languageDropdown.classList.toggle('show');
    });

    document.querySelectorAll('.language-dropdown li').forEach(item => {
        item.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            const flagSrc = this.querySelector('img').src;
            const langText = this.textContent.trim().split(' ')[0];

            currentFlag.src = flagSrc;
            currentLang.textContent = langText;
            languageDropdown.classList.remove('show');

            // Change language content
            switchLanguage(lang);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!languageSwitcher.contains(e.target)) {
            languageDropdown.classList.remove('show');
        }
    });

    // Language switching function
    function switchLanguage(lang) {
        // This would be replaced with your actual translation logic
        console.log('Switching to language:', lang);
        document.documentElement.lang = lang;

        // In a real implementation, you would update all translatable elements
        // For now, we'll just show an alert
        const langName =
            lang === 'uz' ? 'O\'zbekcha' :
            lang === 'ru' ? 'Русский' : 'English';

        alert(`Language switched to ${langName}. In a real implementation, all text would change.`);

        // Save language preference
        localStorage.setItem('preferredLang', lang);
    }

    // Initialize with saved language preference
    const savedLang = localStorage.getItem('preferredLang') || 'uz';
    switchLanguage(savedLang);

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
            alert('Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');

            // Reset form
            this.reset();
        });
    }

    // Simple partners slider animation
    const partnerSlides = document.querySelectorAll('.partner-slide');
    let currentSlide = 0;

    function animatePartners() {
        partnerSlides.forEach((slide, index) => {
            setTimeout(() => {
                slide.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    slide.style.transform = 'translateY(0)';
                }, 500);
            }, index * 200);
        });
    }

    // Animate every 5 seconds
    setInterval(animatePartners, 5000);
    animatePartners(); // Initial animation
});
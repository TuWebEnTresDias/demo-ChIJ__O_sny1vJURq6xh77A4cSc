/* ============================================
   KAJUÉ CAFÉ — Landing Page JavaScript
   Interactividad: Animaciones, Menú, Formularios
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header scroll effect ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    const handleHeaderScroll = () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // --- Mobile menu toggle ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

    const toggleMobileMenu = () => {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    mobileMenu.querySelector('.mobile-menu__overlay').addEventListener('click', closeMobileMenu);

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // --- Menu category tabs ---
    const categoryButtons = document.querySelectorAll('.menu__category-btn');
    const menuGrids = document.querySelectorAll('.menu__grid');

    const switchCategory = (category) => {
        // Update buttons
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update grids
        menuGrids.forEach(grid => {
            if (grid.id === category) {
                grid.classList.remove('hidden');
                // Re-trigger animations for newly visible items
                const items = grid.querySelectorAll('[data-animate]');
                items.forEach((item, index) => {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 100);
                });
            } else {
                grid.classList.add('hidden');
            }
        });
    };

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchCategory(btn.dataset.category);
        });
    });

    // --- Scroll animations (Intersection Observer) ---
    const animateElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach((el, index) => {
        // Add staggered delay based on position within parent
        const parent = el.parentElement;
        const siblings = Array.from(parent.querySelectorAll('[data-animate]'));
        const siblingIndex = siblings.indexOf(el);
        el.style.transitionDelay = `${siblingIndex * 0.1}s`;
        
        animateOnScroll.observe(el);
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Contact form → WhatsApp ---
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value.trim();
            
            // Format date nicely
            let formattedDate = date;
            if (date) {
                const [year, month, day] = date.split('-');
                const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                formattedDate = `${parseInt(day)} de ${months[parseInt(month) - 1]}`;
            }
            
            // Build WhatsApp message
            let whatsappMessage = `Hola Kajue! 👋 Soy ${name}.\n`;
            whatsappMessage += `Me gustaría hacer una reserva:\n`;
            whatsappMessage += `📅 Fecha: ${formattedDate}\n`;
            whatsappMessage += `🕐 Hora: ${time}\n`;
            whatsappMessage += `👥 Personas: ${guests}\n`;
            whatsappMessage += `📞 Teléfono: ${phone}\n`;
            
            if (message) {
                whatsappMessage += `\n💬 ${message}`;
            }
            
            // Encode and open WhatsApp
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/5491125440989?text=${encodedMessage}`;
            
            window.open(whatsappURL, '_blank', 'noopener');
            
            // Show success feedback
            showToast('Redirigiendo a WhatsApp...');
            contactForm.reset();
        });
    }

    // --- Newsletter form ---
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value.trim();
            
            const whatsappMessage = encodeURIComponent(
                `Hola Kajue! 👋\nQuiero suscribirme al newsletter.\n📧 Email: ${email}`
            );
            
            window.open(`https://wa.me/5491125440989?text=${whatsappMessage}`, '_blank', 'noopener');
            
            showToast('¡Gracias! Redirigiendo a WhatsApp...');
            newsletterForm.reset();
        });
    }

    // --- Toast notification ---
    function showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 24px;
            background: #2A1F1A;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-size: 0.9rem;
            font-family: 'Plus Jakarta Sans', sans-serif;
            box-shadow: 0 8px 30px rgba(42, 31, 26, 0.2);
            z-index: 9999;
            animation: slideInToast 0.3s ease, fadeOutToast 0.3s ease 2.7s forwards;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Add toast animation styles
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        @keyframes slideInToast {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOutToast {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(toastStyles);

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');

    const highlightNavLink = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // Add active nav link style
    const navActiveStyle = document.createElement('style');
    navActiveStyle.textContent = `
        .header__link.active {
            color: #C4642A;
        }
        .header__link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(navActiveStyle);

    // --- Parallax effect on hero image ---
    const heroImage = document.querySelector('.hero__image');
    
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.15;
            
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        }, { passive: true });
    }

    // --- Counter animation for stats ---
    const counterElements = document.querySelectorAll('.hero__rating-score, .testimonios__rating-number');
    
    const animateCounter = (element, target, duration = 1500) => {
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * eased;
            
            element.textContent = current.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    // Observe rating elements
    const ratingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const value = parseFloat(entry.target.textContent);
                if (value && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    animateCounter(entry.target, value);
                }
                ratingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => ratingObserver.observe(el));

    // --- Menu item hover sound effect (subtle) ---
    const menuItems = document.querySelectorAll('.menu__item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transition = 'all 0.3s ease';
        });
    });

    // --- Preloader ---
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // --- Set minimum date for reservation form ---
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.setAttribute('min', `${year}-${month}-${day}`);
        
        // Set max date (30 days from now)
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        const maxYear = maxDate.getFullYear();
        const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
        const maxDay = String(maxDate.getDate()).padStart(2, '0');
        dateInput.setAttribute('max', `${maxYear}-${maxMonth}-${maxDay}`);
    }

    // --- Gallery lightbox effect ---
    const galleryItems = document.querySelectorAll('.galeria__item');
    
    galleryItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(42, 31, 26, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
                padding: 2rem;
            `;
            
            const bigImg = document.createElement('img');
            bigImg.src = img.src;
            bigImg.alt = img.alt;
            bigImg.style.cssText = `
                max-width: 90%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 12px;
                box-shadow: 0 16px 60px rgba(0, 0, 0, 0.5);
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 24px;
                right: 24px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.15);
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            `;
            
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
            });
            
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.15)';
            });
            
            overlay.appendChild(bigImg);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            
            const closeOverlay = () => {
                overlay.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                }, 300);
            };
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target === bigImg) {
                    closeOverlay();
                }
            });
            
            closeBtn.addEventListener('click', closeOverlay);
            
            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    closeOverlay();
                    document.removeEventListener('keydown', handler);
                }
            });
        });
    });

    // Add lightbox animation styles
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(lightboxStyles);

    console.log('☕ Kajue Café — Landing page loaded successfully');

});
// ===================================
// Bağoğlu Hafriyat - JavaScript
// ===================================

// ===== Wait for DOM to be fully loaded =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initQuoteForm();
    initScrollToTop();
    initScrollAnimations();
    initThemeToggle();
    initActiveNavLink();
});

// ===== Header Scroll Effect =====
function initHeader() {
    const header = document.getElementById('header');
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 100));
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hash or just "#"
            if (!href || href === '#') return;
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FAQ Accordion =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// ===== Quote Form Handling =====
function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    
    if (!form) return;
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format: 5XX XXX XX XX
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                } else if (value.length <= 8) {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
                } else {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 8) + ' ' + value.slice(8, 10);
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Disable submit button to prevent double submission
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            email: document.getElementById('email')?.value || '',
            location: document.getElementById('location')?.value || '',
            service: document.getElementById('service')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
        
        // Validate required fields
        if (!formData.name || !formData.phone || !formData.location || !formData.service) {
            showNotification('Lütfen tüm zorunlu alanları doldurun.', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
            }
            return;
        }
        
        // Validate phone number (should be 10 digits)
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length !== 10 || !phoneDigits.startsWith('5')) {
            showNotification('Lütfen geçerli bir telefon numarası girin. (5XX XXX XX XX)', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
            }
            return;
        }
        
        // Get service name in Turkish
        const serviceSelect = document.getElementById('service');
        const serviceName = serviceSelect?.options[serviceSelect.selectedIndex]?.text || formData.service;
        
        // Create WhatsApp message
        const whatsappMessage = `
*Bağoğlu Hafriyat - Teklif Talebi*

*Ad Soyad:* ${formData.name}
*Telefon:* ${formData.phone}
*E-posta:* ${formData.email || 'Belirtilmedi'}
*Lokasyon:* ${formData.location}
*Hizmet:* ${serviceName}
${formData.message ? `\n*Proje Detayları:*\n${formData.message}` : ''}

Merhaba, yukarıdaki bilgiler için fiyat teklifi almak istiyorum.
        `.trim();
        
        // WhatsApp number (without + sign)
        const whatsappNumber = '905321736991';
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Show success notification
        showNotification('WhatsApp\'a yönlendiriliyorsunuz...', 'success');
        
        // Open WhatsApp
        setTimeout(function() {
            window.open(whatsappURL, '_blank');
            
            // Reset form
            form.reset();
            
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }, 1000);
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#22C55E' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animations to document
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification i {
            font-size: 1.25rem;
        }
    `;
    document.head.appendChild(style);
}

// ===== Scroll to Top Button =====
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }, 100));
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .why-card,
        .fleet-card-simple,
        .reference-card,
        .faq-item,
        .contact-card
    `);
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${index * 0.05}s`;
        
        observer.observe(element);
    });
}

// ===== Theme Toggle (Dark/Light Mode) =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'light') {
            theme = 'dark';
        } else {
            theme = 'light';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// ===== Active Nav Link Highlighting =====
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', throttle(function() {
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100));
}

// ===== Utility Functions =====

// Throttle function for performance optimization
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// Debounce function for performance optimization
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ===== Lazy Loading Images =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Console Welcome Message =====
console.log('%c🏗️ Bağoğlu Hafriyat', 'font-size: 24px; font-weight: bold; color: #FF6B00;');
console.log('%cAnkara\'nın Güvenilir Hafriyat Firması', 'font-size: 14px; color: #1A1A2E;');
console.log('%c📞 +90 536 262 46 98 | +90 532 173 69 91', 'font-size: 12px; color: #666;');
console.log('%c💻 Web Sitesi 2024', 'font-size: 10px; color: #999;');

// ===== Performance Monitoring (Development) =====
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('%c⚡ Performance Metrics', 'font-size: 14px; font-weight: bold; color: #22C55E;');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`Connect Time: ${connectTime}ms`);
            console.log(`Render Time: ${renderTime}ms`);
        }, 0);
    });
}

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.message);
});

// ===== Service Worker Registration (for PWA - Optional) =====
if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // window.addEventListener('load', function() {
    //     navigator.serviceWorker.register('/sw.js')
    //         .then(function(registration) {
    //             console.log('ServiceWorker registered:', registration);
    //         })
    //         .catch(function(error) {
    //             console.log('ServiceWorker registration failed:', error);
    //         });
    // });
}


/**
 * Rajdhani General Trading (RGT) - Custom JS Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Page Loader ---
    window.addEventListener('load', () => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.classList.add('fade-out');
            // Remove from layout after fade animation
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }
    });

    // --- AOS (Animate On Scroll) Initialization ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        });
    }

    // --- Scroll Progress Bar & Sticky Header ---
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.navbar-custom');
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Progress bar width
        if (scrollProgress && totalHeight > 0) {
            const progress = (scrollPosition / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Sticky Navbar transitions
        if (navbar) {
            if (scrollPosition > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }

        // Back to Top visibility
        if (backToTopBtn) {
            if (scrollPosition > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    // --- Back to Top Click Action ---
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('.navbar-custom a[href^="#"], .hero-content a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }

                const offset = 80; // height of sticky header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Link Highlighting on Scroll (Scrollspy alternative) ---
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');

    const scrollSpy = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const threshold = 120; // offset for detection

        sections.forEach(section => {
            const sectionTop = section.offsetTop - threshold;
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
    };
    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Initial call

    // --- Animated Statistics Counter ---
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-counter');
        const speed = 200; // lower is faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = Math.ceil(target / speed);

                if (count < target) {
                    counter.innerText = count + increment;
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer to trigger counters when visible
    const statsSection = document.querySelector('.hero-stats-wrapper');
    if (statsSection) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // --- Contact Form Submission & Validation ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation check
            const name = document.getElementById('formName').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const product = document.getElementById('formProduct').value;
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !phone || !email || !product || !message) {
                showNotification('Please fill in all fields before sending.', 'warning');
                return;
            }

            // Mock success response
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

            setTimeout(() => {
                showNotification(`Inquiry Sent! Thank you ${name}, we will contact you shortly regarding ${product}.`, 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    // Custom Toast Notification System
    function showNotification(message, type = 'success') {
        // Create container if not exists
        let toastContainer = document.querySelector('.toast-container-custom');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container-custom';
            // Styling for toast container directly
            Object.assign(toastContainer.style, {
                position: 'fixed',
                bottom: '30px',
                left: '30px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });
            document.body.appendChild(toastContainer);
        }

        // Create Toast
        const toast = document.createElement('div');
        toast.className = `custom-toast toast-${type}`;
        
        // Icon based on type
        let icon = '<i class="bi bi-check-circle-fill"></i>';
        let bg = 'linear-gradient(135deg, #0B3B91 0%, #1555c5 100%)'; // default blue
        
        if (type === 'warning') {
            icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
            bg = 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)';
        } else if (type === 'success') {
            icon = '<i class="bi bi-check2-all"></i>';
            bg = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        }

        Object.assign(toast.style, {
            background: bg,
            color: '#fff',
            padding: '15px 25px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.95rem',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif",
            minWidth: '300px',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });

        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        // Animation in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 50);

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    }
});

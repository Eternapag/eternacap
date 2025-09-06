document.addEventListener('DOMContentLoaded', function () {
    
    // Lógica principal da página (Video, Swiper, Animações, Contadores, Menu)
    // =========================================================================

    // Hero Section Video Logic
    const heroSection = document.getElementById('hero-section');
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    
    window.addEventListener('load', () => {
        if (heroSection) {
            heroSection.classList.add('is-loaded');
        }
    });

    if (video1 && video2) {
        video1.addEventListener('ended', () => {
            video2.classList.remove('video-hidden');
            video1.classList.add('video-hidden');
            video2.play();
        });

        video2.addEventListener('ended', () => {
            video1.classList.remove('video-hidden');
            video2.classList.add('video-hidden');
            video1.play();
        });
    }

    // Swiper Carousel Initialization
    const loungeCarousel = new Swiper('.lounge-carousel', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Scroll Animation Observer
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-item').forEach(item => {
        scrollObserver.observe(item);
    });

    // Stats Counter Animation
    const statsContainer = document.getElementById('stats-container');
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const counters = entry.target.querySelectorAll('.counter-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    counter.innerText = '0';
                    const updateCounter = () => {
                        const current = +counter.innerText.replace(/\+/g, '');
                        const increment = target / 100;

                        if (current < target) {
                            counter.innerText = `+${Math.ceil(current + increment)}`;
                            setTimeout(updateCounter, 20);
                        } else {
                            counter.innerText = `+${target}`;
                        }
                    };
                    updateCounter();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // Disclaimer toggle for mobile
    const disclaimerToggle = document.getElementById('toggle-disclaimer');
    const disclaimerContent = document.getElementById('disclaimer-content');
    const disclaimerArrow = document.getElementById('disclaimer-arrow');

    if (disclaimerToggle && disclaimerContent && disclaimerArrow) {
        disclaimerToggle.addEventListener('click', () => {
            disclaimerContent.classList.toggle('is-open');
            disclaimerArrow.classList.toggle('is-open');
        });
    }

    // Mobile Menu Logic
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconOpen = document.getElementById('menu-icon-open');
    const menuIconClose = document.getElementById('menu-icon-close');

    if (mobileMenuButton && mobileMenu && menuIconOpen && menuIconClose) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-open');
            menuIconOpen.classList.toggle('hidden');
            menuIconClose.classList.toggle('hidden');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Lógica do Popup de Alerta
    // =========================================================================
    const alertPopup = document.getElementById('alert-popup');
    if (alertPopup) {
        const closeAlertButton = document.getElementById('close-popup-button');
        const confirmButton = document.getElementById('confirm-button');
        const dontShowAgainCheckbox = document.getElementById('dont-show-again');
        const modalContent = alertPopup.querySelector('div');

        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const setCookie = (name, value, days) => {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = `; expires=${date.toUTCString()}`;
            }
            document.cookie = `${name}=${value || ""}${expires}; path=/`;
        };

        const showAlertPopup = () => {
            alertPopup.classList.remove('hidden');
            setTimeout(() => {
                alertPopup.classList.add('opacity-100');
                if (modalContent) modalContent.classList.add('scale-100');
            }, 10);
        };
        
        const closeAlertPopup = () => {
            if (dontShowAgainCheckbox.checked) {
                setCookie('hideAlert', 'true', 5);
            }
            
            alertPopup.classList.remove('opacity-100');
            if (modalContent) modalContent.classList.remove('scale-100');
            
            setTimeout(() => {
                alertPopup.classList.add('hidden');
            }, 300);
        };

        if (!getCookie('hideAlert')) {
            setTimeout(showAlertPopup, 1000);
        }

        if (closeAlertButton) closeAlertButton.addEventListener('click', closeAlertPopup);
        if (confirmButton) confirmButton.addEventListener('click', closeAlertPopup);
    }
    
    // Lógica do Popup de Fim de Página
    // =========================================================================
    const eopPopup = document.getElementById('end-of-page-popup');
    if (eopPopup) {
        const closeEopButton = document.getElementById('close-eop-popup');
        let popupHasBeenTriggered = false;

        const showEopPopup = () => {
            if (sessionStorage.getItem('endOfPagePopupShown')) {
                return;
            }
            eopPopup.classList.add('is-visible');
            sessionStorage.setItem('endOfPagePopupShown', 'true'); 
            popupHasBeenTriggered = true;
        };

        const hideEopPopup = () => {
            eopPopup.classList.remove('is-visible');
        };

        window.addEventListener('scroll', () => {
            if (popupHasBeenTriggered) {
                return;
            }
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.body.offsetHeight;
            
            if (scrollPosition >= pageHeight - 100) {
                showEopPopup();
            }
        });

        if (closeEopButton) {
            closeEopButton.addEventListener('click', hideEopPopup);
        }
    }
});
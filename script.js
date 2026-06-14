/* ==========================================================================
   ACTORS THEATRE@RAJASTHAN - JAVASCRIPT INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Header Scrolled State
    const header = document.querySelector('.header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially in case page is refreshed while scrolled down

    // 2. Mobile Menu Navigation
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-item');

    const toggleMobileMenu = () => {
        const isActive = navLinks.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-active', isActive);
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a nav item is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.classList.remove('mobile-menu-active');
        });
    });

    // 3. Dynamic Text Rotator (Hero Section)
    class TxtRotate {
        constructor(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.tick();
            this.isDeleting = false;
        }
        tick() {
            let i = this.loopNum % this.toRotate.length;
            let fullTxt = this.toRotate[i];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

            let that = this;
            let delta = 200 - Math.random() * 100;

            if (this.isDeleting) { delta /= 2; }

            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.loopNum++;
                delta = 500;
            }

            setTimeout(() => {
                that.tick();
            }, delta);
        }
    }

    const rotators = document.querySelectorAll('.txt-rotate');
    rotators.forEach(rotator => {
        const toRotate = rotator.getAttribute('data-rotate');
        const period = rotator.getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(rotator, JSON.parse(toRotate), period);
        }
    });

    // 4. Plays Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const playCards = document.querySelectorAll('.play-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons and add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            playCards.forEach(card => {
                // Get the category attribute
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 5. Scroll Animation Intersection Observer
    const scrollAnims = document.querySelectorAll('.scroll-anim');
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, observerOptions);

    scrollAnims.forEach(anim => {
        observer.observe(anim);
    });

    // 6. Navigation Active Section Indicator
    const sections = document.querySelectorAll('section');
    const navItemsList = document.querySelectorAll('.nav-item');

    const updateActiveNav = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItemsList.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav);

    // 7. Modals (Registration Form)
    const modal = document.getElementById('registrationModal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Enable background scrolling
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);

    // Close modal if user clicks outside of the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 8. Contact Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const contactFormStatus = document.getElementById('contactFormStatus');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form field extraction
        const name = document.getElementById('cName').value;
        const phone = document.getElementById('cPhone').value;
        const email = document.getElementById('cEmail').value;
        const interest = document.getElementById('cInterest').value;
        const message = document.getElementById('cMessage').value;

        // Visual loading feedback
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Sending...';

        // Simulate API call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Success response representation
            contactFormStatus.textContent = "Thank you! Your inquiry was sent successfully. We will call you soon.";
            contactFormStatus.className = "form-status success";
            
            // Clear inputs
            contactForm.reset();

            // Clear status after 5s
            setTimeout(() => {
                contactFormStatus.style.opacity = '0';
                setTimeout(() => {
                    contactFormStatus.className = "form-status";
                    contactFormStatus.textContent = "";
                    contactFormStatus.style.opacity = '1';
                }, 400);
            }, 5000);

        }, 1500);
    });

    // 9. Modal Registration Form Submission Handling
    const modalForm = document.getElementById('modalForm');
    const modalFormStatus = document.getElementById('modalFormStatus');

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Form field extraction
        const name = document.getElementById('mName').value;
        const phone = document.getElementById('mPhone').value;
        const email = document.getElementById('mEmail').value;
        const age = document.getElementById('mAge').value;
        const experience = document.getElementById('mExperience').value;

        // Visual loading feedback
        const submitBtn = modalForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Submitting...';

        // Simulate API call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Success response representation
            modalFormStatus.textContent = "Registration details saved! Our admissions desk will contact you.";
            modalFormStatus.className = "form-status success";
            
            // Clear inputs
            modalForm.reset();

            // Close modal after success, and clear messages
            setTimeout(() => {
                closeModal();
                // Clear modal status
                modalFormStatus.className = "form-status";
                modalFormStatus.textContent = "";
            }, 3000);

        }, 1500);
    });

});

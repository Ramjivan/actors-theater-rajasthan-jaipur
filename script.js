/* ==========================================================================
   ACTORS THEATRE@RAJASTHAN - JAVASCRIPT INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const languageSelect = document.getElementById('languageSelect');

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
            this.isDeleting = false;
            this.timeoutId = null;
            this.tick();
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

            this.timeoutId = setTimeout(() => {
                that.tick();
            }, delta);
        }
        updateRotateList(newList) {
            this.toRotate = newList;
            this.loopNum = 0;
            this.isDeleting = false;
            this.txt = '';
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.tick();
        }
    }

    let activeRotatorInstance = null;
    const rotators = document.querySelectorAll('.txt-rotate');
    rotators.forEach(rotator => {
        const toRotate = rotator.getAttribute('data-rotate');
        const period = rotator.getAttribute('data-period');
        if (toRotate) {
            activeRotatorInstance = new TxtRotate(rotator, JSON.parse(toRotate), period);
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

    // 10. Light/Dark Theme Switcher
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const toggleIcon = themeToggleBtn.querySelector('i');
    
    // Check saved theme or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        toggleIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        if (isDark) {
            localStorage.setItem('theme', 'dark');
            toggleIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            toggleIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 11. Navarasa Interactive Widget
    const rasaButtons = document.querySelectorAll('.rasa-btn');
    const rasaDisplay = document.getElementById('rasaDisplayContent');
    const rasaIconBadge = document.getElementById('rasaIconBadge');
    const rasaTitle = document.getElementById('rasaTitle');
    const rasaSentiment = document.getElementById('rasaSentiment');
    const rasaDesc = document.getElementById('rasaDesc');
    const rasaFocus = document.getElementById('rasaFocus');

    rasaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            
            // Remove active classes
            rasaButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Transition effect
            rasaDisplay.classList.add('fade-out');

            setTimeout(() => {
                // Update elements
                const currentLang = languageSelect ? languageSelect.value : 'en';
                updateRasaDisplay(currentLang);

                // Fade back in
                rasaDisplay.classList.remove('fade-out');
            }, 350);
        });
    });

    // 12. Glassmorphic Image Lightbox
    const lightbox = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    
    // Select images to trigger lightbox
    const triggerImages = document.querySelectorAll('.gallery-item img, .clipping-card img');
    
    triggerImages.forEach(img => {
        img.style.cursor = 'pointer'; // Ensure visual cue
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt || 'Media Clipping';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    };

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Escape key press support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 13. Dynamic Hero Spotlight (Mouse-Follower)
    const heroSection = document.getElementById('home');
    const heroSpotlight = heroSection.querySelector('.hero-spotlight');

    if (heroSection && heroSpotlight) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Set position percentage on custom properties
            heroSpotlight.style.setProperty('--mouse-x', `${x.toFixed(2)}%`);
            heroSpotlight.style.setProperty('--mouse-y', `${y.toFixed(2)}%`);
        });

        heroSection.addEventListener('mouseleave', () => {
            // Smoothly reset spotlight to default values
            heroSpotlight.style.setProperty('--mouse-x', '50%');
            heroSpotlight.style.setProperty('--mouse-y', '30%');
        });
    }

    // 14. Translation Dictionary & Engine
    const translations = {
        en: {
            "site-title": "Actors Theatre@Rajasthan | Acting Academy & Theatre Group Jaipur",
            "top-bar-wa": "WhatsApp",
            "logo-sub": "ACTORS THEATRE",
            "logo-main": "@RAJASTHAN",
            "nav-home": "Home",
            "nav-about": "About",
            "nav-workshops": "Workshops",
            "nav-productions": "Productions",
            "nav-festival": "Raj Rangam",
            "nav-gallery": "Gallery",
            "nav-updates": "Updates",
            "nav-press": "Press",
            "nav-contact": "Contact",
            "btn-join-workshop": "Join Workshop",
            "hero-tagline": "Jaipur's Leading Theatre & Acting Academy",
            "hero-title-prefix": "Master the Art of",
            "hero-desc": "Step into the spotlight. Explore professional theatre workshops, classical training, and national stage productions dedicated to preserving cultural heritage and creating social awareness.",
            "hero-btn-workshops": "Explore Workshops",
            "hero-btn-plays": "Our Plays",
            "about-subtitle": "Who We Are",
            "about-title": "Nurturing Creative Talents",
            "about-group-name": "Actors Theatre@Rajasthan",
            "about-p1": "Actors Theatre@Rajasthan (ATR) is a premier registered cultural organization dedicated to promoting, researching, and teaching theatre arts in Jaipur. Operating in close association with the Actors Academy of Rajasthan, the group has become a vital hub for dramatic excellence, training hundreds of aspiring actors and preserving traditional performance arts.",
            "about-p2": "We work in collaboration with national and state institutions, including the Ministry of Culture (Govt. of India), Sangeet Natak Akademi, and Jawahar Kala Kendra (JKK). Our productions focus on documenting oral folklore history while raising public awareness about pressing social themes.",
            "stat-1-num": "30+", "stat-1-label": "Years of Legacy",
            "stat-2-num": "500+", "stat-2-label": "Students Trained",
            "stat-3-num": "25+", "stat-3-label": "Major Productions",
            "stat-4-num": "5+", "stat-4-label": "National Grants",
            "director-role": "Director",
            "director-name": "Dr. Chandradeep Hada",
            "director-titles": "Ph.D. in Dramatics | UGC NET | Senior Fellow",
            "director-desc": "Dr. Chandradeep Hada is a veteran performing artist, director, researcher, and educator. With a Ph.D. in Dramatic Arts, he has spent decades training youth in voice culture and body language. He is recognized by the Ministry of Culture for documenting Rajasthani folk arts (such as Kachchhi Ghodi dance) and has directed numerous acclaimed plays across India.",
            "workshops-subtitle": "Flagship Workshops",
            "workshops-title": "Intensive Acting Workshops",
            "workshops-badge": "Admissions Open",
            "workshops-duration": "30-Day Production Oriented Program",
            "workshops-details-title": "Acting & Personality Development",
            "workshops-details-tagline": "Unleash your creative potential, build stage presence, and master performance techniques. Join our next cohort in Jaipur!",
            "curr-1-title": "Classical & Modern Theories",
            "curr-1-desc": "Deep study of Bharat Muni's Natyashastra (Rasa & Bhava), Stanislavski's Method, and Brechtian Epic Theatre.",
            "curr-2-title": "Voice & Body Language",
            "curr-2-desc": "Voice modulation, projection, pronunciation clarity, physical expression, stage movement, and mime.",
            "curr-3-title": "Camera Acting Techniques",
            "curr-3-desc": "Understanding screen space, lens focus, micro-expressions, scripting, and adapting stage acting for the screen.",
            "meta-batches-label": "Batches", "meta-batches-val": "Evening (5:30 PM - 8:30 PM)",
            "meta-location-label": "Location", "meta-location-val": "Tonk Road, Jaipur",
            "meta-outcome-label": "Outcome", "meta-outcome-val": "Live Stage Play & Certificate",
            "btn-register-now": "Register Online Now",
            "btn-whatsapp-query": "Enquire on WhatsApp",
            "navarasa-subtitle": "The Actor's Craft",
            "navarasa-title": "Navarasa: The Nine Emotions",
            "navarasa-intro": "In Indian classical drama, the Natyashastra defines nine primary aesthetic sentiments (Rasas). ATR students master these emotions to cultivate complete control over voice, breath, and expression.",
            "rasa-focus-title": "ATR Training Focus:",
            "plays-subtitle": "Our Stagecraft",
            "plays-title": "Acclaimed Productions",
            "filter-all": "All Plays",
            "filter-historical": "Historical / Biopic",
            "filter-social": "Social & Modern",
            "filter-comedy": "Folk & Comedy",
            "play-1-tag": "Historical",
            "play-1-title": "Kalpurush: Krantikari Veer Savarkar",
            "play-1-sub": "Patriotic Biography",
            "play-1-desc": "A powerful presentation showcasing the life, cellular jail struggles, and philosophical thoughts of Vinayak Damodar Savarkar. Highlighted by high-impact monologues, it evokes a deep sense of national pride and sacrifice.",
            "play-2-tag": "Historical",
            "play-2-title": "Agnipath",
            "play-2-sub": "Biopic of Netaji Subhash Chandra Bose",
            "play-2-desc": "A highly emotional, patriotic stage drama tracing Netaji Bose's heroic struggle, the formation of the Azad Hind Fauj, and his indomitable spirit. Dedicated to fostering national pride among youth.",
            "play-3-tag": "Social / Modern",
            "play-3-title": "Meri Maa",
            "play-3-sub": "Tribute to Motherhood & Social Integrity",
            "play-3-desc": "A heart-touching family drama that captures maternal sacrifice and highlights critical societal issues like the isolation of parents in modern times, encouraging family values and compassion.",
            "play-4-tag": "Folk / Comedy",
            "play-4-title": "The Great Raja Master Drama Company",
            "play-4-sub": "Parsi Style Satirical Comedy",
            "play-4-desc": "A hilarious tribute to India's traditional commercial theatre companies. Features spectacular physical comedy and deep satirical insights on preserving historical theatrical methods.",
            "play-5-tag": "Social / Modern",
            "play-5-title": "Chuno Vahi Jo Ho Sahi",
            "play-5-sub": "Street Awareness Play",
            "play-5-desc": "Staged in collaboration with municipal and election departments, this street-style play raises awareness about democratic values, voting duties, and civic responsibility.",
            "play-dir": "Dir. Dr. C.D. Hada",
            "play-mins": "Mins",
            "fest-badge": "Annual Celebration",
            "fest-title": "Rajasthan Rang Mahotsav (Raj Rangam)",
            "fest-p1": "Under the vision of Dr. Chandradeep Hada, ATR organizes Raj Rangam, a major annual theatre festival celebrating national performing arts. This festival acts as a vibrant cultural bridge, bringing together acclaimed directors and playwrights from all over India to showcase plays in Jaipur.",
            "fest-p2": "The festival hosts diverse play performances, street theatre (Nukkad Natak), scholarly seminars on Natyashastra, and exhibitions tracing the historical legacy of folk theatre, serving to preserve our intangible oral culture.",
            "fest-b1": "National Theatre Group Screenings",
            "fest-b2": "Panel Discussions and Art Exhibitions",
            "fest-b3": "Supported by Ministry of Culture & JKK",
            "promo-title": "Raj Rangam Highlights",
            "promo-t1": "National Plays Hosted Annually",
            "promo-t2": "Theater Enthusiasts Attend",
            "promo-t3": "Interactive Workshops & Seminars",
            "promo-btn": "Get Next Festival Updates",
            "gallery-subtitle": "Visual Journey",
            "gallery-title": "Gallery",
            "gallery-item-1": "Stage Lights",
            "gallery-item-2": "Workshop Practices",
            "gallery-item-3": "\"Agnipath\" Production",
            "gallery-item-4": "\"Meri Maa\" Production",
            "updates-subtitle": "Stay Updated",
            "updates-title": "Latest Updates & News",
            "updates-fb-link": "Actors Theatre@Rajasthan on Facebook",
            "press-subtitle": "In the Spotlight",
            "press-title": "Media Mentions & Press",
            "press-zoom": "View Press Coverage",
            "article-1-source": "Dainik Bhaskar",
            "article-1-title": "Dr. Chandradeep Hada Awarded Senior Fellowship for Cultural Research",
            "article-1-desc": "Local media reports on the prestigious fellowship awarded to Dr. Hada by the Ministry of Culture, Government of India, for documenting Rajasthan's traditional oral folk performing arts.",
            "article-2-source": "Rajasthan Patrika",
            "article-2-title": "Raj Rangam National Theatre Festival Captivates Jaipur Audience",
            "article-2-desc": "A detailed review of the annual theatre festival organized by Actors Theatre@Rajasthan at Jawahar Kala Kendra, showcasing dramatic excellence and cultural heritage.",
            "article-3-source": "The Times of India",
            "article-3-title": "30-Day Intensive Theatre Workshop Inaugurated in Jaipur",
            "article-3-desc": "Feature article covering the inauguration of ATR's flagship acting workshop on Tonk Road, highlighting voice culture, methods of expression, and personality development.",
            "contact-subtitle": "Connect With Us",
            "contact-title": "Get In Touch",
            "contact-info-title": "Contact Information",
            "contact-info-desc": "Have questions about our upcoming 30-day acting workshops, stage productions, or festival passes? Drop us a message.",
            "contact-addr-title": "Address",
            "contact-addr-val": "Siddhi Vinayak, P-3, Kisan Marg, W-2, Madhuban Colony, Tonk Road, Jaipur – 302015, Rajasthan, India",
            "contact-phone-title": "Call / WhatsApp",
            "contact-phone-wa": "Chat on WhatsApp",
            "contact-email-title": "Email Address",
            "contact-jd-title": "Justdial Listing",
            "contact-jd-val": "Justdial Profile",
            "contact-social-title": "Follow Our Socials",
            "form-title": "Send an Inquiry",
            "form-label-name": "Your Name",
            "form-label-phone": "Phone Number",
            "form-label-email": "Email Address",
            "form-label-interest": "Interest",
            "opt-interest-1": "30-Day Acting Workshop",
            "opt-interest-2": "Raj Rangam Festival Info",
            "opt-interest-3": "Collaboration / Hiring Plays",
            "opt-interest-4": "General Inquiry",
            "form-label-message": "Message",
            "btn-submit-inquiry": "Submit Inquiry",
            "footer-desc": "Preserving intangible cultural heritage, training modern actors, and staging award-winning drama across India.",
            "footer-links-title": "Quick Links",
            "footer-connect-title": "Connect",
            "footer-location": "Jaipur, Rajasthan, India",
            "footer-copyright": "© 2026 Actors Theatre@Rajasthan. All Rights Reserved. Crafted for Theatre Excellence.",
            "modal-title": "Workshop Registration",
            "modal-subtitle": "Join the upcoming 30-Day Intensive Acting & Personality Development Workshop in Jaipur.",
            "modal-label-age": "Age",
            "modal-label-exp": "Prior Theatre Experience (If any)",
            "btn-complete-reg": "Complete Registration",
            "floating-wa-tooltip": "Chat on WhatsApp"
        },
        hi: {
            "site-title": "एक्टर्स थियेटर@राजस्थान | एक्टिंग एकेडमी और ड्रामा ग्रुप जयपुर",
            "top-bar-wa": "व्हाट्सएप करें",
            "logo-sub": "एक्टर्स थियेटर",
            "logo-main": "@राजस्थान",
            "nav-home": "मुख्य पृष्ठ",
            "nav-about": "परिचय",
            "nav-workshops": "कार्यशालाएं",
            "nav-productions": "प्रस्तुतियां",
            "nav-festival": "राज रंगम",
            "nav-gallery": "गैलरी",
            "nav-updates": "नवीनतम समाचार",
            "nav-press": "समाचार जगत",
            "nav-contact": "संपर्क करें",
            "btn-join-workshop": "कार्यशाला में शामिल हों",
            "hero-tagline": "जयपुर की अग्रणी थिएटर और अभिनय अकादमी",
            "hero-title-prefix": "अभिनय की कला में",
            "hero-desc": "रंगमंच पर कदम रखें। संस्कृति संरक्षण, राष्ट्रीय स्वाभिमान तथा सामाजिक जागरूकता के लिए समर्पित हमारे व्यावसायिक थिएटर कार्यशालाओं, शास्त्रीय प्रशिक्षण और राष्ट्रीय स्तर के नाटकों से जुड़ें।",
            "hero-btn-workshops": "कार्यशालाओं की जानकारी",
            "hero-btn-plays": "हमारे नाटक",
            "about-subtitle": "हमारा परिचय",
            "about-title": "रचनात्मक प्रतिभाओं को निखारना",
            "about-group-name": "एक्टर्स थिएटर@राजस्थान",
            "about-p1": "एक्टर्स थिएटर@राजस्थान (ATR) जयपुर में रंगमंच कला को बढ़ावा देने, शोध करने और सिखाने के लिए समर्पित एक प्रमुख पंजीकृत सांस्कृतिक संगठन है। एक्टर्स एकेडमी ऑफ राजस्थान के साथ मिलकर यह संस्थान अभिनय में उत्कृष्टता का केंद्र बन चुका है, जिसने सैकड़ों अभिनेताओं को प्रशिक्षित किया है।",
            "about-p2": "हम भारत सरकार के संस्कृति मंत्रालय, संगीत नाटक अकादमी और जवाहर कला केंद्र (JKK) जैसे राष्ट्रीय व राजकीय संस्थानों के सहयोग से कार्य करते हैं। हमारी प्रस्तुतियां मौखिक लोक इतिहास को सहेजने के साथ-साथ गंभीर सामाजिक मुद्दों पर जन-जागरूकता फैलाने पर केंद्रित हैं।",
            "stat-1-num": "30+ वर्ष", "stat-1-label": "गौरवशाली इतिहास",
            "stat-2-num": "500+", "stat-2-label": "प्रशिक्षित छात्र",
            "stat-3-num": "25+", "stat-3-label": "मुख्य रंगमंचीय प्रस्तुतियां",
            "stat-4-num": "5+", "stat-4-label": "राष्ट्रीय अनुदान",
            "director-role": "निदेशक",
            "director-name": "डॉ. चंद्रदीप हाड़ा",
            "director-titles": "नाट्य शास्त्र में पीएच.डी. | यूजीसी नेट | सीनियर फेलो",
            "director-desc": "डॉ. चंद्रदीप हाड़ा एक वरिष्ठ रंगमंच कलाकार, निर्देशक, शोधकर्ता और शिक्षाविद हैं। नाट्य शास्त्र में पीएच.डी. के साथ, उन्होंने युवाओं को आवाज संस्कृति (वॉइस कल्चर) और शारीरिक हाव-भाव में प्रशिक्षित करने में दशकों बिताए हैं। राजस्थान की पारंपरिक लोक कलाओं (जैसे कच्छी घोड़ी नृत्य) के प्रलेखन के लिए उन्हें संस्कृति मंत्रालय से सीनियर फेलोशिप प्राप्त है और उन्होंने देशभर में कई ऐतिहासिक नाटकों का सफल निर्देशन किया है।",
            "workshops-subtitle": "अभिनय कार्यशाला",
            "workshops-title": "गहन अभिनय प्रशिक्षण कार्यशाला",
            "workshops-badge": "प्रवेश प्रारंभ",
            "workshops-duration": "30 दिवसीय नाटक-उन्मुख कार्यक्रम",
            "workshops-details-title": "अभिनय एवं व्यक्तित्व विकास",
            "workshops-details-tagline": "अपनी रचनात्मक क्षमता को उजागर करें, मंच पर उपस्थिति और प्रदर्शन तकनीकों में महारत हासिल करें। जयपुर में हमारे नए बैच में शामिल हों!",
            "curr-1-title": "शास्त्रीय एवं आधुनिक नाट्य सिद्धांत",
            "curr-1-desc": "भरत मुनि के नाट्यशास्त्र (रस और भाव), स्तानिस्लावस्की के अभिनय सिद्धांत और ब्रेख्त के महाकाव्यात्मक रंगमंच (एपिक थिएटर) का गहन अध्ययन।",
            "curr-2-title": "आवाज और शारीरिक हाव-भाव",
            "curr-2-desc": "आवाज में उतार-चढ़ाव (वॉइस मॉड्यूलेशन), स्पष्ट उच्चारण, शारीरिक अभिव्यक्ति, मंच पर हलचल और मूक अभिनय (माईम)।",
            "curr-3-title": "कैमरा एक्टिंग तकनीक",
            "curr-3-desc": "स्क्रीन स्पेस, लेंस फोकस, सूक्ष्म चेहरे के भाव, पटकथा की समझ और कैमरे के अनुकूल अभिनय को ढालना।",
            "meta-batches-label": "बैच समय", "meta-batches-val": "शाम (5:30 बजे से 8:30 बजे)",
            "meta-location-label": "स्थान", "meta-location-val": "टोंक रोड, जयपुर",
            "meta-outcome-label": "परिणाम", "meta-outcome-val": "मंच पर लाइव नाटक प्रदर्शन एवं प्रमाण पत्र",
            "btn-register-now": "ऑनलाइन पंजीकरण करें",
            "btn-whatsapp-query": "व्हाट्सएप पर संपर्क करें",
            "navarasa-subtitle": "अभिनय पद्धति",
            "navarasa-title": "नवरस: नौ मूल भावनाएं",
            "navarasa-intro": "भारतीय शास्त्रीय नाट्य परंपरा में, भरतमुनि प्रणीत नाट्यशास्त्र नौ रसों (नवरस) को अभिनय का आधार मानता है। छात्र इन रसों पर नियंत्रण पाकर ही वाणी, श्वास और भाव-भंगिमा पर अधिकार हासिल करते हैं।",
            "rasa-focus-title": "अभिनय अभ्यास:",
            "plays-subtitle": "हमारे नाटक",
            "plays-title": "प्रतिष्ठित नाट्य प्रस्तुतियां",
            "filter-all": "सभी नाटक",
            "filter-historical": "ऐतिहासिक / बायोपिक",
            "filter-social": "सामाजिक और आधुनिक",
            "filter-comedy": "लोक और हास्य",
            "play-1-tag": "ऐतिहासिक",
            "play-1-title": "कालपुरुष: क्रांतिकारी वीर सावरकर",
            "play-1-sub": "देशभक्ति पूर्ण जीवनी",
            "play-1-desc": "विनायक दामोदर सावरकर के जीवन, सेल्युलर जेल के संघर्षों और उनके राष्ट्रवादी विचारों को दर्शाने वाला एक शक्तिशाली नाटक। यह दर्शकों में राष्ट्रीय गौरव और देशभक्ति की भावना जागृत करता है।",
            "play-2-tag": "ऐतिहासिक",
            "play-2-title": "अग्निपथ",
            "play-2-sub": "नेताजी सुभाष चंद्र बोस के जीवन पर आधारित",
            "play-2-desc": "आजाद हिंद फौज के गठन, नेताजी बोस के संघर्षों और उनके अदम्य साहस को रेखांकित करने वाला एक राष्ट्रभक्ति से ओत-प्रोत नाटक, जो युवाओं में राष्ट्रीय स्वाभिमान जगाता है।",
            "play-3-tag": "सामाजिक / आधुनिक",
            "play-3-title": "मेरी माँ",
            "play-3-sub": "मातृत्व एवं पारिवारिक मूल्यों को समर्पित",
            "play-3-desc": "एक मर्मस्पर्शी पारिवारिक नाटक जो आधुनिक समाज में माता-पिता की उपेक्षा और अकेलेपन जैसी गंभीर सामाजिक समस्याओं को उजागर करते हुए स्नेह और पारिवारिक मूल्यों की सीख देता है।",
            "play-4-tag": "लोक / हास्य",
            "play-4-title": "द ग्रेट राजा मास्टर ड्रामा कंपनी",
            "play-4-sub": "पारंपरिक पारसी शैली का व्यंग्य नाटक",
            "play-4-desc": "भारत की पारंपरिक व्यावसायिक ड्रामा कंपनियों को समर्पित एक हास्य नाटक, जिसमें पारसी शैली के गीत-संगीत और व्यंग्य के माध्यम से लोक-संस्कृति को सहेजा गया है।",
            "play-5-tag": "सामाजिक / आधुनिक",
            "play-5-title": "चुनो वही जो हो सही",
            "play-5-sub": "नुक्कड़ व जन-जागरूकता नाटक",
            "play-5-desc": "निर्वाचन विभाग के सहयोग से मंचित यह नाटक मतदाताओं को उनके लोकतांत्रिक अधिकारों, मतदान की अनिवार्यता और नागरिक कर्तव्यों के प्रति जागरूक करता है।",
            "play-dir": "निदेशक: डॉ. सी.डी. हाड़ा",
            "play-mins": "मिनट",
            "fest-badge": "वार्षिक नाट्य महोत्सव",
            "fest-title": "राजस्थान रंग महोत्सव (राज रंगम)",
            "fest-p1": "डॉ. चंद्रदीप हाड़ा के कुशल मार्गदर्शन में, ATR प्रतिवर्ष 'राज रंगम' का आयोजन करता है, जो जयपुर का एक प्रमुख राष्ट्रीय नाट्य महोत्सव है। यह महोत्सव देशभर के नामचीन निर्देशकों और नाट्य टोलियों को जयपुर में अपनी कला प्रदर्शित करने का मंच देता है।",
            "fest-p2": "इस महोत्सव में विभिन्न नाटक प्रदर्शन, नुक्कड़ नाटक, नाट्यशास्त्र पर संगोष्ठियां और लोक-कलाकारों की विरासत को प्रदर्शित करने वाली प्रदर्शनियां आयोजित की जाती हैं, जो हमारी अमूर्त सांस्कृतिक धरोहर का संरक्षण करती हैं।",
            "fest-b1": "राष्ट्रीय नाट्य टोलियों का मंचन",
            "fest-b2": "विचार गोष्ठियां एवं कला प्रदर्शनियां",
            "fest-b3": "संस्कृति मंत्रालय और जेकेके (JKK) द्वारा समर्थित",
            "promo-title": "राज रंगम महोत्सव की मुख्य विशेषताएं",
            "promo-t1": "10+ राष्ट्रीय नाटक प्रतिवर्ष",
            "promo-t2": "3000+ कला प्रेमी शामिल होते हैं",
            "promo-t3": "5+ संवाद सत्र और कार्यशालाएं",
            "promo-btn": "आगामी महोत्सव के अपडेट प्राप्त करें",
            "gallery-subtitle": "चित्र गैलरी",
            "gallery-title": "गैलरी",
            "gallery-item-1": "मंच की रोशनी",
            "gallery-item-2": "अभ्यास सत्र",
            "gallery-item-3": "\"अग्निपथ\" नाट्य प्रस्तुति",
            "gallery-item-4": "\"मेरी माँ\" नाट्य प्रस्तुति",
            "updates-subtitle": "ताजा जानकारी",
            "updates-title": "नवीनतम समाचार और अपडेट",
            "updates-fb-link": "फेसबुक पर हमारे समाचार देखें",
            "press-subtitle": "अखबारों की कतरनें",
            "press-title": "समाचार पत्रों में हमारा रंगमंच",
            "press-zoom": "समाचार पत्रों की खबरें देखें",
            "article-1-source": "दैनिक भास्कर",
            "article-1-title": "डॉ. चंद्रदीप हाड़ा को लोक सांस्कृतिक विरासत पर शोध के लिए मिली सीनियर फेलोशिप",
            "article-1-desc": "भारत सरकार के संस्कृति मंत्रालय द्वारा राजस्थान के पारंपरिक लोक नाट्य और मौखिक इतिहास के प्रलेखन के लिए डॉ. हाड़ा को प्रतिष्ठित फेलोशिप प्रदान किए जाने की खबर।",
            "article-2-source": "राजस्थान पत्रिका",
            "article-2-title": "राज रंगम राष्ट्रीय नाट्य महोत्सव ने जयपुरवासियों का दिल जीता",
            "article-2-desc": "जवाहर कला केंद्र में आयोजित भव्य नाट्य महोत्सव की समीक्षा, जिसमें देशभर की नाट्य शैलियों और लोक परंपराओं को सहेजने के प्रयासों को सराहा गया।",
            "article-3-source": "द टाइम्स ऑफ इंडिया",
            "article-3-title": "जयपुर में 30 दिवसीय अभिनय कार्यशाला का शानदार शुभारंभ",
            "article-3-desc": "टोंक रोड पर आयोजित अभिनय कार्यशाला के उद्घाटन की रिपोर्ट, जिसमें आवाज, संवाद अदायगी और व्यक्तित्व विकास पर विशेष जोर दिया गया।",
            "contact-subtitle": "संपर्क सूत्र",
            "contact-title": "हमसे जुड़ें",
            "contact-info-title": "संपर्क जानकारी",
            "contact-info-desc": "कार्यशालाओं में प्रवेश, नाटकों के आयोजन या महोत्सव से संबंधित किसी भी प्रश्न के लिए हमें संदेश भेजें।",
            "contact-addr-title": "पता",
            "contact-addr-val": "सिद्धि विनायक, P-3, किसान मार्ग, W-2, मधुबन कॉलोनी, टोंक रोड, जयपुर – 302015, राजस्थान, भारत",
            "contact-phone-title": "फ़ोन / व्हाट्सएप",
            "contact-phone-wa": "व्हाट्सएप पर चैट करें",
            "contact-email-title": "ईमेल पता",
            "contact-jd-title": "जस्टडायल सूची",
            "contact-jd-val": "जस्टडायल प्रोफाइल देखें",
            "contact-social-title": "सोशल मीडिया पर हमें फॉलो करें",
            "form-title": "पूछताछ भेजें",
            "form-label-name": "आपका नाम",
            "form-label-phone": "फ़ोन नंबर",
            "form-label-email": "ईमेल पता",
            "form-label-interest": "रुचि का विषय",
            "opt-interest-1": "30-दिवसीय अभिनय कार्यशाला",
            "opt-interest-2": "राज रंगम महोत्सव जानकारी",
            "opt-interest-3": "नाट्य मंचन सहयोग / आमंत्रण",
            "opt-interest-4": "सामान्य पूछताछ",
            "form-label-message": "संदेश",
            "btn-submit-inquiry": "पूछताछ भेजें",
            "footer-desc": "लोक सांस्कृतिक धरोहर का संरक्षण, नए कलाकारों का प्रशिक्षण और देश भर में संदेशपरक नाटकों का सफल मंचन।",
            "footer-links-title": "त्वरित लिंक",
            "footer-connect-title": "संपर्क",
            "footer-location": "जयपुर, राजस्थान, भारत",
            "footer-copyright": "© 2026 एक्टर्स थिएटर@राजस्थान। सर्वाधिकार सुरक्षित।",
            "modal-title": "कार्यशाला पंजीकरण",
            "modal-subtitle": "जयपुर में आयोजित होने वाली आगामी 30-दिवसीय गहन अभिनय और व्यक्तित्व विकास कार्यशाला से जुड़ें।",
            "modal-label-age": "आयु",
            "modal-label-exp": "पूर्व रंगमंच अनुभव (यदि कोई हो)",
            "btn-complete-reg": "पंजीकरण पूर्ण करें",
            "floating-wa-tooltip": "व्हाट्सएप पर बात करें"
        },
        rj: {
            "site-title": "एक्टर्स थियेटर@राजस्थान | अभिनय अर नाटक अकादमी, जयपुर",
            "top-bar-wa": "व्हाट्सएप करो",
            "logo-sub": "एक्टर्स थियेटर",
            "logo-main": "@राजस्थान",
            "nav-home": "मुख्य पन्नो",
            "nav-about": "ओळखाण",
            "nav-workshops": "सीखण री क्लास",
            "nav-productions": "म्हारा नाटक",
            "nav-festival": "राज रंगम",
            "nav-gallery": "तस्वीरां",
            "nav-updates": "नवा समाचार",
            "nav-press": "समाचार जगत",
            "nav-contact": "बातचीत करो",
            "btn-join-workshop": "कार्यशाला सूं जुड़ो",
            "hero-tagline": "जयपुर री सिरमौर्य थिएटर अर अभिनय अकादमी",
            "hero-title-prefix": "मंच री कला सीखो",
            "hero-desc": "मंच माथे पधारो। आपणी संस्कृति ने बचावण, देस रा मान-मर्यादा अर समाज री कुरीतियों ने मिटावण वास्ते नाटक अर अभिनय री सीख लेवो। डॉ. चंद्रदीप हाड़ा सा सूं सीखो।",
            "hero-btn-workshops": "क्लास री ओळखाण",
            "hero-btn-plays": "म्हारा नाटक",
            "about-subtitle": "महारो परिचय",
            "about-title": "नयी प्रतिभावां ने संवारणो",
            "about-group-name": "एक्टर्स थिएटर@राजस्थान",
            "about-p1": "एक्टर्स थिएटर@राजस्थान (ATR) जयपुर री एक मोटी अर नामचीन सांकृतिक संस्था है। जिकि राजस्थान री लोक कलावां ने बचावण, उण माथे खोज करण अर टाबरां ने नाटक सीखोण रो काम करे है। एक्टर्स एकेडमी ऑफ राजस्थान रे सागे मिळकर इण क्षेत्र में ओ एक मोटो नाम बण गयो है।",
            "about-p2": "मे भारत सरकार रा सांकृतिक मंत्रालय, संगीत नाटक अकादमी अर जवाहर कला केंद्र रे सागे मिळकर काम करां। म्हारा नाटका रो मुख्य काम आपणी लोक कलावां, जुनी बातां ने सहेजणो अर समाज में अच्छो संदेश देवणो है।",
            "stat-1-num": "30+ बरस", "stat-1-label": "म्हारो इतिहास",
            "stat-2-num": "500 सूं बेसी", "stat-2-label": "टाबरां री सीख",
            "stat-3-num": "25 सूं बेसी", "stat-3-label": "बड़ा नाटक",
            "stat-4-num": "5 सूं बेसी", "stat-4-label": "सरकारी मदद",
            "director-role": "निदेशक",
            "director-name": "डॉ. चंद्रदीप हाड़ा",
            "director-titles": "नाट्य शास्त्र में पीएच.डी. | सीनियर फेलो",
            "director-desc": "डॉ. चंद्रदीप हाड़ा सा रंगमंच रा एक घणा आदरणीय कलाकार, निदेशक अर गुरु है। आप नाट्य कला में पीएच.डी. धारी है अर संस्कृति मंत्रालय सूं आपणे राजस्थान री लोक नृत्य कला (कच्छी घोड़ी नृत्य) माथे खोज करण वास्ते सीनियर फेलोशिप मिळ्योड़ी है। आप देस भर में घणा ऐतिहासिक नाटका रो निर्देशन कर्यो है।",
            "workshops-subtitle": "सीखण री क्लास",
            "workshops-title": "अभिनय अर नाटक री सीख",
            "workshops-badge": "प्रवेश चालू है",
            "workshops-duration": "30 दिनां री विशेष कार्यशाला",
            "workshops-details-title": "अभिनय अर खुद रो विकास",
            "workshops-details-tagline": "मंच माथे बोलणो, आवाज रो उतार-चढ़ाव अर अभिनय री जादूगरी सीखो। जयपुर रे टोंक रोड माथे नवा बैच सूं जुड़ो!",
            "curr-1-title": "जुना अर नवा नाट्य शास्त्र री सीख",
            "curr-1-desc": "भरत मुनि रा नाट्यशास्त्र (रस अर भाव), स्तानिस्लावस्की री अभिनय तकनीक अर देसी नुक्कड़ नाटक रो गंतव्य अध्ययन।",
            "curr-2-title": "आवाज अर आंग-उपांग रो काम",
            "curr-2-desc": "आवाज रो भारीपण, साफ बोलणो, मूंड रा हाव-भाव, मंच माथे चालण री कला अर मूक अभिनय री सीख।",
            "curr-3-title": "कैमरा एक्टिंग री बारीकियां",
            "curr-3-desc": "लेंस रा सामना करणो, सूक्ष्म भाव-ताव, स्क्रिप्ट री समझ अर कैमरे रा अभिनय री खास सीख।",
            "meta-batches-label": "क्लास रो टैम", "meta-batches-val": "सांझ (5:30 सूं 8:30 बजे)",
            "meta-location-label": "जागो (पता)", "meta-location-val": "टोंक रोड, जयपुर",
            "meta-outcome-label": "परिणाम", "meta-outcome-val": "मंच माथे मोटो नाटक प्रदर्शन अर प्रमाण पत्र",
            "btn-register-now": "ऑनलाइन नांव लिखाओ",
            "btn-whatsapp-query": "व्हाट्सएप माथे पूछो",
            "navarasa-subtitle": "अभिनय री कला",
            "navarasa-title": "नवरस: अभिनय रा नौ रस",
            "navarasa-intro": "नाट्यशास्त्र में नौ रसां (नवरस) ने अभिनय री असली ताकत मान्योड़ी है। म्हारा छात्र इण रसां री मदद सूं मंच माथे आपणी सांस, आवाज अर मूंड रा भावां ने काबू में लाणा सीखे है।",
            "rasa-focus-title": "अभिनय अभ्यास:",
            "plays-subtitle": "म्हारा नाटक",
            "plays-title": "सराह्योड़ा बड़ा नाटक",
            "filter-all": "सगळा नाटक",
            "filter-historical": "इतिहास रा नाटक",
            "filter-social": "समाज रा नाटक",
            "filter-comedy": "हास्य अर लोक कला",
            "play-1-tag": "इतिहास रा नाटक",
            "play-1-title": "कालपुरुष: क्रांतिकारी वीर सावरकर",
            "play-1-sub": "देसभक्ति री गाथा",
            "play-1-desc": "वीर सावरकर सा रा देस वास्ते बलिदान, जेल रा कष्ट अर उणा रा राष्ट्रभक्ति रा विचारां ने दिखावण वास्ते ओ एक घणो ताकतवर नाटक है, जिको लोगां में देसभक्ति जगावे है।",
            "play-2-tag": "इतिहास रा नाटक",
            "play-2-title": "अग्निपथ",
            "play-2-sub": "नेताजी सुभाष चंद्र बोस री जीवनी",
            "play-2-desc": "आजाद हिंद फौज रा बणाव अर नेताजी बोस सा रे अदम्य साहस री ओळखाण करावण वास्ते ओ नाटक देसभक्ति री भावना सूं भरपूर है अर टाबरां ने स्वाभिमान सिखावे है।",
            "play-3-tag": "समाज रा नाटक",
            "play-3-title": "मेरी माँ",
            "play-3-sub": "माँ रा दुलार अर समाज रो संदेश",
            "play-3-desc": "माँ री ममता अर बलिदान माथे बण्योड़ो मर्मस्पर्शी नाटक। ओ नाटक आधुनिक जुग में बुढ़ापे में माता-पिता री उपेक्षा अर एकांत री समस्या माथे चोट करे है।",
            "play-4-tag": "हास्य अर लोक कला",
            "play-4-title": "द ग्रेट राजा मास्टर ड्रामा कंपनी",
            "play-4-sub": "पारसी थियेटर अर लोक संगीत रो नाटक",
            "play-4-desc": "पारसी शैली रा गीत-संगीत अर देसी तमाशा रा ढब सूं सजयोड़ो ओ नाटक लोक नाटक री शैलियां ने बचावण रो एक मोटो काम करे है।",
            "play-5-tag": "समाज रा नाटक",
            "play-5-title": "चुनो वही जो हो सही",
            "play-5-sub": "नुक्कड़ नाटक (मतदान जागरूकता)",
            "play-5-desc": "चुणाव विभाग रे सागे मिळकर बणायोड़ो ओ नाटक लोगां ने उणा रे वोट री ताकत, चुणाव रो महत्व अर नागरिक फर्ज ओळखावे है।",
            "play-dir": "निदेशक: डॉ. सी.डी. हाड़ा",
            "play-mins": "मिनट",
            "fest-badge": "सालाना नाट्य उत्सव",
            "fest-title": "राजस्थान रंग महोत्सव (राज रंगम)",
            "fest-p1": "डॉ. चंद्रदीप हाड़ा सा री देखरेख में ATR प्रतिवर्ष 'राज रंगम' राष्ट्रीय नाटक महोत्सव रो आयोजन करे है। ओ उत्सव देस भर रा नामचीन निर्देशकां ने जयपुर में आपणी नाटक कला दिखावण रो मोटो मंच देवे है।",
            "fest-p2": "इण महोत्सव में नुक्कड़ नाटक, नाट्य शास्त्र माथे गोष्ठियां अर म्हारी जुनी लोक-कलावां ने बचावण री प्रदर्शनियां लगाई जावे है, ताकी म्हारी लोक संस्कृति जीवती रहे।",
            "fest-b1": "देस री नामचीन नाट्य टोलियां रो प्रदर्शन",
            "fest-b2": "नाट्य चर्चा अर लोक-कला री प्रदर्शनियां",
            "fest-b3": "संस्कृति मंत्रालय अर जवाहर कला केंद्र री मदद सूं",
            "promo-title": "राज रंगम री खास बातां",
            "promo-t1": "सालाना 10 सूं बेसी राष्ट्रीय नाटक",
            "promo-t2": "3000 सूं बेसी कला प्रेमी आवें है",
            "promo-t3": "5 सूं बेसी विशेष चर्चावां अर सीख",
            "promo-btn": "आगामी महोत्सव रा समाचार चाहिजै",
            "gallery-subtitle": "सुंदर तस्वीरें",
            "gallery-title": "गैलरी",
            "gallery-item-1": "मंच री रोशणी",
            "gallery-item-2": "अभ्यास रो टैम",
            "gallery-item-3": "\"अग्निपथ\" नाटक री झलक",
            "gallery-item-4": "\"मेरी माँ\" नाटक री झलक",
            "updates-subtitle": "ताजा समाचार",
            "updates-title": "म्हारा नवा समाचार",
            "updates-fb-link": "व्हाट्सएप व फेसबुक माथे म्हारा समाचार देखो",
            "press-subtitle": "अखबार री कतरनें",
            "press-title": "अखबार में म्हारो रंगमंच",
            "press-zoom": "अखबार री खबरें देखो",
            "article-1-source": "दैनिक भास्कर",
            "article-1-title": "डॉ. चंद्रदीप हाड़ा ने लोक सांस्कृतिक खोज वास्ते सीनियर फेलोशिप मिली",
            "article-1-desc": "भारत सरकार रा संस्कृति मंत्रालय कानी सूं राजस्थान री मौखिक लोक कलावां अर कच्छी घोड़ी री खोज वास्ते डॉ. हाड़ा ने मिली मोटी फेलोशिप री खबर।",
            "article-2-source": "राजस्थान पत्रिका",
            "article-2-title": "राज रंगम राष्ट्रीय नाट्य महोत्सव ने जयपुरवासियों रो काळजो जीत्यो",
            "article-2-desc": "जवाहर कला केंद्र में लाग्योड़ा मोटो उत्सव री समीक्षा, जठै देस भर री लोक संस्कृति अर नाटका ने बचावण रा म्हारा कामां ने सराहा गयो।",
            "article-3-source": "द टाइम्स ऑफ इंडिया",
            "article-3-title": "जयपुर में 30 दिनां री अभिनय कार्यशाला रो शानदार आगाज़",
            "article-3-desc": "टोंक रोड माथे कार्यशाला री शुरुआत री खबर, जठै आवाज संस्कृति अर खुद रे विकास माथे मोटो ध्यान दियो गयो।",
            "contact-subtitle": "संपर्क करो",
            "contact-title": "म्हारा सूं जुड़ो",
            "contact-info-title": "संपर्क री माहिती",
            "contact-info-desc": "कार्यशाला में प्रवेश, म्हारा नाटका रा आयोजन अर महोत्सव रे बारे में कांई भी पूछणो होवे तो संदेश भेजो।",
            "contact-addr-title": "जागो (पता)",
            "contact-addr-val": "सिद्धि विनायक, P-3, किसान मार्ग, W-2, मधुबन कॉलोनी, टोंक रोड, जयपुर – 302015, राजस्थान, भारत",
            "contact-phone-title": "फोन / व्हाट्सएप",
            "contact-phone-wa": "व्हाट्सएप माथे बातचीत करो",
            "contact-email-title": "ईमेल री माहिती",
            "contact-jd-title": "जस्टडायल सूची",
            "contact-jd-val": "जस्टडायल प्रोफाइल देखो",
            "contact-social-title": "म्हारी सोशल मीडिया माथे जुड़ो",
            "form-title": "पूछताछ भेजो",
            "form-label-name": "थांरो नांव",
            "form-label-phone": "फ़ोन नंबर",
            "form-label-email": "ईमेल री माहिती",
            "form-label-interest": "थांरी रुचि",
            "opt-interest-1": "30 दिनां री अभिनय कार्यशाला",
            "opt-interest-2": "राज रंगम महोत्सव री माहिती",
            "opt-interest-3": "नाट्य मंचन वास्ते सहयोग",
            "opt-interest-4": "सामान्य पूछताछ",
            "form-label-message": "संदेश (लिखो)",
            "btn-submit-inquiry": "पूछताछ भेजो",
            "footer-desc": "लोक सांस्कृतिक धरोहर रो संरक्षण, नवा नाट्य कलाकारां री सीख अर देस भर में संदेशपरक नाटका रो सफल मंचन।",
            "footer-links-title": "जरूरी लिंक",
            "footer-connect-title": "संपर्क",
            "footer-location": "जयपुर, राजस्थान, भारत",
            "footer-copyright": "© 2026 एक्टर्स थिएटर@राजस्थान। सगळा अधिकार सुरक्षित।",
            "modal-title": "कार्यशाला पंजीकरण",
            "modal-subtitle": "जयपुर में आवण री आगामी 30 दिनां री अभिनय अर खुद रा विकास री क्लास सूं जुड़ो।",
            "modal-label-age": "उम्र (बरस)",
            "modal-label-exp": "पैल रो रंगमंच अनुभव (यदि कोई हो)",
            "btn-complete-reg": "नांव लिखाणो पूर्ण करो",
            "floating-wa-tooltip": "व्हाट्सएप माथे बात करो"
        }
    };

    const placeholderTranslations = {
        en: {
            "cName": "John Doe",
            "cPhone": "+91 98765 43210",
            "cEmail": "john@example.com",
            "cMessage": "Type your message here...",
            "mName": "John Doe",
            "mPhone": "+91 78218 44466",
            "mEmail": "john@example.com",
            "mAge": "21",
            "mExperience": "Briefly describe your acting or stage experience, or type 'None'"
        },
        hi: {
            "cName": "आपका नाम दर्ज करें",
            "cPhone": "+91 98765 43210",
            "cEmail": "name@email.com",
            "cMessage": "अपना संदेश यहाँ लिखें...",
            "mName": "आपका पूरा नाम",
            "mPhone": "+91 78218 44466",
            "mEmail": "name@email.com",
            "mAge": "आयु (उदा. 21)",
            "mExperience": "अपने अभिनय या नाट्य अनुभव का संक्षिप्त विवरण दें, या 'कोई नहीं' लिखें"
        },
        rj: {
            "cName": "थांरो शुभ नांव",
            "cPhone": "+91 98765 43210",
            "cEmail": "email@email.com",
            "cMessage": "आपणी बात अठै लिखो...",
            "mName": "थांरो पूरा नांव",
            "mPhone": "+91 78218 44466",
            "mEmail": "email@email.com",
            "mAge": "थांरी उम्र",
            "mExperience": "पहलां रो नाटक रो अनुभव लिखो, नी तो 'कोई नी' लिख दो"
        }
    };

    const selectTranslations = {
        en: {
            "opt-interest-1": "30-Day Acting Workshop",
            "opt-interest-2": "Raj Rangam Festival Info",
            "opt-interest-3": "Collaboration / Hiring Plays",
            "opt-interest-4": "General Inquiry"
        },
        hi: {
            "opt-interest-1": "30-दिवसीय अभिनय कार्यशाला",
            "opt-interest-2": "राज रंगम महोत्सव जानकारी",
            "opt-interest-3": "नाट्य मंचन सहयोग / आमंत्रण",
            "opt-interest-4": "सामान्य पूछताछ"
        },
        rj: {
            "opt-interest-1": "30 दिनां री अभिनय कार्यशाला",
            "opt-interest-2": "राज रंगम महोत्सव री माहिती",
            "opt-interest-3": "नाट्य मंचन वास्ते सहयोग",
            "opt-interest-4": "सामान्य पूछताछ"
        }
    };

    const rasaTranslations = {
        en: {
            shringara: {
                icon: 'fa-heart',
                title: 'Shringara',
                sentiment: 'Sentiment: Love, Beauty, and Aesthetics',
                desc: 'Shringara is the "King of Rasas" (Rasaraja). It represents romance, charm, beauty, and emotional warmth. On stage, it is expressed through soft voice modulation, subtle side glances, gentle posture changes, and graceful movements.',
                focus: 'Students practice vocal resonance without aggression, coordination of eye movements (Drishti Bheda), and staging romantic and classical dramatic scenes from folklore.'
            },
            hasya: {
                icon: 'fa-face-laugh-squint',
                title: 'Hasya',
                sentiment: 'Sentiment: Humor, Laughter, and Satire',
                desc: 'Hasya represents comedy, laughter, and cheerful satire. It clears the mind and captures the audience\'s joy. It is expressed through expansive smiles, light breathing, rhythmic speech, and playful body gestures.',
                focus: 'Staging physical comedy, slapstick timing, character caricatures, and learning to evoke laughter without breaking character.'
            },
            karuna: {
                icon: 'fa-face-sad-tear',
                title: 'Karuna',
                sentiment: 'Sentiment: Compassion, Grief, and Pathos',
                desc: 'Karuna represents sadness, sorrow, and deep empathy. It connects people at a profound human level. On stage, it utilizes a heavy, trembling voice, slow movements, downcast eyes, and heavy breathing.',
                focus: 'Evoking emotional recall, deep breathing controls for crying, and delivering powerful tragic soliloquies from plays like "Meri Maa".'
            },
            raudra: {
                icon: 'fa-fire',
                title: 'Raudra',
                sentiment: 'Sentiment: Fury, Anger, and Outrage',
                desc: 'Raudra represents intense anger, rage, and righteous fury. It is a high-energy state expressed through a loud, raspy voice, wide staring eyes, heavy stamping footwork, and tense, rigid body language.',
                focus: 'Mastering voice projection without straining vocal cords, executing controlled aggressive movements, and portraying antagonistic characters.'
            },
            veera: {
                icon: 'fa-shield-halved',
                title: 'Veera',
                sentiment: 'Sentiment: Heroism, Valor, and Courage',
                desc: 'Veera represents courage, pride, and heroic determination. It is characterized by an upright posture, steady direct eye contact, a firm, resonant voice, and dignified movements.',
                focus: 'Developing strong stage presence, high-impact patriotic speeches (practiced in "Veer Savarkar" and "Agnipath"), and stage combat stances.'
            },
            bhayanaka: {
                icon: 'fa-ghost',
                title: 'Bhayanaka',
                sentiment: 'Sentiment: Fear, Terror, and Anxiety',
                desc: 'Bhayanaka represents terror, fear, and panic. It is conveyed through rapid blinking, wide scanning eyes, trembling hands, a shaky, whispered voice, and retreating body postures.',
                focus: 'Physical control over shaking, showing tension in the neck and shoulders, and depicting suspense or haunting sequences.'
            },
            bibhatsa: {
                icon: 'fa-face-dizzy',
                title: 'Bibhatsa',
                sentiment: 'Sentiment: Disgust, Aversion, and Revolt',
                desc: 'Bibhatsa represents disgust, self-loathing, or aversion to foul things. It is expressed by contracting the facial features, narrowing the eyes, turning away the head, and spitting or choking sounds.',
                focus: 'Portraying negative reactions, expressing inner conflict, and performing complex character shifts in experimental dramas.'
            },
            adbhuta: {
                icon: 'fa-wand-magic-sparkles',
                title: 'Adbhuta',
                sentiment: 'Sentiment: Wonder, Surprise, and Awe',
                desc: 'Adbhuta represents surprise, amazement, and wonder. It captures the curiosity of the unknown. Conveyed through widely opened eyes, raised eyebrows, open-mouthed expressions, and sudden stillness.',
                focus: 'Portraying mystical experiences, sudden plot twists, and engaging the audience\'s imagination with magical stagecraft.'
            },
            shanta: {
                icon: 'fa-dove',
                title: 'Shanta',
                sentiment: 'Sentiment: Peace, Tranquility, and Calm',
                desc: 'Shanta represents absolute peace, inner calm, and spiritual silence. It is the baseline Rasa. Expressed through relaxed, slow breathing, a gentle smile, soft, soothing voice, and still postures.',
                focus: 'Breathing meditation, emotional detachment exercises, and mastering stage silence (non-verbal stillness).'
            }
        },
        hi: {
            shringara: {
                icon: 'fa-heart',
                title: 'शृंगार',
                sentiment: 'स्थायी भाव: प्रेम, सौंदर्य और कलात्मकता',
                desc: 'शृंगार को रसों का राजा (रसराज) माना जाता है। यह प्रेम, सौंदर्य, आकर्षण और भावनात्मक ऊष्मा को दर्शाता है। मंच पर इसे मधुर स्वर, तिरछी चितवन, सौम्य शारीरिक मुद्राओं और शालीन गतिशीलता के माध्यम से व्यक्त किया जाता है।',
                focus: 'छात्र बिना किसी आक्रामकता के वाणी में गूंज लाने, दृष्टि भेद (आँखों के संचालन) में समन्वय, और लोक कथाओं के आधार पर कलात्मक दृश्यों का मंचन करना सीखते हैं।'
            },
            hasya: {
                icon: 'fa-face-laugh-squint',
                title: 'हास्य',
                sentiment: 'स्थायी भाव: हास्य, विनोद और व्यंग्य',
                desc: 'हास्य रस प्रसन्नता, हंसी और स्वस्थ व्यंग्य का प्रतिनिधित्व करता है। यह दर्शकों के मन को हल्का करता है। इसे मुस्कान, हल्की सांसों, लयबद्ध संवादों और चंचल हाव-भावों से मंच पर दिखाया जाता है।',
                focus: 'शारीरिक कॉमेडी, कॉमिक टाइमिंग, चरित्र चित्रण और बिना अपना गंभीर रूप खोए दर्शकों को हंसाने की कला का अभ्यास।'
            },
            karuna: {
                icon: 'fa-face-sad-tear',
                title: 'करुण',
                sentiment: 'स्थायी भाव: करुणा, शोक और सहानुभूति',
                desc: 'करुण रस दुख, वियोग और गहरी सहानुभूति को दर्शाता है। यह मानवीय संवेदनाओं को गहरे स्तर पर जोड़ता है। मंच पर इसे भारी, कांपती आवाज, धीमी गति, झुकी हुई नजरों और गहरी सांसों से प्रदर्शित किया जाता है।',
                focus: 'भावनात्मक स्मृति का उपयोग, रोने के दृश्यों के लिए श्वास नियंत्रण, और "मेरी माँ" जैसे नाटकों के मर्मस्पर्शी संवादों की प्रस्तुति का अभ्यास।'
            },
            raudra: {
                icon: 'fa-fire',
                title: 'रौद्र',
                sentiment: 'स्थायी भाव: क्रोध, रौद्र रूप और आक्रोश',
                desc: 'रौद्र रस तीव्र क्रोध, रोष और अन्याय के प्रति आक्रोश को दर्शाता है। यह एक उच्च-ऊर्जा की स्थिति है, जिसे ऊंची व कर्कश आवाज, फैली हुई आँखों, भारी कदमों और तनावग्रस्त शारीरिक मुद्रा से दर्शाया जाता है।',
                focus: 'गले पर दबाव डाले बिना ऊंचे स्वर में बोलना (वॉइस प्रोजेक्शन), नियंत्रित आक्रामक गतिशीलता, और खलनायक या क्रोधी चरित्रों का अभिनय।'
            },
            veera: {
                icon: 'fa-shield-halved',
                title: 'वीर',
                sentiment: 'स्थायी भाव: वीरता, शौर्य और साहस',
                desc: 'वीर रस साहस, स्वाभिमान, उत्साह और वीरता का प्रतिनिधित्व करता है। इसकी विशेषता तनकर खड़ा होना, सीधा नेत्र संपर्क, एक दृढ़ व गंभीर आवाज, और गरिमापूर्ण मंच संचलन है।',
                focus: 'मंच पर प्रभावशाली उपस्थिति (स्टेज प्रेजेंस), "वीर सावरकर" और "अग्निपथ" जैसे नाटकों के देशभक्ति संवादों की गर्जना, और युद्ध मुद्राओं का अभ्यास।'
            },
            bhayanaka: {
                icon: 'fa-ghost',
                title: 'भयानक',
                sentiment: 'स्थायी भाव: भय, आतंक और चिंता',
                desc: 'भयानक रस भय, आशंका और घबराहट को दर्शाता है। इसे जल्दी-जल्दी पलकें झपकाने, सहमी नजरों, कांपते हाथों, थरथराती आवाज, और पीछे हटने वाले शारीरिक हाव-भाव से व्यक्त किया जाता है।',
                focus: 'शरीर के कंपकंपी पर नियंत्रण, गर्दन और कंधों में खिंचाव दिखाना, तथा रहस्यमयी या डरावने दृश्यों में चरित्र की मनोदशा को दर्शाना।'
            },
            bibhatsa: {
                icon: 'fa-face-dizzy',
                title: 'बीभत्स',
                sentiment: 'स्थायी भाव: घृणा, जुगुप्सा और अरुचि',
                desc: 'बीभत्स रस घृणा, ग्लानि या किसी घृणित वस्तु के प्रति अरुचि को दर्शाता है। इसे नाक-भौं सिकोड़ने, आँखें मूंदने, सिर दूसरी तरफ घुमाने और थूकने या हांफने की आवाजों से व्यक्त किया जाता है।',
                focus: 'नकारात्मक प्रतिक्रियाओं को सहजता से दर्शाना, आंतरिक संघर्ष की अभिव्यक्ति, और प्रयोगात्मक नाटकों में जटिल चरित्र परिवर्तन।'
            },
            adbhuta: {
                icon: 'fa-wand-magic-sparkles',
                title: 'अद्भुत',
                sentiment: 'स्थायी भाव: विस्मय, आश्चर्य और कौतूहल',
                desc: 'अद्भुत रस आश्चर्य, विस्मय और जिज्ञासा को दर्शाता है। यह अज्ञात के प्रति कौतूहल को जगाता है। इसे चौड़ी आँखों, उठी हुई भौंहों, खुले मुंह की मुद्रा और अचानक शरीर के स्तब्ध हो जाने से व्यक्त किया जाता है।',
                focus: 'रहस्यमयी अनुभवों को मंच पर जीना, कहानी में आए अप्रत्याशित मोड़ों पर प्रतिक्रिया, और दर्शकों की कल्पनाशीलता को झंकृत करना।'
            },
            shanta: {
                icon: 'fa-dove',
                title: 'शान्त',
                sentiment: 'स्थायी भाव: शांति, स्थिरता और नीरवता',
                desc: 'शान्त रस मोक्ष, परम शांति और आत्मिक नीरवता को दर्शाता है। यह सभी रसों का आधार बिंदु है। इसे शांत व धीमी श्वास, मंद मुस्कान, सौम्य स्वर और स्थिर शारीरिक मुद्राओं से दर्शाया जाता है।',
                focus: 'श्वास ध्यान, भावनात्मक तटस्थता का अभ्यास, और मंच पर मौन व स्थिरता (स्टिलनेस) की शक्ति में महारत हासिल करना।'
            }
        },
        rj: {
            shringara: {
                icon: 'fa-heart',
                title: 'शृंगार',
                sentiment: 'स्थायी भाव: लाड-कोड, रूप-रंग अर सिंगार',
                desc: 'सिंगार ने रसां रो राजा मान्यो गयो है। ओ लाड-कोड, प्रेम, सौंदर्य अर हिया री हेत ने ओळखावे है। मंच माथे इणने मीठी बोली, तिरछी नजर, सौम्य चाल-ढाल अर हाव-भाव सूं दिखाणो पड़े है।',
                focus: 'टाबर बिना कोई गुस्से रे आवाज री मधुरता, आँखड़यां रो मटकाव (दृष्टि भेद) अर लोक कलावां रा सुंदर दृश्यों रो मंचन करना सीखे है।'
            },
            hasya: {
                icon: 'fa-face-laugh-squint',
                title: 'हास्य',
                sentiment: 'स्थायी भाव: हसणो-हसावणो, ठिठोली अर व्यंग्य',
                desc: 'हास्य रस रो मतलब है हसणो, ठिठोली अर चोखो व्यंग्य। ओ लोगां रे मन ने मगन करे है। मंच माथे मोटो हुसक, हल्की सांस अर चंचल हाव-भाव सूं ओ रस दिखाया जावे है।',
                focus: 'कमेडी री टाइमिंग, देह री लचक, नकल उतारणो अर नाटक में आपणी हंसी रोके बिना लोगां ने हसावण रो अभ्यास।'
            },
            karuna: {
                icon: 'fa-face-sad-tear',
                title: 'करुण',
                sentiment: 'स्थायी भाव: दया, हिया रो रोवणो अर हमदर्दी',
                desc: 'करुण रस दुख, बिछड़ना अर दया ने ओळखावे है। ओ मानखां रा काळजा ने जोड़ देवे है। मंच माथे इणने भारी, धूजती आवाज, धीमी चाल, ढळती पलकां अर भारी सांस सूं दिखाया जावे है।',
                focus: 'मन रो जुनो दुख याद करणो, रोवण रा दृश्या वास्ते सांस माथे काबू पावणो अर "मेरी माँ" नाटक रा दुखद संवाद बोलणो सीखे है।'
            },
            raudra: {
                icon: 'fa-fire',
                title: 'रौद्र',
                sentiment: 'स्थायी भाव: रीस, कालजो बाळणो अर गुस्सा',
                desc: 'रौद्र रो मतलब है घणी रीस अर गुस्सा। ओ मोटो ऊर्जा रो रस है, जिको जोरी सूं बोलणो, लाल आँखड़यां, मंच माथे जोर सूं पग पटकणो अर तण्योड़ी देह सूं दिखाया जावे है।',
                focus: 'कंठ ने नुकसान पहुंचाए बिना जोरी सूं बोलणो, गुस्से री हाल-चाल माथे काबू पावणो अर डाकू या गुस्सैल पात्रां रो स्वांग करणो।'
            },
            veera: {
                icon: 'fa-shield-halved',
                title: 'वीर',
                sentiment: 'स्थायी भाव: धीरता, बहादुरी अर देसभक्ति',
                desc: 'वीर रस रो मतलब है बहादुरी, स्वाभिमान अर देस री भक्ति। इणरी खास बात है तणकर खड़ा रेहणो, सीधी नजर, बुलंद आवाज अर मंच माथे मर्यादा सूं हालणो-चालणो।',
                focus: 'मंच माथे मोटी मौजूदगी (स्टेज प्रेजेंस), "वीर सावरकर" अर "अग्निपथ" नाटक रा देशभक्ति संवाद जोरी सूं बोलणो अर युद्ध री मुद्रावां रो अभ्यास।'
            },
            bhayanaka: {
                icon: 'fa-ghost',
                title: 'भयानक',
                sentiment: 'स्थायी भाव: डर, धाक अर धूजणी',
                desc: 'भयानक रस रो मतलब है डर, थरथराहट अर घबराहट। इणने जल्दी-जल्दी पलकां झपकावणी, सहम्योड़ी नजर, धूजता हाथ, कांपती बोली अर पाछे हठण रा हाव-भाव सूं दिखाया जावे है।',
                focus: 'देह री धूजणी माथे काबू पावणो, गळा अर खांधा में खिंचाव दिखावणो अर रहस्यमयी या भूतिया दृश्या रो सुंदर मंचन।'
            },
            bibhatsa: {
                icon: 'fa-face-dizzy',
                title: 'बीभत्स',
                sentiment: 'स्थायी भाव: घिन आवणी अर अरुचि',
                desc: 'बीभत्स रो मतलब है घिन आवणी, अरुचि अर गंदगी सूं नफरत। इणने नाक-भौं सिकोड़ना, आँखड़यां मीचणा, मूंडो फेरणा अर थूकण री आवाज सूं मंच माथे दिखाया जावे है।',
                focus: 'घिन रा भावां ने मंच माथे सहजता सूं दिखावणो, मन री लड़ाई री सीख अर नया नाटका में पात्रां रो बदलाव।'
            },
            adbhuta: {
                icon: 'fa-wand-magic-sparkles',
                title: 'अद्भुत',
                sentiment: 'स्थायी भाव: अचरज, अचम्भो अर अनोखो',
                desc: 'अद्भुत रस अचम्भा अर नवी जाणाकारी ने ओळखावे है। ओ अचरज जगावे है। इणने मोटी-मोटी आँखड़यां, चढ़्योड़ी भौंहों, खुल्योड़ा मूंडा अर देह रा थम जाणा सूं मंच माथे दिखाया जावे है।',
                focus: 'जादुई अनुभूतियां ने मंच माथे जीवंत करणो, नाटक रा अचरज भरा मोड़ा माथे प्रतिक्रिया देवणी अर दर्शकां ने अचंभित करणो।'
            },
            shanta: {
                icon: 'fa-dove',
                title: 'शान्त',
                sentiment: 'स्थायी भाव: शांति, धीरज अर हिया री ठंडक',
                desc: 'शान्त रस मोक्ष, शांति अर हिया री ठंडक ने ओळखावे है। ओ सगळा रसां री जड़ है। इणने शांत अर धीमी सांस, मीठी मुस्कान, सौम्य आवाज अर स्थिर मुद्रावां सूं मंच माथे दिखाया जावे है।',
                focus: 'सांस री साधना, भावां सूं अलग रेहण रो अभ्यास अर मंच माथे मौन (चुप रेहण री कला) में महारत हासिल करणी।'
            }
        }
    };

    // Rasa display local update helper
    function updateRasaDisplay(lang) {
        const activeRasaBtn = document.querySelector('.rasa-btn.active');
        if (!activeRasaBtn) return;
        const rasaKey = activeRasaBtn.getAttribute('data-rasa');
        const data = rasaTranslations[lang][rasaKey];
        if (data) {
            rasaIconBadge.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
            rasaTitle.textContent = data.title;
            rasaSentiment.textContent = data.sentiment;
            rasaDesc.textContent = data.desc;
            rasaFocus.textContent = data.focus;
        }
    }

    // Main translation function
    function translatePage(lang) {
        const trans = translations[lang];
        if (!trans) return;

        // Loop over elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (trans[key]) {
                el.innerHTML = trans[key];
            }
        });

        // Set HTML lang attribute
        document.documentElement.lang = lang;

        // Update form placeholders
        const placeholders = placeholderTranslations[lang];
        if (placeholders) {
            Object.keys(placeholders).forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.placeholder = placeholders[id];
                }
            });
        }

        // Update select option texts
        const selectTrans = selectTranslations[lang];
        if (selectTrans) {
            Object.keys(selectTrans).forEach(id => {
                const el = document.querySelector(`option[data-i18n="${id}"]`);
                if (el) {
                    el.textContent = selectTrans[id];
                }
            });
        }

        // Update dynamic text rotator values
        const rotatorWords = {
            en: ["Acting", "Expression", "Emotion", "Drama", "Stagecraft"],
            hi: ["अभिनय", "अभिव्यक्ति", "भावना", "नाटक", "मंच कला"],
            rj: ["स्वांग", "भाव-ताव", "हिया री बात", "नाट-नाटक", "रंगमंच"]
        };
        
        if (activeRotatorInstance && rotatorWords[lang]) {
            activeRotatorInstance.updateRotateList(rotatorWords[lang]);
        }

        // Refresh Navarasa Details display
        updateRasaDisplay(lang);

        // Update Facebook Page Plugin language dynamically
        const fbIframe = document.getElementById('fb-iframe');
        if (fbIframe) {
            const fbLocale = (lang === 'hi' || lang === 'rj') ? 'hi_IN' : 'en_US';
            const baseUrl = 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Factorstheatre.rajasthan%2F&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true';
            fbIframe.src = `${baseUrl}&locale=${fbLocale}`;
        }
    }

    // Language Dropdown Change Event Listener
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            translatePage(selectedLang);
            localStorage.setItem('lang', selectedLang);
        });
    }

    // Initialize Default Language
    const defaultLang = localStorage.getItem('lang') || 'en';
    if (languageSelect) {
        languageSelect.value = defaultLang;
    }
    translatePage(defaultLang);

});

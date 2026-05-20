// Animation d'apparition des sections au défilement
function initScrollAnimations() {
    // Sélectionner seulement les sections principales, pas le footer
    const sections = document.querySelectorAll('section:not(.footer-section)');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const appearObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100); // Délai de 0.1s entre chaque section
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Appliquer les styles initiaux et observer chaque section
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        appearObserver.observe(section);
    });
    
    // S'assurer que le footer est toujours visible
    const footer = document.querySelector('.footer-section');
    if (footer) {
        footer.style.opacity = '1';
        footer.style.transform = 'translateY(0)';
    }
}


function initSpreadCards() {
    const spreadContainer = document.querySelector('.spread-container');
    const spreadSection = document.querySelector('.spread-section');
    const spreadCards = document.querySelectorAll('.spread-card');
    let animationCompleted = false;
    let isInSection = false;
    
    if (!spreadContainer || !spreadSection) return;
    
    // Observer pour détecter quand la section est visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationCompleted) {
                isInSection = true;
                window.addEventListener('scroll', handleScrollAnimation);
            } else if (!entry.isIntersecting && isInSection) {
                isInSection = false;
                window.removeEventListener('scroll', handleScrollAnimation);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(spreadSection);
    
    function handleScrollAnimation() {
        const scrollY = window.scrollY || window.pageYOffset;
        const sectionTop = spreadSection.offsetTop;
        const sectionHeight = spreadSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculer la position relative dans la section (0 à 1)
        const scrollPosition = scrollY - sectionTop + (windowHeight * 0.3);
        const scrollPercentage = Math.min(Math.max(scrollPosition / (sectionHeight * 0.7), 0), 1);
        
        // Appliquer l'animation en fonction du pourcentage de scroll
        applyScrollAnimation(scrollPercentage);
        
        // Si on atteint la fin de la section, terminer l'animation
        if (scrollPercentage >= 0.95 && !animationCompleted) {
            completeAnimation();
        }
    }
    
    function applyScrollAnimation(percentage) {
        // Animation progressive basée sur le pourcentage de scroll
        spreadCards.forEach(card => {
            card.classList.remove('scroll-33', 'scroll-66', 'scroll-100');
        });
        
        if (percentage >= 0.33) {
            spreadCards.forEach(card => card.classList.add('scroll-33'));
        }
        if (percentage >= 0.66) {
            spreadCards.forEach(card => card.classList.add('scroll-66'));
        }
        if (percentage >= 0.9) {
            spreadCards.forEach(card => card.classList.add('scroll-100'));
        }
    }
    
    function completeAnimation() {
        animationCompleted = true;
        spreadContainer.classList.add('spread-active');
    }
    
    // Permettre le clic manuel pour déclencher l'animation complète
    spreadContainer.addEventListener('click', function() {
        if (!animationCompleted) {
            completeAnimation();
        } else {
            // Réinitialiser l'animation si on clique à nouveau
            this.classList.remove('spread-active');
            spreadCards.forEach(card => {
                card.classList.remove('scroll-33', 'scroll-66', 'scroll-100');
            });
            animationCompleted = false;
        }
    });
    
    // Réinitialiser l'animation si on remonte assez haut
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Si l'utilisateur remonte au-dessus de la section
        if (scrollTop < lastScrollTop && scrollTop < spreadSection.offsetTop - 200) {
            resetAnimation();
        }
        lastScrollTop = scrollTop;
    });
    
    function resetAnimation() {
        animationCompleted = false;
        isInSection = false;
        spreadContainer.classList.remove('spread-active');
        spreadCards.forEach(card => {
            card.classList.remove('scroll-33', 'scroll-66', 'scroll-100');
        });
    }
}

function addCardGlowEffect() {
    const style = document.createElement('style');
    style.textContent = `
        .spread-card:hover {
            box-shadow: 
                0 20px 60px rgba(193, 156, 101, 0.5),
                inset 0 3px 6px rgba(255, 255, 255, 0.15);
            border-color: rgba(193, 156, 101, 0.5);
        }
        
        .spread-card:hover::before {
            opacity: 1;
        }
        
        .model-item:hover {
            box-shadow: 0 12px 35px rgba(193, 156, 101, 0.5) !important;
            border-color: #c19c65 !important;
        }
    `;
    document.head.appendChild(style);
}
// Animation des statistiques
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');
    
    if (!statsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            clearInterval(timer);
                            current = target;
                        }
                        stat.textContent = Math.floor(current);
                    }, 16);
                });
                
                // Désobserver après l'animation
                observer.unobserve(statsSection);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// Animation des modèles de voitures (carousel)
function initModelsCarousel() {
    const modelsList = document.querySelector('.models-list');
    if (!modelsList) return;
    
    // Pause l'animation au survol
    modelsList.addEventListener('mouseenter', () => {
        modelsList.style.animationPlayState = 'paused';
    });
    
    modelsList.addEventListener('mouseleave', () => {
        modelsList.style.animationPlayState = 'running';
    });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site EightCars chargé');
    
     addCardGlowEffect();
    // Gestion du menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Empêcher le défilement lorsque le menu est ouvert
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Animation du texte hero au chargement
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTagline = document.querySelector('.hero-tagline');
    const ctaButton = document.querySelector('.cta-button');
    
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 500);
    }
    
    if (heroTagline) {
        setTimeout(() => {
            heroTagline.style.opacity = '1';
            heroTagline.style.transform = 'translateY(0)';
        }, 700);
    }
    
    if (ctaButton) {
        setTimeout(() => {
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
        }, 900);
    }
    
    // Initialiser les animations
    initScrollAnimations();
    animateStats();
    initSpreadCards();
    initModelsCarousel();

});

// Gestion du reflow responsive
window.addEventListener('resize', function() {
    // Réinitialiser certaines animations si nécessaire
    const modelsList = document.querySelector('.models-list');
    if (modelsList) {
        modelsList.style.animation = 'none';
        setTimeout(() => {
            modelsList.style.animation = '';
        }, 10);
    }
});
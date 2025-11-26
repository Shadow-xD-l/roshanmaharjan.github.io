document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes to sections
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });

    // Glitch Text Effect (Hacker Style Lock-in) & Dynamic Cycling
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        const roles = ["AI Engineer", "Software Developer", "UI/UX Designer", "Data Scientist", "Tech Innovator"];
        let roleIndex = 0;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';

        const animateText = (newText) => {
            let iterations = 0;
            const interval = setInterval(() => {
                glitchText.innerText = newText
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return newText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iterations >= newText.length) {
                    clearInterval(interval);
                    glitchText.innerText = newText;
                }

                iterations += 1 / 3;
            }, 30);
        };

        // Initial animation
        animateText(roles[0]);

        // Cycle through roles
        setInterval(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            const newRole = roles[roleIndex];
            glitchText.setAttribute('data-text', newRole);
            animateText(newRole);
        }, 4000); // Change every 4 seconds

        // Keep hover effect if desired (optional, but might conflict with auto-cycle, so removing for cleaner UX)
    }

    // Typing Effect
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const textToType = "Roshan Maharjan";
        let charIndex = 0;

        function type() {
            if (charIndex < textToType.length) {
                typingText.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            }
        }

        // Start typing after a short delay
        setTimeout(type, 1000);
    }
});

// Navbar hide onscroll
let lastScrollTop = 0;
const navbar = document.querySelector('.glass-nav');
const scrollThreshold = 100; // Start hiding after scrolling 100px

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('nav-hidden');
        }
    } else {
        // At the top of the page
        navbar.classList.remove('nav-hidden');
    }

    lastScrollTop = scrollTop;
});

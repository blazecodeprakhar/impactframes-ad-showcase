document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    // Helper function to animate numbers counting up
    function animateNumbers(element) {
        if (element.dataset.counted === 'true') return;
        element.dataset.counted = 'true';
        
        if (element.querySelector('i')) return; // Skip if it contains an icon

        const text = element.textContent;
        const parts = text.split(/(\d+(?:\.\d+)?)/);
        
        if (parts.length === 1) return; // No numbers found
        
        const duration = 2000; // 2 seconds
        const startTimestamp = performance.now();
        
        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            let currentText = "";
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    currentText += parts[i];
                } else {
                    const match = parts[i];
                    const isFloat = match.includes('.');
                    const targetNum = parseFloat(match);
                    let currentNum = targetNum * easeProgress;
                    
                    if (isFloat) {
                        const decPlaces = match.split('.')[1].length;
                        currentText += currentNum.toFixed(decPlaces);
                    } else {
                        let numStr = Math.floor(currentNum).toString();
                        if (match.startsWith('0') && match.length > 1) {
                            numStr = numStr.padStart(match.length, '0');
                        }
                        currentText += numStr;
                    }
                }
            }
            
            element.textContent = currentText;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = text;
            }
        }
        
        window.requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger number animations with staggered delay
                const numbers = entry.target.querySelectorAll('.metric-value, .section-badge');
                numbers.forEach((num, index) => {
                    setTimeout(() => animateNumbers(num), 300 + (index * 150));
                });
                
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    // Apply observer to elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.classList.add('aos-init');
        observer.observe(element);
    });

    // Dynamic mouse movement effect for background shapes
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        const shape1 = document.querySelector('.bg-shape-1');
        const shape2 = document.querySelector('.bg-shape-2');

        if(shape1) {
            shape1.style.transform = `translate(${mouseX * 100}px, ${mouseY * 100}px)`;
        }
        if(shape2) {
            shape2.style.transform = `translate(${mouseX * -100}px, ${mouseY * -100}px)`;
        }
    });

    // Fast & Real 3D Mouse Tilt Effect with Dynamic Shadow (Tracks entire section)
    const adSections = document.querySelectorAll('.ad-section');
    adSections.forEach(section => {
        const phone = section.querySelector('.phone-mockup.dark-phone');
        if (!phone) return;

        let isUsingPhone = false;

        // Detect when user is interacting with the phone specifically
        phone.addEventListener('mouseenter', () => {
            isUsingPhone = true;
            // Snap to flat for usability while interacting
            phone.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            phone.style.transform = 'perspective(1200px) scale(1.02) rotateX(0) rotateY(0)';
            phone.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.5)';
        });

        phone.addEventListener('mouseleave', () => {
            isUsingPhone = false;
        });

        let ticking = false;

        section.addEventListener('mousemove', (e) => {
            if (isUsingPhone) return;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = section.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    // Calculate tilt degrees (responsive and fast)
                    const rotateX = ((y - centerY) / centerY) * -12;
                    const rotateY = ((x - centerX) / centerX) * 20;
                    
                    // Calculate dynamic realistic shadow
                    const shadowX = ((x - centerX) / centerX) * -30;
                    const shadowY = ((y - centerY) / centerY) * -30 + 45; // Base 45px vertical shadow
                    
                    // Fast CSS transition for crisp, lag-free trailing
                    phone.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
                    phone.style.transform = `perspective(1200px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    phone.style.boxShadow = `${shadowX}px ${shadowY}px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15) inset`;
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        section.addEventListener('mouseleave', () => {
            isUsingPhone = false;
            phone.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            phone.style.transform = '';
            phone.style.boxShadow = ''; // Reset to CSS default
        });
    });

    // Make the tilt for other elements snappy as well
    const otherTiltElements = document.querySelectorAll('.qr-box, .intro-panel');
    otherTiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;
            
            el.style.transition = 'transform 0.15s ease-out';
            el.style.transform = `perspective(1000px) scale(1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            el.style.transform = '';
        });
    });

    // Dynamic Hero Ad Rotator (randomly changes every 8 seconds)
    const heroIframe = document.getElementById('hero-ad-iframe');
    if (heroIframe) {
        const heroAds = [
            'cloned_ads/fujifilm2.html',
            'cloned_ads/cetaphil.html',
            'cloned_ads/pepe.html',
            'cloned_ads/bkt.html',
            'cloned_ads/junglethamma.html',
            'cloned_ads/fujifilm1.html'
        ];
        
        let currentSrc = heroIframe.getAttribute('src');
        
        setInterval(() => {
            const availableAds = heroAds.filter(src => src !== currentSrc);
            const randomAd = availableAds[Math.floor(Math.random() * availableAds.length)];
            currentSrc = randomAd;
            heroIframe.src = randomAd;
        }, 8000);
    }
});

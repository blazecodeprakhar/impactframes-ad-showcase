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

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
});

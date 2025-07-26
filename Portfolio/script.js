document.addEventListener('DOMContentLoaded', function() {
    // Background slideshow
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 3300; // 3.3 seconds
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Start slideshow
    let slideshow = setInterval(nextSlide, slideInterval);
    
    // Pause slideshow on hover (optional)
    const slideshowContainer = document.querySelector('.slideshow');
    slideshowContainer.addEventListener('mouseenter', () => {
        clearInterval(slideshow);
    });
    
    slideshowContainer.addEventListener('mouseleave', () => {
        slideshow = setInterval(nextSlide, slideInterval);
    });
    
    // Form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For this example, we'll just log it and show an alert
            console.log({name, email, message});
            
            alert('Thank you for your message, ' + name + '! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
});

// Extra functionality for skills page
function animateSkillBars() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    skillLevels.forEach(level => {
        const width = level.style.width;
        level.style.width = '0';
        
        // Set the final width as a CSS variable
        level.style.setProperty('--final-width', width);
        
        // Trigger animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    level.style.animation = `fillBar 1.5s ease forwards`;
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(level);
    });
}

// Call this function when the skills page loads
if (window.location.pathname.includes('skills.html')) {
    document.addEventListener('DOMContentLoaded', animateSkillBars);
}
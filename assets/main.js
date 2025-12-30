// Wait domain load
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.transform = `scaleX(${scrolled / 100})`;
        }
    });

    // 2. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 3. Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 4. Generate background particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = `${Math.random() * 4 + 2}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // 5. Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 6. CLOUDFLARE WORKER FORM SUBMISSION
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('button');
            const responseDiv = document.getElementById('formResponse');
            const originalText = btn.innerText;
            
            // UI Feedback: Loading
            btn.disabled = true;
            btn.innerText = 'Sending...';
            responseDiv.innerHTML = '';

            // Capturar dados do formulário
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            try {
                // URL do seu Worker configurado
                const workerUrl = 'https://bim3dhub-contact.pschiarelli.workers.dev'; 
                
                const response = await fetch(workerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    responseDiv.innerHTML = '<span class="msg-success">Message sent successfully! We will contact you shortly.</span>';
                    this.reset();
                } else {
                    console.error('Worker error:', result);
                    throw new Error(result.error || 'Server responded with error');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                responseDiv.innerHTML = '<span class="msg-error">Error sending message. Please try again or email us directly.</span>';
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        });
    }
});

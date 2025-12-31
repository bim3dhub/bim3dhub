/**
 * BIM3D Hub - Main Systems Script
 * Versão revisada para compatibilidade multi-idioma e performance
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("BIM3D Hub Engine: Initialized");

    // --- 1. BARRA DE PROGRESSO DE LEITURA ---
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.transform = `scaleX(${scrolled / 100})`;
        });
    }

    // --- 2. EFEITO DA NAVBAR AO ROLAR ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- 3. ANIMAÇÕES FADE-IN (INTERSECTION OBSERVER) ---
    // Ajustado para disparar a animação mais cedo e ser mais robusto
    const observerOptions = {
        threshold: 0.05, // Dispara quando apenas 5% do elemento aparece
        rootMargin: '0px 0px -50px 0px' 
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Uma vez visível, para de observar o elemento (melhora performance)
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        fadeElements.forEach(el => observer.observe(el));
    } else {
        console.warn("BIM3D Hub: No .fade-in elements found.");
    }

    // --- 4. GERADOR DE PARTÍCULAS DE FUNDO ---
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 30;
        const fragment = document.createDocumentFragment(); // Melhor performance de renderização
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
            fragment.appendChild(particle);
        }
        particlesContainer.appendChild(fragment);
    }

    // --- 5. NAVEGAÇÃO SUAVE (SMOOTH SCROLL) ---
    // Corrigido para evitar erros com seletores vazios ou inexistentes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") return; // Ignora links vazios

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 6. ENVIO DO FORMULÁRIO (CLOUDFLARE WORKER) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('button');
            const responseDiv = document.getElementById('formResponse');
            const originalText = btn.innerText;
            
            btn.disabled = true;
            btn.innerText = 'Sending...'; // Em inglês, como o site atual
            if (responseDiv) responseDiv.innerHTML = '';

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            try {
                const workerUrl = 'https://bim3dhub-contact.pschiarelli.workers.dev'; 
                
                const response = await fetch(workerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    if (responseDiv) responseDiv.innerHTML = '<span class="msg-success">Message sent successfully!</span>';
                    this.reset();
                } else {
                    throw new Error('Server Error');
                }
            } catch (error) {
                console.error('Submission error:', error);
                if (responseDiv) responseDiv.innerHTML = '<span class="msg-error">Error. Please try again or email us directly.</span>';
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        });
    }
});

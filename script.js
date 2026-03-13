/* 
    Madhurima Dutta - Interactive Architect Portfolio Scripts
*/

// --- 1. Terminal Typing Effect ---
const typingText = document.getElementById('typing-text');
const roles = ["Secure Backend Architect", "Full-Stack Engineer", "Blockchain Enthusiast"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 2000;

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end of word
        typeSpeed = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
}

// --- 2. 3D/Animated Background (Node Network) ---
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

// Resize Canvas
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
    setupCanvas();
    initParticles();
});

// Mouse Interaction
let mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        // Mouse collision and push interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Return to gentle random movement
            this.x += this.directionX;
            this.y += this.directionY;
        }

        this.draw();
    }
}

// Initialize Particle Network
function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = 'rgba(0, 240, 255, 0.8)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect points with lines based on distance
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = `rgba(0, 240, 255, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// --- 3. Intersection Observers for Animations ---

// General Fade In
const fadeElements = document.querySelectorAll('.glass-card, .timeline-item');
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const appearanceObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
    });
}, observerOptions);

fadeElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    appearanceObserver.observe(el);
});

// Chart.js initialization logic
let mindfullChart = null;
const chartCanvas = document.getElementById('mindfull-chart');

function initChart() {
    if (mindfullChart !== null) return;

    const ctxChart = chartCanvas.getContext('2d');

    // Create gradient
    let gradient = ctxChart.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0.0)');

    mindfullChart = new Chart(ctxChart, {
        type: 'line',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                label: 'Mood Assessment Data',
                data: [65, 59, 80, 81, 56, 55, 70],
                borderColor: '#00f0ff',
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#00f0ff',
                pointHoverBackgroundColor: '#00f0ff',
                pointHoverBorderColor: '#fff',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { display: false, beginAtZero: true },
                x: { display: false }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Observe Project Card for Chart Animation
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                initChart();
            }, 500); // slight delay for visual effect
            chartObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (chartCanvas) {
    chartObserver.observe(chartCanvas.closest('.project-card'));
}

// --- 5. Contact Form / EmailJS Logic ---
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

// Initialize EmailJS with public key
if (typeof emailjs !== 'undefined') {
    emailjs.init("3PS23Thmo4yVEuBhe");
}

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Client-Side Validation
        const name = document.getElementById('user_name').value.trim();
        const email = document.getElementById('user_email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !message) {
            showFormMessage('⚠ Please fill in all required fields.', 'error');
            return;
        }
        if (!emailRegex.test(email)) {
            showFormMessage('⚠ Please enter a valid email address.', 'error');
            return;
        }

        // Loading State
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';

        // Use emailjs.send() with explicit params for reliability
        emailjs.send('contact_service', 'template_rc0g3vd', {
            user_name: name,
            user_email: email,
            subject: subject || 'Portfolio Contact',
            message: message
        })
            .then(() => {
                showFormMessage('✅ Message sent! I will get back to you soon.', 'success');
                contactForm.reset();
            }, (error) => {
                console.error('EmailJS Error:', error);
                showFormMessage('❌ Failed to send. Please try emailing directly.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
            });
    });
}

function showFormMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 6000);
}

// --- 6. Custom Cursor ---
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let ringX = 0, ringY = 0;
let dotX = 0, dotY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
});

// Smooth trailing ring
function animateCursorRing() {
    currentX += (dotX - currentX) * 0.12;
    currentY += (dotY - currentY) * 0.12;
    cursorRing.style.left = currentX + 'px';
    cursorRing.style.top = currentY + 'px';
    requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
});

// --- 7. Scroll Progress Bar & Back-to-Top ---
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    // Scroll progress
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';

    // Back-to-top visibility
    if (scrollTop > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 8. 3D Tilt Effect on Cards ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.project-card, .bento-item'), {
            max: 8,           // Max tilt angle
            speed: 400,       // Speed of the effect
            glare: true,      // Enable the glare effect
            'max-glare': 0.15, // Max opacity of glare (0-1)
            scale: 1.02,      // Slight scale up on hover
        });
    }

    // Typing effect init
    if (roles.length) setTimeout(type, newTextDelay + 250);
    setupCanvas();
    initParticles();
    animateParticles();
});

/* =============================================
   features.js — Recruiter-Attracting Features
   ============================================= */

// ==================== Live IST Clock ====================
function updateIST() {
    const istEl = document.getElementById('liveIST');
    if (!istEl) return;
    const now = new Date();
    const ist = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit', minute: '2-digit',
        hour12: true, timeZone: 'Asia/Kolkata'
    }).format(now);
    istEl.textContent = ist + ' IST';
}
updateIST();
setInterval(updateIST, 30000);

// ==================== Stats Counter Animation ====================
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const step = Math.ceil(duration / target);
    let current = 0;
    const timer = setInterval(() => {
        current += 1;
        el.textContent = current;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        }
    }, step);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-row').forEach(el => statObserver.observe(el));

// ==================== CLI Terminal ====================
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

const CLI_COMMANDS = {
    help: () => `Available commands: <span class="t-hl">about</span>, <span class="t-hl">skills</span>, <span class="t-hl">contact</span>, <span class="t-hl">resume</span>, <span class="t-hl">projects</span>, <span class="t-hl">faq</span>, <span class="t-hl">clear</span>, <span class="t-hl">hello</span>`,

    about: () => `<span class="t-hl">Aravindhan S</span> — Java Full Stack Developer &amp; QA Automation Engineer<br>📍 Chennai, India · B.E. CSE, 2025<br>🟢 Available immediately for new opportunities`,

    skills: () => `Languages: <span class="t-hl">Java, JavaScript, SQL</span><br>Backend: <span class="t-hl">Spring Boot, Spring MVC, REST APIs</span><br>Frontend: <span class="t-hl">HTML5, CSS3, JavaScript</span><br>QA: <span class="t-hl">Playwright, TestNG, Maven, POM</span><br>Tools: <span class="t-hl">Git, Postman, IntelliJ IDEA</span>`,

    contact: () => `📧 <a class="t-link" href="mailto:aravindh2003s@gmail.com">aravindh2003s@gmail.com</a><br>📞 <a class="t-link" href="tel:+918838544167">+91 8838544167</a><br>🔗 <a class="t-link" href="https://linkedin.com/in/aravindhan-s-37254b2a2" target="_blank">linkedin.com/in/aravindhan-s-37254b2a2</a>`,

    resume: () => {
        window.open('./images/ARAVINDHAN-Resume.pdf');
        return `<span class="t-hl">↗ Opening resume PDF...</span>`;
    },

    projects: () => `01. Employee Management System — <span class="t-hl">Java, Spring Boot, MySQL</span><br>02. Playwright Automation Framework — <span class="t-hl">Java, Playwright, TestNG</span><br>03. Project Manager App — <span class="t-hl">Java, Spring Boot, MySQL</span><br>04. Expense Tracker App — <span class="t-hl">Java, Spring Boot, MySQL</span><br>05. Personal Portfolio — <span class="t-hl">HTML, CSS, JavaScript</span>`,

    faq: () => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
        return `<span class="t-hl">↓ Scrolling to FAQ section...</span>`;
    },

    hello: () => `Hello, recruiter! 👋 Thanks for visiting.<br>Type <span class="t-hl">about</span> to learn more about me, or <span class="t-hl">contact</span> to reach out.`,

    clear: () => {
        terminalOutput.innerHTML = '';
        return null;
    }
};

function terminalPrint(cmd, response) {
    const cmdLine = document.createElement('p');
    cmdLine.className = 't-line';
    cmdLine.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">${cmd}</span>`;
    terminalOutput.appendChild(cmdLine);

    if (response !== null) {
        const resLine = document.createElement('p');
        resLine.className = 't-response';
        resLine.innerHTML = response;
        terminalOutput.appendChild(resLine);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            if (!cmd) return;

            const fn = CLI_COMMANDS[cmd];
            if (fn) {
                const result = fn();
                if (result !== undefined) terminalPrint(cmd, result);
            } else {
                terminalPrint(cmd, `<span style="color:#f87171">Command not found: ${cmd}. Type <span class="t-hl">help</span> for available commands.</span>`);
            }
        }
    });

    // Focus terminal on click
    document.getElementById('cliTerminal')?.addEventListener('click', () => {
        terminalInput.focus();
    });
}

// ==================== One-Click Copy + Toast ====================
function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text)
        .then(() => showToast(`${label} copied! ✓`))
        .catch(() => showToast('Copy failed'));
}

document.querySelectorAll('.contact-method-card').forEach(card => {
    const href = card.getAttribute('href') || '';
    let text = '', label = '';

    if (href.includes('mailto:')) {
        text = href.replace('mailto:', '');
        label = 'Email';
    } else if (href.includes('tel:')) {
        text = href.replace('tel:', '').replace('+91', '+91 ');
        label = 'Phone';
    }

    if (text) {
        card.title = `Click to copy ${label}`;
        card.addEventListener('click', (e) => {
            e.preventDefault();
            copyToClipboard(text, label);
        });
    }
});

// ==================== FAQ Accordion ====================
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

        // Open clicked if it was closed
        if (!isOpen) item.classList.add('open');
    });
});

// ==================== Accent Color Customizer ====================
const colorToggleBtn = document.getElementById('colorToggleBtn');
const colorPalette = document.getElementById('colorPalette');

colorToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    colorPalette.classList.toggle('visible');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#colorCustomizer')) {
        colorPalette?.classList.remove('visible');
    }
});

// Full color schemes keyed by accent hex
const COLOR_SCHEMES = {
    '#38bdf8': { // Cyan (default)
        accent: '#38bdf8',
        glow: 'rgba(56,189,248,0.15)',
        borderHover: 'rgba(56,189,248,0.6)',
        gradientText: 'linear-gradient(135deg,#38bdf8 0%,#818cf8 50%,#e879f9 100%)',
        bg1: '#0f172a', bg2: '#2e1065', bg3: '#172554', bg4: '#020617',
    },
    '#818cf8': { // Indigo
        accent: '#818cf8',
        glow: 'rgba(129,140,248,0.18)',
        borderHover: 'rgba(129,140,248,0.6)',
        gradientText: 'linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#e879f9 100%)',
        bg1: '#0f0a1e', bg2: '#1e1b4b', bg3: '#130f2a', bg4: '#030306',
    },
    '#e879f9': { // Fuchsia
        accent: '#e879f9',
        glow: 'rgba(232,121,249,0.18)',
        borderHover: 'rgba(232,121,249,0.6)',
        gradientText: 'linear-gradient(135deg,#e879f9 0%,#f472b6 50%,#fb923c 100%)',
        bg1: '#1a0a1e', bg2: '#4a044e', bg3: '#2d0a34', bg4: '#050206',
    },
    '#10b981': { // Emerald
        accent: '#10b981',
        glow: 'rgba(16,185,129,0.18)',
        borderHover: 'rgba(16,185,129,0.6)',
        gradientText: 'linear-gradient(135deg,#10b981 0%,#38bdf8 50%,#818cf8 100%)',
        bg1: '#041a0f', bg2: '#022c22', bg3: '#051a14', bg4: '#010805',
    },
    '#f59e0b': { // Amber
        accent: '#f59e0b',
        glow: 'rgba(245,158,11,0.18)',
        borderHover: 'rgba(245,158,11,0.6)',
        gradientText: 'linear-gradient(135deg,#f59e0b 0%,#fb923c 50%,#ef4444 100%)',
        bg1: '#180f03', bg2: '#292200', bg3: '#1c1100', bg4: '#060300',
    },
};

function applyAccent(color) {
    const scheme = COLOR_SCHEMES[color] || COLOR_SCHEMES['#38bdf8'];
    const root = document.documentElement;

    root.style.setProperty('--text-accent', scheme.accent);
    root.style.setProperty('--accent', scheme.accent);
    root.style.setProperty('--ambient-glow', scheme.glow);
    root.style.setProperty('--glass-border-hover', scheme.borderHover);
    root.style.setProperty('--gradient-text', scheme.gradientText);
    root.style.setProperty('--gradient-bg-1', scheme.bg1);
    root.style.setProperty('--gradient-bg-2', scheme.bg2);
    root.style.setProperty('--gradient-bg-3', scheme.bg3);
    root.style.setProperty('--gradient-bg-4', scheme.bg4);

    // Force body gradient recompute (CSS animations don't re-evaluate var() changes automatically)
    document.body.style.background = `linear-gradient(-45deg, ${scheme.bg1}, ${scheme.bg2}, ${scheme.bg3}, ${scheme.bg4})`;
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'none';
    // Re-trigger animation after a frame
    requestAnimationFrame(() => {
        document.body.style.animation = 'gradientBG 15s ease infinite';
    });

    localStorage.setItem('accentColor', color);
    document.querySelectorAll('.c-swatch').forEach(s =>
        s.classList.toggle('active', s.dataset.color === color)
    );
}

document.querySelectorAll('.c-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => applyAccent(swatch.dataset.color));
});

// Restore saved accent
const savedAccent = localStorage.getItem('accentColor');
if (savedAccent) applyAccent(savedAccent);

// ==================== Recruiter Mode Toggle ====================
const recruiterModeBtn = document.getElementById('recruiterModeBtn');
const recruiterOverlay = document.getElementById('recruiterOverlay');
const recruiterClose = document.getElementById('recruiterClose');

recruiterModeBtn?.addEventListener('click', () => {
    recruiterOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
});

function closeRecruiterMode() {
    recruiterOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

recruiterClose?.addEventListener('click', closeRecruiterMode);
recruiterOverlay?.addEventListener('click', (e) => {
    if (e.target === recruiterOverlay) closeRecruiterMode();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeRecruiterMode();
});

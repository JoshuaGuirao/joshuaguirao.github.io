// Role rotation animation
const roles = ['Software Engineer', 'Data Scientist'];
let currentRoleIndex = 0;

function rotateRole() {
  const roleText = document.querySelector('.role-text');
  if (roleText) {
    // Fade out
    roleText.style.opacity = '0';
    roleText.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      roleText.textContent = roles[currentRoleIndex];

      // Fade in
      roleText.style.opacity = '1';
      roleText.style.transform = 'translateY(0)';
    }, 300);
  }
}

// Start role rotation
setInterval(rotateRole, 2500);

// View Portfolio button functionality
const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const landingPage = document.querySelector('.landing-page');
const portfolio = document.getElementById('portfolio');

if (viewPortfolioBtn) {
  viewPortfolioBtn.addEventListener('click', () => {
    // Fade out landing page
    landingPage.classList.add('fade-out');

    // After fade out completes, fade in portfolio
    setTimeout(() => {
      portfolio.classList.add('fade-in');
      window.scrollTo(0, 0);
    }, 1000);
  });
}

if (backToHomeBtn) {
  backToHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Fade out portfolio
    portfolio.classList.remove('fade-in');

    // After fade out completes, fade in landing page
    setTimeout(() => {
      landingPage.classList.remove('fade-out');
      window.scrollTo(0, 0);
    }, 1000);
  });
}

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href.length <= 1) return; // "Home" is handled by backToHomeBtn
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections except the landing page
document.querySelectorAll('#portfolio section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'all 0.8s ease';
  observer.observe(section);
});

// Add active state to nav links on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('#portfolio section');
  const navLinks = document.querySelectorAll('nav a');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href').slice(1) === current) {
      link.style.color = 'var(--primary)';
    }
  });
});

// Parallax effect for header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (header) {
    const scrolled = window.pageYOffset;
    header.style.transform = `translateY(${scrolled * 0.5}px)`;
    header.style.opacity = 1 - scrolled / 500;
  }
});

// Collapsible experience entries
document.querySelectorAll('.experience-entry').forEach(entry => {
  const toggle = entry.querySelector('.exp-toggle');
  if (!toggle) return;
  const label = toggle.querySelector('.toggle-label');

  const sync = () => {
    const collapsed = entry.classList.contains('collapsed');
    toggle.setAttribute('aria-expanded', String(!collapsed));
    if (label) label.textContent = collapsed ? 'Show details' : 'Hide details';
  };

  sync();
  toggle.addEventListener('click', () => {
    entry.classList.toggle('collapsed');
    sync();
  });
});

// Live clocks in the footer (Boston and Singapore)
function updateClocks() {
  const now = new Date();
  const format = timeZone =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(now);

  const bos = document.getElementById('clockBos');
  const sgp = document.getElementById('clockSgp');
  if (bos) bos.textContent = format('America/New_York');
  if (sgp) sgp.textContent = format('Asia/Singapore');
}

updateClocks();
setInterval(updateClocks, 10000);

// Randomize background particle positions
document.addEventListener('DOMContentLoaded', () => {
  const particles = document.querySelectorAll('.bg-animation span');
  particles.forEach(particle => {
    particle.style.left = Math.random() * 100 + '%';
  });
});

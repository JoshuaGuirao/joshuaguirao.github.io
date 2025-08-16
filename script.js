// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Reveal section headings (h2) on scroll once
document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('h2');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active'); // your CSS should show/animate when .active is added
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  headers.forEach(h => io.observe(h));
});

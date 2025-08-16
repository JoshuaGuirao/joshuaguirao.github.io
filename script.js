// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Optional: reveal sections on scroll
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

<script>
document.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll("h2");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // run only once
            }
        });
    }, { threshold: 0.5 });

    headers.forEach(h2 => observer.observe(h2));
});
</script>


<script>
document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll("h2");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");   // makes it visible
        io.unobserve(entry.target);             // run once
      }
    });
  }, { threshold: 0.35 });

  headers.forEach(h => io.observe(h));
});
</script>


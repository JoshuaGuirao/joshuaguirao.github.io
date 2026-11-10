const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   Background: a dot lattice shaded by a moving wave field.
   Reads like a plotted function; ripples around the cursor.
   ========================================================= */
const field = (() => {
  const canvas = document.getElementById('field');
  if (!canvas) return { setIntensity() {} };
  const ctx = canvas.getContext('2d');

  const LEVELS = 12;
  const palette = [];
  const slate = [139, 151, 168];
  const blue = [91, 155, 230];
  const ice = [168, 199, 238];
  for (let i = 0; i < LEVELS; i++) {
    const v = i / (LEVELS - 1);
    const from = v < 0.6 ? slate : blue;
    const to = v < 0.6 ? blue : ice;
    const k = v < 0.6 ? v / 0.6 : (v - 0.6) / 0.4;
    const c = from.map((f, j) => Math.round(f + (to[j] - f) * k));
    const alpha = 0.1 + v * 0.7;
    palette.push(`rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha.toFixed(3)})`);
  }
  const buckets = Array.from({ length: LEVELS }, () => []);

  let width = 0;
  let height = 0;
  let gap = 28;
  let intensity = 1;
  let targetIntensity = 1;
  let lastFrame = 0;
  const pointer = { x: -9999, y: -9999, strength: 0, target: 0 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = width < 700 ? 24 : 28;
    if (prefersReducedMotion) draw(0);
  }

  function draw(time) {
    const t = time * 0.001;
    intensity += (targetIntensity - intensity) * 0.05;
    pointer.strength += (pointer.target - pointer.strength) * 0.08;

    for (const b of buckets) b.length = 0;

    const cx = width * 0.7;
    const cy = height * 0.35;

    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) {
        let v =
          Math.sin(x * 0.0062 + t * 0.55) +
          Math.sin(y * 0.0081 - t * 0.42) +
          Math.sin((x - y) * 0.0045 + t * 0.3) +
          Math.sin(Math.hypot(x - cx, y - cy) * 0.011 - t * 0.8);
        v = Math.pow((v + 4) / 8, 1.6);

        if (pointer.strength > 0.01) {
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          if (d < 240) {
            const falloff = 1 - d / 240;
            v += falloff * falloff * 0.65 * pointer.strength * (0.65 + 0.35 * Math.sin(d * 0.06 - t * 5));
          }
        }

        v = Math.min(1, v * intensity);
        const level = Math.min(LEVELS - 1, Math.floor(v * LEVELS));
        buckets[level].push(x, y, 1.2 + v * 2);
      }
    }

    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < LEVELS; i++) {
      const b = buckets[i];
      if (!b.length) continue;
      ctx.fillStyle = palette[i];
      for (let j = 0; j < b.length; j += 3) {
        const s = b[j + 2];
        ctx.fillRect(b[j] - s / 2, b[j + 1] - s / 2, s, s);
      }
    }
  }

  function loop(time) {
    // Cap at ~30fps; plenty for a slow field and easy on laptops
    if (time - lastFrame > 33) {
      draw(time);
      lastFrame = time;
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();

  if (prefersReducedMotion) {
    draw(0);
  } else {
    window.addEventListener('pointermove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.target = 1;
    });
    document.addEventListener('pointerleave', () => { pointer.target = 0; });
    window.addEventListener('blur', () => { pointer.target = 0; });
    requestAnimationFrame(loop);
  }

  return {
    setIntensity(value) {
      targetIntensity = value;
      if (prefersReducedMotion) {
        intensity = value;
        draw(0);
      }
    }
  };
})();

/* =========================================================
   Landing: typed role line
   ========================================================= */
const roles = ['Software Engineer', 'Data Scientist'];
const roleText = document.querySelector('.role-text');

if (roleText) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  if (prefersReducedMotion) {
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.textContent = roles[roleIndex];
    }, 3000);
  } else {
    const tick = () => {
      const word = roles[roleIndex];
      if (deleting) {
        charIndex--;
        roleText.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          return setTimeout(tick, 350);
        }
        return setTimeout(tick, 35);
      }
      const next = roles[roleIndex];
      charIndex++;
      roleText.textContent = next.slice(0, charIndex);
      if (charIndex === next.length) {
        deleting = true;
        return setTimeout(tick, 2000);
      }
      return setTimeout(tick, 70);
    };
    setTimeout(tick, 2200);
  }
}

/* =========================================================
   Landing <-> portfolio
   ========================================================= */
const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const landingPage = document.querySelector('.landing-page');
const portfolio = document.getElementById('portfolio');

if (viewPortfolioBtn) {
  viewPortfolioBtn.addEventListener('click', () => {
    window.scrollTo(0, 0);
    landingPage.classList.add('fade-out');
    portfolio.classList.add('fade-in');
    document.body.classList.remove('landing-open');
    field.setIntensity(0.55);
  });
}

if (backToHomeBtn) {
  backToHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    portfolio.classList.remove('fade-in');
    landingPage.classList.remove('fade-out');
    document.body.classList.add('landing-open');
    field.setIntensity(1);
    setTimeout(() => window.scrollTo(0, 0), 800);
  });
}

/* =========================================================
   Nav: highlight the section in view
   ========================================================= */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main .section');

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

/* =========================================================
   Experience: show / hide the older roles
   ========================================================= */
const moreRoles = document.getElementById('moreRoles');
const rolesToggle = document.getElementById('rolesToggle');

if (moreRoles && rolesToggle) {
  const label = rolesToggle.querySelector('.roles-toggle-label');
  const hiddenCount = moreRoles.querySelectorAll('.role').length;

  const sync = (open) => {
    moreRoles.classList.toggle('is-open', open);
    moreRoles.inert = !open;
    rolesToggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Show fewer roles' : `Show ${hiddenCount} more roles`;
  };

  sync(false);
  rolesToggle.addEventListener('click', () => {
    const open = !moreRoles.classList.contains('is-open');
    sync(open);
    if (!open) rolesToggle.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

/* =========================================================
   Footer clocks (Boston and Singapore)
   ========================================================= */
function updateClocks() {
  const now = new Date();
  const format = (timeZone) =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(now);

  const bos = document.getElementById('clockBos');
  const sgp = document.getElementById('clockSgp');
  if (bos) bos.textContent = format('America/New_York');
  if (sgp) sgp.textContent = format('Asia/Singapore');
}

updateClocks();
setInterval(updateClocks, 10000);

const nav = document.getElementById('mainNav');
const progress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const cursorGlow = document.getElementById('cursorGlow');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  backToTop.classList.toggle('show', y > 500);

  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${height ? (y / height) * 100 : 0}%`;

  document.querySelectorAll('section[id]').forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (link) link.classList.toggle('active', y >= top && y < bottom);
  });
});

backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navbarNav');
    if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.addEventListener('mousemove', e => {
  if (cursorGlow) {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

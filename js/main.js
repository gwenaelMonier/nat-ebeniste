/* === HEADER SCROLL === */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* === MOBILE NAV === */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* === ACTIVE NAV LINK ON SCROLL === */
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

/* === PORTFOLIO FILTER === */
const filterBtns  = document.querySelectorAll('.filter-btn');
const portfolioGrid = document.getElementById('portfolioGrid');
const items       = portfolioGrid ? [...portfolioGrid.querySelectorAll('.portfolio__item')] : [];

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    items.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.display = match ? '' : 'none';
    });
  });
});

/* === COUNTER ANIMATION === */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.round(current);
    if (current >= target) clearInterval(timer);
  }, step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__number').forEach(el => counterObserver.observe(el));

/* === FADE-IN ON SCROLL === */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.service-card, .portfolio__item, .testimonial, .about__values li, .contact__details li, .stat'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
  fadeObserver.observe(el);
});

/* === CONTACT FORM === */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

function getVal(id) { return document.getElementById(id)?.value.trim() ?? ''; }
function showError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.toggle('error', !!msg);
  if (err)   err.textContent = msg;
}
function clearErrors() {
  ['nom','email','sujet','message'].forEach(id => showError(id, id + 'Error', ''));
  showError('rgpd', 'rgpdError', '');
}

function validateForm() {
  let valid = true;
  clearErrors();

  if (!getVal('nom')) {
    showError('nom', 'nomError', 'Le nom est requis.');
    valid = false;
  }

  const email = getVal('email');
  if (!email) {
    showError('email', 'emailError', "L'email est requis.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'emailError', "Format d'email invalide.");
    valid = false;
  }

  if (!getVal('sujet')) {
    showError('sujet', 'sujetError', 'Veuillez choisir un type de projet.');
    valid = false;
  }

  if (!getVal('message')) {
    showError('message', 'messageError', 'Le message est requis.');
    valid = false;
  }

  const rgpd = document.getElementById('rgpd');
  if (rgpd && !rgpd.checked) {
    document.getElementById('rgpdError').textContent = 'Vous devez accepter pour continuer.';
    valid = false;
  }

  return valid;
}

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Envoi en cours…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Envoyer mon message';
      successMsg.classList.add('visible');
      setTimeout(() => successMsg.classList.remove('visible'), 6000);
    }, 1200);
  });
}
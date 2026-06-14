const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const toTop = document.querySelector('.to-top');
const cursorGlow = document.querySelector('.cursor-glow');

navToggle.addEventListener('click', () => {
  const isOpen = body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('mousemove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.counter);
    const duration = 1300;
    const startTime = performance.now();

    const update = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

function createPetals() {
  const stage = document.querySelector('.petal-stage');
  const petalCount = window.innerWidth < 720 ? 14 : 26;

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${8 + Math.random() * 10}s`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    petal.style.opacity = `${0.32 + Math.random() * 0.5}`;
    petal.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
    petal.style.transform = `scale(${0.55 + Math.random() * 1.1})`;
    stage.appendChild(petal);
  }
}

createPetals();

const memberCards = document.querySelectorAll('.member-card');
const stage = document.getElementById('memberStage');
const stageName = document.getElementById('stageName');
const stageText = document.getElementById('stageText');

function activateMember(card) {
  memberCards.forEach((item) => item.classList.remove('active-member'));
  card.classList.add('active-member');
  stage.style.setProperty('--stage-aura', card.dataset.aura);
  stageName.textContent = card.dataset.name;
  stageText.textContent = card.dataset.text;
}

memberCards.forEach((card) => {
  card.addEventListener('pointerenter', () => activateMember(card));
  card.addEventListener('click', () => activateMember(card));

  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    card.style.setProperty('--shine-x', `${x - rect.width / 2}px`);
    card.style.setProperty('--shine-y', `${y - rect.height / 2}px`);
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    galleryItems.forEach((item) => {
      const categories = item.dataset.category.split(' ');
      const shouldShow = filter === 'all' || categories.includes(filter);
      item.classList.toggle('hidden', !shouldShow);
    });
  });
});

const sections = document.querySelectorAll('main section[id]');
const menuLinks = document.querySelectorAll('.nav-links a');

function setActiveLink() {
  let current = '';
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 160) current = section.id;
  });

  menuLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 520);
  setActiveLink();
});

setActiveLink();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const fanForm = document.getElementById('fanForm');
const formMessage = document.getElementById('formMessage');

fanForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const member = new FormData(fanForm).get('member').trim();
  formMessage.textContent = `${member || 'BLACKPINK'} energy activated — welcome to the Bloom Area 💗`;
  fanForm.reset();
});

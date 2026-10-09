/* ============================================================
   Torana Studio — pre-launch one pager
  Edit LAUNCH_DATE and FORM_ENDPOINT below to update site settings.
   ============================================================ */

/* Launch date used by the countdown. Change this to your real date. */
const LAUNCH_DATE = new Date('2026-11-08T09:00:00-08:00'); // Diwali 2026

/* Paste a Formspree (or similar) endpoint to collect signups.
   While this is empty the form falls back to a pre-filled email. */
const FORM_ENDPOINT = '';
const STUDIO_EMAIL = 'hello@toranastudio.com';

const IMG = 'assets/img/';
const lg = n => `${IMG}${n}-lg.webp`;

/* Backdrops that rotate inside the hero arch. */
const HERO_SLIDES = [
  { n: 9, label: 'Mehendi & Haldi' },
  { n: 6, label: 'Wedding Mandap' },
  { n: 13, label: 'Festival at Home' },
  { n: 20, label: 'Baby Shower' },
];

/* ───────────────── collections ───────────────── */

const seriesGrid = document.getElementById('seriesGrid');

function renderSeriesCards() {
  if (!seriesGrid) return;
  seriesGrid.innerHTML = window.TORANA_COLLECTIONS.map((series, i) => `
    <article class="series-card reveal" data-delay="${i % 3}" data-series="${series.slug}">
      <div class="series-card__visual">
        <a class="series-card__image-link" href="collection.html?series=${series.slug}"
           aria-label="Explore ${series.name}">
          <img class="series-card__photo" src="${series.images[0].sm}"
               alt="${series.images[0].alt}" loading="lazy" decoding="async" />
        </a>
        ${series.images.length > 1 ? `
          <div class="series-card__pages" role="group" aria-label="${series.name} photos">
            ${series.images.map((image, index) => `
              <button class="series-card__page" type="button" data-image-index="${index}"
                      aria-label="Show ${series.name} photo ${index + 1} of ${series.images.length}"
                      aria-current="${index === 0 ? 'true' : 'false'}">
                <span class="sr-only">Photo ${index + 1}</span>
              </button>`).join('')}
          </div>
        ` : ''}
      </div>
      <a class="series-card__body" href="collection.html?series=${series.slug}">
        <span class="series-card__name">${series.name}</span>
        <span class="series-card__tagline">${series.tagline}</span>
        <span class="series-card__one-liner">${series.oneLiner}</span>
        <span class="series-card__link">Explore series <span aria-hidden="true">↗</span></span>
      </a>
    </article>
  `).join('');
}

renderSeriesCards();

if (seriesGrid) {
  seriesGrid.addEventListener('click', event => {
    const button = event.target.closest('.series-card__page');
    if (!button) return;

    const card = button.closest('.series-card');
    const collection = window.TORANA_COLLECTIONS.find(item => item.slug === card.dataset.series);
    const image = card.querySelector('.series-card__photo');
    const index = Number(button.dataset.imageIndex);
    card.dataset.imageIndex = index;
    image.src = collection.images[index].sm;
    image.alt = collection.images[index].alt || collection.name;
    card.querySelectorAll('.series-card__page').forEach((page, pageIndex) => {
      page.setAttribute('aria-current', String(pageIndex === index));
    });
  });
}

/* ───────────────── reveal on scroll ───────────────── */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ───────────────── hero arch slideshow ───────────────── */

const archFrame = document.getElementById('archFrame');
const archCaption = document.getElementById('archCaption');
let slideIndex = 0;

// Warm the remaining slides only once the critical hero load is done.
addEventListener('load', () => {
  const warm = () => HERO_SLIDES.slice(1).forEach(s => { new Image().src = lg(s.n); });
  'requestIdleCallback' in window ? requestIdleCallback(warm, { timeout: 4000 })
                                  : setTimeout(warm, 2000);
});

function nextSlide() {
  slideIndex = (slideIndex + 1) % HERO_SLIDES.length;
  const slide = HERO_SLIDES[slideIndex];

  const img = document.createElement('img');
  img.className = 'arch__slide';
  img.src = lg(slide.n);
  img.alt = `${slide.label} backdrop styled at home`;
  archFrame.appendChild(img);

  requestAnimationFrame(() => {
    img.classList.add('is-on');
    archFrame.querySelector('.arch__slide.is-on:not(:last-child)')?.classList.remove('is-on');
  });

  archCaption.classList.add('is-swapping');
  setTimeout(() => {
    archCaption.textContent = slide.label;
    archCaption.classList.remove('is-swapping');
  }, 400);

  setTimeout(() => {
    [...archFrame.querySelectorAll('.arch__slide:not(.is-on)')].forEach(el => el.remove());
  }, 1800);
}

if (!reduced) setInterval(nextSlide, 5200);

/* ───────────────── stat count-up ───────────────── */

const counters = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counters.unobserve(entry.target);

    const el = entry.target;
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target + suffix; return; }

    const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

/* ───────────────── parallax + scroll progress ───────────────── */

const progress = document.getElementById('navProgress');
const nav = document.getElementById('nav');
const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
let ticking = false;

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  nav.classList.toggle('is-stuck', window.scrollY > 24);

  if (!reduced) {
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2);
      el.style.transform = `translate3d(0, ${(-offset * el.dataset.parallax).toFixed(1)}px, 0)`;
    });
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });

onScroll();

/* ───────────────── sticky nav + mobile menu ───────────────── */

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A' && navLinks.classList.contains('is-open')) {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ───────────────── countdown ───────────────── */

const countdown = document.getElementById('countdown');

function tick() {
  const diff = LAUNCH_DATE - Date.now();
  const clamped = Math.max(diff, 0);
  const sec = Math.floor(clamped / 1000);

  const parts = {
    days: Math.floor(sec / 86400),
    hours: Math.floor((sec % 86400) / 3600),
    minutes: Math.floor((sec % 3600) / 60),
    seconds: sec % 60,
  };

  Object.entries(parts).forEach(([key, value]) => {
    countdown.querySelector(`[data-cd="${key}"]`).textContent =
      String(value).padStart(2, '0');
  });
}

tick();
setInterval(tick, 1000);

/* ───────────────── waitlist form ───────────────── */

const form = document.getElementById('waitlistForm');
const formNote = document.getElementById('formNote');
const submitBtn = form.querySelector('button[type="submit"]');

function setNote(text, state) {
  formNote.textContent = text;
  formNote.className = state ? `formnote is-${state}` : 'formnote';
}

async function postSignup(payload) {
  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Signup failed with status ${res.status}`);
}

function mailtoFallback(payload) {
  const body = Object.entries(payload)
    .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v || '—'}`)
    .join('\n');
  window.location.href =
    `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent('Founding list — ' + payload.name)}` +
    `&body=${encodeURIComponent(body)}`;
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const fields = form.elements;
  const payload = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    region: fields.region.value,
    occasion: fields.occasion.value.trim(),
  };
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email);

  document.getElementById('wlName').classList.toggle('is-error', !payload.name);
  document.getElementById('wlEmail').classList.toggle('is-error', !validEmail);

  if (!payload.name || !validEmail) {
    setNote('Please add your name and a valid email address.', 'err');
    return;
  }

  const firstName = payload.name.split(' ')[0];

  if (!FORM_ENDPOINT) {
    mailtoFallback(payload);
    setNote(`Thank you, ${firstName}. Send the email that just opened and you are on the list.`, 'ok');
    return;
  }

  submitBtn.disabled = true;
  setNote('Tying your name to the garland…');

  try {
    await postSignup(payload);
    setNote(`Thank you, ${firstName}. You are on the founding list — watch your inbox.`, 'ok');
    form.reset();
  } catch {
    setNote(`Something went wrong on our side. Email us at ${STUDIO_EMAIL} and we will add you by hand.`, 'err');
  } finally {
    submitBtn.disabled = false;
  }
});

/* ───────────────── misc ───────────────── */

document.getElementById('year').textContent = new Date().getFullYear();

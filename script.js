/* ============================================================
   Torana Studio — pre-launch one pager
   Edit LAUNCH_DATE, PRODUCTS and GALLERY below to update content.
   ============================================================ */

/* Launch date used by the countdown. Change this to your real date. */
const LAUNCH_DATE = new Date('2026-11-08T09:00:00-08:00'); // Diwali 2026

/* Paste a Formspree (or similar) endpoint to collect signups.
   While this is empty the form falls back to a pre-filled email. */
const FORM_ENDPOINT = '';
const STUDIO_EMAIL = 'hello@toranastudio.com';

const IMG = 'assets/img/';
const sm = n => `${IMG}${n}-sm.webp`;
const lg = n => `${IMG}${n}-lg.webp`;

const PRODUCTS = [
  {
    n: 5,
    cat: 'Wedding & Reception',
    name: 'Kalyanam Grand Arch',
    copy: 'A ceremonial stage backdrop in Kumkum crimson with kolam line art, layered garlands and brass styling.',
    tags: ['Buy', 'Rent'],
  },
  {
    n: 13,
    cat: 'Mehendi & Haldi',
    name: 'Marigold Courtyard',
    copy: 'Sun-warm ochre and marigold tones for the loudest, happiest night of the wedding week.',
    tags: ['Buy', 'Rent'],
  },
  {
    n: 17,
    cat: 'Pooja & Festival',
    name: 'Temple Threshold',
    copy: 'A serene devotional setup built around lamps, lotus motifs and a calm, symmetrical centre.',
    tags: ['Buy'],
  },
  {
    n: 20,
    cat: 'Baby Shower & Naming',
    name: 'Seemantham Soft Bloom',
    copy: 'Gentle pastels, floral strings and cane seating for seemantham, godh bharai and namakaranam.',
    tags: ['Buy', 'Rent'],
  },
  {
    n: 18,
    cat: 'Birthday & Milestone',
    name: 'First Year Festoon',
    copy: 'A playful, photo-ready corner that still feels rooted — cloth banners instead of foil balloons.',
    tags: ['Buy'],
  },
  {
    n: 15,
    cat: 'Griha Pravesh',
    name: 'New Home Toran',
    copy: 'The entrance set — doorway toran, floor-side props and a backdrop that welcomes the first guest.',
    tags: ['Rent'],
  },
];

/* Backdrops that rotate inside the hero arch. */
const HERO_SLIDES = [
  { n: 9, label: 'Mehendi & Haldi' },
  { n: 6, label: 'Wedding Mandap' },
  { n: 13, label: 'Marigold Courtyard' },
  { n: 20, label: 'Baby Shower' },
];

/* Square files are flat backdrop prints, the rest are styled setups. */
const GALLERY = [
  { n: 1, type: 'print' },
  { n: 3, type: 'print' },
  { n: 11, type: 'print' },
  { n: 12, type: 'print' },
  { n: 14, type: 'print' },
  { n: 16, type: 'print' },
  { n: 19, type: 'print' },
  { n: 2, type: 'styled' },
  { n: 4, type: 'styled' },
  { n: 5, type: 'styled' },
  { n: 6, type: 'styled' },
  { n: 7, type: 'styled' },
  { n: 8, type: 'styled' },
  { n: 9, type: 'styled' },
  { n: 10, type: 'styled' },
  { n: 13, type: 'styled' },
  { n: 15, type: 'styled' },
  { n: 17, type: 'styled' },
  { n: 18, type: 'styled' },
  { n: 20, type: 'styled' },
];

const LABEL = {
  print: 'Backdrop print · hand-illustrated on cloth',
  styled: 'Styled setup · kit + props',
};

/* ───────────────── products ───────────────── */

const productGrid = document.getElementById('productGrid');

productGrid.innerHTML = PRODUCTS.map((p, i) => `
  <article class="product reveal" data-delay="${i % 3}">
    <div class="product__media">
      <img src="${sm(p.n)}" alt="${p.name} backdrop setup" loading="lazy" decoding="async" />
      <div class="product__tags">
        ${p.tags.map(t => `<span class="tag tag--${t.toLowerCase()}">To ${t}</span>`).join('')}
      </div>
    </div>
    <div class="product__body">
      <p class="product__cat">${p.cat}</p>
      <h3>${p.name}</h3>
      <p>${p.copy}</p>
      <div class="product__foot">
        <span class="product__price">from <b>$000</b></span>
        <span class="product__soon">Coming soon</span>
      </div>
    </div>
  </article>
`).join('');

/* ───────────────── gallery ───────────────── */

const gallery = document.getElementById('gallery');

gallery.innerHTML = GALLERY.map((g, i) => `
  <button class="tile" type="button" data-type="${g.type}" data-index="${i}"
          data-full="${lg(g.n)}"
          aria-label="Open image ${i + 1} of ${GALLERY.length}">
    <img src="${sm(g.n)}" alt="${LABEL[g.type]}" loading="lazy" decoding="async" />
    <span class="tile__veil"><span>${LABEL[g.type]}</span></span>
  </button>
`).join('');

document.querySelectorAll('.lookbook__filters .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    document.querySelectorAll('.lookbook__filters .chip')
      .forEach(c => c.classList.toggle('is-active', c === chip));
    gallery.querySelectorAll('.tile').forEach(tile => {
      tile.classList.toggle('is-hidden', filter !== 'all' && tile.dataset.type !== filter);
    });
  });
});

/* ───────────────── lightbox ───────────────── */

const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');
let lbIndex = 0;
let lastFocused = null;

function visibleTiles() {
  return [...gallery.querySelectorAll('.tile:not(.is-hidden)')];
}

function showImage(index) {
  const tiles = visibleTiles();
  if (!tiles.length) return;
  lbIndex = (index + tiles.length) % tiles.length;
  const tile = tiles[lbIndex];
  const img = tile.querySelector('img');
  lbImage.src = tile.dataset.full || img.src;
  lbImage.alt = img.alt;
  lbCaption.textContent = `${img.alt} — ${lbIndex + 1} / ${tiles.length}`;
}

function openLightbox(tile) {
  lastFocused = tile;
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
  showImage(visibleTiles().indexOf(tile));
  document.getElementById('lbClose').focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => { lightbox.hidden = true; }, 350);
  if (lastFocused) lastFocused.focus();
}

gallery.addEventListener('click', e => {
  const tile = e.target.closest('.tile');
  if (tile) openLightbox(tile);
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => showImage(lbIndex - 1));
document.getElementById('lbNext').addEventListener('click', () => showImage(lbIndex + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showImage(lbIndex - 1);
  if (e.key === 'ArrowRight') showImage(lbIndex + 1);
});

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

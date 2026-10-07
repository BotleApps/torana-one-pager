/* ============================================================
   Torana Studio — pre-launch one pager
   Edit LAUNCH_DATE, PRODUCTS and GALLERY below to update content.
   ============================================================ */

/* Launch date used by the countdown. Change this to your real date. */
const LAUNCH_DATE = new Date('2026-11-08T09:00:00-08:00'); // Diwali 2026

const IMG = 'assets/backdrops/IMG_0D1C675FEC95-';

const PRODUCTS = [
  {
    img: IMG + '5.jpeg',
    cat: 'Wedding & Reception',
    name: 'Kalyanam Grand Arch',
    copy: 'A ceremonial stage backdrop in Kumkum crimson with kolam line art, layered garlands and brass styling.',
    tags: ['Buy', 'Rent'],
  },
  {
    img: IMG + '13.jpeg',
    cat: 'Mehendi & Haldi',
    name: 'Marigold Courtyard',
    copy: 'Sun-warm ochre and marigold tones for the loudest, happiest night of the wedding week.',
    tags: ['Buy', 'Rent'],
  },
  {
    img: IMG + '17.jpeg',
    cat: 'Pooja & Festival',
    name: 'Temple Threshold',
    copy: 'A serene devotional setup built around lamps, lotus motifs and a calm, symmetrical centre.',
    tags: ['Buy'],
  },
  {
    img: IMG + '20.jpeg',
    cat: 'Baby Shower & Naming',
    name: 'Seemantham Soft Bloom',
    copy: 'Gentle pastels, floral strings and cane seating for seemantham, godh bharai and namakaranam.',
    tags: ['Buy', 'Rent'],
  },
  {
    img: IMG + '18.jpeg',
    cat: 'Birthday & Milestone',
    name: 'First Year Festoon',
    copy: 'A playful, photo-ready corner that still feels rooted — cloth banners instead of foil balloons.',
    tags: ['Buy'],
  },
  {
    img: IMG + '15.jpeg',
    cat: 'Griha Pravesh',
    name: 'New Home Toran',
    copy: 'The entrance set — doorway toran, floor-side props and a backdrop that welcomes the first guest.',
    tags: ['Rent'],
  },
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
      <img src="${p.img}" alt="${p.name} backdrop setup" loading="lazy" />
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
          aria-label="Open image ${i + 1} of ${GALLERY.length}">
    <img src="${IMG}${g.n}.jpeg" alt="${LABEL[g.type]}" loading="lazy" />
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
  lbImage.src = img.src;
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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ───────────────── sticky nav + mobile menu ───────────────── */

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-stuck', window.scrollY > 24);
}, { passive: true });

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
/* No backend yet: validates, then opens a pre-filled email to the studio.
   Swap the handler for a Formspree / Mailchimp endpoint at launch.        */

const form = document.getElementById('waitlistForm');
const formNote = document.getElementById('formNote');
const STUDIO_EMAIL = 'hello@toranastudio.com';

form.addEventListener('submit', e => {
  e.preventDefault();

  const fields = form.elements;
  const name = fields.name.value.trim();
  const email = fields.email.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  form.querySelector('#wlName').classList.toggle('is-error', !name);
  form.querySelector('#wlEmail').classList.toggle('is-error', !valid);

  if (!name || !valid) {
    formNote.textContent = 'Please add your name and a valid email address.';
    formNote.className = 'formnote is-err';
    return;
  }

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Region: ${fields.region.value || '—'}`,
    `Occasion: ${fields.occasion.value.trim() || '—'}`,
  ].join('\n');

  window.location.href =
    `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent('Founding list — ' + name)}` +
    `&body=${encodeURIComponent(body)}`;

  formNote.textContent = `Thank you, ${name.split(' ')[0]}. You are on the founding list — watch your inbox.`;
  formNote.className = 'formnote is-ok';
  form.reset();
});

/* ───────────────── misc ───────────────── */

document.getElementById('year').textContent = new Date().getFullYear();

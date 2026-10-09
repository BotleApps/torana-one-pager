const params = new URLSearchParams(window.location.search);
const slug = params.get('series');
const series = window.TORANA_COLLECTIONS.find(item => item.slug === slug);
const detail = document.getElementById('main');
const notFound = document.getElementById('seriesNotFound');

document.getElementById('year').textContent = new Date().getFullYear();

if (!series) {
  notFound.hidden = false;
  document.title = 'Collection not found | Torana Studio';
  document.querySelector('meta[name="robots"]').content = 'noindex, follow';
} else {
  detail.hidden = false;
  document.body.dataset.series = series.slug;
  document.title = `${series.name} | Torana Studio`;

  const description = `${series.shortDescription} ${series.tagline}`;
  const canonical = `${window.location.origin}${window.location.pathname}?series=${series.slug}`;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('link[rel="canonical"]').href = canonical;
  document.getElementById('ogTitle').content = `${series.name} | Torana Studio`;
  document.getElementById('ogDescription').content = description;
  document.getElementById('ogUrl').content = canonical;
  const socialImage = new URL(series.images[0].lg, window.location.href).href;
  document.getElementById('ogImage').content = socialImage;
  document.getElementById('twitterTitle').content = `${series.name} | Torana Studio`;
  document.getElementById('twitterDescription').content = description;
  document.getElementById('twitterImage').content = socialImage;

  document.getElementById('breadcrumbName').textContent = series.name;
  document.getElementById('seriesOneLiner').textContent = series.oneLiner;
  document.getElementById('seriesName').textContent = series.name;
  document.getElementById('seriesTagline').textContent = series.tagline;
  document.getElementById('seriesShort').textContent = series.shortDescription;
  document.getElementById('seriesLong').textContent = series.longDescription;
  document.getElementById('seriesTags').innerHTML = series.tags
    .map(tag => `<li>#${tag}</li>`).join('');
  document.getElementById('productsIntro').textContent =
    `A closer look at the individual designs in the ${series.name}.`;
  document.getElementById('productList').innerHTML = series.products.length
    ? series.products.map(product => `
      <article class="series-product">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </article>`).join('')
    : `<p>Individual product listings are being prepared for this series. Join the founding list to be among the first to see them.</p>`;

  renderGallery(series);
  addCollectionSchema(series, canonical, description);
  setUpNavigation();
}

function renderGallery(collection) {
  const gallery = document.getElementById('seriesGallery');
  if (!collection.images.length) {
    gallery.innerHTML = `
      <div class="series-gallery__placeholder" role="img" aria-label="Photographs for the ${collection.name} are coming soon">
        <span class="series-gallery__index">The collection</span>
        <span class="series-gallery__monogram">${collection.name.charAt(0)}</span>
        <span class="series-gallery__caption">Photographs coming soon</span>
      </div>`;
    return;
  }

  gallery.innerHTML = `
    <div class="series-gallery__grid">
      ${collection.images.map((image, index) => `
        <button class="series-gallery__item" type="button" data-full="${image.lg}"
                data-alt="${image.alt}" aria-label="View ${collection.name} photo ${index + 1}">
          <img src="${image.sm}"
               alt="${image.alt}" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async" />
        </button>`).join('')}
    </div>`;

  const dialog = document.getElementById('seriesImageDialog');
  const dialogImage = document.getElementById('seriesImageDialogPhoto');
  gallery.addEventListener('click', event => {
    const item = event.target.closest('.series-gallery__item');
    if (!item) return;
    dialogImage.src = item.dataset.full;
    dialogImage.alt = item.dataset.alt;
    dialog.showModal();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) dialog.close();
  });
}

function addCollectionSchema(collection, canonical, description) {
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    headline: collection.tagline,
    description,
    url: canonical,
    isPartOf: 'https://www.toranastudio.com/',
    keywords: collection.tags.join(', '),
    about: collection.shortDescription,
    image: collection.images.map(image => new URL(image.lg, window.location.href).href),
  });
  document.head.appendChild(schema);
}

function setUpNavigation() {
  const nav = document.getElementById('nav');
  const progress = document.getElementById('navProgress');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    nav.classList.toggle('is-stuck', window.scrollY > 24);
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.addEventListener('click', event => {
    if (event.target.closest('a') && links.classList.contains('is-open')) {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

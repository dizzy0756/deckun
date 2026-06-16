// ─── Lightbox ────────────────────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');

  let currentImages = [];
  let currentIndex = 0;

  function showImage(index) {
    lightboxImg.src = currentImages[index];
  }

  document.querySelectorAll('.product-main-img').forEach(img => {
    img.addEventListener('click', () => {
      currentImages = JSON.parse(img.dataset.images);
      currentIndex = 0;
      lightbox.style.display = 'flex';
      showImage(currentIndex);
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage(currentIndex);
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });

  document.addEventListener('keydown', e => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'Escape') closeBtn.click();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextBtn.click();
      else prevBtn.click();
    }
  });
}

// ─── WhatsApp Enquire Buttons ────────────────────────────────────────────────
const WHATSAPP_NUMBER = '917005286053'; // Your WhatsApp number (with country code, no +)
const PAGE_URL = 'https://www.deckun.in/products'; // ← update to your actual products page URL

document.querySelectorAll('.whatsapp-enquire').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    const product = this.dataset.product;
    const price   = this.dataset.price;
    const image   = this.dataset.image;
    const trackValue = parseFloat(this.dataset.trackValue) || 0;

    // Build the absolute thumbnail URL for sharing
    const thumbUrl = window.location.origin + '/' + image;

    // Pre-filled message sent to WhatsApp
    const message =
      `Hi! I'm interested in the *${product}* (${price}) from Deckun.\n\n` +
      `🛒 Product page: ${PAGE_URL}\n` +
      `🖼️ ${thumbUrl}\n\n` +
      `Could you please share more details?`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Fire existing GA / Meta tracking
    if (typeof trackAddToCart === 'function') {
      trackAddToCart(trackValue, 'INR', product);
    }

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
});

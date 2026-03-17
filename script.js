const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.lightbox .close');
const prevBtn = document.querySelector('.lightbox .prev');
const nextBtn = document.querySelector('.lightbox .next');

let currentImages = [];
let currentIndex = 0;

// Open lightbox on image click
document.querySelectorAll('.product-main-img').forEach(img => {
  img.addEventListener('click', () => {
    currentImages = JSON.parse(img.dataset.images);
    currentIndex = 0;
    lightbox.style.display = 'flex';
    lightboxImg.src = currentImages[currentIndex];
  });
});

// Close lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Navigate images
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  lightboxImg.src = currentImages[currentIndex];
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  lightboxImg.src = currentImages[currentIndex];
});

// Close when clicking outside image
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});
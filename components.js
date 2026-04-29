const pathname = location.pathname;
let CURRENT_PAGE = pathname.split('/').pop() || 'index.html';

if (CURRENT_PAGE.includes('\\')) {
  CURRENT_PAGE = CURRENT_PAGE.split('\\').pop() || 'index.html';
}

if (!CURRENT_PAGE || !CURRENT_PAGE.includes('.html')) {
  CURRENT_PAGE = 'index.html';
}

const navHTML = `
<nav class="navbar">
  <div class="logo-container">
    <a href="index.html" onclick="trackViewContent('home')">
      <img src="images/logo.png" alt="Deckun Logo" class="logo" width="80" height="80">
    </a>
    <div class="brand-text">
      <span class="motto">Live More Outdoors</span>
    </div>
  </div>
  <ul class="nav-links">
    <li><a href="index.html" onclick="trackViewContent('nav_home')">Home</a></li>
    <li><a href="products.html" onclick="trackViewContent('nav_products')">Products</a></li>
    <li><a href="reviews.html" onclick="trackViewContent('nav_reviews')">Reviews</a></li>
    <li><a href="contact.html" onclick="trackContact('', 'nav_contact')">Contact</a></li>
    <li><a href="about.html" onclick="trackViewContent('nav_about')">About Us</a></li>
  </ul>
</nav>`;

const footerHTML = `
<p>
  &copy; 2026 Deckun &nbsp;|&nbsp;
  <a href="privacy.html" onclick="trackViewContent('privacy_policy')">Privacy Policy</a> &nbsp;|&nbsp;
  <a href="terms.html" onclick="trackViewContent('terms_conditions')">Terms &amp; Conditions</a>
</p>`;

function initComponents() {
  const header = document.querySelector('header');
  if (header) {
    header.innerHTML = navHTML;

    header.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === CURRENT_PAGE) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  const footer = document.querySelector('footer');
  if (footer) footer.innerHTML = footerHTML;
}

document.addEventListener('DOMContentLoaded', initComponents);

function trackPixelEvent(eventName, eventData = {}) {
  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, eventData);
  }
}

function trackViewContent(value, currency = 'INR') {
  trackPixelEvent('ViewContent', { value, currency });
}

function trackAddToCart(value, currency = 'INR', content_name = 'Product Inquiry') {
  trackPixelEvent('AddToCart', { value, currency, content_name });
}

function trackContact(value = '', method = 'direct_contact') {
  trackPixelEvent('Contact', { value, method });
}

function trackLead(value = '', lead_type = 'review') {
  trackPixelEvent('Lead', { value, lead_type });
}

function trackLinkClick(text = '') {
  trackPixelEvent('ViewContent', { content_name: text || 'Link Click' });
}

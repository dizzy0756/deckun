// Detect current page - robust handling for web servers and local files
const pathname = location.pathname;
let CURRENT_PAGE = pathname.split('/').pop() || 'index.html';
// If the filename contains path separators (Windows local file), get just the filename
if (CURRENT_PAGE.includes('\\')) {
  CURRENT_PAGE = CURRENT_PAGE.split('\\').pop() || 'index.html';
}
// If it's still empty or is the directory name, default to index.html
if (!CURRENT_PAGE || !CURRENT_PAGE.includes('.html')) {
  CURRENT_PAGE = 'index.html';
}

const navHTML = `
<nav class="navbar">
  <div class="logo-container">
    <a href="index.html">
      <img src="images/logo.png" alt="Deckun Logo" class="logo" width="80" height="80">
    </a>
    <div class="brand-text">
      <span class="meitei">ꯗꯦꯛꯀꯨꯟ</span>
      <span class="motto">Live More Outdoors</span>
    </div>
  </div>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="products.html">Products</a></li>
    <li><a href="reviews.html">Reviews</a></li>
    <li><a href="contact.html">Contact</a></li>
    <li><a href="about.html">About Us</a></li>
  </ul>
</nav>`;

const footerHTML = `
<p>
  &copy; 2026 Deckun &nbsp;|&nbsp;
  <a href="privacy.html">Privacy Policy</a> &nbsp;|&nbsp;
  <a href="terms.html">Terms &amp; Conditions</a>
</p>`;

function initComponents() {
  const header = document.querySelector('header');
  if (header) {
    header.innerHTML = navHTML;

    // Mark active nav link
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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5OqlqBGrEMGSmcaxsdizM7mutpKaoNxU",
  authDomain: "deckun-3075f.firebaseapp.com",
  projectId: "deckun-3075f",
  storageBucket: "deckun-3075f.firebasestorage.app",
  messagingSenderId: "447598334623",
  appId: "1:447598334623:web:91d1422f78350e394c88aa"
};

const IS_DEMO = firebaseConfig.apiKey === "Your-API-Key-Here";

function starsHTML(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function timeAgo(ts) {
  if (!ts) return "verified buyer";
  const diff  = Date.now() - ts.toMillis();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 2)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 30) return `${days}d ago`;
  return ts.toDate().toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

function buildCard(data, idx) {
  const card = document.createElement("div");
  card.className = "rev-card";
  card.style.animationDelay = `${idx * 55}ms`;
  card.dataset.rating = data.rating;
  card.innerHTML = `
    <div class="rev-card-top">
      <div class="rev-avatar">${initials(data.name)}</div>
      <div class="rev-meta">
        <div class="rev-name">${escHtml(data.name)}</div>
        <div class="rev-date">${timeAgo(data.createdAt)}</div>
      </div>
      <div class="rev-stars">${starsHTML(data.rating)}</div>
    </div>
    <span class="rev-product-tag">${escHtml(data.product)}</span>
    <p class="rev-text">${escHtml(data.review)}</p>
  `;
  return card;
}

function updateStats(reviews) {
  const total = reviews.length;
  const avg   = total
    ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
    : null;
  const fives = reviews.filter(r => r.rating === 5).length;

  document.getElementById("stat-total").textContent = total || "—";
  document.getElementById("stat-avg").textContent   = avg ? avg + " ★" : "—";
  document.getElementById("stat-five").textContent  = total ? fives : "—";
}

let activeFilter = "all";

document.getElementById("filter-bar").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  applyFilter();
});

function applyFilter() {
  document.querySelectorAll(".rev-card").forEach(card => {
    const show = activeFilter === "all" || card.dataset.rating === activeFilter;
    card.style.display = show ? "" : "none";
  });
}

const feedEl = document.getElementById("reviews-feed");

function renderReviews(reviews) {
  feedEl.innerHTML = "";
  if (!reviews.length) {
    feedEl.innerHTML = `<div class="feed-state"><span class="icon">🌲</span><p>No reviews yet — be the first to share your experience!</p></div>`;
    updateStats([]);
    return;
  }
  reviews.forEach((r, i) => feedEl.appendChild(buildCard(r, i)));
  updateStats(reviews);
  applyFilter();
}

const DEMO_REVIEWS = [
  { name: "Pritam L.",  product: "Foldable Chair with Armrest (Black)",    rating: 5, review: "Absolutely love this chair! Used it on a 3-day camping trip and it held up perfectly. Super comfortable and packs down really compact.", createdAt: null },
  { name: "Priya K.",   product: "Camping Tarp",                           rating: 5, review: "Great quality tarp. Set it up in under 10 minutes during a rainy trek in Coorg — stayed completely dry underneath. Will definitely buy again!", createdAt: null },
  { name: "Rohit S.",   product: "Cassette Stove",                         rating: 4, review: "Compact and lights up instantly. Works great at altitude too. Only minor gripe is the gas cartridge compatibility could be a bit broader.", createdAt: null },
  { name: "Thoiba T.",  product: "Foldable Stool",                         rating: 5, review: "Perfect for beach trips. Light as a feather and takes zero space in my bag. My whole family has one now!", createdAt: null },
  { name: "Vivek P.",   product: "Foldable Chair with Leg Rest",           rating: 4, review: "Very comfortable chair. The leg rest is a game changer for evening sits around the campfire. Build quality feels really solid.", createdAt: null },
  { name: "Oscar R.",   product: "Other / General",                        rating: 5, review: "Deckun makes such thoughtful outdoor gear. Every product I've bought has exceeded expectations. Proud to support a homegrown brand!", createdAt: null },
];

if (IS_DEMO) {
  setTimeout(() => renderReviews(DEMO_REVIEWS), 800);

  document.getElementById("review-form").addEventListener("submit", e => {
    e.preventDefault();
    showToast("ℹ️ Connect Firebase to enable live review submission.");
  });

} else {
  const app = initializeApp(firebaseConfig);
  const db  = getFirestore(app);
  const col = collection(db, "deckun-reviews");

  onSnapshot(
    query(col, orderBy("createdAt", "desc")),
    snap => renderReviews(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err  => {
      console.error("Firestore error:", err);
      feedEl.innerHTML = `<div class="feed-state"><span class="icon">⚠️</span><p>Couldn't load reviews. Please try again later.</p></div>`;
    }
  );

  document.getElementById("review-form").addEventListener("submit", async e => {
    e.preventDefault();

    const name     = document.getElementById("reviewer-name").value.trim();
    const product  = document.getElementById("reviewer-product").value;
    const ratingEl = document.querySelector('input[name="rating"]:checked');
    const review   = document.getElementById("reviewer-text").value.trim();

    if (!name || !product || !ratingEl || !review) {
      showToast("⚠️ Please fill in all fields and select a rating.");
      return;
    }

    const btn = document.getElementById("submit-btn");
    const lbl = document.getElementById("btn-label");
    btn.disabled = true;
    lbl.textContent = "Posting…";

    try {
      await addDoc(col, {
        name,
        product,
        rating:    parseInt(ratingEl.value),
        review,
        createdAt: serverTimestamp()
      });
      e.target.reset();
      showToast("🌿 Review posted — thank you!");
    } catch (err) {
      console.error(err);
      showToast("❌ Couldn't post your review. Please try again.");
    } finally {
      btn.disabled = false;
      lbl.textContent = "Post Review";
    }
  });
}

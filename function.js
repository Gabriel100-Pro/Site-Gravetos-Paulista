const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile menu
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navList.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navList.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "Imagem";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

document.querySelectorAll(".gallery__item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-full");
    const img = btn.querySelector("img");
    openLightbox(src, img?.alt);
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// Reviews like button (persist in localStorage)
(function initReviewLikes(){
  const STORAGE_KEY = "gravetos_reviews_likes_v1";

  function loadState(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    }catch(e){
      return {};
    }
  }

  function saveState(state){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  const state = loadState();
  const reviews = document.querySelectorAll(".review");

  reviews.forEach((review, index) => {
    const btn = review.querySelector(".review__like");
    const countEl = review.querySelector("[data-count]");
    if(!btn || !countEl) return;

    const id = review.getAttribute("data-review-id") || String(index);

    // restore
    const saved = state[id];
    if(saved){
      countEl.textContent = String(saved.count ?? 0);
      if(saved.liked) btn.classList.add("is-liked");
    }

    btn.addEventListener("click", () => {
      const liked = btn.classList.toggle("is-liked");

      let count = parseInt(countEl.textContent || "0", 10);
      if(Number.isNaN(count)) count = 0;

      count = liked ? count + 1 : Math.max(0, count - 1);
      countEl.textContent = String(count);

      state[id] = { liked, count };
      saveState(state);
    });
  });
})();
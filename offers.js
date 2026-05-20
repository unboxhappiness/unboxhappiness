/* =========================================================
   OFFERS PAGE SCRIPT
   Unbox Happiness - Our Offers
========================================================= */

const offersGrid = document.getElementById("offersGrid");

/* =========================================================
   LOAD OFFERS
========================================================= */

async function loadOffers() {

  try {

    // SHOW LOADING STATE

    offersGrid.innerHTML = `
      <div style="
        color:white;
        text-align:center;
        width:100%;
        padding:40px;
        font-size:18px;
      ">
        Loading offers...
      </div>
    `;

    // FETCH JSON

    const response = await fetch("offers.json");

    if (!response.ok) {
      throw new Error("Unable to load offers.json");
    }

    const offers = await response.json();

    // CLEAR LOADER

    offersGrid.innerHTML = "";

    // CHECK EMPTY

    if (!offers.length) {

      offersGrid.innerHTML = `
        <div style="
          color:white;
          text-align:center;
          width:100%;
          padding:40px;
          font-size:18px;
        ">
          No offers available yet.
        </div>
      `;

      return;
    }

    // NEWEST FIRST

    offers.reverse();

    // CREATE CARDS

    offers.forEach((offer, index) => {

      const card = document.createElement("div");

      card.className = "offer-card reveal";

      card.style.animationDelay = `${index * 0.08}s`;

      card.innerHTML = `

        <div class="offer-image-wrap">

          <img
            src="${offer.image}"
            alt="${offer.title}"
            class="offer-image"
            loading="lazy"
          >

        </div>

        <div class="offer-content">

          <div class="offer-title">
            ${offer.title}
          </div>

          <div class="offer-actions">

            <button class="offer-btn share-btn">
              Share
            </button>

            <a
              href="${offer.image}"
              download
              class="offer-btn download-btn"
            >
              Download
            </a>

          </div>

        </div>
      `;

      offersGrid.appendChild(card);

      /* IMAGE CLICK */

      const image = card.querySelector(".offer-image");

      image.addEventListener("click", () => {
        openModal(offer.image);
      });

      /* IMAGE ERROR */

      image.addEventListener("error", () => {

        image.src =
          "https://via.placeholder.com/600x800?text=Image+Not+Found";

      });

      /* SHARE BUTTON */

      const shareBtn = card.querySelector(".share-btn");

      shareBtn.addEventListener("click", () => {
        shareOffer(offer);
      });

    });

    // INIT REVEAL

    initRevealAnimation();

  } catch (error) {

    console.error("OFFERS ERROR:", error);

    offersGrid.innerHTML = `
      <div style="
        color:white;
        text-align:center;
        width:100%;
        padding:40px;
      ">
        <h3>Unable to load offers</h3>

        <p style="opacity:.7;margin-top:10px;">
          Check:
          <br><br>
          1. offers.json exists
          <br>
          2. image paths are correct
          <br>
          3. using Live Server
        </p>
      </div>
    `;
  }
}

/* =========================================================
   MODAL / LIGHTBOX
========================================================= */

const modal = document.getElementById("offerModal");

const modalImage = document.getElementById("modalImage");

const closeModalBtn = document.getElementById("closeModal");

function openModal(imageSrc) {

  modal.classList.add("active");

  modalImage.src = imageSrc;

  document.body.style.overflow = "hidden";
}

/* CLOSE BUTTON */

closeModalBtn.addEventListener("click", closeModal);

/* CLICK OUTSIDE */

modal.addEventListener("click", (e) => {

  if (e.target === modal) {
    closeModal();
  }
});

/* ESC KEY */

document.addEventListener("keydown", (e) => {

  if (e.key === "Escape") {
    closeModal();
  }
});

function closeModal() {

  modal.classList.remove("active");

  document.body.style.overflow = "auto";
}

/* =========================================================
   SHARE SYSTEM
========================================================= */

async function shareOffer(offer) {

  const shareUrl =
    window.location.origin +
    "/" +
    offer.image;

  const shareData = {

    title: offer.title,

    text: "Check out this latest offer from Unbox Happiness!",

    url: shareUrl
  };

  // MOBILE NATIVE SHARE

  if (navigator.share) {

    try {

      await navigator.share(shareData);

    } catch (error) {

      console.log("Share cancelled");

    }

  } else {

    // FALLBACK

    showShareOptions(shareUrl);

  }
}

/* =========================================================
   SHARE OPTIONS
========================================================= */

function showShareOptions(url) {

  navigator.clipboard.writeText(url);

  showToast("Offer link copied!");

  // OPEN WHATSAPP SHARE

  setTimeout(() => {

    window.open(
      `https://wa.me/?text=${encodeURIComponent(url)}`,
      "_blank"
    );

  }, 500);
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);
}

/* =========================================================
   REVEAL ANIMATION
========================================================= */

function initRevealAnimation() {

  const revealElements =
    document.querySelectorAll(".reveal");

  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");
          }
        });
      },

      {
        threshold: 0.1
      }
    );

  revealElements.forEach((el) => {
    observer.observe(el);
  });
}

/* =========================================================
   START
========================================================= */

loadOffers();
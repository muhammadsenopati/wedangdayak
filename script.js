const products = [
  {
    name: "Original",
    price: "Rp35.000",
    image: "assets/product-original.jpg",
    composition: "Bawang Dayak, Jahe Merah, Ketumbar."
  },
  {
    name: "Serbuk",
    price: "Rp40.000",
    image: "assets/product-serbuk.jpg",
    composition: "Bawang Dayak, Jahe merah, Pasak Bumi, Kayu manis, Cengkeh, Kapulaga, Bunga Lawang, Habbatusauda, Serai, Pandan, Gula Pasir."
  },
  {
    name: "Lemon",
    price: "Rp40.000",
    image: "assets/product-lemon.jpg",
    composition: "Bawang Dayak, Jahe Kunyit, Serai, Palm Sugar, Lemon."
  },
  {
    name: "Honey",
    price: "Rp40.000",
    image: "assets/product-honey.jpg",
    composition: "Bawang Dayak (Eleutherin Bulbosa), Jahe, Ketumbar, Madu."
  },
  {
    name: "Coffee",
    price: "Rp40.000",
    image: "assets/product-coffee.jpg",
    composition: "Kopi, Bawang Dayak, Jahe, Habbatusauda, Cengkeh, Kayu manis, Kapulaga, Bunga Lawang, Serai, Cabe hutan, Pandan, Gula tebu, dan Creamer."
  },
  {
    name: "Premium Coffee",
    price: "Rp40.000",
    image: "assets/product-premium-coffee.jpg",
    composition: "Kopi, Bawang Dayak, Jahe, Pasak Bumi, Palm Sugar."
  },
  {
    name: "Jamu",
    price: "Rp15.000",
    image: "assets/product-jamu.jpg",
    composition: "Jahe, Bawang Dayak, Kunyit, Kencur, Gula Aren, Serai, Pandan, Kayu Manis, Kapulaga, Cengkeh, Pinang, Cabe Hutan."
  },
  {
    name: "Borneo Botanica",
    price: "Rp15.000",
    image: "assets/product-borneo-botanica.jpg",
    composition: "Kopi, Bawang Dayak, Jahe, Pasak Bumi, Palm Sugar."
  },
  {
    name: "Candy",
    price: "Rp10.000",
    image: "assets/product-candy.jpg",
    composition: "Kopi, Bawang Dayak, Jahe, Pasak Bumi, Palm Sugar."
  }
];

const grid = document.querySelector("#productGrid");
const search = document.querySelector("#productSearch");
const modal = document.querySelector("#productModal");
const modalImage = document.querySelector("#modalImage");
const modalTitle = document.querySelector("#modalTitle");
const modalPrice = document.querySelector("#modalPrice");
const modalComposition = document.querySelector("#modalComposition");
const modalOrder = document.querySelector("#modalOrder");
const navMenu = document.querySelector("#navMenu");
const menuToggle = document.querySelector("#menuToggle");
const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let latestScrollY = 0;
let rafId = null;

function waLink(productName = "produk Wedang Dayak") {
  const text = `Halo Wedang Dayak, saya ingin pesan ${productName}. Apakah masih tersedia?`;
  return `https://wa.me/6282154143038?text=${encodeURIComponent(text)}`;
}

function productCard(product, index) {
  return `
    <article class="product-card reveal" style="transition-delay: ${Math.min(index * 0.04, 0.28)}s">
      <img src="${product.image}" alt="${product.name} Wedang Dayak" loading="lazy" />
      <div class="product-body">
        <div class="product-top">
          <h3>${product.name}</h3>
          <span class="price">${product.price}</span>
        </div>
        <p>${product.composition}</p>
        <div class="product-actions">
          <button class="btn btn-detail" type="button" data-product="${product.name}">Detail</button>
          <a class="btn btn-primary" href="${waLink(product.name)}" target="_blank" rel="noopener">Pesan</a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(list = products) {
  grid.innerHTML = list.length
    ? list.map(productCard).join("")
    : `<p class="empty-state">Produk tidak ditemukan.</p>`;
  observeReveals();
}

function filterProducts() {
  const keyword = search.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    return [product.name, product.price, product.composition]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });
  renderProducts(filtered);
}

function openModal(product) {
  modalImage.src = product.image;
  modalImage.alt = `${product.name} Wedang Dayak`;
  modalTitle.textContent = product.name;
  modalPrice.textContent = product.price;
  modalComposition.textContent = product.composition;
  modalOrder.href = waLink(product.name);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function observeReveals() {
  const reveals = document.querySelectorAll(".reveal:not(.is-observed)");
  reveals.forEach((el) => {
    el.classList.add("is-observed");
    revealObserver.observe(el);
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

search.addEventListener("input", filterProducts);

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product]");
  if (!button) return;
  const product = products.find((item) => item.name === button.dataset.product);
  if (product) openModal(product);
});

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close]")) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

function applyParallax() {
  rafId = null;
  parallaxItems.forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0;
    const moveY = Math.max(-26, Math.min(26, latestScrollY * (speed / 1200)));
    el.style.transform = `translate3d(0, ${moveY.toFixed(2)}px, 0)`;
  });
}

function requestParallaxUpdate() {
  latestScrollY = window.scrollY || window.pageYOffset;
  if (!rafId) rafId = window.requestAnimationFrame(applyParallax);
}

if (!prefersReducedMotion && parallaxItems.length) {
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  requestParallaxUpdate();
}

renderProducts();
observeReveals();

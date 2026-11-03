
document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     AOS
  ======================================== */

  if (typeof AOS !== "undefined") {
    AOS.init({
        duration: 800,
        once: true,
        offset: 0,
        disable: window.innerWidth <= 768
    });
}

  /* ========================================
     MENÚ HAMBURGUESA
  ======================================== */

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("active");
    navLinks.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  }

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      const isOpen = navLinks.classList.contains("is-open");

      menuToggle.classList.toggle("active", !isOpen);
      navLinks.classList.toggle("is-open", !isOpen);

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menú" : "Cerrar menú"
      );
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        !menuToggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  /* ========================================
     CARRUSEL RESPONSIVO DE SERVICIOS
  ======================================== */

  let servicesSwiper = null;

  function initServicesSwiper() {
    if (typeof Swiper === "undefined") return;

    const container = document.querySelector(".servicesSwiper");

    if (!container) return;

    if (window.innerWidth <= 768) {

      if (!servicesSwiper) {

        servicesSwiper = new Swiper(".servicesSwiper", {
          slidesPerView: 1.15,
          spaceBetween: 16,
          speed: 500,
          loop: false,
          grabCursor: true,
          watchOverflow: true,

          pagination: {
            el: ".services-pagination",
            clickable: true
          },

          breakpoints: {
            480: {
              slidesPerView: 1.35,
              spaceBetween: 18
            },

            640: {
              slidesPerView: 1.7,
              spaceBetween: 20
            }
          }
        });
      }

    } else {

      if (servicesSwiper) {
        servicesSwiper.destroy(true, true);
        servicesSwiper = null;
      }
    }
  }

  initServicesSwiper();

  /* ========================================
     SELECCIÓN DE SERVICIOS
  ======================================== */

  const serviceCards = document.querySelectorAll(".service-card");
  const serviceSelect = document.getElementById("serviceSelect");
  const formSection = document.getElementById("formSection");

  function selectService(card) {

    if (!serviceSelect || !formSection) return;

    serviceCards.forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    card.classList.add("active");
    card.setAttribute("aria-pressed", "true");

    const service = card.dataset.service;

    serviceSelect.value = service;

    formSection.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth",
      block: "start"
    });
  }

  serviceCards.forEach(card => {

    card.addEventListener("click", () => {
      selectService(card);
    });

    card.addEventListener("keydown", (event) => {

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectService(card);
      }
    });
  });

  /* ========================================
     SINCRONIZAR SELECT Y TARJETAS
  ======================================== */

  if (serviceSelect) {

    serviceSelect.addEventListener("change", () => {

      serviceCards.forEach(card => {

        const selected =
          card.dataset.service === serviceSelect.value;

        card.classList.toggle("active", selected);
        card.setAttribute("aria-pressed", String(selected));
      });
    });
  }

  /* ========================================
     FORMULARIO
  ======================================== */

  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  if (form && successMessage) {

    form.addEventListener("submit", (event) => {

      event.preventDefault();

      // Demostración visual: no envía datos a un servidor.
      Array.from(form.children).forEach(child => {

        if (!child.classList.contains("success-message")) {
          child.style.display = "none";
        }
      });

      successMessage.style.display = "block";
    });
  }

  /* ========================================
     NAVBAR SCROLL EFFECT
  ======================================== */

  const header = document.querySelector("header");

  function updateHeader() {
    if (!header) return;

    header.style.background =
      window.scrollY > 50
        ? "rgba(7,11,20,0.85)"
        : "rgba(7,11,20,0.4)";
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* ========================================
     RESIZE
  ======================================== */

  let previousMobile = window.innerWidth <= 768;

  window.addEventListener("resize", () => {

    const isMobile = window.innerWidth <= 768;

    if (isMobile !== previousMobile) {
      closeMenu();
      initServicesSwiper();
      previousMobile = isMobile;
    }
  });

});

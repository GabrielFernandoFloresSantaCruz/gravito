
/* =========================================
   GRAVITO - SCRIPT PRINCIPAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     AOS - ANIMACIONES AL HACER SCROLL
  ========================================= */

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 80
    });
  }

  /* =========================================
     GSAP - ANIMACIONES DEL HERO
  ========================================= */

  if (typeof gsap !== "undefined") {
    gsap.from(".hero-content h1", {
      opacity: 0,
      y: 50,
      duration: 1.2
    });

    gsap.from(".hero-content p", {
      opacity: 0,
      y: 40,
      delay: 0.3,
      duration: 1
    });

    gsap.from(".hero-buttons", {
      opacity: 0,
      y: 40,
      delay: 0.5,
      duration: 1
    });
  }

  /* =========================================
     MENÚ HAMBURGUESA
  ========================================= */

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {

    function setMenu(open) {
      navLinks.classList.toggle("is-open", open);
      menuToggle.classList.toggle("active", open);

      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        open ? "Cerrar menú" : "Abrir menú"
      );
    }

    // Abrir y cerrar mediante el botón
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("is-open");
      setMenu(!isOpen);
    });

    // Cerrar al elegir una opción
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenu(false);
      });
    });

    // Cerrar al hacer clic fuera
    document.addEventListener("click", (event) => {
      if (
        !menuToggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        setMenu(false);
      }
    });

    // Cerrar con Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuToggle.focus();
      }
    });

    // Cerrar al volver a escritorio
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        setMenu(false);
      }
    });
  }

  /* =========================================
     CARGA DE PROYECTOS DESDE JSON
  ========================================= */

  async function loadHomeProjects() {

    const swiperElement = document.querySelector(".projectSwiper");
    const swiperWrapper = document.querySelector(
      ".projectSwiper .swiper-wrapper"
    );

    if (!swiperElement || !swiperWrapper) return;

    try {
      const response = await fetch("data/projects.json");

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      const projects = Array.isArray(data.projects)
        ? data.projects
        : Array.isArray(data)
          ? data
          : [];

      if (projects.length > 0) {

        // Limitar a los primeros tres proyectos
        const limitedProjects = projects.slice(0, 3);

        // Crear las tarjetas dinámicamente
        swiperWrapper.innerHTML = "";

        limitedProjects.forEach((project) => {

          const slide = document.createElement("div");
          slide.className = "swiper-slide";

          const card = document.createElement("a");
          card.href = `project.html?id=${encodeURIComponent(project.id ?? "")}`;
          card.className = "project-card";
          card.style.display = "block";
          card.style.textDecoration = "none";

          const image = document.createElement("div");
          image.className = "project-image";

          // Usar la imagen del proyecto como fondo
          if (project.heroImage) {
            image.style.backgroundImage =
              `url("${String(project.heroImage).replace(/["\\]/g, "\\$&")}")`;
          }

          image.style.backgroundSize = "cover";
          image.style.backgroundPosition = "center";

          const overlay = document.createElement("div");
          overlay.className = "project-overlay";

          const title = document.createElement("h3");
          title.textContent = project.title || "Proyecto";

          const category = document.createElement("p");
          category.textContent = project.category || "";

          overlay.append(title, category);
          card.append(image, overlay);
          slide.appendChild(card);
          swiperWrapper.appendChild(slide);
        });

        // Tarjeta fija de Ver más
        const moreSlide = document.createElement("div");
        moreSlide.className = "swiper-slide";

        const moreCard = document.createElement("a");
        moreCard.href = "projects.html";
        moreCard.className = "project-card view-more-card";

        const moreContent = document.createElement("div");

        const icon = document.createElement("i");
        icon.className = "ri-arrow-right-line";
        icon.setAttribute("aria-hidden", "true");

        const moreTitle = document.createElement("h3");
        moreTitle.textContent = "Ver más";

        const moreDescription = document.createElement("p");
        moreDescription.textContent = "Explorar todos los proyectos";

        moreContent.append(icon, moreTitle, moreDescription);
        moreCard.appendChild(moreContent);
        moreSlide.appendChild(moreCard);
        swiperWrapper.appendChild(moreSlide);
      }

    } catch (error) {
      console.error(
        "Error cargando proyectos del Home. Se conservarán las tarjetas del HTML:",
        error
      );
    }

    /* =========================================
       SWIPER - CARRUSEL RESPONSIVO
    ========================================= */

    if (typeof Swiper !== "undefined") {

      // Evitar inicializaciones duplicadas
      if (swiperElement.swiper) {
        swiperElement.swiper.destroy(true, true);
      }

      new Swiper(".projectSwiper", {
        slidesPerView: 1.15,
        spaceBetween: 16,
        loop: false,
        watchOverflow: true,
        grabCursor: true,
        observer: true,
        observeParents: true,

        breakpoints: {
          480: {
            slidesPerView: 1.4,
            spaceBetween: 18
          },

          640: {
            slidesPerView: 1.8,
            spaceBetween: 20
          },

          768: {
            slidesPerView: 2.2,
            spaceBetween: 20
          },

          1024: {
            slidesPerView: 3,
            spaceBetween: 24
          }
        }
      });
    }
  }

  loadHomeProjects();

});

/* ========================================
   CARRUSEL DE SERVICIOS
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

window.addEventListener("resize", initServicesSwiper);
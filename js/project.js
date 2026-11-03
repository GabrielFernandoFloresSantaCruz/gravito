
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

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menú" : "Cerrar menú"
      );
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {

      if (
        !menuToggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  /* ========================================
     NAVBAR SCROLL
  ======================================== */

  const header = document.querySelector("header");

  function updateHeader() {
    if (!header) return;

    header.style.background =
      window.scrollY > 50
        ? "rgba(7,11,20,0.9)"
        : "rgba(7,11,20,0.75)";
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* ========================================
     PARÁMETROS URL
  ======================================== */

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  /* ========================================
     ELEMENTOS
  ======================================== */

  const projectHero = document.getElementById("projectHero");
  const projectImage = document.getElementById("projectImage");
  const projectButtons = document.getElementById("projectButtons");
  const techGrid = document.getElementById("techGrid");
  const mediaSection = document.getElementById("projectMediaSection");

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value ?? "";
    }
  }

  /* ========================================
     ESTADO DE ERROR
  ======================================== */

  function showProjectError(message) {

    setText("projectTitle", message);
    setText(
      "projectDescription",
      "Vuelve a la página de proyectos para seleccionar otro."
    );

    setText("projectCategory", "PROYECTOS");

    if (projectButtons) {
      projectButtons.innerHTML = "";

      const backLink = document.createElement("a");
      backLink.href = "projects.html";
      backLink.className = "primary-btn";
      backLink.textContent = "Volver a Proyectos";

      projectButtons.appendChild(backLink);
    }

    if (projectImage) {
      projectImage.style.backgroundImage = "none";
    }

    if (projectHero) {
      projectHero.style.removeProperty("--project-hero-image");
    }

    if (mediaSection) {
      mediaSection.innerHTML = "";
    }

    if (techGrid) {
      techGrid.innerHTML = "";
    }

    document.querySelectorAll(
      ".info-section, .result-section, .tech-section"
    ).forEach(section => {
      section.hidden = true;
    });
  }

  /* ========================================
     BOTÓN SEGÚN TIPO DE PROYECTO
  ======================================== */

  function getButtonText(type) {

    switch (type) {
      case "website":
        return "Visitar Sitio Web";

      case "video":
        return "Ver Video";

      case "game":
        return "Jugar Demo";

      case "uiux":
        return "Ver Prototipo";

      default:
        return "Visitar Proyecto";
    }
  }

  /* ========================================
     IMAGEN PRINCIPAL
  ======================================== */

 
function setHeroImage(imageUrl) {

  if (!imageUrl || typeof imageUrl !== "string") {
    console.warn("El proyecto no tiene heroImage definida.");
    return;
  }

  const projectHero = document.getElementById("projectHero");
  const projectImage = document.getElementById("projectImage");

  // Resuelve la ruta de la imagen respecto al HTML.
  const resolvedUrl = new URL(imageUrl, document.baseURI).href; 

  // Imagen normal en escritorio.
  if (projectImage) {
    projectImage.style.backgroundImage = `url("${resolvedUrl}")`;
    projectImage.style.backgroundSize = "cover";
    projectImage.style.backgroundPosition = "center";
  }

  // Imagen de fondo en celulares.
  if (projectHero) {
    projectHero.style.setProperty(
      "--project-hero-image",
      `url("${resolvedUrl}")`
    );
  }

  console.log("Imagen principal:", resolvedUrl);
}


  /* ========================================
     CARGAR PROYECTO
  ======================================== */

  async function loadProject() {

    try {

      const response = await fetch("data/projects.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const projects = Array.isArray(data)
        ? data
        : data.projects;

      if (!Array.isArray(projects)) {
        throw new Error("Formato JSON inválido");
      }

      const project = projects.find(
        p => String(p.id) === String(projectId)
      );

      if (!project) {
        showProjectError("Proyecto no encontrado");
        return;
      }

      /* ====================================
         TÍTULO Y HERO
      ==================================== */

      document.title = `${project.title} | GRAVITO`;

      setText("projectTitle", project.title);
      setText("projectCategory", project.category);
      setText("projectDescription", project.description);

      setHeroImage(project.heroImage);

      /* ====================================
         BOTÓN EXTERNO
      ==================================== */

      if (projectButtons) {

        projectButtons.innerHTML = "";

        if (project.externalUrl) {

          const button = document.createElement("a");

          button.href = project.externalUrl;
          button.target = "_blank";
          button.rel = "noopener noreferrer";
          button.className = "primary-btn";
          button.textContent = getButtonText(project.type);

          projectButtons.appendChild(button);
        }
      }

      /* ====================================
         PROBLEMA / SOLUCIÓN / RESULTADOS
      ==================================== */

      setText("projectProblem", project.problem);
      setText("projectSolution", project.solution);
      setText("projectResult", project.results);

      /* ====================================
         TECNOLOGÍAS
      ==================================== */

      if (techGrid) {

        techGrid.innerHTML = "";

        if (Array.isArray(project.technologies)) {

          project.technologies.forEach(tech => {

            const card = document.createElement("div");
            card.className = "tech-card";
            card.textContent = tech;

            techGrid.appendChild(card);
          });
        }
      }

      /* ====================================
         MULTIMEDIA DINÁMICA
      ==================================== */

      if (mediaSection) {

        mediaSection.innerHTML = "";

        const videos = Array.isArray(project.videos)
          ? project.videos.filter(url => typeof url === "string" && url.trim())
          : [];

        const gallery = Array.isArray(project.gallery)
          ? project.gallery.filter(url => typeof url === "string" && url.trim())
          : [];

        // PRIORIDAD 1: VIDEOS

        if (videos.length > 0) {

          const videoSection = document.createElement("section");
          videoSection.className = "video-section";

          const videoContainer = document.createElement("div");
          videoContainer.className = "video-container";

          videos.forEach(videoUrl => {

            const iframe = document.createElement("iframe");

            iframe.src = videoUrl;
            iframe.title = `Video de ${project.title}`;
            iframe.loading = "lazy";
            iframe.allowFullscreen = true;

            iframe.setAttribute(
              "allow",
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            );

            videoContainer.appendChild(iframe);
          });

          videoSection.appendChild(videoContainer);
          mediaSection.appendChild(videoSection);

        }

        // PRIORIDAD 2: GALERÍA (SOLO SIN VIDEOS)

        else if (gallery.length > 0) {

          const gallerySection = document.createElement("section");
          gallerySection.className = "video-section";

          const swiperContainer = document.createElement("div");
          swiperContainer.className = "swiper gallerySwiper";

          const swiperWrapper = document.createElement("div");
          swiperWrapper.className = "swiper-wrapper";

          gallery.forEach(imageUrl => {

            const slide = document.createElement("div");
            slide.className = "swiper-slide";

            const link = document.createElement("a");
            link.href = imageUrl;
            link.className = "glightbox";
            link.setAttribute("data-gallery", "project-gallery");

            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = project.title;
            image.loading = "lazy";

            link.appendChild(image);
            slide.appendChild(link);
            swiperWrapper.appendChild(slide);
          });

          const prevButton = document.createElement("div");
          prevButton.className = "swiper-button-prev";

          const nextButton = document.createElement("div");
          nextButton.className = "swiper-button-next";

          swiperContainer.append(
            swiperWrapper,
            prevButton,
            nextButton
          );

          gallerySection.appendChild(swiperContainer);
          mediaSection.appendChild(gallerySection);

          /* SWIPER */

          if (typeof Swiper !== "undefined") {

            new Swiper(swiperContainer, {
              slidesPerView: 1,
              spaceBetween: 16,
              speed: 500,
              loop: gallery.length > 2,
              grabCursor: true,
              watchOverflow: true,

              navigation: {
                nextEl: nextButton,
                prevEl: prevButton
              },

              breakpoints: {
                768: {
                  slidesPerView: 1.5,
                  spaceBetween: 20
                },

                1200: {
                  slidesPerView: 2,
                  spaceBetween: 24
                }
              }
            });
          }

          /* GLIGHTBOX */

          if (typeof GLightbox !== "undefined") {

            GLightbox({
              selector: ".glightbox",
              touchNavigation: true,
              loop: gallery.length > 1
            });
          }
        }
      }

      /* ====================================
         ACTUALIZAR AOS
      ==================================== */

      if (typeof AOS !== "undefined" && window.innerWidth > 768) {
        AOS.refreshHard();
      }

    } catch (error) {

      console.error("Error cargando el proyecto:", error);

      showProjectError("No se pudo cargar el proyecto");
    }
  }

  /* ========================================
     CAMBIO DE TAMAÑO
  ======================================== */

  window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  /* ========================================
     START
  ======================================== */

  loadProject();

});


document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     AOS
  ======================================== */

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      disable: window.innerWidth <= 768
    });
  }

  /* ========================================
     NAVBAR HAMBURGUESA
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
      if (event.key === "Escape") closeMenu();
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
        ? "rgba(7,11,20,0.9)"
        : "rgba(7,11,20,0.75)";
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* ========================================
     PARÁMETROS
  ======================================== */

  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  /* ========================================
     ELEMENTOS
  ======================================== */

  const caseNavigation = document.getElementById("caseNavigation");
  const caseContent = document.getElementById("caseContent");
  const caseTechnologies = document.getElementById("caseTechnologies");

  /* ========================================
     HELPERS
  ======================================== */

  function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
      element.textContent = value ?? "";
    }
  }

  function createElement(tag, className, text) {

    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      element.textContent = text;
    }

    return element;
  }

  function showError(message) {

    setText("caseTitle", message);

    setText(
      "caseSubtitle",
      "No fue posible mostrar este estudio de caso."
    );

    if (caseNavigation) caseNavigation.innerHTML = "";
    if (caseContent) caseContent.innerHTML = "";
    if (caseTechnologies) caseTechnologies.innerHTML = "";

    const cover = document.getElementById("caseHeroImage");

    if (cover) {
      cover.hidden = true;
      cover.removeAttribute("src");
    }

    document.querySelectorAll(
      ".case-overview, .case-layout, .case-technologies"
    ).forEach(section => {
      section.hidden = true;
    });
  }

  /* ========================================
     HERO
  ======================================== */

  function renderHero(caseData) {

    document.title = `${caseData.title} — Estudio de Caso | GRAVITO`;

    setText("caseTitle", caseData.title);
    setText("caseSubtitle", caseData.subtitle);
    setText("caseYear", caseData.year);

    setText("caseType", caseData.type);
    setText("caseCategory", caseData.category);
    setText("caseClient", caseData.client);
    setText("caseOverviewYear", caseData.year);

    /* IMAGEN PRINCIPAL */

    const heroImage = document.getElementById("caseHeroImage");

    if (heroImage && caseData.heroImage) {

      heroImage.src = caseData.heroImage;
      heroImage.alt = `Imagen principal de ${caseData.title}`;
      heroImage.hidden = false;
    }

    /* ETIQUETAS */

    const tags = document.getElementById("caseTags");

    if (tags) {

      tags.innerHTML = "";

      if (Array.isArray(caseData.technologies)) {

        caseData.technologies.forEach(tech => {

          const tag = createElement(
            "span",
            "case-tag",
            tech
          );

          tags.appendChild(tag);
        });
      }
    }
  }

  /* ========================================
     NAVEGACIÓN POR SECCIONES
  ======================================== */

  function renderNavigation(sections) {

    if (!caseNavigation) return;

    caseNavigation.innerHTML = "";

    sections.forEach(section => {

      const link = document.createElement("a");

      link.href = `#${section.id}`;
      link.className = "case-nav-link";

      const number = createElement(
        "span",
        "case-nav-number",
        section.number || ""
      );

      const title = createElement(
        "span",
        "case-nav-title",
        section.title
      );

      link.append(number, title);

      caseNavigation.appendChild(link);
    });
  }

  /* ========================================
     PÁRRAFOS
  ======================================== */

  function renderParagraphs(paragraphs, container) {

    if (!Array.isArray(paragraphs)) return;

    paragraphs.forEach(text => {

      const paragraph = createElement(
        "p",
        "case-paragraph",
        text
      );

      container.appendChild(paragraph);
    });
  }

  /* ========================================
     MEDIOS: IMÁGENES Y VIDEOS
  ======================================== */

  function renderMedia(media, container) {

    if (!Array.isArray(media) || media.length === 0) {
      return;
    }

    const mediaGrid = createElement(
      "div",
      "case-media-grid"
    );

    media.forEach(item => {

      if (!item || !item.src) return;

      if (item.type === "image") {

        const figure = createElement(
          "figure",
          "case-media-item"
        );

        const link = document.createElement("a");

        link.href = item.src;
        link.className = "glightbox";
        link.setAttribute("data-gallery", "case-study");

        const image = document.createElement("img");

        image.src = item.src;
        image.alt = item.alt || "Imagen del proyecto";
        image.loading = "lazy";

        link.appendChild(image);
        figure.appendChild(link);

        if (item.caption) {

          const caption = createElement(
            "figcaption",
            "case-media-caption",
            item.caption
          );

          figure.appendChild(caption);
        }

        mediaGrid.appendChild(figure);
      }

      if (item.type === "video") {

        const videoWrapper = createElement(
          "div",
          "case-media-item case-video"
        );

        const iframe = document.createElement("iframe");

        iframe.src = item.src;
        iframe.title = item.alt || "Video del proyecto";
        iframe.loading = "lazy";
        iframe.allowFullscreen = true;

        videoWrapper.appendChild(iframe);
        mediaGrid.appendChild(videoWrapper);
      }
    });

    if (mediaGrid.children.length > 0) {
      container.appendChild(mediaGrid);
    }
  }

  /* ========================================
     SUBSECCIONES
  ======================================== */

  function renderSubsections(subsections, container) {

    if (!Array.isArray(subsections)) return;

    subsections.forEach((subsection, index) => {

      const wrapper = createElement(
        "div",
        "case-subsection"
      );

      if (subsection.id) {
        wrapper.id = subsection.id;
      }

      const heading = createElement(
        "h3",
        "case-subsection-title",
        subsection.title
      );

      wrapper.appendChild(heading);

      renderParagraphs(
        subsection.paragraphs,
        wrapper
      );

      renderMedia(
        subsection.media,
        wrapper
      );

      // Permite subsecciones anidadas adicionales.
      if (Array.isArray(subsection.subsections)) {
        renderSubsections(subsection.subsections, wrapper);
      }

      container.appendChild(wrapper);
    });
  }

  /* ========================================
     SECCIONES PRINCIPALES
  ======================================== */

  function renderSections(sections) {

    if (!caseContent) return;

    caseContent.innerHTML = "";

    sections.forEach(section => {

      const wrapper = createElement(
        "article",
        "case-section"
      );

      wrapper.id = section.id;


      /* NÚMERO */

      const number = createElement(
        "span",
        "case-section-number",
        section.number || ""
      );

      /* TÍTULO */

      const title = createElement(
        "h2",
        "case-section-title",
        section.title
      );

      wrapper.append(number, title);

      /* PÁRRAFOS */

      renderParagraphs(
        section.paragraphs,
        wrapper
      );

      /* MULTIMEDIA PRINCIPAL */

      renderMedia(
        section.media,
        wrapper
      );

      /* SUBSECCIONES */

      renderSubsections(
        section.subsections,
        wrapper
      );

      caseContent.appendChild(wrapper);
    });
  }

  /* ========================================
     TECNOLOGÍAS
  ======================================== */

  function renderTechnologies(technologies) {

    if (!caseTechnologies) return;

    caseTechnologies.innerHTML = "";

    if (!Array.isArray(technologies)) return;

    technologies.forEach(tech => {

      const card = createElement(
        "div",
        "tech-card",
        tech
      );

      caseTechnologies.appendChild(card);
    });
  }

  /* ========================================
     NAVEGACIÓN ACTIVA
  ======================================== */

  function initializeSectionNavigation() {

    const sections = document.querySelectorAll(".case-section");
    const links = document.querySelectorAll(".case-nav-link");

    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          links.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });

      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  /* ========================================
     CARGAR ESTUDIO DE CASO
  ======================================== */

  async function loadCase() {

    try {

      const response = await fetch("data/cases.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const cases = Array.isArray(data)
        ? data
        : data.cases;

      if (!Array.isArray(cases)) {
        throw new Error("Formato de cases.json inválido");
      }

      const caseData = cases.find(
        item => String(item.id) === String(caseId)
      );

      if (!caseData) {
        showError("Estudio de caso no encontrado");
        return;
      }

      renderHero(caseData);

      const sections = Array.isArray(caseData.sections)
        ? caseData.sections
        : [];

      renderNavigation(sections);
      renderSections(sections);
      renderTechnologies(caseData.technologies);

      initializeSectionNavigation();

      /* GLIGHTBOX */

      if (typeof GLightbox !== "undefined") {

        GLightbox({
          selector: ".glightbox",
          touchNavigation: true,
          loop: false
        });
      }

      /* AOS */

      if (typeof AOS !== "undefined" && window.innerWidth > 768) {
        AOS.refreshHard();
      }

    } catch (error) {

      console.error("Error cargando estudio de caso:", error);

      showError("No se pudo cargar el estudio de caso");
    }
  }

  /* ========================================
     RESPONSIVE NAVBAR
  ======================================== */

  window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  /* ========================================
     START
  ======================================== */

  loadCase();

});

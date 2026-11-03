
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
     ELEMENTOS
  ======================================== */

  const projectsGrid = document.getElementById("projectsGrid");
  const projectsMessage = document.getElementById("projectsMessage");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let projectsData = [];
  let casesData = [];

  let activeFilter = "all";

  /* ========================================
     ICONOS
  ======================================== */

  function getIcon(type) {

    switch (type) {

      case "website":
        return "ri-window-line";

      case "frontend":
        return "ri-code-s-slash-line";

      case "video":
        return "ri-movie-2-line";

      case "uiux":
        return "ri-layout-line";

      case "game":
        return "ri-gamepad-line";

      case "case":
        return "ri-file-text-line";

      case "blog":
        return "ri-article-line";

      default:
        return "ri-code-box-line";
    }
  }

  /* ========================================
     MENSAJES
  ======================================== */

  function showMessage(message) {

    if (!projectsMessage) return;

    projectsMessage.textContent = message;
    projectsMessage.hidden = false;
  }

  function hideMessage() {

    if (!projectsMessage) return;

    projectsMessage.textContent = "";
    projectsMessage.hidden = true;
  }

  /* ========================================
     NORMALIZAR ESTUDIOS DE CASO
  ======================================== */

  function normalizeCase(caseItem) {

    return {
      id: caseItem.id,
      title: caseItem.title,
      description: caseItem.subtitle || "",
      category: caseItem.category || "Estudio de caso",

      filter: "cases",
      type: "case",

      heroImage: caseItem.heroImage || "",
      year: caseItem.year || "",

      destination: "cases"
    };
  }

  /* ========================================
     ENLACES SEGÚN CONTENIDO
  ======================================== */

  function getContentLink(item) {

    const id = encodeURIComponent(String(item.id ?? ""));

    if (item.destination === "cases") {
      return `cases.html?id=${id}`;
    }

    return `project.html?id=${id}`;
  }

  function getLinkText(item) {

    if (item.destination === "cases") {
      return "Ver Estudio de Caso";
    }

    return "Ver Proyecto";
  }

  /* ========================================
     CREAR TARJETAS
  ======================================== */

  function renderProjects(items) {

    if (!projectsGrid) return;

    projectsGrid.innerHTML = "";

    if (items.length === 0) {

      if (activeFilter === "blogs") {
        showMessage("Próximamente encontrarás artículos y blogs aquí.");
      } else {
        showMessage("No hay contenido disponible en esta categoría.");
      }

      return;
    }

    hideMessage();

    items.forEach((item, index) => {

      /* TARJETA */

      const card = document.createElement("div");

      card.className = "project-card";
      card.dataset.category = item.filter || "";

      if (item.destination === "cases") {
        card.classList.add("case-project-card");
      }

      if (window.innerWidth > 768) {

        card.setAttribute("data-aos", "fade-up");

        card.setAttribute(
          "data-aos-delay",
          String(Math.min(index * 100, 400))
        );
      }

      /* IMAGEN / ICONO */

      const image = document.createElement("div");
      image.className = "project-image";

      const icon = document.createElement("i");
      icon.className = getIcon(item.type);

      image.appendChild(icon);

      /* CONTENIDO */

      const content = document.createElement("div");
      content.className = "project-content";

      const category = document.createElement("span");

      category.textContent = item.destination === "cases"
        ? "ESTUDIO DE CASO"
        : (item.category || "");

      const title = document.createElement("h3");

      title.textContent = item.title || "Sin título";

      const description = document.createElement("p");

      description.textContent = item.description || "";

      /* ENLACE */

      const link = document.createElement("a");

      link.className = "project-link";
      link.textContent = getLinkText(item);
      link.href = getContentLink(item);

      /* CONSTRUCCIÓN */

      content.append(
        category,
        title,
        description,
        link
      );

      card.append(image, content);

      projectsGrid.appendChild(card);
    });

    if (typeof AOS !== "undefined" && window.innerWidth > 768) {
      AOS.refreshHard();
    }
  }

  /* ========================================
     FILTRADO
  ======================================== */

  function applyFilter() {

    const allContent = [
      ...projectsData,
      ...casesData
    ];

    if (activeFilter === "all") {

      renderProjects(allContent);
      return;
    }

    if (activeFilter === "cases") {

      renderProjects(casesData);
      return;
    }

    if (activeFilter === "blogs") {

      // Se implementará cuando tengamos
      // el archivo de datos de blogs.
      renderProjects([]);
      return;
    }

    const filtered = projectsData.filter(project => {
      return project.filter === activeFilter;
    });

    renderProjects(filtered);
  }

  /* ========================================
     BOTONES DE FILTRO
  ======================================== */

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach(btn => {

        const isActive = btn === button;

        btn.classList.toggle("active", isActive);

        btn.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      applyFilter();
    });
  });

  /* ========================================
     CARGAR JSON
  ======================================== */

  async function fetchJSON(path) {

    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${path}`);
    }

    return await response.json();
  }

  /* ========================================
     CARGAR PROYECTOS Y CASOS
  ======================================== */

  async function loadContent() {

    if (!projectsGrid) return;

    try {

      const results = await Promise.allSettled([
        fetchJSON("data/projects.json"),
        fetchJSON("data/cases.json")
      ]);

      /* PROYECTOS */

      if (results[0].status === "fulfilled") {

        const data = results[0].value;

        projectsData = Array.isArray(data)
          ? data
          : Array.isArray(data.projects)
            ? data.projects
            : [];

      } else {

        console.error(
          "Error cargando projects.json:",
          results[0].reason
        );
      }

      /* ESTUDIOS DE CASO */

      if (results[1].status === "fulfilled") {

        const data = results[1].value;

        const cases = Array.isArray(data)
          ? data
          : Array.isArray(data.cases)
            ? data.cases
            : [];

        casesData = cases.map(normalizeCase);

      } else {

        console.error(
          "Error cargando cases.json:",
          results[1].reason
        );
      }

      /* MOSTRAR CONTENIDO */

      if (
        results[0].status === "rejected" &&
        results[1].status === "rejected"
      ) {

        showMessage(
          "No se pudieron cargar los proyectos ni los estudios de caso."
        );

        return;
      }

      applyFilter();

    } catch (error) {

      console.error("Error cargando contenido:", error);

      showMessage("No se pudo cargar el contenido.");
    }
  }

  /* ========================================
     NAVBAR SCROLL EFFECT
  ======================================== */

  const header = document.querySelector("header");

  function updateHeader() {

    if (!header) return;

    if (window.scrollY > 50) {

      header.style.background = "rgba(7,11,20,0.85)";
      header.style.backdropFilter = "blur(20px)";

    } else {

      header.style.background = "rgba(7,11,20,0.4)";
      header.style.backdropFilter = "blur(10px)";
    }
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* ========================================
     RESPONSIVE
  ======================================== */

  let previousMobile = window.innerWidth <= 768;

  window.addEventListener("resize", () => {

    const isMobile = window.innerWidth <= 768;

    if (isMobile !== previousMobile) {

      closeMenu();
      applyFilter();

      previousMobile = isMobile;
    }
  });

  /* ========================================
     START
  ======================================== */

  loadContent();

});

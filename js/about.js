// =========================
// ABOUT PAGE JS
// =========================

// AOS INIT

AOS.init({

  duration: 1000,
  once: true

});

// NAVBAR SCROLL EFFECT

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

  if(window.scrollY > 50){

    header.style.background = "rgba(7,11,20,0.8)";
    header.style.borderBottom =
    "1px solid rgba(255,255,255,0.08)";

  }

  else {

    header.style.background = "rgba(7,11,20,0.4)";
    header.style.borderBottom =
    "1px solid rgba(255,255,255,0.05)";

  }

});

// FLOATING ORB INTERACTION

const orb = document.querySelector(".floating-orb");

document.addEventListener("mousemove", (e) => {

  let x = (window.innerWidth / 2 - e.pageX) / 40;
  let y = (window.innerHeight / 2 - e.pageY) / 40;

  orb.style.transform =
  `translate(${x}px, ${y}px)`;

});

// SKILL CARDS HOVER EFFECT

const skillCards =
document.querySelectorAll(".skill-card");

skillCards.forEach(card => {

  card.addEventListener("mouseenter", () => {

    card.style.transform =
    "translateY(-10px) scale(1.03)";

  });

  card.addEventListener("mouseleave", () => {

    card.style.transform =
    "translateY(0px) scale(1)";

  });

});


document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!menuToggle || !navLinks) return;

  function setMenu(open) {
    navLinks.classList.toggle("is-open", open);
    menuToggle.classList.toggle("active", open);

    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Cerrar menú" : "Abrir menú"
    );
  }

  // Abrir y cerrar con el botón hamburguesa
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("is-open");
    setMenu(!isOpen);
  });

  // Cerrar al seleccionar un enlace
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener("click", (event) => {
    if (
      !menuToggle.contains(event.target) &&
      !navLinks.contains(event.target)
    ) {
      setMenu(false);
    }
  });

  // Cerrar con la tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // Restablecer el menú si se vuelve a escritorio
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setMenu(false);
    }
  });
});

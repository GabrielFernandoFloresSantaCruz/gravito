// --- Carrusel Webinar ---
let currentSlide = 0;
const slides = document.querySelectorAll(".webinar-info .slide");
const dots = document.querySelectorAll(".carousel-dots .dot");

// Detectar si es móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Cambiar imagen según el dispositivo
function updateSlideImage() {
    const firstSlide = slides[0];
    const imgElement = firstSlide.querySelector('.slide-image-full');
    
    if (isMobile()) {
        // En móvil: usar imagen vertical
        imgElement.src = "img/PortadaVertical.png";
        imgElement.alt = "Portada Webinar - Versión Vertical";
    } else {
        // En desktop: usar imagen horizontal
        imgElement.src = "img/portada.jpg";
        imgElement.alt = "Portada Webinar";
    }
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove("active");
        dots[i].classList.remove("active");
        if (i === index) {
            slide.classList.add("active");
            dots[i].classList.add("active");
        }
    });
    currentSlide = index;
}

// Inicializar con la imagen correcta
updateSlideImage();

dots.forEach((dot, i) => {
    dot.addEventListener("click", () => showSlide(i));
});

// Cambio automático cada 12s
setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
}, 12000);

// Actualizar imagen cuando cambie el tamaño de la ventana
window.addEventListener('resize', updateSlideImage);

// --- Scroll al formulario con el botón ---
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".webinar-form").scrollIntoView({ behavior: "smooth" });
});

// --- Guardar datos en formulario ---
document.querySelector(".webinar-form button").addEventListener("click", (e) => {
    e.preventDefault();
    
    const nombre = document.querySelector(".webinar-form input[type='text']").value;
    const correo = document.querySelector(".webinar-form input[type='email']").value;
    const telefono = document.querySelector(".webinar-form input[type='tel']").value;

    if (!nombre || !correo || !telefono) {
        alert("Por favor llena todos los campos");
        return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        alert("Por favor ingresa un correo electrónico válido");
        return;
    }

    // Descarga local simulada
    const contenido = `REGISTRO WEBINAR CH'IXI MEDIA\n\nNombre: ${nombre}\nCorreo: ${correo}\nWhatsApp: ${telefono}\n\nFecha de registro: ${new Date().toLocaleString()}`;
    
    try {
        const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = `registro_webinar_${nombre.replace(/\s+/g, '_')}.txt`;
        enlace.click();
        
        // Limpiar formulario después del registro
        document.querySelector(".webinar-form input[type='text']").value = '';
        document.querySelector(".webinar-form input[type='email']").value = '';
        document.querySelector(".webinar-form input[type='tel']").value = '';
        
        alert("¡Registro exitoso! 🎉\n\nHemos descargado tus datos localmente.\nRecibirás la confirmación por correo y WhatsApp.");
        
    } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("Registro completado, pero hubo un error al descargar el archivo.");
    }
});

// Script para el FAQ acordeón
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros items abiertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Abrir/cerrar el item actual
            item.classList.toggle('active');
        });
    });
});
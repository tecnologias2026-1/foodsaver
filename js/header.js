document.addEventListener('DOMContentLoaded', function () {
  // Elementos principales del header y del menú móvil
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const siteHeader = document.querySelector('.site-header');

  // Si la estructura del header no existe, el script no se inicializa
  if (!menuToggle || !mobileMenu) return;

  // Guarda el último elemento enfocado antes de abrir el menú
  let previousFocus = null;

  // Selectores reutilizables para foco y enlaces de navegación
  const focusableSel = 'a, button, [tabindex]:not([tabindex="-1"])';
  const navLinksSelector = '.nav__link, .mobile-nav__link';

  // Mantiene el foco dentro del menú móvil mientras está abierto
  // También permite cerrar el menú con la tecla Escape
  function trap(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    if (e.key !== 'Tab') return;

    const nodes = mobileMenu.querySelectorAll(focusableSel);
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    if (!first) return;

    // Shift + Tab: si el foco está en el primero, lo mueve al último
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: si el foco está en el último, lo devuelve al primero
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Oculta / restaura el contenido de fondo a las tecnologías de asistencia
  // (cuando el diálogo del menú móvil está abierto)
  function setBackgroundHidden(hidden) {
    try {
      document.querySelectorAll('main, footer, .site-footer').forEach(function (el) {
        if (!el) return;
        if (hidden) el.setAttribute('aria-hidden', 'true');
        else el.removeAttribute('aria-hidden');
      });
    } catch (err) { /* no-op */ }
  }

  // Abre el menú móvil, bloquea el scroll del fondo y mueve el foco al primer control
  // Abre el menú móvil
  function openMenu() {

    // Guarda el elemento que tenía el foco antes de abrir el menú
    // (para poder devolverle el foco al cerrar)
    previousFocus = document.activeElement;

    // Hace visible el contenedor del menú móvil
    mobileMenu.hidden = false;

    // Agrega clase para activar estilos (opacity, visibility, etc.)
    mobileMenu.classList.add('is-open');

    // Marca el header como "menú abierto"
    // Esto activa reglas CSS como ocultar el carrito
    siteHeader.classList.add('menu-open');

    // Actualiza atributo de accesibilidad
    // Indica que el botón ahora controla un menú abierto
    menuToggle.setAttribute('aria-expanded', 'true');

    // Bloquea el scroll de la página de fondo
    document.body.style.overflow = 'hidden';

    // Oculta el fondo a AT (mejora compatibilidad de aria-modal)
    setBackgroundHidden(true);

    // Busca el primer elemento interactivo dentro del menú
    // (link, botón, etc.)
    const f = mobileMenu.querySelector(focusableSel);

    // Si existe, mueve el foco a ese elemento
    // Mejora accesibilidad (teclado)
    if (f) f.focus();

    // Activa el "focus trap"
    // Evita que el usuario salga del menú usando Tab
    document.addEventListener('keydown', trap);
  }

  // Cierra el menú móvil, restaura el estado inicial y devuelve el foco
  function closeMenu() {
    // Restaura visibilidad del fondo a AT
    setBackgroundHidden(false);
    // Quita la clase visual del menú
    mobileMenu.classList.remove('is-open');

    // Oculta completamente el menú
    mobileMenu.hidden = true;

    // Elimina el estado "menú abierto" del header
    // Esto hace que el carrito vuelva a mostrarse
    siteHeader.classList.remove('menu-open');

    // Actualiza atributo de accesibilidad
    // Indica que el menú está cerrado
    menuToggle.setAttribute('aria-expanded', 'false');

    // Restaura el scroll de la página
    document.body.style.overflow = '';

    // Elimina el "focus trap"
    document.removeEventListener('keydown', trap);

    // Devuelve el foco al elemento anterior
    // (o al botón si no hay referencia)
    (previousFocus || menuToggle).focus();
  }

  // Alterna entre abrir y cerrar el menú usando el botón hamburguesa
  menuToggle.addEventListener('click', function () {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });

  // Cierra el menú si se hace click en el overlay, en un enlace o en el botón cerrar
  mobileMenu.addEventListener('click', function (e) {
    if (
      e.target === mobileMenu ||
      e.target.closest('.mobile-close') ||
      e.target.closest('a')
    ) {
      closeMenu();
    }
  });



  /* ==========================
    Resalta el enlace activo en el menú de navegación
   ========================== */

  // Obtiene la ruta actual de la página desde la URL
  // Ejemplo: "/pages/recetas.html"
  const currentPath = window.location.pathname;


  // Selecciona todos los enlaces de navegación (desktop y móvil)
  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {

    // Obtiene el valor del atributo href de cada enlace
    // Ejemplo: "pages/recetas.html"
    const href = link.getAttribute('href');


    // Caso especial:
    // - Si el enlace apunta a "index.html"
    // - Y la ruta actual es "/" o termina en "/"
    // - También se considera como coincidencia
    if (
      currentPath.includes(href) ||
      (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/'))) 
      /* Funciona cuando la URL no muestra "index.html":
        - "/" → equivale a "/index.html"
        - "/pages/" → equivale a "/pages/index.html"
        Es decir, cuando se accede a una carpeta que tiene un index.html. */
    ) {

      // Si hay coincidencia, se agrega el atributo aria-current="page"
      // Esto permite identificar el enlace como activo:
      // - Visualmente (mediante CSS)
      // - Semánticamente (para accesibilidad)
      link.setAttribute('aria-current', 'page');
    }
  });


  /* ==========================
    Cierra el menú móvil automáticamente al redimensionar a desktop
   ========================== */
   
  // Escucha cambios en el tamaño de la ventana (cuando se redimensiona)
  window.addEventListener('resize', function () {

    // Verifica dos condiciones:
    // 1. Que el ancho de la ventana sea 700px o más (modo desktop)
    // 2. Que el menú esté actualmente abierto (aria-expanded = "true")
    if (window.innerWidth >= 700 && menuToggle.getAttribute('aria-expanded') === 'true') {

      // Cierra el menú móvil automáticamente
      // Esto elimina la clase "menu-open", restaura el scroll
      // y hace que el carrito vuelva a mostrarse
      closeMenu();
    }
  });
});
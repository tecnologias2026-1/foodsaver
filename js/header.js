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

  // Abre el menú móvil, bloquea el scroll del fondo y mueve el foco al primer control
  function openMenu() {
    previousFocus = document.activeElement;
    mobileMenu.hidden = false;
    mobileMenu.classList.add('is-open');
    siteHeader.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    const f = mobileMenu.querySelector(focusableSel);
    if (f) f.focus();

    document.addEventListener('keydown', trap);
  }

  // Cierra el menú móvil, restaura el estado inicial y devuelve el foco
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.hidden = true;
    siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trap);

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

  // Marca visualmente el enlace activo usando aria-current
  document.addEventListener('click', function (e) {
    const link = e.target.closest(navLinksSelector);
    if (!link) return;

    document.querySelectorAll(navLinksSelector).forEach(function (l) {
      l.removeAttribute('aria-current');
    });

    link.setAttribute('aria-current', 'page');
  });
});
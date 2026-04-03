document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const siteHeader = document.querySelector('.site-header');

  if (!menuToggle || !mobileMenu) return;

  let previousFocus = null;
  const focusableSel = 'a, button, [tabindex]:not([tabindex="-1"])';
  const navLinksSelector = '.nav__link, .mobile-nav__link';

  // Trampa de foco: Tab/Shift+Tab ciclan; Escape cierra
  function trap(e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;

    const nodes = mobileMenu.querySelectorAll(focusableSel);
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (!first) return;

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function openMenu() {
    previousFocus = document.activeElement;
    mobileMenu.hidden = false;
    mobileMenu.classList.add('is-open');
    if (siteHeader) siteHeader.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const f = mobileMenu.querySelector(focusableSel);
    if (f) f.focus();
    document.addEventListener('keydown', trap);
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.hidden = true;
    if (siteHeader) siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trap);
    (previousFocus || menuToggle).focus();
  }

  menuToggle.addEventListener('click', function () {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });

  // Cerrar si clic en backdrop, en un enlace o en el botón cerrar
  mobileMenu.addEventListener('click', function (e) {
    if (
      e.target === mobileMenu ||
      e.target.closest('.mobile-close') ||
      e.target.closest('a')
    ) {
      closeMenu();
    }
  });

  // Marcar enlace activo (aria-current)
  document.addEventListener('click', function (e) {
    const link = e.target.closest(navLinksSelector);
    if (!link) return;
    document.querySelectorAll(navLinksSelector).forEach(function (l) { l.removeAttribute('aria-current'); });
    link.setAttribute('aria-current', 'page');
  });
});
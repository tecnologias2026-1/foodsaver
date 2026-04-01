document.addEventListener('DOMContentLoaded', function(){
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');
  const siteHeader = document.querySelector('.site-header');

  if(!menuToggle || !mobileMenu) return;

  function openMenu(){
    mobileMenu.hidden = false;
    mobileMenu.classList.add('is-open');
    if(siteHeader) siteHeader.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
    // move focus into dialog
    const firstFocusable = mobileMenu.querySelector('button, a');
    if(firstFocusable) firstFocusable.focus();
  }

  function closeMenu(){
    mobileMenu.classList.remove('is-open');
    mobileMenu.hidden = true;
    if(siteHeader) siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
    menuToggle.focus();
  }

  menuToggle.addEventListener('click', function(){
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    if(expanded) closeMenu(); else openMenu();
  });

  if(mobileClose) mobileClose.addEventListener('click', closeMenu);

  // close when clicking backdrop
  mobileMenu.addEventListener('click', function(e){
    if(e.target === mobileMenu) closeMenu();
  });

  // close on link click
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMenu));

  // Persist current nav item on click (desktop + mobile).
  // Adds/removes `aria-current="page"` so CSS can style the active item.
  const allNavLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');
  if(allNavLinks.length){
    allNavLinks.forEach(link => {
      link.addEventListener('click', function(){
        allNavLinks.forEach(l => l.removeAttribute('aria-current'));
        this.setAttribute('aria-current','page');
      });
    });
  }

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
  });
});
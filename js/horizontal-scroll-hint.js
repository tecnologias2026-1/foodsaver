document.addEventListener('DOMContentLoaded', function () {
  const checkLists = () => {
    const lists = document.querySelectorAll('.category-list, .recipe-list');
    lists.forEach(list => {
      const isScrollable = list.scrollWidth > list.clientWidth + 6; // small tolerance
      // Find the nearest previous .section-heading inside the same container
      // The markup places .section-heading as a sibling before the list
      let heading = list.previousElementSibling;
      if (!heading || !heading.classList.contains('section-heading')) {
        // fallback: search upward for the nearest .section-heading within the same section
        const section = list.closest('section');
        if (section) heading = section.querySelector('.section-heading');
      }
      if (heading && heading.classList.contains('section-heading')) {
        heading.classList.toggle('has-horizontal-scroll', isScrollable);
      }
    });
  };

  // Run on load
  checkLists();

  // Re-run on resize (debounced)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkLists, 150);
  });

  // Also observe content changes that may affect scrollability
  const observer = new MutationObserver(() => {
    checkLists();
  });
  document.querySelectorAll('.category-list, .recipe-list').forEach(node => {
    observer.observe(node, { childList: true, subtree: true });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const STORAGE_KEY = 'foodsaverCartItems';

  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function getTotalCount(items) {
    return items.reduce((total, item) => total + (Number(item.qty) || 0), 0);
  }

  function updateBadges(count) {
    document.querySelectorAll('.cart-count').forEach(badge => {
      badge.textContent = String(count);
      badge.hidden = count === 0;
      badge.setAttribute('aria-hidden', count === 0 ? 'true' : 'false');
    });
  }

  function addToCart(btn) {
    const card = btn.closest('.market-card');
    if (!card) return;

    const nombre = card.querySelector('h2').textContent.trim();
    const precio = Number(card.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
    const tienda = card.querySelector('.market').textContent.trim();
    const imagen = card.querySelector('img').src;
    const id = (nombre + '|' + tienda).toLowerCase();

    const items = readCart();
    const existing = items.find(item => item.id === id);

    if (existing) {
      existing.qty = (Number(existing.qty) || 0) + 1;
    } else {
      items.push({ id, nombre, precio, tienda, imagen, qty: 1 });
    }

    writeCart(items);
    updateBadges(getTotalCount(items));
    document.dispatchEvent(new CustomEvent('foodsaver:cart-updated', { detail: { items } }));
  }

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn));
  });

  updateBadges(getTotalCount(readCart()));

  document.addEventListener('foodsaver:cart-updated', () => {
    updateBadges(getTotalCount(readCart()));
  });

  window.addEventListener('storage', () => {
    updateBadges(getTotalCount(readCart()));
  });
});
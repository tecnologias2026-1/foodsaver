document.addEventListener('DOMContentLoaded', function () {
  const itemsStorageKey = 'foodsaverCartItems';
  const countStorageKey = 'foodsaverCartCount';

  function readCartItems() {
    try {
      const raw = localStorage.getItem(itemsStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeCartItems(items) {
    localStorage.setItem(itemsStorageKey, JSON.stringify(items));
  }

  function getItemsCount(items) {
    return items.reduce(function (total, item) {
      const qty = Number(item.qty);
      return total + (Number.isFinite(qty) && qty > 0 ? qty : 0);
    }, 0);
  }

  function parsePrice(priceText) {
    const normalized = (priceText || '').replace(/[^0-9]/g, '');
    return Number(normalized) || 0;
  }

  function ensureBadge(container) {
    let badge = container.querySelector('.cart-count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count';
      badge.hidden = true;
      badge.textContent = '0';
      badge.setAttribute('role', 'status');
      badge.setAttribute('aria-live', 'polite');
      badge.setAttribute('aria-atomic', 'true');
      badge.setAttribute('aria-hidden', 'true');
      container.appendChild(badge);
    }
    return badge;
  }

  function getBadges() {
    const containers = document.querySelectorAll('.cart, .mobile-cart');
    return Array.from(containers).map(ensureBadge);
  }

  function renderBadges(count) {
    getBadges().forEach(function (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
      badge.setAttribute('aria-hidden', count === 0 ? 'true' : 'false');
    });
    localStorage.setItem(countStorageKey, String(count));
  }

  function getCurrentCount() {
    const itemsCount = getItemsCount(readCartItems());
    if (itemsCount > 0) {
      return itemsCount;
    }
    const saved = Number(localStorage.getItem(countStorageKey));
    return Number.isFinite(saved) && saved > 0 ? saved : 0;
  }

  function addFromButton(button) {
    const card = button.closest('.market-card');
    if (!card) {
      return;
    }

    const titleNode = card.querySelector('h2');
    const marketNode = card.querySelector('.market');
    const priceNode = card.querySelector('.price');
    const imageNode = card.querySelector('img');

    const name = titleNode ? titleNode.textContent.trim() : 'Producto';
    const market = marketNode ? marketNode.textContent.trim() : 'Supermercado';
    const price = parsePrice(priceNode ? priceNode.textContent.trim() : '0');
    const image = imageNode ? imageNode.getAttribute('src') : '';
    const id = (name + '|' + market).toLowerCase();

    const items = readCartItems();
    const existing = items.find(function (item) {
      return item.id === id;
    });

    if (existing) {
      existing.qty = (Number(existing.qty) || 0) + 1;
    } else {
      items.push({
        id: id,
        name: name,
        market: market,
        price: price,
        image: image,
        qty: 1
      });
    }

    writeCartItems(items);
    renderBadges(getItemsCount(items));

    try {
      const updated = readCartItems();
      document.dispatchEvent(new CustomEvent('foodsaver:cart-updated', { detail: { items: updated } }));
    } catch (err) {
      // no-op: dispatch best-effort
    }
  }

  document.querySelectorAll('.add-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      addFromButton(button);
    });
  });

  renderBadges(getCurrentCount());

  // Update badges when cart changes in other tabs or via custom events.
  document.addEventListener('foodsaver:cart-updated', function () {
    try {
      renderBadges(getItemsCount(readCartItems()));
    } catch (err) {
      // no-op
    }
  });

  window.addEventListener('storage', function (e) {
    try {
      if (e.key === itemsStorageKey || e.key === countStorageKey) {
        renderBadges(getItemsCount(readCartItems()));
      }
    } catch (err) {
      // no-op
    }
  });
});
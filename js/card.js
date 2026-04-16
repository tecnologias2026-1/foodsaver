document.addEventListener('DOMContentLoaded', function () {
  const itemsStorageKey = 'foodsaverCartItems';
  const countStorageKey = 'foodsaverCartCount';

  const emptyCart = document.querySelector('.empty-cart');
  const filledCart = document.querySelector('.filled-cart');
  const itemsList = document.getElementById('cart-items-list');
  const cartSummary = document.querySelector('.cart-summary');
  const totalElement = document.getElementById('cart-total');
  const productsCountElement = document.getElementById('cart-products-count');
  const clearCartButton = document.getElementById('clear-cart-btn');
  const countBadges = document.querySelectorAll('.cart-count');

  function setVisibility(el, visible, fallbackDisplay) {
    if (!el) return;
    el.hidden = !visible;
    try { el.setAttribute('aria-hidden', (!visible).toString()); } catch (e) {}
    el.style.display = visible ? (fallbackDisplay || '') : 'none';
  }

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

  function calculateCount(items) {
    return items.reduce(function (total, item) {
      const qty = Number(item.qty);
      return total + (Number.isFinite(qty) && qty > 0 ? qty : 0);
    }, 0);
  }

  function formatCOP(value) {
    return Number(value || 0).toLocaleString('es-CO');
  }

  function renderBadges(count) {
    countBadges.forEach(function (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
    localStorage.setItem(countStorageKey, String(count));
  }

  function removeItem(id) {
    const items = readCartItems();
    const nextItems = items.reduce(function (accumulator, item) {
      if (item.id !== id) {
        accumulator.push(item);
        return accumulator;
      }

      const qty = Number(item.qty) || 1;
      if (qty > 1) {
        accumulator.push(Object.assign({}, item, { qty: qty - 1 }));
      }

      return accumulator;
    }, []);

    writeCartItems(nextItems);
    render(nextItems);
    try {
      document.dispatchEvent(new CustomEvent('foodsaver:cart-updated', { detail: { items: nextItems } }));
    } catch (err) {
      // best-effort
    }
  }

  function updateItemQuantity(id, delta) {
    const items = readCartItems();
    const nextItems = items.reduce(function (accumulator, item) {
      if (item.id !== id) {
        accumulator.push(item);
        return accumulator;
      }

      const qty = Number(item.qty) || 1;
      const nextQty = qty + delta;

      if (nextQty > 0) {
        accumulator.push(Object.assign({}, item, { qty: nextQty }));
      }

      return accumulator;
    }, []);

    writeCartItems(nextItems);
    render(nextItems);
    try {
      document.dispatchEvent(new CustomEvent('foodsaver:cart-updated', { detail: { items: nextItems } }));
    } catch (err) {
      // best-effort
    }
  }

  function clearCart() {
    writeCartItems([]);
    localStorage.setItem(countStorageKey, '0');
    render([]);
    try {
      document.dispatchEvent(new CustomEvent('foodsaver:cart-updated', { detail: { items: [] } }));
    } catch (err) {
      // best-effort
    }
  }

  function renderItems(items) {
    if (!itemsList || !totalElement) {
      return;
    }

    itemsList.innerHTML = '';

    let total = 0;

    items.forEach(function (item) {
      const qty = Number(item.qty) || 1;
      const unitPrice = Number(item.price) || 0;
      const subtotal = unitPrice * qty;
      total += subtotal;

      const card = document.createElement('article');
      card.className = 'cart-item';
      card.innerHTML =
        '<img class="cart-item__image" src="' + item.image + '" alt="' + item.name + '">' +
        '<div class="cart-item__content">' +
        '  <h2>' + item.name + '</h2>' +
        '  <p class="cart-item__market">Supermercado: ' + item.market + '</p>' +
        '  <div class="cart-item__qty">' +
        '    <span>Cantidad:</span>' +
        '    <div class="qty-stepper" aria-label="Control de cantidad">' +
        '      <button class="qty-stepper__btn" type="button" data-qty-action="decrease" data-qty-id="' + item.id + '" aria-label="Disminuir cantidad">−</button>' +
        '      <span class="qty-stepper__value" aria-live="polite">' + qty + '</span>' +
        '      <button class="qty-stepper__btn" type="button" data-qty-action="increase" data-qty-id="' + item.id + '" aria-label="Aumentar cantidad">+</button>' +
        '    </div>' +
        '  </div>' +
        '</div>' +
        '<div class="cart-item__meta">' +
        '  <p class="cart-item__unit">Precio unitario: ' + formatCOP(unitPrice) + ' COP</p>' +
        '  <div class="cart-item__total-row">' +
        '    <p class="cart-item__line-total">Subtotal: ' + formatCOP(subtotal) + ' COP</p>' +
        '    <button class="cart-item__remove" type="button" data-remove-id="' + item.id + '" aria-label="Eliminar producto">' +
        '      <img src="../assets/icons/Trash.svg" alt="" aria-hidden="true" class="cart-item__remove-icon">' +
        '    </button>' +
        '  </div>' +
        '</div>';

      itemsList.appendChild(card);
    });

    totalElement.textContent = formatCOP(total);
    if (productsCountElement) {
      const count = calculateCount(items);
      productsCountElement.textContent = count + (count === 1 ? ' producto en tu bolsa' : ' productos en tu bolsa');
    }

    itemsList.querySelectorAll('[data-remove-id]').forEach(function (button) {
      button.addEventListener('click', function () {
        removeItem(button.getAttribute('data-remove-id'));
      });
    });

    itemsList.querySelectorAll('[data-qty-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        const id = button.getAttribute('data-qty-id');
        const action = button.getAttribute('data-qty-action');
        updateItemQuantity(id, action === 'increase' ? 1 : -1);
      });
    });
  }

  function render(items) {
    const hasItems = items.length > 0;

    // ensure exclusive visibility using explicit display and aria-hidden
    setVisibility(emptyCart, !hasItems, 'flex');
    setVisibility(filledCart, hasItems, 'flex');

    renderBadges(calculateCount(items));
    renderItems(items);

    setVisibility(itemsList, hasItems, 'block');
    setVisibility(cartSummary, hasItems, 'block');
  }

  // Listen for cross-script cart updates (e.g., when user clicks "Agregar" elsewhere).
  document.addEventListener('foodsaver:cart-updated', function (e) {
    try {
      const items = e && e.detail && Array.isArray(e.detail.items) ? e.detail.items : readCartItems();
      render(items);
    } catch (err) {
      console.error('Error handling foodsaver:cart-updated', err);
    }
  });

  // Listen for storage events to synchronize across tabs/windows.
  window.addEventListener('storage', function (e) {
    try {
      if (e.key === itemsStorageKey) {
        render(readCartItems());
      }
    } catch (err) {
      console.error('storage listener error', err);
    }
  });

  if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
  }

  render(readCartItems());
});
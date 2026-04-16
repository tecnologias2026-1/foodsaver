document.addEventListener('DOMContentLoaded', function () {
  const itemsStorageKey = 'foodsaverCartItems';
  const countStorageKey = 'foodsaverCartCount';

  const emptyCart = document.querySelector('.empty-cart');
  const filledCart = document.querySelector('.filled-cart');
  const itemsList = document.getElementById('cart-items-list');
  const totalElement = document.getElementById('cart-total');
  const productsCountElement = document.getElementById('cart-products-count');
  const clearCartButton = document.getElementById('clear-cart-btn');
  const countBadges = document.querySelectorAll('.cart-count');

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
  }

  function clearCart() {
    writeCartItems([]);
    localStorage.setItem(countStorageKey, '0');
    render([]);
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
        '      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '        <path d="M3 6H5H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '        <path d="M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '        <path d="M10 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '        <path d="M14 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '      </svg>' +
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

    if (emptyCart) {
      emptyCart.hidden = hasItems;
    }

    if (filledCart) {
      filledCart.hidden = !hasItems;
    }

    renderBadges(calculateCount(items));
    renderItems(items);
  }

  if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
  }

  render(readCartItems());
});

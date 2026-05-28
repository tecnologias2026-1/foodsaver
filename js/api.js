const BASE_URL = "https://back-foodsaver.onrender.com";

async function fetchIngredients(search = "") {
  const url = search
    ? `${BASE_URL}/api/ingredients/${encodeURIComponent(search)}`
    : `${BASE_URL}/api/ingredients/`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al cargar ingredientes: " + response.status);
  }
  return await response.json();
}

function renderIngredientCards(grid, ingredients) {
  if (!ingredients || ingredients.length === 0) {
    grid.innerHTML = '<p>No hay ingredientes disponibles</p>';
    return;
  }

  grid.innerHTML = ingredients.map(ingredient => {
    const nombre = ingredient.nombre || ingredient.name || 'Sin nombre';
    const imagen = ingredient.imagen || ingredient.image || '';
    const precio = ingredient.precio || ingredient.price || 0;
    const tienda = ingredient.tienda || ingredient.seller || 'Tienda';
    const id     = ingredient.id || 0;
    const url    = ingredient.url || '';

    return `
      <article class="market-card"
               data-ingrediente-id="${id}"
               data-url="${url}">
        <img src="${imagen}" alt="${nombre}" loading="lazy" decoding="async" width="300" height="300"
             onerror="this.src='../assets/icons/Foodsaver.png'">
        <div class="market-card__content">
          <h2>${nombre}</h2>
          <p class="price">${precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
          <p class="market">${tienda}</p>
          <button class="add-btn" type="button">Añadir a la bolsa</button>
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.market-card');
      if (!card) return;

      const nombre    = card.querySelector('h2')?.textContent.trim()      || 'Producto';
      const tienda    = card.querySelector('.market')?.textContent.trim() || 'Supermercado';
      const priceText = card.querySelector('.price')?.textContent.trim()  || '0';
      const imagen    = card.querySelector('img')?.getAttribute('src')    || '';
      const precio    = Number(priceText.replace(/[^0-9]/g, ''))          || 0;
      const cardId    = (nombre + '|' + tienda).toLowerCase();

      const STORAGE_KEY = 'foodsaverCartItems';
      let items = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        items = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(items)) items = [];
      } catch { items = []; }

      const existing = items.find(i => i.id === cardId);
      if (existing) {
        existing.qty = (Number(existing.qty) || 0) + 1;
      } else {
        items.push({ id: cardId, nombre, precio, tienda, imagen, qty: 1 });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      const total = items.reduce((t, i) => t + (Number(i.qty) || 0), 0);
      document.querySelectorAll('.cart-count').forEach(badge => {
        badge.textContent = String(total);
        badge.hidden = total === 0;
        badge.setAttribute('aria-hidden', total === 0 ? 'true' : 'false');
      });
      document.dispatchEvent(new CustomEvent('foodsaver:cart-updated', { detail: { items } }));
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.ingredient-tabs__item');
  if (!tabs.length) return;

  async function loadTab(tab) {
    const ingredientName = tab.dataset.ingredient;
    const grid = document.querySelector(`.market-grid[data-ingredient="${ingredientName}"]`);
    if (!grid) return;

    if (grid.dataset.loaded === 'true') return;
    grid.dataset.loaded = 'true';

    const originalContent = grid.innerHTML;
    grid.innerHTML = '<p style="padding:1rem;color:var(--color-text-secondary)">Cargando precios...</p>';

    try {
      const data = await fetchIngredients(ingredientName);
      console.log(`Ingredientes recibidos para "${ingredientName}":`, data);
      renderIngredientCards(grid, data);
    } catch (error) {
      console.error(`Error cargando "${ingredientName}":`, error);
      grid.innerHTML = originalContent;
    }
  }

  const activeTab = document.querySelector('.ingredient-tabs__item.is-active');
  if (activeTab) loadTab(activeTab);

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      loadTab(this);
    });
  });
});

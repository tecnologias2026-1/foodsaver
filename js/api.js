async function fetchIngredients() {
  const response = await fetch("/api/ingredients?scrape=true&search=arroz");
  if (!response.ok) {
    throw new Error("Error al cargar ingredientes: " + response.status);
  }
  return await response.json();
}

function renderIngredients(ingredients) {
  // Create or find container for ingredients
  let container = document.getElementById('ingredients-container');
 
  if (!container) {
    container = document.createElement('section');
    container.id = 'ingredients-container';
    container.className = 'ingredients-section';
 
    const main = document.querySelector('main');
    if (main) {
      main.appendChild(container);
    }
  }
 
  if (!ingredients || ingredients.length === 0) {
    container.innerHTML = '<p>No hay ingredientes disponibles</p>';
    return;
  }
 
  let html = '<h2>Ingredientes Disponibles</h2><div class="ingredients-grid">';
 
  ingredients.forEach(ingredient => {
    const nombre = ingredient.nombre || ingredient.name || 'Sin nombre';
    const imagen = ingredient.imagen || ingredient.image || '';
    const precio = ingredient.precio || ingredient.price || 0;
    const tienda = ingredient.tienda || ingredient.seller || 'Tienda';
    const id     = ingredient.id || 0;
    const url    = ingredient.url || '';
 
    html += `
      <div class="ingredient-card market-card"
           data-ingrediente-id="${id}"
           data-url="${url}">
        <img src="${imagen}" alt="${nombre}" onerror="this.src='../assets/icons/Foodsaver.png'">
        <h3>${nombre}</h3>
        <p class="market">${tienda}</p>
        <p class="price">${precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
        <button class="add-btn" type="button">Agregar a bolsa</button>
      </div>
    `;
  });
 
  html += '</div>';
  container.innerHTML = html;
 
  // Attach event listeners to buttons
  document.querySelectorAll('#ingredients-container .add-btn').forEach(button => {
    button.addEventListener('click', async function () {
      const card = this.closest('.market-card');
      if (!card) return;
 
      const nombre  = card.querySelector('h3')?.textContent.trim()           || 'Producto';
      const tienda  = card.querySelector('.market')?.textContent.trim()      || 'Supermercado';
      const priceText = card.querySelector('.price')?.textContent.trim()     || '0';
      const imagen  = card.querySelector('img')?.getAttribute('src')         || '';
      const precio  = parseInt(priceText.replace(/[^0-9]/g, ''))             || 0;
      const ingrediente_id = parseInt(card.dataset.ingredienteId)            || 0;
      const url     = card.dataset.url                                        || '';
 
      // Disable button while request is in flight
      this.disabled = true;
      this.textContent = 'Agregando...';

      try {
        const response = await fetch('/api/bolsa/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingrediente_id, nombre, imagen, precio, tienda, url }),
        });

 
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || 'Error al agregar a la bolsa');
        }
 
        const item = await response.json();
 
        document.dispatchEvent(new CustomEvent('foodsaver:cart-updated', { detail: { item } }));
        alert(`${nombre} agregado a la bolsa ✓`);
      } catch (error) {
        console.error('Error al agregar a bolsa:', error);
        alert('No se pudo agregar: ' + error.message);
      } finally {
        this.disabled = false;
        this.textContent = 'Agregar a bolsa';
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const data = await fetchIngredients();
    console.log("Ingredientes recibidos:", data);
    renderIngredients(data);
  } catch (error) {
    console.error("Error cargando ingredientes:", error);
    document.getElementById('ingredients-container') && (document.getElementById('ingredients-container').innerHTML = '<p>Error al cargar ingredientes</p>');
  }
});
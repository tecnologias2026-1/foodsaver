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
    // If container doesn't exist, create it
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
    const id = ingredient.id || Math.random();
    
    html += `
      <div class="ingredient-card market-card">
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
    button.addEventListener('click', function () {
      const card = this.closest('.market-card');
      if (card) {
        const titleNode = card.querySelector('h3');
        const marketNode = card.querySelector('.market');
        const priceNode = card.querySelector('.price');
        const imageNode = card.querySelector('img');
        
        const name = titleNode ? titleNode.textContent.trim() : 'Producto';
        const market = marketNode ? marketNode.textContent.trim() : 'Supermercado';
        const priceText = priceNode ? priceNode.textContent.trim() : '0';
        const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
        const image = imageNode ? imageNode.getAttribute('src') : '';
        const itemId = (name + '|' + market).toLowerCase();
        
        // Get current cart
        const itemsStorageKey = 'foodsaverCartItems';
        const items = JSON.parse(localStorage.getItem(itemsStorageKey) || '[]');
        
        // Add or update item
        const existing = items.find(item => item.id === itemId);
        if (existing) {
          existing.qty = (existing.qty || 1) + 1;
        } else {
          items.push({
            id: itemId,
            name: name,
            market: market,
            price: price,
            image: image,
            qty: 1
          });
        }
        
        localStorage.setItem(itemsStorageKey, JSON.stringify(items));
        document.dispatchEvent(new CustomEvent('foodsaver:cart-updated', { detail: { items } }));
        alert(`${name} agregado a la bolsa`);
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
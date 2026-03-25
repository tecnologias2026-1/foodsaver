🌐 FoodSaver

El proyecto es una plataforma web de comparación automatizada de precios de ingredientes utilizando técnicas de Web Scraping. Su propósito es facilitar la planificación de compras para personas que cocinan, permitiéndoles seleccionar recetas predeterminadas y buscar en tiempo real los precios de los ingredientes en varios supermercados en línea al mismo tiempo (como Carulla, Éxito y Jumbo). De esta manera, el usuario puede encontrar la mejor relación calidad-precio sin tener que revisar cada tienda manualmente, y añadir los productos que más le convengan a una "bolsa de mercado" o lista de compras digital centralizada.

👥 Integrantes

Madi Sofía Colina Hernández – 1202743

Sebastián Hernando Olarte Galeano – 1202761

Juan Sebastián Sánchez Quimbaya - 1202804

🎯 1. Objetivo General

El objetivo principal del sistema es desarrollar una aplicación web que permita a los usuarios seleccionar recetas predeterminadas y comparar automáticamente los precios de sus ingredientes en diferentes supermercados en línea. Con esto, se busca solucionar el problema que enfrentan las personas interesadas en la gastronomía al intentar encontrar una adecuada relación entre calidad y precio , ya que actualmente la búsqueda y comparación de productos se realiza de forma manual y descentralizada ingresando a cada plataforma de manera independiente. Al centralizar esta información mediante técnicas de Web Scraping , el sistema pretende reducir el tiempo de búsqueda, evitar errores manuales y facilitar la toma de decisiones informadas para optimizar la planificación de compras.

🌍 2. Contexto de Uso

**¿Quién va a usar el sistema?**

El sistema está diseñado para un público bastante amplio y cotidiano. Específicamente, está dirigido a usuarios interesados en la gastronomía, estudiantes, personas que cocinan en casa o, en general, cualquier persona que desee preparar una receta y necesite conocer el costo estimado de sus ingredientes antes de realizar la compra real.

**¿Cómo se va a utilizar el sistema?**

El uso del sistema está pensado para ser rápido, sin fricciones y muy visual. Así es como interactuarán los usuarios con él:


**Entorno y acceso:** La plataforma será una aplicación web accesible a través de navegadores modernos, tanto en dispositivos de escritorio como portátiles.


**Sin barreras de entrada:** No requerirá registro ni autenticación. Los usuarios podrán entrar e ir directo al grano.

**Flujo general de funcionamiento:**

El usuario navega por las categorías y selecciona una receta predeterminada.

Dentro del detalle de la receta, selecciona un ingrediente específico para comparar.

El sistema ejecuta el proceso automatizado (Web Scraping) de fondo y le muestra en pantalla los resultados comparativos de ese producto en distintas tiendas.

Finalmente, el usuario decide cuál opción le conviene más y añade el producto a una "bolsa de mercado".


**Situaciones prácticas:** En la práctica, la gente lo usará para saber cuánto les va a costar preparar un plato , comparar en qué supermercado está más barato un ingrediente , y organizar toda esa información en una lista antes de ir a hacer el mercado de verdad.

📋 3. Requerimientos del Sistema

**3.1 Requerimientos Funcionales**

**-RF01. Navegación principal:** El sistema debe mostrar un header fijo con logo y las opciones de navegación: Inicio, Recetas, Cómo funciona y el ícono de Bolsa de mercado.

**-RF02.** El sistema debe permitir al usuario acceder a la sección “Inicio” y visualizar una descripción del propósito de la web y su funcionamiento general.

**-RF03. Sección “Cómo funcionamos”:** El sistema debe mostrar una sección que explique el flujo del sistema y cómo se realiza la comparación de precios mediante Web Scraping.

**-RF04. Visualización de categorías:** El sistema debe permitir al usuario acceder a la sección Recetas y visualizar el listado de categorías en un menú horizontal deslizable con imagen y nombre por categoría.

**-RF05. Selección de categoría:** El sistema debe permitir al usuario seleccionar una categoría y visualizar las recetas asociadas a dicha categoría.

**-RF06. Receta de ejemplo funcional:** El sistema debe mostrar en la categoría postres la receta de ejemplo Milhoja y permitir acceder a su detalle.

**-RF07. Detalle de receta: El sistema debe mostrar la página de la receta seleccionada con:** imagen, título, descripción breve y el botón “Comparar ingredientes”.

**-RF08. Inicio del proceso de comparación:** El sistema debe iniciar el proceso de comparación de ingredientes al presionar el botón “Comparar ingredientes”.

**-RF09. Listado de ingredientes predefinidos:** El sistema debe mostrar los ingredientes predefinidos de la receta en un menú (sin ocultar el header) y permitir seleccionar un ingrediente.

**-RF10. Ejecución de scraping por ingrediente:** El sistema debe ejecutar el proceso de Web Scraping (o consulta automatizada) al seleccionar un ingrediente y obtener resultados de productos equivalentes.

**-RF11. Presentación de resultados comparativos:** El sistema debe mostrar para cada ingrediente una lista de resultados que incluya como mínimo: nombre del producto, precio, marca y lugar de compra.

**-RF12. Visualización de imagen del producto:** El sistema debe obtener y mostrar la imagen asociada a cada producto extraído durante el proceso de scraping, siempre que la información esté disponible en la fuente consultada.

**-RF13. Añadir ingrediente a la bolsa:** El sistema debe permitir al usuario agregar un resultado a la bolsa mediante el botón “Añadir a la bolsa de mercado”.

**-RF14. Visualización de bolsa de mercado:** El sistema debe permitir al usuario acceder a la bolsa desde el icono del header y visualizar la lista de ingredientes agregados.

**-RF15. Interacción con elementos de la bolsa:** El sistema debe permitir que cada elemento dentro de la bolsa sea clickeable para ver su información (detalle del producto seleccionado).


**3.2 Requerimientos No Funcionales**

**-RNF01:** La interfaz de usuario debe tener un diseño responsivo, garantizando que la información y las tablas comparativas se visualicen correctamente tanto en pantallas de escritorio como en computadoras portátiles.

**-RNF02:** El sistema debe procesar y mostrar los resultados de la comparación de precios (Web Scraping) en un tiempo de respuesta aceptable para evitar frustrar al usuario.

**-RNF03:** El sistema debe ser lo suficientemente intuitivo para que el usuario pueda completar el flujo de comparar ingredientes y añadirlos a la bolsa sin necesidad de leer un manual de ayuda externo.

**-RNF04:** El sistema debe manejar los errores de conexión de forma controlada; si la página de un supermercado (ej. Carulla o Jumbo) se cae o demora en responder, el sistema no debe bloquearse, sino mostrar los resultados de las tiendas que sí respondieron.

**-RNF05:** Si un ingrediente buscado no se encuentra en ninguna de las tiendas consultadas, el sistema debe mostrar un mensaje claro indicando que "No hay resultados disponibles" en lugar de mostrar una pantalla vacía o un error de código.

**-RNF06:** La aplicación web debe ser compatible y funcionar correctamente en las versiones recientes de los navegadores web más populares (Google Chrome, Mozilla Firefox, Microsoft Edge y Safari).

**-RNF07:** El sistema no solicitará, recopilará ni almacenará datos personales de los usuarios, ya que el acceso a la plataforma es libre y no requiere autenticación ni inicio de sesión.

🧠 4. Diagramas UML

**Diagrama de Casos de Uso**

<img width="625" height="281" alt="image" src="https://github.com/user-attachments/assets/581995c9-cce8-4e2a-a3ff-df57e425366d" />

El diagrama muestra que el usuario puede explorar recetas, pero la función central ocurre cuando selecciona un ingrediente para comparar. Esto obliga al sistema a buscar los precios automáticamente (Web Scraping) y mostrarle los resultados. Finalmente, como opción extra, el usuario puede decidir si añade ese producto a su "bolsa de mercado".

**Diagrama de Secuencia**

<img width="625" height="414" alt="image" src="https://github.com/user-attachments/assets/df5e886e-43c4-4bf3-8560-2c69e5251f9e" />

Este diagrama muestra el paso a paso cronológico e interno del sistema.
Ilustra el "detrás de escena" y cómo viaja la información: desde que el usuario elige un ingrediente en la pantalla, pasando por el motor que va a buscar los precios a la tienda externa (Scraping) y la base de datos que guarda el historial, hasta que los resultados vuelven al usuario para que decida si lo añade a su bolsa de mercado.

🎨 5. URL del Prototipo

**Enlace público de Figma:**

[https://www.figma.com/make/oy29cpTqRED9QXwFUOQHlG/Dise%C3%B1o-interfaz-web-mi nimalista?t=mrD3pCUDyii27IIY-1&preview-route=%2Frecetas]


🗄️ 6. Diseño de Base de Datos

<img width="625" height="585" alt="image" src="https://github.com/user-attachments/assets/82dca3a8-99f0-4eb5-83e7-44d8920be7d8" />

**Tablas principales**

**Categoría:** Almacena la clasificación de las recetas (ej. Postres, Veganos, Colombiana). Guarda un ID único y el nombre de la categoría.

**Receta:** Contiene la información general de los platos, incluyendo su ID, nombre, descripción, la URL de su imagen y a qué categoría pertenece.

**Ingrediente:** Es un catálogo de los insumos genéricos requeridos (ej. "Leche", "Harina"). Solo guarda su ID y nombre.

**RecetaIngrediente (Tabla puente):** Conecta una receta con sus ingredientes, detallando además la "cantidad en texto" (ej. "2 tazas", "500 gramos") necesaria para esa receta específica.

**Tienda:** Registra los supermercados en línea que el sistema consulta (ej. Éxito, Carulla). Guarda el ID, nombre y la URL base de la tienda.

**Producto (El núcleo del Scraping):** Se guarda la información extraída de los supermercados. Almacena el nombre específico, marca, precio, URL del producto, imagen y la fecha de captura. Esta tabla vincula el producto comercial directamente con la tienda que lo vende y el ingrediente genérico al que corresponde.

**Bolsa y BolsaProducto:** Estas dos tablas gestionan el "carrito" del usuario. 'Bolsa' registra la creación y estado de la lista, mientras que 'BolsaProducto' guarda el detalle de qué productos específicos se añadieron, cuándo y en qué cantidad

🧩 7. Documentación del Sistema

**Estructura de Carpetas**

**/css:** Contiene todos los archivos de estilos (Hojas de Estilo en Cascada). Aquí se define la apariencia visual de la plataforma, incluyendo colores, tipografías, distribución de los elementos y las reglas de diseño responsivo para que la web se vea bien tanto en computadoras como en dispositivos móviles.

**/js:** Almacena los scripts de JavaScript que controlan la lógica y la interactividad de la página del lado del cliente. Incluye las funciones para manejar los clics del usuario, la comunicación asíncrona con el servidor (para solicitar el Web Scraping) y la actualización dinámica de la interfaz (como mostrar las tablas de precios y gestionar la bolsa de mercado).

**/assets:** Es el directorio donde se guardan todos los recursos estáticos y multimedia del proyecto. Esto incluye el logotipo del sistema, las imágenes de las recetas, iconos de la interfaz, imágenes de los supermercados y fuentes tipográficas personalizadas.

🚀 8. Instalación y Ejecución

Explicar cómo correr el proyecto.

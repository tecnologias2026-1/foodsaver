import json
import os
import sys
from typing import Callable

sys.path.append(r"C:\Users\USUARIO\OneDrive\Escritorio\Tecnologías de internet\proyecto_integrado\backend\back-foodsaver")

from scrapers.jumbo_scraper import scrape_jumbo              # type: ignore
from scrapers.mercadolibre_scraper import scrape_mercadolibre  # type: ignore
from scrapers.olimpica_scraper import scrape_olimpica        # type: ignore

def buscar_producto(nombre_ingrediente: str, scraper_fn: Callable, supermercado: str) -> dict:
    """Busca el producto completo de un ingrediente en cualquier supermercado."""
    try:
        productos, _ = scraper_fn(search=nombre_ingrediente, max_items=1)
        if productos:
            producto = productos[0]
            return {
                "supermercado": supermercado,
                "precio": producto["price"],
                "moneda": "COP",
                "disponible": producto["price"] is not None,
                "imagen": producto["image"],
                "nombre": producto["name"]
            }
    except Exception as e:
        print(f"Error buscando '{nombre_ingrediente}' en {supermercado}: {e}")
    
    return {
        "supermercado": supermercado,
        "precio": None,
        "moneda": "COP",
        "disponible": False,
        "imagen": None,
        "nombre": nombre_ingrediente
    }

# Términos simplificados para buscar en los scrapers
TERMINOS_BUSQUEDA = {
    "Color (Tricompleto)": "condimento",
    "Ajo importado malla x 3 un": "ajo",
    "Arveja amarilla Cuisine&amp;Co": "arveja",
    "Pimentones rojos y verdes": "pimenton",
    "Cebolla cabezona a granel": "cebolla",
    "Arroz Máxima Blanco": "arroz",
    "Pechuga de Pollo": "pechuga pollo",
    "Habichuela": "habichuela"
}

def actualizar_datos(ruta_json: str) -> None:
    
    scrapers = [
        (scrape_jumbo,        "Jumbo"),
        (scrape_mercadolibre, "Mercado Libre"),
        (scrape_olimpica,     "Olímpica"),
    ]

    with open(ruta_json, "r", encoding="utf-8") as f:
        datos = json.load(f)
    
    for receta in datos["recetas"]:
        for ingrediente in receta["ingredientes"]:
            nombre = ingrediente["nombre"]
            
            termino_busqueda = TERMINOS_BUSQUEDA.get(nombre, nombre)

            ingrediente["precios"] = []

            for scraper_fn, supermercado in scrapers:
                print(f"Buscando '{termino_busqueda}' en {supermercado}...")
                
                producto = buscar_producto(termino_busqueda, scraper_fn, supermercado)
                
                if producto["imagen"]:
                    ingrediente["imagen"] = producto["imagen"]
                
                ingrediente["precios"].append({
                    "supermercado": producto["supermercado"],
                    "precio": producto["precio"],
                    "moneda": producto["moneda"],
                    "disponible": producto["disponible"]
                })
    
    with open(ruta_json, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
    
    print("JSON actualizado correctamente con datos de todos los supermercados")

def verificar_actualizacion(ruta_json: str) -> None:
    """Imprime los precios actuales del JSON para verificar que se actualizaron."""
    
    with open(ruta_json, "r", encoding="utf-8") as f:
        datos = json.load(f)
    
    for receta in datos["recetas"]:
        print(f"\n=== Receta: {receta['nombre']} ===")
        for ingrediente in receta["ingredientes"]:
            print(f"\n  Ingrediente: {ingrediente['nombre']}")
            print(f"  Imagen: {ingrediente['imagen']}")
            for precio in ingrediente["precios"]:
                estado = "✓" if precio["disponible"] else "✗"
                print(f"  {estado} {precio['supermercado']}: {precio['precio']} {precio['moneda']}")

def diagnosticar(nombre_ingrediente: str) -> None:
    """Muestra exactamente qué devuelve cada scraper."""
    
    scrapers = [
        (scrape_jumbo,        "Jumbo"),
        (scrape_mercadolibre, "Mercado Libre"),
        (scrape_olimpica,     "Olímpica"),
    ]
    
    for scraper_fn, supermercado in scrapers:
        print(f"\n=== {supermercado} ===")
        try:
            productos, url = scraper_fn(search=nombre_ingrediente, max_items=3)
            print(f"URL buscada: {url}")
            print(f"Productos encontrados: {len(productos)}")
            for p in productos:
                print(f"  - Nombre: {p['name']}")
                print(f"    Precio: {p['price']}")
                print(f"    Imagen: {p['image']}")
        except Exception as e:
            print(f"Error: {e}")

def main():
    diagnosticar("arroz")

if __name__ == "__main__":
    main()
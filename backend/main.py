import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "recetas", "arroz_con_pollo.json")


def load_data():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    return {"recetas": []}


def save_data(data):
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_recipe(data):
    recetas = data.get("recetas", [])
    if recetas:
        return recetas[0]
    return None


def find_ingredient_index(data, ingredient_id):
    recipe = get_recipe(data)
    if not recipe:
        return None
    for index, ingrediente in enumerate(recipe.get("ingredientes", [])):
        if ingrediente.get("id") == ingredient_id:
            return index
    return None


def find_ingredient_by_name(data, name):
    recipe = get_recipe(data)
    if not recipe:
        return None
    for ingrediente in recipe.get("ingredientes", []):
        if ingrediente.get("nombre", "").lower() == name.lower():
            return ingrediente
    return None


def next_ingredient_id(data):
    recipe = get_recipe(data)
    if not recipe:
        return 1
    ids = [ingrediente.get("id", 0) for ingrediente in recipe.get("ingredientes", [])]
    return max(ids, default=100) + 1


def print_ingredient(ingrediente):
    print(f"ID: {ingrediente.get('id')}")
    print(f"Nombre: {ingrediente.get('nombre')}")
    print(f"Imagen: {ingrediente.get('imagen')}")
    print(f"Botón añadir bolsa: {ingrediente.get('botonAnadirBolsa')}")
    precios = ingrediente.get("precios", [])
    if precios:
        print("Precios:")
        for precio in precios:
            disponible = "Sí" if precio.get("disponible") else "No"
            print(f"  - {precio.get('supermercado')}: {precio.get('precio')} {precio.get('moneda')} (Disponible: {disponible})")
    else:
        print("Precios: ninguno")
    print("-")


def list_ingredients():
    data = load_data()
    recipe = get_recipe(data)
    if not recipe:
        print("No se encontró ninguna receta.")
        return
    ingredientes = recipe.get("ingredientes", [])
    if not ingredientes:
        print("No hay ingredientes registrados.")
        return
    print(f"Receta: {recipe.get('nombre', 'Sin nombre')}")
    for ingrediente in ingredientes:
        print_ingredient(ingrediente)


def input_non_empty(prompt):
    while True:
        value = input(prompt).strip()
        if value:
            return value
        print("Este campo no puede quedar vacío.")


def input_yes_no(prompt):
    while True:
        value = input(f"{prompt} (s/n): ").strip().lower()
        if value in {"s", "si", "y", "yes"}:
            return True
        if value in {"n", "no"}:
            return False
        print("Ingrese 's' para sí o 'n' para no.")


def input_float(prompt):
    while True:
        value = input(prompt).strip()
        try:
            return float(value)
        except ValueError:
            print("Ingrese un número válido.")


def input_int(prompt):
    while True:
        value = input(prompt).strip()
        if value.isdigit():
            return int(value)
        print("Ingrese un número entero válido.")


def build_price_list():
    precios = []
    print("Ingrese los precios por supermercado. Deje en blanco el nombre para terminar.")
    while True:
        supermercado = input("Supermercado: ").strip()
        if not supermercado:
            break
        precio = input_float("Precio: ")
        moneda = input_non_empty("Moneda: ")
        disponible = input_yes_no("Disponible?")
        precios.append({
            "supermercado": supermercado,
            "precio": precio,
            "moneda": moneda,
            "disponible": disponible,
        })
    return precios


def add_ingredient():
    data = load_data()
    recipe = get_recipe(data)
    if recipe is None:
        recipe = {"id": 1, "nombre": "Arroz con Pollo", "ingredientes": []}
        data["recetas"] = [recipe]
    nuevo_id = next_ingredient_id(data)
    nombre = input_non_empty("Nombre del ingrediente: ")
    imagen = input_non_empty("Nombre del archivo de imagen: ")
    boton = input_yes_no("¿Mostrar botón Añadir Bolsa?")
    precios = build_price_list()
    ingrediente = {
        "id": nuevo_id,
        "nombre": nombre,
        "imagen": imagen,
        "botonAnadirBolsa": boton,
        "precios": precios,
    }
    recipe.setdefault("ingredientes", []).append(ingrediente)
    save_data(data)
    print(f"Ingrediente '{nombre}' agregado con ID {nuevo_id}.")


def update_ingredient():
    data = load_data()
    recipe = get_recipe(data)
    if not recipe:
        print("No se encontró ninguna receta.")
        return
    ingredient_id = input_int("ID del ingrediente a modificar: ")
    index = find_ingredient_index(data, ingredient_id)
    if index is None:
        print(f"No existe un ingrediente con ID {ingredient_id}.")
        return
    ingrediente = recipe["ingredientes"][index]
    print("Valores actuales:")
    print_ingredient(ingrediente)
    if input_yes_no("¿Desea cambiar el nombre?"):
        ingrediente["nombre"] = input_non_empty("Nuevo nombre: ")
    if input_yes_no("¿Desea cambiar la imagen?"):
        ingrediente["imagen"] = input_non_empty("Nuevo nombre de archivo de imagen: ")
    if input_yes_no("¿Desea cambiar el estado del botón Añadir Bolsa?"):
        ingrediente["botonAnadirBolsa"] = input_yes_no("Mostrar botón Añadir Bolsa?")
    if input_yes_no("¿Desea reemplazar los precios?"):
        ingrediente["precios"] = build_price_list()
    save_data(data)
    print(f"Ingrediente con ID {ingredient_id} actualizado.")


def delete_ingredient():
    data = load_data()
    recipe = get_recipe(data)
    if not recipe:
        print("No se encontró ninguna receta.")
        return
    ingredient_id = input_int("ID del ingrediente a eliminar: ")
    index = find_ingredient_index(data, ingredient_id)
    if index is None:
        print(f"No existe un ingrediente con ID {ingredient_id}.")
        return
    ingrediente = recipe["ingredientes"].pop(index)
    save_data(data)
    print(f"Ingrediente '{ingrediente.get('nombre')}' eliminado.")


def show_prices():
    data = load_data()
    recipe = get_recipe(data)
    if not recipe:
        print("No se encontró ninguna receta.")
        return
    nombre = input_non_empty("Ingrese el nombre del ingrediente para mostrar sus precios: ")
    ingrediente = find_ingredient_by_name(data, nombre)
    if ingrediente is None:
        print("Ingrediente no encontrado.")
        return
    print(f"Precios para '{ingrediente.get('nombre')}':")
    for precio in ingrediente.get("precios", []):
        disponible = "Sí" if precio.get("disponible") else "No"
        print(f"- {precio.get('supermercado')}: {precio.get('precio')} {precio.get('moneda')} (Disponible: {disponible})")


def compare_prices_for_ingredient():
    data = load_data()
    ingredient_name = input_non_empty("Ingrese el nombre del ingrediente para comparar precios entre supermercados: ")
    ingrediente = find_ingredient_by_name(data, ingredient_name)
    if ingrediente is None:
        print("Ingrediente no encontrado.")
        return
    precios = [p for p in ingrediente.get("precios", []) if p.get("disponible")]
    if not precios:
        print("No hay precios disponibles para este ingrediente.")
        return
    precios_ordenados = sorted(precios, key=lambda p: p.get("precio", float("inf")))
    print(f"Comparación de precios para '{ingrediente.get('nombre')}':")
    for precio in precios_ordenados:
        print(f"- {precio.get('supermercado')}: {precio.get('precio')} {precio.get('moneda')}")
    mejor = precios_ordenados[0]
    print(f"Mejor precio: {mejor.get('supermercado')} con {mejor.get('precio')} {mejor.get('moneda')}")


def compare_supermarkets_for_all_ingredients():
    data = load_data()
    recipe = get_recipe(data)
    if not recipe:
        print("No se encontró ninguna receta.")
        return
    totales = {}
    for ingrediente in recipe.get("ingredientes", []):
        for precio in ingrediente.get("precios", []):
            if not precio.get("disponible"):
                continue
            sup = precio.get("supermercado")
            totales[sup] = totales.get(sup, 0) + float(precio.get("precio", 0))
    if not totales:
        print("No hay precios disponibles para comparar.")
        return
    print("Costo total estimado por supermercado para todos los ingredientes disponibles:")
    for supermercado, total in sorted(totales.items(), key=lambda x: x[1]):
        print(f"- {supermercado}: {total:.2f} COP")
    mejor_super = min(totales, key=totales.get)
    print(f"El supermercado más económico es {mejor_super} con {totales[mejor_super]:.2f} COP.")


def main():
    while True:
        print("\n=== CRUD de ingredientes y comparación de precios ===")
        print("1. Listar ingredientes")
        print("2. Agregar ingrediente")
        print("3. Modificar ingrediente")
        print("4. Eliminar ingrediente")
        print("5. Mostrar precios de un ingrediente")
        print("6. Comparar precios entre supermercados para un ingrediente")
        print("7. Comparar supermercados para todos los ingredientes")
        print("8. Salir")
        choice = input("Seleccione una opción: ").strip()
        if choice == "1":
            list_ingredients()
        elif choice == "2":
            add_ingredient()
        elif choice == "3":
            update_ingredient()
        elif choice == "4":
            delete_ingredient()
        elif choice == "5":
            show_prices()
        elif choice == "6":
            compare_prices_for_ingredient()
        elif choice == "7":
            compare_supermarkets_for_all_ingredients()
        elif choice == "8":
            print("Saliendo del programa.")
            break
        else:
            print("Opción no válida. Intente de nuevo.")


if __name__ == "__main__":
    main()

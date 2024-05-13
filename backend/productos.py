from flask import Blueprint, request, jsonify, current_app as app
from bd import Bd
cursor = Bd().cursor
conn = Bd().conn
productos = Blueprint('productos', __name__)

#obtener todos los productos
@productos.route('/productos', methods=['GET'])
def obtener_datos_productos():
    """
    Retrieves data from the 'productos' table in the database.

    Returns:
        A JSON response containing the data retrieved from the 'productos' table.
    """
    cursor.execute('SELECT * FROM productos')
    rows = cursor.fetchall()
    datos = [{'Codigo':row[0],'Nombre':row[1],'Cantidad':row[2],'Precio':row[3]} for row in rows]
    return jsonify(datos)

#enviar datos de productos
@productos.route('/productos', methods=['POST'])
def enviar_datos_productos():
    """
    Endpoint for sending product data to the database.

    This function receives a JSON payload containing product data and inserts it into the 'productos' table in the database.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    with app.app_context():
        datos_nuevos = request.json.get('datos', [])
        print(datos_nuevos)
        try:
            for dato in datos_nuevos:
                query = """
                INSERT INTO productos (codigo,nombre,cantidad_disponible,precio)
                VALUES (%s, %s, %s, %s)
                """
                print(dato)
                cursor.execute(query, (dato['codigo'], dato['nombre'], int(dato['cantidad_disponible']), int(dato['precio'])))
            conn.commit()
            return jsonify({'mensaje': 'Datos de productos enviados correctamente'})
        except Exception as e:
             # Hacer rollback en caso de error
            return jsonify({'error': str(e)})

#ELIMINAR PRODUCTO
@productos.route('/productos', methods=['DELETE'])
def eliminar_producto():
    """
    Endpoint to delete a product from the database.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    with app.app_context():
        datos_nuevos = request.json.get('datos', [])
        codigo = datos_nuevos[0]['codigo']
        try:
            query = """
            DELETE FROM productos WHERE codigo = %s
            """
            cursor.execute(query, (codigo,))
            conn.commit()
            return jsonify({'mensaje': 'Producto eliminado correctamente'})
        except Exception as e:
            # Hacer rollback en caso de error
            return jsonify({'error': str(e)})

#Agregar cantidad de PRODUCTO
@productos.route('/productos', methods=['PUT'])
def agregar_cantidad_producto():
    """
    Endpoint to update the quantity of a product in the database.

    Returns:
        A JSON response with a success message if the update is successful,
        or an error message if there is an exception.
    """
    with app.app_context():
        datos_nuevos = request.json.get('datos', [])
        codigo = datos_nuevos[0]['codigo']
        cantidad = datos_nuevos[0]['cantidad_disponible']
        print(datos_nuevos)
        try:
            query = """
            UPDATE productos SET cantidad_disponible = cantidad_disponible + %s WHERE codigo = %s
            """
            cursor.execute(query, (cantidad, codigo))
            conn.commit()
            return jsonify({'mensaje': 'Cantidad de producto actualizada correctamente'})
        except Exception as e:
            # Hacer rollback en caso de error
            return jsonify({'error': str(e)})
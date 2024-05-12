from flask import Blueprint, request, jsonify, current_app as app
from bd import Bd
cursor = Bd().cursor
conn = Bd().conn
productos = Blueprint('productos', __name__)

#obtener todos los productos
@productos.route('/productos', methods=['GET'])
def obtener_datos_productos():
    cursor.execute('SELECT * FROM productos')
    rows = cursor.fetchall()
    datos = [{'Codigo':row[0],'Nombre':row[1],'Cantidad':row[2],'Precio':row[3]} for row in rows]
    return jsonify(datos)

#enviar datos de productos
@productos.route('/productos', methods=['POST'])
def enviar_datos_productos():
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
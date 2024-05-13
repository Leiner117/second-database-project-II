from flask import Blueprint, request, jsonify, current_app as app
from bd import Bd
cursor = Bd().cursor
conn = Bd().conn
historico_ventas = Blueprint('historico_ventas', __name__)

#obtener todos los productos
@historico_ventas.route('/historico_ventas', methods=['GET'])
def obtener_datos_productos():
    """
    Retrieves historical sales data from the database and returns it as JSON.

    Returns:
        A JSON response containing the historical sales data.
    """
    cursor.execute('SELECT * FROM historico_ventas')
    rows = cursor.fetchall()
    datos = [{'Id':row[0],'Cliente':row[1],'Fecha':row[2],'Descripcion':row[3],'Monto':row[4]} for row in rows]
    print(datos)
    return jsonify(datos)

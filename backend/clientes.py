from flask import Blueprint, request, jsonify, current_app as app
from bd import Bd
cursor = Bd().cursor
conn = Bd().conn
clientes = Blueprint('clientes', __name__)
#obtener todos los productos
@clientes.route('/clientes', methods=['GET'])
def obtener_datos_clientes():
    cursor.execute('SELECT * FROM clientes')
    rows = cursor.fetchall()
    datos = [{'Cedula':row[0],'Nombre':row[1],'Apellido1':row[2],'Apellido2':row[3],'Correo':row[4],'Telefono':row[5]} for row in rows]
    return jsonify(datos)

@clientes.route('/clientes', methods=['POST'])
def enviar_datos_clientes():
    with app.app_context():
        datos_nuevos = request.json.get('datos', [])
        print(datos_nuevos)
        try:
            for dato in datos_nuevos:
                query = """
                INSERT INTO clientes (cedula, nombre, apellido1, apellido2, correo, telefono)
                VALUES (%s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query, (dato['cedula'], dato['nombre'], dato['apellido1'], dato['apellido2'], dato['correo'], dato['telefono']))
            conn.commit()
            return jsonify({'mensaje': 'Datos de clientes enviados correctamente'})
        except Exception as e:
             # Hacer rollback en caso de error
            return jsonify({'error': str(e)})
        
#ELIMINAR CLIENTE
@clientes.route('/clientes', methods=['DELETE'])
def eliminar_cliente():
    with app.app_context():
        datos_nuevos = request.json.get('datos', [])
        cedula = datos_nuevos[0]['cedula']
        try:
            query = """
            DELETE FROM clientes WHERE cedula = %s
            """
            cursor.execute(query, (cedula,))
            conn.commit()
            return jsonify({'mensaje': 'Cliente eliminado correctamente'})
        except Exception as e:
             # Hacer rollback en caso de error
            return jsonify({'error': str(e)})
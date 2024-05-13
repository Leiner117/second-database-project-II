from flask import Blueprint, request, jsonify, current_app as app
from bd import Bd
cursor = Bd().cursor
conn = Bd().conn
monedero = Blueprint('monedero', __name__)

#Recargar monedero
@monedero.route('/monedero', methods=['POST'])
def recargar_monedero():
    with app.app_context():
        datos_nuevos = request.json.get('datos', [])
        try:
            for dato in datos_nuevos:
                # Llamar al procedimiento almacenado aplicar_Recarga
                cursor.execute("CALL aplicar_Recarga(%s, %s)", (dato['Cedula'], float(dato['Cantidad'])))
        except Exception as e:
            print(e)
            return jsonify({'error': str(e)})
        finally:
            conn.commit()
        return jsonify({'mensaje': 'Monedero recargado correctamente'})

#Rebajar monedero
@monedero.route('/monedero', methods=['POST'])
def rebajar_monedero():
    with app.app_context():
        datos_nuevos = request.json.get('datos', [])
        #print(datos_nuevos)
        datos = datos_nuevos[0]['InfoQR']
        cedula = datos.split("/")[0]
        print(cedula)

        try:
            for dato in datos_nuevos:
                # Llamar al procedimiento almacenado aplicar_Recarga
                cursor.execute("CALL aplicar_Rebaja(%s, %s)", (cedula, float(datos_nuevos[0]['total'])))
                cursor.execute("CALL insertar_venta(%s, %s,%s)", (cedula,"Venta comedor" ,float(datos_nuevos[0]['total'])))
        except Exception as e:
            
            return jsonify({'error': str(e)})
        finally:
            conn.commit()
        return jsonify({'mensaje': 'Monedero rebajado correctamente'})
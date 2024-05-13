from flask import Blueprint, request, jsonify, current_app as app
from bd import Bd
cursor = Bd().cursor
conn = Bd().conn
compra = Blueprint('compra', __name__)
import json

#Rebajar monedero
@compra.route('/compra', methods=['POST'])
def rebajar_monedero():
    with app.app_context():
        datos_nuevos = request.json.get('datos', [])
        #print(datos_nuevos)
        datos = datos_nuevos[0]['InfoQR']
        cedula = datos.split("/")[0]
        print(datos_nuevos)
        try:
            
                # Llamar al procedimiento almacenado aplicar_Recarga
            productos_obj = {producto['Codigo']: producto['Cantidad'] for producto in datos_nuevos[0]['productos']}
            print(productos_obj)
            cursor.execute("CALL insertar_venta(%s, %s, %s, %s)", (int(cedula), json.dumps(productos_obj), "Venta comedor", float(datos_nuevos[0]['total'])))
        except Exception as e:
            print(e)
            return jsonify({'error': str(e)})
        finally:
            conn.commit()
        return jsonify({'mensaje': 'Monedero rebajado correctamente'})
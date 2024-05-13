from flask import Blueprint, request, jsonify, current_app as app
from bd import Bd
cursor = Bd().cursor
conn = Bd().conn
compra = Blueprint('compra', __name__)
import json

#Rebajar monedero
@compra.route('/compra', methods=['POST'])
def rebajar_monedero():
    """
    Endpoint for processing a purchase request and updating the wallet balance.

    This function receives a POST request with purchase data in JSON format. It extracts the necessary information from the request, such as the customer's identification, the purchased products, and the total amount. Then, it calls a stored procedure to insert the sale into the database and update the wallet balance.

    Parameters:
    - None

    Returns:
    - JSON response with a success message if the wallet balance was successfully updated, or an error message if an exception occurred.

    Raises:
    - None
    """
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
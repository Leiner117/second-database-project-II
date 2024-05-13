from flask import Flask, request, jsonify
import pyodbc
from flask_cors import CORS
from singleton import SingletonMeta
from bd import Bd
from clientes import clientes
from productos import productos
from historico_ventas import historico_ventas
from monedero import monedero
from compra import compra
app = Flask(__name__)
CORS(app)
app.register_blueprint(clientes)
app.register_blueprint(productos)
app.register_blueprint(historico_ventas)
app.register_blueprint(monedero)
app.register_blueprint(compra)
if __name__ == '__main__':
    app.run(debug=True)
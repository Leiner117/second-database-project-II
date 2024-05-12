from flask import Flask, request, jsonify
import pyodbc
from flask_cors import CORS
from singleton import SingletonMeta
from bd import Bd
from clientes import clientes
from productos import productos
from historico_ventas import historico_ventas
app = Flask(__name__)
CORS(app)
app.register_blueprint(clientes)
app.register_blueprint(productos)
app.register_blueprint(historico_ventas)
if __name__ == '__main__':
    app.run(debug=True)
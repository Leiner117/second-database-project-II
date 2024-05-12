import psycopg2
from singleton import SingletonMeta
class Bd(metaclass = SingletonMeta):
    def __init__(self) -> None:
        server = 'localhost'
        database = 'comedor1'
        username = 'postgres'
        password = '4993'
        port = '5433'
        #conn_str = f"dbname='{database}' user='{username}' host='{server}' password='{password}' port='{port}'"
        connection = psycopg2.connect(
            user=username,
            password=password,
            host=server,
            port=port,
            database=database
        )
        self.conn = connection
        self.cursor = self.conn.cursor()
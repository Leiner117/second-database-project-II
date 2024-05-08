create extension postgres_fdw;

create server comedor_central_pfw
	foreign data wrapper postgres_fdw
	options (host 'localhost',dbname 'comedor',port '5432')

create user mapping for postgres
	server comedor_central_pfw
		options(user 'postgres',password 'admin')	

CREATE FOREIGN TABLE central_sequence_table (
    id serial
)
SERVER comedor_central_pfw;

create table clientes (
    cedula int primary key,
	nombre varchar(25) not null,
    apellido1 varchar(25) not null,
	apellido2 varchar(25) not null,
    correo varchar(50) not null,
	telefono varchar(20)not null,
	codigoQR varchar(500) not null Unique
);
create subscription ingresoClientes connection 'host=localhost port=5432 dbname=comedor user=postgres password=admin' publication nuevosClientes

-- Histórico de Ventas
create table historico_Ventas (
    venta_id int DEFAULT nextval('central_sequence_table_id_seq') Primary key,
    cedula_Cliente int REFERENCES clientes(cedula),
    fecha timestamp not null default now(),
    descripcion varchar(100) not null,
	monto_total float not null
	
);
create publication NuevasVentas for table historico_Ventas
--insert into historico_Ventas(descripcion, monto_total)values('venta de almuerzo',2500)

create table productos (
    Codigo VARCHAR(25) PRIMARY KEY,
    Nombre VARCHAR(100) not null,
	cantidad_Disponible int not null default(0),
    Precio_Unitario int not null default (0)
);

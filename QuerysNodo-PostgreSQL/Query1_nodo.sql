create extension postgres_fdw;
create extension dblink;
-- Configuracion para hacer la conexion con el servidor central
create server comedor_central_pfw
	foreign data wrapper postgres_fdw
	options (host 'localhost',dbname 'comedor',port '5432')
create user mapping for postgres
	server comedor_central_pfw
		options(user 'postgres',password 'admin')	
SERVER comedor_central_pfw;

create table clientes (
    cedula int primary key,
	nombre varchar(25) not null,
    apellido1 varchar(25) not null,
	apellido2 varchar(25) not null,
    correo varchar(50) not null,
	telefono varchar(20)not null
);
create subscription ingresoClientes connection 'host=localhost port=5432 dbname=comedor user=postgres password=admin' publication nuevosClientes

select * from clientes
-- Histórico de Ventas

drop table historico_Ventas
CREATE TABLE historico_Ventas (
    venta_id SERIAL PRIMARY KEY,
    cedula_Cliente INT NOT NULL REFERENCES clientes(cedula),
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    descripcion VARCHAR(100) NOT NULL,
    monto_total FLOAT NOT NULL,
    productos_comprados JSONB not null
);

CREATE OR REPLACE PROCEDURE insertar_venta(
    IN cedula_cliente INT,
    IN productos_comprados JSONB,
    IN descripcion VARCHAR(100),
    IN monto_total FLOAT
)
AS $$
DECLARE
    siguiente_valor INT;
    producto_info JSONB;
    producto_codigo VARCHAR(25);
    producto_cantidad INT;
BEGIN
    -- Obtener el siguiente valor de la secuencia
    SELECT valor_dblink INTO siguiente_valor
    FROM dblink('comedor_central_pfw', 'SELECT obtener_siguiente_valor_secuencia()') AS t(valor_dblink INT);

    -- Insertar el nuevo registro en la tabla historico_ventas
    INSERT INTO historico_ventas (venta_id, cedula_cliente, descripcion, monto_total, productos_comprados)
    VALUES (siguiente_valor, cedula_cliente, descripcion, monto_total, productos_comprados);

    -- Actualizar la cantidad disponible de productos
    FOR producto_codigo, producto_cantidad IN
    SELECT key::varchar, value::int
    FROM jsonb_each_text(productos_comprados)
    LOOP
        UPDATE productos
        SET cantidad_disponible = cantidad_disponible - producto_cantidad
        WHERE codigo = producto_codigo;
    END LOOP; -- Cierre del bucle LOOP

    CALL aplicar_Rebaja(cedula_cliente,monto_total);

END;
$$ LANGUAGE plpgsql;
call insertar_venta(208410988,'{"A231": 2, "A23": 3}', 'Venta', 2000);


drop publication NuevasVentas
create publication NuevasVentas for table historico_Ventas
--insert into historico_Ventas(descripcion, monto_total)values('venta de almuerzo',2500)

CREATE OR REPLACE procedure aplicar_Recarga(
    IN cedula_cliente INT,
    IN monto_Recargar FLOAT
)
as $$    
-- Realizar la recarga del monedero electrónico del cliente en la otra base de datos
    BEGIN
        PERFORM dblink_exec('comedor_central_pfw', format('Call recargar_monedero(%s, %s)', cedula_cliente, monto_Recargar));
    EXCEPTION
        WHEN OTHERS THEN
            -- Manejar la excepción aquí, por ejemplo, lanzando un mensaje de error
           RAISE EXCEPTION 'Error al recargar el monedero electrónico del cliente';
	commit;
END;
$$ LANGUAGE plpgsql;
call aplicar_Recarga(208410988,5500 );


CREATE OR REPLACE procedure aplicar_Rebaja(
    IN cedula_cliente INT,
    IN monto_Rebaja FLOAT
)
as $$    
-- Realizar la recarga del monedero electrónico del cliente en la otra base de datos
    BEGIN
        PERFORM dblink_exec('comedor_central_pfw', format('Call rebajar_monedero(%s, %s)', cedula_cliente, monto_Rebaja));
    EXCEPTION
        WHEN OTHERS THEN
            -- Manejar la excepción aquí, por ejemplo, lanzando un mensaje de error
           RAISE EXCEPTION 'Error al rebajar al monedero electrónico del cliente';
END;
$$ LANGUAGE plpgsql;
call aplicar_Rebaja(208410988,22000);

select * from historico_Ventas

create table productos (
    Codigo varchar(25) PRIMARY KEY,
    Nombre varchar(100) not null,
	cantidad_Disponible int not null default(0),
    Precio int not null default (0)
);
insert into productos(Codigo,Nombre,cantidad_Disponible,Precio)values('A231','Arroz',15,2000)
insert into productos(Codigo,Nombre,cantidad_Disponible,Precio)values('A23','Frijoles',15,2000)

select * from productos



-------------------------Tablas enfocadas a la administración-------------------------
create table establecimientos (        
    establecimiento_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) not null,
    email VARCHAR(50) not null
);

create table nodos (             -- Conexión del establecimiento junto a su ip hacia el nodo central 
    nodo_id SERIAL primary key,
    nombre VARCHAR(100) not null,
    ip_registrada INET not null UNIQUE,
    establecimiento_id INT not null,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos(establecimiento_id)
);

create table clientes (
    cedula int primary key,
	nombre varchar(25) not null,
    apellido1 varchar(25) not null,
	apellido2 varchar(25) not null,
    correo varchar(50) not null,
	telefono varchar(20)not null
);

insert into clientes (cedula, nombre, apellido1, apellido2, correo, telefono)
values (208410988,'Walter','Lazo','Gonzalez','wlksdfdsf','82392832'),
		(29990032,'Leiner','Alvarado','Rodriguez','sdfsdfjss','2313213213');

create publication nuevosClientes for table clientes

create table monedero_Electronico (
    cliente_cedula INT primary key,
    saldo float not null default(0),
    FOREIGN KEY (cliente_cedula) REFERENCES clientes(cedula)
);

CREATE OR REPLACE PROCEDURE recargar_monedero(
    usuario_id INT,
    monto_recarga FLOAT
)

AS $$
BEGIN
    -- Actualizar el saldo del monedero electrónico del usuario
    UPDATE Monedero_Electronico
    SET saldo = saldo + monto_recarga
    WHERE cliente_cedula = usuario_id;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE rebajar_monedero(
    usuario_id INT,
    monto_rebaja FLOAT
)
AS $$
BEGIN
    -- Verificar si el monto de rebaja es menor o igual al saldo actual del monedero
    IF monto_rebaja <= (SELECT saldo FROM Monedero_Electronico WHERE cliente_cedula = usuario_id) THEN
        -- Actualizar el saldo del monedero electrónico del usuario
        UPDATE Monedero_Electronico
        SET saldo = saldo - monto_rebaja
        WHERE cliente_cedula = usuario_id;
        
        -- Completar la transacción
        COMMIT;
    ELSE
        -- Si el monto de rebaja es mayor que el saldo, lanzar una excepción o tomar la acción adecuada
        RAISE EXCEPTION 'El monto de rebaja es mayor que el saldo disponible en el monedero electrónico';
    END IF;
END;
$$
LANGUAGE plpgsql;
select * from Monedero_Electronico

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
CREATE SEQUENCE secuencia_clave_primaria;
CREATE OR REPLACE FUNCTION obtener_siguiente_valor_secuencia()
RETURNS INT AS $$
DECLARE
    siguiente_valor INT;
BEGIN
    SELECT NEXTVAL('secuencia_clave_primaria') INTO siguiente_valor;
    RETURN siguiente_valor;
END;
$$ LANGUAGE plpgsql;

drop subscription ingresoVentas
create subscription ingresoVentas connection 'host=localhost port=5433 dbname=NodoComedor user=postgres password=admin123' publication NuevasVentas

select * from historico_Ventas
--------------Tablas enfocadas a las necesidades de nodos locales ----------------

create table promociones (
    promocion_id SERIAL PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    descripcion varchar(100) not null,
    porcentaje_descuento int not NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    nodo_id int, -- ID del nodo específico al que está asociada la promoción
    FOREIGN KEY (nodo_id) REFERENCES nodos(nodo_id) -- Suponiendo que exista una tabla de Nodos
);

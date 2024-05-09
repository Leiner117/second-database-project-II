-- Crear un Linked Server en SQL Server para acceder a PostgreSQL
EXEC sp_addlinkedserver @server='comedor_central_linkedserver', @srvproduct='PostgreSQL', @provider='MSDASQL', @datasrc='PostgreSQL35W';
-- Configurar la autenticación para el Linked Server
EXEC sp_addlinkedsrvlogin 'comedor_central_linkedserver', 'true', NULL, 'postgres', 'admin';
EXEC sp_serveroption @server='comedor_central_linkedserver', @optname='rpc out', @optvalue='true';

-- Insertar datos en una tabla existente en PostgreSQL desde SQL Server
INSERT INTO comedor_central_linkedserver.comedor."public".clientes (cedula, nombre,apellido1,apellido2,correo,telefono,codigoQR)
VALUES (208410988,'Walter','Lazo','Gonzalez','wlksdfdsf','82392832','');

-- Crear la tabla clientes en SQL Server
CREATE TABLE clientes (
    cedula INT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido1 VARCHAR(50),
    apellido2 VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    codigoQR VARCHAR(100)
);

CREATE PROCEDURE ActualizarClientes
AS
BEGIN
    -- Utilizar MERGE para insertar, actualizar o eliminar según corresponda
    MERGE clientes AS target
    USING (SELECT cedula, nombre, apellido1, apellido2, correo, telefono, codigoQR
           FROM OPENQUERY(comedor_central_linkedserver, 'SELECT cedula, nombre, apellido1, apellido2, correo, telefono, codigoQR FROM comedor."public".clientes')) AS source
    ON (target.cedula = source.cedula)
    WHEN NOT MATCHED THEN 
        INSERT (cedula, nombre, apellido1, apellido2, correo, telefono, codigoQR)
        VALUES (source.cedula, source.nombre, source.apellido1, source.apellido2, source.correo, source.telefono, source.codigoQR);
END;
EXEC ActualizarClientes

CREATE TABLE historico_Ventas (
    venta_id INT PRIMARY KEY ,
    cedula_Cliente INT not null REFERENCES clientes(cedula),
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    descripcion VARCHAR(100) NOT NULL,
    monto_total FLOAT NOT NULL
);

CREATE PROCEDURE InsertarVenta
    @cedula_Cliente INT,
    @descripcion VARCHAR(100),
    @monto_total FLOAT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @siguiente_venta_id INT;

   -- Obtener el próximo valor de la secuencia desde el servidor central PostgreSQL
    SELECT @siguiente_venta_id = siguiente_valor
    FROM OPENQUERY(comedor_central_linkedserver, 'SELECT obtener_siguiente_valor_secuencia() AS siguiente_valor');

    -- Insertar datos en la tabla historico_Ventas usando el siguiente valor de la secuencia
    INSERT INTO historico_Ventas (venta_id, cedula_Cliente, fecha, descripcion, monto_total)
    VALUES (@siguiente_venta_id, @cedula_Cliente, GETDATE(), @descripcion, @monto_total);

	INSERT INTO comedor_central_linkedserver.comedor."public".historico_ventas (venta_id, cedula_Cliente, descripcion, monto_total)
	VALUES (@siguiente_venta_id, @cedula_Cliente, @descripcion, @monto_total);
END;
-- Llamar al procedimiento InsertarVenta con los valores proporcionados
EXEC InsertarVenta 208410988, 'Cafe', 1200;


create table productos (
    Codigo varchar(25) PRIMARY KEY,
    Nombre varchar(100) NOT NULL,
	cantidad_Disponible INT NOT NULL DEFAULT 0,
    Precio INT NOT NULL DEFAULT 0
);
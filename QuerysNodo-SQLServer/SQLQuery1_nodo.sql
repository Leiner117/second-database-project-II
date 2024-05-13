-- Crear un Linked Server en SQL Server para acceder a PostgreSQL
EXEC sp_addlinkedserver @server='comedor_central_linkedserver', @srvproduct='PostgreSQL', @provider='MSDASQL', @datasrc='PostgreSQL35W';
-- Configurar la autenticación para el Linked Server
EXEC sp_addlinkedsrvlogin 'comedor_central_linkedserver', 'true', NULL, 'postgres', 'admin';
EXEC sp_serveroption @server='comedor_central_linkedserver', @optname='rpc out', @optvalue='true';

-- Crear la tabla clientes en SQL Server
CREATE TABLE dbo.clientes (
    cedula INT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido1 VARCHAR(50),
    apellido2 VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    codigoQR VARCHAR(100)
);

CREATE PROCEDURE dbo.ActualizarClientes
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
EXEC dbo.ActualizarClientes

CREATE TABLE dbo.historico_Ventas (
    venta_id INT PRIMARY KEY ,
    cedula_Cliente INT not null REFERENCES clientes(cedula),
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    descripcion VARCHAR(100) NOT NULL,
    monto_total FLOAT NOT NULL
);

CREATE PROCEDURE dbo.InsertarVenta
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
EXEC dbo.InsertarVenta 208410988, 'Cafe', 1200;


CREATE PROCEDURE dbo.aplicar_Recarga_SQL
    @usuario_id INT,
    @monto_recarga FLOAT
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @usuario_id_str NVARCHAR(10);
    DECLARE @monto_recarga_str NVARCHAR(10);

    SET @usuario_id_str = CAST(@usuario_id AS NVARCHAR(10));
    SET @monto_recarga_str = CAST(@monto_recarga AS NVARCHAR(10));

    -- Construir la consulta SQL dinámica para llamar al procedimiento en PostgreSQL a través del Linked Server
    SET @sql = 'Call recargar_monedero(' + @usuario_id_str + ', ' + @monto_recarga_str + ')';

    -- Ejecutar la consulta SQL dinámica
    EXEC (@sql) AT comedor_central_linkedserver;
END;
Exec dbo.aplicar_Recarga_SQL 208410988, 2500


CREATE PROCEDURE dbo.aplicar_Rebaja_SQL
    @usuario_id INT,
    @monto_Rebaja FLOAT
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @usuario_id_str NVARCHAR(10);
    DECLARE @monto_Rebaja_str NVARCHAR(10);

    SET @usuario_id_str = CAST(@usuario_id AS NVARCHAR(10));
    SET @monto_Rebaja_str = CAST(@monto_Rebaja AS NVARCHAR(10));

    -- Construir la consulta SQL dinámica para llamar al procedimiento en PostgreSQL a través del Linked Server
    SET @sql = 'Call rebajar_monedero(' + @usuario_id_str + ', ' + @monto_Rebaja_str + ')';

    -- Ejecutar la consulta SQL dinámica
    EXEC (@sql) AT comedor_central_linkedserver;
END;

Exec dbo.aplicar_Rebaja_SQL 208410988, 2500



create table dbo.productos (
    Codigo varchar(25) PRIMARY KEY,
    Nombre varchar(100) NOT NULL,
	cantidad_Disponible INT NOT NULL DEFAULT 0,
    Precio INT NOT NULL DEFAULT 0
);
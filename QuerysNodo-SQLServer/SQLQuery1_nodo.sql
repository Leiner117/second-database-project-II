-- Crear un Linked Server en SQL Server para acceder a PostgreSQL
EXEC sp_addlinkedserver @server='comedor_central_linkedserver', @srvproduct='PostgreSQL', @provider='MSDASQL', @datasrc='PostgreSQL35W';

-- Configurar la autenticación para el Linked Server
EXEC sp_addlinkedsrvlogin 'comedor_central_linkedserver', 'true', NULL, 'postgres', 'admin';


-- Crear una tabla en SQL Server que mapee a la tabla en PostgreSQL
CREATE TABLE dbo.clientes (
    cedula INT PRIMARY KEY,
    nombre VARCHAR(25) NOT NULL,
    apellido1 VARCHAR(25) NOT NULL,
    apellido2 VARCHAR(25) NOT NULL,
    correo VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    codigoQR VARCHAR(500) NOT NULL UNIQUE
);
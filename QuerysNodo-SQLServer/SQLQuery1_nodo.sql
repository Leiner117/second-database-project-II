--Nodo hacia el servidor central desde SQL Server
--Conexiones remotas a otros servidores

create extension odbc_fdw

CREATE SERVER sqlServer
	FOREIGN DATA WRAPPER odbc_fdw 
	OPTIONS (dsn 'sqlServer_DSN');

CREATE USER MAPPING FOR postgres
	SERVER sqlServer
	OPTIONS (odbc_UID 'usr_basesII', odbc_PWD 'usr_basesII');

create schema externalSQLSERVER

IMPORT FOREIGN SCHEMA dbo
	FROM SERVER  sqlServer
	INTO externalSQLSERVER

select * from externalsqlserver.usuarios

INSERT INTO  externalsqlserver.usuarios VALUES (2,'ANA',18000)
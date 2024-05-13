import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";



/**
 * Renders a table component that displays client data fetched from a server.
 * @returns {JSX.Element} The rendered table component.
 */
export default function TablaClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Realiza la solicitud al servidor para obtener datos de la base de datos
      const response = await fetch("http://127.0.0.1:5000/clientes");
      const data = await response.json();
      setClientes(data); // Ajusta según la estructura de tu respuesta del servidor
    };
  
    fetchData();
  }, []);

  const columns = [
    { key: "Cedula", label: "Cedula" },
    { key: "Nombre", label: "Nombre" },
    { key: "Telefono", label: "Telefono" },
    { key: "Correo", label: "Correo" }
  ];


  return (
    <Table
      aria-label="Example table with dynamic content"
      selectionMode="single"
      color={"primary"}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={clientes}>
        {(item) => (
          <TableRow key={item.Nombre}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
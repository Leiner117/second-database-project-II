import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";



/**
 * Renders a table of products.
 *
 * @returns {JSX.Element} The rendered table component.
 */
export default function TablaClientes() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Realiza la solicitud al servidor para obtener datos de la base de datos
      const response = await fetch("http://127.0.0.1:5000/productos");
      const data = await response.json();
      console.log (data);
      setProductos(data); // Ajusta según la estructura de tu respuesta del servidor
    };
  
    fetchData();
  }, []);

  const columns = [
    { key: "Codigo", label: "Codigo" },
    { key: "Nombre", label: "Nombre" },
    { key: "Cantidad", label: "Cantidad" },
    { key: "Precio", label: "Precio" }
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
      <TableBody items={productos}>
        {(item) => (
          <TableRow key={item.Codigo}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
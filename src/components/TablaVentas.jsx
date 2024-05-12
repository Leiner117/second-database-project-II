import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";



export default function TablaVentas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Realiza la solicitud al servidor para obtener datos de la base de datos
      const response = await fetch("http://127.0.0.1:5000/historico_ventas");
      const data = await response.json();
      console.log (data);
      setVentas(data); // Ajusta según la estructura de tu respuesta del servidor
    };
  
    fetchData();
  }, []);

  const columns = [
    { key: "Id", label: "ID" },
    { key: "Cliente", label: "Cliente" },
    { key: "Fecha", label: "Fecha" },
    { key: "Descripcion", label: "Descripcion" },
    { key: "Monto", label: "Monto" }
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
      <TableBody items={ventas}>
        {(item) => (
          <TableRow key={item.Id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
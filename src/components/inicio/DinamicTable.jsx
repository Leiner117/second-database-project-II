import React, { useState,useEffect } from "react";
import { Card, CardBody, CardFooter, Image, ScrollShadow, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, useDisclosure } from "@nextui-org/react";


const columns = [
  {
    key: "Codigo",
    label: "Codigo",
  },
  {
    key: "Nombre",
    label: "Nombre",
  },
  {
    key: "Precio",
    label: "Precio",
  },
  {
    key: "Cantidad",
    label: "Cantidad",
  }
];

export default function App() {
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
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

  const handleItemPress = (item) => {
    // Verificar si el ítem ya está seleccionado
    const itemIndex = itemsSeleccionados.findIndex((selectedItem) => selectedItem.Codigo === item.Codigo);
    
    if (itemIndex !== -1) {
      // Si está seleccionado, incrementar la cantidad
      const newItemsSeleccionados = [...itemsSeleccionados];
      newItemsSeleccionados[itemIndex] = {
        ...newItemsSeleccionados[itemIndex],
        Cantidad: newItemsSeleccionados[itemIndex].Cantidad + 1,
      };
      setItemsSeleccionados(newItemsSeleccionados);
    } else {
      // Si no está seleccionado, añadirlo a la lista de ítems seleccionados
      setItemsSeleccionados([...itemsSeleccionados, { ...item, Cantidad: 1 }]);
    }
  };

  return (
    <div className="flex flex-row items-start justify-start h-screen p-4">
      <div className="flex flex-col items-start justify-start mb-8">
        <ScrollShadow hideScrollBar offset={100} orientation="vertical" className="max-h-[600px] overflow-auto">
          <div className="flex flex-col gap-2">
            {productos.map((item, index) => (
              <Card shadow="sm" key={index} isPressable onPress={() => handleItemPress(item)} className="w-64 h-64 justify-center items-center">
                <CardBody className="overflow-visible p-0">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.Codigo}
                    className="w-[64px] object-cover h-[140px]"
                  />
                </CardBody>
                <CardFooter className="text-small justify-between">
                  <b>{item.Nombre}</b>
                  <p className="text-default-500">{item.Precio}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollShadow>
      </div>
      <div className="flex flex-col items-start justify-start ml-8">
        <Table aria-label="Example table with dynamic content" className="w-full max-w-[600px]">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={itemsSeleccionados}>
            {(item) => (
              <TableRow key={item.Codigo}>
                {(columnKey) => columnKey === 'Cantidad' ?
                  <TableCell>{item.Cantidad}</TableCell> :
                  <TableCell>{item[columnKey]}</TableCell>
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Button onPress={() => setItemsSeleccionados([])}  className="mt-4">Limpiar carrito</Button>
        
      </div>
    </div>
  );
}
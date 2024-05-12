import React, {useEffect,useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";

import { Select, SelectItem } from "@nextui-org/react";




export default function App() {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [codigo, setCodigo] = useState("");
  const [cantidad_disponible, setCantidad_disponible] = useState("");
  const [value, setValue] = React.useState("");




  const handleSelectionChange = (e) => {
    setCodigo(e.target.value);
  };


  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Realiza la solicitud al servidor para obtener datos de la base de datos
      const response = await fetch("http://localhost:5000/productos");
      const data = await response.json();
      setProductos(data); // Ajusta según la estructura de tu respuesta del servidor
    };
  
    fetchData();
  }, []);


  const modifificarCantidad = async() => {
    console.log(codigo);
    try {
      const response = await fetch('http://localhost:5000/productos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datos: [
            {
              'codigo': codigo,
               'cantidad_disponible': cantidad_disponible
            },
          ],
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar datos al servidor');
      }
  
      const data = await response.json();
      console.log(data.mensaje); // Mensaje del servidor
      console.log(data); // Datos enviados por el servidor
      window.location.reload();
  
    } catch (error) {
      console.error('Error:', error);
      // Puedes manejar el error según tus necesidades, por ejemplo, mostrar un mensaje al usuario.
    }
  }


  return (
    <>
      <Button onPress={onOpen} color="warning">Agregar cantidad de producto</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar cantidad de producto</ModalHeader>
              <ModalBody>

              <div className="flex w-full max-w-xs flex-col gap-2">
              <Select
                label="Producto a modificar"
                variant="bordered"
                selectedKeys={[value]}
                value = {codigo}
                className="max-w-xs"
                onValueChange={setCodigo}
                onChange={handleSelectionChange}
                
              >
                {productos.map((producto) => (
                  <SelectItem key={producto.Nombre} value={producto.Nombre}>
                    {producto.Nombre}
                  </SelectItem>
                ))}
              </Select>
              </div>

              <Input
                  label="Cantidad de producto a agregar"
                  placeholder="Ej: 12345678"
                  variant="bordered"
                  value={cantidad_disponible}
                  onValueChange={setCantidad_disponible}
                  

                  
                />
                
                <div className="flex py-2 px-1 justify-between">
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="warning" onPressStart={modifificarCantidad} onPressEnd={onClose}>
                  Modificar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
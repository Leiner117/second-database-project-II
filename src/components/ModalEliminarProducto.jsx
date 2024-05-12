import React, {useEffect,useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";

import { Select, SelectItem } from "@nextui-org/react";




export default function App() {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = React.useState("");
    const [cantidad_disponible, setCantidad_disponible] = useState("");
    const [precio, setPrecio] = useState("");
    const [value, setValue] = useState("");
  


  const handleSelectionChange = (e) => {
    setValue(e.target.value);
    setCodigo(e.target.value);


    for (let i = 0; i < productos.length; i++) {
        console.log(productos[i].Codigo);
      if (productos[i].Codigo == e.target.value) {

        setNombre(productos[i].Nombre);
        setCantidad_disponible(productos[i].Cantidad_disponible);
        setPrecio(productos[i].Precio);
      }
    }
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


  const eliminarProductos = async() => {
    try {
      const response = await fetch('http://localhost:5000/productos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datos: [
            {
              'codigo': codigo,
            },
          ],
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar datos al servidor');
      }
  
      const data = await response.json();
    
      window.location.reload();
  
    } catch (error) {
      console.error('Error:', error);
    }
  }


  return (
    <>
      <Button onPress={onOpen} color="danger">Eliminar Producto</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Eliminar Producto</ModalHeader>
              <ModalBody>

              <div className="flex w-full max-w-xs flex-col gap-2">
              <Select
                label="Cliente a Eliminar"
                variant="bordered"
                selectedKeys={[value]}
                className="max-w-xs"
                onChange={handleSelectionChange}
              >
                {productos.map((producto) => (
                  <SelectItem key={producto.Codigo} value={producto.Codigo}>
                    {producto.Codigo}
                  </SelectItem>
                ))}
              </Select>
              </div>

              <Input
                  label="Codigo"
                  placeholder="Seleccione un codigo"
                  variant="bordered"
                  value={codigo}
                  onValueChange={setCodigo}
                  readOnly
                />
                
                <div className="flex py-2 px-1 justify-between">
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="danger" onPressStart={eliminarProductos} onPressEnd={onClose}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";


/**
 * Component for adding a product through a modal.
 * @returns {JSX.Element} The rendered component.
 */
export default function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [codigo, setCodigo] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [cantidad_disponible, setCantidad_disponible] = React.useState("");
  const [precio, setPrecio] = React.useState("");

  /**
   * Function to add a product by sending a POST request to the server.
   * @returns {Promise<void>} A promise that resolves when the product is added successfully.
   */
  const agregarProducto = async() => {
    try {
      const response = await fetch('http://localhost:5000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datos: [
            {
              codigo,
              nombre,
              cantidad_disponible,
              precio
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar datos al servidor');
      }
  
      const data = await response.json();
      console.log(data.mensaje); // Mensaje del servidor
  
      window.location.reload();
  
    } catch (error) {
      console.error('Error:', error);
      // Puedes manejar el error según tus necesidades, por ejemplo, mostrar un mensaje al usuario.
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">Agregar Productos</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar producto</ModalHeader>
              <ModalBody>
                <Input
                  label="Codigo"
                  placeholder="Ej: 12345678"
                  variant="bordered"
                  value={codigo}
                  onValueChange={setCodigo}
                />
                <Input
                  label="Nombre"
                  placeholder="Ej: Arroz"
                  variant="bordered"
                  value={nombre}
                  onValueChange={setNombre}
                />
                <Input
                  label="Cantidad Disponible"
                  placeholder="Ej: 10"
                  variant="bordered"
                  value={cantidad_disponible}
                  onValueChange={setCantidad_disponible}
                />
                <Input
                  label="Precio"
                  placeholder="Ej: 100$"
                  variant="bordered"
                  value={precio}
                  onValueChange={setPrecio}
                />
                
                <div className="flex py-2 px-1 justify-between">
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={agregarProducto} onPressEnd={onClose}>
                  Agregar Producto
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
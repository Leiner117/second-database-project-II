import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";


/**
 * Component for adding a new client.
 * @returns {JSX.Element} The rendered component.
 */
export default function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [nombre, setNombre] = React.useState("");
  const [apellido1, setApellido1] = React.useState("");
  const [apellido2, setApellido2] = React.useState("");
  const [cedula, setCedula] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [correo, setCorreo] = React.useState("");

  /**
   * Function to add a new client.
   * @returns {Promise<void>} A promise that resolves when the client is added successfully.
   */
  const agregarCliente = async() => {
    try {
      const response = await fetch('http://localhost:5000/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datos: [
            {
              cedula,
              nombre,
              apellido1,
              apellido2,
              telefono,
              correo
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
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">Agregar Clientes</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar Cliente</ModalHeader>
              <ModalBody>
                <Input
                  label="Cedula"
                  placeholder="Ej: 12345678"
                  variant="bordered"
                  value={cedula}
                  onValueChange={setCedula}
                />
                <Input
                  label="Nombre"
                  placeholder="Ej: Melanie"
                  variant="bordered"
                  value={nombre}
                  onValueChange={setNombre}
                />
                <Input
                  label="Apellido 1"
                  placeholder="Ej: Elizondo"
                  variant="bordered"
                  value={apellido1}
                  onValueChange={setApellido1}
                />
                <Input
                  label="Apellido 2"
                  placeholder="Ej: Carranza"
                  variant="bordered"
                  value={apellido2}
                  onValueChange={setApellido2}
                />
                <Input
                  label="Telefono"
                  placeholder="Ej: 1234567890"
                  variant="bordered"
                  value={telefono}
                  onValueChange={setTelefono}
                />
                <Input
                  label="Correo"
                  placeholder="Ej: melanie@example.com"
                  variant="bordered"
                  value={correo}
                  onValueChange={setCorreo}
                />
                <div className="flex py-2 px-1 justify-between">
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={agregarCliente} onPressEnd={onClose}>
                  Agregar Cliente
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
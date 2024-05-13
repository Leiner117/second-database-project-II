import React, {useEffect,useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";

import { Select, SelectItem } from "@nextui-org/react";




/**
 * ModalEliminarCliente component.
 * This component displays a modal for deleting a client.
 */
export default function App() {

  /**
   * State variables
   */
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [value, setValue] = useState("");

  /**
   * Handles the change event of the selection input.
   * @param {Object} e - The event object
   */
  const handleSelectionChange = (e) => {
    setValue(e.target.value);
    setNombre(e.target.value);

    for (let i = 0; i < clientes.length; i++) {
      console.log(clientes[i].Nombre);
      if (clientes[i].Cedula == e.target.value) {
        setNombre(clientes[i].Nombre);
        setApellido1(clientes[i].Apellido1);
        setApellido2(clientes[i].Apellido2);
        setCedula(clientes[i].Cedula);
        setTelefono(clientes[i].Telefono);
        setCorreo(clientes[i].Correo);
      }
    }
  };

  /**
   * Fetches the client data from the server.
   */
  useEffect(() => {
    const fetchData = async () => {
      // Make a request to the server to get data from the database
      const response = await fetch("http://localhost:5000/clientes");
      const data = await response.json();
      setClientes(data); // Adjust according to your server response structure
    };

    fetchData();
  }, []);

  /**
   * Deletes the selected client.
   */
  const eliminarCliente = async() => {
    try {
      const response = await fetch('http://localhost:5000/clientes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datos: [
            {
              'cedula': cedula,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar datos al servidor');
      }

      const data = await response.json();
      console.log(data);
      window.location.reload();

    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Renders the ModalEliminarCliente component.
   */
  return (
    <>
      <Button onPress={onOpen} color="danger">Eliminar Clientes</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Eliminar Cliente</ModalHeader>
              <ModalBody>

                <div className="flex w-full max-w-xs flex-col gap-2">
                  <Select
                    label="Cliente a Eliminar"
                    variant="bordered"
                    selectedKeys={[value]}
                    className="max-w-xs"
                    onChange={handleSelectionChange}
                  >
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.Cedula} value={cliente.Cedula}>
                        {cliente.Cedula}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <Input
                  label="Nombre"
                  placeholder="Seleccione un nombre"
                  variant="bordered"
                  value={nombre}
                  onValueChange={setNombre}
                  readOnly
                />

                <div className="flex py-2 px-1 justify-between">
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="danger" onPressStart={eliminarCliente} onPressEnd={onClose}>
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
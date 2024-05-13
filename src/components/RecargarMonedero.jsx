import { useState,useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';

import { Select, SelectItem } from "@nextui-org/react";
function RecargarMonedero() {
  const [cliente, setCliente] = useState('');
  const [cantidad, setCantidad] = useState('');
  const[Cedula, setCedula] = useState('');
  const [value, setValue] = useState("");
  const [clientes, setClientes] = useState([]);


  const handleRecarga = async () => {
    try {
      const response = await fetch('http://localhost:5000/monedero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datos: [
            {
              'Cedula': Cedula, // Usar el estado cliente aquí
              'Cantidad': cantidad,
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
  };
  useEffect(() => {
    const fetchData = async () => {
      // Realiza la solicitud al servidor para obtener datos de la base de datos
      const response = await fetch("http://localhost:5000/clientes");
      const data = await response.json();   
      setClientes(data); // Ajusta según la estructura de tu respuesta del servidor
    };
  
    fetchData();
  }, []);
  const handleSelectionChange = (e) => {
    setCedula(e.target.value);
  };

  return (
    <div>
      <Select
        label="Cliente a recargar"
        variant="bordered"
        selectedKeys={[value]}
        className="max-w-xs"
        value = {Cedula}
        onValueChange={setCedula}
        onChange={handleSelectionChange}
        >
        {clientes.map((cliente) => (
            <SelectItem key={cliente.Cedula} value={cliente.Cedula}>
            {cliente.Cedula}
            </SelectItem>
        ))}
        </Select>
    <Input
        type="number"
        placeholder="Cantidad a recargar"
        value={cantidad}
        onValueChange={setCantidad}
      />
      <Button color="primary"  onClick={handleRecarga}>
        Recargar
      </Button>
    </div>
  );
}

export default RecargarMonedero;
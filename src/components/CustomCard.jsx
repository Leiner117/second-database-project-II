import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import { useState } from "react";

/**
 * CustomCard component.
 * Renders a list of cards with images and information.
 */
export default function App() {
  const list = [
    {
      key: "1",
      codigo: "1231",
      nombre: "CEO",
      precio: "$1000",
    },
    {
      key: "2",
      codigo: "1232",
      nombre: "CEO",
      precio: "$1000",
    },
    {
      key: "3",
      codigo: "1234",
      nombre: "CEO",
      precio: "$1000",
    },
    {
      key: "4",
      codigo: "1234",
      nombre: "CEO",
      precio: "$1000",
    },
  ];
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

  /**
   * Handles the press event when an item is selected.
   * If the item is already selected, it increments the quantity.
   * If the item is not selected, it adds it to the list of selected items.
   * @param {Object} item - The selected item.
   */
  const handleItemPress = (item) => {
    // Verificar si el ítem ya está seleccionado
    const itemIndex = itemsSeleccionados.findIndex((selectedItem) => selectedItem.key === item.key);
  
    if (itemIndex !== -1) {
      // Si está seleccionado, incrementar la cantidad
      const newItemsSeleccionados = [...itemsSeleccionados];
      newItemsSeleccionados[itemIndex] = {
        ...newItemsSeleccionados[itemIndex],
        cantidad: (newItemsSeleccionados[itemIndex].cantidad || 1) + 1,
      };
      setItemsSeleccionados(newItemsSeleccionados);
    } else {
      // Si no está seleccionado, añadirlo a la lista de ítems seleccionados
      setItemsSeleccionados([...itemsSeleccionados, { ...item, cantidad: 1 }]);
    }
  };

  return (
    <ScrollShadow hideScrollBar offset={100} orientation="horizontal" className="max-w-[1200px] max-h-[600px] overflow-auto">
      <div className="gap-2 grid grid-cols-1 justify-center items-center w-[120px] h-[270px]">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable onPress={() => handleItemPress(item)} className="w-64 h-64 justify-center items-center">
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.codigo}
                className="w-[64px] object-cover h-[140px]"
                 // Use placeholder image if img is missing
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500">{item.precio}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollShadow>
  );
}

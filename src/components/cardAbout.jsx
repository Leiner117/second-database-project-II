import React from "react";
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";

/**
 * Renders a component that displays information about team members in cards.
 */
export default function App() {
  return (
    <div className="flex flex-row justify-center min-h-screen">
      <Card className="py-4 w-64 h-64 mr-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large text-center">Walter Lazo</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
        <div className="flex justify-center">
          <a href="https://github.com/Walter-Lz">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://avatars.githubusercontent.com/u/110853581?v=4"
            width={180}
          />
          </a>
        </div>
        </CardBody>
      </Card>
      <Card className="py-4 w-64 h-64 mr-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large text-center">Justin Martinez</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
        <div className="flex justify-center">
          <a href="https://github.com/justinalonsomm">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://avatars.githubusercontent.com/u/127434581?v=4"
            width={180}
          />
          </a>
        </div>
        </CardBody>
      </Card>
      <Card className="py-4 w-64 h-64">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large text-center justify-center">Leiner Alvarado</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
        <div className="flex justify-center">
          <a href="https://github.com/Leiner117">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://avatars.githubusercontent.com/u/101950242?s=400&u=6e1fa7d475473f0fdcc1ccf3ef9f9cb1fb488ab4&v=4"
            width={180}
          />
          </a>
        </div>
        </CardBody>
      </Card>
    </div>
  );
}
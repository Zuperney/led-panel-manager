import React from "react";
import { PanelCard } from "../modules/Panels";
import type { Panel } from "../modules/Panels/types";

// Example panel data
const examplePanel: Panel = {
  id: "1",
  name: "P2.5 Indoor LED Panel",
  manufacturer: "Novastar",
  model: "NovaPro UHD Jr",
  width: 800,
  height: 400,
  pixelPitch: 2.5,
  powerConsumption: 380,
  brightness: 1200,
  refreshRate: 3840,
  inputVoltage: 110,
  operatingTemperature: {
    min: -20,
    max: 60,
  },
  ipRating: "IP40",
  weight: 5.2,
  price: 1250,
  description:
    "High-quality indoor LED panel with excellent color reproduction",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const PanelCardExample: React.FC = () => {
  const handleEdit = (panel: Panel) => {
    console.log("Edit panel:", panel.name);
    // Implement edit logic here
  };

  const handleDelete = (panel: Panel) => {
    console.log("Delete panel:", panel.name);
    // Implement delete logic here
  };

  const handleDuplicate = (panel: Panel) => {
    console.log("Duplicate panel:", panel.name);
    // Implement duplicate logic here
  };

  const handleClick = (panel: Panel) => {
    console.log("Panel clicked:", panel.name);
    // Implement click/view logic here
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Panel Card Example</h1>

      <div className="max-w-md">
        <PanelCard
          panel={examplePanel}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

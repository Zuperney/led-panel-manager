import { motion } from "framer-motion";
import { StatusCard } from "../ModernUI";
import { Monitor, Zap, Weight, Ruler } from "lucide-react";

export default function GabinetesStats({
  gabinetesFiltrados,
  gabinetes,
  searchTerm,
  filterBy,
}) {
  const statsCards = [
    {
      title: "Gabinetes",
      value:
        searchTerm || filterBy !== "todos"
          ? `${gabinetesFiltrados.length} / ${gabinetes.length}`
          : gabinetes.length,
      icon: Monitor,
      color: "blue",
      subtitle:
        searchTerm || filterBy !== "todos" ? "Filtrados / Total" : "Total",
    },
    {
      title: "Potência Total",
      value:
        gabinetesFiltrados
          .reduce((acc, g) => acc + (g.potencia || 0), 0)
          .toLocaleString("pt-BR") + "W",
      icon: Zap,
      color: "yellow",
      subtitle: `Média: ${
        gabinetesFiltrados.length > 0
          ? Math.round(
              gabinetesFiltrados.reduce(
                (acc, g) => acc + (g.potencia || 0),
                0
              ) / gabinetesFiltrados.length
            )
          : 0
      }W`,
    },
    {
      title: "Peso Total",
      value:
        gabinetesFiltrados
          .reduce((acc, g) => acc + (g.peso || 0), 0)
          .toFixed(1) + "kg",
      icon: Weight,
      color: "green",
      subtitle: `Média: ${
        gabinetesFiltrados.length > 0
          ? (
              gabinetesFiltrados.reduce((acc, g) => acc + (g.peso || 0), 0) /
              gabinetesFiltrados.length
            ).toFixed(1)
          : 0
      }kg`,
    },
    {
      title: "Área Total",
      value:
        gabinetesFiltrados
          .reduce(
            (acc, g) => acc + ((g.largura || 0) * (g.altura || 0)) / 1000000,
            0
          )
          .toFixed(2) + "m²",
      icon: Ruler,
      color: "purple",
      subtitle: `Pixel Pitch médio: ${
        gabinetesFiltrados.length > 0
          ? (
              gabinetesFiltrados.reduce(
                (acc, g) => acc + (g.pixelPitch || 0),
                0
              ) / gabinetesFiltrados.length
            ).toFixed(1)
          : 0
      }mm`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatusCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}

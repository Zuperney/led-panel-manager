import { motion } from "framer-motion";
import { StatusCard } from "../ModernUI";
import {
  Monitor,
  Zap,
  Ruler,
  Weight,
  Building2,
  Calculator,
} from "lucide-react";

export default function PaineisStats({ paineisFiltrados, gabinetes }) {
  // Calcular estatísticas
  const stats = {
    totalPaineis: paineisFiltrados.length,
    potenciaTotal: paineisFiltrados.reduce((acc, painel) => {
      const gabinete = gabinetes.find((g) => g.nome === painel.gabinete);
      if (gabinete) {
        const qtdGabinetes = (painel.qtdLargura || 1) * (painel.qtdAltura || 1);
        return acc + gabinete.potencia * qtdGabinetes;
      }
      return acc;
    }, 0),
    areaTotal: paineisFiltrados.reduce(
      (acc, painel) => acc + (painel.area || 0),
      0
    ),
    pesoTotal: paineisFiltrados.reduce(
      (acc, painel) => acc + (painel.peso || 0),
      0
    ),
    modulosTotal: paineisFiltrados.reduce((acc, painel) => {
      return acc + (painel.qtdLargura || 1) * (painel.qtdAltura || 1);
    }, 0),
    projetosUnicos: new Set(paineisFiltrados.map((p) => p.projeto)).size,
  };

  // Cards de estatísticas
  const statsCards = [
    {
      title: "Painéis",
      value: stats.totalPaineis.toLocaleString("pt-BR"),
      subtitle: `${stats.projetosUnicos} projeto${
        stats.projetosUnicos !== 1 ? "s" : ""
      }`,
      icon: Monitor,
      color: "blue",
      trend: stats.totalPaineis > 0 ? "up" : "neutral",
    },
    {
      title: "Potência Total",
      value: stats.potenciaTotal.toLocaleString("pt-BR") + "W",
      subtitle: `${(stats.potenciaTotal / 1000).toFixed(1)}kW`,
      icon: Zap,
      color: "yellow",
      trend:
        stats.potenciaTotal > 5000
          ? "up"
          : stats.potenciaTotal > 1000
          ? "neutral"
          : "down",
    },
    {
      title: "Área Total",
      value: stats.areaTotal.toFixed(1) + "m²",
      subtitle: `${stats.modulosTotal} módulos`,
      icon: Ruler,
      color: "green",
      trend:
        stats.areaTotal > 50 ? "up" : stats.areaTotal > 10 ? "neutral" : "down",
    },
    {
      title: "Peso Total",
      value: stats.pesoTotal.toFixed(0) + "kg",
      subtitle: `${(stats.pesoTotal / 1000).toFixed(1)}t`,
      icon: Weight,
      color: "purple",
      trend:
        stats.pesoTotal > 1000
          ? "up"
          : stats.pesoTotal > 500
          ? "neutral"
          : "down",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatusCard {...card} className="h-full" />
        </motion.div>
      ))}
    </div>
  );
}

// import { motion } from "framer-motion"; // Para futuras animações
import { Monitor, Zap, Ruler } from "lucide-react";
import { StatusCard } from "../../../../components/ModernUI";

/**
 * � PainelStats - Componente de Estatísticas dos Painéis
 *
 * Responsabilidades:
 * - Exibir cards de estatísticas dos painéis
 * - Calcular totais de potência e área
 * - Fornecer indicadores visuais de performance
 * - Animações fluidas para os cards
 */
export default function PainelStats({ paineisFiltrados, gabinetes }) {
  // Cálculo das estatísticas
  const stats = {
    totalPaineis: paineisFiltrados.length,
    potenciaTotal: paineisFiltrados.reduce((acc, p) => {
      const gabinete = gabinetes.find((g) => g.nome === p.gabinete);
      if (gabinete) {
        const qtdGab = (p.qtdLargura || 1) * (p.qtdAltura || 1);
        return acc + gabinete.potencia * qtdGab;
      }
      return acc;
    }, 0),
    areaTotal: paineisFiltrados.reduce((acc, p) => acc + (p.area || 0), 0),
  };

  // Configuração dos cards de estatísticas
  const statsCards = [
    {
      title: "Painéis Criados",
      value: stats.totalPaineis,
      icon: Monitor,
      color: "blue",
    },
    {
      title: "Potência Total",
      value: stats.potenciaTotal.toLocaleString("pt-BR") + "W",
      icon: Zap,
      color: "yellow",
    },
    {
      title: "Área Total",
      value: stats.areaTotal.toFixed(2) + "m²",
      icon: Ruler,
      color: "green",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

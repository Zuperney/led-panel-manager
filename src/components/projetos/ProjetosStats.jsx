import { motion } from "framer-motion";
import { StatusCard } from "../ModernUI";
import { FolderOpen, Clock, AlertTriangle } from "lucide-react";

export default function ProjetosStats({
  projetosFiltrados,
  projetos,
  searchTerm,
  filterBy,
}) {
  // Calcular estatísticas
  const hoje = new Date();

  const projetosAtrasados = projetosFiltrados.filter((p) => {
    const dataEntrega = p.dataEntrega ? new Date(p.dataEntrega) : null;
    return dataEntrega && dataEntrega < hoje;
  }).length;

  const projetosUrgentes = projetosFiltrados.filter((p) => {
    const dataEntrega = p.dataEntrega ? new Date(p.dataEntrega) : null;
    if (!dataEntrega) return false;
    const seteDiasAFrente = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dataEntrega <= seteDiasAFrente && dataEntrega >= hoje;
  }).length;

  const statsCards = [
    {
      title: "Projetos",
      value:
        searchTerm || filterBy !== "todos"
          ? `${projetosFiltrados.length} / ${projetos.length}`
          : projetos.length,
      icon: FolderOpen,
      color: "blue",
      subtitle:
        searchTerm || filterBy !== "todos" ? "Filtrados / Total" : "Total",
    },
    {
      title: "Atrasados",
      value: projetosAtrasados,
      icon: AlertTriangle,
      color: "red",
      subtitle:
        projetosAtrasados === 1 ? "projeto atrasado" : "projetos atrasados",
    },
    {
      title: "Urgentes",
      value: projetosUrgentes,
      icon: Clock,
      color: "yellow",
      subtitle:
        projetosUrgentes === 1
          ? "projeto urgente (≤7 dias)"
          : "projetos urgentes (≤7 dias)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <StatusCard
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import { Edit2, Trash2, User, Calendar, Building2 } from "lucide-react";
import { useMemo } from "react";

export default function ProjetoListItem({
  projeto,
  originalIndex,
  index,
  editarProjeto,
  removerProjeto,
  formatarData,
}) {
  // Calcular status do projeto usando useMemo
  const { status, statusText } = useMemo(() => {
    const hoje = new Date();
    const dataEntrega = projeto.dataEntrega
      ? new Date(projeto.dataEntrega)
      : null;
    const seteDiasAFrente = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);

    let status = "no-prazo";
    let statusText = "No Prazo";

    if (dataEntrega) {
      const hojeSemHora = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );
      const dataEntregaSemHora = new Date(
        dataEntrega.getFullYear(),
        dataEntrega.getMonth(),
        dataEntrega.getDate()
      );

      if (dataEntregaSemHora < hojeSemHora) {
        status = "atrasado";
        statusText = "Atrasado";
      } else if (
        dataEntregaSemHora <=
        new Date(
          seteDiasAFrente.getFullYear(),
          seteDiasAFrente.getMonth(),
          seteDiasAFrente.getDate()
        )
      ) {
        status = "urgente";
        statusText = "Urgente";
      }
    }

    return { status, statusText };
  }, [
    projeto.dataEntrega,
    projeto.nome,
    projeto.cliente,
    projeto.descricao,
    projeto._updatedAt,
  ]);

  return (
    <motion.div
      key={`projeto-list-${originalIndex}-${index}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        delay: index * 0.02,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      whileHover={{
        scale: 1.005,
        x: 4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 
                 hover:bg-white/10 hover:border-blue-300/60 hover:shadow-lg 
                 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-center justify-between">
        {/* Informações principais */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 items-center">
          {/* Nome do Projeto */}
          <div className="flex items-center gap-3 lg:col-span-1">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg ring-1 ring-blue-400/30 flex-shrink-0">
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-sm truncate group-hover:text-blue-200 transition-colors">
                {projeto.nome}
              </h3>
              {/* Mostrar cliente abaixo do nome em telas pequenas */}
              <div className="lg:hidden flex items-center gap-1 mt-1">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-xs truncate">
                  {projeto.cliente || "Não informado"}
                </span>
              </div>
            </div>
          </div>

          {/* Cliente - oculto em telas pequenas */}
          <div className="hidden lg:flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm truncate">
              {projeto.cliente || "Não informado"}
            </span>
          </div>

          {/* Data de Entrega */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">
              {formatarData(projeto.dataEntrega)}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-start">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-inset ${
                status === "atrasado"
                  ? "bg-red-500/20 text-red-300 ring-red-500/30"
                  : status === "urgente"
                  ? "bg-yellow-500/20 text-yellow-300 ring-yellow-500/30"
                  : "bg-green-500/20 text-green-300 ring-green-500/30"
              }`}
            >
              {statusText}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit2}
            className="opacity-70 hover:opacity-100 hover:bg-green-500/20 hover:text-green-300 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              editarProjeto(originalIndex);
            }}
            title="Editar projeto"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="opacity-70 hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              removerProjeto(originalIndex);
            }}
            title="Excluir projeto"
          />
        </div>
      </div>
    </motion.div>
  );
}

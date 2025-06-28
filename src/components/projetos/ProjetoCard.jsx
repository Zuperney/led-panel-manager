import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import { Edit2, Trash2, User, Calendar, Clock, Building2 } from "lucide-react";
import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  InfoGrid,
  InfoCell,
  Tag,
  DividerVertical,
} from "../ui/BaseComponents";

export default function ProjetoCard({
  projeto,
  originalIndex,
  index,
  editarProjeto,
  removerProjeto,
  formatarData,
  isAtrasado,
  projetoSelecionado,
  setProjetoSelecionado,
}) {
  // Calcular status do projeto usando useMemo para garantir atualização
  const { status, statusText, diasRestantes } = useMemo(() => {
    const hoje = new Date();
    const dataEntrega = projeto.dataEntrega
      ? new Date(projeto.dataEntrega)
      : null;
    const seteDiasAFrente = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Debug: log para verificar se as datas estão sendo calculadas corretamente
    // console.log('Projeto:', projeto.nome, 'Data Entrega:', projeto.dataEntrega, 'Data Hoje:', hoje.toISOString().split('T')[0]);

    let status = "no-prazo";
    let statusText = "No Prazo";

    if (dataEntrega) {
      // Normalizar as datas para comparação (apenas data, sem hora)
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

    // Calcular dias restantes
    const diasRestantes = dataEntrega
      ? Math.max(
          0,
          Math.ceil(
            (new Date(
              dataEntrega.getFullYear(),
              dataEntrega.getMonth(),
              dataEntrega.getDate()
            ) -
              new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

    return { status, statusText, diasRestantes };
  }, [
    projeto.dataEntrega,
    projeto.nome,
    projeto.cliente,
    projeto.descricao,
    projeto._updatedAt,
  ]); // Dependências que forçam recálculo

  // Memoizar a data formatada para garantir atualização
  const dataFormatada = useMemo(() => {
    return formatarData(projeto.dataEntrega);
  }, [
    projeto.dataEntrega,
    formatarData,
    projeto._updatedAt,
    projeto.descricao,
  ]);

  const isSelected = projetoSelecionado === originalIndex;

  return (
    <motion.div
      key={`projeto-${originalIndex}-${index}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className={`h-full p-1 transition-all duration-300 rounded-xl border-2 md:border-4 relative group ${
        isSelected
          ? "border-blue-400 bg-blue-500/10 shadow-xl shadow-blue-500/30 z-10"
          : "border-white/20 hover:border-blue-300/60 hover:shadow-lg hover:bg-white/5"
      }`}
    >
      {/* Glow effect para item selecionado */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl blur-lg -z-10"
        />
      )}

      <Card
        selected={false}
        onClick={() =>
          setProjetoSelecionado &&
          setProjetoSelecionado(isSelected ? null : originalIndex)
        }
        className="flex flex-col cursor-pointer m-2 h-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border-0"
      >
        {/* Header */}
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="font-bold text-lg text-white truncate mb-1 group-hover:text-blue-200 transition-colors duration-300"
              >
                {projeto.nome}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.25 }}
                className="flex items-center gap-2 text-gray-400 text-sm"
              >
                <User size={14} />
                <span>{projeto.cliente || "Cliente não informado"}</span>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex gap-1 ml-2"
            >
              <Button
                variant="ghost"
                size="sm"
                icon={Edit2}
                className="opacity-70 hover:opacity-100 hover:bg-green-500/20 hover:text-green-300 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  editarProjeto(originalIndex);
                }}
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
              />
            </motion.div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1">
          <InfoGrid>
            <InfoCell label="Data Entrega" value={dataFormatada} />
            <InfoCell
              label="Status"
              value={statusText}
              valueClass={`font-semibold mt-1 ${
                status === "atrasado"
                  ? "text-red-400"
                  : status === "urgente"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            />
            <InfoCell
              label="Descrição"
              value={projeto.descricao || "Sem descrição"}
            />
          </InfoGrid>

          {/* Descrição do Projeto */}
          {projeto.descricao && projeto.descricao.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="mt-4 p-3 bg-gray-800/40 rounded-lg border border-gray-700/30"
            >
              <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Descrição
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {projeto.descricao}
              </p>
            </motion.div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className="text-gray-400 text-xs">Criado em</span>
                <div className="font-bold text-blue-400 text-sm">
                  {projeto.dataCriacao
                    ? formatarData(projeto.dataCriacao)
                    : "Hoje"}
                </div>
              </div>
              <DividerVertical />
              <div className="text-center">
                <span className="text-gray-400 text-xs">Prazo</span>
                <div className="font-semibold text-sm text-gray-300">
                  {diasRestantes !== null
                    ? diasRestantes === 0
                      ? "Hoje"
                      : diasRestantes === 1
                      ? "1 dia"
                      : `${diasRestantes} dias`
                    : "Indefinido"}
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="flex flex-col gap-1"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.45 }}
              >
                <Tag
                  variant={
                    status === "atrasado"
                      ? "outdoor"
                      : status === "urgente"
                      ? "outdoor"
                      : "premium"
                  }
                >
                  {statusText}
                </Tag>
              </motion.div>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

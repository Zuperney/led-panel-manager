import { motion } from "framer-motion";
import { Monitor, Settings } from "lucide-react";
import PainelCard from "../../../components/PainelCard";

/**
 * � PainelList - Lista de Painéis do Projeto
 *
 * Responsabilidades:
 * - Renderizar lista de painéis filtrados por projeto
 * - Gerenciar seleção de painéis individuais
 * - Fornecer ações de CRUD inline (editar, duplicar, remover)
 * - Exibir estado vazio quando não há painéis
 * - Animações de entrada e saída
 */
export default function PainelList({
  paineisFiltrados,
  gabinetes,
  selectedPanelIndex,
  painelRecenteAdicionado,
  onSelect,
  onEdit,
  onDuplicate,
  onRemove,
}) {
  return (
    <motion.div
      className="lg:col-span-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="text-purple-400" />
          Painéis do Projeto
        </h3>

        {paineisFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Nenhum painel cadastrado</p>
            <p className="text-sm text-gray-500">
              Preencha o formulário ao lado para adicionar o primeiro painel.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {paineisFiltrados.map((painel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <PainelCard
                  painel={painel}
                  index={index}
                  gabinetes={gabinetes}
                  isSelected={selectedPanelIndex === index}
                  isRecenteAdicionado={painelRecenteAdicionado === painel.nome}
                  onSelect={(idx, pnl) => onSelect(idx, pnl)}
                  onEdit={(idx) => onEdit(idx)}
                  onDuplicate={(idx) => onDuplicate(idx)}
                  onRemove={(idx) => onRemove(idx)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

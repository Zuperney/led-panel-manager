import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ModernUI";
import { Settings, Plus, Monitor, Filter } from "lucide-react";
import GabineteCard from "./GabineteCard";
import GabineteListItem from "./GabineteListItem";

export default function GabinetesList({
  gabinetesFiltrados,
  gabinetes,
  viewMode,
  gabineteSelecionado,
  setGabineteSelecionado,
  duplicarGabinete,
  editarGabinete,
  removerGabinete,
  resetForm,
  setShowModal,
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Container Principal - Gabinetes Cadastrados */}
      <div className="glass-card">
        {/* Header da Seção */}
        <div className="border-b border-gray-700 p-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="text-purple-400" />
              Gabinetes Cadastrados
            </h2>
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              icon={Plus}
            >
              Novo Gabinete
            </Button>
          </div>
        </div>

        {/* Conteúdo da Lista */}
        <div className="p-6 pt-6">
          {gabinetesFiltrados.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              {gabinetes.length === 0 ? (
                <>
                  <p className="text-gray-400 mb-2">
                    Nenhum gabinete cadastrado
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Adicione o primeiro gabinete para começar.
                  </p>
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    icon={Plus}
                  >
                    Adicionar Primeiro Gabinete
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-gray-400 mb-2">
                    Nenhum gabinete encontrado
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Tente ajustar os filtros ou termos de busca.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterBy("todos");
                    }}
                    icon={Filter}
                  >
                    Limpar Filtros
                  </Button>
                </>
              )}
            </motion.div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              <AnimatePresence>
                {gabinetesFiltrados.map((gabinete, index) => {
                  // Encontrar o índice original do gabinete
                  const originalIndex = gabinetes.findIndex(
                    (g) =>
                      g.nome === gabinete.nome &&
                      g.largura === gabinete.largura &&
                      g.altura === gabinete.altura
                  );

                  return viewMode === "grid" ? (
                    <GabineteCard
                      key={`${gabinete.nome}-${index}`}
                      gabinete={gabinete}
                      originalIndex={originalIndex}
                      index={index}
                      gabineteSelecionado={gabineteSelecionado}
                      setGabineteSelecionado={setGabineteSelecionado}
                      duplicarGabinete={duplicarGabinete}
                      editarGabinete={editarGabinete}
                      removerGabinete={removerGabinete}
                    />
                  ) : (
                    <GabineteListItem
                      key={`${gabinete.nome}-${index}-list`}
                      gabinete={gabinete}
                      originalIndex={originalIndex}
                      index={index}
                      gabineteSelecionado={gabineteSelecionado}
                      setGabineteSelecionado={setGabineteSelecionado}
                      duplicarGabinete={duplicarGabinete}
                      editarGabinete={editarGabinete}
                      removerGabinete={removerGabinete}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

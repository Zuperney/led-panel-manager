import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ModernUI";
import { Settings, Plus, Monitor, Filter } from "lucide-react";
import {
  MainContainer,
  SectionHeader,
  SectionContent,
  EmptyState,
} from "../ui/BaseComponents";
import GabineteCardNew from "./GabineteCardNew";
import GabineteListItemNew from "./GabineteListItemNew";

export default function GabinetesListNew({
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
      <MainContainer>
        {/* Header da Seção */}
        <SectionHeader>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold flex items-center gap-2"
          >
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Settings className="text-purple-400" />
            </motion.div>
            Gabinetes Cadastrados
          </motion.h2>
        </SectionHeader>

        {/* Conteúdo da Lista */}
        <SectionContent>
          {gabinetesFiltrados.length === 0 ? (
            <EmptyState
              icon={Monitor}
              title={
                gabinetes.length === 0
                  ? "Nenhum gabinete cadastrado"
                  : "Nenhum gabinete encontrado"
              }
              description={
                gabinetes.length === 0
                  ? "Adicione o primeiro gabinete para começar."
                  : "Tente ajustar os filtros ou termos de busca."
              }
              action={
                gabinetes.length === 0 ? (
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    icon={Plus}
                  >
                    Adicionar Primeiro Gabinete
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterBy("todos");
                    }}
                    icon={Filter}
                  >
                    Limpar Filtros
                  </Button>
                )
              }
            />
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              <AnimatePresence mode="popLayout">
                {gabinetesFiltrados.map((gabinete, index) => {
                  // Encontrar o índice original do gabinete
                  const originalIndex = gabinetes.findIndex(
                    (g) =>
                      g.nome === gabinete.nome &&
                      g.largura === gabinete.largura &&
                      g.altura === gabinete.altura
                  );

                  return viewMode === "grid" ? (
                    <motion.div
                      key={`${gabinete.nome}-${index}`}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      layout
                    >
                      <GabineteCardNew
                        gabinete={gabinete}
                        originalIndex={originalIndex}
                        index={index}
                        gabineteSelecionado={gabineteSelecionado}
                        setGabineteSelecionado={setGabineteSelecionado}
                        duplicarGabinete={duplicarGabinete}
                        editarGabinete={editarGabinete}
                        removerGabinete={removerGabinete}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${gabinete.nome}-${index}-list`}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      layout
                    >
                      <GabineteListItemNew
                        gabinete={gabinete}
                        originalIndex={originalIndex}
                        index={index}
                        gabineteSelecionado={gabineteSelecionado}
                        setGabineteSelecionado={setGabineteSelecionado}
                        duplicarGabinete={duplicarGabinete}
                        editarGabinete={editarGabinete}
                        removerGabinete={removerGabinete}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </SectionContent>
      </MainContainer>
    </motion.div>
  );
}

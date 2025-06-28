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
                    <GabineteCardNew
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
                    <GabineteListItemNew
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
        </SectionContent>
      </MainContainer>
    </motion.div>
  );
}

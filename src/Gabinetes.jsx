import { useState } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./components/ModernUI";
import { useApiData, useTemporaryFeedback } from "./hooks";
import { useGabineteFiltering } from "./hooks/useGabineteFiltering";
import { useGabineteForm } from "./hooks/useGabineteForm";
import { Monitor } from "lucide-react";

// Componentes modulares
import GabinetesToolbar from "./components/gabinetes/GabinetesToolbar";
import GabinetesListNew from "./components/gabinetes/GabinetesListNew";
import GabinetesDetalhesNew from "./components/gabinetes/GabinetesDetalhesNew";
import GabinetesModal from "./components/gabinetes/GabinetesModal";
import DeleteConfirmModal from "./components/gabinetes/DeleteConfirmModal";

export default function Gabinetes({ isActive }) {
  const {
    data: gabinetes,
    setData: setGabinetes,
    loading,
    error,
    updateData: salvarGabinetes,
  } = useApiData("gabinetes", isActive);

  const { mensagemFeedback, showFeedback } = useTemporaryFeedback();

  // Estados locais
  const [showModal, setShowModal] = useState(false);
  const [gabineteSelecionado, setGabineteSelecionado] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' ou 'list'
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nome"); // 'nome', 'potencia', 'peso', 'pixelPitch'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' ou 'desc'
  const [filterBy, setFilterBy] = useState("todos"); // 'todos', 'alta_potencia', 'baixo_pixel_pitch'

  // Estados para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gabineteParaDeletar, setGabineteParaDeletar] = useState(null);
  const [deletandoGabinete, setDeletandoGabinete] = useState(false);

  // Hooks customizados
  const gabinetesFiltrados = useGabineteFiltering(
    gabinetes,
    searchTerm,
    filterBy,
    sortBy,
    sortOrder
  );
  const {
    editando,
    form,
    resetForm,
    handleChange,
    handleSubmit,
    editarGabinete,
  } = useGabineteForm(gabinetes, setGabinetes, salvarGabinetes, showFeedback);

  // Duplicar gabinete
  const duplicarGabinete = async (index) => {
    try {
      const gabineteOriginal = gabinetes[index];
      const novoGabinete = {
        ...gabineteOriginal,
        nome: `${gabineteOriginal.nome} (Cópia)`,
      };

      const novosGabinetes = [...gabinetes, novoGabinete];
      setGabinetes(novosGabinetes);
      await salvarGabinetes(novosGabinetes);
      showFeedback(
        `Gabinete "${novoGabinete.nome}" duplicado com sucesso!`,
        "success"
      );
    } catch (error) {
      console.error("Erro ao duplicar gabinete:", error);
      showFeedback("Erro ao duplicar gabinete. Tente novamente.", "error");
    }
  };

  // Remover gabinete - abre modal de confirmação
  const removerGabinete = (index) => {
    setGabineteParaDeletar(index);
    setShowDeleteModal(true);
  };

  // Confirmar exclusão do gabinete
  const confirmarExclusao = async () => {
    if (gabineteParaDeletar === null) return;

    setDeletandoGabinete(true);
    try {
      const index = gabineteParaDeletar;
      const novosGabinetes = gabinetes.filter((_, i) => i !== index);
      setGabinetes(novosGabinetes);
      await salvarGabinetes(novosGabinetes);
      showFeedback("Gabinete removido com sucesso!", "success");

      // Se o gabinete removido estava selecionado, desselecionar
      if (gabineteSelecionado === index) {
        setGabineteSelecionado(null);
      } else if (gabineteSelecionado > index) {
        // Ajustar índice se necessário
        setGabineteSelecionado(gabineteSelecionado - 1);
      }
    } catch (error) {
      console.error("Erro ao remover gabinete:", error);
      showFeedback("Erro ao remover gabinete. Tente novamente.", "error");
    } finally {
      setDeletandoGabinete(false);
      setShowDeleteModal(false);
      setGabineteParaDeletar(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Monitor className="text-blue-400" />
            Gabinetes LED
          </h1>
          <p className="text-gray-400">
            Gerencie as especificações dos gabinetes LED
          </p>
        </motion.div>

        {/* Toolbar de Filtros e Busca */}
        <GabinetesToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          resetForm={resetForm}
          setShowModal={setShowModal}
          gabinetesFiltrados={gabinetesFiltrados}
          gabinetes={gabinetes}
        />

        {/* Mensagem de feedback */}
        {mensagemFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg ${
              mensagemFeedback.includes("Erro") ||
              mensagemFeedback.includes("erro")
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-green-500/20 text-green-400 border border-green-500/30"
            }`}
          >
            {mensagemFeedback}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg"
          >
            Erro ao carregar gabinetes: {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          {/* Coluna 1: Gabinetes Cadastrados (2/3 = 8 colunas) */}
          <div className="lg:col-span-8">
            <GabinetesListNew
              gabinetesFiltrados={gabinetesFiltrados}
              gabinetes={gabinetes}
              viewMode={viewMode}
              gabineteSelecionado={gabineteSelecionado}
              setGabineteSelecionado={setGabineteSelecionado}
              duplicarGabinete={duplicarGabinete}
              editarGabinete={(index) => {
                editarGabinete(index);
                setShowModal(true);
              }}
              removerGabinete={removerGabinete}
              resetForm={resetForm}
              setShowModal={setShowModal}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
            />
          </div>

          {/* Coluna 2: Detalhes do Gabinete (1/3 = 4 colunas) */}
          <div className="lg:col-span-4">
            <GabinetesDetalhesNew
              gabineteSelecionado={gabineteSelecionado}
              gabinetes={gabinetes}
              editarGabinete={(index) => {
                editarGabinete(index);
                setShowModal(true);
              }}
            />
          </div>
        </div>

        {/* Modal de Formulário */}
        <GabinetesModal
          showModal={showModal}
          setShowModal={setShowModal}
          editando={editando}
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />

        {/* Modal de Confirmação de Exclusão */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setGabineteParaDeletar(null);
          }}
          onConfirm={confirmarExclusao}
          gabineteNome={
            gabineteParaDeletar !== null
              ? gabinetes[gabineteParaDeletar]?.nome || "Gabinete"
              : ""
          }
          loading={deletandoGabinete}
        />
      </div>
    </motion.div>
  );
}

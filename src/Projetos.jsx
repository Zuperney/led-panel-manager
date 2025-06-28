import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  User,
  Calendar,
  Clock,
  Building2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useProjeto } from "./contextProjeto";
import { useApiData } from "./hooks";
import { useProjetoFiltering } from "./hooks/useProjetoFiltering";
import {
  InputField,
  TextAreaField,
  Button,
  StatusCard,
} from "./components/ModernUI";
import { toast } from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  InfoGrid,
  InfoCell,
  Tag,
  DividerVertical,
  MainContainer,
  SectionHeader,
  SectionContent,
  EmptyState,
} from "./components/ui/BaseComponents";
import ProjetosToolbar from "./components/projetos/ProjetosToolbar";
import ProjetoCard from "./components/projetos/ProjetoCard";
import ProjetoListItem from "./components/projetos/ProjetoListItem";

export default function Projetos({ isActive }) {
  const { state, dispatch } = useProjeto();
  const { updateData: salvarProjetos } = useApiData("projetos", isActive);
  const [form, setForm] = useState({
    nome: "",
    cliente: "",
    dataEntrega: "",
    descricao: "",
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
  const [projetoParaDeletar, setProjetoParaDeletar] = useState(null);
  const [carregandoDelete, setCarregandoDelete] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Estados para busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("todos");
  const [sortBy, setSortBy] = useState("nome");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);

  // Hook para filtragem
  const projetosFiltrados = useProjetoFiltering(
    state.projetos,
    searchTerm,
    filterBy,
    sortBy,
    sortOrder
  );

  // Carregar projetos do backend ao iniciar e quando a aba se torna ativa
  useEffect(() => {
    if (isActive) {
      fetch("/api/projetos")
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "CARREGAR_PROJETOS", payload: data });

          // Verificar se há um projeto para edição vindo do Relatório
          const projetoParaEdicao = localStorage.getItem("projetoParaEdicao");
          if (projetoParaEdicao) {
            try {
              const projeto = JSON.parse(projetoParaEdicao);
              const index = data.findIndex((p) => p.nome === projeto.nome);
              if (index !== -1) {
                setForm(data[index]);
                dispatch({ type: "SET_EDITANDO", payload: index });
                setModalAberto(true);
              }
              localStorage.removeItem("projetoParaEdicao");
            } catch (error) {
              console.error("Erro ao carregar projeto para edição:", error);
            }
          }
        })
        .catch((error) => console.error("Erro ao carregar projetos:", error));
    }
  }, [dispatch, isActive]);

  // Função otimizada para salvar projetos
  const salvarProjetosBackend = async (novosProjetos, operacao = null) => {
    setCarregando(true);
    try {
      await salvarProjetos(novosProjetos);

      // Só mostra toast se não for uma operação de delete (que tem seu próprio toast)
      if (operacao !== "delete") {
        toast.success(
          state.projetoEditando !== null
            ? "Projeto atualizado!"
            : "Projeto criado!"
        );
      }
    } catch (error) {
      toast.error("Erro ao salvar projeto");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    let novos;
    if (state.projetoEditando !== null) {
      // Adicionar timestamp de atualização para forçar re-renderização
      const projetoAtualizado = {
        ...form,
        _updatedAt: Date.now(),
      };
      novos = state.projetos.map((p, i) =>
        i === state.projetoEditando ? projetoAtualizado : p
      );
      dispatch({
        type: "ATUALIZAR_PROJETO",
        payload: { index: state.projetoEditando, projeto: projetoAtualizado },
      });
      dispatch({ type: "SET_EDITANDO", payload: null });
    } else {
      const novoProjeto = {
        ...form,
        _createdAt: Date.now(),
        _updatedAt: Date.now(),
      };
      novos = [...state.projetos, novoProjeto];
      dispatch({ type: "ADICIONAR_PROJETO", payload: novoProjeto });
    }
    salvarProjetosBackend(novos);
    resetForm();
    setModalAberto(false);
  }

  function resetForm() {
    setForm({ nome: "", cliente: "", dataEntrega: "", descricao: "" });
    dispatch({ type: "SET_EDITANDO", payload: null });
  }

  function editarProjeto(index) {
    setForm(state.projetos[index]);
    dispatch({ type: "SET_EDITANDO", payload: index });
    setModalAberto(true);
  }

  function removerProjeto(index) {
    setProjetoParaDeletar({ index, projeto: state.projetos[index] });
    setModalDeleteAberto(true);
  }

  async function confirmarDelete() {
    if (projetoParaDeletar !== null) {
      setCarregandoDelete(true);
      try {
        const novos = state.projetos.filter(
          (_, i) => i !== projetoParaDeletar.index
        );
        dispatch({
          type: "REMOVER_PROJETO",
          payload: projetoParaDeletar.index,
        });
        await salvarProjetosBackend(novos, "delete");
        toast.success(
          `Projeto "${projetoParaDeletar.projeto.nome}" excluído com sucesso!`
        );
        setModalDeleteAberto(false);
        setProjetoParaDeletar(null);
      } catch (error) {
        toast.error("Erro ao excluir projeto");
        console.error("Erro ao excluir projeto:", error);
      } finally {
        setCarregandoDelete(false);
      }
    }
  }

  function cancelarDelete() {
    setModalDeleteAberto(false);
    setProjetoParaDeletar(null);
  }

  function abrirModal() {
    resetForm();
    setModalAberto(true);
  }

  // Calcular estatísticas
  const hoje = new Date();
  const stats = {
    total: state.projetos.length,
    pendentes: state.projetos.filter((p) => {
      if (!p.dataEntrega) return true;
      const dataEntrega = new Date(p.dataEntrega);
      return dataEntrega >= hoje;
    }).length,
    atrasados: state.projetos.filter((p) => {
      if (!p.dataEntrega) return false;
      const dataEntrega = new Date(p.dataEntrega);
      return dataEntrega < hoje;
    }).length,
  };

  // Formatar data para exibição
  const formatarData = useCallback((data) => {
    if (!data) return "Não definida";
    return new Date(data).toLocaleDateString("pt-BR");
  }, []);

  // Verificar se projeto está atrasado
  const isAtrasado = (dataEntrega) => {
    if (!dataEntrega) return false;
    return new Date(dataEntrega) < hoje;
  };

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
            <FolderOpen className="text-green-400" />
            Projetos
          </h1>
          <p className="text-gray-400">Gerencie seus projetos de painéis LED</p>
        </motion.div>

        {/* Toolbar de Filtros e Busca */}
        <ProjetosToolbar
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
          abrirModal={abrirModal}
          projetosFiltrados={projetosFiltrados}
          projetos={state.projetos}
        />

        {/* Lista de projetos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MainContainer>
            {/* Header da Seção */}
            <SectionHeader>
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl font-semibold flex items-center gap-2"
              >
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <FolderOpen className="text-blue-400" />
                </motion.div>
                Todos os Projetos
              </motion.h3>
            </SectionHeader>

            {/* Conteúdo da Lista */}
            <SectionContent>
              {projetosFiltrados.length === 0 ? (
                <EmptyState
                  icon={FolderOpen}
                  title={
                    state.projetos.length === 0
                      ? "Nenhum projeto cadastrado"
                      : "Nenhum projeto encontrado"
                  }
                  description={
                    state.projetos.length === 0
                      ? "Adicione o primeiro projeto para começar."
                      : "Tente ajustar os filtros ou termos de busca."
                  }
                  action={
                    state.projetos.length === 0 ? (
                      <Button onClick={abrirModal} icon={Plus}>
                        Criar Primeiro Projeto
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterBy("todos");
                        }}
                        icon={FolderOpen}
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
                      : "space-y-3"
                  }
                >
                  {/* Cabeçalho do modo lista */}
                  {viewMode === "list" && projetosFiltrados.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-2"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-center text-sm font-medium text-gray-400">
                        <div className="lg:col-span-1">Projeto</div>
                        <div className="hidden lg:block">Cliente</div>
                        <div>Data de Entrega</div>
                        <div>Status</div>
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence mode="popLayout">
                    {projetosFiltrados.map((projeto, index) => {
                      const originalIndex = state.projetos.findIndex(
                        (p) => p === projeto
                      );
                      return (
                        <motion.div
                          key={`projeto-${originalIndex}-${
                            projeto.dataEntrega
                          }-${projeto.nome}-${
                            projeto.cliente
                          }-${projeto.descricao?.slice(0, 20)}-${
                            projeto._updatedAt || 0
                          }`}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          layout
                        >
                          {viewMode === "grid" ? (
                            <ProjetoCard
                              projeto={projeto}
                              originalIndex={originalIndex}
                              index={index}
                              editarProjeto={editarProjeto}
                              removerProjeto={removerProjeto}
                              formatarData={formatarData}
                              isAtrasado={isAtrasado}
                              projetoSelecionado={projetoSelecionado}
                              setProjetoSelecionado={setProjetoSelecionado}
                            />
                          ) : (
                            <ProjetoListItem
                              projeto={projeto}
                              originalIndex={originalIndex}
                              index={index}
                              editarProjeto={editarProjeto}
                              removerProjeto={removerProjeto}
                              formatarData={formatarData}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </SectionContent>
          </MainContainer>
        </motion.div>

        {/* Modal de formulário */}
        <AnimatePresence>
          {modalAberto && (
            <>
              {/* Backdrop com glassmorphism */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                onClick={() => {
                  setModalAberto(false);
                  resetForm();
                }}
              />

              {/* Modal Container */}
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    scale: { type: "spring", stiffness: 300, damping: 25 },
                  }}
                  className="bg-gray-900 border-2 border-gray-600/80 
                           rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden
                           ring-1 ring-white/10"
                  style={{ backgroundColor: "#111827", maxWidth: "470px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50
                             bg-gradient-to-r from-blue-600/20 to-purple-600/20"
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 
                                  bg-blue-500/20 rounded-lg ring-1 ring-blue-400/30"
                    >
                      <FolderOpen className="w-4 h-4 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      {state.projetoEditando !== null
                        ? "Editar Projeto"
                        : "Novo Projeto"}
                    </h2>
                  </motion.div>

                  {/* Body */}
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Seção: Informações Básicas */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <div className="space-y-4">
                          <InputField
                            label="Nome do Projeto"
                            name="nome"
                            value={form.nome}
                            onChange={(e) =>
                              setForm({ ...form, nome: e.target.value })
                            }
                            placeholder="Ex: Painel LED Shopping Center"
                            icon={FolderOpen}
                            required
                          />

                          <InputField
                            label="Cliente"
                            name="cliente"
                            value={form.cliente}
                            onChange={(e) =>
                              setForm({ ...form, cliente: e.target.value })
                            }
                            placeholder="Ex: Empresa ABC Ltda"
                            icon={User}
                          />

                          <InputField
                            label="Data de Entrega"
                            name="dataEntrega"
                            type="date"
                            value={form.dataEntrega}
                            onChange={(e) =>
                              setForm({ ...form, dataEntrega: e.target.value })
                            }
                            icon={Calendar}
                          />

                          <TextAreaField
                            label="Descrição do Projeto"
                            name="descricao"
                            value={form.descricao}
                            onChange={(e) =>
                              setForm({ ...form, descricao: e.target.value })
                            }
                            placeholder="Descreva os detalhes do projeto, especificações técnicas, requisitos especiais..."
                            icon={FileText}
                            rows={4}
                          />
                        </div>
                      </motion.div>
                    </form>
                  </div>

                  {/* Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 px-6 py-4 
                             border-t border-gray-700/50 bg-gray-800/30"
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setModalAberto(false);
                        resetForm();
                      }}
                      icon={X}
                      className="flex-1 order-2 sm:order-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      loading={carregando}
                      icon={Save}
                      className="flex-1 order-1 sm:order-2"
                    >
                      {state.projetoEditando !== null ? "Atualizar" : "Salvar"}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Modal de confirmação de delete */}
        <AnimatePresence>
          {modalDeleteAberto && projetoParaDeletar && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                onClick={cancelarDelete}
              />

              {/* Modal Container */}
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    scale: { type: "spring", stiffness: 300, damping: 25 },
                  }}
                  className="bg-gray-900 border-2 border-red-600/80 
                           rounded-2xl shadow-2xl w-full max-w-md
                           ring-1 ring-red-400/20"
                  style={{ backgroundColor: "#111827" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="flex items-center gap-3 px-6 py-4 border-b border-red-700/50
                             bg-gradient-to-r from-red-600/20 to-red-800/20"
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 
                                  bg-red-500/20 rounded-lg ring-1 ring-red-400/30"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      Confirmar Exclusão
                    </h2>
                  </motion.div>

                  {/* Body */}
                  <div className="p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="text-center"
                    >
                      <p className="text-gray-300 mb-4">
                        Tem certeza de que deseja excluir o projeto?
                      </p>
                      <div className="bg-gray-800/60 border border-gray-600/60 rounded-xl p-4 mb-4">
                        <h3 className="font-semibold text-white text-lg mb-2">
                          {projetoParaDeletar.projeto.nome}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Cliente:{" "}
                          {projetoParaDeletar.projeto.cliente ||
                            "Não informado"}
                        </p>
                        {projetoParaDeletar.projeto.dataEntrega && (
                          <p className="text-gray-400 text-sm">
                            Entrega:{" "}
                            {formatarData(
                              projetoParaDeletar.projeto.dataEntrega
                            )}
                          </p>
                        )}
                      </div>
                      <p className="text-red-400 text-sm font-medium">
                        Esta ação não pode ser desfeita.
                      </p>
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 px-6 py-4 
                             border-t border-red-700/50 bg-gray-800/30"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={cancelarDelete}
                      icon={X}
                      className="flex-1 order-2 sm:order-1 hover:bg-gray-600/50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={confirmarDelete}
                      loading={carregandoDelete}
                      icon={Trash2}
                      className="flex-1 order-1 sm:order-2 bg-red-600 hover:bg-red-700 
                               text-white border-red-600 hover:border-red-700"
                    >
                      Excluir Projeto
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

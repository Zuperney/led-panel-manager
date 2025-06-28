import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useProjeto } from "./contextProjeto";
import { useApiData } from "./hooks";
import { InputField, Button, StatusCard, Modal } from "./components/ModernUI";
import { toast } from "react-hot-toast";

export default function Projetos({ isActive }) {
  const { state, dispatch } = useProjeto();
  const { updateData: salvarProjetos } = useApiData("projetos", isActive);
  const [form, setForm] = useState({ nome: "", cliente: "", dataEntrega: "" });
  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);

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
  const salvarProjetosBackend = async (novosProjetos) => {
    setCarregando(true);
    try {
      await salvarProjetos(novosProjetos);
      toast.success(
        state.projetoEditando !== null
          ? "Projeto atualizado!"
          : "Projeto criado!"
      );
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
      novos = state.projetos.map((p, i) =>
        i === state.projetoEditando ? form : p
      );
      dispatch({
        type: "ATUALIZAR_PROJETO",
        payload: { index: state.projetoEditando, projeto: form },
      });
      dispatch({ type: "SET_EDITANDO", payload: null });
    } else {
      novos = [...state.projetos, form];
      dispatch({ type: "ADICIONAR_PROJETO", payload: form });
    }
    salvarProjetosBackend(novos);
    resetForm();
    setModalAberto(false);
  }

  function resetForm() {
    setForm({ nome: "", cliente: "", dataEntrega: "" });
    dispatch({ type: "SET_EDITANDO", payload: null });
  }

  function editarProjeto(index) {
    setForm(state.projetos[index]);
    dispatch({ type: "SET_EDITANDO", payload: index });
    setModalAberto(true);
  }

  function removerProjeto(index) {
    if (window.confirm("Remover este projeto?")) {
      const novos = state.projetos.filter((_, i) => i !== index);
      dispatch({ type: "REMOVER_PROJETO", payload: index });
      salvarProjetosBackend(novos);
    }
  }

  function selecionarProjeto(index) {
    dispatch({ type: "SELECIONAR_PROJETO", payload: index });
    toast.success(`Projeto "${state.projetos[index].nome}" selecionado!`);
  }

  function abrirModal() {
    resetForm();
    setModalAberto(true);
  }

  // Calcular estatísticas
  const hoje = new Date();
  const stats = {
    total: state.projetos.length,
    ativo: state.projetoSelecionado !== null ? 1 : 0,
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
  const formatarData = (data) => {
    if (!data) return "Não definida";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  // Verificar se projeto está atrasado
  const isAtrasado = (dataEntrega) => {
    if (!dataEntrega) return false;
    return new Date(dataEntrega) < hoje;
  };

  return (
    <div className="space-y-6">
      {/* Header com título e botão */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="text-green-400" />
            Projetos
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie seus projetos de painéis LED
          </p>
        </div>

        <Button
          onClick={abrirModal}
          icon={Plus}
          className="self-start sm:self-auto"
        >
          Novo Projeto
        </Button>
      </motion.div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Total"
          value={stats.total}
          icon={FolderOpen}
          color="blue"
          delay={0.1}
        />
        <StatusCard
          title="Projeto Ativo"
          value={stats.ativo}
          icon={Building2}
          color="green"
          delay={0.2}
        />
        <StatusCard
          title="Pendentes"
          value={stats.pendentes}
          icon={Clock}
          color="orange"
          delay={0.3}
        />
        <StatusCard
          title="Atrasados"
          value={stats.atrasados}
          icon={Calendar}
          color="red"
          delay={0.4}
        />
      </div>

      {/* Projeto ativo */}
      {state.projetoSelecionado !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card border-l-4 border-green-500"
        >
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-white">
                Projeto Ativo
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Nome</p>
                <p className="text-white font-medium">
                  {state.projetos[state.projetoSelecionado]?.nome}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Cliente</p>
                <p className="text-white font-medium">
                  {state.projetos[state.projetoSelecionado]?.cliente}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Data de Entrega</p>
                <p className="text-white font-medium">
                  {formatarData(
                    state.projetos[state.projetoSelecionado]?.dataEntrega
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de projetos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Todos os Projetos
          </h3>

          {state.projetos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <FolderOpen size={48} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Nenhum projeto cadastrado ainda
              </p>
              <Button onClick={abrirModal} icon={Plus} variant="secondary">
                Criar Primeiro Projeto
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence>
                {state.projetos.map((projeto, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card p-4 hover:bg-white/15 transition-all duration-200 ${
                      state.projetoSelecionado === index
                        ? "border-l-4 border-green-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-lg">
                            {projeto.nome}
                          </h4>
                          {state.projetoSelecionado === index && (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                              Ativo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                          <User size={14} />
                          <span>
                            {projeto.cliente || "Cliente não informado"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit2}
                          onClick={() => editarProjeto(index)}
                          className="p-2"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => removerProjeto(index)}
                          className="p-2 text-red-400 hover:text-red-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <span
                          className={`${
                            isAtrasado(projeto.dataEntrega)
                              ? "text-red-400"
                              : "text-gray-300"
                          }`}
                        >
                          {formatarData(projeto.dataEntrega)}
                          {isAtrasado(projeto.dataEntrega) && (
                            <span className="ml-1 text-red-400">
                              • Atrasado
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <Button
                        onClick={() => selecionarProjeto(index)}
                        variant={
                          state.projetoSelecionado === index
                            ? "secondary"
                            : "primary"
                        }
                        size="sm"
                        className="w-full"
                      >
                        {state.projetoSelecionado === index
                          ? "Projeto Ativo"
                          : "Selecionar Projeto"}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de formulário */}
      <Modal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          resetForm();
        }}
        title={
          state.projetoEditando !== null ? "Editar Projeto" : "Novo Projeto"
        }
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Nome do Projeto"
            name="nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Ex: Painel LED Shopping Center"
            icon={FolderOpen}
            required
          />

          <InputField
            label="Cliente"
            name="cliente"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
            placeholder="Ex: Empresa ABC Ltda"
            icon={User}
          />

          <InputField
            label="Data de Entrega"
            name="dataEntrega"
            type="date"
            value={form.dataEntrega}
            onChange={(e) => setForm({ ...form, dataEntrega: e.target.value })}
            icon={Calendar}
          />

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setModalAberto(false);
                resetForm();
              }}
              icon={X}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={carregando}
              icon={Save}
              className="flex-1"
            >
              {state.projetoEditando !== null ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

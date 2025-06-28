import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Users
} from "lucide-react";
import { useApiData } from "./hooks";
import { InputField, SelectField, Button, StatusCard, Modal } from "./components/ModernUI";
import { toast } from "react-hot-toast";

export default function Agenda({ isActive }) {
  const {
    data: eventos,
    setData: setEventos,
    updateData: salvarEventos,
  } = useApiData("agenda", isActive);
  
  const [form, setForm] = useState({
    titulo: "",
    data: "",
    hora: "",
    local: "",
    descricao: "",
    tipo: "reuniao",
    status: "pendente"
  });
  
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isActive) {
      setErro("");
      // Busca eventos do backend
      fetch("/api/eventos")
        .then((res) => {
          if (!res.ok) throw new Error("API de eventos indisponível");
          return res.json();
        })
        .then((data) => setEventos(data))
        .catch(() =>
          setErro(
            "Não foi possível carregar os eventos. Verifique se o backend está rodando e tente novamente."
          )
        );
    }
  }, [isActive, setEventos]);

  // Função para salvar eventos
  const salvarEventosBackend = async (novosEventos) => {
    setCarregando(true);
    try {
      await salvarEventos(novosEventos);
      toast.success(editando !== null ? "Evento atualizado!" : "Evento criado!");
    } catch (error) {
      toast.error("Erro ao salvar evento");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    let novos;
    if (editando !== null) {
      novos = [...eventos];
      novos[editando] = form;
      setEventos(novos);
      setEditando(null);
    } else {
      novos = [...eventos, form];
      setEventos(novos);
    }
    salvarEventosBackend(novos);
    resetForm();
    setModalAberto(false);
  }

  function resetForm() {
    setForm({
      titulo: "",
      data: "",
      hora: "",
      local: "",
      descricao: "",
      tipo: "reuniao",
      status: "pendente"
    });
    setEditando(null);
  }

  function editarEvento(index) {
    setForm(eventos[index]);
    setEditando(index);
    setModalAberto(true);
  }

  function removerEvento(index) {
    if (window.confirm("Remover este evento?")) {
      const novos = eventos.filter((_, i) => i !== index);
      setEventos(novos);
      salvarEventosBackend(novos);
    }
  }

  function alterarStatus(index, novoStatus) {
    const novos = [...eventos];
    novos[index].status = novoStatus;
    setEventos(novos);
    salvarEventosBackend(novos);
    toast.success(`Status alterado para ${novoStatus}!`);
  }

  function abrirModal() {
    resetForm();
    setModalAberto(true);
  }

  // Opções para selects
  const tiposOptions = [
    { value: "reuniao", label: "Reunião" },
    { value: "instalacao", label: "Instalação" },
    { value: "manutencao", label: "Manutenção" },
    { value: "apresentacao", label: "Apresentação" },
    { value: "treinamento", label: "Treinamento" },
  ];

  const statusOptions = [
    { value: "pendente", label: "Pendente" },
    { value: "confirmado", label: "Confirmado" },
    { value: "concluido", label: "Concluído" },
    { value: "cancelado", label: "Cancelado" },
  ];

  // Calcular estatísticas
  const hoje = new Date();
  const stats = {
    total: eventos.length,
    pendentes: eventos.filter(e => e.status === "pendente").length,
    confirmados: eventos.filter(e => e.status === "confirmado").length,
    hoje: eventos.filter(e => {
      if (!e.data) return false;
      const eventData = new Date(e.data);
      return eventData.toDateString() === hoje.toDateString();
    }).length,
  };

  // Formatar data e hora
  const formatarDataHora = (data, hora) => {
    if (!data) return "Data não definida";
    const dataFormatada = new Date(data).toLocaleDateString("pt-BR");
    return hora ? `${dataFormatada} às ${hora}` : dataFormatada;
  };

  // Verificar se evento é hoje
  const isHoje = (data) => {
    if (!data) return false;
    const eventData = new Date(data);
    return eventData.toDateString() === hoje.toDateString();
  };

  // Verificar se evento passou
  const isPassado = (data, hora) => {
    if (!data) return false;
    const eventDateTime = new Date(`${data}T${hora || "00:00"}`);
    return eventDateTime < hoje;
  };

  // Cores por status
  const statusColors = {
    pendente: "orange",
    confirmado: "blue",
    concluido: "green",
    cancelado: "red",
  };

  // Ícones por tipo
  const tipoIcons = {
    reuniao: Users,
    instalacao: Calendar,
    manutencao: AlertCircle,
    apresentacao: Calendar,
    treinamento: Users,
  };

  if (erro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 text-center"
      >
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Erro ao carregar agenda
        </h3>
        <p className="text-gray-400">{erro}</p>
      </motion.div>
    );
  }

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
            <Calendar className="text-red-400" />
            Agenda
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie seus compromissos e eventos
          </p>
        </div>

        <Button
          onClick={abrirModal}
          icon={Plus}
          className="self-start sm:self-auto"
        >
          Novo Evento
        </Button>
      </motion.div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Total"
          value={stats.total}
          icon={Calendar}
          color="blue"
          delay={0.1}
        />
        <StatusCard
          title="Hoje"
          value={stats.hoje}
          icon={Clock}
          color="green"
          delay={0.2}
        />
        <StatusCard
          title="Pendentes"
          value={stats.pendentes}
          icon={AlertCircle}
          color="orange"
          delay={0.3}
        />
        <StatusCard
          title="Confirmados"
          value={stats.confirmados}
          icon={CheckCircle}
          color="purple"
          delay={0.4}
        />
      </div>

      {/* Lista de eventos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Próximos Eventos
          </h3>

          {eventos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <Calendar size={48} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Nenhum evento agendado ainda
              </p>
              <Button onClick={abrirModal} icon={Plus} variant="secondary">
                Agendar Primeiro Evento
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {eventos
                  .sort((a, b) => new Date(a.data) - new Date(b.data))
                  .map((evento, index) => {
                    const TipoIcon = tipoIcons[evento.tipo] || Calendar;
                    const statusColor = statusColors[evento.status] || "gray";
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card p-4 hover:bg-white/15 transition-all duration-200 ${
                          isHoje(evento.data) ? 'border-l-4 border-green-500' : ''
                        } ${
                          isPassado(evento.data, evento.hora) && evento.status !== "concluido" ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <TipoIcon size={18} className="text-blue-400" />
                              <h4 className="font-semibold text-white text-lg">
                                {evento.titulo}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded-full bg-${statusColor}-500/20 text-${statusColor}-400 capitalize`}>
                                {evento.status}
                              </span>
                              {isHoje(evento.data) && (
                                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                                  Hoje
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-2">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Clock size={14} />
                                <span>{formatarDataHora(evento.data, evento.hora)}</span>
                              </div>
                              {evento.local && (
                                <div className="flex items-center gap-2 text-gray-300">
                                  <MapPin size={14} />
                                  <span>{evento.local}</span>
                                </div>
                              )}
                            </div>

                            {evento.descricao && (
                              <p className="text-gray-400 text-sm">
                                {evento.descricao}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-1 ml-4">
                            {evento.status === "pendente" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={CheckCircle}
                                onClick={() => alterarStatus(index, "confirmado")}
                                className="p-2 text-green-400 hover:text-green-300"
                                title="Confirmar"
                              />
                            )}
                            {evento.status === "confirmado" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={CheckCircle}
                                onClick={() => alterarStatus(index, "concluido")}
                                className="p-2 text-blue-400 hover:text-blue-300"
                                title="Marcar como concluído"
                              />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit2}
                              onClick={() => editarEvento(index)}
                              className="p-2"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Trash2}
                              onClick={() => removerEvento(index)}
                              className="p-2 text-red-400 hover:text-red-300"
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
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
        title={editando !== null ? "Editar Evento" : "Novo Evento"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Título do Evento"
            name="titulo"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Ex: Reunião com cliente"
            icon={Calendar}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Tipo"
              name="tipo"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              options={tiposOptions}
              icon={Users}
              required
            />

            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={statusOptions}
              icon={CheckCircle}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Data"
              name="data"
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              icon={Calendar}
              required
            />

            <InputField
              label="Horário"
              name="hora"
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              icon={Clock}
            />
          </div>

          <InputField
            label="Local"
            name="local"
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
            placeholder="Ex: Escritório, cliente, etc."
            icon={MapPin}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Descrição
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Detalhes adicionais sobre o evento..."
              className="input-field min-h-[100px] resize-none"
              rows={4}
            />
          </div>

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
              {editando !== null ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

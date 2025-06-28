import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  InputField,
  SelectField,
  Button,
  StatusCard,
  Modal,
  LoadingSpinner,
} from "./components/ModernUI";
import { useApiData, useTemporaryFeedback } from "./hooks";
import {
  Monitor,
  Plus,
  Edit3,
  Trash2,
  Save,
  Settings,
  Zap,
  Ruler,
  Weight,
  Eye,
  MoreVertical,
} from "lucide-react";

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
  const [editando, setEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [gabineteSelecionado, setGabineteSelecionado] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    largura: "",
    altura: "",
    pixelPitch: "",
    potencia: "",
    peso: "",
    resolucaoX: "",
    resolucaoY: "",
  });

  // Reset form
  const resetForm = () => {
    setForm({
      nome: "",
      largura: "",
      altura: "",
      pixelPitch: "",
      potencia: "",
      peso: "",
      resolucaoX: "",
      resolucaoY: "",
    });
    setEditando(null);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const novoGabinete = {
        ...form,
        largura: Number(form.largura),
        altura: Number(form.altura),
        pixelPitch: Number(form.pixelPitch),
        potencia: Number(form.potencia),
        peso: Number(form.peso),
        resolucaoX: Number(form.resolucaoX),
        resolucaoY: Number(form.resolucaoY),
      };

      // Verificar duplicidade
      const nomeDuplicado = gabinetes.some(
        (g, idx) => 
          g.nome.trim().toLowerCase() === novoGabinete.nome.trim().toLowerCase() && 
          editando !== idx
      );

      if (nomeDuplicado) {
        showFeedback("Já existe um gabinete com esse nome. Escolha outro nome.", "error");
        return;
      }

      let novosGabinetes;
      if (editando !== null) {
        // Editar gabinete existente
        novosGabinetes = [...gabinetes];
        novosGabinetes[editando] = novoGabinete;
        showFeedback(`Gabinete "${novoGabinete.nome}" atualizado com sucesso!`, "success");
      } else {
        // Adicionar novo gabinete
        novosGabinetes = [...gabinetes, novoGabinete];
        showFeedback(`Gabinete "${novoGabinete.nome}" adicionado com sucesso!`, "success");
      }

      setGabinetes(novosGabinetes);
      await salvarGabinetes(novosGabinetes);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar gabinete:", error);
      showFeedback("Erro ao salvar gabinete. Tente novamente.", "error");
    }
  };

  // Editar gabinete
  const editarGabinete = (index) => {
    const gabinete = gabinetes[index];
    setForm(gabinete);
    setEditando(index);
    setShowModal(true);
  };

  // Remover gabinete
  const removerGabinete = async (index) => {
    if (confirm("Tem certeza que deseja remover este gabinete?")) {
      try {
        const novosGabinetes = gabinetes.filter((_, i) => i !== index);
        setGabinetes(novosGabinetes);
        await salvarGabinetes(novosGabinetes);
        showFeedback("Gabinete removido com sucesso!", "success");
        setGabineteSelecionado(null);
      } catch (error) {
        console.error("Erro ao remover gabinete:", error);
        showFeedback("Erro ao remover gabinete. Tente novamente.", "error");
      }
    }
  };

  // Cards de estatísticas
  const statsCards = [
    {
      title: "Total de Gabinetes",
      value: gabinetes.length,
      icon: Monitor,
      color: "blue",
    },
    {
      title: "Potência Total",
      value: gabinetes.reduce((acc, g) => acc + (g.potencia || 0), 0).toLocaleString("pt-BR") + "W",
      icon: Zap,
      color: "yellow",
    },
    {
      title: "Peso Total",
      value: gabinetes.reduce((acc, g) => acc + (g.peso || 0), 0).toFixed(1) + "kg",
      icon: Weight,
      color: "green",
    },
    {
      title: "Área Total",
      value: gabinetes.reduce((acc, g) => acc + ((g.largura || 0) * (g.altura || 0)) / 1000000, 0).toFixed(2) + "m²",
      icon: Ruler,
      color: "purple",
    },
  ];

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
          <p className="text-gray-400">Gerencie as especificações dos gabinetes LED</p>
        </motion.div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatusCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* Mensagem de feedback */}
        {mensagemFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg ${
              mensagemFeedback.includes("Erro") || mensagemFeedback.includes("erro")
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Gabinetes */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
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

              {gabinetes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Nenhum gabinete cadastrado</p>
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
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {gabinetes.map((gabinete, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gray-800/50 rounded-lg p-4 border cursor-pointer transition-all ${
                          gabineteSelecionado === index
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                        onClick={() => setGabineteSelecionado(gabineteSelecionado === index ? null : index)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">{gabinete.nome}</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit3}
                              onClick={(e) => {
                                e.stopPropagation();
                                editarGabinete(index);
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Trash2}
                              onClick={(e) => {
                                e.stopPropagation();
                                removerGabinete(index);
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Dimensões:</span>
                            <div className="font-medium">{gabinete.largura}×{gabinete.altura}mm</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Resolução:</span>
                            <div className="font-medium">{gabinete.resolucaoX}×{gabinete.resolucaoY}px</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Potência:</span>
                            <div className="font-medium">{gabinete.potencia}W</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Peso:</span>
                            <div className="font-medium">{gabinete.peso}kg</div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <span className="text-gray-400 text-xs">Pixel Pitch:</span>
                          <div className="font-medium text-sm">{gabinete.pixelPitch}mm</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* Painel de Detalhes */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="text-green-400" />
                Detalhes do Gabinete
              </h3>
              
              {gabineteSelecionado !== null ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {(() => {
                    const gabinete = gabinetes[gabineteSelecionado];
                    const area = (gabinete.largura * gabinete.altura) / 1000000; // m²
                    const densidadePixel = (gabinete.resolucaoX * gabinete.resolucaoY) / area;
                    
                    return (
                      <>
                        <div>
                          <h4 className="font-medium text-blue-400 mb-2">Informações Básicas</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Nome:</span>
                              <span>{gabinete.nome}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Largura:</span>
                              <span>{gabinete.largura}mm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Altura:</span>
                              <span>{gabinete.altura}mm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Área:</span>
                              <span>{area.toFixed(4)}m²</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-yellow-400 mb-2">Especificações</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pixel Pitch:</span>
                              <span>{gabinete.pixelPitch}mm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Resolução:</span>
                              <span>{gabinete.resolucaoX}×{gabinete.resolucaoY}px</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Densidade:</span>
                              <span>{densidadePixel.toFixed(0)} px/m²</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-green-400 mb-2">Consumo e Peso</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Potência:</span>
                              <span>{gabinete.potencia}W</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Peso:</span>
                              <span>{gabinete.peso}kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">W/m²:</span>
                              <span>{(gabinete.potencia / area).toFixed(0)}W/m²</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">kg/m²:</span>
                              <span>{(gabinete.peso / area).toFixed(1)}kg/m²</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            className="w-full"
                            onClick={() => editarGabinete(gabineteSelecionado)}
                            icon={Edit3}
                          >
                            Editar Gabinete
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              ) : (
                <div className="text-center py-8">
                  <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    Selecione um gabinete para ver os detalhes
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Modal de Formulário */}
        <AnimatePresence>
          {showModal && (
            <Modal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                resetForm();
              }}
              title={editando !== null ? "Editar Gabinete" : "Novo Gabinete"}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Nome do Gabinete"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: P10 Indoor 960x960"
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Largura (mm)"
                    name="largura"
                    type="number"
                    value={form.largura}
                    onChange={handleChange}
                    required
                    placeholder="960"
                  />
                  <InputField
                    label="Altura (mm)"
                    name="altura"
                    type="number"
                    value={form.altura}
                    onChange={handleChange}
                    required
                    placeholder="960"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Resolução X (pixels)"
                    name="resolucaoX"
                    type="number"
                    value={form.resolucaoX}
                    onChange={handleChange}
                    required
                    placeholder="96"
                  />
                  <InputField
                    label="Resolução Y (pixels)"
                    name="resolucaoY"
                    type="number"
                    value={form.resolucaoY}
                    onChange={handleChange}
                    required
                    placeholder="96"
                  />
                </div>

                <InputField
                  label="Pixel Pitch (mm)"
                  name="pixelPitch"
                  type="number"
                  step="0.1"
                  value={form.pixelPitch}
                  onChange={handleChange}
                  required
                  placeholder="10.0"
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Potência (W)"
                    name="potencia"
                    type="number"
                    value={form.potencia}
                    onChange={handleChange}
                    required
                    placeholder="800"
                  />
                  <InputField
                    label="Peso (kg)"
                    name="peso"
                    type="number"
                    step="0.1"
                    value={form.peso}
                    onChange={handleChange}
                    required
                    placeholder="35.5"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    icon={editando !== null ? Save : Plus}
                    className="flex-1"
                  >
                    {editando !== null ? "Salvar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

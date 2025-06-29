import { motion } from "framer-motion";
import {
  Monitor,
  Calculator,
  Save,
  Edit3,
  Trash2,
  Zap,
  Ruler,
  Eye,
  Plus,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";

// Context e hooks globais
import { useProjeto } from "../../contextProjeto";
import { useApiData, useLocalStorage, useTemporaryFeedback } from "../../hooks";

// Hooks customizados locais
import {
  usePainelForm,
  usePainelCrud,
  usePainelCalculations,
  usePainelFiltering,
} from "./hooks";

// Componentes UI
import PainelCard from "../../components/PainelCard";
import FeedbackMessage from "../../components/FeedbackMessage";
import {
  InputField,
  SelectField,
  Button,
  StatusCard,
  Modal,
  LoadingSpinner,
} from "../../components/ModernUI";

// Constantes e tipos
import { PAINEL_CONSTANTS } from "./Paineis.constants";

/**
 * 🎯 Componente Principal - Painéis LED (Modularizado)
 *
 * Este é o componente orquestrador que integra todos os módulos do sistema de painéis.
 * Responsabilidade: Coordenação entre componentes, gerenciamento de estado global.
 *
 * Estrutura modular:
 * - Hooks: Lógica de negócio separada
 * - Components: UI modularizada por responsabilidade
 * - Services: Comunicação com API e cálculos
 * - Utils: Funções auxiliares
 */
export default function Paineis({ isActive }) {
  const { state } = useProjeto();

  // Dados da API
  const {
    data: gabinetes,
    loading: loadingGabinetes,
    error: errorGabinetes,
  } = useApiData("gabinetes", isActive);
  const {
    data: paineis,
    setData: setPaineis,
    updateData: salvarPaineis,
  } = useApiData("paineis", isActive);

  // Estados globais
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "selectedProjectId",
    ""
  );
  const [mensagemFeedback, showFeedback] = useTemporaryFeedback();
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(null);
  const [previewPainel, setPreviewPainel] = useState(null);

  // Configurações de cálculo
  const [tensao, setTensao] = useState("220");
  const [tipoRede, setTipoRede] = useState("monofasico");

  // Hook de formulário
  const painelForm = usePainelForm(selectedProjectId);

  // Hook de cálculos
  const painelCalculations = usePainelCalculations({
    form: painelForm.form,
    gabinetes,
    tensao,
    tipoRede,
  });

  // Hook de CRUD
  const painelCrud = usePainelCrud({
    paineis,
    setPaineis,
    paineisFiltrados: paineis.filter((p) =>
      selectedProjectId && selectedProjectId !== "__all__"
        ? p.projeto === selectedProjectId
        : true
    ),
    selectedProjectId,
    salvarPaineis,
    showFeedback,
  });

  // Hook de filtragem (para futuro uso)
  const painelFiltering = usePainelFiltering(paineis, gabinetes);

  // Sincroniza seleção de projeto com formulário
  useEffect(() => {
    if (selectedProjectId) {
      painelForm.syncWithProject(selectedProjectId);
    }
  }, [selectedProjectId, painelForm.syncWithProject]);

  // Painéis filtrados por projeto
  const paineisFiltrados =
    selectedProjectId && selectedProjectId !== "__all__"
      ? paineis.filter((p) => p.projeto === selectedProjectId)
      : paineis;

  // Handlers do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!painelCalculations.resultado) {
      alert("Aguarde o cálculo do painel ser concluído.");
      return;
    }

    // Monta dados do painel
    const dadosPainel = {
      ...painelForm.form,
      tensao,
      tipoRede,
      ...painelCalculations.resultado,
    };

    let sucesso = false;

    if (painelCrud.editando !== null) {
      // Modo edição
      sucesso = await painelCrud.editarPainel(painelCrud.editando, dadosPainel);
      if (sucesso) {
        setPreviewPainel(null);
      }
    } else {
      // Modo criação
      sucesso = await painelCrud.criarPainel(dadosPainel);
      if (sucesso) {
        setPreviewPainel({ ...dadosPainel });
      }
    }

    if (sucesso) {
      painelForm.resetForm();

      // Foca no campo nome para facilitar adição do próximo painel
      setTimeout(() => {
        const nomeInput = document.querySelector('input[name="nome"]');
        if (nomeInput) nomeInput.focus();
      }, 100);
    }
  };

  const handleEdit = (index) => {
    const dadosParaEdicao = painelCrud.iniciarEdicao(index);
    painelForm.setForm(dadosParaEdicao);
    setPreviewPainel(null);
  };

  const handleRemove = async (index) => {
    await painelCrud.removerPainel(index);
  };

  const handleDuplicate = async (index) => {
    await painelCrud.duplicarPainel(index);
  };

  // Cards de estatísticas
  const statsCards = [
    {
      title: "Painéis Criados",
      value: paineisFiltrados.length,
      icon: Monitor,
      color: "blue",
    },
    {
      title: "Potência Total",
      value:
        paineisFiltrados
          .reduce((acc, p) => {
            const gabinete = gabinetes.find((g) => g.nome === p.gabinete);
            if (gabinete) {
              const qtdGab = (p.qtdLargura || 1) * (p.qtdAltura || 1);
              return acc + gabinete.potencia * qtdGab;
            }
            return acc;
          }, 0)
          .toLocaleString("pt-BR") + "W",
      icon: Zap,
      color: "yellow",
    },
    {
      title: "Área Total",
      value:
        paineisFiltrados.reduce((acc, p) => acc + (p.area || 0), 0).toFixed(2) +
        "m²",
      icon: Ruler,
      color: "green",
    },
  ];

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
            Painéis LED
          </h1>
          <p className="text-gray-400">
            Configure e calcule as especificações dos painéis LED
          </p>
        </motion.div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <FeedbackMessage message={mensagemFeedback} type="success" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calculator className="text-blue-400" />
                Configuração do Painel
              </h2>

              <div className="mb-6">
                <SelectField
                  label="Projeto"
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setSelectedPanelIndex(null);
                    setPreviewPainel(null);
                  }}
                  options={[
                    { value: "", label: "Selecione o Projeto" },
                    ...state.projetos.map((p) => ({
                      value: p.nome,
                      label: p.nome,
                    })),
                  ]}
                />
              </div>

              {/* Formulário só aparece se um projeto estiver selecionado */}
              {selectedProjectId && (
                <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                  <input
                    name="projeto"
                    type="hidden"
                    value={selectedProjectId}
                  />
                  <input
                    name="nome"
                    placeholder="Nome do Painel"
                    value={painelForm.form.nome}
                    onChange={painelForm.handleChange}
                    required
                  />
                  <select
                    name="gabinete"
                    value={painelForm.form.gabinete}
                    onChange={painelForm.handleChange}
                    required
                    disabled={loadingGabinetes}
                  >
                    <option value="">
                      {loadingGabinetes
                        ? "Carregando gabinetes..."
                        : errorGabinetes
                        ? "Erro ao carregar gabinetes"
                        : gabinetes.length === 0
                        ? "Nenhum gabinete disponível"
                        : "Selecione o Gabinete"}
                    </option>
                    {gabinetes.map((g, i) => (
                      <option key={i} value={g.nome}>
                        {g.nome} ({g.largura}×{g.altura}mm)
                      </option>
                    ))}
                  </select>
                  {errorGabinetes && (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize: "0.9em",
                        marginTop: 4,
                      }}
                    >
                      ❌ Erro: {errorGabinetes}
                    </div>
                  )}
                  {!loadingGabinetes &&
                    !errorGabinetes &&
                    gabinetes.length === 0 && (
                      <div
                        style={{
                          color: "#f59e0b",
                          fontSize: "0.9em",
                          marginTop: 4,
                        }}
                      >
                        ⚠️ Nenhum gabinete encontrado. Verifique se há gabinetes
                        cadastrados na aba Gabinetes.
                      </div>
                    )}
                  <div style={{ margin: "12px 0" }}>
                    <label>
                      <input
                        type="radio"
                        name="modo"
                        value="metro"
                        checked={painelForm.form.modo === "metro"}
                        onChange={painelForm.handleChange}
                      />
                      Medidas em Metros
                    </label>
                    <label style={{ marginLeft: 16 }}>
                      <input
                        type="radio"
                        name="modo"
                        value="gabinete"
                        checked={painelForm.form.modo === "gabinete"}
                        onChange={painelForm.handleChange}
                      />
                      Medidas por Gabinetes
                    </label>
                  </div>
                  {painelForm.form.modo === "gabinete" ? (
                    <>
                      <input
                        name="qtdLargura"
                        type="number"
                        min={1}
                        value={painelForm.form.qtdLargura}
                        onChange={painelForm.handleChange}
                        placeholder="Qtd Gabinetes Largura"
                        required
                      />
                      <input
                        name="qtdAltura"
                        type="number"
                        min={1}
                        value={painelForm.form.qtdAltura}
                        onChange={painelForm.handleChange}
                        placeholder="Qtd Gabinetes Altura"
                        required
                      />
                    </>
                  ) : (
                    <>
                      <input
                        name="larguraM"
                        type="number"
                        step="0.01"
                        min={0.01}
                        value={painelForm.form.larguraM}
                        onChange={painelForm.handleChange}
                        placeholder="Largura (m)"
                        required
                      />
                      <input
                        name="alturaM"
                        type="number"
                        step="0.01"
                        min={0.01}
                        value={painelForm.form.alturaM}
                        onChange={painelForm.handleChange}
                        placeholder="Altura (m)"
                        required
                      />
                    </>
                  )}
                  <div style={{ margin: "12px 0" }}>
                    <label>
                      Tensão:
                      <select
                        value={tensao}
                        onChange={(e) => {
                          setTensao(e.target.value);
                          if (
                            e.target.value === "220" &&
                            tipoRede === "monofasico"
                          ) {
                            setTipoRede("bifasico");
                          }
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        <option value="220">220V</option>
                        <option value="380">380V</option>
                      </select>
                    </label>
                    <label style={{ marginLeft: 16 }}>
                      Tipo de rede:
                      <select
                        value={tipoRede}
                        onChange={(e) => setTipoRede(e.target.value)}
                        style={{ marginLeft: 8 }}
                      >
                        {tensao === "220" ? (
                          <>
                            <option value="bifasico">Bifásico</option>
                            <option value="trifasico">Trifásico</option>
                          </>
                        ) : (
                          <>
                            <option value="monofasico">Monofásico</option>
                            <option value="bifasico">Bifásico</option>
                            <option value="trifasico">Trifásico</option>
                          </>
                        )}
                      </select>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={!painelCalculations.resultado}
                  >
                    {painelCrud.editando !== null
                      ? "Salvar Edição"
                      : "Adicionar Painel"}
                  </button>
                </form>
              )}

              {/* Preview detalhado do painel selecionado (placeholder por agora) */}
              {previewPainel && (
                <div>
                  <h3>Preview do Painel: {previewPainel.nome}</h3>
                  <p>Este será implementado na próxima etapa</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Lista lateral de painéis do projeto selecionado */}
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
                    Preencha o formulário ao lado para adicionar o primeiro
                    painel.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {paineisFiltrados.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <PainelCard
                        painel={p}
                        index={i}
                        gabinetes={gabinetes}
                        isSelected={selectedPanelIndex === i}
                        isRecenteAdicionado={
                          painelCrud.painelRecenteAdicionado === p.nome
                        }
                        onSelect={(index, painel) => {
                          setSelectedPanelIndex(index);
                          setPreviewPainel(painel);
                          painelCrud.cancelarEdicao();
                        }}
                        onEdit={handleEdit}
                        onDuplicate={handleDuplicate}
                        onRemove={handleRemove}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

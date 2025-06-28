import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjeto } from "./contextProjeto";
import { useApiData, useLocalStorage, useTemporaryFeedback } from "./hooks";
import PainelCard from "./components/PainelCard";
import FeedbackMessage from "./components/FeedbackMessage";
import {
  InputField,
  SelectField,
  Button,
  StatusCard,
  Modal,
  LoadingSpinner,
} from "./components/ModernUI";
import {
  calcularPainelPorGabinete,
  calcularPainelPorMetro,
  calcularEnergia,
  calcularPotenciaFinal,
} from "./painelCalculos";
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

export default function Paineis({ isActive }) {
  const { state } = useProjeto();

  // Usar hooks customizados para dados da API
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

  // Estados locais otimizados
  const [editando, setEditando] = useState(null);
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "selectedProjectId",
    ""
  );
  const [form, setForm] = useState({
    projeto: "",
    nome: "",
    modo: "gabinete", // "gabinete" ou "metro"
    gabinete: "",
    qtdLargura: 1,
    qtdAltura: 1,
    larguraM: "",
    alturaM: "",
  });
  const [resultado, setResultado] = useState(null);
  const [tensao, setTensao] = useState("220"); // 220 ou 380
  const [tipoRede, setTipoRede] = useState("monofasico");
  const [energia, setEnergia] = useState(null);
  const [potenciaDetalhe, setPotenciaDetalhe] = useState(null);
  const [previewPainel, setPreviewPainel] = useState(null);
  const [painelRecenteAdicionado, setPainelRecenteAdicionado] = useState(null);
  const [mensagemFeedback, showFeedback] = useTemporaryFeedback();

  // Remover useEffects de carregamento de dados pois agora é feito pelos hooks customizados

  // Função simplificada para salvar painéis
  const salvarPaineisBackend = async (novosPaineis) => {
    await salvarPaineis(novosPaineis);
  };

  // Persistência do projeto selecionado já é feita pelo hook useLocalStorage

  // Atualiza resultado, energia e potência detalhada sempre que form, tipoRede, tensao mudam
  useEffect(() => {
    try {
      if (
        !form.gabinete ||
        !Array.isArray(gabinetes) ||
        gabinetes.length === 0
      ) {
        setResultado(null);
        setEnergia(null);
        setPotenciaDetalhe(null);
        return;
      }

      const gabinete = gabinetes.find((g) => g.nome === form.gabinete);
      if (!gabinete) {
        setResultado(null);
        setEnergia(null);
        setPotenciaDetalhe(null);
        return;
      }

      let res = null;
      let qtdGabinetes = 1;

      if (form.modo === "gabinete") {
        res = calcularPainelPorGabinete(
          gabinete,
          Number(form.qtdLargura) || 1,
          Number(form.qtdAltura) || 1
        );
        qtdGabinetes =
          (Number(form.qtdLargura) || 1) * (Number(form.qtdAltura) || 1);
      } else if (form.modo === "metro") {
        res = calcularPainelPorMetro(
          gabinete,
          Number(form.larguraM) || 0.5,
          Number(form.alturaM) || 0.5
        );
        const larguraGab = Number(gabinete.largura) || 500;
        const alturaGab = Number(gabinete.altura) || 500;
        qtdGabinetes =
          Math.round((Number(res.largura) * 1000) / larguraGab) *
          Math.round((Number(res.altura) * 1000) / alturaGab);
      }

      if (res) {
        // Consumo máximo (full white) - com conversão segura
        const potenciaGab = Number(gabinete.potencia) || 0;
        const P_total_max = potenciaGab * qtdGabinetes;
        // Consumo médio (modelo realista, brilho 100%)
        const brilhoPercentualMax = 100;
        const fatorConteudo = 0.33;
        const consumoBasePercentual = 0.3;
        const pwmMax = Math.pow(brilhoPercentualMax / 100, 2);
        const P_brilhoMax = P_total_max * pwmMax;
        const P_conteudoMax = P_brilhoMax * fatorConteudo;
        const P_baseMax = P_total_max * consumoBasePercentual;
        const P_finalMax = P_conteudoMax + P_baseMax;
        // Consumo médio (brilho 50%)
        const brilhoPercentual50 = 50;
        const pwm50 = Math.pow(brilhoPercentual50 / 100, 2);
        const P_brilho50 = P_total_max * pwm50;
        const P_conteudo50 = P_brilho50 * fatorConteudo;
        const P_base50 = P_total_max * consumoBasePercentual;
        const P_final50 = P_conteudo50 + P_base50;
        setPotenciaDetalhe({ P_total_max, P_finalMax, P_final50 });
        setResultado({ ...res, potencia: P_finalMax });
        setEnergia(calcularEnergia(P_finalMax, tipoRede, tensao));
      } else {
        setResultado(null);
        setEnergia(null);
        setPotenciaDetalhe(null);
      }
    } catch (error) {
      console.error("Erro ao calcular painel:", error);
      setResultado(null);
      setEnergia(null);
      setPotenciaDetalhe(null);
    }
  }, [form, gabinetes, tipoRede, tensao]);

  // Sempre que selectedProjectId mudar, atualiza o campo projeto do form e define modo 'metro' como padrão
  useEffect(() => {
    if (selectedProjectId) {
      setForm((f) => ({ ...f, projeto: selectedProjectId, modo: "metro" }));
    }
  }, [selectedProjectId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!resultado) return;
    const gabinete = gabinetes.find((g) => g.nome === form.gabinete);
    let qtdLargura = 1;
    let qtdAltura = 1;
    if (form.modo === "gabinete") {
      qtdLargura = Number(form.qtdLargura);
      qtdAltura = Number(form.qtdAltura);
    } else if (form.modo === "metro" && gabinete) {
      qtdLargura = Math.round(
        (Number(form.larguraM) * 1000) / gabinete.largura
      );
      qtdAltura = Math.round((Number(form.alturaM) * 1000) / gabinete.altura);
    }
    const painel = {
      projeto: selectedProjectId,
      nome: form.nome,
      gabinete: form.gabinete,
      modo: form.modo,
      qtdLargura,
      qtdAltura,
      larguraM: form.larguraM,
      alturaM: form.alturaM,
      tensao, // Salva tensão selecionada
      tipoRede, // Salva tipo de rede selecionado
      ...resultado,
    };
    // Impede duplicidade só na criação
    const nomeDuplicado = paineis.some(
      (p, idx) =>
        p.projeto === selectedProjectId &&
        p.nome.trim().toLowerCase() === painel.nome.trim().toLowerCase() &&
        editando === null
    );
    if (nomeDuplicado) {
      alert(
        "Já existe um painel com esse nome neste projeto. Escolha outro nome."
      );
      return;
    }
    let novos;
    if (editando !== null) {
      // Atualiza o painel correto
      const painelEditado = paineisFiltrados[editando];
      const idxReal = paineis.findIndex(
        (p) =>
          p.projeto === painelEditado.projeto && p.nome === painelEditado.nome
      );
      if (idxReal !== -1) {
        novos = [...paineis];
        novos[idxReal] = painel;
        setPaineis(novos);
        setEditando(null);
        setPreviewPainel(null);
      } else {
        return;
      }
    } else {
      novos = [...paineis, painel];
      setPreviewPainel({ ...painel });
      setPainelRecenteAdicionado(painel.nome); // Marca o painel como recém-adicionado
      showFeedback(`Painel "${painel.nome}" adicionado com sucesso!`);
      setPaineis(novos);

      // Remove o destaque após 3 segundos
      setTimeout(() => {
        setPainelRecenteAdicionado(null);
      }, 3000);
    }
    salvarPaineisBackend(novos);
    setForm({
      projeto: selectedProjectId,
      nome: "",
      modo: "metro", // Sempre volta para metro
      gabinete: "",
      qtdLargura: 1,
      qtdAltura: 1,
      larguraM: "",
      alturaM: "",
    });

    // Foca no campo nome para facilitar adição do próximo painel
    setTimeout(() => {
      const nomeInput = document.querySelector('input[name="nome"]');
      if (nomeInput) nomeInput.focus();
    }, 100);
  }

  function editarPainel(index) {
    setForm({ ...paineisFiltrados[index], projeto: selectedProjectId });
    setEditando(index);
    setPreviewPainel(null);
    setPainelRecenteAdicionado(null); // Remove destaque ao iniciar edição
  }

  function removerPainel(index) {
    if (window.confirm("Remover este painel?")) {
      const novos = paineis.filter((_, i) => i !== index);
      setPaineis(novos);
      salvarPaineisBackend(novos);
    }
  }

  // Função para duplicar painel
  function duplicarPainel(index) {
    const painelOriginal = paineisFiltrados[index];
    // Gera nome novo: "tela", "tela 2", "tela 3"...
    const baseName = painelOriginal.nome.replace(/ \d+$/, "");
    let novoNome = baseName;
    let count = 2;
    while (
      paineis.some(
        (p) =>
          p.projeto === selectedProjectId &&
          p.nome.toLowerCase() === novoNome.toLowerCase()
      )
    ) {
      novoNome = `${baseName} ${count}`;
      count++;
    }
    const novoPainel = { ...painelOriginal, nome: novoNome };
    const novos = [...paineis, novoPainel];
    setPaineis(novos);
    setPainelRecenteAdicionado(novoPainel.nome); // Destaca o painel duplicado
    salvarPaineisBackend(novos);

    // Remove o destaque após 3 segundos
    setTimeout(() => {
      setPainelRecenteAdicionado(null);
    }, 3000);
  }

  // Filtrar paineis pelo projeto selecionado
  const paineisFiltrados =
    selectedProjectId && selectedProjectId !== "__all__"
      ? paineis.filter((p) => p.projeto === selectedProjectId)
      : paineis;

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
      value: paineisFiltrados.reduce((acc, p) => {
        const gabinete = gabinetes.find((g) => g.nome === p.gabinete);
        if (gabinete) {
          const qtdGab = (p.qtdLargura || 1) * (p.qtdAltura || 1);
          return acc + gabinete.potencia * qtdGab;
        }
        return acc;
      }, 0).toLocaleString("pt-BR") + "W",
      icon: Zap,
      color: "yellow",
    },
    {
      title: "Área Total",
      value: paineisFiltrados.reduce((acc, p) => acc + (p.area || 0), 0).toFixed(2) + "m²",
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
          <p className="text-gray-400">Configure e calcule as especificações dos painéis LED</p>
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
                    setForm((f) => ({ ...f, projeto: e.target.value }));
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
            <input name="projeto" type="hidden" value={selectedProjectId} />
            <input
              name="nome"
              placeholder="Nome do Painel"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <select
              name="gabinete"
              value={form.gabinete}
              onChange={handleChange}
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
                style={{ color: "#ef4444", fontSize: "0.9em", marginTop: 4 }}
              >
                ❌ Erro: {errorGabinetes}
              </div>
            )}
            {!loadingGabinetes && !errorGabinetes && gabinetes.length === 0 && (
              <div
                style={{ color: "#f59e0b", fontSize: "0.9em", marginTop: 4 }}
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
                  checked={form.modo === "metro"}
                  onChange={handleChange}
                />
                Medidas em Metros
              </label>
              <label style={{ marginLeft: 16 }}>
                <input
                  type="radio"
                  name="modo"
                  value="gabinete"
                  checked={form.modo === "gabinete"}
                  onChange={handleChange}
                />
                Medidas por Gabinetes
              </label>
            </div>
            {form.modo === "gabinete" ? (
              <>
                <input
                  name="qtdLargura"
                  type="number"
                  min={1}
                  value={form.qtdLargura}
                  onChange={handleChange}
                  placeholder="Qtd Gabinetes Largura"
                  required
                />
                <input
                  name="qtdAltura"
                  type="number"
                  min={1}
                  value={form.qtdAltura}
                  onChange={handleChange}
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
                  value={form.larguraM}
                  onChange={handleChange}
                  placeholder="Largura (m)"
                  required
                />
                <input
                  name="alturaM"
                  type="number"
                  step="0.01"
                  min={0.01}
                  value={form.alturaM}
                  onChange={handleChange}
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
                    if (e.target.value === "220" && tipoRede === "monofasico") {
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
            <button type="submit" disabled={!resultado}>
              {editando !== null ? "Salvar Edição" : "Adicionar Painel"}
            </button>
          </form>
        )}
        {/* Preview detalhado do painel selecionado (agora abaixo do formulário) */}
        {previewPainel &&
          (() => {
            // Busca gabinete do painel
            const gabineteObj = gabinetes.find(
              (g) => g.nome === previewPainel.gabinete
            );
            // Quantidade de gabinetes
            const qtdGabinetes =
              (previewPainel.qtdLargura || 1) * (previewPainel.qtdAltura || 1);
            // Potência máxima (100% brilho)
            const potMax = gabineteObj
              ? gabineteObj.potencia * qtdGabinetes
              : 0;
            // Potência aparente e corrente conforme painel
            const tensaoPainel = previewPainel.tensao || "220";
            const tipoRedePainel = previewPainel.tipoRede || "monofasico";
            const energiaMax = calcularEnergia(
              potMax,
              tipoRedePainel,
              tensaoPainel
            );
            // Potência média (50% brilho)
            const pot50 = gabineteObj
              ? calcularPotenciaFinal(gabineteObj, qtdGabinetes, 50).P_final
              : 0;
            const energia50 = calcularEnergia(
              pot50,
              tipoRedePainel,
              tensaoPainel
            );
            // Formatação helper
            const fmt = (v, dec = 2) =>
              v !== undefined && !isNaN(v)
                ? Number(v).toLocaleString("pt-BR", {
                    minimumFractionDigits: dec,
                    maximumFractionDigits: dec,
                  })
                : "-";
            return (
              <div
                className="painel-preview"
                style={{
                  marginTop: 24,
                  minWidth: 340,
                  maxWidth: 600,
                  background: "#23283a",
                  borderRadius: 12,
                  padding: 18,
                  fontSize: "0.85em",
                  lineHeight: 1.35,
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1em",
                    marginBottom: 5,
                  }}
                >
                  Informações do Painel – {previewPainel.nome}
                </div>
                <div style={{ marginLeft: 8 }}>
                  Projeto: {previewPainel.projeto}
                  <br />
                  Gabinete: {previewPainel.gabinete}
                  <br />
                  Dimensões do Painel: {fmt(previewPainel.largura, 2)} m ×{" "}
                  {fmt(previewPainel.altura, 2)} m
                  <br />
                  Resolução Total: {previewPainel.pixelsLargura} ×{" "}
                  {previewPainel.pixelsAltura} pixels
                  <br />
                  Área Total: {fmt(previewPainel.area, 2)} m²
                  <br />
                  Peso Total: {fmt(previewPainel.peso, 0)} kg
                </div>
                <div style={{ margin: "12px 0 5px 0", fontWeight: "bold" }}>
                  Composição do Painel
                </div>
                <div style={{ marginLeft: 8 }}>
                  Quantidade de Gabinetes: {qtdGabinetes} unidades
                  <br />
                  Largura: {previewPainel.qtdLargura} gabinetes
                  <br />
                  Altura: {previewPainel.qtdAltura} gabinetes
                </div>
                <div style={{ margin: "14px 0 5px 0", fontWeight: "bold" }}>
                  Potência e Consumo
                </div>
                <div
                  style={{
                    marginLeft: 8,
                    textDecoration: "underline",
                    marginTop: 2,
                  }}
                >
                  Branco Máximo (100% de Brilho)
                </div>
                <div style={{ marginLeft: 8 }}>
                  Potência Total Consumida: {fmt(potMax, 0)} Watts
                  <br />
                  Potência Aparente: {fmt(energiaMax.potenciaVA)} VA
                  <br />
                  Corrente Elétrica Estimada: {energiaMax.descricao}
                </div>
                <div
                  style={{
                    marginLeft: 8,
                    textDecoration: "underline",
                    marginTop: 10,
                  }}
                >
                  Consumo Médio (Brilho em 50%)
                </div>
                <div style={{ marginLeft: 8 }}>
                  Potência Estimada Consumida: {fmt(pot50, 0)} Watts
                  <br />
                  Potência Aparente: {fmt(energia50.potenciaVA)} VA
                  <br />
                  Corrente Elétrica Estimada: {energia50.descricao}
                </div>
              </div>
            );
          })()}
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
                    Preencha o formulário ao lado para adicionar o primeiro painel.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
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
                          isRecenteAdicionado={painelRecenteAdicionado === p.nome}
                          onSelect={(index, painel) => {
                            setSelectedPanelIndex(index);
                            setPreviewPainel(painel);
                            setEditando(null);
                          }}
                          onEdit={(index) => {
                            setForm({
                              ...paineisFiltrados[index],
                              projeto: selectedProjectId,
                            });
                            setEditando(index);
                            setPreviewPainel(null);
                            setPainelRecenteAdicionado(null);
                          }}
                          onDuplicate={duplicarPainel}
                          onRemove={removerPainel}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

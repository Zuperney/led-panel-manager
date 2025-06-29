import { motion } from "framer-motion";
import { useEffect } from "react";

// Context e hooks globais
import { useProjeto } from "../../contextProjeto";
import { useApiData } from "../../hooks";

// Hooks customizados locais
import {
  usePainelForm,
  usePainelCrud,
  usePainelCalculations,
  usePainelFiltering,
  usePainelHandlers,
  usePainelState,
} from "./hooks";

// Componentes modularizados
import {
  PainelForm,
  PainelList,
  PainelStats,
  PainelToolbar,
  PainelModals,
} from "./components";

// Componentes UI globais
import FeedbackMessage from "../../components/FeedbackMessage";

/**
 * 🎯 Componente Principal - Painéis LED (Refatorado)
 *
 * Componente orquestrador que integra todos os módulos do sistema de painéis.
 * Versão otimizada com separation of concerns e hooks especializados.
 *
 * Funcionalidades:
 * - Gerenciamento de formulário de painéis
 * - Cálculos automáticos de especificações
 * - CRUD completo de painéis
 * - Sistema de preview e modais
 * - Estatísticas em tempo real
 * - Filtros por projeto
 *
 * Hooks utilizados:
 * - usePainelState: Estados centralizados
 * - usePainelForm: Lógica de formulário
 * - usePainelCalculations: Cálculos de engenharia
 * - usePainelCrud: Operações de banco de dados
 * - usePainelHandlers: Handlers de eventos
 * - usePainelFiltering: Filtros e busca
 *
 * Componentes filhos:
 * - PainelToolbar: Header da página
 * - PainelStats: Cards de estatísticas
 * - PainelForm: Formulário de criação/edição
 * - PainelList: Lista de painéis
 * - PainelModals: Sistema de modais
 *
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isActive - Se o componente está ativo para carregamento de dados
 *
 * @returns {JSX.Element} Componente renderizado
 *
 * @example
 * ```jsx
 * <Paineis isActive={true} />
 * ```
 *
 * @since 1.6.0
 * @author Led Panel Manager Team
 */
export default function Paineis({ isActive }) {
  const { state } = useProjeto();

  // Estados centralizados
  const painelState = usePainelState();

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

  // Hook de formulário
  const painelForm = usePainelForm(painelState.selectedProjectId);

  // Hook de cálculos
  const painelCalculations = usePainelCalculations({
    form: painelForm.form,
    gabinetes,
    tensao: painelState.tensao,
    tipoRede: painelState.tipoRede,
  });

  // Painéis filtrados por projeto
  const paineisFiltrados =
    painelState.selectedProjectId && painelState.selectedProjectId !== "__all__"
      ? paineis.filter((p) => p.projeto === painelState.selectedProjectId)
      : paineis;

  // Hook de CRUD
  const painelCrud = usePainelCrud({
    paineis,
    setPaineis,
    paineisFiltrados,
    selectedProjectId: painelState.selectedProjectId,
    salvarPaineis,
    showFeedback: painelState.showFeedback,
  });

  // Hook de filtragem (para futuro uso)
  const painelFiltering = usePainelFiltering(paineis, gabinetes);

  // Hook de handlers centralizados
  const handlers = usePainelHandlers({
    painelForm,
    painelCalculations,
    painelCrud,
    setPreviewPainel: painelState.setPreviewPainel,
    setSelectedPanelIndex: painelState.setSelectedPanelIndex,
    tensao: painelState.tensao,
    tipoRede: painelState.tipoRede,
  });

  // Sincroniza seleção de projeto com formulário
  useEffect(() => {
    if (painelState.selectedProjectId) {
      painelForm.syncWithProject(painelState.selectedProjectId);
    }
  }, [painelState.selectedProjectId, painelForm.syncWithProject]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header - Componente modularizado */}
        <PainelToolbar />

        {/* Cards de Estatísticas - Componente modularizado */}
        <PainelStats
          paineisFiltrados={paineisFiltrados}
          gabinetes={gabinetes}
        />

        {/* Mensagem de feedback */}
        <FeedbackMessage
          message={painelState.mensagemFeedback}
          type="success"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário - Componente modularizado */}
          <PainelForm
            selectedProjectId={painelState.selectedProjectId}
            setSelectedProjectId={painelState.setSelectedProjectId}
            painelForm={painelForm}
            painelCalculations={painelCalculations}
            painelCrud={painelCrud}
            gabinetes={gabinetes}
            loadingGabinetes={loadingGabinetes}
            errorGabinetes={errorGabinetes}
            tensao={painelState.tensao}
            setTensao={painelState.setTensao}
            tipoRede={painelState.tipoRede}
            setTipoRede={painelState.setTipoRede}
            projetos={state.projetos}
            onSubmit={handlers.handleSubmit}
            setSelectedPanelIndex={painelState.setSelectedPanelIndex}
            setPreviewPainel={painelState.setPreviewPainel}
          />

          {/* Lista de Painéis - Componente modularizado */}
          <PainelList
            paineisFiltrados={paineisFiltrados}
            gabinetes={gabinetes}
            selectedPanelIndex={painelState.selectedPanelIndex}
            painelRecenteAdicionado={painelCrud.painelRecenteAdicionado}
            onSelect={handlers.handleSelect}
            onEdit={handlers.handleEdit}
            onDuplicate={handlers.handleDuplicate}
            onRemove={handlers.handleRemove}
          />
        </div>

        {/* Modais - Componente modularizado */}
        <PainelModals
          previewPainel={painelState.previewPainel}
          onClosePreview={handlers.handleClosePreview}
        />
      </div>
    </motion.div>
  );
}

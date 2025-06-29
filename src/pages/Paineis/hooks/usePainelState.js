/**
 * Hook customizado para gerenciar estados dos painéis
 *
 * Responsabilidades:
 * - Centralizar gerenciamento de estados
 * - Simplificar o componente principal
 * - Facilitar manutenção e debugging
 * - Otimizar re-renders
 *
 * @author Led Panel Manager Team
 * @since 1.6.0
 */

import { useState } from "react";
import { useLocalStorage, useTemporaryFeedback } from "../../../hooks";

/**
 * Hook para gerenciar estados dos painéis
 */
export function usePainelState() {
  // Estados persistidos
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "selectedProjectId",
    ""
  );

  // Estados temporários
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(null);
  const [previewPainel, setPreviewPainel] = useState(null);

  // Configurações de cálculo
  const [tensao, setTensao] = useState("220");
  const [tipoRede, setTipoRede] = useState("monofasico");

  // Sistema de feedback
  const [mensagemFeedback, showFeedback] = useTemporaryFeedback();

  // Função para resetar seleções
  const resetSelections = () => {
    setSelectedPanelIndex(null);
    setPreviewPainel(null);
  };

  // Função para resetar configurações
  const resetConfigurations = () => {
    setTensao("220");
    setTipoRede("monofasico");
  };

  return {
    // Estados
    selectedProjectId,
    setSelectedProjectId,
    selectedPanelIndex,
    setSelectedPanelIndex,
    previewPainel,
    setPreviewPainel,
    tensao,
    setTensao,
    tipoRede,
    setTipoRede,
    mensagemFeedback,
    showFeedback,

    // Funções auxiliares
    resetSelections,
    resetConfigurations,
  };
}

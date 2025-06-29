/**
 * Hook customizado para gerenciar handlers de eventos dos painéis
 *
 * Responsabilidades:
 * - Centralizar lógica de handlers
 * - Simplificar o componente principal
 * - Facilitar manutenção e testes
 * - Otimizar performance com useCallback
 *
 * @author Led Panel Manager Team
 * @since 1.6.0
 */

import { useCallback } from "react";

/**
 * Hook para gerenciar handlers dos painéis
 */
export function usePainelHandlers({
  painelForm,
  painelCalculations,
  painelCrud,
  setPreviewPainel,
  setSelectedPanelIndex,
  tensao,
  tipoRede,
}) {
  // Handler de submit do formulário
  const handleSubmit = useCallback(
    async (e) => {
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
        sucesso = await painelCrud.editarPainel(
          painelCrud.editando,
          dadosPainel
        );
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
    },
    [
      painelForm,
      painelCalculations,
      painelCrud,
      setPreviewPainel,
      tensao,
      tipoRede,
    ]
  );

  // Handler de edição de painel
  const handleEdit = useCallback(
    (index) => {
      const dadosParaEdicao = painelCrud.iniciarEdicao(index);
      painelForm.setForm(dadosParaEdicao);
      setPreviewPainel(null);
    },
    [painelCrud, painelForm, setPreviewPainel]
  );

  // Handler de remoção de painel
  const handleRemove = useCallback(
    async (index) => {
      await painelCrud.removerPainel(index);
    },
    [painelCrud]
  );

  // Handler de duplicação de painel
  const handleDuplicate = useCallback(
    async (index) => {
      await painelCrud.duplicarPainel(index);
    },
    [painelCrud]
  );

  // Handler de seleção de painel
  const handleSelect = useCallback(
    (index, painel) => {
      setSelectedPanelIndex(index);
      setPreviewPainel(painel);
      painelCrud.cancelarEdicao();
    },
    [setSelectedPanelIndex, setPreviewPainel, painelCrud]
  );

  // Handler de fechamento de preview
  const handleClosePreview = useCallback(() => {
    setPreviewPainel(null);
  }, [setPreviewPainel]);

  return {
    handleSubmit,
    handleEdit,
    handleRemove,
    handleDuplicate,
    handleSelect,
    handleClosePreview,
  };
}

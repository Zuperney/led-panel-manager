/**
 * Hook customizado para operações CRUD de painéis
 *
 * Responsabilidades:
 * - Criar novos painéis (handleSubmit)
 * - Editar painéis existentes
 * - Remover painéis
 * - Duplicar painéis
 * - Validações de duplicidade
 * - Gestão de feedback de operações
 *
 * @author Led Panel Manager Team
 * @since 1.3.0
 */

import { useState, useCallback } from "react";
import { savePaineis, ApiError } from "../services/painelApi";
import {
  validatePainelForm,
  sanitizePainelForm,
} from "../services/painelValidation";

export function usePainelCrud({
  paineis,
  setPaineis,
  paineisFiltrados,
  selectedProjectId,
  salvarPaineis,
  showFeedback,
}) {
  const [editando, setEditando] = useState(null);
  const [painelRecenteAdicionado, setPainelRecenteAdicionado] = useState(null);

  /**
   * Valida se existe duplicidade de nome no projeto
   * @param {string} nome - Nome do painel
   * @param {boolean} isEdicao - Se é uma edição (permite manter o mesmo nome)
   * @returns {boolean} - true se há duplicidade
   */
  const validarDuplicidade = useCallback(
    (nome, isEdicao = false) => {
      if (isEdicao) return false; // Na edição, permite manter o mesmo nome

      return paineis.some(
        (p) =>
          p.projeto === selectedProjectId &&
          p.nome.trim().toLowerCase() === nome.trim().toLowerCase()
      );
    },
    [paineis, selectedProjectId]
  );

  /**
   * Cria um novo painel
   * @param {Object} dadosPainel - Dados do painel a ser criado
   * @returns {boolean} - true se criado com sucesso
   */
  const criarPainel = useCallback(
    async (dadosPainel) => {
      try {
        // Validação de duplicidade
        if (validarDuplicidade(dadosPainel.nome)) {
          alert(
            "Já existe um painel com esse nome neste projeto. Escolha outro nome."
          );
          return false;
        }

        const novoPainel = {
          ...dadosPainel,
          projeto: selectedProjectId,
        };

        const novosPaineis = [...paineis, novoPainel];
        setPaineis(novosPaineis);

        // Feedback e destaque
        setPainelRecenteAdicionado(novoPainel.nome);
        showFeedback(`Painel "${novoPainel.nome}" adicionado com sucesso!`);

        // Salva no backend
        await salvarPaineis(novosPaineis);

        // Remove destaque após 3 segundos
        setTimeout(() => {
          setPainelRecenteAdicionado(null);
        }, 3000);

        return true;
      } catch (error) {
        console.error("Erro ao criar painel:", error);
        alert("Erro ao criar painel. Tente novamente.");
        return false;
      }
    },
    [
      paineis,
      setPaineis,
      selectedProjectId,
      salvarPaineis,
      showFeedback,
      validarDuplicidade,
    ]
  );

  /**
   * Atualiza um painel existente
   * @param {number} index - Índice do painel filtrado
   * @param {Object} dadosPainel - Novos dados do painel
   * @returns {boolean} - true se atualizado com sucesso
   */
  const editarPainel = useCallback(
    async (index, dadosPainel) => {
      try {
        const painelEditado = paineisFiltrados[index];

        // Encontra o índice real no array completo
        const idxReal = paineis.findIndex(
          (p) =>
            p.projeto === painelEditado.projeto && p.nome === painelEditado.nome
        );

        if (idxReal === -1) {
          alert("Painel não encontrado para edição.");
          return false;
        }

        const painelAtualizado = {
          ...dadosPainel,
          projeto: selectedProjectId,
        };

        const novosPaineis = [...paineis];
        novosPaineis[idxReal] = painelAtualizado;

        setPaineis(novosPaineis);
        setEditando(null);

        // Salva no backend
        await salvarPaineis(novosPaineis);

        showFeedback(
          `Painel "${painelAtualizado.nome}" atualizado com sucesso!`
        );
        return true;
      } catch (error) {
        console.error("Erro ao editar painel:", error);
        alert("Erro ao editar painel. Tente novamente.");
        return false;
      }
    },
    [
      paineis,
      paineisFiltrados,
      setPaineis,
      selectedProjectId,
      salvarPaineis,
      showFeedback,
    ]
  );

  /**
   * Remove um painel
   * @param {number} index - Índice do painel no array completo
   * @returns {boolean} - true se removido com sucesso
   */
  const removerPainel = useCallback(
    async (index) => {
      try {
        if (!window.confirm("Remover este painel?")) {
          return false;
        }

        const novosPaineis = paineis.filter((_, i) => i !== index);
        setPaineis(novosPaineis);

        // Salva no backend
        await salvarPaineis(novosPaineis);

        showFeedback("Painel removido com sucesso!");
        return true;
      } catch (error) {
        console.error("Erro ao remover painel:", error);
        alert("Erro ao remover painel. Tente novamente.");
        return false;
      }
    },
    [paineis, setPaineis, salvarPaineis, showFeedback]
  );

  /**
   * Duplica um painel existente
   * @param {number} index - Índice do painel filtrado a ser duplicado
   * @returns {boolean} - true se duplicado com sucesso
   */
  const duplicarPainel = useCallback(
    async (index) => {
      try {
        const painelOriginal = paineisFiltrados[index];

        // Gera nome único: "painel", "painel 2", "painel 3"...
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

        const novoPainel = {
          ...painelOriginal,
          nome: novoNome,
        };

        const novosPaineis = [...paineis, novoPainel];
        setPaineis(novosPaineis);

        // Feedback e destaque
        setPainelRecenteAdicionado(novoPainel.nome);
        showFeedback(`Painel "${novoPainel.nome}" duplicado com sucesso!`);

        // Salva no backend
        await salvarPaineis(novosPaineis);

        // Remove destaque após 3 segundos
        setTimeout(() => {
          setPainelRecenteAdicionado(null);
        }, 3000);

        return true;
      } catch (error) {
        console.error("Erro ao duplicar painel:", error);
        alert("Erro ao duplicar painel. Tente novamente.");
        return false;
      }
    },
    [
      paineis,
      paineisFiltrados,
      setPaineis,
      selectedProjectId,
      salvarPaineis,
      showFeedback,
    ]
  );

  /**
   * Inicia o modo de edição de um painel
   * @param {number} index - Índice do painel filtrado
   * @returns {Object} - Dados do painel para o formulário
   */
  const iniciarEdicao = useCallback(
    (index) => {
      const painel = paineisFiltrados[index];
      setEditando(index);
      setPainelRecenteAdicionado(null); // Remove destaque ao iniciar edição

      return {
        ...painel,
        projeto: selectedProjectId,
      };
    },
    [paineisFiltrados, selectedProjectId]
  );

  /**
   * Cancela o modo de edição
   */
  const cancelarEdicao = useCallback(() => {
    setEditando(null);
  }, []);

  return {
    // Estados
    editando,
    painelRecenteAdicionado,

    // Operações CRUD
    criarPainel,
    editarPainel,
    removerPainel,
    duplicarPainel,

    // Controles de edição
    iniciarEdicao,
    cancelarEdicao,

    // Utilitários
    validarDuplicidade,

    // Setters (para compatibilidade)
    setEditando,
    setPainelRecenteAdicionado,
  };
}

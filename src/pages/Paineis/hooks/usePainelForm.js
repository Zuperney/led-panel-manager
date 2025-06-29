import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CALCULATION_MODES,
  VALIDATION_LIMITS,
  FEEDBACK_MESSAGES,
} from "../Paineis.constants";
import {
  validatePainelForm,
  sanitizePainelForm,
} from "../services/painelValidation";

/**
 * 🎯 Hook customizado para gerenciamento de formulário de painéis
 *
 * Responsabilidades:
 * - Gerenciar estado do formulário
 * - Validações de campos
 * - Handlers de mudança
 * - Reset e inicialização
 * - Sincronização com projeto selecionado
 */
export function usePainelForm(selectedProjectId) {
  // Estado inicial do formulário
  const initialFormState = {
    projeto: "",
    nome: "",
    modo: CALCULATION_MODES.BY_METER, // Padrão: metro
    gabinete: "",
    qtdLargura: 1,
    qtdAltura: 1,
    larguraM: "",
    alturaM: "",
  };

  // Estados do formulário
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Sempre que selectedProjectId mudar, atualiza o campo projeto do form
  useEffect(() => {
    if (selectedProjectId) {
      setForm((prevForm) => ({
        ...prevForm,
        projeto: selectedProjectId,
        modo: CALCULATION_MODES.BY_METER,
      }));
    }
  }, [selectedProjectId]);

  // Validação em tempo real
  useEffect(() => {
    validateForm();
  }, [form]);

  /**
   * Handler para mudanças nos campos do formulário
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    // Limpar erro específico do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Validação completa do formulário
   */
  const validateForm = () => {
    const newErrors = {};

    // Validar nome
    if (!form.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (form.nome.trim().length < VALIDATION_LIMITS.MIN_NAME_LENGTH) {
      newErrors.nome = `Nome deve ter pelo menos ${VALIDATION_LIMITS.MIN_NAME_LENGTH} caracteres`;
    } else if (form.nome.trim().length > VALIDATION_LIMITS.MAX_NAME_LENGTH) {
      newErrors.nome = `Nome deve ter no máximo ${VALIDATION_LIMITS.MAX_NAME_LENGTH} caracteres`;
    }

    // Validar projeto
    if (!form.projeto) {
      newErrors.projeto = "Projeto é obrigatório";
    }

    // Validar gabinete
    if (!form.gabinete) {
      newErrors.gabinete = "Gabinete é obrigatório";
    }

    // Validações específicas por modo
    if (form.modo === CALCULATION_MODES.BY_CABINET) {
      // Modo gabinete
      if (
        !form.qtdLargura ||
        form.qtdLargura < VALIDATION_LIMITS.MIN_CABINETS
      ) {
        newErrors.qtdLargura = `Mínimo ${VALIDATION_LIMITS.MIN_CABINETS} gabinete(s)`;
      } else if (form.qtdLargura > VALIDATION_LIMITS.MAX_CABINETS) {
        newErrors.qtdLargura = `Máximo ${VALIDATION_LIMITS.MAX_CABINETS} gabinetes`;
      }

      if (!form.qtdAltura || form.qtdAltura < VALIDATION_LIMITS.MIN_CABINETS) {
        newErrors.qtdAltura = `Mínimo ${VALIDATION_LIMITS.MIN_CABINETS} gabinete(s)`;
      } else if (form.qtdAltura > VALIDATION_LIMITS.MAX_CABINETS) {
        newErrors.qtdAltura = `Máximo ${VALIDATION_LIMITS.MAX_CABINETS} gabinetes`;
      }
    } else if (form.modo === CALCULATION_MODES.BY_METER) {
      // Modo metro
      if (
        !form.larguraM ||
        Number(form.larguraM) < VALIDATION_LIMITS.MIN_WIDTH
      ) {
        newErrors.larguraM = `Largura mínima: ${VALIDATION_LIMITS.MIN_WIDTH}m`;
      } else if (Number(form.larguraM) > VALIDATION_LIMITS.MAX_WIDTH) {
        newErrors.larguraM = `Largura máxima: ${VALIDATION_LIMITS.MAX_WIDTH}m`;
      }

      if (
        !form.alturaM ||
        Number(form.alturaM) < VALIDATION_LIMITS.MIN_HEIGHT
      ) {
        newErrors.alturaM = `Altura mínima: ${VALIDATION_LIMITS.MIN_HEIGHT}m`;
      } else if (Number(form.alturaM) > VALIDATION_LIMITS.MAX_HEIGHT) {
        newErrors.alturaM = `Altura máxima: ${VALIDATION_LIMITS.MAX_HEIGHT}m`;
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  };

  /**
   * Resetar formulário para estado inicial
   */
  const resetForm = () => {
    setForm({
      ...initialFormState,
      projeto: selectedProjectId || "", // Manter projeto selecionado
      modo: CALCULATION_MODES.BY_METER, // Padrão sempre metro
    });
    setErrors({});
    setIsValid(false);
  };

  /**
   * Preencher formulário com dados existentes (para edição)
   */
  const fillForm = (painelData) => {
    setForm({
      ...painelData,
      projeto: selectedProjectId || painelData.projeto,
    });
  };

  /**
   * Verificar se nome é duplicado
   */
  const isDuplicatedName = (name, paineis, isEditing = false) => {
    return paineis.some(
      (p) =>
        p.projeto === form.projeto &&
        p.nome.trim().toLowerCase() === name.trim().toLowerCase() &&
        !isEditing // Só verifica duplicação na criação
    );
  };

  /**
   * Obter dados do formulário formatados para submissão
   */
  const getFormData = () => {
    if (!isValid) return null;

    const baseData = {
      projeto: form.projeto,
      nome: form.nome.trim(),
      gabinete: form.gabinete,
      modo: form.modo,
    };

    if (form.modo === CALCULATION_MODES.BY_CABINET) {
      return {
        ...baseData,
        qtdLargura: Number(form.qtdLargura),
        qtdAltura: Number(form.qtdAltura),
        larguraM: form.larguraM,
        alturaM: form.alturaM,
      };
    } else {
      return {
        ...baseData,
        qtdLargura: form.qtdLargura,
        qtdAltura: form.qtdAltura,
        larguraM: form.larguraM,
        alturaM: form.alturaM,
      };
    }
  };

  /**
   * Focar no campo nome (útil após criação)
   */
  const focusNameField = () => {
    setTimeout(() => {
      const nomeInput = document.querySelector('input[name="nome"]');
      if (nomeInput) nomeInput.focus();
    }, 100);
  };

  return {
    // Estado
    form,
    errors,
    isValid,

    // Handlers
    handleChange,
    setForm,

    // Operações
    resetForm,
    fillForm,
    validateForm,
    getFormData,
    isDuplicatedName,
    focusNameField,

    // Computed
    hasChanges: JSON.stringify(form) !== JSON.stringify(initialFormState),

    // Constantes úteis
    modes: {
      BY_CABINET: CALCULATION_MODES.BY_CABINET,
      BY_METER: CALCULATION_MODES.BY_METER,
    },
  };
}

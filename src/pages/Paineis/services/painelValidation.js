/**
 * Serviço de validações para painéis LED
 *
 * Responsabilidades:
 * - Validações de formulário de painéis
 * - Regras de negócio específicas
 * - Sanitização de dados de entrada
 * - Mensagens de erro padronizadas
 * - Validações de duplicidade
 * - Validações de consistência
 *
 * @author Led Panel Manager Team
 * @since 1.4.0
 */

/**
 * Constantes de validação
 */
const VALIDATION_CONSTANTS = {
  // Limites de string
  MIN_NOME_LENGTH: 1,
  MAX_NOME_LENGTH: 100,
  MIN_PROJETO_LENGTH: 1,
  MAX_PROJETO_LENGTH: 100,

  // Limites numéricos
  MIN_QTD_GABINETE: 1,
  MAX_QTD_GABINETE: 1000,
  MIN_MEDIDA_METRO: 0.01,
  MAX_MEDIDA_METRO: 100,
  MIN_POTENCIA: 0,
  MAX_POTENCIA: 100000,

  // Padrões regex
  NOME_PATTERN: /^[a-zA-Z0-9\s\-_áéíóúâêîôûàèìòùãõçÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÃÕÇ]+$/,
  PROJETO_PATTERN: /^[a-zA-Z0-9\s\-_áéíóúâêîôûàèìòùãõçÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÃÕÇ]+$/,

  // Valores permitidos
  MODOS_PERMITIDOS: ["gabinete", "metro"],
  TENSOES_PERMITIDAS: ["220", "380"],
  TIPOS_REDE_PERMITIDOS: ["monofasico", "bifasico", "trifasico"],
};

/**
 * Tipos de erro de validação
 */
export const VALIDATION_ERROR_TYPES = {
  REQUIRED: "REQUIRED",
  INVALID_FORMAT: "INVALID_FORMAT",
  OUT_OF_RANGE: "OUT_OF_RANGE",
  DUPLICATE: "DUPLICATE",
  INCONSISTENT: "INCONSISTENT",
  BUSINESS_RULE: "BUSINESS_RULE",
};

/**
 * Classe para erros de validação
 */
export class ValidationError extends Error {
  constructor(message, type, field, value) {
    super(message);
    this.name = "ValidationError";
    this.type = type;
    this.field = field;
    this.value = value;
  }
}

/**
 * Resultado de validação
 */
class ValidationResult {
  constructor() {
    this.isValid = true;
    this.errors = [];
    this.warnings = [];
  }

  addError(
    field,
    message,
    type = VALIDATION_ERROR_TYPES.INVALID_FORMAT,
    value = null
  ) {
    this.isValid = false;
    this.errors.push({
      field,
      message,
      type,
      value,
    });
  }

  addWarning(field, message, value = null) {
    this.warnings.push({
      field,
      message,
      value,
    });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasWarnings() {
    return this.warnings.length > 0;
  }

  getErrorsForField(field) {
    return this.errors.filter((error) => error.field === field);
  }

  getFirstError() {
    return this.errors[0] || null;
  }
}

/**
 * VALIDADORES BÁSICOS
 */

/**
 * Valida se um valor é obrigatório
 * @param {any} value - Valor a validar
 * @param {string} fieldName - Nome do campo
 * @returns {boolean} - Se é válido
 */
function isRequired(value) {
  if (value === null || value === undefined || value === "") {
    return false;
  }

  if (typeof value === "string" && value.trim() === "") {
    return false;
  }

  return true;
}

/**
 * Valida comprimento de string
 * @param {string} value - Valor
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {boolean} - Se é válido
 */
function isValidLength(value, min, max) {
  if (typeof value !== "string") return false;
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Valida se número está no range
 * @param {any} value - Valor
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {boolean} - Se é válido
 */
function isInRange(value, min, max) {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return false;
  return num >= min && num <= max;
}

/**
 * Valida padrão regex
 * @param {string} value - Valor
 * @param {RegExp} pattern - Padrão
 * @returns {boolean} - Se é válido
 */
function matchesPattern(value, pattern) {
  if (typeof value !== "string") return false;
  return pattern.test(value);
}

/**
 * VALIDAÇÕES ESPECÍFICAS DO DOMÍNIO
 */

/**
 * Valida nome do painel
 * @param {string} nome - Nome do painel
 * @param {ValidationResult} result - Resultado da validação
 */
function validateNomePainel(nome, result) {
  if (!isRequired(nome, "nome")) {
    result.addError(
      "nome",
      "Nome do painel é obrigatório",
      VALIDATION_ERROR_TYPES.REQUIRED
    );
    return;
  }

  if (
    !isValidLength(
      nome,
      VALIDATION_CONSTANTS.MIN_NOME_LENGTH,
      VALIDATION_CONSTANTS.MAX_NOME_LENGTH
    )
  ) {
    result.addError(
      "nome",
      `Nome deve ter entre ${VALIDATION_CONSTANTS.MIN_NOME_LENGTH} e ${VALIDATION_CONSTANTS.MAX_NOME_LENGTH} caracteres`,
      VALIDATION_ERROR_TYPES.OUT_OF_RANGE,
      nome
    );
  }

  if (!matchesPattern(nome, VALIDATION_CONSTANTS.NOME_PATTERN)) {
    result.addError(
      "nome",
      "Nome contém caracteres inválidos. Use apenas letras, números, espaços e hífens",
      VALIDATION_ERROR_TYPES.INVALID_FORMAT,
      nome
    );
  }
}

/**
 * Valida projeto
 * @param {string} projeto - Nome do projeto
 * @param {ValidationResult} result - Resultado da validação
 */
function validateProjeto(projeto, result) {
  if (!isRequired(projeto, "projeto")) {
    result.addError(
      "projeto",
      "Projeto é obrigatório",
      VALIDATION_ERROR_TYPES.REQUIRED
    );
    return;
  }

  if (
    !isValidLength(
      projeto,
      VALIDATION_CONSTANTS.MIN_PROJETO_LENGTH,
      VALIDATION_CONSTANTS.MAX_PROJETO_LENGTH
    )
  ) {
    result.addError(
      "projeto",
      `Nome do projeto deve ter entre ${VALIDATION_CONSTANTS.MIN_PROJETO_LENGTH} e ${VALIDATION_CONSTANTS.MAX_PROJETO_LENGTH} caracteres`,
      VALIDATION_ERROR_TYPES.OUT_OF_RANGE,
      projeto
    );
  }
}

/**
 * Valida seleção de gabinete
 * @param {string} gabinete - Nome do gabinete
 * @param {Array} gabinetesDisponiveis - Lista de gabinetes disponíveis
 * @param {ValidationResult} result - Resultado da validação
 */
function validateGabinete(gabinete, gabinetesDisponiveis, result) {
  if (!isRequired(gabinete, "gabinete")) {
    result.addError(
      "gabinete",
      "Gabinete é obrigatório",
      VALIDATION_ERROR_TYPES.REQUIRED
    );
    return;
  }

  if (!gabinetesDisponiveis || gabinetesDisponiveis.length === 0) {
    result.addError(
      "gabinete",
      "Nenhum gabinete disponível",
      VALIDATION_ERROR_TYPES.BUSINESS_RULE
    );
    return;
  }

  const gabineteSelecionado = gabinetesDisponiveis.find(
    (g) => g.nome === gabinete
  );
  if (!gabineteSelecionado) {
    result.addError(
      "gabinete",
      "Gabinete selecionado não está disponível",
      VALIDATION_ERROR_TYPES.INVALID_FORMAT,
      gabinete
    );
  }
}

/**
 * Valida modo de cálculo
 * @param {string} modo - Modo de cálculo
 * @param {ValidationResult} result - Resultado da validação
 */
function validateModo(modo, result) {
  if (!isRequired(modo, "modo")) {
    result.addError(
      "modo",
      "Modo de cálculo é obrigatório",
      VALIDATION_ERROR_TYPES.REQUIRED
    );
    return;
  }

  if (!VALIDATION_CONSTANTS.MODOS_PERMITIDOS.includes(modo)) {
    result.addError(
      "modo",
      `Modo deve ser: ${VALIDATION_CONSTANTS.MODOS_PERMITIDOS.join(", ")}`,
      VALIDATION_ERROR_TYPES.INVALID_FORMAT,
      modo
    );
  }
}

/**
 * Valida dados para modo gabinete
 * @param {Object} form - Dados do formulário
 * @param {ValidationResult} result - Resultado da validação
 */
function validateModoGabinete(form, result) {
  if (
    !isInRange(
      form.qtdLargura,
      VALIDATION_CONSTANTS.MIN_QTD_GABINETE,
      VALIDATION_CONSTANTS.MAX_QTD_GABINETE
    )
  ) {
    result.addError(
      "qtdLargura",
      `Quantidade de gabinetes na largura deve estar entre ${VALIDATION_CONSTANTS.MIN_QTD_GABINETE} e ${VALIDATION_CONSTANTS.MAX_QTD_GABINETE}`,
      VALIDATION_ERROR_TYPES.OUT_OF_RANGE,
      form.qtdLargura
    );
  }

  if (
    !isInRange(
      form.qtdAltura,
      VALIDATION_CONSTANTS.MIN_QTD_GABINETE,
      VALIDATION_CONSTANTS.MAX_QTD_GABINETE
    )
  ) {
    result.addError(
      "qtdAltura",
      `Quantidade de gabinetes na altura deve estar entre ${VALIDATION_CONSTANTS.MIN_QTD_GABINETE} e ${VALIDATION_CONSTANTS.MAX_QTD_GABINETE}`,
      VALIDATION_ERROR_TYPES.OUT_OF_RANGE,
      form.qtdAltura
    );
  }
}

/**
 * Valida dados para modo metro
 * @param {Object} form - Dados do formulário
 * @param {ValidationResult} result - Resultado da validação
 */
function validateModoMetro(form, result) {
  if (
    !isInRange(
      form.larguraM,
      VALIDATION_CONSTANTS.MIN_MEDIDA_METRO,
      VALIDATION_CONSTANTS.MAX_MEDIDA_METRO
    )
  ) {
    result.addError(
      "larguraM",
      `Largura em metros deve estar entre ${VALIDATION_CONSTANTS.MIN_MEDIDA_METRO} e ${VALIDATION_CONSTANTS.MAX_MEDIDA_METRO}`,
      VALIDATION_ERROR_TYPES.OUT_OF_RANGE,
      form.larguraM
    );
  }

  if (
    !isInRange(
      form.alturaM,
      VALIDATION_CONSTANTS.MIN_MEDIDA_METRO,
      VALIDATION_CONSTANTS.MAX_MEDIDA_METRO
    )
  ) {
    result.addError(
      "alturaM",
      `Altura em metros deve estar entre ${VALIDATION_CONSTANTS.MIN_MEDIDA_METRO} e ${VALIDATION_CONSTANTS.MAX_MEDIDA_METRO}`,
      VALIDATION_ERROR_TYPES.OUT_OF_RANGE,
      form.alturaM
    );
  }
}

/**
 * Valida configurações elétricas
 * @param {string} tensao - Tensão
 * @param {string} tipoRede - Tipo de rede
 * @param {ValidationResult} result - Resultado da validação
 */
function validateConfiguracoesEletricas(tensao, tipoRede, result) {
  if (!VALIDATION_CONSTANTS.TENSOES_PERMITIDAS.includes(tensao)) {
    result.addError(
      "tensao",
      `Tensão deve ser: ${VALIDATION_CONSTANTS.TENSOES_PERMITIDAS.join(", ")}`,
      VALIDATION_ERROR_TYPES.INVALID_FORMAT,
      tensao
    );
  }

  if (!VALIDATION_CONSTANTS.TIPOS_REDE_PERMITIDOS.includes(tipoRede)) {
    result.addError(
      "tipoRede",
      `Tipo de rede deve ser: ${VALIDATION_CONSTANTS.TIPOS_REDE_PERMITIDOS.join(
        ", "
      )}`,
      VALIDATION_ERROR_TYPES.INVALID_FORMAT,
      tipoRede
    );
  }

  // Regra de negócio: 220V monofásico não é permitido
  if (tensao === "220" && tipoRede === "monofasico") {
    result.addError(
      "tipoRede",
      "220V monofásico não é uma configuração válida. Use bifásico ou trifásico",
      VALIDATION_ERROR_TYPES.BUSINESS_RULE,
      { tensao, tipoRede }
    );
  }
}

/**
 * VALIDAÇÕES PRINCIPAIS
 */

/**
 * Valida formulário de painel completo
 * @param {Object} formData - Dados do formulário
 * @param {Array} gabinetesDisponiveis - Gabinetes disponíveis
 * @param {Array} paineisExistentes - Painéis já existentes (para verificar duplicidade)
 * @param {boolean} isEdicao - Se é uma edição (permite mesmo nome)
 * @returns {ValidationResult} - Resultado da validação
 */
export function validatePainelForm(
  formData,
  gabinetesDisponiveis = [],
  paineisExistentes = [],
  isEdicao = false
) {
  const result = new ValidationResult();

  try {
    // Validações básicas
    validateNomePainel(formData.nome, result);
    validateProjeto(formData.projeto, result);
    validateGabinete(formData.gabinete, gabinetesDisponiveis, result);
    validateModo(formData.modo, result);

    // Validações específicas por modo
    if (formData.modo === "gabinete") {
      validateModoGabinete(formData, result);
    } else if (formData.modo === "metro") {
      validateModoMetro(formData, result);
    }

    // Validar duplicidade de nome (apenas para criação)
    if (!isEdicao && formData.nome && formData.projeto) {
      const nomeDuplicado = paineisExistentes.some(
        (painel) =>
          painel.projeto === formData.projeto &&
          painel.nome.trim().toLowerCase() ===
            formData.nome.trim().toLowerCase()
      );

      if (nomeDuplicado) {
        result.addError(
          "nome",
          "Já existe um painel com este nome no projeto selecionado",
          VALIDATION_ERROR_TYPES.DUPLICATE,
          formData.nome
        );
      }
    }

    // Warnings para valores extremos
    if (formData.modo === "gabinete") {
      const totalGabinetes =
        (Number(formData.qtdLargura) || 0) * (Number(formData.qtdAltura) || 0);
      if (totalGabinetes > 100) {
        result.addWarning(
          "qtdTotal",
          `Painel com ${totalGabinetes} gabinetes é muito grande. Verifique se está correto`,
          totalGabinetes
        );
      }
    }

    if (formData.modo === "metro") {
      const area =
        (Number(formData.larguraM) || 0) * (Number(formData.alturaM) || 0);
      if (area > 50) {
        result.addWarning(
          "area",
          `Painel com ${area.toFixed(
            2
          )}m² é muito grande. Verifique se está correto`,
          area
        );
      }
    }
  } catch (error) {
    result.addError(
      "geral",
      `Erro interno de validação: ${error.message}`,
      VALIDATION_ERROR_TYPES.BUSINESS_RULE
    );
  }

  return result;
}

/**
 * Valida configurações elétricas
 * @param {string} tensao - Tensão selecionada
 * @param {string} tipoRede - Tipo de rede selecionado
 * @returns {ValidationResult} - Resultado da validação
 */
export function validateEletricConfig(tensao, tipoRede) {
  const result = new ValidationResult();
  validateConfiguracoesEletricas(tensao, tipoRede, result);
  return result;
}

/**
 * Valida dados de painel para cálculos
 * @param {Object} painelData - Dados do painel
 * @param {Object} gabinete - Dados do gabinete
 * @returns {ValidationResult} - Resultado da validação
 */
export function validatePainelForCalculation(painelData, gabinete) {
  const result = new ValidationResult();

  if (!gabinete) {
    result.addError(
      "gabinete",
      "Gabinete é necessário para cálculos",
      VALIDATION_ERROR_TYPES.REQUIRED
    );
    return result;
  }

  // Validar dados do gabinete
  if (
    !isInRange(
      gabinete.potencia,
      VALIDATION_CONSTANTS.MIN_POTENCIA,
      VALIDATION_CONSTANTS.MAX_POTENCIA
    )
  ) {
    result.addError(
      "gabinete.potencia",
      "Potência do gabinete inválida",
      VALIDATION_ERROR_TYPES.OUT_OF_RANGE,
      gabinete.potencia
    );
  }

  if (!gabinete.largura || !gabinete.altura) {
    result.addError(
      "gabinete.dimensoes",
      "Dimensões do gabinete são obrigatórias",
      VALIDATION_ERROR_TYPES.REQUIRED
    );
  }

  return result;
}

/**
 * UTILITÁRIOS DE SANITIZAÇÃO
 */

/**
 * Sanitiza dados do formulário
 * @param {Object} formData - Dados do formulário
 * @returns {Object} - Dados sanitizados
 */
export function sanitizePainelForm(formData) {
  return {
    nome: String(formData.nome || "").trim(),
    projeto: String(formData.projeto || "").trim(),
    gabinete: String(formData.gabinete || "").trim(),
    modo: String(formData.modo || "metro").trim(),
    qtdLargura: Math.max(1, parseInt(formData.qtdLargura) || 1),
    qtdAltura: Math.max(1, parseInt(formData.qtdAltura) || 1),
    larguraM: Math.max(0.01, parseFloat(formData.larguraM) || 0.01),
    alturaM: Math.max(0.01, parseFloat(formData.alturaM) || 0.01),
  };
}

/**
 * Remove caracteres especiais de nome
 * @param {string} nome - Nome a sanitizar
 * @returns {string} - Nome sanitizado
 */
export function sanitizeName(nome) {
  if (typeof nome !== "string") return "";

  return nome
    .trim()
    .replace(/[^\w\s\-áéíóúâêîôûàèìòùãõçÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÃÕÇ]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, " ") // Substitui múltiplos espaços por um
    .substring(0, VALIDATION_CONSTANTS.MAX_NOME_LENGTH); // Limita tamanho
}

/**
 * MENSAGENS DE ERRO PADRONIZADAS
 */

/**
 * Obtém mensagem de erro formatada
 * @param {Object} error - Erro de validação
 * @returns {string} - Mensagem formatada
 */
export function getErrorMessage(error) {
  const fieldNames = {
    nome: "Nome do painel",
    projeto: "Projeto",
    gabinete: "Gabinete",
    modo: "Modo de cálculo",
    qtdLargura: "Quantidade na largura",
    qtdAltura: "Quantidade na altura",
    larguraM: "Largura em metros",
    alturaM: "Altura em metros",
    tensao: "Tensão",
    tipoRede: "Tipo de rede",
  };

  const fieldName = fieldNames[error.field] || error.field;

  switch (error.type) {
    case VALIDATION_ERROR_TYPES.REQUIRED:
      return `${fieldName} é obrigatório`;

    case VALIDATION_ERROR_TYPES.DUPLICATE:
      return `${fieldName} já existe`;

    case VALIDATION_ERROR_TYPES.INVALID_FORMAT:
      return `${fieldName} possui formato inválido`;

    case VALIDATION_ERROR_TYPES.OUT_OF_RANGE:
      return `${fieldName} está fora da faixa permitida`;

    case VALIDATION_ERROR_TYPES.BUSINESS_RULE:
      return error.message;

    default:
      return error.message || `Erro em ${fieldName}`;
  }
}

/**
 * Exporta constantes para uso externo
 */
export { VALIDATION_CONSTANTS, ValidationResult };

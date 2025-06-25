// Constantes globais do aplicativo

export const APP_CONFIG = {
  // Configurações de API
  API_BASE_URL: "/api",

  // Configurações de timeout
  REQUEST_TIMEOUT: 5000,

  // Configurações de feedback
  FEEDBACK_DURATION: 3000,

  // Configurações de tensão e rede
  TENSOES_DISPONIVEIS: [
    { value: "220", label: "220V" },
    { value: "380", label: "380V" },
  ],

  TIPOS_REDE: {
    220: [
      { value: "bifasico", label: "Bifásico" },
      { value: "trifasico", label: "Trifásico" },
    ],
    380: [
      { value: "monofasico", label: "Monofásico" },
      { value: "bifasico", label: "Bifásico" },
      { value: "trifasico", label: "Trifásico" },
    ],
  },

  // Configurações de cálculo
  CALCULO_DEFAULTS: {
    FATOR_CONTEUDO: 0.33,
    CONSUMO_BASE_PERCENTUAL: 0.3,
  },

  // Tipos de gabinete
  TIPOS_GABINETE: [
    { value: "indoor", label: "Indoor" },
    { value: "outdoor", label: "Outdoor" },
  ],

  // Configurações de validação
  VALIDACAO: {
    MIN_LARGURA: 0.01,
    MIN_ALTURA: 0.01,
    MIN_PIXELS: 1,
    MIN_POTENCIA: 0.1,
    MIN_PESO: 0.1,
  },
};

// Funções utilitárias
export const UTILS = {
  formatNumber: (value, decimals = 2) => {
    if (value === undefined || isNaN(value)) return "-";
    return Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  formatDate: (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  },

  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
};

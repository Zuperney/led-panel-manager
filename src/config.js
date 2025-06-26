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

// Estilos centralizados do tema
export const THEME = {
  colors: {
    primary: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    background: {
      primary: "#181c27",
      secondary: "#23283a",
      tertiary: "#1a1d29",
    },
    border: "#3a4161",
    text: {
      primary: "#fff",
      secondary: "#b6c1e0",
      muted: "#9ca3af",
    },
  },

  styles: {
    card: {
      background: "#23283a",
      borderRadius: 12,
      border: "1px solid #3a4161",
      padding: 16,
    },

    button: {
      primary: {
        padding: "10px 16px",
        borderRadius: 6,
        border: "none",
        background: "#3b82f6",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 500,
      },
      success: {
        padding: "10px 16px",
        borderRadius: 6,
        border: "none",
        background: "#10b981",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 500,
      },
      warning: {
        padding: "10px 16px",
        borderRadius: 6,
        border: "none",
        background: "#f59e0b",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 500,
      },
    },

    input: {
      width: "100%",
      padding: 8,
      borderRadius: 6,
      border: "1px solid #3a4161",
      background: "#1a1d29",
      color: "#fff",
    },

    select: {
      width: "100%",
      padding: 8,
      borderRadius: 6,
      border: "1px solid #3a4161",
      background: "#1a1d29",
      color: "#fff",
    },
  },
};

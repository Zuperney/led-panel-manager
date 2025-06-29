/**
 * 🔧 Constantes do Módulo Painéis
 *
 * Centralizamos todas as constantes utilizadas no módulo de painéis
 * para facilitar manutenção e evitar magic numbers/strings.
 */

// Status de painéis
export const PAINEL_STATUS = {
  DRAFT: "rascunho",
  ACTIVE: "ativo",
  ARCHIVED: "arquivado",
  ERROR: "erro",
};

// Modos de cálculo
export const CALCULATION_MODES = {
  BY_CABINET: "gabinete",
  BY_METER: "metro",
};

// Tipos de rede elétrica
export const NETWORK_TYPES = {
  SINGLE_PHASE: "monofasico",
  TWO_PHASE: "bifasico",
  THREE_PHASE: "trifasico",
};

// Tensões disponíveis
export const VOLTAGES = {
  V220: "220",
  V380: "380",
};

// Configurações de tensão por tipo de rede
export const VOLTAGE_NETWORK_CONFIG = {
  [VOLTAGES.V220]: [NETWORK_TYPES.TWO_PHASE, NETWORK_TYPES.THREE_PHASE],
  [VOLTAGES.V380]: [
    NETWORK_TYPES.SINGLE_PHASE,
    NETWORK_TYPES.TWO_PHASE,
    NETWORK_TYPES.THREE_PHASE,
  ],
};

// Limites de validação
export const VALIDATION_LIMITS = {
  MIN_WIDTH: 0.01,
  MAX_WIDTH: 50,
  MIN_HEIGHT: 0.01,
  MAX_HEIGHT: 50,
  MIN_CABINETS: 1,
  MAX_CABINETS: 100,
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
};

// Cores para UI
export const UI_COLORS = {
  PRIMARY: "blue",
  SUCCESS: "green",
  WARNING: "yellow",
  ERROR: "red",
  INFO: "purple",
};

// Mensagens de feedback
export const FEEDBACK_MESSAGES = {
  CREATED: "Painel criado com sucesso!",
  UPDATED: "Painel atualizado com sucesso!",
  DELETED: "Painel removido com sucesso!",
  DUPLICATED: "Painel duplicado com sucesso!",
  ERROR_CREATE: "Erro ao criar painel",
  ERROR_UPDATE: "Erro ao atualizar painel",
  ERROR_DELETE: "Erro ao remover painel",
  ERROR_DUPLICATE: "Erro ao duplicar painel",
  ERROR_DUPLICATE_NAME: "Já existe um painel com esse nome neste projeto",
  ERROR_INVALID_DATA: "Dados inválidos fornecidos",
};

// Configurações de animação
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.5,
    SLOW: 0.8,
  },
  STAGGER: 0.1,
  SPRING: {
    type: "spring",
    stiffness: 100,
    damping: 15,
  },
};

// Configurações de cálculo
export const CALCULATION_CONFIG = {
  DEFAULT_BRIGHTNESS: 100,
  MEDIUM_BRIGHTNESS: 50,
  CONTENT_FACTOR: 0.33,
  BASE_CONSUMPTION_FACTOR: 0.3,
  POWER_FACTOR: 0.85,
};

// Módulos do sistema (para tracking de refatoração)
export const PAINEL_CONSTANTS = {
  MODULES: [
    "PainelForm",
    "PainelList",
    "PainelStats",
    "PainelToolbar",
    "PainelModals",
  ],
  HOOKS: [
    "usePainelForm",
    "usePainelCrud",
    "usePainelCalculations",
    "usePainelFiltering",
  ],
  SERVICES: ["painelApi", "painelCalculations", "painelPersistence"],
};

// Configurações de exibição
export const DISPLAY_CONFIG = {
  ITEMS_PER_PAGE: 20,
  CARD_ANIMATION_DELAY: 0.1,
  LIST_VIEW_MODES: ["grid", "list"],
  DEFAULT_VIEW_MODE: "grid",
};

// Chaves de localStorage
export const STORAGE_KEYS = {
  SELECTED_PROJECT: "selectedProjectId",
  VIEW_MODE: "painelViewMode",
  FORM_CACHE: "painelFormCache",
  FILTER_PREFERENCES: "painelFilterPreferences",
};

// Formatação de dados
export const FORMAT_CONFIG = {
  CURRENCY: "pt-BR",
  DECIMAL_PLACES: {
    AREA: 2,
    POWER: 0,
    VOLTAGE: 1,
    CURRENT: 2,
  },
  UNITS: {
    AREA: "m²",
    POWER: "W",
    VOLTAGE: "V",
    CURRENT: "A",
    WEIGHT: "kg",
    DIMENSION: "m",
  },
};

// Configurações de debounce
export const DEBOUNCE_CONFIG = {
  SEARCH: 300,
  CALCULATION: 500,
  SAVE: 1000,
};

// URLs de ajuda/documentação
export const HELP_URLS = {
  CALCULATION_GUIDE: "/docs/painel-calculations",
  CABINET_GUIDE: "/docs/cabinet-selection",
  POWER_GUIDE: "/docs/power-consumption",
};

export default {
  PAINEL_STATUS,
  CALCULATION_MODES,
  NETWORK_TYPES,
  VOLTAGES,
  VOLTAGE_NETWORK_CONFIG,
  VALIDATION_LIMITS,
  UI_COLORS,
  FEEDBACK_MESSAGES,
  ANIMATION_CONFIG,
  CALCULATION_CONFIG,
  PAINEL_CONSTANTS,
  DISPLAY_CONFIG,
  STORAGE_KEYS,
  FORMAT_CONFIG,
  DEBOUNCE_CONFIG,
  HELP_URLS,
};

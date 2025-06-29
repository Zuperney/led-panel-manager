// 📁 Índice de Componentes do Módulo Painéis
// Re-exporta todos os componentes para facilitar imports

// ✅ Componentes implementados na Etapa 1.5
export { default as PainelForm } from "./PainelForm";
export { default as PainelList } from "./PainelList";
export { default as PainelStats } from "./PainelStats";
export { default as PainelToolbar } from "./PainelToolbar";
export { default as PainelModals } from "./PainelModals";

// Componentes organizados por categoria
export const FormComponents = {
  PainelForm: require("./PainelForm").default,
};

export const ListComponents = {
  PainelList: require("./PainelList").default,
};

export const UIComponents = {
  PainelStats: require("./PainelStats").default,
  PainelToolbar: require("./PainelToolbar").default,
  PainelModals: require("./PainelModals").default,
};

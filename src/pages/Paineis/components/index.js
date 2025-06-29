// 📁 Índice de Componentes do Módulo Painéis
// Re-exporta todos os componentes para facilitar imports

// ✅ Componentes implementados na Etapa 1.5
import PainelForm from "./PainelForm";
import PainelList from "./PainelList";
import PainelStats from "./PainelStats";
import PainelToolbar from "./PainelToolbar";
import PainelModals from "./PainelModals";

export { PainelForm, PainelList, PainelStats, PainelToolbar, PainelModals };

// Componentes organizados por categoria
export const FormComponents = {
  PainelForm,
};

export const ListComponents = {
  PainelList,
};

export const UIComponents = {
  PainelStats,
  PainelToolbar,
  PainelModals,
};

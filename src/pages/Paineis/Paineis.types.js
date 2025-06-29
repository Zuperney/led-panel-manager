/**
 * 🎯 Definições de Tipos - Módulo Painéis
 *
 * Define todos os tipos, interfaces e PropTypes utilizados no módulo de painéis.
 * Facilita validação de props e documentação dos dados.
 */

import PropTypes from "prop-types";

// =====================================
// TIPOS DE DADOS PRINCIPAIS
// =====================================

/**
 * Estrutura de um Painel LED
 */
export const PainelType = PropTypes.shape({
  // Identificação
  nome: PropTypes.string.isRequired,
  projeto: PropTypes.string.isRequired,

  // Configuração técnica
  gabinete: PropTypes.string.isRequired,
  modo: PropTypes.oneOf(["gabinete", "metro"]).isRequired,

  // Dimensões por gabinetes
  qtdLargura: PropTypes.number,
  qtdAltura: PropTypes.number,

  // Dimensões em metros
  larguraM: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  alturaM: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // Características calculadas
  largura: PropTypes.number, // em metros
  altura: PropTypes.number, // em metros
  area: PropTypes.number, // em m²
  peso: PropTypes.number, // em kg
  pixelsLargura: PropTypes.number,
  pixelsAltura: PropTypes.number,

  // Configuração elétrica
  tensao: PropTypes.oneOf(["220", "380"]),
  tipoRede: PropTypes.oneOf(["monofasico", "bifasico", "trifasico"]),
  potencia: PropTypes.number, // em Watts

  // Metadados
  _createdAt: PropTypes.number,
  _updatedAt: PropTypes.number,
  status: PropTypes.oneOf(["rascunho", "ativo", "arquivado", "erro"]),
});

/**
 * Estrutura de um Gabinete
 */
export const GabineteType = PropTypes.shape({
  nome: PropTypes.string.isRequired,
  tipo: PropTypes.string,
  largura: PropTypes.number.isRequired, // em mm
  altura: PropTypes.number.isRequired, // em mm
  pixelPitch: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  potencia: PropTypes.number.isRequired, // em Watts
  peso: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fabricante: PropTypes.string,
  pixelsLargura: PropTypes.number,
  pixelsAltura: PropTypes.number,
});

/**
 * Estrutura de um Projeto
 */
export const ProjetoType = PropTypes.shape({
  nome: PropTypes.string.isRequired,
  cliente: PropTypes.string,
  descricao: PropTypes.string,
  dataEntrega: PropTypes.string,
  status: PropTypes.string,
  _createdAt: PropTypes.number,
});

// =====================================
// TIPOS DE FORMULÁRIOS
// =====================================

/**
 * Dados do formulário de painel
 */
export const PainelFormType = PropTypes.shape({
  projeto: PropTypes.string.isRequired,
  nome: PropTypes.string.isRequired,
  modo: PropTypes.oneOf(["gabinete", "metro"]).isRequired,
  gabinete: PropTypes.string.isRequired,
  qtdLargura: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  qtdAltura: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  larguraM: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  alturaM: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

/**
 * Resultado de cálculo de painel
 */
export const CalculationResultType = PropTypes.shape({
  largura: PropTypes.number,
  altura: PropTypes.number,
  area: PropTypes.number,
  peso: PropTypes.number,
  pixelsLargura: PropTypes.number,
  pixelsAltura: PropTypes.number,
  potencia: PropTypes.number,
});

/**
 * Informações de energia elétrica
 */
export const EnergyInfoType = PropTypes.shape({
  potenciaVA: PropTypes.number,
  corrente: PropTypes.number,
  descricao: PropTypes.string,
  fator: PropTypes.number,
});

// =====================================
// TIPOS DE COMPONENTES
// =====================================

/**
 * Props do componente principal Paineis
 */
export const PaineisProps = PropTypes.shape({
  isActive: PropTypes.bool,
});

/**
 * Props de componentes de card/lista
 */
export const PainelCardProps = PropTypes.shape({
  painel: PainelType.isRequired,
  gabinetes: PropTypes.arrayOf(GabineteType),
  isSelected: PropTypes.bool,
  isRecenteAdicionado: PropTypes.bool,
  onSelect: PropTypes.func,
  onEdit: PropTypes.func,
  onDuplicate: PropTypes.func,
  onRemove: PropTypes.func,
  index: PropTypes.number,
});

/**
 * Props de componentes de formulário
 */
export const PainelFormProps = PropTypes.shape({
  form: PainelFormType.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  resultado: CalculationResultType,
  energia: EnergyInfoType,
  gabinetes: PropTypes.arrayOf(GabineteType),
  projetos: PropTypes.arrayOf(ProjetoType),
  editando: PropTypes.number,
  loading: PropTypes.bool,
});

/**
 * Props de toolbar/filtros
 */
export const PainelToolbarProps = PropTypes.shape({
  busca: PropTypes.string,
  setBusca: PropTypes.func.isRequired,
  filtroGabinete: PropTypes.string,
  setFiltroGabinete: PropTypes.func,
  ordenacao: PropTypes.string,
  setOrdenacao: PropTypes.func,
  viewMode: PropTypes.oneOf(["grid", "list"]),
  setViewMode: PropTypes.func,
  temFiltrosAtivos: PropTypes.bool,
  limparFiltros: PropTypes.func,
  gabinetes: PropTypes.arrayOf(GabineteType),
});

/**
 * Props de estatísticas
 */
export const PainelStatsProps = PropTypes.shape({
  paineis: PropTypes.arrayOf(PainelType),
  gabinetes: PropTypes.arrayOf(GabineteType),
  loading: PropTypes.bool,
});

// =====================================
// TIPOS DE HOOKS
// =====================================

/**
 * Retorno do hook usePainelForm
 */
export const UsePainelFormReturn = PropTypes.shape({
  form: PainelFormType.isRequired,
  setForm: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
});

/**
 * Retorno do hook usePainelCrud
 */
export const UsePainelCrudReturn = PropTypes.shape({
  paineis: PropTypes.arrayOf(PainelType),
  loading: PropTypes.bool,
  error: PropTypes.string,
  createPainel: PropTypes.func.isRequired,
  updatePainel: PropTypes.func.isRequired,
  deletePainel: PropTypes.func.isRequired,
  duplicatePainel: PropTypes.func.isRequired,
});

/**
 * Retorno do hook usePainelCalculations
 */
export const UsePainelCalculationsReturn = PropTypes.shape({
  resultado: CalculationResultType,
  energia: EnergyInfoType,
  potenciaDetalhe: PropTypes.object,
  calculating: PropTypes.bool,
  error: PropTypes.string,
});

/**
 * Retorno do hook usePainelFiltering
 */
export const UsePainelFilteringReturn = PropTypes.shape({
  paineisFiltrados: PropTypes.arrayOf(PainelType),
  busca: PropTypes.string,
  setBusca: PropTypes.func.isRequired,
  filtros: PropTypes.object,
  setFiltros: PropTypes.func,
  ordenacao: PropTypes.string,
  setOrdenacao: PropTypes.func,
  limparFiltros: PropTypes.func.isRequired,
  temFiltrosAtivos: PropTypes.bool,
});

// =====================================
// TIPOS DE MODAIS
// =====================================

/**
 * Props de modal de confirmação
 */
export const ConfirmModalProps = PropTypes.shape({
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["info", "warning", "error", "success"]),
});

// =====================================
// CONSTANTES DE TIPOS
// =====================================

export const PAINEL_MODES = ["gabinete", "metro"];
export const NETWORK_TYPES = ["monofasico", "bifasico", "trifasico"];
export const VOLTAGES = ["220", "380"];
export const PAINEL_STATUS_OPTIONS = ["rascunho", "ativo", "arquivado", "erro"];
export const VIEW_MODES = ["grid", "list"];

// =====================================
// TIPOS PARA TYPESCRIPT (se migrar)
// =====================================

// Estes comentários servem como referência para futura migração para TypeScript
/*
export interface Painel {
  nome: string;
  projeto: string;
  gabinete: string;
  modo: 'gabinete' | 'metro';
  qtdLargura?: number;
  qtdAltura?: number;
  larguraM?: string | number;
  alturaM?: string | number;
  largura?: number;
  altura?: number;
  area?: number;
  peso?: number;
  pixelsLargura?: number;
  pixelsAltura?: number;
  tensao?: '220' | '380';
  tipoRede?: 'monofasico' | 'bifasico' | 'trifasico';
  potencia?: number;
  _createdAt?: number;
  _updatedAt?: number;
  status?: 'rascunho' | 'ativo' | 'arquivado' | 'erro';
}

export interface Gabinete {
  nome: string;
  tipo?: string;
  largura: number;
  altura: number;
  pixelPitch?: string | number;
  potencia: number;
  peso?: string | number;
  fabricante?: string;
  pixelsLargura?: number;
  pixelsAltura?: number;
}
*/

export default {
  PainelType,
  GabineteType,
  ProjetoType,
  PainelFormType,
  CalculationResultType,
  EnergyInfoType,
  PaineisProps,
  PainelCardProps,
  PainelFormProps,
  PainelToolbarProps,
  PainelStatsProps,
  UsePainelFormReturn,
  UsePainelCrudReturn,
  UsePainelCalculationsReturn,
  UsePainelFilteringReturn,
  ConfirmModalProps,
  PAINEL_MODES,
  NETWORK_TYPES,
  VOLTAGES,
  PAINEL_STATUS_OPTIONS,
  VIEW_MODES,
};

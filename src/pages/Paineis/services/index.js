/**
 * Índice dos serviços do módulo Painéis
 *
 * Centraliza todas as exportações dos serviços para facilitar importação
 * e manter organização modular.
 *
 * @author Led Panel Manager Team
 * @since 1.4.0
 */

// Serviço de API
export * from "./painelApi";

// Serviço de cálculos
export * from "./painelCalculations";

// Serviço de validações
export * from "./painelValidation";

// Re-exports organizados por categoria
import * as painelApi from "./painelApi";
import * as painelCalculations from "./painelCalculations";
import * as painelValidation from "./painelValidation";

export { painelApi, painelCalculations, painelValidation };

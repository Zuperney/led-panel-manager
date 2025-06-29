/**
 * Serviço de cálculos para painéis LED
 * 
 * Responsabilidades:
 * - Cálculos de dimensões por gabinete e metro
 * - Cálculos de potência (máxima, média, realista)
 * - Cálculos de energia e corrente elétrica
 * - Validações de entrada robustas
 * - Formatação de resultados
 * - Cache de cálculos complexos
 * 
 * @author Led Panel Manager Team
 * @since 1.4.0
 */

/**
 * Constantes para cálculos
 */
const CALCULATION_CONSTANTS = {
  // Fatores de potência e consumo
  FATOR_POTENCIA_LED: 0.92,
  FATOR_CONTEUDO_PADRAO: 0.33, // 33% do conteúdo é branco em média
  CONSUMO_BASE_PERCENTUAL: 0.3, // 30% de consumo base
  
  // Limites de validação
  MIN_DIMENSAO_GABINETE: 1,
  MAX_DIMENSAO_GABINETE: 1000,
  MIN_DIMENSAO_METRO: 0.01,
  MAX_DIMENSAO_METRO: 100,
  MIN_POTENCIA: 0,
  MAX_POTENCIA: 100000,
  
  // Configurações de cache
  CACHE_TTL: 60000, // 1 minuto para cálculos
};

/**
 * Cache para cálculos computacionalmente intensivos
 */
const calculationCache = new Map();

/**
 * Classe de erro para cálculos
 */
class CalculationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'CalculationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * UTILITÁRIOS DE VALIDAÇÃO
 */

/**
 * Valida se um número está dentro do range especificado
 * @param {any} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {string} fieldName - Nome do campo (para erro)
 * @returns {number} - Valor validado
 */
function validateNumber(value, min, max, fieldName) {
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) {
    throw new CalculationError(
      `${fieldName} deve ser um número válido`,
      fieldName,
      value
    );
  }
  
  if (num < min || num > max) {
    throw new CalculationError(
      `${fieldName} deve estar entre ${min} e ${max}`,
      fieldName,
      value
    );
  }
  
  return num;
}

/**
 * Valida dados do gabinete
 * @param {Object} gabinete - Objeto gabinete
 * @returns {Object} - Gabinete validado
 */
function validateGabinete(gabinete) {
  if (!gabinete || typeof gabinete !== 'object') {
    throw new CalculationError('Gabinete é obrigatório', 'gabinete', gabinete);
  }
  
  return {
    largura: validateNumber(
      gabinete.largura, 
      CALCULATION_CONSTANTS.MIN_DIMENSAO_GABINETE, 
      CALCULATION_CONSTANTS.MAX_DIMENSAO_GABINETE * 1000, // mm
      'largura do gabinete'
    ),
    altura: validateNumber(
      gabinete.altura, 
      CALCULATION_CONSTANTS.MIN_DIMENSAO_GABINETE, 
      CALCULATION_CONSTANTS.MAX_DIMENSAO_GABINETE * 1000, // mm
      'altura do gabinete'
    ),
    pixels_largura: validateNumber(
      gabinete.pixels_largura || 0, 
      0, 
      10000, 
      'pixels largura do gabinete'
    ),
    pixels_altura: validateNumber(
      gabinete.pixels_altura || 0, 
      0, 
      10000, 
      'pixels altura do gabinete'
    ),
    peso: validateNumber(
      gabinete.peso || 0, 
      0, 
      1000, 
      'peso do gabinete'
    ),
    potencia: validateNumber(
      gabinete.potencia || 0, 
      CALCULATION_CONSTANTS.MIN_POTENCIA, 
      CALCULATION_CONSTANTS.MAX_POTENCIA, 
      'potência do gabinete'
    ),
    nome: gabinete.nome || 'Gabinete sem nome',
    tipo: gabinete.tipo || 'indefinido'
  };
}

/**
 * Gera chave de cache para cálculos
 * @param {string} type - Tipo de cálculo
 * @param {Array} params - Parâmetros do cálculo
 */
function getCacheKey(type, ...params) {
  return `${type}_${params.map(p => JSON.stringify(p)).join('_')}`;
}

/**
 * Verifica se cache é válido
 * @param {Object} cacheItem - Item do cache
 */
function isCacheValid(cacheItem) {
  return cacheItem && (Date.now() - cacheItem.timestamp) < CALCULATION_CONSTANTS.CACHE_TTL;
}

/**
 * CÁLCULOS PRINCIPAIS
 */

/**
 * Calcula painel baseado em quantidade de gabinetes
 * @param {Object} gabinete - Dados do gabinete
 * @param {number} qtdLargura - Quantidade de gabinetes na largura
 * @param {number} qtdAltura - Quantidade de gabinetes na altura
 * @returns {Object} - Resultado do cálculo
 */
export function calcularPainelPorGabinete(gabinete, qtdLargura, qtdAltura) {
  try {
    // Gerar chave de cache
    const cacheKey = getCacheKey('gabinete', gabinete, qtdLargura, qtdAltura);
    const cached = calculationCache.get(cacheKey);
    
    if (isCacheValid(cached)) {
      return cached.data;
    }
    
    // Validações
    const gabineteLimpo = validateGabinete(gabinete);
    const qtdLarg = validateNumber(
      qtdLargura, 
      CALCULATION_CONSTANTS.MIN_DIMENSAO_GABINETE, 
      CALCULATION_CONSTANTS.MAX_DIMENSAO_GABINETE, 
      'quantidade largura'
    );
    const qtdAlt = validateNumber(
      qtdAltura, 
      CALCULATION_CONSTANTS.MIN_DIMENSAO_GABINETE, 
      CALCULATION_CONSTANTS.MAX_DIMENSAO_GABINETE, 
      'quantidade altura'
    );
    
    // Cálculos
    const largura = (gabineteLimpo.largura * qtdLarg) / 1000; // metros
    const altura = (gabineteLimpo.altura * qtdAlt) / 1000; // metros
    const area = largura * altura;
    const pixelsLargura = gabineteLimpo.pixels_largura * qtdLarg;
    const pixelsAltura = gabineteLimpo.pixels_altura * qtdAlt;
    const peso = gabineteLimpo.peso * qtdLarg * qtdAlt;
    const potencia = gabineteLimpo.potencia * qtdLarg * qtdAlt;
    
    // Quantidade total de gabinetes
    const qtdGabinetes = qtdLarg * qtdAlt;
    
    const resultado = {
      largura: Number(largura.toFixed(3)),
      altura: Number(altura.toFixed(3)),
      area: Number(area.toFixed(3)),
      pixelsLargura,
      pixelsAltura,
      peso: Number(peso.toFixed(2)),
      potencia: Number(potencia.toFixed(2)),
      qtdLargura: qtdLarg,
      qtdAltura: qtdAlt,
      qtdGabinetes,
      gabinete: gabineteLimpo.nome,
      calculadoPor: 'gabinete',
      timestamp: Date.now()
    };
    
    // Armazenar no cache
    calculationCache.set(cacheKey, {
      data: resultado,
      timestamp: Date.now()
    });
    
    return resultado;
    
  } catch (error) {
    console.error('Erro no cálculo por gabinete:', error);
    throw error;
  }
}

/**
 * Calcula painel baseado em medidas em metros
 * @param {Object} gabinete - Dados do gabinete
 * @param {number} larguraM - Largura desejada em metros
 * @param {number} alturaM - Altura desejada em metros
 * @returns {Object} - Resultado do cálculo
 */
export function calcularPainelPorMetro(gabinete, larguraM, alturaM) {
  try {
    // Gerar chave de cache
    const cacheKey = getCacheKey('metro', gabinete, larguraM, alturaM);
    const cached = calculationCache.get(cacheKey);
    
    if (isCacheValid(cached)) {
      return cached.data;
    }
    
    // Validações
    const gabineteLimpo = validateGabinete(gabinete);
    const largM = validateNumber(
      larguraM, 
      CALCULATION_CONSTANTS.MIN_DIMENSAO_METRO, 
      CALCULATION_CONSTANTS.MAX_DIMENSAO_METRO, 
      'largura em metros'
    );
    const altM = validateNumber(
      alturaM, 
      CALCULATION_CONSTANTS.MIN_DIMENSAO_METRO, 
      CALCULATION_CONSTANTS.MAX_DIMENSAO_METRO, 
      'altura em metros'
    );
    
    // Calcular quantidade de gabinetes necessários
    const qtdLargura = Math.round((largM * 1000) / gabineteLimpo.largura);
    const qtdAltura = Math.round((altM * 1000) / gabineteLimpo.altura);
    
    // Calcular usando função de gabinetes
    const resultado = calcularPainelPorGabinete(gabinete, qtdLargura, qtdAltura);
    
    // Adicionar informações específicas do cálculo por metro
    const resultadoMetro = {
      ...resultado,
      larguraDesejada: largM,
      alturaDesejada: altM,
      calculadoPor: 'metro',
      diferencaLargura: Number((resultado.largura - largM).toFixed(3)),
      diferencaAltura: Number((resultado.altura - altM).toFixed(3))
    };
    
    // Armazenar no cache
    calculationCache.set(cacheKey, {
      data: resultadoMetro,
      timestamp: Date.now()
    });
    
    return resultadoMetro;
    
  } catch (error) {
    console.error('Erro no cálculo por metro:', error);
    throw error;
  }
}

/**
 * CÁLCULOS DE ENERGIA E POTÊNCIA
 */

/**
 * Calcula corrente e potência aparente
 * @param {number} potenciaW - Potência em watts
 * @param {string} tipoRede - Tipo de rede elétrica
 * @param {string} tensao - Tensão da rede
 * @returns {Object} - Dados de energia calculados
 */
export function calcularEnergia(potenciaW, tipoRede = 'monofasico', tensao = '220') {
  try {
    const potencia = validateNumber(
      potenciaW, 
      CALCULATION_CONSTANTS.MIN_POTENCIA, 
      CALCULATION_CONSTANTS.MAX_POTENCIA, 
      'potência'
    );
    
    const tensaoNum = validateNumber(tensao, 110, 480, 'tensão');
    
    if (!['monofasico', 'bifasico', 'trifasico'].includes(tipoRede)) {
      throw new CalculationError(
        'Tipo de rede deve ser: monofasico, bifasico ou trifasico',
        'tipoRede',
        tipoRede
      );
    }
    
    const fatorPotencia = CALCULATION_CONSTANTS.FATOR_POTENCIA_LED;
    const potenciaVA = potencia / fatorPotencia;
    let corrente = 0;
    let descricao = '';
    
    switch (tipoRede) {
      case 'monofasico':
        corrente = potenciaVA / tensaoNum;
        descricao = `Monofásico ${tensaoNum}V: ${corrente.toFixed(2)} A`;
        break;
        
      case 'bifasico':
        corrente = potenciaVA / tensaoNum / 2;
        descricao = `Bifásico ${tensaoNum}V: ${corrente.toFixed(2)} A por fase`;
        break;
        
      case 'trifasico':
        corrente = potenciaVA / (tensaoNum * Math.sqrt(3));
        descricao = `Trifásico ${tensaoNum}V: ${corrente.toFixed(2)} A por fase`;
        break;
    }
    
    return {
      potenciaW: Number(potencia.toFixed(2)),
      potenciaVA: Number(potenciaVA.toFixed(2)),
      corrente: Number(corrente.toFixed(2)),
      tensao: tensaoNum,
      tipoRede,
      fatorPotencia,
      descricao,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error('Erro no cálculo de energia:', error);
    throw error;
  }
}

/**
 * Calcula potência realista considerando brilho e conteúdo
 * @param {Object} gabinete - Dados do gabinete
 * @param {number} qtdGabinetes - Quantidade de gabinetes
 * @param {number} brilhoPercentual - Percentual de brilho (0-100)
 * @param {number} fatorConteudo - Fator de conteúdo (padrão 0.33)
 * @param {number} consumoBasePercentual - Consumo base (padrão 0.3)
 * @returns {Object} - Cálculo detalhado de potência
 */
export function calcularPotenciaFinal(
  gabinete, 
  qtdGabinetes, 
  brilhoPercentual, 
  fatorConteudo = CALCULATION_CONSTANTS.FATOR_CONTEUDO_PADRAO,
  consumoBasePercentual = CALCULATION_CONSTANTS.CONSUMO_BASE_PERCENTUAL
) {
  try {
    // Validações
    const gabineteLimpo = validateGabinete(gabinete);
    const qtdGab = validateNumber(qtdGabinetes, 1, 10000, 'quantidade de gabinetes');
    const brilho = validateNumber(brilhoPercentual, 0, 100, 'brilho percentual');
    const fConteudo = validateNumber(fatorConteudo, 0, 1, 'fator de conteúdo');
    const cBase = validateNumber(consumoBasePercentual, 0, 1, 'consumo base');
    
    // Cálculos
    const P_total_max = gabineteLimpo.potencia * qtdGab;
    const pwm = Math.pow(brilho / 100, 2); // Correção gamma
    const P_brilho = P_total_max * pwm;
    const P_conteudo = P_brilho * fConteudo;
    const P_base = P_total_max * cBase;
    const P_final = P_conteudo + P_base;
    
    return {
      P_total_max: Number(P_total_max.toFixed(2)),
      pwm: Number(pwm.toFixed(4)),
      P_brilho: Number(P_brilho.toFixed(2)),
      P_conteudo: Number(P_conteudo.toFixed(2)),
      P_base: Number(P_base.toFixed(2)),
      P_final: Number(P_final.toFixed(2)),
      brilhoPercentual: brilho,
      fatorConteudo: fConteudo,
      consumoBasePercentual: cBase,
      qtdGabinetes: qtdGab,
      gabinete: gabineteLimpo.nome,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error('Erro no cálculo de potência final:', error);
    throw error;
  }
}

/**
 * Calcula corrente total simples
 * @param {number} potenciaW - Potência em watts
 * @param {string} tensao - Tensão
 * @returns {number} - Corrente em ampères
 */
export function calcularIntensidade(potenciaW, tensao = '220') {
  try {
    const potencia = validateNumber(
      potenciaW, 
      CALCULATION_CONSTANTS.MIN_POTENCIA, 
      CALCULATION_CONSTANTS.MAX_POTENCIA, 
      'potência'
    );
    const tensaoNum = validateNumber(tensao, 110, 480, 'tensão');
    
    const fatorPotencia = CALCULATION_CONSTANTS.FATOR_POTENCIA_LED;
    const potenciaVA = potencia / fatorPotencia;
    const corrente = potenciaVA / tensaoNum;
    
    return Number(corrente.toFixed(2));
    
  } catch (error) {
    console.error('Erro no cálculo de intensidade:', error);
    throw error;
  }
}

/**
 * UTILITÁRIOS E FORMATAÇÃO
 */

/**
 * Formata número para exibição
 * @param {number} value - Valor numérico
 * @param {number} decimals - Casas decimais
 * @param {string} locale - Locale para formatação
 * @returns {string} - Número formatado
 */
export function formatNumber(value, decimals = 2, locale = 'pt-BR') {
  if (value === undefined || value === null || isNaN(value)) {
    return '-';
  }
  
  return Number(value).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formata resultado de cálculo para exibição
 * @param {Object} resultado - Resultado do cálculo
 * @returns {Object} - Resultado formatado
 */
export function formatCalculationResult(resultado) {
  if (!resultado) return null;
  
  return {
    ...resultado,
    larguraFormatada: `${formatNumber(resultado.largura, 2)} m`,
    alturaFormatada: `${formatNumber(resultado.altura, 2)} m`,
    areaFormatada: `${formatNumber(resultado.area, 2)} m²`,
    pesoFormatado: `${formatNumber(resultado.peso, 1)} kg`,
    potenciaFormatada: `${formatNumber(resultado.potencia, 0)} W`,
    resolucaoFormatada: `${resultado.pixelsLargura} × ${resultado.pixelsAltura} pixels`
  };
}

/**
 * GESTÃO DE CACHE
 */

/**
 * Limpa cache de cálculos
 */
export function clearCalculationCache() {
  calculationCache.clear();
  console.log('🧹 Cache de cálculos limpo');
}

/**
 * Obtém estatísticas do cache de cálculos
 * @returns {Object} - Estatísticas do cache
 */
export function getCalculationCacheStats() {
  const entries = Array.from(calculationCache.entries());
  const validEntries = entries.filter(([_, value]) => isCacheValid(value));
  
  return {
    total: calculationCache.size,
    valid: validEntries.length,
    expired: calculationCache.size - validEntries.length,
    hitRate: validEntries.length / (calculationCache.size || 1),
    memory: JSON.stringify(Array.from(calculationCache.values())).length
  };
}

/**
 * Exporta constantes para uso externo
 */
export { CALCULATION_CONSTANTS, CalculationError };

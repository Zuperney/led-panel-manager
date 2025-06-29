/**
 * Serviço de API para operações de painéis
 *
 * Responsabilidades:
 * - Operações CRUD com backend
 * - Tratamento de erros padronizado
 * - Cache de requisições
 * - Validação de responses
 * - Retry automático
 *
 * @author Led Panel Manager Team
 * @since 1.4.0
 */

/**
 * Configurações padrão da API
 */
const API_CONFIG = {
  baseUrl: "/api",
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * Cache simples para requisições
 */
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Classe de erro customizada para API
 */
export class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

/**
 * Utilitário para delay
 * @param {number} ms - Milissegundos para aguardar
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Realiza requisição HTTP com retry e tratamento de erros
 * @param {string} url - URL da requisição
 * @param {Object} options - Opções do fetch
 * @returns {Promise<any>} - Response parseado
 */
async function fetchWithRetry(url, options = {}) {
  let lastError;

  for (let attempt = 1; attempt <= API_CONFIG.retryAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.timeout
      );

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          url
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;

      if (attempt < API_CONFIG.retryAttempts) {
        console.warn(
          `Tentativa ${attempt} falhou para ${url}. Tentando novamente...`
        );
        await delay(API_CONFIG.retryDelay * attempt);
      }
    }
  }

  throw lastError;
}

/**
 * Gera chave de cache
 * @param {string} endpoint - Endpoint da API
 * @param {Object} params - Parâmetros da requisição
 */
function getCacheKey(endpoint, params = {}) {
  return `${endpoint}_${JSON.stringify(params)}`;
}

/**
 * Verifica se item do cache ainda é válido
 * @param {Object} cacheItem - Item do cache
 */
function isCacheValid(cacheItem) {
  return cacheItem && Date.now() - cacheItem.timestamp < CACHE_TTL;
}

/**
 * OPERAÇÕES CRUD PARA PAINÉIS
 */

/**
 * Busca todos os painéis
 * @param {boolean} useCache - Se deve usar cache
 * @returns {Promise<Array>} - Lista de painéis
 */
export async function fetchPaineis(useCache = true) {
  const cacheKey = getCacheKey("paineis");

  if (useCache) {
    const cached = cache.get(cacheKey);
    if (isCacheValid(cached)) {
      console.log("🎯 Painéis carregados do cache");
      return cached.data;
    }
  }

  try {
    console.log("🌐 Buscando painéis da API...");
    const data = await fetchWithRetry(`${API_CONFIG.baseUrl}/paineis`);

    // Armazena no cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    console.log(`✅ ${data.length} painéis carregados com sucesso`);
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar painéis:", error);
    throw new ApiError(
      `Falha ao carregar painéis: ${error.message}`,
      error.status || 500,
      "paineis"
    );
  }
}

/**
 * Salva lista completa de painéis
 * @param {Array} paineis - Lista de painéis
 * @returns {Promise<boolean>} - Sucesso da operação
 */
export async function savePaineis(paineis) {
  try {
    console.log(`💾 Salvando ${paineis.length} painéis...`);

    await fetchWithRetry(`${API_CONFIG.baseUrl}/paineis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paineis),
    });

    // Invalida cache
    cache.delete(getCacheKey("paineis"));

    console.log("✅ Painéis salvos com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Erro ao salvar painéis:", error);
    throw new ApiError(
      `Falha ao salvar painéis: ${error.message}`,
      error.status || 500,
      "paineis"
    );
  }
}

/**
 * Cria um novo painel
 * @param {Object} painel - Dados do painel
 * @returns {Promise<Object>} - Painel criado
 */
export async function createPainel(painel) {
  try {
    console.log("🆕 Criando novo painel:", painel.nome);

    const data = await fetchWithRetry(`${API_CONFIG.baseUrl}/paineis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(painel),
    });

    // Invalida cache
    cache.delete(getCacheKey("paineis"));

    console.log("✅ Painel criado com sucesso:", data.nome);
    return data;
  } catch (error) {
    console.error("❌ Erro ao criar painel:", error);
    throw new ApiError(
      `Falha ao criar painel: ${error.message}`,
      error.status || 500,
      "paineis"
    );
  }
}

/**
 * Atualiza um painel existente
 * @param {string} id - ID do painel
 * @param {Object} painelAtualizado - Dados atualizados
 * @returns {Promise<Object>} - Painel atualizado
 */
export async function updatePainel(id, painelAtualizado) {
  try {
    console.log("📝 Atualizando painel:", id);

    const data = await fetchWithRetry(`${API_CONFIG.baseUrl}/paineis/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(painelAtualizado),
    });

    // Invalida cache
    cache.delete(getCacheKey("paineis"));

    console.log("✅ Painel atualizado com sucesso");
    return data;
  } catch (error) {
    console.error("❌ Erro ao atualizar painel:", error);
    throw new ApiError(
      `Falha ao atualizar painel: ${error.message}`,
      error.status || 500,
      "paineis"
    );
  }
}

/**
 * Remove um painel
 * @param {string} id - ID do painel
 * @returns {Promise<boolean>} - Sucesso da operação
 */
export async function deletePainel(id) {
  try {
    console.log("🗑️ Removendo painel:", id);

    await fetchWithRetry(`${API_CONFIG.baseUrl}/paineis/${id}`, {
      method: "DELETE",
    });

    // Invalida cache
    cache.delete(getCacheKey("paineis"));

    console.log("✅ Painel removido com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Erro ao remover painel:", error);
    throw new ApiError(
      `Falha ao remover painel: ${error.message}`,
      error.status || 500,
      "paineis"
    );
  }
}

/**
 * OPERAÇÕES PARA GABINETES
 */

/**
 * Busca todos os gabinetes
 * @param {boolean} useCache - Se deve usar cache
 * @returns {Promise<Array>} - Lista de gabinetes
 */
export async function fetchGabinetes(useCache = true) {
  const cacheKey = getCacheKey("gabinetes");

  if (useCache) {
    const cached = cache.get(cacheKey);
    if (isCacheValid(cached)) {
      console.log("🎯 Gabinetes carregados do cache");
      return cached.data;
    }
  }

  try {
    console.log("🌐 Buscando gabinetes da API...");
    const data = await fetchWithRetry(`${API_CONFIG.baseUrl}/gabinetes`);

    // Armazena no cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    console.log(`✅ ${data.length} gabinetes carregados com sucesso`);
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar gabinetes:", error);
    throw new ApiError(
      `Falha ao carregar gabinetes: ${error.message}`,
      error.status || 500,
      "gabinetes"
    );
  }
}

/**
 * UTILITÁRIOS DE CACHE
 */

/**
 * Limpa todo o cache
 */
export function clearCache() {
  cache.clear();
  console.log("🧹 Cache limpo");
}

/**
 * Limpa cache específico
 * @param {string} endpoint - Endpoint para limpar
 */
export function clearCacheFor(endpoint) {
  const keys = Array.from(cache.keys()).filter((key) =>
    key.startsWith(endpoint)
  );
  keys.forEach((key) => cache.delete(key));
  console.log(`🧹 Cache limpo para: ${endpoint}`);
}

/**
 * Obtém estatísticas do cache
 */
export function getCacheStats() {
  const entries = Array.from(cache.entries());
  const validEntries = entries.filter(([, value]) => isCacheValid(value));

  return {
    total: cache.size,
    valid: validEntries.length,
    expired: cache.size - validEntries.length,
    keys: Array.from(cache.keys()),
  };
}

/**
 * Configuração da API
 */
export const apiConfig = {
  ...API_CONFIG,

  /**
   * Atualiza configuração
   * @param {Object} newConfig - Nova configuração
   */
  update(newConfig) {
    Object.assign(API_CONFIG, newConfig);
  },

  /**
   * Reseta para configuração padrão
   */
  reset() {
    Object.assign(API_CONFIG, {
      baseUrl: "/api",
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
    });
  },
};

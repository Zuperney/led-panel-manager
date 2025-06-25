/**
 * Arquivo principal que contém funções comuns a todo o projeto
 * Responsável pela navegação, inicialização e comportamentos globais
 */

// Cache para funções de inicialização - evita múltiplas chamadas desnecessárias
const initializationCache = {};

/**
 * Função de navegação entre seções
 * @param {string} sectionId - ID da seção para navegar
 */
function navigate(sectionId) {
  try {
    // Verifica se a seção existe
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
      console.error(`Seção não encontrada: ${sectionId}`);
      return;
    }

    // Esconde todas as seções
    document.querySelectorAll(".app-section").forEach((sec) => {
      sec.classList.add("hidden");
    });

    // Mostra a seção desejada
    targetSection.classList.remove("hidden");

    // Salva a última seção acessada para restaurar ao recarregar
    localStorage.setItem("lastSection", sectionId);

    // Destaca o botão da seção atual
    destacarBotaoAtivo(sectionId);

    // Inicializa funções específicas de cada seção quando navegada
    inicializarSecao(sectionId);
  } catch (error) {
    console.error("Erro ao navegar para seção:", error);
    alert(
      "Ocorreu um erro ao carregar a seção. Por favor, recarregue a página."
    );
  }
}

/**
 * Inicializa a seção específica quando navegada
 * @param {string} sectionId - ID da seção para inicializar
 */
function inicializarSecao(sectionId) {
  // Mapeamento de seções para funções de inicialização
  const inicializadores = {
    gabinetes: initGabinetes,
    projetos: initProjetos,
    relatorio: initRelatorios,
    pixel: initPixelMapping,
    config: initConfiguracoes,
    agenda: initAgenda,
  };

  const initFunction = inicializadores[sectionId];

  if (typeof initFunction === "function") {
    // Verifica se a função já foi chamada antes (exceto para projetos que precisa recarregar)
    if (sectionId === "projetos" || !initializationCache[sectionId]) {
      try {
        initFunction();
        // Marca como inicializada
        initializationCache[sectionId] = true;
      } catch (error) {
        console.error(`Erro ao inicializar seção ${sectionId}:`, error);
      }
    }
  }
}

/**
 * Destaca o botão da seção atual na navegação
 * @param {string} sectionId - ID da seção atual
 */
function destacarBotaoAtivo(sectionId) {
  try {
    // Remove destaque de todos os botões
    document.querySelectorAll("nav button").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Adiciona destaque ao botão da seção atual
    const botaoAtivo = Array.from(document.querySelectorAll("nav button")).find(
      (btn) => {
        const onClickStr = btn.onclick ? btn.onclick.toString() : "";
        return onClickStr.includes(`'${sectionId}'`);
      }
    );

    if (botaoAtivo) {
      botaoAtivo.classList.add("active");
    }
  } catch (error) {
    console.error("Erro ao destacar botão ativo:", error);
  }
}

/**
 * Restaura a última seção acessada ou vai para a seção padrão
 */
function restaurarUltimaSecao() {
  try {
    const lastSection = localStorage.getItem("lastSection") || "gabinetes";
    navigate(lastSection);
  } catch (error) {
    console.error("Erro ao restaurar última seção:", error);
    // Em caso de erro, navega para a seção padrão
    navigate("gabinetes");
  }
}

/**
 * Verificar se é a primeira execução do sistema
 * Mostra mensagem de boas-vindas se for
 */
function verificarPrimeiraExecucao() {
  try {
    const primeiraExecucao = localStorage.getItem("primeiraExecucao") === null;

    if (primeiraExecucao) {
      // Marca que o sistema já foi executado
      localStorage.setItem("primeiraExecucao", "false");

      // Exibe uma mensagem de boas-vindas
      setTimeout(() => {
        alert(
          "Bem-vindo ao Led Panel Manager!\n\n" +
            "Esta é uma aplicação para gerenciar projetos de painéis LED.\n" +
            "Comece explorando os gabinetes pré-cadastrados ou criando um novo projeto."
        );
      }, 1000);
    }
  } catch (error) {
    console.error("Erro ao verificar primeira execução:", error);
  }
}

/**
 * Registra a última modificação para auto-save
 */
function registrarModificacao() {
  try {
    localStorage.setItem("ultima_modificacao", new Date().getTime().toString());
  } catch (error) {
    console.error("Erro ao registrar modificação:", error);
  }
}

/**
 * Verifica a compatibilidade do navegador com os recursos necessários
 * @returns {boolean} True se o navegador é compatível
 */
function verificarCompatibilidade() {
  // Verifica se localStorage está disponível
  if (!window.localStorage) {
    alert(
      "Seu navegador não suporta armazenamento local. O aplicativo pode não funcionar corretamente."
    );
    return false;
  }

  // Verifica se Fetch API está disponível
  if (!window.fetch) {
    alert(
      "Seu navegador não suporta recursos modernos necessários. Por favor, atualize seu navegador."
    );
    return false;
  }

  return true;
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Verifica compatibilidade
    if (!verificarCompatibilidade()) {
      console.error("Navegador incompatível");
      return;
    }

    // Restaura a última seção acessada
    restaurarUltimaSecao();

    // Verifica se é a primeira execução
    verificarPrimeiraExecucao();

    // Adiciona listener para modificações no localStorage
    window.addEventListener("storage", (e) => {
      // Se houver alterações nos dados principais, registra para auto-save
      if (e.key === "gabinetes" || e.key === "projetos") {
        registrarModificacao();
      }
    });

    // Adiciona listener para erros não capturados
    window.addEventListener("error", (e) => {
      console.error("Erro não capturado:", e.error || e.message);
    });

    console.log("Led Panel Manager inicializado com sucesso");
  } catch (error) {
    console.error("Erro durante inicialização:", error);
  }
});

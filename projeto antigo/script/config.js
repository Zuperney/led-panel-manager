/**
 * Módulo de Configurações
 * Gerencia as configurações do sistema e funções de backup/restore
 */

// Inicializa a página de configurações
function initConfiguracoes() {
  const formConfig = document.getElementById("form-config");
  if (!formConfig) return;

  // Carrega configurações salvas
  carregarConfiguracoes();

  // Adiciona event listeners
  formConfig.addEventListener("submit", salvarConfiguracoes);

  // Event listener para o botão de modo escuro para aplicação imediata
  const darkModeCheck = document.getElementById("config-dark-mode");
  if (darkModeCheck) {
    darkModeCheck.addEventListener("change", aplicarTema);
  }
}

// Carrega configurações do localStorage
function carregarConfiguracoes() {
  const config = JSON.parse(localStorage.getItem("configuracoes") || "{}");

  // Aplica valores aos campos
  const autoSave = document.getElementById("config-auto-save");
  const darkMode = document.getElementById("config-dark-mode");
  const unit = document.getElementById("config-unit");

  if (autoSave) autoSave.checked = config.autoSave || false;
  if (darkMode) darkMode.checked = config.darkMode || false;
  if (unit) unit.value = config.unit || "mm";

  // Aplica configurações visuais
  aplicarTema();
}

// Salva configurações no localStorage
function salvarConfiguracoes(e) {
  e.preventDefault();

  const config = {
    autoSave: document.getElementById("config-auto-save").checked,
    darkMode: document.getElementById("config-dark-mode").checked,
    unit: document.getElementById("config-unit").value,
  };

  localStorage.setItem("configuracoes", JSON.stringify(config));

  // Aplica configurações visuais
  aplicarTema();

  // Feedback para o usuário
  alert("Configurações salvas com sucesso!");
}

// Aplica tema escuro/claro conforme configuração
function aplicarTema() {
  const darkMode =
    document.getElementById("config-dark-mode")?.checked ||
    JSON.parse(localStorage.getItem("configuracoes") || "{}").darkMode ||
    false;

  if (darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// Aplica a configuração de unidade de medida
function getUnidadeMedida() {
  const config = JSON.parse(localStorage.getItem("configuracoes") || "{}");
  return config.unit || "mm";
}

// Converte um valor para a unidade configurada
function converterUnidade(valor, deUnidade = "mm") {
  const paraUnidade = getUnidadeMedida();

  // Valores de conversão (relativo a mm)
  const fatores = {
    mm: 1,
    cm: 0.1,
    m: 0.001,
  };

  // Converte para mm primeiro
  const valorEmMM = valor / fatores[deUnidade];

  // Converte de mm para a unidade desejada
  return valorEmMM * fatores[paraUnidade];
}

// Formatador de unidades para exibição
function formatarUnidade(valor, unidade = null) {
  const unidadeAtual = unidade || getUnidadeMedida();
  return `${valor.toFixed(2)} ${unidadeAtual}`;
}

// Inicialização do sistema de configurações globais
function initSistemaConfiguracoes() {
  // Aplica o tema ao carregar a página
  aplicarTema();

  // Inicializa o suporte para backup e importação
  initBackupRestore();

  // Configura auto-save se ativado
  const config = JSON.parse(localStorage.getItem("configuracoes") || "{}");
  if (config.autoSave) {
    configurarAutoSave();
  }
}

// Configura o salvamento automático
function configurarAutoSave() {
  // A cada 30 segundos, verifica se houve alterações e salva
  const autoSaveInterval = 30 * 1000; // 30 segundos

  setInterval(() => {
    // Obtém a data da última modificação
    const ultimaMod = localStorage.getItem("ultima_modificacao");
    const agora = new Date().getTime();

    if (ultimaMod && agora - parseInt(ultimaMod) < autoSaveInterval) {
      console.log("Auto-save: salvando alterações...");

      // Aqui você implementaria a lógica de backup
      // Por exemplo, criar um download automático ou salvar em outro storage
    }
  }, autoSaveInterval);
}

// Inicializa funções de backup e restore
function initBackupRestore() {
  // Configuração já feita no script exportacao.js
  console.log("Sistema de backup e restore inicializado.");
}

// Modal para configurações avançadas
function abrirConfiguracoesAvancadas() {
  // Ainda não implementado - para futuras extensões do sistema
  alert("Configurações avançadas serão implementadas em uma versão futura.");
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  initConfiguracoes();
  initSistemaConfiguracoes();
});

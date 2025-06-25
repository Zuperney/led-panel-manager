/**
 * Módulo de exportação e geração de relatórios
 * Permite gerar relatórios em diferentes formatos e exportar dados do projeto
 */

/**
 * Inicializa o módulo de relatórios
 * Configura eventos para botões de exportação e formulário
 */
function initRelatorios() {
  const formRelatorio = document.getElementById("form-relatorio");
  if (!formRelatorio) return;

  formRelatorio.addEventListener("submit", gerarRelatorio);

  // Adicionar event listeners para botões de exportação
  const btnExportData = document.getElementById("btn-export-data");
  const btnImportData = document.getElementById("btn-import-data");
  const importFile = document.getElementById("import-file");

  if (btnExportData) {
    btnExportData.addEventListener("click", exportarDados);
  }

  if (btnImportData && importFile) {
    btnImportData.addEventListener("click", () => {
      importFile.click();
    });

    importFile.addEventListener("change", importarDados);
  }
}

/**
 * Gera um relatório com base nas opções selecionadas
 * @param {Event} e - Evento de submit do formulário
 */
function gerarRelatorio(e) {
  e.preventDefault();

  try {
    const projetoSelector = document.getElementById("relatorio-projeto");
    const tipoSelector = document.getElementById("relatorio-tipo");

    if (!projetoSelector || !tipoSelector) {
      throw new Error("Elementos do formulário não encontrados.");
    }

    const projetoIndex = projetoSelector.value;
    const tipoRelatorio = tipoSelector.value;

    if (!projetoIndex) {
      alert("Selecione um projeto para gerar o relatório.");
      return;
    }

    // Obter as informações do projeto
    const resumo = gerarResumoTecnico(parseInt(projetoIndex));
    if (!resumo) {
      throw new Error("Informações do projeto não encontradas.");
    }

    // Gerar o relatório com base no tipo
    switch (tipoRelatorio) {
      case "completo":
        gerarRelatorioCompleto(resumo);
        break;
      case "tecnico":
        gerarRelatorioTecnico(resumo);
        break;
      case "orcamento":
        gerarOrcamento(resumo);
        break;
      case "cliente":
        gerarRelatorioCliente(resumo);
        break;
      default:
        gerarRelatorioCompleto(resumo);
    }
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    alert("Erro ao gerar relatório: " + error.message);
  }
}

/**
 * Gera um relatório técnico completo
 * @param {Object} resumo - Dados do resumo técnico do projeto
 */
function gerarRelatorioCompleto(resumo) {
  const container = document.getElementById("relatorio-preview");
  if (!container) return;

  try {
    const dataFormatada = new Date(
      resumo.dataEntrega || Date.now()
    ).toLocaleDateString("pt-BR");

    let html = `
      <div class="report-container">
        <div class="report-header">
          <h2>Relatório Técnico Completo</h2>
          <p class="report-meta">
            Projeto: <strong>${resumo.nome || "Sem nome"}</strong> | 
            Cliente: <strong>${resumo.cliente || "Sem cliente"}</strong> | 
            Data de Entrega: <strong>${dataFormatada}</strong>
          </p>
        </div>
        
        <div class="report-section">
          <h3>Resumo Geral</h3>
          <div class="report-summary">
            <div class="report-summary-item">
              <i class="fas fa-object-group"></i>
              <span class="summary-value">${resumo.totalGabinetes || 0}</span>
              <span class="summary-label">Gabinetes</span>
            </div>
            <div class="report-summary-item">
              <i class="fas fa-vector-square"></i>
              <span class="summary-value">${(resumo.totalArea || 0).toFixed(
                2
              )} m²</span>
              <span class="summary-label">Área Total</span>
            </div>
            <div class="report-summary-item">
              <i class="fas fa-th"></i>
              <span class="summary-value">${
                resumo.maxResolucaoLargura || 0
              } x ${resumo.maxResolucaoAltura || 0}</span>
              <span class="summary-label">Resolução</span>
            </div>
            <div class="report-summary-item">
              <i class="fas fa-bolt"></i>
              <span class="summary-value">${resumo.totalPotencia || 0} W</span>
              <span class="summary-label">Potência</span>
            </div>
            <div class="report-summary-item">
              <i class="fas fa-plug"></i>
              <span class="summary-value">${resumo.totalCorrente || "0 A"} (${
      resumo.tipoTensao || "220V"
    })</span>
              <span class="summary-label">Consumo</span>
            </div>
          </div>
        </div>
        
        <div class="report-section">
          <h3>Detalhes Técnicos</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Quantidade</th>
                <th>Área Total (m²)</th>
                <th>Resolução</th>
                <th>Potência (W)</th>
                <th>Corrente (A)</th>
                <th>Peso (kg)</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Verifica se há detalhes antes de tentar iterá-los
    if (resumo.detalhes && Array.isArray(resumo.detalhes)) {
      resumo.detalhes.forEach((detalhe) => {
        html += `      <tr>
          <td>${detalhe.nome || "Sem nome"}</td>
          <td>${detalhe.quantidade || 0}</td>
          <td>${detalhe.area || "0.000"}</td>
          <td>${detalhe.resolucao || "0 x 0"}</td>
          <td>${detalhe.potencia || 0}</td>
          <td>${detalhe.corrente || "0 A"}</td>
          <td>${detalhe.peso || 0}</td>
        </tr>
      `;
      });
    }

    html += `
            </tbody>
          </table>
        </div>
        
        <div class="report-section">
          <h3>Consumo Energético</h3>
          <div class="report-grid">
            <div class="report-grid-item">
              <span class="grid-label">Consumo Mensal Estimado:</span>
              <span class="grid-value">${
                resumo.consumoMensalKWh || "0"
              } kWh</span>
            </div>
            <div class="report-grid-item">
              <span class="grid-label">Custo Mensal Estimado:</span>
              <span class="grid-value">R$ ${
                resumo.custoMensalEnergia || "0.00"
              }</span>
            </div>
            <div class="report-grid-item">
              <span class="grid-label">Horas Diárias de Operação:</span>
              <span class="grid-value">12 horas</span>
            </div>
            <div class="report-grid-item">
              <span class="grid-label">Sistema Elétrico:</span>
              <span class="grid-value">${
                resumo.tipoTensao || "220V Monofásico"
              }</span>
            </div>
          </div>
        </div>
        
        <div class="report-section">
          <h3>Recomendações de Visualização</h3>
          <div class="report-grid">
            <div class="report-grid-item">
              <span class="grid-label">Distância Mínima de Visualização:</span>
              <span class="grid-value">${
                resumo.distanciaMinima || "N/A"
              } m</span>
            </div>
            <div class="report-grid-item">
              <span class="grid-label">Distância Máxima de Visualização:</span>
              <span class="grid-value">${
                resumo.distanciaMaxima || "N/A"
              } m</span>
            </div>
            <div class="report-grid-item">
              <span class="grid-label">Total de Pixels:</span>
              <span class="grid-value">${(
                resumo.totalPixels || 0
              ).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div class="report-footer">
          <p>Gerado em ${new Date().toLocaleString(
            "pt-BR"
          )} | Led Panel Manager</p>
          <button onclick="imprimirRelatorio()" class="btn">
            <i class="fas fa-print"></i> Imprimir Relatório
          </button>
          <button onclick="exportarPDF()" class="btn">
            <i class="fas fa-file-pdf"></i> Exportar para PDF
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error("Erro ao gerar relatório completo:", error);
    container.innerHTML = `<div class="error-message">Erro ao gerar relatório: ${error.message}</div>`;
  }
}

/**
 * Gera um relatório técnico simplificado
 * @param {Object} resumo - Dados do resumo técnico do projeto
 */
function gerarRelatorioTecnico(resumo) {
  const container = document.getElementById("relatorio-preview");
  if (!container) return;

  try {
    const dataFormatada = new Date(
      resumo.dataEntrega || Date.now()
    ).toLocaleDateString("pt-BR");

    let html = `
      <div class="report-container">
        <div class="report-header">
          <h2>Especificações Técnicas</h2>
          <p class="report-meta">
            Projeto: <strong>${resumo.nome || "Sem nome"}</strong> | 
            Cliente: <strong>${resumo.cliente || "Sem cliente"}</strong>
          </p>
        </div>
        
        <div class="report-section">
          <h3>Especificações do Painel</h3>
          <div class="report-specs">
            <div class="spec-item">
              <div class="spec-label">Dimensões Totais:</div>
              <div class="spec-value">${Math.round(
                Math.sqrt((resumo.totalArea || 0.1) * 1000000)
              )} mm x ${Math.round(
      Math.sqrt((resumo.totalArea || 0.1) * 1000000)
    )} mm (aproximado)</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Área Total:</div>
              <div class="spec-value">${(resumo.totalArea || 0).toFixed(
                2
              )} m²</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Resolução Total:</div>
              <div class="spec-value">${resumo.maxResolucaoLargura || 0} x ${
      resumo.maxResolucaoAltura || 0
    } pixels</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Potência Total:</div>
              <div class="spec-value">${resumo.totalPotencia || 0} W (${(
      (resumo.totalPotencia || 0) / 1000
    ).toFixed(1)} kW)</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Consumo Elétrico:</div>
              <div class="spec-value">${resumo.totalCorrente || "0 A"} (${
      resumo.tipoTensao || "220V"
    })</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Peso Total:</div>
              <div class="spec-value">${resumo.totalPeso || 0} kg</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Distância Ideal de Visualização:</div>
              <div class="spec-value">${resumo.distanciaMinima || "N/A"} - ${
      resumo.distanciaMaxima || "N/A"
    } metros</div>
            </div>
          </div>
        </div>
        
        <div class="report-footer">
          <p>Gerado pelo Led Panel Manager | ${new Date().toLocaleDateString(
            "pt-BR"
          )}</p>
          <button onclick="imprimirRelatorio()" class="btn">
            <i class="fas fa-print"></i> Imprimir
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error("Erro ao gerar relatório técnico:", error);
    container.innerHTML = `<div class="error-message">Erro ao gerar relatório: ${error.message}</div>`;
  }
}

/**
 * Gera um orçamento para o cliente
 * @param {Object} resumo - Dados do resumo técnico do projeto
 */
function gerarOrcamento(resumo) {
  const container = document.getElementById("relatorio-preview");
  if (!container) return;

  try {
    // Valores fictícios para o orçamento - em um cenário real, estes valores viriam de uma base de dados
    const valorM2 = 5000; // R$5.000 por m²
    const valorInstalacao = (resumo.totalArea || 0) * 1000; // R$1.000 por m²
    const valorProjeto = 2500; // Taxa fixa de projeto
    const valorEntrega = 1500; // Taxa fixa de entrega

    const valorGabinetes = (resumo.totalArea || 0) * valorM2;
    const valorTotal =
      valorGabinetes + valorInstalacao + valorProjeto + valorEntrega;

    const dataFormatada = new Date(
      resumo.dataEntrega || Date.now()
    ).toLocaleDateString("pt-BR");
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    let html = `
      <div class="report-container orcamento">
        <div class="report-header">
          <h2>Orçamento de Painel LED</h2>
          <p class="report-meta">
            <strong>Cliente:</strong> ${resumo.cliente || "Sem cliente"} | 
            <strong>Data:</strong> ${dataAtual} | 
            <strong>Validade:</strong> 15 dias
          </p>
        </div>
        
        <div class="report-section">
          <h3>Projeto: ${resumo.nome || "Sem nome"}</h3>
          <p>Data prevista de entrega: ${dataFormatada}</p>
          
          <table class="report-table orcamento-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <strong>Painel LED ${resumo.maxResolucaoLargura || 0}x${
      resumo.maxResolucaoAltura || 0
    }</strong>
                  <p>Área total: ${(resumo.totalArea || 0).toFixed(2)} m² | ${
      resumo.totalGabinetes || 0
    } gabinetes</p>
                  <p>Sistema: ${
                    resumo.tipoTensao || "220V Monofásico"
                  } | Corrente: ${resumo.totalCorrente || "0 A"}</p>
                </td>
                <td>R$ ${valorGabinetes.toLocaleString("pt-BR")}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <strong>Instalação e Configuração</strong>
                  <p>Montagem, cabeamento e configuração inicial</p>
                </td>
                <td>R$ ${valorInstalacao.toLocaleString("pt-BR")}</td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  <strong>Projeto Técnico</strong>
                  <p>Design e especificações técnicas</p>
                </td>
                <td>R$ ${valorProjeto.toLocaleString("pt-BR")}</td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  <strong>Entrega e Treinamento</strong>
                  <p>Transporte e treinamento da equipe</p>
                </td>
                <td>R$ ${valorEntrega.toLocaleString("pt-BR")}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="text-right"><strong>VALOR TOTAL:</strong></td>
                <td><strong>R$ ${valorTotal.toLocaleString(
                  "pt-BR"
                )}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div class="report-section">
          <h3>Condições Comerciais</h3>
          <ul class="conditions-list">
            <li>Forma de pagamento: 40% de entrada, 30% na entrega dos equipamentos e 30% na conclusão da instalação.</li>
            <li>Prazo de entrega: Conforme cronograma de projeto, estimado em 30 dias após aprovação.</li>
            <li>Garantia: 24 meses para defeitos de fabricação.</li>
            <li>Manutenção: Primeiro ano incluso, com visitas trimestrais preventivas.</li>
            <li>Validade da proposta: 15 dias corridos.</li>
            <li>Consumo energético estimado: ${
              resumo.consumoMensalKWh || "0"
            } kWh/mês (R$ ${resumo.custoMensalEnergia || "0.00"}/mês)</li>
          </ul>
        </div>
        
        <div class="report-footer">
          <p>Este orçamento é uma estimativa baseada nas informações fornecidas. Preços sujeitos a alteração após visita técnica.</p>
          <button onclick="imprimirRelatorio()" class="btn">
            <i class="fas fa-print"></i> Imprimir Orçamento
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error("Erro ao gerar orçamento:", error);
    container.innerHTML = `<div class="error-message">Erro ao gerar orçamento: ${error.message}</div>`;
  }
}

/**
 * Gera um relatório simplificado para o cliente
 * @param {Object} resumo - Dados do resumo técnico do projeto
 */
function gerarRelatorioCliente(resumo) {
  const container = document.getElementById("relatorio-preview");
  if (!container) return;

  try {
    const dataFormatada = new Date(
      resumo.dataEntrega || Date.now()
    ).toLocaleDateString("pt-BR");

    let html = `
      <div class="report-container cliente">
        <div class="report-header">
          <h2>Especificações do Painel LED</h2>
          <p class="report-meta">
            Projeto: <strong>${resumo.nome || "Sem nome"}</strong> | 
            Cliente: <strong>${resumo.cliente || "Sem cliente"}</strong> | 
            Data de Entrega: <strong>${dataFormatada}</strong>
          </p>
        </div>
        
        <div class="report-section">
          <div class="client-specs">
            <div class="spec-group">
              <h3>Características do Painel</h3>
              <div class="spec-item">
                <div class="spec-label">Tipo de Painel:</div>
                <div class="spec-value">Painel de LED Indoor</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Tamanho Total:</div>
                <div class="spec-value">${(resumo.totalArea || 0).toFixed(
                  2
                )} m²</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Resolução:</div>
                <div class="spec-value">${resumo.maxResolucaoLargura || 0} x ${
      resumo.maxResolucaoAltura || 0
    } pixels</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Sistema Elétrico:</div>
                <div class="spec-value">${
                  resumo.tipoTensao || "220V Monofásico"
                } (${resumo.totalCorrente || "0 A"})</div>
              </div>
            </div>
            
            <div class="spec-group">
              <h3>Informações de Uso</h3>
              <div class="spec-item">
                <div class="spec-label">Distância Ideal para Visualização:</div>
                <div class="spec-value">${resumo.distanciaMinima || "N/A"} - ${
      resumo.distanciaMaxima || "N/A"
    } metros</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Consumo Mensal Estimado:</div>
                <div class="spec-value">${
                  resumo.consumoMensalKWh || "0"
                } kWh</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Custo Mensal de Energia (Estimado):</div>
                <div class="spec-value">R$ ${
                  resumo.custoMensalEnergia || "0.00"
                }</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="report-section">
          <h3>Recomendações Gerais</h3>
          <ul class="recommendations-list">
            <li>Mantenha uma distância adequada para melhor visualização. Ficar muito próximo ao painel pode prejudicar a experiência visual.</li>
            <li>Evite exposição direta à luz solar intensa, o que pode diminuir o contraste e a vida útil do painel.</li>
            <li>Mantenha a temperatura ambiente entre 15°C e 35°C para otimizar o funcionamento e prolongar a vida útil do equipamento.</li>
            <li>Realize limpeza periódica com produtos específicos para painéis LED.</li>
            <li>Em caso de problemas, entre em contato com nossa equipe técnica antes de tentar qualquer reparo.</li>
          </ul>
        </div>
        
        <div class="report-footer">
          <p>Para mais informações, consulte o manual do usuário ou entre em contato com nossa equipe técnica.</p>
          <button onclick="imprimirRelatorio()" class="btn">
            <i class="fas fa-print"></i> Imprimir
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error("Erro ao gerar relatório de cliente:", error);
    container.innerHTML = `<div class="error-message">Erro ao gerar relatório: ${error.message}</div>`;
  }
}

/**
 * Função para imprimir o relatório
 */
function imprimirRelatorio() {
  window.print();
}

/**
 * Função para exportar para PDF (simulada, requeriria uma biblioteca como jsPDF em um cenário real)
 */
function exportarPDF() {
  alert(
    "Funcionalidade de exportação para PDF será implementada em uma versão futura. Por favor, use a função de impressão do navegador."
  );
}

/**
 * Função para exportar todos os dados do sistema
 */
function exportarDados() {
  try {
    // Coleta todos os dados do localStorage
    const dados = {
      gabinetes: JSON.parse(localStorage.getItem("gabinetes") || "[]"),
      projetos: JSON.parse(localStorage.getItem("projetos") || "[]"),
      configuracoes: JSON.parse(localStorage.getItem("configuracoes") || "{}"),
      versao: "1.1", // Atualizamos a versão para refletir as melhorias
      dataExportacao: new Date().toISOString(),
    };

    // Converte para JSON
    const dadosJSON = JSON.stringify(dados, null, 2);

    // Cria um blob e um link para download
    const blob = new Blob([dadosJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `led-panel-manager-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();

    // Remove o link
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    alert("Erro ao exportar dados: " + error.message);
  }
}

/**
 * Função para importar dados
 * @param {Event} e - Evento de mudança do input file
 */
function importarDados(e) {
  try {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const dados = JSON.parse(event.target.result);

        // Verifica se o formato é válido
        if (
          !dados.gabinetes ||
          !Array.isArray(dados.gabinetes) ||
          !dados.projetos ||
          !Array.isArray(dados.projetos)
        ) {
          throw new Error("Formato de arquivo inválido.");
        }

        // Confirma a importação
        if (
          !confirm(
            `Este arquivo contém ${dados.gabinetes.length} gabinetes e ${dados.projetos.length} projetos. A importação substituirá todos os dados atuais. Deseja continuar?`
          )
        ) {
          return;
        }

        // Importa os dados
        localStorage.setItem("gabinetes", JSON.stringify(dados.gabinetes));
        localStorage.setItem("projetos", JSON.stringify(dados.projetos));

        // Importa configurações se existirem
        if (dados.configuracoes) {
          localStorage.setItem(
            "configuracoes",
            JSON.stringify(dados.configuracoes)
          );
        }

        alert(
          "Dados importados com sucesso! A página será recarregada para aplicar as alterações."
        );
        location.reload();
      } catch (err) {
        console.error("Erro ao processar arquivo importado:", err);
        alert("Erro ao importar dados: " + err.message);
      }
    };

    reader.onerror = function () {
      alert(
        "Erro ao ler o arquivo. Verifique se o arquivo não está corrompido."
      );
    };

    reader.readAsText(file);
  } catch (error) {
    console.error("Erro ao importar dados:", error);
    alert("Erro ao importar dados: " + error.message);
  }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  initRelatorios();
});

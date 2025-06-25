// Variáveis globais
let projetoEditando = null;

// Inicializa a página de projetos
function initProjetos() {
  const formProjeto = document.getElementById("form-projeto");
  if (!formProjeto) return;

  // Adicionar event listeners
  formProjeto.addEventListener("submit", salvarProjeto);

  // Carregar projetos existentes
  carregarProjetos();
}

// Carregar projetos do localStorage
function carregarProjetos() {
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  renderizarProjetos(projetos);

  // Também atualiza os selects que dependem dos projetos
  atualizarSelectsProjeto(projetos);
}

// Renderiza a lista de projetos
function renderizarProjetos(projetos) {
  const grid = document.getElementById("grid-projetos");
  if (!grid) return;

  grid.innerHTML = "";

  if (projetos.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-message";
    emptyMessage.innerHTML =
      "<p>Nenhum projeto cadastrado. Crie um novo projeto usando o formulário acima.</p>";
    grid.appendChild(emptyMessage);
    return;
  }

  projetos.forEach((projeto, index) => {
    const card = document.createElement("div");
    card.className = "card";

    // Calcula informações adicionais
    const dataEntrega = new Date(projeto.dataEntrega);
    const dataFormatada = dataEntrega.toLocaleDateString("pt-BR");
    const hoje = new Date();
    const diasRestantes = Math.ceil(
      (dataEntrega - hoje) / (1000 * 60 * 60 * 24)
    );

    // Define classe de urgência baseada nos dias restantes
    let urgenciaClass = "";
    let urgenciaText = "";

    if (diasRestantes < 0) {
      urgenciaClass = "urgencia-atrasado";
      urgenciaText = `<span class="tag tag-danger">Atrasado (${Math.abs(
        diasRestantes
      )} dias)</span>`;
    } else if (diasRestantes <= 7) {
      urgenciaClass = "urgencia-urgente";
      urgenciaText = `<span class="tag tag-warning">Urgente (${diasRestantes} dias)</span>`;
    } else if (diasRestantes <= 15) {
      urgenciaClass = "urgencia-proximo";
      urgenciaText = `<span class="tag tag-info">Em breve (${diasRestantes} dias)</span>`;
    } else {
      urgenciaClass = "urgencia-ok";
      urgenciaText = `<span class="tag tag-success">No prazo (${diasRestantes} dias)</span>`;
    }

    // Número de gabinetes se existirem
    const numGabinetes = projeto.gabinetes ? projeto.gabinetes.length : 0;

    card.innerHTML = `
      <div class="card-header ${urgenciaClass}">${projeto.nome}</div>
      <div class="card-body">
        <div class="card-info">
          <p><i class="fas fa-user"></i> Cliente: ${projeto.cliente}</p>
          <p><i class="fas fa-calendar-alt"></i> Entrega: ${dataFormatada} ${urgenciaText}</p>
          <p><i class="fas fa-object-group"></i> Gabinetes: ${numGabinetes}</p>
          ${
            projeto.observacoes
              ? `<p><i class="fas fa-sticky-note"></i> Obs: ${projeto.observacoes}</p>`
              : ""
          }
        </div>
        <div class="card-actions">
          <button class="btn" onclick="editarProjeto(${index})">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn" onclick="configurarProjetoPaineis(${index})">
            <i class="fas fa-tv"></i> Configurar Painéis
          </button>
          <button class="btn btn-danger" onclick="excluirProjeto(${index})">
            <i class="fas fa-trash"></i> Excluir
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Salva um novo projeto ou atualiza um existente
function salvarProjeto(e) {
  e.preventDefault();

  const projeto = {
    nome: document.getElementById("projeto-nome").value,
    cliente: document.getElementById("projeto-cliente").value,
    dataEntrega: document.getElementById("projeto-data").value,
    observacoes: document.getElementById("projeto-obs").value,
    gabinetes: [],
    dataCriacao: new Date().toISOString(),
  };

  let projetos = JSON.parse(localStorage.getItem("projetos") || "[]");

  if (projetoEditando !== null) {
    // Preservar configurações de gabinetes se já existirem
    projeto.gabinetes = projetos[projetoEditando].gabinetes || [];
    projetos[projetoEditando] = projeto;
    projetoEditando = null;
  } else {
    projetos.push(projeto);
  }

  localStorage.setItem("projetos", JSON.stringify(projetos));
  renderizarProjetos(projetos);

  // Atualiza os selects que dependem dos projetos
  atualizarSelectsProjeto(projetos);

  // Resetar o formulário
  document.getElementById("form-projeto").reset();
  document.getElementById("projeto-nome").focus();
}

// Edita um projeto existente
function editarProjeto(index) {
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  if (index < 0 || index >= projetos.length) return;

  const projeto = projetos[index];
  projetoEditando = index;

  document.getElementById("projeto-nome").value = projeto.nome;
  document.getElementById("projeto-cliente").value = projeto.cliente;
  document.getElementById("projeto-data").value = projeto.dataEntrega;
  document.getElementById("projeto-obs").value = projeto.observacoes || "";

  // Scroll para o formulário
  document
    .getElementById("form-projeto")
    .scrollIntoView({ behavior: "smooth" });
}

// Exclui um projeto
function excluirProjeto(index) {
  if (confirm("Tem certeza que deseja excluir este projeto?")) {
    let projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
    projetos.splice(index, 1);
    localStorage.setItem("projetos", JSON.stringify(projetos));
    renderizarProjetos(projetos);

    // Atualiza os selects que dependem dos projetos
    atualizarSelectsProjeto(projetos);

    // Se estava editando o projeto que foi excluído, reseta o formulário
    if (projetoEditando === index) {
      document.getElementById("form-projeto").reset();
      projetoEditando = null;
    }
  }
}

// Configuração de painéis LED para um projeto
function configurarProjetoPaineis(index) {
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  if (index < 0 || index >= projetos.length) return;

  // Salva o projeto atual para uso no modal
  localStorage.setItem("projetoAtual", index);

  // Criar e abrir um modal para configuração de painéis
  criarModalConfiguracaoPaineis(projetos[index]);
}

// Cria e abre um modal para configuração de painéis
function criarModalConfiguracaoPaineis(projeto) {
  // Verifica se já existe um modal e remove
  const modalExistente = document.getElementById("modal-paineis");
  if (modalExistente) modalExistente.remove();

  // Obter gabinetes disponíveis
  const gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");

  // Recupera tensão persistida para o projeto
  const tensaoKey = `tensao_projeto_${projeto.nome}`;
  const tensaoSalva = localStorage.getItem(tensaoKey) || "220v-bi";
  // Recupera fator de potência persistido para o projeto
  const fpKey = `fp_projeto_${projeto.nome}`;
  const fpSalvo = localStorage.getItem(fpKey) || "0.95";

  // Criar o modal
  const modal = document.createElement("div");
  modal.id = "modal-paineis";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">      <div class="modal-header">
        <h2>Configuração de Painéis por Dimensões - ${projeto.nome}</h2>
        <span class="modal-close">&times;</span>
      </div>
      <div class="modal-body">        <div class="form-section">
          <h3>Adicionar Painel por Dimensões</h3>
          <div id="tab-dimensoes" class="tab-content active">
            <div class="form-row">
              <label>
                Modelo de Gabinete:
                <select id="select-gabinete-dimensao">
                  <option value="">Selecione um gabinete</option>
                  ${gabinetes
                    .map(
                      (g, idx) => `<option value="${idx}">${g.nome}</option>`
                    )
                    .join("")}
                </select>
              </label>
            </div>
            <div class="form-row">
              <label>
                Largura (metros):
                <input type="number" id="largura-painel" min="0.1" step="0.1" value="1">
              </label>
              <label>
                Altura (metros):
                <input type="number" id="altura-painel" min="0.1" step="0.1" value="1">
              </label>
            </div>
            <div class="dimensoes-preview">
              <p>Será necessário: <span id="qtd-gabinetes-calc">0</span> gabinetes</p>
              <p>Dimensões finais: <span id="dims-finais-calc">0m x 0m</span></p>
            </div>
            <button id="btn-adicionar-por-dimensao" class="btn">Calcular e Adicionar</button>
            <button id="btn-salvar-alteracoes" class="btn btn-success" style="display:none; margin-left:8px;">Salvar Alterações</button>
          </div>
        </div>
        <div class="paineis-list">          <h3>Painéis do Projeto</h3>          <table id="tabela-paineis" class="data-table">
            <thead>
              <tr>
                <th>Gabinete/Dimensões</th>
                <th>Qtd</th>
                <th>Resolução Total</th>
                <th>Área Total</th>
                <th>Potência Total</th>
                <th>Corrente (A)</th>
                <th>Peso Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="corpo-tabela-paineis">
              <!-- Os painéis serão inseridos aqui -->
            </tbody>
          </table>
        </div>
          <div class="resumo-paineis">
          <h3>Resumo do Projeto</h3>
            <div class="tensao-selector">
            <label>
              Sistema de Alimentação:
              <select id="select-tensao">
                <option value="220v-bi">220V Bifásico</option>
                <option value="220v-tri">220V Trifásico</option>
                <option value="380v-mono">380V com Neutro (Monofásico)</option>
                <option value="380v-bi">380V com Neutro (Bifásico)</option>
                <option value="380v-tri">380V com Neutro (Trifásico)</option>
              </select>
            </label>
            <label style="margin-left:16px; display:inline-block;">
              Fator de Potência:
              <input type="number" id="input-fator-potencia" min="0.7" max="1" step="0.01" value="0.95" style="width:60px;">
            </label>
            <div class="tensao-info">
              <i class="fas fa-info-circle"></i>
              <span>Os gabinetes LED sempre operam em 220V, mesmo em sistemas 380V (usando neutro).</span>
            </div>
          </div>
          
          <div class="resumo-grid">
            <div class="resumo-item">
              <span class="resumo-label">Total de Gabinetes:</span>
              <span id="total-gabinetes" class="resumo-valor">0</span>
            </div>
            <div class="resumo-item">
              <span class="resumo-label">Área Total:</span>
              <span id="total-area" class="resumo-valor">0 m²</span>
            </div>
            <div class="resumo-item">
              <span class="resumo-label">Resolução Total:</span>
              <span id="total-resolucao" class="resumo-valor">0 x 0 pixels</span>
            </div>
            <div class="resumo-item">
              <span class="resumo-label">Potência Total:</span>
              <span id="total-potencia" class="resumo-valor">0 W</span>
            </div>
            <div class="resumo-item">
              <span class="resumo-label">Consumo em Corrente:</span>
              <span id="total-corrente" class="resumo-valor">0 A</span>
            </div>
            <div class="resumo-item">
              <span class="resumo-label">Peso Total:</span>
              <span id="total-peso" class="resumo-valor">0 kg</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="btn-fechar-modal" class="btn">Fechar e Salvar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Mostrar o modal
  modal.style.display = "block";

  // Setar tensão salva no select
  setTimeout(() => {
    const selectTensao = document.getElementById("select-tensao");
    if (selectTensao) selectTensao.value = tensaoSalva;
    const inputFP = document.getElementById("input-fator-potencia");
    if (inputFP) inputFP.value = fpSalvo;
  }, 0);

  // Adicionar event listeners
  document.querySelector(".modal-close").addEventListener("click", () => {
    modal.remove();
  });
  document.getElementById("btn-fechar-modal").addEventListener("click", () => {
    modal.remove();
  });
  document
    .getElementById("btn-adicionar-por-dimensao")
    .addEventListener("click", adicionarGabinetePorDimensao);

  // Adicionar listener para o seletor de tensão
  document
    .getElementById("select-tensao")
    .addEventListener("change", function () {
      // Salva tensão no localStorage para o projeto
      localStorage.setItem(tensaoKey, this.value);
      atualizarConsumoEnergia();
    });

  // Adicionar listener para o fator de potência
  document
    .getElementById("input-fator-potencia")
    .addEventListener("change", function () {
      localStorage.setItem(`fp_projeto_${projeto.nome}`, this.value);
      atualizarConsumoEnergia();
    });

  // Adicionar listener para salvar alterações
  document
    .getElementById("btn-salvar-alteracoes")
    .addEventListener("click", salvarAlteracoesPainelEditado);

  // Adiciona listener para cálculo em tempo real
  const selectGabineteDimensao = document.getElementById(
    "select-gabinete-dimensao"
  );
  const inputLargura = document.getElementById("largura-painel");
  const inputAltura = document.getElementById("altura-painel");

  const calcFields = [selectGabineteDimensao, inputLargura, inputAltura];
  calcFields.forEach((field) => {
    field.addEventListener("change", calcularGabinetesNecessarios);
    field.addEventListener("input", calcularGabinetesNecessarios);
  });

  // Carregar painéis existentes
  carregarPaineisProjeto();
}

// Atualiza os selects de projetos em todas as seções
function atualizarSelectsProjeto(projetos) {
  // Exemplo: atualiza selects de relatórios, pixel, etc
  const selects = [
    document.getElementById("relatorio-projeto"),
    document.getElementById("pixel-projeto"),
  ];
  selects.forEach((select) => {
    if (select) {
      // Salva valor atual
      const valorAtual = select.value;
      // Limpa opções, mantendo apenas a primeira
      while (select.options.length > 1) {
        select.remove(1);
      }
      // Adiciona projetos
      projetos.forEach((proj, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.textContent = proj.nome;
        select.appendChild(option);
      });
      // Restaura valor selecionado, se possível
      if (valorAtual) select.value = valorAtual;
    }
  });
}

// Função para adicionar gabinete ao projeto
// Função removida: adicionarGabineteAoProjeto

// Função para calcular quantos gabinetes seriam necessários para uma dimensão específica
function calcularGabinetesNecessarios() {
  const gabineteIndex = document.getElementById(
    "select-gabinete-dimensao"
  ).value;
  const larguraMetros = parseFloat(
    document.getElementById("largura-painel").value
  );
  const alturaMetros = parseFloat(
    document.getElementById("altura-painel").value
  );

  if (
    !gabineteIndex ||
    isNaN(larguraMetros) ||
    isNaN(alturaMetros) ||
    larguraMetros <= 0 ||
    alturaMetros <= 0
  ) {
    // Dados inválidos, não calcula nada
    document.getElementById("qtd-gabinetes-calc").textContent = "0";
    document.getElementById("dims-finais-calc").textContent = "0m x 0m";
    return;
  }

  const gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");
  const gabinete = gabinetes[gabineteIndex];

  if (!gabinete) return;

  // Converte metros para milímetros (unidade dos gabinetes)
  const larguraMM = larguraMetros * 1000;
  const alturaMM = alturaMetros * 1000;

  // Calcula quantos gabinetes são necessários
  const resultado = LEDCalculator.calcularNecessidadeGabinetes(
    larguraMM,
    alturaMM,
    gabinete.largura,
    gabinete.altura
  );

  // Atualiza a interface
  document.getElementById("qtd-gabinetes-calc").textContent = resultado.total;

  const larguraFinalM = (resultado.larguraFinal / 1000).toFixed(2);
  const alturaFinalM = (resultado.alturaFinal / 1000).toFixed(2);
  document.getElementById(
    "dims-finais-calc"
  ).textContent = `${larguraFinalM}m x ${alturaFinalM}m`;

  return resultado;
}

// Função para adicionar gabinetes ao projeto baseado nas dimensões
function adicionarGabinetePorDimensao() {
  const gabineteIndex = document.getElementById(
    "select-gabinete-dimensao"
  ).value;
  const larguraMetros = parseFloat(
    document.getElementById("largura-painel").value
  );
  const alturaMetros = parseFloat(
    document.getElementById("altura-painel").value
  );

  if (
    !gabineteIndex ||
    isNaN(larguraMetros) ||
    isNaN(alturaMetros) ||
    larguraMetros <= 0 ||
    alturaMetros <= 0
  ) {
    alert("Por favor, selecione um gabinete e informe dimensões válidas.");
    return;
  }

  // Calcula a quantidade necessária de gabinetes
  const resultado = calcularGabinetesNecessarios();
  if (!resultado) {
    alert("Erro ao calcular a necessidade de gabinetes.");
    return;
  }

  // Confirma a adição
  if (
    !confirm(
      `Serão adicionados ${
        resultado.total
      } gabinetes para criar um painel de ${(
        resultado.larguraFinal / 1000
      ).toFixed(2)}m x ${(resultado.alturaFinal / 1000).toFixed(
        2
      )}m. Confirmar?`
    )
  ) {
    return;
  }

  // Carrega projetos e gabinetes corretamente
  let projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  let projetoIndex = parseInt(localStorage.getItem("projetoAtual"));
  let gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");
  let projetoAtual = projetos[projetoIndex];

  if (!projetoAtual) return;
  if (!projetoAtual.gabinetes) projetoAtual.gabinetes = [];

  // Adiciona o painel como objeto (não cópia de gabinete)
  projetoAtual.gabinetes.push({
    gabineteId: parseInt(gabineteIndex),
    quantidade: resultado.total,
    configuracaoDimensional: {
      larguraMetros: larguraMetros,
      alturaMetros: alturaMetros,
      larguraFinalMetros: resultado.larguraFinal / 1000,
      alturaFinalMetros: resultado.alturaFinal / 1000,
      horizontal: resultado.horizontal,
      vertical: resultado.vertical,
    },
  });

  // Salva as alterações
  localStorage.setItem("projetos", JSON.stringify(projetos));

  // Atualiza a tabela
  carregarPaineisProjeto();

  // Limpa os campos
  document.getElementById("largura-painel").value = "1";
  document.getElementById("altura-painel").value = "1";
  document.getElementById("select-gabinete-dimensao").value = "";
  document.getElementById("qtd-gabinetes-calc").textContent = "0";
  document.getElementById("dims-finais-calc").textContent = "0m x 0m";
}

// Carrega os painéis existentes de um projeto
function carregarPaineisProjeto() {
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  const projetoAtual = projetos[localStorage.getItem("projetoAtual")];

  if (!projetoAtual || !projetoAtual.gabinetes) return;

  const tabelaPaineis = document.getElementById("corpo-tabela-paineis");
  tabelaPaineis.innerHTML = "";

  projetoAtual.gabinetes.forEach((gabinete, index) => {
    const row = document.createElement("tr");

    // Obter dimensões do gabinete
    const larguraGabinete = gabinete.largura || 0;
    const alturaGabinete = gabinete.altura || 0;

    // Calcular área e potência totais considerando todos os gabinetes
    const areaTotal = (larguraGabinete * alturaGabinete) / 1000000; // m²
    const potenciaTotal = gabinete.potencia || 0; // W
    const correnteTotal = potenciaTotal / (gabinete.tensao || 220); // A
    const pesoTotal = gabinete.peso || 0; // kg

    row.innerHTML = `
      <td>${gabinete.nome} (${larguraGabinete}m x ${alturaGabinete}m)</td>
      <td>${gabinete.qtd || 1}</td>
      <td>${gabinete.resolucao || "N/A"}</td>
      <td>${areaTotal.toFixed(2)} m²</td>
      <td>${potenciaTotal} W</td>
      <td>${correnteTotal.toFixed(2)} A</td>
      <td>${pesoTotal} kg</td>
      <td>
        <button class="btn" onclick="editarPainel(${index})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-danger" onclick="excluirPainel(${index})">
          <i class="fas fa-trash"></i> Excluir
        </button>
      </td>
    `;

    tabelaPaineis.appendChild(row);
  });

  atualizarResumoProjeto();
}

// Atualiza o resumo do projeto na aba de painéis
function atualizarResumoProjeto() {
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  const projetoAtual = projetos[localStorage.getItem("projetoAtual")];

  if (!projetoAtual) return;

  const totalGabinetes = projetoAtual.gabinetes.length;
  const areaTotal = projetoAtual.gabinetes.reduce((soma, gabinete) => {
    const largura = gabinete.largura || 0;
    const altura = gabinete.altura || 0;
    return soma + (largura * altura) / 1000000; // m²
  }, 0);
  const potenciaTotal = projetoAtual.gabinetes.reduce((soma, gabinete) => {
    return soma + (gabinete.potencia || 0); // W
  }, 0);
  const correnteTotal = potenciaTotal / 220; // A, considerando 220V
  const pesoTotal = projetoAtual.gabinetes.reduce((soma, gabinete) => {
    return soma + (gabinete.peso || 0); // kg
  }, 0);

  document.getElementById("total-gabinetes").textContent = totalGabinetes;
  document.getElementById("total-area").textContent = `${areaTotal.toFixed(
    2
  )} m²`;
  document.getElementById("total-potencia").textContent = `${potenciaTotal} W`;
  document.getElementById(
    "total-corrente"
  ).textContent = `${correnteTotal.toFixed(2)} A`;
  document.getElementById("total-peso").textContent = `${pesoTotal} kg`;
}

// Função para editar um painel existente
function editarPainel(index) {
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  const projetoAtual = projetos[localStorage.getItem("projetoAtual")];

  if (!projetoAtual || !projetoAtual.gabinetes) return;

  const gabinete = projetoAtual.gabinetes[index];

  if (!gabinete) return;

  // Preencher o formulário com os dados do gabinete
  document.getElementById("select-gabinete-dimensao").value = gabinete.nome;
  document.getElementById("largura-painel").value = gabinete.largura / 1000;
  document.getElementById("altura-painel").value = gabinete.altura / 1000;

  // Mudar o título do modal
  const modalTitle = document.querySelector("#modal-paineis .modal-header h2");
  modalTitle.textContent = `Editar Painel - ${gabinete.nome}`;

  // Mostrar o botão de salvar alterações
  document.getElementById("btn-salvar-alteracoes").style.display =
    "inline-block";

  // Armazenar o índice do painel sendo editado
  painelEditandoIndex = index;
}

// Função para salvar as alterações de um painel editado
function salvarAlteracoesPainelEditado() {
  if (painelEditandoIndex === null) return;

  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  const projetoAtual = projetos[localStorage.getItem("projetoAtual")];

  if (!projetoAtual || !projetoAtual.gabinetes) return;

  const gabineteEditado = projetoAtual.gabinetes[painelEditandoIndex];

  if (!gabineteEditado) return;

  // Obter os novos valores do formulário
  const larguraNova =
    parseFloat(document.getElementById("largura-painel").value) * 1000; // converter para mm
  const alturaNova =
    parseFloat(document.getElementById("altura-painel").value) * 1000; // converter para mm

  // Atualizar os dados do gabinete
  gabineteEditado.largura = larguraNova;
  gabineteEditado.altura = alturaNova;

  // Salvar as alterações no localStorage
  localStorage.setItem("projetos", JSON.stringify(projetos));

  // Atualizar a exibição
  renderizarProjetos(projetos);
  atualizarSelectsProjeto(projetos);

  // Fechar o modal
  document.getElementById("modal-paineis").remove();

  // Resetar o índice de edição
  painelEditandoIndex = null;
}

// Função para excluir um painel do projeto
function excluirPainel(index) {
  if (!confirm("Tem certeza que deseja excluir este painel?")) return;

  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  const projetoAtual = projetos[localStorage.getItem("projetoAtual")];

  if (!projetoAtual || !projetoAtual.gabinetes) return;

  // Remover o gabinete da lista
  projetoAtual.gabinetes.splice(index, 1);

  // Salvar as alterações no localStorage
  localStorage.setItem("projetos", JSON.stringify(projetos));

  // Atualizar a exibição
  renderizarProjetos(projetos);
  atualizarSelectsProjeto(projetos);
}

// Função para atualizar o consumo de energia exibido
function atualizarConsumoEnergia() {
  // Obtém o tipo de tensão selecionado pelo usuário
  const projetoIndex = parseInt(localStorage.getItem("projetoAtual"));
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  let tipoTensao = "220v-bi";
  let fatorPotencia = 0.95;
  if (projetoIndex >= 0 && projetos[projetoIndex]) {
    const tensaoKey = `tensao_projeto_${projetos[projetoIndex].nome}`;
    tipoTensao = localStorage.getItem(tensaoKey) || "220v-bi";
    const fpKey = `fp_projeto_${projetos[projetoIndex].nome}`;
    fatorPotencia = parseFloat(localStorage.getItem(fpKey)) || 0.95;
  } else {
    const selectTensao = document.getElementById("select-tensao");
    if (selectTensao) tipoTensao = selectTensao.value;
    const inputFP = document.getElementById("input-fator-potencia");
    if (inputFP) fatorPotencia = parseFloat(inputFP.value) || 0.95;
  }

  // Obtém a potência total do elemento de texto, com fallback para zero
  const totalPotenciaElement = document.getElementById("total-potencia");
  if (!totalPotenciaElement) return;

  // Extrai o número da string (removendo o "W" e espaços)
  const potenciaTexto = totalPotenciaElement.textContent.replace(
    /[^\d.-]/g,
    ""
  );
  const totalPotencia = parseFloat(potenciaTexto) || 0;

  // Calcula a corrente total usando o calculador
  const correnteTotal = LEDCalculator.calcularCorrente(
    totalPotencia,
    220,
    tipoTensao,
    fatorPotencia
  );
  // Atualiza o elemento de corrente total na interface
  const totalCorrenteElement = document.getElementById("total-corrente");
  if (totalCorrenteElement) {
    // Remove a classe anterior
    totalCorrenteElement.className = "resumo-valor";

    // Atualiza o texto
    totalCorrenteElement.textContent = `${correnteTotal.toFixed(2)} A`;

    // Adiciona as classes novas
    totalCorrenteElement.className =
      "resumo-valor " + getClasseCorrente(correnteTotal);

    // Adiciona e remove classe para efeito de animação
    totalCorrenteElement.classList.add("total-corrente-changed");
    setTimeout(() => {
      totalCorrenteElement.classList.remove("total-corrente-changed");
    }, 1000);
  }

  // Atualiza também os valores individuais de cada painel na tabela
  const tbody = document.getElementById("corpo-tabela-paineis");
  if (!tbody) return;

  const linhas = tbody.querySelectorAll("tr");

  // Para cada painel, recalcula a corrente com base na potência
  linhas.forEach((linha) => {
    const celulas = linha.querySelectorAll("td");
    if (celulas.length >= 6) {
      // Extrai o valor da potência do texto da célula
      const potenciaTexto = celulas[4].textContent.replace(/[^\d.-]/g, "");
      const potencia = parseFloat(potenciaTexto) || 0;

      // Calcula a corrente para este painel específico
      const correntePainel = LEDCalculator.calcularCorrente(
        potencia,
        220,
        tipoTensao,
        fatorPotencia
      );

      // Atualiza a célula da corrente com o novo valor
      celulas[5].innerHTML = `<span class="${getClasseCorrente(
        correntePainel
      )}">${correntePainel.toFixed(2)} A</span>`;
    }
  });
}

// Inicializa a página
initProjetos();

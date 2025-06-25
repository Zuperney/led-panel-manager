/**
 * Módulo de Pixel Mapping
 * Permite criar e gerenciar mapeamentos de pixels para projetos de painéis LED
 */

// Estado do pixel mapping
let pixelMappingState = {
  projetoAtual: null,
  canvas: null,
  ctx: null,
  gabinetes: [],
  grid: {
    width: 0,
    height: 0,
    cellSize: 10,
  },
  mode: "view", // 'view', 'edit', 'test'
};

// Inicializa o módulo de pixel mapping
function initPixelMapping() {
  const pixelMappingArea = document.getElementById("pixel-mapping-area");
  const pixelProjetoSelect = document.getElementById("pixel-projeto");

  if (!pixelMappingArea || !pixelProjetoSelect) return;

  // Inicializa o canvas
  pixelMappingState.canvas = document.createElement("canvas");
  pixelMappingState.canvas.id = "pixel-canvas";
  pixelMappingState.canvas.width = 800;
  pixelMappingState.canvas.height = 600;
  pixelMappingState.ctx = pixelMappingState.canvas.getContext("2d");

  // Adiciona o canvas à área de mapeamento
  pixelMappingArea.appendChild(pixelMappingState.canvas);

  // Event listeners para os controles
  pixelProjetoSelect.addEventListener("change", carregarProjetoParaMapping);
  document
    .getElementById("btn-grid-view")
    .addEventListener("click", toggleGridView);
  document
    .getElementById("btn-export-mapping")
    .addEventListener("click", exportarMapping);

  // Evento de resize da janela
  window.addEventListener("resize", ajustarTamanhoCanvas);

  // Carrega os projetos para o select
  carregarProjetosParaSelect();
}

// Carrega os projetos para o select de pixel mapping
function carregarProjetosParaSelect() {
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  const select = document.getElementById("pixel-projeto");

  if (!select) return;

  // Limpa opções existentes, deixando apenas a primeira
  while (select.options.length > 1) {
    select.remove(1);
  }

  // Adiciona os projetos
  projetos.forEach((projeto, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = projeto.nome;
    select.appendChild(option);
  });
}

// Carrega um projeto para o pixel mapping
function carregarProjetoParaMapping() {
  const select = document.getElementById("pixel-projeto");
  if (!select || !select.value) {
    resetarCanvas();
    return;
  }

  const projetoIndex = parseInt(select.value);
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");

  if (projetoIndex < 0 || projetoIndex >= projetos.length) {
    resetarCanvas();
    return;
  }

  const projeto = projetos[projetoIndex];
  pixelMappingState.projetoAtual = projetoIndex;

  // Carrega os gabinetes do projeto
  carregarGabinetesDoProjetoParaMapping(projeto);

  // Atualiza o display de resolução
  atualizarResolucaoDisplay(projeto);

  // Renderiza o layout
  renderizarLayout();
}

// Carrega os gabinetes de um projeto para o mapeamento
function carregarGabinetesDoProjetoParaMapping(projeto) {
  const gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");
  pixelMappingState.gabinetes = [];

  // Se o projeto não tem gabinetes, retorna
  if (!projeto.gabinetes || projeto.gabinetes.length === 0) return;

  // Processa cada gabinete do projeto
  projeto.gabinetes.forEach((item) => {
    const gabineteOriginal = gabinetes[item.gabineteId];
    if (!gabineteOriginal) return;

    // Adiciona cada instância do gabinete
    for (let i = 0; i < item.quantidade; i++) {
      pixelMappingState.gabinetes.push({
        ...gabineteOriginal,
        x: 0, // Posição X inicial (será ajustada pelo layout automático)
        y: 0, // Posição Y inicial (será ajustada pelo layout automático)
        id: `${item.gabineteId}_${i}`,
        instancia: i,
      });
    }
  });

  // Aplica layout automático
  aplicarLayoutAutomatico();
}

// Aplica um layout automático aos gabinetes
function aplicarLayoutAutomatico() {
  if (pixelMappingState.gabinetes.length === 0) return;

  // Ordena os gabinetes por tamanho (do maior para o menor)
  pixelMappingState.gabinetes.sort((a, b) => {
    const areaA = a.largura * a.altura;
    const areaB = b.largura * b.altura;
    return areaB - areaA;
  });

  // Define a dimensão do grid com base nos gabinetes
  let maxWidth = 0;
  let maxHeight = 0;

  pixelMappingState.gabinetes.forEach((gabinete) => {
    maxWidth = Math.max(maxWidth, gabinete.largura);
    maxHeight = Math.max(maxHeight, gabinete.altura);
  });

  // Define uma área de trabalho baseada no tamanho total
  const totalArea = pixelMappingState.gabinetes.reduce((total, g) => {
    return total + g.largura * g.altura;
  }, 0);

  const aspectRatio = 1.618; // Proporção áurea para o layout
  const gridWidth = Math.ceil(Math.sqrt(totalArea * aspectRatio));
  const gridHeight = Math.ceil(Math.sqrt(totalArea / aspectRatio));

  pixelMappingState.grid.width = gridWidth;
  pixelMappingState.grid.height = gridHeight;

  // Implementa um algoritmo simples de "bin packing"
  let currentX = 0;
  let currentY = 0;
  let rowHeight = 0;

  pixelMappingState.gabinetes.forEach((gabinete) => {
    // Se não cabe na linha atual, avança para a próxima linha
    if (currentX + gabinete.largura > gridWidth) {
      currentX = 0;
      currentY += rowHeight;
      rowHeight = 0;
    }

    // Posiciona o gabinete
    gabinete.x = currentX;
    gabinete.y = currentY;

    // Atualiza a posição para o próximo gabinete
    currentX += gabinete.largura;
    rowHeight = Math.max(rowHeight, gabinete.altura);

    // Se ultrapassou a altura do grid, expande o grid
    if (currentY + gabinete.altura > pixelMappingState.grid.height) {
      pixelMappingState.grid.height = currentY + gabinete.altura;
    }
  });

  // Ajusta o tamanho da célula para que o canvas caiba na tela
  ajustarTamanhoCanvas();
}

// Ajusta o tamanho do canvas e das células do grid
function ajustarTamanhoCanvas() {
  const canvas = pixelMappingState.canvas;
  if (!canvas) return;

  // Obtém o tamanho disponível
  const pixelMappingArea = document.getElementById("pixel-mapping-area");
  const availableWidth = pixelMappingArea.clientWidth - 20; // Um pouco de margem
  const availableHeight = 600; // Altura máxima

  // Calcula o tamanho da célula
  const cellSizeX = availableWidth / pixelMappingState.grid.width;
  const cellSizeY = availableHeight / pixelMappingState.grid.height;
  pixelMappingState.grid.cellSize = Math.max(1, Math.min(cellSizeX, cellSizeY));

  // Define o tamanho do canvas
  canvas.width = pixelMappingState.grid.width * pixelMappingState.grid.cellSize;
  canvas.height =
    pixelMappingState.grid.height * pixelMappingState.grid.cellSize;

  // Re-renderiza o layout
  renderizarLayout();
}

// Renderiza o layout no canvas
function renderizarLayout() {
  const canvas = pixelMappingState.canvas;
  const ctx = pixelMappingState.ctx;
  if (!canvas || !ctx) return;

  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha o fundo
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenha o grid se estiver habilitado
  if (pixelMappingState.mode === "grid") {
    desenharGrid();
  }

  // Desenha cada gabinete
  pixelMappingState.gabinetes.forEach((gabinete) => {
    desenharGabinete(gabinete);
  });
}

// Desenha um gabinete no canvas
function desenharGabinete(gabinete) {
  const ctx = pixelMappingState.ctx;
  const cellSize = pixelMappingState.grid.cellSize;

  // Posição e tamanho em pixels no canvas
  const x = gabinete.x * cellSize;
  const y = gabinete.y * cellSize;
  const width = gabinete.largura * cellSize;
  const height = gabinete.altura * cellSize;

  // Cor do gabinete baseada no tipo ou índice
  const cores = [
    "#4285F4",
    "#EA4335",
    "#FBBC05",
    "#34A853", // Google colors
    "#7B1FA2",
    "#00ACC1",
    "#FF7043",
    "#689F38", // Material colors
    "#5D4037",
    "#00838F",
    "#C0CA33",
    "#6D4C41", // More colors
  ];

  // Seleciona uma cor baseada no ID do gabinete
  const colorIndex = parseInt(gabinete.id.split("_")[0]) % cores.length;
  const color = cores[colorIndex];

  // Desenha o gabinete
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);

  // Adiciona uma borda
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Escreve o nome do gabinete
  ctx.fillStyle = "#fff";
  ctx.font = "12px Arial";
  ctx.fillText(gabinete.nome, x + 5, y + 20);

  // Escreve a resolução
  const resolucao = `${gabinete.pixels_largura}x${gabinete.pixels_altura}`;
  ctx.fillText(resolucao, x + 5, y + 40);
}

// Desenha o grid no canvas
function desenharGrid() {
  const ctx = pixelMappingState.ctx;
  const cellSize = pixelMappingState.grid.cellSize;
  const width = pixelMappingState.grid.width * cellSize;
  const height = pixelMappingState.grid.height * cellSize;

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.5;

  // Linhas horizontais
  for (let y = 0; y <= pixelMappingState.grid.height; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(width, y * cellSize);
    ctx.stroke();
  }

  // Linhas verticais
  for (let x = 0; x <= pixelMappingState.grid.width; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, height);
    ctx.stroke();
  }
}

// Alterna a visualização do grid
function toggleGridView() {
  pixelMappingState.mode = pixelMappingState.mode === "grid" ? "view" : "grid";
  renderizarLayout();

  // Atualiza o texto do botão
  const btnGridView = document.getElementById("btn-grid-view");
  if (btnGridView) {
    btnGridView.textContent =
      pixelMappingState.mode === "grid"
        ? "Ocultar Grid"
        : "Visualização em Grid";
  }
}

// Limpa o canvas e reseta o estado
function resetarCanvas() {
  // Reseta o estado
  pixelMappingState.projetoAtual = null;
  pixelMappingState.gabinetes = [];
  pixelMappingState.grid.width = 0;
  pixelMappingState.grid.height = 0;

  // Limpa o canvas
  if (pixelMappingState.ctx) {
    pixelMappingState.ctx.clearRect(
      0,
      0,
      pixelMappingState.canvas.width,
      pixelMappingState.canvas.height
    );

    // Desenha uma mensagem de "sem projeto selecionado"
    pixelMappingState.ctx.fillStyle = "#1e1e1e";
    pixelMappingState.ctx.fillRect(
      0,
      0,
      pixelMappingState.canvas.width,
      pixelMappingState.canvas.height
    );

    pixelMappingState.ctx.fillStyle = "#999";
    pixelMappingState.ctx.font = "20px Arial";
    pixelMappingState.ctx.textAlign = "center";
    pixelMappingState.ctx.fillText(
      "Selecione um projeto para visualizar o mapeamento",
      pixelMappingState.canvas.width / 2,
      pixelMappingState.canvas.height / 2
    );
    pixelMappingState.ctx.textAlign = "left";
  }

  // Limpa a resolução
  document.getElementById("pixel-resolucao").textContent = "0 x 0";
}

// Atualiza o display de resolução
function atualizarResolucaoDisplay(projeto) {
  const resolucaoElement = document.getElementById("pixel-resolucao");
  if (!resolucaoElement) return;

  // Calcula a resolução máxima do projeto
  let maxWidth = 0;
  let maxHeight = 0;

  // Se não tem gabinetes, mostra resolução zero
  if (!projeto.gabinetes || projeto.gabinetes.length === 0) {
    resolucaoElement.textContent = "0 x 0";
    return;
  }

  // Busca os gabinetes para calcular a resolução
  const gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");

  // Para cada gabinete no projeto, calcula a contribuição para a resolução
  projeto.gabinetes.forEach((item) => {
    const gabinete = gabinetes[item.gabineteId];
    if (!gabinete) return;

    maxWidth = Math.max(maxWidth, gabinete.pixels_largura * item.quantidade);
    maxHeight = Math.max(maxHeight, gabinete.pixels_altura);
  });

  resolucaoElement.textContent = `${maxWidth} x ${maxHeight}`;
}

// Exporta o mapeamento atual
function exportarMapping() {
  if (!pixelMappingState.projetoAtual) {
    alert("Selecione um projeto antes de exportar o mapeamento.");
    return;
  }

  // Gera uma imagem do canvas
  const dataURL = pixelMappingState.canvas.toDataURL("image/png");

  // Cria um link para download
  const a = document.createElement("a");
  a.href = dataURL;

  // Obtém o nome do projeto
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
  const projeto = projetos[pixelMappingState.projetoAtual];
  const projetoNome = projeto ? projeto.nome.replace(/\s+/g, "-") : "mapping";

  a.download = `pixel-mapping-${projetoNome}-${new Date()
    .toISOString()
    .slice(0, 10)}.png`;
  document.body.appendChild(a);
  a.click();

  // Remove o link
  setTimeout(() => {
    document.body.removeChild(a);
  }, 0);
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  initPixelMapping();
});

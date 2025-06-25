/**
 * Módulo de Agenda - Exibe todos os projetos com tempo restante para entrega
 */

// Inicializa a página de agenda
function initAgenda() {
  // Carrega e exibe todos os projetos ordenados por prazo
  atualizarAgenda();

  // Configurar atualização automática a cada minuto
  setInterval(atualizarAgenda, 60000);
}

// Carregar projetos e exibir na agenda
function atualizarAgenda() {
  const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");

  // Ordena projetos por data de entrega (do mais urgente para o menos urgente)
  projetos.sort((a, b) => new Date(a.dataEntrega) - new Date(b.dataEntrega));

  renderizarAgenda(projetos);
}

// Renderiza a lista de projetos na agenda
function renderizarAgenda(projetos) {
  const agendaContainer = document.getElementById("agenda-container");
  if (!agendaContainer) return;

  agendaContainer.innerHTML = "";

  if (projetos.length === 0) {
    agendaContainer.innerHTML =
      "<div class='empty-message'><p>Nenhum projeto cadastrado na agenda.</p></div>";
    return;
  }

  // Cria as categorias de tempo
  const hoje = new Date();
  const categorias = {
    atrasados: { titulo: "Projetos Atrasados", classe: "atrasado", itens: [] },
    urgentes: {
      titulo: "Projetos Urgentes (menos de 7 dias)",
      classe: "urgente",
      itens: [],
    },
    emAndamento: {
      titulo: "Projetos em Andamento",
      classe: "em-andamento",
      itens: [],
    },
    futuros: { titulo: "Projetos Futuros", classe: "futuro", itens: [] },
  };

  // Classificar cada projeto
  projetos.forEach((projeto) => {
    const dataEntrega = new Date(projeto.dataEntrega);
    const diasRestantes = Math.ceil(
      (dataEntrega - hoje) / (1000 * 60 * 60 * 24)
    );
    const prazo = formatarTempoRestante(diasRestantes);

    const projetoInfo = {
      ...projeto,
      dataFormatada: dataEntrega.toLocaleDateString("pt-BR"),
      diasRestantes: diasRestantes,
      prazo: prazo,
    };

    if (diasRestantes < 0) {
      categorias.atrasados.itens.push(projetoInfo);
    } else if (diasRestantes <= 7) {
      categorias.urgentes.itens.push(projetoInfo);
    } else if (diasRestantes <= 30) {
      categorias.emAndamento.itens.push(projetoInfo);
    } else {
      categorias.futuros.itens.push(projetoInfo);
    }
  });

  // Criar elementos para cada categoria
  Object.values(categorias).forEach((categoria) => {
    if (categoria.itens.length === 0) return;

    const secao = document.createElement("div");
    secao.className = `agenda-section ${categoria.classe}`;

    secao.innerHTML = `<h3>${categoria.titulo} (${categoria.itens.length})</h3>`;

    const lista = document.createElement("div");
    lista.className = "agenda-list";

    categoria.itens.forEach((projeto) => {
      const card = criarCardProjeto(projeto);
      lista.appendChild(card);
    });

    secao.appendChild(lista);
    agendaContainer.appendChild(secao);
  });
}

// Cria um card para o projeto na agenda
function criarCardProjeto(projeto) {
  const card = document.createElement("div");
  card.className = `agenda-card ${getClassePrazo(projeto.diasRestantes)}`;

  let gabinetesSummary = "Sem gabinetes";
  if (projeto.paineis && projeto.paineis.length > 0) {
    const totalGabinetes = projeto.paineis.reduce(
      (sum, painel) => sum + (painel.quantidade || 0),
      0
    );
    gabinetesSummary = `${totalGabinetes} gabinete${
      totalGabinetes !== 1 ? "s" : ""
    }`;
  }

  card.innerHTML = `
        <div class="card-header">
            <h4>${projeto.nome}</h4>
            <div class="prazo-badge ${getClassePrazo(projeto.diasRestantes)}">
                ${projeto.prazo}
            </div>
        </div>
        <div class="card-body">
            <p><i class="fas fa-user"></i> Cliente: <strong>${
              projeto.cliente
            }</strong></p>
            <p><i class="fas fa-calendar"></i> Entrega: <strong>${
              projeto.dataFormatada
            }</strong></p>
            <p><i class="fas fa-object-group"></i> ${gabinetesSummary}</p>
        </div>
        <div class="card-actions">
            <button onclick="navigate('projetos'); abrirDetalhesProjeto('${
              projeto.id
            }')">
                <i class="fas fa-info-circle"></i> Ver detalhes
            </button>
        </div>
    `;

  return card;
}

// Formata o tempo restante para exibição
function formatarTempoRestante(dias) {
  if (dias < 0) {
    return `Atrasado há ${Math.abs(dias)} dia${
      Math.abs(dias) !== 1 ? "s" : ""
    }`;
  } else if (dias === 0) {
    return "Entrega hoje!";
  } else {
    return `${dias} dia${dias !== 1 ? "s" : ""} restante${
      dias !== 1 ? "s" : ""
    }`;
  }
}

// Retorna a classe CSS baseada no prazo
function getClassePrazo(dias) {
  if (dias < 0) return "atrasado";
  if (dias <= 3) return "muito-urgente";
  if (dias <= 7) return "urgente";
  if (dias <= 14) return "em-breve";
  return "no-prazo";
}

// Exporta função de inicialização
document.addEventListener("DOMContentLoaded", () => {
  // A função initAgenda será chamada quando a navegação carregar esta seção
});

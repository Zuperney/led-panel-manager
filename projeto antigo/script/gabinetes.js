// Variáveis globais
let gabineteEditando = null;

/**
 * Inicializa a página de gabinetes
 * Cria a interface e configura eventos
 */
function initGabinetes() {
  const gabineteContent = document.getElementById("gabinete-content");
  if (!gabineteContent) return;

  // Limpa o conteúdo anterior para evitar duplicação
  gabineteContent.innerHTML = "";

  // Container para o formulário
  const formContainer = document.createElement("div");
  formContainer.className = "card";
  formContainer.innerHTML = `
    <div class="card-header" id="form-title">Novo Gabinete</div>
    <form id="form-gabinete">
      <div class="form-row">
        <label>Nome: <input type="text" id="nome" required></label>
        <label>Tipo:
          <select id="tipo" required>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="transparente">Transparente</option>
            <option value="curvo">Curvo</option>
          </select>
        </label>
      </div>
      <div class="form-row">
        <label>Largura (mm): <input type="number" id="largura" min="1" required></label>
        <label>Altura (mm): <input type="number" id="altura" min="1" required></label>
      </div>
      <div class="form-row">
        <label>Pixels Largura: <input type="number" id="pixels_largura" min="1" required></label>
        <label>Pixels Altura: <input type="number" id="pixels_altura" min="1" required></label>
      </div>
      <div class="form-row">
        <label>Potência (W): <input type="number" id="potencia" min="0" required></label>
        <label>Peso (kg): <input type="number" id="peso" min="0" value="7"></label>
      </div>
      <div class="form-row">
        <label>Pitch (mm): <input type="number" id="pitch" step="0.1" min="0.1"></label>
        <label>Fabricante: <input type="text" id="fabricante"></label>
      </div>
      <div class="buttons-container">
        <button type="submit" id="btn-salvar" class="btn">Adicionar Gabinete</button>
        <button type="button" id="btn-cancelar" class="btn btn-warning" style="display:none">Cancelar</button>
      </div>
    </form>
  `;

  // Container para lista de gabinetes
  const listContainer = document.createElement("div");
  listContainer.innerHTML = "<h3>Modelos Cadastrados</h3>";

  const gridContainer = document.createElement("div");
  gridContainer.className = "grid";
  gridContainer.id = "grid-gabinetes";
  listContainer.appendChild(gridContainer);

  // Adiciona os elementos à página
  gabineteContent.appendChild(formContainer);
  gabineteContent.appendChild(listContainer);

  // Configura o formulário
  const form = document.getElementById("form-gabinete");
  form.addEventListener("submit", salvarGabinete);

  // Botão cancelar
  const btnCancelar = document.getElementById("btn-cancelar");
  if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarEdicao);
  }

  // Adiciona evento para calcular pitch automaticamente quando dimensões são alteradas
  ["largura", "altura", "pixels_largura", "pixels_altura"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("change", atualizarPitchSugerido);
    }
  });

  // Carrega os gabinetes iniciais
  carregarGabinetes();

  // Botão para restaurar modelos padrão
  const restoreBtn = document.createElement("button");
  restoreBtn.className = "btn btn-warning";
  restoreBtn.style.margin = "10px 0";
  restoreBtn.textContent = "Restaurar modelos padrão";
  restoreBtn.onclick = function () {
    if (
      confirm(
        "Deseja restaurar os modelos originais? Isso irá apagar todos os gabinetes cadastrados manualmente."
      )
    ) {
      localStorage.removeItem("gabinetes");
      carregarGabinetes();
      alert("Modelos padrão restaurados!");
    }
  };
  gabineteContent.appendChild(restoreBtn);
}

/**
 * Atualiza o pitch sugerido quando as dimensões do gabinete são alteradas
 */
function atualizarPitchSugerido() {
  const largura = parseFloat(document.getElementById("largura").value);
  const altura = parseFloat(document.getElementById("altura").value);
  const pixelsLargura = parseFloat(
    document.getElementById("pixels_largura").value
  );
  const pixelsAltura = parseFloat(
    document.getElementById("pixels_altura").value
  );

  // Verifica se todos os campos necessários estão preenchidos
  if (largura && altura && pixelsLargura && pixelsAltura) {
    const pitchX = largura / pixelsLargura;
    const pitchY = altura / pixelsAltura;

    // Se os pitches são próximos, sugerimos um valor médio
    if (Math.abs(pitchX - pitchY) < 0.1) {
      document.getElementById("pitch").value = ((pitchX + pitchY) / 2).toFixed(
        2
      );
    } else {
      // Se são diferentes, usamos o valor de X como padrão e mostramos uma mensagem
      document.getElementById("pitch").value = pitchX.toFixed(2);
      console.log(
        `Atenção: Pitch X (${pitchX.toFixed(2)}mm) e Y (${pitchY.toFixed(
          2
        )}mm) são diferentes.`
      );
    }
  }
}

/**
 * Carrega gabinetes da API remota ou do armazenamento local
 * Tenta carregar do localStorage primeiro e, se não encontrar, busca do arquivo JSON
 */
function carregarGabinetes() {
  // Tenta carregar do localStorage primeiro
  let gabinetes = [];

  try {
    gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");
  } catch (err) {
    console.error("Erro ao carregar gabinetes do localStorage:", err);
  }

  if (gabinetes.length > 0) {
    renderizarGabinetes(gabinetes);
    return;
  }

  // Se não tem no localStorage, tenta carregar do arquivo JSON
  fetch("data/gabinetes.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Problema ao carregar gabinetes: ${res.status}`);
      }
      return res.json();
    })
    .then((gabinetes) => {
      if (gabinetes.length > 0) {
        try {
          localStorage.setItem("gabinetes", JSON.stringify(gabinetes));
        } catch (err) {
          console.warn(
            "Não foi possível salvar gabinetes no localStorage:",
            err
          );
        }
      }
      renderizarGabinetes(gabinetes);
    })
    .catch((err) => {
      console.error("Erro ao carregar gabinetes:", err);
      renderizarGabinetes([]);
    });
}

/**
 * Renderiza a lista de gabinetes na interface
 * @param {Array} gabinetes - Lista de gabinetes a serem exibidos
 */
function renderizarGabinetes(gabinetes) {
  const grid = document.getElementById("grid-gabinetes");
  if (!grid) return;

  grid.innerHTML = "";

  if (gabinetes.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-message";
    emptyMessage.innerHTML =
      "<p>Nenhum gabinete cadastrado. Adicione um novo gabinete usando o formulário acima.</p>";
    grid.appendChild(emptyMessage);
    return;
  }

  gabinetes.forEach((gabinete, index) => {
    if (!gabinete) return; // Ignora entradas inválidas

    const card = document.createElement("div");
    card.className = "card";

    // Calcula o pitch se não estiver definido
    const pitch = calcularPitchExibicao(gabinete);

    // Calcular a área em m²
    const areaM2 = ((gabinete.largura * gabinete.altura) / 1000000).toFixed(3);

    card.innerHTML = `
      <div class="card-header">${gabinete.nome || "Gabinete sem nome"}</div>
      <div class="card-body">
        <div class="card-info">
          <p><i class="fas fa-ruler"></i> Tamanho: ${
            gabinete.largura || 0
          }mm x ${gabinete.altura || 0}mm (${areaM2}m²)</p>
          <p><i class="fas fa-th"></i> Resolução: ${
            gabinete.pixels_largura || 0
          } x ${gabinete.pixels_altura || 0} pixels</p>
          <p><i class="fas fa-bolt"></i> Potência: ${
            gabinete.potencia || 0
          }W</p>
          <p><i class="fas fa-weight-hanging"></i> Peso: ${
            gabinete.peso || 7
          }kg</p>
          <p><i class="fas fa-grip-horizontal"></i> Pitch: ${pitch}mm</p>
          ${
            gabinete.fabricante
              ? `<p><i class="fas fa-industry"></i> Fabricante: ${gabinete.fabricante}</p>`
              : ""
          }
          ${
            gabinete.tipo
              ? `<p><i class="fas fa-tag"></i> Tipo: ${gabinete.tipo}</p>`
              : ""
          }
        </div>
        <div class="card-actions">
          <button class="btn" onclick="editarGabinete(${index})">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn btn-danger" onclick="excluirGabinete(${index})">
            <i class="fas fa-trash"></i> Excluir
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/**
 * Calcula o pitch para exibição, com tratamento de erro
 * @param {Object} gabinete - Objeto gabinete
 * @returns {string} Pitch formatado
 */
function calcularPitchExibicao(gabinete) {
  // Se já tiver pitch definido, usa-o
  if (gabinete.pitch) return gabinete.pitch.toFixed(2);

  // Se não, calcula baseado na resolução e dimensões
  if (gabinete.pixels_largura && gabinete.largura) {
    return (gabinete.largura / gabinete.pixels_largura).toFixed(2);
  } else if (gabinete.pixels_altura && gabinete.altura) {
    return (gabinete.altura / gabinete.pixels_altura).toFixed(2);
  }

  return "N/A";
}

/**
 * Salva um novo gabinete ou atualiza um existente
 * @param {Event} e - Evento de submit do formulário
 */
function salvarGabinete(e) {
  e.preventDefault();

  try {
    // Cria objeto de gabinete a partir do formulário, com validações
    const gabinete = {
      nome: document.getElementById("nome").value,
      tipo: document.getElementById("tipo").value,
      largura: parseInt(document.getElementById("largura").value) || 0,
      altura: parseInt(document.getElementById("altura").value) || 0,
      pixels_largura:
        parseInt(document.getElementById("pixels_largura").value) || 0,
      pixels_altura:
        parseInt(document.getElementById("pixels_altura").value) || 0,
      potencia: parseInt(document.getElementById("potencia").value) || 0,
      peso: parseInt(document.getElementById("peso").value) || 7,
      pitch: parseFloat(document.getElementById("pitch").value || "0"),
      fabricante: document.getElementById("fabricante").value,
    };

    // Validações adicionais
    if (gabinete.largura <= 0 || gabinete.altura <= 0) {
      throw new Error("Largura e altura devem ser maiores que zero.");
    }

    if (gabinete.pixels_largura <= 0 || gabinete.pixels_altura <= 0) {
      throw new Error("Resolução deve ser maior que zero.");
    }

    if (gabinete.potencia < 0) {
      throw new Error("Potência não pode ser negativa.");
    }

    let gabinetes = [];
    try {
      gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");
    } catch (err) {
      console.error("Erro ao carregar gabinetes:", err);
      gabinetes = [];
    }

    if (gabineteEditando !== null) {
      // Atualizar gabinete existente
      gabinetes[gabineteEditando] = gabinete;
      gabineteEditando = null;
    } else {
      // Adicionar novo gabinete
      gabinetes.push(gabinete);
    }

    localStorage.setItem("gabinetes", JSON.stringify(gabinetes));
    renderizarGabinetes(gabinetes);

    // Resetar o formulário
    document.getElementById("form-gabinete").reset();
    document.getElementById("form-title").textContent = "Novo Gabinete";
    document.getElementById("btn-salvar").textContent = "Adicionar Gabinete";
    document.getElementById("btn-cancelar").style.display = "none";
  } catch (error) {
    alert(`Erro ao salvar gabinete: ${error.message}`);
  }
}

/**
 * Carrega um gabinete para edição
 * @param {number} index - Índice do gabinete no array
 */
function editarGabinete(index) {
  try {
    const gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");
    if (index < 0 || index >= gabinetes.length || !gabinetes[index]) {
      throw new Error("Gabinete não encontrado.");
    }

    const gabinete = gabinetes[index];
    gabineteEditando = index;

    // Preenche o formulário com os dados do gabinete
    document.getElementById("nome").value = gabinete.nome || "";
    document.getElementById("tipo").value = gabinete.tipo || "indoor";
    document.getElementById("largura").value = gabinete.largura || 0;
    document.getElementById("altura").value = gabinete.altura || 0;
    document.getElementById("pixels_largura").value =
      gabinete.pixels_largura || 0;
    document.getElementById("pixels_altura").value =
      gabinete.pixels_altura || 0;
    document.getElementById("potencia").value = gabinete.potencia || 0;
    document.getElementById("peso").value = gabinete.peso || 7;
    document.getElementById("pitch").value = gabinete.pitch || "";
    document.getElementById("fabricante").value = gabinete.fabricante || "";

    // Atualiza a interface para modo de edição
    document.getElementById("form-title").textContent = "Editar Gabinete";
    document.getElementById("btn-salvar").textContent = "Salvar Alterações";
    document.getElementById("btn-cancelar").style.display = "inline-block";

    // Scroll para o formulário
    document
      .getElementById("form-gabinete")
      .scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    alert(`Erro ao editar gabinete: ${error.message}`);
  }
}

/**
 * Cancela a edição de um gabinete
 */
function cancelarEdicao() {
  gabineteEditando = null;
  document.getElementById("form-gabinete").reset();
  document.getElementById("form-title").textContent = "Novo Gabinete";
  document.getElementById("btn-salvar").textContent = "Adicionar Gabinete";
  document.getElementById("btn-cancelar").style.display = "none";
}

/**
 * Exclui um gabinete
 * @param {number} index - Índice do gabinete no array
 */
function excluirGabinete(index) {
  if (confirm("Tem certeza que deseja excluir este gabinete?")) {
    try {
      let gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");

      // Verifica se o gabinete está sendo usado em algum projeto
      const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
      const emUso = projetos.some(
        (projeto) =>
          projeto.gabinetes &&
          projeto.gabinetes.some((item) => item.gabineteId === index)
      );

      if (emUso) {
        if (
          !confirm(
            "Este gabinete está sendo usado em um ou mais projetos. A exclusão pode causar problemas. Deseja continuar mesmo assim?"
          )
        ) {
          return;
        }
      }

      gabinetes.splice(index, 1);
      localStorage.setItem("gabinetes", JSON.stringify(gabinetes));
      renderizarGabinetes(gabinetes);

      // Se estava editando o gabinete que foi excluído, cancela a edição
      if (gabineteEditando === index) {
        cancelarEdicao();
      } else if (gabineteEditando !== null && gabineteEditando > index) {
        // Ajusta o índice de edição se necessário
        gabineteEditando--;
      }
    } catch (error) {
      alert(`Erro ao excluir gabinete: ${error.message}`);
    }
  }
}

/**
 * Inicialização quando o DOM estiver pronto
 */
document.addEventListener("DOMContentLoaded", () => {
  initGabinetes();
});

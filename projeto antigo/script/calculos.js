/**
 * Biblioteca de cálculos para painéis LED
 * Contém funções para calcular área, resolução, potência, peso e outros parâmetros relevantes
 * v1.1 - Adicionado suporte para cálculos de corrente com diferentes configurações de tensão
 */

// Objeto que contém todos os cálculos relevantes para painéis LED
const LEDCalculator = {
  /**
   * Calcula a área total em m² de um gabinete
   * @param {number} largura - Largura em mm
   * @param {number} altura - Altura em mm
   * @param {number} quantidade - Quantidade de gabinetes
   * @returns {number} Área total em m²
   */
  calcularArea: function (largura, altura, quantidade = 1) {
    // Verifica se os valores são válidos
    if (!largura || !altura || isNaN(largura) || isNaN(altura)) {
      return 0;
    }

    // Garante que quantidade é no mínimo 1
    const qtde = Math.max(1, quantidade || 1);

    // largura e altura em mm, resultado em m²
    return ((largura * altura) / 1000000) * qtde;
  },

  /**
   * Calcula o pitch baseado nas dimensões físicas e resolução
   * @param {number} largura - Largura em mm
   * @param {number} altura - Altura em mm
   * @param {number} pixelsLargura - Número de pixels na largura
   * @param {number} pixelsAltura - Número de pixels na altura
   * @returns {number|object} Pitch médio ou objeto com pitch X e Y
   */
  calcularPitch: function (largura, altura, pixelsLargura, pixelsAltura) {
    // Verifica se os valores são válidos
    if (
      !largura ||
      !altura ||
      !pixelsLargura ||
      !pixelsAltura ||
      isNaN(largura) ||
      isNaN(altura) ||
      isNaN(pixelsLargura) ||
      isNaN(pixelsAltura)
    ) {
      return 0;
    }

    const pitchX = largura / pixelsLargura;
    const pitchY = altura / pixelsAltura;

    // Retorna a média dos dois valores se forem próximos (painéis quadrados)
    if (Math.abs(pitchX - pitchY) < 0.1) {
      return (pitchX + pitchY) / 2;
    }

    // Retorna um objeto com os dois valores se forem significativamente diferentes
    return { x: pitchX, y: pitchY };
  },

  /**
   * Calcula o consumo elétrico total em kilowatts (para orçamentos)
   * @param {number} potenciaW - Potência em watts
   * @param {number} horasPorDia - Horas de funcionamento por dia
   * @param {number} diasPorMes - Dias de funcionamento por mês
   * @returns {number} Consumo mensal em kWh
   */
  calcularConsumoEletrico: function (
    potenciaW,
    horasPorDia = 12,
    diasPorMes = 30
  ) {
    // Verifica se potência é válida
    if (isNaN(potenciaW) || potenciaW < 0) {
      return 0;
    }

    // Resultado em kWh por mês
    return (potenciaW / 1000) * horasPorDia * diasPorMes;
  },

  /**
   * Calcula o custo mensal de energia
   * @param {number} potenciaW - Potência em watts
   * @param {number} horasPorDia - Horas de funcionamento por dia
   * @param {number} diasPorMes - Dias de funcionamento por mês
   * @param {number} custoKWh - Custo por kWh em moeda local
   * @returns {number} Custo mensal de energia
   */
  calcularCustoEnergia: function (
    potenciaW,
    horasPorDia = 12,
    diasPorMes = 30,
    custoKWh = 0.65
  ) {
    const consumoKWh = this.calcularConsumoEletrico(
      potenciaW,
      horasPorDia,
      diasPorMes
    );
    return consumoKWh * custoKWh;
  },

  /**
   * Calcula a densidade de pixels (pixels por metro quadrado)
   * @param {number} pixelsLargura - Número de pixels na largura
   * @param {number} pixelsAltura - Número de pixels na altura
   * @param {number} largura - Largura em mm
   * @param {number} altura - Altura em mm
   * @returns {number} Densidade de pixels em pixels/m²
   */
  calcularDensidadePixels: function (
    pixelsLargura,
    pixelsAltura,
    largura,
    altura
  ) {
    // Verifica se os valores são válidos
    if (
      !largura ||
      !altura ||
      !pixelsLargura ||
      !pixelsAltura ||
      isNaN(largura) ||
      isNaN(altura) ||
      isNaN(pixelsLargura) ||
      isNaN(pixelsAltura)
    ) {
      return 0;
    }

    // largura e altura em mm, resultado em pixels/m²
    const area = (largura * altura) / 1000000; // em m²
    const totalPixels = pixelsLargura * pixelsAltura;
    return totalPixels / area;
  },

  /**
   * Calcula a distância mínima de visualização (em metros)
   * @param {number} pitch - Pitch em mm
   * @returns {number} Distância mínima em metros
   */
  calcularDistanciaMinima: function (pitch) {
    // Verifica se o pitch é válido
    if (isNaN(pitch) || pitch <= 0) {
      return 0;
    }

    // Regra geral: distância mínima = pitch(mm) * 1000
    // Esta é uma regra prática aproximada
    return (pitch * 1000) / 1000;
  },

  /**
   * Calcula a distância máxima de visualização (em metros)
   * @param {number} alturaDisplay - Altura em mm
   * @returns {number} Distância máxima em metros
   */
  calcularDistanciaMaxima: function (alturaDisplay) {
    // Verifica se altura é válida
    if (isNaN(alturaDisplay) || alturaDisplay <= 0) {
      return 0;
    }

    // alturaDisplay em mm, resultado em metros
    // Regra prática: distância máx = altura do display * 10
    return (alturaDisplay / 1000) * 10;
  },

  /**
   * Calcula a melhor resolução para uma determinada distância de visualização
   * @param {number} distanciaVisualizacao - Distância em metros
   * @returns {number} Pitch recomendado em mm
   */
  calcularPitchRecomendado: function (distanciaVisualizacao) {
    // Verifica se distância é válida
    if (isNaN(distanciaVisualizacao) || distanciaVisualizacao <= 0) {
      return 0;
    }

    // distanciaVisualizacao em metros, resultado em mm
    // Regra aproximada: pitch = distância / 1000
    return distanciaVisualizacao / 1000;
  },

  /**
   * Calcula o peso total de um projeto
   * @param {Array} gabinetes - Array de objetos gabinete com peso e quantidade
   * @returns {number} Peso total em kg
   */
  calcularPesoTotal: function (gabinetes) {
    if (!Array.isArray(gabinetes)) return 0;

    return gabinetes.reduce((total, item) => {
      if (!item || isNaN(item.peso) || isNaN(item.quantidade)) return total;
      return total + (item.peso || 7) * (item.quantidade || 1);
    }, 0);
  },

  /**
   * Calcula a potência total de um projeto
   * @param {Array} gabinetes - Array de objetos gabinete com potência e quantidade
   * @returns {number} Potência total em watts
   */
  calcularPotenciaTotal: function (gabinetes) {
    if (!Array.isArray(gabinetes)) return 0;

    return gabinetes.reduce((total, item) => {
      if (!item || isNaN(item.potencia) || isNaN(item.quantidade)) return total;
      return total + (item.potencia || 0) * (item.quantidade || 1);
    }, 0);
  },

  /**
   * Calcula a densidade total (kg/m²) para requisitos estruturais
   * @param {number} pesoTotal - Peso total em kg
   * @param {number} areaTotal - Área total em m²
   * @returns {number} Densidade em kg/m²
   */
  calcularDensidade: function (pesoTotal, areaTotal) {
    if (isNaN(pesoTotal) || isNaN(areaTotal) || areaTotal <= 0) {
      return 0;
    }
    return pesoTotal / areaTotal;
  },

  /**
   * Calcula o número de módulos necessários para preencher uma área
   * @param {number} larguraDesejada - Largura desejada em mm
   * @param {number} alturaDesejada - Altura desejada em mm
   * @param {number} larguraGabinete - Largura do gabinete em mm
   * @param {number} alturaGabinete - Altura do gabinete em mm
   * @returns {object} Informações sobre o layout calculado
   */
  calcularNecessidadeGabinetes: function (
    larguraDesejada,
    alturaDesejada,
    larguraGabinete,
    alturaGabinete
  ) {
    // Verifica se os valores são válidos
    if (
      !larguraDesejada ||
      !alturaDesejada ||
      !larguraGabinete ||
      !alturaGabinete ||
      isNaN(larguraDesejada) ||
      isNaN(alturaDesejada) ||
      isNaN(larguraGabinete) ||
      isNaN(alturaGabinete)
    ) {
      return {
        horizontal: 0,
        vertical: 0,
        total: 0,
        larguraFinal: 0,
        alturaFinal: 0,
      };
    }

    const modulosHorizontais = Math.ceil(larguraDesejada / larguraGabinete);
    const modulosVerticais = Math.ceil(alturaDesejada / alturaGabinete);

    return {
      horizontal: modulosHorizontais,
      vertical: modulosVerticais,
      total: modulosHorizontais * modulosVerticais,
      larguraFinal: modulosHorizontais * larguraGabinete,
      alturaFinal: modulosVerticais * alturaGabinete,
    };
  },

  /**
   * Calcula a corrente elétrica em amperes com base na potência e tensão
   *
   * @param {number} potenciaW - Potência em watts
   * @param {number} tensao - Tensão nominal em volts (geralmente 220V)
   * @param {string} tipo - Configuração do sistema ("220v-bi", "220v-tri", etc)
   * @param {number} fatorPotencia - Fator de potência (opcional, padrão 0.95)
   * @return {number} Corrente em amperes
   *
   * Fórmulas utilizadas:
   * - Sistema monofásico/bifásico: I = P / (V * fp)
   * - Sistema trifásico: I = P / (√3 * V * fp)
   *
   * Obs: Gabinetes LED sempre trabalham em 220V mesmo quando alimentados
   * em sistemas 380V (usando neutro para obter 220V)
   */
  calcularCorrente: function (potenciaW, tensao, tipo, fatorPotencia) {
    // Verifica se os valores são numéricos
    if (isNaN(potenciaW) || potenciaW < 0) return 0;

    // Garante que tensao tenha um valor padrão válido
    const tensaoEfetiva = tensao || 220;

    // Fator de potência típico para painéis LED (cos φ)
    const fp =
      typeof fatorPotencia === "number" &&
      fatorPotencia > 0 &&
      fatorPotencia <= 1
        ? fatorPotencia
        : this.getFatorPotencia();

    switch (tipo) {
      case "220v-bi":
      case "220v-mono":
      case "380v-mono":
      case "380v-bi":
        // Monofásico ou bifásico: I = P / (V * fp)
        return potenciaW / (tensaoEfetiva * fp);
      case "220v-tri":
      case "380v-tri":
        // Trifásico: I = P / (√3 * V * fp)
        return potenciaW / (Math.sqrt(3) * tensaoEfetiva * fp);
      default:
        // Valor padrão para cálculo monofásico
        return potenciaW / (tensaoEfetiva * fp);
    }
  },

  /**
   * Retorna a descrição formatada do sistema de tensão
   *
   * @param {string} tipoTensao - Tipo de tensão (ex: "220v-bi")
   * @return {string} Descrição formatada para exibição
   */
  getDescricaoTensao: function (tipoTensao) {
    // Mapa de descrições para cada tipo de tensão
    const descricoes = {
      "220v-bi": "220V Bifásico",
      "220v-tri": "220V Trifásico",
      "380v-mono": "380V com Neutro (Monofásico)",
      "380v-bi": "380V com Neutro (Bifásico)",
      "380v-tri": "380V com Neutro (Trifásico)",
    };

    // Retorna a descrição correspondente ou um valor padrão se não encontrado
    return descricoes[tipoTensao] || "220V Monofásico";
  },

  /**
   * Retorna o fator de potência do sistema (cos φ)
   * Usado para calcular a potência aparente a partir da potência ativa
   *
   * @return {number} Fator de potência (valor típico para painéis LED)
   */
  getFatorPotencia: function () {
    // Valor típico para painéis LED (pode variar entre 0.90 e 0.98)
    return 0.95;
  },

  /**
   * Converte potência em watts para kVA (kilovolt-ampere)
   *
   * @param {number} potenciaW - Potência em watts
   * @return {number} Potência aparente em kVA
   */
  calcularPotenciaAparente: function (potenciaW) {
    if (isNaN(potenciaW) || potenciaW < 0) return 0;
    return potenciaW / (1000 * this.getFatorPotencia());
  },

  /**
   * Classifica a corrente elétrica em categorias para feedback visual
   *
   * @param {number} corrente - Corrente em amperes
   * @return {string} Classificação ('baixa', 'media', 'alta', 'muito-alta')
   */
  classificarCorrente: function (corrente) {
    if (isNaN(corrente)) return "baixa";

    // Classificação baseada em faixas típicas para painéis LED
    if (corrente < 5) return "baixa";
    if (corrente < 15) return "media";
    if (corrente < 30) return "alta";
    return "muito-alta";
  },

  /**
   * Calcula o número de disjuntores necessários para o sistema
   *
   * @param {number} correnteTotal - Corrente total em amperes
   * @param {number} correnteDisjuntor - Corrente do disjuntor (padrão 16A)
   * @return {number} Número de disjuntores necessários
   */
  calcularNumeroDisjuntores: function (correnteTotal, correnteDisjuntor = 16) {
    if (isNaN(correnteTotal) || correnteTotal <= 0) return 0;

    // Adicionamos uma margem de segurança de 20%
    const correnteComSeguranca = correnteTotal * 1.2;
    return Math.ceil(correnteComSeguranca / correnteDisjuntor);
  },

  /**
   * Calcula a bitola do cabo necessária com base na corrente
   * Esta é uma estimativa simplificada baseada em tabelas padrão
   *
   * @param {number} corrente - Corrente em amperes
   * @return {string} Bitola de cabo recomendada
   */
  calcularBitolaCabo: function (corrente) {
    if (isNaN(corrente) || corrente < 0) return "1.5 mm²";

    if (corrente <= 10) return "1.5 mm²";
    if (corrente <= 16) return "2.5 mm²";
    if (corrente <= 25) return "4.0 mm²";
    if (corrente <= 35) return "6.0 mm²";
    if (corrente <= 50) return "10.0 mm²";
    if (corrente <= 70) return "16.0 mm²";
    return "25.0 mm²";
  },
};

/**
 * Função para gerar um resumo técnico de um projeto
 * @param {string|number} projeto - ID ou nome do projeto
 * @returns {object|null} Resumo técnico do projeto ou null se não encontrado
 */
function gerarResumoTecnico(projeto) {
  try {
    const projetos = JSON.parse(localStorage.getItem("projetos") || "[]");
    const gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");

    // Encontra o projeto pelo ID
    const projetoIndex =
      typeof projeto === "number"
        ? projeto
        : projetos.findIndex((p) => p.nome === projeto);

    if (projetoIndex < 0 || projetoIndex >= projetos.length) {
      console.warn("Projeto não encontrado:", projeto);
      return null;
    }

    const projetoAtual = projetos[projetoIndex];
    const paineis = projetoAtual.gabinetes || [];

    // Obter o tipo de tensão selecionado (se disponível)
    const selectTensao = document.getElementById("select-tensao");
    const tipoTensao = selectTensao ? selectTensao.value : "220v-bi";
    const descricaoTensao = LEDCalculator.getDescricaoTensao(tipoTensao);

    // Inicializa o resumo
    const resumo = {
      nome: projetoAtual.nome,
      cliente: projetoAtual.cliente,
      dataEntrega: projetoAtual.dataEntrega,
      totalGabinetes: 0,
      totalArea: 0,
      maxResolucaoLargura: 0,
      maxResolucaoAltura: 0,
      totalPixels: 0,
      tipoTensao: descricaoTensao,
      totalPotencia: 0,
      totalPeso: 0,
      detalhes: [],
    };

    // Calcula os totalizadores
    paineis.forEach((item) => {
      if (!item || item.gabineteId < 0 || item.gabineteId >= gabinetes.length)
        return;

      const gabinete = gabinetes[item.gabineteId];
      if (!gabinete) return;

      const quantidade = item.quantidade || 1;
      const area = LEDCalculator.calcularArea(
        gabinete.largura,
        gabinete.altura,
        quantidade
      );
      const pixels =
        gabinete.pixels_largura * gabinete.pixels_altura * quantidade;
      const potencia = gabinete.potencia * quantidade;
      const corrente = LEDCalculator.calcularCorrente(
        potencia,
        220,
        tipoTensao
      );

      // --- Cálculo correto da resolução total ---
      // Aproxima disposição "mais quadrada" possível
      const gabinetesHoriz = Math.round(Math.sqrt(quantidade));
      const gabinetesVert = Math.ceil(quantidade / gabinetesHoriz);
      const resolucaoLargura = gabinete.pixels_largura * gabinetesHoriz;
      const resolucaoAltura = gabinete.pixels_altura * gabinetesVert;

      resumo.maxResolucaoLargura = Math.max(
        resumo.maxResolucaoLargura,
        resolucaoLargura
      );
      resumo.maxResolucaoAltura = Math.max(
        resumo.maxResolucaoAltura,
        resolucaoAltura
      );
      // -----------------------------------------

      // Acumular totais
      resumo.totalGabinetes += quantidade;
      resumo.totalArea += area;
      resumo.totalPixels += pixels;
      resumo.totalPotencia += gabinete.potencia * quantidade;
      resumo.totalPeso += (gabinete.peso || 7) * quantidade;

      // Adiciona detalhes do gabinete
      resumo.detalhes.push({
        nome: gabinete.nome,
        quantidade: quantidade,
        area: area.toFixed(3),
        resolucao: `${resolucaoLargura} x ${resolucaoAltura}`,
        potencia: gabinete.potencia * quantidade,
        corrente: corrente.toFixed(2) + " A",
        peso: (gabinete.peso || 7) * quantidade,
      });
    });

    // Calcula a corrente total
    const corrente = LEDCalculator.calcularCorrente(
      resumo.totalPotencia,
      220,
      tipoTensao
    );
    resumo.totalCorrente = corrente.toFixed(2) + " A";
    resumo.classificacaoCorrente = LEDCalculator.classificarCorrente(corrente);

    // Adiciona informações elétricas
    resumo.numeroDisjuntores =
      LEDCalculator.calcularNumeroDisjuntores(corrente);
    resumo.bitolaCaboRecomendada = LEDCalculator.calcularBitolaCabo(corrente);

    // Adiciona estimativas de consumo e visualização
    const horasDiarias = 12; // Estimativa de horas diárias de operação
    const custoKWh = 0.65; // Estimativa de custo por kWh (R$)

    resumo.consumoMensalKWh = LEDCalculator.calcularConsumoEletrico(
      resumo.totalPotencia,
      horasDiarias,
      30
    ).toFixed(2);

    resumo.custoMensalEnergia = LEDCalculator.calcularCustoEnergia(
      resumo.totalPotencia,
      horasDiarias,
      30,
      custoKWh
    ).toFixed(2);

    // Estimativa de distância de visualização
    // Usa o menor pitch dentre os gabinetes como referência
    let menorPitch = Infinity;
    paineis.forEach((item) => {
      if (!item || item.gabineteId < 0 || item.gabineteId >= gabinetes.length)
        return;

      const gabinete = gabinetes[item.gabineteId];
      if (!gabinete) return;

      const pitch =
        gabinete.pitch ||
        LEDCalculator.calcularPitch(
          gabinete.largura,
          gabinete.altura,
          gabinete.pixels_largura,
          gabinete.pixels_altura
        );

      if (typeof pitch === "object") {
        menorPitch = Math.min(menorPitch, pitch.x, pitch.y);
      } else {
        menorPitch = Math.min(menorPitch, pitch);
      }
    });

    if (menorPitch !== Infinity) {
      resumo.distanciaMinima =
        LEDCalculator.calcularDistanciaMinima(menorPitch).toFixed(1);
      resumo.distanciaMaxima = LEDCalculator.calcularDistanciaMaxima(
        resumo.maxResolucaoAltura
      ).toFixed(1);
    }

    return resumo;
  } catch (error) {
    console.error("Erro ao gerar resumo técnico:", error);
    return null;
  }
}

/**
 * Função para calcular a distribuição de gabinetes em um espaço de dimensões definidas
 * @param {number} larguraDesejada - Largura desejada em mm
 * @param {number} alturaDesejada - Altura desejada em mm
 * @param {number} gabineteId - ID do gabinete a ser utilizado
 * @returns {object|null} Distribuição calculada ou null em caso de erro
 */
function calcularDistribuicaoPainel(
  larguraDesejada,
  alturaDesejada,
  gabineteId
) {
  try {
    if (!larguraDesejada || !alturaDesejada || gabineteId === undefined) {
      throw new Error("Parâmetros inválidos para cálculo de distribuição");
    }

    const gabinetes = JSON.parse(localStorage.getItem("gabinetes") || "[]");

    if (
      gabineteId < 0 ||
      gabineteId >= gabinetes.length ||
      !gabinetes[gabineteId]
    ) {
      throw new Error("Gabinete não encontrado");
    }

    const gabinete = gabinetes[gabineteId];

    // Calcula a distribuição de gabinetes
    const distribuicao = LEDCalculator.calcularNecessidadeGabinetes(
      larguraDesejada,
      alturaDesejada,
      gabinete.largura,
      gabinete.altura
    );

    // Adiciona informações adicionais
    distribuicao.resolucaoFinal = {
      largura: distribuicao.horizontal * gabinete.pixels_largura,
      altura: distribuicao.vertical * gabinete.pixels_altura,
    };

    distribuicao.areaTotal = LEDCalculator.calcularArea(
      distribuicao.larguraFinal,
      distribuicao.alturaFinal,
      1
    ).toFixed(3);

    distribuicao.potenciaTotal = gabinete.potencia * distribuicao.total;
    distribuicao.pesoTotal = (gabinete.peso || 7) * distribuicao.total;

    // Adiciona informações elétricas
    const selectTensao = document.getElementById("select-tensao");
    const tipoTensao = selectTensao ? selectTensao.value : "220v-bi";

    distribuicao.correnteTotal = LEDCalculator.calcularCorrente(
      distribuicao.potenciaTotal,
      220,
      tipoTensao
    ).toFixed(2);

    distribuicao.tipoTensao = LEDCalculator.getDescricaoTensao(tipoTensao);

    return distribuicao;
  } catch (error) {
    console.error("Erro ao calcular distribuição do painel:", error);
    return null;
  }
}

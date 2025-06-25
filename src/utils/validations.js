import { APP_CONFIG } from "./config";

// Validações para formulários
export const validations = {
  // Validação para gabinetes
  validateGabinete: (gabinete) => {
    const errors = {};

    if (!gabinete.nome?.trim()) {
      errors.nome = "Nome é obrigatório";
    }

    if (
      !gabinete.largura ||
      gabinete.largura < APP_CONFIG.VALIDACAO.MIN_LARGURA
    ) {
      errors.largura = `Largura deve ser maior que ${APP_CONFIG.VALIDACAO.MIN_LARGURA}mm`;
    }

    if (!gabinete.altura || gabinete.altura < APP_CONFIG.VALIDACAO.MIN_ALTURA) {
      errors.altura = `Altura deve ser maior que ${APP_CONFIG.VALIDACAO.MIN_ALTURA}mm`;
    }

    if (
      !gabinete.pixels_largura ||
      gabinete.pixels_largura < APP_CONFIG.VALIDACAO.MIN_PIXELS
    ) {
      errors.pixels_largura = "Pixels em largura deve ser maior que 0";
    }

    if (
      !gabinete.pixels_altura ||
      gabinete.pixels_altura < APP_CONFIG.VALIDACAO.MIN_PIXELS
    ) {
      errors.pixels_altura = "Pixels em altura deve ser maior que 0";
    }

    if (
      !gabinete.potencia ||
      gabinete.potencia < APP_CONFIG.VALIDACAO.MIN_POTENCIA
    ) {
      errors.potencia = "Potência deve ser maior que 0";
    }

    if (!gabinete.peso || gabinete.peso < APP_CONFIG.VALIDACAO.MIN_PESO) {
      errors.peso = "Peso deve ser maior que 0";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Validação para projetos
  validateProjeto: (projeto) => {
    const errors = {};

    if (!projeto.nome?.trim()) {
      errors.nome = "Nome do projeto é obrigatório";
    }

    if (!projeto.cliente?.trim()) {
      errors.cliente = "Nome do cliente é obrigatório";
    }

    if (projeto.dataEntrega) {
      const today = new Date();
      const entrega = new Date(projeto.dataEntrega);
      if (entrega < today) {
        errors.dataEntrega = "Data de entrega não pode ser no passado";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Validação para painéis
  validatePainel: (painel) => {
    const errors = {};

    if (!painel.nome?.trim()) {
      errors.nome = "Nome do painel é obrigatório";
    }

    if (!painel.gabinete) {
      errors.gabinete = "Gabinete é obrigatório";
    }

    if (painel.modo === "gabinete") {
      if (!painel.qtdLargura || painel.qtdLargura < 1) {
        errors.qtdLargura =
          "Quantidade de gabinetes em largura deve ser maior que 0";
      }
      if (!painel.qtdAltura || painel.qtdAltura < 1) {
        errors.qtdAltura =
          "Quantidade de gabinetes em altura deve ser maior que 0";
      }
    } else if (painel.modo === "metro") {
      if (
        !painel.larguraM ||
        painel.larguraM < APP_CONFIG.VALIDACAO.MIN_LARGURA
      ) {
        errors.larguraM = "Largura em metros deve ser maior que 0";
      }
      if (!painel.alturaM || painel.alturaM < APP_CONFIG.VALIDACAO.MIN_ALTURA) {
        errors.alturaM = "Altura em metros deve ser maior que 0";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

// Função para verificar duplicatas
export const checkDuplicates = {
  gabinete: (gabinetes, nome, editIndex = null) => {
    return gabinetes.some(
      (g, index) =>
        g.nome.toLowerCase() === nome.toLowerCase() && index !== editIndex
    );
  },

  projeto: (projetos, nome, editIndex = null) => {
    return projetos.some(
      (p, index) =>
        p.nome.toLowerCase() === nome.toLowerCase() && index !== editIndex
    );
  },

  painel: (paineis, nome, projeto, editIndex = null) => {
    return paineis.some(
      (p, index) =>
        p.projeto === projeto &&
        p.nome.toLowerCase() === nome.toLowerCase() &&
        index !== editIndex
    );
  },
};

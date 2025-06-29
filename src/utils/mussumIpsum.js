/**
 * 🇧🇷 Mussum Ipsum - Gerador de texto de exemplo brasileiro
 *
 * Utilitário para gerar texto de exemplo em "mussumês"
 * baseado nas frases icônicas do humorista Mussum.
 *
 * Uso futuro: Para preencher campos de texto em desenvolvimento,
 * demos, protótipos e testes da aplicação.
 */

import { mIpsum } from "mipsum";

/**
 * Configuração padrão do Mussum Ipsum
 */
const defaultConfig = {
  pNum: 1, // Número de parágrafos
  resultType: "text", // Formato: 'text', 'html', 'array'
  pQuotes: 4, // Número de frases por parágrafo
  genLimit: 1000, // Limite de parágrafos
  tagBefore: "<p>", // Tag HTML antes (se resultType = 'html')
  tagAfter: "</p>", // Tag HTML depois (se resultType = 'html')
};

/**
 * Gerador principal do Mussum Ipsum
 */
export const MussumusUtils = {
  /**
   * Gera texto simples (uma linha)
   * Ideal para: nomes, títulos, labels
   */
  texto: (opcoes = {}) => {
    const config = { ...defaultConfig, pNum: 1, pQuotes: 2, ...opcoes };
    return mIpsum(config);
  },

  /**
   * Gera um parágrafo
   * Ideal para: descrições, comentários, textos médios
   */
  paragrafo: (opcoes = {}) => {
    const config = { ...defaultConfig, pNum: 1, pQuotes: 4, ...opcoes };
    return mIpsum(config);
  },

  /**
   * Gera múltiplos parágrafos
   * Ideal para: artigos, documentação, conteúdo longo
   */
  paragrafos: (quantidade = 3, opcoes = {}) => {
    const config = { ...defaultConfig, pNum: quantidade, ...opcoes };
    return mIpsum(config);
  },

  /**
   * Gera HTML com parágrafos
   * Ideal para: preview de conteúdo, componentes de texto
   */
  html: (quantidade = 1, opcoes = {}) => {
    const config = {
      ...defaultConfig,
      pNum: quantidade,
      resultType: "html",
      ...opcoes,
    };
    return mIpsum(config);
  },

  /**
   * Gera array de frases
   * Ideal para: listas, options de select, dados estruturados
   */
  array: (quantidade = 5, opcoes = {}) => {
    const config = {
      ...defaultConfig,
      pNum: quantidade,
      resultType: "array",
      ...opcoes,
    };
    return mIpsum(config);
  },

  /**
   * Gera nome de projeto (curto)
   * Ideal para: nomes de projetos, gabinetes, painéis
   */
  nomeProjeto: () => {
    const config = {
      ...defaultConfig,
      pNum: 1,
      pQuotes: 1,
      resultType: "text",
    };
    return mIpsum(config).split(" ").slice(0, 2).join(" ");
  },

  /**
   * Gera nome de cliente
   * Ideal para: nomes de empresas, clientes
   */
  nomeCliente: () => {
    const config = {
      ...defaultConfig,
      pNum: 1,
      pQuotes: 1,
      resultType: "text",
    };
    return mIpsum(config).split(" ").slice(0, 3).join(" ");
  },

  /**
   * Gera descrição de projeto
   * Ideal para: descrições de projetos, especificações
   */
  descricaoProjeto: () => {
    const config = {
      ...defaultConfig,
      pNum: 1,
      pQuotes: 3,
      resultType: "text",
    };
    return mIpsum(config);
  },

  /**
   * Gera texto para placeholder
   * Ideal para: placeholders em inputs
   */
  placeholder: () => {
    const config = {
      ...defaultConfig,
      pNum: 1,
      pQuotes: 2,
      resultType: "text",
    };
    return mIpsum(config).split(" ").slice(0, 4).join(" ") + "...";
  },
};

/**
 * Função de conveniência - atalho para uso rápido
 */
export const mussum = MussumusUtils.paragrafo;

/**
 * Função para popular dados de exemplo
 * Ideal para: desenvolvimento, testes, demos
 */
export const gerarDadosExemplo = {
  /**
   * Gera projetos de exemplo
   */
  projetos: (quantidade = 5) => {
    return Array.from({ length: quantidade }, (_, i) => ({
      nome: MussumusUtils.nomeProjeto(),
      cliente: MussumusUtils.nomeCliente(),
      descricao: MussumusUtils.descricaoProjeto(),
      dataEntrega: new Date(
        Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0], // Data aleatória nos próximos 90 dias
      _createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Criado nos últimos 30 dias
    }));
  },

  /**
   * Gera gabinetes de exemplo
   */
  gabinetes: (quantidade = 5) => {
    const tipos = ["Indoor", "Outdoor", "Transparente", "Curvo"];
    return Array.from({ length: quantidade }, (_, i) => ({
      nome: MussumusUtils.nomeProjeto() + " LED",
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      largura: Math.floor(Math.random() * 500) + 250, // 250-750mm
      altura: Math.floor(Math.random() * 500) + 250, // 250-750mm
      pixelPitch: (Math.random() * 10 + 1).toFixed(1), // 1.0-11.0mm
      potencia: Math.floor(Math.random() * 200) + 50, // 50-250W
      peso: (Math.random() * 15 + 5).toFixed(1), // 5.0-20.0kg
      fabricante: MussumusUtils.nomeCliente(),
    }));
  },

  /**
   * Gera painéis de exemplo
   */
  paineis: (quantidade = 3) => {
    return Array.from({ length: quantidade }, (_, i) => ({
      nome: MussumusUtils.nomeProjeto() + " Display",
      projeto: MussumusUtils.nomeProjeto(),
      gabinete: MussumusUtils.nomeProjeto() + " LED",
      largura: Math.floor(Math.random() * 10) + 5, // 5-15 módulos
      altura: Math.floor(Math.random() * 8) + 3, // 3-11 módulos
      observacoes: MussumusUtils.descricaoProjeto(),
    }));
  },
};

export default MussumusUtils;

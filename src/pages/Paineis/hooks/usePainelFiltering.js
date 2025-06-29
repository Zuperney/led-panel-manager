/**
 * Hook customizado para filtragem e ordenação de painéis
 *
 * Responsabilidades:
 * - Filtragem por texto (nome, projeto, gabinete)
 * - Filtragem por gabinete específico
 * - Filtragem por tipo de gabinete
 * - Ordenação por diferentes critérios
 * - Cálculos auxiliares para ordenação
 * - Gestão de estado dos filtros
 *
 * @author Led Panel Manager Team
 * @since 1.3.0
 */

import { useState, useMemo, useCallback } from "react";

export function usePainelFiltering(paineis, gabinetes) {
  const [busca, setBusca] = useState("");
  const [filtroGabinete, setFiltroGabinete] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [ordenacao, setOrdenacao] = useState("nome");

  /**
   * Calcula potência de um painel para ordenação
   * @param {Object} painel - Dados do painel
   * @param {Array} gabinetes - Lista de gabinetes
   * @returns {number} - Potência calculada
   */
  const calcularPotencia = useCallback((painel, gabinetes) => {
    const gabinete = gabinetes.find((g) => g.nome === painel.gabinete);
    if (!gabinete) return 0;

    const qtdGabinetes = (painel.qtdLargura || 1) * (painel.qtdAltura || 1);
    return gabinete.potencia * qtdGabinetes;
  }, []);

  /**
   * Painéis filtrados e ordenados
   */
  const paineisFiltrados = useMemo(() => {
    let resultado = [...paineis];

    // Filtro de busca por texto
    if (busca.trim()) {
      const termoBusca = busca.toLowerCase().trim();
      resultado = resultado.filter(
        (painel) =>
          painel.nome?.toLowerCase().includes(termoBusca) ||
          painel.projeto?.toLowerCase().includes(termoBusca) ||
          painel.gabinete?.toLowerCase().includes(termoBusca)
      );
    }

    // Filtro por gabinete específico
    if (filtroGabinete) {
      resultado = resultado.filter(
        (painel) => painel.gabinete === filtroGabinete
      );
    }

    // Filtro por tipo de gabinete
    if (filtroTipo) {
      resultado = resultado.filter((painel) => {
        const gabinete = gabinetes.find((g) => g.nome === painel.gabinete);
        return gabinete?.tipo === filtroTipo;
      });
    }

    // Ordenação
    resultado.sort((a, b) => {
      switch (ordenacao) {
        case "nome":
          return (a.nome || "").localeCompare(b.nome || "");

        case "nome-desc":
          return (b.nome || "").localeCompare(a.nome || "");

        case "projeto":
          return (
            (a.projeto || "").localeCompare(b.projeto || "") ||
            (a.nome || "").localeCompare(b.nome || "")
          );

        case "projeto-desc":
          return (
            (b.projeto || "").localeCompare(a.projeto || "") ||
            (b.nome || "").localeCompare(a.nome || "")
          );

        case "potencia": {
          const potenciaA = calcularPotencia(a, gabinetes);
          const potenciaB = calcularPotencia(b, gabinetes);
          return potenciaB - potenciaA; // Maior primeiro
        }

        case "potencia-desc": {
          const potenciaA = calcularPotencia(a, gabinetes);
          const potenciaB = calcularPotencia(b, gabinetes);
          return potenciaA - potenciaB; // Menor primeiro
        }

        case "area":
          return (b.area || 0) - (a.area || 0); // Maior primeiro

        case "area-desc":
          return (a.area || 0) - (b.area || 0); // Menor primeiro

        case "gabinete":
          return (a.gabinete || "").localeCompare(b.gabinete || "");

        case "gabinete-desc":
          return (b.gabinete || "").localeCompare(a.gabinete || "");

        default:
          return 0;
      }
    });

    return resultado;
  }, [
    paineis,
    gabinetes,
    busca,
    filtroGabinete,
    filtroTipo,
    ordenacao,
    calcularPotencia,
  ]);

  /**
   * Opções de ordenação disponíveis
   */
  const opcoesOrdenacao = useMemo(
    () => [
      { value: "nome", label: "Nome (A-Z)" },
      { value: "nome-desc", label: "Nome (Z-A)" },
      { value: "projeto", label: "Projeto (A-Z)" },
      { value: "projeto-desc", label: "Projeto (Z-A)" },
      { value: "potencia", label: "Potência (Maior)" },
      { value: "potencia-desc", label: "Potência (Menor)" },
      { value: "area", label: "Área (Maior)" },
      { value: "area-desc", label: "Área (Menor)" },
      { value: "gabinete", label: "Gabinete (A-Z)" },
      { value: "gabinete-desc", label: "Gabinete (Z-A)" },
    ],
    []
  );

  /**
   * Opções de gabinetes para filtro
   */
  const opcoesGabinetes = useMemo(() => {
    const gabinetesUnicos = [
      ...new Set(paineis.map((p) => p.gabinete).filter(Boolean)),
    ];
    return gabinetesUnicos.map((nome) => ({
      value: nome,
      label: nome,
    }));
  }, [paineis]);

  /**
   * Opções de tipos de gabinete para filtro
   */
  const opcoesTipos = useMemo(() => {
    const tipos = [...new Set(gabinetes.map((g) => g.tipo).filter(Boolean))];
    return tipos.map((tipo) => ({
      value: tipo,
      label: tipo,
    }));
  }, [gabinetes]);

  /**
   * Limpa todos os filtros
   */
  const limparFiltros = useCallback(() => {
    setBusca("");
    setFiltroGabinete("");
    setFiltroTipo("");
    setOrdenacao("nome");
  }, []);

  /**
   * Aplica filtro rápido por projeto
   * @param {string} projeto - Nome do projeto
   */
  const filtrarPorProjeto = useCallback((projeto) => {
    setBusca(projeto);
    setFiltroGabinete("");
    setFiltroTipo("");
  }, []);

  /**
   * Aplica filtro rápido por gabinete
   * @param {string} gabinete - Nome do gabinete
   */
  const filtrarPorGabinete = useCallback((gabinete) => {
    setFiltroGabinete(gabinete);
    setBusca("");
    setFiltroTipo("");
  }, []);

  /**
   * Estatísticas dos painéis filtrados
   */
  const estatisticas = useMemo(() => {
    const potenciaTotal = paineisFiltrados.reduce((acc, painel) => {
      return acc + calcularPotencia(painel, gabinetes);
    }, 0);

    const areaTotal = paineisFiltrados.reduce((acc, painel) => {
      return acc + (painel.area || 0);
    }, 0);

    const projetos = new Set(paineisFiltrados.map((p) => p.projeto));
    const gabinetesUsados = new Set(paineisFiltrados.map((p) => p.gabinete));

    return {
      total: paineisFiltrados.length,
      potenciaTotal,
      areaTotal,
      projetos: projetos.size,
      gabinetesUsados: gabinetesUsados.size,
    };
  }, [paineisFiltrados, gabinetes, calcularPotencia]);

  return {
    // Estados dos filtros
    busca,
    setBusca,
    filtroGabinete,
    setFiltroGabinete,
    filtroTipo,
    setFiltroTipo,
    ordenacao,
    setOrdenacao,

    // Resultado filtrado
    paineisFiltrados,

    // Opções para selects
    opcoesOrdenacao,
    opcoesGabinetes,
    opcoesTipos,

    // Funções auxiliares
    limparFiltros,
    filtrarPorProjeto,
    filtrarPorGabinete,
    calcularPotencia,

    // Informações dos filtros
    temFiltrosAtivos: !!(busca || filtroGabinete || filtroTipo),
    totalFiltrado: paineisFiltrados.length,
    totalOriginal: paineis.length,

    // Estatísticas
    estatisticas,
  };
}

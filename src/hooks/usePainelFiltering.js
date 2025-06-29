import { useState, useMemo } from "react";

export function usePainelFiltering(paineis, gabinetes) {
  const [busca, setBusca] = useState("");
  const [filtroGabinete, setFiltroGabinete] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [ordenacao, setOrdenacao] = useState("nome");

  const paineisFiltrados = useMemo(() => {
    let resultado = [...paineis];

    // Filtro de busca
    if (busca.trim()) {
      const termoBusca = busca.toLowerCase().trim();
      resultado = resultado.filter(
        (painel) =>
          painel.nome?.toLowerCase().includes(termoBusca) ||
          painel.projeto?.toLowerCase().includes(termoBusca) ||
          painel.gabinete?.toLowerCase().includes(termoBusca)
      );
    }

    // Filtro por gabinete
    if (filtroGabinete) {
      resultado = resultado.filter(
        (painel) => painel.gabinete === filtroGabinete
      );
    }

    // Filtro por tipo (baseado no gabinete)
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

        default:
          return 0;
      }
    });

    return resultado;
  }, [paineis, gabinetes, busca, filtroGabinete, filtroTipo, ordenacao]);

  // Função auxiliar para calcular potência
  function calcularPotencia(painel, gabinetes) {
    const gabinete = gabinetes.find((g) => g.nome === painel.gabinete);
    if (!gabinete) return 0;

    const qtdGabinetes = (painel.qtdLargura || 1) * (painel.qtdAltura || 1);
    return gabinete.potencia * qtdGabinetes;
  }

  return {
    // Estados
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

    // Funções auxiliares
    limparFiltros: () => {
      setBusca("");
      setFiltroGabinete("");
      setFiltroTipo("");
      setOrdenacao("nome");
    },

    // Informações dos filtros
    temFiltrosAtivos: !!(busca || filtroGabinete || filtroTipo),
    totalFiltrado: paineisFiltrados.length,
    totalOriginal: paineis.length,
  };
}

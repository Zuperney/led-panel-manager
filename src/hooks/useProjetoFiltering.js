// Hook customizado para lógica de filtragem e ordenação de projetos
import { useMemo } from "react";

export function useProjetoFiltering(
  projetos,
  searchTerm,
  filterBy,
  sortBy,
  sortOrder
) {
  const projetosFiltrados = useMemo(() => {
    return projetos
      .filter((projeto) => {
        // Filtro por busca (nome, cliente, descrição)
        const searchString = searchTerm.toLowerCase();
        const matchesSearch =
          projeto.nome.toLowerCase().includes(searchString) ||
          (projeto.cliente &&
            projeto.cliente.toLowerCase().includes(searchString)) ||
          (projeto.descricao &&
            projeto.descricao.toLowerCase().includes(searchString));

        // Filtro por categoria
        let matchesFilter = true;
        const hoje = new Date();
        const dataEntrega = projeto.dataEntrega
          ? new Date(projeto.dataEntrega)
          : null;

        if (filterBy === "em_andamento") {
          matchesFilter = !dataEntrega || dataEntrega >= hoje;
        } else if (filterBy === "atrasados") {
          matchesFilter = dataEntrega && dataEntrega < hoje;
        } else if (filterBy === "urgentes") {
          const seteDiasAFrente = new Date(
            hoje.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          matchesFilter =
            dataEntrega &&
            dataEntrega <= seteDiasAFrente &&
            dataEntrega >= hoje;
        }

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "nome":
            comparison = a.nome.localeCompare(b.nome);
            break;
          case "cliente":
            const clienteA = a.cliente || "";
            const clienteB = b.cliente || "";
            comparison = clienteA.localeCompare(clienteB);
            break;
          case "dataEntrega":
            const dataA = a.dataEntrega ? new Date(a.dataEntrega) : new Date(0);
            const dataB = b.dataEntrega ? new Date(b.dataEntrega) : new Date(0);
            comparison = dataA - dataB;
            break;
          case "status":
            const hoje = new Date();
            const getStatusPriority = (projeto) => {
              if (!projeto.dataEntrega) return 3;
              const dataEntrega = new Date(projeto.dataEntrega);
              if (dataEntrega < hoje) return 0; // Atrasado
              if (
                dataEntrega <=
                new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000)
              )
                return 1; // Urgente
              return 2; // No prazo
            };
            comparison = getStatusPriority(a) - getStatusPriority(b);
            break;
          default:
            comparison = 0;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [projetos, searchTerm, filterBy, sortBy, sortOrder]);

  return projetosFiltrados;
}

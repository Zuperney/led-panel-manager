// Hook customizado para lógica de filtragem e ordenação de gabinetes
import { useMemo } from "react";

export function useGabineteFiltering(
  gabinetes,
  searchTerm,
  filterBy,
  sortBy,
  sortOrder
) {
  const gabinetesFiltrados = useMemo(() => {
    return gabinetes
      .filter((gabinete) => {
        // Filtro por busca
        const matchesSearch = gabinete.nome
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        // Filtro por categoria
        let matchesFilter = true;
        const pixelPitch = gabinete.pitch || gabinete.pixelPitch;
        if (filterBy === "alta_potencia") {
          matchesFilter = gabinete.potencia >= 800;
        } else if (filterBy === "baixo_pixel_pitch") {
          matchesFilter = pixelPitch <= 5;
        } else if (filterBy === "indoor") {
          matchesFilter = pixelPitch <= 10;
        } else if (filterBy === "outdoor") {
          matchesFilter = pixelPitch > 10;
        }

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "nome":
            comparison = a.nome.localeCompare(b.nome);
            break;
          case "potencia":
            comparison = a.potencia - b.potencia;
            break;
          case "peso":
            comparison = a.peso - b.peso;
            break;
          case "pixelPitch":
            const aPitch = a.pitch || a.pixelPitch;
            const bPitch = b.pitch || b.pixelPitch;
            comparison = aPitch - bPitch;
            break;
          case "area":
            const areaA = (a.largura * a.altura) / 1000000;
            const areaB = (b.largura * b.altura) / 1000000;
            comparison = areaA - areaB;
            break;
          default:
            comparison = 0;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [gabinetes, searchTerm, filterBy, sortBy, sortOrder]);

  return gabinetesFiltrados;
}

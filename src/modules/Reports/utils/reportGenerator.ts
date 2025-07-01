import type {
  ReportData,
  ReportSection,
  TableData,
  ReportMetadata,
  ReportType,
} from "../types";

/**
 * Generate report data based on project information
 */
export const generateReportData = (
  type: ReportType,
  sourceData: any,
  metadata: ReportMetadata
): ReportData => {
  const sections: ReportSection[] = [];

  switch (type) {
    case "project-summary":
      sections.push(...generateProjectSummarySections(sourceData));
      break;
    case "technical-specs":
      sections.push(...generateTechnicalSpecsSections(sourceData));
      break;
    case "material-list":
      sections.push(...generateMaterialListSections(sourceData));
      break;
    case "cost-analysis":
      sections.push(...generateCostAnalysisSections(sourceData));
      break;
    case "installation-guide":
      sections.push(...generateInstallationGuideSections());
      break;
    case "cabinet-layout":
      sections.push(...generateCabinetLayoutSections(sourceData));
      break;
    default:
      sections.push(generateDefaultSection());
  }

  return {
    title: getReportTitle(type),
    subtitle: getReportSubtitle(sourceData),
    sections,
    metadata,
  };
};

/**
 * Get report title based on type and data
 */
const getReportTitle = (type: ReportType): string => {
  const titles = {
    "project-summary": "Resumo do Projeto",
    "technical-specs": "Especificações Técnicas",
    "material-list": "Lista de Materiais",
    "cost-analysis": "Análise de Custos",
    "installation-guide": "Guia de Instalação",
    "cabinet-layout": "Layout dos Gabinetes",
    "panel-configuration": "Configuração dos Painéis",
    "maintenance-schedule": "Cronograma de Manutenção",
    custom: "Relatório Personalizado",
  };

  return titles[type] || "Relatório";
};

/**
 * Get report subtitle
 */
const getReportSubtitle = (data: any): string => {
  if (data?.project?.name) {
    return `Projeto: ${data.project.name}`;
  }
  return "";
};

/**
 * Generate project summary sections
 */
const generateProjectSummarySections = (data: any): ReportSection[] => {
  const sections: ReportSection[] = [];

  // Project overview
  sections.push({
    id: "overview",
    title: "Visão Geral do Projeto",
    type: "specifications",
    order: 1,
    visible: true,
    content: {
      specifications: {
        specifications: [
          { name: "Nome do Projeto", value: data.project?.name || "N/A" },
          { name: "Cliente", value: data.project?.client?.name || "N/A" },
          { name: "Status", value: data.project?.status || "N/A" },
          {
            name: "Data de Início",
            value: formatDate(data.project?.startDate),
          },
          {
            name: "Data Prevista de Conclusão",
            value: formatDate(data.project?.endDate),
          },
          {
            name: "Orçamento Total",
            value: data.project?.budget || 0,
            unit: "R$",
          },
          {
            name: "Localização",
            value: `${data.project?.location?.city}, ${data.project?.location?.state}`,
          },
        ],
      },
    },
  });

  // Progress chart
  if (data.project?.estimatedHours && data.project?.actualHours) {
    sections.push({
      id: "progress",
      title: "Progresso do Projeto",
      type: "chart",
      order: 2,
      visible: true,
      content: {
        chart: {
          type: "donut",
          data: [
            {
              label: "Concluído",
              value: data.project.actualHours,
              color: "#10b981",
            },
            {
              label: "Restante",
              value: data.project.estimatedHours - data.project.actualHours,
              color: "#e5e7eb",
            },
          ],
          options: {
            title: "Horas de Trabalho",
            showLegend: true,
            showValues: true,
          },
        },
      },
    });
  }

  return sections;
};

/**
 * Generate technical specifications sections
 */
const generateTechnicalSpecsSections = (data: any): ReportSection[] => {
  const sections: ReportSection[] = [];

  if (data.panels && Array.isArray(data.panels)) {
    sections.push({
      id: "panel-specs",
      title: "Especificações dos Painéis",
      type: "table",
      order: 1,
      visible: true,
      content: {
        table: {
          headers: ["Modelo", "Resolução", "Pixel Pitch", "Brilho", "Consumo"],
          rows: data.panels.map((panel: any) => [
            panel.model || "N/A",
            `${panel.width}x${panel.height}`,
            `${panel.pixelPitch}mm`,
            `${panel.brightness} nits`,
            `${panel.powerConsumption}W`,
          ]),
          styling: {
            headerBackground: "#f3f4f6",
            alternateRows: true,
            borders: true,
          },
        },
      },
    });
  }

  return sections;
};

/**
 * Generate material list sections
 */
const generateMaterialListSections = (data: any): ReportSection[] => {
  const sections: ReportSection[] = [];

  if (data.materials && Array.isArray(data.materials)) {
    const tableData: TableData = {
      headers: ["Item", "Quantidade", "Unidade", "Preço Unit.", "Total"],
      rows: data.materials.map((item: any) => [
        item.name,
        item.quantity,
        item.unit,
        formatCurrency(item.unitPrice),
        formatCurrency(item.totalPrice),
      ]),
      styling: {
        headerBackground: "#f3f4f6",
        alternateRows: true,
        borders: true,
      },
    };

    sections.push({
      id: "materials",
      title: "Lista de Materiais",
      type: "table",
      order: 1,
      visible: true,
      content: { table: tableData },
    });

    // Total cost
    const totalCost = data.materials.reduce(
      (sum: number, item: any) => sum + item.totalPrice,
      0
    );
    sections.push({
      id: "total-cost",
      title: "Custo Total",
      type: "text",
      order: 2,
      visible: true,
      content: {
        text: `**Custo Total dos Materiais: ${formatCurrency(totalCost)}**`,
      },
    });
  }

  return sections;
};

/**
 * Generate cost analysis sections
 */
const generateCostAnalysisSections = (data: any): ReportSection[] => {
  const sections: ReportSection[] = [];

  if (data.costBreakdown) {
    sections.push({
      id: "cost-breakdown",
      title: "Breakdown de Custos",
      type: "chart",
      order: 1,
      visible: true,
      content: {
        chart: {
          type: "pie",
          data: Object.entries(data.costBreakdown).map(
            ([category, cost]: [string, any]) => ({
              label: category,
              value: cost,
              color: getCategoryColor(category),
            })
          ),
          options: {
            title: "Distribuição de Custos",
            showLegend: true,
            showValues: true,
          },
        },
      },
    });
  }

  return sections;
};

/**
 * Generate installation guide sections
 */
const generateInstallationGuideSections = (): ReportSection[] => {
  const sections: ReportSection[] = [];

  const installationSteps = [
    "Preparação do local de instalação",
    "Montagem da estrutura de suporte",
    "Instalação dos gabinetes",
    "Conexão dos cabos de dados e energia",
    "Configuração do sistema de controle",
    "Calibração e testes",
    "Treinamento da equipe",
  ];

  sections.push({
    id: "installation-steps",
    title: "Etapas de Instalação",
    type: "list",
    order: 1,
    visible: true,
    content: {
      list: {
        ordered: true,
        items: installationSteps.map((step) => ({ text: step })),
      },
    },
  });

  return sections;
};

/**
 * Generate cabinet layout sections
 */
const generateCabinetLayoutSections = (data: any): ReportSection[] => {
  const sections: ReportSection[] = [];

  if (data.layout) {
    sections.push({
      id: "layout-diagram",
      title: "Diagrama de Layout",
      type: "layout-diagram",
      order: 1,
      visible: true,
      content: {
        layoutDiagram: {
          width: data.layout.width || 1920,
          height: data.layout.height || 1080,
          elements: data.layout.elements || [],
          scale: 1,
          showDimensions: true,
        },
      },
    });
  }

  return sections;
};

/**
 * Generate default section for unknown report types
 */
const generateDefaultSection = (): ReportSection => {
  return {
    id: "default",
    title: "Conteúdo do Relatório",
    type: "text",
    order: 1,
    visible: true,
    content: {
      text: "Este relatório está em desenvolvimento. Conteúdo será adicionado em breve.",
    },
  };
};

/**
 * Format date for display
 */
const formatDate = (date: any): string => {
  if (!date) return "N/A";
  if (typeof date === "string") date = new Date(date);
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

/**
 * Format currency
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

/**
 * Get color for cost category
 */
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Painéis: "#3b82f6",
    Gabinetes: "#10b981",
    Cabos: "#f59e0b",
    "Mão de Obra": "#ef4444",
    Outros: "#8b5cf6",
  };
  return colors[category] || "#6b7280";
};

/**
 * Calculate report file size estimation
 */
export const estimateReportSize = (data: ReportData): number => {
  let size = 50000; // Base PDF size in bytes

  data.sections.forEach((section) => {
    switch (section.type) {
      case "table":
        if (section.content.table) {
          size += section.content.table.rows.length * 100;
        }
        break;
      case "chart":
        size += 25000; // Chart images add significant size
        break;
      case "image":
        size += 100000; // Approximate image size
        break;
      case "layout-diagram":
        size += 150000; // Diagram images are larger
        break;
      default:
        size += 1000; // Text content
    }
  });

  return size;
};

/**
 * Validate report data before generation
 */
export const validateReportData = (data: ReportData): string[] => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Título do relatório é obrigatório");
  }

  if (!data.sections || data.sections.length === 0) {
    errors.push("Relatório deve ter pelo menos uma seção");
  }

  data.sections.forEach((section, index) => {
    if (!section.title || section.title.trim().length === 0) {
      errors.push(`Seção ${index + 1} deve ter um título`);
    }

    if (!section.content) {
      errors.push(`Seção "${section.title}" deve ter conteúdo`);
    }
  });

  return errors;
};

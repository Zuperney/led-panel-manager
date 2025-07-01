/**
 * Types for the Panels module (vinculados a projetos e gabinetes)
 * Painéis -> seleção de projeto, nome, gabinetes, tamanho em metros, voltagem
 */

export interface Panel {
  id: string;
  name: string;
  projectId: string; // Vinculado a um projeto

  // Dimensões em metros
  widthMeters: number;
  heightMeters: number;

  // Gabinetes selecionados
  selectedCabinets: PanelCabinet[];

  // Configuração elétrica
  voltage: VoltageConfig;

  // Modo de adição
  additionMode: "manual" | "by-cabinets"; // manual = informar metros, by-cabinets = calcular pelos gabinetes

  // Metadados
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface PanelCabinet {
  cabinetId: string;
  quantity: number;
  arrangement?: {
    rows: number;
    columns: number;
  };
}

export interface VoltageConfig {
  voltage: 220 | 380;
  phases: "mono" | "bi" | "tri";
}

export interface PanelFormData {
  name: string;
  projectId: string;
  widthMeters: number;
  heightMeters: number;
  selectedCabinets: PanelCabinet[];
  voltage: VoltageConfig;
  additionMode: "manual" | "by-cabinets";
  description?: string;
}

export interface PanelFormErrors {
  [key: string]: string;
}

export interface PanelFormProps {
  initialData?: Panel;
  onSubmit: (data: PanelFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  projects: Array<{ id: string; name: string; client: string }>;
  cabinets: Array<{
    id: string;
    name: string;
    widthMm: number;
    heightMm: number;
    powerWatts: number;
  }>;
}

export interface PanelFilters {
  search: string;
  projectId: "all" | string;
  voltage: "all" | "220" | "380";
  sortBy: "name" | "project" | "size" | "power" | "createdAt";
  sortOrder: "asc" | "desc";
}

export interface PanelStats {
  total: number;
  byProject: Record<string, number>;
  totalArea: number; // metros quadrados
  totalPower: number; // watts
  by220V: number;
  by380V: number;
}

export interface PanelCalculations {
  totalAreaM2: number;
  totalPixels: number;
  totalPowerWatts: number;
  cabinetCount: number;
  averagePixelPitch: number;
  estimatedCurrent220V: number;
  estimatedCurrent380V: number;
}

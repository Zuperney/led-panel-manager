/**
 * Types for the Cabinets module
 * Gabinetes - duas opções de preencher - básico e completo
 */

export interface Cabinet {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor';
  
  // Dimensões físicas (mm)
  widthMm: number;
  heightMm: number;
  
  // Dimensões em pixels
  widthPixels: number;
  heightPixels: number;
  
  // Calculado automaticamente (largura mm / largura pixels)
  pixelPitch: number;
  
  // Especificações básicas
  powerWatts: number;
  weight: number;
  
  // Especificações completas (modo completo apenas)
  voltage: number; // padrão 220v
  isBivolt: boolean;
  brightness?: number; // nits
  refreshRate?: number; // Hz
  powerFactor?: number; // coseno
  
  // Metadados
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface CabinetFormData {
  name: string;
  type: 'indoor' | 'outdoor';
  widthMm: number;
  heightMm: number;
  widthPixels: number;
  heightPixels: number;
  powerWatts: number;
  weight: number;
  
  // Modo completo
  voltage: number;
  isBivolt: boolean;
  brightness?: number;
  refreshRate?: number;
  powerFactor?: number;
  description?: string;
}

export interface CabinetFormErrors {
  [key: string]: string;
}

export interface CabinetFormProps {
  initialData?: Cabinet;
  onSubmit: (data: CabinetFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  formMode: 'basic' | 'complete';
}

export interface CabinetFilters {
  search: string;
  type: 'all' | 'indoor' | 'outdoor';
  sortBy: 'name' | 'type' | 'pixelPitch' | 'power' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface CabinetStats {
  total: number;
  indoor: number;
  outdoor: number;
  averagePixelPitch: number;
  totalPower: number;
}

export interface Panel {
  id: string;
  name: string;
  width: number;
  height: number;
  pixelPitch: number;
  powerConsumption: number;
  brightness: number;
  refreshRate: number;
  inputVoltage: number;
  operatingTemperature: {
    min: number;
    max: number;
  };
  ipRating: string;
  weight: number;
  manufacturer: string;
  model: string;
  price?: number;
  description?: string;
  specifications?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PanelCalculations {
  totalPixels: number;
  pixelDensity: number;
  totalPower: number;
  dimensions: {
    widthMm: number;
    heightMm: number;
    depthMm: number;
  };
  resolution: {
    horizontal: number;
    vertical: number;
  };
}

export interface PanelConfiguration {
  panels: Panel[];
  layout: {
    rows: number;
    columns: number;
  };
  totalDimensions: {
    width: number;
    height: number;
  };
  totalPower: number;
  totalWeight: number;
}

export interface PanelFilter {
  manufacturer?: string;
  pixelPitch?: number[];
  powerRange?: [number, number];
  priceRange?: [number, number];
  searchTerm?: string;
}

export interface PanelFormData {
  name: string;
  width: string;
  height: string;
  pixelPitch: string;
  powerConsumption: string;
  brightness: string;
  refreshRate: string;
  inputVoltage: string;
  tempMin: string;
  tempMax: string;
  ipRating: string;
  weight: string;
  manufacturer: string;
  model: string;
  price: string;
  description: string;
}

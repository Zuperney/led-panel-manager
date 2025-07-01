import type { Panel, PanelCalculations } from "../types";

/**
 * Calculate panel metrics and specifications
 */
export const calculatePanelMetrics = (panel: Panel): PanelCalculations => {
  const pixelsPerMeter = 1000 / panel.pixelPitch; // pixels per meter
  const horizontalPixels = Math.floor((panel.width / 1000) * pixelsPerMeter);
  const verticalPixels = Math.floor((panel.height / 1000) * pixelsPerMeter);
  const totalPixels = horizontalPixels * verticalPixels;
  const pixelDensity =
    totalPixels / ((panel.width / 1000) * (panel.height / 1000));

  return {
    totalPixels,
    pixelDensity,
    totalPower: panel.powerConsumption,
    dimensions: {
      widthMm: panel.width,
      heightMm: panel.height,
      depthMm: 100, // Default depth
    },
    resolution: {
      horizontal: horizontalPixels,
      vertical: verticalPixels,
    },
  };
};

/**
 * Calculate power consumption for multiple panels
 */
export const calculateTotalPower = (
  panels: Panel[],
  quantity: number = 1
): number => {
  return panels.reduce(
    (total, panel) => total + panel.powerConsumption * quantity,
    0
  );
};

/**
 * Calculate viewing distance recommendations
 */
export const calculateViewingDistance = (
  pixelPitch: number
): { min: number; max: number; optimal: number } => {
  const optimal = pixelPitch * 3.5; // meters
  const min = pixelPitch * 2;
  const max = pixelPitch * 8;

  return { min, max, optimal };
};

/**
 * Format power consumption with appropriate units
 */
export const formatPowerConsumption = (watts: number): string => {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }
  return `${watts.toFixed(0)} W`;
};

/**
 * Format dimensions with units
 */
export const formatDimensions = (
  width: number,
  height: number,
  unit: "mm" | "cm" | "m" = "mm"
): string => {
  switch (unit) {
    case "cm":
      return `${(width / 10).toFixed(1)} × ${(height / 10).toFixed(1)} cm`;
    case "m":
      return `${(width / 1000).toFixed(2)} × ${(height / 1000).toFixed(2)} m`;
    default:
      return `${width} × ${height} mm`;
  }
};

/**
 * Calculate panel price per square meter
 */
export const calculatePricePerSqm = (panel: Panel): number => {
  if (!panel.price) return 0;
  const areaSqm = (panel.width / 1000) * (panel.height / 1000);
  return panel.price / areaSqm;
};

/**
 * Validate panel specifications
 */
export const validatePanelSpecs = (panel: Partial<Panel>): string[] => {
  const errors: string[] = [];

  if (!panel.name || panel.name.trim().length < 2) {
    errors.push("Panel name must be at least 2 characters long");
  }

  if (!panel.width || panel.width <= 0) {
    errors.push("Width must be greater than 0");
  }

  if (!panel.height || panel.height <= 0) {
    errors.push("Height must be greater than 0");
  }

  if (!panel.pixelPitch || panel.pixelPitch <= 0) {
    errors.push("Pixel pitch must be greater than 0");
  }

  if (!panel.powerConsumption || panel.powerConsumption < 0) {
    errors.push("Power consumption must be 0 or greater");
  }

  if (
    panel.brightness &&
    (panel.brightness < 100 || panel.brightness > 10000)
  ) {
    errors.push("Brightness should be between 100 and 10000 nits");
  }

  return errors;
};

/**
 * Types for the Cabinets module
 */

export interface Cabinet {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    weight: number;
  };
  specifications: {
    resolution: {
      width: number;
      height: number;
    };
    pixelPitch: number;
    brightness: number;
    refreshRate: number;
    colorDepth: number;
    viewingAngle: {
      horizontal: number;
      vertical: number;
    };
  };
  powerConsumption: {
    typical: number;
    maximum: number;
    voltage: string;
  };
  connectivity: {
    inputPorts: string[];
    outputPorts: string[];
    protocols: string[];
  };
  environmental: {
    operatingTemperature: {
      min: number;
      max: number;
    };
    humidity: {
      min: number;
      max: number;
    };
    ipRating: string;
  };
  price: number;
  availability: CabinetAvailability;
  installationRequirements: string[];
  maintenanceSchedule: MaintenanceSchedule;
  warranty: {
    duration: number;
    terms: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type CabinetAvailability =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "discontinued";

export interface MaintenanceSchedule {
  daily?: string[];
  weekly?: string[];
  monthly?: string[];
  yearly?: string[];
}

export interface CabinetLayout {
  id: string;
  name: string;
  projectId?: string;
  dimensions: {
    totalWidth: number;
    totalHeight: number;
    depth: number;
  };
  configuration: CabinetConfiguration[];
  cableRouting: CableRoute[];
  powerDistribution: PowerDistribution;
  controllerSettings: ControllerSettings;
  environmentalConsiderations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CabinetConfiguration {
  id: string;
  cabinetId: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  connections: CabinetConnection[];
  powerConfig: PowerConfig;
  calibration: CalibrationSettings;
}

export interface CabinetConnection {
  type: "data" | "power" | "sync";
  sourcePort: string;
  targetPort: string;
  cableType: string;
  length: number;
}

export interface PowerConfig {
  circuit: string;
  voltage: number;
  current: number;
  phase: number;
  backup: boolean;
}

export interface CalibrationSettings {
  brightness: number;
  contrast: number;
  colorTemperature: number;
  gamma: number;
  uniformity: UniformitySettings;
}

export interface UniformitySettings {
  enabled: boolean;
  regions: number;
  tolerance: number;
}

export interface CableRoute {
  id: string;
  type: "data" | "power" | "control";
  path: RoutePoint[];
  specifications: CableSpecifications;
  length: number;
  cost: number;
}

export interface RoutePoint {
  x: number;
  y: number;
  z: number;
  connectionType?: string;
}

export interface CableSpecifications {
  type: string;
  gauge: string;
  shielding: boolean;
  fireRating: string;
  flexibility: "rigid" | "flexible" | "semi-flexible";
}

export interface PowerDistribution {
  mainSupply: {
    voltage: number;
    frequency: number;
    phases: number;
    capacity: number;
  };
  circuits: PowerCircuit[];
  ups: UPSConfiguration;
  grounding: GroundingConfiguration;
}

export interface PowerCircuit {
  id: string;
  name: string;
  voltage: number;
  current: number;
  load: number;
  cabinets: string[];
}

export interface UPSConfiguration {
  enabled: boolean;
  capacity: number;
  runtime: number;
  type: "line-interactive" | "online" | "standby";
}

export interface GroundingConfiguration {
  system: "TN-S" | "TN-C-S" | "TT" | "IT";
  resistance: number;
  equipotentialBonding: boolean;
}

export interface ControllerSettings {
  primary: ControllerConfig;
  backup?: ControllerConfig;
  synchronization: SyncSettings;
  monitoring: MonitoringSettings;
}

export interface ControllerConfig {
  model: string;
  ipAddress: string;
  port: number;
  protocol: string;
  capacity: number;
}

export interface SyncSettings {
  method: "genlock" | "frame-sync" | "software";
  precision: number;
  tolerance: number;
}

export interface MonitoringSettings {
  enabled: boolean;
  interval: number;
  alerts: AlertSettings[];
  logging: boolean;
}

export interface AlertSettings {
  type: "temperature" | "power" | "connection" | "performance";
  threshold: number;
  action: "email" | "sms" | "log" | "shutdown";
}

export interface CabinetFilters {
  manufacturer?: string[];
  availability?: CabinetAvailability[];
  priceRange?: {
    min: number;
    max: number;
  };
  pixelPitch?: {
    min: number;
    max: number;
  };
  resolution?: string;
  indoor?: boolean;
}

export interface CreateCabinetData {
  name: string;
  model: string;
  manufacturer: string;
  dimensions: Cabinet["dimensions"];
  specifications: Cabinet["specifications"];
  powerConsumption: Cabinet["powerConsumption"];
  connectivity: Cabinet["connectivity"];
  environmental: Cabinet["environmental"];
  price: number;
  installationRequirements: string[];
  warranty: Cabinet["warranty"];
}

export interface UpdateCabinetData extends Partial<CreateCabinetData> {
  availability?: CabinetAvailability;
}

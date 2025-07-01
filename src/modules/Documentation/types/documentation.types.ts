export interface Documentation {
  id: string;
  title: string;
  type: DocumentationType;
  category: DocumentationCategory;
  content: DocumentationContent;
  tags: string[];
  version: string;
  isPublic: boolean;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface DocumentationContent {
  sections: DocumentationSection[];
  attachments: DocumentationAttachment[];
  diagrams: DocumentationDiagram[];
  videos: DocumentationVideo[];
}

export interface DocumentationSection {
  id: string;
  title: string;
  content: string; // Markdown content
  order: number;
  subsections?: DocumentationSection[];
}

export interface DocumentationAttachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "excel" | "word" | "other";
  url: string;
  size: number; // bytes
  uploadedAt: Date;
}

export interface DocumentationDiagram {
  id: string;
  title: string;
  type: DiagramType;
  data: Record<string, unknown>; // Diagram data structure
  thumbnailUrl?: string;
}

export interface DocumentationVideo {
  id: string;
  title: string;
  description?: string;
  url: string;
  duration: number; // seconds
  thumbnailUrl?: string;
}

export interface ConfigurationGuide {
  id: string;
  panelModel: string;
  title: string;
  steps: ConfigurationStep[];
  difficulty: DifficultyLevel;
  estimatedTime: number; // minutes
  prerequisites: string[];
  tools: string[];
}

export interface ConfigurationStep {
  id: string;
  step: number;
  title: string;
  description: string;
  images?: string[];
  code?: string;
  warnings?: string[];
  tips?: string[];
}

export interface CablingGuide {
  id: string;
  title: string;
  panelTypes: string[];
  connections: CablingConnection[];
  diagrams: WiringDiagram[];
  safetyNotes: string[];
}

export interface CablingConnection {
  id: string;
  from: ConnectionPoint;
  to: ConnectionPoint;
  cableType: CableType;
  specifications: CableSpecifications;
}

export interface ConnectionPoint {
  device: string;
  port: string;
  pinout?: string[];
}

export interface WiringDiagram {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  components: DiagramComponent[];
}

export interface DiagramComponent {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  properties: Record<string, string | number | boolean>;
}

export type DocumentationType =
  | "guide"
  | "manual"
  | "troubleshooting"
  | "specification"
  | "procedure"
  | "reference";

export type DocumentationCategory =
  | "installation"
  | "configuration"
  | "cabling"
  | "maintenance"
  | "troubleshooting"
  | "safety"
  | "general";

export type DiagramType =
  | "wiring"
  | "flowchart"
  | "layout"
  | "schematic"
  | "topology";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type CableType =
  | "power"
  | "data"
  | "ethernet"
  | "fiber"
  | "hdmi"
  | "dvi"
  | "custom";

export interface CableSpecifications {
  gauge?: string;
  length: number;
  voltage?: number;
  amperage?: number;
  dataRate?: string;
  shielding?: boolean;
}

export interface DocumentationFilter {
  type?: DocumentationType;
  category?: DocumentationCategory;
  tags?: string[];
  author?: string;
  searchTerm?: string;
  dateRange?: [Date, Date];
}

export interface DocumentationFormData {
  title: string;
  type: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  content: {
    sections: {
      title: string;
      content: string;
    }[];
  };
}

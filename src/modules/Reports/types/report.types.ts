/**
 * Types for the Reports module
 */

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description?: string;
  projectId?: string;
  cabinetId?: string;
  panelId?: string;
  format: ReportFormat;
  template: ReportTemplateName;
  data: ReportData;
  generatedAt: Date;
  generatedBy: string;
  fileUrl?: string;
  fileSize?: number;
  status: ReportStatus;
}

export type ReportType =
  | "project-summary"
  | "technical-specs"
  | "material-list"
  | "cost-analysis"
  | "installation-guide"
  | "cabinet-layout"
  | "panel-configuration"
  | "maintenance-schedule"
  | "custom";

export type ReportFormat = "pdf" | "excel" | "csv" | "json";

export type ReportTemplateName =
  | "standard"
  | "detailed"
  | "minimal"
  | "presentation"
  | "technical"
  | "custom";

export type ReportStatus = "generating" | "completed" | "failed" | "expired";

export interface ReportData {
  title: string;
  subtitle?: string;
  sections: ReportSection[];
  metadata: ReportMetadata;
  branding?: ReportBranding;
}

export interface ReportSection {
  id: string;
  title: string;
  type: SectionType;
  content: SectionContent;
  order: number;
  visible: boolean;
}

export type SectionType =
  | "text"
  | "table"
  | "chart"
  | "image"
  | "list"
  | "specifications"
  | "calculations"
  | "layout-diagram"
  | "custom";

export interface SectionContent {
  text?: string;
  table?: TableData;
  chart?: ChartData;
  image?: ImageData;
  list?: ListData;
  specifications?: SpecificationData;
  calculations?: CalculationData;
  layoutDiagram?: LayoutDiagramData;
  custom?: Record<string, any>;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
  styling?: TableStyling;
}

export interface TableStyling {
  headerBackground?: string;
  alternateRows?: boolean;
  borders?: boolean;
  fontSize?: number;
}

export interface ChartData {
  type: "bar" | "line" | "pie" | "donut" | "area";
  data: ChartDataPoint[];
  options?: ChartOptions;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartOptions {
  title?: string;
  showLegend?: boolean;
  showValues?: boolean;
  colors?: string[];
}

export interface ImageData {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface ListData {
  items: ListItem[];
  ordered?: boolean;
  nested?: boolean;
}

export interface ListItem {
  text: string;
  subItems?: ListItem[];
  highlight?: boolean;
}

export interface SpecificationData {
  specifications: SpecificationItem[];
  groupBy?: string;
}

export interface SpecificationItem {
  name: string;
  value: string | number;
  unit?: string;
  category?: string;
  description?: string;
}

export interface CalculationData {
  calculations: CalculationItem[];
  showFormulas?: boolean;
  precision?: number;
}

export interface CalculationItem {
  name: string;
  formula?: string;
  result: number;
  unit?: string;
  description?: string;
}

export interface LayoutDiagramData {
  width: number;
  height: number;
  elements: DiagramElement[];
  scale?: number;
  showDimensions?: boolean;
}

export interface DiagramElement {
  id: string;
  type: "panel" | "cabinet" | "cable" | "annotation";
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  color?: string;
  properties?: Record<string, any>;
}

export interface ReportMetadata {
  author: string;
  company?: string;
  version: string;
  generatedAt: Date;
  projectInfo?: {
    name: string;
    client: string;
    location: string;
  };
  pageSettings: PageSettings;
}

export interface PageSettings {
  size: "A4" | "A3" | "Letter" | "Legal";
  orientation: "portrait" | "landscape";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header?: boolean;
  footer?: boolean;
  pageNumbers?: boolean;
}

export interface ReportBranding {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  companyName?: string;
  contactInfo?: string;
}

export interface ReportFilters {
  type?: ReportType[];
  format?: ReportFormat[];
  status?: ReportStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  projectId?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  sections: ReportSection[];
  defaultSettings: PageSettings;
  isCustom: boolean;
  createdBy?: string;
  createdAt: Date;
}

export interface CreateReportRequest {
  name: string;
  type: ReportType;
  format: ReportFormat;
  template: ReportTemplate | string;
  projectId?: string;
  cabinetId?: string;
  panelId?: string;
  customData?: Record<string, any>;
  settings?: Partial<PageSettings>;
  branding?: ReportBranding;
}

export interface ReportPreview {
  id: string;
  thumbnailUrl: string;
  pageCount: number;
  sections: string[];
  estimatedSize: number;
}

/**
 * Types for the Projects module
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  estimatedHours: number;
  actualHours?: number;
  budget: number;
  spentBudget?: number;
  client: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  panels: ProjectPanel[];
  cabinets: ProjectCabinet[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  notes?: string;
  attachments?: ProjectAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectPanel {
  panelId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProjectCabinet {
  cabinetId: string;
  quantity: number;
  configuration: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface ProjectAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export type ProjectStatus =
  | "planning"
  | "approved"
  | "in-progress"
  | "on-hold"
  | "completed"
  | "cancelled";

export interface ProjectFilters {
  status?: ProjectStatus[];
  client?: string;
  startDate?: Date;
  endDate?: Date;
  budgetRange?: {
    min: number;
    max: number;
  };
}

export interface ProjectSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalSpent: number;
  averageProjectDuration: number;
}

export interface CreateProjectData {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  estimatedHours: number;
  budget: number;
  client: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  notes?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: ProjectStatus;
  actualHours?: number;
  spentBudget?: number;
}

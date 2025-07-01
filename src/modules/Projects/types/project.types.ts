/**
 * Types for the Projects module
 * Projeto -> Nome, cliente, data de entrega
 */

export interface Project {
  id: string;
  name: string;
  client: string;
  deliveryDate: string; // ISO date string
  
  // Metadados
  createdAt: string;
  updatedAt: string;
  description?: string;
  status?: 'planning' | 'in-progress' | 'delivered' | 'cancelled';
}

export interface ProjectFormData {
  name: string;
  client: string;
  deliveryDate: string;
  description?: string;
  status?: Project['status'];
}

export interface ProjectFormErrors {
  [key: string]: string;
}

export interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export interface ProjectFilters {
  search: string;
  status: 'all' | Project['status'];
  sortBy: 'name' | 'client' | 'deliveryDate' | 'status' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface ProjectStats {
  total: number;
  planning: number;
  inProgress: number;
  delivered: number;
  cancelled: number;
  upcomingDeadlines: number; // projetos com entrega nos próximos 7 dias
}

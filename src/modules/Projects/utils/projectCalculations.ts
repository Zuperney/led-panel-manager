import type {
  Project,
  ProjectStatus,
  CreateProjectData,
  UpdateProjectData,
} from "../types";

/**
 * Calculate project progress based on hours
 */
export const calculateProjectProgress = (
  estimatedHours: number,
  actualHours: number = 0
): number => {
  if (estimatedHours <= 0) return 0;
  return Math.min((actualHours / estimatedHours) * 100, 100);
};

/**
 * Calculate budget utilization
 */
export const calculateBudgetUtilization = (
  budget: number,
  spentBudget: number = 0
): number => {
  if (budget <= 0) return 0;
  return (spentBudget / budget) * 100;
};

/**
 * Calculate project duration in days
 */
export const calculateProjectDuration = (
  startDate: Date,
  endDate: Date
): number => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Get project status color
 */
export const getProjectStatusColor = (status: ProjectStatus): string => {
  const colors = {
    planning: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    "on-hold": "bg-orange-100 text-orange-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

/**
 * Get project status label
 */
export const getProjectStatusLabel = (status: ProjectStatus): string => {
  const labels = {
    planning: "Planejamento",
    approved: "Aprovado",
    "in-progress": "Em Andamento",
    "on-hold": "Pausado",
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return labels[status] || status;
};

/**
 * Check if project is overdue
 */
export const isProjectOverdue = (project: Project): boolean => {
  if (
    !project.endDate ||
    project.status === "completed" ||
    project.status === "cancelled"
  ) {
    return false;
  }
  return new Date() > project.endDate;
};

/**
 * Check if project is at risk (over budget or behind schedule)
 */
export const isProjectAtRisk = (project: Project): boolean => {
  const budgetUtilization = calculateBudgetUtilization(
    project.budget,
    project.spentBudget
  );
  const progress = calculateProjectProgress(
    project.estimatedHours,
    project.actualHours
  );

  // Project is at risk if budget utilization is higher than progress by 20% or more
  return budgetUtilization > progress + 20 || isProjectOverdue(project);
};

/**
 * Calculate estimated completion date based on current progress
 */
export const calculateEstimatedCompletion = (project: Project): Date | null => {
  if (project.status === "completed" || project.status === "cancelled") {
    return null;
  }

  const progress = calculateProjectProgress(
    project.estimatedHours,
    project.actualHours || 0
  );
  if (progress === 0) return null;

  const daysSinceStart = calculateProjectDuration(
    project.startDate,
    new Date()
  );
  const estimatedTotalDays = (daysSinceStart / progress) * 100;

  return new Date(
    project.startDate.getTime() + estimatedTotalDays * 24 * 60 * 60 * 1000
  );
};

/**
 * Format currency for display
 */
export const formatCurrency = (
  amount: number,
  currency: string = "BRL"
): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatProjectDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Generate project summary statistics
 */
export const generateProjectSummary = (projects: Project[]) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "approved" || p.status === "in-progress"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;

  const totalBudget = projects.reduce(
    (sum, project) => sum + project.budget,
    0
  );
  const totalSpent = projects.reduce(
    (sum, project) => sum + (project.spentBudget || 0),
    0
  );

  const completedProjectsWithDuration = projects
    .filter((p) => p.status === "completed" && p.endDate)
    .map((p) => calculateProjectDuration(p.startDate, p.endDate!));

  const averageProjectDuration =
    completedProjectsWithDuration.length > 0
      ? completedProjectsWithDuration.reduce(
          (sum, duration) => sum + duration,
          0
        ) / completedProjectsWithDuration.length
      : 0;

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalBudget,
    totalSpent,
    averageProjectDuration,
  };
};

/**
 * Validate project data
 */
export const validateProjectData = (
  data: CreateProjectData | UpdateProjectData
): string[] => {
  const errors: string[] = [];

  if ("name" in data && (!data.name || data.name.trim().length < 3)) {
    errors.push("Nome do projeto deve ter pelo menos 3 caracteres");
  }

  if ("budget" in data && data.budget !== undefined && data.budget <= 0) {
    errors.push("Orçamento deve ser maior que zero");
  }

  if (
    "estimatedHours" in data &&
    data.estimatedHours !== undefined &&
    data.estimatedHours <= 0
  ) {
    errors.push("Horas estimadas devem ser maiores que zero");
  }

  if (
    "startDate" in data &&
    "endDate" in data &&
    data.startDate &&
    data.endDate
  ) {
    if (data.startDate >= data.endDate) {
      errors.push("Data de início deve ser anterior à data de fim");
    }
  }

  if ("client" in data && data.client) {
    if (!data.client.name || data.client.name.trim().length < 2) {
      errors.push("Nome do cliente deve ter pelo menos 2 caracteres");
    }

    if (
      !data.client.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.client.email)
    ) {
      errors.push("Email do cliente deve ser válido");
    }
  }

  return errors;
};

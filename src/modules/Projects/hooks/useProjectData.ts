import { useState, useCallback, useMemo } from "react";
import type {
  Project,
  ProjectFilters,
  CreateProjectData,
  UpdateProjectData,
  ProjectSummary,
} from "../types";
import { generateProjectSummary, validateProjectData } from "../utils";

/**
 * Custom hook for managing project data
 */
export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockProjects: Project[] = [
    {
      id: "1",
      name: "LED Wall Shopping Center",
      description: "Instalação de painel LED no Shopping Center XYZ",
      status: "in-progress",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-03-15"),
      estimatedHours: 120,
      actualHours: 80,
      budget: 50000,
      spentBudget: 32000,
      client: {
        name: "Shopping Center XYZ",
        email: "contato@shoppingxyz.com.br",
        phone: "(11) 99999-9999",
        company: "Shopping Center XYZ Ltda",
      },
      panels: [
        { panelId: "1", quantity: 20, unitPrice: 1500, totalPrice: 30000 },
        { panelId: "2", quantity: 10, unitPrice: 2000, totalPrice: 20000 },
      ],
      cabinets: [
        {
          cabinetId: "1",
          quantity: 5,
          configuration: { width: 500, height: 500, depth: 100 },
        },
      ],
      location: {
        address: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        country: "Brasil",
      },
      notes: "Projeto prioritário para inauguração da nova ala",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      name: "Painel Corporativo Empresa ABC",
      description: "Painel LED para recepção corporativa",
      status: "planning",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-02-28"),
      estimatedHours: 40,
      budget: 15000,
      client: {
        name: "João Silva",
        email: "joao@empresaabc.com.br",
        company: "Empresa ABC Ltda",
      },
      panels: [
        { panelId: "1", quantity: 5, unitPrice: 1500, totalPrice: 7500 },
      ],
      cabinets: [
        {
          cabinetId: "2",
          quantity: 2,
          configuration: { width: 400, height: 300, depth: 80 },
        },
      ],
      location: {
        address: "Rua das Flores, 123",
        city: "Rio de Janeiro",
        state: "RJ",
        country: "Brasil",
      },
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-15"),
    },
  ];

  // Initialize with mock data
  useState(() => {
    if (projects.length === 0) {
      setProjects(mockProjects);
    }
  });

  // Filtered projects based on current filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (
        filters.status &&
        filters.status.length > 0 &&
        !filters.status.includes(project.status)
      ) {
        return false;
      }

      if (
        filters.client &&
        !project.client.name
          .toLowerCase()
          .includes(filters.client.toLowerCase())
      ) {
        return false;
      }

      if (filters.startDate && project.startDate < filters.startDate) {
        return false;
      }

      if (
        filters.endDate &&
        project.endDate &&
        project.endDate > filters.endDate
      ) {
        return false;
      }

      if (filters.budgetRange) {
        if (
          project.budget < filters.budgetRange.min ||
          project.budget > filters.budgetRange.max
        ) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters]);

  // Project summary statistics
  const summary: ProjectSummary = useMemo(() => {
    return generateProjectSummary(filteredProjects);
  }, [filteredProjects]);

  // Create a new project
  const createProject = useCallback(
    async (data: CreateProjectData): Promise<Project> => {
      setLoading(true);
      setError(null);

      try {
        const validationErrors = validateProjectData(data);
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(", "));
        }

        const newProject: Project = {
          ...data,
          id: Date.now().toString(),
          status: "planning",
          panels: [],
          cabinets: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setProjects((prev) => [...prev, newProject]);
        return newProject;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar projeto";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update an existing project
  const updateProject = useCallback(
    async (id: string, data: UpdateProjectData): Promise<Project> => {
      setLoading(true);
      setError(null);

      try {
        const validationErrors = validateProjectData(data);
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(", "));
        }

        const projectIndex = projects.findIndex((p) => p.id === id);
        if (projectIndex === -1) {
          throw new Error("Projeto não encontrado");
        }

        const updatedProject: Project = {
          ...projects[projectIndex],
          ...data,
          updatedAt: new Date(),
        };

        const newProjects = [...projects];
        newProjects[projectIndex] = updatedProject;
        setProjects(newProjects);

        return updatedProject;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar projeto";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [projects]
  );

  // Delete a project
  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const projectExists = projects.some((p) => p.id === id);
        if (!projectExists) {
          throw new Error("Projeto não encontrado");
        }

        setProjects((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao excluir projeto";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [projects]
  );

  // Get a project by ID
  const getProject = useCallback(
    (id: string): Project | undefined => {
      return projects.find((p) => p.id === id);
    },
    [projects]
  );

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    projects: filteredProjects,
    allProjects: projects,
    summary,
    filters,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    updateFilters,
    clearFilters,
  };
};

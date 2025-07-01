import { useState, useEffect, useCallback } from "react";
import type { Project, ProjectFormData } from "../types/project.types";

const STORAGE_KEY = "led-panel-manager-projects";

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
      }
    } catch (err) {
      setError("Erro ao carregar dados dos projetos");
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar dados no localStorage
  const saveToStorage = useCallback((data: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError("Erro ao salvar dados dos projetos");
      console.error("Error saving projects:", err);
    }
  }, []);

  // Adicionar projeto
  const addProject = useCallback(
    (formData: ProjectFormData) => {
      try {
        const newProject: Project = {
          id: crypto.randomUUID(),
          ...formData,
          status: formData.status || "planning",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        saveToStorage(updatedProjects);
        setError(null);

        return newProject;
      } catch (err) {
        setError("Erro ao adicionar projeto");
        console.error("Error adding project:", err);
        throw err;
      }
    },
    [projects, saveToStorage]
  );

  // Atualizar projeto
  const updateProject = useCallback(
    (id: string, formData: ProjectFormData) => {
      try {
        const updatedProjects = projects.map((project) =>
          project.id === id
            ? {
                ...project,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : project
        );

        setProjects(updatedProjects);
        saveToStorage(updatedProjects);
        setError(null);

        return updatedProjects.find((project) => project.id === id);
      } catch (err) {
        setError("Erro ao atualizar projeto");
        console.error("Error updating project:", err);
        throw err;
      }
    },
    [projects, saveToStorage]
  );

  // Deletar projeto
  const deleteProject = useCallback(
    (id: string) => {
      try {
        const updatedProjects = projects.filter((project) => project.id !== id);
        setProjects(updatedProjects);
        saveToStorage(updatedProjects);
        setError(null);
      } catch (err) {
        setError("Erro ao deletar projeto");
        console.error("Error deleting project:", err);
        throw err;
      }
    },
    [projects, saveToStorage]
  );

  // Buscar projeto por ID
  const getProjectById = useCallback(
    (id: string) => {
      return projects.find((project) => project.id === id);
    },
    [projects]
  );

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Estatísticas dos projetos
  const getStats = useCallback(() => {
    const total = projects.length;
    const planning = projects.filter(
      (project) => project.status === "planning"
    ).length;
    const inProgress = projects.filter(
      (project) => project.status === "in-progress"
    ).length;
    const delivered = projects.filter(
      (project) => project.status === "delivered"
    ).length;
    const cancelled = projects.filter(
      (project) => project.status === "cancelled"
    ).length;

    // Projetos com entrega nos próximos 7 dias
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingDeadlines = projects.filter((project) => {
      const deliveryDate = new Date(project.deliveryDate);
      const today = new Date();
      return (
        deliveryDate <= nextWeek &&
        deliveryDate >= today &&
        project.status !== "delivered"
      );
    }).length;

    return {
      total,
      planning,
      inProgress,
      delivered,
      cancelled,
      upcomingDeadlines,
    };
  }, [projects]);

  // Criar alguns projetos de exemplo se não houver nenhum
  useEffect(() => {
    if (!loading && projects.length === 0) {
      const sampleProjects: Project[] = [
        {
          id: crypto.randomUUID(),
          name: "Painel LED Shopping ABC",
          client: "Shopping ABC Ltda",
          deliveryDate: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ).toISOString(), // 15 dias
          status: "in-progress",
          description: "Instalação de painel LED no hall principal do shopping",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          name: "Telão Estádio Municipal",
          client: "Prefeitura Municipal",
          deliveryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 dias
          status: "planning",
          description: "Telão LED para transmissões no estádio municipal",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          name: "Fachada LED Hotel Central",
          client: "Hotel Central S/A",
          deliveryDate: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(), // Entregue há 5 dias
          status: "delivered",
          description: "Instalação de fachada LED interativa",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setProjects(sampleProjects);
      saveToStorage(sampleProjects);
    }
  }, [loading, projects.length, saveToStorage]);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    clearError,
    getStats,
    summary: getStats(), // Para compatibilidade com o código existente
  };
};

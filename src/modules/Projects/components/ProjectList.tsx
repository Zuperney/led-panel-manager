import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FolderOpen,
  Calendar,
  Clock,
  SortAsc,
  SortDesc,
} from "lucide-react";
import ProjectModal from "./ProjectModal";
import { ProjectCard } from "./ProjectCard";
import type { Project, ProjectFormData, ProjectFilters, ProjectStats } from "../types/project.types";

interface ProjectListProps {
  projects: Project[];
  onCreateProject: (data: ProjectFormData) => void;
  onUpdateProject: (id: string, data: ProjectFormData) => void;
  onDeleteProject: (id: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (search: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  isLoading = false,
  searchTerm = "",
  onSearchChange = () => {},
}) => {
  // Estados do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Estados dos filtros
  const [filters, setFilters] = useState<ProjectFilters>({
    search: searchTerm,
    status: 'all',
    sortBy: 'deliveryDate',
    sortOrder: 'asc',
  });

  // Atualizar filtro de busca quando searchTerm muda
  React.useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, [searchTerm]);

  // Filtrar e ordenar projetos
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Filtro de busca
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchLower) ||
        project.client.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de status
    if (filters.status !== 'all') {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'client':
          aValue = a.client.toLowerCase();
          bValue = b.client.toLowerCase();
          break;
        case 'deliveryDate':
          aValue = new Date(a.deliveryDate);
          bValue = new Date(b.deliveryDate);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, filters]);

  // Calcular estatísticas
  const stats: ProjectStats = useMemo(() => {
    const total = projects.length;
    const planning = projects.filter(project => project.status === 'planning').length;
    const inProgress = projects.filter(project => project.status === 'in-progress').length;
    const delivered = projects.filter(project => project.status === 'delivered').length;
    const cancelled = projects.filter(project => project.status === 'cancelled').length;
    
    // Projetos com entrega nos próximos 7 dias
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingDeadlines = projects.filter(project => {
      const deliveryDate = new Date(project.deliveryDate);
      const today = new Date();
      return deliveryDate <= nextWeek && deliveryDate >= today && project.status !== 'delivered';
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

  // Handlers do modal
  const handleCreateClick = () => {
    setEditingProject(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleModalSubmit = (data: ProjectFormData) => {
    if (modalMode === 'create') {
      onCreateProject(data);
    } else if (editingProject) {
      onUpdateProject(editingProject.id, data);
    }
    setModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteClick = (project: Project) => {
    if (window.confirm(`Deseja realmente excluir o projeto "${project.name}"?`)) {
      onDeleteProject(project.id);
    }
  };

  // Handler para mudança de filtros
  const handleFilterChange = (key: keyof ProjectFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'search') {
      onSearchChange(value);
    }
  };

  const toggleSort = (sortBy: ProjectFilters['sortBy']) => {
    if (filters.sortBy === sortBy) {
      setFilters(prev => ({
        ...prev,
        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        sortBy,
        sortOrder: 'asc'
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <FolderOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Planejamento</p>
              <p className="text-2xl font-bold text-gray-900">{stats.planning}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">✓</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Entregues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-lg">✕</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cancelados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-lg">⚠</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Urgentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingDeadlines}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os status</option>
              <option value="planning">Planejamento</option>
              <option value="in-progress">Em Andamento</option>
              <option value="delivered">Entregues</option>
              <option value="cancelled">Cancelados</option>
            </select>

            <button
              onClick={() => toggleSort('name')}
              className={`px-3 py-2 border rounded-lg flex items-center space-x-1 ${
                filters.sortBy === 'name' ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>Nome</span>
              {filters.sortBy === 'name' && (
                filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => toggleSort('deliveryDate')}
              className={`px-3 py-2 border rounded-lg flex items-center space-x-1 ${
                filters.sortBy === 'deliveryDate' ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>Entrega</span>
              {filters.sortBy === 'deliveryDate' && (
                filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Botão de Criar */}
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Lista de Projetos */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Carregando projetos...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filters.search || filters.status !== 'all' ? 'Nenhum projeto encontrado' : 'Nenhum projeto cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.status !== 'all' 
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro projeto.'}
          </p>
          {(!filters.search && filters.status === 'all') && (
            <button
              onClick={handleCreateClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ✨ Criar Primeiro Projeto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEditClick(project)}
              onDelete={() => handleDeleteClick(project)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingProject || undefined}
        mode={modalMode}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectList;

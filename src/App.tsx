import React, { useState } from "react";
import {
  Monitor,
  FolderOpen,
  FileText,
  Package,
  Calendar,
  Menu,
  X,
} from "lucide-react";

// Import modules
import { PanelCard, usePanelData } from "./modules/Panels";
import { ProjectCard, useProjectData } from "./modules/Projects";
import { Button } from "./shared/components";

type Module = "panels" | "projects" | "reports" | "cabinets" | "schedule";

interface NavigationItem {
  id: Module;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "panels",
    label: "Painéis",
    icon: Monitor,
    description: "Gerenciar especificações e catálogo de painéis LED",
  },
  {
    id: "projects",
    label: "Projetos",
    icon: FolderOpen,
    description: "Acompanhar projetos e cronogramas",
  },
  {
    id: "reports",
    label: "Relatórios",
    icon: FileText,
    description: "Gerar relatórios técnicos e documentação",
  },
  {
    id: "cabinets",
    label: "Gabinetes",
    icon: Package,
    description: "Configurar layouts e arranjos de gabinetes",
  },
  {
    id: "schedule",
    label: "Agenda",
    icon: Calendar,
    description: "Gerenciar cronogramas e agendamentos",
  },
];

function App() {
  const [activeModule, setActiveModule] = useState<Module>("panels");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderModuleContent = () => {
    switch (activeModule) {
      case "panels":
        return <PanelsModule />;
      case "projects":
        return <ProjectsModule />;
      case "reports":
        return <ReportsModule />;
      case "cabinets":
        return <CabinetsModule />;
      case "schedule":
        return <ScheduleModule />;
      default:
        return <PanelsModule />;
    }
  };

  const getActiveItem = () =>
    navigationItems.find((item) => item.id === activeModule);
  const activeItem = getActiveItem();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-900">
                LED Panel Manager
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center ${
                      sidebarOpen ? "px-3 py-3" : "px-3 py-3 justify-center"
                    } rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <div className="ml-3 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              v1.0.0 - Beta
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeItem?.label}
              </h2>
              <p className="text-gray-600 mt-1">{activeItem?.description}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">{renderModuleContent()}</div>
      </main>
    </div>
  );
}

// Module Components
function PanelsModule() {
  const { panels, loading, error } = usePanelData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando painéis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Catálogo de Painéis LED
        </h3>
        <Button variant="primary">Adicionar Painel</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panels.map((panel) => (
          <PanelCard
            key={panel.id}
            panel={panel}
            onClick={(p) => console.log("Visualizar painel:", p.model)}
            onEdit={(p) => console.log("Editar painel:", p.model)}
            onDelete={(p) => console.log("Excluir painel:", p.model)}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectsModule() {
  const { projects, summary, loading, error } = useProjectData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando projetos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Total de Projetos</div>
          <div className="text-2xl font-bold text-gray-900">
            {summary.totalProjects}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Projetos Ativos</div>
          <div className="text-2xl font-bold text-blue-600">
            {summary.activeProjects}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Concluídos</div>
          <div className="text-2xl font-bold text-green-600">
            {summary.completedProjects}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Orçamento Total</div>
          <div className="text-2xl font-bold text-purple-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(summary.totalBudget)}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Lista de Projetos
        </h3>
        <Button variant="primary">Novo Projeto</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={(p) => console.log("Visualizar projeto:", p.name)}
            onEdit={(p) => console.log("Editar projeto:", p.name)}
            onDelete={(p) => console.log("Excluir projeto:", p.name)}
          />
        ))}
      </div>
    </div>
  );
}

function ReportsModule() {
  return (
    <div className="text-center py-12">
      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Módulo de Relatórios
      </h3>
      <p className="text-gray-600 mb-6">
        Geração de relatórios técnicos e documentação de projetos.
      </p>
      <Button variant="primary">Gerar Relatório</Button>
    </div>
  );
}

function CabinetsModule() {
  return (
    <div className="text-center py-12">
      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Módulo de Gabinetes
      </h3>
      <p className="text-gray-600 mb-6">
        Configuração de layouts e arranjos de gabinetes LED.
      </p>
      <Button variant="primary">Criar Layout</Button>
    </div>
  );
}

function ScheduleModule() {
  return (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Módulo de Agenda
      </h3>
      <p className="text-gray-600 mb-6">
        Gerenciamento de cronogramas e agendamentos de projetos.
      </p>
      <Button variant="primary">Criar Evento</Button>
    </div>
  );
}

export default App;

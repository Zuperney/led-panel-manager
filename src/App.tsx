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
import { PanelList, usePanelData } from "./modules/Panels";
import { ProjectList, useProjectData } from "./modules/Projects";
import { CabinetList, useCabinetData } from "./modules/Cabinets";
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
  const {
    panels,
    loading,
    error,
    addPanel,
    updatePanel,
    deletePanel,
    clearError,
  } = usePanelData();

  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-800 font-medium">Erro:</span>
            <span className="text-red-700 ml-2">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">📱 Painéis LED</h3>
          <p className="text-gray-600 mt-1">
            Gerencie seu catálogo de painéis LED
          </p>
        </div>
      </div>

      <PanelList
        panels={panels}
        onCreatePanel={addPanel}
        onUpdatePanel={updatePanel}
        onDeletePanel={deletePanel}
        isLoading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
}

function ProjectsModule() {
  const {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    clearError,
  } = useProjectData();

  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">📁 Projetos</h3>
          <p className="text-gray-600 mt-1">
            Gerencie seus projetos de LED
          </p>
        </div>
      </div>

      <ProjectList
        projects={projects}
        onCreateProject={addProject}
        onUpdateProject={updateProject}
        onDeleteProject={deleteProject}
        isLoading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
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
  const {
    cabinets,
    loading,
    error,
    addCabinet,
    updateCabinet,
    deleteCabinet,
    clearError,
  } = useCabinetData();

  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">📦 Gabinetes LED</h3>
          <p className="text-gray-600 mt-1">
            Gerencie seu catálogo de gabinetes LED
          </p>
        </div>
      </div>

      <CabinetList
        cabinets={cabinets}
        onCreateCabinet={addCabinet}
        onUpdateCabinet={updateCabinet}
        onDeleteCabinet={deleteCabinet}
        isLoading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
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

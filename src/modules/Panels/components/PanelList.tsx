import React, { useState } from 'react';
import { PanelCard } from './PanelCard';
import PanelModal from './PanelModal';
import type { Panel } from '../types/panel.types';
import type { PanelFormData } from './PanelForm';

export interface PanelListProps {
  panels: Panel[];
  onCreatePanel: (data: PanelFormData) => void;
  onUpdatePanel: (id: string, data: PanelFormData) => void;
  onDeletePanel: (id: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  selectedFilters?: {
    manufacturer?: string;
    ipRating?: string;
    priceRange?: [number, number];
  };
}

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  panel?: Panel;
}

const PanelList: React.FC<PanelListProps> = ({
  panels,
  onCreatePanel,
  onUpdatePanel,
  onDeletePanel,
  isLoading = false,
  searchTerm = '',
  onSearchChange,
  selectedFilters = {}
}) => {
  // Estado do modal
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    panel: undefined
  });

  // Estado de confirmação de delete
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    panel?: Panel;
  }>({
    isOpen: false,
    panel: undefined
  });

  // Handlers para modal
  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      panel: undefined
    });
  };

  const openEditModal = (panel: Panel) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      panel
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
      panel: undefined
    });
  };

  // Handler para submit do formulário
  const handleFormSubmit = (data: PanelFormData) => {
    if (modalState.mode === 'create') {
      onCreatePanel(data);
    } else if (modalState.panel) {
      onUpdatePanel(modalState.panel.id, data);
    }
    closeModal();
  };

  // Handlers para delete
  const openDeleteConfirm = (panel: Panel) => {
    setDeleteConfirm({
      isOpen: true,
      panel
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      panel: undefined
    });
  };

  const confirmDelete = () => {
    if (deleteConfirm.panel) {
      onDeletePanel(deleteConfirm.panel.id);
      closeDeleteConfirm();
    }
  };

  // Filtragem de painéis
  const filteredPanels = panels.filter(panel => {
    // Filtro de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        panel.name.toLowerCase().includes(searchLower) ||
        panel.manufacturer.toLowerCase().includes(searchLower) ||
        panel.model.toLowerCase().includes(searchLower) ||
        panel.description?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Filtros adicionais
    if (selectedFilters.manufacturer && panel.manufacturer !== selectedFilters.manufacturer) {
      return false;
    }

    if (selectedFilters.ipRating && panel.ipRating !== selectedFilters.ipRating) {
      return false;
    }

    if (selectedFilters.priceRange && panel.price) {
      const [min, max] = selectedFilters.priceRange;
      if (panel.price < min || panel.price > max) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header com busca e botão de criar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar painéis..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Painel
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{panels.length}</div>
          <div className="text-sm text-gray-600">Total de Painéis</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{filteredPanels.length}</div>
          <div className="text-sm text-gray-600">Painéis Filtrados</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(panels.map(p => p.manufacturer)).size}
          </div>
          <div className="text-sm text-gray-600">Fabricantes</div>
        </div>
      </div>

      {/* Lista de painéis */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Carregando painéis...</span>
          </div>
        </div>
      ) : filteredPanels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || Object.keys(selectedFilters).length > 0 
              ? 'Nenhum painel encontrado' 
              : 'Nenhum painel cadastrado'
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || Object.keys(selectedFilters).length > 0 
              ? 'Tente ajustar os filtros de busca' 
              : 'Comece adicionando o primeiro painel LED ao catálogo'
            }
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            ✨ Adicionar Primeiro Painel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPanels.map((panel) => (
            <PanelCard
              key={panel.id}
              panel={panel}
              onEdit={() => openEditModal(panel)}
              onDelete={() => openDeleteConfirm(panel)}
            />
          ))}
        </div>
      )}

      {/* Modal de criação/edição */}
      <PanelModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        panel={modalState.panel}
        mode={modalState.mode}
        isLoading={isLoading}
      />

      {/* Modal de confirmação de delete */}
      {deleteConfirm.isOpen && deleteConfirm.panel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Exclusão
                </h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o painel <strong>{deleteConfirm.panel.name}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelList;

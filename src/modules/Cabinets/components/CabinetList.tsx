import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Package,
  Zap,
  Monitor,
  Edit2,
  Trash2,
  SortAsc,
  SortDesc,
  Tv,
  Sun,
} from "lucide-react";
import CabinetModal from "./CabinetModal";
import type { Cabinet, CabinetFormData, CabinetFilters, CabinetStats } from "../types/cabinet.types";

interface CabinetListProps {
  cabinets: Cabinet[];
  onCreateCabinet: (data: CabinetFormData) => void;
  onUpdateCabinet: (id: string, data: CabinetFormData) => void;
  onDeleteCabinet: (id: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (search: string) => void;
}

const CabinetList: React.FC<CabinetListProps> = ({
  cabinets,
  onCreateCabinet,
  onUpdateCabinet,
  onDeleteCabinet,
  isLoading = false,
  searchTerm = "",
  onSearchChange = () => {},
}) => {
  // Estados do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCabinet, setEditingCabinet] = useState<Cabinet | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formMode, setFormMode] = useState<'basic' | 'complete'>('basic');

  // Estados dos filtros
  const [filters, setFilters] = useState<CabinetFilters>({
    search: searchTerm,
    type: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Atualizar filtro de busca quando searchTerm muda
  React.useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, [searchTerm]);

  // Filtrar e ordenar gabinetes
  const filteredCabinets = useMemo(() => {
    let filtered = [...cabinets];

    // Filtro de busca
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(cabinet =>
        cabinet.name.toLowerCase().includes(searchLower) ||
        cabinet.type.toLowerCase().includes(searchLower) ||
        cabinet.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(cabinet => cabinet.type === filters.type);
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
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'pixelPitch':
          aValue = a.pixelPitch;
          bValue = b.pixelPitch;
          break;
        case 'power':
          aValue = a.powerWatts;
          bValue = b.powerWatts;
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
  }, [cabinets, filters]);

  // Calcular estatísticas
  const stats: CabinetStats = useMemo(() => {
    const total = cabinets.length;
    const indoor = cabinets.filter(cabinet => cabinet.type === 'indoor').length;
    const outdoor = cabinets.filter(cabinet => cabinet.type === 'outdoor').length;
    
    const averagePixelPitch = total > 0 
      ? Number((cabinets.reduce((sum, cabinet) => sum + cabinet.pixelPitch, 0) / total).toFixed(2))
      : 0;
    
    const totalPower = cabinets.reduce((sum, cabinet) => sum + cabinet.powerWatts, 0);

    return {
      total,
      indoor,
      outdoor,
      averagePixelPitch,
      totalPower,
    };
  }, [cabinets]);

  // Handlers do modal
  const handleCreateClick = (mode: 'basic' | 'complete') => {
    setEditingCabinet(null);
    setModalMode('create');
    setFormMode(mode);
    setModalOpen(true);
  };

  const handleEditClick = (cabinet: Cabinet) => {
    setEditingCabinet(cabinet);
    setModalMode('edit');
    // Detectar se tem dados completos para sugerir modo completo
    const hasCompleteData = cabinet.brightness || cabinet.refreshRate || cabinet.powerFactor;
    setFormMode(hasCompleteData ? 'complete' : 'basic');
    setModalOpen(true);
  };

  const handleModalSubmit = (data: CabinetFormData) => {
    if (modalMode === 'create') {
      onCreateCabinet(data);
    } else if (editingCabinet) {
      onUpdateCabinet(editingCabinet.id, data);
    }
    setModalOpen(false);
    setEditingCabinet(null);
  };

  const handleDeleteClick = (cabinet: Cabinet) => {
    if (window.confirm(`Deseja realmente excluir o gabinete "${cabinet.name}"?`)) {
      onDeleteCabinet(cabinet.id);
    }
  };

  // Handler para mudança de filtros
  const handleFilterChange = (key: keyof CabinetFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'search') {
      onSearchChange(value);
    }
  };

  const toggleSort = (sortBy: CabinetFilters['sortBy']) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Tv className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Indoor</p>
              <p className="text-2xl font-bold text-gray-900">{stats.indoor}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Sun className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Outdoor</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outdoor}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Monitor className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pixel Pitch Médio</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averagePixelPitch}mm</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Potência Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPower}W</p>
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
                placeholder="Buscar gabinetes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os tipos</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
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
              onClick={() => toggleSort('pixelPitch')}
              className={`px-3 py-2 border rounded-lg flex items-center space-x-1 ${
                filters.sortBy === 'pixelPitch' ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>Pixel Pitch</span>
              {filters.sortBy === 'pixelPitch' && (
                filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Botões de Criar */}
          <div className="flex gap-2">
            <button
              onClick={() => handleCreateClick('basic')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              <span>Básico</span>
            </button>

            <button
              onClick={() => handleCreateClick('complete')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 flex items-center space-x-2"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              <span>Completo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Gabinetes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Carregando gabinetes...</div>
        </div>
      ) : filteredCabinets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filters.search || filters.type !== 'all' ? 'Nenhum gabinete encontrado' : 'Nenhum gabinete cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.type !== 'all' 
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro gabinete LED.'}
          </p>
          {(!filters.search && filters.type === 'all') && (
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleCreateClick('basic')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ✨ Criar Gabinete Básico
              </button>
              <button
                onClick={() => handleCreateClick('complete')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                🔧 Criar Gabinete Completo
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCabinets.map((cabinet) => (
            <CabinetCard
              key={cabinet.id}
              cabinet={cabinet}
              onEdit={() => handleEditClick(cabinet)}
              onDelete={() => handleDeleteClick(cabinet)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <CabinetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingCabinet || undefined}
        mode={modalMode}
        formMode={formMode}
        isLoading={isLoading}
      />
    </div>
  );
};

// Componente do Card do Gabinete
interface CabinetCardProps {
  cabinet: Cabinet;
  onEdit: () => void;
  onDelete: () => void;
}

const CabinetCard: React.FC<CabinetCardProps> = ({ cabinet, onEdit, onDelete }) => {
  const hasCompleteData = cabinet.brightness || cabinet.refreshRate || cabinet.powerFactor;

  return (
    <div className="bg-white rounded-lg shadow border hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            {cabinet.type === 'indoor' ? (
              <Tv className="h-5 w-5 text-green-600" />
            ) : (
              <Sun className="h-5 w-5 text-orange-600" />
            )}
            <h3 className="font-semibold text-gray-900 text-lg">{cabinet.name}</h3>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 text-xs rounded-full ${
            cabinet.type === 'indoor' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {cabinet.type === 'indoor' ? '🏠 Indoor' : '🌤️ Outdoor'}
          </span>
          
          {hasCompleteData && (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              🔧 Completo
            </span>
          )}
          
          {cabinet.isBivolt && (
            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
              ⚡ Bivolt
            </span>
          )}
        </div>

        {/* Especificações principais */}
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500">Dimensões:</span>
              <p className="font-medium">{cabinet.widthMm} × {cabinet.heightMm} mm</p>
            </div>
            <div>
              <span className="text-gray-500">Pixels:</span>
              <p className="font-medium">{cabinet.widthPixels} × {cabinet.heightPixels}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500">Pixel Pitch:</span>
              <p className="font-medium text-blue-600">{cabinet.pixelPitch}mm</p>
            </div>
            <div>
              <span className="text-gray-500">Potência:</span>
              <p className="font-medium text-red-600">{cabinet.powerWatts}W</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500">Peso:</span>
              <p className="font-medium">{cabinet.weight}kg</p>
            </div>
            <div>
              <span className="text-gray-500">Voltagem:</span>
              <p className="font-medium">{cabinet.voltage}V</p>
            </div>
          </div>

          {hasCompleteData && (
            <div className="pt-2 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-xs">
                {cabinet.brightness && (
                  <div>
                    <span className="text-gray-500">Brilho:</span>
                    <p className="font-medium">{cabinet.brightness} nits</p>
                  </div>
                )}
                {cabinet.refreshRate && (
                  <div>
                    <span className="text-gray-500">Taxa:</span>
                    <p className="font-medium">{cabinet.refreshRate} Hz</p>
                  </div>
                )}
                {cabinet.powerFactor && (
                  <div>
                    <span className="text-gray-500">FP:</span>
                    <p className="font-medium">{cabinet.powerFactor}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Descrição */}
        {cabinet.description && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 line-clamp-2">{cabinet.description}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
          Criado em {new Date(cabinet.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  );
};

export default CabinetList;

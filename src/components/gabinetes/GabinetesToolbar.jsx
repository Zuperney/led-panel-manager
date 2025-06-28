import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Plus,
} from "lucide-react";

export default function GabinetesToolbar({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  resetForm,
  setShowModal,
  gabinetesFiltrados,
  gabinetes,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Busca */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar gabinetes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200"
            >
              <option value="todos" className="bg-gray-800 text-white">
                Todos
              </option>
              <option value="indoor" className="bg-gray-800 text-white">
                Indoor (≤10mm)
              </option>
              <option value="outdoor" className="bg-gray-800 text-white">
                Outdoor (&gt;10mm)
              </option>
              <option value="alta_potencia" className="bg-gray-800 text-white">
                Alta Potência (≥800W)
              </option>
              <option
                value="baixo_pixel_pitch"
                className="bg-gray-800 text-white"
              >
                Baixo Pixel Pitch (≤5mm)
              </option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200"
            >
              <option value="nome" className="bg-gray-800 text-white">
                Nome
              </option>
              <option value="potencia" className="bg-gray-800 text-white">
                Potência
              </option>
              <option value="peso" className="bg-gray-800 text-white">
                Peso
              </option>
              <option value="pixelPitch" className="bg-gray-800 text-white">
                Pixel Pitch
              </option>
              <option value="area" className="bg-gray-800 text-white">
                Área
              </option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              icon={sortOrder === "asc" ? SortAsc : SortDesc}
            />
          </div>

          {/* Modo de visualização */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg p-1 backdrop-blur-sm">
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              icon={Grid3X3}
            />
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              icon={List}
            />
          </div>

          {/* Botão Novo Gabinete */}
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            icon={Plus}
          >
            Novo Gabinete
          </Button>
        </div>
      </div>

      {/* Indicadores de filtro ativo */}
      {(searchTerm || filterBy !== "todos") && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm backdrop-blur-sm border border-blue-500/30">
              <Search className="w-3 h-3" />"{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 hover:text-blue-300 transition-colors duration-200"
              >
                ×
              </button>
            </span>
          )}
          {filterBy !== "todos" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm backdrop-blur-sm border border-purple-500/30">
              <Filter className="w-3 h-3" />
              {filterBy === "indoor" && "Indoor"}
              {filterBy === "outdoor" && "Outdoor"}
              {filterBy === "alta_potencia" && "Alta Potência"}
              {filterBy === "baixo_pixel_pitch" && "Baixo Pixel Pitch"}
              <button
                onClick={() => setFilterBy("todos")}
                className="ml-1 hover:text-purple-300 transition-colors duration-200"
              >
                ×
              </button>
            </span>
          )}
          <span className="text-gray-300 text-sm">
            {gabinetesFiltrados.length} de {gabinetes.length} gabinetes
          </span>
        </div>
      )}
    </motion.div>
  );
}

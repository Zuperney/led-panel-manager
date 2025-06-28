import { motion, AnimatePresence } from "framer-motion";
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
      className="glass-card p-6 mb-8 relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />

      <div className="relative flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Busca */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          className="flex-1 max-w-md"
        >
          <motion.div
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Search className="text-gray-400 w-5 h-5 group-hover:text-blue-400 transition-colors duration-200" />
            </motion.div>
            <input
              type="text"
              placeholder="Buscar gabinetes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/90 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-blue-400/50 !bg-gray-800"
              style={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                color: "white",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          className="flex flex-wrap gap-3 items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Filter className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
            </motion.div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-gray-800/90 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-purple-400/50 cursor-pointer !bg-gray-800"
              style={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                color: "white",
              }}
            >
              <option value="todos" className="bg-gray-800 text-white">
                Todos
              </option>
              <option value="indoor" className="bg-gray-800 text-white">
                Indoor
              </option>
              <option value="outdoor" className="bg-gray-800 text-white">
                Outdoor
              </option>
              <option value="alta_potencia" className="bg-gray-800 text-white">
                Alta Potência
              </option>
              <option
                value="baixo_pixel_pitch"
                className="bg-gray-800 text-white"
              >
                Baixo Pixel Pitch
              </option>
            </select>
          </motion.div>

          {/* Ordenação */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
          >
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800/90 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-green-400/50 cursor-pointer !bg-gray-800"
              style={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                color: "white",
              }}
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
            <motion.div
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                icon={sortOrder === "asc" ? SortAsc : SortDesc}
                className="hover:bg-green-500/20 hover:text-green-300"
              />
            </motion.div>
          </motion.div>

          {/* Modo de visualização */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg p-1 backdrop-blur-sm group hover:bg-white/15 hover:border-blue-400/30 transition-all duration-300"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                icon={Grid3X3}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                icon={List}
              />
            </motion.div>
          </motion.div>

          {/* Botão Novo Gabinete */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1.0, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              icon={Plus}
              className="hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Novo Gabinete
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicadores de filtro ativo */}
      <AnimatePresence>
        {(searchTerm || filterBy !== "todos") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20"
          >
            <AnimatePresence>
              {searchTerm && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm backdrop-blur-sm border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200"
                >
                  <Search className="w-3 h-3" />"{searchTerm}"
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-blue-300 transition-colors duration-200 rounded-full hover:bg-blue-500/20 w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </motion.button>
                </motion.span>
              )}
            </AnimatePresence>
            {filterBy !== "todos" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm backdrop-blur-sm border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-200"
              >
                <Filter className="w-3 h-3" />
                {filterBy === "indoor" && "Indoor"}
                {filterBy === "outdoor" && "Outdoor"}
                {filterBy === "alta_potencia" && "Alta Potência"}
                {filterBy === "baixo_pixel_pitch" && "Baixo Pixel Pitch"}
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFilterBy("todos")}
                  className="ml-1 hover:text-purple-300 transition-colors duration-200 rounded-full hover:bg-purple-500/20 w-4 h-4 flex items-center justify-center"
                >
                  ×
                </motion.button>
              </motion.span>
            )}
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-300 text-sm"
            >
              {gabinetesFiltrados.length} de {gabinetes.length} gabinetes
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

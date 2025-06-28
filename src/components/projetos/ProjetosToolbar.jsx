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

export default function ProjetosToolbar({
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
  abrirModal,
  projetosFiltrados,
  projetos,
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

      <div className="relative flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        {/* Busca */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          className="flex-1 max-w-md min-h-[44px] flex items-center"
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
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/90 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-blue-400/50 h-10"
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
          className="flex flex-wrap gap-3 items-center min-h-[44px]"
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
              className="bg-gray-800/90 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-purple-400/50 cursor-pointer h-10"
              style={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                color: "white",
              }}
            >
              <option value="todos" className="bg-gray-800 text-white">
                Todos
              </option>
              <option value="em_andamento" className="bg-gray-800 text-white">
                Em Andamento
              </option>
              <option value="atrasados" className="bg-gray-800 text-white">
                Atrasados
              </option>
              <option value="urgentes" className="bg-gray-800 text-white">
                Urgentes
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
              className="bg-gray-800/90 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-green-400/50 cursor-pointer h-10"
              style={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                color: "white",
              }}
            >
              <option value="nome" className="bg-gray-800 text-white">
                Nome
              </option>
              <option value="cliente" className="bg-gray-800 text-white">
                Cliente
              </option>
              <option value="dataEntrega" className="bg-gray-800 text-white">
                Data de Entrega
              </option>
              <option value="status" className="bg-gray-800 text-white">
                Status
              </option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              icon={sortOrder === "asc" ? SortAsc : SortDesc}
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-10 w-10 p-0 hover:bg-green-500/20"
              title={`Ordenar ${
                sortOrder === "asc" ? "Decrescente" : "Crescente"
              }`}
            />
          </motion.div>

          {/* Modo de Visualização */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="flex bg-gray-800/60 border border-white/20 rounded-lg overflow-hidden"
          >
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              icon={Grid3X3}
              onClick={() => setViewMode("grid")}
              className="rounded-none border-0 h-10 w-12"
              title="Visualização em Grade"
            />
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              icon={List}
              onClick={() => setViewMode("list")}
              className="rounded-none border-0 border-l border-white/10 h-10 w-12"
              title="Visualização em Lista"
            />
          </motion.div>

          {/* Botão Adicionar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, type: "spring", stiffness: 400 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={Plus}
              onClick={abrirModal}
              className="shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Novo Projeto
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de Filtros Ativos */}
      <AnimatePresence>
        {(searchTerm || filterBy !== "todos") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-700/50"
          >
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-gray-400">Filtros ativos:</span>
              {searchTerm && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30"
                >
                  Busca: "{searchTerm}"
                </motion.span>
              )}
              {filterBy !== "todos" && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30"
                >
                  Filtro: {filterBy.replace("_", " ")}
                </motion.span>
              )}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full border border-gray-500/30"
              >
                {projetosFiltrados.length} de {projetos.length} projetos
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Button, InputField, SelectField } from "../ModernUI";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  Plus,
  Monitor,
  Zap,
  Building2,
} from "lucide-react";

export default function PaineisToolbar({
  busca,
  setBusca,
  filtroGabinete,
  setFiltroGabinete,
  filtroTipo,
  setFiltroTipo,
  ordenacao,
  setOrdenacao,
  viewMode,
  setViewMode,
  onNovoPainel,
  gabinetes,
  paineisFiltrados,
  totalPaineis,
}) {
  // Extrair tipos únicos dos gabinetes
  const tiposUnicos = [
    ...new Set(gabinetes.map((g) => g.tipo).filter(Boolean)),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Lado esquerdo - Busca e Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Busca */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar painéis..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg
                         text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 
                         focus:ring-blue-400/20 transition-all duration-200"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            {/* Filtro por Gabinete */}
            <select
              value={filtroGabinete}
              onChange={(e) => setFiltroGabinete(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 
                         transition-all duration-200 min-w-0"
            >
              <option value="">Todos Gabinetes</option>
              {gabinetes.map((gabinete, index) => (
                <option
                  key={index}
                  value={gabinete.nome}
                  className="bg-gray-800"
                >
                  {gabinete.nome}
                </option>
              ))}
            </select>

            {/* Filtro por Tipo */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 
                         transition-all duration-200 min-w-0"
            >
              <option value="">Todos Tipos</option>
              {tiposUnicos.map((tipo, index) => (
                <option key={index} value={tipo} className="bg-gray-800">
                  {tipo}
                </option>
              ))}
            </select>

            {/* Ordenação */}
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 
                         transition-all duration-200 min-w-0"
            >
              <option value="nome" className="bg-gray-800">
                Nome A-Z
              </option>
              <option value="nome-desc" className="bg-gray-800">
                Nome Z-A
              </option>
              <option value="projeto" className="bg-gray-800">
                Projeto
              </option>
              <option value="potencia" className="bg-gray-800">
                Maior Potência
              </option>
              <option value="potencia-desc" className="bg-gray-800">
                Menor Potência
              </option>
              <option value="area" className="bg-gray-800">
                Maior Área
              </option>
              <option value="area-desc" className="bg-gray-800">
                Menor Área
              </option>
            </select>
          </div>
        </div>

        {/* Lado direito - Controles e Ações */}
        <div className="flex items-center gap-3">
          {/* Contador de resultados */}
          <div className="text-sm text-gray-400 mr-2">
            {paineisFiltrados.length} de {totalPaineis} painéis
          </div>

          {/* Toggle View Mode */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              icon={Grid3X3}
              onClick={() => setViewMode("grid")}
              className={`
                transition-all duration-200
                ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }
              `}
              title="Visualização em grid"
            />
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              icon={List}
              onClick={() => setViewMode("list")}
              className={`
                transition-all duration-200
                ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }
              `}
              title="Visualização em lista"
            />
          </div>

          {/* Botão Novo Painel */}
          <Button
            variant="primary"
            icon={Plus}
            onClick={onNovoPainel}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl
                       transition-all duration-200"
          >
            Novo Painel
          </Button>
        </div>
      </div>

      {/* Filtros ativos (badges) */}
      {(busca || filtroGabinete || filtroTipo) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10"
        >
          {busca && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 
                             text-blue-300 rounded-lg text-xs"
            >
              <Search className="w-3 h-3" />"{busca}"
            </span>
          )}
          {filtroGabinete && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 
                             text-purple-300 rounded-lg text-xs"
            >
              <Building2 className="w-3 h-3" />
              {filtroGabinete}
            </span>
          )}
          {filtroTipo && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 
                             text-green-300 rounded-lg text-xs"
            >
              <Monitor className="w-3 h-3" />
              {filtroTipo}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

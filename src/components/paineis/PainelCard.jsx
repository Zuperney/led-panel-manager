import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import {
  Edit2,
  Trash2,
  Copy,
  Monitor,
  Zap,
  Ruler,
  Building2,
  Calculator,
} from "lucide-react";
import { useMemo } from "react";

export default function PainelCard({
  painel,
  originalIndex,
  index,
  gabinetes,
  editarPainel,
  removerPainel,
  duplicarPainel,
  selecionarPainel,
  isSelected,
  isRecenteAdicionado,
}) {
  // Buscar gabinete e calcular informações usando useMemo
  const painelInfo = useMemo(() => {
    const gabineteObj = gabinetes.find((g) => g.nome === painel.gabinete);
    const qtdGabinetes = (painel.qtdLargura || 1) * (painel.qtdAltura || 1);
    const potenciaTotal = gabineteObj ? gabineteObj.potencia * qtdGabinetes : 0;

    return {
      gabineteObj,
      qtdGabinetes,
      potenciaTotal,
      tipo: gabineteObj?.tipo || "N/A",
      pixelPitch: gabineteObj?.pixelPitch || "N/A",
    };
  }, [painel, gabinetes]);

  const { gabineteObj, qtdGabinetes, potenciaTotal, tipo, pixelPitch } =
    painelInfo;

  return (
    <motion.div
      key={`painel-${originalIndex}-${index}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className={`
        relative bg-white/5 backdrop-blur-sm border rounded-xl p-5 cursor-pointer
        transition-all duration-300 group overflow-hidden
        ${
          isSelected
            ? "border-blue-400/60 bg-blue-500/10 shadow-lg shadow-blue-500/20"
            : "border-white/20 hover:border-blue-300/50 hover:bg-white/10"
        }
        ${
          isRecenteAdicionado
            ? "ring-2 ring-green-400/60 shadow-lg shadow-green-500/25"
            : ""
        }
      `}
      onClick={() => selecionarPainel(originalIndex, painel)}
    >
      {/* Badge "NOVO" para painéis recém-adicionados */}
      {isRecenteAdicionado && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold 
                     px-2 py-1 rounded-full shadow-lg z-10"
        >
          NOVO
        </motion.div>
      )}

      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg 
                          ring-1 ring-blue-400/30 flex-shrink-0"
          >
            <Monitor className="w-5 h-5 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="font-semibold text-white text-sm truncate group-hover:text-blue-200 
                           transition-colors"
            >
              {painel.nome}
            </h3>
            <p className="text-gray-400 text-xs truncate">{painel.projeto}</p>
          </div>
        </div>
      </div>

      {/* Informações principais */}
      <div className="space-y-3 mb-4">
        {/* Dimensões */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-xs">Dimensões</span>
          </div>
          <span className="text-white text-sm font-medium">
            {painel.largura?.toFixed(2)}m × {painel.altura?.toFixed(2)}m
          </span>
        </div>

        {/* Gabinete */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-xs">Gabinete</span>
          </div>
          <span
            className="text-white text-sm font-medium truncate max-w-24"
            title={painel.gabinete}
          >
            {painel.gabinete}
          </span>
        </div>

        {/* Tipo e Pixel Pitch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-xs">Tipo/Pitch</span>
          </div>
          <span className="text-white text-sm font-medium">
            {tipo} / {pixelPitch}mm
          </span>
        </div>

        {/* Potência */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300 text-xs">Potência</span>
          </div>
          <span className="text-yellow-300 text-sm font-medium">
            {potenciaTotal.toLocaleString("pt-BR")}W
          </span>
        </div>
      </div>

      {/* Stats compactas */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-xs text-gray-400">Módulos</div>
          <div className="text-sm font-medium text-white">{qtdGabinetes}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-xs text-gray-400">Área</div>
          <div className="text-sm font-medium text-white">
            {painel.area?.toFixed(1)}m²
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-xs text-gray-400">Peso</div>
          <div className="text-sm font-medium text-white">
            {painel.peso?.toFixed(0)}kg
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          icon={Edit2}
          className="flex-1 opacity-70 hover:opacity-100 hover:bg-green-500/20 hover:text-green-300 
                     transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            editarPainel(originalIndex);
          }}
          title="Editar painel"
        />
        <Button
          variant="ghost"
          size="sm"
          icon={Copy}
          className="flex-1 opacity-70 hover:opacity-100 hover:bg-blue-500/20 hover:text-blue-300 
                     transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            duplicarPainel(originalIndex);
          }}
          title="Duplicar painel"
        />
        <Button
          variant="ghost"
          size="sm"
          icon={Trash2}
          className="flex-1 opacity-70 hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 
                     transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            removerPainel(originalIndex);
          }}
          title="Excluir painel"
        />
      </div>

      {/* Indicador de seleção */}
      {isSelected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 rounded-b-xl"
        />
      )}
    </motion.div>
  );
}

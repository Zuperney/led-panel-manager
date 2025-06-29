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
  User,
} from "lucide-react";
import { useMemo } from "react";

export default function PainelListItem({
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
      key={`painel-list-${originalIndex}-${index}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        delay: index * 0.02,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      whileHover={{
        scale: 1.005,
        x: 4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className={`
        relative bg-white/5 backdrop-blur-sm border rounded-xl p-4 cursor-pointer
        transition-all duration-300 group
        ${
          isSelected
            ? "border-blue-400/60 bg-blue-500/10 shadow-lg shadow-blue-500/20"
            : "border-white/20 hover:border-blue-300/60 hover:bg-white/10 hover:shadow-lg"
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

      <div className="flex items-center justify-between">
        {/* Informações principais */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-3 items-center">
          {/* Nome do Painel */}
          <div className="flex items-center gap-3 lg:col-span-1">
            <div
              className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg 
                            ring-1 ring-blue-400/30 flex-shrink-0"
            >
              <Monitor className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3
                className="font-semibold text-white text-sm truncate group-hover:text-blue-200 
                             transition-colors"
              >
                {painel.nome}
              </h3>
              {/* Mostrar projeto abaixo do nome em telas pequenas */}
              <div className="lg:hidden flex items-center gap-1 mt-1">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-xs truncate">
                  {painel.projeto || "Projeto não informado"}
                </span>
              </div>
            </div>
          </div>

          {/* Projeto - oculto em telas pequenas */}
          <div className="hidden lg:flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm truncate">
              {painel.projeto || "Não informado"}
            </span>
          </div>

          {/* Dimensões */}
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">
              {painel.largura?.toFixed(2)}m × {painel.altura?.toFixed(2)}m
            </span>
          </div>

          {/* Gabinete e Tipo */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <div className="min-w-0">
              <span
                className="text-gray-300 text-sm truncate block"
                title={painel.gabinete}
              >
                {painel.gabinete}
              </span>
              <span className="text-gray-400 text-xs">
                {tipo} • {pixelPitch}mm
              </span>
            </div>
          </div>

          {/* Potência e Stats */}
          <div className="flex items-center justify-start gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">
                {potenciaTotal.toLocaleString("pt-BR")}W
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-3 text-xs text-gray-400">
              <span>{qtdGabinetes} módulos</span>
              <span>•</span>
              <span>{painel.area?.toFixed(1)}m²</span>
              <span>•</span>
              <span>{painel.peso?.toFixed(0)}kg</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit2}
            className="opacity-70 hover:opacity-100 hover:bg-green-500/20 hover:text-green-300 
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
            className="opacity-70 hover:opacity-100 hover:bg-blue-500/20 hover:text-blue-300 
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
            className="opacity-70 hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 
                       transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              removerPainel(originalIndex);
            }}
            title="Excluir painel"
          />
        </div>
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

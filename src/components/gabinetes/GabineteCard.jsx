import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import { Copy, Edit3, Trash2 } from "lucide-react";

export default function GabineteCard({
  gabinete,
  originalIndex,
  index,
  gabineteSelecionado,
  setGabineteSelecionado,
  duplicarGabinete,
  editarGabinete,
  removerGabinete,
}) {
  return (
    <motion.div
      key={`${gabinete.nome}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gray-900/90 rounded-xl p-6 border-2 shadow-lg cursor-pointer transition-all duration-300 overflow-hidden break-words hover:shadow-xl hover:scale-[1.02] h-full flex flex-col ${
        gabineteSelecionado === originalIndex
          ? "border-blue-400 bg-blue-900/50 shadow-blue-500/30 shadow-2xl"
          : "border-gray-600/80 hover:border-blue-300/60 hover:bg-gray-800/95 hover:shadow-blue-500/10"
      }`}
      onClick={() =>
        setGabineteSelecionado(
          gabineteSelecionado === originalIndex ? null : originalIndex
        )
      }
      style={{ minWidth: 0 }}
    >
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-700/50">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white truncate mb-1">
            {gabinete.nome}
          </h3>
          <p className="text-sm text-gray-400">
            {gabinete.pixelPitch <= 10 ? "Indoor" : "Outdoor"} • P
            {gabinete.pixelPitch}
          </p>
        </div>
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Copy}
            className="opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              duplicarGabinete(originalIndex);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit3}
            className="opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              editarGabinete(originalIndex);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="opacity-70 hover:opacity-100 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              removerGabinete(originalIndex);
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mb-4 flex-1">
        <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Dimensões
          </span>
          <div className="font-semibold text-white mt-1">
            {gabinete.largura}×{gabinete.altura}mm
          </div>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Resolução
          </span>
          <div className="font-semibold text-white mt-1">
            {gabinete.resolucaoX}×{gabinete.resolucaoY}px
          </div>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Potência
          </span>
          <div className="font-semibold text-yellow-400 mt-1">
            {gabinete.potencia}W
          </div>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Peso
          </span>
          <div className="font-semibold text-white mt-1">{gabinete.peso}kg</div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <span className="text-gray-400 text-xs">Pixel Pitch</span>
            <div className="font-bold text-blue-400 text-lg">
              {gabinete.pixelPitch}mm
            </div>
          </div>
          <div className="h-8 w-px bg-gray-700"></div>
          <div className="text-center">
            <span className="text-gray-400 text-xs">Área</span>
            <div className="font-semibold text-sm text-gray-300">
              {((gabinete.largura * gabinete.altura) / 1000000).toFixed(2)}m²
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium border ${
              gabinete.tipo === "indoor"
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
                : "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30"
            }`}
          >
            {gabinete.tipo
              ? gabinete.tipo.charAt(0).toUpperCase() + gabinete.tipo.slice(1)
              : "Não definido"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

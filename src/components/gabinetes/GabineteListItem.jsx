import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import { Copy, Edit3, Trash2 } from "lucide-react";

export default function GabineteListItem({
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
      key={`${gabinete.nome}-${index}-list`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-gray-800/60 rounded-lg p-5 border-2 cursor-pointer transition-all shadow-md hover:shadow-lg ${
        gabineteSelecionado === originalIndex
          ? "border-blue-400 bg-blue-500/20 shadow-blue-500/20"
          : "border-gray-600/70 hover:border-blue-300/50 hover:bg-gray-700/60"
      }`}
      onClick={() =>
        setGabineteSelecionado(
          gabineteSelecionado === originalIndex ? null : originalIndex
        )
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate">{gabinete.nome}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
              <span>
                {gabinete.largura}×{gabinete.altura}mm
              </span>
              <span>•</span>
              <span>
                {gabinete.resolucaoX}×{gabinete.resolucaoY}px
              </span>
              <span>•</span>
              <span className="text-blue-400">{gabinete.pixelPitch}mm</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <div className="text-yellow-400 font-medium">
                {gabinete.potencia}W
              </div>
              <div className="text-xs text-gray-400">Potência</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{gabinete.peso}kg</div>
              <div className="text-xs text-gray-400">Peso</div>
            </div>
            <div className="flex gap-1">
              {gabinete.pixelPitch <= 5 && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  Premium
                </span>
              )}
              {gabinete.pixelPitch <= 10 ? (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  Indoor
                </span>
              ) : (
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                  Outdoor
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            icon={Copy}
            onClick={(e) => {
              e.stopPropagation();
              duplicarGabinete(originalIndex);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit3}
            onClick={(e) => {
              e.stopPropagation();
              editarGabinete(originalIndex);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={(e) => {
              e.stopPropagation();
              removerGabinete(originalIndex);
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

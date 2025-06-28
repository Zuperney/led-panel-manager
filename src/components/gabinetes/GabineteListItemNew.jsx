import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import { Copy, Edit3, Trash2 } from "lucide-react";
import { Tag } from "../ui/BaseComponents";

export default function GabineteListItemNew({
  gabinete,
  originalIndex,
  index,
  gabineteSelecionado,
  setGabineteSelecionado,
  duplicarGabinete,
  editarGabinete,
  removerGabinete,
}) {
  const isSelected = gabineteSelecionado === originalIndex;
  const isPremium = (gabinete.pitch || gabinete.pixelPitch) <= 5;
  const isIndoor = (gabinete.pitch || gabinete.pixelPitch) <= 10;

  return (
    <motion.div
      key={`${gabinete.nome}-${index}-list`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className={`p-2 cursor-pointer transition-all duration-300 rounded-xl border-2 md:border-4 ${
        isSelected
          ? "border-blue-400 bg-blue-500/5 shadow-lg shadow-blue-500/25"
          : "border-gray-300 hover:border-blue-300 hover:shadow-md"
      }`}
      onClick={() => setGabineteSelecionado(isSelected ? null : originalIndex)}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate text-white">
              {gabinete.nome}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
              <span>
                {gabinete.largura}×{gabinete.altura}mm
              </span>
              <span>•</span>
              <span>
                {gabinete.pixels_largura || gabinete.resolucaoX || "N/A"}×
                {gabinete.pixels_altura || gabinete.resolucaoY || "N/A"}px
              </span>
              <span>•</span>
              <span className="text-blue-400">
                {gabinete.pitch || gabinete.pixelPitch}mm
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <span className="text-gray-400 text-xs block">Potência</span>
              <span className="text-yellow-400 font-semibold">
                {gabinete.potencia}W
              </span>
            </div>
            <div className="text-center">
              <span className="text-gray-400 text-xs block">Peso</span>
              <span className="text-white font-semibold">
                {gabinete.peso}kg
              </span>
            </div>
            <div className="text-center">
              <span className="text-gray-400 text-xs block">Área</span>
              <span className="text-gray-300 font-semibold">
                {((gabinete.largura * gabinete.altura) / 1000000).toFixed(2)}m²
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPremium && <Tag variant="premium">Premium</Tag>}
            <Tag variant={isIndoor ? "indoor" : "outdoor"}>
              {isIndoor ? "Indoor" : "Outdoor"}
            </Tag>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
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
    </motion.div>
  );
}

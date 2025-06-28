import { motion } from "framer-motion";
import { Button } from "../ModernUI";
import { Copy, Edit3, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  InfoGrid,
  InfoCell,
  Tag,
  DividerVertical,
} from "../ui/BaseComponents";

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
  const isSelected = gabineteSelecionado === originalIndex;
  const area = ((gabinete.largura * gabinete.altura) / 1000000).toFixed(2);
  // Usar o tipo real do gabinete em vez de calcular baseado no pitch
  const isIndoor = gabinete.tipo === "indoor";

  return (
    <motion.div
      key={`${gabinete.nome}-${index}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className={`h-full p-1 transition-all duration-300 rounded-xl border-2 md:border-4 relative group ${
        isSelected
          ? "border-blue-400 bg-blue-500/10 shadow-xl shadow-blue-500/30 z-10"
          : "border-white/20 hover:border-blue-300/60 hover:shadow-lg hover:bg-white/5"
      }`}
    >
      {/* Glow effect para item selecionado */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl blur-lg -z-10"
        />
      )}

      <Card
        selected={false}
        onClick={() =>
          setGabineteSelecionado(isSelected ? null : originalIndex)
        }
        className="flex flex-col cursor-pointer m-2 h-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border-0"
      >
        {/* Header */}
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="font-bold text-lg text-white truncate mb-1 group-hover:text-blue-200 transition-colors duration-300"
              >
                {gabinete.nome}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.25 }}
                className="text-sm text-gray-400"
              >
                {gabinete.tipo || "Não definido"} • P
                {gabinete.pitch || gabinete.pixelPitch}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex gap-1 ml-2"
            >
              <Button
                variant="ghost"
                size="sm"
                icon={Copy}
                className="opacity-70 hover:opacity-100 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicarGabinete(originalIndex);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Edit3}
                className="opacity-70 hover:opacity-100 hover:bg-green-500/20 hover:text-green-300 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  editarGabinete(originalIndex);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                className="opacity-70 hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  removerGabinete(originalIndex);
                }}
              />
            </motion.div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1">
          <InfoGrid>
            <InfoCell
              label="Dimensões"
              value={`${gabinete.largura}×${gabinete.altura}mm`}
            />
            <InfoCell
              label="Resolução"
              value={`${
                gabinete.pixels_largura || gabinete.resolucaoX || "N/A"
              }×${gabinete.pixels_altura || gabinete.resolucaoY || "N/A"}px`}
            />
            <InfoCell
              label="Potência"
              value={`${gabinete.potencia}W`}
              valueClass="font-semibold text-yellow-400 mt-1"
            />
            <InfoCell label="Peso" value={`${gabinete.peso}kg`} />
          </InfoGrid>
        </CardContent>

        {/* Footer */}
        <CardFooter>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className="text-gray-400 text-xs">Pixel Pitch</span>
                <div className="font-bold text-blue-400 text-lg">
                  {gabinete.pitch || gabinete.pixelPitch}mm
                </div>
              </div>
              <DividerVertical />
              <div className="text-center">
                <span className="text-gray-400 text-xs">Área</span>
                <div className="font-semibold text-sm text-gray-300">
                  {area}m²
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="flex flex-col gap-1"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.45 }}
              >
                <Tag variant={isIndoor ? "indoor" : "outdoor"}>
                  {gabinete.tipo
                    ? gabinete.tipo.charAt(0).toUpperCase() +
                      gabinete.tipo.slice(1)
                    : "Não definido"}
                </Tag>
              </motion.div>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

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
  const isPremium = (gabinete.pitch || gabinete.pixelPitch) <= 5;
  const isIndoor = (gabinete.pitch || gabinete.pixelPitch) <= 10;

  return (
    <motion.div
      key={`${gabinete.nome}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`h-full p-1 transition-all duration-300 rounded-xl border-2 md:border-4 ${
        isSelected
          ? "border-blue-400 bg-blue-500/5 shadow-lg shadow-blue-500/25"
          : "border-gray-300 hover:border-blue-300 hover:shadow-md"
      }`}
    >
      <Card
        selected={false}
        onClick={() =>
          setGabineteSelecionado(isSelected ? null : originalIndex)
        }
        className="flex flex-col cursor-pointer m-2 h-full"
      >
        {/* Header */}
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-white truncate mb-1">
                {gabinete.nome}
              </h3>
              <p className="text-sm text-gray-400">
                {isIndoor ? "Indoor" : "Outdoor"} • P
                {gabinete.pitch || gabinete.pixelPitch}
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
            <div className="flex flex-col gap-1">
              {isPremium && <Tag variant="premium">Premium</Tag>}
              <Tag variant={isIndoor ? "indoor" : "outdoor"}>
                {isIndoor ? "Indoor" : "Outdoor"}
              </Tag>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

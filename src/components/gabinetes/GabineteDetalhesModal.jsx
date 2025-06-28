import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ModernUI";
import { Eye, Edit3, X } from "lucide-react";
import { InfoGrid, InfoCell, Tag } from "../ui/BaseComponents";

export default function GabineteDetalhesModal({
  isOpen,
  onClose,
  gabinete,
  onEdit,
}) {
  if (!gabinete) return null;

  const area = (gabinete.largura * gabinete.altura) / 1000000; // m²
  const pixelsLargura = gabinete.pixels_largura || gabinete.resolucaoX || 0;
  const pixelsAltura = gabinete.pixels_altura || gabinete.resolucaoY || 0;
  const densidadePixel = (pixelsLargura * pixelsAltura) / area;
  const pixelPitch = gabinete.pitch || gabinete.pixelPitch;
  const isPremium = pixelPitch <= 5;
  const isIndoor = pixelPitch <= 10;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop com efeito glass */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Modal Content - Tamanho reduzido */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-container max-w-sm w-full max-h-[80vh] overflow-y-auto"
              style={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                maxWidth: "360px",
              }}
            >
              {/* Header */}
              <div
                className="modal-header sticky top-0 p-4 flex items-center justify-between rounded-t-xl"
                style={{
                  backgroundColor: "#111827",
                  borderBottomColor: "#374151",
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Eye className="text-green-400 w-5 h-5" />
                  </motion.div>
                  <h2 className="text-lg font-bold text-white">
                    Detalhes do Gabinete
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div
                className="modal-content p-4 space-y-4"
                style={{
                  backgroundColor: "#1f2937",
                }}
              >
                {/* Informações Básicas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-700 border border-gray-600 rounded-xl p-4 shadow-lg"
                  style={{
                    backgroundColor: "#374151",
                    borderColor: "#4b5563",
                  }}
                >
                  <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Informações Básicas
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Nome:</span>
                      <span className="text-white font-semibold">
                        {gabinete.nome}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Tipo:</span>
                      <Tag variant={isIndoor ? "indoor" : "outdoor"}>
                        {isIndoor ? "Indoor" : "Outdoor"}
                      </Tag>
                    </div>
                    {isPremium && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">
                          Categoria:
                        </span>
                        <Tag variant="premium">Premium</Tag>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Especificações Técnicas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-700 border border-gray-600 rounded-xl p-4 shadow-lg"
                  style={{
                    backgroundColor: "#374151",
                    borderColor: "#4b5563",
                  }}
                >
                  <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Especificações Técnicas
                  </h4>
                  <InfoGrid>
                    <InfoCell
                      label="Dimensões"
                      value={`${gabinete.largura} × ${gabinete.altura}mm`}
                    />
                    <InfoCell
                      label="Resolução"
                      value={`${pixelsLargura} × ${pixelsAltura}px`}
                    />
                    <InfoCell
                      label="Pixel Pitch"
                      value={`${pixelPitch}mm`}
                      valueClass="font-semibold text-blue-400 mt-1"
                    />
                    <InfoCell
                      label="Área Total"
                      value={`${area.toFixed(2)}m²`}
                    />
                  </InfoGrid>
                </motion.div>

                {/* Características Elétricas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-700 border border-gray-600 rounded-xl p-6 shadow-lg"
                  style={{
                    backgroundColor: "#374151",
                    borderColor: "#4b5563",
                  }}
                >
                  <h4 className="font-bold text-yellow-400 mb-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Características Elétricas e Físicas
                  </h4>
                  <InfoGrid>
                    <InfoCell
                      label="Potência"
                      value={`${gabinete.potencia}W`}
                      valueClass="font-semibold text-yellow-400 mt-1"
                    />
                    <InfoCell label="Peso" value={`${gabinete.peso}kg`} />
                    <InfoCell
                      label="Densidade de Pixels"
                      value={`${Math.round(
                        densidadePixel
                      ).toLocaleString()} px/m²`}
                    />
                    <InfoCell
                      label="Eficiência"
                      value={`${(gabinete.potencia / area).toFixed(1)}W/m²`}
                    />
                  </InfoGrid>
                </motion.div>

                {/* Footer com Botões */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-2 pt-3"
                >
                  <Button
                    onClick={onEdit}
                    icon={Edit3}
                    size="sm"
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="px-4"
                  >
                    Fechar
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

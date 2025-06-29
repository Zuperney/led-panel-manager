import { motion } from "framer-motion";
import { Eye } from "lucide-react";

/**
 * 🗂️ PainelModals - Modais do Sistema de Painéis
 *
 * Responsabilidades:
 * - Modal de preview de painéis
 * - Modal de confirmação de exclusão
 * - Modal de configurações avançadas
 * - Modal de ajuda e documentação
 */
export default function PainelModals({ previewPainel, onClosePreview }) {
  return (
    <>
      {/* Modal de Preview do Painel */}
      {previewPainel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClosePreview}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass-card p-6 max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className="text-blue-400" />
              <h3 className="text-xl font-semibold">
                Preview do Painel: {previewPainel.nome}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Projeto</p>
                  <p className="font-medium">{previewPainel.projeto}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Gabinete</p>
                  <p className="font-medium">{previewPainel.gabinete}</p>
                </div>
              </div>

              {previewPainel.area && (
                <div>
                  <p className="text-sm text-gray-400">Área Total</p>
                  <p className="font-medium">
                    {previewPainel.area.toFixed(2)} m²
                  </p>
                </div>
              )}

              {previewPainel.potenciaTotal && (
                <div>
                  <p className="text-sm text-gray-400">Potência Total</p>
                  <p className="font-medium">
                    {previewPainel.potenciaTotal.toLocaleString("pt-BR")} W
                  </p>
                </div>
              )}

              <div className="text-center pt-4">
                <button
                  onClick={onClosePreview}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ModernUI";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  gabineteNome,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-red-500 rounded-xl border-2 border-red-400 shadow-2xl w-full max-w-md overflow-hidden"
        style={{ backgroundColor: "#EF4444", opacity: 1 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b-2 border-red-400 bg-red-600"
          style={{ backgroundColor: "#DC2626", opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-700 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Confirmar Exclusão
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
            className="opacity-70 hover:opacity-100"
          />
        </div>

        {/* Content */}
        <div className="p-6" style={{ backgroundColor: "#EF4444", opacity: 1 }}>
          <p className="text-white mb-4">
            Tem certeza que deseja excluir o gabinete{" "}
            <span className="font-semibold text-yellow-300">
              "{gabineteNome}"
            </span>
            ?
          </p>
          <p className="text-sm text-red-100 mb-6">
            Esta ação não pode ser desfeita. O gabinete será removido
            permanentemente.
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              loading={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

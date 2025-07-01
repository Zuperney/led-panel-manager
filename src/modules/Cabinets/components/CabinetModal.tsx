import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import CabinetForm from "./CabinetForm";
import type { Cabinet, CabinetFormData } from "../types/cabinet.types";

interface CabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CabinetFormData) => void;
  initialData?: Cabinet;
  mode: "create" | "edit";
  formMode: "basic" | "complete";
  isLoading?: boolean;
}

const CabinetModal: React.FC<CabinetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
  formMode = "basic",
  isLoading = false,
}) => {
  const handleSubmit = (data: CabinetFormData) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header com botão de fechar */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo scrollável */}
          <div className="max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <CabinetForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={onClose}
                mode={mode}
                formMode={formMode}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CabinetModal;

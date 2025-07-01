import React from 'react';
import { createPortal } from 'react-dom';
import PanelForm from './PanelForm';
import type { PanelFormData } from './PanelForm';
import type { Panel } from '../types/panel.types';

export interface PanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PanelFormData) => void;
  panel?: Panel;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

const PanelModal: React.FC<PanelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  panel,
  mode,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="relative w-full max-w-4xl mx-auto mt-8 mb-8 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com botão de fechar */}
        <div className="absolute top-0 right-0 z-10 p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Fechar modal"
            disabled={isLoading}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Componente PanelForm */}
        <PanelForm
          initialData={panel}
          onSubmit={onSubmit}
          onCancel={onClose}
          mode={mode}
          isLoading={isLoading}
        />
      </div>
    </div>
  );

  // Render no portal para evitar problemas de z-index
  return createPortal(modalContent, document.body);
};

export default PanelModal;

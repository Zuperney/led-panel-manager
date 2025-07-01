import React, { useState } from "react";
import { PanelList } from "../modules/Panels/components";
import { usePanelData } from "../modules/Panels/hooks/usePanelData";

const PainelPage: React.FC = () => {
  const {
    panels,
    loading,
    error,
    addPanel,
    updatePanel,
    deletePanel,
    clearError,
  } = usePanelData();

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📱 Painéis LED
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie seu catálogo de painéis LED com facilidade
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-800 font-medium">Erro:</span>
                <span className="text-red-700 ml-2">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <PanelList
          panels={panels}
          onCreatePanel={addPanel}
          onUpdatePanel={updatePanel}
          onDeletePanel={deletePanel}
          isLoading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default PainelPage;

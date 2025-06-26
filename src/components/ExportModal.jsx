import { useState } from "react";

export default function ExportModal({
  layoutConfig,
  exportConfig,
  onExportConfigChange,
  onExportPNG,
  onExportSVG,
  isOpen,
  onClose,
  previewImage,
}) {
  const [activeTab, setActiveTab] = useState("options");

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1a1d29",
          borderRadius: 16,
          padding: 0,
          width: "95%",
          maxWidth: 900,
          maxHeight: "90vh",
          overflow: "hidden",
          border: "1px solid #374151",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid #374151",
          }}
        >
          <h3 style={{ color: "#fff", margin: 0 }}>🖼️ Exportar Layout</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#9ca3af",
              fontSize: "1.5em",
              cursor: "pointer",
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #374151",
          }}
        >
          {[
            { key: "options", label: "⚙️ Opções" },
            { key: "preview", label: "👁️ Preview" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "12px 24px",
                border: "none",
                background: activeTab === tab.key ? "#23283a" : "transparent",
                color: activeTab === tab.key ? "#fff" : "#9ca3af",
                cursor: "pointer",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: 24, maxHeight: "60vh", overflowY: "auto" }}>
          {activeTab === "options" && (
            <div>
              {/* Configurações de Exportação */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  marginBottom: 24,
                }}
              >
                {/* Coluna 1 */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <h4 style={{ color: "#fff", margin: "0 0 12px 0" }}>
                    🎨 Aparência
                  </h4>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={exportConfig.showSubdivisions}
                      onChange={(e) =>
                        onExportConfigChange({
                          ...exportConfig,
                          showSubdivisions: e.target.checked,
                        })
                      }
                      style={{
                        accentColor: "#3b82f6",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span>🔲 Mostrar subdivisões de pixel</span>
                  </label>

                  {exportConfig.showSubdivisions && (
                    <div style={{ marginLeft: 28 }}>
                      <label
                        style={{
                          color: "#b6c1e0",
                          display: "block",
                          marginBottom: 6,
                          fontSize: "0.9em",
                        }}
                      >
                        Grid de Subdivisões:
                      </label>
                      <select
                        value={exportConfig.subdivisionGrid}
                        onChange={(e) =>
                          onExportConfigChange({
                            ...exportConfig,
                            subdivisionGrid: parseInt(e.target.value),
                          })
                        }
                        style={{
                          width: "100%",
                          padding: 8,
                          borderRadius: 6,
                          border: "1px solid #374151",
                          background: "#23283a",
                          color: "#fff",
                        }}
                      >
                        <option value={4}>4×4</option>
                        <option value={8}>8×8</option>
                        <option value={12}>12×12</option>
                        <option value={16}>16×16</option>
                        <option value={20}>20×20</option>
                        <option value={24}>24×24</option>
                        <option value={32}>32×32</option>
                      </select>
                    </div>
                  )}

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={exportConfig.showDimensions}
                      onChange={(e) =>
                        onExportConfigChange({
                          ...exportConfig,
                          showDimensions: e.target.checked,
                        })
                      }
                      style={{
                        accentColor: "#3b82f6",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span>📏 Mostrar dimensões físicas</span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={exportConfig.includeBackground}
                      onChange={(e) =>
                        onExportConfigChange({
                          ...exportConfig,
                          includeBackground: e.target.checked,
                        })
                      }
                      style={{
                        accentColor: "#3b82f6",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span>🌈 Incluir fundo gradiente + grid</span>
                  </label>
                </div>

                {/* Coluna 2 */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <h4 style={{ color: "#fff", margin: "0 0 12px 0" }}>
                    ⚡ Qualidade
                  </h4>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={exportConfig.highQuality}
                      onChange={(e) =>
                        onExportConfigChange({
                          ...exportConfig,
                          highQuality: e.target.checked,
                        })
                      }
                      style={{
                        accentColor: "#3b82f6",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span>✨ Fonte e qualidade alta</span>
                  </label>

                  <div>
                    <label
                      style={{
                        color: "#b6c1e0",
                        display: "block",
                        marginBottom: 8,
                        fontSize: "0.9em",
                      }}
                    >
                      Escala de Exportação: {exportConfig.exportScale}x
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.5"
                      value={exportConfig.exportScale}
                      onChange={(e) =>
                        onExportConfigChange({
                          ...exportConfig,
                          exportScale: parseFloat(e.target.value),
                        })
                      }
                      style={{
                        width: "100%",
                        accentColor: "#3b82f6",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.8em",
                        color: "#9ca3af",
                        marginTop: 4,
                      }}
                    >
                      <span>1x (Rápido)</span>
                      <span>4x (Ultra HD)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumo das Configurações */}
              <div
                style={{
                  background: "#23283a",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <h4 style={{ color: "#fff", marginBottom: 12 }}>
                  📋 Resumo da Exportação
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 8,
                    fontSize: "0.9em",
                    color: "#b6c1e0",
                  }}
                >
                  <div>🖼️ Painéis: {layoutConfig.paineis.length}</div>
                  <div>
                    📐 Canvas: {layoutConfig.canvasSize.width}×
                    {layoutConfig.canvasSize.height}px
                  </div>
                  <div>🔍 Escala: {exportConfig.exportScale}x</div>
                  <div>
                    📏 Dimensões: {exportConfig.showDimensions ? "Sim" : "Não"}
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={onExportPNG}
                  disabled={layoutConfig.paineis.length === 0}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 8,
                    border: "none",
                    background:
                      layoutConfig.paineis.length > 0 ? "#10b981" : "#374151",
                    color: "#fff",
                    cursor:
                      layoutConfig.paineis.length > 0
                        ? "pointer"
                        : "not-allowed",
                    fontWeight: 600,
                    fontSize: "1em",
                  }}
                >
                  📥 Exportar PNG
                </button>

                <button
                  onClick={onExportSVG}
                  disabled={layoutConfig.paineis.length === 0}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 8,
                    border: "none",
                    background:
                      layoutConfig.paineis.length > 0 ? "#3b82f6" : "#374151",
                    color: "#fff",
                    cursor:
                      layoutConfig.paineis.length > 0
                        ? "pointer"
                        : "not-allowed",
                    fontWeight: 600,
                    fontSize: "1em",
                  }}
                >
                  📄 Exportar SVG
                </button>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div style={{ textAlign: "center" }}>
              {previewImage ? (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <img
                      src={previewImage}
                      alt="Preview do Layout"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        border: "1px solid #374151",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <p style={{ color: "#b6c1e0", fontSize: "0.9em" }}>
                    Preview do layout com as configurações selecionadas
                  </p>
                </div>
              ) : (
                <div style={{ padding: 60, color: "#9ca3af" }}>
                  <div style={{ fontSize: "3em", marginBottom: 16 }}>🖼️</div>
                  <h4 style={{ color: "#fff", marginBottom: 8 }}>
                    Preview Não Disponível
                  </h4>
                  <p>
                    Configure as opções de exportação e gere um preview primeiro
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

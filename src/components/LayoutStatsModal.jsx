import { useState } from "react";

export default function LayoutStatsModal({
  layoutConfig,
  selectedPanel,
  isOpen,
  onClose,
  calculateBoundingBox,
}) {
  const [activeTab, setActiveTab] = useState("general");

  if (!isOpen) return null;

  const boundingBox = calculateBoundingBox();
  const totalPixels = layoutConfig.paineis.reduce(
    (sum, panel) => sum + panel.pixelsWidth * panel.pixelsHeight,
    0
  );

  const physicalArea = layoutConfig.paineis.reduce(
    (sum, panel) => sum + panel.physicalWidth * panel.physicalHeight,
    0
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
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
          width: "90%",
          maxWidth: 700,
          maxHeight: "80vh",
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
          <h3 style={{ color: "#fff", margin: 0 }}>📊 Informações do Layout</h3>
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
            { key: "general", label: "📊 Geral" },
            { key: "panels", label: "📦 Painéis" },
            {
              key: "selected",
              label: "🎯 Selecionado",
              disabled: !selectedPanel,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => !tab.disabled && setActiveTab(tab.key)}
              disabled={tab.disabled}
              style={{
                padding: "12px 20px",
                border: "none",
                background: activeTab === tab.key ? "#23283a" : "transparent",
                color: tab.disabled
                  ? "#4b5563"
                  : activeTab === tab.key
                  ? "#fff"
                  : "#9ca3af",
                cursor: tab.disabled ? "not-allowed" : "pointer",
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
          {activeTab === "general" && (
            <div>
              {/* Estatísticas Gerais */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    background: "#23283a",
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2em", marginBottom: 8 }}>🎨</div>
                  <div
                    style={{
                      fontSize: "1.8em",
                      fontWeight: "bold",
                      color: "#10b981",
                    }}
                  >
                    {layoutConfig.paineis.length}
                  </div>
                  <div style={{ color: "#b6c1e0", fontSize: "0.9em" }}>
                    Painéis no Canvas
                  </div>
                </div>

                <div
                  style={{
                    background: "#23283a",
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2em", marginBottom: 8 }}>📐</div>
                  <div
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "#3b82f6",
                    }}
                  >
                    {boundingBox.width}×{boundingBox.height}
                  </div>
                  <div style={{ color: "#b6c1e0", fontSize: "0.9em" }}>
                    Resolução Final (px)
                  </div>
                </div>

                <div
                  style={{
                    background: "#23283a",
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2em", marginBottom: 8 }}>🔢</div>
                  <div
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "#f59e0b",
                    }}
                  >
                    {totalPixels.toLocaleString()}
                  </div>
                  <div style={{ color: "#b6c1e0", fontSize: "0.9em" }}>
                    Total de Pixels
                  </div>
                </div>

                <div
                  style={{
                    background: "#23283a",
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2em", marginBottom: 8 }}>📏</div>
                  <div
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "#ec4899",
                    }}
                  >
                    {physicalArea.toFixed(1)}m²
                  </div>
                  <div style={{ color: "#b6c1e0", fontSize: "0.9em" }}>
                    Área Física Total
                  </div>
                </div>
              </div>

              {/* Canvas Info */}
              <div
                style={{
                  background: "#23283a",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h4 style={{ color: "#fff", marginBottom: 12 }}>
                  🖼️ Canvas Virtual
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    fontSize: "0.9em",
                    color: "#b6c1e0",
                  }}
                >
                  <div>Largura: {layoutConfig.canvasSize.width}px</div>
                  <div>Altura: {layoutConfig.canvasSize.height}px</div>
                  <div>Zoom: {(layoutConfig.zoom * 100).toFixed(0)}%</div>
                  <div>
                    Grid Snap: {layoutConfig.gridSnap ? "Ativo" : "Inativo"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "panels" && (
            <div>
              <div
                style={{
                  maxHeight: "50vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {layoutConfig.paineis.map((panel, index) => (
                  <div
                    key={panel.id}
                    style={{
                      background: "#23283a",
                      borderRadius: 8,
                      padding: 16,
                      border:
                        selectedPanel?.id === panel.id
                          ? "2px solid #3b82f6"
                          : "1px solid #374151",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#fff",
                          fontSize: "1em",
                        }}
                      >
                        {panel.nome}
                      </div>
                      <div
                        style={{
                          background: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                        }}
                      ></div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        fontSize: "0.85em",
                        color: "#b6c1e0",
                      }}
                    >
                      <div>
                        📍 Posição: {panel.x}, {panel.y}
                      </div>
                      <div>
                        📐 Pixels: {panel.pixelsWidth}×{panel.pixelsHeight}
                      </div>
                      <div>
                        📏 Físico: {panel.physicalWidth}×{panel.physicalHeight}m
                      </div>
                      <div>
                        🔢 Total:{" "}
                        {(
                          panel.pixelsWidth * panel.pixelsHeight
                        ).toLocaleString()}{" "}
                        px
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {layoutConfig.paineis.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "#9ca3af",
                  }}
                >
                  <div style={{ fontSize: "2em", marginBottom: 12 }}>📦</div>
                  <p>Nenhum painel adicionado ao canvas</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "selected" && selectedPanel && (
            <div>
              <div
                style={{
                  background: "#23283a",
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <h4 style={{ color: "#fff", marginBottom: 16 }}>
                  🎯 {selectedPanel.nome}
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#b6c1e0",
                        fontSize: "0.9em",
                        marginBottom: 4,
                      }}
                    >
                      Posição no Canvas:
                    </div>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "1.1em",
                        fontWeight: 500,
                      }}
                    >
                      📍 {selectedPanel.x}, {selectedPanel.y}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#b6c1e0",
                        fontSize: "0.9em",
                        marginBottom: 4,
                      }}
                    >
                      Tamanho Visual:
                    </div>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "1.1em",
                        fontWeight: 500,
                      }}
                    >
                      📺 {selectedPanel.width}×{selectedPanel.height}px
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#b6c1e0",
                        fontSize: "0.9em",
                        marginBottom: 4,
                      }}
                    >
                      Resolução Real:
                    </div>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "1.1em",
                        fontWeight: 500,
                      }}
                    >
                      📐 {selectedPanel.pixelsWidth}×
                      {selectedPanel.pixelsHeight}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#b6c1e0",
                        fontSize: "0.9em",
                        marginBottom: 4,
                      }}
                    >
                      Dimensões Físicas:
                    </div>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "1.1em",
                        fontWeight: 500,
                      }}
                    >
                      📏 {selectedPanel.physicalWidth}×
                      {selectedPanel.physicalHeight}m
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "#1a1d29",
                    borderRadius: 6,
                    padding: 12,
                    fontSize: "0.9em",
                    color: "#b6c1e0",
                  }}
                >
                  <strong>Estatísticas:</strong>
                  <br />
                  🔢 Total de Pixels:{" "}
                  {(
                    selectedPanel.pixelsWidth * selectedPanel.pixelsHeight
                  ).toLocaleString()}
                  <br />
                  📏 Área Física:{" "}
                  {(
                    selectedPanel.physicalWidth * selectedPanel.physicalHeight
                  ).toFixed(2)}
                  m²
                  <br />
                  📊 Densidade:{" "}
                  {Math.round(
                    (selectedPanel.pixelsWidth * selectedPanel.pixelsHeight) /
                      (selectedPanel.physicalWidth *
                        selectedPanel.physicalHeight)
                  )}{" "}
                  px/m²
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

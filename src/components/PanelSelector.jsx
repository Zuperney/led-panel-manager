import { useState } from "react";

export default function PanelSelector({
  availablePanels,
  layoutConfig,
  onAddPanel,
  isOpen,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredPanels = availablePanels.filter((panel) =>
    panel.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isInCanvas = (panel) => {
    return layoutConfig.paineis.some((p) => p.painelRef === panel.nome);
  };

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
          padding: 24,
          width: "90%",
          maxWidth: 800,
          maxHeight: "80vh",
          overflow: "hidden",
          border: "1px solid #374151",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3 style={{ color: "#fff", margin: 0 }}>📦 Selecionar Painéis</h3>
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

        {/* Busca */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="🔍 Buscar painel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #374151",
              background: "#23283a",
              color: "#fff",
              fontSize: "1em",
            }}
          />
        </div>

        {/* Lista de Painéis */}
        <div
          style={{
            maxHeight: "50vh",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 12,
          }}
        >
          {filteredPanels.map((panel) => {
            const panelInCanvas = isInCanvas(panel);

            return (
              <div
                key={panel.nome}
                style={{
                  background: panelInCanvas ? "#1f2937" : "#23283a",
                  border: panelInCanvas
                    ? "1px solid #10b981"
                    : "1px solid #374151",
                  borderRadius: 8,
                  padding: 16,
                  opacity: panelInCanvas ? 0.7 : 1,
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

                  {!panelInCanvas ? (
                    <button
                      onClick={() => {
                        onAddPanel(panel);
                        onClose();
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: "#10b981",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "0.9em",
                        fontWeight: 500,
                      }}
                    >
                      ➕ Adicionar
                    </button>
                  ) : (
                    <span
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        background: "#374151",
                        color: "#9ca3af",
                        fontSize: "0.9em",
                      }}
                    >
                      ✓ No Canvas
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "0.85em",
                    color: "#b6c1e0",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    lineHeight: 1.4,
                  }}
                >
                  <div>
                    📐 {panel.pixelsLargura}×{panel.pixelsAltura}
                  </div>
                  <div>
                    📏 {panel.largura.toFixed(2)}×{panel.altura.toFixed(2)}m
                  </div>
                  <div>📦 {panel.gabinete}</div>
                  <div>
                    🔢{" "}
                    {(
                      panel.pixelsLargura * panel.pixelsAltura
                    ).toLocaleString()}{" "}
                    px
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPanels.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#9ca3af",
            }}
          >
            <div style={{ fontSize: "2em", marginBottom: 12 }}>🔍</div>
            <p>Nenhum painel encontrado com "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

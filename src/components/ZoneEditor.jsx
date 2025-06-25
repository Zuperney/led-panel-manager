import { useState } from "react";

export default function ZoneEditor({
  zonas,
  selectedZone,
  onZoneSelect,
  onZoneUpdate,
  onZoneDelete,
  onZoneAdd,
  universos = [],
}) {
  const [editingZone, setEditingZone] = useState(null);

  const adicionarZonaDefault = () => {
    const novaZona = {
      id: Date.now(),
      nome: `Zona ${zonas.length + 1}`,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      universeStart: 1,
      pixelStart: 0,
    };

    if (onZoneAdd) {
      onZoneAdd(novaZona);
    }
  };

  const handleZoneChange = (zoneId, field, value) => {
    const zona = zonas.find((z) => z.id === zoneId);
    if (!zona) return;

    const updatedZone = {
      ...zona,
      [field]: field === "nome" ? value : parseInt(value) || 0,
    };

    onZoneUpdate(updatedZone);

    if (selectedZone?.id === zoneId) {
      onZoneSelect(updatedZone);
    }
  };

  const handleDeleteZone = (zoneId) => {
    if (window.confirm("Tem certeza que deseja excluir esta zona?")) {
      onZoneDelete(zoneId);
      if (selectedZone?.id === zoneId) {
        onZoneSelect(null);
      }
    }
  };

  const duplicateZone = (zona) => {
    const newZone = {
      ...zona,
      id: Date.now(),
      nome: `${zona.nome} (Cópia)`,
      x: Math.min(zona.x + 10, zona.x), // Offset slightly
      y: Math.min(zona.y + 10, zona.y),
    };
    onZoneAdd(newZone);
  };

  const getZonePixelCount = (zona) => {
    return zona.width * zona.height;
  };

  const getZoneUniverse = (zona) => {
    // Calcular qual universo esta zona está usando baseado no pixel inicial
    const startPixel = zona.pixelStart || zona.y * 1000 + zona.x; // Aproximação
    const universe = universos.find(
      (u) => startPixel >= u.startPixel && startPixel <= u.endPixel
    );
    return universe ? universe.universe : "N/A";
  };

  return (
    <div
      style={{
        background: "#23283a",
        borderRadius: 12,
        padding: 16,
        height: "fit-content",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h4 style={{ color: "#fff", margin: 0 }}>🔲 Gerenciar Zonas</h4>
        <button
          onClick={() => (onZoneAdd ? onZoneAdd() : adicionarZonaDefault())}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: "#10b981",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.85em",
            fontWeight: 500,
          }}
        >
          ➕ Nova Zona
        </button>
      </div>

      {zonas.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 20,
            color: "#9ca3af",
            fontSize: "0.9em",
          }}
        >
          Nenhuma zona criada.
          <br />
          Clique em "Nova Zona" ou dê duplo clique no grid.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {zonas.map((zona, index) => (
            <div
              key={zona.id}
              style={{
                background:
                  selectedZone?.id === zona.id ? "#1f2937" : "#1a1d29",
                border:
                  selectedZone?.id === zona.id
                    ? "2px solid #3b82f6"
                    : "1px solid #374151",
                borderRadius: 8,
                padding: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => onZoneSelect(zona)}
            >
              {/* Cabeçalho da zona */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "#fff",
                    fontSize: "0.95em",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: [
                        "#ef4444",
                        "#f59e0b",
                        "#10b981",
                        "#3b82f6",
                        "#8b5cf6",
                        "#ec4899",
                      ][index % 6],
                    }}
                  />
                  {editingZone === zona.id ? (
                    <input
                      type="text"
                      value={zona.nome}
                      onChange={(e) =>
                        handleZoneChange(zona.id, "nome", e.target.value)
                      }
                      onBlur={() => setEditingZone(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingZone(null)
                      }
                      autoFocus
                      style={{
                        background: "transparent",
                        border: "1px solid #3b82f6",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: "0.9em",
                        width: "100px",
                      }}
                    />
                  ) : (
                    <span onDoubleClick={() => setEditingZone(zona.id)}>
                      {zona.nome}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateZone(zona);
                    }}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: "none",
                      background: "#374151",
                      color: "#9ca3af",
                      cursor: "pointer",
                      fontSize: "0.75em",
                    }}
                    title="Duplicar zona"
                  >
                    📋
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteZone(zona.id);
                    }}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: "none",
                      background: "#dc2626",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.75em",
                    }}
                    title="Excluir zona"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Informações da zona */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  fontSize: "0.8em",
                  color: "#b6c1e0",
                }}
              >
                <div>
                  Posição: {zona.x}, {zona.y}
                </div>
                <div>
                  Tamanho: {zona.width}×{zona.height}
                </div>
                <div>Pixels: {getZonePixelCount(zona).toLocaleString()}</div>
                <div>Universo: {getZoneUniverse(zona)}</div>
              </div>

              {/* Controles de edição detalhada (para zona selecionada) */}
              {selectedZone?.id === zona.id && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #374151",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.75em",
                        display: "block",
                      }}
                    >
                      X:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={zona.x}
                      onChange={(e) =>
                        handleZoneChange(zona.id, "x", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #374151",
                        background: "#111827",
                        color: "#fff",
                        fontSize: "0.8em",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.75em",
                        display: "block",
                      }}
                    >
                      Y:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={zona.y}
                      onChange={(e) =>
                        handleZoneChange(zona.id, "y", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #374151",
                        background: "#111827",
                        color: "#fff",
                        fontSize: "0.8em",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.75em",
                        display: "block",
                      }}
                    >
                      Largura:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={zona.width}
                      onChange={(e) =>
                        handleZoneChange(zona.id, "width", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #374151",
                        background: "#111827",
                        color: "#fff",
                        fontSize: "0.8em",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.75em",
                        display: "block",
                      }}
                    >
                      Altura:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={zona.height}
                      onChange={(e) =>
                        handleZoneChange(zona.id, "height", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #374151",
                        background: "#111827",
                        color: "#fff",
                        fontSize: "0.8em",
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.75em",
                        display: "block",
                      }}
                    >
                      Pixel Inicial:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={zona.pixelStart || 0}
                      onChange={(e) =>
                        handleZoneChange(zona.id, "pixelStart", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #374151",
                        background: "#111827",
                        color: "#fff",
                        fontSize: "0.8em",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resumo das zonas */}
      {zonas.length > 0 && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid #374151",
            fontSize: "0.8em",
            color: "#9ca3af",
          }}
        >
          <strong>Resumo:</strong>
          <br />
          Total de zonas: {zonas.length}
          <br />
          Total de pixels mapeados:{" "}
          {zonas
            .reduce((sum, zona) => sum + getZonePixelCount(zona), 0)
            .toLocaleString()}
        </div>
      )}
    </div>
  );
}

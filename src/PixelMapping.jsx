import { useEffect, useState } from "react";
import { useProjeto } from "./contextProjeto";
import { useApiData, useLocalStorage, useTemporaryFeedback } from "./hooks";
import FeedbackMessage from "./components/FeedbackMessage";
import PanelLayoutEditor from "./components/PanelLayoutEditor";
import PanelSelector from "./components/PanelSelector";
import ExportModal from "./components/ExportModal";
import LayoutStatsModal from "./components/LayoutStatsModal";

export default function PixelMapping({ isActive }) {
  const { state } = useProjeto();
  const { data: paineis } = useApiData("paineis", isActive);

  // Hook de feedback
  const [feedback, showFeedback] = useTemporaryFeedback();

  // Estados locais
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "panelLayoutProjectId",
    ""
  );
  const [layoutConfig, setLayoutConfig] = useState({
    paineis: [], // Array de painéis posicionados no canvas
    canvasSize: { width: 1920, height: 1080 }, // Tamanho do canvas em pixels
    zoom: 1,
    gridSnap: true,
  });
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [activeTab, setActiveTab] = useState("visual"); // "visual", "settings", "resolume"

  // Estados dos modais
  const [showPanelSelector, setShowPanelSelector] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Configurações de exportação
  const [exportConfig, setExportConfig] = useState({
    showSubdivisions: true,
    showDimensions: true,
    highQuality: true,
    includeBackground: true,
    exportScale: 2,
    subdivisionGrid: 16,
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Calcular bounding box dos painéis posicionados
  const calculateBoundingBox = () => {
    if (layoutConfig.paineis.length === 0) {
      return { width: 0, height: 0, minX: 0, minY: 0 };
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    layoutConfig.paineis.forEach((panel) => {
      const baseScale = 0.2;
      const realX = panel.x / baseScale;
      const realY = panel.y / baseScale;

      minX = Math.min(minX, realX);
      minY = Math.min(minY, realY);
      maxX = Math.max(maxX, realX + panel.pixelsWidth);
      maxY = Math.max(maxY, realY + panel.pixelsHeight);
    });

    return {
      width: Math.ceil(maxX - minX),
      height: Math.ceil(maxY - minY),
      minX: Math.floor(minX),
      minY: Math.floor(minY),
    };
  };

  // Adicionar painel ao canvas (usado pelos modais)
  const addPanelToCanvas = (panel) => {
    const baseScale = 0.2;
    const visualWidth = panel.pixelsLargura * baseScale;
    const visualHeight = panel.pixelsAltura * baseScale;

    let x = 50,
      y = 50;
    const step = Math.max(visualWidth, visualHeight) + 20;

    while (
      layoutConfig.paineis.some(
        (p) => Math.abs(p.x - x) < step && Math.abs(p.y - y) < step
      )
    ) {
      x += step;
      if (x > layoutConfig.canvasSize.width - visualWidth) {
        x = 50;
        y += step;
      }
    }

    const newPanelInCanvas = {
      id: `${panel.nome}_${Date.now()}`,
      painelRef: panel.nome,
      nome: panel.nome,
      x: x,
      y: y,
      width: visualWidth,
      height: visualHeight,
      pixelsWidth: panel.pixelsLargura,
      pixelsHeight: panel.pixelsAltura,
      physicalWidth: panel.largura,
      physicalHeight: panel.altura,
      rotation: 0,
    };

    setLayoutConfig({
      ...layoutConfig,
      paineis: [...layoutConfig.paineis, newPanelInCanvas],
    });

    showFeedback(`Painel "${panel.nome}" adicionado ao canvas!`);
  };

  // Painéis filtrados pelo projeto
  const paineisFiltrados = selectedProjectId
    ? paineis.filter((p) => p.projeto === selectedProjectId)
    : [];

  // Exportar PNG/SVG usando o PanelLayoutEditor
  const handleExportPNG = () => {
    // Esta função será implementada no PanelLayoutEditor
    showFeedback("Exportando PNG...");
  };

  const handleExportSVG = () => {
    // Esta função será implementada no PanelLayoutEditor
    showFeedback("Exportando SVG...");
  };

  // Carregar configuração salva quando mudar projeto
  useEffect(() => {
    if (selectedProjectId) {
      const savedConfig = localStorage.getItem(
        `panelLayout_${selectedProjectId}`
      );
      if (savedConfig) {
        try {
          setLayoutConfig(JSON.parse(savedConfig));
        } catch (error) {
          console.error("Erro ao carregar layout:", error);
        }
      } else {
        // Configuração padrão
        setLayoutConfig({
          paineis: [],
          canvasSize: { width: 1920, height: 1080 },
          zoom: 1,
          gridSnap: true,
        });
      }
    }
  }, [selectedProjectId]);

  // Salvar configuração
  const salvarLayout = () => {
    if (selectedProjectId) {
      const key = `panelLayout_${selectedProjectId}`;
      localStorage.setItem(key, JSON.stringify(layoutConfig));
      showFeedback("Layout de painéis salvo com sucesso!");
    }
  };

  // Exportar configuração JSON
  const exportarLayout = () => {
    if (!selectedProjectId) return;

    const exportData = {
      projeto: selectedProjectId,
      layout: layoutConfig,
      paineis_info: paineisFiltrados.map((p) => ({
        nome: p.nome,
        largura: p.largura,
        altura: p.altura,
        pixelsLargura: p.pixelsLargura,
        pixelsAltura: p.pixelsAltura,
        gabinete: p.gabinete,
      })),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PanelLayout_${selectedProjectId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showFeedback("Layout exportado com sucesso!");
  };

  // Importar configuração
  const importarLayout = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        if (importData.layout) {
          setLayoutConfig(importData.layout);
          showFeedback("Layout importado com sucesso!");
        }
      } catch (error) {
        showFeedback("Erro ao importar layout!");
        console.error("Erro na importação:", error);
      }
    };
    reader.readAsText(file);

    // Limpar o input
    event.target.value = "";
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 24, flexShrink: 0 }}>
        🎨 Layout de Painéis
      </h2>

      <FeedbackMessage message={feedback} type="success" />

      {/* Seleção de Projeto */}
      <div
        style={{
          background: "#23283a",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        <label style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}>
          Projeto:
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            setSelectedPanel(null);
          }}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #3a4161",
            background: "#1a1d29",
            color: "#fff",
            fontSize: "1em",
          }}
        >
          <option value="">Selecione o Projeto</option>
          {state.projetos.map((p, i) => (
            <option key={i} value={p.nome}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      {selectedProjectId ? (
        <>
          {/* Navegação por Abas */}
          <div
            style={{
              marginBottom: 24,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                borderBottom: "2px solid #3a4161",
                marginBottom: 16,
                flexShrink: 0,
              }}
            >
              {[
                { key: "visual", label: "Editor Visual", icon: "🎨" },
                { key: "settings", label: "Configurações", icon: "⚙️" },
                { key: "resolume", label: "Resolume Arena", icon: "🎮" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "8px 8px 0 0",
                    border: "none",
                    background: activeTab === tab.key ? "#3b82f6" : "#2a2d3a",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: activeTab === tab.key ? 600 : 400,
                    borderBottom:
                      activeTab === tab.key
                        ? "2px solid #3b82f6"
                        : "2px solid transparent",
                    marginBottom: "-2px",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Conteúdo das Abas */}
            {activeTab === "visual" && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Barra de Ferramentas Limpa */}
                <div
                  style={{
                    background: "#23283a",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => setShowPanelSelector(true)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#10b981",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    📦 Adicionar Painéis
                  </button>

                  <button
                    onClick={() => setShowStatsModal(true)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#3b82f6",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    � Informações
                  </button>

                  <button
                    onClick={() => setShowExportModal(true)}
                    disabled={layoutConfig.paineis.length === 0}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background:
                        layoutConfig.paineis.length > 0 ? "#f59e0b" : "#4b5563",
                      color: "#fff",
                      cursor:
                        layoutConfig.paineis.length > 0
                          ? "pointer"
                          : "not-allowed",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    �️ Exportar
                  </button>

                  <button
                    onClick={salvarLayout}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#8b5cf6",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    💾 Salvar
                  </button>

                  <label
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      background: "#ec4899",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    📥 Importar
                    <input
                      type="file"
                      accept=".json"
                      onChange={importarLayout}
                      style={{ display: "none" }}
                    />
                  </label>

                  {/* Resumo Rápido + Controles */}
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: "0.9em",
                      color: "#b6c1e0",
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <span>🎨 {layoutConfig.paineis.length} painéis</span>
                    <span>
                      📐 {layoutConfig.canvasSize.width}×
                      {layoutConfig.canvasSize.height}px
                    </span>

                    {/* Controles de Grid e Zoom */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={layoutConfig.gridSnap}
                        onChange={(e) =>
                          setLayoutConfig((prev) => ({
                            ...prev,
                            gridSnap: e.target.checked,
                          }))
                        }
                        style={{ accentColor: "#3b82f6" }}
                      />
                      <span>Grid</span>
                    </label>

                    <select
                      value={layoutConfig.zoom}
                      onChange={(e) =>
                        setLayoutConfig((prev) => ({
                          ...prev,
                          zoom: parseFloat(e.target.value),
                        }))
                      }
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        border: "1px solid #3a4161",
                        background: "#1a1d29",
                        color: "#fff",
                        fontSize: "0.85em",
                      }}
                    >
                      <option value={0.25}>25%</option>
                      <option value={0.5}>50%</option>
                      <option value={0.75}>75%</option>
                      <option value={1}>100%</option>
                      <option value={1.25}>125%</option>
                      <option value={1.5}>150%</option>
                      <option value={2}>200%</option>
                    </select>
                  </div>
                </div>

                {/* Editor de Layout */}
                <div
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    maxHeight: "calc(100vh - 300px)", // Limitar altura máxima
                    minHeight: "400px", // Altura mínima
                  }}
                >
                  <PanelLayoutEditor
                    availablePanels={paineisFiltrados}
                    layoutConfig={layoutConfig}
                    onLayoutUpdate={setLayoutConfig}
                    selectedPanel={selectedPanel}
                    onPanelSelect={setSelectedPanel}
                    onFeedback={showFeedback}
                  />
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div
                style={{
                  background: "#23283a",
                  borderRadius: 12,
                  padding: 20,
                  flex: 1,
                  overflow: "auto",
                }}
              >
                <h4 style={{ color: "#fff", marginBottom: 20 }}>
                  ⚙️ Configurações do Canvas
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: 24,
                  }}
                >
                  {/* Configurações de Canvas */}
                  <div>
                    <h5 style={{ color: "#fff", marginBottom: 16 }}>
                      📐 Dimensões do Canvas
                    </h5>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <label
                          style={{
                            color: "#b6c1e0",
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Largura (px):
                        </label>
                        <input
                          type="number"
                          min="800"
                          max="7680"
                          step="100"
                          value={layoutConfig.canvasSize.width}
                          onChange={(e) =>
                            setLayoutConfig((prev) => ({
                              ...prev,
                              canvasSize: {
                                ...prev.canvasSize,
                                width: parseInt(e.target.value) || 1920,
                              },
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: 10,
                            borderRadius: 6,
                            border: "1px solid #3a4161",
                            background: "#1a1d29",
                            color: "#fff",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            color: "#b6c1e0",
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Altura (px):
                        </label>
                        <input
                          type="number"
                          min="600"
                          max="4320"
                          step="100"
                          value={layoutConfig.canvasSize.height}
                          onChange={(e) =>
                            setLayoutConfig((prev) => ({
                              ...prev,
                              canvasSize: {
                                ...prev.canvasSize,
                                height: parseInt(e.target.value) || 1080,
                              },
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: 10,
                            borderRadius: 6,
                            border: "1px solid #3a4161",
                            background: "#1a1d29",
                            color: "#fff",
                          }}
                        />
                      </div>
                    </div>

                    {/* Presets de Resolução */}
                    <div>
                      <label
                        style={{
                          color: "#b6c1e0",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Presets de Resolução:
                      </label>
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        {[
                          { name: "HD", width: 1280, height: 720 },
                          { name: "Full HD", width: 1920, height: 1080 },
                          { name: "2K", width: 2560, height: 1440 },
                          { name: "4K", width: 3840, height: 2160 },
                          { name: "8K", width: 7680, height: 4320 },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() =>
                              setLayoutConfig((prev) => ({
                                ...prev,
                                canvasSize: {
                                  width: preset.width,
                                  height: preset.height,
                                },
                              }))
                            }
                            style={{
                              padding: "8px 12px",
                              borderRadius: 6,
                              border: "none",
                              background:
                                layoutConfig.canvasSize.width ===
                                  preset.width &&
                                layoutConfig.canvasSize.height === preset.height
                                  ? "#3b82f6"
                                  : "#2a2d3a",
                              color: "#fff",
                              cursor: "pointer",
                              fontSize: "0.85em",
                              textAlign: "center",
                            }}
                          >
                            {preset.name}
                            <br />
                            <small>
                              {preset.width}×{preset.height}
                            </small>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Configurações de Grid */}
                  <div>
                    <h5 style={{ color: "#fff", marginBottom: 16 }}>
                      🔲 Configurações de Grid
                    </h5>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#e2e8f0",
                        cursor: "pointer",
                        marginBottom: 16,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={layoutConfig.gridSnap}
                        onChange={(e) =>
                          setLayoutConfig((prev) => ({
                            ...prev,
                            gridSnap: e.target.checked,
                          }))
                        }
                        style={{
                          accentColor: "#3b82f6",
                          transform: "scale(1.2)",
                        }}
                      />
                      <span>Snap ao Grid</span>
                    </label>

                    <div>
                      <label
                        style={{
                          color: "#b6c1e0",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Zoom: {Math.round(layoutConfig.zoom * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.25"
                        max="3"
                        step="0.25"
                        value={layoutConfig.zoom}
                        onChange={(e) =>
                          setLayoutConfig((prev) => ({
                            ...prev,
                            zoom: parseFloat(e.target.value),
                          }))
                        }
                        style={{ width: "100%", accentColor: "#3b82f6" }}
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
                        <span>25%</span>
                        <span>300%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controles de Layout */}
                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    background: "#1e2328",
                    borderRadius: 8,
                  }}
                >
                  <h5 style={{ color: "#fff", marginBottom: 16 }}>
                    🎮 Controles de Layout
                  </h5>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 16,
                      alignItems: "start",
                    }}
                  >
                    {/* Grid Snap */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#b6c1e0",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={layoutConfig.gridSnap}
                        onChange={(e) =>
                          setLayoutConfig((prev) => ({
                            ...prev,
                            gridSnap: e.target.checked,
                          }))
                        }
                        style={{
                          accentColor: "#3b82f6",
                          transform: "scale(1.2)",
                        }}
                      />
                      <span>📐 Grid Snap</span>
                    </label>

                    {/* Confirmar Layout */}
                    <button
                      onClick={() => {
                        if (layoutConfig.paineis.length > 0) {
                          // Calcular bounding box e resolução final
                          let minX = Infinity,
                            minY = Infinity,
                            maxX = -Infinity,
                            maxY = -Infinity;

                          layoutConfig.paineis.forEach((panel) => {
                            const realX = panel.x;
                            const realY = panel.y;
                            minX = Math.min(minX, realX);
                            minY = Math.min(minY, realY);
                            maxX = Math.max(maxX, realX + panel.pixelsWidth);
                            maxY = Math.max(maxY, realY + panel.pixelsHeight);
                          });

                          const finalResolution = {
                            width: Math.ceil(maxX - minX),
                            height: Math.ceil(maxY - minY),
                          };

                          setLayoutConfig((prev) => ({
                            ...prev,
                            finalResolution,
                          }));

                          showFeedback(
                            `✅ Layout confirmado! Resolução final: ${finalResolution.width}×${finalResolution.height}px`
                          );
                        }
                      }}
                      disabled={layoutConfig.paineis.length === 0}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "none",
                        background:
                          layoutConfig.paineis.length === 0
                            ? "#374151"
                            : "#10b981",
                        color: "#fff",
                        cursor:
                          layoutConfig.paineis.length === 0
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "0.9em",
                        fontWeight: "500",
                        opacity: layoutConfig.paineis.length === 0 ? 0.5 : 1,
                      }}
                    >
                      ✅ Confirmar Layout
                    </button>

                    {/* Exportar PNG */}
                    <button
                      onClick={() => {
                        // Implementação da exportação PNG será feita no PanelLayoutEditor
                        showFeedback(
                          "Funcionalidade de exportação será implementada em breve!"
                        );
                      }}
                      disabled={layoutConfig.paineis.length === 0}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "none",
                        background:
                          layoutConfig.paineis.length === 0
                            ? "#374151"
                            : "#3b82f6",
                        color: "#fff",
                        cursor:
                          layoutConfig.paineis.length === 0
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "0.9em",
                        fontWeight: "500",
                        opacity: layoutConfig.paineis.length === 0 ? 0.5 : 1,
                      }}
                    >
                      🖼️ Exportar PNG
                    </button>
                  </div>
                </div>

                {/* Status do Canvas */}
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    background: "#1a1d29",
                    borderRadius: 8,
                    fontSize: "0.85em",
                    color: "#9ca3af",
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <strong>📊 Status:</strong> Canvas{" "}
                    {layoutConfig.canvasSize.width}×
                    {layoutConfig.canvasSize.height}px • Painéis:{" "}
                    {layoutConfig.paineis.length}• Zoom:{" "}
                    {Math.round(layoutConfig.zoom * 100)}%
                    {layoutConfig.finalResolution && (
                      <span style={{ color: "#10b981", fontWeight: "600" }}>
                        {" "}
                        • Resolução Final: {layoutConfig.finalResolution.width}×
                        {layoutConfig.finalResolution.height}px
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.8em", color: "#6b7280" }}>
                    💡 Arraste os painéis para posicioná-los • Clique para
                    selecionar
                    {layoutConfig.paineis.length > 1 &&
                      " • Painéis se alinham automaticamente"}
                  </div>
                </div>

                {/* Informações */}
                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    background: "#1a1d29",
                    borderRadius: 8,
                    fontSize: "0.9em",
                    color: "#b6c1e0",
                  }}
                >
                  <strong>💡 Informações:</strong>
                  <br />
                  • O canvas representa a área total onde os painéis serão
                  posicionados
                  <br />
                  • Use presets de resolução comum ou configure manualmente
                  <br />
                  • Os painéis são dimensionados automaticamente baseados em
                  suas medidas reais
                  <br />• 1 metro = 100 pixels na escala do editor
                </div>
              </div>
            )}

            {activeTab === "resolume" && (
              <div
                style={{
                  background: "#23283a",
                  borderRadius: 12,
                  padding: 20,
                  textAlign: "center",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontSize: "3em", marginBottom: 16 }}>🎮</div>
                <h4 style={{ color: "#fff", marginBottom: 16 }}>
                  Resolume Arena Integration
                </h4>
                <p style={{ color: "#b6c1e0", marginBottom: 24 }}>
                  Funcionalidades de integração com Resolume Arena serão
                  implementadas aqui.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    style={{
                      padding: "12px 24px",
                      borderRadius: 8,
                      border: "none",
                      background: "#4b5563",
                      color: "#9ca3af",
                      cursor: "not-allowed",
                    }}
                  >
                    📤 Exportar para Resolume
                  </button>
                  <button
                    style={{
                      padding: "12px 24px",
                      borderRadius: 8,
                      border: "none",
                      background: "#4b5563",
                      color: "#9ca3af",
                      cursor: "not-allowed",
                    }}
                  >
                    📥 Importar do Resolume
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modais */}
          <PanelSelector
            availablePanels={paineisFiltrados}
            layoutConfig={layoutConfig}
            onAddPanel={addPanelToCanvas}
            isOpen={showPanelSelector}
            onClose={() => setShowPanelSelector(false)}
          />

          <ExportModal
            layoutConfig={layoutConfig}
            exportConfig={exportConfig}
            onExportConfigChange={setExportConfig}
            onExportPNG={handleExportPNG}
            onExportSVG={handleExportSVG}
            previewImage={previewImage}
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
          />

          <LayoutStatsModal
            layoutConfig={layoutConfig}
            selectedPanel={selectedPanel}
            calculateBoundingBox={calculateBoundingBox}
            isOpen={showStatsModal}
            onClose={() => setShowStatsModal(false)}
          />
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#9ca3af",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "3em", marginBottom: 16 }}>🎨</div>
          <h3 style={{ color: "#fff", marginBottom: 8 }}>
            Layout de Painéis Inteligente
          </h3>
          <p>Selecione um projeto para começar a criar layouts profissionais</p>
          <div style={{ fontSize: "0.9em", marginTop: 16, lineHeight: 1.6 }}>
            <strong>Novos recursos:</strong>
            <br />
            🎨 Interface limpa e intuitiva
            <br />
            📦 Seletor de painéis em modal
            <br />
            � Informações detalhadas do layout
            <br />
            🖼️ Exportação avançada com preview
            <br />
            ⚙️ Configurações organizadas por categoria
          </div>
        </div>
      )}
    </div>
  );
}

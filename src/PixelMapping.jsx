import { useEffect, useState } from "react";
import { useProjeto } from "./contextProjeto";
import { useApiData, useLocalStorage, useTemporaryFeedback } from "./hooks";
import FeedbackMessage from "./components/FeedbackMessage";
import PanelLayoutEditor from "./components/PanelLayoutEditor";

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
  const [previewMode, setPreviewMode] = useLocalStorage(
    "panelLayoutPreviewMode",
    "layout"
  );
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [activeTab, setActiveTab] = useState("visual"); // "visual", "panels"

  // Painéis filtrados pelo projeto
  const paineisFiltrados = selectedProjectId
    ? paineis.filter((p) => p.projeto === selectedProjectId)
    : [];

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

  // Exportar configuração
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
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h2 style={{ color: "#fff", marginBottom: 24 }}>� Layout de Painéis</h2>

      <FeedbackMessage message={feedback} type="success" />

      {/* Seleção de Projeto */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
          marginBottom: 24,
          padding: 16,
          background: "#23283a",
          borderRadius: 12,
        }}
      >
        <div>
          <label
            style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}
          >
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
              padding: 8,
              borderRadius: 6,
              border: "1px solid #3a4161",
              background: "#1a1d29",
              color: "#fff",
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
      </div>

      {selectedProjectId ? (
        <>
          {/* Informações do Projeto */}
          <div
            style={{
              background: "#23283a",
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: 12 }}>
              ℹ️ Informações do Projeto
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
                fontSize: "0.9em",
                color: "#b6c1e0",
              }}
            >
              <div>� Projeto: {selectedProjectId}</div>
              <div>� Painéis Disponíveis: {paineisFiltrados.length}</div>
              <div>🎨 Painéis no Canvas: {layoutConfig.paineis.length}</div>
              <div>
                � Canvas: {layoutConfig.canvasSize.width}×
                {layoutConfig.canvasSize.height}px
              </div>
            </div>
          </div>

          {/* Navegação por Abas */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                borderBottom: "2px solid #3a4161",
                marginBottom: 16,
              }}
            >
              {[
                { key: "visual", label: "Editor Visual", icon: "🎨" },
                { key: "panels", label: "Configurar Canvas", icon: "⚙️" },
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
              <div>
                {/* Ações principais */}
                <div
                  style={{
                    background: "#23283a",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <h4 style={{ color: "#fff", marginBottom: 12 }}>💾 Ações</h4>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={salvarLayout}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: "#10b981",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      💾 Salvar Layout
                    </button>

                    <button
                      onClick={exportarLayout}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: "#3b82f6",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      📤 Exportar JSON
                    </button>

                    <label
                      style={{
                        padding: "10px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: "#f59e0b",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 500,
                        textAlign: "center",
                        display: "block",
                      }}
                    >
                      📥 Importar JSON
                      <input
                        type="file"
                        accept=".json"
                        onChange={importarLayout}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                {/* Editor de Layout */}
                <PanelLayoutEditor
                  availablePanels={paineisFiltrados}
                  layoutConfig={layoutConfig}
                  onLayoutUpdate={setLayoutConfig}
                  selectedPanel={selectedPanel}
                  onPanelSelect={setSelectedPanel}
                  onFeedback={showFeedback}
                />
              </div>
            )}

            {activeTab === "panels" && (
              <div
                style={{
                  background: "#23283a",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <h4 style={{ color: "#fff", marginBottom: 16 }}>
                  ⚙️ Configurações do Canvas
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "#b6c1e0",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      Largura do Canvas (px):
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
                        padding: 8,
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
                        marginBottom: 8,
                      }}
                    >
                      Altura do Canvas (px):
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
                        padding: 8,
                        borderRadius: 6,
                        border: "1px solid #3a4161",
                        background: "#1a1d29",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>

                {/* Presets de Resolução */}
                <div style={{ marginTop: 16 }}>
                  <label
                    style={{
                      color: "#b6c1e0",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Presets de Resolução:
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "none",
                          background:
                            layoutConfig.canvasSize.width === preset.width &&
                            layoutConfig.canvasSize.height === preset.height
                              ? "#3b82f6"
                              : "#2a2d3a",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "0.9em",
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

                {/* Informações */}
                <div
                  style={{
                    marginTop: 20,
                    padding: 16,
                    background: "#1a1d29",
                    borderRadius: 8,
                    fontSize: "0.9em",
                    color: "#b6c1e0",
                  }}
                >
                  <strong>💡 Dicas:</strong>
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
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#9ca3af",
          }}
        >
          <div style={{ fontSize: "3em", marginBottom: 16 }}>�</div>
          <h3 style={{ color: "#fff", marginBottom: 8 }}>
            Layout de Painéis Simplificado
          </h3>
          <p>
            Selecione um projeto para começar a arranjar os painéis no canvas
          </p>
          <div style={{ fontSize: "0.9em", marginTop: 16, lineHeight: 1.6 }}>
            <strong>Recursos disponíveis:</strong>
            <br />
            🎨 Editor visual com drag & drop
            <br />
            � Adição de múltiplos painéis do projeto
            <br />
            📐 Canvas configurável com presets de resolução
            <br />
            � Salvamento e exportação de layouts
            <br />� Grid de alinhamento e zoom
          </div>
        </div>
      )}
    </div>
  );
}

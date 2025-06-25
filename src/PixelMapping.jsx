import { useEffect, useState } from "react";
import { useProjeto } from "./contextProjeto";
import { useApiData, useLocalStorage } from "./hooks";
import FeedbackMessage from "./components/FeedbackMessage";
import PixelGridEditor from "./components/PixelGridEditor";
import ZoneEditor from "./components/ZoneEditor";
import UniverseConfig from "./components/UniverseConfig";
import ExportWizard from "./components/ExportWizard";
import { UTILS } from "./config";

export default function PixelMapping({ isActive }) {
  const { state } = useProjeto();
  const { data: paineis } = useApiData("paineis", isActive);
  const { data: gabinetes } = useApiData("gabinetes", isActive);
  
  // Estados locais
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage("pixelMappingProjectId", "");
  const [selectedPainelId, setSelectedPainelId] = useState("");
  const [mappingConfig, setMappingConfig] = useState({
    universos: [],
    zonas: [],
    configuracoes: {
      protocoloSaida: "Art-Net",
      universoInicial: 1,
      enderecoInicial: 1,
      pixelsPerUniverse: 170, // Padrão Art-Net (512 canais / 3 RGB = ~170 pixels)
      rgbOrder: "RGB"
    }
  });
  const [previewMode, setPreviewMode] = useLocalStorage("pixelMappingPreviewMode", "grid");
  const [selectedZone, setSelectedZone] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("visual"); // "visual", "zones", "universes"
  const [showExportWizard, setShowExportWizard] = useState(false);

  // Painéis filtrados pelo projeto
  const paineisFiltrados = selectedProjectId 
    ? paineis.filter(p => p.projeto === selectedProjectId)
    : [];

  // Painel selecionado
  const painelSelecionado = paineisFiltrados.find(p => p.nome === selectedPainelId);

  // Carregar configuração salva quando mudar painel
  useEffect(() => {
    if (painelSelecionado) {
      const savedConfig = localStorage.getItem(`pixelMapping_${selectedProjectId}_${selectedPainelId}`);
      if (savedConfig) {
        try {
          setMappingConfig(JSON.parse(savedConfig));
        } catch (error) {
          console.error("Erro ao carregar configuração:", error);
        }
      } else {
        // Configuração padrão baseada no painel
        const totalPixels = painelSelecionado.pixelsLargura * painelSelecionado.pixelsAltura;
        const universesNeeded = Math.ceil(totalPixels / mappingConfig.configuracoes.pixelsPerUniverse);
        
        setMappingConfig(prev => ({
          ...prev,
          universos: Array.from({ length: universesNeeded }, (_, i) => ({
            id: i + 1,
            universe: prev.configuracoes.universoInicial + i,
            startPixel: i * prev.configuracoes.pixelsPerUniverse,
            endPixel: Math.min((i + 1) * prev.configuracoes.pixelsPerUniverse - 1, totalPixels - 1),
            protocol: prev.configuracoes.protocoloSaida
          })),
          zonas: [{
            id: 1,
            nome: "Zona Principal",
            x: 0,
            y: 0,
            width: painelSelecionado.pixelsLargura,
            height: painelSelecionado.pixelsAltura,
            universeStart: prev.configuracoes.universoInicial,
            pixelStart: 0
          }]
        }));
      }
    }
  }, [painelSelecionado, selectedProjectId, selectedPainelId]);

  // Salvar configuração
  const salvarConfiguracao = () => {
    if (painelSelecionado) {
      const key = `pixelMapping_${selectedProjectId}_${selectedPainelId}`;
      localStorage.setItem(key, JSON.stringify(mappingConfig));
      setFeedback("Configuração de Pixel Mapping salva com sucesso!");
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  // Exportar configuração
  const exportarConfiguracao = () => {
    if (!painelSelecionado) return;

    const exportData = {
      projeto: selectedProjectId,
      painel: selectedPainelId,
      configuracao: mappingConfig,
      painel_info: {
        largura: painelSelecionado.largura,
        altura: painelSelecionado.altura,
        pixelsLargura: painelSelecionado.pixelsLargura,
        pixelsAltura: painelSelecionado.pixelsAltura,
        gabinete: painelSelecionado.gabinete
      },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PixelMapping_${selectedProjectId}_${selectedPainelId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setFeedback("Configuração exportada com sucesso!");
    setTimeout(() => setFeedback(""), 3000);
  };

  // Adicionar nova zona
  const adicionarZona = () => {
    if (!painelSelecionado) return;

    const novaZona = {
      id: Date.now(),
      nome: `Zona ${mappingConfig.zonas.length + 1}`,
      x: 0,
      y: 0,
      width: Math.floor(painelSelecionado.pixelsLargura / 2),
      height: Math.floor(painelSelecionado.pixelsAltura / 2),
      universeStart: mappingConfig.configuracoes.universoInicial,
      pixelStart: 0
    };

    setMappingConfig(prev => ({
      ...prev,
      zonas: [...prev.zonas, novaZona]
    }));
    setSelectedZone(novaZona);
  };

  // Remover zona
  const removerZona = (zonaId) => {
    setMappingConfig(prev => ({
      ...prev,
      zonas: prev.zonas.filter(z => z.id !== zonaId)
    }));
    if (selectedZone?.id === zonaId) {
      setSelectedZone(null);
    }
  };

  // Atualizar zona
  const atualizarZona = (zonaAtualizada) => {
    setMappingConfig(prev => ({
      ...prev,
      zonas: prev.zonas.map(z => z.id === zonaAtualizada.id ? zonaAtualizada : z)
    }));
    if (selectedZone?.id === zonaAtualizada.id) {
      setSelectedZone(zonaAtualizada);
    }
  };

  // Importar configuração
  const importarConfiguracao = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        if (importData.configuracao) {
          setMappingConfig(importData.configuracao);
          setFeedback("Configuração importada com sucesso!");
          setTimeout(() => setFeedback(""), 3000);
        }
      } catch (error) {
        setFeedback("Erro ao importar configuração!");
        console.error("Erro na importação:", error);
        setTimeout(() => setFeedback(""), 3000);
      }
    };
    reader.readAsText(file);
    
    // Limpar o input
    event.target.value = '';
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h2 style={{ color: "#fff", marginBottom: 24 }}>🎯 Pixel Mapping</h2>
      
      <FeedbackMessage message={feedback} type="success" />
      
      {/* Seleção de Projeto e Painel */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: 16, 
        marginBottom: 24,
        padding: 16,
        background: "#23283a",
        borderRadius: 12
      }}>
        <div>
          <label style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}>
            Projeto:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setSelectedPainelId("");
              setSelectedZone(null);
            }}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #3a4161",
              background: "#1a1d29",
              color: "#fff"
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
        
        <div>
          <label style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}>
            Painel:
          </label>
          <select
            value={selectedPainelId}
            onChange={(e) => {
              setSelectedPainelId(e.target.value);
              setSelectedZone(null);
            }}
            disabled={!selectedProjectId}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #3a4161",
              background: "#1a1d29",
              color: "#fff"
            }}
          >
            <option value="">Selecione o Painel</option>
            {paineisFiltrados.map((p, i) => (
              <option key={i} value={p.nome}>
                {p.nome} ({UTILS.formatNumber(p.pixelsLargura, 0)}×{UTILS.formatNumber(p.pixelsAltura, 0)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {painelSelecionado ? (
        <>
          {/* Informações do Painel */}
          <div style={{
            background: "#23283a",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24
          }}>
            <h3 style={{ color: "#fff", marginBottom: 12 }}>ℹ️ Informações do Painel</h3>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: 12,
              fontSize: "0.9em",
              color: "#b6c1e0"
            }}>
              <div>📐 Resolução: {UTILS.formatNumber(painelSelecionado.pixelsLargura, 0)} × {UTILS.formatNumber(painelSelecionado.pixelsAltura, 0)} pixels</div>
              <div>📏 Dimensões: {UTILS.formatNumber(painelSelecionado.largura, 2)}m × {UTILS.formatNumber(painelSelecionado.altura, 2)}m</div>
              <div>🔢 Total de Pixels: {UTILS.formatNumber(painelSelecionado.pixelsLargura * painelSelecionado.pixelsAltura, 0)}</div>
              <div>📦 Gabinete: {painelSelecionado.gabinete}</div>
            </div>
          </div>

          {/* Navegação por Abas */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              display: "flex", 
              gap: 8,
              borderBottom: "2px solid #3a4161",
              marginBottom: 16
            }}>
              {[
                { key: "visual", label: "Editor Visual", icon: "🎨" },
                { key: "zones", label: "Gerenciar Zonas", icon: "🔲" },
                { key: "universes", label: "Configurar Universos", icon: "🌐" }
              ].map(tab => (
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
                    borderBottom: activeTab === tab.key ? "2px solid #3b82f6" : "2px solid transparent",
                    marginBottom: "-2px"
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Conteúdo das Abas */}
            {activeTab === "visual" && (
              <div style={{ display: "flex", gap: 24 }}>
                {/* Editor Visual */}
                <div style={{ flex: 2 }}>
                  <div style={{ 
                    background: "#23283a", 
                    borderRadius: 12, 
                    padding: 16 
                  }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      marginBottom: 16 
                    }}>
                      <h4 style={{ color: "#fff", margin: 0 }}>Editor Visual</h4>
                      
                      {/* Controles de Visualização */}
                      <div style={{ display: "flex", gap: 8 }}>
                        {[
                          { key: "grid", label: "Grid", icon: "⬜" },
                          { key: "zones", label: "Zonas", icon: "🔲" },
                          { key: "universes", label: "Universos", icon: "🌐" }
                        ].map(mode => (
                          <button
                            key={mode.key}
                            onClick={() => setPreviewMode(mode.key)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "none",
                              background: previewMode === mode.key ? "#3b82f6" : "#2a2d3a",
                              color: "#fff",
                              cursor: "pointer",
                              fontSize: "0.8em"
                            }}
                          >
                            {mode.icon} {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <PixelGridEditor
                      painelConfig={painelSelecionado}
                      mappingConfig={mappingConfig}
                      onMappingUpdate={setMappingConfig}
                      previewMode={previewMode}
                      selectedZone={selectedZone}
                      onZoneSelect={setSelectedZone}
                      onZoneUpdate={atualizarZona}
                    />
                  </div>
                </div>

                {/* Painel lateral com controles */}
                <div style={{ flex: 1, minWidth: 320 }}>
                  {/* Ações principais */}
                  <div style={{
                    background: "#23283a",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16
                  }}>
                    <h4 style={{ color: "#fff", marginBottom: 12 }}>💾 Ações</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button
                        onClick={salvarConfiguracao}
                        style={{
                          padding: "10px 16px",
                          borderRadius: 6,
                          border: "none",
                          background: "#10b981",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: 500
                        }}
                      >
                        💾 Salvar Configuração
                      </button>
                      
                      <button
                        onClick={exportarConfiguracao}
                        style={{
                          padding: "10px 16px",
                          borderRadius: 6,
                          border: "none",
                          background: "#3b82f6",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: 500
                        }}
                      >
                        📤 Exportar JSON
                      </button>
                      
                      <button
                        onClick={() => setShowExportWizard(true)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: 6,
                          border: "none",
                          background: "#8b5cf6",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: 500
                        }}
                      >
                        🚀 Exportar Pro
                      </button>
                      
                      <label style={{
                        padding: "10px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: "#f59e0b",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 500,
                        textAlign: "center",
                        display: "block"
                      }}>
                        📥 Importar JSON
                        <input
                          type="file"
                          accept=".json"
                          onChange={importarConfiguracao}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Editor de zona selecionada */}
                  {previewMode === "zones" && (
                    <ZoneEditor
                      zonas={mappingConfig.zonas}
                      selectedZone={selectedZone}
                      onZoneSelect={setSelectedZone}
                      onZoneUpdate={atualizarZona}
                      onZoneDelete={removerZona}
                      onZoneAdd={adicionarZona}
                      universos={mappingConfig.universos}
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === "zones" && (
              <ZoneEditor
                zonas={mappingConfig.zonas}
                selectedZone={selectedZone}
                onZoneSelect={setSelectedZone}
                onZoneUpdate={atualizarZona}
                onZoneDelete={removerZona}
                onZoneAdd={adicionarZona}
                universos={mappingConfig.universos}
              />
            )}

            {activeTab === "universes" && (
              <UniverseConfig
                universos={mappingConfig.universos}
                configuracoes={mappingConfig.configuracoes}
                onUniverseUpdate={(universos) => setMappingConfig(prev => ({ ...prev, universos }))}
                onConfigUpdate={(configuracoes) => setMappingConfig(prev => ({ ...prev, configuracoes }))}
                totalPixels={painelSelecionado.pixelsLargura * painelSelecionado.pixelsAltura}
              />
            )}
          </div>
        </>
      ) : (
        <div style={{
          textAlign: "center",
          padding: 60,
          color: "#9ca3af"
        }}>
          <div style={{ fontSize: "3em", marginBottom: 16 }}>🎯</div>
          <h3 style={{ color: "#fff", marginBottom: 8 }}>Pixel Mapping Avançado</h3>
          <p>Selecione um projeto e painel para começar a configurar o mapeamento de pixels</p>
          <div style={{ fontSize: "0.9em", marginTop: 16, lineHeight: 1.6 }}>
            <strong>Recursos disponíveis:</strong><br/>
            🎨 Editor visual interativo com drag & drop<br/>
            🔲 Criação e edição de zonas personalizadas<br/>
            🌐 Configuração avançada de universos DMX<br/>
            📤 Exportação e importação de configurações<br/>
            🔄 Suporte para Art-Net, sACN e DDP
          </div>
        </div>
      )}
      
      {/* Export Wizard Modal */}
      {showExportWizard && painelSelecionado && (
        <ExportWizard
          mappingConfig={mappingConfig}
          painelConfig={painelSelecionado}
          onClose={() => setShowExportWizard(false)}
        />
      )}
    </div>
  );
}

import { useState } from "react";

export default function ExportWizard({ 
  mappingConfig, 
  painelConfig, 
  onClose 
}) {
  const [exportFormat, setExportFormat] = useState("json");
  const [exportOptions, setExportOptions] = useState({
    includeZones: true,
    includeUniverses: true,
    includeMetadata: true,
    artNetSubnet: 0,
    artNetNet: 0
  });

  // Gerar configuração Art-Net para software de lighting
  const generateArtNetConfig = () => {
    const fixtures = mappingConfig.universos.map((universo, index) => {
      const pixelCount = universo.endPixel - universo.startPixel + 1;
      return {
        name: `LED_Panel_Universe_${universo.universe}`,
        type: "Generic RGB Pixel Strip",
        universe: universo.universe,
        address: 1,
        channels: pixelCount * 3,
        mode: "RGB",
        pixels: pixelCount,
        ip: universo.ip || "2.0.0.1",
        port: universo.port || 6454,
        protocol: universo.protocol,
        subnet: exportOptions.artNetSubnet,
        net: exportOptions.artNetNet
      };
    });

    return {
      project: {
        name: painelConfig.nome || "LED Panel Project",
        description: `Pixel mapping for ${painelConfig.pixelsLargura}x${painelConfig.pixelsAltura} LED panel`,
        totalPixels: painelConfig.pixelsLargura * painelConfig.pixelsAltura,
        dimensions: {
          width: painelConfig.largura,
          height: painelConfig.altura,
          pixelsWidth: painelConfig.pixelsLargura,
          pixelsHeight: painelConfig.pixelsAltura
        }
      },
      fixtures: fixtures,
      universes: mappingConfig.universos.length,
      totalChannels: fixtures.reduce((sum, f) => sum + f.channels, 0),
      zones: exportOptions.includeZones ? mappingConfig.zonas : undefined,
      metadata: exportOptions.includeMetadata ? {
        software: "LED Panel Manager",
        version: "1.0.0",
        exported: new Date().toISOString(),
        pixelPitch: painelConfig.pixelPitch || "N/A"
      } : undefined
    };
  };

  // Gerar configuração para MA3 (GrandMA3)
  const generateMA3Config = () => {
    const fixtures = mappingConfig.universos.map((universo, index) => {
      const pixelCount = universo.endPixel - universo.startPixel + 1;
      return {
        fixture_id: index + 1,
        name: `Panel_U${universo.universe}`,
        universe: universo.universe,
        address: 1,
        fixture_type: "LED_RGB_Pixel",
        channel_count: pixelCount * 3,
        pixel_count: pixelCount,
        patch_info: {
          universe: universo.universe,
          start_address: 1,
          end_address: pixelCount * 3
        }
      };
    });

    return {
      show_info: {
        name: `LED_Panel_${painelConfig.nome}`,
        created: new Date().toISOString(),
        software: "LED Panel Manager"
      },
      fixtures: fixtures,
      patch_summary: {
        total_universes: mappingConfig.universos.length,
        total_channels: fixtures.reduce((sum, f) => sum + f.channel_count, 0),
        total_pixels: painelConfig.pixelsLargura * painelConfig.pixelsAltura
      }
    };
  };

  // Gerar configuração para Resolume Arena
  const generateResolumeConfig = () => {
    return {
      composition: {
        name: `LED_Panel_${painelConfig.nome}`,
        width: painelConfig.pixelsLargura,
        height: painelConfig.pixelsAltura,
        pixelPitch: painelConfig.pixelPitch || 3.91
      },
      output: {
        type: "Art-Net",
        universes: mappingConfig.universos.map(u => ({
          universe: u.universe,
          startX: 0,
          startY: Math.floor(u.startPixel / painelConfig.pixelsLargura),
          width: painelConfig.pixelsLargura,
          height: Math.ceil((u.endPixel - u.startPixel + 1) / painelConfig.pixelsLargura),
          ip: u.ip || "2.0.0.1",
          protocol: u.protocol
        }))
      },
      mapping: {
        zones: mappingConfig.zonas.map(zona => ({
          name: zona.nome,
          x: zona.x,
          y: zona.y,
          width: zona.width,
          height: zona.height,
          universe: zona.universeStart || 1
        }))
      }
    };
  };

  // Gerar arquivo CSV para import em planilhas
  const generateCSVConfig = () => {
    let csv = "Type,Name,Universe,Start_Pixel,End_Pixel,Total_Pixels,Channels,IP,Port,Protocol\n";
    
    // Adicionar universos
    mappingConfig.universos.forEach(universo => {
      const pixelCount = universo.endPixel - universo.startPixel + 1;
      csv += `Universe,Universe_${universo.universe},${universo.universe},${universo.startPixel},${universo.endPixel},${pixelCount},${pixelCount * 3},${universo.ip || "2.0.0.1"},${universo.port || 6454},${universo.protocol}\n`;
    });

    // Adicionar zonas se selecionado
    if (exportOptions.includeZones) {
      mappingConfig.zonas.forEach(zona => {
        const pixelCount = zona.width * zona.height;
        csv += `Zone,${zona.nome},${zona.universeStart || 1},${zona.pixelStart || 0},${(zona.pixelStart || 0) + pixelCount - 1},${pixelCount},${pixelCount * 3},,,\n`;
      });
    }

    return csv;
  };

  const handleExport = () => {
    let data, filename, mimeType;

    switch (exportFormat) {
      case "artnet":
        data = JSON.stringify(generateArtNetConfig(), null, 2);
        filename = `ArtNet_${painelConfig.nome || 'Panel'}.json`;
        mimeType = "application/json";
        break;
      case "ma3":
        data = JSON.stringify(generateMA3Config(), null, 2);
        filename = `MA3_${painelConfig.nome || 'Panel'}.json`;
        mimeType = "application/json";
        break;
      case "resolume":
        data = JSON.stringify(generateResolumeConfig(), null, 2);
        filename = `Resolume_${painelConfig.nome || 'Panel'}.json`;
        mimeType = "application/json";
        break;
      case "csv":
        data = generateCSVConfig();
        filename = `Panel_Mapping_${painelConfig.nome || 'Panel'}.csv`;
        mimeType = "text/csv";
        break;
      default:
        data = JSON.stringify(mappingConfig, null, 2);
        filename = `PixelMapping_${painelConfig.nome || 'Panel'}.json`;
        mimeType = "application/json";
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#23283a",
        borderRadius: 12,
        padding: 24,
        maxWidth: 600,
        width: "90%",
        maxHeight: "90%",
        overflowY: "auto"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 20 
        }}>
          <h3 style={{ color: "#fff", margin: 0 }}>🚀 Assistente de Exportação</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#9ca3af",
              fontSize: "1.5em",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* Seleção de Formato */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}>
            Formato de Exportação:
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #3a4161",
              background: "#1a1d29",
              color: "#fff",
              fontSize: "1em"
            }}
          >
            <option value="json">JSON Padrão - LED Panel Manager</option>
            <option value="artnet">Art-Net Configuration - Lighting Software</option>
            <option value="ma3">GrandMA3 - Console Configuration</option>
            <option value="resolume">Resolume Arena - Media Server</option>
            <option value="csv">CSV - Planilha/Excel</option>
          </select>
        </div>

        {/* Descrição do formato selecionado */}
        <div style={{
          background: "#1a1d29",
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
          fontSize: "0.9em",
          color: "#b6c1e0"
        }}>
          {exportFormat === "json" && (
            <div>
              <strong>💾 JSON Padrão:</strong><br/>
              Formato nativo do LED Panel Manager. Inclui todas as configurações de zonas, universos e metadados. Ideal para backup e intercâmbio entre projetos.
            </div>
          )}
          {exportFormat === "artnet" && (
            <div>
              <strong>🌐 Art-Net Configuration:</strong><br/>
              Configuração compatível com softwares de iluminação profissional como QLC+, LightJockey, Avolites, etc. Inclui definições de fixtures e patch.
            </div>
          )}
          {exportFormat === "ma3" && (
            <div>
              <strong>🎛️ GrandMA3:</strong><br/>
              Configuração otimizada para consoles GrandMA3. Inclui informações de patch, fixtures e endereçamento DMX para import direto.
            </div>
          )}
          {exportFormat === "resolume" && (
            <div>
              <strong>🎬 Resolume Arena:</strong><br/>
              Configuração para media server Resolume Arena. Inclui mapeamento de output e configurações de protocolo para controle de LED.
            </div>
          )}
          {exportFormat === "csv" && (
            <div>
              <strong>📊 CSV (Planilha):</strong><br/>
              Formato de planilha compatível com Excel, Google Sheets, etc. Ideal para documentação e análise de configurações.
            </div>
          )}
        </div>

        {/* Opções de Exportação */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ color: "#fff", marginBottom: 12 }}>Opções de Exportação:</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8,
              color: "#b6c1e0",
              cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={exportOptions.includeZones}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeZones: e.target.checked }))}
              />
              Incluir Zonas Personalizadas
            </label>
            
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8,
              color: "#b6c1e0",
              cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={exportOptions.includeUniverses}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeUniverses: e.target.checked }))}
              />
              Incluir Configurações de Universos
            </label>
            
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8,
              color: "#b6c1e0",
              cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={exportOptions.includeMetadata}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
              />
              Incluir Metadados do Projeto
            </label>
          </div>
        </div>

        {/* Opções específicas do Art-Net */}
        {exportFormat === "artnet" && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: "#fff", marginBottom: 12 }}>Configurações Art-Net:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ color: "#9ca3af", fontSize: "0.9em", display: "block" }}>
                  Subnet:
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={exportOptions.artNetSubnet}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, artNetSubnet: parseInt(e.target.value) }))}
                  style={{
                    width: "100%",
                    padding: 6,
                    borderRadius: 4,
                    border: "1px solid #3a4161",
                    background: "#1a1d29",
                    color: "#fff"
                  }}
                />
              </div>
              <div>
                <label style={{ color: "#9ca3af", fontSize: "0.9em", display: "block" }}>
                  Net:
                </label>
                <input
                  type="number"
                  min="0"
                  max="127"
                  value={exportOptions.artNetNet}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, artNetNet: parseInt(e.target.value) }))}
                  style={{
                    width: "100%",
                    padding: 6,
                    borderRadius: 4,
                    border: "1px solid #3a4161",
                    background: "#1a1d29",
                    color: "#fff"
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Preview das informações a serem exportadas */}
        <div style={{
          background: "#1a1d29",
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
          fontSize: "0.85em",
          color: "#9ca3af"
        }}>
          <strong style={{ color: "#fff" }}>Preview da Exportação:</strong><br/>
          Universos: {mappingConfig.universos.length}<br/>
          Zonas: {mappingConfig.zonas.length}<br/>
          Total de Pixels: {(painelConfig.pixelsLargura * painelConfig.pixelsAltura).toLocaleString()}<br/>
          Total de Canais: {(painelConfig.pixelsLargura * painelConfig.pixelsAltura * 3).toLocaleString()}
        </div>

        {/* Botões de Ação */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 20px",
              borderRadius: 6,
              border: "1px solid #3a4161",
              background: "transparent",
              color: "#b6c1e0",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            style={{
              flex: 2,
              padding: "12px 20px",
              borderRadius: 6,
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            🚀 Exportar Configuração
          </button>
        </div>
      </div>
    </div>
  );
}

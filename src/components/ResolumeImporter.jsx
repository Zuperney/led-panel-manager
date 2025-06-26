import { useState, useCallback } from "react";

export default function ResolumeImporter({ 
  onLayoutImport, 
  onFeedback,
  availablePanels 
}) {
  const [importing, setImporting] = useState(false);
  const [importData, setImportData] = useState(null);

  // Fazer parse do XML do Resolume
  const parseResolumeXML = useCallback((xmlText) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Verificar se é um arquivo válido do Resolume
      const versionInfo = xmlDoc.querySelector("versionInfo[name='Resolume Arena']");
      if (!versionInfo) {
        throw new Error("Arquivo XML não é do Resolume Arena");
      }

      // Extrair informações do canvas
      const canvasSize = xmlDoc.querySelector("CurrentCompositionTextureSize");
      const canvasWidth = parseInt(canvasSize?.getAttribute("width")) || 1920;
      const canvasHeight = parseInt(canvasSize?.getAttribute("height")) || 1080;

      // Extrair slices (painéis)
      const slices = xmlDoc.querySelectorAll("Slice");
      const paineis = [];

      slices.forEach((slice, index) => {
        const name = slice.querySelector("Param[name='Name']")?.getAttribute("value") || `Painel ${index + 1}`;
        
        // Extrair OutputRect (posição e tamanho final)
        const outputRect = slice.querySelector("OutputRect");
        const vertices = outputRect?.querySelectorAll("v");
        
        if (vertices && vertices.length >= 4) {
          const x1 = parseFloat(vertices[0].getAttribute("x"));
          const y1 = parseFloat(vertices[0].getAttribute("y"));
          const x2 = parseFloat(vertices[1].getAttribute("x"));
          const y2 = parseFloat(vertices[2].getAttribute("y"));
          
          const pixelsWidth = Math.abs(x2 - x1);
          const pixelsHeight = Math.abs(y2 - y1);
          
          // Converter para coordenadas do nosso sistema (escala visual)
          const baseScale = 0.2;
          const visualX = x1 * baseScale;
          const visualY = y1 * baseScale;
          const visualWidth = pixelsWidth * baseScale;
          const visualHeight = pixelsHeight * baseScale;

          // Tentar encontrar painel correspondente pelos pixels ou criar genérico
          let matchedPanel = availablePanels?.find(p => 
            Math.abs(p.pixelsWidth - pixelsWidth) <= 10 && 
            Math.abs(p.pixelsHeight - pixelsHeight) <= 10
          );

          if (!matchedPanel) {
            // Criar painel genérico baseado nas dimensões
            matchedPanel = {
              id: `imported_${index}`,
              nome: name,
              pixelsWidth: pixelsWidth,
              pixelsHeight: pixelsHeight,
              largura: pixelsWidth * 0.003, // Aproximação: 3mm por pixel
              altura: pixelsHeight * 0.003,
              pitch: 3.0,
              gabinete: "Importado do Resolume"
            };
          }

          paineis.push({
            ...matchedPanel,
            nome: name,
            x: visualX,
            y: visualY,
            width: visualWidth,
            height: visualHeight,
            pixelsWidth: pixelsWidth,
            pixelsHeight: pixelsHeight,
            physicalWidth: matchedPanel.largura,
            physicalHeight: matchedPanel.altura,
            resolume: {
              uniqueId: slice.getAttribute("uniqueId"),
              inputRect: extractRect(slice.querySelector("InputRect")),
              outputRect: extractRect(outputRect),
              originalPosition: { x: x1, y: y1 }
            }
          });
        }
      });

      return {
        projectName: xmlDoc.querySelector("XmlState")?.getAttribute("name") || "Layout Importado",
        canvasSize: { width: canvasWidth, height: canvasHeight },
        paineis: paineis,
        screenName: xmlDoc.querySelector("Screen")?.getAttribute("name") || "Screen 1"
      };

    } catch (error) {
      console.error("Erro ao fazer parse do XML:", error);
      throw error;
    }
  }, [availablePanels]);

  // Extrair coordenadas de um retângulo XML
  const extractRect = useCallback((rectElement) => {
    if (!rectElement) return null;
    
    const vertices = rectElement.querySelectorAll("v");
    if (vertices.length < 4) return null;
    
    return {
      x1: parseFloat(vertices[0].getAttribute("x")),
      y1: parseFloat(vertices[0].getAttribute("y")),
      x2: parseFloat(vertices[1].getAttribute("x")),
      y2: parseFloat(vertices[2].getAttribute("y"))
    };
  }, []);

  // Lidar com upload de arquivo
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      if (onFeedback) {
        onFeedback("⚠️ Por favor, selecione um arquivo XML válido!");
      }
      return;
    }

    setImporting(true);
    
    try {
      const text = await file.text();
      const parsedData = parseResolumeXML(text);
      setImportData(parsedData);
      
      if (onFeedback) {
        onFeedback(`📥 XML analisado: ${parsedData.paineis.length} painéis encontrados!`);
      }
      
    } catch (error) {
      if (onFeedback) {
        onFeedback(`❌ Erro ao importar XML: ${error.message}`);
      }
    } finally {
      setImporting(false);
    }
  }, [parseResolumeXML, onFeedback]);

  // Confirmar importação
  const confirmImport = useCallback(() => {
    if (!importData || !onLayoutImport) return;

    const newLayoutConfig = {
      paineis: importData.paineis,
      canvasSize: importData.canvasSize,
      zoom: 1,
      gridSnap: true
    };

    onLayoutImport(newLayoutConfig);
    setImportData(null);
    
    if (onFeedback) {
      onFeedback(`✅ Layout do Resolume importado com sucesso!`);
    }
  }, [importData, onLayoutImport, onFeedback]);

  return (
    <div style={{
      background: "linear-gradient(145deg, #1e3a8a, #3730a3)",
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      border: "1px solid #3730a3",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    }}>
      <h4 style={{ color: "#fff", marginBottom: 16, fontSize: "1em", display: "flex", alignItems: "center", gap: "8px" }}>
        📥 Importar do Resolume Arena
      </h4>
      
      {!importData ? (
        <div>
          <p style={{ color: "#cbd5e1", fontSize: "0.9em", marginBottom: "12px" }}>
            Importe um arquivo XML de pixel mapping do Resolume Arena para recriar o layout de painéis.
          </p>
          
          <input
            type="file"
            accept=".xml"
            onChange={handleFileUpload}
            disabled={importing}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 6,
              border: "2px dashed #4f46e5",
              background: "#1e1b4b",
              color: "#e2e8f0",
              cursor: importing ? "not-allowed" : "pointer",
              fontSize: "0.9em"
            }}
          />
          
          {importing && (
            <div style={{ 
              marginTop: "12px", 
              color: "#60a5fa", 
              fontSize: "0.85em",
              textAlign: "center"
            }}>
              🔄 Analisando arquivo XML...
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Preview dos dados importados */}
          <div style={{
            padding: 12,
            background: "#1e1b4b",
            borderRadius: 8,
            fontSize: "0.85em",
            color: "#e2e8f0",
            marginBottom: "16px"
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong>📁 Projeto:</strong> {importData.projectName}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>📐 Canvas:</strong> {importData.canvasSize.width}×{importData.canvasSize.height}px
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>🖥️ Tela:</strong> {importData.screenName}
            </div>
            <div>
              <strong>📦 Painéis:</strong> {importData.paineis.length} slices encontrados
            </div>
          </div>

          {/* Lista de painéis encontrados */}
          <div style={{
            maxHeight: "200px",
            overflowY: "auto",
            background: "#0f172a",
            borderRadius: 6,
            padding: 8,
            marginBottom: "16px"
          }}>
            {importData.paineis.map((painel, index) => (
              <div key={index} style={{
                padding: "6px 8px",
                background: "#1e293b",
                borderRadius: 4,
                marginBottom: "4px",
                fontSize: "0.8em",
                color: "#cbd5e1"
              }}>
                <div style={{ fontWeight: "bold", color: "#fff" }}>
                  {painel.nome}
                </div>
                <div>
                  {painel.pixelsWidth}×{painel.pixelsHeight}px | 
                  Pos: {Math.round(painel.x)}, {Math.round(painel.y)}
                </div>
              </div>
            ))}
          </div>

          {/* Botões de ação */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={confirmImport}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 6,
                border: "none",
                background: "linear-gradient(145deg, #059669, #047857)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.9em",
                fontWeight: "600"
              }}
            >
              ✅ Importar Layout
            </button>
            
            <button
              onClick={() => setImportData(null)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 6,
                border: "none",
                background: "#374151",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "0.9em",
                fontWeight: "500"
              }}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

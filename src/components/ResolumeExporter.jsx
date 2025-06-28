import { useState, useCallback } from "react";

export default function ResolumeExporter({
  layoutConfig,
  onFeedback,
  availablePanels,
}) {
  const [exportConfig, setExportConfig] = useState({
    projectName: "LED Panel Layout",
    canvasWidth: 4320,
    canvasHeight: 3840,
    includeWarping: true,
    layerOffset: { x: 0, y: 0 },
    screenName: "Screen 1",
  });

  // Gerar XML compatível com Resolume Arena
  const generateResolumeXML = useCallback(() => {
    if (layoutConfig.paineis.length === 0) {
      if (onFeedback) {
        onFeedback("⚠️ Nenhum painel no layout para exportar!");
      }
      return;
    }

    try {
      const timestamp = Date.now();
      const uniqueId = timestamp;

      // Calcular bounding box para otimizar canvas
      const boundingBox = calculateLayoutBounds();
      const canvasWidth = exportConfig.canvasWidth || boundingBox.width;
      const canvasHeight = exportConfig.canvasHeight || boundingBox.height;

      const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<XmlState name="${exportConfig.projectName}">
  <versionInfo name="Resolume Arena" majorVersion="7" minorVersion="22" microVersion="9" revision="47596"/>
  <ScreenSetup name="ScreenSetup">
    <Params name="ScreenSetupParams"/>
    <CurrentCompositionTextureSize width="${canvasWidth}" height="${canvasHeight}"/>
    <screens>
      <Screen name="${exportConfig.screenName}" uniqueId="${uniqueId}">
        <Params name="Params">
          <Param name="Name" T="STRING" default="" value="${
            exportConfig.screenName
          }"/>
          <Param name="Enabled" T="BOOL" default="1" value="1"/>
          <Param name="Hidden" T="BOOL" default="0" value="0"/>
        </Params>
        <Params name="Output">
          <ParamRange name="Opacity" T="DOUBLE" default="1" value="1">
            <PhaseSourceStatic name="PhaseSourceStatic"/>
            <BehaviourDouble name="BehaviourDouble"/>
            <ValueRange name="defaultRange" min="0" max="1"/>
            <ValueRange name="minMax" min="0" max="1"/>
            <ValueRange name="startStop" min="0" max="1"/>
          </ParamRange>
          <ParamRange name="Brightness" T="DOUBLE" default="0" value="0">
            <PhaseSourceStatic name="PhaseSourceStatic"/>
            <BehaviourDouble name="BehaviourDouble"/>
            <ValueRange name="defaultRange" min="-1" max="1"/>
            <ValueRange name="minMax" min="-1" max="1"/>
            <ValueRange name="startStop" min="-1" max="1"/>
          </ParamRange>
          <ParamRange name="Contrast" T="DOUBLE" default="0" value="0">
            <PhaseSourceStatic name="PhaseSourceStatic"/>
            <BehaviourDouble name="BehaviourDouble"/>
            <ValueRange name="defaultRange" min="-1" max="1"/>
            <ValueRange name="minMax" min="-1" max="1"/>
            <ValueRange name="startStop" min="-1" max="1"/>
          </ParamRange>
        </Params>
        <guides>
          <ScreenGuide name="ScreenGuide" type="0">
            <Params name="Params">
              <ParamPixels name="Image"/>
              <ParamRange name="Opacity" T="DOUBLE" default="0.25" value="0.25">
                <PhaseSourceStatic name="PhaseSourceStatic"/>
                <BehaviourDouble name="BehaviourDouble"/>
                <ValueRange name="defaultRange" min="0" max="1"/>
                <ValueRange name="minMax" min="0" max="1"/>
                <ValueRange name="startStop" min="0" max="1"/>
              </ParamRange>
            </Params>
          </ScreenGuide>
        </guides>
        <layers>
          ${generateLayersXML()}
        </layers>
        <OutputDevice>
          <OutputDeviceDisplay name="LED Display" deviceId="LED_VIRTUAL_DISPLAY" idHash="${Math.floor(
            Math.random() * 1000000000000000000
          )}" fullscreen="1" width="${canvasWidth}" height="${canvasHeight}">
            <Params name="Params">
              <ParamRange name="Delay" T="DOUBLE" default="0" value="0">
                <PhaseSourceStatic name="PhaseSourceStatic"/>
                <BehaviourDouble name="BehaviourDouble"/>
                <ValueRange name="defaultRange" min="0" max="0.10000000000000000555"/>
                <ValueRange name="minMax" min="0" max="0.10000000000000000555"/>
                <ValueRange name="startStop" min="0" max="0.10000000000000000555"/>
              </ParamRange>
            </Params>
          </OutputDeviceDisplay>
        </OutputDevice>
      </Screen>
    </screens>
    <SoftEdging>
      <Params name="Soft Edge">
        <ParamRange name="Gamma Red" T="DOUBLE" default="2" value="2">
          <PhaseSourceStatic name="PhaseSourceStatic"/>
          <BehaviourDouble name="BehaviourDouble"/>
          <ValueRange name="defaultRange" min="1" max="3"/>
          <ValueRange name="minMax" min="1" max="3"/>
          <ValueRange name="startStop" min="1" max="3"/>
        </ParamRange>
        <ParamRange name="Gamma Green" T="DOUBLE" default="2" value="2">
          <PhaseSourceStatic name="PhaseSourceStatic"/>
          <BehaviourDouble name="BehaviourDouble"/>
          <ValueRange name="defaultRange" min="1" max="3"/>
          <ValueRange name="minMax" min="1" max="3"/>
          <ValueRange name="startStop" min="1" max="3"/>
        </ParamRange>
        <ParamRange name="Gamma Blue" T="DOUBLE" default="2" value="2">
          <PhaseSourceStatic name="PhaseSourceStatic"/>
          <BehaviourDouble name="BehaviourDouble"/>
          <ValueRange name="defaultRange" min="1" max="3"/>
          <ValueRange name="minMax" min="1" max="3"/>
          <ValueRange name="startStop" min="1" max="3"/>
        </ParamRange>
        <ParamRange name="Gamma" T="DOUBLE" default="1" value="1">
          <PhaseSourceStatic name="PhaseSourceStatic"/>
          <BehaviourDouble name="BehaviourDouble"/>
          <ValueRange name="defaultRange" min="0" max="1"/>
          <ValueRange name="minMax" min="0" max="1"/>
          <ValueRange name="startStop" min="0" max="1"/>
        </ParamRange>
        <ParamRange name="Luminance" T="DOUBLE" default="0.5" value="0.5">
          <PhaseSourceStatic name="PhaseSourceStatic"/>
          <BehaviourDouble name="BehaviourDouble"/>
          <ValueRange name="defaultRange" min="0" max="1"/>
          <ValueRange name="minMax" min="0" max="1"/>
          <ValueRange name="startStop" min="0" max="1"/>
        </ParamRange>
        <ParamRange name="Power" T="DOUBLE" default="2" value="2">
          <PhaseSourceStatic name="PhaseSourceStatic"/>
          <BehaviourDouble name="BehaviourDouble"/>
          <ValueRange name="defaultRange" min="0.10000000000000000555" max="7"/>
          <ValueRange name="minMax" min="0.10000000000000000555" max="7"/>
          <ValueRange name="startStop" min="0.10000000000000000555" max="7"/>
        </ParamRange>
      </Params>
    </SoftEdging>
  </ScreenSetup>
</XmlState>`;

      // Download do arquivo XML
      const blob = new Blob([xmlContent], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestamp2 = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      a.download = `${exportConfig.projectName.replace(
        /\s+/g,
        "_"
      )}_${timestamp2}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (onFeedback) {
        onFeedback("🎭 Layout exportado para Resolume Arena!");
      }
    } catch (error) {
      console.error("Erro ao gerar XML do Resolume:", error);
      if (onFeedback) {
        onFeedback("❌ Erro ao exportar para Resolume!");
      }
    }
  }, [layoutConfig.paineis, exportConfig, onFeedback]);

  // Gerar XML das layers (slices)
  const generateLayersXML = useCallback(() => {
    return layoutConfig.paineis
      .map((panel, index) => {
        const uniqueId = Date.now() + index;

        // Converter coordenadas do layout para pixels reais do Resolume
        const baseScale = 0.2; // Mesma escala do layout visual
        const outputX =
          Math.round(panel.x / baseScale) + exportConfig.layerOffset.x;
        const outputY =
          Math.round(panel.y / baseScale) + exportConfig.layerOffset.y;
        const outputWidth = panel.pixelsWidth;
        const outputHeight = panel.pixelsHeight;

        // Input mapping (fonte de conteúdo) - usar proporção do painel
        const inputX = index * outputWidth; // Distribui horizontalmente na fonte
        const inputY = 0;
        const inputWidth = outputWidth;
        const inputHeight = outputHeight;

        // Gerar vértices do BezierWarper (correção geométrica)
        const warperVertices = generateWarperVertices(
          outputX,
          outputY,
          outputWidth,
          outputHeight
        );

        return `
          <Slice uniqueId="${uniqueId}">
            <Params name="Common">
              <Param name="Name" T="STRING" default="Layer" value="${
                panel.nome
              }"/>
              <Param name="Enabled" T="BOOL" default="1" value="1"/>
            </Params>
            <Params name="Input">
              <ParamChoice name="Input Source" default="0:1" value="0:1" storeChoices="0"/>
              <Param name="Input Opacity" T="BOOL" default="1" value="1"/>
              <Param name="Input Bypass/Solo" T="BOOL" default="1" value="1"/>
              <Param name="SoftEdgeEnable" T="BOOL" default="0" value="0"/>
            </Params>
            <Params name="Output">
              <Param name="Flip" T="UINT8" default="0" value="0"/>
              <ParamRange name="Brightness" T="DOUBLE" default="0" value="0">
                <PhaseSourceStatic name="PhaseSourceStatic"/>
                <BehaviourDouble name="BehaviourDouble"/>
                <ValueRange name="defaultRange" min="-1" max="1"/>
                <ValueRange name="minMax" min="-1" max="1"/>
                <ValueRange name="startStop" min="-1" max="1"/>
              </ParamRange>
              <ParamRange name="Contrast" T="DOUBLE" default="0" value="0">
                <PhaseSourceStatic name="PhaseSourceStatic"/>
                <BehaviourDouble name="BehaviourDouble"/>
                <ValueRange name="defaultRange" min="-1" max="1"/>
                <ValueRange name="minMax" min="-1" max="1"/>
                <ValueRange name="startStop" min="-1" max="1"/>
              </ParamRange>
              <ParamRange name="Red" T="DOUBLE" default="0" value="0">
                <PhaseSourceStatic name="PhaseSourceStatic"/>
                <BehaviourDouble name="BehaviourDouble"/>
                <ValueRange name="defaultRange" min="-1" max="1"/>
                <ValueRange name="minMax" min="-1" max="1"/>
                <ValueRange name="startStop" min="-1" max="1"/>
              </ParamRange>
              <ParamRange name="Green" T="DOUBLE" default="0" value="0">
                <PhaseSourceStatic name="PhaseSourceStatic"/>
                <BehaviourDouble name="BehaviourDouble"/>
                <ValueRange name="defaultRange" min="-1" max="1"/>
                <ValueRange name="minMax" min="-1" max="1"/>
                <ValueRange name="startStop" min="-1" max="1"/>
              </ParamRange>
              <ParamRange name="Blue" T="DOUBLE" default="0" value="0">
                <PhaseSourceStatic name="PhaseSourceStatic"/>
                <BehaviourDouble name="BehaviourDouble"/>
                <ValueRange name="defaultRange" min="-1" max="1"/>
                <ValueRange name="minMax" min="-1" max="1"/>
                <ValueRange name="startStop" min="-1" max="1"/>
              </ParamRange>
              <Param name="Is Key" T="BOOL" default="0" value="0"/>
              <Param name="Black BG" T="BOOL" default="0" value="0"/>
            </Params>
            <InputRect orientation="0">
              <v x="${inputX}" y="${inputY}"/>
              <v x="${inputX + inputWidth}" y="${inputY}"/>
              <v x="${inputX + inputWidth}" y="${inputY + inputHeight}"/>
              <v x="${inputX}" y="${inputY + inputHeight}"/>
            </InputRect>
            <OutputRect orientation="0">
              <v x="${outputX}" y="${outputY}"/>
              <v x="${outputX + outputWidth}" y="${outputY}"/>
              <v x="${outputX + outputWidth}" y="${outputY + outputHeight}"/>
              <v x="${outputX}" y="${outputY + outputHeight}"/>
            </OutputRect>
            <Warper>
              <Params name="Warper">
                <ParamChoice name="Point Mode" default="PM_LINEAR" value="PM_LINEAR" storeChoices="0"/>
                <Param name="Flip" T="UINT8" default="0" value="0"/>
              </Params>
              <BezierWarper controlWidth="4" controlHeight="4">
                <vertices>
                  ${warperVertices}
                </vertices>
              </BezierWarper>
              <Homography>
                <src>
                  <v x="${outputX}" y="${outputY}"/>
                  <v x="${outputX + outputWidth}" y="${outputY}"/>
                  <v x="${outputX + outputWidth}" y="${
          outputY + outputHeight
        }"/>
                  <v x="${outputX}" y="${outputY + outputHeight}"/>
                </src>
                <dst>
                  <v x="${outputX}" y="${outputY}"/>
                  <v x="${outputX + outputWidth}" y="${outputY}"/>
                  <v x="${outputX + outputWidth}" y="${
          outputY + outputHeight
        }"/>
                  <v x="${outputX}" y="${outputY + outputHeight}"/>
                </dst>
              </Homography>
            </Warper>
          </Slice>`;
      })
      .join("");
  }, [layoutConfig.paineis, exportConfig.layerOffset]);

  // Gerar vértices do BezierWarper (sistema de correção geométrica)
  const generateWarperVertices = useCallback((x, y, width, height) => {
    const vertices = [];

    // Grid 4x4 de vértices para correção geométrica
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const vertexX = x + (col * width) / 3;
        const vertexY = y + (row * height) / 3;
        vertices.push(`<v x="${vertexX}" y="${vertexY}"/>`);
      }
    }

    return vertices.join("\n                  ");
  }, []);

  // Calcular bounds do layout
  const calculateLayoutBounds = useCallback(() => {
    if (layoutConfig.paineis.length === 0) {
      return { width: 1920, height: 1080, minX: 0, minY: 0 };
    }

    const baseScale = 0.2;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    layoutConfig.paineis.forEach((panel) => {
      const realX = panel.x / baseScale;
      const realY = panel.y / baseScale;
      const realMaxX = realX + panel.pixelsWidth;
      const realMaxY = realY + panel.pixelsHeight;

      minX = Math.min(minX, realX);
      minY = Math.min(minY, realY);
      maxX = Math.max(maxX, realMaxX);
      maxY = Math.max(maxY, realMaxY);
    });

    return {
      width: Math.ceil(maxX - minX),
      height: Math.ceil(maxY - minY),
      minX: Math.floor(minX),
      minY: Math.floor(minY),
    };
  }, [layoutConfig.paineis]);

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #2d3748, #4a5568)",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        border: "1px solid #4a5568",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <h4
        style={{
          color: "#fff",
          marginBottom: 16,
          fontSize: "1em",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🎭 Exportar para Resolume Arena
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          fontSize: "0.9em",
          marginBottom: "16px",
        }}
      >
        {/* Configurações do Projeto */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label
              style={{
                color: "#e2e8f0",
                fontSize: "0.85em",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Nome do Projeto:
            </label>
            <input
              type="text"
              value={exportConfig.projectName}
              onChange={(e) =>
                setExportConfig((prev) => ({
                  ...prev,
                  projectName: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #4a5568",
                background: "#2d3748",
                color: "#e2e8f0",
                fontSize: "0.85em",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "#e2e8f0",
                fontSize: "0.85em",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Nome da Tela:
            </label>
            <input
              type="text"
              value={exportConfig.screenName}
              onChange={(e) =>
                setExportConfig((prev) => ({
                  ...prev,
                  screenName: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #4a5568",
                background: "#2d3748",
                color: "#e2e8f0",
                fontSize: "0.85em",
              }}
            />
          </div>
        </div>

        {/* Configurações do Canvas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#e2e8f0",
                  fontSize: "0.85em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Canvas Width:
              </label>
              <input
                type="number"
                value={exportConfig.canvasWidth}
                onChange={(e) =>
                  setExportConfig((prev) => ({
                    ...prev,
                    canvasWidth: Number(e.target.value),
                  }))
                }
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #4a5568",
                  background: "#2d3748",
                  color: "#e2e8f0",
                  fontSize: "0.85em",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#e2e8f0",
                  fontSize: "0.85em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Canvas Height:
              </label>
              <input
                type="number"
                value={exportConfig.canvasHeight}
                onChange={(e) =>
                  setExportConfig((prev) => ({
                    ...prev,
                    canvasHeight: Number(e.target.value),
                  }))
                }
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #4a5568",
                  background: "#2d3748",
                  color: "#e2e8f0",
                  fontSize: "0.85em",
                }}
              />
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e2e8f0",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={exportConfig.includeWarping}
              onChange={(e) =>
                setExportConfig((prev) => ({
                  ...prev,
                  includeWarping: e.target.checked,
                }))
              }
              style={{
                accentColor: "#3b82f6",
                transform: "scale(1.1)",
              }}
            />
            <span>🔧 Incluir sistema de warping</span>
          </label>
        </div>
      </div>

      {/* Informações do Layout */}
      <div
        style={{
          padding: 12,
          background: "#1a202c",
          borderRadius: 8,
          fontSize: "0.8em",
          color: "#a0aec0",
          marginBottom: "16px",
        }}
      >
        <div style={{ marginBottom: 4 }}>
          📊 <strong>Layout Atual:</strong> {layoutConfig.paineis.length}{" "}
          painéis
        </div>
        <div>
          📐 <strong>Bounds Calculados:</strong>{" "}
          {(() => {
            const bounds = calculateLayoutBounds();
            return `${bounds.width}×${bounds.height}px`;
          })()}{" "}
          | Offset: {exportConfig.layerOffset.x}, {exportConfig.layerOffset.y}
        </div>
      </div>

      {/* Botão de Exportação */}
      <button
        onClick={generateResolumeXML}
        disabled={layoutConfig.paineis.length === 0}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 8,
          border: "none",
          background:
            layoutConfig.paineis.length === 0
              ? "#374151"
              : "linear-gradient(145deg, #7c3aed, #5b21b6)",
          color: "#fff",
          cursor: layoutConfig.paineis.length === 0 ? "not-allowed" : "pointer",
          fontSize: "1em",
          fontWeight: "600",
          opacity: layoutConfig.paineis.length === 0 ? 0.5 : 1,
          transition: "all 0.2s ease",
        }}
        title="Exportar layout como arquivo XML do Resolume Arena"
      >
        🎭 Exportar para Resolume Arena (.xml)
      </button>
    </div>
  );
}

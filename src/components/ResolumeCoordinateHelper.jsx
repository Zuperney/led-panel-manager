import { useState, useCallback } from "react";

export default function ResolumeCoordinateHelper({
  layoutConfig,
  onCoordinateUpdate,
  onFeedback,
}) {
  const [helperConfig, setHelperConfig] = useState({
    resolumeCanvasWidth: 4320,
    resolumeCanvasHeight: 3840,
    offsetX: 0,
    offsetY: 0,
    scaleFactor: 1.0,
    flipX: false,
    flipY: false,
  });

  // Converter coordenadas do nosso sistema para Resolume
  const convertToResolume = useCallback(
    (panel) => {
      const baseScale = 0.2; // Escala do nosso sistema visual

      // Posição real em pixels
      let realX = panel.x / baseScale;
      let realY = panel.y / baseScale;

      // Aplicar transformações
      if (helperConfig.flipX) {
        realX = helperConfig.resolumeCanvasWidth - realX - panel.pixelsWidth;
      }
      if (helperConfig.flipY) {
        realY = helperConfig.resolumeCanvasHeight - realY - panel.pixelsHeight;
      }

      // Aplicar offset e escala
      realX = realX * helperConfig.scaleFactor + helperConfig.offsetX;
      realY = realY * helperConfig.scaleFactor + helperConfig.offsetY;

      return {
        x: Math.round(realX),
        y: Math.round(realY),
        width: Math.round(panel.pixelsWidth * helperConfig.scaleFactor),
        height: Math.round(panel.pixelsHeight * helperConfig.scaleFactor),
      };
    },
    [helperConfig]
  );

  // Converter coordenadas do Resolume para nosso sistema
  const convertFromResolume = useCallback(
    (resolumeX, resolumeY, width, height) => {
      const baseScale = 0.2;

      // Remover offset e escala
      let realX = (resolumeX - helperConfig.offsetX) / helperConfig.scaleFactor;
      let realY = (resolumeY - helperConfig.offsetY) / helperConfig.scaleFactor;

      // Reverter flip
      if (helperConfig.flipX) {
        realX =
          helperConfig.resolumeCanvasWidth -
          realX -
          width / helperConfig.scaleFactor;
      }
      if (helperConfig.flipY) {
        realY =
          helperConfig.resolumeCanvasHeight -
          realY -
          height / helperConfig.scaleFactor;
      }

      // Converter para coordenadas visuais
      return {
        x: realX * baseScale,
        y: realY * baseScale,
        visualWidth: (width / helperConfig.scaleFactor) * baseScale,
        visualHeight: (height / helperConfig.scaleFactor) * baseScale,
      };
    },
    [helperConfig]
  );

  // Aplicar configurações de coordenadas
  const applyCoordinateTransform = useCallback(() => {
    if (!layoutConfig.paineis || layoutConfig.paineis.length === 0) {
      if (onFeedback) {
        onFeedback("⚠️ Nenhum painel no layout para transformar!");
      }
      return;
    }

    const transformedPanels = layoutConfig.paineis.map((panel) => {
      const resolumeCoords = convertToResolume(panel);
      const backConverted = convertFromResolume(
        resolumeCoords.x,
        resolumeCoords.y,
        resolumeCoords.width,
        resolumeCoords.height
      );

      return {
        ...panel,
        x: backConverted.x,
        y: backConverted.y,
        width: backConverted.visualWidth,
        height: backConverted.visualHeight,
        resolume: {
          ...panel.resolume,
          transformedCoords: resolumeCoords,
        },
      };
    });

    const newLayoutConfig = {
      ...layoutConfig,
      paineis: transformedPanels,
    };

    if (onCoordinateUpdate) {
      onCoordinateUpdate(newLayoutConfig);
    }

    if (onFeedback) {
      onFeedback(
        "🔄 Coordenadas transformadas para compatibilidade com Resolume!"
      );
    }
  }, [
    layoutConfig,
    convertToResolume,
    convertFromResolume,
    onCoordinateUpdate,
    onFeedback,
  ]);

  // Auto-ajustar baseado no layout atual
  const autoAdjust = useCallback(() => {
    if (!layoutConfig.paineis || layoutConfig.paineis.length === 0) return;

    const baseScale = 0.2;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    // Calcular bounds
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

    const layoutWidth = maxX - minX;
    const layoutHeight = maxY - minY;

    // Calcular escala para caber no canvas do Resolume
    const scaleX = helperConfig.resolumeCanvasWidth / layoutWidth;
    const scaleY = helperConfig.resolumeCanvasHeight / layoutHeight;
    const optimalScale = Math.min(scaleX, scaleY, 1.0); // Não aumentar além de 1:1

    // Calcular offset para centralizar
    const finalWidth = layoutWidth * optimalScale;
    const finalHeight = layoutHeight * optimalScale;
    const centerX = (helperConfig.resolumeCanvasWidth - finalWidth) / 2;
    const centerY = (helperConfig.resolumeCanvasHeight - finalHeight) / 2;

    setHelperConfig((prev) => ({
      ...prev,
      scaleFactor: optimalScale,
      offsetX: centerX - minX * optimalScale,
      offsetY: centerY - minY * optimalScale,
    }));

    if (onFeedback) {
      onFeedback(
        `🎯 Auto-ajuste: escala ${optimalScale.toFixed(
          3
        )}, centralizado no canvas!`
      );
    }
  }, [
    layoutConfig.paineis,
    helperConfig.resolumeCanvasWidth,
    helperConfig.resolumeCanvasHeight,
    onFeedback,
  ]);

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #7c2d12, #a16207)",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        border: "1px solid #a16207",
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
        🎯 Assistente de Coordenadas Resolume
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
        {/* Canvas e Posicionamento */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#fbbf24",
                  fontSize: "0.85em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Canvas Width:
              </label>
              <input
                type="number"
                value={helperConfig.resolumeCanvasWidth}
                onChange={(e) =>
                  setHelperConfig((prev) => ({
                    ...prev,
                    resolumeCanvasWidth: Number(e.target.value),
                  }))
                }
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #a16207",
                  background: "#451a03",
                  color: "#fbbf24",
                  fontSize: "0.85em",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#fbbf24",
                  fontSize: "0.85em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Canvas Height:
              </label>
              <input
                type="number"
                value={helperConfig.resolumeCanvasHeight}
                onChange={(e) =>
                  setHelperConfig((prev) => ({
                    ...prev,
                    resolumeCanvasHeight: Number(e.target.value),
                  }))
                }
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #a16207",
                  background: "#451a03",
                  color: "#fbbf24",
                  fontSize: "0.85em",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#fbbf24",
                  fontSize: "0.85em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Offset X:
              </label>
              <input
                type="number"
                value={helperConfig.offsetX}
                onChange={(e) =>
                  setHelperConfig((prev) => ({
                    ...prev,
                    offsetX: Number(e.target.value),
                  }))
                }
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #a16207",
                  background: "#451a03",
                  color: "#fbbf24",
                  fontSize: "0.85em",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#fbbf24",
                  fontSize: "0.85em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Offset Y:
              </label>
              <input
                type="number"
                value={helperConfig.offsetY}
                onChange={(e) =>
                  setHelperConfig((prev) => ({
                    ...prev,
                    offsetY: Number(e.target.value),
                  }))
                }
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #a16207",
                  background: "#451a03",
                  color: "#fbbf24",
                  fontSize: "0.85em",
                }}
              />
            </div>
          </div>
        </div>

        {/* Transformações */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label
              style={{
                color: "#fbbf24",
                fontSize: "0.85em",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Fator de Escala:
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="5.0"
              value={helperConfig.scaleFactor}
              onChange={(e) =>
                setHelperConfig((prev) => ({
                  ...prev,
                  scaleFactor: Number(e.target.value),
                }))
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #a16207",
                background: "#451a03",
                color: "#fbbf24",
                fontSize: "0.85em",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#fbbf24",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={helperConfig.flipX}
                onChange={(e) =>
                  setHelperConfig((prev) => ({
                    ...prev,
                    flipX: e.target.checked,
                  }))
                }
                style={{
                  accentColor: "#f59e0b",
                  transform: "scale(1.1)",
                }}
              />
              <span>🔄 Flip X</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#fbbf24",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={helperConfig.flipY}
                onChange={(e) =>
                  setHelperConfig((prev) => ({
                    ...prev,
                    flipY: e.target.checked,
                  }))
                }
                style={{
                  accentColor: "#f59e0b",
                  transform: "scale(1.1)",
                }}
              />
              <span>🔄 Flip Y</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview das transformações */}
      {layoutConfig.paineis && layoutConfig.paineis.length > 0 && (
        <div
          style={{
            padding: 12,
            background: "#451a03",
            borderRadius: 8,
            fontSize: "0.8em",
            color: "#fbbf24",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <strong>📊 Preview das Coordenadas:</strong>
          </div>
          {layoutConfig.paineis.slice(0, 3).map((panel, index) => {
            const resolumeCoords = convertToResolume(panel);
            return (
              <div key={index} style={{ marginBottom: 4, fontSize: "0.75em" }}>
                <strong>{panel.nome}:</strong> {Math.round(panel.x / 0.2)},{" "}
                {Math.round(panel.y / 0.2)}→ {resolumeCoords.x},{" "}
                {resolumeCoords.y} (Resolume)
              </div>
            );
          })}
          {layoutConfig.paineis.length > 3 && (
            <div style={{ fontSize: "0.75em", fontStyle: "italic" }}>
              ... e mais {layoutConfig.paineis.length - 3} painéis
            </div>
          )}
        </div>
      )}

      {/* Botões de ação */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={autoAdjust}
          disabled={!layoutConfig.paineis || layoutConfig.paineis.length === 0}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 6,
            border: "none",
            background:
              !layoutConfig.paineis || layoutConfig.paineis.length === 0
                ? "#374151"
                : "linear-gradient(145deg, #f59e0b, #d97706)",
            color: "#000",
            cursor:
              !layoutConfig.paineis || layoutConfig.paineis.length === 0
                ? "not-allowed"
                : "pointer",
            fontSize: "0.9em",
            fontWeight: "600",
            opacity:
              !layoutConfig.paineis || layoutConfig.paineis.length === 0
                ? 0.5
                : 1,
          }}
        >
          🎯 Auto-Ajustar
        </button>

        <button
          onClick={applyCoordinateTransform}
          disabled={!layoutConfig.paineis || layoutConfig.paineis.length === 0}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 6,
            border: "none",
            background:
              !layoutConfig.paineis || layoutConfig.paineis.length === 0
                ? "#374151"
                : "linear-gradient(145deg, #dc2626, #b91c1c)",
            color: "#fff",
            cursor:
              !layoutConfig.paineis || layoutConfig.paineis.length === 0
                ? "not-allowed"
                : "pointer",
            fontSize: "0.9em",
            fontWeight: "600",
            opacity:
              !layoutConfig.paineis || layoutConfig.paineis.length === 0
                ? 0.5
                : 1,
          }}
        >
          🔄 Aplicar Transformação
        </button>
      </div>
    </div>
  );
}

import { useState, useRef, useCallback } from "react";

export default function PanelLayoutEditor({
  availablePanels, // Painéis disponíveis do projeto
  layoutConfig,
  onLayoutUpdate,
  selectedPanel,
  onPanelSelect,
  onFeedback,
}) {
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPanel, setDragPanel] = useState(null);

  const { canvasSize, zoom, gridSnap } = layoutConfig;
  const viewBoxWidth = canvasSize.width;
  const viewBoxHeight = canvasSize.height;

  // Tamanho do grid para snap
  const gridSize = 50;

  // Cores para diferentes painéis
  const panelColors = [
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  // Calcular bounding box dos painéis posicionados em PIXELS reais
  const calculateBoundingBox = useCallback(() => {
    if (layoutConfig.paineis.length === 0) {
      return { width: 0, height: 0, minX: 0, minY: 0 };
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    layoutConfig.paineis.forEach((panel) => {
      // Converter coordenadas do canvas visual para pixels reais
      const baseScale = 0.2; // Mesma escala usada na criação dos painéis
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
  }, [layoutConfig.paineis]);

  // Snap to grid
  const snapToGrid = useCallback(
    (value) => {
      if (!gridSnap) return value;
      return Math.round(value / gridSize) * gridSize;
    },
    [gridSnap, gridSize]
  );

  // Drag handlers
  const handleMouseDown = useCallback(
    (panel, e) => {
      e.preventDefault();
      setIsDragging(true);
      setDragPanel(panel);
      setDragStart({ x: e.clientX, y: e.clientY });
      onPanelSelect?.(panel);
    },
    [onPanelSelect]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !dragPanel) return;

      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newX = snapToGrid(dragPanel.x + deltaX / zoom);
      const newY = snapToGrid(dragPanel.y + deltaY / zoom);

      const updatedPanels = layoutConfig.paineis.map((p) =>
        p.id === dragPanel.id ? { ...p, x: newX, y: newY } : p
      );

      onLayoutUpdate({
        ...layoutConfig,
        paineis: updatedPanels,
      });

      setDragStart({ x: e.clientX, y: e.clientY });
      setDragPanel({ ...dragPanel, x: newX, y: newY });
    },
    [
      isDragging,
      dragPanel,
      dragStart,
      zoom,
      snapToGrid,
      layoutConfig,
      onLayoutUpdate,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragPanel(null);
  }, []);

  // Render grid
  const renderGrid = () => {
    const gridLines = [];
    const step = gridSize;

    for (let x = 0; x <= viewBoxWidth; x += step) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={viewBoxHeight}
          stroke="#2a2d3a"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }

    for (let y = 0; y <= viewBoxHeight; y += step) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={viewBoxWidth}
          y2={y}
          stroke="#2a2d3a"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }

    return <g>{gridLines}</g>;
  };

  // Render bounding box
  const renderBoundingBox = () => {
    if (layoutConfig.paineis.length === 0) return null;

    const boundingBox = calculateBoundingBox();
    const baseScale = 0.2;

    return (
      <rect
        x={boundingBox.minX * baseScale}
        y={boundingBox.minY * baseScale}
        width={boundingBox.width * baseScale}
        height={boundingBox.height * baseScale}
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeDasharray="10,5"
        opacity="0.8"
      />
    );
  };

  // Render panel in canvas
  const renderPanelInCanvas = (panel, index) => {
    const color = panelColors[index % panelColors.length];
    const isSelected = selectedPanel?.id === panel.id;

    return (
      <g key={panel.id}>
        {/* Sombra */}
        <rect
          x={panel.x + 4}
          y={panel.y + 4}
          width={panel.width}
          height={panel.height}
          fill="#00000040"
          rx="4"
        />

        {/* Painel */}
        <rect
          x={panel.x}
          y={panel.y}
          width={panel.width}
          height={panel.height}
          fill={isSelected ? `${color}60` : `${color}30`}
          stroke={isSelected ? "#fff" : color}
          strokeWidth={isSelected ? "3" : "2"}
          rx="4"
          style={{ cursor: "move" }}
          onMouseDown={(e) => handleMouseDown(panel, e)}
        />

        {/* Nome do painel */}
        <text
          x={panel.x + panel.width / 2}
          y={panel.y + panel.height / 2 - 8}
          textAnchor="middle"
          fill="#fff"
          fontSize="14"
          fontWeight="600"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {panel.nome}
        </text>

        {/* Resolução */}
        <text
          x={panel.x + panel.width / 2}
          y={panel.y + panel.height / 2 + 8}
          textAnchor="middle"
          fill="#e2e8f0"
          fontSize="11"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {panel.pixelsWidth}×{panel.pixelsHeight}px
        </text>

        {/* Indicadores de canto */}
        <circle
          cx={panel.x + 8}
          cy={panel.y + 8}
          r="3"
          fill={color}
          opacity="0.6"
        />
        <circle
          cx={panel.x + panel.width - 8}
          cy={panel.y + 8}
          r="3"
          fill={color}
          opacity="0.6"
        />
        <circle
          cx={panel.x + 8}
          cy={panel.y + panel.height - 8}
          r="3"
          fill={color}
          opacity="0.6"
        />
        <circle
          cx={panel.x + panel.width - 8}
          cy={panel.y + panel.height - 8}
          r="3"
          fill={color}
          opacity="0.6"
        />
      </g>
    );
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        gap: 16,
        overflow: "hidden",
      }}
    >
      {/* Área principal com canvas e painel lateral */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flex: 1,
          overflow: "hidden",
          padding: "0 0 8px 0",
        }}
      >
        {/* Canvas Principal */}
        <div
          style={{
            flex: 2,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              border: "2px solid #3a4161",
              borderRadius: 8,
              background: "#1a1d29",
              overflow: "hidden",
              flex: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                maxWidth: `${viewBoxWidth * zoom}px`,
                maxHeight: `${viewBoxHeight * zoom}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "100%",
                  cursor: "default",
                  display: "block",
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Grid de fundo */}
                {renderGrid()}

                {/* Bounding box do layout final */}
                {renderBoundingBox()}

                {/* Painéis no canvas */}
                {layoutConfig.paineis.map((panel, index) =>
                  renderPanelInCanvas(panel, index)
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Painel Lateral - Lista de Painéis */}
        <div
          style={{
            flex: 1,
            minWidth: 280,
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#23283a",
              borderRadius: 12,
              padding: 16,
              flex: 1,
              overflow: "auto",
            }}
          >
            <h4 style={{ color: "#fff", marginBottom: 16 }}>
              📦 Painéis Disponíveis
            </h4>

            {/* Lista de painéis disponíveis */}
            {availablePanels && availablePanels.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {availablePanels.map((panel, index) => {
                  const color = panelColors[index % panelColors.length];
                  const isInCanvas = layoutConfig.paineis.some(
                    (p) => p.painelRef === panel.nome
                  );

                  return (
                    <div
                      key={`${panel.nome}-${index}`}
                      style={{
                        background: isInCanvas ? "#1e3a2e" : "#2a2d3a",
                        borderRadius: 8,
                        padding: 12,
                        border: `2px solid ${
                          isInCanvas ? "#10b981" : "#3a4161"
                        }`,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      title={
                        isInCanvas
                          ? "Painel já está no canvas"
                          : "Clique para adicionar ao canvas"
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: color,
                          }}
                        />
                        <span
                          style={{
                            color: "#fff",
                            fontWeight: "600",
                            flex: 1,
                          }}
                        >
                          {panel.nome}
                        </span>
                        {isInCanvas && (
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              background: "#374151",
                              color: "#9ca3af",
                              fontSize: "0.75em",
                            }}
                          >
                            ✓ No Canvas
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: "0.8em",
                          color: "#b6c1e0",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 4,
                        }}
                      >
                        <div>
                          📐 {panel.pixelsLargura}×{panel.pixelsAltura}
                        </div>
                        <div>
                          📏 {panel.largura.toFixed(2)}m×
                          {panel.altura.toFixed(2)}m
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
            ) : (
              <div
                style={{
                  padding: 20,
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "0.9em",
                }}
              >
                Nenhum painel disponível no projeto selecionado
              </div>
            )}
          </div>

          {/* Informações do painel selecionado */}
          {selectedPanel && (
            <div
              style={{
                background: "#23283a",
                borderRadius: 12,
                padding: 16,
                marginTop: 16,
                flexShrink: 0,
              }}
            >
              <h4 style={{ color: "#fff", marginBottom: 12 }}>
                🎯 Painel Selecionado
              </h4>
              <div
                style={{
                  fontSize: "0.9em",
                  color: "#b6c1e0",
                  lineHeight: 1.5,
                }}
              >
                <div>
                  <strong>{selectedPanel.nome}</strong>
                </div>
                <div>
                  Posição: {selectedPanel.x}, {selectedPanel.y}
                </div>
                <div>
                  Visual: {selectedPanel.width}×{selectedPanel.height}px
                </div>
                <div>
                  Pixels: {selectedPanel.pixelsWidth}×
                  {selectedPanel.pixelsHeight}
                </div>
                <div>
                  Físico: {selectedPanel.physicalWidth}×
                  {selectedPanel.physicalHeight}m
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

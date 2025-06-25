import { useState, useRef, useCallback } from "react";

export default function PanelLayoutEditor({ 
  availablePanels, // Painéis disponíveis do projeto
  layoutConfig, 
  onLayoutUpdate,
  selectedPanel,
  onPanelSelect,
  onFeedback 
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
  const panelColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

  // Converter coordenadas do SVG
  const getSvgCoordinates = useCallback((event) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * viewBoxWidth;
    const y = ((event.clientY - rect.top) / rect.height) * viewBoxHeight;
    
    return { x, y };
  }, [viewBoxWidth, viewBoxHeight]);

  // Aplicar snap ao grid
  const snapToGrid = useCallback((x, y) => {
    if (!gridSnap) return { x, y };
    
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [gridSnap, gridSize]);

  // Iniciar drag
  const handleMouseDown = useCallback((event, panel) => {
    event.preventDefault();
    event.stopPropagation();
    
    const coords = getSvgCoordinates(event);
    setDragStart(coords);
    setDragPanel(panel);
    setIsDragging(true);
    onPanelSelect(panel);
  }, [getSvgCoordinates, onPanelSelect]);

  // Durante o drag
  const handleMouseMove = useCallback((event) => {
    if (!isDragging || !dragPanel) return;

    const coords = getSvgCoordinates(event);
    const deltaX = coords.x - dragStart.x;
    const deltaY = coords.y - dragStart.y;
    
    const newX = Math.max(0, Math.min(canvasSize.width - dragPanel.width, dragPanel.x + deltaX));
    const newY = Math.max(0, Math.min(canvasSize.height - dragPanel.height, dragPanel.y + deltaY));
    
    const snappedPos = snapToGrid(newX, newY);
    
    const updatedPanel = {
      ...dragPanel,
      x: snappedPos.x,
      y: snappedPos.y
    };

    // Atualizar a posição do painel no layout
    const updatedPanels = layoutConfig.paineis.map(p => 
      p.id === dragPanel.id ? updatedPanel : p
    );

    onLayoutUpdate({
      ...layoutConfig,
      paineis: updatedPanels
    });

    setDragPanel(updatedPanel);
  }, [isDragging, dragPanel, dragStart, getSvgCoordinates, snapToGrid, canvasSize, layoutConfig, onLayoutUpdate]);

  // Finalizar drag
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragPanel(null);
  }, []);

  // Adicionar painel ao canvas
  const addPanelToCanvas = (panel) => {
    // Encontrar posição livre
    let x = 50, y = 50;
    const step = 100;
    
    // Verificar se a posição está ocupada
    while (layoutConfig.paineis.some(p => 
      Math.abs(p.x - x) < step && Math.abs(p.y - y) < step
    )) {
      x += step;
      if (x > canvasSize.width - panel.largura * 100) {
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
      width: panel.largura * 100, // Converter metros para pixels (escala 1m = 100px)
      height: panel.altura * 100,
      pixelsWidth: panel.pixelsLargura,
      pixelsHeight: panel.pixelsAltura,
      rotation: 0
    };

    onLayoutUpdate({
      ...layoutConfig,
      paineis: [...layoutConfig.paineis, newPanelInCanvas]
    });

    if (onFeedback) {
      onFeedback(`Painel "${panel.nome}" adicionado ao canvas!`);
    }
  };

  // Remover painel do canvas
  const removePanelFromCanvas = (panelId) => {
    const updatedPanels = layoutConfig.paineis.filter(p => p.id !== panelId);
    onLayoutUpdate({
      ...layoutConfig,
      paineis: updatedPanels
    });
    
    if (selectedPanel?.id === panelId) {
      onPanelSelect(null);
    }
  };

  // Renderizar grid de fundo
  const renderGrid = () => {
    if (!gridSnap) return null;

    const lines = [];
    const strokeColor = "#2a2d3a";
    
    // Linhas verticais
    for (let x = 0; x <= viewBoxWidth; x += gridSize) {
      lines.push(
        <line
          key={`v${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={viewBoxHeight}
          stroke={strokeColor}
          strokeWidth="1"
        />
      );
    }
    
    // Linhas horizontais
    for (let y = 0; y <= viewBoxHeight; y += gridSize) {
      lines.push(
        <line
          key={`h${y}`}
          x1={0}
          y1={y}
          x2={viewBoxWidth}
          y2={y}
          stroke={strokeColor}
          strokeWidth="1"
        />
      );
    }
    
    return <g>{lines}</g>;
  };

  // Renderizar painel no canvas
  const renderPanelInCanvas = (panel, index) => {
    const isSelected = selectedPanel?.id === panel.id;
    const color = panelColors[index % panelColors.length];

    return (
      <g key={panel.id}>
        {/* Retângulo do painel */}
        <rect
          x={panel.x}
          y={panel.y}
          width={panel.width}
          height={panel.height}
          fill={`${color}40`}
          stroke={isSelected ? "#fff" : color}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray={isSelected ? "5,5" : "none"}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={(e) => handleMouseDown(e, panel)}
        />
        
        {/* Label do painel */}
        <text
          x={panel.x + panel.width / 2}
          y={panel.y + panel.height / 2 - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="14"
          fontWeight="bold"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {panel.nome}
        </text>
        
        {/* Resolução */}
        <text
          x={panel.x + panel.width / 2}
          y={panel.y + panel.height / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ccc"
          fontSize="10"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {panel.pixelsWidth}×{panel.pixelsHeight}
        </text>
        
        {/* Botão remover (apenas para painel selecionado) */}
        {isSelected && (
          <circle
            cx={panel.x + panel.width - 10}
            cy={panel.y + 10}
            r="8"
            fill="#dc2626"
            stroke="#fff"
            strokeWidth="2"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              removePanelFromCanvas(panel.id);
            }}
          />
        )}
        {isSelected && (
          <text
            x={panel.x + panel.width - 10}
            y={panel.y + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="10"
            fontWeight="bold"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            ✕
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {/* Canvas Principal */}
      <div style={{ flex: 2 }}>
        <div style={{ 
          background: "#23283a", 
          borderRadius: 12, 
          padding: 16,
          marginBottom: 16 
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: 16 
          }}>
            <h4 style={{ color: "#fff", margin: 0 }}>🎨 Layout dos Painéis</h4>
            
            {/* Controles */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 4,
                color: "#b6c1e0",
                fontSize: "0.9em"
              }}>
                <input
                  type="checkbox"
                  checked={gridSnap}
                  onChange={(e) => onLayoutUpdate({
                    ...layoutConfig,
                    gridSnap: e.target.checked
                  })}
                />
                Grid Snap
              </label>
              
              <select
                value={zoom}
                onChange={(e) => onLayoutUpdate({
                  ...layoutConfig,
                  zoom: parseFloat(e.target.value)
                })}
                style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  border: "1px solid #3a4161",
                  background: "#1a1d29",
                  color: "#fff",
                  fontSize: "0.9em"
                }}
              >
                <option value={0.5}>50%</option>
                <option value={0.75}>75%</option>
                <option value={1}>100%</option>
                <option value={1.25}>125%</option>
                <option value={1.5}>150%</option>
              </select>
            </div>
          </div>

          <div style={{ 
            border: "2px solid #3a4161",
            borderRadius: 8,
            background: "#1a1d29",
            overflow: "auto",
            maxHeight: "600px"
          }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              style={{
                width: `${viewBoxWidth * zoom}px`,
                height: `${viewBoxHeight * zoom}px`,
                minWidth: "400px",
                minHeight: "300px",
                cursor: "default"
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Grid de fundo */}
              {renderGrid()}
              
              {/* Painéis no canvas */}
              {layoutConfig.paineis.map((panel, index) => 
                renderPanelInCanvas(panel, index)
              )}
            </svg>
          </div>
          
          {/* Informações do canvas */}
          <div style={{
            marginTop: 12,
            fontSize: "0.8em",
            color: "#9ca3af",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <div>
              Canvas: {canvasSize.width}×{canvasSize.height}px • 
              Painéis: {layoutConfig.paineis.length} • 
              Zoom: {Math.round(zoom * 100)}%
            </div>
            <div>
              💡 Arraste os painéis para posicioná-los • Clique para selecionar
            </div>
          </div>
        </div>
      </div>

      {/* Painel Lateral - Lista de Painéis */}
      <div style={{ flex: 1, minWidth: 300 }}>
        <div style={{
          background: "#23283a",
          borderRadius: 12,
          padding: 16
        }}>
          <h4 style={{ color: "#fff", marginBottom: 12 }}>📱 Painéis Disponíveis</h4>
          
          {availablePanels.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 20,
              color: '#9ca3af',
              fontSize: '0.9em'
            }}>
              Nenhum painel encontrado no projeto.<br/>
              Crie painéis na aba "Painéis".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {availablePanels.map((panel, index) => {
                const isInCanvas = layoutConfig.paineis.some(p => p.painelRef === panel.nome);
                
                return (
                  <div
                    key={panel.nome}
                    style={{
                      background: isInCanvas ? "#1f2937" : "#1a1d29",
                      border: isInCanvas ? "1px solid #10b981" : "1px solid #374151",
                      borderRadius: 8,
                      padding: 12,
                      opacity: isInCanvas ? 0.7 : 1
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: 8 
                    }}>
                      <div style={{ 
                        fontWeight: 600, 
                        color: "#fff", 
                        fontSize: "0.95em"
                      }}>
                        {panel.nome}
                      </div>
                      
                      {!isInCanvas ? (
                        <button
                          onClick={() => addPanelToCanvas(panel)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 4,
                            border: "none",
                            background: "#10b981",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "0.75em"
                          }}
                          title="Adicionar ao canvas"
                        >
                          ➕
                        </button>
                      ) : (
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          background: "#374151",
                          color: "#9ca3af",
                          fontSize: "0.75em"
                        }}>
                          ✓ No Canvas
                        </span>
                      )}
                    </div>

                    <div style={{ 
                      fontSize: "0.8em",
                      color: "#b6c1e0",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 4
                    }}>
                      <div>📐 {panel.pixelsLargura}×{panel.pixelsAltura}</div>
                      <div>📏 {panel.largura.toFixed(2)}m×{panel.altura.toFixed(2)}m</div>
                      <div>📦 {panel.gabinete}</div>
                      <div>🔢 {(panel.pixelsLargura * panel.pixelsAltura).toLocaleString()} px</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informações do painel selecionado */}
        {selectedPanel && (
          <div style={{
            background: "#23283a",
            borderRadius: 12,
            padding: 16,
            marginTop: 16
          }}>
            <h4 style={{ color: "#fff", marginBottom: 12 }}>🎯 Painel Selecionado</h4>
            <div style={{ 
              fontSize: "0.9em",
              color: "#b6c1e0",
              lineHeight: 1.5
            }}>
              <div><strong>{selectedPanel.nome}</strong></div>
              <div>Posição: {selectedPanel.x}, {selectedPanel.y}</div>
              <div>Tamanho: {selectedPanel.width}×{selectedPanel.height}px</div>
              <div>Resolução: {selectedPanel.pixelsWidth}×{selectedPanel.pixelsHeight}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

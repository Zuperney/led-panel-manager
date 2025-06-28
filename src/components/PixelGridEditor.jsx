import { useState, useRef, useCallback } from "react";

export default function PixelGridEditor({
  painelConfig,
  mappingConfig,
  onMappingUpdate,
  previewMode = "grid",
  selectedZone,
  onZoneSelect,
  onZoneUpdate,
}) {
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragZone, setDragZone] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { pixelsLargura: width, pixelsAltura: height } = painelConfig;
  const viewBoxWidth = 800;
  const viewBoxHeight = (height / width) * viewBoxWidth;
  const pixelSize = viewBoxWidth / width;

  // Cores modernas com glassmorphism
  const zoneColors = [
    "#3B82F6", // Blue
    "#F59E0B", // Orange
    "#22C55E", // Green
    "#A855F7", // Purple
    "#EF4444", // Red
    "#EC4899", // Pink
  ];

  const universeColors = [
    "rgba(59, 130, 246, 0.15)", // Blue/15
    "rgba(245, 158, 11, 0.15)", // Orange/15
    "rgba(34, 197, 94, 0.15)", // Green/15
    "rgba(168, 85, 247, 0.15)", // Purple/15
    "rgba(239, 68, 68, 0.15)", // Red/15
    "rgba(236, 72, 153, 0.15)", // Pink/15
  ];

  // Converter coordenadas do SVG para coordenadas de pixel
  const svgToPixel = useCallback(
    (svgX, svgY) => {
      return {
        x: Math.floor((svgX / viewBoxWidth) * width),
        y: Math.floor((svgY / viewBoxHeight) * height),
      };
    },
    [width, height, viewBoxWidth, viewBoxHeight]
  );

  // Converter coordenadas de pixel para SVG
  const pixelToSvg = useCallback(
    (pixelX, pixelY) => {
      return {
        x: (pixelX / width) * viewBoxWidth,
        y: (pixelY / height) * viewBoxHeight,
      };
    },
    [width, height, viewBoxWidth, viewBoxHeight]
  );

  // Obter coordenadas do mouse no SVG
  const getSvgCoordinates = useCallback(
    (event) => {
      if (!svgRef.current) return { x: 0, y: 0 };

      const rect = svgRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * viewBoxWidth;
      const y = ((event.clientY - rect.top) / rect.height) * viewBoxHeight;

      return { x, y };
    },
    [viewBoxWidth, viewBoxHeight]
  );

  // Iniciar drag/resize
  const handleMouseDown = useCallback(
    (event, zone, handle = null) => {
      event.preventDefault();
      event.stopPropagation();

      const coords = getSvgCoordinates(event);
      setDragStart(coords);
      setDragZone(zone);

      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
      } else {
        setIsDragging(true);
      }

      onZoneSelect(zone);
    },
    [getSvgCoordinates, onZoneSelect]
  );

  // Durante o drag/resize
  const handleMouseMove = useCallback(
    (event) => {
      if (!isDragging && !isResizing) return;
      if (!dragZone) return;

      const coords = getSvgCoordinates(event);
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;

      const pixelDelta = svgToPixel(deltaX, deltaY);

      let updatedZone = { ...dragZone };

      if (isDragging) {
        // Mover zona
        updatedZone.x = Math.max(
          0,
          Math.min(width - updatedZone.width, dragZone.x + pixelDelta.x)
        );
        updatedZone.y = Math.max(
          0,
          Math.min(height - updatedZone.height, dragZone.y + pixelDelta.y)
        );
      } else if (isResizing && resizeHandle) {
        // Redimensionar zona
        const minSize = 10;

        switch (resizeHandle) {
          case "se": // Southeast
            updatedZone.width = Math.max(
              minSize,
              Math.min(width - dragZone.x, dragZone.width + pixelDelta.x)
            );
            updatedZone.height = Math.max(
              minSize,
              Math.min(height - dragZone.y, dragZone.height + pixelDelta.y)
            );
            break;
          case "sw": // Southwest
            const newWidth = dragZone.width - pixelDelta.x;
            if (newWidth >= minSize && dragZone.x + pixelDelta.x >= 0) {
              updatedZone.x = dragZone.x + pixelDelta.x;
              updatedZone.width = newWidth;
            }
            updatedZone.height = Math.max(
              minSize,
              Math.min(height - dragZone.y, dragZone.height + pixelDelta.y)
            );
            break;
          case "ne": // Northeast
            updatedZone.width = Math.max(
              minSize,
              Math.min(width - dragZone.x, dragZone.width + pixelDelta.x)
            );
            const newHeight = dragZone.height - pixelDelta.y;
            if (newHeight >= minSize && dragZone.y + pixelDelta.y >= 0) {
              updatedZone.y = dragZone.y + pixelDelta.y;
              updatedZone.height = newHeight;
            }
            break;
          case "nw": // Northwest
            const newWidthNW = dragZone.width - pixelDelta.x;
            const newHeightNW = dragZone.height - pixelDelta.y;
            if (newWidthNW >= minSize && dragZone.x + pixelDelta.x >= 0) {
              updatedZone.x = dragZone.x + pixelDelta.x;
              updatedZone.width = newWidthNW;
            }
            if (newHeightNW >= minSize && dragZone.y + pixelDelta.y >= 0) {
              updatedZone.y = dragZone.y + pixelDelta.y;
              updatedZone.height = newHeightNW;
            }
            break;
        }
      }

      onZoneUpdate(updatedZone);
    },
    [
      isDragging,
      isResizing,
      dragZone,
      dragStart,
      getSvgCoordinates,
      svgToPixel,
      width,
      height,
      resizeHandle,
      onZoneUpdate,
    ]
  );

  // Finalizar drag/resize
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDragZone(null);
    setResizeHandle(null);
  }, []);

  // Criar nova zona com clique duplo
  const handleDoubleClick = useCallback(
    (event) => {
      if (previewMode !== "zones") return;

      const coords = getSvgCoordinates(event);
      const pixelCoords = svgToPixel(coords.x, coords.y);

      const newZone = {
        id: Date.now(),
        nome: `Zona ${mappingConfig.zonas.length + 1}`,
        x: Math.max(0, Math.min(width - 50, pixelCoords.x - 25)),
        y: Math.max(0, Math.min(height - 50, pixelCoords.y - 25)),
        width: 50,
        height: 50,
        universeStart: mappingConfig.configuracoes.universoInicial,
        pixelStart: 0,
      };

      onMappingUpdate({
        ...mappingConfig,
        zonas: [...mappingConfig.zonas, newZone],
      });
    },
    [
      previewMode,
      getSvgCoordinates,
      svgToPixel,
      width,
      height,
      mappingConfig,
      onMappingUpdate,
    ]
  );

  // Renderizar zona como retângulo editável
  const renderZone = (zone, index) => {
    const svgPos = pixelToSvg(zone.x, zone.y);
    const svgSize = {
      width: (zone.width / width) * viewBoxWidth,
      height: (zone.height / height) * viewBoxHeight,
    };

    const isSelected = selectedZone?.id === zone.id;
    const color = zoneColors[index % zoneColors.length];

    return (
      <g key={zone.id}>
        {/* Retângulo da zona */}
        <rect
          x={svgPos.x}
          y={svgPos.y}
          width={svgSize.width}
          height={svgSize.height}
          fill={`${color}40`}
          stroke={isSelected ? "#fff" : color}
          strokeWidth={isSelected ? 2 : 1}
          strokeDasharray={isSelected ? "5,5" : "none"}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          onMouseDown={(e) => handleMouseDown(e, zone)}
        />

        {/* Label da zona */}
        <text
          x={svgPos.x + svgSize.width / 2}
          y={svgPos.y + svgSize.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {zone.nome}
        </text>

        {/* Handles de redimensionamento (apenas para zona selecionada) */}
        {isSelected && (
          <>
            {["nw", "ne", "sw", "se"].map((handle) => {
              const handleSize = 8;
              let handleX, handleY;

              switch (handle) {
                case "nw":
                  handleX = svgPos.x - handleSize / 2;
                  handleY = svgPos.y - handleSize / 2;
                  break;
                case "ne":
                  handleX = svgPos.x + svgSize.width - handleSize / 2;
                  handleY = svgPos.y - handleSize / 2;
                  break;
                case "sw":
                  handleX = svgPos.x - handleSize / 2;
                  handleY = svgPos.y + svgSize.height - handleSize / 2;
                  break;
                case "se":
                  handleX = svgPos.x + svgSize.width - handleSize / 2;
                  handleY = svgPos.y + svgSize.height - handleSize / 2;
                  break;
              }

              return (
                <rect
                  key={handle}
                  x={handleX}
                  y={handleY}
                  width={handleSize}
                  height={handleSize}
                  fill="#fff"
                  stroke="#000"
                  strokeWidth={1}
                  style={{ cursor: `${handle}-resize` }}
                  onMouseDown={(e) => handleMouseDown(e, zone, handle)}
                />
              );
            })}
          </>
        )}
      </g>
    );
  };

  // Renderizar universos como background
  const renderUniverses = () => {
    if (previewMode !== "universes") return null;

    return mappingConfig.universos.map((universo, index) => {
      const color = universeColors[index % universeColors.length];
      const startPixel = universo.startPixel;
      const endPixel = universo.endPixel;

      // Calcular retângulos para este universo
      const rects = [];
      for (let pixel = startPixel; pixel <= endPixel; pixel++) {
        const x = pixel % width;
        const y = Math.floor(pixel / width);

        if (y < height) {
          const svgPos = pixelToSvg(x, y);
          rects.push(
            <rect
              key={pixel}
              x={svgPos.x}
              y={svgPos.y}
              width={pixelSize}
              height={pixelSize}
              fill={color}
              stroke="none"
            />
          );
        }
      }

      return <g key={universo.id}>{rects}</g>;
    });
  };

  return (
    <div
      style={{
        position: "relative",
        userSelect: "none",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
        backdropFilter: "blur(16px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Header com modo atual */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              background: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "8px",
              color: "#3B82F6",
              fontSize: "0.875rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {previewMode === "zones" && "🎯 Modo Zonas"}
            {previewMode === "universes" && "🌐 Modo Universos"}
            {previewMode === "grid" && "⬜ Modo Grid"}
          </div>

          <div
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.875rem",
            }}
          >
            {width}×{height} pixels
          </div>
        </div>

        {/* Status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            background: "rgba(34, 197, 94, 0.15)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "6px",
            color: "#22C55E",
            fontSize: "0.75rem",
            fontWeight: "500",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#22C55E",
            }}
          ></div>
          Pronto
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "800px",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)",
          backdropFilter: "blur(8px)",
          cursor: previewMode === "zones" ? "crosshair" : "default",
          transition: "all 0.3s ease",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      >
        {/* Grid de fundo melhorado */}
        <defs>
          <pattern
            id="grid"
            width={pixelSize}
            height={pixelSize}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width={pixelSize}
              height={pixelSize}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Gradiente para zonas */}
          <linearGradient id="zoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "rgba(255, 255, 255, 0.2)", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "rgba(255, 255, 255, 0.05)", stopOpacity: 1 }}
            />
          </linearGradient>

          {/* Filtro de brilho para hover */}
          <filter id="brightness">
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="1.2" />
            </feComponentTransfer>
          </filter>
        </defs>

        <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#grid)" />

        {/* Renderizar universos como background */}
        {renderUniverses()}

        {/* Renderizar zonas */}
        {previewMode === "zones" &&
          mappingConfig.zonas.map((zone, index) => renderZone(zone, index))}
      </svg>

      {/* Informações da zona selecionada */}
      {selectedZone && previewMode === "zones" && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#23283a",
            padding: 12,
            borderRadius: 8,
            color: "#fff",
            fontSize: "0.85em",
            minWidth: 200,
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>
            {selectedZone.nome}
          </div>
          <div>
            Posição: {selectedZone.x}, {selectedZone.y}
          </div>
          <div>
            Tamanho: {selectedZone.width} × {selectedZone.height}
          </div>
          <div>Pixels: {selectedZone.width * selectedZone.height}</div>
        </div>
      )}

      {/* Instruções */}
      <div
        style={{
          marginTop: 12,
          fontSize: "0.8em",
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        {previewMode === "zones" && (
          <div>
            💡 <strong>Modo Zonas:</strong> Clique duplo para criar zona •
            Arraste para mover • Use as alças para redimensionar
          </div>
        )}
        {previewMode === "universes" && (
          <div>
            🌐 <strong>Modo Universos:</strong> Visualização dos universos DMX
            mapeados
          </div>
        )}
        {previewMode === "grid" && (
          <div>
            ⬜ <strong>Modo Grid:</strong> Visualização básica do grid de pixels
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Estados para configurações de exportação
  const [exportConfig, setExportConfig] = useState({
    showSubdivisions: true,
    showDimensions: true,
    highQuality: true,
    includeBackground: true,
    exportScale: 2,
    subdivisionGrid: 16 // Grid NxN de subdivisões
  });
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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

  // Confirmar layout final
  const confirmLayout = useCallback(() => {
    if (layoutConfig.paineis.length === 0) {
      if (onFeedback) {
        onFeedback(
          "⚠️ Adicione pelo menos um painel ao canvas para confirmar o layout!"
        );
      }
      return;
    }

    const boundingBox = calculateBoundingBox();
    setIsConfirmed(true);

    if (onFeedback) {
      onFeedback(
        `✅ Layout confirmado! Resolução final: ${boundingBox.width}×${boundingBox.height}px`
      );
    }

    // Atualizar o layout com informações do bounding box
    onLayoutUpdate({
      ...layoutConfig,
      finalResolution: boundingBox,
      isConfirmed: true,
    });
  }, [layoutConfig, calculateBoundingBox, onFeedback, onLayoutUpdate]);

  // Gerar preview da exportação sem fazer download
  const generatePreview = useCallback(async () => {
    if (layoutConfig.paineis.length === 0) {
      setPreviewImage(null);
      return;
    }

    try {
      const boundingBox = calculateBoundingBox();
      
      // Função para criar subdivisões (simplificada para preview)
      const createPanelSubdivisions = (panel, realX, realY) => {
        if (!exportConfig.showSubdivisions) return '';
        
        const subdivisions = [];
        const gridDivisions = exportConfig.subdivisionGrid;
        const subWidth = panel.pixelsWidth / gridDivisions;
        const subHeight = panel.pixelsHeight / gridDivisions;
        
        const fineOpacity = Math.max(0.05, 0.15 - (gridDivisions - 8) * 0.01);
        const fineStrokeWidth = Math.max(0.1, 0.3 - (gridDivisions - 8) * 0.01);
        
        for (let i = 0; i <= gridDivisions; i++) {
          const x = realX + (i * subWidth);
          subdivisions.push(`
            <line x1="${x}" y1="${realY}" x2="${x}" y2="${realY + panel.pixelsHeight}"
                  stroke="#ffffff" stroke-width="${fineStrokeWidth}" opacity="${fineOpacity}"/>
          `);
        }
        for (let j = 0; j <= gridDivisions; j++) {
          const y = realY + (j * subHeight);
          subdivisions.push(`
            <line x1="${realX}" y1="${y}" x2="${realX + panel.pixelsWidth}" y2="${y}"
                  stroke="#ffffff" stroke-width="${fineStrokeWidth}" opacity="${fineOpacity}"/>
          `);
        }
        
        subdivisions.push(`
          <line x1="${realX + panel.pixelsWidth/2}" y1="${realY}" 
                x2="${realX + panel.pixelsWidth/2}" y2="${realY + panel.pixelsHeight}"
                stroke="#ffffff" stroke-width="1.2" opacity="0.5"/>
          <line x1="${realX}" y1="${realY + panel.pixelsHeight/2}" 
                x2="${realX + panel.pixelsWidth}" y2="${realY + panel.pixelsHeight/2}"
                stroke="#ffffff" stroke-width="1.2" opacity="0.5"/>
        `);
        
        return subdivisions.join('');
      };
      
      // Reutilizar a mesma lógica da exportação mas sem download
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" 
             width="${boundingBox.width}" 
             height="${boundingBox.height}" 
             viewBox="${boundingBox.minX} ${boundingBox.minY} ${
        boundingBox.width
      } ${boundingBox.height}">
          <defs>
            <style>
              .panel-text { 
                font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif; 
                font-weight: 600;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
              }
              .panel-name { 
                font-size: ${exportConfig.highQuality ? '32px' : '24px'}; 
                fill: white; 
                letter-spacing: 1.2px;
              }
              .panel-resolution { 
                font-size: ${exportConfig.highQuality ? '20px' : '16px'}; 
                fill: #e2e8f0; 
                opacity: 0.95;
              }
              .panel-info { 
                font-size: ${exportConfig.highQuality ? '16px' : '12px'}; 
                fill: #cbd5e1; 
                opacity: 0.85;
              }
            </style>
          </defs>
          
          ${exportConfig.includeBackground ? `
          <defs>
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#1a202c;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
            </radialGradient>
            <pattern id="gridPattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#334155" stroke-width="0.3" opacity="0.4"/>
            </pattern>
            <pattern id="majorGridPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#475569" stroke-width="0.6" opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgGradient)"/>
          <rect width="100%" height="100%" fill="url(#gridPattern)"/>
          <rect width="100%" height="100%" fill="url(#majorGridPattern)"/>
          ` : `
          <rect width="100%" height="100%" fill="#0f172a"/>
          `}
          
          ${layoutConfig.paineis
            .map((panel, index) => {
              const color = panelColors[index % panelColors.length];
              const baseScale = 0.2;
              const realX = panel.x / baseScale - boundingBox.minX;
              const realY = panel.y / baseScale - boundingBox.minY;

              return `
              <g>
                <rect x="${realX + 4}" y="${realY + 4}" 
                      width="${panel.pixelsWidth}" height="${panel.pixelsHeight}"
                      fill="#00000040" rx="4"/>
                
                <rect x="${realX}" y="${realY}" 
                      width="${panel.pixelsWidth}" height="${panel.pixelsHeight}"
                      fill="${color}30" stroke="${color}" stroke-width="3" rx="4"/>
                
                ${createPanelSubdivisions(panel, realX, realY)}
                
                <text x="${realX + panel.pixelsWidth / 2}" y="${realY + panel.pixelsHeight / 2 - 20}"
                      text-anchor="middle" dominant-baseline="middle"
                      class="panel-text panel-name">${panel.nome}</text>
                      
                <text x="${realX + panel.pixelsWidth / 2}" y="${realY + panel.pixelsHeight / 2 + 8}"
                      text-anchor="middle" dominant-baseline="middle"
                      class="panel-text panel-resolution">${panel.pixelsWidth}×${panel.pixelsHeight} px</text>
                
                ${panel.largura && panel.altura && exportConfig.showDimensions ? `
                <text x="${realX + panel.pixelsWidth / 2}" y="${realY + panel.pixelsHeight / 2 + 28}"
                      text-anchor="middle" dominant-baseline="middle"
                      class="panel-text panel-info">${(panel.largura).toFixed(2)}×${(panel.altura).toFixed(2)} m</text>
                ` : ''}
                
                <circle cx="${realX + 8}" cy="${realY + 8}" r="3" fill="${color}" opacity="0.6"/>
                <circle cx="${realX + panel.pixelsWidth - 8}" cy="${realY + 8}" r="3" fill="${color}" opacity="0.6"/>
                <circle cx="${realX + 8}" cy="${realY + panel.pixelsHeight - 8}" r="3" fill="${color}" opacity="0.6"/>
                <circle cx="${realX + panel.pixelsWidth - 8}" cy="${realY + panel.pixelsHeight - 8}" r="3" fill="${color}" opacity="0.6"/>
              </g>
            `;
            })
            .join("")}
        </svg>
      `;

      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      setPreviewImage(url);
      
    } catch (error) {
      console.error("Erro ao gerar preview:", error);
      setPreviewImage(null);
    }
  }, [layoutConfig.paineis, calculateBoundingBox, panelColors, exportConfig]);

  // Exportar layout como PNG
  const exportToPNG = useCallback(async () => {
    if (!isConfirmed && layoutConfig.paineis.length === 0) {
      if (onFeedback) {
        onFeedback("⚠️ Confirme o layout antes de exportar!");
      }
      return;
    }

    try {
      const boundingBox = calculateBoundingBox();

      // Função para criar subdivisões avançadas de um painel (como no Pixel Grid)
      const createPanelSubdivisions = (panel, realX, realY) => {
        if (!exportConfig.showSubdivisions) return '';
        
        const subdivisions = [];
        const gridDivisions = exportConfig.subdivisionGrid; // Configurável
        const subWidth = panel.pixelsWidth / gridDivisions;
        const subHeight = panel.pixelsHeight / gridDivisions;
        
        // Grid fino de subdivisões (mais transparente)
        const fineOpacity = Math.max(0.05, 0.15 - (gridDivisions - 8) * 0.01); // Menos opaco para grids maiores
        const fineStrokeWidth = Math.max(0.1, 0.3 - (gridDivisions - 8) * 0.01);
        
        for (let i = 0; i <= gridDivisions; i++) {
          const x = realX + (i * subWidth);
          subdivisions.push(`
            <line x1="${x}" y1="${realY}" x2="${x}" y2="${realY + panel.pixelsHeight}"
                  stroke="#ffffff" stroke-width="${fineStrokeWidth}" opacity="${fineOpacity}"/>
          `);
        }
        for (let j = 0; j <= gridDivisions; j++) {
          const y = realY + (j * subHeight);
          subdivisions.push(`
            <line x1="${realX}" y1="${y}" x2="${realX + panel.pixelsWidth}" y2="${y}"
                  stroke="#ffffff" stroke-width="${fineStrokeWidth}" opacity="${fineOpacity}"/>
          `);
        }
        
        // Divisões de 4x4 ou da metade do grid (mais visíveis)
        const midDivisions = Math.max(4, Math.floor(gridDivisions / 4));
        for (let i = 0; i <= midDivisions; i++) {
          const x = realX + (i * panel.pixelsWidth / midDivisions);
          subdivisions.push(`
            <line x1="${x}" y1="${realY}" x2="${x}" y2="${realY + panel.pixelsHeight}"
                  stroke="#ffffff" stroke-width="0.6" opacity="0.25"/>
          `);
        }
        for (let j = 0; j <= midDivisions; j++) {
          const y = realY + (j * panel.pixelsHeight / midDivisions);
          subdivisions.push(`
            <line x1="${realX}" y1="${y}" x2="${realX + panel.pixelsWidth}" y2="${y}"
                  stroke="#ffffff" stroke-width="0.6" opacity="0.25"/>
          `);
        }
        
        // Divisões principais (quadrantes - mais destacadas)
        subdivisions.push(`
          <line x1="${realX + panel.pixelsWidth/2}" y1="${realY}" 
                x2="${realX + panel.pixelsWidth/2}" y2="${realY + panel.pixelsHeight}"
                stroke="#ffffff50" stroke-width="1.2"/>
          <line x1="${realX}" y1="${realY + panel.pixelsHeight/2}" 
                x2="${realX + panel.pixelsWidth}" y2="${realY + panel.pixelsHeight/2}"
                stroke="#ffffff50" stroke-width="1.2"/>
        `);
        
        // Pontos de referência nos cantos dos quadrantes (adapta ao grid)
        const refPoints = Math.min(6, Math.max(3, Math.floor(gridDivisions / 4))); // Entre 3 e 6 pontos
        const stepWidth = panel.pixelsWidth / refPoints;
        const stepHeight = panel.pixelsHeight / refPoints;
        
        for (let i = 1; i < refPoints; i++) {
          for (let j = 1; j < refPoints; j++) {
            subdivisions.push(`
              <circle cx="${realX + i * stepWidth}" cy="${realY + j * stepHeight}" 
                      r="1.2" fill="#ffffff" opacity="0.4"/>
            `);
          }
        }
        
        return subdivisions.join('');
      };

      // Criar um SVG temporário com apenas os painéis no bounding box
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" 
             width="${boundingBox.width}" 
             height="${boundingBox.height}" 
             viewBox="${boundingBox.minX} ${boundingBox.minY} ${
        boundingBox.width
      } ${boundingBox.height}">
          <defs>
            <style>
              .panel-text { 
                font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif; 
                font-weight: 600;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
              }
              .panel-name { 
                font-size: ${exportConfig.highQuality ? '32px' : '24px'}; 
                fill: white; 
                letter-spacing: 1.2px;
              }
              .panel-resolution { 
                font-size: ${exportConfig.highQuality ? '20px' : '16px'}; 
                fill: #e2e8f0; 
                opacity: 0.95;
              }
              .panel-info { 
                font-size: ${exportConfig.highQuality ? '16px' : '12px'}; 
                fill: #cbd5e1; 
                opacity: 0.85;
              }
            </style>
          </defs>
          
          ${exportConfig.includeBackground ? `
          <!-- Fundo com gradiente aprimorado -->
          <defs>
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#1a202c;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
            </radialGradient>
            <pattern id="gridPattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#334155" stroke-width="0.3" opacity="0.4"/>
            </pattern>
            <pattern id="majorGridPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#475569" stroke-width="0.6" opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgGradient)"/>
          <rect width="100%" height="100%" fill="url(#gridPattern)"/>
          <rect width="100%" height="100%" fill="url(#majorGridPattern)"/>
          ` : `
          <rect width="100%" height="100%" fill="#0f172a"/>
          `}
          
          ${layoutConfig.paineis
            .map((panel, index) => {
              const color = panelColors[index % panelColors.length];
              // Converter coordenadas do canvas visual para pixels reais
              const baseScale = 0.2; // Mesma escala usada na criação dos painéis
              const realX = panel.x / baseScale - boundingBox.minX;
              const realY = panel.y / baseScale - boundingBox.minY;

              return `
              <g>
                <!-- Sombra do painel -->
                <rect x="${realX + 4}" y="${realY + 4}" 
                      width="${panel.pixelsWidth}" height="${panel.pixelsHeight}"
                      fill="#00000040" rx="4"/>
                
                <!-- Painel principal -->
                <rect x="${realX}" y="${realY}" 
                      width="${panel.pixelsWidth}" height="${panel.pixelsHeight}"
                      fill="${color}30" stroke="${color}" stroke-width="3" rx="4"/>
                
                <!-- Subdivisões tipo Pixel Grid -->
                ${createPanelSubdivisions(panel, realX, realY)}
                
                <!-- Informações do painel com melhor layout -->
                <text x="${realX + panel.pixelsWidth / 2}" y="${realY + panel.pixelsHeight / 2 - 20}"
                      text-anchor="middle" dominant-baseline="middle"
                      class="panel-text panel-name">${panel.nome}</text>
                      
                <text x="${realX + panel.pixelsWidth / 2}" y="${realY + panel.pixelsHeight / 2 + 8}"
                      text-anchor="middle" dominant-baseline="middle"
                      class="panel-text panel-resolution">${panel.pixelsWidth}×${panel.pixelsHeight} px</text>
                
                <!-- Informações adicionais -->
                ${panel.largura && panel.altura && exportConfig.showDimensions ? `
                <text x="${realX + panel.pixelsWidth / 2}" y="${realY + panel.pixelsHeight / 2 + 28}"
                      text-anchor="middle" dominant-baseline="middle"
                      class="panel-text panel-info">${(panel.largura).toFixed(2)}×${(panel.altura).toFixed(2)} m</text>
                ` : ''}
                
                <!-- Cantos arredondados decorativos -->
                <circle cx="${realX + 8}" cy="${realY + 8}" r="3" fill="${color}" opacity="0.6"/>
                <circle cx="${realX + panel.pixelsWidth - 8}" cy="${realY + 8}" r="3" fill="${color}" opacity="0.6"/>
                <circle cx="${realX + 8}" cy="${realY + panel.pixelsHeight - 8}" r="3" fill="${color}" opacity="0.6"/>
                <circle cx="${realX + panel.pixelsWidth - 8}" cy="${realY + panel.pixelsHeight - 8}" r="3" fill="${color}" opacity="0.6"/>
              </g>
            `;
            })
            .join("")}
        </svg>
      `;

      // Converter SVG para PNG usando canvas em alta resolução
      const scale = exportConfig.exportScale; // Usar escala configurável
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Configurar canvas para alta qualidade
      canvas.width = boundingBox.width * scale;
      canvas.height = boundingBox.height * scale;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Escalar o contexto para alta resolução
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        // Fazer download da imagem em alta qualidade
        canvas.toBlob((blob) => {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
          a.download = `layout_paineis_${boundingBox.width}x${boundingBox.height}_${timestamp}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);

          if (onFeedback) {
            onFeedback("🎨 Layout exportado como PNG em alta qualidade!");
          }
        }, 'image/png', 1.0); // Máxima qualidade PNG

        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error("Erro ao exportar PNG:", error);
      if (onFeedback) {
        onFeedback("❌ Erro ao exportar layout como PNG!");
      }
    }
  }, [
    isConfirmed,
    layoutConfig.paineis,
    calculateBoundingBox,
    panelColors,
    exportConfig,
    onFeedback,
  ]);

  // Converter coordenadas do SVG
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

  // Aplicar snap ao grid
  const snapToGrid = useCallback(
    (x, y) => {
      if (!gridSnap) return { x, y };

      return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize,
      };
    },
    [gridSnap, gridSize]
  );

  // Snap entre painéis - detecta quando um painel está próximo da borda de outro
  const snapToPanels = useCallback(
    (draggedPanel, newX, newY) => {
      const snapDistance = 20; // Distância em pixels para ativar o snap
      let snappedX = newX;
      let snappedY = newY;
      let snapLines = []; // Linhas de guia para mostrar o snap

      // Verificar snap com outros painéis
      layoutConfig.paineis.forEach((panel) => {
        if (panel.id === draggedPanel.id) return; // Não snap consigo mesmo

        const panelLeft = panel.x;
        const panelRight = panel.x + panel.width;
        const panelTop = panel.y;
        const panelBottom = panel.y + panel.height;

        const draggedLeft = newX;
        const draggedRight = newX + draggedPanel.width;
        const draggedTop = newY;
        const draggedBottom = newY + draggedPanel.height;

        // Snap horizontal (bordas verticais)
        // Snap borda esquerda do arrastado com borda direita do painel fixo
        if (Math.abs(draggedLeft - panelRight) < snapDistance) {
          snappedX = panelRight;
          snapLines.push({ type: "vertical", x: panelRight });
        }
        // Snap borda direita do arrastado com borda esquerda do painel fixo
        else if (Math.abs(draggedRight - panelLeft) < snapDistance) {
          snappedX = panelLeft - draggedPanel.width;
          snapLines.push({ type: "vertical", x: panelLeft });
        }
        // Snap bordas esquerdas alinhadas
        else if (Math.abs(draggedLeft - panelLeft) < snapDistance) {
          snappedX = panelLeft;
          snapLines.push({ type: "vertical", x: panelLeft });
        }
        // Snap bordas direitas alinhadas
        else if (Math.abs(draggedRight - panelRight) < snapDistance) {
          snappedX = panelRight - draggedPanel.width;
          snapLines.push({ type: "vertical", x: panelRight });
        }

        // Snap vertical (bordas horizontais)
        // Snap borda superior do arrastado com borda inferior do painel fixo
        if (Math.abs(draggedTop - panelBottom) < snapDistance) {
          snappedY = panelBottom;
          snapLines.push({ type: "horizontal", y: panelBottom });
        }
        // Snap borda inferior do arrastado com borda superior do painel fixo
        else if (Math.abs(draggedBottom - panelTop) < snapDistance) {
          snappedY = panelTop - draggedPanel.height;
          snapLines.push({ type: "horizontal", y: panelTop });
        }
        // Snap bordas superiores alinhadas
        else if (Math.abs(draggedTop - panelTop) < snapDistance) {
          snappedY = panelTop;
          snapLines.push({ type: "horizontal", y: panelTop });
        }
        // Snap bordas inferiores alinhadas
        else if (Math.abs(draggedBottom - panelBottom) < snapDistance) {
          snappedY = panelBottom - draggedPanel.height;
          snapLines.push({ type: "horizontal", y: panelBottom });
        }
      });

      return { x: snappedX, y: snappedY, snapLines };
    },
    [layoutConfig.paineis]
  );

  // Estado para as linhas de snap
  const [snapLines, setSnapLines] = useState([]);

  // Iniciar drag
  const handleMouseDown = useCallback(
    (event, panel) => {
      event.preventDefault();
      event.stopPropagation();

      const coords = getSvgCoordinates(event);
      setDragStart(coords);
      setDragPanel(panel);
      setIsDragging(true);
      onPanelSelect(panel);
    },
    [getSvgCoordinates, onPanelSelect]
  );

  // Durante o drag
  const handleMouseMove = useCallback(
    (event) => {
      if (!isDragging || !dragPanel) return;

      const coords = getSvgCoordinates(event);
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;

      const newX = Math.max(
        0,
        Math.min(canvasSize.width - dragPanel.width, dragPanel.x + deltaX)
      );
      const newY = Math.max(
        0,
        Math.min(canvasSize.height - dragPanel.height, dragPanel.y + deltaY)
      );

      // Aplicar snap entre painéis primeiro
      const panelSnapped = snapToPanels(dragPanel, newX, newY);

      // Se não houve snap entre painéis e grid snap está ativo, aplicar grid snap
      let finalPos = { x: panelSnapped.x, y: panelSnapped.y };
      if (
        gridSnap &&
        (!panelSnapped.snapLines || panelSnapped.snapLines.length === 0)
      ) {
        finalPos = snapToGrid(panelSnapped.x, panelSnapped.y);
      }

      // Atualizar linhas de snap
      setSnapLines(panelSnapped.snapLines || []);

      const updatedPanel = {
        ...dragPanel,
        x: finalPos.x,
        y: finalPos.y,
      };

      // Atualizar a posição do painel no layout
      const updatedPanels = layoutConfig.paineis.map((p) =>
        p.id === dragPanel.id ? updatedPanel : p
      );

      onLayoutUpdate({
        ...layoutConfig,
        paineis: updatedPanels,
      });

      setDragPanel(updatedPanel);
    },
    [
      isDragging,
      dragPanel,
      dragStart,
      getSvgCoordinates,
      snapToGrid,
      snapToPanels,
      canvasSize,
      gridSnap,
      layoutConfig,
      onLayoutUpdate,
    ]
  );

  // Finalizar drag
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragPanel(null);
    setSnapLines([]); // Limpar linhas de snap
  }, []);

  // Adicionar painel ao canvas
  const addPanelToCanvas = (panel) => {
    // Calcular escala baseada nos pixels do painel
    // Usamos uma escala que mantém proporção mas deixa os painéis visíveis no canvas
    const baseScale = 0.2; // Escala base para visualização (1 pixel real = 0.2 pixels no canvas)
    const visualWidth = panel.pixelsLargura * baseScale;
    const visualHeight = panel.pixelsAltura * baseScale;

    // Encontrar posição livre
    let x = 50,
      y = 50;
    const step = Math.max(visualWidth, visualHeight) + 20; // Espaçamento baseado no tamanho do painel

    // Verificar se a posição está ocupada
    while (
      layoutConfig.paineis.some(
        (p) => Math.abs(p.x - x) < step && Math.abs(p.y - y) < step
      )
    ) {
      x += step;
      if (x > canvasSize.width - visualWidth) {
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
      width: visualWidth, // Largura visual proporcional aos pixels
      height: visualHeight, // Altura visual proporcional aos pixels
      pixelsWidth: panel.pixelsLargura, // Pixels reais do painel
      pixelsHeight: panel.pixelsAltura, // Pixels reais do painel
      physicalWidth: panel.largura, // Dimensões físicas em metros
      physicalHeight: panel.altura,
      rotation: 0,
    };

    onLayoutUpdate({
      ...layoutConfig,
      paineis: [...layoutConfig.paineis, newPanelInCanvas],
    });

    if (onFeedback) {
      onFeedback(`Painel "${panel.nome}" adicionado ao canvas!`);
    }
  };

  // Remover painel do canvas
  const removePanelFromCanvas = (panelId) => {
    const updatedPanels = layoutConfig.paineis.filter((p) => p.id !== panelId);
    onLayoutUpdate({
      ...layoutConfig,
      paineis: updatedPanels,
    });

    if (selectedPanel?.id === panelId) {
      onPanelSelect(null);
    }
  };

  // Renderizar bounding box (quando layout confirmado)
  const renderBoundingBox = () => {
    if (!layoutConfig.finalResolution || layoutConfig.paineis.length === 0)
      return null;

    const { minX, minY, width, height } = layoutConfig.finalResolution;

    return (
      <g>
        <rect
          x={minX}
          y={minY}
          width={width}
          height={height}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeDasharray="10,5"
          opacity="0.8"
        />
        <text
          x={minX + width / 2}
          y={minY - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#10b981"
          fontSize="12"
          fontWeight="bold"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          Layout Final: {width}×{height}px
        </text>
      </g>
    );
  };
  const renderSnapLines = () => {
    if (!isDragging || snapLines.length === 0) return null;

    return (
      <g>
        {snapLines.map((line, index) => {
          if (line.type === "vertical") {
            return (
              <line
                key={`snap-v-${index}`}
                x1={line.x}
                y1={0}
                x2={line.x}
                y2={viewBoxHeight}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              />
            );
          } else {
            return (
              <line
                key={`snap-h-${index}`}
                x1={0}
                y1={line.y}
                x2={viewBoxWidth}
                y2={line.y}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              />
            );
          }
        })}
      </g>
    );
  };
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
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
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
          style={{ pointerEvents: "none", userSelect: "none" }}
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
          style={{ pointerEvents: "none", userSelect: "none" }}
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
            style={{ cursor: "pointer" }}
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
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            ✕
          </text>
        )}
      </g>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header com controles */}
      <div
        style={{
          background: "#23283a",
          borderRadius: 12,
          padding: 16,
          margin: 16,
          marginBottom: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ color: "#fff", margin: 0 }}>🎨 Layout dos Painéis</h4>

          {/* Controles principais */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Controles existentes */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#b6c1e0",
                fontSize: "0.9em",
              }}
            >
              <input
                type="checkbox"
                checked={gridSnap}
                onChange={(e) =>
                  onLayoutUpdate({
                    ...layoutConfig,
                    gridSnap: e.target.checked,
                  })
                }
              />
              Grid Snap
            </label>

            <select
              value={zoom}
              onChange={(e) =>
                onLayoutUpdate({
                  ...layoutConfig,
                  zoom: parseFloat(e.target.value),
                })
              }
              style={{
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid #3a4161",
                background: "#1a1d29",
                color: "#fff",
                fontSize: "0.9em",
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

            {/* Novos botões */}
            <button
              onClick={confirmLayout}
              disabled={layoutConfig.paineis.length === 0}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background:
                  layoutConfig.paineis.length === 0 ? "#374151" : "#10b981",
                color: "#fff",
                cursor:
                  layoutConfig.paineis.length === 0 ? "not-allowed" : "pointer",
                fontSize: "0.9em",
                fontWeight: "500",
                opacity: layoutConfig.paineis.length === 0 ? 0.5 : 1,
              }}
              title="Confirma o layout e calcula a resolução final"
            >
              ✅ Confirmar Layout
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={exportToPNG}
                disabled={layoutConfig.paineis.length === 0}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  background:
                    layoutConfig.paineis.length === 0 ? "#374151" : "#3b82f6",
                  color: "#fff",
                  cursor:
                    layoutConfig.paineis.length === 0 ? "not-allowed" : "pointer",
                  fontSize: "0.9em",
                  fontWeight: "500",
                  opacity: layoutConfig.paineis.length === 0 ? 0.5 : 1,
                }}
                title="Exporta o layout como imagem PNG"
              >
                🖼️ Exportar PNG
              </button>

              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                disabled={layoutConfig.paineis.length === 0}
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "none",
                  background:
                    layoutConfig.paineis.length === 0 ? "#374151" : "#6b7280",
                  color: "#fff",
                  cursor:
                    layoutConfig.paineis.length === 0 ? "not-allowed" : "pointer",
                  fontSize: "0.8em",
                  fontWeight: "500",
                  opacity: layoutConfig.paineis.length === 0 ? 0.5 : 1,
                }}
                title="Configurações de exportação"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {/* Painel de Opções de Exportação */}
        {showExportOptions && (
          <div
            style={{
              background: "linear-gradient(145deg, #2d3748, #4a5568)",
              borderRadius: 12,
              padding: 16,
              marginTop: 12,
              border: "1px solid #4a5568",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <h4 style={{ color: "#fff", marginBottom: 16, fontSize: "1em" }}>
              🎨 Opções de Exportação PNG
            </h4>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "16px",
              fontSize: "0.9em"
            }}>
              {/* Coluna 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  color: "#e2e8f0",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={exportConfig.showSubdivisions}
                    onChange={(e) => setExportConfig(prev => ({ 
                      ...prev, 
                      showSubdivisions: e.target.checked 
                    }))}
                    style={{ 
                      accentColor: "#3b82f6",
                      transform: "scale(1.1)"
                    }}
                  />
                  <span>🔲 Mostrar subdivisões</span>
                </label>

                {exportConfig.showSubdivisions && (
                  <div style={{ 
                    marginLeft: "24px", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "6px" 
                  }}>
                    <label style={{ color: "#cbd5e1", fontSize: "0.85em" }}>
                      Grid de subdivisões:
                    </label>
                    <select
                      value={exportConfig.subdivisionGrid}
                      onChange={(e) => setExportConfig(prev => ({ 
                        ...prev, 
                        subdivisionGrid: Number(e.target.value) 
                      }))}
                      style={{
                        padding: "3px 6px",
                        borderRadius: 4,
                        border: "1px solid #4a5568",
                        background: "#2d3748",
                        color: "#e2e8f0",
                        fontSize: "0.8em",
                        width: "120px"
                      }}
                    >
                      <option value={8}>8×8</option>
                      <option value={12}>12×12</option>
                      <option value={16}>16×16</option>
                      <option value={20}>20×20</option>
                      <option value={24}>24×24</option>
                      <option value={32}>32×32</option>
                    </select>
                  </div>
                )}

                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  color: "#e2e8f0",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={exportConfig.showDimensions}
                    onChange={(e) => setExportConfig(prev => ({ 
                      ...prev, 
                      showDimensions: e.target.checked 
                    }))}
                    style={{ 
                      accentColor: "#3b82f6",
                      transform: "scale(1.1)"
                    }}
                  />
                  <span>📏 Mostrar dimensões físicas</span>
                </label>

                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  color: "#e2e8f0",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={exportConfig.includeBackground}
                    onChange={(e) => setExportConfig(prev => ({ 
                      ...prev, 
                      includeBackground: e.target.checked 
                    }))}
                    style={{ 
                      accentColor: "#3b82f6",
                      transform: "scale(1.1)"
                    }}
                  />
                  <span>🌈 Incluir fundo gradiente + grid</span>
                </label>
              </div>

              {/* Coluna 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  color: "#e2e8f0",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={exportConfig.highQuality}
                    onChange={(e) => setExportConfig(prev => ({ 
                      ...prev, 
                      highQuality: e.target.checked 
                    }))}
                    style={{ 
                      accentColor: "#3b82f6",
                      transform: "scale(1.1)"
                    }}
                  />
                  <span>✨ Fonte e qualidade alta</span>
                </label>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ color: "#e2e8f0", fontSize: "0.85em" }}>
                    📐 Escala de exportação:
                  </label>
                  <select
                    value={exportConfig.exportScale}
                    onChange={(e) => setExportConfig(prev => ({ 
                      ...prev, 
                      exportScale: Number(e.target.value) 
                    }))}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: "1px solid #4a5568",
                      background: "#2d3748",
                      color: "#e2e8f0",
                      fontSize: "0.85em"
                    }}
                  >
                    <option value={1}>1x (Normal)</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x (Alta Resolução)</option>
                    <option value={3}>3x (Ultra HD)</option>
                    <option value={4}>4x (4K Ready)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview das configurações */}
            <div style={{
              marginTop: 16,
              padding: 12,
              background: "#1a202c",
              borderRadius: 8,
              fontSize: "0.8em",
              color: "#a0aec0"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: 8
              }}>
                <div>
                  <div style={{ marginBottom: 4 }}>
                    📋 <strong>Preview:</strong> Exportação {exportConfig.highQuality ? 'alta qualidade' : 'padrão'} 
                    em escala {exportConfig.exportScale}x
                    {exportConfig.includeBackground ? ' com fundo estilizado' : ' com fundo simples'}
                  </div>
                  <div>
                    {exportConfig.showSubdivisions 
                      ? `✅ Subdivisões ${exportConfig.subdivisionGrid}×${exportConfig.subdivisionGrid} ativas` 
                      : '❌ Subdivisões desabilitadas'} | 
                    {exportConfig.showDimensions ? ' ✅ Dimensões exibidas' : ' ❌ Dimensões ocultas'}
                  </div>
                </div>
                
                <button
                  onClick={generatePreview}
                  disabled={layoutConfig.paineis.length === 0}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: layoutConfig.paineis.length === 0 ? "#374151" : "#059669",
                    color: "#fff",
                    cursor: layoutConfig.paineis.length === 0 ? "not-allowed" : "pointer",
                    fontSize: "0.8em",
                    fontWeight: "500",
                    opacity: layoutConfig.paineis.length === 0 ? 0.5 : 1,
                  }}
                  title="Gerar preview da exportação"
                >
                  👁️ Preview
                </button>
              </div>
              
              {/* Preview da imagem */}
              {previewImage && (
                <div style={{
                  marginTop: 12,
                  padding: 8,
                  background: "#0f172a",
                  borderRadius: 6,
                  textAlign: "center"
                }}>
                  <img 
                    src={previewImage} 
                    alt="Preview da exportação"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: 4,
                      border: "1px solid #374151"
                    }}
                  />
                  <div style={{ 
                    fontSize: "0.75em", 
                    color: "#6b7280", 
                    marginTop: 4 
                  }}>
                    Preview da exportação PNG
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informações do canvas */}
        <div
          style={{
            fontSize: "0.8em",
            color: "#9ca3af",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div>
            Canvas: {canvasSize.width}×{canvasSize.height}px • Painéis:{" "}
            {layoutConfig.paineis.length} • Zoom: {Math.round(zoom * 100)}%
            {layoutConfig.finalResolution && (
              <span style={{ color: "#10b981", fontWeight: "600" }}>
                {" "}
                • Resolução Final: {layoutConfig.finalResolution.width}×
                {layoutConfig.finalResolution.height}px
              </span>
            )}
          </div>
          <div>
            💡 Arraste os painéis para posicioná-los • Clique para selecionar
            {layoutConfig.paineis.length > 1 &&
              " • Painéis se alinham automaticamente"}
          </div>
        </div>
      </div>

      {/* Área principal com canvas e painel lateral */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flex: 1,
          overflow: "hidden",
          padding: "0 16px 16px",
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
              overflow: "auto",
              flex: 1,
              position: "relative",
            }}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              style={{
                width: `${viewBoxWidth * zoom}px`,
                height: `${viewBoxHeight * zoom}px`,
                minWidth: `${Math.min(viewBoxWidth * zoom, 300)}px`,
                minHeight: `${Math.min(viewBoxHeight * zoom, 200)}px`,
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

              {/* Linhas de snap */}
              {renderSnapLines()}

              {/* Painéis no canvas */}
              {layoutConfig.paineis.map((panel, index) =>
                renderPanelInCanvas(panel, index)
              )}
            </svg>
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
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ color: "#fff", marginBottom: 12, flexShrink: 0 }}>
              📱 Painéis Disponíveis
            </h4>

            {availablePanels.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 20,
                  color: "#9ca3af",
                  fontSize: "0.9em",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                Nenhum painel encontrado no projeto.
                <br />
                Crie painéis na aba "Painéis".
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  overflow: "auto",
                  flex: 1,
                }}
              >
                {availablePanels.map((panel, index) => {
                  const isInCanvas = layoutConfig.paineis.some(
                    (p) => p.painelRef === panel.nome
                  );

                  return (
                    <div
                      key={panel.nome}
                      style={{
                        background: isInCanvas ? "#1f2937" : "#1a1d29",
                        border: isInCanvas
                          ? "1px solid #10b981"
                          : "1px solid #374151",
                        borderRadius: 8,
                        padding: 12,
                        opacity: isInCanvas ? 0.7 : 1,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#fff",
                            fontSize: "0.95em",
                          }}
                        >
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
                              fontSize: "0.75em",
                            }}
                            title="Adicionar ao canvas"
                          >
                            ➕
                          </button>
                        ) : (
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

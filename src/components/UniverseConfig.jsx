import { useState } from "react";

export default function UniverseConfig({ 
  universos, 
  configuracoes, 
  onUniverseUpdate, 
  onConfigUpdate,
  totalPixels 
}) {
  const [expandedUniverse, setExpandedUniverse] = useState(null);

  // Calcular universos automaticamente baseado na configuração
  const recalcularUniversos = () => {
    const universesNeeded = Math.ceil(totalPixels / configuracoes.pixelsPerUniverse);
    
    const novosUniversos = Array.from({ length: universesNeeded }, (_, i) => ({
      id: i + 1,
      universe: configuracoes.universoInicial + i,
      startPixel: i * configuracoes.pixelsPerUniverse,
      endPixel: Math.min((i + 1) * configuracoes.pixelsPerUniverse - 1, totalPixels - 1),
      protocol: configuracoes.protocoloSaida,
      enabled: true,
      ip: configuracoes.protocoloSaida === 'Art-Net' ? '2.0.0.1' : '239.255.0.1',
      port: configuracoes.protocoloSaida === 'Art-Net' ? 6454 : 5568
    }));

    onUniverseUpdate(novosUniversos);
  };

  const handleConfigChange = (field, value) => {
    const newConfig = {
      ...configuracoes,
      [field]: field === 'protocoloSaida' || field === 'rgbOrder' ? value : parseInt(value) || 1
    };
    
    onConfigUpdate(newConfig);
  };

  const handleUniverseChange = (universeId, field, value) => {
    const updatedUniversos = universos.map(u => 
      u.id === universeId 
        ? { ...u, [field]: field === 'protocol' || field === 'ip' ? value : (field === 'enabled' ? value : parseInt(value) || u[field]) }
        : u
    );
    onUniverseUpdate(updatedUniversos);
  };

  const toggleUniverseEnabled = (universeId) => {
    handleUniverseChange(universeId, 'enabled', !universos.find(u => u.id === universeId)?.enabled);
  };

  const getProtocolInfo = (protocol) => {
    switch (protocol) {
      case 'Art-Net':
        return {
          defaultPort: 6454,
          defaultIP: '2.0.0.1',
          description: 'Art-Net é o protocolo padrão para controle de iluminação profissional',
          maxChannels: 512,
          maxPixels: 170
        };
      case 'sACN':
        return {
          defaultPort: 5568,
          defaultIP: '239.255.0.1',
          description: 'sACN (E1.31) é um protocolo padrão ESTA para streaming de dados DMX',
          maxChannels: 512,
          maxPixels: 170
        };
      case 'DDP':
        return {
          defaultPort: 4048,
          defaultIP: '255.255.255.255',
          description: 'DDP é otimizado para pixels RGB, permitindo mais pixels por pacote',
          maxChannels: 1440,
          maxPixels: 480
        };
      default:
        return { defaultPort: 6454, defaultIP: '2.0.0.1', description: '', maxChannels: 512, maxPixels: 170 };
    }
  };

  const protocolInfo = getProtocolInfo(configuracoes.protocoloSaida);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Configurações Gerais */}
      <div style={{ 
        background: "#23283a", 
        borderRadius: 12, 
        padding: 16 
      }}>
        <h4 style={{ color: "#fff", marginBottom: 12 }}>⚙️ Configurações de Protocolo</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ color: "#b6c1e0", display: "block", marginBottom: 4 }}>
              Protocolo de Saída:
            </label>
            <select
              value={configuracoes.protocoloSaida}
              onChange={(e) => handleConfigChange('protocoloSaida', e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #3a4161",
                background: "#1a1d29",
                color: "#fff"
              }}
            >
              <option value="Art-Net">Art-Net</option>
              <option value="sACN">sACN (E1.31)</option>
              <option value="DDP">DDP</option>
            </select>
          </div>
          
          <div>
            <label style={{ color: "#b6c1e0", display: "block", marginBottom: 4 }}>
              Ordem RGB:
            </label>
            <select
              value={configuracoes.rgbOrder}
              onChange={(e) => handleConfigChange('rgbOrder', e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #3a4161",
                background: "#1a1d29",
                color: "#fff"
              }}
            >
              <option value="RGB">RGB</option>
              <option value="RBG">RBG</option>
              <option value="GRB">GRB</option>
              <option value="GBR">GBR</option>
              <option value="BRG">BRG</option>
              <option value="BGR">BGR</option>
            </select>
          </div>
          
          <div>
            <label style={{ color: "#b6c1e0", display: "block", marginBottom: 4 }}>
              Universo Inicial:
            </label>
            <input
              type="number"
              min="1"
              max="32768"
              value={configuracoes.universoInicial}
              onChange={(e) => handleConfigChange('universoInicial', e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #3a4161",
                background: "#1a1d29",
                color: "#fff"
              }}
            />
          </div>
          
          <div>
            <label style={{ color: "#b6c1e0", display: "block", marginBottom: 4 }}>
              Pixels por Universo:
            </label>
            <input
              type="number"
              min="1"
              max={protocolInfo.maxPixels}
              value={configuracoes.pixelsPerUniverse}
              onChange={(e) => handleConfigChange('pixelsPerUniverse', e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #3a4161",
                background: "#1a1d29",
                color: "#fff"
              }}
            />
            <div style={{ fontSize: "0.75em", color: "#9ca3af", marginTop: 4 }}>
              Máximo para {configuracoes.protocoloSaida}: {protocolInfo.maxPixels} pixels
            </div>
          </div>
        </div>

        {/* Informações do protocolo */}
        <div style={{
          background: "#1a1d29",
          borderRadius: 8,
          padding: 12,
          fontSize: "0.85em",
          color: "#b6c1e0",
          marginBottom: 16
        }}>
          <strong>{configuracoes.protocoloSaida}:</strong> {protocolInfo.description}
          <br />
          Porta padrão: {protocolInfo.defaultPort} • IP padrão: {protocolInfo.defaultIP}
        </div>

        <button
          onClick={recalcularUniversos}
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 500,
            width: "100%"
          }}
        >
          🔄 Recalcular Universos Automaticamente
        </button>
      </div>

      {/* Lista de Universos */}
      <div style={{ 
        background: "#23283a", 
        borderRadius: 12, 
        padding: 16 
      }}>
        <h4 style={{ color: "#fff", marginBottom: 12 }}>🌐 Universos DMX ({universos.length})</h4>
        
        {universos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 20,
            color: '#9ca3af'
          }}>
            Configure o protocolo e clique em "Recalcular Universos"
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {universos.map((universo, index) => {
              const isExpanded = expandedUniverse === universo.id;
              const pixelCount = universo.endPixel - universo.startPixel + 1;
              const channelCount = pixelCount * 3; // RGB
              const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
              const color = colors[index % colors.length];

              return (
                <div
                  key={universo.id}
                  style={{
                    background: "#1a1d29",
                    borderRadius: 8,
                    border: `2px solid ${universo.enabled ? color : '#374151'}`,
                    overflow: 'hidden'
                  }}
                >
                  {/* Cabeçalho do universo */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 12,
                      cursor: 'pointer',
                      background: universo.enabled ? `${color}20` : 'transparent'
                    }}
                    onClick={() => setExpandedUniverse(isExpanded ? null : universo.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          background: universo.enabled ? color : '#374151'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: "#fff" }}>
                          Universo {universo.universe}
                        </div>
                        <div style={{ fontSize: "0.8em", color: "#b6c1e0" }}>
                          {pixelCount.toLocaleString()} pixels • {channelCount} canais
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4,
                        color: '#b6c1e0',
                        fontSize: '0.85em',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={universo.enabled}
                          onChange={() => toggleUniverseEnabled(universo.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        Ativo
                      </label>
                      <span style={{ color: '#9ca3af', fontSize: '1.2em' }}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  {isExpanded && (
                    <div style={{ padding: 16, paddingTop: 0 }}>
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "1fr 1fr", 
                        gap: 12,
                        marginBottom: 12
                      }}>
                        <div>
                          <label style={{ color: "#9ca3af", fontSize: "0.8em", display: "block" }}>
                            Número do Universo:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="32768"
                            value={universo.universe}
                            onChange={(e) => handleUniverseChange(universo.id, 'universe', e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: 4,
                              border: "1px solid #374151",
                              background: "#111827",
                              color: "#fff",
                              fontSize: "0.9em"
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{ color: "#9ca3af", fontSize: "0.8em", display: "block" }}>
                            Protocolo:
                          </label>
                          <select
                            value={universo.protocol}
                            onChange={(e) => handleUniverseChange(universo.id, 'protocol', e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: 4,
                              border: "1px solid #374151",
                              background: "#111827",
                              color: "#fff",
                              fontSize: "0.9em"
                            }}
                          >
                            <option value="Art-Net">Art-Net</option>
                            <option value="sACN">sACN</option>
                            <option value="DDP">DDP</option>
                          </select>
                        </div>
                        
                        <div>
                          <label style={{ color: "#9ca3af", fontSize: "0.8em", display: "block" }}>
                            IP de Destino:
                          </label>
                          <input
                            type="text"
                            value={universo.ip || protocolInfo.defaultIP}
                            onChange={(e) => handleUniverseChange(universo.id, 'ip', e.target.value)}
                            placeholder={protocolInfo.defaultIP}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: 4,
                              border: "1px solid #374151",
                              background: "#111827",
                              color: "#fff",
                              fontSize: "0.9em"
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{ color: "#9ca3af", fontSize: "0.8em", display: "block" }}>
                            Porta:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="65535"
                            value={universo.port || protocolInfo.defaultPort}
                            onChange={(e) => handleUniverseChange(universo.id, 'port', e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: 4,
                              border: "1px solid #374151",
                              background: "#111827",
                              color: "#fff",
                              fontSize: "0.9em"
                            }}
                          />
                        </div>
                      </div>

                      {/* Informações do range de pixels */}
                      <div style={{
                        background: "#111827",
                        borderRadius: 6,
                        padding: 8,
                        fontSize: "0.8em",
                        color: "#b6c1e0"
                      }}>
                        <strong>Range de Pixels:</strong> {universo.startPixel} - {universo.endPixel}<br/>
                        <strong>Total:</strong> {pixelCount} pixels ({channelCount} canais DMX)
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Resumo geral */}
        {universos.length > 0 && (
          <div style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid #374151",
            fontSize: "0.85em",
            color: "#b6c1e0"
          }}>
            <strong>Resumo Geral:</strong><br/>
            Total de universos: {universos.length}<br/>
            Universos ativos: {universos.filter(u => u.enabled).length}<br/>
            Total de pixels: {totalPixels.toLocaleString()}<br/>
            Total de canais: {(totalPixels * 3).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';

const PainelCard = ({ 
  painel, 
  index, 
  gabinetes, 
  isSelected, 
  isRecenteAdicionado,
  onSelect, 
  onEdit, 
  onDuplicate, 
  onRemove 
}) => {
  const gabineteObj = gabinetes.find((g) => g.nome === painel.gabinete);

  return (
    <div
      className={`painel-lista-item ${isRecenteAdicionado ? "painel-novo" : ""}`}
      style={{
        cursor: "pointer",
        background: isSelected 
          ? "#2d3550"
          : isRecenteAdicionado 
            ? "#1a4d3a" 
            : "transparent",
        borderRadius: 8,
        margin: "8px 12px",
        padding: 16,
        border: isRecenteAdicionado 
          ? "2px solid #4ade80" 
          : "2px solid transparent",
        transition: "all 0.3s ease",
        position: "relative",
      }}
      onClick={() => onSelect(index, painel)}
    >
      {isRecenteAdicionado && (
        <div
          style={{
            position: "absolute",
            top: -8,
            right: 8,
            background: "#4ade80",
            color: "#000",
            fontSize: "0.75em",
            padding: "4px 8px",
            borderRadius: 12,
            fontWeight: "bold",
          }}
        >
          NOVO
        </div>
      )}
      
      <div style={{ width: "100%" }}>
        <div
          className="painel-nome"
          style={{
            fontWeight: "600",
            fontSize: "1.08em",
            color: "#fff",
            marginBottom: 4,
          }}
        >
          {painel.nome}
        </div>
        
        <div
          className="painel-tamanho"
          style={{
            fontSize: "0.95em",
            color: "#b6c1e0",
            marginBottom: 6,
          }}
        >
          {painel.largura?.toFixed(2)} m × {painel.altura?.toFixed(2)} m
        </div>
        
        <div
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginBottom: 12,
            lineHeight: 1.3,
          }}
        >
          Tipo: {gabineteObj ? gabineteObj.tipo : "-"} | Gabinete: {painel.gabinete}
        </div>
        
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            style={{
              padding: "6px 12px",
              fontSize: "0.8em",
              background: "#3b82f6",
              border: "none",
              borderRadius: 6,
              color: "white",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(index);
            }}
          >
            Editar
          </button>
          
          <button
            style={{
              padding: "6px 12px",
              fontSize: "0.8em",
              background: "#10b981",
              border: "none",
              borderRadius: 6,
              color: "white",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(index);
            }}
          >
            Duplicar
          </button>
          
          <button
            style={{
              padding: "6px 12px",
              fontSize: "0.8em",
              background: "#ef4444",
              border: "none",
              borderRadius: 6,
              color: "white",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default PainelCard;

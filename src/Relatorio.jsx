import { useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Svg,
  Rect,
  Line,
} from "@react-pdf/renderer";
import { calcularPotenciaFinal, calcularEnergia } from "./painelCalculos";

export default function Relatorio() {
  const [projetos, setProjetos] = useState([]);
  const [paineis, setPaineis] = useState([]);
  const [menuAberto, setMenuAberto] = useState(null); // index do menu aberto
  const [exportando, setExportando] = useState(null); // index do projeto exportando
  const [gabinetes, setGabinetes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3030/api/projetos")
      .then((res) => res.json())
      .then((data) => setProjetos(data));
    fetch("http://localhost:3030/api/paineis")
      .then((res) => res.json())
      .then((data) => setPaineis(data));
    fetch("http://localhost:3030/api/gabinetes")
      .then((res) => res.json())
      .then((data) => setGabinetes(data));
  }, []);

  // Funções placeholder para ações
  function marcarConcluido(proj) {
    alert(`Projeto marcado como concluído: ${proj.nome}`);
  }
  function editarProjeto(proj) {
    alert(`Editar projeto: ${proj.nome}`);
  }
  function editarPaineis(proj) {
    alert(`Editar painéis do projeto: ${proj.nome}`);
  }

  // PDF Styles
  const styles = StyleSheet.create({
    page: {
      padding: 32,
      fontSize: 13,
      fontFamily: "Helvetica",
      backgroundColor: "#181c27",
      color: "#f5f6fa",
    },
    capa: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: "#23283a",
      borderRadius: 24,
      border: "3 solid #3a4161",
      padding: 32,
      margin: 24,
      boxShadow: "0 4px 24px #0006",
    },
    titulo: {
      fontSize: 34,
      fontWeight: "bold",
      marginBottom: 18,
      textAlign: "center",
      color: "#7ec7ff",
      letterSpacing: 1.5,
      textShadow: "0 2px 8px #0008",
    },
    subtitulo: {
      fontSize: 18,
      marginBottom: 8,
      textAlign: "center",
      color: "#b6c1e0",
    },
    painelTitulo: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 12,
      color: "#7ec7ff",
    },
    bloco: {
      marginBottom: 16,
      backgroundColor: "#23283a",
      borderRadius: 14,
      border: "2 solid #3a4161",
      padding: 14,
      boxShadow: "0 2px 8px #0004",
    },
    gridLabel: {
      fontSize: 13,
      marginBottom: 4,
      color: "#b6c1e0",
      fontWeight: 600,
    },
    info: {
      marginBottom: 3,
      color: "#f5f6fa",
    },
  });

  // PDF Grid Drawing Helper
  function PainelGrid({
    largura,
    altura,
    qtdLargura,
    qtdAltura,
    legendaLargura,
    legendaAltura,
    legendaLargura2,
    legendaAltura2,
  }) {
    // Ajuste para paisagem: folha A4 landscape ~ 842 x 595pt
    const svgW = 700,
      svgH = 420;
    const margin = 40;
    largura = Number(largura) > 0 ? Number(largura) : 1;
    altura = Number(altura) > 0 ? Number(altura) : 1;
    qtdLargura = Number(qtdLargura) > 0 ? Number(qtdLargura) : 1;
    qtdAltura = Number(qtdAltura) > 0 ? Number(qtdAltura) : 1;
    const escala = Math.min(
      (svgW - 2 * margin) / largura,
      (svgH - 2 * margin) / altura
    );
    const w = largura * escala,
      h = altura * escala;
    // Centralização absoluta
    const offsetX = (svgW - w) / 2;
    const offsetY = (svgH - h) / 2;
    const mX = offsetX;
    const mY = offsetY;
    // Linhas de grid
    const lines = [];
    for (let i = 1; i < qtdLargura; i++) {
      lines.push(
        <Line
          key={"vl" + i}
          x1={mX + (w / qtdLargura) * i}
          y1={mY}
          x2={mX + (w / qtdLargura) * i}
          y2={mY + h}
          stroke="#888"
          strokeWidth={1}
        />
      );
    }
    for (let i = 1; i < qtdAltura; i++) {
      lines.push(
        <Line
          key={"hl" + i}
          x1={mX}
          y1={mY + (h / qtdAltura) * i}
          x2={mX + w}
          y2={mY + (h / qtdAltura) * i}
          stroke="#888"
          strokeWidth={1}
        />
      );
    }
    // Régua horizontal (largura)
    const rulerY = mY + h + 16;
    // Régua vertical (altura)
    const rulerX = mX - 16;
    return (
      <Svg width={svgW} height={svgH + 60}>
        <Rect
          x={mX}
          y={mY}
          width={w}
          height={h}
          stroke="#222"
          strokeWidth={2}
          fill="#f5f5f5"
        />
        {lines}
        {/* Régua horizontal */}
        <Line
          x1={mX}
          y1={rulerY}
          x2={mX + w}
          y2={rulerY}
          stroke="#7ec7ff"
          strokeWidth={2}
        />
        <Line
          x1={mX}
          y1={rulerY - 4}
          x2={mX}
          y2={rulerY + 4}
          stroke="#7ec7ff"
          strokeWidth={2}
        />
        <Line
          x1={mX + w}
          y1={rulerY - 4}
          x2={mX + w}
          y2={rulerY + 4}
          stroke="#7ec7ff"
          strokeWidth={2}
        />
        <Text
          x={mX + w / 2}
          y={rulerY + 12}
          fontSize={15}
          fill="#7ec7ff"
          textAnchor="middle"
          fontWeight="bold"
        >
          L
        </Text>
        {/* Régua vertical */}
        <Line
          x1={rulerX}
          y1={mY}
          x2={rulerX}
          y2={mY + h}
          stroke="#7ec7ff"
          strokeWidth={2}
        />
        <Line
          x1={rulerX - 4}
          y1={mY}
          x2={rulerX + 4}
          y2={mY}
          stroke="#7ec7ff"
          strokeWidth={2}
        />
        <Line
          x1={rulerX - 4}
          y1={mY + h}
          x2={rulerX + 4}
          y2={mY + h}
          stroke="#7ec7ff"
          strokeWidth={2}
        />
        <Text
          x={rulerX - 8}
          y={mY + 12}
          fontSize={15}
          fill="#7ec7ff"
          textAnchor="end"
          fontWeight="bold"
        >
          A
        </Text>
      </Svg>
    );
  }

  // PDF Document
  function ProjetoPDF({ projeto, paineisProjeto }) {
    const dataImpressao = new Date().toLocaleDateString("pt-BR");
    return (
      <Document>
        {/* Capa */}
        <Page size="A4" style={styles.page}>
          <View style={styles.capa}>
            <Text style={styles.titulo}>{projeto.nome}</Text>
            <Text style={styles.subtitulo}>
              <Svg width={60} height={6} style={{ marginBottom: 10 }}>
                <Rect x={0} y={0} width={60} height={6} fill="#7ec7ff" rx={3} />
              </Svg>
              Data de Realização:{" "}
              {projeto.dataEntrega
                ? new Date(projeto.dataEntrega).toLocaleDateString("pt-BR")
                : "-"}
            </Text>
            <Text style={styles.subtitulo}>
              Cliente: {projeto.cliente || "-"}
            </Text>
            <Text style={styles.subtitulo}>
              Data de Impressão do Documento: {dataImpressao}
            </Text>
          </View>
        </Page>
        {/* Uma página por painel */}
        {paineisProjeto.map((painel, idx) => {
          const gabinete = gabinetes.find((g) => g.nome === painel.gabinete);
          const qtdGabinetes =
            (painel.qtdLargura || 1) * (painel.qtdAltura || 1);
          // Potência máxima (100% brilho)
          const potMax = gabinete ? gabinete.potencia * qtdGabinetes : 0;
          const fatorPotencia = 0.92;
          // Usar tensão e tipo de rede do painel, se existir
          const tensaoPainel = painel.tensao || "380";
          const tipoRedePainel = painel.tipoRede || "trifasico";
          const energiaMax = calcularEnergia(
            potMax,
            tipoRedePainel,
            tensaoPainel
          );
          // Potência média (50% brilho)
          const pot50 = gabinete
            ? calcularPotenciaFinal(gabinete, qtdGabinetes, 50).P_final
            : 0;
          const energia50 = calcularEnergia(
            pot50,
            tipoRedePainel,
            tensaoPainel
          );
          // Formatação helper
          const fmt = (v, dec = 2) =>
            v !== undefined && !isNaN(v)
              ? Number(v).toLocaleString("pt-BR", {
                  minimumFractionDigits: dec,
                  maximumFractionDigits: dec,
                })
              : "-";
          return [
            <Page
              key={idx + "-info"}
              size="A4"
              style={styles.page}
              wrap={false}
              orientation="landscape"
            >
              <Text style={styles.painelTitulo}>
                Informações do Painel – {painel.nome}
              </Text>
              <View style={styles.bloco}>
                <Text style={styles.info}>Projeto: {projeto.nome}</Text>
                <Text style={styles.info}>Gabinete: {painel.gabinete}</Text>
                <Text style={styles.info}>
                  Dimensões do Painel: {fmt(painel.largura, 2)} m ×{" "}
                  {fmt(painel.altura, 2)} m
                </Text>
                <Text style={styles.info}>
                  Resolução Total: {painel.pixelsLargura} ×{" "}
                  {painel.pixelsAltura} pixels
                </Text>
                <Text style={styles.info}>
                  Área Total: {fmt(painel.area, 2)} m²
                </Text>
                <Text style={styles.info}>
                  Peso Total: {fmt(painel.peso, 0)} kg
                </Text>
              </View>
              <View style={styles.bloco}>
                <Text style={styles.info}>Composição do Painel</Text>
                <Text style={styles.info}>
                  Quantidade de Gabinetes: {qtdGabinetes} unidades
                </Text>
                <Text style={styles.info}>
                  Largura: {painel.qtdLargura} gabinetes
                </Text>
                <Text style={styles.info}>
                  Altura: {painel.qtdAltura} gabinetes
                </Text>
              </View>
              <View style={styles.bloco}>
                <Text style={styles.info}>Potência e Consumo</Text>
                <Text style={styles.gridLabel}>
                  Branco Máximo (100% de Brilho)
                </Text>
                <Text style={styles.info}>
                  Potência Total Consumida: {fmt(potMax, 0)} Watts
                </Text>
                <Text style={styles.info}>
                  Potência Aparente: {fmt(energiaMax.potenciaVA)} VA
                </Text>
                <Text style={styles.info}>
                  Corrente Elétrica Estimada ({energiaMax.descricao})
                </Text>
                <Text style={styles.info}>
                  Corrente Total: {fmt(energiaMax.corrente)} Amperes
                </Text>
                <Text style={styles.gridLabel}>
                  Consumo Médio (Brilho em 50%)
                </Text>
                <Text style={styles.info}>
                  Potência Estimada Consumida: {fmt(pot50, 0)} Watts
                </Text>
                <Text style={styles.info}>
                  Potência Aparente: {fmt(energia50.potenciaVA)} VA
                </Text>
                <Text style={styles.info}>
                  Corrente Elétrica Estimada ({energia50.descricao})
                </Text>
                <Text style={styles.info}>
                  Corrente Total: {fmt(energia50.corrente)} Amperes
                </Text>
              </View>
              <View style={styles.bloco}>
                <Text style={styles.gridLabel}>Grid (proporcional):</Text>
                <PainelGrid
                  largura={painel.largura || 1}
                  altura={painel.altura || 1}
                  qtdLargura={painel.qtdLargura || 1}
                  qtdAltura={painel.qtdAltura || 1}
                />
                <View style={{ marginTop: 18 }}>
                  <Text style={styles.gridLabel}>Legenda:</Text>
                  <Text style={styles.info}>
                    L ={" "}
                    {(painel.largura || 1).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    m / {painel.pixelsLargura || 1} px
                  </Text>
                  <Text style={styles.info}>
                    A ={" "}
                    {(painel.altura || 1).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    m / {painel.pixelsAltura || 1} px
                  </Text>
                </View>
              </View>
            </Page>,
          ];
        })}
      </Document>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Relatório de Projetos</h2>
      {projetos.length === 0 ? (
        <p>Nenhum projeto cadastrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projetos.map((proj, i) => {
            const paineisProjeto = paineis.filter(
              (p) => p.projeto === proj.nome
            );
            return (
              <li
                key={i}
                style={{
                  background: "#23283a",
                  borderRadius: 10,
                  marginBottom: 18,
                  padding: 18,
                  color: "#fff",
                  boxShadow: "0 1px 6px #0002",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "1.1em",
                      marginBottom: 6,
                    }}
                  >
                    {proj.nome}
                  </div>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 22,
                      color: "#b6c1e0",
                      marginLeft: 8,
                    }}
                    title="Ações do projeto"
                    onClick={() => setMenuAberto(menuAberto === i ? null : i)}
                  >
                    ⚙️
                  </button>
                  {menuAberto === i && (
                    <div
                      style={{
                        position: "absolute",
                        right: 18,
                        top: 38,
                        background: "#23283a",
                        border: "1px solid #444",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px #0005",
                        zIndex: 10,
                        minWidth: 180,
                      }}
                    >
                      <PDFDownloadLink
                        document={
                          <ProjetoPDF
                            projeto={proj}
                            paineisProjeto={paineisProjeto}
                          />
                        }
                        fileName={`Relatorio_${proj.nome.replace(
                          /\s+/g,
                          "_"
                        )}.pdf`}
                        style={{
                          ...menuBtnStyle,
                          color: "#222",
                          background: "#b6e0b6",
                          borderBottom: "1px solid #333",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {({ loading, url, blob }) =>
                          loading ? "Gerando PDF..." : "Exportar Relatório"
                        }
                      </PDFDownloadLink>
                      <button
                        style={menuBtnStyle}
                        onClick={() => {
                          marcarConcluido(proj);
                          setMenuAberto(null);
                        }}
                      >
                        Marcar como Concluído
                      </button>
                      <button
                        style={menuBtnStyle}
                        onClick={() => {
                          editarProjeto(proj);
                          setMenuAberto(null);
                        }}
                      >
                        Editar Projeto
                      </button>
                      <button
                        style={menuBtnStyle}
                        onClick={() => {
                          editarPaineis(proj);
                          setMenuAberto(null);
                        }}
                      >
                        Editar Painéis
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: "0.98em", marginBottom: 8 }}>
                  Cliente: {proj.cliente || "-"}
                  <br />
                  Data de Entrega:{" "}
                  {proj.dataEntrega
                    ? new Date(proj.dataEntrega).toLocaleDateString("pt-BR")
                    : "-"}
                </div>
                {paineisProjeto.length === 0 ? (
                  <div style={{ color: "#bbb", fontSize: "0.95em" }}>
                    Nenhum painel cadastrado neste projeto.
                  </div>
                ) : (
                  <ul
                    style={{ listStyle: "disc", marginLeft: 24, marginTop: 6 }}
                  >
                    {paineisProjeto.map((painel, j) => (
                      <li key={j} style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 500 }}>{painel.nome}</span> —
                        {` ${painel.largura?.toFixed(
                          2
                        )}m x ${painel.altura?.toFixed(
                          2
                        )}m, ${painel.area?.toFixed(2)}m², ${
                          painel.pixelsLargura
                        }x${painel.pixelsAltura} pixels, ${painel.peso}kg`}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const menuBtnStyle = {
  display: "block",
  width: "100%",
  background: "none",
  border: "none",
  color: "#fff",
  textAlign: "left",
  padding: "10px 16px",
  fontSize: "1em",
  cursor: "pointer",
  borderBottom: "1px solid #333",
};

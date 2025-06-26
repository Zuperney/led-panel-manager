import { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

export default function ListaMaterialModal({
  isOpen,
  onClose,
  projeto,
  onSave,
  paineisProjeto = [], // Array de painéis do projeto
}) {
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({
    item: "",
    quantidade: "",
    material: "",
    modelo: "",
    tamanho: "",
  });
  const [materiaisSalvos, setMateriaisSalvos] = useState([]);
  const [modelosSalvos, setModelosSalvos] = useState([]);
  const [tamanhosSalvos, setTamanhosSalvos] = useState([]);

  // Carregar dados salvos quando o modal abre
  useEffect(() => {
    if (isOpen && projeto) {
      // Carregar lista de material do projeto
      const listaSalva = localStorage.getItem(`listaMaterial_${projeto.nome}`);
      if (listaSalva) {
        try {
          setItens(JSON.parse(listaSalva));
        } catch (error) {
          console.error("Erro ao carregar lista de material:", error);
          setItens([]);
        }
      } else {
        setItens([]);
      }

      // Carregar materiais salvos para sugestões
      const materiaisSalvosData = localStorage.getItem("materiaisSalvos");
      if (materiaisSalvosData) {
        try {
          setMateriaisSalvos(JSON.parse(materiaisSalvosData));
        } catch (error) {
          console.error("Erro ao carregar materiais salvos:", error);
          setMateriaisSalvos([]);
        }
      }

      // Carregar modelos salvos para sugestões
      const modelosSalvosData = localStorage.getItem("modelosSalvos");
      if (modelosSalvosData) {
        try {
          setModelosSalvos(JSON.parse(modelosSalvosData));
        } catch (error) {
          console.error("Erro ao carregar modelos salvos:", error);
          setModelosSalvos([]);
        }
      }

      // Carregar tamanhos salvos para sugestões
      const tamanhosSalvosData = localStorage.getItem("tamanhosSalvos");
      if (tamanhosSalvosData) {
        try {
          setTamanhosSalvos(JSON.parse(tamanhosSalvosData));
        } catch (error) {
          console.error("Erro ao carregar tamanhos salvos:", error);
          setTamanhosSalvos([]);
        }
      }
    }
  }, [isOpen, projeto]);

  const adicionarItem = () => {
    if (novoItem.item.trim() && novoItem.material.trim()) {
      const novoItemCompleto = {
        ...novoItem,
        id: Date.now(),
        item: novoItem.item.trim(),
        quantidade: novoItem.quantidade.trim(),
        material: novoItem.material.trim(),
        modelo: novoItem.modelo.trim(),
        tamanho: novoItem.tamanho.trim(),
      };

      setItens([...itens, novoItemCompleto]);

      // Salvar material para reutilização futura se não existir
      if (!materiaisSalvos.some((m) => m.nome === novoItem.material.trim())) {
        const novoMaterial = {
          nome: novoItem.material.trim(),
          ultimoUso: new Date().toISOString(),
        };
        const novosMateriaisSalvos = [...materiaisSalvos, novoMaterial];
        setMateriaisSalvos(novosMateriaisSalvos);
        localStorage.setItem(
          "materiaisSalvos",
          JSON.stringify(novosMateriaisSalvos)
        );
      }

      // Salvar modelo para reutilização futura se não existir e não estiver vazio
      if (
        novoItem.modelo.trim() &&
        !modelosSalvos.some((m) => m.nome === novoItem.modelo.trim())
      ) {
        const novoModelo = {
          nome: novoItem.modelo.trim(),
          ultimoUso: new Date().toISOString(),
        };
        const novosModelosSalvos = [...modelosSalvos, novoModelo];
        setModelosSalvos(novosModelosSalvos);
        localStorage.setItem(
          "modelosSalvos",
          JSON.stringify(novosModelosSalvos)
        );
      }

      // Salvar tamanho para reutilização futura se não existir e não estiver vazio
      if (
        novoItem.tamanho.trim() &&
        !tamanhosSalvos.some((t) => t.nome === novoItem.tamanho.trim())
      ) {
        const novoTamanho = {
          nome: novoItem.tamanho.trim(),
          ultimoUso: new Date().toISOString(),
        };
        const novosTamanhosSalvos = [...tamanhosSalvos, novoTamanho];
        setTamanhosSalvos(novosTamanhosSalvos);
        localStorage.setItem(
          "tamanhosSalvos",
          JSON.stringify(novosTamanhosSalvos)
        );
      }

      // Limpar formulário
      setNovoItem({
        item: "",
        quantidade: "",
        material: "",
        modelo: "",
        tamanho: "",
      });
    }
  };

  const removerItem = (id) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const salvarLista = () => {
    if (projeto) {
      localStorage.setItem(
        `listaMaterial_${projeto.nome}`,
        JSON.stringify(itens)
      );
      if (onSave) {
        onSave(itens);
      }
      onClose();
    }
  };

  const handleMaterialChange = (value) => {
    setNovoItem({ ...novoItem, material: value });
  };

  const handleModeloChange = (value) => {
    setNovoItem({ ...novoItem, modelo: value });
  };

  const handleTamanhoChange = (value) => {
    setNovoItem({ ...novoItem, tamanho: value });
  };

  // Função opcional para limpar dados antigos (pode ser implementada no futuro)
  // const limparDadosAntigos = () => {
  //   const agora = new Date();
  //   const umMesAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
  //
  //   const materiaisFiltrados = materiaisSalvos.filter(m => new Date(m.ultimoUso) > umMesAtras);
  //   const modelosFiltrados = modelosSalvos.filter(m => new Date(m.ultimoUso) > umMesAtras);
  //   const tamanhosFiltrados = tamanhosSalvos.filter(t => new Date(t.ultimoUso) > umMesAtras);
  //
  //   localStorage.setItem("materiaisSalvos", JSON.stringify(materiaisFiltrados));
  //   localStorage.setItem("modelosSalvos", JSON.stringify(modelosFiltrados));
  //   localStorage.setItem("tamanhosSalvos", JSON.stringify(tamanhosFiltrados));
  // };

  // Estilos para o PDF
  const pdfStyles = StyleSheet.create({
    page: {
      padding: 32,
      fontSize: 11,
      fontFamily: "Helvetica",
      backgroundColor: "#ffffff",
      color: "#333333",
    },
    capa: {
      textAlign: "center",
      marginBottom: 40,
      paddingBottom: 20,
      borderBottom: "2 solid #e5e7eb",
    },
    titulo: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#1f2937",
    },
    subtitulo: {
      fontSize: 16,
      marginBottom: 4,
      color: "#6b7280",
    },
    data: {
      fontSize: 10,
      color: "#9ca3af",
      marginTop: 8,
    },
    secao: {
      marginBottom: 24,
    },
    secaoTitulo: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 12,
      color: "#1f2937",
      borderBottom: "1 solid #e5e7eb",
      paddingBottom: 4,
    },
    painelContainer: {
      marginBottom: 8,
      padding: 8,
      backgroundColor: "#f9fafb",
      borderRadius: 4,
    },
    painelNome: {
      fontSize: 12,
      fontWeight: "bold",
      marginBottom: 4,
    },
    painelDetalhes: {
      fontSize: 10,
      color: "#6b7280",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    tabelaContainer: {
      border: "1 solid #e5e7eb",
      borderRadius: 4,
    },
    tabelaCabecalho: {
      flexDirection: "row",
      backgroundColor: "#f3f4f6",
      borderBottom: "1 solid #e5e7eb",
      padding: 8,
    },
    tabelaLinha: {
      flexDirection: "row",
      borderBottom: "1 solid #e5e7eb",
      padding: 8,
    },
    coluna1: { flex: 2 },
    coluna2: { flex: 1 },
    coluna3: { flex: 2 },
    coluna4: { flex: 2 },
    coluna5: { flex: 1.5 },
    cabecalhoTexto: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#374151",
    },
    celulaTexto: {
      fontSize: 9,
      color: "#6b7280",
    },
    rodape: {
      position: "absolute",
      bottom: 32,
      left: 32,
      right: 32,
      textAlign: "center",
      fontSize: 8,
      color: "#9ca3af",
      borderTop: "1 solid #e5e7eb",
      paddingTop: 8,
    },
  });

  // Componente PDF da Lista de Material
  function ListaMaterialPDF({ projeto, paineisProjeto, itens }) {
    const totalPixels = paineisProjeto.reduce((acc, painel) => acc + (painel.pixelsLargura * painel.pixelsAltura), 0);
    const areaTotal = paineisProjeto.reduce((acc, painel) => acc + (painel.largura * painel.altura), 0);

    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          {/* Capa */}
          <View style={pdfStyles.capa}>
            <Text style={pdfStyles.titulo}>Lista de Material</Text>
            <Text style={pdfStyles.subtitulo}>{projeto.nome}</Text>
            <Text style={pdfStyles.data}>
              Gerado em {new Date().toLocaleDateString("pt-BR")} às{" "}
              {new Date().toLocaleTimeString("pt-BR")}
            </Text>
          </View>

          {/* Informações do Projeto */}
          <View style={pdfStyles.secao}>
            <Text style={pdfStyles.secaoTitulo}>Informações do Projeto</Text>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 10, marginBottom: 3 }}>
                • Nome: {projeto.nome}
              </Text>
              <Text style={{ fontSize: 10, marginBottom: 3 }}>
                • Cliente: {projeto.cliente || "Não informado"}
              </Text>
              <Text style={{ fontSize: 10, marginBottom: 3 }}>
                • Data do Projeto: {projeto.dataEntrega ? new Date(projeto.dataEntrega + 'T00:00:00').toLocaleDateString("pt-BR") : "Não informada"}
              </Text>
              <Text style={{ fontSize: 10, marginBottom: 3 }}>
                • Quantidade de Painéis: {paineisProjeto.length}
              </Text>
              <Text style={{ fontSize: 10, marginBottom: 3 }}>
                • Área Total: {areaTotal.toFixed(2)} m²
              </Text>
            </View>
          </View>

          {/* Painéis do Projeto */}
          {paineisProjeto.length > 0 && (
            <View style={pdfStyles.secao}>
              <Text style={pdfStyles.secaoTitulo}>Painéis do Projeto</Text>
              {paineisProjeto.map((painel, idx) => (
                <View key={idx} style={pdfStyles.painelContainer}>
                  <Text style={pdfStyles.painelNome}>{painel.nome}</Text>
                  <View style={pdfStyles.painelDetalhes}>
                    <Text style={{ fontSize: 9 }}>
                      Dimensões: {painel.largura}m × {painel.altura}m
                    </Text>
                    <Text style={{ fontSize: 9 }}>
                      Pixels: {painel.pixelsLargura} × {painel.pixelsAltura}
                    </Text>
                    <Text style={{ fontSize: 9 }}>
                      Gabinete: {painel.gabinete}
                    </Text>
                  </View>
                  <View style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 8, color: "#9ca3af" }}>
                      Área: {(painel.largura * painel.altura).toFixed(2)} m² • 
                      Total Pixels: {(painel.pixelsLargura * painel.pixelsAltura).toLocaleString("pt-BR")}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Lista de Material */}
          <View style={pdfStyles.secao}>
            <Text style={pdfStyles.secaoTitulo}>Lista de Material ({itens.length} {itens.length === 1 ? 'item' : 'itens'})</Text>
            {itens.length === 0 ? (
              <Text style={{ fontSize: 10, color: "#9ca3af", fontStyle: "italic" }}>
                Nenhum item na lista de material
              </Text>
            ) : (
              <View style={pdfStyles.tabelaContainer}>
                {/* Cabeçalho da tabela */}
                <View style={pdfStyles.tabelaCabecalho}>
                  <View style={pdfStyles.coluna1}>
                    <Text style={pdfStyles.cabecalhoTexto}>Item</Text>
                  </View>
                  <View style={pdfStyles.coluna2}>
                    <Text style={pdfStyles.cabecalhoTexto}>Qtd</Text>
                  </View>
                  <View style={pdfStyles.coluna3}>
                    <Text style={pdfStyles.cabecalhoTexto}>Material</Text>
                  </View>
                  <View style={pdfStyles.coluna4}>
                    <Text style={pdfStyles.cabecalhoTexto}>Modelo</Text>
                  </View>
                  <View style={pdfStyles.coluna5}>
                    <Text style={pdfStyles.cabecalhoTexto}>Tamanho</Text>
                  </View>
                </View>

                {/* Linhas da tabela */}
                {itens.map((item, idx) => (
                  <View key={item.id} style={pdfStyles.tabelaLinha}>
                    <View style={pdfStyles.coluna1}>
                      <Text style={pdfStyles.celulaTexto}>{item.item}</Text>
                    </View>
                    <View style={pdfStyles.coluna2}>
                      <Text style={pdfStyles.celulaTexto}>
                        {item.quantidade || "-"}
                      </Text>
                    </View>
                    <View style={pdfStyles.coluna3}>
                      <Text style={pdfStyles.celulaTexto}>{item.material}</Text>
                    </View>
                    <View style={pdfStyles.coluna4}>
                      <Text style={pdfStyles.celulaTexto}>
                        {item.modelo || "-"}
                      </Text>
                    </View>
                    <View style={pdfStyles.coluna5}>
                      <Text style={pdfStyles.celulaTexto}>
                        {item.tamanho || "-"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Rodapé */}
          <View style={pdfStyles.rodape}>
            <Text>
              Led Panel Manager • Lista de Material • {projeto.nome} • Página 1 • Gerado em {new Date().toLocaleDateString("pt-BR")}
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#23283a",
          borderRadius: 12,
          padding: 24,
          width: "100%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflow: "auto",
          border: "1px solid #3a4161",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ color: "#fff", margin: 0 }}>
            📋 Lista de Material - {projeto?.nome}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#b6c1e0",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Informações do projeto */}
        {paineisProjeto.length > 0 && (
          <div
            style={{
              backgroundColor: "#1a1d29",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              fontSize: "0.9em",
              color: "#b6c1e0",
            }}
          >
            📊 <strong>Painéis incluídos no relatório:</strong> {paineisProjeto.length} • 
            📐 <strong>Área total:</strong> {paineisProjeto.reduce((acc, painel) => acc + (painel.largura * painel.altura), 0).toFixed(2)} m² • 
            🔲 <strong>Total de pixels:</strong> {paineisProjeto.reduce((acc, painel) => acc + (painel.pixelsLargura * painel.pixelsAltura), 0).toLocaleString("pt-BR")}
          </div>
        )}

        {/* Formulário para adicionar novo item */}
        <div
          style={{
            backgroundColor: "#1a1d29",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <h3 style={{ color: "#fff", marginBottom: 16 }}>Adicionar Item</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr)) auto",
              gap: 12,
              alignItems: "end",
              "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
                gap: 8,
              },
            }}
          >
            <div>
              <label
                style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}
              >
                Item:
              </label>
              <input
                type="text"
                value={novoItem.item}
                onChange={(e) =>
                  setNovoItem({ ...novoItem, item: e.target.value })
                }
                placeholder="Ex: Parafuso, Cabo, Suporte..."
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #3a4161",
                  background: "#23283a",
                  color: "#fff",
                }}
              />
            </div>

            <div>
              <label
                style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}
              >
                Quantidade:
              </label>
              <input
                type="text"
                value={novoItem.quantidade}
                onChange={(e) =>
                  setNovoItem({ ...novoItem, quantidade: e.target.value })
                }
                placeholder="Ex: 10, 5m, 2kg..."
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #3a4161",
                  background: "#23283a",
                  color: "#fff",
                }}
              />
            </div>

            <div>
              <label
                style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}
              >
                Material:
              </label>
              <input
                type="text"
                value={novoItem.material}
                onChange={(e) => handleMaterialChange(e.target.value)}
                placeholder="Ex: Aço inox, PVC, Alumínio..."
                list="materiais-salvos"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #3a4161",
                  background: "#23283a",
                  color: "#fff",
                }}
              />
              <datalist id="materiais-salvos">
                {materiaisSalvos.map((material, index) => (
                  <option key={index} value={material.nome} />
                ))}
              </datalist>
            </div>

            <div>
              <label
                style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}
              >
                Modelo:
              </label>
              <input
                type="text"
                value={novoItem.modelo}
                onChange={(e) => handleModeloChange(e.target.value)}
                placeholder="Ex: P4, SMD2121, 500x500..."
                list="modelos-salvos"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #3a4161",
                  background: "#23283a",
                  color: "#fff",
                }}
              />
              <datalist id="modelos-salvos">
                {modelosSalvos.map((modelo, index) => (
                  <option key={index} value={modelo.nome} />
                ))}
              </datalist>
            </div>

            <div>
              <label
                style={{ color: "#b6c1e0", display: "block", marginBottom: 8 }}
              >
                Tamanho:
              </label>
              <input
                type="text"
                value={novoItem.tamanho}
                onChange={(e) => handleTamanhoChange(e.target.value)}
                placeholder="Ex: 2m, 10kg, 50x50cm..."
                list="tamanhos-salvos"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #3a4161",
                  background: "#23283a",
                  color: "#fff",
                }}
              />
              <datalist id="tamanhos-salvos">
                {tamanhosSalvos.map((tamanho, index) => (
                  <option key={index} value={tamanho.nome} />
                ))}
              </datalist>
            </div>

            <button
              onClick={adicionarItem}
              disabled={!novoItem.item.trim() || !novoItem.material.trim()}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                backgroundColor:
                  novoItem.item.trim() && novoItem.material.trim()
                    ? "#10b981"
                    : "#6b7280",
                color: "#fff",
                cursor:
                  novoItem.item.trim() && novoItem.material.trim()
                    ? "pointer"
                    : "not-allowed",
                fontWeight: 500,
              }}
            >
              ➕ Adicionar
            </button>
          </div>
        </div>

        {/* Lista de itens */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: "#fff", marginBottom: 16 }}>
            Itens da Lista ({itens.length})
          </h3>

          {itens.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                color: "#9ca3af",
                backgroundColor: "#1a1d29",
                borderRadius: 8,
              }}
            >
              Nenhum item adicionado ainda
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#1a1d29",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* Cabeçalho da tabela */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
                  gap: 12,
                  padding: 12,
                  backgroundColor: "#2a2d3a",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                <div>Item</div>
                <div>Quantidade</div>
                <div>Material</div>
                <div>Modelo</div>
                <div>Tamanho</div>
                <div></div>
              </div>

              {/* Itens da lista */}
              {itens.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
                    gap: 12,
                    padding: 12,
                    borderTop: index > 0 ? "1px solid #3a4161" : "none",
                    color: "#b6c1e0",
                  }}
                >
                  <div>{item.item}</div>
                  <div>{item.quantidade || "-"}</div>
                  <div>{item.material}</div>
                  <div>{item.modelo || "-"}</div>
                  <div>{item.tamanho || "-"}</div>
                  <button
                    onClick={() => removerItem(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                    title="Remover item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "1px solid #3a4161",
              backgroundColor: "transparent",
              color: "#b6c1e0",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          
          {itens.length > 0 && (
            <PDFDownloadLink
              document={
                <ListaMaterialPDF
                  projeto={projeto}
                  paineisProjeto={paineisProjeto}
                  itens={itens}
                />
              }
              fileName={`ListaMaterial_${projeto?.nome}_${new Date().toISOString().split('T')[0]}.pdf`}
              style={{
                padding: "10px 20px",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#f59e0b",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {({ loading }) =>
                loading ? "📄 Gerando PDF..." : "📄 Exportar PDF"
              }
            </PDFDownloadLink>
          )}
          
          <button
            onClick={salvarLista}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#3b82f6",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            💾 Salvar Lista
          </button>
        </div>
      </div>
    </div>
  );
}

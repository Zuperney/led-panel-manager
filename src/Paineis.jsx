import { useEffect, useState } from "react";
import { useProjeto } from "./contextProjeto";
import {
  calcularPainelPorGabinete,
  calcularPainelPorMetro,
  calcularEnergia,
  calcularIntensidade,
  calcularPotenciaFinal,
} from "./painelCalculos";

export default function Paineis() {
  const { state } = useProjeto();
  const [gabinetes, setGabinetes] = useState([]);
  const [paineis, setPaineis] = useState([]);
  const [editando, setEditando] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(null);
  const [form, setForm] = useState({
    projeto: "",
    nome: "",
    modo: "gabinete", // "gabinete" ou "metro"
    gabinete: "",
    qtdLargura: 1,
    qtdAltura: 1,
    larguraM: "",
    alturaM: "",
  });
  const [resultado, setResultado] = useState(null);
  const [tensao, setTensao] = useState("220"); // 220 ou 380
  const [tipoRede, setTipoRede] = useState("monofasico");
  const [energia, setEnergia] = useState(null);
  const [brilho, setBrilho] = useState(100); // porcentagem de brilho
  const [fatorConteudo, setFatorConteudo] = useState(0.33);
  const [consumoBase, setConsumoBase] = useState(0.3);
  const [potenciaDetalhe, setPotenciaDetalhe] = useState(null);
  const [previewPainel, setPreviewPainel] = useState(null);

  // Carregar gabinetes sempre do backend
  useEffect(() => {
    fetch("http://localhost:3030/api/gabinetes")
      .then((res) => res.json())
      .then((data) => setGabinetes(data));
  }, []);

  // Carregar paineis do backend ao iniciar
  useEffect(() => {
    fetch("http://localhost:3030/api/paineis")
      .then((res) => res.json())
      .then((data) => setPaineis(data));
  }, []);

  function salvarPaineisBackend(novosPaineis) {
    fetch("http://localhost:3030/api/paineis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novosPaineis),
    });
  }

  // Persistência do projeto selecionado
  useEffect(() => {
    const salvo = localStorage.getItem("selectedProjectId");
    if (salvo) setSelectedProjectId(salvo);
  }, []);
  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem("selectedProjectId", selectedProjectId);
    }
  }, [selectedProjectId]);

  // Atualiza resultado, energia e potência detalhada sempre que form, tipoRede, tensao mudam
  useEffect(() => {
    if (!form.gabinete) {
      setResultado(null);
      setEnergia(null);
      setPotenciaDetalhe(null);
      return;
    }
    const gabinete = gabinetes.find((g) => g.nome === form.gabinete);
    if (!gabinete) {
      setResultado(null);
      setEnergia(null);
      setPotenciaDetalhe(null);
      return;
    }
    let res = null;
    let qtdGabinetes = 1;
    if (form.modo === "gabinete") {
      res = calcularPainelPorGabinete(
        gabinete,
        Number(form.qtdLargura),
        Number(form.qtdAltura)
      );
      qtdGabinetes = Number(form.qtdLargura) * Number(form.qtdAltura);
    } else if (form.modo === "metro") {
      res = calcularPainelPorMetro(
        gabinete,
        Number(form.larguraM),
        Number(form.alturaM)
      );
      qtdGabinetes =
        Math.round((Number(res.largura) * 1000) / gabinete.largura) *
        Math.round((Number(res.altura) * 1000) / gabinete.altura);
    }
    if (res) {
      // Consumo máximo (full white)
      const P_total_max = gabinete.potencia * qtdGabinetes;
      // Consumo médio (modelo realista, brilho 100%)
      const brilhoPercentualMax = 100;
      const fatorConteudo = 0.33;
      const consumoBasePercentual = 0.3;
      const pwmMax = Math.pow(brilhoPercentualMax / 100, 2);
      const P_brilhoMax = P_total_max * pwmMax;
      const P_conteudoMax = P_brilhoMax * fatorConteudo;
      const P_baseMax = P_total_max * consumoBasePercentual;
      const P_finalMax = P_conteudoMax + P_baseMax;
      // Consumo médio (brilho 50%)
      const brilhoPercentual50 = 50;
      const pwm50 = Math.pow(brilhoPercentual50 / 100, 2);
      const P_brilho50 = P_total_max * pwm50;
      const P_conteudo50 = P_brilho50 * fatorConteudo;
      const P_base50 = P_total_max * consumoBasePercentual;
      const P_final50 = P_conteudo50 + P_base50;
      setPotenciaDetalhe({ P_total_max, P_finalMax, P_final50 });
      setResultado({ ...res, potencia: P_finalMax });
      setEnergia(calcularEnergia(P_finalMax, tipoRede, tensao));
    } else {
      setResultado(null);
      setEnergia(null);
      setPotenciaDetalhe(null);
    }
  }, [form, gabinetes, tipoRede, tensao]);

  // Sempre que selectedProjectId mudar, atualiza o campo projeto do form e define modo 'metro' como padrão
  useEffect(() => {
    if (selectedProjectId) {
      setForm((f) => ({ ...f, projeto: selectedProjectId, modo: "metro" }));
    }
  }, [selectedProjectId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!resultado) return;
    const gabinete = gabinetes.find((g) => g.nome === form.gabinete);
    let qtdLargura = 1;
    let qtdAltura = 1;
    if (form.modo === "gabinete") {
      qtdLargura = Number(form.qtdLargura);
      qtdAltura = Number(form.qtdAltura);
    } else if (form.modo === "metro" && gabinete) {
      qtdLargura = Math.round(
        (Number(form.larguraM) * 1000) / gabinete.largura
      );
      qtdAltura = Math.round((Number(form.alturaM) * 1000) / gabinete.altura);
    }
    const painel = {
      projeto: selectedProjectId,
      nome: form.nome,
      gabinete: form.gabinete,
      modo: form.modo,
      qtdLargura,
      qtdAltura,
      larguraM: form.larguraM,
      alturaM: form.alturaM,
      tensao, // Salva tensão selecionada
      tipoRede, // Salva tipo de rede selecionado
      ...resultado,
    };
    // Impede duplicidade só na criação
    const nomeDuplicado = paineis.some(
      (p, idx) =>
        p.projeto === selectedProjectId &&
        p.nome.trim().toLowerCase() === painel.nome.trim().toLowerCase() &&
        editando === null
    );
    if (nomeDuplicado) {
      alert(
        "Já existe um painel com esse nome neste projeto. Escolha outro nome."
      );
      return;
    }
    let novos;
    if (editando !== null) {
      // Atualiza o painel correto
      const painelEditado = paineisFiltrados[editando];
      const idxReal = paineis.findIndex(
        (p) =>
          p.projeto === painelEditado.projeto && p.nome === painelEditado.nome
      );
      if (idxReal !== -1) {
        novos = [...paineis];
        novos[idxReal] = painel;
        setPaineis(novos);
        setEditando(null);
        setPreviewPainel(null);
      } else {
        return;
      }
    } else {
      novos = [...paineis, painel];
      setPreviewPainel({ ...painel });
      setPaineis(novos);
    }
    salvarPaineisBackend(novos);
    setForm({
      projeto: selectedProjectId,
      nome: "",
      modo: "metro", // Sempre volta para metro
      gabinete: "",
      qtdLargura: 1,
      qtdAltura: 1,
      larguraM: "",
      alturaM: "",
    });
  }

  function editarPainel(index) {
    setForm({ ...paineisFiltrados[index], projeto: selectedProjectId });
    setEditando(index);
    setPreviewPainel(null);
  }

  function removerPainel(index) {
    if (window.confirm("Remover este painel?")) {
      const novos = paineis.filter((_, i) => i !== index);
      setPaineis(novos);
      salvarPaineisBackend(novos);
    }
  }

  // Função para duplicar painel
  function duplicarPainel(index) {
    const painelOriginal = paineisFiltrados[index];
    // Gera nome novo: "tela", "tela 2", "tela 3"...
    const baseName = painelOriginal.nome.replace(/ \d+$/, "");
    let novoNome = baseName;
    let count = 2;
    while (
      paineis.some(
        (p) =>
          p.projeto === selectedProjectId &&
          p.nome.toLowerCase() === novoNome.toLowerCase()
      )
    ) {
      novoNome = `${baseName} ${count}`;
      count++;
    }
    const novoPainel = { ...painelOriginal, nome: novoNome };
    const novos = [...paineis, novoPainel];
    setPaineis(novos);
    salvarPaineisBackend(novos);
  }

  // Filtrar paineis pelo projeto selecionado
  const paineisFiltrados =
    selectedProjectId && selectedProjectId !== "__all__"
      ? paineis.filter((p) => p.projeto === selectedProjectId)
      : paineis;

  return (
    <div style={{ display: "flex", gap: 32 }}>
      <div style={{ flex: 1, minWidth: 340 }}>
        <h2>Painéis</h2>
        <div style={{ marginBottom: 16 }}>
          <label>
            Projeto:&nbsp;
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedPanelIndex(null);
                setForm((f) => ({ ...f, projeto: e.target.value }));
                setPreviewPainel(null);
              }}
            >
              <option value="">Selecione o Projeto</option>
              {state.projetos.map((p, i) => (
                <option key={i} value={p.nome}>
                  {p.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
        {/* Formulário só aparece se um projeto estiver selecionado */}
        {selectedProjectId && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
            <input name="projeto" type="hidden" value={selectedProjectId} />
            <input
              name="nome"
              placeholder="Nome do Painel"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <select
              name="gabinete"
              value={form.gabinete}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o Gabinete</option>
              {gabinetes.map((g, i) => (
                <option key={i} value={g.nome}>
                  {g.nome}
                </option>
              ))}
            </select>
            <div style={{ margin: "12px 0" }}>
              <label>
                <input
                  type="radio"
                  name="modo"
                  value="metro"
                  checked={form.modo === "metro"}
                  onChange={handleChange}
                />
                Medidas em Metros
              </label>
              <label style={{ marginLeft: 16 }}>
                <input
                  type="radio"
                  name="modo"
                  value="gabinete"
                  checked={form.modo === "gabinete"}
                  onChange={handleChange}
                />
                Medidas por Gabinetes
              </label>
            </div>
            {form.modo === "gabinete" ? (
              <>
                <input
                  name="qtdLargura"
                  type="number"
                  min={1}
                  value={form.qtdLargura}
                  onChange={handleChange}
                  placeholder="Qtd Gabinetes Largura"
                  required
                />
                <input
                  name="qtdAltura"
                  type="number"
                  min={1}
                  value={form.qtdAltura}
                  onChange={handleChange}
                  placeholder="Qtd Gabinetes Altura"
                  required
                />
              </>
            ) : (
              <>
                <input
                  name="larguraM"
                  type="number"
                  step="0.01"
                  min={0.01}
                  value={form.larguraM}
                  onChange={handleChange}
                  placeholder="Largura (m)"
                  required
                />
                <input
                  name="alturaM"
                  type="number"
                  step="0.01"
                  min={0.01}
                  value={form.alturaM}
                  onChange={handleChange}
                  placeholder="Altura (m)"
                  required
                />
              </>
            )}
            <div style={{ margin: "12px 0" }}>
              <label>
                Tensão:
                <select
                  value={tensao}
                  onChange={(e) => {
                    setTensao(e.target.value);
                    if (e.target.value === "220" && tipoRede === "monofasico") {
                      setTipoRede("bifasico");
                    }
                  }}
                  style={{ marginLeft: 8 }}
                >
                  <option value="220">220V</option>
                  <option value="380">380V</option>
                </select>
              </label>
              <label style={{ marginLeft: 16 }}>
                Tipo de rede:
                <select
                  value={tipoRede}
                  onChange={(e) => setTipoRede(e.target.value)}
                  style={{ marginLeft: 8 }}
                >
                  {tensao === "220" ? (
                    <>
                      <option value="bifasico">Bifásico</option>
                      <option value="trifasico">Trifásico</option>
                    </>
                  ) : (
                    <>
                      <option value="monofasico">Monofásico</option>
                      <option value="bifasico">Bifásico</option>
                      <option value="trifasico">Trifásico</option>
                    </>
                  )}
                </select>
              </label>
            </div>
            <button type="submit" disabled={!resultado}>
              {editando !== null ? "Salvar Edição" : "Adicionar Painel"}
            </button>
          </form>
        )}
        {/* Preview detalhado do painel selecionado (agora abaixo do formulário) */}
        {previewPainel &&
          (() => {
            // Busca gabinete do painel
            const gabineteObj = gabinetes.find(
              (g) => g.nome === previewPainel.gabinete
            );
            // Quantidade de gabinetes
            const qtdGabinetes =
              (previewPainel.qtdLargura || 1) * (previewPainel.qtdAltura || 1);
            // Potência máxima (100% brilho)
            const potMax = gabineteObj
              ? gabineteObj.potencia * qtdGabinetes
              : 0;
            // Potência aparente e corrente conforme painel
            const tensaoPainel = previewPainel.tensao || "220";
            const tipoRedePainel = previewPainel.tipoRede || "monofasico";
            const energiaMax = calcularEnergia(
              potMax,
              tipoRedePainel,
              tensaoPainel
            );
            // Potência média (50% brilho)
            const pot50 = gabineteObj
              ? calcularPotenciaFinal(gabineteObj, qtdGabinetes, 50).P_final
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
            return (
              <div
                className="painel-preview"
                style={{
                  marginTop: 24,
                  minWidth: 340,
                  maxWidth: 600,
                  background: "#23283a",
                  borderRadius: 12,
                  padding: 18,
                  fontSize: "0.85em",
                  lineHeight: 1.35,
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1em",
                    marginBottom: 5,
                  }}
                >
                  Informações do Painel – {previewPainel.nome}
                </div>
                <div style={{ marginLeft: 8 }}>
                  Projeto: {previewPainel.projeto}
                  <br />
                  Gabinete: {previewPainel.gabinete}
                  <br />
                  Dimensões do Painel: {fmt(previewPainel.largura, 2)} m ×{" "}
                  {fmt(previewPainel.altura, 2)} m
                  <br />
                  Resolução Total: {previewPainel.pixelsLargura} ×{" "}
                  {previewPainel.pixelsAltura} pixels
                  <br />
                  Área Total: {fmt(previewPainel.area, 2)} m²
                  <br />
                  Peso Total: {fmt(previewPainel.peso, 0)} kg
                </div>
                <div style={{ margin: "12px 0 5px 0", fontWeight: "bold" }}>
                  Composição do Painel
                </div>
                <div style={{ marginLeft: 8 }}>
                  Quantidade de Gabinetes: {qtdGabinetes} unidades
                  <br />
                  Largura: {previewPainel.qtdLargura} gabinetes
                  <br />
                  Altura: {previewPainel.qtdAltura} gabinetes
                </div>
                <div style={{ margin: "14px 0 5px 0", fontWeight: "bold" }}>
                  Potência e Consumo
                </div>
                <div
                  style={{
                    marginLeft: 8,
                    textDecoration: "underline",
                    marginTop: 2,
                  }}
                >
                  Branco Máximo (100% de Brilho)
                </div>
                <div style={{ marginLeft: 8 }}>
                  Potência Total Consumida: {fmt(potMax, 0)} Watts
                  <br />
                  Potência Aparente: {fmt(energiaMax.potenciaVA)} VA
                  <br />
                  Corrente Elétrica Estimada: {energiaMax.descricao}
                </div>
                <div
                  style={{
                    marginLeft: 8,
                    textDecoration: "underline",
                    marginTop: 10,
                  }}
                >
                  Consumo Médio (Brilho em 50%)
                </div>
                <div style={{ marginLeft: 8 }}>
                  Potência Estimada Consumida: {fmt(pot50, 0)} Watts
                  <br />
                  Potência Aparente: {fmt(energia50.potenciaVA)} VA
                  <br />
                  Corrente Elétrica Estimada: {energia50.descricao}
                </div>
              </div>
            );
          })()}
      </div>
      {/* Lista lateral de painéis do projeto selecionado */}
      <div style={{ minWidth: 320, maxWidth: 400 }}>
        <h3>Painéis do Projeto</h3>
        <div
          style={{
            maxHeight: 420,
            overflowY: "auto",
            background: "#23283a",
            borderRadius: 12,
            boxShadow: "0 2px 8px #0003",
            padding: "8px 0",
            marginBottom: 8,
          }}
        >
          {paineisFiltrados.length === 0 ? (
            <p style={{ padding: 16 }}>
              Nenhum painel cadastrado para este projeto.
            </p>
          ) : (
            <ul style={{ padding: 0, margin: 0 }}>
              {paineisFiltrados.map((p, i) => {
                const gabineteObj = gabinetes.find(
                  (g) => g.nome === p.gabinete
                );
                return (
                  <li
                    key={i}
                    className="painel-lista-item"
                    style={{
                      cursor: "pointer",
                      background:
                        selectedPanelIndex === i ? "#2d3550" : "transparent",
                      borderRadius: 8,
                      marginBottom: 4,
                    }}
                    onClick={() => {
                      setSelectedPanelIndex(i);
                      setPreviewPainel(p);
                      setEditando(null);
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <div className="painel-nome">{p.nome}</div>
                      <div className="painel-tamanho">
                        {p.largura?.toFixed(2)} m × {p.altura?.toFixed(2)} m
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#b6c1e0", marginTop: 2 }}
                      >
                        Tipo: {gabineteObj ? gabineteObj.tipo : "-"} | Gabinete:{" "}
                        {p.gabinete}
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm({ ...p, projeto: selectedProjectId });
                            setEditando(i);
                            setPreviewPainel(null);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicarPainel(i);
                          }}
                        >
                          Duplicar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removerPainel(i);
                          }}
                          className="remove-btn"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

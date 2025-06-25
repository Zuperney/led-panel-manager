import { useEffect, useState } from "react";

export default function Gabinetes({ isActive }) {
  const [gabinetes, setGabinetes] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    tipo: "indoor",
    largura: "",
    altura: "",
    pixels_largura: "",
    pixels_altura: "",
    potencia: "",
    peso: "",
    pitch: "",
    fabricante: "",
  });
  const [editando, setEditando] = useState(null);

  // Carregar gabinetes do backend ao iniciar e quando a aba se torna ativa
  useEffect(() => {
    if (isActive) {
      fetch("/api/gabinetes")
        .then((res) => res.json())
        .then((data) => setGabinetes(data))
        .catch((error) => console.error("Erro ao carregar gabinetes:", error));
    }
  }, [isActive]);

  // Salvar no backend apenas em ações de CRUD
  function salvarGabinetesBackend(novosGabinetes) {
    fetch("/api/gabinetes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novosGabinetes),
    }).catch((error) => console.error("Erro ao salvar gabinetes:", error));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let novos;
    if (editando !== null) {
      novos = [...gabinetes];
      novos[editando] = form;
      setGabinetes(novos);
      setEditando(null);
    } else {
      novos = [...gabinetes, form];
      setGabinetes(novos);
    }
    salvarGabinetesBackend(novos);
    setForm({
      nome: "",
      tipo: "indoor",
      largura: "",
      altura: "",
      pixels_largura: "",
      pixels_altura: "",
      potencia: "",
      peso: "",
      pitch: "",
      fabricante: "",
    });
  }

  function editarGabinete(index) {
    setForm(gabinetes[index]);
    setEditando(index);
  }

  function removerGabinete(index) {
    if (window.confirm("Remover este gabinete?")) {
      const novos = gabinetes.filter((_, i) => i !== index);
      setGabinetes(novos);
      salvarGabinetesBackend(novos);
    }
  }

  return (
    <div>
      <h2>📱 Gabinetes</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="nome"
            placeholder="Nome do Gabinete"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="transparente">Transparente</option>
            <option value="curvo">Curvo</option>
          </select>
        </div>

        <div className="form-row">
          <input
            name="largura"
            placeholder="Largura (mm)"
            type="number"
            value={form.largura}
            onChange={handleChange}
            required
          />
          <input
            name="altura"
            placeholder="Altura (mm)"
            type="number"
            value={form.altura}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            name="pixels_largura"
            placeholder="Pixels Largura"
            type="number"
            value={form.pixels_largura}
            onChange={handleChange}
            required
          />
          <input
            name="pixels_altura"
            placeholder="Pixels Altura"
            type="number"
            value={form.pixels_altura}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            name="potencia"
            placeholder="Potência (W)"
            type="number"
            value={form.potencia}
            onChange={handleChange}
            required
          />
          <input
            name="peso"
            placeholder="Peso (kg)"
            type="number"
            value={form.peso}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            name="pitch"
            placeholder="Pitch (mm)"
            type="number"
            step="0.1"
            value={form.pitch}
            onChange={handleChange}
            required
          />
          <input
            name="fabricante"
            placeholder="Fabricante"
            value={form.fabricante}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit">
            {editando !== null
              ? "💾 Salvar Alterações"
              : "➕ Adicionar Gabinete"}
          </button>
          {editando !== null && (
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setForm({
                  nome: "",
                  tipo: "indoor",
                  largura: "",
                  altura: "",
                  pixels_largura: "",
                  pixels_altura: "",
                  potencia: "",
                  peso: "",
                  pitch: "",
                  fabricante: "",
                });
              }}
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de gabinetes */}
      <div className="grid-container">
        {gabinetes.length === 0 ? (
          <div className="info-box" style={{ textAlign: "center" }}>
            <p>📱 Nenhum gabinete cadastrado ainda.</p>
            <p>Use o formulário acima para adicionar o primeiro gabinete.</p>
          </div>
        ) : (
          gabinetes.map((g, i) => (
            <div key={i} className="painel-lista-item">
              <div style={{ flex: 1 }}>
                <div className="painel-nome">
                  {g.nome}{" "}
                  <span
                    style={{
                      fontSize: "0.8em",
                      backgroundColor:
                        g.tipo === "indoor"
                          ? "#2e7d32"
                          : g.tipo === "outdoor"
                          ? "#f57c00"
                          : "#7b1fa2",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      marginLeft: "8px",
                    }}
                  >
                    {g.tipo}
                  </span>
                </div>
                <div className="painel-tamanho">
                  📏 {g.largura}×{g.altura}mm | 🔲 {g.pixels_largura}×
                  {g.pixels_altura}px | ⚡ {g.potencia}W | ⚖️ {g.peso}kg
                </div>
                <div className="painel-tamanho">
                  🎯 Pitch: {g.pitch}mm | 🏭 {g.fabricante}
                </div>
              </div>
              <div
                className="button-group"
                style={{ flexDirection: "column", minWidth: "auto" }}
              >
                <button
                  onClick={() => editarGabinete(i)}
                  style={{
                    margin: "2px 0",
                    padding: "8px 12px",
                    fontSize: "0.9rem",
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => removerGabinete(i)}
                  className="remove-btn"
                  style={{
                    margin: "2px 0",
                    padding: "8px 12px",
                    fontSize: "0.9rem",
                  }}
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function Gabinetes() {
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

  // Carregar gabinetes do backend ao iniciar
  useEffect(() => {
    fetch("/api/gabinetes")
      .then((res) => res.json())
      .then((data) => setGabinetes(data))
      .catch((error) => console.error("Erro ao carregar gabinetes:", error));
  }, []);

  // Salvar no backend apenas em ações de CRUD
  function salvarGabinetesBackend(novosGabinetes) {
    fetch("/api/gabinetes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novosGabinetes),
    })
      .catch((error) => console.error("Erro ao salvar gabinetes:", error));
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
      <h2>Gabinetes</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <select name="tipo" value={form.tipo} onChange={handleChange} required>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
          <option value="transparente">Transparente</option>
          <option value="curvo">Curvo</option>
        </select>
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
        <input
          name="pitch"
          placeholder="Pitch (mm)"
          type="number"
          step="0.01"
          value={form.pitch}
          onChange={handleChange}
        />
        <input
          name="fabricante"
          placeholder="Fabricante"
          value={form.fabricante}
          onChange={handleChange}
        />
        <button type="submit">
          {editando !== null ? "Salvar Edição" : "Adicionar Gabinete"}
        </button>
      </form>
      <div>
        {gabinetes.length === 0 ? (
          <p>Nenhum gabinete cadastrado.</p>
        ) : (
          <ul>
            {gabinetes.map((g, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                <b>{g.nome}</b> - {g.tipo} - {g.largura}x{g.altura}mm -{" "}
                {g.pixels_largura}x{g.pixels_altura} px - Pot: {g.potencia}W -
                Peso: {g.peso}kg - Pitch: {g.pitch}mm - {g.fabricante}
                <button
                  onClick={() => editarGabinete(i)}
                  style={{ marginLeft: 8 }}
                >
                  Editar
                </button>
                <button
                  onClick={() => removerGabinete(i)}
                  style={{ marginLeft: 4 }}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

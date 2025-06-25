import { useEffect, useState } from "react";
import { useProjeto } from "./contextProjeto";

export default function Projetos() {
  const { state, dispatch } = useProjeto();
  const [form, setForm] = useState({ nome: "", cliente: "", dataEntrega: "" });

  // Carregar projetos do backend ao iniciar
  useEffect(() => {
    fetch("/api/projetos")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "CARREGAR_PROJETOS", payload: data }))
      .catch((error) => console.error("Erro ao carregar projetos:", error));
  }, [dispatch]);

  function salvarProjetosBackend(novosProjetos) {
    fetch("/api/projetos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novosProjetos),
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let novos;
    if (state.projetoEditando !== null) {
      novos = state.projetos.map((p, i) =>
        i === state.projetoEditando ? form : p
      );
      dispatch({
        type: "EDITAR_PROJETO",
        index: state.projetoEditando,
        payload: form,
      });
    } else {
      novos = [...state.projetos, form];
      dispatch({ type: "ADICIONAR_PROJETO", payload: form });
    }
    salvarProjetosBackend(novos);
    setForm({ nome: "", cliente: "", dataEntrega: "" });
  }

  function editarProjeto(index) {
    setForm(state.projetos[index]);
    dispatch({ type: "SET_EDITANDO", payload: index });
  }

  function removerProjeto(index) {
    if (window.confirm("Remover este projeto?")) {
      const nomeProjeto = state.projetos[index].nome;
      // Remove painéis do projeto
      const paineisSalvos = JSON.parse(localStorage.getItem("paineis") || "[]");
      const paineisRestantes = paineisSalvos.filter(
        (p) => p.projeto !== nomeProjeto
      );
      localStorage.setItem("paineis", JSON.stringify(paineisRestantes));
      const novos = state.projetos.filter((_, i) => i !== index);
      salvarProjetosBackend(novos);
      dispatch({ type: "REMOVER_PROJETO", index });
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h2>Projetos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          name="nome"
          placeholder="Nome do Projeto"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          name="cliente"
          placeholder="Cliente"
          value={form.cliente}
          onChange={handleChange}
          required
        />
        <input
          name="dataEntrega"
          type="date"
          value={form.dataEntrega}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {state.projetoEditando !== null
            ? "Salvar Edição"
            : "Adicionar Projeto"}
        </button>
      </form>
      <div>
        {state.projetos.length === 0 ? (
          <p>Nenhum projeto cadastrado.</p>
        ) : (
          <ul>
            {state.projetos.map((p, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                <b>{p.nome}</b> - {p.cliente} - Entrega: {p.dataEntrega}
                <button
                  onClick={() => editarProjeto(i)}
                  style={{ marginLeft: 8 }}
                >
                  Editar
                </button>
                <button
                  onClick={() => removerProjeto(i)}
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

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
      <h2>📋 Projetos</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="nome"
            placeholder="Nome do Projeto"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            name="cliente"
            placeholder="Cliente"
            value={form.cliente}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            name="dataEntrega"
            type="date"
            value={form.dataEntrega}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit">
            {state.projetoEditando !== null ? "💾 Salvar Alterações" : "➕ Adicionar Projeto"}
          </button>
          {state.projetoEditando !== null && (
            <button 
              type="button" 
              onClick={() => {
                dispatch({ type: "SET_EDITANDO", payload: null });
                setForm({ nome: "", cliente: "", dataEntrega: "" });
              }}
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de projetos */}
      <div className="grid-container">
        {state.projetos.length === 0 ? (
          <div className="info-box" style={{ textAlign: "center" }}>
            <p>📋 Nenhum projeto cadastrado ainda.</p>
            <p>Use o formulário acima para adicionar o primeiro projeto.</p>
          </div>
        ) : (
          state.projetos.map((p, i) => (
            <div key={i} className="painel-lista-item">
              <div style={{ flex: 1 }}>
                <div className="painel-nome">
                  {p.nome}
                </div>
                <div className="painel-tamanho">
                  🏢 Cliente: {p.cliente}
                </div>
                <div className="painel-tamanho">
                  📅 Entrega: {p.dataEntrega}
                </div>
              </div>
              <div className="button-group" style={{ flexDirection: 'column', minWidth: 'auto' }}>
                <button
                  onClick={() => editarProjeto(i)}
                  style={{ margin: '2px 0', padding: '8px 12px', fontSize: '0.9rem' }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => removerProjeto(i)}
                  className="remove-btn"
                  style={{ margin: '2px 0', padding: '8px 12px', fontSize: '0.9rem' }}
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

import { useEffect, useState } from "react";
import { useProjeto } from "./contextProjeto";
import { useApiData } from "./hooks";
import FeedbackMessage from "./components/FeedbackMessage";

export default function Projetos({ isActive }) {
  const { state, dispatch } = useProjeto();
  const { updateData: salvarProjetos } = useApiData("projetos", isActive);
  const [form, setForm] = useState({ nome: "", cliente: "", dataEntrega: "" });

  // Carregar projetos do backend ao iniciar e quando a aba se torna ativa
  useEffect(() => {
    if (isActive) {
      fetch("/api/projetos")
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "CARREGAR_PROJETOS", payload: data });

          // Verificar se há um projeto para edição vindo do Relatório
          const projetoParaEdicao = localStorage.getItem("projetoParaEdicao");
          if (projetoParaEdicao) {
            try {
              const projeto = JSON.parse(projetoParaEdicao);
              const index = data.findIndex((p) => p.nome === projeto.nome);
              if (index !== -1) {
                setForm(data[index]);
                dispatch({ type: "SET_EDITANDO", payload: index });
              }
              // Limpar o localStorage após usar
              localStorage.removeItem("projetoParaEdicao");
            } catch (error) {
              console.error("Erro ao carregar projeto para edição:", error);
            }
          }
        })
        .catch((error) => console.error("Erro ao carregar projetos:", error));
    }
  }, [dispatch, isActive]);

  // Função otimizada para salvar projetos
  const salvarProjetosBackend = async (novosProjetos) => {
    await salvarProjetos(novosProjetos);
  };

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
            {state.projetoEditando !== null
              ? "💾 Salvar Alterações"
              : "➕ Adicionar Projeto"}
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
                <div className="painel-nome">{p.nome}</div>
                <div className="painel-tamanho">🏢 Cliente: {p.cliente}</div>
                <div className="painel-tamanho">
                  📅 Entrega: {p.dataEntrega}
                </div>
              </div>
              <div
                className="button-group"
                style={{ flexDirection: "column", minWidth: "auto" }}
              >
                <button
                  onClick={() => editarProjeto(i)}
                  style={{
                    margin: "2px 0",
                    padding: "8px 12px",
                    fontSize: "0.9rem",
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => removerProjeto(i)}
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

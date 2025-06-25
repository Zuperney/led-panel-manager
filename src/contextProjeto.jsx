import { createContext, useContext, useReducer } from "react";

const initialState = {
  projetos: [],
  projetoEditando: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "CARREGAR_PROJETOS":
      return { ...state, projetos: action.payload };
    case "ADICIONAR_PROJETO":
      return { ...state, projetos: [...state.projetos, action.payload] };
    case "EDITAR_PROJETO":
      return {
        ...state,
        projetos: state.projetos.map((p, i) =>
          i === action.index ? action.payload : p
        ),
        projetoEditando: null,
      };
    case "REMOVER_PROJETO":
      return {
        ...state,
        projetos: state.projetos.filter((_, i) => i !== action.index),
      };
    case "SET_EDITANDO":
      return { ...state, projetoEditando: action.payload };
    default:
      return state;
  }
}

const ProjetoContext = createContext();

export function ProjetoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ProjetoContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjetoContext.Provider>
  );
}

export function useProjeto() {
  return useContext(ProjetoContext);
}

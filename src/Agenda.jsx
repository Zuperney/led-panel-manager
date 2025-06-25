import { useEffect, useState } from "react";

export default function Agenda({ isActive }) {
  const [eventos, setEventos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isActive) {
      setErro("");
      // Busca eventos do backend
      fetch("/api/eventos")
        .then((res) => {
          if (!res.ok) throw new Error("API de eventos indisponível");
          return res.json();
        })
        .then((data) => setEventos(data))
        .catch(() =>
          setErro(
            "Não foi possível carregar os eventos. Verifique se o backend está rodando e tente novamente."
          )
        );
    }
  }, [isActive]);

  // Função para cor de fundo conforme dias restantes
  function getBgColor(dataEvento) {
    const hoje = new Date();
    const data = new Date(dataEvento);
    const diff = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24));
    if (diff <= 5) return "#ffb3b3"; // vermelho discreto
    if (diff >= 6 && diff <= 8) return "#fff3b3"; // amarelo
    if (diff >= 9) return "#b3ffb3"; // verde
    return "#23283a";
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>Agenda de Eventos</h2>
      {erro ? (
        <p style={{ color: "#ff6b6b", fontWeight: 500 }}>{erro}</p>
      ) : eventos.length === 0 ? (
        <p>Nenhum evento cadastrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {eventos
            .sort((a, b) => new Date(a.data) - new Date(b.data))
            .map((evento, i) => {
              const bg = getBgColor(evento.data);
              return (
                <li
                  key={i}
                  style={{
                    background: bg,
                    borderRadius: 8,
                    marginBottom: 10,
                    padding: "12px 16px",
                    color: "#23283a",
                    boxShadow: "0 1px 4px #0002",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span style={{ fontWeight: 600, minWidth: 100 }}>
                    {new Date(evento.data).toLocaleDateString("pt-BR")}
                  </span>
                  <span>{evento.nome}</span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

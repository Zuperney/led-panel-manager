import { useState } from "react";
import { ProjetoProvider } from "./contextProjeto";
import Gabinetes from "./Gabinetes";
import Projetos from "./Projetos";
import Paineis from "./Paineis";
import Agenda from "./Agenda"; // criar depois
import Relatorio from "./Relatorio";
// import PixelMapping from "./PixelMapping"; // criar depois
// import Configuracoes from "./Configuracoes"; // criar depois
import "./App.css";

const TABS = [
  { label: "Gabinetes", key: "gabinetes" },
  { label: "Projetos", key: "projetos" },
  { label: "Painéis", key: "paineis" },
  { label: "Relatório", key: "relatorio" },
  { label: "Agenda de Eventos", key: "agenda" },
  { label: "Pixel Mapping", key: "pixelmapping" },
  { label: "Configurações", key: "configuracoes" },
];

function App() {
  const [activeTab, setActiveTab] = useState("gabinetes");

  return (
    <ProjetoProvider>
      <div className="main-tabs">
        <nav className="tabs-nav">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="tab-content">
          {activeTab === "gabinetes" && <Gabinetes />}
          {activeTab === "projetos" && <Projetos />}
          {activeTab === "paineis" && <Paineis />}
          {activeTab === "relatorio" && <Relatorio />}
          {activeTab === "agenda" && <Agenda />}
          {/* {activeTab === "pixelmapping" && <PixelMapping />} */}
          {/* {activeTab === "configuracoes" && <Configuracoes />} */}
        </div>
      </div>
    </ProjetoProvider>
  );
}

export default App;

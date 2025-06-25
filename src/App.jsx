import { useState } from "react";
import { ProjetoProvider } from "./contextProjeto";
import Gabinetes from "./Gabinetes";
import Projetos from "./Projetos";
import Paineis from "./Paineis";
import Agenda from "./Agenda";
import Relatorio from "./Relatorio";
import "./App.css";

const TABS = [
  { label: "Gabinetes", key: "gabinetes", icon: "📱" },
  { label: "Projetos", key: "projetos", icon: "📋" },
  { label: "Painéis", key: "paineis", icon: "🖥️" },
  { label: "Relatório", key: "relatorio", icon: "📊" },
  { label: "Agenda", key: "agenda", icon: "📅" },
  { label: "Pixel Mapping", key: "pixelmapping", icon: "🎯" },
  { label: "Configurações", key: "configuracoes", icon: "⚙️" },
];

function App() {
  const [activeTab, setActiveTab] = useState("gabinetes");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false); // Fechar menu mobile ao selecionar aba
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <ProjetoProvider>
      <div className="main-tabs">
        {/* Menu hambúrguer mobile */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Overlay para fechar menu mobile */}
        <div 
          className={`mobile-tabs-overlay ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu mobile */}
        <div className={`mobile-tabs-menu ${mobileMenuOpen ? "open" : ""}`}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`mobile-tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Navegação desktop */}
        <nav className="tabs-nav">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "tab-btn active" : "tab-btn"}
              onClick={() => handleTabChange(tab.key)}
            >
              <span className="desktop-only" style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="tab-content">
          <div
            style={{ display: activeTab === "gabinetes" ? "block" : "none" }}
          >
            <Gabinetes />
          </div>
          <div style={{ display: activeTab === "projetos" ? "block" : "none" }}>
            <Projetos />
          </div>
          <div style={{ display: activeTab === "paineis" ? "block" : "none" }}>
            <Paineis />
          </div>
          <div
            style={{ display: activeTab === "relatorio" ? "block" : "none" }}
          >
            <Relatorio />
          </div>
          <div style={{ display: activeTab === "agenda" ? "block" : "none" }}>
            <Agenda />
          </div>
          {/* Placeholder para futuras abas */}
          {activeTab === "pixelmapping" && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h3>🎯 Pixel Mapping</h3>
              <p>Funcionalidade em desenvolvimento...</p>
            </div>
          )}
          {activeTab === "configuracoes" && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h3>⚙️ Configurações</h3>
              <p>Funcionalidade em desenvolvimento...</p>
            </div>
          )}
        </div>
      </div>
    </ProjetoProvider>
  );
}

export default App;

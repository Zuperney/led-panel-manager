import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import {
  Monitor,
  FolderOpen,
  Tv,
  FileText,
  Calendar,
  Grid3X3,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { ProjetoProvider } from "./contextProjeto";
import Gabinetes from "./Gabinetes";
import Projetos from "./Projetos";
import Paineis from "./pages/Paineis";
import Agenda from "./Agenda";
import Relatorio from "./Relatorio";
import PixelMapping from "./PixelMapping";

const TABS = [
  { label: "Gabinetes", key: "gabinetes", icon: Monitor, color: "blue" },
  { label: "Projetos", key: "projetos", icon: FolderOpen, color: "green" },
  { label: "Painéis", key: "paineis", icon: Tv, color: "purple" },
  { label: "Relatório", key: "relatorio", icon: FileText, color: "orange" },
  { label: "Agenda", key: "agenda", icon: Calendar, color: "red" },
  { label: "Layout", key: "pixelmapping", icon: Grid3X3, color: "indigo" },
  {
    label: "Configurações",
    key: "configuracoes",
    icon: Settings,
    color: "gray",
  },
];

// Animação das abas
const tabVariants = {
  inactive: {
    opacity: 0.7,
    scale: 0.95,
    y: 5,
  },
  active: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
};

// Animação do conteúdo
const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

function App() {
  const [activeTab, setActiveTab] = useState("gabinetes");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <ProjetoProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Toaster para notificações */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
            },
          }}
        />

        {/* Container principal */}
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-header rounded-xl p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  LED Panel Manager
                </h1>
                <p className="text-gray-300 text-sm mt-1">
                  Sistema profissional de gerenciamento de painéis LED
                </p>
              </div>

              {/* Menu mobile button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="lg:hidden btn-ghost p-2"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>

            {/* Navegação Desktop */}
            <nav className="hidden lg:flex gap-2 mt-6">
              {TABS.map((tab, index) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <motion.button
                    key={tab.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      ...tabVariants[isActive ? "active" : "inactive"],
                    }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTabChange(tab.key)}
                    className={`nav-tab flex items-center gap-2 ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>

          {/* Menu Mobile */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                />

                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, x: -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="fixed top-0 left-0 h-full w-80 glass-sidebar z-50 p-6 lg:hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-white">Menu</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-ghost p-2"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  <nav className="space-y-2">
                    {TABS.map((tab, index) => {
                      const IconComponent = tab.icon;
                      const isActive = activeTab === tab.key;

                      return (
                        <motion.button
                          key={tab.key}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                          onClick={() => handleTabChange(tab.key)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <IconComponent size={18} />
                          <span className="font-medium">{tab.label}</span>
                        </motion.button>
                      );
                    })}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Conteúdo das abas */}
          <motion.div
            className="glass-card min-h-[600px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6"
              >
                {activeTab === "gabinetes" && (
                  <Gabinetes isActive={activeTab === "gabinetes"} />
                )}
                {activeTab === "projetos" && (
                  <Projetos isActive={activeTab === "projetos"} />
                )}
                {activeTab === "paineis" && (
                  <Paineis isActive={activeTab === "paineis"} />
                )}
                {activeTab === "relatorio" && (
                  <Relatorio
                    isActive={activeTab === "relatorio"}
                    onNavigateToTab={handleTabChange}
                  />
                )}
                {activeTab === "agenda" && (
                  <Agenda isActive={activeTab === "agenda"} />
                )}
                {activeTab === "pixelmapping" && (
                  <PixelMapping isActive={activeTab === "pixelmapping"} />
                )}
                {activeTab === "configuracoes" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-gray-500/20 rounded-full mb-4"
                    >
                      <Settings size={32} className="text-gray-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Configurações
                    </h3>
                    <p className="text-gray-400">
                      Funcionalidade em desenvolvimento...
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </ProjetoProvider>
  );
}

export default App;

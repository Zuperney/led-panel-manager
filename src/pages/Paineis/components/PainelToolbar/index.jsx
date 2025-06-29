// import { motion } from "framer-motion"; // Para futuras animações
import { Monitor } from "lucide-react";

/**
 * 🛠️ PainelToolbar - Barra de Ferramentas dos Painéis
 *
 * Responsabilidades:
 * - Exibir header principal da página
 * - Fornecer informações contextuais
 * - Integrar filtros avançados (futuro)
 * - Ações em lote (futuro)
 */
export default function PainelToolbar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <Monitor className="text-blue-400" />
        Painéis LED
      </h1>
      <p className="text-gray-400">
        Configure e calcule as especificações dos painéis LED
      </p>
    </motion.div>
  );
}

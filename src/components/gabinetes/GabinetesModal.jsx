import { AnimatePresence, motion } from "framer-motion";
import { InputField, Button, SelectField } from "../ModernUI";
import { Save, Plus, X, Package } from "lucide-react";

export default function GabinetesModal({
  showModal,
  setShowModal,
  editando,
  form,
  handleChange,
  handleSubmit,
  resetForm,
}) {
  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop com glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                scale: { type: "spring", stiffness: 300, damping: 25 },
              }}
              className="bg-gray-900 border-2 border-gray-600/80 
                         rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden
                         ring-1 ring-white/10"
              style={{ backgroundColor: "#111827", maxWidth: "470px" }} // gray-900 sólido + largura reduzida 30%
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="p-6 pb-4 border-b-2 border-gray-600/60 bg-gray-800"
                style={{ backgroundColor: "#1f2937" }}
              >
                {" "}
                {/* gray-800 sólido */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        delay: 0.1,
                      }}
                      className="flex items-center justify-center w-10 h-10 
                                 bg-blue-500/20 rounded-lg border border-blue-400/50"
                    >
                      <Package size={20} className="text-blue-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-100">
                        {editando !== null
                          ? "Editar Gabinete"
                          : "Novo Gabinete"}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {editando !== null
                          ? "Atualize as informações do gabinete"
                          : "Adicione um novo gabinete ao sistema"}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleClose}
                    className="flex items-center justify-center w-8 h-8 
                               bg-gray-700/50 hover:bg-red-500/20 rounded-lg 
                               text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome do Gabinete */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <InputField
                      label="Nome do Gabinete"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      required
                      placeholder="Ex: P10 Indoor 960x960"
                      tooltip="Nome identificador único para o gabinete"
                    />
                  </motion.div>

                  {/* Tipo do Gabinete */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                  >
                    <SelectField
                      label="Tipo de Gabinete"
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                      required
                      tooltip="Tipo de instalação do gabinete"
                      options={[
                        { value: "", label: "Selecione o tipo" },
                        { value: "indoor", label: "Indoor" },
                        { value: "outdoor", label: "Outdoor" },
                      ]}
                    />
                  </motion.div>

                  {/* Dimensões Físicas */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-medium text-gray-300 border-b border-gray-600/50 pb-2">
                      Dimensões Físicas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Largura"
                        name="largura"
                        type="number"
                        value={form.largura}
                        onChange={handleChange}
                        required
                        placeholder="960"
                        unit="mm"
                      />
                      <InputField
                        label="Altura"
                        name="altura"
                        type="number"
                        value={form.altura}
                        onChange={handleChange}
                        required
                        placeholder="960"
                        unit="mm"
                      />
                    </div>
                  </motion.div>

                  {/* Resolução */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-medium text-gray-300 border-b border-gray-600/50 pb-2">
                      Resolução
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Resolução X"
                        name="resolucaoX"
                        type="number"
                        value={form.resolucaoX}
                        onChange={handleChange}
                        required
                        placeholder="96"
                        unit="pixels"
                      />
                      <InputField
                        label="Resolução Y"
                        name="resolucaoY"
                        type="number"
                        value={form.resolucaoY}
                        onChange={handleChange}
                        required
                        placeholder="96"
                        unit="pixels"
                      />
                    </div>
                  </motion.div>

                  {/* Especificações Técnicas */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-medium text-gray-300 border-b border-gray-600/50 pb-2">
                      Especificações Técnicas
                    </h3>
                    <InputField
                      label="Pixel Pitch (Auto-calculado)"
                      name="pixelPitch"
                      type="number"
                      step="0.1"
                      value={form.pixelPitch}
                      onChange={handleChange}
                      required
                      placeholder={
                        form.largura && form.resolucaoX
                          ? "Calculado automaticamente"
                          : "Será calculado quando largura e resolução X forem preenchidos"
                      }
                      unit="mm"
                      tooltip="Calculado automaticamente: Largura (mm) ÷ Resolução X (pixels)"
                      readOnly={
                        !!(form.largura && form.resolucaoX && form.pixelPitch)
                      }
                      className={
                        form.largura && form.resolucaoX && form.pixelPitch
                          ? "auto-calculated"
                          : ""
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Potência"
                        name="potencia"
                        type="number"
                        value={form.potencia}
                        onChange={handleChange}
                        required
                        placeholder="800"
                        unit="W"
                      />
                      <InputField
                        label="Peso"
                        name="peso"
                        type="number"
                        step="0.1"
                        value={form.peso}
                        onChange={handleChange}
                        required
                        placeholder="35.5"
                        unit="kg"
                      />
                    </div>
                  </motion.div>

                  {/* Fabricante */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <InputField
                      label="Fabricante"
                      name="fabricante"
                      value={form.fabricante}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Yestech, Novastar, Linsn"
                      tooltip="Fabricante do gabinete LED"
                    />
                  </motion.div>
                </form>
              </div>

              {/* Footer */}
              <div
                className="p-6 pt-4 border-t-2 border-gray-600/60 bg-gray-800"
                style={{ backgroundColor: "#1f2937" }}
              >
                {" "}
                {/* gray-800 sólido */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    className="flex-1 sm:flex-none sm:w-32"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant={editando !== null ? "primary" : "success"}
                    icon={editando !== null ? Save : Plus}
                    className="flex-1"
                    onClick={handleSubmit}
                  >
                    {editando !== null
                      ? "Salvar Alterações"
                      : "Adicionar Gabinete"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

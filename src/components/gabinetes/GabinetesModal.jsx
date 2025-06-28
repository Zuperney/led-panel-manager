import { AnimatePresence } from "framer-motion";
import { Modal, InputField, Button } from "../ModernUI";
import { Save, Plus } from "lucide-react";

export default function GabinetesModal({
  showModal,
  setShowModal,
  editando,
  form,
  handleChange,
  handleSubmit,
  resetForm,
}) {
  return (
    <AnimatePresence>
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title={editando !== null ? "Editar Gabinete" : "Novo Gabinete"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Nome do Gabinete"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              placeholder="Ex: P10 Indoor 960x960"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Largura (mm)"
                name="largura"
                type="number"
                value={form.largura}
                onChange={handleChange}
                required
                placeholder="960"
              />
              <InputField
                label="Altura (mm)"
                name="altura"
                type="number"
                value={form.altura}
                onChange={handleChange}
                required
                placeholder="960"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Resolução X (pixels)"
                name="resolucaoX"
                type="number"
                value={form.resolucaoX}
                onChange={handleChange}
                required
                placeholder="96"
              />
              <InputField
                label="Resolução Y (pixels)"
                name="resolucaoY"
                type="number"
                value={form.resolucaoY}
                onChange={handleChange}
                required
                placeholder="96"
              />
            </div>

            <InputField
              label="Pixel Pitch (mm)"
              name="pixelPitch"
              type="number"
              step="0.1"
              value={form.pixelPitch}
              onChange={handleChange}
              required
              placeholder="10.0"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Potência (W)"
                name="potencia"
                type="number"
                value={form.potencia}
                onChange={handleChange}
                required
                placeholder="800"
              />
              <InputField
                label="Peso (kg)"
                name="peso"
                type="number"
                step="0.1"
                value={form.peso}
                onChange={handleChange}
                required
                placeholder="35.5"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                icon={editando !== null ? Save : Plus}
                className="flex-1"
              >
                {editando !== null ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
}

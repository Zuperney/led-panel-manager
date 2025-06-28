// Hook customizado para lógica de formulário de gabinetes
import { useState } from "react";

export function useGabineteForm(
  gabinetes,
  setGabinetes,
  salvarGabinetes,
  showFeedback
) {
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    largura: "",
    altura: "",
    pixelPitch: "",
    potencia: "",
    peso: "",
    resolucaoX: "",
    resolucaoY: "",
  });

  // Reset form
  const resetForm = () => {
    setForm({
      nome: "",
      largura: "",
      altura: "",
      pixelPitch: "",
      potencia: "",
      peso: "",
      resolucaoX: "",
      resolucaoY: "",
    });
    setEditando(null);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const novoGabinete = {
        ...form,
        largura: Number(form.largura),
        altura: Number(form.altura),
        pixelPitch: Number(form.pixelPitch),
        potencia: Number(form.potencia),
        peso: Number(form.peso),
        resolucaoX: Number(form.resolucaoX),
        resolucaoY: Number(form.resolucaoY),
      };

      // Verificar duplicidade
      const nomeDuplicado = gabinetes.some(
        (g, idx) =>
          g.nome.trim().toLowerCase() ===
            novoGabinete.nome.trim().toLowerCase() && editando !== idx
      );

      if (nomeDuplicado) {
        showFeedback(
          "Já existe um gabinete com esse nome. Escolha outro nome.",
          "error"
        );
        return;
      }

      let novosGabinetes;
      if (editando !== null) {
        // Editar gabinete existente
        novosGabinetes = [...gabinetes];
        novosGabinetes[editando] = novoGabinete;
        showFeedback(
          `Gabinete "${novoGabinete.nome}" atualizado com sucesso!`,
          "success"
        );
      } else {
        // Adicionar novo gabinete
        novosGabinetes = [...gabinetes, novoGabinete];
        showFeedback(
          `Gabinete "${novoGabinete.nome}" adicionado com sucesso!`,
          "success"
        );
      }

      setGabinetes(novosGabinetes);
      await salvarGabinetes(novosGabinetes);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar gabinete:", error);
      showFeedback("Erro ao salvar gabinete. Tente novamente.", "error");
    }
  };

  // Editar gabinete
  const editarGabinete = (index) => {
    const gabinete = gabinetes[index];
    setForm(gabinete);
    setEditando(index);
  };

  return {
    editando,
    form,
    resetForm,
    handleChange,
    handleSubmit,
    editarGabinete,
  };
}

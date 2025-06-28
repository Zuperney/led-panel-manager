// Hook customizado para lógica de formulário de gabinetes
import { useState } from "react";

export function useGabineteForm(
  gabinetes,
  setGabinetes,
  salvarGabinetes,
  showFeedback,
  onSubmitSuccess
) {
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    largura: "",
    altura: "",
    pixelPitch: "",
    potencia: "",
    peso: "",
    resolucaoX: "",
    resolucaoY: "",
    fabricante: "",
  });

  // Reset form
  const resetForm = () => {
    setForm({
      nome: "",
      tipo: "",
      largura: "",
      altura: "",
      pixelPitch: "",
      potencia: "",
      peso: "",
      resolucaoX: "",
      resolucaoY: "",
      fabricante: "",
    });
    setEditando(null);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const newForm = { ...prev, [name]: value };

      // Cálculo automático do pixel pitch
      // Fórmula: largura (mm) / resolução X (pixels)
      if (name === "largura" || name === "resolucaoX") {
        const largura =
          name === "largura" ? parseFloat(value) : parseFloat(newForm.largura);
        const resolucaoX =
          name === "resolucaoX"
            ? parseFloat(value)
            : parseFloat(newForm.resolucaoX);

        if (largura > 0 && resolucaoX > 0) {
          const pixelPitch = largura / resolucaoX;
          newForm.pixelPitch = pixelPitch.toFixed(2); // Arredonda para 2 casas decimais
        }
      }

      return newForm;
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const novoGabinete = {
        nome: form.nome,
        tipo: form.tipo,
        largura: Number(form.largura),
        altura: Number(form.altura),
        pixels_largura: Number(form.resolucaoX),
        pixels_altura: Number(form.resolucaoY),
        potencia: Number(form.potencia),
        peso: Number(form.peso),
        pitch: Number(form.pixelPitch),
        fabricante: form.fabricante,
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

      // Chamar callback de sucesso se fornecido (para fechar modal, etc.)
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Erro ao salvar gabinete:", error);
      showFeedback("Erro ao salvar gabinete. Tente novamente.", "error");
    }
  };

  // Editar gabinete
  const editarGabinete = (index) => {
    const gabinete = gabinetes[index];
    setForm({
      nome: gabinete.nome || "",
      tipo: gabinete.tipo || "",
      largura: gabinete.largura || "",
      altura: gabinete.altura || "",
      resolucaoX: gabinete.pixels_largura || "",
      resolucaoY: gabinete.pixels_altura || "",
      pixelPitch: gabinete.pitch || "",
      potencia: gabinete.potencia || "",
      peso: gabinete.peso || "",
      fabricante: gabinete.fabricante || "",
    });
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

import React, { useState } from "react";
import type {
  Project,
  ProjectFormData,
  ProjectFormProps,
  ProjectFormErrors,
} from "../types/project.types";

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || "",
    client: initialData?.client || "",
    deliveryDate: initialData?.deliveryDate
      ? new Date(initialData.deliveryDate).toISOString().split("T")[0]
      : "",
    status: initialData?.status || "planning",
    description: initialData?.description || "",
  });

  // Estado dos erros
  const [errors, setErrors] = useState<ProjectFormErrors>({});

  // Função de validação
  const validateForm = (): boolean => {
    const newErrors: ProjectFormErrors = {};

    // Validações obrigatórias
    if (!formData.name.trim()) newErrors.name = "Nome do projeto é obrigatório";
    if (!formData.client.trim()) newErrors.client = "Cliente é obrigatório";
    if (!formData.deliveryDate)
      newErrors.deliveryDate = "Data de entrega é obrigatória";

    // Validação de data
    if (formData.deliveryDate) {
      const deliveryDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deliveryDate < today) {
        newErrors.deliveryDate = "Data de entrega não pode ser no passado";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler para mudanças nos inputs
  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handler para submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Converter data para ISO string
      const submitData = {
        ...formData,
        deliveryDate: new Date(formData.deliveryDate).toISOString(),
      };
      onSubmit(submitData);
    }
  };

  // Calcular dias restantes
  const getDaysRemaining = () => {
    if (!formData.deliveryDate) return null;

    const deliveryDate = new Date(formData.deliveryDate);
    const today = new Date();
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === "create" ? "✨ Novo Projeto" : "✏️ Editar Projeto"}
        </h2>
        <p className="text-gray-600">
          {mode === "create"
            ? "Crie um novo projeto para gerenciar"
            : "Atualize as informações do projeto"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção: Informações Básicas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📋 Informações do Projeto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome do Projeto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Projeto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Painel LED Shopping Center ABC"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.client ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Shopping Center ABC Ltda"
              />
              {errors.client && (
                <p className="text-red-500 text-sm mt-1">{errors.client}</p>
              )}
            </div>

            {/* Data de Entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Entrega *
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  handleInputChange("deliveryDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.deliveryDate ? "border-red-500" : "border-gray-300"
                }`}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.deliveryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.deliveryDate}
                </p>
              )}
              {daysRemaining !== null && daysRemaining >= 0 && (
                <p
                  className={`text-sm mt-1 ${
                    daysRemaining <= 7
                      ? "text-red-600"
                      : daysRemaining <= 30
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {daysRemaining === 0
                    ? "📅 Entrega hoje!"
                    : daysRemaining === 1
                    ? "⏰ Entrega amanhã!"
                    : `📆 ${daysRemaining} dias restantes`}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as Project["status"]
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="planning">📋 Planejamento</option>
                <option value="in-progress">🚧 Em Andamento</option>
                <option value="delivered">✅ Entregue</option>
                <option value="cancelled">❌ Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção: Descrição */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📝 Descrição do Projeto
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição e observações
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Descreva o projeto, requisitos especiais, localização, etc..."
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Salvando...
              </span>
            ) : mode === "create" ? (
              "✨ Criar Projeto"
            ) : (
              "💾 Salvar Alterações"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;

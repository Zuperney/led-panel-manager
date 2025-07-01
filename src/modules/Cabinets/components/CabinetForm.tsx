import React, { useState, useEffect } from "react";
import type {
  CabinetFormData,
  CabinetFormProps,
  CabinetFormErrors,
} from "../types/cabinet.types";

// Função de cálculo para preview do pixel pitch
const calculatePixelPitch = (widthMm: number, widthPixels: number): number => {
  if (widthPixels === 0) return 0;
  return Number((widthMm / widthPixels).toFixed(2));
};

const CabinetForm: React.FC<CabinetFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
  formMode = "basic",
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<CabinetFormData>({
    name: initialData?.name || "",
    type: initialData?.type || "indoor",
    widthMm: initialData?.widthMm || 0,
    heightMm: initialData?.heightMm || 0,
    widthPixels: initialData?.widthPixels || 0,
    heightPixels: initialData?.heightPixels || 0,
    powerWatts: initialData?.powerWatts || 0,
    weight: initialData?.weight || 0,
    voltage: initialData?.voltage || 220,
    isBivolt: initialData?.isBivolt || false,
    brightness: initialData?.brightness || undefined,
    refreshRate: initialData?.refreshRate || undefined,
    powerFactor: initialData?.powerFactor || undefined,
    description: initialData?.description || "",
  });

  // Estado dos erros
  const [errors, setErrors] = useState<CabinetFormErrors>({});

  // Estado do modo do formulário (pode ser alterado pelo usuário)
  const [currentFormMode, setCurrentFormMode] = useState(formMode);

  // Estado do pixel pitch calculado
  const [calculatedPixelPitch, setCalculatedPixelPitch] = useState<number>(0);

  // Calcular pixel pitch em tempo real
  useEffect(() => {
    if (formData.widthMm > 0 && formData.widthPixels > 0) {
      const pitch = calculatePixelPitch(formData.widthMm, formData.widthPixels);
      setCalculatedPixelPitch(pitch);
    }
  }, [formData.widthMm, formData.widthPixels]);

  // Função de validação
  const validateForm = (): boolean => {
    const newErrors: CabinetFormErrors = {};

    // Validações obrigatórias
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";

    // Validações numéricas básicas
    if (formData.widthMm <= 0)
      newErrors.widthMm = "Largura deve ser maior que 0";
    if (formData.heightMm <= 0)
      newErrors.heightMm = "Altura deve ser maior que 0";
    if (formData.widthPixels <= 0)
      newErrors.widthPixels = "Largura em pixels deve ser maior que 0";
    if (formData.heightPixels <= 0)
      newErrors.heightPixels = "Altura em pixels deve ser maior que 0";
    if (formData.powerWatts <= 0)
      newErrors.powerWatts = "Potência deve ser maior que 0";
    if (formData.weight <= 0) newErrors.weight = "Peso deve ser maior que 0";

    // Validações do modo completo
    if (currentFormMode === "complete") {
      if (formData.voltage <= 0)
        newErrors.voltage = "Voltagem deve ser maior que 0";
      if (formData.brightness && formData.brightness <= 0) {
        newErrors.brightness = "Brilho deve ser maior que 0";
      }
      if (formData.refreshRate && formData.refreshRate <= 0) {
        newErrors.refreshRate = "Taxa de atualização deve ser maior que 0";
      }
      if (
        formData.powerFactor &&
        (formData.powerFactor <= 0 || formData.powerFactor > 1)
      ) {
        newErrors.powerFactor = "Fator de potência deve estar entre 0 e 1";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler para mudanças nos inputs
  const handleInputChange = (
    field: keyof CabinetFormData,
    value: string | number | boolean | undefined
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
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === "create" ? "✨ Novo Gabinete LED" : "✏️ Editar Gabinete"}
        </h2>
        <p className="text-gray-600">
          {mode === "create"
            ? "Adicione um novo gabinete LED ao catálogo"
            : "Atualize as informações do gabinete LED"}
        </p>
      </div>

      {/* Seletor de Modo */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Modo de Preenchimento
        </h3>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="formMode"
              value="basic"
              checked={currentFormMode === "basic"}
              onChange={(e) =>
                setCurrentFormMode(e.target.value as "basic" | "complete")
              }
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              🟦 Básico - Informações essenciais
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="formMode"
              value="complete"
              checked={currentFormMode === "complete"}
              onChange={(e) =>
                setCurrentFormMode(e.target.value as "basic" | "complete")
              }
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              🟨 Completo - Todas as especificações
            </span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção: Informações Básicas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📋 Informações Básicas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Gabinete P10 Indoor 320x160"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  handleInputChange(
                    "type",
                    e.target.value as "indoor" | "outdoor"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="indoor">🏠 Indoor</option>
                <option value="outdoor">🌤️ Outdoor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção: Dimensões */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📐 Dimensões
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Largura mm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Largura (mm) *
              </label>
              <input
                type="number"
                value={formData.widthMm || ""}
                onChange={(e) =>
                  handleInputChange("widthMm", Number(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.widthMm ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: 320"
                min="1"
              />
              {errors.widthMm && (
                <p className="text-red-500 text-sm mt-1">{errors.widthMm}</p>
              )}
            </div>

            {/* Altura mm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (mm) *
              </label>
              <input
                type="number"
                value={formData.heightMm || ""}
                onChange={(e) =>
                  handleInputChange("heightMm", Number(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.heightMm ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: 160"
                min="1"
              />
              {errors.heightMm && (
                <p className="text-red-500 text-sm mt-1">{errors.heightMm}</p>
              )}
            </div>

            {/* Largura Pixels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Largura (pixels) *
              </label>
              <input
                type="number"
                value={formData.widthPixels || ""}
                onChange={(e) =>
                  handleInputChange("widthPixels", Number(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.widthPixels ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: 32"
                min="1"
              />
              {errors.widthPixels && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.widthPixels}
                </p>
              )}
            </div>

            {/* Altura Pixels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (pixels) *
              </label>
              <input
                type="number"
                value={formData.heightPixels || ""}
                onChange={(e) =>
                  handleInputChange("heightPixels", Number(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.heightPixels ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: 16"
                min="1"
              />
              {errors.heightPixels && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.heightPixels}
                </p>
              )}
            </div>
          </div>

          {/* Pixel Pitch Calculado */}
          {calculatedPixelPitch > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                🧮 Pixel Pitch Calculado:{" "}
                <span className="font-mono text-lg">
                  {calculatedPixelPitch}mm
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Seção: Especificações Básicas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            ⚡ Especificações Básicas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Potência */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Potência (W) *
              </label>
              <input
                type="number"
                value={formData.powerWatts || ""}
                onChange={(e) =>
                  handleInputChange("powerWatts", Number(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.powerWatts ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: 120"
                min="1"
              />
              {errors.powerWatts && (
                <p className="text-red-500 text-sm mt-1">{errors.powerWatts}</p>
              )}
            </div>

            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) *
              </label>
              <input
                type="number"
                value={formData.weight || ""}
                onChange={(e) =>
                  handleInputChange("weight", Number(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: 8.5"
                min="0.1"
                step="0.1"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
              )}
            </div>
          </div>
        </div>

        {/* Seção: Especificações Completas (modo completo apenas) */}
        {currentFormMode === "complete" && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              🔧 Especificações Completas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Voltagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voltagem (V) *
                </label>
                <input
                  type="number"
                  value={formData.voltage || ""}
                  onChange={(e) =>
                    handleInputChange("voltage", Number(e.target.value))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.voltage ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="220"
                  min="1"
                />
                {errors.voltage && (
                  <p className="text-red-500 text-sm mt-1">{errors.voltage}</p>
                )}
              </div>

              {/* Checkbox Bivolt */}
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="isBivolt"
                  checked={formData.isBivolt}
                  onChange={(e) =>
                    handleInputChange("isBivolt", e.target.checked)
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="isBivolt"
                  className="text-sm font-medium text-gray-700"
                >
                  ⚡ Bivolt (110V/220V)
                </label>
              </div>

              {/* Brilho */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brilho (nits)
                </label>
                <input
                  type="number"
                  value={formData.brightness || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "brightness",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.brightness ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: 5000"
                  min="1"
                />
                {errors.brightness && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.brightness}
                  </p>
                )}
              </div>

              {/* Taxa de Atualização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxa de Atualização (Hz)
                </label>
                <input
                  type="number"
                  value={formData.refreshRate || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "refreshRate",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.refreshRate ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: 3840"
                  min="1"
                />
                {errors.refreshRate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.refreshRate}
                  </p>
                )}
              </div>

              {/* Fator de Potência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fator de Potência (coseno)
                </label>
                <input
                  type="number"
                  value={formData.powerFactor || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "powerFactor",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.powerFactor ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: 0.95"
                  min="0"
                  max="1"
                  step="0.01"
                />
                {errors.powerFactor && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.powerFactor}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Seção: Descrição */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📝 Descrição Adicional
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição e observações
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Informações adicionais, características especiais, observações de uso..."
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
              "✨ Criar Gabinete"
            ) : (
              "💾 Salvar Alterações"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CabinetForm;

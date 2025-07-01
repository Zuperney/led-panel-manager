import React, { useState, useEffect } from 'react';
import type { Panel } from '../types/panel.types';

// Função de cálculo para preview (sem dependência de Panel completo)
const calculatePreviewMetrics = (width: number, height: number, pixelPitch: number) => {
  if (width <= 0 || height <= 0 || pixelPitch <= 0) return null;
  
  const pixelsPerMeter = 1000 / pixelPitch;
  const horizontalPixels = Math.floor((width / 1000) * pixelsPerMeter);
  const verticalPixels = Math.floor((height / 1000) * pixelsPerMeter);
  const totalPixels = horizontalPixels * verticalPixels;
  const pixelDensity = totalPixels / ((width / 1000) * (height / 1000));

  return {
    totalPixels,
    pixelDensity,
    resolution: {
      horizontal: horizontalPixels,
      vertical: verticalPixels,
    },
  };
};

export interface PanelFormData {
  name: string;
  manufacturer: string;
  model: string;
  width: number;
  height: number;
  pixelPitch: number;
  powerConsumption: number;
  brightness: number;
  refreshRate: number;
  inputVoltage: number;
  operatingTemperatureMin: number;
  operatingTemperatureMax: number;
  ipRating: string;
  weight: number;
  price?: number;
  description?: string;
}

export interface PanelFormProps {
  initialData?: Panel;
  onSubmit: (data: PanelFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export interface PanelFormErrors {
  [key: string]: string;
}

const PanelForm: React.FC<PanelFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create'
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<PanelFormData>({
    name: initialData?.name || '',
    manufacturer: initialData?.manufacturer || '',
    model: initialData?.model || '',
    width: initialData?.width || 0,
    height: initialData?.height || 0,
    pixelPitch: initialData?.pixelPitch || 0,
    powerConsumption: initialData?.powerConsumption || 0,
    brightness: initialData?.brightness || 0,
    refreshRate: initialData?.refreshRate || 0,
    inputVoltage: initialData?.inputVoltage || 0,
    operatingTemperatureMin: initialData?.operatingTemperature?.min || -10,
    operatingTemperatureMax: initialData?.operatingTemperature?.max || 60,
    ipRating: initialData?.ipRating || 'IP65',
    weight: initialData?.weight || 0,
    price: initialData?.price || undefined,
    description: initialData?.description || ''
  });

  // Estado dos erros
  const [errors, setErrors] = useState<PanelFormErrors>({});

  // Estado dos cálculos em tempo real
  const [calculations, setCalculations] = useState<any>(null);

  // Validação em tempo real
  useEffect(() => {
    if (formData.width > 0 && formData.height > 0 && formData.pixelPitch > 0) {
      try {
        const calc = calculatePreviewMetrics(
          formData.width,
          formData.height,
          formData.pixelPitch
        );
        setCalculations(calc);
      } catch (error) {
        setCalculations(null);
      }
    }
  }, [formData.width, formData.height, formData.pixelPitch]);

  // Função de validação
  const validateForm = (): boolean => {
    const newErrors: PanelFormErrors = {};

    // Validações obrigatórias
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Fabricante é obrigatório';
    if (!formData.model.trim()) newErrors.model = 'Modelo é obrigatório';
    
    // Validações numéricas
    if (formData.width <= 0) newErrors.width = 'Largura deve ser maior que 0';
    if (formData.height <= 0) newErrors.height = 'Altura deve ser maior que 0';
    if (formData.pixelPitch <= 0) newErrors.pixelPitch = 'Pixel pitch deve ser maior que 0';
    if (formData.powerConsumption <= 0) newErrors.powerConsumption = 'Consumo deve ser maior que 0';
    if (formData.brightness <= 0) newErrors.brightness = 'Brilho deve ser maior que 0';
    if (formData.refreshRate <= 0) newErrors.refreshRate = 'Taxa de atualização deve ser maior que 0';
    if (formData.inputVoltage <= 0) newErrors.inputVoltage = 'Voltagem deve ser maior que 0';
    if (formData.weight <= 0) newErrors.weight = 'Peso deve ser maior que 0';

    // Validações de range
    if (formData.operatingTemperatureMin >= formData.operatingTemperatureMax) {
      newErrors.operatingTemperatureMin = 'Temperatura mínima deve ser menor que máxima';
    }

    // Validações específicas
    if (formData.pixelPitch < 0.5 || formData.pixelPitch > 50) {
      newErrors.pixelPitch = 'Pixel pitch deve estar entre 0.5mm e 50mm';
    }

    if (formData.price && formData.price < 0) {
      newErrors.price = 'Preço não pode ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler para mudanças nos inputs
  const handleInputChange = (field: keyof PanelFormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'create' ? '✨ Novo Painel LED' : '✏️ Editar Painel'}
        </h2>
        <p className="text-gray-600">
          {mode === 'create' 
            ? 'Adicione um novo painel LED ao catálogo' 
            : 'Atualize as informações do painel LED'
          }
        </p>
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
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Painel LED P10 Indoor"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Fabricante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fabricante *
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.manufacturer ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Novastar, Linsn, Colorlight"
              />
              {errors.manufacturer && <p className="text-red-500 text-sm mt-1">{errors.manufacturer}</p>}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.model ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: P10-RGB-Indoor"
              />
              {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
            </div>

            {/* IP Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proteção IP *
              </label>
              <select
                value={formData.ipRating}
                onChange={(e) => handleInputChange('ipRating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="IP20">IP20 - Indoor</option>
                <option value="IP40">IP40 - Indoor Protegido</option>
                <option value="IP54">IP54 - Outdoor Básico</option>
                <option value="IP65">IP65 - Outdoor Padrão</option>
                <option value="IP68">IP68 - Outdoor Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção: Dimensões e Especificações */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📐 Dimensões e Especificações
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Largura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Largura (mm) *
              </label>
              <input
                type="number"
                value={formData.width || ''}
                onChange={(e) => handleInputChange('width', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.width ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 320"
                min="1"
              />
              {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
            </div>

            {/* Altura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (mm) *
              </label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.height ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 160"
                min="1"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>

            {/* Pixel Pitch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pixel Pitch (mm) *
              </label>
              <input
                type="number"
                value={formData.pixelPitch || ''}
                onChange={(e) => handleInputChange('pixelPitch', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pixelPitch ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 10"
                min="0.5"
                max="50"
                step="0.1"
              />
              {errors.pixelPitch && <p className="text-red-500 text-sm mt-1">{errors.pixelPitch}</p>}
            </div>

            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) *
              </label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 8.5"
                min="0.1"
                step="0.1"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>

            {/* Preço (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value ? Number(e.target.value) : undefined)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 1250.00"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>
        </div>

        {/* Seção: Especificações Elétricas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            ⚡ Especificações Elétricas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Consumo de Energia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consumo (W) *
              </label>
              <input
                type="number"
                value={formData.powerConsumption || ''}
                onChange={(e) => handleInputChange('powerConsumption', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.powerConsumption ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 120"
                min="1"
              />
              {errors.powerConsumption && <p className="text-red-500 text-sm mt-1">{errors.powerConsumption}</p>}
            </div>

            {/* Voltagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voltagem (V) *
              </label>
              <input
                type="number"
                value={formData.inputVoltage || ''}
                onChange={(e) => handleInputChange('inputVoltage', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.inputVoltage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 220"
                min="1"
              />
              {errors.inputVoltage && <p className="text-red-500 text-sm mt-1">{errors.inputVoltage}</p>}
            </div>

            {/* Brilho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brilho (nits) *
              </label>
              <input
                type="number"
                value={formData.brightness || ''}
                onChange={(e) => handleInputChange('brightness', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.brightness ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 5000"
                min="1"
              />
              {errors.brightness && <p className="text-red-500 text-sm mt-1">{errors.brightness}</p>}
            </div>

            {/* Taxa de Atualização */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa de Atualização (Hz) *
              </label>
              <input
                type="number"
                value={formData.refreshRate || ''}
                onChange={(e) => handleInputChange('refreshRate', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.refreshRate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 3840"
                min="1"
              />
              {errors.refreshRate && <p className="text-red-500 text-sm mt-1">{errors.refreshRate}</p>}
            </div>

            {/* Temperatura Mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temp. Mín. (°C) *
              </label>
              <input
                type="number"
                value={formData.operatingTemperatureMin || ''}
                onChange={(e) => handleInputChange('operatingTemperatureMin', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.operatingTemperatureMin ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: -10"
              />
              {errors.operatingTemperatureMin && <p className="text-red-500 text-sm mt-1">{errors.operatingTemperatureMin}</p>}
            </div>

            {/* Temperatura Máxima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temp. Máx. (°C) *
              </label>
              <input
                type="number"
                value={formData.operatingTemperatureMax || ''}
                onChange={(e) => handleInputChange('operatingTemperatureMax', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.operatingTemperatureMax ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 60"
              />
              {errors.operatingTemperatureMax && <p className="text-red-500 text-sm mt-1">{errors.operatingTemperatureMax}</p>}
            </div>
          </div>
        </div>

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
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Informações adicionais, características especiais, observações de uso..."
            />
          </div>
        </div>

        {/* Preview de Cálculos */}
        {calculations && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              🧮 Preview dos Cálculos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-gray-700">Resolução:</span>
                <div className="text-blue-600 font-mono">
                  {calculations.resolution?.horizontal || 0} × {calculations.resolution?.vertical || 0} pixels
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-gray-700">Total de Pixels:</span>
                <div className="text-blue-600 font-mono">
                  {calculations.totalPixels?.toLocaleString() || 0}
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-gray-700">Densidade:</span>
                <div className="text-blue-600 font-mono">
                  {calculations.pixelDensity?.toFixed(0) || 0} pixels/m²
                </div>
              </div>
            </div>
          </div>
        )}

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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : (
              mode === 'create' ? '✨ Criar Painel' : '💾 Salvar Alterações'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PanelForm;

# ⚡ Módulo Panels - Gerenciamento de Painéis LED

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tipos e Interfaces](#tipos-e-interfaces)
- [Hooks Disponíveis](#hooks-disponíveis)
- [Componentes](#componentes)
- [Cálculos e Utilitários](#cálculos-e-utilitários)
- [Exemplos de Uso](#exemplos-de-uso)

## 🎯 Visão Geral

O módulo Panels é responsável pelo gerenciamento completo de painéis LED, incluindo:

- **Catálogo de painéis** - Especificações técnicas detalhadas
- **Cálculos automáticos** - Potência, dimensões, densidade de pixels
- **CRUD completo** - Create, Read, Update, Delete
- **Interface intuitiva** - Cards visuais com informações organizadas

## ✨ Funcionalidades

### ✅ Implementadas

- **Catálogo de painéis** com especificações completas
- **Cálculos automáticos** de métricas técnicas
- **Interface visual** com cards responsivos
- **Filtragem e busca** (estrutura pronta)
- **Validações** de dados de entrada

### 🔄 Em Desenvolvimento

- **Formulários de CRUD** completos
- **Filtros avançados** por especificações
- **Importação/exportação** de catálogos
- **Comparação** entre painéis

### ⏳ Planejadas

- **Test cards** específicos por painel
- **Histórico de alterações**
- **Integração com fornecedores**
- **Calculadora de layouts**

## 🔷 Tipos e Interfaces

### Interface Principal - Panel

```typescript
interface Panel {
  id: string;
  name: string;
  width: number; // mm
  height: number; // mm
  pixelPitch: number; // mm
  powerConsumption: number; // watts
  brightness: number; // nits
  refreshRate: number; // Hz
  inputVoltage: number; // V
  operatingTemperature: {
    min: number; // °C
    max: number; // °C
  };
  ipRating: string; // IP65, IP54, etc.
  weight: number; // kg
  manufacturer: string;
  model: string;
  price?: number; // opcional
  description?: string;
  specifications?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Cálculos - PanelCalculations

```typescript
interface PanelCalculations {
  totalPixels: number;
  pixelDensity: number; // pixels/m²
  totalPower: number; // watts
  dimensions: {
    widthMm: number;
    heightMm: number;
    depthMm: number;
  };
  resolution: {
    horizontal: number;
    vertical: number;
  };
}
```

### Configuração - PanelConfiguration

```typescript
interface PanelConfiguration {
  panels: Panel[];
  layout: {
    rows: number;
    columns: number;
  };
  totalDimensions: {
    width: number;
    height: number;
  };
  totalPower: number;
  totalWeight: number;
}
```

## 🪝 Hooks Disponíveis

### usePanelData

Hook principal para gerenciamento de painéis:

```typescript
const {
  panels, // Panel[] - Lista de painéis
  loading, // boolean - Estado de carregamento
  error, // string | null - Mensagens de erro
  createPanel, // (panel: CreatePanelData) => Promise<void>
  updatePanel, // (id: string, updates: Partial<Panel>) => Promise<void>
  deletePanel, // (id: string) => Promise<void>
  getPanelById, // (id: string) => Panel | undefined
} = usePanelData();
```

**Exemplo de uso:**

```typescript
const PanelManagement: React.FC = () => {
  const { panels, loading, createPanel } = usePanelData();

  const handleCreatePanel = async (panelData: CreatePanelData) => {
    try {
      await createPanel(panelData);
      toast.success("Painel criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar painel");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {panels.map((panel) => (
        <PanelCard key={panel.id} panel={panel} />
      ))}
    </div>
  );
};
```

## 🧩 Componentes

### PanelCard

Componente principal para exibição de painéis:

```typescript
interface PanelCardProps {
  panel: Panel;
  onEdit?: (panel: Panel) => void;
  onDelete?: (panel: Panel) => void;
  onDuplicate?: (panel: Panel) => void;
  onClick?: (panel: Panel) => void;
}

<PanelCard
  panel={panel}
  onClick={handleViewPanel}
  onEdit={handleEditPanel}
  onDelete={handleDeletePanel}
/>;
```

**Funcionalidades do PanelCard:**

- ✅ Display de especificações técnicas
- ✅ Cálculos automáticos exibidos
- ✅ Actions menu (edit, delete, duplicate)
- ✅ Visual feedback (hover, loading states)
- ✅ Responsividade completa

### Componentes Planejados

- **PanelForm** - Formulário de criação/edição
- **PanelList** - Lista com filtros e paginação
- **PanelCompare** - Comparação entre painéis
- **PanelSpecs** - Visualização detalhada de especificações

## 🔢 Cálculos e Utilitários

### calculatePanelMetrics

Função principal para cálculos de painéis:

```typescript
const calculatePanelMetrics = (panel: Panel): PanelCalculations => {
  const totalPixels =
    (panel.width / panel.pixelPitch) * (panel.height / panel.pixelPitch);

  const pixelDensity = totalPixels / ((panel.width * panel.height) / 1000000);

  return {
    totalPixels: Math.round(totalPixels),
    pixelDensity: Math.round(pixelDensity),
    totalPower: panel.powerConsumption,
    dimensions: {
      widthMm: panel.width,
      heightMm: panel.height,
      depthMm: 80, // valor padrão
    },
    resolution: {
      horizontal: Math.round(panel.width / panel.pixelPitch),
      vertical: Math.round(panel.height / panel.pixelPitch),
    },
  };
};
```

### Outras Funções Utilitárias

```typescript
// Formatação de potência
const formatPowerConsumption = (watts: number): string => {
  return watts >= 1000 ? `${(watts / 1000).toFixed(1)}kW` : `${watts}W`;
};

// Formatação de dimensões
const formatDimensions = (width: number, height: number): string => {
  return `${width}mm × ${height}mm`;
};

// Validação de painel
const validatePanel = (panel: Partial<Panel>): ValidationResult => {
  const errors: string[] = [];

  if (!panel.name || panel.name.trim().length === 0) {
    errors.push("Nome é obrigatório");
  }

  if (!panel.width || panel.width <= 0) {
    errors.push("Largura deve ser maior que 0");
  }

  // ... outras validações

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

## 📝 Exemplos de Uso

### Exemplo 1: Listagem Básica

```typescript
const PanelCatalog: React.FC = () => {
  const { panels, loading } = usePanelData();

  if (loading) {
    return <div>Carregando painéis...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Catálogo de Painéis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panels.map((panel) => (
          <PanelCard
            key={panel.id}
            panel={panel}
            onClick={(panel) => console.log("Panel clicked:", panel.name)}
          />
        ))}
      </div>
    </div>
  );
};
```

### Exemplo 2: Criação de Painel

```typescript
const CreatePanelExample: React.FC = () => {
  const { createPanel } = usePanelData();

  const handleSubmit = async (formData: PanelFormData) => {
    const newPanel: CreatePanelData = {
      name: formData.name,
      width: parseFloat(formData.width),
      height: parseFloat(formData.height),
      pixelPitch: parseFloat(formData.pixelPitch),
      powerConsumption: parseFloat(formData.powerConsumption),
      brightness: parseFloat(formData.brightness),
      refreshRate: parseFloat(formData.refreshRate),
      inputVoltage: parseFloat(formData.inputVoltage),
      operatingTemperature: {
        min: parseFloat(formData.tempMin),
        max: parseFloat(formData.tempMax),
      },
      ipRating: formData.ipRating,
      weight: parseFloat(formData.weight),
      manufacturer: formData.manufacturer,
      model: formData.model,
      price: formData.price ? parseFloat(formData.price) : undefined,
      description: formData.description,
    };

    await createPanel(newPanel);
  };

  return <PanelForm onSubmit={handleSubmit} />;
};
```

### Exemplo 3: Cálculos em Tempo Real

```typescript
const PanelCalculator: React.FC = () => {
  const [panelData, setPanelData] = useState<Partial<Panel>>({
    width: 500,
    height: 500,
    pixelPitch: 2.5,
    powerConsumption: 400,
  });

  const calculations = useMemo(() => {
    if (panelData.width && panelData.height && panelData.pixelPitch) {
      return calculatePanelMetrics(panelData as Panel);
    }
    return null;
  }, [panelData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3>Configurações do Painel</h3>
        {/* Inputs para alterar panelData */}
      </div>

      <div>
        <h3>Cálculos Automáticos</h3>
        {calculations && (
          <div className="space-y-2">
            <p>Total de Pixels: {calculations.totalPixels.toLocaleString()}</p>
            <p>Densidade: {calculations.pixelDensity} pixels/m²</p>
            <p>
              Resolução: {calculations.resolution.horizontal} ×{" "}
              {calculations.resolution.vertical}
            </p>
            <p>Potência: {formatPowerConsumption(calculations.totalPower)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## 🔮 Próximos Desenvolvimentos

### Curto Prazo (2-4 semanas)

- [ ] Implementar PanelForm completo
- [ ] Adicionar filtros avançados
- [ ] Criar validações robustas
- [ ] Implementar busca em tempo real

### Médio Prazo (1-2 meses)

- [ ] Sistema de categorias de painéis
- [ ] Importação de catálogos CSV/Excel
- [ ] Comparação visual entre painéis
- [ ] Histórico de alterações

### Longo Prazo (3+ meses)

- [ ] Integração com APIs de fornecedores
- [ ] Machine learning para recomendações
- [ ] Calculadora avançada de layouts
- [ ] Simulador 3D de instalações

---

**Referências:**

- [Panel Types](../src/modules/Panels/types/panel.types.ts)
- [Panel Calculations](../src/modules/Panels/utils/panelCalculations.ts)
- [Panel Components](../src/modules/Panels/components/)

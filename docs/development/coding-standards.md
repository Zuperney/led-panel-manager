# 📝 Padrões de Código - LED Panel Manager

## 📋 Índice

- [Princípios Gerais](#princípios-gerais)
- [Convenções de Nomenclatura](#convenções-de-nomenclatura)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Padrões TypeScript](#padrões-typescript)
- [Padrões React](#padrões-react)
- [Padrões CSS/Tailwind](#padrões-csstailwind)
- [Documentação de Código](#documentação-de-código)

## 🎯 Princípios Gerais

### 1. **Clareza sobre Cleverness**

Prefira código claro e legível sobre soluções muito "inteligentes":

```typescript
// ❌ Muito "clever"
const isValid = !!data?.user?.permissions?.panels?.read;

// ✅ Claro e legível
const userHasPanelReadPermission = Boolean(
  data?.user?.permissions?.panels?.read
);
```

### 2. **Consistência**

Siga sempre os padrões estabelecidos no projeto:

```typescript
// ✅ Padrão consistente para hooks
const usePanelData = () => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { panels, loading, error, setPanels };
};
```

### 3. **Modularidade**

Cada arquivo deve ter uma responsabilidade única e bem definida.

## 📝 Convenções de Nomenclatura

### Arquivos e Pastas

```
PascalCase.tsx     # Componentes React
camelCase.ts       # Hooks, utils, types
kebab-case.md      # Documentação
UPPERCASE.md       # Arquivos especiais (README, etc.)
```

### Variáveis e Funções

```typescript
// Variáveis - camelCase
const panelData = getData();
const isLoading = true;

// Funções - camelCase com verbo
const calculatePower = (panel: Panel) => {};
const handleSubmit = () => {};

// Constantes - UPPER_SNAKE_CASE
const MAX_PANELS_PER_PROJECT = 100;
const API_ENDPOINTS = {
  PANELS: "/api/panels",
  PROJECTS: "/api/projects",
};
```

### Componentes

```typescript
// PascalCase para componentes
const PanelCard: React.FC<PanelCardProps> = ({ panel }) => {
  return <div>...</div>;
};

// Props interface - ComponentNameProps
interface PanelCardProps {
  panel: Panel;
  onEdit?: (panel: Panel) => void;
}
```

### Hooks Customizados

```typescript
// Sempre começar com 'use'
const usePanelData = () => {};
const useProjectFiltering = () => {};
const useAuthState = () => {};
```

## 📁 Estrutura de Arquivos

### Módulos

```
src/modules/ModuleName/
├── types/
│   ├── moduleName.types.ts    # Tipos principais
│   └── index.ts               # Re-exports
├── hooks/
│   ├── useModuleData.ts       # Hook principal
│   ├── useModuleFiltering.ts  # Hooks específicos
│   └── index.ts
├── components/
│   ├── ModuleCard.tsx         # Componente principal
│   ├── ModuleForm.tsx         # Formulários
│   ├── ModuleList.tsx         # Listas
│   └── index.ts
├── utils/
│   ├── moduleCalculations.ts  # Lógica de negócio
│   ├── moduleValidations.ts   # Validações
│   └── index.ts
└── index.ts                   # Export principal
```

### Importações

```typescript
// 1. Imports externos primeiro
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

// 2. Imports internos
import { Panel } from "../types";
import { calculatePower } from "../utils";

// 3. Imports relativos
import "./Component.css";
```

## 🔷 Padrões TypeScript

### Interfaces vs Types

```typescript
// ✅ Prefer interfaces para objetos
interface Panel {
  id: string;
  name: string;
  specifications: PanelSpecifications;
}

// ✅ Use types para unions, primitivos
type Status = "pending" | "active" | "completed";
type ID = string;
```

### Tipagem Estrita

```typescript
// ✅ Evite 'any'
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// ✅ Use generics quando apropriado
const useApiData = <T>(endpoint: string): ApiResponse<T> => {
  // implementation
};

// ✅ Null safety
const getUserName = (user?: User): string => {
  return user?.name ?? "Anonymous";
};
```

### Utility Types

```typescript
// ✅ Use utility types quando apropriado
type CreatePanelData = Omit<Panel, "id" | "createdAt" | "updatedAt">;
type PartialPanel = Partial<Panel>;
type PanelKeys = keyof Panel;
```

## ⚛️ Padrões React

### Componentes Funcionais

```typescript
// ✅ Sempre usar componentes funcionais
const PanelCard: React.FC<PanelCardProps> = ({ panel, onEdit, onDelete }) => {
  // Hooks no topo
  const [isExpanded, setIsExpanded] = useState(false);
  const calculations = useMemo(() => calculatePanelMetrics(panel), [panel]);

  // Event handlers
  const handleEdit = useCallback(() => {
    onEdit?.(panel);
  }, [onEdit, panel]);

  // Early returns
  if (!panel) {
    return <div>Panel not found</div>;
  }

  return <div className="panel-card">{/* JSX */}</div>;
};
```

### Custom Hooks

```typescript
// ✅ Padrão para custom hooks
const usePanelData = () => {
  const [state, setState] = useState<PanelState>({
    panels: [],
    loading: false,
    error: null,
  });

  const createPanel = useCallback(async (panelData: CreatePanelData) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const newPanel = await api.createPanel(panelData);
      setState((prev) => ({
        ...prev,
        panels: [...prev.panels, newPanel],
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    }
  }, []);

  return {
    ...state,
    createPanel,
  };
};
```

### Event Handlers

```typescript
// ✅ Nomenclatura consistente
const handleSubmit = (event: React.FormEvent) => {};
const handlePanelClick = (panel: Panel) => {};
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {};

// ✅ Use useCallback para handlers complexos
const handleComplexOperation = useCallback(
  (data: ComplexData) => {
    // operação complexa
  },
  [dependency1, dependency2]
);
```

## 🎨 Padrões CSS/Tailwind

### Classes Tailwind

```typescript
// ✅ Organize classes por categoria
const cardClasses = [
  // Layout
  "flex flex-col",
  // Spacing
  "p-6 gap-4",
  // Appearance
  "bg-white rounded-lg shadow-md",
  // Interactive
  "hover:shadow-lg transition-shadow",
  // Responsive
  "sm:p-4 md:p-6",
].join(" ");

// ✅ Use clsx para classes condicionais
import clsx from "clsx";

const buttonClasses = clsx("px-4 py-2 rounded font-medium", {
  "bg-blue-500 text-white": variant === "primary",
  "bg-gray-200 text-gray-800": variant === "secondary",
  "opacity-50 cursor-not-allowed": disabled,
});
```

### Responsive Design

```typescript
// ✅ Mobile-first approach
<div className="
  w-full                    // mobile
  sm:w-1/2                  // small screens
  md:w-1/3                  // medium screens
  lg:w-1/4                  // large screens
">
```

## 📚 Documentação de Código

### JSDoc para Funções Complexas

````typescript
/**
 * Calcula as métricas de um painel LED incluindo potência, dimensões e densidade de pixels
 *
 * @param panel - O painel para calcular as métricas
 * @returns Objeto com todas as métricas calculadas
 *
 * @example
 * ```typescript
 * const panel = { width: 500, height: 500, pixelPitch: 2.5, powerConsumption: 400 };
 * const metrics = calculatePanelMetrics(panel);
 * console.log(metrics.totalPixels); // 40000
 * ```
 */
const calculatePanelMetrics = (panel: Panel): PanelCalculations => {
  // implementation
};
````

### Comentários no Código

```typescript
// ✅ Explique o "porquê", não o "o que"
const calculateTotalPower = (panels: Panel[]) => {
  // Aplicamos um fator de segurança de 20% para cálculos de potência
  // baseado em especificações da indústria LED
  const safetyFactor = 1.2;

  return panels.reduce(
    (total, panel) => total + panel.powerConsumption * safetyFactor,
    0
  );
};
```

### TODO e FIXME

```typescript
// TODO: Implementar cache para cálculos de painéis
// FIXME: Corrigir cálculo de densidade de pixels para painéis curvos
// NOTE: Esta função assume painéis retangulares apenas
```

## ✅ Checklist de Qualidade

Antes de fazer commit, verifique:

- [ ] Código segue convenções de nomenclatura
- [ ] Tipos TypeScript estão corretos
- [ ] Componentes são funcionais e usam hooks
- [ ] Funções complexas têm JSDoc
- [ ] Classes Tailwind estão organizadas
- [ ] Imports estão ordenados
- [ ] Não há console.logs desnecessários
- [ ] Código compila sem warnings
- [ ] Testes passam (quando aplicável)

---

**Referências:**

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

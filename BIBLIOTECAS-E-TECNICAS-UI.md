# 🎨 Bibliotecas e Técnicas de UI/UX - MCTRL4K Calculator

**Guia completo para reutilização em outras aplicações**

## 🛠️ **Stack Tecnológico Principal**

### **Framework Base**

- **React 18** - Framework principal com hooks modernos
- **TypeScript** - Tipagem estática para maior robustez
- **Vite** - Build tool rápido e moderno

### **Styling & UI**

- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Biblioteca de animações declarativas
- **Lucide React** - Ícones SVG limpos e consistentes
- **React Hot Toast** - Sistema de notificações elegante

### **Charts & Data Visualization**

- **Chart.js** - Biblioteca de gráficos poderosa
- **React-Chartjs-2** - Wrapper React para Chart.js
- **Suporte a:** Line Charts, Pie Charts, Bar Charts, Real-time data

### **Performance & Optimization**

- **React.lazy()** - Lazy loading de componentes
- **React.memo()** - Memoização de componentes
- **useMemo()** e **useCallback()** - Otimização de re-renders
- **Web Workers** - Processamento em background

---

## 🎨 **Técnicas de Design Implementadas**

### **1. Glassmorphism Design**

```css
/* Classes Tailwind utilizadas */
.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl;
}

/* Efeito glass em diferentes intensidades */
bg-white/5   /* Sutil */
bg-white/10  /* Padrão */
bg-white/20  /* Mais opaco */

/* Backdrop blur para efeito vidro */
backdrop-blur-sm
backdrop-blur-md
backdrop-blur-lg
```

### **2. Sistema de Cores Consistente**

```css
/* Palette principal */
Blue:    rgb(59, 130, 246)   /* #3B82F6 */
Green:   rgb(34, 197, 94)    /* #22C55E */
Purple:  rgb(168, 85, 247)   /* #A855F7 */
Orange:  rgb(245, 158, 11)   /* #F59E0B */
Red:     rgb(239, 68, 68)    /* #EF4444 */

/* Grays para texto e backgrounds */
text-gray-300   /* Texto secundário */
text-gray-400   /* Texto terciário */
text-white      /* Texto principal */
```

### **3. Layout Responsivo com Grid**

```css
/* Grid adaptativo */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
grid-cols-1 lg:grid-cols-2

/* Flexbox responsivo */
flex-col lg:flex-row
flex flex-col lg:items-center lg:justify-between

/* Gaps consistentes */
gap-2, gap-4, gap-6 (8px, 16px, 24px)
```

---

## 🔧 **Patterns e Hooks Customizados**

### **1. Hook de Calculator Context**

```typescript
const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator must be used within CalculatorProvider");
  }
  return context;
};
```

### **2. Hook de Performance com Debounce**

```typescript
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### **3. Hook de Keyboard Shortcuts**

```typescript
const useKeyboardShortcuts = () => {
  useHotkeys("ctrl+e", () => openExportModal());
  useHotkeys("ctrl+r", () => resetInputs());
  useHotkeys("ctrl+/", () => toggleKeyboardHelp());
};
```

### **4. Hook de Theme System**

```typescript
const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("dark");

  // Auto theme detection
  useEffect(() => {
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setActualTheme(mediaQuery.matches ? "dark" : "light");
    }
  }, [theme]);
};
```

---

## 🏗️ **Arquitetura de Componentes**

### **1. Lazy Loading Pattern**

```typescript
// Lazy wrapper para componentes pesados
const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <div>Loading...</div>,
  errorBoundary = true,
}) => {
  return (
    <Suspense fallback={fallback}>
      {errorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children}
    </Suspense>
  );
};

// Componentes lazy
const LazyAnalyticsDashboard = lazy(() =>
  import("./AdvancedAnalyticsDashboard").then((m) => ({
    default: m.AdvancedAnalyticsDashboard,
  }))
);
```

### **2. Sistema de Tabs Dinâmico**

```typescript
interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType;
  component: React.ComponentType;
  lazy?: boolean;
}

const TabSystem: React.FC<TabSystemProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="space-y-6">
      {/* Tab Headers */}
      <div className="flex space-x-1 rounded-xl bg-white/10 p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {renderTabContent(activeTab)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

---

## 📊 **Componentes de Data Visualization**

### **1. Setup do Chart.js**

```typescript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);
```

### **2. Configuração de Charts Responsivos**

```typescript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "rgb(156, 163, 175)", // text-gray-400
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    title: {
      display: true,
      text: "Chart Title",
      color: "rgb(156, 163, 175)",
      font: {
        size: 16,
        weight: "bold",
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "rgb(156, 163, 175)" },
      grid: {
        color: "rgba(156, 163, 175, 0.1)",
        borderColor: "rgba(156, 163, 175, 0.2)",
      },
    },
    y: {
      ticks: { color: "rgb(156, 163, 175)" },
      grid: {
        color: "rgba(156, 163, 175, 0.1)",
        borderColor: "rgba(156, 163, 175, 0.2)",
      },
    },
  },
};
```

### **3. Status Cards com Animações**

```typescript
const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-lg font-bold text-white">{value}</p>
          {trend && (
            <div
              className={`text-xs ${
                trend > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
```

---

## 🎭 **Animações com Framer Motion**

### **1. Variantes de Animação**

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};
```

### **2. Micro Interações**

```typescript
// Hover e tap effects
<motion.button
  whileHover={{
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>

// Loading animations
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
>

// Stagger animations para listas
<motion.div variants={containerVariants}>
  {items.map((item, index) => (
    <motion.div key={index} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### **3. Page Transitions**

```typescript
const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2,
  },
};
```

---

## 🎛️ **Inputs e Forms Avançados**

### **1. Input Field Customizado**

```typescript
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  unit,
  error,
  tooltip,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {tooltip && <TooltipIcon content={tooltip} />}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`
            w-full px-3 py-2 
            bg-white/10 border border-white/20 
            rounded-lg text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            transition-all duration-200
            ${error ? "border-red-500" : ""}
          `}
        />
        {unit && (
          <span className="absolute right-3 top-2 text-gray-400 text-sm">
            {unit}
          </span>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};
```

### **2. Select Customizado**

```typescript
const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      <select
        value={value}
        onChange={onChange}
        className="
          w-full px-3 py-2 
          bg-white/10 border border-white/20 
          rounded-lg text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          transition-all duration-200
        "
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-gray-800 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
```

---

## 🔄 **State Management Patterns**

### **1. Context + Reducer Pattern**

```typescript
interface CalculatorState {
  inputs: InputValues;
  results: CalculatorResults;
  loading: boolean;
  error: string | null;
}

type CalculatorAction =
  | { type: "SET_INPUT"; field: string; value: any }
  | { type: "SET_RESULTS"; results: CalculatorResults }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null };

const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState => {
  switch (action.type) {
    case "SET_INPUT":
      return {
        ...state,
        inputs: { ...state.inputs, [action.field]: action.value },
      };
    case "SET_RESULTS":
      return { ...state, results: action.results, loading: false };
    // ... outros cases
  }
};
```

### **2. Local Storage Persistence**

```typescript
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```

---

## 📱 **Responsividade e Mobile**

### **1. Breakpoints Tailwind**

```css
/* Breakpoints utilizados */
sm:   640px   /* Small devices */
md:   768px   /* Medium devices */
lg:   1024px  /* Large devices */
xl:   1280px  /* Extra large */
2xl:  1536px  /* 2X large */

/* Pattern responsivo comum */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
text-sm md:text-base lg:text-lg
p-4 md:p-6 lg:p-8
```

### **2. Mobile-First Design**

```css
/* Inicia mobile, expande para desktop */
.container {
  @apply w-full px-4 mx-auto;
  @apply sm:px-6 lg:px-8;
  @apply max-w-none sm:max-w-xl lg:max-w-7xl;
}

/* Navigation mobile */
.mobile-menu {
  @apply block lg:hidden;
}

.desktop-menu {
  @apply hidden lg:block;
}
```

---

## ⚡ **Performance Optimizations**

### **1. Component Memoization**

```typescript
// Memoização de componentes pesados
const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data }) => {
    return <div>{/* render logic */}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.data.id === nextProps.data.id;
  }
);

// Memoização de valores computados
const expensiveValue = useMemo(() => {
  return data.map((item) => item.value * complexCalculation(item));
}, [data]);

// Memoização de callbacks
const handleClick = useCallback(
  (id: string) => {
    onItemClick(id);
  },
  [onItemClick]
);
```

### **2. Debouncing para Inputs**

```typescript
const DebouncedInput: React.FC = ({ onChange, delay = 300 }) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};
```

### **3. Virtual Scrolling para Listas**

```typescript
const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  containerHeight,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight }}>
        <div
          style={{ transform: `translateY(${visibleStart * itemHeight}px)` }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 🎯 **Utility Functions e Helpers**

### **1. Format Utilities**

```typescript
// Formatação de números
export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Formatação de bytes
export const formatBytes = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size)} ${units[unitIndex]}`;
};

// Geração de cores automática
export const generateColors = (count: number): string[] => {
  const hueStep = 360 / count;
  return Array.from(
    { length: count },
    (_, i) => `hsl(${i * hueStep}, 70%, 60%)`
  );
};
```

### **2. Animation Utilities**

```typescript
// Easing functions customizadas
export const easing = {
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
};

// Stagger delay calculator
export const getStaggerDelay = (index: number, baseDelay = 0.1): number => {
  return baseDelay * index;
};

// Viewport detection
export const useInViewport = (ref: RefObject<Element>) => {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInViewport;
};
```

---

## 📦 **Package.json Dependencies**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.292.0",
    "react-hot-toast": "^2.4.1",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "react-hotkeys-hook": "^4.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  }
}
```

---

## 🚀 **Como Implementar em Novo Projeto**

### **1. Setup Inicial**

```bash
# Criar projeto
npm create vite@latest my-app -- --template react-ts

# Instalar dependências
npm install framer-motion lucide-react react-hot-toast chart.js react-chartjs-2 react-hotkeys-hook

# Instalar Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### **2. Configuração Tailwind**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
```

### **3. CSS Global**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900;
    @apply text-white font-sans;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl;
  }

  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200;
  }

  .input-field {
    @apply w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200;
  }
}
```

---

## 💡 **Dicas de Implementação**

### **1. Performance**

- Use `React.memo()` para componentes que recebem props complexas
- Implemente `useMemo()` para cálculos pesados
- Use `useCallback()` para funções passadas como props
- Considere lazy loading para componentes pesados

### **2. Accessibility**

- Sempre adicione `aria-label` em ícones
- Use `role` apropriados em elementos customizados
- Implemente navegação por teclado
- Mantenha contraste adequado

### **3. Mobile Experience**

- Teste em dispositivos reais
- Use `touch-action` para gestos customizados
- Implemente swipe gestures com Framer Motion
- Otimize tamanhos de touch targets (min 44px)

### **4. Error Handling**

- Sempre implemente Error Boundaries
- Use try/catch em operações assíncronas
- Forneça fallbacks para componentes lazy
- Log erros para debugging

---

## 🎨 **Exemplos de Uso Rápido**

### **Glassmorphism Card**

```tsx
<div className="glass-card p-6">
  <h3 className="text-lg font-semibold text-white mb-4">Card Title</h3>
  <p className="text-gray-300">Card content goes here</p>
</div>
```

### **Animated Button**

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="btn-primary"
>
  Click me
</motion.button>
```

### **Status Card com Animação**

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="glass-card p-4"
>
  <div className="flex items-center gap-3">
    <div className="p-2 bg-blue-500/20 rounded-lg">
      <Icon className="w-5 h-5 text-blue-400" />
    </div>
    <div>
      <p className="text-sm text-gray-400">Label</p>
      <p className="text-lg font-bold text-white">Value</p>
    </div>
  </div>
</motion.div>
```

---

**🎯 Este guia contém tudo que você precisa para recriar a interface moderna e interativa do MCTRL4K Calculator em qualquer projeto React/TypeScript!**

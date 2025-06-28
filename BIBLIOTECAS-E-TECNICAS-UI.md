# 🎨 Bibliotecas e Técnicas de UI/UX - MCTRL4K Calculator

**Guia completo de estilização para reutilização em outras aplicações React**

> 📚 Este guia documenta todas as técnicas, padrões e componentes utilizados no MCTRL4K Calculator, servindo como referência para projetos futuros. Cada seção inclui código prático, exemplos de uso e variações.

---

## 📋 **Índice**

1. [Stack Tecnológico Principal](#stack-tecnológico-principal)
2. [Sistema de Cores e Temas](#sistema-de-cores-e-temas)
3. [Tipografia e Escalas](#tipografia-e-escalas)
4. [Glassmorphism e Backdrop](#glassmorphism-e-backdrop)
5. [Botões e Interações](#botões-e-interações)
6. [Cards e Containers](#cards-e-containers)
7. [Layouts Avançados (Flex/Grid)](#layouts-avançados-flexgrid)
8. [Animações e Transições](#animações-e-transições)
9. [Formulários e Inputs](#formulários-e-inputs)
10. [Status, Feedback e Indicadores](#status-feedback-e-indicadores)
11. [Charts e Visualizações](#charts-e-visualizações)
12. [Performance e Otimizações](#performance-e-otimizações)
13. [Estrutura de Arquivos UI](#estrutura-de-arquivos-ui)

---

## 🛠️ **Stack Tecnológico Principal**

### **Framework Core**

```json
{
  "react": "^18.2.0", // Framework base com hooks modernos
  "typescript": "^5.0.2", // Type safety e intellisense
  "vite": "^4.4.5" // Build tool rápido e moderno
}
```

### **Styling & UI Framework**

```json
{
  "tailwindcss": "^3.3.0", // Utility-first CSS framework
  "framer-motion": "^10.16.4", // Animações fluidas e gestures
  "lucide-react": "^0.292.0", // Ícones SVG otimizados
  "react-hot-toast": "^2.4.1" // Notificações elegantes
}
```

### **Data Visualization**

```json
{
  "chart.js": "^4.4.0", // Biblioteca de gráficos robusta
  "react-chartjs-2": "^5.2.0" // Wrapper React para Chart.js
}
```

### **Performance & UX**

```json
{
  "react-hotkeys-hook": "^4.4.1" // Atalhos de teclado globais
}
```

### **Configuração Vite + TypeScript**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    minify: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

---

## 🎨 **Sistema de Cores e Temas**

### **Paleta Primária com RGB Values**

```css
/* Definidas como CSS custom properties para fácil manutenção */
:root {
  /* Blues - Principais */
  --blue-50: #eff6ff; /* rgb(239, 246, 255) */
  --blue-100: #dbeafe; /* rgb(219, 234, 254) */
  --blue-400: #60a5fa; /* rgb(96, 165, 250) */
  --blue-500: #3b82f6; /* rgb(59, 130, 246) - Principal */
  --blue-600: #2563eb; /* rgb(37, 99, 235) */
  --blue-700: #1d4ed8; /* rgb(29, 78, 216) */

  /* Greens - Sucesso */
  --green-400: #4ade80; /* rgb(74, 222, 128) */
  --green-500: #22c55e; /* rgb(34, 197, 94) - Principal */
  --green-600: #16a34a; /* rgb(22, 163, 74) */

  /* Purples - Accent */
  --purple-400: #c084fc; /* rgb(192, 132, 252) */
  --purple-500: #a855f7; /* rgb(168, 85, 247) - Principal */
  --purple-600: #9333ea; /* rgb(147, 51, 234) */

  /* Status Colors */
  --orange-400: #fbbf24; /* rgb(251, 191, 36) - Warning */
  --orange-500: #f59e0b; /* rgb(245, 158, 11) */
  --red-400: #f87171; /* rgb(248, 113, 113) - Error */
  --red-500: #ef4444; /* rgb(239, 68, 68) */
}
```

### **Background Gradients (Principais)**

```css
/* Gradiente principal da aplicação */
.app-main-gradient {
  background: linear-gradient(
    135deg,
    #1f2937 0%,
    /* gray-800 */ #1e3a8a 50%,
    /* blue-800 */ #581c87 100% /* purple-800 */
  );
  /* Tailwind: bg-gradient-to-br from-gray-800 via-blue-800 to-purple-800 */
}

/* Header com brilho sutil */
.header-gradient {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    /* blue-500/10 */ rgba(168, 85, 247, 0.1) 100% /* purple-500/10 */
  );
}

/* Cards e elementos destacados */
.card-gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.card-gradient-green {
  background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
}

.card-gradient-purple {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
}
```

### **Sistema de Temas (Dark/Light)**

```typescript
// ThemeProvider.tsx - Sistema de temas
export type Theme = "light" | "dark" | "auto";

interface ThemeColors {
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  glass: {
    background: string;
    border: string;
  };
}

export const themeConfig: Record<Theme, ThemeColors> = {
  dark: {
    background: "from-gray-900 via-blue-900 to-purple-900",
    surface: "bg-white/10",
    text: {
      primary: "text-white",
      secondary: "text-gray-200",
      tertiary: "text-gray-400",
    },
    glass: {
      background: "bg-white/10",
      border: "border-white/20",
    },
  },
  light: {
    background: "from-gray-50 via-blue-50 to-purple-50",
    surface: "bg-black/5",
    text: {
      primary: "text-gray-900",
      secondary: "text-gray-700",
      tertiary: "text-gray-500",
    },
    glass: {
      background: "bg-black/5",
      border: "border-black/10",
    },
  },
  auto: {
    // Define baseado em prefers-color-scheme
    background: "from-gray-900 via-blue-900 to-purple-900",
    surface: "bg-white/10",
    text: {
      primary: "text-white",
      secondary: "text-gray-200",
      tertiary: "text-gray-400",
    },
    glass: {
      background: "bg-white/10",
      border: "border-white/20",
    },
  },
};
```

---

## 📝 **Tipografia e Escalas**

### **Escala de Tamanhos com Line Heights**

```css
/* Sistema harmonioso baseado em 1.25x scale */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* 0.75rem - Labels pequenos */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* 0.875rem - Body secundário */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* 1rem - Body principal */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* 1.125rem - Leads */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* 1.25rem - Subtítulos */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* 1.5rem - Títulos de seção */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* 1.875rem - Títulos principais */
.text-4xl {
  font-size: 36px;
  line-height: 40px;
} /* 2.25rem - Hero titles */
```

### **Pesos de Fonte e Uso**

```css
.font-light {
  font-weight: 300;
} /* Texto delicado, quotes */
.font-normal {
  font-weight: 400;
} /* Body text padrão */
.font-medium {
  font-weight: 500;
} /* Labels, subtítulos */
.font-semibold {
  font-weight: 600;
} /* Títulos de cards */
.font-bold {
  font-weight: 700;
} /* Títulos importantes */
.font-black {
  font-weight: 900;
} /* Hero titles, logos */
```

### **Letter Spacing e Variações**

```css
.tracking-tighter { letter-spacing: -0.05em; }  /* Títulos compactos */
.tracking-tight   { letter-spacing: -0.025em; /* Subtítulos */
.tracking-normal  { letter-spacing: 0em; }      /* Body text */
.tracking-wide    { letter-spacing: 0.025em; }  /* Labels, botões */
.tracking-wider   { letter-spacing: 0.05em; }   /* Versões, badges */
```

### **Hierarquia Tipográfica (Exemplo Real)**

```tsx
// Header principal da aplicação
<h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
  MCTRL4K Calculator
</h1>

// Subtítulo
<div className="text-base text-blue-100 font-medium">
  Ultra High Resolution Settings Generator
</div>

// Versão
<p className="text-blue-100 text-sm font-medium">Rev 1.0</p>

// Títulos de seção
<h2 className="text-xl font-semibold text-white mb-4">
  Performance Analytics
</h2>

// Labels de formulário
<label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
  Resolution Width
</label>

// Body text
<p className="text-base text-gray-200 leading-relaxed">
  Configure your display settings...
</p>
```

---

## ✨ **Glassmorphism e Backdrop**

### **Classes Base Glass**

```css
/* Glass básico - mais comum */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Equivalente Tailwind */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### **Variações de Intensidade**

```css
/* Glass sutil - para elementos de fundo */
.glass-subtle {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg;
}

/* Glass padrão - para cards principais */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}

/* Glass intenso - para modals e overlays */
.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl;
}

/* Glass ultra - para elementos críticos */
.glass-ultra {
  @apply bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl;
}
```

### **Glass com Cores Temáticas**

```css
/* Glass com tint azul */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* Glass com tint verde (sucesso) */
.glass-green {
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
}

/* Glass com tint roxo (destaque) */
.glass-purple {
  background: rgba(168, 85, 247, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}

/* Glass warning/error */
.glass-orange {
  @apply bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl;
}

.glass-red {
  @apply bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-xl;
}
```

### **Exemplo Prático - Header Component**

```tsx
// Header.tsx - Implementação real do glassmorphism
export const Header = ({ title, subtitle, version, icon }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Glass container principal */}
      <div className="glass rounded-2xl p-6 mb-6 relative">
        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard className="w-4 h-4 text-white/70 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Content principal */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {title}
            </h1>
            <div className="text-base text-blue-100 font-medium">
              {subtitle}
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm font-medium">{version}</p>
      </div>
    </motion.header>
  );
};
```

---

## 🔘 **Botões e Interações**

````

### **Escala de Grays**
```css
/* Sistema de grays para texto e UI */
.text-gray-100 { color: #F3F4F6; }  /* Texto muito claro */
.text-gray-200 { color: #E5E7EB; }  /* Texto claro */
.text-gray-300 { color: #D1D5DB; }  /* Texto secundário */
.text-gray-400 { color: #9CA3AF; }  /* Texto terciário */
.text-gray-500 { color: #6B7280; }  /* Texto disabled */

/* Backgrounds em gray */
.bg-gray-800 { background-color: #1F2937; }
.bg-gray-900 { background-color: #111827; }
````

### **Transparências e Opacidades**

```css
/* Sistema de transparência para glassmorphism */
.bg-white-5 {
  background-color: rgba(255, 255, 255, 0.05);
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Borders transparentes */
.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2);
}
.border-white-30 {
  border-color: rgba(255, 255, 255, 0.3);
}
```

---

## 📝 **Tipografia e Tamanhos**

### **Escala de Texto**

```css
/* Sistema de tamanhos de texto */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* 0.75rem */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* 0.875rem */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* 1rem */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* 1.125rem */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* 1.25rem */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* 1.5rem */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* 1.875rem */
```

### **Pesos de Fonte**

```css
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
```

### **Espaçamentos**

```css
/* Sistema de spacing (padding e margin) */
.p-1 {
  padding: 4px;
} /* 0.25rem */
.p-2 {
  padding: 8px;
} /* 0.5rem */
.p-3 {
  padding: 12px;
} /* 0.75rem */
.p-4 {
  padding: 16px;
} /* 1rem */
.p-6 {
  padding: 24px;
} /* 1.5rem */
.p-8 {
  padding: 32px;
} /* 2rem */

/* Gaps para flex e grid */
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
.gap-6 {
  gap: 24px;
}
```

---

## ✨ **Glassmorphism e Backdrop**

### **Classes Base Glass**

```css
/* Glass básico - mais comum */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Equivalente Tailwind */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### **Variações de Intensidade**

```css
/* Glass sutil - para elementos de fundo */
.glass-subtle {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg;
}

/* Glass padrão - para cards principais */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}

/* Glass intenso - para modals e overlays */
.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl;
}

/* Glass ultra - para elementos críticos */
.glass-ultra {
  @apply bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl;
}
```

### **Glass com Cores Temáticas**

```css
/* Glass com tint azul */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* Glass com tint verde (sucesso) */
.glass-green {
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
}

/* Glass com tint roxo (destaque) */
.glass-purple {
  background: rgba(168, 85, 247, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}

/* Glass warning/error */
.glass-orange {
  @apply bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl;
}

.glass-red {
  @apply bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-xl;
}
```

### **Exemplo Prático - Header Component**

```tsx
// Header.tsx - Implementação real do glassmorphism
export const Header = ({ title, subtitle, version, icon }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Glass container principal */}
      <div className="glass rounded-2xl p-6 mb-6 relative">
        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard className="w-4 h-4 text-white/70 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Content principal */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {title}
            </h1>
            <div className="text-base text-blue-100 font-medium">
              {subtitle}
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm font-medium">{version}</p>
      </div>
    </motion.header>
  );
};
```

---

## 🔘 **Botões e Interações**

````

### **Escala de Grays**
```css
/* Sistema de grays para texto e UI */
.text-gray-100 { color: #F3F4F6; }  /* Texto muito claro */
.text-gray-200 { color: #E5E7EB; }  /* Texto claro */
.text-gray-300 { color: #D1D5DB; }  /* Texto secundário */
.text-gray-400 { color: #9CA3AF; }  /* Texto terciário */
.text-gray-500 { color: #6B7280; }  /* Texto disabled */

/* Backgrounds em gray */
.bg-gray-800 { background-color: #1F2937; }
.bg-gray-900 { background-color: #111827; }
````

### **Transparências e Opacidades**

```css
/* Sistema de transparência para glassmorphism */
.bg-white-5 {
  background-color: rgba(255, 255, 255, 0.05);
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Borders transparentes */
.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2);
}
.border-white-30 {
  border-color: rgba(255, 255, 255, 0.3);
}
```

---

## 📝 **Tipografia e Tamanhos**

### **Escala de Texto**

```css
/* Sistema de tamanhos de texto */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* 0.75rem */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* 0.875rem */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* 1rem */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* 1.125rem */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* 1.25rem */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* 1.5rem */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* 1.875rem */
```

### **Pesos de Fonte**

```css
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
```

### **Espaçamentos**

```css
/* Sistema de spacing (padding e margin) */
.p-1 {
  padding: 4px;
} /* 0.25rem */
.p-2 {
  padding: 8px;
} /* 0.5rem */
.p-3 {
  padding: 12px;
} /* 0.75rem */
.p-4 {
  padding: 16px;
} /* 1rem */
.p-6 {
  padding: 24px;
} /* 1.5rem */
.p-8 {
  padding: 32px;
} /* 2rem */

/* Gaps para flex e grid */
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
.gap-6 {
  gap: 24px;
}
```

---

## ✨ **Glassmorphism e Backdrop**

### **Classes Base Glass**

```css
/* Glass básico - mais comum */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Equivalente Tailwind */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### **Variações de Intensidade**

```css
/* Glass sutil - para elementos de fundo */
.glass-subtle {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg;
}

/* Glass padrão - para cards principais */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}

/* Glass intenso - para modals e overlays */
.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl;
}

/* Glass ultra - para elementos críticos */
.glass-ultra {
  @apply bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl;
}
```

### **Glass com Cores Temáticas**

```css
/* Glass com tint azul */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* Glass com tint verde (sucesso) */
.glass-green {
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
}

/* Glass com tint roxo (destaque) */
.glass-purple {
  background: rgba(168, 85, 247, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}

/* Glass warning/error */
.glass-orange {
  @apply bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl;
}

.glass-red {
  @apply bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-xl;
}
```

### **Exemplo Prático - Header Component**

```tsx
// Header.tsx - Implementação real do glassmorphism
export const Header = ({ title, subtitle, version, icon }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Glass container principal */}
      <div className="glass rounded-2xl p-6 mb-6 relative">
        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard className="w-4 h-4 text-white/70 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Content principal */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {title}
            </h1>
            <div className="text-base text-blue-100 font-medium">
              {subtitle}
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm font-medium">{version}</p>
      </div>
    </motion.header>
  );
};
```

---

## 🔘 **Botões e Interações**

````

### **Escala de Grays**
```css
/* Sistema de grays para texto e UI */
.text-gray-100 { color: #F3F4F6; }  /* Texto muito claro */
.text-gray-200 { color: #E5E7EB; }  /* Texto claro */
.text-gray-300 { color: #D1D5DB; }  /* Texto secundário */
.text-gray-400 { color: #9CA3AF; }  /* Texto terciário */
.text-gray-500 { color: #6B7280; }  /* Texto disabled */

/* Backgrounds em gray */
.bg-gray-800 { background-color: #1F2937; }
.bg-gray-900 { background-color: #111827; }
````

### **Transparências e Opacidades**

```css
/* Sistema de transparência para glassmorphism */
.bg-white-5 {
  background-color: rgba(255, 255, 255, 0.05);
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Borders transparentes */
.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2);
}
.border-white-30 {
  border-color: rgba(255, 255, 255, 0.3);
}
```

---

## 📝 **Tipografia e Tamanhos**

### **Escala de Texto**

```css
/* Sistema de tamanhos de texto */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* 0.75rem */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* 0.875rem */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* 1rem */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* 1.125rem */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* 1.25rem */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* 1.5rem */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* 1.875rem */
```

### **Pesos de Fonte**

```css
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
```

### **Espaçamentos**

```css
/* Sistema de spacing (padding e margin) */
.p-1 {
  padding: 4px;
} /* 0.25rem */
.p-2 {
  padding: 8px;
} /* 0.5rem */
.p-3 {
  padding: 12px;
} /* 0.75rem */
.p-4 {
  padding: 16px;
} /* 1rem */
.p-6 {
  padding: 24px;
} /* 1.5rem */
.p-8 {
  padding: 32px;
} /* 2rem */

/* Gaps para flex e grid */
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
.gap-6 {
  gap: 24px;
}
```

---

## ✨ **Glassmorphism e Backdrop**

### **Classes Base Glass**

```css
/* Glass básico - mais comum */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Equivalente Tailwind */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### **Variações de Intensidade**

```css
/* Glass sutil - para elementos de fundo */
.glass-subtle {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg;
}

/* Glass padrão - para cards principais */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}

/* Glass intenso - para modals e overlays */
.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl;
}

/* Glass ultra - para elementos críticos */
.glass-ultra {
  @apply bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl;
}
```

### **Glass com Cores Temáticas**

```css
/* Glass com tint azul */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* Glass com tint verde (sucesso) */
.glass-green {
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
}

/* Glass com tint roxo (destaque) */
.glass-purple {
  background: rgba(168, 85, 247, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}

/* Glass warning/error */
.glass-orange {
  @apply bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl;
}

.glass-red {
  @apply bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-xl;
}
```

### **Exemplo Prático - Header Component**

```tsx
// Header.tsx - Implementação real do glassmorphism
export const Header = ({ title, subtitle, version, icon }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Glass container principal */}
      <div className="glass rounded-2xl p-6 mb-6 relative">
        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard className="w-4 h-4 text-white/70 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Content principal */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {title}
            </h1>
            <div className="text-base text-blue-100 font-medium">
              {subtitle}
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm font-medium">{version}</p>
      </div>
    </motion.header>
  );
};
```

---

## 🔘 **Botões e Interações**

````

### **Escala de Grays**
```css
/* Sistema de grays para texto e UI */
.text-gray-100 { color: #F3F4F6; }  /* Texto muito claro */
.text-gray-200 { color: #E5E7EB; }  /* Texto claro */
.text-gray-300 { color: #D1D5DB; }  /* Texto secundário */
.text-gray-400 { color: #9CA3AF; }  /* Texto terciário */
.text-gray-500 { color: #6B7280; }  /* Texto disabled */

/* Backgrounds em gray */
.bg-gray-800 { background-color: #1F2937; }
.bg-gray-900 { background-color: #111827; }
````

### **Transparências e Opacidades**

```css
/* Sistema de transparência para glassmorphism */
.bg-white-5 {
  background-color: rgba(255, 255, 255, 0.05);
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Borders transparentes */
.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2);
}
.border-white-30 {
  border-color: rgba(255, 255, 255, 0.3);
}
```

---

## 📝 **Tipografia e Tamanhos**

### **Escala de Texto**

```css
/* Sistema de tamanhos de texto */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* 0.75rem */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* 0.875rem */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* 1rem */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* 1.125rem */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* 1.25rem */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* 1.5rem */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* 1.875rem */
```

### **Pesos de Fonte**

```css
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
```

### **Espaçamentos**

```css
/* Sistema de spacing (padding e margin) */
.p-1 {
  padding: 4px;
} /* 0.25rem */
.p-2 {
  padding: 8px;
} /* 0.5rem */
.p-3 {
  padding: 12px;
} /* 0.75rem */
.p-4 {
  padding: 16px;
} /* 1rem */
.p-6 {
  padding: 24px;
} /* 1.5rem */
.p-8 {
  padding: 32px;
} /* 2rem */

/* Gaps para flex e grid */
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
.gap-6 {
  gap: 24px;
}
```

---

## ✨ **Glassmorphism e Backdrop**

### **Classes Base Glass**

```css
/* Glass básico - mais comum */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Equivalente Tailwind */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### **Variações de Intensidade**

```css
/* Glass sutil - para elementos de fundo */
.glass-subtle {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg;
}

/* Glass padrão - para cards principais */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}

/* Glass intenso - para modals e overlays */
.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl;
}

/* Glass ultra - para elementos críticos */
.glass-ultra {
  @apply bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl;
}
```

### **Glass com Cores Temáticas**

```css
/* Glass com tint azul */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* Glass com tint verde (sucesso) */
.glass-green {
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
}

/* Glass com tint roxo (destaque) */
.glass-purple {
  background: rgba(168, 85, 247, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}

/* Glass warning/error */
.glass-orange {
  @apply bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl;
}

.glass-red {
  @apply bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-xl;
}
```

### **Exemplo Prático - Header Component**

```tsx
// Header.tsx - Implementação real do glassmorphism
export const Header = ({ title, subtitle, version, icon }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Glass container principal */}
      <div className="glass rounded-2xl p-6 mb-6 relative">
        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard className="w-4 h-4 text-white/70 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Content principal */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {title}
            </h1>
            <div className="text-base text-blue-100 font-medium">
              {subtitle}
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm font-medium">{version}</p>
      </div>
    </motion.header>
  );
};
```

---

## 🔘 **Botões e Interações**

````

### **Escala de Grays**
```css
/* Sistema de grays para texto e UI */
.text-gray-100 { color: #F3F4F6; }  /* Texto muito claro */
.text-gray-200 { color: #E5E7EB; }  /* Texto claro */
.text-gray-300 { color: #D1D5DB; }  /* Texto secundário */
.text-gray-400 { color: #9CA3AF; }  /* Texto terciário */
.text-gray-500 { color: #6B7280; }  /* Texto disabled */

/* Backgrounds em gray */
.bg-gray-800 { background-color: #1F2937; }
.bg-gray-900 { background-color: #111827; }
````

### **Transparências e Opacidades**

```css
/* Sistema de transparência para glassmorphism */
.bg-white-5 {
  background-color: rgba(255, 255, 255, 0.05);
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Borders transparentes */
.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2);
}
.border-white-30 {
  border-color: rgba(255, 255, 255, 0.3);
}
```

---

## 📝 **Tipografia e Tamanhos**

### **Escala de Texto**

```css
/* Sistema de tamanhos de texto */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* 0.75rem */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* 0.875rem */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* 1rem */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* 1.125rem */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* 1.25rem */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* 1.5rem */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* 1.875rem */
```

### **Pesos de Fonte**

```css
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
```

### **Espaçamentos**

```css
/* Sistema de spacing (padding e margin) */
.p-1 {
  padding: 4px;
} /* 0.25rem */
.p-2 {
  padding: 8px;
} /* 0.5rem */
.p-3 {
  padding: 12px;
} /* 0.75rem */
.p-4 {
  padding: 16px;
} /* 1rem */
.p-6 {
  padding: 24px;
} /* 1.5rem */
.p-8 {
  padding: 32px;
} /* 2rem */

/* Gaps para flex e grid */
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
.gap-6 {
  gap: 24px;
}
```

---

## ✨ **Glassmorphism e Backdrop**

### **Classes Base Glass**

```css
/* Glass básico - mais comum */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Equivalente Tailwind */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### **Variações de Intensidade**

```css
/* Glass sutil - para elementos de fundo */
.glass-subtle {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg;
}

/* Glass padrão - para cards principais */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}

/* Glass intenso - para modals e overlays */
.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl;
}

/* Glass ultra - para elementos críticos */
.glass-ultra {
  @apply bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl;
}
```

### **Glass com Cores Temáticas**

```css
/* Glass com tint azul */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* Glass com tint verde (sucesso) */
.glass-green {
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
}

/* Glass com tint roxo (destaque) */
.glass-purple {
  background: rgba(168, 85, 247, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}

/* Glass warning/error */
.glass-orange {
  @apply bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl;
}

.glass-red {
  @apply bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-xl;
}
```

### **Exemplo Prático - Header Component**

```tsx
// Header.tsx - Implementação real do glassmorphism
export const Header = ({ title, subtitle, version, icon }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Glass container principal */}
      <div className="glass rounded-2xl p-6 mb-6 relative">
        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard className="w-4 h-4 text-white/70 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Content principal */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {title}
            </h1>
            <div className="text-base text-blue-100 font-medium">
              {subtitle}
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm font-medium">{version}</p>
      </div>
    </motion.header>
  );
};
```

---

## 🔘 **Botões e Interações**

````

### **Escala de Grays**
```css
/* Sistema de grays para texto e UI */
.text-gray-100 { color: #F3F4F6; }  /* Texto muito claro */
.text-gray-200 { color: #E5E7EB; }  /* Texto claro */
.text-gray-300 { color: #D1D5DB; }  /* Texto secundário */
.text-gray-400 { color: #9CA3AF; }  /* Texto terciário */
.text-gray-500 { color: #6B7280; }  /* Texto disabled */

/* Backgrounds em gray */
.bg-gray-800 { background-color: #1F2937; }
.bg-gray-900 { background-color: #111827; }
````

### **Transparências e Opacidades**

```css
/* Sistema de transparência para glassmorphism */
.bg-white-5 {
  background-color: rgba(255, 255, 255, 0.05);
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Borders transparentes */
.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2);
}
.border-white-30 {
  border-color: rgba(255, 255, 255, 0.3);
}
```

---

## 📝 **Tipografia e Tamanhos**

### **Escala de Texto**

```css
/* Sistema de tamanhos de texto */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* 0.75rem */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* 0.875rem */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* 1rem */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* 1.125rem */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* 1.25rem */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* 1.5rem */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* 1.875rem */
```

### **Pesos de Fonte**

```css
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
```

### **Espaçamentos**

```css
/* Sistema de spacing (padding e margin) */
.p-1 {
  padding: 4px;
} /* 0.25rem */
.p-2 {
  padding: 8px;
} /* 0.5rem */
.p-3 {
  padding: 12px;
} /* 0.75rem */
.p-4 {
  padding: 16px;
} /* 1rem */
.p-6 {
  padding: 24px;
} /* 1.5rem */
.p-8 {
  padding: 32px;
} /* 2rem */

/* Gaps para flex e grid */
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
.gap-6 {
  gap: 24px;
}
```

---

## ✨ **Glassmorphism e Backdrop**

### **Classes Base Glass**

```css
/* Glass básico - mais comum */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Equivalente Tailwind */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### **Variações de Intensidade**

```css
/* Glass sutil - para elementos de fundo */
.glass-subtle {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg;
}

/* Glass padrão - para cards principais */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}

/* Glass intenso - para modals e overlays */
.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl;
}

/* Glass ultra - para elementos críticos */
.glass-ultra {
  @apply bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl;
}
```

### **Glass com Cores Temáticas**

```css
/* Glass com tint azul */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* Glass com tint verde (sucesso) */
.glass-green {
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
}

/* Glass com tint roxo (destaque) */
.glass-purple {
  background: rgba(168, 85, 247, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}

/* Glass warning/error */
.glass-orange {
  @apply bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl;
}

.glass-red {
  @apply bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-xl;
}
```

### **Exemplo Prático - Header Component**

```tsx
// Header.tsx - Implementação real do glassmorphism
export const Header = ({ title, subtitle, version, icon }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Glass container principal */}
      <div className="glass rounded-2xl p-6 mb-6 relative">
        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard className="w-4 h-4 text-white/70 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Content principal */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {title}
            </h1>
            <div className="text-base text-blue-100 font-medium">
              {subtitle}
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm font-medium">{version}</p>
      </div>
    </motion.header>
  );
};
```

---

## 🔘 **Botões e Interações**

````

### **Escala de Grays**
```css
/* Sistema de grays para texto e UI */
.text-gray-100 { color: #F3F4F6; }  /* Texto muito claro */
.text-gray-200 { color: #E5E7EB; }  /* Texto claro */
.text-gray-300 { color: #D1D5DB; }  /* Texto secundário */
.text-gray-400 { color: #9CA3AF; }  /* Texto terciário */
.text-gray-500 { color: #6B7280; }  /* Texto disabled */

/* Backgrounds em gray */
.bg-gray-800 { background-color: #1F2937; }
.bg-gray-900 { background-color: #111827; }
````

### **Transparências e Opacidades**

```css
/* Sistema de transparência para glassmorphism */
.bg-white-5 {
  background-color: rgba(255, 255, 255, 0.05);
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Borders transparentes */
.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2);
}
.border-white-30 {
  border-color: rgba(255, 255, 255, 0.3);
}
```

---

## 📝 **Tipografia e Tamanhos**

### **Escala de Texto**

```css
/* Sistema de tamanhos de texto */
.text-xs {
  font-size: 12px;
  line-height: 16px;
} /* 0.75rem */
.text-sm {
  font-size: 14px;
  line-height: 20px;
} /* 0.875rem */
.text-base {
  font-size: 16px;
  line-height: 24px;
} /* 1rem */
.text-lg {
  font-size: 18px;
  line-height: 28px;
} /* 1.125rem */
.text-xl {
  font-size: 20px;
  line-height: 28px;
} /* 1.25rem */
.text-2xl {
  font-size: 24px;
  line-height: 32px;
} /* 1.5rem */
.text-3xl {
  font-size: 30px;
  line-height: 36px;
} /* 1.875rem */
```

### **Pesos de Fonte**

```css
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
```

### **Espaçamentos**

```css
/* Sistema de spacing (padding e margin) */
.p-1 {
  padding: 4px;
} /* 0.25rem */
.p-2 {
  padding: 8px;
} /* 0.5rem */
.p-3 {
  padding: 12px;
} /* 0.75rem */
.p-4 {
  padding: 16px;
} /* 1rem */
.p-6 {
  padding: 24px;
} /* 1.5rem */
.p-8 {
  padding: 32px;
} /* 2rem */

/* Gaps para flex e grid */
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
.gap-6 {
  gap: 24px;
}
```

---

## ✨ **Glassmorphism e Backdrop**

### **Classes Base Glass**

```css
/* Glass básico - mais comum */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Equivalente Tailwind */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### **Variações de Intensidade**

```css
/* Glass sutil - para elementos de fundo */
.glass-subtle {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg;
}

/* Glass padrão - para cards principais */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}

/* Glass intenso - para modals e overlays */
.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl;
}

/* Glass ultra - para elementos críticos */
.glass-ultra {
  @apply bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl;
}
```

### **Glass com Cores Temáticas**

```css
/* Glass com tint azul */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* Glass com tint verde (sucesso) */
.glass-green {
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1);
}

/* Glass com tint roxo (destaque) */
.glass-purple {
  background: rgba(168, 85, 247, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
}

/* Glass warning/error */
.glass-orange {
  @apply bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl;
}

.glass-red {
  @apply bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-xl;
}
```

### **Exemplo Prático - Header Component**

```tsx
// Header.tsx - Implementação real do glassmorphism
export const Header = ({ title, subtitle, version, icon }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Glass container principal */}
      <div className="glass rounded-2xl p-6 mb-6 relative">
        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard className="w-4 h-4 text-white/70 group-hover:text-white" />
          </motion.button>
        </div>

        {/* Content principal */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {title}
            </h1>
            <div className="text-base text-blue-100 font-medium">
              {subtitle}
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm font-medium">{version}</p>
      </div>
    </motion.header>
  );
};
```

---

## 🎭 **Animações e Transições**

### **Framer Motion Animation Patterns**

```typescript
// Animation variants library
export const animationVariants = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },

  // Card animations
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 },
  },

  // Modal animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  },

  // List item staggered animations
  listContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  // Loading animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

// Advanced component with complex animations
const AnimatedStatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={animationVariants.cardHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass p-6 rounded-xl cursor-pointer"
    >
      {/* Icon with rotation on hover */}
      <motion.div
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={`p-3 rounded-lg ${colorClasses[color].background} mb-4`}
      >
        <Icon className="w-6 h-6" />
      </motion.div>

      {/* Animated counter */}
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-white mb-1"
      >
        {value}
      </motion.div>

      <p className="text-sm text-white/70">{title}</p>
    </motion.div>
  );
};
```

### **CSS Transitions e Micro-animações**

```css
/* Transitions avançadas */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bounce-transition {
  transition: transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-transition {
  transition: transform 0.3s ease-out;
}

/* Hover effects complexos */
.glass-hover {
  @apply transition-all duration-300;
}

.glass-hover:hover {
  @apply bg-white/20 shadow-2xl transform scale-[1.02];
  backdrop-filter: blur(16px);
}

/* Button press effects */
.btn-press {
  @apply transition-transform duration-150;
}

.btn-press:active {
  @apply scale-95;
}

/* Loading states */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.skeleton {
  @apply bg-gray-700 rounded;
  overflow: hidden;
  position: relative;
}

.skeleton::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

/* Pulse animation for active states */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

.pulse-blue {
  animation: pulse-glow 2s infinite;
}

/* Typing effect */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.typing-effect {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid rgba(255, 255, 255, 0.5);
  animation: typing 2s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: rgba(255, 255, 255, 0.5);
  }
}
```

---

## 📝 **Formulários e Inputs**

### **Escopo e Objetivo**

Esta seção documenta todos os padrões, componentes e técnicas utilizados para formulários e inputs no MCTRL4K Calculator. O objetivo é fornecer um guia claro e reutilizável para implementação de formulários em projetos futuros, garantindo consistência, acessibilidade e uma ótima experiência do usuário.

### **Componentes de Formulário**

#### **Input Field Avançado**

```tsx
// Baseado no componente real utilizado
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, placeholder, helperText, error, ...props }, ref) => {
    return (
      <div className="mb-4">
        {/* Label com suporte a error */}
        <label
          className={`block text-sm font-medium ${
            error ? "text-red-500" : "text-gray-300"
          }`}
        >
          {label}
        </label>

        {/* Input com estados de focus e error */}
        <input
          ref={ref}
          placeholder={placeholder}
          className={`
            mt-1 block w-full rounded-lg border
            bg-black/5 px-4 py-2 text-gray-200
            placeholder:text-gray-500
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            ${error ? "border-red-500 ring-red-500" : "border-transparent"}
          `}
          {...props}
        />

        {/* Helper text ou mensagem de erro */}
        {helperText && (
          <p
            className={`mt-2 text-xs ${
              error ? "text-red-400" : "text-gray-400"
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
```

#### **Botão de Envio com Estado de Loading**

```tsx
// Baseado no componente real utilizado
export const SubmitButton: React.FC<{
  isLoading?: boolean;
  disabled?: boolean;
}> = ({ isLoading, disabled, children }) => {
  return (
    <motion.button
      type="submit"
      disabled={disabled || isLoading}
      className={`
        flex w-full justify-center rounded-lg px-4 py-2
        font-semibold text-white transition-all duration-200
        ${
          disabled
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          Enviando...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};
```

### **Padrões de Validação**

#### **Validação de Formulário com Feedback Visual**

```tsx
// Hook de validação de formulário
export const useFormValidation = (initialValues: FormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const validate = useCallback(
    (fieldValues?: FormValues) => {
      const valuesToValidate = fieldValues || values;
      let tempErrors: Partial<FormValues> = {};

      // Validação simples de exemplo
      if (!valuesToValidate.name) {
        tempErrors.name = "Nome é obrigatório";
      }

      if (!valuesToValidate.email) {
        tempErrors.email = "Email é obrigatório";
      } else if (!/\S+@\S+\.\S+/.test(valuesToValidate.email)) {
        tempErrors.email = "Email inválido";
      }

      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    },
    [values]
  );

  return {
    values,
    errors,
    setValues,
    validate,
  };
};
```

### **Exemplo de Formulário Completo**

```tsx
// Exemplo de uso dos componentes e hooks de formulário
const ExampleForm = () => {
  const { values, errors, setValues, validate } = useFormValidation({
    name: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Se a validação falhar, não envie o formulário
      return;
    }

    // Simulação de envio de formulário
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Formulário enviado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <TextInput
        label="Nome"
        placeholder="Digite seu nome"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        error={!!errors.name}
        helperText={errors.name}
      />

      <TextInput
        label="Email"
        placeholder="Digite seu email"
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        error={!!errors.email}
        helperText={errors.email}
      />

      <SubmitButton isLoading={false}>Enviar</SubmitButton>
    </form>
  );
};
```

---

## 📊 **Charts e Visualizações**

### **Chart.js Configuration (Real Implementation)**

```tsx
// Configuração base para Chart.js
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
import { Line, Pie, Bar } from "react-chartjs-2";

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

// Theme personalizado para charts
const chartTheme = {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderColor: "rgba(255, 255, 255, 0.3)",
  gridColor: "rgba(255, 255, 255, 0.1)",
  textColor: "#E5E7EB",
  colors: {
    primary: "#3B82F6",
    secondary: "#A855F7",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
  },
};

// Configuração padrão para todos os charts
const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: chartTheme.textColor,
        font: {
          size: 12,
          family: "Inter, sans-serif",
        },
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#E5E7EB",
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: {
        color: chartTheme.gridColor,
        drawBorder: false,
      },
      ticks: {
        color: chartTheme.textColor,
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: chartTheme.gridColor,
        drawBorder: false,
      },
      ticks: {
        color: chartTheme.textColor,
        font: {
          size: 11,
        },
      },
    },
  },
};
```

### **Performance Chart Component**

```tsx
// Baseado no PerformanceCharts.tsx real
interface PerformanceData {
  calculationTime: number;
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

const PerformanceChart: React.FC<{
  data: PerformanceData[];
  timeLabels: string[];
}> = ({ data, timeLabels }) => {
  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Tempo de Cálculo (ms)",
        data: data.map((d) => d.calculationTime),
        borderColor: chartTheme.colors.primary,
        backgroundColor: `${chartTheme.colors.primary}20`,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Tempo de Render (ms)",
        data: data.map((d) => d.renderTime),
        borderColor: chartTheme.colors.secondary,
        backgroundColor: `${chartTheme.colors.secondary}20`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Performance Timeline
      </h3>
      <div className="h-64">
        <Line data={chartData} options={defaultChartOptions} />
      </div>
    </div>
  );
};
```

### **Interactive Donut Chart**

```tsx
const DonutChart: React.FC<{
  title: string;
  data: { label: string; value: number; color: string }[];
}> = ({ title, data }) => {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => `${item.color}80`),
        borderColor: data.map((item) => item.color),
        borderWidth: 2,
        cutout: "60%",
      },
    ],
  };

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      legend: {
        ...defaultChartOptions.plugins.legend,
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};
```

---

## ⚡ **Performance e Otimizações**

### **Lazy Loading Components**

```tsx
// Lazy loading setup
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "./ui/LoadingSpinner";

// Lazy imports
const AdvancedAnalyticsDashboard = lazy(
  () => import("./components/advanced/AdvancedAnalyticsDashboard")
);
const DeviceSelector = lazy(
  () => import("./components/advanced/DeviceSelector")
);
const InteractiveCharts = lazy(
  () => import("./components/charts/InteractiveCharts")
);

// Wrapper component para lazy loading
const LazyWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="glass rounded-xl p-8 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
};

// Uso em componentes
const App = () => {
  return (
    <div>
      <LazyWrapper>
        <AdvancedAnalyticsDashboard />
      </LazyWrapper>
    </div>
  );
};
```

### **Memoização e Hooks de Performance**

```tsx
// Custom hook para debouncing
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Performance monitoring hook
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    calculationTime: 0,
    memoryUsage: 0,
  });

  const startTiming = useCallback(() => {
    return performance.now();
  }, []);

  const endTiming = useCallback((startTime: number, operation: string) => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    setMetrics((prev) => ({
      ...prev,
      [operation]: duration,
    }));

    return duration;
  }, []);

  const measureMemory = useCallback(() => {
    if ("memory" in performance) {
      const memInfo = (performance as any).memory;
      setMetrics((prev) => ({
        ...prev,
        memoryUsage: memInfo.usedJSHeapSize / 1024 / 1024, // MB
      }));
    }
  }, []);

  return { metrics, startTiming, endTiming, measureMemory };
};

// Memoized calculator component
const Calculator = memo(() => {
  const { inputs, results, calculate } = useCalculator();
  const debouncedInputs = useDebounce(inputs, 300);

  useEffect(() => {
    calculate();
  }, [debouncedInputs, calculate]);

  return <div>{/* Calculator UI */}</div>;
});
```

### **Web Workers para Cálculos Pesados**

```tsx
// useWebWorker hook
export const useWebWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Criar worker
    workerRef.current = new Worker("/calculationWorker.js");

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const calculateInWorker = useCallback((data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error("Worker not available"));
        return;
      }

      setIsCalculating(true);

      const handleMessage = (e: MessageEvent) => {
        setIsCalculating(false);
        workerRef.current?.removeEventListener("message", handleMessage);
        resolve(e.data);
      };

      const handleError = (error: ErrorEvent) => {
        setIsCalculating(false);
        workerRef.current?.removeEventListener("error", handleError);
        reject(error);
      };

      workerRef.current.addEventListener("message", handleMessage);
      workerRef.current.addEventListener("error", handleError);
      workerRef.current.postMessage(data);
    });
  }, []);

  return { calculateInWorker, isCalculating };
};
```

### **Keyboard Shortcuts Hook**

```tsx
// Keyboard shortcuts implementation
export const useKeyboardShortcuts = () => {
  useHotkeys("ctrl+s", (e) => {
    e.preventDefault();
    // Save action
  });

  useHotkeys("ctrl+r", (e) => {
    e.preventDefault();
    // Reset action
  });

  useHotkeys("ctrl+h", (e) => {
    e.preventDefault();
    // Show help
  });

  useHotkeys("ctrl+shift+d", (e) => {
    e.preventDefault();
    // Toggle debug mode
  });

  useHotkeys("esc", (e) => {
    // Close modals
  });
};
```

---

## 📁 **Estrutura de Arquivos UI**

### **Organização de Componentes**

```
src/
├── components/
│   ├── ui/                          # Componentes base reutilizáveis
│   │   ├── Button.tsx              # Botões primários, secundários
│   │   ├── Card.tsx                # Cards com glass effect
│   │   ├── Input.tsx               # Input fields avançados
│   │   ├── Modal.tsx               # Modais animados
│   │   ├── Badge.tsx               # Status indicators
│   │   ├── Tooltip.tsx             # Tooltips informativos
│   │   ├── Loading.tsx             # Loading states
│   │   └── index.ts                # Barrel exports
│   │
│   ├── forms/                      # Componentes de formulário
│   │   ├── InputSection.tsx        # Seções de input agrupadas
│   │   ├── InputFields.tsx         # Fields específicos
│   │   ├── FormValidation.tsx      # Validação de formulários
│   │   └── PresetSelector.tsx      # Seletores de preset
│   │
│   ├── charts/                     # Visualizações e gráficos
│   │   ├── PerformanceCharts.tsx   # Charts de performance
│   │   ├── InteractiveCharts.tsx   # Charts interativos
│   │   ├── StatusCards.tsx         # Cards com métricas
│   │   └── ChartConfig.ts          # Configurações Chart.js
│   │
│   ├── advanced/                   # Componentes complexos
│   │   ├── AnalyticsDashboard.tsx  # Dashboard principal
│   │   ├── DeviceSelector.tsx      # Seletor de dispositivos
│   │   ├── DeviceValidation.tsx    # Validação device-specific
│   │   └── ExportWizard.tsx        # Wizard de exportação
│   │
│   ├── layout/                     # Layout components
│   │   ├── Header.tsx              # Header principal
│   │   ├── TabContainer.tsx        # Container de tabs
│   │   ├── AppLayout.tsx           # Layout da aplicação
│   │   └── ResponsiveGrid.tsx      # Grid responsivo
│   │
│   └── lazy/                       # Lazy loading utilities
│       ├── LazyWrapper.tsx         # Wrapper para Suspense
│       └── index.ts                # Lazy imports
│
├── hooks/                          # Custom hooks
│   ├── useCalculator.ts            # Hook principal de cálculos
│   ├── usePerformance.ts           # Monitoramento performance
│   ├── useKeyboardShortcuts.ts     # Atalhos de teclado
│   ├── useWebWorker.ts             # Web workers
│   ├── useDebounce.ts              # Debouncing
│   └── useTheme.ts                 # Sistema de temas
│
├── styles/                         # Estilos e temas
│   ├── globals.css                 # CSS global
│   ├── components.css              # Estilos de componentes
│   ├── animations.css              # Animações CSS
│   └── themes.css                  # Variáveis de tema
│
├── utils/                          # Utilitários
│   ├── animations.ts               # Variantes Framer Motion
│   ├── chartConfigs.ts             # Configurações de charts
│   ├── formatters.ts               # Formatação de dados
│   └── constants.ts                # Constantes globais
│
└── types/                          # TypeScript types
    ├── components.ts               # Types de componentes
    ├── calculator.ts               # Types do calculator
    └── charts.ts                   # Types dos charts
```

### **Barrel Exports (index.ts)**

```typescript
// components/ui/index.ts
export { Button } from "./Button";
export { Card } from "./Card";
export { Input } from "./Input";
export { Modal } from "./Modal";
export { Badge } from "./Badge";
export { LoadingSpinner, LoadingOverlay, SkeletonLoader } from "./Loading";

// utils/index.ts
export { animationVariants } from "./animations";
export { chartTheme, defaultChartOptions } from "./chartConfigs";
export { formatBytes, formatPercentage, formatDuration } from "./formatters";
export * from "./constants";

// hooks/index.ts
export { useCalculator } from "./useCalculator";
export { usePerformance } from "./usePerformance";
export { useKeyboardShortcuts } from "./useKeyboardShortcuts";
export { useWebWorker } from "./useWebWorker";
export { useDebounce } from "./useDebounce";
export { useTheme } from "./useTheme";
```

### **CSS Organization**

```css
/* globals.css - Ordem de importação */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/* Custom CSS layers */
@layer base {
  /* CSS resets e base styles */
  html {
    @apply antialiased;
  }
  body {
    @apply bg-gray-900 text-white;
  }
}

@layer components {
  /* Componentes reutilizáveis */
  .glass {
    @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl;
  }
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg;
  }
  .form-input {
    @apply w-full p-3 bg-white/10 border border-white/20 rounded-lg;
  }
}

@layer utilities {
  /* Utilities customizadas */
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .glass-border {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}
```

---

## 🎯 **Conclusão e Próximos Passos**

Esta documentação serve como um **guia completo e reutilizável** para implementar o design system do MCTRL4K Calculator em futuros projetos. Todos os componentes, padrões e técnicas estão documentados com:

✅ **Código prático e testado**  
✅ **Exemplos de implementação real**  
✅ **Configurações de performance**  
✅ **Sistema de organização escalável**  
✅ **Patterns de animação e UX**

### **Como Usar Esta Documentação:**

1. **Copy & Paste Ready** - Todos os códigos podem ser copiados diretamente
2. **Modular** - Cada seção é independente e reutilizável
3. **Escalável** - Estrutura preparada para projetos grandes
4. **Performance-First** - Otimizações já incluídas
5. **TypeScript Ready** - Types e interfaces completas

### **Documentos Especializados (Opcionais):**

Para projetos que precisem de ainda mais detalhamento, posso criar documentos específicos para:

- 🎬 **Animações Avançadas** - Patterns complexos do Framer Motion
- 📝 **Formulários Especializados** - Validação, multi-step, autocomplete
- 📊 **Data Visualization** - Charts avançados, dashboards interativos
- 🎣 **Hooks Avançados** - State management, API integration
- 📱 **Mobile & Responsive** - Touch gestures, PWA patterns

---

**💡 Este documento é um produto completo e prático para acelerar o desenvolvimento de interfaces modernas e performáticas.**

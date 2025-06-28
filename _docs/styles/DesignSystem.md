# Design System - Documentação Global

## Visão Geral

Este documento define o design system completo do Led Panel Manager, incluindo cores, tipografia, spacing, animações e padrões visuais. Serve como referência central para manter consistência visual em todo o projeto.

## Filosofia de Design

### Princípios Fundamentais

1. **Contraste Otimizado**: Garantir legibilidade em ambiente de trabalho
2. **Glassmorphism Elegante**: Transparências e desfoque para modernidade
3. **Responsividade Total**: Adaptação perfeita a qualquer dispositivo
4. **Acessibilidade**: Suporte completo a usuários com necessidades especiais
5. **Performance**: Animações e efeitos otimizados

### Metodologia

- **Mobile-first**: Design iniciado para mobile, expandido para desktop
- **Component-driven**: Componentes reutilizáveis e modulares
- **Utility-first**: Tailwind CSS como base, customizações quando necessário

## Paleta de Cores

### Cores Primárias

```css
/* Azul - Cor principal do sistema */
--blue-50: #eff6ff;
--blue-100: #dbeafe;
--blue-200: #bfdbfe;
--blue-300: #93c5fd;
--blue-400: #60a5fa; /* Destaque principal */
--blue-500: #3b82f6; /* Ações primárias */
--blue-600: #2563eb;
--blue-700: #1d4ed8;
--blue-800: #1e40af;
--blue-900: #1e3a8a;

/* Cinza - Base do sistema */
--gray-50: #f9fafb;
--gray-100: #f3f4f6; /* Texto claro */
--gray-200: #e5e7eb;
--gray-300: #d1d5db; /* Labels, texto secundário */
--gray-400: #9ca3af; /* Placeholders, ícones */
--gray-500: #6b7280; /* Bordas, divisores */
--gray-600: #4b5563; /* Bordas escuras */
--gray-700: #374151; /* Backgrounds secundários */
--gray-800: #1f2937; /* Backgrounds principais */
--gray-900: #111827; /* Backgrounds escuros */
```

### Cores Funcionais

```css
/* Verde - Sucesso */
--green-400: #4ade80; /* Success states */
--green-500: #22c55e; /* Success actions */

/* Vermelho - Erro/Perigo */
--red-400: #f87171; /* Error states */
--red-500: #ef4444; /* Destructive actions */

/* Amarelo - Premium/Atenção */
--yellow-400: #facc15; /* Premium badges */
--yellow-500: #eab308; /* Warning states */

/* Roxo - Futuro/Especial */
--purple-400: #a78bfa; /* Futuros recursos */
--purple-500: #8b5cf6; /* Ações especiais */
```

### Uso das Cores

#### Backgrounds

```css
/* Containers principais */
.bg-primary: bg-gray-900/95
.bg-secondary: bg-gray-800/90
.bg-tertiary: bg-gray-700/90

/* Estados */
.bg-selected: bg-blue-900/40
.bg-hover: bg-gray-800/95
.bg-error: bg-red-900/20
.bg-success: bg-green-900/20
```

#### Borders

```css
/* Padrão */
.border-primary: border-gray-500/90
.border-secondary: border-gray-600/70

/* Estados */
.border-focus: border-blue-400
.border-error: border-red-400
.border-success: border-green-400
```

#### Text

```css
/* Hierarquia de texto */
.text-primary: text-gray-100    /* Títulos, texto principal */
.text-secondary: text-gray-300  /* Labels, subtítulos */
.text-tertiary: text-gray-400   /* Placeholders, ajuda */
.text-muted: text-gray-500      /* Texto desabilitado */

/* Estados */
.text-accent: text-blue-400     /* Links, destaques */
.text-error: text-red-400       /* Erros */
.text-success: text-green-400   /* Sucesso */
```

## Tipografia

### Font Families

```css
/* Primary font stack */
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
  Ubuntu, Cantarell, sans-serif;

/* Monospace (para códigos) */
font-family: "JetBrains Mono", "Fira Code", Monaco, "Cascadia Code", monospace;
```

### Escalas de Tamanho

```css
/* Tailwind scale customizada */
.text-xs: 0.75rem; /* 12px - Detalhes, tags */
.text-sm: 0.875rem; /* 14px - Texto secundário */
.text-base: 1rem; /* 16px - Texto padrão */
.text-lg: 1.125rem; /* 18px - Subtítulos */
.text-xl: 1.25rem; /* 20px - Títulos de seção */
.text-2xl: 1.5rem; /* 24px - Títulos principais */
.text-3xl: 1.875rem; /* 30px - Headers */
```

### Pesos de Fonte

```css
.font-normal: 400; /* Texto padrão */
.font-medium: 500; /* Labels, navegação */
.font-semibold: 600; /* Subtítulos */
.font-bold: 700; /* Títulos principais */
```

### Line Heights

```css
.leading-tight: 1.25; /* Títulos */
.leading-normal: 1.5; /* Texto padrão */
.leading-relaxed: 1.625; /* Texto longo */
```

## Spacing e Layout

### Escala de Spacing (Tailwind)

```css
/* Base: 0.25rem = 4px */
.p-1: 0.25rem; /* 4px */
.p-2: 0.5rem; /* 8px */
.p-3: 0.75rem; /* 12px */
.p-4: 1rem; /* 16px - Padrão interno */
.p-5: 1.25rem; /* 20px */
.p-6: 1.5rem; /* 24px - Padrão containers */
.p-8: 2rem; /* 32px - Spacing large */
.p-12: 3rem; /* 48px - Sections */
```

### Grid System

```css
/* Responsive grid */
.grid-cols-1         /* Mobile: 1 coluna */
.md:grid-cols-2      /* Tablet: 2 colunas */
.lg:grid-cols-3      /* Desktop: 3 colunas */
.xl:grid-cols-4      /* Large: 4 colunas */

/* Gap padrão */
.gap-4: 1rem;        /* 16px - Gap padrão */
.gap-6: 1.5rem;      /* 24px - Gap large */
```

### Container Sizes

```css
/* Larguras máximas */
.max-w-sm: 24rem; /* 384px - Cards pequenos */
.max-w-md: 28rem; /* 448px - Modals */
.max-w-lg: 32rem; /* 512px - Forms */
.max-w-4xl: 56rem; /* 896px - Content max */
.max-w-7xl: 80rem; /* 1280px - Site max */
```

## Glassmorphism

### Base Style

```css
.glass-container {
  background: rgba(17, 24, 39, 0.95); /* gray-900/95 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid rgba(107, 114, 128, 0.9); /* gray-500/90 */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Variações

```css
/* Glass Light (para sobreposições) */
.glass-light {
  background: rgba(31, 41, 55, 0.9); /* gray-800/90 */
  backdrop-filter: blur(8px);
  border: 1px solid rgba(75, 85, 99, 0.7); /* gray-600/70 */
}

/* Glass Heavy (para modais) */
.glass-heavy {
  background: rgba(17, 24, 39, 0.98); /* gray-900/98 */
  backdrop-filter: blur(16px);
  border: 2px solid rgba(107, 114, 128, 0.9);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Glass Accent (para elementos selecionados) */
.glass-accent {
  background: rgba(59, 130, 246, 0.4); /* blue-500/40 */
  backdrop-filter: blur(12px);
  border: 2px solid rgba(96, 165, 250, 1); /* blue-400 */
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.3);
}
```

## Animações

### Transições Base

```css
/* Transição padrão - para hover, focus, etc. */
.transition-default {
  transition: all 0.2s ease-in-out;
}

/* Transição suave - para mudanças de estado */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transição rápida - para feedback imediato */
.transition-fast {
  transition: all 0.15s ease-out;
}
```

### Framer Motion Presets

```jsx
// Fade in padrão
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
};

// Scale in para modais
const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" },
};

// Slide in para painéis
const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

// Spring bounce para ações
const springBounce = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};
```

### Hover Effects

```css
/* Hover lift para cards */
.hover-lift:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

/* Hover glow para buttons */
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.4);
}

/* Hover scale para ícones */
.hover-scale:hover {
  transform: scale(1.1);
}
```

## Sombras

### Escala de Sombras

```css
/* Sombra sutil */
.shadow-subtle {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Sombra padrão */
.shadow-default {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Sombra elevada */
.shadow-elevated {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Sombra dramática */
.shadow-dramatic {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Sombras Coloridas

```css
/* Sombra azul para elementos selecionados */
.shadow-blue {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.3);
}

/* Sombra vermelha para avisos */
.shadow-red {
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.2);
}

/* Sombra verde para sucesso */
.shadow-green {
  box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.2);
}
```

## Borders e Ring Effects

### Border Styles

```css
/* Border padrão */
.border-default {
  border: 2px solid rgba(107, 114, 128, 0.9); /* gray-500/90 */
}

/* Border focus */
.border-focus {
  border: 2px solid rgba(96, 165, 250, 1); /* blue-400 */
}

/* Ring focus (para acessibilidade) */
.ring-focus {
  ring: 2px solid rgba(96, 165, 250, 0.3); /* blue-400/30 */
}
```

### Gradient Borders

```css
.gradient-border {
  border: 2px solid;
  border-image: linear-gradient(45deg, #60a5fa, #a78bfa) 1;
}
```

## Responsividade

### Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px; /* Tablet pequeno */
md: 768px; /* Tablet */
lg: 1024px; /* Desktop */
xl: 1280px; /* Desktop large */
2xl: 1536px; /* Desktop XL */
```

### Padrões Responsivos

```css
/* Typography responsive */
.responsive-text {
  @apply text-sm md:text-base lg:text-lg;
}

/* Spacing responsive */
.responsive-padding {
  @apply p-4 md:p-6 lg:p-8;
}

/* Grid responsive */
.responsive-grid {
  @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}
```

## Utility Classes Customizadas

### Layout Utilities

```css
.glass-container {
  @apply bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90 
         rounded-xl shadow-xl ring-1 ring-gray-600/50;
}

.glass-card {
  @apply bg-gray-800/90 backdrop-blur-sm border border-gray-600/70 
         rounded-lg shadow-lg;
}

.text-hierarchy-1 {
  @apply text-2xl font-bold text-gray-100;
}

.text-hierarchy-2 {
  @apply text-xl font-semibold text-gray-200;
}

.text-hierarchy-3 {
  @apply text-lg font-medium text-gray-300;
}
```

### State Utilities

```css
.state-normal {
  @apply bg-gray-800/90 border-gray-600/70 text-gray-100;
}

.state-hover {
  @apply bg-gray-700/90 border-blue-400/80 text-gray-100;
}

.state-focus {
  @apply bg-gray-700/90 border-blue-400 ring-2 ring-blue-400/30;
}

.state-selected {
  @apply bg-blue-900/40 border-blue-400 text-blue-100 shadow-blue;
}

.state-error {
  @apply bg-red-900/20 border-red-400 text-red-200;
}
```

## Acessibilidade

### Focus Management

```css
.focus-visible {
  @apply outline-none ring-2 ring-blue-400/50 ring-offset-2 
         ring-offset-gray-900;
}

.skip-link {
  @apply absolute -top-10 left-1/2 transform -translate-x-1/2
         bg-blue-600 text-white px-4 py-2 rounded-md
         focus:top-4 transition-all duration-200;
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .glass-container {
    @apply bg-black border-white;
  }

  .text-primary {
    @apply text-white;
  }

  .text-secondary {
    @apply text-gray-200;
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance

### CSS Optimization

```css
/* Use transform/opacity para animações */
.optimized-animation {
  transform: translateZ(0); /* Force GPU acceleration */
  will-change: transform, opacity;
}

/* Evitar reflow/repaint */
.no-layout-shift {
  contain: layout style paint;
}
```

### Loading States

```css
.skeleton {
  @apply bg-gray-700/50 animate-pulse rounded;
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(75, 85, 99, 0.2) 0%,
    rgba(156, 163, 175, 0.4) 50%,
    rgba(75, 85, 99, 0.2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

---

_Documentação atualizada em: [Data atual]_
_Versão do Design System: 2.0_
_Compatibilidade: Tailwind CSS 3+, CSS3, Modern Browsers_

# Glassmorphism - Guia de Implementação

## Visão Geral

Glassmorphism é a técnica visual principal do Led Panel Manager, criando interfaces elegantes com transparência, desfoque e profundidade. Este guia detalha implementação, variações e melhores práticas.

## Conceitos Fundamentais

### Características do Glassmorphism

1. **Transparência**: Elementos semi-transparentes que revelam o fundo
2. **Desfoque de Fundo**: `backdrop-filter: blur()` para efeito "vidro"
3. **Bordas Sutis**: Bordas translúcidas para definir contornos
4. **Hierarquia Visual**: Diferentes níveis de opacidade para profundidade
5. **Sombras Realistas**: Sombras que simulam elevação real

### Pilares da Implementação

- **Performance**: Uso otimizado de `backdrop-filter`
- **Acessibilidade**: Contraste adequado em todos os estados
- **Responsividade**: Adaptação a diferentes densidades de tela
- **Consistência**: Padrões visuais uniformes

## Implementação Base

### CSS Foundation

```css
.glass-base {
  /* Transparência de fundo */
  background: rgba(17, 24, 39, 0.95); /* gray-900/95 */

  /* Desfoque de fundo */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Safari support */

  /* Bordas translúcidas */
  border: 2px solid rgba(107, 114, 128, 0.9); /* gray-500/90 */

  /* Sombras realistas */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);

  /* Ring effect para profundidade */
  ring: 1px solid rgba(107, 114, 128, 0.5);
}
```

### Tailwind Classes

```jsx
className="bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90
           shadow-xl ring-1 ring-gray-600/50 rounded-xl"
```

## Hierarquia de Glassmorphism

### Nível 1 - Containers Principais

```css
.glass-level-1 {
  background: rgba(17, 24, 39, 0.95); /* gray-900/95 */
  backdrop-filter: blur(12px);
  border: 2px solid rgba(107, 114, 128, 0.9);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  ring: 1px solid rgba(107, 114, 128, 0.5);
}
```

```jsx
// Uso: Toolbars, Sidebars, Main containers
<div className="bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90
                shadow-xl ring-1 ring-gray-600/50">
```

### Nível 2 - Cards e Seções

```css
.glass-level-2 {
  background: rgba(31, 41, 55, 0.9); /* gray-800/90 */
  backdrop-filter: blur(8px);
  border: 2px solid rgba(75, 85, 99, 0.7);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  ring: 1px solid rgba(75, 85, 99, 0.4);
}
```

```jsx
// Uso: Cards, Forms, Secondary panels
<div className="bg-gray-800/90 backdrop-blur-sm border-2 border-gray-600/70
                shadow-lg ring-1 ring-gray-500/40">
```

### Nível 3 - Elementos Internos

```css
.glass-level-3 {
  background: rgba(55, 65, 81, 0.8); /* gray-700/80 */
  backdrop-filter: blur(6px);
  border: 1px solid rgba(75, 85, 99, 0.6);
  box-shadow: 0 4px 15px -2px rgba(0, 0, 0, 0.1);
}
```

```jsx
// Uso: Input fields, Buttons, Nested components
<div className="bg-gray-700/80 backdrop-blur-sm border border-gray-600/60
                shadow-md">
```

## Estados e Variações

### Estado Normal

```jsx
<div className="bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90
                rounded-xl shadow-xl ring-1 ring-gray-600/50
                transition-all duration-200">
```

### Estado Hover

```jsx
<div className="bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90
                rounded-xl shadow-xl ring-1 ring-gray-600/50
                hover:border-blue-400/80 hover:shadow-2xl
                hover:shadow-blue-500/20 hover:scale-[1.02]
                transition-all duration-200">
```

### Estado Selecionado/Ativo

```jsx
<div className="bg-blue-900/40 backdrop-blur-sm border-2 border-blue-400
                rounded-xl shadow-2xl shadow-blue-500/30
                ring-2 ring-blue-400/50">
```

### Estado Focus (para acessibilidade)

```jsx
<div className="bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90
                rounded-xl shadow-xl ring-1 ring-gray-600/50
                focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30
                focus:outline-none">
```

### Estado Error

```jsx
<div className="bg-red-900/20 backdrop-blur-sm border-2 border-red-400/50
                rounded-xl shadow-xl shadow-red-500/20
                ring-1 ring-red-400/30">
```

### Estado Success

```jsx
<div className="bg-green-900/20 backdrop-blur-sm border-2 border-green-400/50
                rounded-xl shadow-xl shadow-green-500/20
                ring-1 ring-green-400/30">
```

## Aplicações Específicas

### Modal/Dialog Glass

```jsx
// Backdrop
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

// Modal Container
<div className="bg-gray-900/98 backdrop-blur-md border-2 border-gray-500/90
                rounded-2xl shadow-2xl ring-2 ring-gray-600/50
                max-w-md mx-auto p-6">
```

### Dropdown/Menu Glass

```jsx
<div className="absolute top-full left-0 mt-2
                bg-gray-800/95 backdrop-blur-md border border-gray-600/70
                rounded-lg shadow-2xl ring-1 ring-gray-500/50
                min-w-48 py-2 z-50">
```

### Tooltip Glass

```jsx
<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                bg-gray-700/95 backdrop-blur-sm border border-gray-600/80
                rounded-md px-3 py-2 text-sm text-gray-200
                shadow-lg ring-1 ring-gray-500/40">
```

### Notification/Toast Glass

```jsx
<div className="bg-gray-800/95 backdrop-blur-md border border-gray-600/70
                rounded-lg shadow-2xl ring-1 ring-gray-500/50
                p-4 max-w-sm">
```

### Sidebar Glass

```jsx
<aside className="bg-gray-900/95 backdrop-blur-sm border-r-2 border-gray-500/90
                  shadow-2xl ring-1 ring-gray-600/50
                  w-64 h-full">
```

## Animações com Glassmorphism

### Entrada Suave

```jsx
const glassEnter = {
  initial: {
    opacity: 0,
    scale: 0.95,
    backdropFilter: "blur(0px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    backdropFilter: "blur(12px)",
  },
  transition: { duration: 0.3, ease: "easeOut" },
};
```

### Hover com Glass Enhancement

```jsx
const glassHover = {
  hover: {
    backdropFilter: "blur(16px)",
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};
```

### Transition entre Estados

```jsx
className="backdrop-blur-sm hover:backdrop-blur-md
           transition-all duration-300 ease-in-out"
```

## Responsividade

### Mobile Optimizations

```jsx
// Reduzir desfoque em mobile para performance
<div className="backdrop-blur-sm md:backdrop-blur-md lg:backdrop-blur-lg">

// Bordas mais sutis em telas pequenas
<div className="border border-gray-600/70 md:border-2 md:border-gray-500/90">

// Sombras adaptáveis
<div className="shadow-lg md:shadow-xl lg:shadow-2xl">
```

### High DPI Screens

```css
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  .glass-container {
    backdrop-filter: blur(8px); /* Reduzir blur em high DPI */
  }
}
```

## Performance

### Otimizações CSS

```css
.glass-optimized {
  /* Force GPU acceleration */
  transform: translateZ(0);
  will-change: backdrop-filter;

  /* Containment para isolamento */
  contain: layout style paint;

  /* Evitar repaints desnecessários */
  backface-visibility: hidden;
}
```

### Lazy Blur Application

```jsx
// Aplicar blur apenas quando elemento está visível
const [isVisible, setIsVisible] = useState(false);

<div className={`
  bg-gray-900/95 border-2 border-gray-500/90
  ${isVisible ? 'backdrop-blur-sm' : ''}
  transition-all duration-300
`}>
```

### Fallbacks para Navegadores Antigos

```css
.glass-with-fallback {
  background: rgba(17, 24, 39, 0.95);

  /* Fallback para navegadores sem backdrop-filter */
  @supports not (backdrop-filter: blur(12px)) {
    background: rgba(17, 24, 39, 0.98);
  }

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

## Acessibilidade

### Contraste Adequado

```css
.glass-accessible {
  /* Garantir contraste mínimo 4.5:1 */
  background: rgba(17, 24, 39, 0.95); /* Suficiente para texto branco */
  color: #f9fafb; /* gray-50 para máximo contraste */
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .glass-container {
    background: rgba(0, 0, 0, 1);
    border: 2px solid white;
    backdrop-filter: none;
  }
}
```

### Reduced Transparency

```css
@media (prefers-reduced-transparency: reduce) {
  .glass-container {
    background: rgba(17, 24, 39, 1);
    backdrop-filter: none;
  }
}
```

## Debugging e Troubleshooting

### Verificação Visual

```css
/* Debug mode - mostrar estruturas glass */
.debug-glass {
  outline: 1px solid lime !important;
}

.debug-glass::before {
  content: "GLASS";
  position: absolute;
  top: 0;
  left: 0;
  background: lime;
  color: black;
  padding: 2px 4px;
  font-size: 10px;
  z-index: 9999;
}
```

### Performance Monitoring

```jsx
// Component para monitorar performance de blur
const GlassPerformanceMonitor = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes("backdrop-filter")) {
          console.log("Backdrop filter performance:", entry);
        }
      });
    });

    observer.observe({ entryTypes: ["measure"] });

    return () => observer.disconnect();
  }, []);
};
```

### Problemas Comuns

#### 1. Blur não aparece

```css
/* Verificar suporte do navegador */
@supports (backdrop-filter: blur(1px)) {
  .glass-container {
    backdrop-filter: blur(12px);
  }
}
```

#### 2. Performance ruim

```css
/* Reduzir complexidade */
.glass-performance {
  backdrop-filter: blur(8px); /* Menos blur = melhor performance */
  will-change: transform; /* Apenas para elementos que animam */
}
```

#### 3. Bordas não visíveis

```css
/* Aumentar opacidade da borda */
.glass-visible-border {
  border: 2px solid rgba(107, 114, 128, 1); /* Opacidade total */
}
```

## Melhores Práticas

### Do's ✅

1. Use hierarquia clara (3 níveis máximo)
2. Mantenha contraste adequado para texto
3. Otimize performance em mobile
4. Implemente fallbacks para navegadores antigos
5. Use animações suaves para transições

### Don'ts ❌

1. Não abuse de múltiplas camadas de blur
2. Não use glassmorphism onde contraste é crítico
3. Não ignore acessibilidade
4. Não aplique blur excessivo (máximo 16px)
5. Não use em elementos que mudam frequentemente

### Checklist de Implementação

- [ ] Contraste de texto ≥ 4.5:1
- [ ] Fallback para navegadores sem suporte
- [ ] Performance testada em mobile
- [ ] Animações suaves implementadas
- [ ] Estados de focus/hover definidos
- [ ] Acessibilidade verificada

---

_Documentação atualizada em: [Data atual]_
_Versão: 2.0_
_Suporte: Chrome 76+, Firefox 103+, Safari 14+_

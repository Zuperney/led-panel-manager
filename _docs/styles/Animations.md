# Animações - Guia Completo

## Visão Geral

Sistema de animações fluidas e performáticas usando Framer Motion e CSS. Focado em feedback visual, microinterações e transições suaves que melhoram a experiência do usuário.

## Filosofia de Animação

### Princípios Fundamentais

1. **Propósito**: Toda animação deve ter uma função clara
2. **Performance**: 60fps em todos os dispositivos
3. **Suavidade**: Curvas de easing naturais
4. **Feedback**: Resposta imediata a interações
5. **Acessibilidade**: Respeito às preferências de movimento

### Timing e Duração

- **Micro-interações**: 150-200ms (hover, click)
- **Transições**: 250-350ms (mudanças de estado)
- **Navegação**: 400-500ms (mudanças de página/modal)
- **Entrada/Saída**: 300-400ms (mount/unmount)

## Framer Motion - Configuração Base

### Setup e Imports

```jsx
import { motion, AnimatePresence, useAnimation } from "framer-motion";
```

### Configuração Global

```jsx
// MotionConfig para configurações globais
<MotionConfig
  transition={{ duration: 0.3, ease: "easeOut" }}
  reducedMotion="user"
>
  <App />
</MotionConfig>
```

## Presets de Animação

### 1. Fade Animations

```jsx
// Fade In básico
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};

// Fade In com movimento vertical
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
};

// Fade In com movimento horizontal
const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: "easeInOut" },
};
```

### 2. Scale Animations

```jsx
// Scale In para modais
const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" },
};

// Scale bounce para ações importantes
const scaleBounce = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 25,
  },
};

// Hover scale para interatividade
const hoverScale = {
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  whileTap: { scale: 0.98 },
};
```

### 3. Spring Animations

```jsx
// Spring suave para entrada
const springGentle = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Spring dinâmico para interações
const springDynamic = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

// Spring bouncy para elementos especiais
const springBouncy = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 0.6,
};
```

## Animações de Lista

### Stagger Effect (Escalonamento)

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Uso
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, index) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>;
```

### Lista com Delay Indexado

```jsx
const listItemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

// Uso
{
  gabinetes.map((gabinete, index) => (
    <motion.div
      key={gabinete.id}
      custom={index}
      variants={listItemVariants}
      initial="initial"
      animate="animate"
    >
      <GabineteCard gabinete={gabinete} />
    </motion.div>
  ));
}
```

## Animações de Modal

### Modal Backdrop

```jsx
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};
```

### Modal Content

```jsx
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      scale: { type: "spring", stiffness: 300, damping: 25 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Implementação completa
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bg-gray-900/98 backdrop-blur-md rounded-2xl p-6 max-w-md w-full">
          {children}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>;
```

## Hover e Interações

### Hover Effects Avançados

```jsx
const cardHover = {
  whileHover: {
    scale: 1.02,
    y: -5,
    rotateX: 2,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      type: "spring",
      stiffness: 300,
    },
  },
  whileTap: { scale: 0.98 },
};

// Glow effect on hover
const glowHover = {
  whileHover: {
    boxShadow: "0 0 25px rgba(96, 165, 250, 0.4)",
    transition: { duration: 0.2 },
  },
};

// Lift effect with shadow
const liftHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};
```

### Button Animations

```jsx
const buttonVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
  loading: {
    scale: [1, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "easeInOut",
    },
  },
};

// Success animation
const successPulse = {
  scale: [1, 1.1, 1],
  backgroundColor: ["#22c55e", "#16a34a", "#22c55e"],
  transition: { duration: 0.6, ease: "easeInOut" },
};
```

## Animações de Loading

### Spinner Customizado

```jsx
const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

<motion.div
  className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
  variants={spinnerVariants}
  animate="animate"
/>;
```

### Skeleton Loading

```jsx
const skeletonVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

<motion.div
  className="bg-gray-700/50 rounded h-4 w-full"
  variants={skeletonVariants}
  animate="animate"
/>;
```

### Progress Animation

```jsx
const progressVariants = {
  initial: { width: "0%" },
  animate: {
    width: "100%",
    transition: { duration: 2, ease: "easeOut" },
  },
};
```

## Animações de Transição

### Page Transitions

```jsx
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};
```

### Tab Transitions

```jsx
const tabContent = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};
```

## Animações Condicionais

### Estado-based Animations

```jsx
const statusAnimations = {
  success: {
    backgroundColor: "#22c55e",
    scale: [1, 1.05, 1],
    transition: { duration: 0.6 },
  },
  error: {
    backgroundColor: "#ef4444",
    x: [-3, 3, -3, 3, 0],
    transition: { duration: 0.4 },
  },
  loading: {
    backgroundColor: "#6b7280",
    scale: [1, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
    },
  },
};

// Uso dinâmico
<motion.div animate={statusAnimations[status]} className="px-4 py-2 rounded">
  {message}
</motion.div>;
```

### Visibility Animations

```jsx
const visibilityVariants = {
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3 },
  },
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3 },
  },
};

<motion.div
  animate={isVisible ? "visible" : "hidden"}
  variants={visibilityVariants}
  initial="hidden"
>
  {content}
</motion.div>;
```

## Animações CSS

### Keyframes Customizados

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
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

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.bounce {
  animation: bounce 1s;
}
```

### Transitions CSS

```css
/* Transições globais */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-fast {
  transition: all 0.15s ease-out;
}

.transition-slow {
  transition: all 0.5s ease-in-out;
}

/* Transforms optimizados */
.transform-gpu {
  transform: translateZ(0);
  will-change: transform;
}
```

## Performance

### Otimizações

```jsx
// Use transform e opacity para animações
const optimizedAnimation = {
  transform: "translateY(0px) scale(1)", // GPU accelerated
  opacity: 1, // Não causa reflow
};

// Evite animar propriedades que causam layout
// ❌ Ruim
const badAnimation = {
  width: "100px", // Causa reflow
  height: "100px", // Causa reflow
};

// ✅ Bom
const goodAnimation = {
  transform: "scale(1.1)", // GPU accelerated
  opacity: 0.8, // GPU accelerated
};
```

### Will-change Otimization

```jsx
<motion.div
  style={{ willChange: "transform, opacity" }}
  animate={{ x: 100, opacity: 0.5 }}
>
```

### Hardware Acceleration

```css
.hw-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}
```

## Acessibilidade

### Reduced Motion

```jsx
import { useReducedMotion } from "framer-motion";

const Component = () => {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? {
        // Animações reduzidas
        animate: { opacity: 1 },
      }
    : {
        // Animações completas
        animate: { opacity: 1, y: 0, scale: 1 },
      };

  return <motion.div variants={variants} />;
};
```

### Configuração Global para Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Animations

```jsx
const focusVariants = {
  focus: {
    scale: 1.02,
    boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.5)",
    transition: { duration: 0.2 },
  },
};
```

## Debugging

### Motion DevTools

```jsx
// Durante desenvolvimento
import { motion } from "framer-motion";

<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 1 }}
  onAnimationStart={() => console.log("Animation started")}
  onAnimationComplete={() => console.log("Animation completed")}
/>;
```

### Performance Monitoring

```jsx
const AnimationMonitor = ({ children }) => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 16) {
          // Mais de 16ms
          console.warn("Slow animation detected:", entry);
        }
      });
    });

    observer.observe({ entryTypes: ["measure"] });

    return () => observer.disconnect();
  }, []);

  return children;
};
```

## Melhores Práticas

### Do's ✅

1. Use `transform` e `opacity` para animações performáticas
2. Implemente `useReducedMotion` para acessibilidade
3. Mantenha durações entre 200-500ms para UX ideal
4. Use `AnimatePresence` para animações de mount/unmount
5. Otimize com `will-change` quando necessário

### Don'ts ❌

1. Não anime `width`, `height`, `top`, `left`
2. Não exagere na duração (>500ms fica lento)
3. Não ignore preferências de movimento reduzido
4. Não anime muitos elementos simultaneamente
5. Não use easing muito complexo

### Checklist

- [ ] Animações rodam a 60fps
- [ ] `useReducedMotion` implementado
- [ ] Durações apropriadas (200-500ms)
- [ ] GPU acceleration quando necessário
- [ ] Fallbacks para navegadores antigos
- [ ] Performance testada em mobile

---

_Documentação atualizada em: [Data atual]_
_Versão: 2.0_
_Dependências: Framer Motion 10+, React 18+_

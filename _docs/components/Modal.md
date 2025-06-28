# 🎭 Modal Component - Documentação

## 📋 Visão Geral

O sistema de modals do Led Panel Manager combina glassmorphism no backdrop com containers sólidos para máximo contraste e legibilidade. Utiliza Framer Motion para animações suaves e responsividade completa.

## 🎨 Estrutura Principal

### Modal Container

```jsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop com glassmorphism */}
      <motion.div className="backdrop">
        {/* Modal Content */}
        <motion.div className="modal-container">
          {/* Header */}
          <div className="modal-header">

          {/* Content */}
          <div className="modal-content">

          {/* Footer */}
          <div className="modal-footer">
        </motion.div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

## 🌟 Backdrop (Fundo)

### Glassmorphism Backdrop

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={onClose}
  className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
  style={{
    backdropFilter: 'blur(12px)',
    background: 'rgba(0, 0, 0, 0.4)'
  }}
>
```

**Características**:

- **Background**: `rgba(0, 0, 0, 0.4)` - Transparência 40%
- **Blur**: `backdrop-filter: blur(12px)` - Desfoque forte
- **Z-index**: 50 - Acima de outros elementos
- **Click to close**: `onClick={onClose}`

### CSS do Backdrop

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
```

## 📦 Modal Container

### Container Principal

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.9, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 20 }}
  onClick={(e) => e.stopPropagation()}
  className="modal-container max-w-sm w-full max-h-[80vh] overflow-y-auto"
  style={{
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    maxWidth: '360px'
  }}
>
```

### CSS do Container

```css
.modal-container {
  background-color: #1f2937 !important; /* gray-800 */
  border: 1px solid #374151 !important; /* gray-700 */
  border-radius: 12px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
  max-width: 360px; /* 30% menor que o padrão */
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}
```

## 🎯 Tamanhos de Modal

### Small (360px) - Padrão atual

```jsx
className="modal-container max-w-sm"
style={{ maxWidth: '360px' }}
```

**Uso**: Detalhes, confirmações, formulários simples

### Medium (512px)

```jsx
className = "modal-container max-w-lg";
```

**Uso**: Formulários complexos, listas

### Large (768px)

```jsx
className = "modal-container max-w-2xl";
```

**Uso**: Relatórios, tabelas, conteúdo extenso

## 🗂️ Seções do Modal

### 1. Header

```jsx
<div
  className="modal-header sticky top-0 p-4 flex items-center justify-between rounded-t-xl"
  style={{
    backgroundColor: "#111827",
    borderBottomColor: "#374151",
  }}
>
  <div className="flex items-center gap-3">
    <Eye className="text-green-400 w-5 h-5" />
    <h2 className="text-lg font-bold text-white">Título do Modal</h2>
  </div>

  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClose}
    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
  >
    <X className="w-5 h-5 text-gray-400 hover:text-white" />
  </motion.button>
</div>
```

**CSS do Header**:

```css
.modal-header {
  background-color: #111827 !important; /* gray-900 */
  border-bottom: 1px solid #374151 !important;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px 12px 0 0;
  position: sticky;
  top: 0;
}
```

### 2. Content

```jsx
<div
  className="modal-content p-4 space-y-4"
  style={{
    backgroundColor: "#1f2937",
  }}
>
  {/* Conteúdo do modal */}
</div>
```

**CSS do Content**:

```css
.modal-content {
  background-color: #1f2937 !important;
  padding: 1rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
}
```

### 3. Seções Internas

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="bg-gray-700 border border-gray-600 rounded-xl p-4 shadow-lg"
  style={{
    backgroundColor: "#374151",
    borderColor: "#4b5563",
  }}
>
  <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2 text-sm">
    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
    Título da Seção
  </h4>

  {/* Conteúdo da seção */}
</motion.div>
```

**CSS das Seções**:

```css
.modal-section {
  background-color: #374151 !important; /* gray-700 */
  border: 1px solid #4b5563 !important; /* gray-600 */
  border-radius: 12px !important;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## 🎨 Animações

### Entrada do Modal

```jsx
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};
```

### Animação do Backdrop

```jsx
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};
```

### Animação das Seções

```jsx
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay * 0.1,
      duration: 0.3
    }
  })
};

// Uso
<motion.div
  custom={1}
  variants={sectionVariants}
  initial="hidden"
  animate="visible"
>
```

## 🔲 Modal de Detalhes (Específico)

### Implementação Completa

```jsx
export default function GabineteDetalhesModal({
  isOpen,
  onClose,
  gabinete,
  onEdit,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop com glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Modal Content - Tamanho reduzido */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-container max-w-sm w-full max-h-[80vh] overflow-y-auto"
              style={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                maxWidth: "360px",
              }}
            >
              {/* Header */}
              <div className="modal-header">{/* Título e botão fechar */}</div>

              {/* Content */}
              <div className="modal-content">{/* Seções de informação */}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## 📱 Responsividade

### Mobile (< 640px)

```css
@media (max-width: 640px) {
  .modal-container {
    max-width: 95vw;
    max-height: 90vh;
    margin: 0.5rem;
  }

  .modal-header {
    padding: 0.75rem;
  }

  .modal-content {
    padding: 0.75rem;
  }
}
```

### Tablet (640px - 1024px)

```css
@media (min-width: 640px) and (max-width: 1024px) {
  .modal-container {
    max-width: 400px;
  }
}
```

### Desktop (> 1024px)

```css
@media (min-width: 1024px) {
  .modal-container {
    max-width: 360px; /* Compacto para desktop */
  }
}
```

## ♿ Acessibilidade

### Estrutura Semântica

```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Título do Modal</h2>
  <div id="modal-description">Descrição do conteúdo</div>
</div>
```

### Navegação por Teclado

```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener("keydown", handleKeyDown);
    // Trap focus dentro do modal
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "unset";
  };
}, [isOpen, onClose]);
```

### Focus Management

```jsx
const modalRef = useRef(null);
const firstFocusableRef = useRef(null);

useEffect(() => {
  if (isOpen && firstFocusableRef.current) {
    firstFocusableRef.current.focus();
  }
}, [isOpen]);
```

## 🎭 Variantes de Modal

### 1. Modal de Confirmação

- **Tamanho**: Small (360px)
- **Foco**: Ação destrutiva
- **Cores**: Vermelho para perigo

### 2. Modal de Detalhes

- **Tamanho**: Small/Medium
- **Foco**: Visualização de dados
- **Cores**: Azul/Verde/Roxo por seção

### 3. Modal de Formulário

- **Tamanho**: Medium/Large
- **Foco**: Input de dados
- **Cores**: Azul primário

## 🔧 Implementação no Projeto

### Localização

- **Detalhes**: `/src/components/gabinetes/GabineteDetalhesModal.jsx`
- **Delete**: `/src/components/gabinetes/DeleteConfirmModal.jsx`
- **Formulário**: `/src/components/gabinetes/GabinetesModal.jsx`
- **CSS**: `/src/index.css` (linhas 840-870)

### Estado Global

```jsx
// Em Gabinetes.jsx
const [showDetalhesModal, setShowDetalhesModal] = useState(false);
const [gabineteDetalhes, setGabineteDetalhes] = useState(null);

const abrirDetalhes = (index) => {
  setGabineteDetalhes(gabinetes[index]);
  setShowDetalhesModal(true);
};
```

---

**Criado em**: 28 de Junho de 2025
**Última atualização**: 28 de Junho de 2025
**Status**: ✅ Implementado e testado

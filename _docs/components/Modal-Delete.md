# 🗑️ Delete Confirmation Modal - Documentação

## 📋 Visão Geral

O Modal de Confirmação de Exclusão é um componente crítico de UX que implementa boas práticas de segurança para ações destrutivas. Utiliza cores vermelhas para alertar sobre a natureza irreversível da ação.

## 🎨 Design System

### Paleta de Cores

```css
/* Cores principais do modal de delete */
--delete-background: #7f1d1d; /* bg-red-900 */
--delete-header: #991b1b; /* bg-red-800 */
--delete-border: #dc2626; /* border-red-600 */
--delete-text: #fecaca; /* text-red-200 */
--delete-accent: #ef4444; /* text-red-500 */
```

### Estrutura Visual

```
┌─────────────────────────────────┐
│ Header (Vermelho Escuro)        │ ← #991b1b
├─────────────────────────────────┤
│                                 │
│ Ícone de Alerta                 │ ← Vermelho/Amarelo
│                                 │
│ Título de Confirmação           │ ← Texto claro
│                                 │
│ Descrição da Ação               │ ← Texto secundário
│                                 │
│ Nome do Item                    │ ← Destacado
│                                 │
├─────────────────────────────────┤
│ [Cancelar] [Confirmar Exclusão] │ ← Botões de ação
└─────────────────────────────────┘
```

## 🔴 Implementação Completa

### Container Principal

```jsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop vermelho */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-red-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-red-900 border border-red-600 rounded-xl max-w-md w-full mx-4 shadow-2xl"
        >
```

### CSS do Modal Delete

```css
.delete-modal-container {
  background-color: #7f1d1d !important; /* bg-red-900 */
  border: 2px solid #dc2626 !important; /* border-red-600 */
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(127, 29, 29, 0.4);
  max-width: 28rem; /* max-w-md */
  width: 100%;
}

.delete-modal-backdrop {
  background: rgba(127, 29, 29, 0.8) !important; /* bg-red-900/80 */
  backdrop-filter: blur(4px);
}
```

## 🎯 Header Section

### Header Vermelho

```jsx
<div className="bg-red-800 p-6 rounded-t-xl border-b border-red-600">
  <div className="flex items-center gap-3">
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
    >
      <AlertTriangle className="w-6 h-6 text-yellow-400" />
    </motion.div>
    <h3 className="text-lg font-bold text-white">Confirmar Exclusão</h3>
  </div>
</div>
```

### CSS do Header

```css
.delete-modal-header {
  background-color: #991b1b !important; /* bg-red-800 */
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #dc2626; /* border-red-600 */
}
```

## ⚠️ Content Section

### Conteúdo de Alerta

```jsx
<div className="p-6 text-center">
  {/* Ícone Principal */}
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
    className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
  >
    <Trash2 className="w-8 h-8 text-red-400" />
  </motion.div>

  {/* Título */}
  <motion.h4
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="text-xl font-semibold text-white mb-2"
  >
    Tem certeza?
  </motion.h4>

  {/* Descrição */}
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="text-red-200 mb-4"
  >
    Esta ação não pode ser desfeita. O gabinete será removido permanentemente.
  </motion.p>

  {/* Nome do Item */}
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.6 }}
    className="bg-red-800/50 border border-red-600/50 rounded-lg p-3 mb-6"
  >
    <p className="text-sm text-red-300 mb-1">Gabinete a ser excluído:</p>
    <p className="font-semibold text-white text-lg">{gabineteNome}</p>
  </motion.div>
</div>
```

### CSS do Content

```css
.delete-modal-content {
  padding: 1.5rem;
  text-align: center;
}

.delete-item-highlight {
  background-color: rgba(153, 27, 27, 0.5); /* bg-red-800/50 */
  border: 1px solid rgba(220, 38, 38, 0.5); /* border-red-600/50 */
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
}
```

## 🔘 Footer Buttons

### Botões de Ação

```jsx
<div className="px-6 pb-6 flex gap-3">
  {/* Botão Cancelar */}
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClose}
    disabled={loading}
    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
  >
    Cancelar
  </motion.button>

  {/* Botão Confirmar */}
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onConfirm}
    disabled={loading}
    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-4 h-4" />
        </motion.div>
        Excluindo...
      </>
    ) : (
      <>
        <Trash2 className="w-4 h-4" />
        Confirmar Exclusão
      </>
    )}
  </motion.button>
</div>
```

### CSS dos Botões

```css
.delete-button-cancel {
  background-color: #4b5563; /* bg-gray-600 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  flex: 1;
}

.delete-button-cancel:hover {
  background-color: #6b7280; /* bg-gray-500 */
}

.delete-button-confirm {
  background-color: #dc2626; /* bg-red-600 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.delete-button-confirm:hover {
  background-color: #b91c1c; /* bg-red-700 */
}

.delete-button-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 🎭 Estados do Modal

### Estado Normal

```jsx
<DeleteConfirmModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
  gabineteNome="P10 Indoor"
  loading={false}
/>
```

### Estado Loading

```jsx
<DeleteConfirmModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
  gabineteNome="P10 Indoor"
  loading={true} // Botão mostra "Excluindo..." com spinner
/>
```

### Estado de Erro

```jsx
// Implementar feedback de erro se necessário
const [error, setError] = useState(null);

if (error) {
  return (
    <div className="text-red-300 text-sm mt-2 text-center">
      Erro ao excluir: {error}
    </div>
  );
}
```

## 🎨 Animações Específicas

### Sequência de Entrada

```jsx
const deleteModalVariants = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  container: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  },
};
```

### Micro-animações

```jsx
// Ícone de alerta
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
>
  <AlertTriangle className="w-6 h-6 text-yellow-400" />
</motion.div>

// Ícone principal
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
  className="icon-container"
>
  <Trash2 className="w-8 h-8 text-red-400" />
</motion.div>

// Texto escalonado
<motion.h4
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
>
  Tem certeza?
</motion.h4>
```

## ♿ Acessibilidade

### Estrutura Semântica

```jsx
<div
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="delete-title"
  aria-describedby="delete-description"
>
  <h3 id="delete-title">Confirmar Exclusão</h3>
  <p id="delete-description">
    Esta ação não pode ser desfeita. O gabinete será removido permanentemente.
  </p>
</div>
```

### Navegação por Teclado

```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !loading) {
      onClose();
    }
    if (e.key === "Enter" && !loading) {
      onConfirm();
    }
  };

  if (isOpen) {
    document.addEventListener("keydown", handleKeyDown);
  }

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [isOpen, loading, onClose, onConfirm]);
```

### Focus Management

```jsx
const confirmButtonRef = useRef(null);

useEffect(() => {
  if (isOpen && confirmButtonRef.current) {
    // Focus no botão de confirmação por ser a ação principal
    confirmButtonRef.current.focus();
  }
}, [isOpen]);
```

## 🔧 Implementação no Projeto

### Localização

- **Componente**: `/src/components/gabinetes/DeleteConfirmModal.jsx`
- **Uso**: `/src/Gabinetes.jsx` (linhas 240-250)
- **CSS**: `/src/index.css` (classes customizadas)

### Estado no Componente Pai

```jsx
// Estados necessários
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [gabineteParaDeletar, setGabineteParaDeletar] = useState(null);
const [deletandoGabinete, setDeletandoGabinete] = useState(false);

// Função para abrir modal
const removerGabinete = (index) => {
  setGabineteParaDeletar(index);
  setShowDeleteModal(true);
};

// Função de confirmação
const confirmarExclusao = async () => {
  setDeletandoGabinete(true);
  try {
    // Lógica de exclusão
    await deleteGabinete(gabineteParaDeletar);
    showFeedback("Gabinete removido com sucesso!");
  } catch (error) {
    showFeedback("Erro ao remover gabinete.", "error");
  } finally {
    setDeletandoGabinete(false);
    setShowDeleteModal(false);
    setGabineteParaDeletar(null);
  }
};
```

### Uso Completo

```jsx
<DeleteConfirmModal
  isOpen={showDeleteModal}
  onClose={() => {
    setShowDeleteModal(false);
    setGabineteParaDeletar(null);
  }}
  onConfirm={confirmarExclusao}
  gabineteNome={
    gabineteParaDeletar !== null
      ? gabinetes[gabineteParaDeletar]?.nome || "Gabinete"
      : ""
  }
  loading={deletandoGabinete}
/>
```

## 🎯 UX Best Practices

### 1. Destaque Visual

- **Cores vermelhas** para indicar perigo
- **Contraste alto** para legibilidade
- **Ícones claros** (Trash2, AlertTriangle)

### 2. Confirmação Clara

- **Pergunta direta**: "Tem certeza?"
- **Consequência explícita**: "não pode ser desfeita"
- **Nome do item** destacado

### 3. Proteção contra Cliques Acidentais

- **Backdrop não fecha** automaticamente
- **ESC key** para cancelar
- **Loading state** previne cliques múltiplos

### 4. Feedback Imediato

- **Estado loading** com spinner
- **Animações suaves** reduzem ansiedade
- **Mensagem de sucesso/erro** após ação

---

**Criado em**: 28 de Junho de 2025
**Última atualização**: 28 de Junho de 2025
**Status**: ✅ Implementado e testado

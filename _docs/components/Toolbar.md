# Toolbar Components - Documentação Detalhada

## Visão Geral

Componentes de toolbar e navegação com design moderno, filtros avançados e organização intuitiva. Implementam glassmorphism, responsividade total e UX otimizada para produtividade.

## Componente Principal - GabinetesToolbar

### Estrutura Base

```jsx
<div
  className="bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90 
                rounded-xl p-6 shadow-xl ring-1 ring-gray-600/50"
>
  <ToolbarHeader />
  <ToolbarFilters />
  <ToolbarActions />
</div>
```

## Especificações Visuais

### Container Principal

- **Fundo**: `bg-gray-900/95` (glassmorphism)
- **Borda**: `border-2 border-gray-500/90`
- **Blur**: `backdrop-blur-sm`
- **Shadow**: `shadow-xl`
- **Ring**: `ring-1 ring-gray-600/50`
- **Padding**: `p-6` (desktop), `p-4` (mobile)

### Layout Responsivo

```jsx
// Mobile-first approach
className = "flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6";
```

## Seções da Toolbar

### 1. Toolbar Header

```jsx
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div className="flex items-center gap-3">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="flex items-center justify-center w-10 h-10 
                 bg-blue-500/20 rounded-lg border border-blue-400/50"
    >
      <Package size={20} className="text-blue-400" />
    </motion.div>

    <div>
      <h2 className="text-xl font-bold text-gray-100">Gerenciar Gabinetes</h2>
      <p className="text-sm text-gray-400">
        {totalGabinetes} gabinetes cadastrados
      </p>
    </div>
  </div>

  <Button variant="primary" onClick={handleNovoGabinete}>
    <Plus size={16} />
    Novo Gabinete
  </Button>
</div>
```

### 2. Search Section

```jsx
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">
    <InputField
      icon={Search}
      placeholder="Buscar por nome, pitch, dimensões..."
      value={filtros.busca}
      onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
      className="bg-gray-800/90 border-gray-600/70 focus:border-blue-400"
    />
  </div>

  <div className="flex gap-2">
    <Button
      variant={filtros.mostrarFiltros ? "primary" : "secondary"}
      onClick={() =>
        setFiltros({ ...filtros, mostrarFiltros: !filtros.mostrarFiltros })
      }
    >
      <Filter size={16} />
      Filtros
    </Button>

    <Button variant="ghost" onClick={limparFiltros}>
      <X size={16} />
      Limpar
    </Button>
  </div>
</div>
```

### 3. Filters Panel (Collapsible)

```jsx
<AnimatePresence>
  {filtros.mostrarFiltros && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border-t-2 border-gray-600/60 pt-6 mt-6 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de Uso
          </label>
          <Select
            value={filtros.tipo}
            onChange={(value) => setFiltros({ ...filtros, tipo: value })}
            options={tipoOptions}
            placeholder="Todos os tipos"
          />
        </div>

        {/* Filtro por Pitch */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Range de Pitch
          </label>
          <Select
            value={filtros.pitch}
            onChange={(value) => setFiltros({ ...filtros, pitch: value })}
            options={pitchOptions}
            placeholder="Qualquer pitch"
          />
        </div>

        {/* Filtro por Dimensões */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tamanho
          </label>
          <Select
            value={filtros.tamanho}
            onChange={(value) => setFiltros({ ...filtros, tamanho: value })}
            options={tamanhoOptions}
            placeholder="Qualquer tamanho"
          />
        </div>

        {/* Ordenação */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ordenar por
          </label>
          <Select
            value={filtros.ordenacao}
            onChange={(value) => setFiltros({ ...filtros, ordenacao: value })}
            options={ordenacaoOptions}
            placeholder="Nome A-Z"
          />
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### 4. Results Summary

```jsx
<div
  className="flex flex-col md:flex-row md:items-center md:justify-between 
                gap-4 pt-6 border-t-2 border-gray-600/60"
>
  <div className="flex items-center gap-4">
    <span className="text-sm text-gray-400">
      {gabinetesExibidos} de {totalGabinetes} gabinetes
    </span>

    {filtrosAtivos.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {filtrosAtivos.map((filtro, index) => (
          <Tag
            key={index}
            variant="filter"
            onRemove={() => removerFiltro(filtro)}
          >
            {filtro.label}: {filtro.value}
          </Tag>
        ))}
      </div>
    )}
  </div>

  <div className="flex items-center gap-2">
    <Button
      variant={visualizacao === "grid" ? "primary" : "ghost"}
      size="sm"
      onClick={() => setVisualizacao("grid")}
    >
      <Grid size={16} />
    </Button>

    <Button
      variant={visualizacao === "list" ? "primary" : "ghost"}
      size="sm"
      onClick={() => setVisualizacao("list")}
    >
      <List size={16} />
    </Button>
  </div>
</div>
```

## Componentes de Apoio

### FilterTag (Tags removíveis)

```jsx
export function FilterTag({ children, onRemove, variant = "default" }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs
        border transition-all duration-200 cursor-default
        ${
          variant === "filter"
            ? "bg-blue-500/20 border-blue-400/50 text-blue-200"
            : "bg-gray-500/20 border-gray-400/50 text-gray-200"
        }
      `}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5
                     transition-colors duration-200"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );
}
```

### QuickActions (Ações rápidas)

```jsx
export function QuickActions({
  onExport,
  onImport,
  onBulkDelete,
  selectedCount,
}) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={onExport}>
        <Download size={16} />
        Exportar
      </Button>

      <Button variant="ghost" size="sm" onClick={onImport}>
        <Upload size={16} />
        Importar
      </Button>

      {selectedCount > 0 && (
        <Button variant="destructive" size="sm" onClick={onBulkDelete}>
          <Trash2 size={16} />
          Excluir ({selectedCount})
        </Button>
      )}
    </div>
  );
}
```

## Estados e Variações

### Estado Loading

```jsx
<div
  className="bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90 
                rounded-xl p-6 shadow-xl animate-pulse"
>
  <div className="flex justify-between items-center mb-6">
    <div className="h-6 bg-gray-700 rounded w-1/3"></div>
    <div className="h-10 bg-gray-700 rounded w-32"></div>
  </div>
  <div className="h-12 bg-gray-700 rounded mb-4"></div>
</div>
```

### Estado Empty (Sem dados)

```jsx
<div
  className="bg-gray-900/95 backdrop-blur-sm border-2 border-gray-500/90 
                rounded-xl p-6 shadow-xl"
>
  <div className="text-center py-12">
    <Package size={48} className="text-gray-500 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-300 mb-2">
      Nenhum gabinete encontrado
    </h3>
    <p className="text-gray-500 mb-6">Comece criando seu primeiro gabinete</p>
    <Button variant="primary" onClick={handleNovoGabinete}>
      <Plus size={16} />
      Criar Gabinete
    </Button>
  </div>
</div>
```

### Estado Error

```jsx
<div className="bg-red-900/20 border-2 border-red-400/50 rounded-xl p-6">
  <div className="flex items-center gap-3 text-red-200">
    <AlertCircle size={20} />
    <span>Erro ao carregar gabinetes</span>
    <Button variant="ghost" size="sm" onClick={recarregar}>
      <RefreshCw size={16} />
      Tentar novamente
    </Button>
  </div>
</div>
```

## Responsividade Avançada

### Breakpoints Específicos

```jsx
// Mobile (< 640px)
className = "flex-col space-y-4 p-4";

// Tablet (640px - 768px)
className = "md:flex-row md:space-y-0 md:space-x-4 md:p-5";

// Desktop (768px+)
className = "lg:space-x-6 lg:p-6";

// Large Desktop (1024px+)
className = "xl:grid-cols-5 xl:gap-6";
```

### Layout Adaptativo

```jsx
// Filters: Stack on mobile, grid on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// Actions: Full width on mobile, auto on desktop
<div className="w-full md:w-auto flex gap-2">

// Search: Full width sempre, mas com flex diferente
<div className="flex-1 min-w-0"> {/* min-w-0 previne overflow */}
```

## Acessibilidade

### Implementação Completa

```jsx
<div role="toolbar" aria-label="Ferramentas de gerenciamento de gabinetes">
  <div role="search" aria-label="Buscar gabinetes">
    <InputField
      aria-label="Campo de busca"
      aria-describedby="search-help"
      placeholder="Buscar gabinetes..."
    />
    <div id="search-help" className="sr-only">
      Digite para buscar por nome, pitch ou dimensões
    </div>
  </div>

  <div role="group" aria-label="Filtros">
    <Button
      aria-expanded={filtros.mostrarFiltros}
      aria-controls="filters-panel"
    >
      Filtros
    </Button>

    <div id="filters-panel" aria-hidden={!filtros.mostrarFiltros}>
      {/* Filtros */}
    </div>
  </div>
</div>
```

### Navegação por Teclado

- **Tab/Shift+Tab**: Navegação entre elementos
- **Enter/Space**: Ativar botões e selects
- **Escape**: Fechar painéis/dropdowns
- **Arrow keys**: Navegação em selects abertos

## Patterns de UX

### Debounced Search

```jsx
const [searchTerm, setSearchTerm] = useState("");
const [debouncedSearch] = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

### Persistent Filters

```jsx
// Salvar filtros no localStorage
useEffect(() => {
  localStorage.setItem("gabinetes-filtros", JSON.stringify(filtros));
}, [filtros]);

// Restaurar na inicialização
useEffect(() => {
  const savedFilters = localStorage.getItem("gabinetes-filtros");
  if (savedFilters) {
    setFiltros(JSON.parse(savedFilters));
  }
}, []);
```

### Smart Defaults

```jsx
const defaultFiltros = {
  busca: "",
  tipo: "todos",
  pitch: "todos",
  tamanho: "todos",
  ordenacao: "nome-asc",
  mostrarFiltros: false,
};
```

## Integrações

### Com Estado Global (Context/Redux)

```jsx
const { filtros, setFiltros, gabinetes, loading } = useGabinetes();

<GabinetesToolbar
  filtros={filtros}
  onFiltrosChange={setFiltros}
  totalGabinetes={gabinetes.length}
  loading={loading}
/>;
```

### Com URL/Router (Deep linking)

```jsx
const [searchParams, setSearchParams] = useSearchParams();

// Sincronizar filtros com URL
useEffect(() => {
  const params = Object.fromEntries(searchParams);
  setFiltros((prev) => ({ ...prev, ...params }));
}, [searchParams]);

// Atualizar URL quando filtros mudam
useEffect(() => {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([key, value]) => {
    if (value && value !== "todos") {
      params.set(key, value);
    }
  });
  setSearchParams(params);
}, [filtros]);
```

## Performance

### Otimizações

```jsx
// Memoizar callbacks pesados
const handleSearch = useCallback(
  debounce((term) => {
    // Lógica de busca
  }, 300),
  []
);

// Lazy loading de filtros
const FilterPanel = lazy(() => import("./FilterPanel"));

// Virtualização para muitos resultados
import { FixedSizeList as List } from "react-window";
```

## Customização

### Themes Support

```jsx
const toolbarThemes = {
  default: {
    container: "bg-gray-900/95 border-gray-500/90",
    text: "text-gray-100",
    accent: "text-blue-400",
  },
  dark: {
    container: "bg-black/95 border-gray-700/90",
    text: "text-gray-200",
    accent: "text-purple-400",
  },
};
```

### Configuração Flexível

```jsx
<GabinetesToolbar
  enableFilters={true}
  enableSearch={true}
  enableExport={true}
  enableBulkActions={true}
  defaultView="grid"
  filterOptions={customFilterOptions}
  theme="default"
/>
```

## Troubleshooting

### Problemas Comuns

1. **Filtros não persistem**: Verificar localStorage/URL sync
2. **Search muito lento**: Implementar debounce adequado
3. **Layout quebra no mobile**: Verificar classes responsivas
4. **Animações travadas**: Verificar AnimatePresence usage

### Debug Tools

```jsx
// Component debug
{
  process.env.NODE_ENV === "development" && (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded">
      <pre>{JSON.stringify(filtros, null, 2)}</pre>
    </div>
  );
}
```

---

_Documentação atualizada em: [Data atual]_
_Versão do componente: 2.0_
_Compatibilidade: React 18+, Framer Motion 10+, Tailwind CSS 3+_

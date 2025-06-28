# Input Components - Documentação Detalhada

## Visão Geral

Componentes de entrada de dados com design moderno, contraste otimizado e experiência de usuário fluida. Seguem o padrão de glassmorphism e responsividade do design system.

## Componente Principal

### InputField

```jsx
<InputField
  label="Nome do Gabinete"
  value={value}
  onChange={handleChange}
  type="text"
  placeholder="Digite o nome..."
  icon={Search}
  unit="mm"
  error="Campo obrigatório"
  tooltip="Nome identificador único"
  className="custom-class"
/>
```

## Especificações Visuais

### Cores e Contraste

- **Fundo input**: `bg-gray-800/90` (fundo escuro translúcido)
- **Borda normal**: `border-gray-600/70` (cinza médio)
- **Borda focus**: `border-blue-400` (azul destaque)
- **Borda error**: `border-red-400` (vermelho erro)
- **Texto input**: `text-gray-100` (branco principal)
- **Placeholder**: `text-gray-400` (cinza claro)
- **Label**: `text-gray-300` (cinza texto)

### Estados Visuais

```css
/* Estado Normal */
bg-gray-800/90 border-gray-600/70 text-gray-100

/* Estado Focus */
border-blue-400 ring-2 ring-blue-400/30 bg-gray-700/90

/* Estado Error */
border-red-400 ring-2 ring-red-400/30

/* Estado Disabled */
bg-gray-900/50 text-gray-500 cursor-not-allowed
```

### Efeitos e Animações

```jsx
// Container Animation
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}

// Focus Transitions
transition: all 0.2s ease-in-out

// Glassmorphism
backdrop-blur-sm
```

## Variantes de Input

### Input Básico

```jsx
<InputField
  label="Campo Básico"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Digite aqui..."
/>
```

### Input com Ícone

```jsx
<InputField
  label="Buscar"
  value={searchTerm}
  onChange={handleSearch}
  icon={Search}
  placeholder="Buscar gabinetes..."
/>
```

### Input Numérico com Unidade

```jsx
<InputField
  label="Largura"
  type="number"
  value={largura}
  onChange={handleLargura}
  unit="mm"
  placeholder="0"
/>
```

### Input com Tooltip

```jsx
<InputField
  label="Pitch"
  value={pitch}
  onChange={handlePitch}
  tooltip="Distância entre o centro de cada pixel em milímetros"
  unit="mm"
/>
```

### Input com Validação

```jsx
<InputField
  label="Nome"
  value={nome}
  onChange={handleNome}
  error={nomeError}
  required
/>
```

## Estrutura do Componente

### Label Section

```jsx
{
  label && (
    <label className="block text-sm font-medium text-gray-300">
      {label}
      {tooltip && (
        <span className="ml-1 text-gray-500 cursor-help" title={tooltip}>
          ℹ️
        </span>
      )}
    </label>
  );
}
```

### Input Container

```jsx
<div className="relative">
  {Icon && (
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <Icon size={16} />
    </div>
  )}

  <input
    className={`
      w-full px-4 py-3 rounded-lg border-2 
      bg-gray-800/90 text-gray-100 placeholder-gray-400
      transition-all duration-200 backdrop-blur-sm
      focus:outline-none focus:border-blue-400 focus:ring-2 
      focus:ring-blue-400/30 focus:bg-gray-700/90
      ${Icon ? "pl-10" : ""}
      ${unit ? "pr-12" : ""}
      ${error ? "border-red-400 ring-2 ring-red-400/30" : "border-gray-600/70"}
    `}
  />

  {unit && (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
      {unit}
    </div>
  )}
</div>
```

### Error Display

```jsx
{
  error && (
    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
      <AlertCircle size={14} />
      {error}
    </p>
  );
}
```

## Tipos Especializados

### SearchInput (para filtros)

```jsx
<InputField
  icon={Search}
  placeholder="Buscar gabinetes..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="bg-gray-900/95 border-gray-500/90"
/>
```

### NumberInput (para medidas)

```jsx
<InputField
  type="number"
  label="Largura"
  value={largura}
  onChange={handleLargura}
  unit="mm"
  min="0"
  step="0.1"
/>
```

### TextArea (para descrições)

```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-300">Descrição</label>
  <textarea
    className="w-full px-4 py-3 rounded-lg border-2 bg-gray-800/90 
               text-gray-100 placeholder-gray-400 border-gray-600/70
               focus:outline-none focus:border-blue-400 focus:ring-2 
               focus:ring-blue-400/30 transition-all duration-200
               backdrop-blur-sm resize-none"
    rows="4"
    placeholder="Digite a descrição..."
  />
</div>
```

## Responsividade

### Mobile (sm)

```jsx
className = "text-sm px-3 py-2";
```

### Tablet (md)

```jsx
className = "text-base px-4 py-3";
```

### Desktop (lg+)

```jsx
className = "text-base px-4 py-3 focus:scale-[1.01]";
```

## Validação e Estados

### Estado Loading

```jsx
<InputField
  label="Carregando..."
  disabled
  value=""
  placeholder="Carregando dados..."
  className="animate-pulse"
/>
```

### Estado Success

```jsx
<InputField
  label="Nome"
  value={nome}
  onChange={handleNome}
  className="border-green-400 ring-2 ring-green-400/30"
/>
```

### Estado Error com Mensagem

```jsx
<InputField
  label="Email"
  type="email"
  value={email}
  onChange={handleEmail}
  error="Email inválido"
  className="border-red-400"
/>
```

## Acessibilidade

### Implementação Completa

```jsx
<InputField
  id="gabinete-nome"
  label="Nome do Gabinete"
  value={nome}
  onChange={handleNome}
  aria-describedby={error ? "nome-error" : undefined}
  aria-invalid={!!error}
  required
  error={error}
/>;

{
  error && (
    <p id="nome-error" role="alert" className="text-red-400 text-sm mt-1">
      {error}
    </p>
  );
}
```

### Navegação por Teclado

- Tab para navegar entre campos
- Enter para submit (em forms)
- Escape para cancelar/limpar

## Patterns de UX

### Debounced Search

```jsx
const [searchTerm, setSearchTerm] = useState("");
const [debouncedTerm] = useDebounce(searchTerm, 300);

<InputField
  icon={Search}
  placeholder="Buscar..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>;
```

### Auto-complete/Suggestions

```jsx
<div className="relative">
  <InputField
    value={query}
    onChange={handleQuery}
    onFocus={() => setShowSuggestions(true)}
  />

  {showSuggestions && suggestions.length > 0 && (
    <div
      className="absolute top-full left-0 right-0 mt-1 
                    bg-gray-800/95 border border-gray-600/70 
                    rounded-lg shadow-xl backdrop-blur-sm z-50"
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-gray-700/90 cursor-pointer
                       text-gray-200 border-b border-gray-600/50 last:border-b-0"
          onClick={() => selectSuggestion(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  )}
</div>
```

## Integração com Forms

### React Hook Form

```jsx
import { useForm } from "react-hook-form";

const {
  register,
  formState: { errors },
} = useForm();

<InputField
  label="Nome"
  {...register("nome", { required: "Nome é obrigatório" })}
  error={errors.nome?.message}
/>;
```

### Formik Integration

```jsx
<Field name="nome">
  {({ field, meta }) => (
    <InputField
      label="Nome"
      {...field}
      error={meta.touched && meta.error ? meta.error : ""}
    />
  )}
</Field>
```

## Customização Avançada

### Tema Personalizado

```jsx
const customTheme = {
  normal: "bg-purple-900/90 border-purple-600/70",
  focus: "border-purple-400 ring-purple-400/30",
  error: "border-red-400 ring-red-400/30",
};

<InputField
  className={customTheme.normal}
  // ... outros props
/>;
```

### Input com Máscara

```jsx
import { IMaskInput } from "react-imask";

<IMaskInput
  mask="000.000.000-00"
  className="w-full px-4 py-3 rounded-lg border-2 bg-gray-800/90..."
  placeholder="000.000.000-00"
/>;
```

## Performance

### Otimizações

1. Use `useMemo` para computações pesadas de validação
2. Implemente debounce para searches em tempo real
3. Use `React.memo` para inputs que não mudam frequentemente

```jsx
const OptimizedInput = React.memo(({ value, onChange, ...props }) => {
  return <InputField value={value} onChange={onChange} {...props} />;
});
```

## Troubleshooting

### Problemas Comuns

1. **Placeholder não visível**: Verificar contraste com `text-gray-400`
2. **Focus não funciona**: Verificar se `focus:` classes estão aplicadas
3. **Icon desalinhado**: Verificar padding left quando icon presente
4. **Border não aparece**: Verificar se `border-2` está definido

### Debug Styles

```css
.debug-input {
  outline: 2px solid lime !important;
}
.debug-input:focus {
  outline: 2px solid orange !important;
}
```

---

_Documentação atualizada em: [Data atual]_
_Versão do componente: 2.0_
_Compatibilidade: React 18+, Framer Motion 10+, Tailwind CSS 3+_

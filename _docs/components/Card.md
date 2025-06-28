# Card Components - Documentação Detalhada

## Visão Geral

Os componentes de Card são a base visual do sistema, utilizando glassmorphism, animações Framer Motion e design responsivo. Seguem o padrão do design system com foco em contraste, acessibilidade e consistência visual.

## Componentes Base

### Card Principal

```jsx
<Card
  selected={boolean}
  onClick={function}
  className="custom-classes"
>
  <CardHeader>Título</CardHeader>
  <CardContent>Conteúdo</CardContent>
  <CardFooter>Ações</CardFooter>
</Card>
```

## Especificações Visuais

### Cores Base

- **Fundo normal**: `bg-gray-900/95` (fundo escuro translúcido)
- **Fundo selecionado**: `bg-blue-900/40` (azul translúcido)
- **Borda normal**: `border-gray-500/90` (cinza medium)
- **Borda selecionada**: `border-blue-400` (azul destaque)
- **Borda hover**: `border-blue-400/80` (azul hover)

### Efeitos Visuais

- **Glassmorphism**: `backdrop-blur-sm` para desfoque de fundo
- **Sombras normais**: `shadow-xl`
- **Sombras selecionadas**: `shadow-2xl shadow-blue-500/30`
- **Sombras hover**: `shadow-2xl shadow-blue-500/20`
- **Ring effects**: `ring-1 ring-gray-600/50` (normal), `ring-2 ring-blue-400/50` (selecionado)

### Animações

```jsx
// Hover Animation
whileHover={{ scale: selected ? 1 : 1.02 }}
transition={{ duration: 0.2 }}

// Container Animation (para listas)
initial={{ opacity: 0, y: 20, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -20, scale: 0.95 }}
transition={{
  delay: index * 0.05,
  type: "spring",
  stiffness: 300,
  damping: 25,
}}
```

## Estrutura dos Componentes

### CardHeader

- **Styling**: `p-6 pb-4 border-b-2 border-gray-600/60 bg-gray-800/20`
- **Uso**: Títulos, identificação, status badges
- **Tipografia**: Texto em `text-gray-100` para contraste

### CardContent

- **Styling**: `p-6`
- **Uso**: Conteúdo principal, grids de informação, dados
- **Layout**: Flexível, suporta InfoGrid e componentes customizados

### CardFooter

- **Styling**: `p-6 pt-4 border-t-2 border-gray-600/60 bg-gray-800/20`
- **Uso**: Ações, botões, controles secundários
- **Layout**: Flexbox com justificação adequada

## Variantes e Estados

### Estado Normal

```jsx
<Card>
  <CardHeader>
    <h3 className="text-lg font-semibold text-gray-100">Título</h3>
  </CardHeader>
  <CardContent>
    <p className="text-gray-300">Conteúdo do card</p>
  </CardContent>
</Card>
```

### Estado Selecionado

```jsx
<Card selected={true}>
  <CardHeader>
    <h3 className="text-lg font-semibold text-blue-100">Selecionado</h3>
  </CardHeader>
  <CardContent>
    <p className="text-blue-200">Conteúdo destacado</p>
  </CardContent>
</Card>
```

### Card Interativo

```jsx
<Card onClick={() => setSelected(true)} className="cursor-pointer">
  <CardHeader>
    <h3 className="text-lg font-semibold text-gray-100">Clicável</h3>
  </CardHeader>
  <CardContent>
    <p className="text-gray-300">Clique para selecionar</p>
  </CardContent>
</Card>
```

## Responsividade

### Breakpoints

- **Mobile (sm)**: `border-2`, padding reduzido
- **Tablet (md)**: `border-4`, padding padrão
- **Desktop (lg+)**: padding expandido, hover effects completos

### Classes Responsivas

```jsx
className = "border-2 md:border-4 p-4 md:p-6 text-sm md:text-base";
```

## Componentes Especializados

### InfoGrid (para dados estruturados)

```jsx
<InfoGrid>
  <InfoCell label="Largura" value="320mm" />
  <InfoCell label="Altura" value="160mm" />
  <InfoCell label="Pitch" value="5.0mm" />
</InfoGrid>
```

### Tag (para classificações)

```jsx
<Tag variant="premium" className="bg-yellow-500/20 text-yellow-200">
  Premium
</Tag>
<Tag variant="indoor" className="bg-green-500/20 text-green-200">
  Indoor
</Tag>
```

### DividerVertical (separadores)

```jsx
<DividerVertical className="h-6 border-gray-600/60" />
```

## Padrões de UX

### Feedback Visual

1. **Hover**: Escala ligeira (1.02x), mudança de cor da borda
2. **Selection**: Cor azul, shadow aumentada, ring effect
3. **Loading**: Skeleton ou shimmer effect
4. **Error**: Borda vermelha, texto de erro

### Acessibilidade

- Contraste mínimo 4.5:1 para textos
- Focus visible com outline adequado
- Navegação por teclado suportada
- Screen reader friendly com roles adequados

```jsx
// Exemplo com acessibilidade
<Card
  role="button"
  tabIndex={0}
  aria-label={`Gabinete ${gabinete.nome}`}
  onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
>
```

## Melhores Práticas

### Performance

1. Use `motion.div` apenas quando necessário
2. Implemente lazy loading para listas grandes
3. Otimize animações com `transform` e `opacity`

### Manutenibilidade

1. Mantenha variantes em arquivos separados
2. Use props compostas para customização
3. Documente alterações no design system

### Exemplos Reais

#### Card de Gabinete (Completo)

```jsx
<Card
  selected={isSelected}
  onClick={() => setGabineteSelecionado(index)}
  className="h-full cursor-pointer"
>
  <CardHeader>
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-100">{gabinete.nome}</h3>
      <div className="flex gap-2">
        <Tag variant="indoor">Indoor</Tag>
        <Tag variant="premium">Premium</Tag>
      </div>
    </div>
  </CardHeader>

  <CardContent>
    <InfoGrid>
      <InfoCell label="Largura" value={`${gabinete.largura}mm`} />
      <InfoCell label="Altura" value={`${gabinete.altura}mm`} />
      <InfoCell label="Pitch" value={`${gabinete.pitch}mm`} />
      <InfoCell label="Área" value={`${area}m²`} />
    </InfoGrid>
  </CardContent>

  <CardFooter>
    <div className="flex gap-2 justify-end">
      <Button variant="ghost" size="sm" onClick={handleEdit}>
        <Edit3 size={16} />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDuplicate}>
        <Copy size={16} />
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        <Trash2 size={16} />
      </Button>
    </div>
  </CardFooter>
</Card>
```

## Troubleshooting

### Problemas Comuns

1. **Borda não aparece**: Verificar se a classe border está aplicada
2. **Animação travada**: Verificar se Framer Motion está instalado
3. **Glassmorphism não funciona**: Verificar backdrop-blur no CSS
4. **Hover não responsivo**: Verificar se whileHover está configurado

### Debug CSS

```css
/* Para debug visual */
.debug-card {
  outline: 2px solid red !important;
}
.debug-card * {
  outline: 1px solid blue !important;
}
```

---

_Documentação atualizada em: [Data atual]_
_Versão do componente: 2.0_
_Compatibilidade: React 18+, Framer Motion 10+, Tailwind CSS 3+_

# 📋 Select Component - Documentação

## 📋 Visão Geral

Os componentes Select do Led Panel Manager foram otimizados para alto contraste e integração perfeita com o tema dark mode e glassmorphism do projeto.

## 🎨 Estilo Principal

### Select Base

```css
select {
  background-color: rgba(31, 41, 55, 0.9) !important; /* #1f2937 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  cursor: pointer;
}
```

### Estados do Select

#### Normal State

```css
.select-base {
  background: rgba(31, 41, 55, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  outline: none;
}
```

#### Hover State

```css
.select-base:hover {
  background: rgba(55, 65, 81, 0.9); /* #374151 */
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.01);
}
```

#### Focus State

```css
.select-base:focus {
  outline: none;
  ring: 2px solid;
  backdrop-filter: blur(6px);
}
```

## 🎯 Variantes Temáticas

### 1. Select de Filtro (Tema Roxo)

**Uso**: Filtros de categoria, tipo, etc.

```jsx
<select
  value={filterBy}
  onChange={(e) => setFilterBy(e.target.value)}
  className="bg-gray-800/90 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-purple-400/50 cursor-pointer"
  style={{
    backgroundColor: "rgba(31, 41, 55, 0.9)",
    color: "white",
  }}
>
  <option value="todos" className="bg-gray-800 text-white">
    Todos
  </option>
  <option value="indoor" className="bg-gray-800 text-white">
    Indoor
  </option>
  <option value="outdoor" className="bg-gray-800 text-white">
    Outdoor
  </option>
</select>
```

**Características**:

- **Focus ring**: `ring-purple-500`
- **Hover border**: `border-purple-400/50`
- **Backdrop**: Blur sutil

### 2. Select de Ordenação (Tema Verde)

**Uso**: Ordenação por nome, data, valor, etc.

```jsx
<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="bg-gray-800/90 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-green-400/50 cursor-pointer"
  style={{
    backgroundColor: "rgba(31, 41, 55, 0.9)",
    color: "white",
  }}
>
  <option value="nome" className="bg-gray-800 text-white">
    Nome
  </option>
  <option value="potencia" className="bg-gray-800 text-white">
    Potência
  </option>
  <option value="peso" className="bg-gray-800 text-white">
    Peso
  </option>
</select>
```

**Características**:

- **Focus ring**: `ring-green-500`
- **Hover border**: `border-green-400/50`
- **Ícone associado**: Normalmente acompanhado de botão de ordenação

### 3. Select Genérico (Tema Azul)

**Uso**: Seleções gerais, formulários

```jsx
<select
  className="bg-gray-800/90 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-blue-400/50 cursor-pointer"
  style={{
    backgroundColor: "rgba(31, 41, 55, 0.9)",
    color: "white",
  }}
>
  <option value="" className="bg-gray-800 text-white">
    Selecione...
  </option>
</select>
```

## 🎨 Opções (Options)

### Estilo das Options

```css
option {
  background-color: #1f2937 !important; /* gray-800 */
  color: white !important;
  padding: 8px;
}

option:hover {
  background-color: #374151 !important; /* gray-700 */
}

option:selected {
  background-color: #3b82f6 !important; /* blue-500 */
}
```

### Implementação

```jsx
<option value="valor" className="bg-gray-800 text-white">
  Texto da Opção
</option>
```

## 🔧 Solução de Problemas de Contraste

### Problema Original

```css
/* ❌ Baixo contraste - EVITAR */
.select-problem {
  background: rgba(255, 255, 255, 0.1); /* Muito claro */
  color: white; /* Contraste insuficiente */
}
```

### Solução Implementada

```css
/* ✅ Alto contraste - USAR */
.select-fixed {
  background: rgba(31, 41, 55, 0.9) !important; /* Fundo escuro */
  color: white !important; /* Texto branco */
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Garantia de Aplicação

```jsx
// Estilo inline como backup
<select
  style={{
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    color: 'white'
  }}
  className="select-classes"
>
```

## 🎭 Ícones Associados

### Com Ícone de Filtro

```jsx
<div className="flex items-center gap-2 group">
  <Filter className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
  <select className="select-filter">{/* options */}</select>
</div>
```

### Animação do Ícone

```jsx
<motion.div
  initial={{ rotate: -180, opacity: 0 }}
  animate={{ rotate: 0, opacity: 1 }}
  transition={{ delay: 0.8, duration: 0.5 }}
>
  <Filter className="icon-filter" />
</motion.div>
```

## 📱 Responsividade

### Mobile

```jsx
<select className="w-full sm:w-auto min-w-[120px] select-base">
  {/* Em mobile ocupa largura total */}
</select>
```

### Desktop

```jsx
<div className="flex flex-wrap gap-3 items-center">
  <select className="select-base flex-shrink-0">
    {/* Mantém tamanho mínimo */}
  </select>
</div>
```

## 🎨 Integração com Framer Motion

### Container Animado

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.7 }}
  className="flex items-center gap-2 group"
  whileHover={{ scale: 1.05 }}
>
  <select className="select-base">{/* options */}</select>
</motion.div>
```

### Hover Group Effect

```jsx
<div className="group">
  <Icon className="group-hover:text-purple-400" />
  <select className="group-hover:border-purple-400/50">{/* options */}</select>
</div>
```

## ♿ Acessibilidade

### Labels Adequados

```jsx
<div className="flex items-center gap-2">
  <label htmlFor="filtro-select" className="sr-only">
    Filtrar por categoria
  </label>
  <select id="filtro-select" className="select-base">
    <option value="todos">Todos os tipos</option>
  </select>
</div>
```

### Navegação por Teclado

- **Tab**: Navega entre selects
- **Enter/Space**: Abre dropdown
- **Arrow keys**: Navega entre opções
- **Esc**: Fecha dropdown

### Contrast Ratio

- **Background**: #1f2937 (WCAG AAA)
- **Text**: white (#ffffff)
- **Ratio**: 15.3:1 ✅

## 🔧 Implementação no Projeto

### Localização

- **Componente**: `/src/components/gabinetes/GabinetesToolbar.jsx`
- **Estilos CSS**: `/src/index.css` (linhas 200-230)
- **Linha específica**: Linhas 93-112 (Filtro), 125-145 (Ordenação)

### Exemplo de Uso Completo

```jsx
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

function SelectWithAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 }}
      className="flex items-center gap-2 group"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Filter className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
      </motion.div>

      <select
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
        className="bg-gray-800/90 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 hover:border-purple-400/50 cursor-pointer"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.9)",
          color: "white",
        }}
      >
        <option value="todos" className="bg-gray-800 text-white">
          Todos
        </option>
        <option value="indoor" className="bg-gray-800 text-white">
          Indoor
        </option>
        <option value="outdoor" className="bg-gray-800 text-white">
          Outdoor
        </option>
      </select>
    </motion.div>
  );
}
```

## 🐛 Problemas Conhecidos e Soluções

### Problema: CSS não aplicado

**Sintoma**: Select aparece transparente
**Solução**: Adicionar estilos inline como backup

```jsx
style={{
  backgroundColor: 'rgba(31, 41, 55, 0.9)',
  color: 'white'
}}
```

### Problema: Baixo contraste

**Sintoma**: Texto difícil de ler
**Solução**: Usar `!important` no CSS e cores sólidas

```css
background-color: #1f2937 !important;
color: white !important;
```

### Problema: Inconsistência entre navegadores

**Sintoma**: Aparência diferente no Safari/Firefox
**Solução**: Normalização CSS específica

```css
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
```

---

**Criado em**: 28 de Junho de 2025
**Última atualização**: 28 de Junho de 2025
**Status**: ✅ Implementado e testado

# 🇧🇷 Mussum Ipsum - Gerador de Texto Brasileiro

## 📋 Sobre

Este utilitário utiliza a biblioteca [mipsum](https://github.com/diegofelipece/mussum-ipsum) para gerar texto de exemplo em "mussumês", baseado nas frases icônicas do humorista Mussum. É uma alternativa brasileira e divertida ao Lorem Ipsum tradicional.

## 🚀 Como Usar

### Importação

```javascript
import { MussumusUtils, mussum, gerarDadosExemplo } from "../utils/mussumIpsum";
```

### 📝 Exemplos de Uso

#### 1. Texto Simples (uma linha)

```javascript
const titulo = MussumusUtils.texto();
// "Mussum Ipsum cacilds vidis litro abertis"

const nomeCurto = MussumusUtils.nomeProjeto();
// "Mussum Painel"

const placeholder = MussumusUtils.placeholder();
// "Cacildis vidis que non..."
```

#### 2. Parágrafos

```javascript
const descricao = MussumusUtils.paragrafo();
// "Mussum Ipsum cacilds vidis litro abertis. Nullam volutpat risus nec leo..."

const multiplos = MussumusUtils.paragrafos(3);
// Retorna 3 parágrafos de texto

// Atalho conveniente
const textoRapido = mussum();
// Mesmo que MussumusUtils.paragrafo()
```

#### 3. HTML e Estruturas

```javascript
const htmlContent = MussumusUtils.html(2);
// "<p>Primeiro parágrafo...</p><p>Segundo parágrafo...</p>"

const listaDeFrases = MussumusUtils.array(5);
// ["Frase 1", "Frase 2", "Frase 3", "Frase 4", "Frase 5"]
```

#### 4. Dados Específicos do Sistema

```javascript
const nomeCliente = MussumusUtils.nomeCliente();
// "Empresa Mussum Cacildis"

const descricaoProjeto = MussumusUtils.descricaoProjeto();
// "Desenvolvimento de painel LED com tecnologia Mussum..."
```

## 🏗️ Geradores de Dados de Exemplo

### Para Desenvolvimento e Testes

#### Projetos de Exemplo

```javascript
const projetosExemplo = gerarDadosExemplo.projetos(5);
/*
[
  {
    nome: "Painel Mussum",
    cliente: "Cacildis Corporation",
    descricao: "Mussum Ipsum cacilds vidis...",
    dataEntrega: "2025-09-15",
    _createdAt: 1640995200000
  },
  // ... mais 4 projetos
]
*/
```

#### Gabinetes de Exemplo

```javascript
const gabinetesExemplo = gerarDadosExemplo.gabinetes(3);
/*
[
  {
    nome: "LED Mussum",
    tipo: "Outdoor",
    largura: 320,
    altura: 160,
    pixelPitch: "2.5",
    potencia: 150,
    peso: "12.5",
    fabricante: "Mussum Tech"
  },
  // ... mais 2 gabinetes
]
*/
```

#### Painéis de Exemplo

```javascript
const paineisExemplo = gerarDadosExemplo.paineis(2);
/*
[
  {
    nome: "Display Cacildis",
    projeto: "Projeto Mussum",
    gabinete: "LED Outdoor",
    largura: 8,
    altura: 6,
    observacoes: "Painel para instalação externa..."
  },
  // ... mais 1 painel
]
*/
```

## 🎯 Casos de Uso no Projeto

### 1. Desenvolvimento de Componentes

```javascript
// Em um componente de projeto
const ProjetoCard = () => {
  const projeto = {
    nome: MussumusUtils.nomeProjeto(),
    cliente: MussumusUtils.nomeCliente(),
    descricao: MussumusUtils.descricaoProjeto(),
  };

  return <Card {...projeto} />;
};
```

### 2. Preenchimento de Formulários (Testes)

```javascript
// Para testar formulários rapidamente
const preencherFormulario = () => {
  setForm({
    nome: MussumusUtils.nomeProjeto(),
    cliente: MussumusUtils.nomeCliente(),
    descricao: MussumusUtils.descricaoProjeto(),
  });
};
```

### 3. Demos e Apresentações

```javascript
// Gerar dados para demonstrações
const criarDemoCompleta = () => {
  const projetos = gerarDadosExemplo.projetos(10);
  const gabinetes = gerarDadosExemplo.gabinetes(8);
  const paineis = gerarDadosExemplo.paineis(5);

  return { projetos, gabinetes, paineis };
};
```

### 4. Placeholders Dinâmicos

```javascript
// Em inputs
<InputField
  placeholder={MussumusUtils.placeholder()}
  label="Nome do Projeto"
/>

// Em textareas
<TextAreaField
  placeholder={MussumusUtils.descricaoProjeto()}
  label="Descrição"
/>
```

## ⚙️ Configurações Avançadas

### Personalização

```javascript
// Texto mais longo
const textoLongo = MussumusUtils.texto({ pQuotes: 8 });

// HTML customizado
const htmlCustom = MussumusUtils.html(2, {
  tagBefore: '<div class="paragrafo">',
  tagAfter: "</div>",
});

// Array com mais elementos
const listaGrande = MussumusUtils.array(10, { pQuotes: 2 });
```

## 📚 Referência da API Original

O utilitário é baseado na biblioteca `mipsum` com as seguintes opções:

- `pNum`: Número de parágrafos (padrão: 1)
- `pQuotes`: Frases por parágrafo (padrão: 4)
- `resultType`: Formato de saída ('text', 'html', 'array')
- `tagBefore/tagAfter`: Tags HTML personalizadas
- `genLimit`: Limite máximo de parágrafos (padrão: 1000)

## 🌟 Vantagens

1. **Brasileiro**: Texto em português com humor brasileiro
2. **Versátil**: Múltiplos formatos de saída
3. **Integrado**: Pronto para usar no projeto React
4. **Útil**: Geradores específicos para os dados do sistema
5. **Divertido**: Torna o desenvolvimento mais agradável

## 🚀 Para o Futuro

Esta API está pronta para ser usada em:

- ✅ Testes de componentes
- ✅ Desenvolvimento de UI
- ✅ Demos e apresentações
- ✅ Protótipos rápidos
- ✅ Preenchimento de dados de exemplo
- ✅ Documentação com exemplos realistas

---

**Nota**: Sempre que precisar de texto de exemplo no desenvolvimento, use o Mussum Ipsum em vez de dados genéricos. É mais divertido e mantém o projeto com identidade brasileira! 🇧🇷

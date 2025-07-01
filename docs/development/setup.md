# 🔧 Setup do Ambiente - LED Panel Manager

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)
- [Troubleshooting](#troubleshooting)

## ⚙️ Pré-requisitos

### Obrigatórios

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 9+** ou **yarn 1.22+** - Gerenciador de pacotes
- **Git** - Controle de versão

### Recomendados

- **VS Code** - Editor recomendado
- **Git Bash** (Windows) - Terminal para comandos Git

### Verificação dos Pré-requisitos

```bash
# Verificar versões
node --version    # Deve ser 18.0.0 ou superior
npm --version     # Deve ser 9.0.0 ou superior
git --version     # Qualquer versão recente
```

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd led-project-maneger
```

### 2. Instalar Dependências

```bash
# Usando npm
npm install

# Ou usando yarn
yarn install
```

### 3. Verificar Instalação

```bash
# Testar build
npm run build

# Iniciar servidor de desenvolvimento
npm run dev
```

Se tudo estiver correto, você verá:

```
VITE v7.0.0  ready in [tempo]ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🛠️ Configuração do Ambiente

### VS Code (Recomendado)

#### Extensões Essenciais

1. **TypeScript Importer** - Auto-import de tipos
2. **Tailwind CSS IntelliSense** - Autocomplete do Tailwind
3. **ES7+ React/Redux/React-Native snippets** - Snippets úteis
4. **Auto Rename Tag** - Renomeação automática de tags
5. **Bracket Pair Colorization** - Cores para brackets

#### Configuração do Workspace

O projeto já inclui:

- `.vscode/settings.json` - Configurações específicas
- `.vscode/tasks.json` - Comandos de build/dev
- `.vscode/extensions.json` - Extensões recomendadas

#### Configuração Manual

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Git Hooks (Opcional)

```bash
# Instalar husky para git hooks
npm install --save-dev husky
npx husky install

# Adicionar pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Servidor com host exposto (para acesso em rede)
npm run dev -- --host
```

### Build e Produção

```bash
# Build de produção
npm run build

# Preview do build
npm run preview

# Verificar build local
npm run preview -- --host
```

### Qualidade de Código

```bash
# Linting
npm run lint
npm run lint:fix    # Corrigir automaticamente

# Type checking
npm run type-check

# Formatação (se configurado)
npm run format
```

### Testes (Quando implementados)

```bash
# Executar testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage de testes
npm run test:coverage
```

## 🔧 Ferramentas de Desenvolvimento

### Vite Configuration

O projeto usa configurações otimizadas no `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // Abrir browser automaticamente
  },
  build: {
    sourcemap: true, // Source maps para debug
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["date-fns", "lucide-react"],
        },
      },
    },
  },
});
```

### TypeScript Configuration

Configuração estrita para máxima qualidade:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### ESLint & Prettier (Recomendado)

```bash
# Instalar ESLint e Prettier
npm install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Configurar .eslintrc.js
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

## 🔍 Estrutura de Arquivos para Desenvolvimento

```
led-project-maneger/
├── .vscode/                  # Configurações VS Code
├── docs/                     # Documentação
├── public/                   # Assets estáticos
├── src/                      # Código fonte
│   ├── modules/              # Módulos principais
│   ├── shared/               # Componentes compartilhados
│   ├── examples/             # Exemplos de uso
│   └── main.tsx              # Entry point
├── package.json              # Dependências e scripts
├── vite.config.ts           # Configuração Vite
├── tailwind.config.js       # Configuração Tailwind
├── tsconfig.json            # Configuração TypeScript
└── README.md                # Documentação principal
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Porta em Uso

```bash
# Erro: Port 5173 is already in use
npm run dev -- --port 3000
```

#### 2. Erro de Módulos Node

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 3. Erro do Tailwind CSS

```bash
# Verificar se PostCSS está configurado
npm list postcss autoprefixer
```

#### 4. Erro de TypeScript

```bash
# Verificar configuração
npx tsc --noEmit
```

### Performance no Desenvolvimento

#### Hot Reload Lento

```typescript
// vite.config.ts - Otimizações
export default defineConfig({
  server: {
    hmr: {
      overlay: false, // Desabilitar overlay de erros
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "lucide-react"],
  },
});
```

#### Build Lento

```bash
# Usar análise de bundle
npm run build -- --analyze
```

## 🏗️ Próximos Passos

Após o setup, recomendamos:

1. **Explorar a arquitetura** - [Architecture Overview](../architecture/overview.md)
2. **Entender os módulos** - [Features Documentation](../features/)
3. **Ler padrões de código** - [Coding Standards](./coding-standards.md)
4. **Contribuir** - [Contributing Guide](./contributing.md)

## 📞 Suporte

Se encontrar problemas:

1. Verifique este guia de troubleshooting
2. Consulte a [documentação do Vite](https://vitejs.dev/)
3. Abra uma issue no repositório
4. Consulte a comunidade React

---

**Última atualização:** Junho 2025  
**Ambiente testado:** Node.js 18+, npm 9+, Windows/macOS/Linux

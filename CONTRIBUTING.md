# 📋 Guia de Contribuição - LED Panel Manager

## 🚀 Setup Inicial do GitHub

### 1. Configuração Local do Git

```bash
# Configure seu nome e email (substitua pelos seus dados)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Configurações adicionais recomendadas
git config --global init.defaultBranch main
git config --global pull.rebase false
```

### 2. Criando o Repositório no GitHub

1. **Acesse [GitHub.com](https://github.com)**
2. **Clique em "New Repository"**
3. **Configurações recomendadas:**
   - **Repository name:** `led-panel-manager`
   - **Description:** `Sistema completo de gerenciamento de painéis LED`
   - **Visibility:** Public (ou Private se preferir)
   - **NÃO inicialize** com README (já temos)
   - **NÃO adicione** .gitignore (já temos)
   - **License:** MIT (recomendado)

### 3. Conectando Local ao GitHub

```bash
# Adicione seus arquivos ao Git
git add .
git commit -m "🎉 Initial commit: LED Panel Manager v0.1.0

✨ Features:
- Arquitetura modular React + TypeScript + Vite
- Módulos: Panels, Projects, Reports, Cabinets, Schedule
- Design system com Tailwind CSS v4
- Documentação completa com roadmap estruturado
- Sistema de versionamento configurado

📋 Status:
- Etapa 1.1 (CRUD Painéis): 60% concluída
- Build time: 1.78s
- Bundle size: 218KB"

# Conecte ao repositório do GitHub (substitua [username] pelo seu usuário)
git remote add origin https://github.com/[username]/led-panel-manager.git

# Configure a branch principal
git branch -M main

# Faça o primeiro push
git push -u origin main
```

## 🔄 Workflow de Desenvolvimento

### Branches Estratégia

```
main                 # Produção - sempre estável
├── develop          # Desenvolvimento - integração contínua
├── feature/[nome]   # Features específicas
├── release/[versão] # Preparação de release
└── hotfix/[bug]     # Correções urgentes
```

### Workflow por Etapa

#### 🎯 Para cada Etapa do Roadmap

```bash
# 1. Criar branch para a etapa
git checkout -b feature/etapa-1.1-crud-panels

# 2. Trabalhar na etapa seguindo o checklist diário
# 3. Commits frequentes com mensagens descritivas

# 4. Ao completar a etapa
git add .
git commit -m "✅ Complete Etapa 1.1: CRUD de Painéis

✨ Implementado:
- PanelForm.tsx com validações
- PanelCard.tsx responsivo  
- usePanelData hook completo
- Filtros e busca avançada
- Testes unitários

🧪 Testes: 15/15 passando
📊 Cobertura: 92%
⚡ Performance: Build em 1.8s"

# 5. Merge na develop
git checkout develop
git merge feature/etapa-1.1-crud-panels

# 6. Push para o GitHub
git push origin develop

# 7. Atualizar roadmap e dashboard
# 8. Tag de milestone se apropriado
git tag -a "milestone/etapa-1.1" -m "Milestone: CRUD Painéis Completo"
git push --tags
```

### 📝 Convenções de Commit

#### Formato Padrão
```
<tipo>(<escopo>): <descrição>

<corpo opcional>

<rodapé opcional>
```

#### Tipos Principais
- **✨ feat:** Nova funcionalidade
- **🐛 fix:** Correção de bug
- **📝 docs:** Documentação
- **💄 style:** Formatação (não afeta lógica)
- **♻️ refactor:** Refatoração de código
- **⚡ perf:** Melhoria de performance
- **🧪 test:** Adição ou correção de testes
- **🔧 chore:** Tarefas de build/CI
- **🎉 initial:** Commit inicial

#### Exemplos
```bash
# Feature nova
git commit -m "✨ feat(panels): adicionar filtro por potência

- Implementado filtro slider para potência
- Atualizado hook usePanelFiltering
- Adicionados testes para nova funcionalidade"

# Correção de bug
git commit -m "🐛 fix(projects): corrigir cálculo de área total

Fixes #23 - área estava sendo calculada incorretamente quando 
painéis tinham dimensões diferentes"

# Documentação
git commit -m "📝 docs(roadmap): atualizar progresso Etapa 1.1

- Etapa 1.1 agora 80% concluída
- Adicionadas métricas de performance
- Próximos passos definidos"

# Refatoração
git commit -m "♻️ refactor(components): extrair lógica comum de formulários

- Criado useFormValidation hook genérico
- Removida duplicação entre PanelForm e ProjectForm
- Mantida compatibilidade com API existente"
```

## 🏷️ Sistema de Tags e Releases

### Tags para Milestones
```bash
# Tag de etapa concluída
git tag -a "etapa/1.1" -m "✅ Etapa 1.1: CRUD Painéis"

# Tag de fase concluída  
git tag -a "fase/1" -m "🏗️ Fase 1: Foundation Complete"

# Tag de versão
git tag -a "v0.1.0" -m "🚀 Release v0.1.0: Foundation MVP"
```

### Releases Automáticos
```bash
# Release patch (0.1.0 -> 0.1.1)
npm run release:patch

# Release minor (0.1.0 -> 0.2.0) 
npm run release:minor

# Release major (0.1.0 -> 1.0.0)
npm run release:major
```

## 📊 Acompanhamento de Progresso

### Atualização Diária
```bash
# 1. Status do trabalho
git status

# 2. Commit do progresso
git add .
git commit -m "🔄 progress(etapa-1.1): implement panel validation

- Validações de formulário implementadas
- Testes unitários adicionados
- Progresso: 70% -> 80%"

# 3. Push para backup
git push origin feature/etapa-1.1-crud-panels
```

### Atualização Semanal
```bash
# 1. Merge das features completadas
git checkout develop
git merge feature/etapa-completa

# 2. Atualizar documentação
# 3. Push da develop
git push origin develop

# 4. Tag de milestone se apropriado
git tag -a "week/$(date +%Y-%U)" -m "Weekly progress: $(date +%Y-%m-%d)"
git push --tags
```

## 🔄 Sincronização com Roadmap

### Após Completar Etapa
1. **✅ Marcar etapa como concluída** no roadmap
2. **📊 Atualizar métricas** no progress-dashboard
3. **📝 Atualizar CHANGELOG** com mudanças
4. **🏷️ Criar tag** de milestone
5. **🚀 Fazer release** se apropriado

### Scripts de Automação
```bash
# Script para atualizar progresso (criar como npm script)
npm run update-progress
# - Atualiza percentuais no dashboard
# - Gera relatório de progresso
# - Comita mudanças na documentação
```

## 🛡️ Proteção de Branches

### Configurações Recomendadas no GitHub
- **Branch `main`:** Protegida, require pull request
- **Branch `develop`:** Protegida, require status checks
- **Require reviews:** 1 reviewer (se em equipe)
- **Status checks:** Build deve passar

## 📱 GitHub Issues e Milestones

### Template de Issue para Bugs
```markdown
## 🐛 Bug Report

### Descrição
[Descrição clara do bug]

### Reprodução
1. [Primeiro passo]
2. [Segundo passo]
3. [Ver erro]

### Comportamento Esperado
[O que deveria acontecer]

### Screenshots
[Se aplicável]

### Ambiente
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Version: [Versão do app]
```

### Template de Issue para Features
```markdown
## ✨ Feature Request

### Descrição da Feature
[Descrição clara da funcionalidade]

### Motivação
[Por que essa feature é necessária]

### Solução Proposta
[Como você imagina que deveria funcionar]

### Alternativas
[Outras abordagens consideradas]

### Etapa Relacionada
[Qual etapa do roadmap esta feature se relaciona]
```

---

## 🎯 Quick Commands

```bash
# Setup inicial
git init
git add .
git commit -m "🎉 initial: LED Panel Manager"
git remote add origin [URL_DO_SEU_REPO]
git push -u origin main

# Desenvolvimento diário
git add .
git commit -m "🔄 progress: [descrição]"
git push

# Completar etapa
git tag -a "etapa/X.Y" -m "✅ Etapa X.Y completa"
git push --tags

# Release
npm run release:patch
```

**🎯 Objetivo:** Manter histórico claro e organizando do desenvolvimento, facilitando colaboração e acompanhamento do progresso.

# 🚀 Setup GitHub - LED Panel Manager

## ⚡ Setup Rápido (5 minutos)

### 1. 📱 Criando Repositório no GitHub

1. **Acesse:** https://github.com/new
2. **Repository name:** `led-panel-manager`
3. **Description:** `Sistema completo de gerenciamento de painéis LED - React + TypeScript + Vite`
4. **Visibility:** Public (recomendado) ou Private
5. **❌ NÃO marque** "Add a README file" (já temos)
6. **❌ NÃO marque** "Add .gitignore" (já temos)
7. **✅ Choose a license:** MIT License
8. **Clique "Create repository"**

### 2. 🔗 Conectando Local ao GitHub

```bash
# No terminal, execute (substitua [SEU_USUARIO] pelo seu username do GitHub):

# Adicionar remote origin
git remote add origin https://github.com/[SEU_USUARIO]/led-panel-manager.git

# Push inicial
git push -u origin main
```

**Exemplo prático:**

```bash
# Se seu usuário for "joaosilva", execute:
git remote add origin https://github.com/joaosilva/led-panel-manager.git
git push -u origin main
```

### 3. ✅ Verificação

Após o push, você deve ver no GitHub:

- ✅ Código-fonte completo
- ✅ README.md com descrição
- ✅ Documentação em docs/
- ✅ Roadmap estruturado
- ✅ Sistema de CI/CD configurado

## 🎯 Próximos Passos

### 1. 🏷️ Configurar Primeira Release

```bash
# Criar tag da versão inicial
git tag -a "v0.1.0" -m "🚀 Release v0.1.0: Foundation Setup

✨ Features:
- Arquitetura modular React + TypeScript + Vite
- Roadmap completo estruturado por fases
- Sistema de documentação integrado
- CI/CD pipeline configurado

📋 Status:
- Etapa 1.1: 60% concluída (CRUD Painéis)
- Build: 1.78s | Bundle: 218KB
- Documentação: 30+ arquivos
"

# Push da tag
git push --tags
```

### 2. 📋 Configurar Issues

No GitHub, vá em **"Issues"** e você verá templates automáticos para:

- 🐛 **Bug Report** - Reportar problemas
- ✨ **Feature Request** - Sugerir funcionalidades
- 📋 **Task/Etapa** - Acompanhar roadmap

### 3. 🚀 Configurar Deploy (Opcional)

#### Netlify (Recomendado)

1. **Acesse:** https://netlify.com
2. **"New site from Git"**
3. **Conecte seu repositório GitHub**
4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Deploy!**

#### Vercel (Alternativa)

1. **Acesse:** https://vercel.com
2. **"New Project"**
3. **Import do GitHub**
4. **Deploy automático**

### 4. 📊 Configurar Proteção de Branch

No GitHub:

1. **Settings** → **Branches**
2. **Add rule** para `main`
3. **✅ Require status checks**
4. **✅ Require branches to be up to date**

## 🔄 Workflow Diário

### 📝 Desenvolvimento

```bash
# Início do dia
git pull origin main
npm run dev

# Durante desenvolvimento
git add .
git commit -m "🔄 progress: implementar [funcionalidade]"
git push

# Fim da etapa
git commit -m "✅ feat: complete etapa X.Y - [nome]"
git tag -a "etapa/X.Y" -m "Etapa X.Y concluída"
git push --tags
```

### 🏷️ Releases

```bash
# Release patch (bug fixes)
npm run release:patch

# Release minor (new features)
npm run release:minor

# Release major (breaking changes)
npm run release:major
```

## 📱 GitHub Features Configuradas

### ✅ O que já está pronto:

- **📋 Issue Templates** - Bug, Feature, Task
- **🚀 CI/CD Pipeline** - Tests, Build, Deploy
- **📝 Contributing Guide** - Workflow e padrões
- **📊 CHANGELOG** - Histórico de versões
- **🏷️ Release Scripts** - Versionamento automático
- **🔒 Security** - Audit automático

### 🎯 Como usar:

1. **Issues** - Acompanhar bugs e features
2. **Actions** - Ver builds automáticos
3. **Releases** - Histórico de versões
4. **Projects** - Kanban board (criar depois)

## ⚡ Commands Resumo

```bash
# Setup inicial (uma vez)
git remote add origin https://github.com/[USER]/led-panel-manager.git
git push -u origin main

# Desenvolvimento diário
git add . && git commit -m "🔄 progress: [task]" && git push

# Completar etapa
git tag -a "etapa/1.1" -m "Etapa 1.1 completa" && git push --tags

# Release
npm run release:patch
```

---

## 🆘 Troubleshooting

### ❌ "Permission denied" no push

```bash
# Configure SSH ou use Personal Access Token
# GitHub Settings → Developer settings → Personal access tokens
```

### ❌ "Repository not found"

```bash
# Verifique se o nome do repositório está correto
# Verifique se você tem acesso ao repositório
```

### ❌ "Authentication failed"

```bash
# Use Personal Access Token como senha
# Ou configure SSH keys
```

---

**🎉 Pronto!** Seu projeto está configurado no GitHub com sistema completo de versionamento e CI/CD.

**🎯 Próximo:** Continue o desenvolvimento seguindo o [roadmap](docs/development/roadmap/getting-started.md) e use o [checklist diário](docs/development/roadmap/daily-checklist.md).

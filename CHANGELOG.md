# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🔄 Em Desenvolvimento
- Sistema completo de autenticação JWT
- Gestão avançada de usuários e permissões
- Sistema de test cards para LEDs
- Gestão de técnicos e agendamento

## [0.1.0] - 2025-06-30

### ✨ Adicionado
- **🏗️ Arquitetura base** - Projeto configurado com Vite + React + TypeScript
- **📊 Módulo de Painéis** - CRUD básico com tipos TypeScript
- **📁 Módulo de Projetos** - Estrutura base e tipos
- **📄 Módulo de Relatórios** - Foundation para geração de PDFs
- **🎨 Design System** - Tokens de design e componentes base
- **📚 Documentação completa** - Roadmap detalhado por fases e etapas
- **🗂️ Sistema de gestão** - Checklists diários e dashboard de progresso

### 🛠️ Técnico
- Configuração completa do ambiente de desenvolvimento
- Estrutura modular escalável em `src/modules/`
- Tipos TypeScript para todos os módulos principais
- Build otimizado com bundle de ~218KB
- Sistema de documentação estruturado

### 📋 Roadmap Criado
- **Fase 1: Foundation** (4-6 semanas) - CRUD básico + Relatórios
- **Fase 2: Auth & Users** (4-6 semanas) - Sistema de usuários
- **Fase 3: Advanced Features** (6-8 semanas) - Features avançadas
- **Fase 4: Enterprise** (8-10 semanas) - Multi-tenancy + API

### 🎯 Status Atual
- ✅ **Etapa 1.1** (60%) - CRUD de Painéis em desenvolvimento
- ⏳ **Etapa 1.2** (0%) - CRUD de Projetos planejado
- ⏳ **Etapa 1.3** (0%) - Relatórios PDF planejado
- ⏳ **Etapa 1.4** (0%) - Refinamento UI planejado

## [0.0.0] - 2025-06-29

### ✨ Inicial
- Criação do projeto
- Setup inicial com Vite
- Configuração base do TypeScript
- Primeiros componentes de teste

---

## 📝 Convenções de Versionamento

### Semantic Versioning (SemVer)
- **MAJOR** (X.0.0) - Mudanças incompatíveis na API
- **MINOR** (0.X.0) - Novas funcionalidades compatíveis
- **PATCH** (0.0.X) - Correções de bugs compatíveis

### Tipos de Mudanças
- **✨ Adicionado** - Novas funcionalidades
- **🔄 Modificado** - Mudanças em funcionalidades existentes
- **❌ Depreciado** - Funcionalidades que serão removidas
- **🗑️ Removido** - Funcionalidades removidas
- **🐛 Corrigido** - Correções de bugs
- **🔒 Segurança** - Correções de vulnerabilidades

### Processo de Release
1. Atualizar version no `package.json`
2. Adicionar entrada no `CHANGELOG.md`
3. Fazer commit das mudanças
4. Criar tag no Git
5. Push das mudanças e tags

### Scripts de Release
```bash
# Patch release (0.1.0 -> 0.1.1)
npm run release:patch

# Minor release (0.1.0 -> 0.2.0)
npm run release:minor

# Major release (0.1.0 -> 1.0.0)
npm run release:major
```

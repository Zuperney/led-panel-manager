# 🏗️ Plano de Modularização do Led Panel Manager

## 📋 Visão Geral

Este documento define o plano estratégico para modularização do projeto Led Panel Manager, transformando arquivos monolíticos em uma estrutura modular, escalável e maintível.

## 🎯 Objetivos

- ✅ Reduzir complexidade dos arquivos (máx 300 linhas por arquivo)
- ✅ Melhorar manutenibilidade e debugging
- ✅ Facilitar desenvolvimento colaborativo
- ✅ Implementar padrões de arquitetura consistentes
- ✅ Otimizar performance com code splitting

## 📊 Análise de Arquivos Problemáticos

| Arquivo                | Linhas  | Prioridade  | Status              |
| ---------------------- | ------- | ----------- | ------------------- |
| PanelLayoutEditor.jsx  | 1,842   | 🔥 CRÍTICA  | ⏳ Pendente         |
| PixelMapping.jsx       | 1,099   | 🔥 CRÍTICA  | ⏳ Pendente         |
| ListaMaterialModal.jsx | 875     | 🚨 ALTA     | ⏳ Pendente         |
| **Paineis.jsx**        | **806** | **🚨 ALTA** | **🎯 EM ANDAMENTO** |
| Relatorio.jsx          | 752     | ⚠️ MÉDIA    | ⏳ Pendente         |
| Projetos.jsx           | 695     | ⚠️ MÉDIA    | ⏳ Pendente         |
| ResolumeExporter.jsx   | 608     | ⚠️ MÉDIA    | ⏳ Pendente         |

## 🚀 Estratégia de Implementação

### **FASE 1: MODELO PILOTO** ⭐

**Módulo**: Painéis (806 linhas)
**Objetivo**: Criar template de modularização para replicar em outros módulos

### **FASE 2: CRÍTICOS**

1. PanelLayoutEditor.jsx (1,842 linhas)
2. PixelMapping.jsx (1,099 linhas)
3. ListaMaterialModal.jsx (875 linhas)

### **FASE 3: CONSOLIDAÇÃO**

4. Relatorio.jsx (752 linhas)
5. Projetos.jsx (695 linhas)
6. ResolumeExporter.jsx (608 linhas)

---

## 📁 Estrutura Alvo - Template Modular

```
src/
├── pages/
│   └── [ModuleName]/
│       ├── index.jsx                    # Componente principal (máx 200 linhas)
│       ├── [ModuleName].types.js        # TypeScript/PropTypes definitions
│       ├── [ModuleName].constants.js    # Constantes do módulo
│       ├── hooks/
│       │   ├── use[Module]Form.js       # Lógica de formulários
│       │   ├── use[Module]Crud.js       # CRUD operations
│       │   ├── use[Module]Filtering.js  # Filtros e busca
│       │   └── use[Module]Validation.js # Validações
│       ├── components/
│       │   ├── [Module]Form/
│       │   │   ├── index.jsx
│       │   │   ├── FormFields.jsx
│       │   │   └── FormValidation.jsx
│       │   ├── [Module]List/
│       │   │   ├── index.jsx
│       │   │   ├── [Module]Card.jsx
│       │   │   ├── [Module]ListItem.jsx
│       │   │   └── [Module]Preview.jsx
│       │   ├── [Module]Stats/
│       │   │   └── index.jsx
│       │   ├── [Module]Toolbar/
│       │   │   ├── index.jsx
│       │   │   ├── SearchBar.jsx
│       │   │   ├── FilterDropdowns.jsx
│       │   │   └── ViewModeToggle.jsx
│       │   └── [Module]Modals/
│       │       ├── DeleteModal.jsx
│       │       ├── FormModal.jsx
│       │       └── PreviewModal.jsx
│       ├── services/
│       │   ├── [module]Api.js           # API calls
│       │   ├── [module]Calculations.js  # Cálculos
│       │   └── [module]Persistence.js   # Local/Session storage
│       └── utils/
│           ├── [module]Helpers.js       # Funções auxiliares
│           └── [module]Formatters.js    # Formatação de dados
```

---

## 🎯 FASE 1: Modularização do Painéis

### **Etapa 1.1: Preparação** ✅

- [x] Análise do arquivo atual
- [x] Definição da estrutura alvo
- [x] Criação da documentação
- [ ] Backup do arquivo original

### **Etapa 1.2: Criação da Estrutura Base**

- [ ] Criar diretórios da nova estrutura
- [ ] Configurar índices de exportação
- [ ] Preparar arquivos de constantes e tipos

### **Etapa 1.3: Extração de Hooks**

- [ ] Extrair `usePainelForm.js`
- [ ] Extrair `usePainelCrud.js`
- [ ] Extrair `usePainelCalculations.js`
- [ ] Migrar `usePainelFiltering.js` existente

### **Etapa 1.4: Extração de Serviços**

- [ ] Criar `painelApi.js`
- [ ] Migrar `painelCalculations.js`
- [ ] Criar `painelPersistence.js`

### **Etapa 1.5: Modularização de Componentes**

- [ ] Modularizar formulário de painéis
- [ ] Modularizar lista de painéis
- [ ] Modularizar modais
- [ ] Modularizar toolbar e stats

### **Etapa 1.6: Componente Principal**

- [ ] Refatorar `Paineis/index.jsx`
- [ ] Integrar todos os módulos
- [ ] Testes de integração

### **Etapa 1.7: Validação e Cleanup**

- [ ] Testes funcionais completos
- [ ] Performance check
- [ ] Remoção do arquivo original
- [ ] Atualização de imports

---

## 📋 Checklist de Validação por Etapa

### ✅ Critérios de Conclusão para Cada Etapa:

1. **Funcionalidade mantida**: Todas as features funcionam como antes
2. **Performance preservada**: Sem degradação de performance
3. **Testes passando**: Todos os testes unitários/integração
4. **Build successful**: Projeto compila sem erros
5. **Code review**: Revisão de código aprovada
6. **Documentação**: README e comentários atualizados

### 🧪 Script de Validação Rápida:

```bash
# Executar após cada etapa
npm run build        # Verifica compilação
npm test            # Executa testes (quando implementados)
npm run lint        # Verifica padrões de código
```

---

## 📝 Sistema de Tracking

### **Status de Etapas:**

- 🎯 **EM ANDAMENTO**: Etapa sendo executada
- ✅ **CONCLUÍDA**: Etapa finalizada e validada
- ⏳ **PENDENTE**: Aguardando execução
- ❌ **BLOQUEADA**: Impedida por dependência
- 🔄 **REVISÃO**: Necessita ajustes

### **Log de Mudanças:**

Cada mudança será documentada em `CHANGELOG-REFACTORING.md` com:

- Data da mudança
- Etapa concluída
- Arquivos afetados
- Testes realizados
- Issues resolvidas

---

## 🎨 Padrões e Convenções

### **Nomenclatura:**

- Componentes: PascalCase (`PainelCard.jsx`)
- Hooks: camelCase com 'use' (`usePainelForm.js`)
- Serviços: camelCase (`painelApi.js`)
- Constantes: UPPER_SNAKE_CASE

### **Estrutura de Arquivos:**

- Máximo 300 linhas por arquivo
- Um componente por arquivo
- Exports nomeados preferenciais
- Índices para re-exportação

### **Imports:**

- Imports absolutos para src/
- Imports relativos para mesmo módulo
- Agrupamento: external → internal → relative

---

## 🚀 Próximos Passos

1. **AGORA**: Executar Etapa 1.2 (Criação da Estrutura Base)
2. **HOJE**: Concluir Etapa 1.3 (Extração de Hooks)
3. **ESTA SEMANA**: Finalizar FASE 1 completa
4. **PRÓXIMA SEMANA**: Iniciar FASE 2 com PanelLayoutEditor

---

## 📞 Suporte e Revisão

**Responsável**: @GitHub_Copilot
**Revisão**: A cada etapa concluída
**Documentação**: Manter este arquivo sempre atualizado

---

_Última atualização: 28/06/2025 - Criação do plano_

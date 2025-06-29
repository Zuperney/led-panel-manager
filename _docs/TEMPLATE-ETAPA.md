# 📋 Template de Etapa - Refatoração

Use este template para documentar cada etapa da refatoração de forma consistente.

---

## 🎯 **Etapa [X.Y]: [Nome da Etapa]**

### **📅 Data**: [DD/MM/YYYY]

### **⏱️ Tempo Estimado**: [X horas]

### **👤 Responsável**: @[GitHub_Usuario]

---

## 🎯 **Objetivos**

- [ ] Objetivo específico 1
- [ ] Objetivo específico 2
- [ ] Objetivo específico 3

---

## 📁 **Arquivos Impactados**

### **Criados:**

- `path/to/new/file1.jsx`
- `path/to/new/file2.js`

### **Modificados:**

- `path/to/existing/file1.jsx`
- `path/to/existing/file2.js`

### **Removidos:**

- `path/to/old/file1.jsx` (se aplicável)

---

## 🔧 **Implementação**

### **Passo 1: [Descrição]**

```bash
# Comandos específicos
mkdir -p src/pages/Paineis/hooks
```

**Resultado esperado:** Descrição do que deve acontecer

### **Passo 2: [Descrição]**

```javascript
// Código específico
export const usePainelForm = () => {
  // implementação
};
```

**Resultado esperado:** Descrição do que deve acontecer

### **Passo 3: [Descrição]**

- Ação manual 1
- Ação manual 2

---

## 🧪 **Validação**

### **Testes Obrigatórios:**

- [ ] `npm run build` - Build sem erros
- [ ] Funcionalidade preservada - Teste manual
- [ ] Performance mantida - Verificação visual
- [ ] Imports corretos - Verificar console

### **Critérios de Aceitação:**

- [ ] ✅ Todos os objetivos alcançados
- [ ] ✅ Nenhum erro de build/compilação
- [ ] ✅ Funcionalidade idêntica ao estado anterior
- [ ] ✅ Código seguindo padrões definidos
- [ ] ✅ Documentação atualizada

### **Script de Validação:**

```bash
# Windows
.\_docs\validate.ps1

# Linux/Mac
./_docs/validate.sh
```

---

## 📊 **Métricas**

### **Antes:**

- Linhas de código: [X]
- Número de arquivos: [Y]
- Complexidade: [Alta/Média/Baixa]

### **Depois:**

- Linhas de código: [X]
- Número de arquivos: [Y]
- Complexidade: [Alta/Média/Baixa]
- Redução: [X]% de linhas

---

## 🐛 **Issues Encontradas**

### **Problema 1:**

**Descrição:** [Descrição do problema]
**Solução:** [Como foi resolvido]
**Commit:** [hash do commit se aplicável]

### **Problema 2:**

**Descrição:** [Descrição do problema]
**Solução:** [Como foi resolvido]
**Commit:** [hash do commit se aplicável]

---

## 📝 **Observações**

- Observação importante 1
- Observação importante 2
- Links úteis ou referências

---

## ✅ **Conclusão**

**Status:** [CONCLUÍDA/PENDENTE/BLOQUEADA]
**Data de Conclusão:** [DD/MM/YYYY]
**Próxima Etapa:** [X.Y - Nome da próxima etapa]

### **Lições Aprendidas:**

- Lição 1
- Lição 2

### **Melhorias para Próximas Etapas:**

- Melhoria 1
- Melhoria 2

---

## 🔄 **Rollback Plan**

Se algo der errado, seguir estes passos para reverter:

1. `git checkout HEAD~1 -- [arquivos afetados]`
2. `npm install` (se dependências foram alteradas)
3. `npm run build` (validar que rollback funcionou)

**Commit de Backup:** [hash do commit antes da mudança]

---

_Template criado em: 28/06/2025_
_Última atualização: 28/06/2025_

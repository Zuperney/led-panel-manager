# 📱 Etapa 1.1: CRUD Completo de Painéis LED

## 📋 Informações da Etapa

| Campo              | Valor               |
| ------------------ | ------------------- |
| **Fase**           | 1 - Foundation      |
| **Etapa**          | 1.1                 |
| **Tempo Estimado** | 1 semana (5-7 dias) |
| **Status**         | 🔄 Em Andamento     |
| **Prioridade**     | 🔥 Alta             |
| **Desenvolvedor**  | -                   |

## 🎯 Objetivos

### Objetivo Principal

Implementar um sistema completo de **CRUD (Create, Read, Update, Delete)** para painéis LED, permitindo gestão completa do catálogo de painéis.

### Objetivos Específicos

- ✅ **Create** - Formulário para adicionar novos painéis
- ✅ **Read** - Visualização e listagem de painéis
- ✅ **Update** - Edição de painéis existentes
- ✅ **Delete** - Remoção de painéis com confirmação
- ✅ **Validação** - Validações client-side robustas
- ✅ **UX** - Interface intuitiva e responsiva

## 📋 Pré-requisitos

### Técnicos

- [x] ✅ Módulo Panels com tipos definidos
- [x] ✅ Hook usePanelData implementado
- [x] ✅ PanelCard component funcionando
- [x] ✅ Utilitários de cálculo prontos

### Conhecimentos

- **React Forms** - Controlled components, validation
- **TypeScript** - Interfaces, types, generics
- **Tailwind CSS** - Formulários e modais
- **React Hooks** - useState, useEffect, custom hooks

## 📝 Tarefas Detalhadas

### Task 1: Componente PanelForm

**Tempo estimado:** 2 dias

#### Subtarefas:

- [ ] **1.1** Criar interface `PanelFormData` e `PanelFormProps`
- [ ] **1.2** Implementar formulário controlado com React Hook Form (opcional) ou useState
- [ ] **1.3** Adicionar campos para todas as propriedades do painel:

  ```typescript
  // Campos obrigatórios
  - name: string
  - manufacturer: string
  - model: string
  - width: number (mm)
  - height: number (mm)
  - pixelPitch: number (mm)
  - powerConsumption: number (W)
  - brightness: number (nits)
  - refreshRate: number (Hz)
  - inputVoltage: number (V)
  - operatingTemperature.min: number (°C)
  - operatingTemperature.max: number (°C)
  - ipRating: string
  - weight: number (kg)

  // Campos opcionais
  - price: number
  - description: string
  ```

- [ ] **1.4** Implementar layout responsivo com Tailwind CSS
- [ ] **1.5** Adicionar preview de cálculos em tempo real

#### Critérios de Aceitação:

- [ ] Formulário renderiza todos os campos corretamente
- [ ] Funciona em modo criação e edição
- [ ] Layout responsivo (mobile, tablet, desktop)
- [ ] Preview de cálculos atualiza automaticamente

#### Código de Referência:

```typescript
interface PanelFormProps {
  panel?: Panel; // undefined = modo criação
  onSubmit: (data: PanelFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PanelForm: React.FC<PanelFormProps> = ({
  panel,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  // Implementation
};
```

### Task 2: Sistema de Validação

**Tempo estimado:** 1 dia

#### Subtarefas:

- [ ] **2.1** Criar função `validatePanelData`
- [ ] **2.2** Implementar validações:

  ```typescript
  // Validações obrigatórias
  - Nome não pode estar vazio
  - Dimensões devem ser > 0
  - Pixel pitch deve ser > 0
  - Potência deve ser > 0
  - Tensão deve ser > 0
  - Peso deve ser > 0
  - Temperatura min < max

  // Validações de formato
  - IP Rating formato válido (IP54, IP65, etc.)
  - Email válido se fornecido
  - Números positivos onde aplicável
  ```

- [ ] **2.3** Adicionar mensagens de erro em português
- [ ] **2.4** Implementar validação em tempo real
- [ ] **2.5** Destacar campos com erro visualmente

#### Critérios de Aceitação:

- [ ] Todas as validações funcionando
- [ ] Mensagens de erro claras e em português
- [ ] Validação em tempo real sem lag
- [ ] Campos inválidos destacados visualmente

### Task 3: Modal de Confirmação para Exclusão

**Tempo estimado:** 0.5 dia

#### Subtarefas:

- [ ] **3.1** Criar componente `ConfirmDeleteModal`
- [ ] **3.2** Implementar design com informações do painel
- [ ] **3.3** Adicionar botões de ação (Cancelar/Excluir)
- [ ] **3.4** Implementar estado de loading durante exclusão
- [ ] **3.5** Adicionar animações de entrada/saída

#### Critérios de Aceitação:

- [ ] Modal exibe informações do painel a ser excluído
- [ ] Botão de exclusão só funciona após confirmação
- [ ] Loading state durante operação
- [ ] Animações suaves

### Task 4: Integração com PanelCard

**Tempo estimado:** 0.5 dia

#### Subtarefas:

- [ ] **4.1** Adicionar botões de ação no PanelCard (já implementado)
- [ ] **4.2** Implementar handlers para edit/delete
- [ ] **4.3** Adicionar states de loading
- [ ] **4.4** Melhorar visual feedback

#### Critérios de Aceitação:

- [ ] Botões de ação funcionando corretamente
- [ ] Loading states visíveis durante operações
- [ ] Feedback visual adequado

### Task 5: Página/Modal Principal de Gestão

**Tempo estimado:** 1 dia

#### Subtarefas:

- [ ] **5.1** Criar componente `PanelManagement`
- [ ] **5.2** Implementar modal para criar/editar painéis
- [ ] **5.3** Adicionar botão "Adicionar Painel"
- [ ] **5.4** Integrar com grid de PanelCards
- [ ] **5.5** Implementar estado global de modais

#### Critérios de Aceitação:

- [ ] Interface completa de gestão
- [ ] Modais funcionando corretamente
- [ ] Estado global gerenciado adequadamente

### Task 6: Testes e Refinamentos

**Tempo estimado:** 1 dia

#### Subtarefas:

- [ ] **6.1** Testar todos os fluxos de CRUD
- [ ] **6.2** Testar responsividade em diferentes telas
- [ ] **6.3** Testar validações e estados de erro
- [ ] **6.4** Refinar animações e transições
- [ ] **6.5** Otimizar performance

#### Critérios de Aceitação:

- [ ] Todos os fluxos testados e funcionando
- [ ] Interface responsiva e polida
- [ ] Performance adequada

## ✅ Critérios de Aceitação Gerais

### Funcionalidade

- [ ] **Criar painel** - Formulário completo e funcional
- [ ] **Editar painel** - Carrega dados existentes e salva alterações
- [ ] **Excluir painel** - Confirmação e remoção segura
- [ ] **Listar painéis** - Grid responsivo com todos os painéis
- [ ] **Validações** - Todas as validações client-side funcionando

### Interface

- [ ] **Responsividade** - Funciona em mobile, tablet e desktop
- [ ] **Acessibilidade** - Labels, focus states, keyboard navigation
- [ ] **Loading States** - Feedback visual durante operações
- [ ] **Error States** - Tratamento visual de erros
- [ ] **Animations** - Transições suaves e profissionais

### Performance

- [ ] **Formulário responsivo** - Sem lag na digitação
- [ ] **Cálculos em tempo real** - Preview instantâneo
- [ ] **Operações rápidas** - CRUD < 1 segundo
- [ ] **Memory leaks** - Sem vazamentos de memória

### Código

- [ ] **TypeScript** - Tipagem correta em todos os componentes
- [ ] **Padrões** - Segue [Coding Standards](../../coding-standards.md)
- [ ] **Reutilização** - Componentes reutilizáveis
- [ ] **Documentação** - JSDoc para funções complexas

## 🧪 Plano de Testes

### Testes Manuais

1. **Criar Painel**
   - [ ] Preencher formulário completo e salvar
   - [ ] Testar com dados inválidos
   - [ ] Verificar cálculos automáticos
2. **Editar Painel**
   - [ ] Carregar painel existente
   - [ ] Modificar dados e salvar
   - [ ] Cancelar edição
3. **Excluir Painel**
   - [ ] Abrir modal de confirmação
   - [ ] Confirmar exclusão
   - [ ] Cancelar exclusão
4. **Responsividade**
   - [ ] Testar em mobile (375px)
   - [ ] Testar em tablet (768px)
   - [ ] Testar em desktop (1024px+)

### Testes Automatizados (Opcionais)

```typescript
// Exemplo de testes
describe("PanelForm", () => {
  test("should validate required fields", () => {
    // Test implementation
  });

  test("should calculate metrics in real time", () => {
    // Test implementation
  });
});
```

## 📁 Estrutura de Arquivos

```
src/modules/Panels/
├── components/
│   ├── PanelCard.tsx           # ✅ Já implementado
│   ├── PanelForm.tsx           # 🆕 Criar
│   ├── PanelManagement.tsx     # 🆕 Criar
│   ├── ConfirmDeleteModal.tsx  # 🆕 Criar
│   └── index.ts                # 🔄 Atualizar exports
├── hooks/
│   ├── usePanelData.ts         # ✅ Já implementado
│   ├── usePanelForm.ts         # 🆕 Criar (opcional)
│   └── index.ts                # 🔄 Atualizar exports
├── utils/
│   ├── panelValidation.ts      # 🆕 Criar
│   └── index.ts                # 🔄 Atualizar exports
└── types/
    ├── panel.types.ts          # ✅ Já implementado
    ├── panelForm.types.ts      # 🆕 Criar
    └── index.ts                # 🔄 Atualizar exports
```

## 🔧 Ferramentas e Dependências

### Dependências Existentes

- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Lucide React (ícones)

### Dependências Opcionais

```bash
# Para formulários mais robustos (opcional)
npm install react-hook-form @hookform/resolvers zod

# Para máscaras de input (opcional)
npm install react-input-mask

# Para date pickers (se necessário)
npm install react-datepicker
```

## 📖 Documentação a Atualizar

### Durante o Desenvolvimento

- [ ] **JSDoc** - Documentar funções complexas
- [ ] **README.md** - Atualizar exemplos de uso
- [ ] **CHANGELOG.md** - Documentar mudanças

### Após Conclusão

- [ ] **[Features - Panels](../../features/panels.md)** - Adicionar seção CRUD
- [ ] **[Architecture Overview](../../architecture/overview.md)** - Atualizar status
- [ ] **Guia do Usuário** - Criar seção sobre gestão de painéis

## 🚨 Riscos e Mitigações

### Riscos Identificados

1. **Complexidade do formulário** - Muitos campos podem intimidar

   - _Mitigação:_ Organizar em seções, usar wizard se necessário

2. **Performance com muitos painéis** - Lista grande pode ser lenta

   - _Mitigação:_ Implementar paginação ou virtualização

3. **Validações complexas** - Regras de negócio específicas
   - _Mitigação:_ Documentar bem e criar testes abrangentes

### Plano B

- Se formulário ficar muito complexo, dividir em múltiplas etapas
- Se performance for problema, implementar lazy loading
- Se validações forem complexas, criar wizard guiado

## 📞 Suporte e Referências

### Documentação Técnica

- [React Forms Guide](https://react.dev/reference/react-dom/components/form)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind Forms](https://tailwindcss.com/docs/forms)

### Código de Referência

- [PanelCard existente](../../../src/modules/Panels/components/PanelCard.tsx)
- [usePanelData hook](../../../src/modules/Panels/hooks/usePanelData.ts)
- [Panel types](../../../src/modules/Panels/types/panel.types.ts)

---

**Próxima etapa:** [1.2 - CRUD Completo de Projetos](./etapa-1.2-crud-projects.md)

**Status:** 🔄 **EM ANDAMENTO** - Pronto para desenvolvimento  
**Última atualização:** Junho 2025

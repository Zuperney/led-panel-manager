# LED Panel Manager

Um sistema completo de gerenciamento de painéis LED construído com React + TypeScript + Vite. O sistema gerencia projetos, configurações de gabinetes, relatórios e agendamentos de painéis LED.

## 🚀 Funcionalidades

### Módulos Principais

- **📱 Painéis** - Especificações e configurações de painéis LED
- **📁 Projetos** - Gerenciamento e acompanhamento de projetos
- **📊 Relatórios** - Geração de PDF e visualização de dados
- **📦 Gabinetes** - Configuração de layouts e arranjos
- **📅 Agenda** - Cronogramas e gerenciamento de tempo
- **🔧 Test Cards** - Gerador de cartões de teste para projetos e painéis
- **📚 Documentação** - Guias de configuração e cabeamento
- **👥 Usuários** - Sistema completo de autenticação e controle de acesso
- **👷 Técnicos** - Cadastro e gerenciamento de equipe técnica
- **💼 Assinaturas** - Planos com funcionalidades diferenciadas

### Características Técnicas

- ⚡ **Performance** - Otimizado para grandes datasets
- 📱 **Responsivo** - Interface mobile e desktop
- 🔧 **Extensível** - Fácil adição de novos tipos de painéis
- 🛡️ **Integridade** - Validação de dados e cálculos
- 🎨 **UI Moderna** - Design system consistente
- 🔐 **Segurança** - Autenticação e controle de acesso por usuário
- 🗄️ **Multi-tenant** - Banco de dados isolado por usuário
- 📧 **Comunicação** - Sistema de notificações e emails
- 💾 **Backup** - Exportação e sincronização de dados
- 🏢 **Empresarial** - Gestão de equipes e hierarquias

## 🛠️ Tecnologias

### Frontend

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Ícones modernos
- **React Hot Toast** - Notificações
- **Framer Motion** - Animações
- **Date-fns** - Manipulação de datas

### Arquitetura

- **Modular** - Estrutura em módulos independentes
- **Hooks** - Gerenciamento de estado customizado
- **Components** - Componentes reutilizáveis
- **TypeScript** - Tipagem forte em todo o projeto

## 📁 Estrutura do Projeto

```
src/
├── modules/                    # Módulos principais
│   ├── Panels/                # Módulo de Painéis
│   │   ├── types/             # Tipos TypeScript
│   │   ├── hooks/             # Hooks customizados
│   │   ├── components/        # Componentes específicos
│   │   ├── utils/             # Utilitários e cálculos
│   │   └── index.ts           # Exports do módulo
│   ├── Projects/              # Módulo de Projetos
│   ├── Reports/               # Módulo de Relatórios
│   ├── Cabinets/              # Módulo de Gabinetes
│   ├── Schedule/              # Módulo de Agenda
│   ├── TestCards/             # Módulo de Test Cards
│   ├── Documentation/         # Módulo de Documentação
│   ├── Auth/                  # Módulo de Autenticação
│   ├── Users/                 # Módulo de Usuários
│   ├── Technicians/           # Módulo de Técnicos
│   └── Subscriptions/         # Módulo de Assinaturas
├── shared/                    # Componentes compartilhados
│   ├── components/            # UI Components
│   ├── guards/                # Route Guards
│   ├── services/              # APIs e serviços
│   └── utils/                 # Utilitários globais
└── App.tsx                    # Componente principal
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. **Execute o projeto**

```bash
npm run dev
```

2. **Acesse no navegador**

```
http://localhost:5173
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção

# Linting
npm run lint         # Executa ESLint
```

### 📚 Documentação Completa

A documentação detalhada está organizada na pasta [`docs/`](./docs/):

- **[📖 Índice da Documentação](./docs/README.md)** - Navegação completa
- **[🔧 Setup do Ambiente](./docs/development/setup.md)** - Guia de instalação detalhado
- **[🏗️ Arquitetura](./docs/architecture/overview.md)** - Visão técnica do sistema
- **[📝 Padrões de Código](./docs/development/coding-standards.md)** - Convenções e boas práticas
- **[⚡ Funcionalidades](./docs/features/)** - Documentação de cada módulo

## 🏗️ Arquitetura

### Padrões de Design

#### Modular

- Cada módulo tem sua própria estrutura completa
- Independência entre módulos
- Reutilização de componentes

#### Hooks Customizados

```typescript
// Exemplo: usePanelData
const { panels, loading, error, createPanel } = usePanelData();
```

#### Component Composition

```typescript
// Exemplo: PanelCard
<PanelCard
  panel={panel}
  onClick={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Gerenciamento de Estado

- **React State** - useState, useReducer
- **Context API** - Estado global quando necessário
- **Custom Hooks** - Lógica de estado reutilizável

### Tipagem TypeScript

```typescript
// Interfaces bem definidas
interface Panel {
  id: string;
  model: string;
  specifications: PanelSpecifications;
  // ...
}
```

## 🏗️ Arquitetura Avançada

### Sistema Multi-tenant

O sistema suporta múltiplos usuários com isolamento completo de dados:

```typescript
// Estrutura de dados por usuário
interface UserData {
  userId: string;
  companyId: string;
  subscription: SubscriptionPlan;
  database: {
    panels: Panel[];
    projects: Project[];
    technicians: Technician[];
    // ...
  };
}
```

### Controle de Acesso

```typescript
// Sistema de permissões por módulo
interface UserPermissions {
  panels: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  reports: {
    commercial: boolean;
    technical: boolean;
    advanced: boolean;
  };
  // ...
}
```

### Integração com Técnicos

**Abordagem Recomendada:** Os técnicos devem ser vinculados aos projetos durante a fase de planejamento, mas com flexibilidade para reatribuição:

1. **Cadastro Global de Técnicos** - Pool de técnicos disponíveis
2. **Atribuição por Projeto** - Técnicos específicos por projeto
3. **Notificação Automática** - Emails/SMS quando atribuídos
4. **Flexibilidade** - Reatribuição conforme necessidade

```typescript
interface ProjectTechnician {
  technicianId: string;
  projectId: string;
  role: "lead" | "assistant" | "specialist";
  assignedAt: Date;
  notificationsSent: boolean;
}
```

## 📊 Funcionalidades por Módulo

### Painéis

- ✅ Catálogo de painéis LED
- ✅ Especificações técnicas
- ✅ Cálculos de potência e dimensões
- ✅ Filtragem e busca
- ⏳ Test cards personalizados
- ⏳ Validação em campo

### Projetos

- ✅ CRUD de projetos
- ✅ Acompanhamento de progresso
- ✅ Controle de orçamento
- ✅ Gestão de clientes e localização
- ✅ Indicadores de risco
- ⏳ Atribuição de técnicos
- ⏳ Timeline de execução
- ⏳ Test cards de projeto

### Relatórios

- 🔄 Geração de PDF
- 🔄 Templates customizáveis
- 🔄 Relatórios técnicos
- 🔄 Listas de materiais
- ⏳ Relatórios comerciais (cliente)
- ⏳ Relatórios técnicos (equipe)
- ⏳ Relatórios por categoria
- ⏳ Dashboard executivo

### Gabinetes

- 🔄 Configuração de layouts
- 🔄 Arranjos visuais
- 🔄 Cálculos de instalação
- ⏳ Guias de cabeamento
- ⏳ Diagramas de conexão

### Agenda

- 🔄 Cronogramas de projeto
- 🔄 Agendamento de instalações
- 🔄 Gestão de recursos
- ⏳ Notificações automáticas
- ⏳ Sincronização com técnicos

### Test Cards

- ⏳ Gerador de cartões de teste
- ⏳ Templates por tipo de painel
- ⏳ QR codes para acesso rápido
- ⏳ Histórico de testes
- ⏳ Validação de qualidade

### Documentação

- ⏳ Guias de configuração
- ⏳ Manuais de cabeamento
- ⏳ Procedimentos de instalação
- ⏳ Troubleshooting
- ⏳ Biblioteca de conhecimento

### Autenticação & Usuários

- ⏳ Sistema de login/registro
- ⏳ Autenticação JWT
- ⏳ Recuperação de senha
- ⏳ Perfis de usuário
- ⏳ Controle de sessão

### Técnicos

- ⏳ Cadastro de técnicos
- ⏳ Especialidades e certificações
- ⏳ Agenda de disponibilidade
- ⏳ Sistema de notificações
- ⏳ Integração com projetos
- ⏳ Avaliação de performance

### Assinaturas

- ⏳ Plano Básico (funcionalidades essenciais)
- ⏳ Plano Profissional (relatórios avançados)
- ⏳ Plano Empresarial (multi-usuário)
- ⏳ Controle de features por plano
- ⏳ Sistema de billing

### Banco de Dados Multi-tenant

- ⏳ Isolamento por usuário/empresa
- ⏳ Backup automático
- ⏳ Sincronização offline
- ⏳ Importação/exportação de dados
- ⏳ Auditoria de alterações

**Legenda:** ✅ Implementado | 🔄 Em desenvolvimento | ⏳ Planejado

## 📋 Tipos de Relatórios

### Relatórios Comerciais (Cliente)

- **Proposta Comercial** - Orçamento detalhado e especificações
- **Cronograma de Execução** - Timeline visual do projeto
- **Documentação de Entrega** - Manual do usuário e garantias
- **Certificados de Qualidade** - Testes e validações realizados

### Relatórios Técnicos (Equipe)

- **Lista de Materiais** - BOM completa com códigos e quantidades
- **Diagramas de Instalação** - Layouts detalhados e cabeamento
- **Procedimentos de Teste** - Test cards e validações
- **Relatório de Campo** - Registro de instalação e ajustes

### Test Cards

#### Para Painéis

- **Teste de Pixels** - Verificação individual de LEDs
- **Calibração de Cores** - Ajuste de temperatura e brilho
- **Teste de Conectividade** - Validação de sinais e protocolos
- **Stress Test** - Teste de carga e temperatura

#### Para Projetos

- **Teste de Sistema** - Integração completa
- **Sincronização** - Alinhamento entre painéis
- **Performance** - Medição de FPS e latência
- **Aceitação Final** - Checklist de entrega

## 🔐 Planos de Assinatura

### Básico (Gratuito)

- Até 5 projetos
- Relatórios básicos
- 1 usuário
- Suporte por email

### Profissional (R$ 97/mês)

- Projetos ilimitados
- Relatórios avançados
- Test cards personalizados
- Até 5 usuários
- Integração com técnicos
- Suporte prioritário

### Empresarial (R$ 297/mês)

- Multi-empresa
- Usuários ilimitados
- API personalizada
- Backup automático
- Relatórios white-label
- Suporte dedicado
- Treinamento incluído

## 🚀 Próximos Passos de Desenvolvimento

### Fase 1: Sistema de Autenticação (4-6 semanas)

- [ ] Implementar JWT authentication
- [ ] Sistema de registro e login
- [ ] Recuperação de senha
- [ ] Controle de sessões
- [ ] Middleware de autorização

### Fase 2: Multi-tenancy e Banco de Dados (6-8 semanas)

- [ ] Arquitetura multi-tenant
- [ ] Isolamento de dados por usuário
- [ ] Sistema de backup automático
- [ ] APIs de importação/exportação
- [ ] Migração de dados

### Fase 3: Módulos Avançados (8-10 semanas)

- [ ] Gerador de Test Cards completo
- [ ] Sistema de documentação e guias
- [ ] Módulo de técnicos e notificações
- [ ] Relatórios avançados por categoria
- [ ] Sistema de assinaturas

### Fase 4: Recursos Empresariais (6-8 semanas)

- [ ] API RESTful completa
- [ ] Webhooks para integrações
- [ ] Dashboard analítico
- [ ] Sistema de auditoria
- [ ] Módulos de compliance

## 📈 Arquitetura de Desenvolvimento

### Tecnologias Backend Recomendadas

- **Node.js + Express** ou **Fastify** para API
- **PostgreSQL** com **Prisma ORM** para banco de dados
- **Redis** para cache e sessões
- **JWT** para autenticação
- **Nodemailer** para emails
- **Winston** para logging

### Estrutura de Deploy

```
├── Frontend (React + Vite)
├── Backend API (Node.js)
├── Database (PostgreSQL)
├── Cache (Redis)
├── File Storage (AWS S3 ou similar)
└── Email Service (SendGrid ou similar)
```

### Integração com Terceiros

- **Stripe** para pagamentos e assinaturas
- **Twilio** para SMS e notificações
- **AWS SES** para emails transacionais
- **Cloudinary** para upload de imagens
- **Auth0** (alternativa para autenticação)

## 🤝 Contribuindo

Este projeto segue uma arquitetura modular que facilita a contribuição:

1. **Escolha um módulo** para implementar
2. **Siga os padrões** definidos no `copilot-instructions.md`
3. **Implemente tipos primeiro**, depois hooks, utils e componentes
4. **Escreva testes** para funcionalidades críticas
5. **Documente** as funcionalidades implementadas

### Recomendações para Implementação

**Para Test Cards:**

- Priorize templates reutilizáveis
- Implemente QR codes para acesso mobile
- Crie sistema de versionamento de testes

**Para Sistema de Usuários:**

- Foque na segurança desde o início
- Implemente rate limiting
- Use validação robusta de dados

**Para Relatórios:**

- Comece com templates simples
- Implemente sistema de preview
- Adicione watermarks por plano

**Para Técnicos:**

- Integre com calendários externos
- Implemente notificações push
- Crie sistema de avaliação

---

**LED Panel Manager** - Transformando o Gerenciamento de Painéis LED em uma Experiência Profissional Completa 🚀

_Versão: 2.0.0 (Roadmap Expandido)_

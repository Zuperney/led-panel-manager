# Copilot Instructions for Led Panel Manager

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a **Led Panel Manager** application - a comprehensive LED panel management system built with React + TypeScript + Vite. The application manages LED panel projects, cabinet configurations, reports, and scheduling.

## Architecture Guidelines

### Modular Structure

- Use a **modular architecture** with separate modules for each feature
- Each module should have its own `hooks/`, `components/`, `utils/`, and `types/` directories
- Follow the pattern: `src/modules/[ModuleName]/`

### Component Guidelines

- Use **functional components** with TypeScript
- Prefer **custom hooks** for complex state logic
- Use **compound component patterns** for related UI elements
- Keep components **single-responsibility** and focused

### State Management

- Use React's built-in state management (useState, useReducer, useContext)
- Create custom hooks for shared state logic
- Use **Context API** for global state when needed

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `LedPanelCard.tsx`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `usePanelData.ts`)
- Utilities: `camelCase.ts` (e.g., `panelCalculations.ts`)
- Types: `camelCase.types.ts` (e.g., `panel.types.ts`)

### Code Style

- Use **TypeScript** strictly - avoid `any` types
- Prefer **interface** over `type` for object definitions
- Use **arrow functions** for components and handlers
- Add **JSDoc comments** for complex functions
- Use **modern React patterns** (hooks, functional components)

### UI Guidelines

- Use a consistent **design system** with reusable UI components
- Implement **responsive design** for all components
- Use **Tailwind CSS** or similar utility-first CSS framework
- Follow **accessibility best practices** (ARIA labels, keyboard navigation)

## Business Logic

### Core Modules

1. **Panels** - LED panel specifications and configurations
2. **Projects** - Project management and tracking
3. **Cabinets** - Cabinet configurations and layouts
4. **Reports** - PDF generation and data visualization
5. **Schedule** - Project scheduling and timeline management

### Key Features

- **LED Panel Calculations** - Power, dimensions, pixel density
- **PDF Report Generation** - Technical specifications and layouts
- **Project Management** - CRUD operations with status tracking
- **Cabinet Configuration** - Visual layout and arrangement tools
- **Data Persistence** - Local storage and export capabilities

### Technical Requirements

- **Performance** - Optimize for large datasets and complex calculations
- **Responsiveness** - Support mobile and desktop interfaces
- **Extensibility** - Easy to add new panel types and features
- **Data Integrity** - Validate all inputs and calculations

## Development Guidelines

### Error Handling

- Use **try-catch** blocks for async operations
- Implement **error boundaries** for component error handling
- Provide **user-friendly error messages**
- Log errors for debugging while avoiding sensitive data

### Performance

- Use **React.memo** for expensive renders
- Implement **lazy loading** for heavy components
- Use **useMemo** and **useCallback** appropriately
- Optimize **bundle size** with code splitting

### Testing

- Write **unit tests** for utility functions
- Use **React Testing Library** for component testing
- Test **user interactions** and **edge cases**
- Maintain **high test coverage** for critical paths

When generating code for this project, prioritize clean, maintainable, and scalable solutions that follow these guidelines.

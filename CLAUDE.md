# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `bun run dev`
- **Build**: `npm run build` or `bun run build` (runs TypeScript compilation + Vite build)
- **Linting**: `npm run lint` or `bun run lint` 
- **Preview production build**: `npm run preview` or `bun run preview`

Note: This project uses Bun as the package manager (bun.lock present). Prefer `bun` commands over `npm`.

## Architecture Overview

This is a React + TypeScript financial management application built with:

### Core Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7 with nested routes
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **HTTP Client**: Axios with automatic camelCase/snake_case conversion via `humps`
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **PWA**: Vite PWA plugin with service worker support

### Project Structure
```
src/
├── clients/          # API client classes (Dashboard, Budget, Expense, Income)
├── components/       # Reusable React components
│   ├── ui/          # shadcn/ui components
│   └── theme-provider.tsx, PWAProvider.tsx
├── lib/             # Utility functions
├── pages/           # Route components organized by feature
│   ├── budget/      # Budget management
│   ├── dashboard/   # Main dashboard
│   ├── expenses/    # Expense tracking
│   └── income/      # Income management
├── types/           # TypeScript type definitions
└── assets/          # Static assets
```

### API Integration
- Base API URL: `https://api.felipecisotto.com.br/financial` (configurable via `VITE_API_URL`)
- All API clients extend base `Client` class (`src/clients/client.ts`)
- Automatic request/response transformation between camelCase (frontend) and snake_case (backend)
- Each domain has its own client class (Budget, Expense, Income, Dashboard)

### Routing Architecture
- Uses React Router v7 with nested routing
- Layout component provides navigation and theme context
- Route structure matches domain features: `/budgets`, `/expenses`, `/incomes`
- Form routes support both create (`/budget`) and edit (`/budget/:id`) modes

### Component Architecture
- Uses shadcn/ui component library with "new-york" style
- Path aliases configured: `@/` maps to `src/`
- Components are organized in `ui/` for reusable components
- Theme provider supports dark/light mode with system preference detection

### PWA Configuration
- Service worker enabled with auto-update
- Caches API responses for offline functionality
- Custom caching strategy for API calls with 24-hour expiration
- Manifest configured for "Financial App" with proper icons

### Development Notes
- TypeScript strict mode enabled
- ESLint configured with React hooks and refresh plugins
- Dark theme is the default
- Portuguese language used in navigation and UI
- Sonner for toast notifications positioned top-right
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 admin dashboard template built with Mantine 7, TypeScript, and React 19. Self-contained template with mock data — no real backend required.

## Essential Development Commands

### Development
```bash
pnpm dev                     # Start development server at http://localhost:3000
pnpm build                   # Build production bundle
pnpm start                   # Start production server
pnpm lint                    # Run ESLint
pnpm prettier                # Format all files with Prettier
```

### Storybook
```bash
pnpm storybook               # Start Storybook dev server on port 6006
pnpm build-storybook         # Build Storybook for production
```

### Code Generation
```bash
pnpm generate:component MyComponent          # Generate basic component scaffold
pnpm generate:component MyComponent interactive  # Component with 'use client'
pnpm generate:component MyComponent table    # Component extending BaseTable
pnpm generate:component MyComponent card     # Component extending BaseCard
```

### Git & Versioning
```bash
pnpm changeset:add           # Add a new changeset
pnpm changeset:release       # Version packages based on changesets
pnpm commitlint              # Validate commit messages
```

## Architecture Overview

### Directory Structure
- **`src/`**: All application source code
  - **`app/`**: Next.js App Router pages and layouts
    - `dashboard/` — 13 dashboard variants (default, analytics, saas, ecommerce, crm, finance, marketing, healthcare, education, logistics, hr, real-estate, llm)
    - `apps/` — Feature modules (calendar, chat, customers, email, file-manager, invoices, notifications, orders, products, profile, projects, settings, tasks)
    - `auth/` — Auth pages (signin, signup, password-reset, clerk, auth0)
    - `api/` — API routes serving mock data
  - **`components/`**: Feature components + `shared/` (BaseTable, BaseCard)
  - **`layouts/`**: Guest (auth pages) and Main (authenticated app with sidebar/header)
  - **`contexts/`**: ThemeCustomizerContext, SystemNotificationsContext
  - **`providers/`**: Providers tree — SystemNotificationsProvider → ThemeCustomizerProvider → ThemeProvider
  - **`routes/`**: Route path definitions (`src/routes/index.ts`)
  - **`theme/`**: Mantine theme config generated from ThemeCustomizer state
  - **`types/`**, **`utils/`**, **`hooks/`**, **`constants/`**: Supporting code
- **`public/mocks/`**: Mock JSON data files
- **`stories/`**: Storybook stories
- **`middleware.ts`**: At project root (not in `src/`) — currently passes all requests through; auth is not enforced

### Authentication

Auth pages exist but **middleware does not enforce authentication** — all routes are public for demo purposes. Multiple auth integrations are scaffolded: mock credentials (signin/signup), Clerk (`/auth/clerk`), Auth0 (`/auth/auth0`).

Demo credentials: `demo@example.com` / `demo123`

### API System (Mock Data)

All API routes read from `public/mocks/*.json` and return a consistent envelope:

```typescript
{ succeeded: boolean; data: T; errors: string[]; message: string; }
```

Available endpoints: `/api/products`, `/api/invoices`, `/api/projects`, `/api/orders`, `/api/sales`, `/api/stats`, `/api/traffic`, `/api/tasks`, `/api/chat`, `/api/profile`, `/api/customers`, `/api/emails`, `/api/languages`, `/api/ecommerce`, `/api/finance`, `/api/healthcare`, `/api/hr`, `/api/logistics`, `/api/marketing`, `/api/real-estate`

### Theme System

Live theme customizer — changes persist to `localStorage`:

- **ThemeCustomizerContext** (`src/contexts/theme-customizer/`): Source of truth for theme config
- **ThemeProvider** (`src/providers/theme.tsx`): Builds MantineProvider from current config
- Customizable: primary color, border radius, compact mode, color scheme, sidebar width, header height

### Path Management

All routes are defined in `src/routes/index.ts`. Never hardcode paths:

```typescript
import { PATH_DASHBOARD, PATH_APPS } from '@/routes';
PATH_DASHBOARD.default          // '/dashboard/default'
PATH_APPS.invoices.root         // '/apps/invoices'
PATH_APPS.invoices.invoice_details(id)  // dynamic
```

## Important Development Patterns

### Fetching Data

```typescript
import { useFetch } from '@mantine/hooks';
import { IApiResponse } from '@/types/api-response';

const { data, loading, error } = useFetch<IApiResponse<Product[]>>('/api/products');
const products = data?.data;
```

### Adding New Mock Data

1. Add `public/mocks/YourData.json`
2. Create `src/app/api/your-endpoint/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), 'public', 'mocks', 'YourData.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return NextResponse.json({ succeeded: true, data, errors: [], message: 'OK' });
}
```

### Creating New Components

Prefer the generator: `pnpm generate:component MyComponent [type]`

Manual: place in `src/components/MyComponent/` with an index file. Use `BaseTable` or `BaseCard` from `@/components/shared` as base for table/card variants. Add a Storybook story in `stories/` for reusable components.

### Adding Routes

1. Define path constant in `src/routes/index.ts`
2. Create page in `src/app/`
3. Add to navigation/sidebar if needed

### Path Aliases

`@/` maps to `src/` (configured in `tsconfig.json`).

## Tech Stack

- **Next.js 16** with React Compiler enabled (`reactCompiler: true` in `next.config.js`)
- **React 19** — client components need `'use client'` directive
- **Mantine 7** — import from `@mantine/core`, `@mantine/hooks`, `@mantine/charts`, etc.
- **TypeScript** strict mode
- **pnpm** as package manager
- **Husky** pre-commit: runs Prettier on staged files
- **Commitlint** enforces conventional commits

## Converting to Real API

1. Replace file reads in `src/app/api/*/route.ts` with real API calls
2. Update auth logic (currently mock; Clerk/Auth0 stubs are already present)
3. Add `NEXT_PUBLIC_API_URL` env var
4. Update `src/types/` to match backend DTOs
5. Re-enable route protection in `middleware.ts`

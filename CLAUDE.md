# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 14 admin dashboard template built with Mantine 7, TypeScript, and React 18. This is a **self-contained template** with mock data and authentication, perfect for showcasing UI/UX patterns and as a starting point for admin dashboards.

## Essential Development Commands

### Development
```bash
npm run dev                  # Start development server at http://localhost:3000
npm run build               # Build production bundle
npm start                   # Start production server
npm run lint                # Run ESLint
npm run prettier            # Format all files with Prettier
```

### Storybook
```bash
npm run storybook           # Start Storybook dev server on port 6006
npm run build-storybook     # Build Storybook for production
```

### Git & Versioning
```bash
npm run changeset:add       # Add a new changeset
npm run changeset:release   # Version packages based on changesets
npm run commitlint          # Validate commit messages
```

## Architecture Overview

### Directory Structure
- **`src/`**: All application source code (follows Next.js 13+ recommendation)
  - **`app/`**: Next.js App Router pages and layouts
    - `dashboard/` - Dashboard variants (default, analytics, saas)
    - `apps/` - Feature modules (invoices, projects, chat, etc.)
    - `auth/` - Authentication pages
    - `api/` - **API routes serving mock data**
  - **`components/`**: Reusable UI components (organized by feature)
  - **`lib/`**: Core utilities
    - `hooks/useApi.ts` - Simple API data fetching hooks
  - **`layouts/`**: Layout components (Guest, Main)
  - **`contexts/`**: React contexts (theme customizer, etc.)
  - **`providers/`**: React providers
  - **`routes/`**: Route path definitions
  - **`theme/`**: Mantine theme configuration
  - **`utils/`**: Shared utility functions
  - **`hooks/`**: Custom React hooks
  - **`types/`**: TypeScript type definitions
  - **`constants/`**: Application constants
  - **`middleware.ts`**: Next.js middleware for route protection
- **`public/mocks/`**: **Mock JSON data files**

### Authentication Flow

Uses **NextAuth with mock credentials** for demo purposes:

1. **Mock Users** (defined in `auth.ts`):
   - `demo@example.com` / `demo123` (Admin)
   - `jane@example.com` / `demo123` (User)

2. **Middleware** (`middleware.ts`): Protects routes, redirects unauthenticated users
3. **Session Management**: NextAuth JWT tokens with user role
4. **AuthProvider** (`components/auth/AuthProvider.tsx`): Wraps app with session context

Protected routes require valid session; auth pages redirect authenticated users to dashboard.

### API System (Mock Data)

This template uses **local mock data** served through Next.js API routes:

#### API Routes (`src/app/api/`)
All routes return data from `public/mocks/*.json`:
- `/api/products` - Product catalog
- `/api/invoices` - Invoice management
- `/api/projects` - Project tracking
- `/api/orders` - Order management
- `/api/sales` - Sales analytics
- `/api/stats` - Dashboard statistics
- `/api/traffic` - Traffic analytics
- `/api/tasks` - Task/Kanban board
- `/api/chat` - Chat messages
- `/api/profile` - User profile

#### Response Format
```typescript
{
  succeeded: boolean;
  data: T;
  errors: string[];
  message: string;
}
```

#### Using API Hooks
```typescript
import { useFetch } from '@mantine/hooks';

// Simple data fetching
const { data, loading, error, refetch } = useFetch('/api/products');

// Access data
const products = data?.data; // Array of products
```

### Theme System

The app uses a custom theme customizer system with live preview:

- **ThemeCustomizerContext** (`src/contexts/theme-customizer/`): Manages theme state
- **Dynamic Theme** (`src/theme/`): Mantine theme generated from config
- **CSS Custom Properties**: Applied via `ThemeCSS.applyCustomProperties()`
- **Customizable aspects**: Primary color, border radius, compact mode, color scheme, sidebar width, header height
- **Persistence**: Theme config saved to localStorage

### Layout System

- **Guest Layout** (`src/layouts/Guest/`): For auth pages (signin, signup)
- **Main Layout** (`src/layouts/Main/`): Authenticated app layout with sidebar and header
- **Route-based selection**: Middleware and page layouts determine which to use

### Path Management

All routes defined in `src/routes/index.ts`:
- Use helper functions like `PATH_DASHBOARD.default`, `PATH_APPS.invoices.root`
- Supports dynamic routes: `PATH_APPS.invoices.invoice_details(id)`
- Never hardcode paths; always import from `@/routes`

## Important Development Patterns

### Fetching Data from APIs

```typescript
import { useFetch } from '@mantine/hooks';
import { IApiResponse } from '@/types/api-response';

function MyComponent() {
  const { data, loading, error, refetch } = useFetch<IApiResponse<Product[]>>('/api/products');

  if (loading) return <Skeleton />;
  if (error) return <ErrorAlert />;

  return (
    <div>
      {data?.data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Creating New Mock Data

1. Add JSON file to `public/mocks/YourData.json`
2. Create API route in `src/app/api/your-endpoint/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), 'public', 'mocks', 'YourData.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return NextResponse.json({
    succeeded: true,
    data,
    errors: [],
    message: 'Data retrieved successfully'
  });
}
```

### Creating New Components
- Place in `src/components/[ComponentName]/`
- Include index file exporting component
- Add Storybook story if it's a reusable component
- Use Mantine components as base; import from `@mantine/core`

### Adding Routes
1. Define path in `src/routes/index.ts`
2. Create page in appropriate `src/app/` directory
3. Update middleware (`src/middleware.ts`) if route requires special auth handling
4. Add to navigation/sidebar if needed

### Path Aliases
Use `@/` prefix for imports (configured in `tsconfig.json`):
```typescript
import { Component } from '@/components';
import { PATH_DASHBOARD } from '@/routes';
import { useFetch } from '@mantine/hooks';
```

## Tech Stack Notes

- **Next.js 14**: App Router (not Pages Router)
- **Mantine 7**: UI component library - import from `@mantine/core`, `@mantine/hooks`, etc.
- **React 18**: Client components need `'use client'` directive
- **TypeScript**: Strict mode enabled
- **NextAuth**: Mock credentials-based auth with JWT tokens
- **useFetch** (from `@mantine/hooks`): Used for all data fetching

## Code Style

- **Prettier** configured - run `npm run prettier` before commits
- **ESLint** configured - run `npm run lint` to check
- **Husky** pre-commit hooks run Prettier on staged files
- **Commitlint** enforces conventional commits
- Import order: external packages, then internal with `@/`

## Testing

No test suite currently configured (test script is empty).

## Converting to Real API

To connect this template to a real backend:

1. **Update API Routes**: Replace file reads with actual API calls in `src/app/api/*/route.ts`
2. **Authentication**: Update authentication logic to call your auth API instead of checking mock users
3. **Environment Variables**: Add `NEXT_PUBLIC_API_URL` for your backend URL
4. **Types**: Update types in `src/types/` to match your backend DTOs
5. **Error Handling**: Enhance error handling for network failures, auth errors, etc.

## Demo Credentials

```
Email: demo@example.com
Password: demo123
```

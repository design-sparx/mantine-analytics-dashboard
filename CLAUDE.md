# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 14 admin dashboard template built with Mantine 7, TypeScript, React 18, and featuring type-safe API integration with RBAC (Role-Based Access Control). The project uses the App Router architecture and includes authentication via NextAuth/Clerk.

## Essential Development Commands

### Development

```bash
npm run dev                  # Start development server at http://localhost:3000
npm run build               # Build production bundle
npm start                   # Start production server
npm run lint                # Run ESLint
npm run prettier            # Format all files with Prettier
```

### API Integration

```bash
npm run generate:types      # Generate TypeScript types from OpenAPI spec
                           # Uses API_URL env var or http://localhost:5080
API_URL=https://api.example.com npm run generate:types  # Use custom API
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

- **`app/`**: Next.js App Router pages and layouts
  - `dashboard/` - Dashboard variants (default, analytics, saas)
  - `apps/` - Feature modules (invoices, projects, chat, etc.)
  - `auth/` - Authentication pages
  - `api/` - API routes
- **`components/`**: Reusable UI components (organized by feature)
- **`lib/`**: Core utilities and API integration
  - `api.d.ts` - Auto-generated OpenAPI types (DO NOT edit manually)
  - `api/` - API client utilities and permissions
  - `endpoints/` - API endpoint hooks and helpers
- **`layouts/`**: Layout components (Guest, Main)
- **`contexts/`**: React contexts (theme customizer, etc.)
- **`providers/`**: React providers
- **`routes/`**: Route path definitions
- **`theme/`**: Mantine theme configuration
- **`utils/`**: Shared utility functions
- **`hooks/`**: Custom React hooks
- **`types/`**: TypeScript type definitions
- **`scripts/`**: Build and utility scripts

### Authentication Flow

The app uses NextAuth with custom authentication:

1. **Middleware** (`middleware.ts`): Protects routes, redirects unauthenticated users
2. **Session Management**: Uses NextAuth JWT tokens with custom session data including permissions
3. **AuthProvider** (`components/auth/AuthProvider.tsx`): Wraps app with session context
4. Protected routes require valid session; auth pages redirect authenticated users to dashboard

### API Integration System

The project features a **type-safe API integration** with auto-generated types from OpenAPI specs:

#### Key Files

- **`lib/api.d.ts`**: Auto-generated from OpenAPI spec via `generate:types` script
- **`lib/endpoints/api-utils.ts`**: Core API utilities using Mantine's `useFetch`
  - `useApiGet<T>()` - GET requests with auth and permission checks
  - `useApiPost<T>()` - POST with automatic data refresh
  - `useApiPut<T>()` - PUT with automatic data refresh
  - `useApiDelete<T>()` - DELETE with automatic data refresh
- **`lib/endpoints/`**: Feature-specific API hooks (invoices, projects, sales, etc.)

#### API Hook Pattern

All API hooks follow this pattern:

```typescript
export function useInvoicesWithMutations() {
  const query = useApiGet<Invoice[]>('/api/invoices', {
    permission: 'Permissions.Personal.Invoices'
  });

  const { mutate: create } = useApiPost<Invoice>('/api/invoices', {
    onSuccess: () => query.refetch()  // Auto-refresh after mutation
  });

  return { ...query, mutations: { create, update, delete } };
}
```

#### Working with APIs

1. **Update OpenAPI spec** on backend with proper tags (use `INCLUDE_TAGS` in `scripts/generate-api-types.js`)
2. **Run `npm run generate:types`** to regenerate `lib/api.d.ts`
3. **Create endpoint hooks** in `lib/endpoints/` using generated types
4. **Import and use** in components with full TypeScript autocomplete

### RBAC Permission System

Location: `lib/api/permissions/`

#### Permission Types (from `types.ts`)

- **Admin**: `Permissions.Admin.*` - System administration (user management, settings)
- **Team**: `Permissions.Team.*` - Collaborative resources (projects, orders, analytics)
- **Personal**: `Permissions.Personal.*` - Private user data (profile, invoices, files)
- **Users**: `Permissions.Users.ViewDirectory` - User directory access

#### Roles

- **Admin**: Full system access + user management
- **User**: Team collaboration + personal data

#### Usage in Components

```typescript
import { PermissionGate, useHasPermission } from '@/lib/api/permissions';

// Declarative - hide/show UI
<PermissionGate permission="Permissions.Team.Projects">
  <ProjectManager />
</PermissionGate>

// Multiple permissions
<MultiPermissionGate permissions={[...]} mode="any">
  <Component />
</MultiPermissionGate>

// Programmatic
const canEdit = useHasPermission('Permissions.Personal.Invoices');
```

### Theme System

The app uses a custom theme customizer system with live preview:

- **ThemeCustomizerContext** (`contexts/theme-customizer/`): Manages theme state
- **Dynamic Theme** (`theme/`): Mantine theme generated from config
- **CSS Custom Properties**: Applied via `ThemeCSS.applyCustomProperties()`
- **Customizable aspects**: Primary color, border radius, compact mode, color scheme, sidebar width, header height
- **Persistence**: Theme config saved to localStorage

### Layout System

- **Guest Layout** (`layouts/Guest/`): For auth pages (signin, signup)
- **Main Layout** (`layouts/Main/`): Authenticated app layout with sidebar and header
- **Route-based selection**: Middleware and page layouts determine which to use

### Path Management

All routes defined in `routes/index.ts`:

- Use helper functions like `PATH_DASHBOARD.default`, `PATH_APPS.invoices.root`
- Supports dynamic routes: `PATH_APPS.invoices.invoice_details(id)`
- Never hardcode paths; always import from `@/routes`

## Important Development Patterns

### Adding New API Endpoints

1. Ensure backend OpenAPI spec includes endpoint with appropriate tag from `INCLUDE_TAGS`
2. Run `npm run generate:types` to update `lib/api.d.ts`
3. Create hook in `lib/endpoints/[feature].ts` using `useApiGet`/`useApiPost`/etc.
4. Add permission checks if needed
5. Export from `lib/endpoints/index.ts`

### Creating New Components

- Place in `components/[ComponentName]/`
- Include index file exporting component
- Add Storybook story if it's a reusable component
- Use Mantine components as base; import from `@mantine/core`

### Adding Routes

1. Define path in `routes/index.ts`
2. Create page in appropriate `app/` directory
3. Update middleware if route requires special auth handling
4. Add to navigation/sidebar if needed

### Path Aliases

Use `@/` prefix for imports (configured in `tsconfig.json`):

```typescript
import { Component } from '@/components';
import { PATH_DASHBOARD } from '@/routes';
import { useApiGet } from '@/lib/endpoints/api-utils';
```

## Tech Stack Notes

- **Next.js 14**: App Router (not Pages Router)
- **Mantine 7**: UI component library - import from `@mantine/core`, `@mantine/hooks`, etc.
- **React 18**: Client components need `'use client'` directive
- **TypeScript**: Strict mode enabled
- **NextAuth**: Custom auth with JWT tokens and session management
- **useFetch** (from `@mantine/hooks`): Used for all API calls, NOT fetch/axios
- **openapi-typescript**: Generates types from OpenAPI spec - never edit `lib/api.d.ts` manually

## Code Style

- **Prettier** configured - run `npm run prettier` before commits
- **ESLint** configured - run `npm run lint` to check
- **Husky** pre-commit hooks run Prettier on staged files
- **Commitlint** enforces conventional commits
- Import order: external packages, then internal with `@/`

## Testing

No test suite currently configured (test script is empty).

## Documentation References

- Full API integration guide: `docs/API_INTEGRATION.md`
- RBAC system documentation: `docs/RBAC_SYSTEM.md`
- Changelog: `CHANGELOG.md`

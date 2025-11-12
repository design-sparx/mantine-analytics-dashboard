# API Integration Guide

This project uses a type-safe, permission-aware API integration system built with OpenAPI, TypeScript, and Mantine hooks.

## 🚀 Quick Start

### 1. Generate API Types

```bash
# Generate types from your development backend
npm run generate:types:dev

# Or specify a custom API URL
API_URL=https://your-api.com npm run generate:types
```

### 2. Use Type-Safe API Hooks

```typescript
import { useInvoicesWithMutations } from '@/lib/api/hooks/invoices';

function InvoicesPage() {
  const { data, loading, error, mutations } = useInvoicesWithMutations();

  const handleCreate = async () => {
    await mutations.create({
      title: "New Invoice",
      amount: 100
    }); // ✅ Fully typed with autocomplete
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.map(invoice => (
        <div key={invoice.id}>{invoice.title}</div>
      ))}
      <button onClick={handleCreate}>Create Invoice</button>
    </div>
  );
}
```

### 3. Add Permission-Based UI

```typescript
import { PermissionGate, useHasPermission } from '@/lib/api/permissions';

function MyComponent() {
  const canEdit = useHasPermission('Permissions.Team.Projects');

  return (
    <div>
      {/* Show/hide entire components */}
      <PermissionGate permission="Permissions.Personal.Invoices">
        <CreateInvoiceButton />
      </PermissionGate>

      {/* Conditional logic */}
      {canEdit && <EditButton />}

      {/* Admin-only content */}
      <AdminOnly>
        <UserManagementPanel />
      </AdminOnly>
    </div>
  );
}
```

## 📁 Architecture Overview

```
lib/
├── api.d.ts                    # 🤖 Auto-generated OpenAPI types
├── api-client.ts              # 🔧 Mantine useFetch + auth wrapper
└── api/
    ├── hooks/                 # 🎣 Type-safe API hooks
    │   ├── auth.ts           # Authentication & profile
    │   ├── projects.ts       # Projects CRUD operations
    │   ├── invoices.ts       # Invoices CRUD operations
    │   └── index.ts          # Export all hooks
    └── permissions/          # 🔒 RBAC system
        ├── types.ts         # Permission type definitions
        ├── utils.ts         # Permission utilities
        ├── hooks.ts         # Permission hooks
        ├── components.tsx   # Permission components
        └── index.ts         # Export all permissions
```

## 🔒 RBAC (Role-Based Access Control)

### Permission Categories

| Category | Description | Example Permissions |
|----------|-------------|-------------------|
| **Admin** | System administration | `Permissions.Admin.UserManagement` |
| **Team** | Collaborative resources | `Permissions.Team.Projects` |
| **Personal** | User's private data | `Permissions.Personal.Invoices` |
| **Users** | User directory access | `Permissions.Users.ViewDirectory` |

### Data Visibility Patterns

- **`team_wide`**: All users can see/modify (Projects, Orders)
- **`owner_only`**: Users only see their own data (Invoices, Profile)
- **`admin_only`**: Only admins can access (User Management)
- **`owner_only_with_sharing`**: Personal with sharing (Files)

### Available Roles

- **Admin**: Full system access including user management
- **User**: Standard access to team collaboration and personal data

## 🛠️ Available API Hooks

### Authentication
```typescript
import { useAuth } from '@/lib/api/hooks/auth';

const { profile, mutations, isAuthenticated } = useAuth();

// Login
await mutations.login({ email, password });

// Register
await mutations.register({ email, password, username });

// Update profile
await mutations.updateProfile({ email, phoneNumber });

// Logout
mutations.logout();
```

### Projects (Team Collaboration)
```typescript
import { useProjectsWithMutations } from '@/lib/api/hooks/projects';

const { data, loading, error, mutations } = useProjectsWithMutations();

// Create project
await mutations.create({ name, description });

// Update project
await mutations.update(id, { name: "Updated" });

// Delete project
await mutations.delete(id);
```

### Invoices (Personal Data)
```typescript
import { useInvoicesWithMutations } from '@/lib/api/hooks/invoices';

const { data, loading, error, mutations } = useInvoicesWithMutations();

// All mutations automatically refresh data
await mutations.create({ title, amount, clientId });
await mutations.update(id, { title: "Updated" });
await mutations.delete(id);
```

## 🎯 Permission System

### Permission Hooks
```typescript
import {
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  useIsAdmin
} from '@/lib/api/permissions';

// Single permission check
const canCreateInvoices = useHasPermission('Permissions.Personal.Invoices');

// Multiple permissions (any)
const canAccessTeamFeatures = useHasAnyPermission([
  'Permissions.Team.Projects',
  'Permissions.Team.Orders'
]);

// Multiple permissions (all required)
const canManageSystem = useHasAllPermissions([
  'Permissions.Admin.UserManagement',
  'Permissions.Admin.SystemSettings'
]);

// Admin check
const isAdmin = useIsAdmin();
```

### Permission Components
```typescript
import { PermissionGate, AdminOnly, MultiPermissionGate } from '@/lib/api/permissions';

// Single permission gate
<PermissionGate permission="Permissions.Team.Projects">
  <ProjectsManager />
</PermissionGate>

// Multiple permissions (any or all)
<MultiPermissionGate
  permissions={['Permissions.Team.Projects', 'Permissions.Team.Orders']}
  mode="any" // or "all"
>
  <TeamDashboard />
</MultiPermissionGate>

// Admin only
<AdminOnly>
  <UserManagementPanel />
</AdminOnly>

// With fallback message
<PermissionGate
  permission="Permissions.Personal.Invoices"
  showFallback={true}
  fallback={<div>You need invoice permissions to access this.</div>}
>
  <InvoiceEditor />
</PermissionGate>
```

## 🔧 Adding New API Endpoints

### 1. Update Backend OpenAPI Spec
Add your new endpoints with proper tags:
- `Authentication` - Auth endpoints
- `Mantine - [Feature]` - Feature-specific endpoints
- Common/shared endpoints for general use

### 2. Regenerate Types
```bash
npm run generate:types:dev
```

### 3. Create API Hook
```typescript
// lib/api/hooks/new-feature.ts
import { useApiGet, apiPost, apiPut, apiDelete } from '../../api-client';
import type { components } from '../../api';

type FeatureDto = components['schemas']['FeatureDto'];

export function useFeatures() {
  return useApiGet('/api/v1/mantine/features', {
    permission: 'Permissions.Team.Features' // Auto-disables without permission
  });
}

export function useFeatureWithMutations() {
  const featuresQuery = useFeatures();

  const mutations = {
    create: async (data: FeatureDto) => {
      const result = await apiPost('/api/v1/mantine/features', data);
      featuresQuery.refetch();
      return result;
    },
    // ... other mutations
  };

  return { ...featuresQuery, mutations };
}
```

### 4. Update Permissions (if needed)
```typescript
// lib/api/permissions/types.ts
export type Permission =
  // ... existing permissions
  | 'Permissions.Team.Features'
  | 'Permissions.Personal.NewFeature';
```

## 🏗️ Development Workflow

1. **Backend First**: Update your OpenAPI spec with new endpoints
2. **Generate Types**: Run `npm run generate:types:dev`
3. **Create Hooks**: Add new API hooks in `lib/api/hooks/`
4. **Add Permissions**: Update permission types if needed
5. **Use in Components**: Import and use your new type-safe hooks

## 🐛 Troubleshooting

### Type Generation Issues
```bash
# Check if your backend is running
curl http://localhost:5080/swagger/v1/swagger.json

# Verify the OpenAPI spec structure
cat lib/api.d.ts | head -20
```

### Permission Issues
```typescript
// Debug current user permissions
import { usePermissions } from '@/lib/api/permissions';

function DebugPermissions() {
  const permissions = usePermissions();
  console.log('Current permissions:', permissions);
  return <pre>{JSON.stringify(permissions, null, 2)}</pre>;
}
```

### API Errors
```typescript
// All hooks include error handling
const { data, loading, error } = useProjects();

if (error) {
  console.error('API Error:', error);
  // Handle specific error cases
}
```

## 📚 Examples

See the migrated components for real-world usage:
- `app/apps/invoices/page.tsx` - Personal data with owner-only access
- `app/apps/projects/page.tsx` - Team collaboration with shared access

## 🤝 Contributing

When adding new features:
1. Follow the established patterns in existing hooks
2. Add proper TypeScript types using OpenAPI schemas
3. Include permission checks for RBAC
4. Test with different user roles
5. Update this documentation if needed

## 📝 Notes

- API calls automatically include authentication headers
- Permissions are checked both on UI level and API level
- All mutations automatically refresh related data
- Type safety is enforced throughout the entire flow
- The system scales automatically as you add OpenAPI endpoints

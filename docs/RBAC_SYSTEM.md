# RBAC (Role-Based Access Control) System

This project implements a comprehensive permission-based authorization system that controls both API access and UI rendering.

## 🎯 Overview

The RBAC system provides:
- **Type-safe permissions** with TypeScript integration
- **Automatic UI filtering** based on user permissions
- **API-level authorization** with permission checks
- **Flexible role hierarchy** supporting Admin and User roles
- **Component-level access control** with React components

## 🏗️ System Architecture

### Core Components

```
lib/api/permissions/
├── types.ts          # Permission and role type definitions
├── utils.ts          # Permission checking utilities
├── hooks.ts          # React hooks for permission management
├── components.tsx    # React components for conditional rendering
└── index.ts          # Main exports
```

## 👥 Roles & Permissions

### Available Roles

| Role | Description | Hierarchy Level |
|------|-------------|----------------|
| **Admin** | Full system access including user management | 100 |
| **User** | Standard user with team collaboration access | 10 |

### Permission Categories

#### 🔧 Admin Permissions
- `Permissions.Admin.UserManagement` - Create, edit, delete users and manage roles
- `Permissions.Admin.SystemSettings` - Configure system-wide settings

#### 👥 Team Permissions (Collaborative)
- `Permissions.Team.Projects` - Full CRUD access to team projects
- `Permissions.Team.Orders` - Full CRUD access to orders
- `Permissions.Team.KanbanTasks` - Manage kanban board tasks
- `Permissions.Team.Analytics` - Access sales data and analytics

#### 👤 Personal Permissions (Owner-Only)
- `Permissions.Personal.Profile` - Manage own user profile
- `Permissions.Personal.Invoices` - Create and manage own invoices
- `Permissions.Personal.Files` - Manage personal files with sharing
- `Permissions.Personal.Chats` - Access personal messages

#### 📁 User Directory
- `Permissions.Users.ViewDirectory` - View basic info about other users

## 🎣 Permission Hooks

### Basic Permission Checking

```typescript
import { useHasPermission } from '@/lib/api/permissions';

function MyComponent() {
  const canCreateInvoices = useHasPermission('Permissions.Personal.Invoices');
  const canManageUsers = useHasPermission('Permissions.Admin.UserManagement');

  return (
    <div>
      {canCreateInvoices && <CreateInvoiceButton />}
      {canManageUsers && <UserManagementPanel />}
    </div>
  );
}
```

### Multiple Permission Checks

```typescript
import {
  useHasAnyPermission,
  useHasAllPermissions
} from '@/lib/api/permissions';

function TeamDashboard() {
  // User needs ANY of these permissions to access
  const canAccessTeamFeatures = useHasAnyPermission([
    'Permissions.Team.Projects',
    'Permissions.Team.Orders',
    'Permissions.Team.Analytics'
  ]);

  // User needs ALL permissions for admin panel
  const canAccessAdminPanel = useHasAllPermissions([
    'Permissions.Admin.UserManagement',
    'Permissions.Admin.SystemSettings'
  ]);

  if (!canAccessTeamFeatures) {
    return <AccessDenied />;
  }

  return (
    <div>
      <TeamContent />
      {canAccessAdminPanel && <AdminPanel />}
    </div>
  );
}
```

### Get All User Permissions

```typescript
import { usePermissions, useIsAdmin } from '@/lib/api/permissions';

function UserProfile() {
  const userPermissions = usePermissions();
  const isAdmin = useIsAdmin();

  return (
    <div>
      <h3>Your Role: {userPermissions?.role}</h3>
      {isAdmin && <AdminBadge />}

      <h4>Your Permissions:</h4>
      <ul>
        {userPermissions?.permissions.map(permission => (
          <li key={permission}>{permission}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🧩 Permission Components

### PermissionGate

Conditionally render components based on single permission:

```typescript
import { PermissionGate } from '@/lib/api/permissions';

// Basic usage - only render if user has permission
<PermissionGate permission="Permissions.Team.Projects">
  <ProjectManager />
</PermissionGate>

// With fallback message
<PermissionGate
  permission="Permissions.Personal.Invoices"
  showFallback={true}
  fallback={<div>You need invoice permissions to access this feature.</div>}
>
  <InvoiceEditor />
</PermissionGate>

// Custom fallback component
<PermissionGate
  permission="Permissions.Admin.UserManagement"
  fallback={<ContactAdminMessage />}
  showFallback={true}
>
  <UserManagementPanel />
</PermissionGate>
```

### MultiPermissionGate

Control access based on multiple permissions:

```typescript
import { MultiPermissionGate } from '@/lib/api/permissions';

// User needs ANY of these permissions
<MultiPermissionGate
  permissions={[
    'Permissions.Team.Projects',
    'Permissions.Team.Orders'
  ]}
  mode="any"
>
  <TeamDashboard />
</MultiPermissionGate>

// User needs ALL permissions
<MultiPermissionGate
  permissions={[
    'Permissions.Admin.UserManagement',
    'Permissions.Admin.SystemSettings'
  ]}
  mode="all"
  showFallback={true}
>
  <FullAdminPanel />
</MultiPermissionGate>
```

### AdminOnly

Shorthand for admin-only content:

```typescript
import { AdminOnly } from '@/lib/api/permissions';

<AdminOnly>
  <SystemSettings />
  <UserManagement />
  <AuditLogs />
</AdminOnly>

// With fallback
<AdminOnly
  showFallback={true}
  fallback={<div>Admin access required</div>}
>
  <DangerousSettings />
</AdminOnly>
```

## 🔧 Permission Utilities

### Server-Side Permission Checking

```typescript
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  checkPermission
} from '@/lib/api/permissions';

// In API routes or server components
function validateUserAccess(userPermissions, requiredPermission) {
  const check = checkPermission(userPermissions, requiredPermission);

  if (!check.hasPermission) {
    throw new Error(check.reason);
  }
}

// Filter data based on permissions
function filterMenuItems(userPermissions, allMenuItems) {
  return allMenuItems.filter(item =>
    hasPermission(userPermissions, item.requiredPermission)
  );
}
```

### Permission Storage Management

```typescript
import {
  setUserPermissions,
  getUserPermissions,
  clearUserPermissions
} from '@/lib/api/permissions';

// Store permissions after login
const loginResponse = await api.login(credentials);
if (loginResponse.succeeded) {
  setUserPermissions({
    role: loginResponse.data.role,
    permissions: loginResponse.data.permissions
  });
}

// Get current permissions
const currentPermissions = getUserPermissions();

// Clear on logout
clearUserPermissions();
```

## 🎯 Data Access Patterns

### Team Collaboration Pattern
**Used for**: Projects, Orders, Kanban Tasks, Analytics

- **Visibility**: All team members can see all data
- **Access**: Full CRUD operations for authorized users
- **Use Case**: Collaborative work where transparency is important

```typescript
// Example: Projects are visible to all team members
<PermissionGate permission="Permissions.Team.Projects">
  <ProjectsList showAllProjects={true} />
</PermissionGate>
```

### Personal Privacy Pattern
**Used for**: Invoices, Chats, User Profiles

- **Visibility**: Users only see their own data
- **Access**: Full CRUD on owned data only
- **Use Case**: Private user data that shouldn't be shared

```typescript
// Example: Users only see their own invoices
<PermissionGate permission="Permissions.Personal.Invoices">
  <InvoicesList userId={currentUser.id} />
</PermissionGate>
```

### File Sharing Pattern
**Used for**: Files, Documents

- **Visibility**: Owner-only by default, with sharing capabilities
- **Access**: Owner has full control + can share with others
- **Use Case**: Personal files with selective sharing (like OneDrive)

```typescript
<PermissionGate permission="Permissions.Personal.Files">
  <FileManager allowSharing={true} />
</PermissionGate>
```

### Directory Access Pattern
**Used for**: User Directory

- **Visibility**: Basic info visible to all users
- **Access**: Read-only for collaboration purposes
- **Use Case**: Team members can see who else is in the system

```typescript
<PermissionGate permission="Permissions.Users.ViewDirectory">
  <UserDirectory showBasicInfo={true} />
</PermissionGate>
```

## 🔗 Integration with API Hooks

API hooks automatically respect permissions:

```typescript
import { useProjectsWithMutations } from '@/lib/api/hooks/projects';

function ProjectsPage() {
  // This hook automatically checks 'Permissions.Team.Projects'
  // and disables the query if user lacks permission
  const { data, loading, mutations } = useProjectsWithMutations();

  // The hook will return null data if user lacks permission
  if (!data && !loading) {
    return <div>You don't have access to projects</div>;
  }

  return (
    <div>
      {data?.data?.map(project => (
        <ProjectCard key={project.id} data={project} />
      ))}
    </div>
  );
}
```

## 📋 Permission Reference

### Complete Permission List

```typescript
// Copy this for reference in your components
type Permission =
  // Admin Operations
  | 'Permissions.Admin.UserManagement'      // Manage users and roles
  | 'Permissions.Admin.SystemSettings'      // System configuration

  // Team Collaboration (all users can see all data)
  | 'Permissions.Team.Projects'             // Team projects
  | 'Permissions.Team.Orders'               // Order management
  | 'Permissions.Team.KanbanTasks'          // Kanban boards
  | 'Permissions.Team.Analytics'            // Analytics/reports

  // Personal Data (owner-only access)
  | 'Permissions.Personal.Profile'          // User profile
  | 'Permissions.Personal.Invoices'         // Personal invoices
  | 'Permissions.Personal.Files'            // File management
  | 'Permissions.Personal.Chats'            // Personal messages

  // User Directory
  | 'Permissions.Users.ViewDirectory';      // View user list
```

### Role-Permission Mapping

| Permission | Admin | User |
|------------|-------|------|
| Admin.UserManagement | ✅ | ❌ |
| Admin.SystemSettings | ✅ | ❌ |
| Team.Projects | ✅ | ✅ |
| Team.Orders | ✅ | ✅ |
| Team.KanbanTasks | ✅ | ✅ |
| Team.Analytics | ✅ | ✅ |
| Personal.Profile | ✅ | ✅ |
| Personal.Invoices | ✅ | ✅ |
| Personal.Files | ✅ | ✅ |
| Personal.Chats | ✅ | ✅ |
| Users.ViewDirectory | ✅ | ✅ |

## 🚀 Best Practices

### 1. Always Use Permission Gates for UI
```typescript
// ✅ Good
<PermissionGate permission="Permissions.Admin.UserManagement">
  <DeleteUserButton />
</PermissionGate>

// ❌ Bad - manual checking
{permissions.includes('Permissions.Admin.UserManagement') && <DeleteUserButton />}
```

### 2. Combine Permission Hooks with API Hooks
```typescript
// ✅ Good - API hook handles permissions automatically
const { data, mutations } = useInvoicesWithMutations();

// ❌ Bad - manual permission checking
const canAccess = useHasPermission('Permissions.Personal.Invoices');
const data = canAccess ? useFetch('/api/invoices') : null;
```

### 3. Provide Meaningful Fallbacks
```typescript
// ✅ Good
<PermissionGate
  permission="Permissions.Team.Projects"
  showFallback={true}
  fallback={
    <Alert color="blue">
      Contact your administrator to get project access.
    </Alert>
  }
>
  <ProjectManager />
</PermissionGate>
```

### 4. Use Multi-Permission Gates for Complex Access
```typescript
// ✅ Good
<MultiPermissionGate
  permissions={['Permissions.Team.Projects', 'Permissions.Team.Orders']}
  mode="any"
>
  <TeamDashboard />
</MultiPermissionGate>
```

## 🐛 Debugging Permissions

### Debug Component
```typescript
import { usePermissions } from '@/lib/api/permissions';

function PermissionDebugger() {
  const permissions = usePermissions();

  return (
    <details>
      <summary>Debug Permissions</summary>
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </details>
  );
}
```

### Console Debugging
```typescript
import { checkPermission } from '@/lib/api/permissions';

// Debug specific permission
const result = checkPermission(userPermissions, 'Permissions.Team.Projects');
console.log('Permission check:', result);
```

This RBAC system provides a robust, type-safe way to control access throughout your application while maintaining clean, readable code.
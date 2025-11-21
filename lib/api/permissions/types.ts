// RBAC Permission types based on your rbac-config.json

// All available permissions in the system
export type Permission =
  // Admin permissions
  | 'Permissions.Admin.UserManagement'
  | 'Permissions.Admin.SystemSettings'

  // Team permissions (collaborative)
  | 'Permissions.Team.Projects'
  | 'Permissions.Team.Orders'
  | 'Permissions.Team.KanbanTasks'
  | 'Permissions.Team.Analytics'

  // Personal permissions (owner-only)
  | 'Permissions.Personal.Profile'
  | 'Permissions.Personal.Invoices'
  | 'Permissions.Personal.Files'
  | 'Permissions.Personal.Chats'

  // User directory
  | 'Permissions.Users.ViewDirectory';

// Role types
export type Role = 'Admin' | 'User';

// Permission categories for UI organization
export type PermissionCategory = 'Admin' | 'Team' | 'Personal' | 'Users';

// User permission context
export interface UserPermissions {
  role: Role;
  permissions: Permission[];
}

// Permission check result
export interface PermissionCheck {
  hasPermission: boolean;
  reason?: string;
}

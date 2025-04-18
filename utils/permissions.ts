// Define permission types
export type Permission =
  | "view_dashboard"
  | "control_pumps"
  | "control_temperature"
  | "control_pressure"
  | "upload_files"
  | "delete_files"
  | "create_recipe"
  | "edit_recipe"
  | "delete_recipe"
  | "run_recipe"
  | "view_logs"
  | "clear_logs"
  | "manage_users"
  | "assign_roles"
  | "view_analytics"
  | "analyze_pdfs"
  | "manage_equipment"
  | "add_equipment"
  | "edit_equipment"
  | "delete_equipment"

// Define role types
export type Role = "admin" | "researcher" | "technician" | "guest"

// Define permissions for each role
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "view_dashboard",
    "control_pumps",
    "control_temperature",
    "control_pressure",
    "upload_files",
    "delete_files",
    "create_recipe",
    "edit_recipe",
    "delete_recipe",
    "run_recipe",
    "view_logs",
    "clear_logs",
    "manage_users",
    "assign_roles",
    "view_analytics",
    "analyze_pdfs",
    "manage_equipment",
    "add_equipment",
    "edit_equipment",
    "delete_equipment",
  ],
  researcher: [
    "view_dashboard",
    "control_pumps",
    "control_temperature",
    "control_pressure",
    "upload_files",
    "delete_files",
    "create_recipe",
    "edit_recipe",
    "run_recipe",
    "view_logs",
    "view_analytics",
    "analyze_pdfs",
    "add_equipment",
    "edit_equipment",
  ],
  technician: [
    "view_dashboard",
    "control_pumps",
    "control_temperature",
    "control_pressure",
    "upload_files",
    "run_recipe",
    "view_logs",
  ],
  guest: ["view_dashboard", "view_logs"],
}

// Check if a role has a specific permission
export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false
  return rolePermissions[role]?.includes(permission) || false
}

// Get all available roles
export function getAvailableRoles(): Role[] {
  return Object.keys(rolePermissions) as Role[]
}

// Get role description
export function getRoleDescription(role: Role): string {
  switch (role) {
    case "admin":
      return "Full access to all system features and user management"
    case "researcher":
      return "Can create and run experiments, analyze data, and manage recipes"
    case "technician":
      return "Can operate equipment and run predefined recipes"
    case "guest":
      return "View-only access to dashboard and logs"
    default:
      return "Unknown role"
  }
}

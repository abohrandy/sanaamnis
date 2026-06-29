export type UserRole =
  | "customer"
  | "editor"
  | "content_manager"
  | "store_manager"
  | "admin"
  | "super_admin";

const PERMISSIONS_MATRIX: Record<UserRole, string[]> = {
  customer: ["view:products", "create:orders", "view:own_orders"],
  editor: ["view:products", "create:orders", "view:own_orders", "edit:blog"],
  content_manager: [
    "view:products",
    "create:orders",
    "view:own_orders",
    "edit:blog",
    "edit:pages",
    "edit:navigation",
    "edit:sections",
  ],
  store_manager: [
    "view:products",
    "create:orders",
    "edit:catalog",
    "view:orders",
    "edit:orders",
    "view:customers",
    "edit:coupons",
  ],
  admin: [
    "view:products",
    "create:orders",
    "edit:blog",
    "edit:pages",
    "edit:navigation",
    "edit:sections",
    "edit:catalog",
    "view:orders",
    "edit:orders",
    "view:customers",
    "edit:coupons",
    "view:analytics",
    "edit:settings",
  ],
  super_admin: ["*"], // Granting all privileges
};

export function hasPermission(role: string | undefined | null, action: string): boolean {
  if (!role) return false;
  
  const userRole = role as UserRole;
  const permissions = PERMISSIONS_MATRIX[userRole];

  if (!permissions) return false;

  // Super administrators bypass all checks
  if (permissions.includes("*") || permissions.includes("manage:all")) {
    return true;
  }

  return permissions.includes(action);
}

export function isAdminRole(role: string | undefined | null): boolean {
  if (!role) return false;
  const adminRoles = ["editor", "content_manager", "store_manager", "admin", "super_admin"];
  return adminRoles.includes(role);
}

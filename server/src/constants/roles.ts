/**
 * Role Constants
 * Defines user roles and their hierarchy
 */

export enum Role {
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN_OWNER = 'ADMIN_OWNER',
  MEDIA_STAFF = 'MEDIA_STAFF',
  USER_PUBLIC = 'USER_PUBLIC'
}

/**
 * Role Hierarchy (Lower number = Higher privilege)
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.MASTER_ADMIN]: 0,
  [Role.ADMIN_OWNER]: 1,
  [Role.MEDIA_STAFF]: 2,
  [Role.USER_PUBLIC]: 3
}

/**
 * Check if role A has higher or equal privilege than role B
 */
export const hasHigherOrEqualPrivilege = (roleA: Role, roleB: Role): boolean => {
  return ROLE_HIERARCHY[roleA] <= ROLE_HIERARCHY[roleB]
}

/**
 * Check if role can lock another role
 */
export const canLockRole = (lockerRole: Role, targetRole: Role): boolean => {
  // Master Admin cannot be locked
  if (targetRole === Role.MASTER_ADMIN) {
    return false
  }
  
  // Only users with higher privilege can lock
  return ROLE_HIERARCHY[lockerRole] < ROLE_HIERARCHY[targetRole]
}

/**
 * Role Permissions Matrix
 */
export const ROLE_PERMISSIONS = {
  [Role.MASTER_ADMIN]: {
    canLockUsers: true,
    canUnlockUsers: true,
    canAccessAuditLogs: true,
    canManageSystemConfig: true,
    canExportReports: true,
    canManageProducts: true,
    canManagePages: true,
    canManageBooks: true,
    canViewFinancials: true,
    canManageStaff: true
  },
  [Role.ADMIN_OWNER]: {
    canLockUsers: true, // Can lock MEDIA_STAFF only
    canUnlockUsers: true,
    canAccessAuditLogs: false,
    canManageSystemConfig: false,
    canExportReports: true,
    canManageProducts: true,
    canManagePages: true,
    canManageBooks: true,
    canViewFinancials: true,
    canManageStaff: true
  },
  [Role.MEDIA_STAFF]: {
    canLockUsers: false,
    canUnlockUsers: false,
    canAccessAuditLogs: false,
    canManageSystemConfig: false,
    canExportReports: false,
    canManageProducts: true, // Can edit, but price may be restricted
    canManagePages: true,
    canManageBooks: true,
    canViewFinancials: false,
    canManageStaff: false
  },
  [Role.USER_PUBLIC]: {
    canLockUsers: false,
    canUnlockUsers: false,
    canAccessAuditLogs: false,
    canManageSystemConfig: false,
    canExportReports: false,
    canManageProducts: false,
    canManagePages: false,
    canManageBooks: false,
    canViewFinancials: false,
    canManageStaff: false
  }
}

/**
 * Get permissions for a specific role
 */
export const getRolePermissions = (role: Role) => {
  return ROLE_PERMISSIONS[role]
}

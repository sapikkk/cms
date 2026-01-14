/**
 * RBAC Middleware
 * Role-Based Access Control middleware
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { ROLE_HIERARCHY, ROLE_PERMISSIONS } from '@constants/roles'
import { ERROR_MESSAGES } from '@constants/messages'

// Use string type for roles to match Prisma enum
type RoleString = 'MASTER_ADMIN' | 'ADMIN_OWNER' | 'MEDIA_STAFF' | 'USER_PUBLIC'

/**
 * Check if role A has higher or equal privilege than role B
 */
const hasHigherOrEqualPrivilege = (roleA: string, roleB: string): boolean => {
  const hierarchyA = ROLE_HIERARCHY[roleA as keyof typeof ROLE_HIERARCHY]
  const hierarchyB = ROLE_HIERARCHY[roleB as keyof typeof ROLE_HIERARCHY]
  if (hierarchyA === undefined || hierarchyB === undefined) return false
  return hierarchyA <= hierarchyB
}

/**
 * Get permissions for a specific role
 */
const getRolePermissions = (role: string) => {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]
}

/**
 * Middleware to check if user has required role
 */
export const requireRole = (...allowedRoles: RoleString[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    console.log('[RBAC Debug] User:', req.user?.username, 'Role:', req.user?.role, 'Allowed:', allowedRoles)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      })
    }

    const userRole = req.user.role as RoleString

    // Check if user has one of the allowed roles
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `${ERROR_MESSAGES.INSUFFICIENT_PERMISSION} (Role: ${userRole}, Required: ${allowedRoles.join('|')})`
      })
    }

    next()
  }
}

/**
 * Middleware to check if user has minimum role level
 * e.g., requireMinRole('MEDIA_STAFF') allows MEDIA_STAFF, ADMIN_OWNER, and MASTER_ADMIN
 */
export const requireMinRole = (minRole: RoleString) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      })
    }

    const userRole = req.user.role

    if (!hasHigherOrEqualPrivilege(userRole, minRole)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.INSUFFICIENT_PERMISSION
      })
    }

    next()
  }
}

/**
 * Middleware to check specific permission
 */
export const requirePermission = (permission: keyof typeof ROLE_PERMISSIONS['MASTER_ADMIN']) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      })
    }

    const userRole = req.user.role
    const permissions = getRolePermissions(userRole)

    if (!permissions || !permissions[permission]) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.INSUFFICIENT_PERMISSION
      })
    }

    next()
  }
}

/**
 * Check if user is Master Admin
 */
export const requireMasterAdmin = requireRole('MASTER_ADMIN')

/**
 * Check if user is Admin or Owner
 */
export const requireAdminOrOwner = requireRole('MASTER_ADMIN', 'ADMIN_OWNER')

/**
 * Check if user has any admin access (including media staff)
 */
export const requireAnyAdmin = requireRole(
  'MASTER_ADMIN',
  'ADMIN_OWNER',
  'MEDIA_STAFF'
)

/**
 * Permission Composable
 * ACL Logic for Role-Based Access Control
 */

import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

// Role hierarchy from schema.prisma
const ROLES = {
    MASTER_ADMIN: 'MASTER_ADMIN',   // Level 0 - Absolute Power
    ADMIN_OWNER: 'ADMIN_OWNER',     // Level 1 - Business Owner
    MEDIA_STAFF: 'MEDIA_STAFF',     // Level 2 - Content Creator
    USER_PUBLIC: 'USER_PUBLIC'      // Level 3 - Website Visitor
}

const ROLE_LEVELS = {
    [ROLES.MASTER_ADMIN]: 0,
    [ROLES.ADMIN_OWNER]: 1,
    [ROLES.MEDIA_STAFF]: 2,
    [ROLES.USER_PUBLIC]: 3
}

export function usePermission() {
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const userRole = computed(() => authStore.user?.role || ROLES.USER_PUBLIC)

    // Check if user is locked
    const isLocked = computed(() => authStore.user?.isLocked || false)

    // Role checks
    const isMasterAdmin = computed(() => userRole.value === ROLES.MASTER_ADMIN)
    const isAdminOwner = computed(() => userRole.value === ROLES.ADMIN_OWNER)
    const isMediaStaff = computed(() => userRole.value === ROLES.MEDIA_STAFF)
    const isPublicUser = computed(() => userRole.value === ROLES.USER_PUBLIC)

    /**
     * Check if user has permission (role level)
     * Lower level = higher permission
     */
    const hasRole = (requiredRole) => {
        const userLevel = ROLE_LEVELS[userRole.value]
        const requiredLevel = ROLE_LEVELS[requiredRole]
        return userLevel <= requiredLevel
    }

    /**
     * Check if user has minimum role requirement
     */
    const hasMinimumRole = (minimumRole) => {
        return hasRole(minimumRole)
    }

    /**
     * Can user perform action on entity?
     */
    const canCreate = computed(() => {
        if (isLocked.value) return false
        return hasRole(ROLES.MEDIA_STAFF) // Media Staff and above
    })

    const canUpdate = computed(() => {
        if (isLocked.value) return false
        return hasRole(ROLES.MEDIA_STAFF)
    })

    const canDelete = computed(() => {
        if (isLocked.value) return false
        return hasRole(ROLES.ADMIN_OWNER) // Only Owner and Master
    })

    const canPublish = computed(() => {
        if (isLocked.value) return false
        return hasRole(ROLES.ADMIN_OWNER)
    })

    const canManageUsers = computed(() => {
        if (isLocked.value) return false
        return isMasterAdmin.value // Only Master Admin
    })

    const canViewAuditLogs = computed(() => {
        if (isLocked.value) return false
        return isMasterAdmin.value
    })

    const canAccessDashboard = computed(() => {
        if (isLocked.value) return false
        return hasRole(ROLES.MEDIA_STAFF)
    })

    return {
        // User info
        user,
        userRole,
        isLocked,

        // Role checks
        isMasterAdmin,
        isAdminOwner,
        isMediaStaff,
        isPublicUser,

        // Permission functions
        hasRole,
        hasMinimumRole,

        // Action permissions
        canCreate,
        canUpdate,
        canDelete,
        canPublish,
        canManageUsers,
        canViewAuditLogs,
        canAccessDashboard,

        // Constants
        ROLES
    }
}

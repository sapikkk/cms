/**
 * Role Guard
 * Checks if user has required role for route
 */

import { useAuthStore } from '@/stores/auth.store'

export function roleGuard(to, from) {
  const authStore = useAuthStore()

  // Check if route has role requirements
  if (to.meta.roles && to.meta.roles.length > 0) {
    const userRole = authStore.user?.role

    if (!userRole) {
      return { name: 'Login' }
    }

    if (!to.meta.roles.includes(userRole)) {
      // User doesn't have required role
      return { name: 'Dashboard' }
    }
  }

  return true
}

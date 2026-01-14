/**
 * Auth Guard
 * Checks if user is authenticated
 */

import { useAuthStore } from '@/stores/auth.store'

export function authGuard(to, from) {
  const authStore = useAuthStore()

  // Route requires authentication
  if (to.meta.requiresAuth !== false) {
    if (!authStore.isAuthenticated) {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
  }

  return true
}

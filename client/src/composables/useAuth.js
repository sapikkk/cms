/**
 * Auth Composable
 * Handles authentication state and operations
 */

import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

export function useAuth() {
    const authStore = useAuthStore()
    const router = useRouter()

    const user = computed(() => authStore.user)
    const token = computed(() => authStore.token)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isLoading = computed(() => authStore.isLoading)

    const login = async (credentials) => {
        try {
            await authStore.login(credentials)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const logout = async () => {
        await authStore.logout()
        router.push({ name: 'login' })
    }

    const refreshToken = async () => {
        try {
            await authStore.refreshToken()
            return true
        } catch (error) {
            console.error('Token refresh failed:', error)
            return false
        }
    }

    const checkAuth = () => {
        return authStore.checkAuth()
    }

    return {
        // State
        user,
        token,
        isAuthenticated,
        isLoading,

        // Actions
        login,
        logout,
        refreshToken,
        checkAuth
    }
}

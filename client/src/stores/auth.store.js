/**
 * Auth Store
 * Manages authentication state with Pinia
 */

import { defineStore } from 'pinia'
import authService from '@/api/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userRole: (state) => state.user?.role || null,
    isMasterAdmin: (state) => state.user?.role === 'MASTER_ADMIN',
    isAdminOrOwner: (state) => ['MASTER_ADMIN', 'ADMIN_OWNER'].includes(state.user?.role),
    isMediaStaff: (state) => state.user?.role === 'MEDIA_STAFF'
  },

  actions: {
    async login({ username, password }) {
      // NOTE: The backend expects 'email' field but we allow username to be passed in it
      const { data } = await authService.login(username, password)

      this.user = data.data.user
      this.token = data.data.tokens.accessToken
      this.refreshToken = data.data.tokens.refreshToken

      // Persist to localStorage
      localStorage.setItem('token', this.token)
      localStorage.setItem('refreshToken', this.refreshToken)
      localStorage.setItem('user', JSON.stringify(this.user))

      return this.user
    },

    async fetchProfile() {
      try {
        const { data } = await authService.getProfile()
        this.user = data.data
        localStorage.setItem('user', JSON.stringify(this.user))
        return this.user
      } catch (error) {
        this.logout()
        throw error
      }
    },

    async refreshAccessToken() {
      try {
        const { data } = await authService.refresh(this.refreshToken)
        this.token = data.data.accessToken
        this.refreshToken = data.data.refreshToken

        localStorage.setItem('token', this.token)
        localStorage.setItem('refreshToken', this.refreshToken)

        return this.token
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null

      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },

    hasRole(...roles) {
      return roles.includes(this.user?.role)
    },

    hasPermission(permission) {
      // TODO: Implement permission checking
      return true
    }
  }
})

/**
 * Auth Service
 * API calls for authentication
 */

import api from '../core/axiosClient'

export default {
  login(email, password) {
    return api.post('/auth/login', { email, password })
  },

  register(userData) {
    return api.post('/auth/register', userData)
  },

  getProfile() {
    return api.get('/auth/me')
  },

  updateProfile(data) {
    return api.put('/auth/profile', data)
  },

  changePassword(oldPassword, newPassword) {
    return api.post('/auth/change-password', { oldPassword, newPassword })
  },

  refresh(refreshToken) {
    return api.post('/auth/refresh', { refreshToken })
  },

  logout() {
    return api.post('/auth/logout')
  }
}

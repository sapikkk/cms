/**
 * Axios Client Configuration
 * Centralized HTTP client with interceptors
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Request Interceptor: Add JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle Errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - only if user was authenticated
    if (error.response?.status === 401 && !originalRequest._retry) {
      const hasToken = !!localStorage.getItem('token')

      // Only handle 401 if user had a token (was authenticated)
      if (hasToken) {
        originalRequest._retry = true

        // Check if it's token expired
        if (error.response?.data?.code === 'TOKEN_EXPIRED') {
          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken
              })

              const newToken = response.data.data.accessToken
              localStorage.setItem('token', newToken)
              localStorage.setItem('refreshToken', response.data.data.refreshToken)

              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return apiClient(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, logout
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
        } else {
          // Not token expired, just unauthorized - clear auth and redirect
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
      // If no token, just reject the error without redirect (allow public requests to fail gracefully)
    }

    // Handle 423 Account Locked
    if (error.response?.status === 423) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/access-locked'
    }

    return Promise.reject(error)
  }
)

export default apiClient

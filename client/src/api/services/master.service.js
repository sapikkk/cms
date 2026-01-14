/**
 * Master API Service
 * Handle all master admin-related API calls (User Management, Audit Logs, System Access)
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    // ===== USER MANAGEMENT =====

    /**
     * Get all users
     */
    getUsers(params = {}) {
        return axiosClient.get('/users', { params })
    },

    /**
     * Get user by ID
     */
    getUserById(id) {
        return axiosClient.get(`/users/${id}`)
    },

    /**
     * Create new user
     */
    createUser(data) {
        return axiosClient.post('/users', data)
    },

    /**
     * Update user
     */
    updateUser(id, data) {
        return axiosClient.put(`/users/${id}`, data)
    },

    /**
     * Delete user
     */
    deleteUser(id) {
        return axiosClient.delete(`/users/${id}`)
    },

    /**
     * Lock user account
     */
    lockUser(id) {
        return axiosClient.patch(`/users/${id}/lock`)
    },

    /**
     * Unlock user account
     */
    unlockUser(id) {
        return axiosClient.patch(`/users/${id}/unlock`)
    },

    /**
     * Change user role
     */
    changeUserRole(id, role) {
        return axiosClient.patch(`/users/${id}/role`, { role })
    },

    /**
     * Reset user password
     */
    resetUserPassword(id, newPassword) {
        return axiosClient.patch(`/users/${id}/reset-password`, { newPassword })
    },

    // ===== AUDIT LOGS =====

    /**
     * Get all activity logs
     */
    getActivityLogs(params = {}) {
        return axiosClient.get('/activity-logs', { params })
    },

    /**
     * Get activity log by ID
     */
    getActivityLogById(id) {
        return axiosClient.get(`/activity-logs/${id}`)
    },

    /**
     * Get logs by user
     */
    getLogsByUser(userId, params = {}) {
        return axiosClient.get(`/activity-logs/user/${userId}`, { params })
    },

    /**
     * Get logs by entity
     */
    getLogsByEntity(entity, params = {}) {
        return axiosClient.get(`/activity-logs/entity/${entity}`, { params })
    },

    /**
     * Get logs by action
     */
    getLogsByAction(action, params = {}) {
        return axiosClient.get(`/activity-logs/action/${action}`, { params })
    },

    /**
     * Export logs
     */
    exportLogs(params = {}) {
        return axiosClient.get('/activity-logs/export', {
            params,
            responseType: 'blob'
        })
    },

    // ===== SYSTEM CONFIG =====

    /**
     * Get system configuration
     */
    getSystemConfig(key) {
        return axiosClient.get(`/system/config/${key}`)
    },

    /**
     * Update system configuration
     */
    updateSystemConfig(key, value) {
        return axiosClient.put(`/system/config/${key}`, { value })
    },

    /**
     * Get all public configs
     */
    getPublicConfigs() {
        return axiosClient.get('/system/config/public')
    },

    // ===== STATISTICS =====

    /**
     * Get dashboard statistics
     */
    getDashboardStats() {
        return axiosClient.get('/master/stats')
    }
}

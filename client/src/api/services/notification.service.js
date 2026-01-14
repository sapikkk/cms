/**
 * Notification API Service
 * Handle all notification-related API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get all notifications
     */
    getAll(params = {}) {
        return axiosClient.get('/notifications', { params })
    },

    /**
     * Get active notifications (public)
     */
    getActive() {
        return axiosClient.get('/notifications/active')
    },

    /**
     * Get notification by ID
     */
    getById(id) {
        return axiosClient.get(`/notifications/${id}`)
    },

    /**
     * Create new notification
     */
    create(data) {
        return axiosClient.post('/notifications', data)
    },

    /**
     * Update notification
     */
    update(id, data) {
        return axiosClient.put(`/notifications/${id}`, data)
    },

    /**
     * Delete notification
     */
    delete(id) {
        return axiosClient.delete(`/notifications/${id}`)
    },

    /**
     * Toggle active status
     */
    toggleActive(id) {
        return axiosClient.patch(`/notifications/${id}/toggle`)
    }
}

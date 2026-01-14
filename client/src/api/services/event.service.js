/**
 * Event API Service
 * Handle all event-related API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get all events with filters
     */
    getAll(params = {}) {
        return axiosClient.get('/events', { params })
    },

    /**
     * Get event by ID
     */
    getById(id) {
        return axiosClient.get(`/events/${id}`)
    },

    /**
     * Create new event
     */
    create(data) {
        return axiosClient.post('/events', data)
    },

    /**
     * Update event
     */
    update(id, data) {
        return axiosClient.put(`/events/${id}`, data)
    },

    /**
     * Delete event
     */
    delete(id) {
        return axiosClient.delete(`/events/${id}`)
    },

    /**
     * Register for event
     */
    register(id) {
        return axiosClient.post(`/events/${id}/register`)
    }
}

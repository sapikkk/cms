/**
 * Merchandise API Service
 * Handle all merchandise-related API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get all merchandise with filters
     */
    getAll(params = {}) {
        return axiosClient.get('/merchandise', { params })
    },

    /**
     * Get merchandise by ID
     */
    getById(id) {
        return axiosClient.get(`/merchandise/${id}`)
    },

    /**
     * Create new merchandise
     */
    create(data) {
        return axiosClient.post('/merchandise', data)
    },

    /**
     * Update merchandise
     */
    update(id, data) {
        return axiosClient.put(`/merchandise/${id}`, data)
    },

    /**
     * Delete merchandise
     */
    delete(id) {
        return axiosClient.delete(`/merchandise/${id}`)
    },

    /**
     * Update stock
     */
    updateStock(id, stock) {
        return axiosClient.patch(`/merchandise/${id}/stock`, { stock })
    }
}

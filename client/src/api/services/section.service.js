/**
 * Section API Service
 * Handle all section configuration-related API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get all sections
     */
    getAll(params = {}) {
        return axiosClient.get('/sections', { params })
    },

    /**
     * Get visible sections for rendering
     */
    getVisible(pageId = null) {
        return axiosClient.get('/sections/visible', {
            params: { pageId }
        })
    },

    /**
     * Get section by ID
     */
    getById(id) {
        return axiosClient.get(`/sections/${id}`)
    },

    /**
     * Create new section
     */
    create(data) {
        return axiosClient.post('/sections', data)
    },

    /**
     * Update section
     */
    update(id, data) {
        return axiosClient.put(`/sections/${id}`, data)
    },

    /**
     * Delete section
     */
    delete(id) {
        return axiosClient.delete(`/sections/${id}`)
    },

    /**
     * Reorder sections
     */
    reorder(sections) {
        return axiosClient.post('/sections/reorder', { sections })
    },

    /**
     * Toggle visibility
     */
    toggleVisibility(id) {
        return axiosClient.patch(`/sections/${id}/toggle`)
    }
}

/**
 * FunFact API Service
 * Handle all fun fact and comment-related API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get all fun facts with filters
     */
    getAll(params = {}) {
        return axiosClient.get('/funfacts', { params })
    },

    /**
     * Get fun fact by ID
     */
    getById(id) {
        return axiosClient.get(`/funfacts/${id}`)
    },

    /**
     * Create new fun fact
     */
    create(data) {
        return axiosClient.post('/funfacts', data)
    },

    /**
     * Update fun fact
     */
    update(id, data) {
        return axiosClient.put(`/funfacts/${id}`, data)
    },

    /**
     * Delete fun fact
     */
    delete(id) {
        return axiosClient.delete(`/funfacts/${id}`)
    },

    /**
     * Get comments for a fun fact
     */
    getComments(funFactId) {
        return axiosClient.get(`/funfacts/${funFactId}/comments`)
    },

    /**
     * Create comment on fun fact
     */
    createComment(funFactId, data) {
        return axiosClient.post(`/funfacts/${funFactId}/comments`, data)
    },

    /**
     * Get all comments (for moderation)
     */
    getAllComments(params = {}) {
        return axiosClient.get('/funfacts/comments/all', { params })
    },

    /**
     * Approve comment
     */
    approveComment(commentId) {
        return axiosClient.patch(`/funfacts/comments/${commentId}/approve`)
    },

    /**
     * Delete comment
     */
    deleteComment(commentId) {
        return axiosClient.delete(`/funfacts/comments/${commentId}`)
    }
}

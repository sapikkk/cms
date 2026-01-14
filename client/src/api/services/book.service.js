/**
 * Book API Service
 * Handle all book library-related API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get all books
     */
    getAll(params = {}) {
        return axiosClient.get('/books', { params })
    },

    /**
     * Get book by ID
     */
    getById(id) {
        return axiosClient.get(`/books/${id}`)
    },

    /**
     * Create new book
     */
    create(data) {
        return axiosClient.post('/books', data)
    },

    /**
     * Update book
     */
    update(id, data) {
        return axiosClient.put(`/books/${id}`, data)
    },

    /**
     * Delete book
     */
    delete(id) {
        return axiosClient.delete(`/books/${id}`)
    },

    /**
     * Publish book
     */
    publish(id) {
        return axiosClient.patch(`/books/${id}/publish`)
    },

    /**
     * Unpublish book
     */
    unpublish(id) {
        return axiosClient.patch(`/books/${id}/unpublish`)
    },

    /**
     * Update book style configuration
     */
    updateStyle(id, styleConfig) {
        return axiosClient.patch(`/books/${id}/style`, { styleConfig })
    },

    /**
     * Upload book cover
     */
    uploadCover(id, file) {
        const formData = new FormData()
        formData.append('cover', file)
        return axiosClient.post(`/books/${id}/cover`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    /**
     * Upload book content (PDF)
     */
    uploadContent(id, file) {
        const formData = new FormData()
        formData.append('content', file)
        return axiosClient.post(`/books/${id}/content`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    /**
     * Get published books (public)
     */
    getPublished(params = {}) {
        return axiosClient.get('/books/published', { params })
    }
}

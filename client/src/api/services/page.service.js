/**
 * Page API Service
 * Handle all page/CMS-related API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get all pages
     */
    getAll(params = {}) {
        return axiosClient.get('/pages', { params })
    },
    // Alias for getAll used in some components
    getPages(params = {}) {
        return axiosClient.get('/pages', { params })
    },

    /**
     * Get page by ID
     */
    getById(id) {
        return axiosClient.get(`/pages/${id}`)
    },

    /**
     * Get page by slug (for public access)
     */
    getBySlug(slug) {
        return axiosClient.get(`/pages/slug/${slug}`)
    },

    /**
     * Create new page
     */
    create(data) {
        return axiosClient.post('/pages', data)
    },

    /**
     * Update page
     */
    update(id, data) {
        return axiosClient.put(`/pages/${id}`, data)
    },

    /**
     * Delete page
     */
    delete(id) {
        return axiosClient.delete(`/pages/${id}`)
    },

    /**
     * Publish page
     */
    publish(id) {
        return axiosClient.patch(`/pages/${id}/publish`)
    },

    /**
     * Unpublish page
     */
    unpublish(id) {
        return axiosClient.patch(`/pages/${id}/unpublish`)
    },

    /**
     * Toggle navbar visibility
     */
    toggleNavbar(id) {
        return axiosClient.patch(`/pages/${id}/toggle-navbar`)
    },

    /**
     * Update page sections (JSON structure)
     */
    updateSections(id, sections) {
        return axiosClient.patch(`/pages/${id}/sections`, { sections })
    },

    /**
     * Update SEO metadata
     */
    updateSEO(id, seoData) {
        return axiosClient.patch(`/pages/${id}/seo`, seoData)
    },

    /**
     * Get published pages for navbar
     */
    getNavbarPages() {
        return axiosClient.get('/pages/navbar')
    },

    /**
     * Get published pages for navbar
     */
    getNavbarPages() {
        return axiosClient.get('/pages/navbar')
    },

    /**
     * Duplicate page
     */
    duplicate(id) {
        return axiosClient.post(`/pages/${id}/duplicate`)
    }
}

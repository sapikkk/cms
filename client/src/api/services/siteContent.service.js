/**
 * Site Content Service
 * API client for managing landing page content
 */

import api from '../core/axiosClient'

const BASE_URL = '/site-content'

export default {
    /**
     * Get all content (Admin)
     */
    getAll() {
        return api.get(BASE_URL)
    },

    /**
     * Get public content (Storefront)
     */
    getPublic() {
        return api.get(`${BASE_URL}/public`)
    },

    /**
     * Get navbar content
     */
    getNavbar() {
        return api.get(`${BASE_URL}/navbar`)
    },

    /**
     * Update navbar content
     */
    updateNavbar(data) {
        return api.put(`${BASE_URL}/navbar`, data)
    },

    /**
     * Get hero content
     */
    getHero() {
        return api.get(`${BASE_URL}/hero`)
    },

    /**
     * Update hero content
     */
    updateHero(data) {
        return api.put(`${BASE_URL}/hero`, data)
    },

    /**
     * Get footer content
     */
    getFooter() {
        return api.get(`${BASE_URL}/footer`)
    },

    /**
     * Update footer content
     */
    updateFooter(data) {
        return api.put(`${BASE_URL}/footer`, data)
    },

    /**
     * Get section content by key
     * @param {string} section - Section key (events, merchandise, forum, etc.)
     */
    getSection(section) {
        return api.get(`${BASE_URL}/section/${section}`)
    },

    /**
     * Update section content
     * @param {string} section - Section key
     * @param {object} data - Section content data
     */
    updateSection(section, data) {
        return api.put(`${BASE_URL}/section/${section}`, data)
    },

    /**
     * Get site settings
     */
    getSiteSettings() {
        return api.get(`${BASE_URL}/settings`)
    },

    /**
     * Update site settings
     */
    updateSiteSettings(data) {
        return api.put(`${BASE_URL}/settings`, data)
    },

    /**
     * Toggle landing page active status
     */
    toggleLandingPage(isActive) {
        return api.post(`${BASE_URL}/toggle-landing`, { isActive })
    },

    /**
     * Get section order and visibility
     */
    getSectionOrder() {
        return api.get(`${BASE_URL}/section-order`)
    },

    /**
     * Update section order
     */
    updateSectionOrder(sections) {
        return api.put(`${BASE_URL}/section-order`, { sections })
    },

    /**
     * Initialize default content
     */
    initializeDefaults() {
        return api.post(`${BASE_URL}/initialize`)
    }
}

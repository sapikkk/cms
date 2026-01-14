/**
 * Config API Service
 * Handle system configuration API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get config by key
     */
    getByKey(key) {
        return axiosClient.get(`/config/${key}`)
    },

    /**
     * Update config
     */
    updateConfig(key, value, description = null) {
        return axiosClient.put(`/config/${key}`, { value, description })
    },

    /**
     * Get footer config
     */
    getFooterConfig() {
        return axiosClient.get('/config/footer/config')
    },

    /**
     * Update footer config
     */
    updateFooterConfig(value) {
        return axiosClient.put('/config/footer/config', { value })
    },

    /**
     * Get hero config
     */
    getHeroConfig() {
        return axiosClient.get('/config/hero/config')
    },

    /**
     * Update hero config
     */
    updateHeroConfig(value) {
        return axiosClient.put('/ config/hero/config', { value })
    }
}

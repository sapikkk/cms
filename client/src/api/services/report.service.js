/**
 * Report API Service
 * Handle all reporting and analytics API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get financial report
     */
    getFinancialReport(params = {}) {
        return axiosClient.get('/reports/financial', { params })
    },

    /**
     * Get sales report
     */
    getSalesReport(params = {}) {
        return axiosClient.get('/reports/sales', { params })
    },

    /**
     * Get product performance report
     */
    getProductPerformance(params = {}) {
        return axiosClient.get('/reports/product-performance', { params })
    },

    /**
     * Get ingredient usage report
     */
    getIngredientUsage(params = {}) {
        return axiosClient.get('/reports/ingredient-usage', { params })
    },

    /**
     * Get user activity report
     */
    getUserActivity(params = {}) {
        return axiosClient.get('/reports/user-activity', { params })
    },

    /**
     * Export financial report
     */
    exportFinancial(format = 'pdf', params = {}) {
        return axiosClient.get('/reports/financial/export', {
            params: { ...params, format },
            responseType: 'blob'
        })
    },

    /**
     * Export sales report
     */
    exportSales(format = 'pdf', params = {}) {
        return axiosClient.get('/reports/sales/export', {
            params: { ...params, format },
            responseType: 'blob'
        })
    },

    /**
     * Export product performance
     */
    exportProductPerformance(format = 'pdf', params = {}) {
        return axiosClient.get('/reports/product-performance/export', {
            params: { ...params, format },
            responseType: 'blob'
        })
    },

    /**
     * Get dashboard overview
     */
    getDashboardOverview() {
        return axiosClient.get('/reports/dashboard')
    },

    /**
     * Get revenue chart data
     */
    getRevenueChart(period = '7days') {
        return axiosClient.get('/reports/revenue-chart', {
            params: { period }
        })
    },

    /**
     * Get top products
     */
    getTopProducts(limit = 10) {
        return axiosClient.get('/reports/top-products', {
            params: { limit }
        })
    }
}

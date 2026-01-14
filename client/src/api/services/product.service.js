/**
 * Product API Service
 * Handle all product-related API calls
 */

import axiosClient from '@/api/core/axiosClient'

export default {
    /**
     * Get all products with filters
     */
    getAll(params = {}) {
        return axiosClient.get('/products', { params })
    },

    /**
     * Get product by ID
     */
    getById(id) {
        return axiosClient.get(`/products/${id}`)
    },

    /**
     * Get product by slug
     */
    getBySlug(slug) {
        return axiosClient.get(`/products/slug/${slug}`)
    },

    /**
     * Create new product
     */
    create(data) {
        return axiosClient.post('/products', data)
    },

    /**
     * Update product
     */
    update(id, data) {
        return axiosClient.put(`/products/${id}`, data)
    },

    /**
     * Delete product
     */
    delete(id) {
        return axiosClient.delete(`/products/${id}`)
    },

    /**
     * Toggle product active status
     */
    toggleActive(id) {
        return axiosClient.patch(`/products/${id}/toggle-active`)
    },

    /**
     * Create category
     */
    createCategory(data) {
        return axiosClient.post('/products/categories', data)
    },

    /**
     * Delete category
     */
    deleteCategory(id) {
        return axiosClient.delete(`/products/categories/${id}`)
    },

    /**
     * Get product categories
     */
    getCategories() {
        return axiosClient.get('/products/categories')
    },

    /**
     * Get products by category
     */
    getByCategory(categoryId, params = {}) {
        return axiosClient.get(`/products/category/${categoryId}`, { params })
    },

    /**
     * Add ingredient to product
     */
    addIngredient(productId, ingredientData) {
        return axiosClient.post(`/products/${productId}/ingredients`, ingredientData)
    },

    /**
     * Update ingredient
     */
    updateIngredient(productId, ingredientId, data) {
        return axiosClient.put(`/products/${productId}/ingredients/${ingredientId}`, data)
    },

    /**
     * Delete ingredient
     */
    deleteIngredient(productId, ingredientId) {
        return axiosClient.delete(`/products/${productId}/ingredients/${ingredientId}`)
    },

    /**
     * Add product variant
     */
    addVariant(productId, variantData) {
        return axiosClient.post(`/products/${productId}/variants`, variantData)
    },

    /**
     * Update variant
     */
    updateVariant(productId, variantId, data) {
        return axiosClient.put(`/products/${productId}/variants/${variantId}`, data)
    },

    /**
     * Delete variant
     */
    deleteVariant(productId, variantId) {
        return axiosClient.delete(`/products/${productId}/variants/${variantId}`)
    }
}

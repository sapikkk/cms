/**
 * Upload Service
 * API calls for file uploads to Cloudinary
 */

import apiClient from '../core/axios'

/**
 * Upload single image to Cloudinary
 */
export const uploadToCloudinary = async (formData) => {
    const response = await apiClient.post('/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data.data
}

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleToCloudinary = async (formData) => {
    const response = await apiClient.post('/upload/images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data.data
}

/**
 * Upload image from base64
 */
export const uploadBase64ToCloudinary = async (base64, folder = 'antitesa/general') => {
    const response = await apiClient.post('/upload/base64', {
        base64,
        folder,
    })
    return response.data.data
}

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
    // Encode the publicId to handle slashes
    const encodedPublicId = encodeURIComponent(publicId).replace(/%2F/g, '/')
    const response = await apiClient.delete(`/upload/image/${encodedPublicId}`)
    return response.data
}

/**
 * Get optimized image URL
 */
export const getOptimizedImageUrl = async (
    publicId,
    options = {}
) => {
    const encodedPublicId = encodeURIComponent(publicId).replace(/%2F/g, '/')
    const params = new URLSearchParams(options)
    const response = await apiClient.get(`/upload/optimize/${encodedPublicId}?${params}`)
    return response.data.data.url
}

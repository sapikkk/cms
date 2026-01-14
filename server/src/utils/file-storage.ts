/**
 * File Storage Utility
 * Handle file uploads and cloud storage (S3, MinIO, etc.)
 */

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalFilename.substring(originalFilename.lastIndexOf('.'))
  const nameWithoutExt = originalFilename.substring(0, originalFilename.lastIndexOf('.'))
  const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  
  return `${safeName}-${timestamp}-${random}${extension}`
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()
}

/**
 * Check if file is image
 */
export function isImageFile(file: File): boolean {
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  return imageTypes.includes(file.type)
}

/**
 * Check if file is PDF
 */
export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf'
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Resize image (client-side)
 */
export function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      let { width, height } = img

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height / width) * maxWidth
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width / height) * maxHeight
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to resize image'))
        }
      }, file.type)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Upload file to server
 * This is a placeholder - implement actual upload logic based on your backend
 */
export async function uploadFile(
  file: File,
  endpoint: string = '/api/v1/upload'
): Promise<UploadResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Add auth token if needed
        // 'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()

    return {
      success: true,
      url: data.url || data.filePath
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Multiple file upload
 */
export async function uploadMultipleFiles(
  files: File[],
  endpoint: string = '/api/v1/upload'
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadFile(file, endpoint))
  return Promise.all(uploadPromises)
}

export default {
  validateFileSize,
  validateFileType,
  generateUniqueFilename,
  getFileExtension,
  isImageFile,
  isPDFFile,
  fileToBase64,
  resizeImage,
  formatFileSize,
  uploadFile,
  uploadMultipleFiles
}

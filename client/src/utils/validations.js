/**
 * Validation Utilities
 * Common validation functions
 */

/**
 * Validate email format
 */
export function isValidEmail(email) {
    if (!email) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone number (Indonesian format)
 */
export function isValidPhone(phone) {
    if (!phone) return false
    // Indonesian phone: 08xx-xxxx-xxxx or +628xx-xxxx-xxxx
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
    return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

/**
 * Validate password strength
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export function isValidPassword(password) {
    if (!password || password.length < 8) return false

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    return hasUpperCase && hasLowerCase && hasNumber
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password) {
    if (!password) return 0

    let score = 0

    // Length
    if (password.length >= 8) score++
    if (password.length >= 12) score++

    // Character types
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    return Math.min(score, 4)
}

/**
 * Validate URL format
 */
export function isValidURL(url) {
    if (!url) return false
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Validate slug format (lowercase, alphanumeric, hyphens only)
 */
export function isValidSlug(slug) {
    if (!slug) return false
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug)
}

/**
 * Generate slug from text
 */
export function generateSlug(text) {
    if (!text) return ''

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
}

/**
 * Validate required field
 */
export function isRequired(value) {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
}

/**
 * Validate minimum length
 */
export function minLength(value, min) {
    if (!value) return false
    return value.toString().length >= min
}

/**
 * Validate maximum length
 */
export function maxLength(value, max) {
    if (!value) return true
    return value.toString().length <= max
}

/**
 * Validate number range
 */
export function inRange(value, min, max) {
    const num = parseFloat(value)
    if (isNaN(num)) return false
    return num >= min && num <= max
}

/**
 * Validate file size
 */
export function isValidFileSize(file, maxSizeMB = 5) {
    if (!file) return false
    const maxBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxBytes
}

/**
 * Validate file type
 */
export function isValidFileType(file, allowedTypes = []) {
    if (!file) return false
    if (allowedTypes.length === 0) return true
    return allowedTypes.includes(file.type)
}

/**
 * Validate image file
 */
export function isValidImage(file) {
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    return isValidFileType(file, imageTypes)
}

/**
 * Sanitize HTML (basic XSS prevention)
 */
export function sanitizeHTML(html) {
    if (!html) return ''

    const temp = document.createElement('div')
    temp.textContent = html
    return temp.innerHTML
}

/**
 * Validation rules object for forms
 */
export const validationRules = {
    required: (value) => isRequired(value) || 'This field is required',
    email: (value) => !value || isValidEmail(value) || 'Invalid email format',
    phone: (value) => !value || isValidPhone(value) || 'Invalid phone number',
    password: (value) => isValidPassword(value) || 'Password must be at least 8 characters with uppercase, lowercase, and number',
    url: (value) => !value || isValidURL(value) || 'Invalid URL format',
    slug: (value) => !value || isValidSlug(value) || 'Invalid slug format',
    minLength: (min) => (value) => minLength(value, min) || `Minimum ${min} characters required`,
    maxLength: (max) => (value) => maxLength(value, max) || `Maximum ${max} characters allowed`
}

export default {
    isValidEmail,
    isValidPhone,
    isValidPassword,
    getPasswordStrength,
    isValidURL,
    isValidSlug,
    generateSlug,
    isRequired,
    minLength,
    maxLength,
    inRange,
    isValidFileSize,
    isValidFileType,
    isValidImage,
    sanitizeHTML,
    validationRules
}

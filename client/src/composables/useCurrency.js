/**
 * Currency Composable
 * IDR formatting and number utilities
 */

export function useCurrency() {
    /**
     * Format number to Indonesian Rupiah
     * @param {number|string} value - The value to format
     * @param {boolean} showPrefix - Show 'Rp' prefix
     * @returns {string} Formatted currency string
     */
    const formatIDR = (value, showPrefix = true) => {
        if (value === null || value === undefined || value === '') {
            return showPrefix ? 'Rp 0' : '0'
        }

        const numValue = typeof value === 'string' ? parseFloat(value) : value

        if (isNaN(numValue)) {
            return showPrefix ? 'Rp 0' : '0'
        }

        const formatted = new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numValue)

        return showPrefix ? `Rp ${formatted}` : formatted
    }

    /**
     * Format number to Indonesian Rupiah with decimal
     * @param {number|string} value - The value to format
     * @param {number} decimals - Number of decimal places
     * @param {boolean} showPrefix - Show 'Rp' prefix
     * @returns {string} Formatted currency string
     */
    const formatIDRDecimal = (value, decimals = 2, showPrefix = true) => {
        if (value === null || value === undefined || value === '') {
            return showPrefix ? 'Rp 0' : '0'
        }

        const numValue = typeof value === 'string' ? parseFloat(value) : value

        if (isNaN(numValue)) {
            return showPrefix ? 'Rp 0' : '0'
        }

        const formatted = new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(numValue)

        return showPrefix ? `Rp ${formatted}` : formatted
    }

    /**
     * Parse formatted currency string to number
     * @param {string} value - Formatted currency string
     * @returns {number} Numeric value
     */
    const parseIDR = (value) => {
        if (!value) return 0

        // Remove 'Rp', spaces, and dots (thousand separators)
        const cleaned = value
            .toString()
            .replace(/Rp\s?/g, '')
            .replace(/\./g, '')
            .replace(/,/g, '.')

        return parseFloat(cleaned) || 0
    }

    /**
     * Format number with thousand separators
     * @param {number|string} value - The value to format
     * @returns {string} Formatted number string
     */
    const formatNumber = (value) => {
        if (value === null || value === undefined || value === '') {
            return '0'
        }

        const numValue = typeof value === 'string' ? parseFloat(value) : value

        if (isNaN(numValue)) {
            return '0'
        }

        return new Intl.NumberFormat('id-ID').format(numValue)
    }

    /**
     * Format percentage
     * @param {number} value - The value to format (0-100)
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted percentage string
     */
    const formatPercent = (value, decimals = 2) => {
        if (value === null || value === undefined || value === '') {
            return '0%'
        }

        const numValue = typeof value === 'string' ? parseFloat(value) : value

        if (isNaN(numValue)) {
            return '0%'
        }

        return `${numValue.toFixed(decimals)}%`
    }

    return {
        formatIDR,
        formatIDRDecimal,
        parseIDR,
        formatNumber,
        formatPercent
    }
}

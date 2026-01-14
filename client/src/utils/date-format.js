/**
 * Date Format Utilities
 * Format dates using dayjs
 */

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/id' // Indonesian locale

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.locale('id')

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(date) {
    if (!date) return '-'
    return dayjs(date).format('DD/MM/YYYY')
}

/**
 * Format date to DD MMM YYYY (e.g., 13 Jan 2026)
 */
export function formatDateMedium(date) {
    if (!date) return '-'
    return dayjs(date).format('DD MMM YYYY')
}

/**
 * Format date to full format (e.g., Senin, 13 Januari 2026)
 */
export function formatDateFull(date) {
    if (!date) return '-'
    return dayjs(date).format('dddd, DD MMMM YYYY')
}

/**
 * Format time to HH:mm
 */
export function formatTime(date) {
    if (!date) return '-'
    return dayjs(date).format('HH:mm')
}

/**
 * Format datetime to DD/MM/YYYY HH:mm
 */
export function formatDateTime(date) {
    if (!date) return '-'
    return dayjs(date).format('DD/MM/YYYY HH:mm')
}

/**
 * Format datetime to medium format
 */
export function formatDateTimeMedium(date) {
    if (!date) return '-'
    return dayjs(date).format('DD MMM YYYY, HH:mm')
}

/**
 * Format date to relative time (e.g., 2 hours ago)
 */
export function formatRelative(date) {
    if (!date) return '-'
    return dayjs(date).fromNow()
}

/**
 * Format date to ISO string
 */
export function toISOString(date) {
    if (!date) return null
    return dayjs(date).toISOString()
}

/**
 * Parse date string
 */
export function parseDate(dateString, format = 'DD/MM/YYYY') {
    return dayjs(dateString, format)
}

/**
 * Check if date is valid
 */
export function isValidDate(date) {
    return dayjs(date).isValid()
}

/**
 * Get start of day
 */
export function startOfDay(date = new Date()) {
    return dayjs(date).startOf('day').toDate()
}

/**
 * Get end of day
 */
export function endOfDay(date = new Date()) {
    return dayjs(date).endOf('day').toDate()
}

/**
 * Get date difference in days
 */
export function diffInDays(date1, date2) {
    return dayjs(date1).diff(dayjs(date2), 'day')
}

/**
 * Add days to date
 */
export function addDays(date, days) {
    return dayjs(date).add(days, 'day').toDate()
}

/**
 * Subtract days from date
 */
export function subtractDays(date, days) {
    return dayjs(date).subtract(days, 'day').toDate()
}

/**
 * Check if date is before another date
 */
export function isBefore(date, compareDate) {
    return dayjs(date).isBefore(dayjs(compareDate))
}

/**
 * Check if date is after another date
 */
export function isAfter(date, compareDate) {
    return dayjs(date).isAfter(dayjs(compareDate))
}

export default {
    formatDate,
    formatDateMedium,
    formatDateFull,
    formatTime,
    formatDateTime,
    formatDateTimeMedium,
    formatRelative,
    toISOString,
    parseDate,
    isValidDate,
    startOfDay,
    endOfDay,
    diffInDays,
    addDays,
    subtractDays,
    isBefore,
    isAfter
}

/**
 * Password Utility
 * Handles password hashing and verification using bcrypt
 */

import bcrypt from 'bcryptjs'
import { config } from '@config/env'

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(config.security.bcryptSaltRounds)
  return bcrypt.hash(password, salt)
}

/**
 * Verify password against hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with message
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean
  message?: string
} => {
  // Minimum 8 characters
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password minimal 8 karakter'
    }
  }

  // Must contain uppercase
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password harus mengandung huruf besar'
    }
  }

  // Must contain lowercase
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password harus mengandung huruf kecil'
    }
  }

  // Must contain number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password harus mengandung angka'
    }
  }

  return { isValid: true }
}

/**
 * Generate random password
 * @param length - Length of password (default: 12)
 * @returns Random password
 */
export const generateRandomPassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'
  
  const allChars = uppercase + lowercase + numbers + symbols
  let password = ''

  // Ensure at least one of each required character type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

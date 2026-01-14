/**
 * Authentication DTOs
 * Zod schemas for validating authentication requests
 */

import { z } from 'zod'
import { VALIDATION_MESSAGES } from '@constants/messages'

/**
 * Login DTO
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email or Username is required'),
  password: z
    .string()
    .min(1, 'Password is required')
})

export type LoginDTO = z.infer<typeof loginSchema>

/**
 * Register DTO
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, VALIDATION_MESSAGES.USERNAME_MIN_LENGTH)
    .max(20, VALIDATION_MESSAGES.USERNAME_MAX_LENGTH)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  password: z
    .string()
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .optional()
})

export type RegisterDTO = z.infer<typeof registerSchema>

/**
 * Change Password DTO
 */
export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>

/**
 * Update Profile DTO
 */
export const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  phone: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional()
})

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>

/**
 * Refresh Token DTO
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>

/**
 * Forgot Password DTO
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
})

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>

/**
 * Reset Password DTO
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>

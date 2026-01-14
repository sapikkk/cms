/**
 * Rate Limiter Middleware
 * Prevents DDoS and brute-force attacks
 */

import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'
import { config } from '../config/env'

/**
 * Default API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak request dari IP ini. Coba lagi dalam 15 menit.',
      code: 'RATE_LIMIT_EXCEEDED'
    })
  }
})

/**
 * Strict rate limiter for authentication endpoints
 * 5 login attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    })
  }
})

/**
 * Very strict limiter for password reset
 * 3 requests per hour per IP
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again later.',
    code: 'PASSWORD_RESET_LIMIT_EXCEEDED',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak permintaan reset password. Coba lagi dalam 1 jam.',
      code: 'PASSWORD_RESET_LIMIT_EXCEEDED'
    })
  }
})

/**
 * Lenient limiter for public pages
 * 300 requests per 15 minutes per IP
 */
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Higher limit for public content
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
})

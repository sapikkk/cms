/**
 * JWT Utility
 * Handles JWT token generation and verification
 */

import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { config } from '@config/env'


export interface JWTPayload {
  userId: string
  email: string
  role: string
  username: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

/**
 * Generate access token
 * @param payload - JWT payload
 * @returns Access token
 */
export const generateAccessToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as any,
    issuer: 'coffeeshop-cms',
    audience: 'coffeeshop-users'
  }
  return jwt.sign(payload, config.jwt.secret as Secret, options)
}

/**
 * Generate refresh token
 * @param payload - JWT payload
 * @returns Refresh token
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as any,
    issuer: 'coffeeshop-cms',
    audience: 'coffeeshop-users'
  }
  return jwt.sign(
    { userId: payload.userId },
    config.jwt.refreshSecret as Secret,
    options
  )
}

/**
 * Generate token pair (access + refresh)
 * @param payload - JWT payload
 * @returns Token pair
 */
export const generateTokenPair = (payload: JWTPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  }
}

/**
 * Verify access token
 * @param token - JWT token
 * @returns Decoded payload
 */
export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'coffeeshop-cms',
      audience: 'coffeeshop-users'
    }) as JWTPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TOKEN_EXPIRED')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('TOKEN_INVALID')
    }
    throw error
  }
}

/**
 * Verify refresh token
 * @param token - Refresh token
 * @returns Decoded payload
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'coffeeshop-cms',
      audience: 'coffeeshop-users'
    }) as { userId: string }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('REFRESH_TOKEN_EXPIRED')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('REFRESH_TOKEN_INVALID')
    }
    throw error
  }
}

/**
 * Decode token without verification (for debugging)
 * @param token - JWT token
 * @returns Decoded token
 */
export const decodeToken = (token: string): any => {
  return jwt.decode(token)
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token or null
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  
  return parts[1]
}

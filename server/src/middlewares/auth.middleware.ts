/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { verifyAccessToken, extractTokenFromHeader } from '@utils/jwt'
import { prisma } from '@config/db'
import { ERROR_MESSAGES } from '@constants/messages'

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(req.headers.authorization)
    console.log('[Auth Debug] Token present:', !!token)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_INVALID
      })
    }

    // Verify token
    let decoded
    try {
      decoded = verifyAccessToken(token)
    } catch (error: any) {
      if (error.message === 'TOKEN_EXPIRED') {
        return res.status(401).json({
          success: false,
          message: ERROR_MESSAGES.TOKEN_EXPIRED,
          code: 'TOKEN_EXPIRED'
        })
      }
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_INVALID
      })
    }

    // Check if user exists and is not locked
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isLocked: true
      }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      })
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: ERROR_MESSAGES.ACCOUNT_LOCKED
      })
    }

    // Attach user to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't block if not
 */
export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)

    if (token) {
      try {
        const decoded = verifyAccessToken(token)
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            isLocked: true
          }
        })

        if (user && !user.isLocked) {
          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
            username: user.username
          }
        }
      } catch (error) {
        // Token invalid, but we don't block the request
      }
    }

    next()
  } catch (error) {
    next()
  }
}

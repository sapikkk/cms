/**
 * Lock Middleware
 * Real-time check if user account is locked
 * Even with valid token, locked users cannot access API
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { prisma } from '@config/db'
import { ERROR_MESSAGES } from '@constants/messages'

/**
 * Check if user account is locked in real-time
 * This middleware runs AFTER authentication
 * It queries the database to get the latest lock status
 */
export const checkLockStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      })
    }

    // Query database for real-time lock status
    // This ensures that if Master Admin locks an account,
    // the user is immediately blocked even with valid token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isLocked: true, role: true }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      })
    }

    // Check if account is locked
    // MASTER_ADMIN accounts cannot be locked (anti-lock protection)
    if (user.isLocked && user.role !== 'MASTER_ADMIN') {
      return res.status(423).json({
        success: false,
        message: 'ACCOUNT_LOCKED_BY_MASTER',
        detail: 'Akun Anda telah dinonaktifkan oleh Master Admin. Hubungi administrator untuk pemulihan akses.',
        code: 'ACCOUNT_LOCKED'
      })
    }

    next()
  } catch (error) {
    console.error('Lock check error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Lock a user account (Master Admin only)
 */
export const lockUserAccount = async (userId: string, lockedBy: string): Promise<boolean> => {
  try {
    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    // Cannot lock MASTER_ADMIN
    if (user?.role === 'MASTER_ADMIN') {
      throw new Error('Cannot lock Master Admin account')
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isLocked: true }
    })

    // Log the lock action
    await prisma.activityLog.create({
      data: {
        userId: lockedBy,
        action: 'LOCK',
        entity: 'User',
        targetId: userId,
        details: {
          action: 'Account locked',
          timestamp: new Date().toISOString()
        }
      }
    })

    return true
  } catch (error) {
    console.error('Lock user error:', error)
    return false
  }
}

/**
 * Unlock a user account
 */
export const unlockUserAccount = async (userId: string, unlockedBy: string): Promise<boolean> => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isLocked: false }
    })

    // Log the unlock action
    await prisma.activityLog.create({
      data: {
        userId: unlockedBy,
        action: 'UNLOCK',
        entity: 'User',
        targetId: userId,
        details: {
          action: 'Account unlocked',
          timestamp: new Date().toISOString()
        }
      }
    })

    return true
  } catch (error) {
    console.error('Unlock user error:', error)
    return false
  }
}

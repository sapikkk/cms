/**
 * User Controller
 * Master Admin - User management operations
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { prisma } from '@config/db'
import { lockUserAccount, unlockUserAccount } from '@middlewares/lock.middleware'
import { ERROR_MESSAGES } from '@constants/messages'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Get all users (Master Admin only)
 */
export const getAllUsers = async (
  _req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isLocked: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            logs: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    })
  } catch (error) {
    console.error('Get users error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}


/**
 * Create new user (Master Admin only)
 */
export const createUser = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { username, email, password, role, fullName } = req.body

    // Basic Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      })
    }

    // Role Validation
    const validRoles = ['ADMIN_OWNER', 'MEDIA_STAFF', 'USER_PUBLIC']
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      })
    }

    // Check availability
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Create User
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        role: role || 'USER_PUBLIC',
        isLocked: false
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        fullName: true,
        createdAt: true,
        isLocked: true,
        avatar: true
      }
    })

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    })
  } catch (error) {
    console.error('Create user error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Get user by ID
 */
export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { logs: true }
        }
      }
    })

    // Get recent activity logs separately
    const recentLogs = await prisma.activityLog.findMany({
      where: { userId: id },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        action: true,
        entity: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      })
    }

    return res.status(200).json({
      success: true,
      data: { ...user, logs: recentLogs }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Lock user account (Master Admin only)
 */
export const lockUser = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params
    const adminId = req.user!.userId

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true, username: true }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      })
    }

    // Cannot lock Master Admin
    if (user.role === 'MASTER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Master Admin account cannot be locked'
      })
    }

    // Lock the user
    const success = await lockUserAccount(id, adminId)

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to lock account'
      })
    }

    return res.status(200).json({
      success: true,
      message: `Account ${user.username} has been locked`
    })
  } catch (error) {
    console.error('Lock user error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Unlock user account (Master Admin only)
 */
export const unlockUser = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params
    const adminId = req.user!.userId

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { username: true }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      })
    }

    // Unlock the user
    const success = await unlockUserAccount(id, adminId)

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to unlock account'
      })
    }

    return res.status(200).json({
      success: true,
      message: `Account ${user.username} has been unlocked`
    })
  } catch (error) {
    console.error('Unlock user error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Update user role (Master Admin only)
 */
export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params
    const { role } = req.body

    // Validate role
    const validRoles = ['ADMIN_OWNER', 'MEDIA_STAFF', 'USER_PUBLIC']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Cannot assign MASTER_ADMIN role.'
      })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      })
    }

    // Cannot change Master Admin role
    if (user.role === 'MASTER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Master Admin role cannot be changed'
      })
    }

    // Update role
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    })

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: updated
    })
  } catch (error) {
    console.error('Update role error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Delete user (Master Admin only)
 */
export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      })
    }

    // Cannot delete Master Admin
    if (user.role === 'MASTER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Master Admin account cannot be deleted'
      })
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    })

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Activity Log Controller
 * Master Admin - Audit log operations
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { prisma } from '@config/db'
import { ERROR_MESSAGES } from '@constants/messages'

/**
 * Get all activity logs with pagination and filters
 */
export const getActivityLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const {
      page = '1',
      limit = '50',
      action,
      entity,
      userId,
      startDate,
      endDate
    } = req.query

    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {}

    if (action) {
      where.action = action
    }

    if (entity) {
      where.entity = entity
    }

    if (userId) {
      where.userId = userId
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string)
      }
    }

    // Get logs with pagination
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.activityLog.count({ where })
    ])

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Get activity logs error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Get activity log by ID
 */
export const getActivityLogById = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params

    const log = await prisma.activityLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Activity log not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: log
    })
  } catch (error) {
    console.error('Get activity log error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Get activity logs for a specific user
 */
export const getUserActivityLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { userId } = req.params
    const { limit = '20' } = req.query

    const logs = await prisma.activityLog.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string, 10)
    })

    return res.status(200).json({
      success: true,
      data: logs
    })
  } catch (error) {
    console.error('Get user activity logs error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Get activity stats (for dashboard)
 */
export const getActivityStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todayCount, weekCount, actionStats] = await Promise.all([
      // Today's activities
      prisma.activityLog.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      }),
      // This week's activities
      prisma.activityLog.count({
        where: {
          createdAt: {
            gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Group by action
      prisma.activityLog.groupBy({
        by: ['action'],
        _count: {
          action: true
        }
      })
    ])

    return res.status(200).json({
      success: true,
      data: {
        today: todayCount,
        thisWeek: weekCount,
        byAction: actionStats.map((stat: { action: string; _count: { action: number } }) => ({
          action: stat.action,
          count: stat._count.action
        }))
      }
    })
  } catch (error) {
    console.error('Get activity stats error:', error)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    })
  }
}

/**
 * Log Service
 * Activity logging utilities
 */

import { prisma } from '@config/db'
import { ActivityAction } from '@prisma/client'

export class LogService {
  /**
   * Create activity log
   */
  async createLog(data: {
    userId: string
    action: ActivityAction
    entity: string
    targetId?: string
    targetName?: string
    details?: any
    ipAddress?: string
    userAgent?: string
  }) {
    return await prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        targetId: data.targetId,
        targetName: data.targetName,
        details: data.details || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }
    })
  }

  /**
   * Get logs with filters
   */
  async getLogs(filters: {
    userId?: string
    action?: ActivityAction
    entity?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }) {
    const where: any = {}

    if (filters.userId) where.userId = filters.userId
    if (filters.action) where.action = filters.action
    if (filters.entity) where.entity = filters.entity

    if (filters.startDate || filters.endDate) {
      where.createdAt = {}
      if (filters.startDate) where.createdAt.gte = filters.startDate
      if (filters.endDate) where.createdAt.lte = filters.endDate
    }

    return await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, fullName: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 100
    })
  }

  /**
   * Get user activity summary
   */
  async getUserActivitySummary(userId: string) {
    const logs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const actionCounts = await prisma.activityLog.groupBy({
      by: ['action'],
      where: { userId },
      _count: {
        action: true
      }
    })

    return {
      recentLogs: logs,
      actionCounts
    }
  }

  /**
   * Get entity change history
   */
  async getEntityHistory(entity: string, targetId: string) {
    return await prisma.activityLog.findMany({
      where: {
        entity,
        targetId
      },
      include: {
        user: {
          select: { id: true, username: true, fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}

export default new LogService()

/**
 * Notification Controller
 * Handles notification HTTP requests
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class NotificationController {
  /**
   * Get all notifications
   * GET /api/v1/notifications
   */
  async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { active, type } = req.query

      const where: any = {}
      
      if (active !== undefined) {
        where.isActive = active === 'true'
      }
      
      if (type) {
        where.notificationType = type
      }

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      })

      res.status(200).json({
        success: true,
        data: notifications
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get active notifications (for display)
   * GET /api/v1/notifications/active
   */
  async getActiveNotifications(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const now = new Date()

      const notifications = await prisma.notification.findMany({
        where: {
          isActive: true,
          OR: [
            { startDate: null },
            { startDate: { lte: now } }
          ],
          AND: [
            {
              OR: [
                { endDate: null },
                { endDate: { gte: now } }
              ]
            }
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      })

      res.status(200).json({
        success: true,
        data: notifications
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get notification by ID
   * GET /api/v1/notifications/:id
   */
  async getNotificationById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const notification = await prisma.notification.findUnique({
        where: { id }
      })

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notifikasi tidak ditemukan'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: notification
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create notification
   * POST /api/v1/notifications
   */
  async createNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, createdAt, updatedAt, ...data } = req.body

      // Handle empty strings for dates
      if (data.startDate === '') data.startDate = null
      if (data.endDate === '') data.endDate = null
      
      // Convert date strings to Date objects if present
      if (data.startDate) data.startDate = new Date(data.startDate)
      if (data.endDate) data.endDate = new Date(data.endDate)

      const notification = await prisma.notification.create({
        data
      })

      res.status(201).json({
        success: true,
        message: 'Notifikasi berhasil dibuat',
        data: notification
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update notification
   * PUT /api/v1/notifications/:id
   */
  async updateNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const data = req.body

      const notification = await prisma.notification.update({
        where: { id },
        data
      })

      res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil diupdate',
        data: notification
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete notification
   * DELETE /api/v1/notifications/:id
   */
  async deleteNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      await prisma.notification.delete({
        where: { id }
      })

      res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil dihapus'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Toggle active status
   * PATCH /api/v1/notifications/:id/toggle
   */
  async toggleActive(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const notification = await prisma.notification.findUnique({
        where: { id }
      })

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notifikasi tidak ditemukan'
        })
        return
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { isActive: !notification.isActive }
      })

      res.status(200).json({
        success: true,
        message: `Notifikasi ${updated.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        data: updated
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new NotificationController()

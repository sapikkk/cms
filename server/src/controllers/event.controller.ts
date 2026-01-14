/**
 * Event Controller
 * Handles event HTTP requests
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class EventController {
  /**
   * Get all events
   * GET /api/v1/events
   */
  async getEvents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, published, featured, upcoming } = req.query

      const where: any = {}
      
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ]
      }
      
      if (published !== undefined) {
        where.isPublished = published === 'true'
      }
      
      if (featured !== undefined) {
        where.isFeatured = featured === 'true'
      }
      
      if (upcoming === 'true') {
        where.eventDate = { gte: new Date() }
      }

      const events = await prisma.event.findMany({
        where,
        include: {
          creator: {
            select: { id: true, fullName: true, username: true }
          }
        },
        orderBy: { eventDate: 'asc' }
      })

      res.status(200).json({
        success: true,
        data: events
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get event by ID
   * GET /api/v1/events/:id
   */
  async getEventById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          creator: {
            select: { id: true, fullName: true, username: true }
          }
        }
      })

      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Event tidak ditemukan'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: event
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create event
   * POST /api/v1/events
   */
  async createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, createdAt, updatedAt, createdBy, ...data } = req.body
      const userId = req.user?.userId

      // Ensure dates are date objects if they are strings
      if (typeof data.eventDate === 'string') {
        data.eventDate = new Date(data.eventDate)
      }
      if (data.registrationDeadline && typeof data.registrationDeadline === 'string') {
        data.registrationDeadline = new Date(data.registrationDeadline)
      }

      const event = await prisma.event.create({
        data: {
          ...data,
          createdBy: userId
        }
      })

      res.status(201).json({
        success: true,
        message: 'Event berhasil dibuat',
        data: event
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update event
   * PUT /api/v1/events/:id
   */
  async updateEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const data = req.body

      const event = await prisma.event.update({
        where: { id },
        data
      })

      res.status(200).json({
        success: true,
        message: 'Event berhasil diupdate',
        data: event
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete event
   * DELETE /api/v1/events/:id
   */
  async deleteEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      await prisma.event.delete({
        where: { id }
      })

      res.status(200).json({
        success: true,
        message: 'Event berhasil dihapus'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Register participant
   * POST /api/v1/events/:id/register
   */
  async registerParticipant(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const event = await prisma.event.findUnique({
        where: { id }
      })

      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Event tidak ditemukan'
        })
        return
      }

      if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
        res.status(400).json({
          success: false,
          message: 'Event sudah penuh'
        })
        return
      }

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          currentParticipants: {
            increment: 1
          }
        }
      })

      res.status(200).json({
        success: true,
        message: 'Berhasil mendaftar event',
        data: updatedEvent
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new EventController()

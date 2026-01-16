/**
 * FunFact Controller
 * Handles fun fact and comment HTTP requests
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class FunFactController {
  /**
   * Get all fun facts
   * GET /api/v1/funfacts
   */
  async getFunFacts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, published } = req.query

      const where: any = {}
      
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { content: { contains: search as string, mode: 'insensitive' } }
        ]
      }
      
      if (category) {
        where.category = category
      }
      
      if (published !== undefined) {
        where.isPublished = published === 'true'
      }

      const funFacts = await prisma.funFact.findMany({
        where,
        include: {
          _count: {
            select: { comments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({
        success: true,
        data: funFacts
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get fun fact by ID
   * GET /api/v1/funfacts/:id
   */
  async getFunFactById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const funFact = await prisma.funFact.findUnique({
        where: { id },
        include: {
          comments: {
            where: { isVisible: true, isApproved: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (!funFact) {
        res.status(404).json({
          success: false,
          message: 'Fun fact tidak ditemukan'
        })
        return
      }

      // Increment view count
      await prisma.funFact.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      })

      res.status(200).json({
        success: true,
        data: funFact
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create fun fact
   * POST /api/v1/funfacts
   */
  async createFunFact(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body

      const funFact = await prisma.funFact.create({
        data
      })

      res.status(201).json({
        success: true,
        message: 'Fun fact berhasil dibuat',
        data: funFact
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update fun fact
   * PUT /api/v1/funfacts/:id
   */
  async updateFunFact(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const data = req.body

      const funFact = await prisma.funFact.update({
        where: { id },
        data
      })

      res.status(200).json({
        success: true,
        message: 'Fun fact berhasil diupdate',
        data: funFact
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete fun fact
   * DELETE /api/v1/funfacts/:id
   */
  async deleteFunFact(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      await prisma.funFact.delete({
        where: { id }
      })

      res.status(200).json({
        success: true,
        message: 'Fun fact berhasil dihapus'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get comments for a fun fact
   * GET /api/v1/funfacts/:id/comments
   */
  async getComments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const comments = await prisma.comment.findMany({
        where: {
          funFactId: id,
          isVisible: true,
          isApproved: true
        },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({
        success: true,
        data: comments
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create comment
   * POST /api/v1/funfacts/:id/comments
   */
  async createComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { text, contentHtml, authorName, authorEmail } = req.body

      const comment = await prisma.comment.create({
        data: {
          funFactId: id,
          text,
          contentHtml: contentHtml || text, // Use contentHtml or fallback to text
          authorName,
          authorEmail,
          isApproved: true,  // Auto-approve for now
          isVisible: true
        }
      })

      res.status(201).json({
        success: true,
        message: 'Komentar berhasil ditambahkan.',
        data: comment
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get all comments (for moderation)
   * GET /api/v1/comments
   */
  async getAllComments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { approved } = req.query

      const where: any = {}
      
      if (approved !== undefined) {
        where.isApproved = approved === 'true'
      }

      const comments = await prisma.comment.findMany({
        where,
        include: {
          funFact: {
            select: { id: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({
        success: true,
        data: comments
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Approve comment
   * PATCH /api/v1/comments/:id/approve
   */
  async approveComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const comment = await prisma.comment.update({
        where: { id },
        data: { isApproved: true }
      })

      res.status(200).json({
        success: true,
        message: 'Komentar berhasil disetujui',
        data: comment
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete comment
   * DELETE /api/v1/comments/:id
   */
  async deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      await prisma.comment.delete({
        where: { id }
      })

      res.status(200).json({
        success: true,
        message: 'Komentar berhasil dihapus'
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new FunFactController()

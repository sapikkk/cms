/**
 * Merchandise Controller
 * Handles merchandise HTTP requests
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class MerchandiseController {
  /**
   * Get all merchandise
   * GET /api/v1/merchandise
   */
  async getMerchandise(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, active, featured } = req.query

      const where: any = {}
      
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ]
      }
      
      if (category) {
        where.category = category
      }
      
      if (active !== undefined) {
        where.isActive = active === 'true'
      }
      
      if (featured !== undefined) {
        where.isFeatured = featured === 'true'
      }

      const merchandise = await prisma.merchandise.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({
        success: true,
        data: merchandise
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get merchandise by ID
   * GET /api/v1/merchandise/:id
   */
  async getMerchandiseById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const merchandise = await prisma.merchandise.findUnique({
        where: { id }
      })

      if (!merchandise) {
        res.status(404).json({
          success: false,
          message: 'Merchandise tidak ditemukan'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: merchandise
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create merchandise
   * POST /api/v1/merchandise
   */
  async createMerchandise(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body

      const merchandise = await prisma.merchandise.create({
        data
      })

      res.status(201).json({
        success: true,
        message: 'Merchandise berhasil dibuat',
        data: merchandise
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update merchandise
   * PUT /api/v1/merchandise/:id
   */
  async updateMerchandise(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const data = req.body

      const merchandise = await prisma.merchandise.update({
        where: { id },
        data
      })

      res.status(200).json({
        success: true,
        message: 'Merchandise berhasil diupdate',
        data: merchandise
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete merchandise
   * DELETE /api/v1/merchandise/:id
   */
  async deleteMerchandise(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      await prisma.merchandise.delete({
        where: { id }
      })

      res.status(200).json({
        success: true,
        message: 'Merchandise berhasil dihapus'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update stock
   * PATCH /api/v1/merchandise/:id/stock
   */
  async updateStock(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { stock } = req.body

      const merchandise = await prisma.merchandise.update({
        where: { id },
        data: { stock }
      })

      res.status(200).json({
        success: true,
        message: 'Stok berhasil diupdate',
        data: merchandise
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new MerchandiseController()

/**
 * Section Controller
 * Handles landing page section configuration
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class SectionController {
  /**
   * Get all sections
   * GET /api/v1/sections
   */
  async getSections(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pageId, visible } = req.query

      const where: any = {}
      
      if (pageId !== undefined) {
        where.pageId = pageId === 'null' ? null : pageId as string
      }
      
      if (visible !== undefined) {
        where.isVisible = visible === 'true'
      }

      const sections = await prisma.section.findMany({
        where,
        orderBy: { sortOrder: 'asc' }
      })

      res.status(200).json({
        success: true,
        data: sections
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get visible sections for rendering
   * GET /api/v1/sections/visible
   */
  async getVisibleSections(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pageId } = req.query

      const sections = await prisma.section.findMany({
        where: {
          isVisible: true,
          pageId: pageId ? (pageId as string) : null
        },
        orderBy: { sortOrder: 'asc' }
      })

      res.status(200).json({
        success: true,
        data: sections
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get section by ID
   * GET /api/v1/sections/:id
   */
  async getSectionById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const section = await prisma.section.findUnique({
        where: { id }
      })

      if (!section) {
        res.status(404).json({
          success: false,
          message: 'Section tidak ditemukan'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: section
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create section
   * POST /api/v1/sections
   */
  async createSection(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body

      const section = await prisma.section.create({
        data
      })

      res.status(201).json({
        success: true,
        message: 'Section berhasil dibuat',
        data: section
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update section
   * PUT /api/v1/sections/:id
   */
  async updateSection(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const data = req.body

      const section = await prisma.section.update({
        where: { id },
        data
      })

      res.status(200).json({
        success: true,
        message: 'Section berhasil diupdate',
        data: section
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete section
   * DELETE /api/v1/sections/:id
   */
  async deleteSection(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      await prisma.section.delete({
        where: { id }
      })

      res.status(200).json({
        success: true,
        message: 'Section berhasil dihapus'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Reorder sections
   * POST /api/v1/sections/reorder
   */
  async reorderSections(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sections } = req.body // Array of { id, sortOrder }

      // Update all sections in a transaction
      await prisma.$transaction(
        sections.map((section: { id: string; sortOrder: number }) =>
          prisma.section.update({
            where: { id: section.id },
            data: { sortOrder: section.sortOrder }
          })
        )
      )

      res.status(200).json({
        success: true,
        message: 'Section berhasil diurutkan'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Toggle visibility
   * PATCH /api/v1/sections/:id/toggle
   */
  async toggleVisibility(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      const section = await prisma.section.findUnique({
        where: { id }
      })

      if (!section) {
        res.status(404).json({
          success: false,
          message: 'Section tidak ditemukan'
        })
        return
      }

      const updated = await prisma.section.update({
        where: { id },
        data: { isVisible: !section.isVisible }
      })

      res.status(200).json({
        success: true,
        message: `Section ${updated.isVisible ? 'ditampilkan' : 'disembunyikan'}`,
        data: updated
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new SectionController()

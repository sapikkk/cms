/**
 * Config Controller
 * Handles system configuration (footer, hero, etc.)
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ConfigController {
  /**
   * Get config by key
   * GET /api/v1/config/:key
   */
  async getConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key } = req.params

      const config = await prisma.systemConfig.findUnique({
        where: { key }
      })

      if (!config) {
        res.status(404).json({
          success: false,
          message: 'Konfigurasi tidak ditemukan'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: config
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update or create config
   * PUT /api/v1/config/:key
   */
  async updateConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key } = req.params
      const { value, description } = req.body

      const config = await prisma.systemConfig.upsert({
        where: { key },
        update: { value, description },
        create: {
          key,
          value,
          description
        }
      })

      res.status(200).json({
        success: true,
        message: 'Konfigurasi berhasil diupdate',
        data: config
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get footer config
   * GET /api/v1/config/footer/config
   */
  async getFooterConfig(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: 'landing_footer_config' }
      })

      res.status(200).json({
        success: true,
        data: config?.value || null
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update footer config
   * PUT /api/v1/config/footer/config
   */
  async updateFooterConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { value } = req.body

      const config = await prisma.systemConfig.upsert({
        where: { key: 'landing_footer_config' },
        update: { value },
        create: {
          key: 'landing_footer_config',
          value,
          description: 'Landing page footer configuration',
          isPublic: true
        }
      })

      res.status(200).json({
        success: true,
        message: 'Konfigurasi footer berhasil diupdate',
        data: config
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get hero config
   * GET /api/v1/config/hero/config
   */
  async getHeroConfig(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: 'landing_hero_config' }
      })

      res.status(200).json({
        success: true,
        data: config?.value || null
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update hero config
   * PUT /api/v1/config/hero/config
   */
  async updateHeroConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { value } = req.body

      const config = await prisma.systemConfig.upsert({
        where: { key: 'landing_hero_config' },
        update: { value },
        create: {
          key: 'landing_hero_config',
          value,
          description: 'Landing page hero section configuration',
          isPublic: true
        }
      })

      res.status(200).json({
        success: true,
        message: 'Konfigurasi hero berhasil diupdate',
        data: config
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new ConfigController()

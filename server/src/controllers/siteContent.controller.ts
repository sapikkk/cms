/**
 * Site Content Controller
 * API handlers for landing page content management
 */

import { Request, Response, NextFunction } from 'express'
import siteContentService from '@services/siteContent.service'

export class SiteContentController {
  /**
   * Get all content (Admin)
   */
  async getAllContent(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const content = await siteContentService.getAllContent()
      res.json({
        success: true,
        data: content
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get public content (Storefront)
   */
  async getPublicContent(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const content = await siteContentService.getPublicContent()
      
      if (!content) {
        res.status(503).json({
          success: false,
          message: 'Landing page is currently disabled'
        })
        return
      }

      res.json({
        success: true,
        data: content
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get navbar content
   */
  async getNavbar(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const navbar = await siteContentService.getNavbar()
      res.json({
        success: true,
        data: navbar
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update navbar content
   */
  async updateNavbar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await siteContentService.updateNavbar(req.body)
      res.json({
        success: true,
        message: 'Navbar updated successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get hero content
   */
  async getHero(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hero = await siteContentService.getHero()
      res.json({
        success: true,
        data: hero
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update hero content
   */
  async updateHero(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await siteContentService.updateHero(req.body)
      res.json({
        success: true,
        message: 'Hero section updated successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get footer content
   */
  async getFooter(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const footer = await siteContentService.getFooter()
      res.json({
        success: true,
        data: footer
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update footer content
   */
  async updateFooter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await siteContentService.updateFooter(req.body)
      res.json({
        success: true,
        message: 'Footer updated successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get section content by key
   */
  async getSectionContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { section } = req.params
      const key = `landing_${section}`
      
      const content = await siteContentService.getContent(key)
      
      if (!content) {
        res.status(404).json({
          success: false,
          message: 'Section not found'
        })
        return
      }

      res.json({
        success: true,
        data: content
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update section content by key
   */
  async updateSectionContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { section } = req.params
      const key = `landing_${section}`
      
      const result = await siteContentService.updateContent(key, req.body)
      
      res.json({
        success: true,
        message: `${section} section updated successfully`,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get site settings
   */
  async getSiteSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await siteContentService.getSiteSettings()
      res.json({
        success: true,
        data: settings
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update site settings
   */
  async updateSiteSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await siteContentService.updateSiteSettings(req.body)
      res.json({
        success: true,
        message: 'Site settings updated successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Toggle landing page active status
   */
  async toggleLandingPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isActive } = req.body
      const result = await siteContentService.toggleLandingPageActive(isActive)
      res.json({
        success: true,
        message: isActive ? 'Landing page activated' : 'Landing page deactivated',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get section order
   */
  async getSectionOrder(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await siteContentService.getSectionOrder()
      res.json({
        success: true,
        data: order
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update section order and visibility
   */
  async updateSectionOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sections } = req.body
      const result = await siteContentService.updateSectionOrder(sections)
      res.json({
        success: true,
        message: 'Section order updated successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Initialize default content
   */
  async initializeDefaults(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await siteContentService.initializeDefaults()
      res.json({
        success: true,
        message: 'Default content initialized successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new SiteContentController()

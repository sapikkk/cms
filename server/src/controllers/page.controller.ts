/**
 * Page Controller
 * Handle CMS page management
 */

import { Request, Response, NextFunction } from 'express'
import { prisma } from '@config/db'
import pageService from '@services/page.service'

export const getPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { published, inNavbar } = req.query

    const where: any = {}
    if (published !== undefined) where.isPublished =  published === 'true'
    if (inNavbar !== undefined) where.inNavbar = inNavbar === 'true'

    const pages = await prisma.page.findMany({
      where,
      include: {
        creator: {
          select: { id: true, username: true, fullName: true }
        }
      },
      orderBy: { navOrder: 'asc' }
    })

    res.json({
      success: true,
      data: pages
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Public endpoint for fetching navbar pages (no auth required)
 * Used by storefront navbar to display menu items
 */
export const getNavbarPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await prisma.page.findMany({
      where: {
        isPublished: true,
        inNavbar: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        navOrder: true
      },
      orderBy: { navOrder: 'asc' }
    })

    res.json({
      success: true,
      data: pages
    })
  } catch (error) {
    next(error)
  }
}

export const getPageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, username: true, fullName: true }
        },
        sections: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!page) {
      res.status(404).json({
        success: false,
        message: 'Page not found'
      })
      return
    }

    res.json({
      success: true,
      data: page
    })
  } catch (error) {
    next(error)
  }
}

export const getPageBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params

    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        creator: {
          select: { id: true, username: true, fullName: true }
        },
        sections: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!page) {
      res.status(404).json({
        success: false,
        message: 'Page not found'
      })
      return
    }

    res.json({
      success: true,
      data: page
    })
  } catch (error) {
    next(error)
  }
}

export const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, slug, metaTitle, metaDescription, metaKeywords, ogImage, isPublished, inNavbar, navOrder } = req.body
    const userId = (req as any).user?.userId

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        // sections will be added later via editor (not created here)
        metaTitle,
        metaDescription,
        metaKeywords,
        ogImage,
        isPublished: isPublished || false,
        inNavbar: inNavbar || false,
        navOrder: navOrder || 0,
        createdBy: userId
      }
    })

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: page
    })
  } catch (error) {
    next(error)
  }
}

export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updates = req.body

    const page = await prisma.page.update({
      where: { id },
      data: updates
    })

    res.json({
      success: true,
      message: 'Page updated successfully',
      data: page
    })
  } catch (error) {
    next(error)
  }
}

export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await prisma.page.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const publishPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const page = await prisma.page.update({
      where: { id },
      data: { isPublished: true }
    })

    res.json({
      success: true,
      message: 'Page published successfully',
      data: page
    })
  } catch (error) {
    next(error)
  }
}

export const unpublishPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const page = await prisma.page.update({
      where: { id },
      data: { isPublished: false }
    })

    res.json({
      success: true,
      message: 'Page unpublished successfully',
      data: page
    })
  } catch (error) {
    next(error)
  }
}

export const toggleNavbar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    
    // First get current status
    const existing = await prisma.page.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ success: false, message: 'Page not found' })
      return
    }

    const page = await prisma.page.update({
      where: { id },
      data: { inNavbar: !existing.inNavbar }
    })

    res.json({
      success: true,
      message: `Page ${page.inNavbar ? 'added to' : 'removed from'} navbar`,
      data: page
    })
  } catch (error) {
    next(error)
  }
}


export const updateSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { sections } = req.body
    console.log('[PageController Debug] Received updateSections request. ID:', id, 'Sections Length:', sections?.length)

    const page = await pageService.updateSections(id, sections)

    res.status(200).json({
      success: true,
      message: 'Page sections updated successfully',
      data: page
    })
  } catch (error) {
    next(error)
  }
}

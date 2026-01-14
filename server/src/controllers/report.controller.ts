/**
 * Report Controller
 * Handle reporting and analytics
 */

import { Request, Response, NextFunction } from 'express'
import { prisma } from '@config/db'

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalProducts, totalPages, totalBooks, totalUsers] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.page.count({ where: { isPublished: true } }),
      prisma.book.count({ where: { isPublished: true } }),
      prisma.user.count()
    ])

    res.json({
      success: true,
      data: {
        totalProducts,
        totalPages,
        totalBooks,
        totalUsers
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getActivityReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, action, entity } = req.query

    const where: any = {}
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate as string)
      if (endDate) where.createdAt.lte = new Date(endDate as string)
    }

    if (action) where.action = action
    if (entity) where.entity = entity

    const activities = await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // Aggregate stats
    const stats = await prisma.activityLog.groupBy({
      by: ['action'],
      where,
      _count: {
        action: true
      }
    })

    res.json({
      success: true,
      data: {
        activities,
        stats
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getProductReport = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        ingredients: true,
        variants: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const categoriesCount = await prisma.category.count()
    const activeProducts = products.filter((p: any) => p.isActive).length

    res.json({
      success: true,
      data: {
        products,
        summary: {
          total: products.length,
          active: activeProducts,
          inactive: products.length - activeProducts,
          categories: categoriesCount
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const exportReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, format } = req.query

    // TODO: Implement actual export logic with PDF/Excel generation
    // For now, return JSON data

    let data: any = {}

    switch (type) {
      case 'products':
        data = await prisma.product.findMany({ include: { category: true } })
        break
      case 'users':
        data = await prisma.user.findMany({ select: { id: true, username: true, email: true, role: true } })
        break
      case 'activities':
        data = await prisma.activityLog.findMany({ include: { user: true }, take: 1000 })
        break
      default:
        res.status(400).json({ success: false, message: 'Invalid report type' })
        return
    }

    res.json({
      success: true,
      data,
      format: format || 'json'
    })
  } catch (error) {
    next(error)
  }
}

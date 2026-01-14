/**
 * Report Service
 * Analytics and reporting business logic
 */

import { prisma } from '@config/db'
import { ActivityAction } from '@prisma/client'

export class ReportService {
  /**
   * Get dashboard overview statistics
   */
  async getDashboardStats() {
    const [
      totalProducts,
      activeProducts,
      totalPages,
      publishedPages,
      totalBooks,
      publishedBooks,
      totalUsers,
      recentActivities
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.page.count(),
      prisma.page.count({ where: { isPublished: true } }),
      prisma.book.count(),
      prisma.book.count({ where: { isPublished: true } }),
      prisma.user.count(),
      prisma.activityLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ])

    return {
      products: { total: totalProducts, active: activeProducts },
      pages: { total: totalPages, published: publishedPages },
      books: { total: totalBooks, published: publishedBooks },
      users: { total: totalUsers },
      activities: { last24h: recentActivities }
    }
  }

  /**
   * Get activity analytics
   */
  async getActivityAnalytics(startDate?: Date, endDate?: Date) {
    const where: any = {}
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [actionStats, entityStats, userStats] = await Promise.all([
      prisma.activityLog.groupBy({
        by: ['action'],
        where,
        _count: { action: true }
      }),
      prisma.activityLog.groupBy({
        by: ['entity'],
        where,
        _count: { entity: true }
      }),
      prisma.activityLog.groupBy({
        by: ['userId'],
        where,
        _count: { userId: true },
        orderBy: { _count: { userId: 'desc' } },
        take: 10
      })
    ])

    return {
      byAction: actionStats,
      byEntity: entityStats,
      topUsers: userStats
    }
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics() {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        ingredients: true,
        variants: true
      }
    })

    const categoryStats = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      averageIngredients: products.reduce((sum, p) => sum + p.ingredients.length, 0) / products.length,
      byCategory: categoryStats.map(cat => ({
        category: cat.name,
        count: cat._count.products
      }))
    }
  }

  /**
   * Export data for reporting
   */
  async exportData(type: string, filters: any = {}) {
    switch (type) {
      case 'products':
        return await prisma.product.findMany({
          include: { category: true, ingredients: true, variants: true }
        })
      
      case 'users':
        return await prisma.user.findMany({
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            role: true,
            isLocked: true,
            createdAt: true
          }
        })
      
      case 'activities':
        return await prisma.activityLog.findMany({
          where: filters,
          include: {
            user: {
              select: { username: true, fullName: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1000
        })
      
      case 'pages':
        return await prisma.page.findMany({
          include: {
            creator: {
              select: { username: true, fullName: true }
            }
          }
        })
      
      case 'books':
        return await prisma.book.findMany({
          include: {
            creator: {
              select: { username: true, fullName: true }
            }
          }
        })
      
      default:
        throw new Error('Invalid export type')
    }
  }
}

export default new ReportService()

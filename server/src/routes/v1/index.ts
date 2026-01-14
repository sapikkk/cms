/**
 * API Routes v1
 * Combines all route modules
 */

import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import productRoutes from './product.routes'
import bookRoutes from './book.routes'
import pageRoutes from './page.routes'
import reportRoutes from './report.routes'
import activityLogRoutes from './activityLog.routes'
import eventRoutes from './event.routes'
import merchandiseRoutes from './merchandise.routes'
import funfactRoutes from './funfact.routes'
import notificationRoutes from './notification.routes'
import sectionRoutes from './section.routes'
import configRoutes from './config.routes'
import siteContentRoutes from './siteContent.routes'

const router = Router()

/**
 * Core Routes
 */
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/books', bookRoutes)
router.use('/pages', pageRoutes)
router.use('/reports', reportRoutes)
router.use('/activity-logs', activityLogRoutes)

/**
 * New Feature Routes
 */
router.use('/events', eventRoutes)
router.use('/merchandise', merchandiseRoutes)
router.use('/funfacts', funfactRoutes)
router.use('/notifications', notificationRoutes)
router.use('/sections', sectionRoutes)
router.use('/config', configRoutes)
router.use('/site-content', siteContentRoutes)

// ==========================================
// HEALTH CHECK
// ==========================================
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    version: '2.1.0',
    timestamp: new Date().toISOString()
  })
})

export default router

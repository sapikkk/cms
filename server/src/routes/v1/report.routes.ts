/**
 * Report Routes  
 * Analytics and reporting endpoints
 */

import { Router } from 'express'
import * as reportController from '@controllers/report.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireRole } from '@middlewares/rbac.middleware'

const router = Router()

router.use(authenticate)

// Dashboard stats - accessible by all authenticated users
router.get('/dashboard', reportController.getDashboardStats)

// Reports - Admin Owner and above
router.get('/activity', requireRole('ADMIN_OWNER'), reportController.getActivityReport)
router.get('/products', requireRole('ADMIN_OWNER'), reportController.getProductReport)

// Export - Admin Owner and above
router.get('/export', requireRole('ADMIN_OWNER'), reportController.exportReport)

export default router

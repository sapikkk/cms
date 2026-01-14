/**
 * Activity Log Routes
 * Master Admin - Audit log endpoints
 */

import { Router } from 'express'
import * as activityLogController from '@controllers/activityLog.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireMasterAdmin } from '@middlewares/rbac.middleware'

const router = Router()

// All routes require Master Admin authentication
router.use(authenticate)
router.use(requireMasterAdmin)

/**
 * @route   GET /api/v1/activity-logs
 * @desc    Get all activity logs with pagination and filters
 * @access  Master Admin
 */
router.get('/', activityLogController.getActivityLogs)

/**
 * @route   GET /api/v1/activity-logs/stats
 * @desc    Get activity statistics
 * @access  Master Admin
 */
router.get('/stats', activityLogController.getActivityStats)

/**
 * @route   GET /api/v1/activity-logs/:id
 * @desc    Get activity log by ID
 * @access  Master Admin
 */
router.get('/:id', activityLogController.getActivityLogById)

/**
 * @route   GET /api/v1/activity-logs/user/:userId
 * @desc    Get activity logs for a specific user
 * @access  Master Admin
 */
router.get('/user/:userId', activityLogController.getUserActivityLogs)

export default router

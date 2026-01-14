/**
 * Notification Routes
 */

import { Router } from 'express'
import notificationController from '@controllers/notification.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireAnyAdmin } from '@middlewares/rbac.middleware'
import { auditCreate, auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

/**
 * Public routes
 */
router.get('/active', notificationController.getActiveNotifications)

/**
 * Protected routes (requires admin access)
 */
router.use(authenticate, requireAnyAdmin)

router.get('/', notificationController.getNotifications)
router.get('/:id', notificationController.getNotificationById)

router.post(
  '/',
  auditCreate('Notification'),
  notificationController.createNotification
)

router.put(
  '/:id',
  auditUpdate('Notification'),
  notificationController.updateNotification
)

router.patch(
  '/:id/toggle',
  auditUpdate('Notification'),
  notificationController.toggleActive
)

router.delete(
  '/:id',
  auditDelete('Notification'),
  notificationController.deleteNotification
)

export default router

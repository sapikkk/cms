/**
 * Merchandise Routes
 */

import { Router } from 'express'
import merchandiseController from '@controllers/merchandise.controller'
import { authenticate, optionalAuthenticate } from '@middlewares/auth.middleware'
import { requireAnyAdmin } from '@middlewares/rbac.middleware'
import { auditCreate, auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

/**
 * Public routes
 */
router.get('/', optionalAuthenticate, merchandiseController.getMerchandise)
router.get('/:id', optionalAuthenticate, merchandiseController.getMerchandiseById)

/**
 * Protected routes (requires admin access)
 */
router.use(authenticate, requireAnyAdmin)

router.post(
  '/',
  auditCreate('Merchandise'),
  merchandiseController.createMerchandise
)

router.put(
  '/:id',
  auditUpdate('Merchandise'),
  merchandiseController.updateMerchandise
)

router.patch(
  '/:id/stock',
  auditUpdate('Merchandise'),
  merchandiseController.updateStock
)

router.delete(
  '/:id',
  auditDelete('Merchandise'),
  merchandiseController.deleteMerchandise
)

export default router

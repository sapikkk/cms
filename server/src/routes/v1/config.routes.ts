/**
 * Config Routes
 */

import { Router } from 'express'
import configController from '@controllers/config.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireAnyAdmin } from '@middlewares/rbac.middleware'
import { auditUpdate } from '@middlewares/audit.middleware'

const router = Router()

/**
 * Public routes
 */
router.get('/footer/config', configController.getFooterConfig)
router.get('/hero/config', configController.getHeroConfig)

/**
 * Protected routes (requires admin access)
 */
router.use(authenticate, requireAnyAdmin)

router.get('/:key', configController.getConfig)

router.put(
  '/:key',
  auditUpdate('Config'),
  configController.updateConfig
)

router.put(
  '/footer/config',
  auditUpdate('Config'),
  configController.updateFooterConfig
)

router.put(
  '/hero/config',
  auditUpdate('Config'),
  configController.updateHeroConfig
)

export default router

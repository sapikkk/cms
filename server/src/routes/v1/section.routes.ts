/**
 * Section Routes
 */

import { Router } from 'express'
import sectionController from '@controllers/section.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireAnyAdmin } from '@middlewares/rbac.middleware'
import { auditCreate, auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

/**
 * Public routes
 */
router.get('/visible', sectionController.getVisibleSections)

/**
 * Protected routes (requires admin access)
 */
router.use(authenticate, requireAnyAdmin)

router.get('/', sectionController.getSections)
router.get('/:id', sectionController.getSectionById)

router.post(
  '/',
  auditCreate('Section'),
  sectionController.createSection
)

router.post(
  '/reorder',
  auditUpdate('Section'),
  sectionController.reorderSections
)

router.put(
  '/:id',
  auditUpdate('Section'),
  sectionController.updateSection
)

router.patch(
  '/:id/toggle',
  auditUpdate('Section'),
  sectionController.toggleVisibility
)

router.delete(
  '/:id',
  auditDelete('Section'),
  sectionController.deleteSection
)

export default router

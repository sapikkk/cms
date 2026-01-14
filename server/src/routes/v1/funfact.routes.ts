/**
 * Fun Fact Routes
 */

import { Router } from 'express'
import funfactController from '@controllers/funfact.controller'
import { authenticate, optionalAuthenticate } from '@middlewares/auth.middleware'
import { requireAnyAdmin } from '@middlewares/rbac.middleware'
import { auditCreate, auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

/**
 * Public routes
 */
router.get('/', optionalAuthenticate, funfactController.getFunFacts)
router.get('/:id', optionalAuthenticate, funfactController.getFunFactById)
router.get('/:id/comments', funfactController.getComments)
router.post('/:id/comments', funfactController.createComment)

/**
 * Protected routes (requires admin access)
 */
router.use(authenticate, requireAnyAdmin)

router.post(
  '/',
  auditCreate('FunFact'),
  funfactController.createFunFact
)

router.put(
  '/:id',
  auditUpdate('FunFact'),
  funfactController.updateFunFact
)

router.delete(
  '/:id',
  auditDelete('FunFact'),
  funfactController.deleteFunFact
)

// Comment management routes (admin only)
router.get('/comments/all', funfactController.getAllComments)
router.patch('/comments/:id/approve', funfactController.approveComment)
router.delete('/comments/:id', funfactController.deleteComment)

export default router

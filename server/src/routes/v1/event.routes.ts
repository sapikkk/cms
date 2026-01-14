/**
 * Event Routes
 */

import { Router } from 'express'
import eventController from '@controllers/event.controller'
import { authenticate, optionalAuthenticate } from '@middlewares/auth.middleware'
import { requireAnyAdmin } from '@middlewares/rbac.middleware'
import { auditCreate, auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

/**
 * Public routes
 */
router.get('/', optionalAuthenticate, eventController.getEvents)
router.get('/:id', optionalAuthenticate, eventController.getEventById)
router.post('/:id/register', eventController.registerParticipant)

/**
 * Protected routes (requires admin access)
 */
router.use(authenticate, requireAnyAdmin)

router.post(
  '/',
  auditCreate('Event'),
  eventController.createEvent
)

router.put(
  '/:id',
  auditUpdate('Event'),
  eventController.updateEvent
)

router.delete(
  '/:id',
  auditDelete('Event'),
  eventController.deleteEvent
)

export default router

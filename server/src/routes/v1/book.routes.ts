/**
 * Book Routes
 * Digital library endpoints
 */

import { Router } from 'express'
import * as bookController from '@controllers/book.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireRole, requireMinRole } from '@middlewares/rbac.middleware'
import { auditCreate, auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

// Public routes - get published books
router.get('/published', bookController.getBooks)

// Protected routes
router.use(authenticate)

router.get('/', bookController.getBooks)
router.get('/:id', bookController.getBookById)

// Media Staff and above
router.post('/', requireMinRole('MEDIA_STAFF'), auditCreate('Book'), bookController.createBook)
router.put('/:id', requireMinRole('MEDIA_STAFF'), auditUpdate('Book'), bookController.updateBook)

// Admin Owner and above
router.delete('/:id', requireRole('ADMIN_OWNER'), auditDelete('Book'), bookController.deleteBook)
router.patch('/:id/publish', requireRole('ADMIN_OWNER'), bookController.publishBook)
router.patch('/:id/unpublish', requireRole('ADMIN_OWNER'), bookController.unpublishBook)

export default router

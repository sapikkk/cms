/**
 * Page Routes
 * CMS page management endpoints
 */

import { Router } from 'express'
import * as pageController from '@controllers/page.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireRole, requireAnyAdmin } from '@middlewares/rbac.middleware'
import { auditCreate, auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

// Public routes
router.get('/slug/:slug', pageController.getPageBySlug)
// Public navbar pages (for storefront menu without auth)
router.get('/navbar', pageController.getNavbarPages)

// Protected routes
router.use(authenticate)

router.get('/', pageController.getPages)
router.get('/:id', pageController.getPageById)

// Master Admin only for Page creation/deletion
router.post('/', requireRole('MASTER_ADMIN'), auditCreate('Page'), pageController.createPage)
router.delete('/:id', requireRole('MASTER_ADMIN'), auditDelete('Page'), pageController.deletePage)

// Media Staff can update page content/metadata
router.put('/:id', requireRole('MEDIA_STAFF'), auditUpdate('Page'), pageController.updatePage)

// Any admin can publish/unpublish pages
router.patch('/:id/publish', requireAnyAdmin, pageController.publishPage)
router.patch('/:id/unpublish', requireAnyAdmin, pageController.unpublishPage)
router.patch('/:id/toggle-navbar', requireAnyAdmin, pageController.toggleNavbar)

// Sections Management (Available for Media Staff and above)
router.patch('/:id/sections', requireAnyAdmin, pageController.updateSections)

export default router

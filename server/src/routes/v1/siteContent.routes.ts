/**
 * Site Content Routes
 * API endpoints for landing page content management
 */

import { Router } from 'express'
import siteContentController from '@controllers/siteContent.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireRole } from '@middlewares/rbac.middleware'

const router = Router()

// ================================
// PUBLIC ROUTES (Storefront)
// ================================

// Get public landing page content
router.get('/public', siteContentController.getPublicContent)

// Get navbar (public for storefront)
router.get('/navbar', siteContentController.getNavbar)

// Get footer (public for storefront)
router.get('/footer', siteContentController.getFooter)

// ================================
// PROTECTED ROUTES (Admin Dashboard)
// ================================

// Get all content (Admin only)
router.get(
  '/',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.getAllContent
)

// Site Settings (Master Admin only)
router.get(
  '/settings',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER'),
  siteContentController.getSiteSettings
)

router.put(
  '/settings',
  authenticate,
  requireRole('MASTER_ADMIN'),
  siteContentController.updateSiteSettings
)

// Toggle landing page (Master Admin only)
router.post(
  '/toggle-landing',
  authenticate,
  requireRole('MASTER_ADMIN'),
  siteContentController.toggleLandingPage
)

// Section Order
router.get(
  '/section-order',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.getSectionOrder
)

router.put(
  '/section-order',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.updateSectionOrder
)

// Navbar Content
router.put(
  '/navbar',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.updateNavbar
)

// Hero Content
router.get(
  '/hero',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.getHero
)

router.put(
  '/hero',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.updateHero
)

// Footer Content
router.put(
  '/footer',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.updateFooter
)

// Generic section content (events, merchandise, forum, etc.)
router.get(
  '/section/:section',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.getSectionContent
)

router.put(
  '/section/:section',
  authenticate,
  requireRole('MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'),
  siteContentController.updateSectionContent
)

// Initialize defaults (Master Admin only)
router.post(
  '/initialize',
  authenticate,
  requireRole('MASTER_ADMIN'),
  siteContentController.initializeDefaults
)

export default router

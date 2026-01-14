/**
 * Product Routes
 */

import { Router } from 'express'
import productController from '@controllers/product.controller'
import { authenticate, optionalAuthenticate } from '@middlewares/auth.middleware'
import { requireAnyAdmin } from '@middlewares/rbac.middleware'
import { auditCreate, auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

/**
 * Public routes (products can be viewed by anyone)
 */
router.get('/', optionalAuthenticate, productController.getProducts)
router.get('/categories', optionalAuthenticate, productController.getCategories)
router.get('/slug/:slug', optionalAuthenticate, productController.getProductBySlug)
router.get('/:id', optionalAuthenticate, productController.getProductById)

/**
 * Protected routes (requires admin access)
 */
router.use(authenticate, requireAnyAdmin)

// Category Management
router.post(
  '/categories',
  auditCreate('Category'),
  productController.createCategory
)

router.delete(
  '/categories/:id',
  auditDelete('Category'),
  productController.deleteCategory
)

router.post(
  '/',
  auditCreate('Product'),
  productController.createProduct
)

router.put(
  '/:id',
  auditUpdate('Product'),
  productController.updateProduct
)

router.delete(
  '/:id',
  auditDelete('Product'),
  productController.deleteProduct
)

router.get('/:id/cost', productController.calculateCost)

export default router

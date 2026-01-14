/**
 * Authentication Routes
 */

import { Router } from 'express'
import authController from '@controllers/auth.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { auditLogger } from '@middlewares/audit.middleware'

const router = Router()

/**
 * Public routes
 */
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/refresh', authController.refreshToken)

/**
 * Protected routes
 */
router.use(authenticate) // Apply authentication middleware

router.get('/profile', authController.getProfile)

router.put(
  '/profile',
  auditLogger({ action: 'UPDATE', entity: 'User' }),
  authController.updateProfile
)

router.post(
  '/change-password',
  auditLogger({ action: 'UPDATE', entity: 'User' }),
  authController.changePassword
)

router.post(
  '/logout',
  auditLogger({ action: 'LOGOUT', entity: 'User' }),
  authController.logout
)

export default router

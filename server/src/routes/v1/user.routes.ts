/**
 * User Routes
 * Master Admin - User management endpoints
 */

import { Router } from 'express'
import * as userController from '@controllers/user.controller'
import { authenticate } from '@middlewares/auth.middleware'
import { requireMasterAdmin } from '@middlewares/rbac.middleware'
import { auditUpdate, auditDelete } from '@middlewares/audit.middleware'

const router = Router()

// All routes require Master Admin authentication
router.use(authenticate)
router.use(requireMasterAdmin)

/**
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  Master Admin
 */
router.get('/', userController.getAllUsers)
router.post('/', userController.createUser)

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Master Admin
 */
router.get('/:id', userController.getUserById)

/**
 * @route   POST /api/v1/users/:id/lock
 * @desc    Lock user account
 * @access  Master Admin
 */
router.post('/:id/lock', auditUpdate('User'), userController.lockUser)

/**
 * @route   POST /api/v1/users/:id/unlock
 * @desc    Unlock user account
 * @access  Master Admin
 */
router.post('/:id/unlock', auditUpdate('User'), userController.unlockUser)

/**
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Update user role
 * @access  Master Admin
 */
router.patch('/:id/role', auditUpdate('User'), userController.updateUserRole)

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Master Admin
 */
router.delete('/:id', auditDelete('User'), userController.deleteUser)

export default router

/**
 * Authentication Controller
 * Handles authentication HTTP requests
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import authService from '@services/auth.service'
import { SUCCESS_MESSAGES } from '@constants/messages'
import { 
  loginSchema, 
  registerSchema, 
  changePasswordSchema, 
  updateProfileSchema,
  refreshTokenSchema 
} from '@dtos/auth.dto'

export class AuthController {
  /**
   * Login
   * POST /api/v1/auth/login
   */
  async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body)
      const result = await authService.login(data)

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Register
   * POST /api/v1/auth/register
   */
  async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body)
      const result = await authService.register(data)

      res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get Profile
   * GET /api/v1/auth/profile
   */
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const profile = await authService.getProfile(userId)

      res.status(200).json({
        success: true,
        data: profile
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update Profile
   * PUT /api/v1/auth/profile
   */
  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const data = updateProfileSchema.parse(req.body)
      const profile = await authService.updateProfile(userId, data)

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
        data: profile
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Change Password
   * POST /api/v1/auth/change-password
   */
  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const data = changePasswordSchema.parse(req.body)
      const result = await authService.changePassword(userId, data)

      res.status(200).json({
        success: true,
        message: result.message
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Refresh Token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body)
      const tokens = await authService.refreshAccessToken(refreshToken)

      res.status(200).json({
        success: true,
        data: tokens
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logout
   * POST /api/v1/auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const result = await authService.logout(userId)

      res.status(200).json({
        success: true,
        message: result.message
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()

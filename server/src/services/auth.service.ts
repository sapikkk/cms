/**
 * Authentication Service
 * Handles authentication business logic
 */

import { prisma } from '@config/db'
import { hashPassword, verifyPassword } from '@utils/password'
import { generateTokenPair, verifyRefreshToken, JWTPayload } from '@utils/jwt'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@constants/messages'
import { LoginDTO, RegisterDTO, ChangePasswordDTO, UpdateProfileDTO } from '@dtos/auth.dto'


export class AuthService {
  /**
   * Login user
   */
  async login(data: LoginDTO) {
    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.email } // Using data.email as it might store username input
        ]
      }
    })

    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new Error(ERROR_MESSAGES.ACCOUNT_LOCKED)
    }

    // Verify password
    const isPasswordValid = await verifyPassword(data.password, user.password)

    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    }

    const tokens = generateTokenPair(tokenPayload)

    // Return user data (without password) and tokens
    const { password, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      tokens
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterDTO) {
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingEmail) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username }
    })

    if (existingUsername) {
      throw new Error(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS)
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user (default role: USER_PUBLIC)
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        role: 'USER_PUBLIC'
      }
    })

    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    }

    const tokens = generateTokenPair(tokenPayload)

    // Return user data (without password) and tokens
    const { password, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      tokens
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        fullName: true,
        avatar: true,
        phone: true,
        isLocked: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND)
    }

    return user
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileDTO) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        avatar: data.avatar
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        fullName: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  }

  /**
   * Change password
   */
  async changePassword(userId: string, data: ChangePasswordDTO) {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND)
    }

    // Verify old password
    const isOldPasswordValid = await verifyPassword(data.oldPassword, user.password)

    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await hashPassword(data.newPassword)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return { message: SUCCESS_MESSAGES.PASSWORD_CHANGED }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken)

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!user || user.isLocked) {
        throw new Error(ERROR_MESSAGES.TOKEN_INVALID)
      }

      // Generate new token pair
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        username: user.username
      }

      const tokens = generateTokenPair(tokenPayload)

      return tokens
    } catch (error) {
      throw new Error(ERROR_MESSAGES.TOKEN_INVALID)
    }
  }

  /**
   * Logout (optional - can be used to blacklist tokens if needed)
   */
  async logout(_userId: string) {
    // If implementing token blacklist, add logic here
    return { message: SUCCESS_MESSAGES.LOGOUT_SUCCESS }
  }
}

export default new AuthService()

/**
 * Audit Middleware
 * Automatically logs all Create/Update/Delete actions
 * No need to manually add logging in each controller
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import { prisma } from '@config/db'
import { logger } from '@config/logger'
import { ActivityAction } from '@prisma/client'

interface AuditOptions {
  action: ActivityAction
  entity: string
  getTargetId?: (req: AuthenticatedRequest, responseBody: any) => string | undefined
  getDetails?: (req: AuthenticatedRequest, responseBody: any) => Record<string, any> | undefined
}

/**
 * Audit Logger Middleware Factory
 * Wraps the response to capture the result and log after successful operations
 */
export const auditLogger = (options: AuditOptions) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // Store original json method
    const originalJson = res.json.bind(res)

    // Override json method to intercept response
    res.json = function (body: any) {
      // Restore original method
      res.json = originalJson

      // Log after successful response (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user?.userId) {
        // Run audit logging in background (don't block response)
        setImmediate(async () => {
          try {
            const targetId = options.getTargetId 
              ? options.getTargetId(req, body)
              : req.params.id || body?.data?.id || body?.id

            const details = options.getDetails
              ? options.getDetails(req, body)
              : getDefaultDetails(req, body, options.action)

            await prisma.activityLog.create({
              data: {
                userId: req.user!.userId,
                action: options.action,
                entity: options.entity,
                targetId: targetId,
                details: details
              }
            })

            logger.debug(`Audit: ${options.action} ${options.entity}`, {
              userId: req.user!.userId,
              targetId,
              action: options.action
            })
          } catch (error) {
            // Don't throw - just log the error
            logger.error('Audit logging failed:', error)
          }
        })
      }

      // Send original response
      return originalJson(body)
    }

    next()
  }
}

/**
 * Get default details based on action type
 */
function getDefaultDetails(
  req: AuthenticatedRequest, 
  _responseBody: any,
  action: ActivityAction
): Record<string, any> {
  const details: Record<string, any> = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  }

  switch (action) {
    case ActivityAction.CREATE:
      // Store the created data (excluding sensitive fields)
      if (req.body) {
        const { password, ...safeBody } = req.body
        details.input = safeBody
      }
      break

    case ActivityAction.UPDATE:
      // Store old and new values
      if (req.body) {
        const { password, ...safeBody } = req.body
        details.changes = safeBody
      }
      break

    case ActivityAction.DELETE:
      details.deletedId = req.params.id
      break

    case ActivityAction.LOGIN:
      details.email = req.body?.email
      break

    case ActivityAction.EXPORT:
      details.format = req.query?.format || 'unknown'
      details.filters = req.query
      break

    default:
      break
  }

  return details
}

/**
 * Pre-built audit middleware for common operations
 */
export const auditCreate = (entity: string) => auditLogger({ action: ActivityAction.CREATE, entity })
export const auditUpdate = (entity: string) => auditLogger({ action: ActivityAction.UPDATE, entity })
export const auditDelete = (entity: string) => auditLogger({ action: ActivityAction.DELETE, entity })
export const auditExport = (entity: string) => auditLogger({ action: ActivityAction.EXPORT, entity })

/**
 * Login audit (special case - runs before auth middleware)
 */
export const auditLogin = async (
  userId: string,
  email: string,
  success: boolean,
  ip?: string
): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action: ActivityAction.LOGIN,
        entity: 'User',
        targetId: userId,
        details: {
          email,
          success,
          ip,
          timestamp: new Date().toISOString()
        }
      }
    })
  } catch (error) {
    logger.error('Login audit failed:', error)
  }
}

/**
 * Manual activity log creation
 */
export const logActivity = async (
  userId: string,
  action: ActivityAction,
  entity: string,
  targetId?: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        targetId,
        details: {
          ...details,
          timestamp: new Date().toISOString()
        }
      }
    })
  } catch (error) {
    logger.error('Activity logging failed:', error)
  }
}

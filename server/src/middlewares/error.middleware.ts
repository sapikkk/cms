/**
 * Error Handling Middleware
 * Global error handler for Express
 */

import { Request, Response, NextFunction } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ZodError } from 'zod'
import { logger } from '@config/logger'
import { ERROR_MESSAGES } from '@constants/messages'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

/**
 * Global error handler
 */
export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  })

  if (err instanceof PrismaClientKnownRequestError) {
    return handlePrismaError(err, res)
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return handleZodError(err, res)
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_INVALID
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_EXPIRED
    })
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    return handleMulterError(err as any, res)
  }

  // Default error
  const statusCode = (err as AppError).statusCode || 500
  const message = (err as AppError).message || ERROR_MESSAGES.INTERNAL_ERROR

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

/**
 * Handle Prisma errors
 */
const handlePrismaError = (err: PrismaClientKnownRequestError, res: Response) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = (err.meta?.target as string[])?.[0] || 'field'
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        code: 'DUPLICATE_ENTRY'
      })

    case 'P2025':
      // Record not found
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.NOT_FOUND
      })

    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        message: 'Related record not found',
        code: 'FOREIGN_KEY_VIOLATION'
      })

    case 'P2014':
      // Required relation violation
      return res.status(400).json({
        success: false,
        message: 'Invalid relation',
        code: 'RELATION_VIOLATION'
      })

    default:
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
      })
  }
}

/**
 * Handle Zod validation errors
 */
const handleZodError = (err: ZodError, res: Response) => {
  const errors = err.errors.map(error => ({
    field: error.path.join('.'),
    message: error.message
  }))

  return res.status(400).json({
    success: false,
    message: ERROR_MESSAGES.VALIDATION_ERROR,
    errors
  })
}

/**
 * Handle Multer errors
 */
const handleMulterError = (err: any, res: Response) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.FILE_TOO_LARGE
    })
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field'
    })
  }

  return res.status(400).json({
    success: false,
    message: ERROR_MESSAGES.UPLOAD_FAILED
  })
}

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  })
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

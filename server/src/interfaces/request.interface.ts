/**
 * Custom Request Interface
 * Extends Express Request with authenticated user data
 */

import { Request } from 'express'
import { Role } from '@prisma/client'

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
    role: Role
    username: string
  }
}

export interface PaginationQuery {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface FileUploadRequest extends AuthenticatedRequest {
  file?: Express.Multer.File
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }
}

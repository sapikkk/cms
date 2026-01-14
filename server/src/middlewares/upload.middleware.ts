/**
 * File Upload Middleware
 * Handles file uploads using Multer
 */

import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request } from 'express'
import { config } from '@config/env'
import { ERROR_MESSAGES } from '@constants/messages'

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Organize by file type
    let subDir = 'others'
    
    if (file.mimetype.startsWith('image/')) {
      subDir = 'images'
    } else if (file.mimetype === 'application/pdf') {
      subDir = 'documents'
    } else if (file.mimetype.startsWith('video/')) {
      subDir = 'videos'
    }

    const destPath = path.join(uploadDir, subDir)
    
    // Create subdirectory if it doesn't exist
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true })
    }

    cb(null, destPath)
  },
  
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const ext = path.extname(file.originalname)
    const nameWithoutExt = path.basename(file.originalname, ext)
    
    // Sanitize filename
    const sanitizedName = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)

    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`)
  }
})

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'video/mpeg'
  ]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(ERROR_MESSAGES.INVALID_FILE_TYPE))
  }
}

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.storage.maxFileSize // From env
  }
})

/**
 * Middleware for single file upload
 */
export const uploadSingle = (fieldName: string = 'file') => {
  return upload.single(fieldName)
}

/**
 * Middleware for multiple files upload
 */
export const uploadMultiple = (fieldName: string = 'files', maxCount: number = 10) => {
  return upload.array(fieldName, maxCount)
}

/**
 * Middleware for multiple fields upload
 */
export const uploadFields = (fields: { name: string; maxCount: number }[]) => {
  return upload.fields(fields)
}

/**
 * Helper to delete file
 */
export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete file:', err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

/**
 * Helper to get file URL
 */
export const getFileUrl = (filename: string, subDir: string = 'images'): string => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${config.server.port}`
  return `${baseUrl}/uploads/${subDir}/${filename}`
}

/**
 * Validate image dimensions
 */
export const validateImageDimensions = async (
  filePath: string,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<boolean> => {
  // This would require image processing library like 'sharp'
  // For now, return true
  return true
}

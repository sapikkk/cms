/**
 * Prisma Client Singleton
 * Ensures single instance across application
 */

import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

// Prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient()

// Note: Prisma Accelerate does not support event logging
// Query and error logging is disabled for compatibility

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Shutting down Prisma Client...')
  await prisma.$disconnect()
  logger.info('Prisma Client disconnected')
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

// Store in global to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

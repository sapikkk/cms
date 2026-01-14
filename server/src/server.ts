/**
 * Server Entry Point
 */

import app from './app'
import { config } from './config/env'
import { logger } from './config/logger'
import { prisma } from './config/db'

const PORT = config.server.port

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect()
    logger.info('✅ Database connected successfully')

    // Start listening
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📝 Environment: ${config.server.env}`)
      logger.info(`🔗 API: http://localhost:${PORT}/api/${config.server.apiVersion}`)
      
      if (config.server.env === 'development') {
        logger.info(`📊 Health: http://localhost:${PORT}/api/${config.server.apiVersion}/health`)
      }
    })
  } catch (error) {
    logger.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // Close server & exit process
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Start the server
startServer()

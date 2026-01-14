/**
 * Express Application Setup
 */

import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import path from 'path'
import { config } from './config/env'
import { morganStream } from './config/logger'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware'
import { apiLimiter, authLimiter } from './middlewares/ratelimit.middleware'
import apiRoutes from './routes/v1'

const app: Application = express()

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet - Secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for SPA compatibility
  crossOriginEmbedderPolicy: false,
}))

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}))

// ==========================================
// BODY PARSERS
// ==========================================

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Cookie parser
app.use(cookieParser())

// Compression
app.use(compression())

// HTTP request logger (Morgan + Winston)
if (config.server.env === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev', { stream: morganStream }))
}

// ==========================================
// STATIC FILES
// ==========================================

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ==========================================
// RATE LIMITING
// ==========================================

// Apply rate limiter to API routes
app.use(`/api/${config.server.apiVersion}`, apiLimiter)

// Stricter rate limit for auth endpoints
app.use(`/api/${config.server.apiVersion}/auth/login`, authLimiter)
app.use(`/api/${config.server.apiVersion}/auth/register`, authLimiter)

// ==========================================
// API ROUTES
// ==========================================

// API v1
app.use(`/api/${config.server.apiVersion}`, apiRoutes)

// Root endpoint
app.get('/api', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CoffeeShop Enterprise CMS API',
    version: config.server.apiVersion,
    environment: config.server.env,
    timestamp: new Date().toISOString()
  })
})

// Health check endpoint for Railway
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  })
})

// ==========================================
// SERVE FRONTEND (Production)
// ==========================================

if (config.server.env === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist')
  
  // Serve static files from Vue build
  app.use(express.static(clientBuildPath))
  
  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next()
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
}

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.use(notFoundHandler)

// Global error handler
app.use(errorHandler)

export default app

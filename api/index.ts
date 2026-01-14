/**
 * Vercel Serverless Function - API Handler
 * Wraps Express app for serverless deployment
 */

import { VercelRequest, VercelResponse } from "@vercel/node";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client for serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Create Express app
const app: Application = express();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: [
      "https://penditegar.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());

// Health check
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is running on Vercel",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
  });
});

// Root endpoint
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "CoffeeShop Enterprise CMS API",
    version: "v1",
    docs: "/api/v1/health",
  });
});

// Import and use routes from server
// Note: You'll need to import your actual routes here
// For now, this is a placeholder that you can extend

// Vercel serverless handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  // @ts-ignore - Express app can handle Vercel request/response
  return app(req, res);
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

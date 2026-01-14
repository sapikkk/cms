/**
 * Environment Variables Validation
 * Using Zod for type-safe environment configuration
 */

import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define environment schema
const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  API_VERSION: z.string().default("v1"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  // Security
  BCRYPT_SALT_ROUNDS: z.string().default("10"),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("1000"),

  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  CORS_CREDENTIALS: z.string().default("true"),

  // File Upload
  STORAGE_TYPE: z
    .enum(["local", "s3", "minio", "firebase", "cloudinary"])
    .default("local"),
  MAX_FILE_SIZE: z.string().default("5242880"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // AWS S3 (Optional)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // MinIO (Optional)
  MINIO_ENDPOINT: z.string().optional(),
  MINIO_PORT: z.string().optional(),
  MINIO_ACCESS_KEY: z.string().optional(),
  MINIO_SECRET_KEY: z.string().optional(),
  MINIO_BUCKET: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_FILE_PATH: z.string().default("./logs"),

  // Master Admin (Initial Setup)
  MASTER_ADMIN_EMAIL: z.string().email().default("master@coffeeshop.com"),
  MASTER_ADMIN_PASSWORD: z.string().min(8).default("MasterAdmin@2025"),
  MASTER_ADMIN_USERNAME: z.string().default("masteradmin"),
});

// Validate and parse environment
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

// Export typed config
export const config = {
  server: {
    env: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    apiVersion: env.API_VERSION,
  },
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  security: {
    bcryptSaltRounds: parseInt(env.BCRYPT_SALT_ROUNDS, 10),
    rateLimitWindowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    rateLimitMaxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  cors: {
    origin: env.CORS_ORIGIN.includes(",")
      ? env.CORS_ORIGIN.split(",").map((url) => url.trim())
      : env.CORS_ORIGIN,
    credentials: env.CORS_CREDENTIALS === "true",
  },
  storage: {
    type: env.STORAGE_TYPE,
    maxFileSize: parseInt(env.MAX_FILE_SIZE, 10),
    aws: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      bucket: env.AWS_S3_BUCKET,
    },
    minio: {
      endpoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT ? parseInt(env.MINIO_PORT, 10) : undefined,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
      bucket: env.MINIO_BUCKET,
    },
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
  logging: {
    level: env.LOG_LEVEL,
    filePath: env.LOG_FILE_PATH,
  },
  masterAdmin: {
    email: env.MASTER_ADMIN_EMAIL,
    password: env.MASTER_ADMIN_PASSWORD,
    username: env.MASTER_ADMIN_USERNAME,
  },
} as const;

export default config;

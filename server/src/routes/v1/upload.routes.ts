/**
 * Upload Routes
 * Routes for file uploads to Cloudinary
 */

import { Router } from "express";
import { UploadController } from "@controllers/upload.controller";
import { authenticate } from "@middlewares/auth.middleware";
import multer from "multer";
import { config } from "@config/env";

const router = Router();

// Configure multer to use memory storage for Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * @route   GET /api/v1/upload/check
 * @desc    Check if Cloudinary is configured (no auth required for debugging)
 * @access  Public
 */
router.get("/check", (req, res) => {
  const cloudinaryConfigured = !!(
    config.cloudinary.cloudName &&
    config.cloudinary.apiKey &&
    config.cloudinary.apiSecret
  );
  
  res.json({
    success: true,
    cloudinaryConfigured,
    cloudName: config.cloudinary.cloudName ? `${config.cloudinary.cloudName.substring(0, 3)}***` : null,
    corsOrigin: config.cors.origin,
  });
});

// All upload routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/upload/image
 * @desc    Upload single image to Cloudinary
 * @access  Private
 */
router.post("/image", upload.single("file"), UploadController.uploadImage);

/**
 * @route   POST /api/v1/upload/images
 * @desc    Upload multiple images to Cloudinary
 * @access  Private
 */
router.post(
  "/images",
  upload.array("files", 10),
  UploadController.uploadMultiple
);

/**
 * @route   POST /api/v1/upload/base64
 * @desc    Upload image from base64 string
 * @access  Private
 */
router.post("/base64", UploadController.uploadBase64);

/**
 * @route   DELETE /api/v1/upload/image/:publicId
 * @desc    Delete image from Cloudinary
 * @access  Private
 */
router.delete("/image/:publicId(*)", UploadController.deleteImage);

/**
 * @route   GET /api/v1/upload/optimize/:publicId
 * @desc    Get optimized image URL
 * @access  Private
 */
router.get("/optimize/:publicId(*)", UploadController.getOptimizedUrl);

export default router;

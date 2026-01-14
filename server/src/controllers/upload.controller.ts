/**
 * Upload Controller
 * Handles file uploads to Cloudinary
 */

import { Request, Response, NextFunction } from "express";
import { CloudinaryService } from "@services/cloudinary.service";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@constants/messages";

export class UploadController {
  /**
   * Upload single image to Cloudinary
   */
  static async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: ERROR_MESSAGES.FILE_REQUIRED,
        });
        return;
      }

      const folder = (req.body.folder as string) || "antitesa/general";

      const result = await CloudinaryService.uploadImage(req.file.buffer, {
        folder,
        publicId: req.body.publicId,
      });

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.UPLOAD_SUCCESS,
        data: {
          url: result.secureUrl,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  static async uploadMultiple(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          success: false,
          message: ERROR_MESSAGES.FILES_REQUIRED,
        });
        return;
      }

      const folder = (req.body.folder as string) || "antitesa/general";

      const files = req.files.map((file) => ({
        buffer: file.buffer,
        filename: file.originalname,
      }));

      const results = await CloudinaryService.uploadMultiple(files, folder);

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.UPLOAD_SUCCESS,
        data: results.map((result) => ({
          url: result.secureUrl,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload from base64
   */
  static async uploadBase64(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { base64, folder, publicId } = req.body;

      if (!base64) {
        res.status(400).json({
          success: false,
          message: "Base64 string is required",
        });
        return;
      }

      const result = await CloudinaryService.uploadBase64(base64, {
        folder: folder || "antitesa/general",
        publicId,
      });

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.UPLOAD_SUCCESS,
        data: {
          url: result.secureUrl,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        res.status(400).json({
          success: false,
          message: "Public ID is required",
        });
        return;
      }

      await CloudinaryService.deleteImage(publicId);

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.DELETE_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get optimized image URL
   */
  static async getOptimizedUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { publicId } = req.params;
      const { width, height, crop, quality, format } = req.query;

      if (!publicId) {
        res.status(400).json({
          success: false,
          message: "Public ID is required",
        });
        return;
      }

      const url = CloudinaryService.getOptimizedUrl(publicId, {
        width: width ? parseInt(width as string) : undefined,
        height: height ? parseInt(height as string) : undefined,
        crop: crop as any,
        quality:
          quality === "auto"
            ? "auto"
            : quality
            ? parseInt(quality as string)
            : undefined,
        format: format as any,
      });

      res.status(200).json({
        success: true,
        data: { url },
      });
    } catch (error) {
      next(error);
    }
  }
}

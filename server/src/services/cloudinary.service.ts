/**
 * Cloudinary Service
 * Handles image uploads to Cloudinary
 */

import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { config } from "@config/env";
import { logger } from "@config/logger";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  secureUrl: string;
}

export class CloudinaryService {
  /**
   * Upload image to Cloudinary from buffer
   */
  static async uploadImage(
    fileBuffer: Buffer,
    options: {
      folder?: string;
      publicId?: string;
      transformation?: any;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || "antitesa",
            public_id: options.publicId,
            transformation: options.transformation,
            resource_type: "image",
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            }
          }
        );
        uploadStream.end(fileBuffer);
      });

      logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);

      return {
        url: result.url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        secureUrl: result.secure_url,
      };
    } catch (error) {
      logger.error("Cloudinary upload failed:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  /**
   * Upload image from base64
   */
  static async uploadBase64(
    base64String: string,
    options: {
      folder?: string;
      publicId?: string;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(base64String, {
        folder: options.folder || "antitesa",
        public_id: options.publicId,
        resource_type: "image",
      });

      logger.info(
        `Image uploaded to Cloudinary from base64: ${result.public_id}`
      );

      return {
        url: result.url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        secureUrl: result.secure_url,
      };
    } catch (error) {
      logger.error("Cloudinary base64 upload failed:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`Image deleted from Cloudinary: ${publicId}`);
    } catch (error) {
      logger.error("Cloudinary delete failed:", error);
      throw new Error("Failed to delete image from Cloudinary");
    }
  }

  /**
   * Get optimized image URL
   */
  static getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: "fill" | "fit" | "scale" | "limit";
      quality?: "auto" | number;
      format?: "auto" | "webp" | "jpg" | "png";
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      width: options.width,
      height: options.height,
      crop: options.crop || "fill",
      quality: options.quality || "auto",
      format: options.format || "auto",
      fetch_format: "auto",
      secure: true,
    });
  }

  /**
   * Upload multiple images
   */
  static async uploadMultiple(
    files: { buffer: Buffer; filename: string }[],
    folder?: string
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file.buffer, {
        folder,
        publicId: file.filename.split(".")[0],
      })
    );

    return Promise.all(uploadPromises);
  }
}

/**
 * Product Controller
 * Handles product HTTP requests
 */

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@interfaces/request.interface'
import productService from '@services/product.service'
import { SUCCESS_MESSAGES } from '@constants/messages'
import { 
  createProductSchema, 
  updateProductSchema,
  productQuerySchema 
} from '@dtos/product.dto'

export class ProductController {
  /**
   * Get all products
   * GET /api/v1/products
   */
  async getProducts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = productQuerySchema.parse(req.query)
      const result = await productService.getProducts(query)

      res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get product by ID
   * GET /api/v1/products/:id
   */
  async getProductById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const product = await productService.getProductById(id)

      res.status(200).json({
        success: true,
        data: product
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get product by slug
   * GET /api/v1/products/slug/:slug
   */
  async getProductBySlug(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params
      const product = await productService.getProductBySlug(slug)

      res.status(200).json({
        success: true,
        data: product
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create product
   * POST /api/v1/products
   */
  async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body)
      const product = await productService.createProduct(data)

      res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGES.PRODUCT_CREATED,
        data: product
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update product
   * PUT /api/v1/products/:id
   */
  async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const data = updateProductSchema.parse({ ...req.body, id })
      const product = await productService.updateProduct(id, data)

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
        data: product
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete product
   * DELETE /api/v1/products/:id
   */
  async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await productService.deleteProduct(id)

      res.status(200).json({
        success: true,
        message: result.message
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Calculate product cost (HPP)
   * GET /api/v1/products/:id/cost
   */
  async calculateCost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const cost = await productService.calculateProductCost(id)

      res.status(200).json({
        success: true,
        data: cost
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get all categories
   * GET /api/v1/products/categories
   */
  async getCategories(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories()

      res.status(200).json({
        success: true,
        data: categories
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create category
   * POST /api/v1/products/categories
   */
  async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
      try {
          const { name } = req.body;
          if (!name) throw new Error('Nama kategori wajib diisi');
          
          const category = await productService.createCategory(name);
          res.status(201).json({ success: true, data: category });
      } catch (error) {
          next(error);
      }
  }

  /**
   * Delete category
   * DELETE /api/v1/products/categories/:id
   */
  async deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
      try {
          const { id } = req.params;
          await productService.deleteCategory(id);
          res.status(200).json({ success: true, message: 'Kategori dihapus' });
      } catch (error) {
          next(error);
      }
  }
}

export default new ProductController()

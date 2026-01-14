/**
 * Product Service
 * Handles product business logic
 */

import { prisma } from '@config/db'
import { CreateProductDTO, UpdateProductDTO, ProductQueryDTO } from '@dtos/product.dto'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@constants/messages'
import { Prisma } from '@prisma/client'

export class ProductService {
  /**
   * Get all products with pagination and filters
   */
  async getProducts(query: ProductQueryDTO) {
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.ProductWhereInput = {}

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ]
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId
    }

    if (query.isActive) {
      where.isActive = query.isActive === 'true'
    }

    // Get total count
    const total = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        ingredients: true,
        variants: true
      },
      orderBy: {
        [query.sortBy || 'createdAt']: query.sortOrder || 'desc'
      },
      skip,
      take: limit
    })

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        ingredients: true,
        variants: true
      }
    })

    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    }

    return product
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        ingredients: true,
        variants: true
      }
    })

    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    }

    return product
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductDTO) {
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug }
    })

    if (existingProduct) {
      throw new Error(ERROR_MESSAGES.SLUG_ALREADY_EXISTS)
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!category) {
      throw new Error('Category not found')
    }

    // Create product with ingredients and variants
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        image: data.image,
        categoryId: data.categoryId,
        isActive: data.isActive,
        ingredients: {
          create: data.ingredients || []
        },
        variants: {
          create: data.variants || []
        }
      },
      include: {
        category: true,
        ingredients: true,
        variants: true
      }
    })

    return product
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: UpdateProductDTO) {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    }

    // If slug is being updated, check if new slug already exists
    if (data.slug && data.slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists) {
        throw new Error(ERROR_MESSAGES.SLUG_ALREADY_EXISTS)
      }
    }

    // Update product
    const updateData: any = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      basePrice: data.basePrice,
      image: data.image,
      categoryId: data.categoryId,
      isActive: data.isActive
    }

    // Handle ingredients update
    if (data.ingredients) {
      // Delete existing ingredients and create new ones
      await prisma.ingredient.deleteMany({
        where: { productId: id }
      })

      updateData.ingredients = {
        create: data.ingredients
      }
    }

    // Handle variants update
    if (data.variants) {
      // Delete existing variants and create new ones
      await prisma.productVariant.deleteMany({
        where: { productId: id }
      })

      updateData.variants = {
        create: data.variants
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        ingredients: true,
        variants: true
      }
    })

    return product
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    }

    // Delete product (cascade will delete ingredients and variants)
    await prisma.product.delete({
      where: { id }
    })

    return { message: SUCCESS_MESSAGES.PRODUCT_DELETED }
  }

  /**
   * Calculate total cost (HPP) of product
   */
  async calculateProductCost(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ingredients: true
      }
    })

    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    }

    // Calculate total cost from ingredients
    const totalCost = product.ingredients.reduce((sum, ingredient) => {
      const cost = ingredient.cost ? Number(ingredient.cost) * Number(ingredient.amount) : 0
      return sum + cost
    }, 0)

    return {
      productId: product.id,
      productName: product.name,
      basePrice: Number(product.basePrice),
      totalCost,
      profit: Number(product.basePrice) - totalCost,
      profitMargin: totalCost > 0 ? ((Number(product.basePrice) - totalCost) / Number(product.basePrice) * 100).toFixed(2) : 0
    }
  }

  /**
   * Get all categories
   */
  async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return categories
  }

  /**
   * Create category
   */
  async createCategory(name: string) {
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    
    // Check slug
    const exists = await prisma.category.findUnique({
      where: { slug }
    })

    if (exists) {
        throw new Error('Kategori dengan nama serupa sudah ada')
    }

    return await prisma.category.create({
      data: {
        name,
        slug
      }
    })
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string) {
      return await prisma.category.delete({
          where: { id }
      })
  }
}

export default new ProductService()

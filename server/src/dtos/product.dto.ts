/**
 * Product DTOs
 * Zod schemas for validating product requests
 */

import { z } from 'zod'
import { UnitType } from '@prisma/client'
import { VALIDATION_MESSAGES } from '@constants/messages'

/**
 * Ingredient Schema
 */
export const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.preprocess((val) => Number(val), z.number().positive(VALIDATION_MESSAGES.AMOUNT_MUST_BE_POSITIVE)),
  unit: z.nativeEnum(UnitType),
  iconUrl: z.union([z.string().url(), z.null(), z.undefined()]),
  cost: z.preprocess((val) => val ? Number(val) : undefined, z.number().nonnegative().optional())
})

export type IngredientDTO = z.infer<typeof ingredientSchema>

/**
 * Product Variant Schema
 */
export const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  priceAdj: z.number()
})

export type VariantDTO = z.infer<typeof variantSchema>

/**
 * Create Product DTO
 */
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  basePrice: z.preprocess((val) => Number(val), z.number().positive(VALIDATION_MESSAGES.PRICE_MUST_BE_POSITIVE)),
  image: z.union([z.string().url('Invalid image URL'), z.null(), z.undefined()]),
  categoryId: z.string().uuid('Invalid category ID'),
  isActive: z.boolean().default(true),
  ingredients: z.array(ingredientSchema).optional().default([]),
  variants: z.array(variantSchema).optional().default([])
})

export type CreateProductDTO = z.infer<typeof createProductSchema>

/**
 * Update Product DTO
 */
export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid()
})

export type UpdateProductDTO = z.infer<typeof updateProductSchema>

/**
 * Product Query DTO
 */
export const productQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['name', 'basePrice', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})

export type ProductQueryDTO = z.infer<typeof productQuerySchema>

/**
 * Category Schema
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  icon: z.string().url('Invalid icon URL').optional(),
  sortOrder: z.number().int().nonnegative().optional().default(0)
})

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>

/**
 * Update Category DTO
 */
export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().uuid()
})

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>

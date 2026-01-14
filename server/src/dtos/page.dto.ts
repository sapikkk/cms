/**
 * Page DTOs
 * Zod schemas for validating CMS page requests
 */

import { z } from 'zod'

/**
 * Page Section Schema (Dynamic JSON structure)
 */
export const pageSectionSchema = z.object({
  type: z.string().min(1, 'Section type is required'),
  id: z.string().min(1, 'Section ID is required'),
  props: z.record(z.any()).optional().default({})
})

export type PageSectionDTO = z.infer<typeof pageSectionSchema>

/**
 * Create Page DTO
 */
export const createPageSchema = z.object({
  title: z.string().min(1, 'Page title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  isPublished: z.boolean().default(false),
  inNavbar: z.boolean().default(false),
  navOrder: z.number().int().nonnegative().default(0),
  sections: z.array(pageSectionSchema).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(160, 'Meta description must be 160 characters or less').optional(),
  metaKeywords: z.string().optional(),
  ogImage: z.string().url('Invalid OG image URL').optional()
})

export type CreatePageDTO = z.infer<typeof createPageSchema>

/**
 * Update Page DTO
 */
export const updatePageSchema = createPageSchema.partial().extend({
  id: z.string().uuid()
})

export type UpdatePageDTO = z.infer<typeof updatePageSchema>

/**
 * Page Query DTO
 */
export const pageQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  isPublished: z.enum(['true', 'false']).optional(),
  inNavbar: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['title', 'navOrder', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})

export type PageQueryDTO = z.infer<typeof pageQuerySchema>

/**
 * Update Page Sections DTO
 */
export const updatePageSectionsSchema = z.object({
  sections: z.array(pageSectionSchema)
})

export type UpdatePageSectionsDTO = z.infer<typeof updatePageSectionsSchema>

/**
 * Publish/Unpublish Page DTO
 */
export const publishPageSchema = z.object({
  isPublished: z.boolean()
})

export type PublishPageDTO = z.infer<typeof publishPageSchema>

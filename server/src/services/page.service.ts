/**
 * Page Service
 * Business logic for CMS page management
 */

import { prisma } from '@config/db'
import { Prisma, SectionType } from '@prisma/client'

export class PageService {
  /**
   * Get all pages with filters
   */
  async getAll(filters: { published?: boolean; inNavbar?: boolean }) {
    const where: Prisma.PageWhereInput = {}
    
    if (filters.published !== undefined) {
      where.isPublished = filters.published
    }
    if (filters.inNavbar !== undefined) {
      where.inNavbar = filters.inNavbar
    }

    return await prisma.page.findMany({
      where,
      include: {
        creator: {
          select: { id: true, username: true, fullName: true }
        }
      },
      orderBy: { navOrder: 'asc' }
    })
  }

  /**
   * Get page by ID
   */
  async getById(id: string) {
    return await prisma.page.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, username: true, fullName: true }
        },
        sections: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })
  }

  /**
   * Get page by slug
   */
  async getBySlug(slug: string) {
    return await prisma.page.findUnique({
      where: { slug },
      include: {
        creator: {
          select: { id: true, username: true, fullName: true }
        },
        sections: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })
  }

  /**
   * Create new page
   */
  async create(data: Prisma.PageCreateInput) {
    return await prisma.page.create({
      data
    })
  }

  /**
   * Update page
   */
  async update(id: string, data: Prisma.PageUpdateInput) {
    return await prisma.page.update({
      where: { id },
      data
    })
  }

  /**
   * Delete page
   */
  async delete(id: string) {
    return await prisma.page.delete({
      where: { id }
    })
  }

  /**
   * Update page sections (Full Replace via Transaction)
   */
  async updateSections(id: string, sections: any[]) {
    // Map frontend structure to database schema
    // Frontend: { type: 'HeroBanner', props: {...} }
    // DB: { sectionType: 'HERO', contentData: {...} }
    
    // Helper to map widget type to SectionType enum
    const newSectionsData = sections.map((section, index) => {
      // Map frontend widget type to backend SectionType enum
      let sectionType: SectionType
      
      switch(section.type) {
        // Hero variants
        case 'HeroBannerCenter':
        case 'HeroSplitRight':
        case 'HeroSplitLeft':
          sectionType = SectionType.HERO
          break
        
        // Product/Feature/Grid variants (including Library & Merchandise)
        case 'ProductGrid':
        case 'FeatureGrid3':
        case 'FeatureGrid4':
        case 'GalleryGrid':
        case 'TeamGrid':
        case 'LogoCloud':
        case 'LibrarySection':
        case 'MerchandiseSection':
          sectionType = SectionType.PRODUCTS
          break
        
        // Text/Content variants
        case 'TextBlock':
        case 'ContentImageRight':
        case 'ContentImageLeft':
        case 'FAQSection':
        case 'TestimonialCard':
        case 'ContactCard':
          sectionType = SectionType.TEXT
          break
        
        // CTA/Special variants (including Events & FunFacts)
        case 'CTACentered':
        case 'CTASplit':
        case 'Stats3Col':
        case 'PricingCard':
        case 'NewsletterForm':
        case 'VideoEmbed':
        case 'EventsSection':
        case 'FunFactsSection':
          sectionType = SectionType.CUSTOM
          break
        
        default:
          sectionType = SectionType.CUSTOM
      }

      return {
        pageId: id,
        name: section.type + ' ' + (index + 1),
        slug: (section.type + '-' + Date.now() + '-' + index + '-' + Math.random().toString(36).substring(2, 9)).toLowerCase(), // Stronger uniqueness check
        sectionType,
        contentData: {
          ...(section.props || {}),
          componentType: section.type // IMORTANT: Save the exact widget type for frontend mapping
        },
        styleConfig: section.styleConfig || {},
        sortOrder: index,
        isVisible: true
      }
    })

    // DEBUG: Write payload to file for inspection
    try {
        const fs = require('fs');
        const path = require('path');
        const debugPath = path.join(process.cwd(), 'debug_payload.json');
        fs.writeFileSync(debugPath, JSON.stringify(newSectionsData, null, 2));
        console.log(`[PageService] Payload dumped to ${debugPath}`);
    } catch (err) {
        console.error('[PageService] Failed to dump payload:', err);
    }

    console.log(`[PageService] Updating sections for page ${id}. Count: ${newSectionsData.length}`)
    // console.log('[PageService] Payload sample:', JSON.stringify(newSectionsData[0], null, 2))
    
    // DEBUG: Print payload types
    newSectionsData.forEach((s, i) => {
        console.log(`Section ${i}: Type=${s.sectionType}, Name=${s.name}, ComponentType=${(s.contentData as any).componentType}`)
    })

    // Since createMany is not supported nicely inside a nested update without some hassle,
    // and we want to ensure atomicity, use $transaction
    // DEBUG MODE: Executing sequentially to catch specific errors
    console.log('[PageService Debug] Starting sequential update...')

    try {
      // Step 1: Delete old sections
      const deleted = await prisma.section.deleteMany({
        where: { pageId: id }
      })
      console.log(`[PageService Debug] Deleted ${deleted.count} old sections.`)

      // Step 2: Create new sections
      // Validate payload first
      if (newSectionsData.length > 0) {
        const created = await prisma.section.createMany({
            data: newSectionsData
        })
        console.log(`[PageService Debug] Created ${created.count} new sections.`)
      } else {
         console.log('[PageService Debug] No new sections to create.')
      }
      
    } catch (dbError) {
      console.error('[PageService Debug] CRITICAL DATABASE ERROR:', dbError)
      throw dbError // Re-throw to controller
    }

    // const transactionResult = await prisma.$transaction([deleteSections, createSections])
    // console.log('[PageService] Transaction Result:', transactionResult)

    // Return updated page
    return await prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })
  }

  /**
   * Publish/Unpublish page
   */
  async setPublished(id: string, isPublished: boolean) {
    return await prisma.page.update({
      where: { id },
      data: { isPublished }
    })
  }
}

export default new PageService()

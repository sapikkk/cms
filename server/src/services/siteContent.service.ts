/**
 * Site Content Service
 * Business logic for managing landing page content sections
 * All content is stored in SystemConfig with structured JSON
 */

import { prisma } from '@config/db'

// Type definitions for each section
export interface NavbarContent {
  logo: string
  logoText: string
  menuItems: Array<{
    label: string
    link: string
    isActive: boolean
  }>
  showLoginButton: boolean
  loginButtonText: string
  contactPhone?: string
}

export interface HeroContent {
  title: string
  subtitle: string
  backgroundImage: string
  ctaButton: {
    text: string
    link: string
  }
  secondaryButton?: {
    text: string
    link: string
  }
}

export interface EventSectionContent {
  title: string
  subtitle: string
  showUpcoming: boolean
  maxItems: number
  layout: 'grid' | 'list' | 'carousel'
}

export interface MerchandiseSectionContent {
  title: string
  subtitle: string
  showFeaturedOnly: boolean
  maxItems: number
  layout: 'grid' | 'carousel'
}

export interface ForumSectionContent {
  title: string
  subtitle: string
  description: string
  showTopics: boolean
  featureItems: Array<{
    title: string
    description: string
    icon: string
  }>
  ctaButton: {
    text: string
    link: string
  }
}

export interface FunFactSectionContent {
  title: string
  subtitle: string
  maxItems: number
  layout: 'grid' | 'carousel'
  autoPlay: boolean
}

export interface ProductCatalogSectionContent {
  title: string
  subtitle: string
  showCategories: boolean
  featuredOnly: boolean
  maxItems: number
  layout: 'grid' | 'list'
}

export interface LibrarySectionContent {
  title: string
  subtitle: string
  showFeaturedOnly: boolean
  maxItems: number
  layout: 'grid' | 'shelf'
}

export interface PromoSectionContent {
  title: string
  subtitle: string
  bannerImage: string
  promoCode?: string
  validUntil?: string
  ctaButton: {
    text: string
    link: string
  }
  isActive: boolean
}

export interface CollaborationSectionContent {
  title: string
  subtitle: string
  partners: Array<{
    name: string
    logo: string
    link?: string
    description?: string
  }>
  layout: 'grid' | 'carousel'
}

export interface FooterContent {
  brandName: string
  brandLogo: string
  description: string
  columns: Array<{
    title: string
    links: Array<{
      label: string
      link: string
    }>
  }>
  contact: {
    address: string
    email: string
    phone: string
  }
  socialMedia: Array<{
    platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'whatsapp'
    link: string
  }>
  copyright: string
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  favicon: string
  ogImage: string
  primaryColor: string
  secondaryColor: string
  isLandingPageActive: boolean
}

// Section keys for SystemConfig
export const CONTENT_KEYS = {
  SITE_SETTINGS: 'site_settings',
  NAVBAR: 'landing_navbar',
  HERO: 'landing_hero',
  EVENTS: 'landing_events',
  MERCHANDISE: 'landing_merchandise',
  FORUM: 'landing_forum',
  FUNFACTS: 'landing_funfacts',
  PRODUCTS: 'landing_products',
  LIBRARY: 'landing_library',
  PROMO: 'landing_promo',
  COLLABORATION: 'landing_collaboration',
  FOOTER: 'landing_footer',
  SECTION_ORDER: 'landing_section_order'
}

// Default content for each section
const DEFAULT_CONTENT = {
  [CONTENT_KEYS.SITE_SETTINGS]: {
    siteName: 'Antitesa Coffee',
    siteDescription: 'Platform manajemen modern untuk coffee shop',
    favicon: '/Antitesa.svg',
    ogImage: '/og-image.jpg',
    primaryColor: '#16a34a',
    secondaryColor: '#f97316',
    isLandingPageActive: true
  } as SiteSettings,

  [CONTENT_KEYS.NAVBAR]: {
    logo: '/Antitesa.svg',
    logoText: 'Antitesa',
    menuItems: [
      { label: 'Beranda', link: '/', isActive: true },
      { label: 'Menu', link: '/menu', isActive: true },
      { label: 'Event', link: '/event', isActive: true },
      { label: 'Pustaka', link: '/library', isActive: true },
      { label: 'Tentang', link: '/about', isActive: true }
    ],
    showLoginButton: true,
    loginButtonText: 'Login',
    contactPhone: '+62 812 3456 7890'
  } as NavbarContent,

  [CONTENT_KEYS.HERO]: {
    title: 'Selamat Datang di Antitesa Coffee',
    subtitle: 'Nikmati pengalaman kopi terbaik dengan suasana yang nyaman dan hangat',
    backgroundImage: '/images/hero-bg.jpg',
    ctaButton: {
      text: 'Lihat Menu',
      link: '/menu'
    },
    secondaryButton: {
      text: 'Tentang Kami',
      link: '/about'
    }
  } as HeroContent,

  [CONTENT_KEYS.EVENTS]: {
    title: 'Event & Kegiatan',
    subtitle: 'Ikuti berbagai event menarik bersama kami',
    showUpcoming: true,
    maxItems: 6,
    layout: 'grid'
  } as EventSectionContent,

  [CONTENT_KEYS.MERCHANDISE]: {
    title: 'Merchandise',
    subtitle: 'Koleksi merchandise eksklusif Antitesa',
    showFeaturedOnly: true,
    maxItems: 8,
    layout: 'grid'
  } as MerchandiseSectionContent,

  [CONTENT_KEYS.FORUM]: {
    title: 'Forum Komunitas',
    subtitle: 'Bergabung dengan komunitas pecinta kopi',
    description: 'Diskusi, berbagi pengalaman, dan temukan teman baru di forum komunitas kami',
    showTopics: true,
    featureItems: [
      { title: 'Diskusi Kopi', description: 'Berbagi tips dan review kopi', icon: 'coffee' },
      { title: 'Event Meetup', description: 'Info gathering dan meetup', icon: 'calendar' },
      { title: 'Recipe Sharing', description: 'Berbagi resep kopi rumahan', icon: 'book' }
    ],
    ctaButton: {
      text: 'Gabung Forum',
      link: '/forum'
    }
  } as ForumSectionContent,

  [CONTENT_KEYS.FUNFACTS]: {
    title: 'Fun Facts',
    subtitle: 'Fakta menarik seputar kopi',
    maxItems: 6,
    layout: 'carousel',
    autoPlay: true
  } as FunFactSectionContent,

  [CONTENT_KEYS.PRODUCTS]: {
    title: 'Menu Andalan',
    subtitle: 'Pilihan minuman favorit pelanggan kami',
    showCategories: true,
    featuredOnly: true,
    maxItems: 8,
    layout: 'grid'
  } as ProductCatalogSectionContent,

  [CONTENT_KEYS.LIBRARY]: {
    title: 'Pustaka Digital',
    subtitle: 'Koleksi buku dan bacaan menarik',
    showFeaturedOnly: true,
    maxItems: 6,
    layout: 'shelf'
  } as LibrarySectionContent,

  [CONTENT_KEYS.PROMO]: {
    title: 'Promo Spesial',
    subtitle: 'Jangan lewatkan penawaran menarik dari kami',
    bannerImage: '/images/promo-banner.jpg',
    promoCode: 'ANTITESA20',
    validUntil: '2026-02-28',
    ctaButton: {
      text: 'Klaim Promo',
      link: '/promo'
    },
    isActive: true
  } as PromoSectionContent,

  [CONTENT_KEYS.COLLABORATION]: {
    title: 'Partner & Kolaborasi',
    subtitle: 'Mitra yang bekerja sama dengan kami',
    partners: [
      { name: 'Partner 1', logo: '/images/partners/partner1.png', link: '#' },
      { name: 'Partner 2', logo: '/images/partners/partner2.png', link: '#' },
      { name: 'Partner 3', logo: '/images/partners/partner3.png', link: '#' }
    ],
    layout: 'carousel'
  } as CollaborationSectionContent,

  [CONTENT_KEYS.FOOTER]: {
    brandName: 'Antitesa',
    brandLogo: '/Antitesa.svg',
    description: 'Platform manajemen modern untuk coffee shop. Kelola produk, pustaka digital, dan website dalam satu tempat.',
    columns: [
      {
        title: 'Menu',
        links: [
          { label: 'Beranda', link: '/' },
          { label: 'Produk', link: '/menu' },
          { label: 'Pustaka', link: '/library' },
          { label: 'Tentang', link: '/about' }
        ]
      },
      {
        title: 'Layanan',
        links: [
          { label: 'Event', link: '/event' },
          { label: 'Merchandise', link: '/merchandise' },
          { label: 'Forum', link: '/forum' }
        ]
      }
    ],
    contact: {
      address: 'Jakarta, Indonesia',
      email: 'hello@antitesa.id',
      phone: '+62 812 3456 7890'
    },
    socialMedia: [
      { platform: 'facebook', link: 'https://facebook.com/antitesa' },
      { platform: 'instagram', link: 'https://instagram.com/antitesa' },
      { platform: 'twitter', link: 'https://twitter.com/antitesa' }
    ],
    copyright: '© 2026 Antitesa. All rights reserved.'
  } as FooterContent,

  [CONTENT_KEYS.SECTION_ORDER]: {
    sections: [
      { key: 'hero', isVisible: true, order: 0 },
      { key: 'products', isVisible: true, order: 1 },
      { key: 'events', isVisible: true, order: 2 },
      { key: 'merchandise', isVisible: true, order: 3 },
      { key: 'promo', isVisible: true, order: 4 },
      { key: 'library', isVisible: true, order: 5 },
      { key: 'funfacts', isVisible: true, order: 6 },
      { key: 'forum', isVisible: true, order: 7 },
      { key: 'collaboration', isVisible: true, order: 8 }
    ]
  }
}

export class SiteContentService {
  /**
   * Get content by key
   */
  async getContent<T>(key: string): Promise<T | null> {
    const config = await prisma.systemConfig.findUnique({
      where: { key }
    })
    
    if (config) {
      return config.value as T
    }
    
    // Return default if not found
    if (key in DEFAULT_CONTENT) {
      return DEFAULT_CONTENT[key as keyof typeof DEFAULT_CONTENT] as T
    }
    
    return null
  }

  /**
   * Get all landing page content
   */
  async getAllContent() {
    const allConfigs = await prisma.systemConfig.findMany({
      where: {
        key: {
          startsWith: 'landing_'
        }
      }
    })

    const contentMap: Record<string, any> = {}
    
    // Start with defaults
    Object.entries(DEFAULT_CONTENT).forEach(([key, value]) => {
      if (key.startsWith('landing_')) {
        contentMap[key] = value
      }
    })

    // Override with database values
    allConfigs.forEach(config => {
      contentMap[config.key] = config.value
    })

    // Get site settings
    const siteSettings = await this.getContent<SiteSettings>(CONTENT_KEYS.SITE_SETTINGS)
    
    return {
      siteSettings: siteSettings || DEFAULT_CONTENT[CONTENT_KEYS.SITE_SETTINGS],
      ...contentMap
    }
  }

  /**
   * Update content by key
   */
  async updateContent<T>(key: string, value: T, description?: string) {
    const existing = await prisma.systemConfig.findUnique({
      where: { key }
    })

    if (existing) {
      return await prisma.systemConfig.update({
        where: { key },
        data: {
          value: value as any,
          description: description || existing.description
        }
      })
    } else {
      return await prisma.systemConfig.create({
        data: {
          key,
          value: value as any,
          description: description || `Content for ${key}`,
          isPublic: key.startsWith('landing_') || key === CONTENT_KEYS.SITE_SETTINGS
        }
      })
    }
  }

  /**
   * Get navbar content
   */
  async getNavbar(): Promise<NavbarContent> {
    return await this.getContent<NavbarContent>(CONTENT_KEYS.NAVBAR) || 
           DEFAULT_CONTENT[CONTENT_KEYS.NAVBAR] as NavbarContent
  }

  /**
   * Update navbar content
   */
  async updateNavbar(content: NavbarContent) {
    return await this.updateContent(CONTENT_KEYS.NAVBAR, content, 'Landing page navbar configuration')
  }

  /**
   * Get hero content
   */
  async getHero(): Promise<HeroContent> {
    return await this.getContent<HeroContent>(CONTENT_KEYS.HERO) || 
           DEFAULT_CONTENT[CONTENT_KEYS.HERO] as HeroContent
  }

  /**
   * Update hero content
   */
  async updateHero(content: HeroContent) {
    return await this.updateContent(CONTENT_KEYS.HERO, content, 'Landing page hero section')
  }

  /**
   * Get footer content
   */
  async getFooter(): Promise<FooterContent> {
    return await this.getContent<FooterContent>(CONTENT_KEYS.FOOTER) || 
           DEFAULT_CONTENT[CONTENT_KEYS.FOOTER] as FooterContent
  }

  /**
   * Update footer content
   */
  async updateFooter(content: FooterContent) {
    return await this.updateContent(CONTENT_KEYS.FOOTER, content, 'Landing page footer configuration')
  }

  /**
   * Get section order and visibility
   */
  async getSectionOrder() {
    return await this.getContent<{ sections: Array<{ key: string, isVisible: boolean, order: number }> }>(CONTENT_KEYS.SECTION_ORDER) || 
           DEFAULT_CONTENT[CONTENT_KEYS.SECTION_ORDER]
  }

  /**
   * Update section order and visibility
   */
  async updateSectionOrder(sections: Array<{ key: string, isVisible: boolean, order: number }>) {
    return await this.updateContent(CONTENT_KEYS.SECTION_ORDER, { sections }, 'Landing page section order')
  }

  /**
   * Get site settings
   */
  async getSiteSettings(): Promise<SiteSettings> {
    return await this.getContent<SiteSettings>(CONTENT_KEYS.SITE_SETTINGS) || 
           DEFAULT_CONTENT[CONTENT_KEYS.SITE_SETTINGS] as SiteSettings
  }

  /**
   * Update site settings
   */
  async updateSiteSettings(settings: SiteSettings) {
    return await this.updateContent(CONTENT_KEYS.SITE_SETTINGS, settings, 'Site global settings')
  }

  /**
   * Toggle landing page active status
   */
  async toggleLandingPageActive(isActive: boolean) {
    const settings = await this.getSiteSettings()
    settings.isLandingPageActive = isActive
    return await this.updateSiteSettings(settings)
  }

  /**
   * Get public content only (for storefront)
   */
  async getPublicContent() {
    const siteSettings = await this.getSiteSettings()
    
    if (!siteSettings.isLandingPageActive) {
      return null // Landing page is disabled
    }

    const [
      navbar,
      hero,
      events,
      merchandise,
      forum,
      funfacts,
      products,
      library,
      promo,
      collaboration,
      footer,
      sectionOrder
    ] = await Promise.all([
      this.getNavbar(),
      this.getHero(),
      this.getContent<EventSectionContent>(CONTENT_KEYS.EVENTS),
      this.getContent<MerchandiseSectionContent>(CONTENT_KEYS.MERCHANDISE),
      this.getContent<ForumSectionContent>(CONTENT_KEYS.FORUM),
      this.getContent<FunFactSectionContent>(CONTENT_KEYS.FUNFACTS),
      this.getContent<ProductCatalogSectionContent>(CONTENT_KEYS.PRODUCTS),
      this.getContent<LibrarySectionContent>(CONTENT_KEYS.LIBRARY),
      this.getContent<PromoSectionContent>(CONTENT_KEYS.PROMO),
      this.getContent<CollaborationSectionContent>(CONTENT_KEYS.COLLABORATION),
      this.getFooter(),
      this.getSectionOrder()
    ])

    return {
      siteSettings,
      navbar,
      hero,
      events: events || DEFAULT_CONTENT[CONTENT_KEYS.EVENTS],
      merchandise: merchandise || DEFAULT_CONTENT[CONTENT_KEYS.MERCHANDISE],
      forum: forum || DEFAULT_CONTENT[CONTENT_KEYS.FORUM],
      funfacts: funfacts || DEFAULT_CONTENT[CONTENT_KEYS.FUNFACTS],
      products: products || DEFAULT_CONTENT[CONTENT_KEYS.PRODUCTS],
      library: library || DEFAULT_CONTENT[CONTENT_KEYS.LIBRARY],
      promo: promo || DEFAULT_CONTENT[CONTENT_KEYS.PROMO],
      collaboration: collaboration || DEFAULT_CONTENT[CONTENT_KEYS.COLLABORATION],
      footer,
      sectionOrder
    }
  }

  /**
   * Initialize default content
   */
  async initializeDefaults() {
    for (const [key, value] of Object.entries(DEFAULT_CONTENT)) {
      const existing = await prisma.systemConfig.findUnique({ where: { key } })
      if (!existing) {
        await prisma.systemConfig.create({
          data: {
            key,
            value: value as any,
            description: `Default content for ${key}`,
            isPublic: key.startsWith('landing_') || key === CONTENT_KEYS.SITE_SETTINGS
          }
        })
      }
    }
  }
}

export default new SiteContentService()

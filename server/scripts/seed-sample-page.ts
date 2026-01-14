/**
 * Seed Sample Page with Sections
 * Run: npx ts-node -r tsconfig-paths/register scripts/seed-sample-page.ts
 */

import { PrismaClient, SectionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding sample landing page...')

  // Create or update Home page
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Home',
      slug: 'home',
      metaTitle: 'Beranda - CoffeeShop CMS',
      metaDescription: 'Selamat datang di CoffeeShop CMS - Temukan kopi dan buku terbaik',
      isPublished: true,
      inNavbar: true,
      navOrder: 1
    }
  })

  console.log(`✅ Page created: ${homePage.title}`)

  // Delete existing sections for this page
  await prisma.section.deleteMany({
    where: { pageId: homePage.id }
  })

  // Create Hero Section
  const heroSection = await prisma.section.create({
    data: {
      name: 'HeroBannerCenter 1',
      slug: 'hero-home-1',
      sectionType: SectionType.HERO,
      pageId: homePage.id,
      contentData: {
        title: 'Jelajahi Dunia Pengetahuan',
        subtitle: 'Temukan koleksi buku terbaik untuk memperluas wawasan Anda',
        buttonText: 'Mulai Sekarang'
      },
      styleConfig: {},
      sortOrder: 0,
      isVisible: true
    }
  })

  console.log(`✅ Section created: ${heroSection.name}`)

  // Create Product Grid Section
  const productSection = await prisma.section.create({
    data: {
      name: 'ProductGrid 1',
      slug: 'products-home-1',
      sectionType: SectionType.PRODUCTS,
      pageId: homePage.id,
      contentData: {
        title: 'Menu Favorit Kami',
        limit: '6'
      },
      styleConfig: {},
      sortOrder: 1,
      isVisible: true
    }
  })

  console.log(`✅ Section created: ${productSection.name}`)

  // Create Text Block Section
  const textSection = await prisma.section.create({
    data: {
      name: 'TextBlock 1',
      slug: 'text-home-1',
      sectionType: SectionType.TEXT,
      pageId: homePage.id,
      contentData: {
        title: 'Tentang Kami',
        content: 'Kami berkomitmen menyajikan kopi terbaik dengan suasana yang nyaman untuk membaca dan bekerja. Setiap cangkir kopi kami dibuat dengan penuh perhatian dan cinta.'
      },
      styleConfig: {},
      sortOrder: 2,
      isVisible: true
    }
  })

  console.log(`✅ Section created: ${textSection.name}`)

  console.log('\n🎉 Sample page seeded successfully!')
  console.log(`\n📝 Page ID: ${homePage.id}`)
  console.log(`🔗 Edit at: http://localhost:5173/dashboard/pages/${homePage.id}/edit`)
  console.log(`👁️  View at: http://localhost:5173/home`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

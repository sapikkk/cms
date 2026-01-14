/**
 * Prisma Database Seeder
 * Creates initial data for the application
 */

import { PrismaClient, Role, SectionType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Define users to create
  const users = [
    {
      username: 'masteradmin',
      email: 'master@antitesa.com',
      password: 'MasterAdmin@2025',
      role: Role.MASTER_ADMIN,
      fullName: 'Master Administrator'
    },
    {
      username: 'owner',
      email: 'owner@antitesa.com',
      password: 'Owner@2025',
      role: Role.ADMIN_OWNER,
      fullName: 'Business Owner'
    },
    {
      username: 'admin',
      email: 'admin@antitesa.com',
      password: 'Admin@2025',
      role: Role.ADMIN_OWNER,
      fullName: 'General Admin'
    },
    {
      username: 'mediastaff',
      email: 'media@antitesa.com',
      password: 'Media@2025',
      role: Role.MEDIA_STAFF,
      fullName: 'Creative Media Staff'
    }
  ]

  console.log('👤 Creating Users...')

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password)
    
    // Check if user exists by username or email to avoid collision
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: user.username },
                { email: user.email }
            ]
        }
    })

    if (existingUser) {
        console.log(`   ℹ️  User ${user.username} (or email) already exists, updating...`)
        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                username: user.username,
                email: user.email,
                password: hashedPassword,
                role: user.role,
                fullName: user.fullName
            }
        })
    } else {
        await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: hashedPassword,
                role: user.role,
                fullName: user.fullName,
                isLocked: false,
            }
        })
        console.log(`   ✅ Created user: ${user.username}`)
    }
  }

  // 2. Create Demo Categories
  console.log('📁 Creating product categories...')
  
  const categories = [
    { name: 'Coffee', slug: 'coffee', description: 'Berbagai jenis kopi' },
    { name: 'Non-Coffee', slug: 'non-coffee', description: 'Minuman selain kopi' },
    { name: 'Food', slug: 'food', description: 'Makanan dan snack' },
    { name: 'Merchandise', slug: 'merchandise', description: 'Produk merchandise' },
  ]

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug }
    })

    if (!existing) {
      await prisma.category.create({ data: category })
      console.log(`   ✅ Created category: ${category.name}`)
    } else {
      console.log(`   ℹ️  Category "${category.name}" already exists`)
    }
  }

  // 3. Create Demo Product
  console.log('☕ Creating demo product...')
  
  const coffeeCategory = await prisma.category.findUnique({
    where: { slug: 'coffee' }
  })

  if (coffeeCategory) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: 'espresso' }
    })

    if (!existingProduct) {
      const product = await prisma.product.create({
        data: {
          name: 'Espresso',
          slug: 'espresso',
          description: 'Classic espresso shot made from premium Arabica beans',
          basePrice: 25000,
          categoryId: coffeeCategory.id,
          isActive: true,
          ingredients: {
            create: [
              {
                name: 'Arabica Beans',
                amount: 18,
                unit: 'GRAM',
                cost: 5000,
              },
              {
                name: 'Hot Water',
                amount: 30,
                unit: 'ML',
                cost: 0,
              }
            ]
          },
          variants: {
            create: [
              {
                name: 'Single Shot',
                priceAdj: 0,
              },
              {
                name: 'Double Shot',
                priceAdj: 15000,
              }
            ]
          }
        }
      })

      console.log(`   ✅ Created product: ${product.name}`)
    } else {
      console.log(`   ℹ️  Product "Espresso" already exists`)
    }
  }

  // 4. Create Demo Page
  console.log('📄 Creating demo page...')
  
  const existingPage = await prisma.page.findUnique({
    where: { slug: 'home' }
  })

  if (!existingPage) {
    await prisma.page.create({
      data: {
        title: 'Home',
        slug: 'home',
        isPublished: true,
        inNavbar: true,
        navOrder: 1,
        // Default sections for Homepage
        sections: {
          create: [
            {
              name: 'Hero Banner',
              slug: 'home-hero-1',
              sectionType: SectionType.HERO,
              contentData: {
                componentType: 'HeroBannerCenter',
                title: 'Welcome to Antitesa Coffee',
                subtitle: 'Coffee & Library - Sebuah Perpaduan',
                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920',
                buttonText: 'Jelajahi Menu',
              },
              styleConfig: {},
              sortOrder: 0
            },
            {
              name: 'Featured Products',
              slug: 'home-products-1',
              sectionType: SectionType.PRODUCTS,
              contentData: {
                componentType: 'ProductGrid',
                title: 'Kopi Pilihan Hari Ini',
                limit: 3
              },
              styleConfig: {},
              sortOrder: 1
            },
            {
              name: 'About Text',
              slug: 'home-text-1',
              sectionType: SectionType.TEXT,
              contentData: {
                componentType: 'TextBlock',
                title: 'Tentang Kami',
                content: 'Kami adalah coffee shop yang memadukan kenikmatan kopi dengan ketenangan perpustakaan.'
              },
              styleConfig: {},
              sortOrder: 2
            }
          ]
        },
        metaTitle: 'Antitesa Coffee - Coffee & Digital Library',
        metaDescription: 'Nikmati kopi terbaik sambil membaca koleksi buku digital kami.'
      }
    })

    console.log('   ✅ Created page: Home')
  } else {
    console.log('   ℹ️  Page "Home" already exists')
  }

  // 5. Create System Config
  console.log('⚙️  Creating system configuration...')
  
  const configs = [
    {
      key: 'site_name',
      value: { value: 'CoffeeShop CMS' },
      description: 'Website name',
      isPublic: true
    },
    {
      key: 'theme_primary_color',
      value: { value: '#977669' },
      description: 'Primary theme color',
      isPublic: true
    },
    {
      key: 'theme_accent_color',
      value: { value: '#f97316' },
      description: 'Accent theme color',
      isPublic: true
    }
  ]

  for (const config of configs) {
    const existing = await prisma.systemConfig.findUnique({
      where: { key: config.key }
    })

    if (!existing) {
      await prisma.systemConfig.create({ data: config })
      console.log(`   ✅ Created config: ${config.key}`)
    } else {
      console.log(`   ℹ️  Config "${config.key}" already exists`)
    }
  }

  // 6. Create Landing Page Content
  console.log('🏠 Creating landing page content...')
  
  console.log('Landing page content is now managed via Page "Home" (slug: home).')

  console.log('')
  console.log('✨ Seeding completed successfully!')
  console.log('')
  console.log('🔑 User Credentials (LOGIN WITH THESE):')
  users.forEach(u => {
    console.log(`   Role: ${u.role}`)
    console.log(`   Email: ${u.email}`)
    console.log(`   Password: ${u.password}`)
    console.log('   -------------------')
  })
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

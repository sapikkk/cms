// Add to schema.prisma after FunFact model

enum BlogCategory {
  NEWS          // Company news
  ARTICLE       // Coffee articles
  TUTORIAL      // How-to guides
  ANNOUNCEMENT  // Important updates
  OTHER
}

model BlogPost {
  id      String        @id @default(uuid())
  title   String
  slug    String        @unique
  excerpt String?       @db.Text  // Short summary
  content String        @db.Text  // Rich text HTML content
  
  // Featured Image
  coverImage String?
  
  // Categorization
  category BlogCategory @default(ARTICLE)
  tags     String[]     // Array of tags
  
  // SEO
  metaTitle       String?
  metaDescription String?
  
  // Engagement
  viewCount Int @default(0)
  likeCount Int @default(0)
  
  // Publishing
  isPublished Boolean   @default(false)
  publishedAt DateTime?
  
  // Author (Admin/Staff)
  authorId String?
  author   User?   @relation(fields: [authorId], references: [id])
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([slug])
  @@index([isPublished])
  @@index([category])
  @@index([publishedAt])
}

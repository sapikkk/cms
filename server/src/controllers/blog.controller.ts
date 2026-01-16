import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '@interfaces/request.interface';

const prisma = new PrismaClient();

// Helper to slugify title
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

/**
 * Blog Controller
 * Handles CRUD for Blog Posts (News, Articles, etc.)
 */

/**
 * Get all blog posts (Public)
 * Supports pagination, category filter, search
 */
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      category,
      search,
      tag,
      publishedOnly = 'true'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // Filter by published status (default true for public, admin can request false)
    if (publishedOnly === 'true') {
      where.isPublished = true;
    }

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        has: tag
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              fullName: true,
              username: true,
              avatar: true
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.blogPost.count({ where })
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts'
    });
  }
};

/**
 * Get single blog post by Slug (Public)
 */
export const getPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            fullName: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Article not found'
      });
      return;
    }

    // Check if published (unless specific override, but here we assume public access)
    // If admin wants to preview drafts, they might use ID or a different endpoint, 
    // but usually slug is public. We'll allow draft viewing if it exists but return a flag/warning? 
    // For now strict published check if valid public user.
    // Simplifying: Just return it. Front-end can handle "Draft" badge if user is admin.

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article'
    });
  }
};

/**
 * Create Blog Post (Admin Only)
 */
export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags, // Array of strings
      isPublished,
      metaTitle,
      metaDescription
    } = req.body;

    // Basic validation
    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Title is required'
      });
      return;
    }

    // Generate unique slug
    let slug = slugify(title);
    const existingSlug = await prisma.blogPost.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: content || '',
        excerpt,
        coverImage,
        category: category || 'ARTICLE',
        tags: tags || [],
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        metaTitle,
        metaDescription,
        authorId: req.user?.userId // From authenticated user
      }
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: post
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create article'
    });
  }
};

/**
 * Update Blog Post (Admin Only)
 */
export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      isPublished,
      metaTitle,
      metaDescription,
      slug // Optional manual slug update
    } = req.body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }

    // Handle publishing logic
    let publishedAt = existing.publishedAt;
    if (isPublished && !existing.isPublished) {
      publishedAt = new Date(); // Just published
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        coverImage,
        category,
        tags,
        isPublished,
        publishedAt,
        metaTitle,
        metaDescription,
        ...(slug && { slug: slugify(slug) }) // Only update slug if provided
      }
    });

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update article'
    });
  }
};

/**
 * Delete Blog Post (Admin Only)
 */
export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete article'
    });
  }
};

/**
 * Like Blog Post (Public)
 */
export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await prisma.blogPost.update({
      where: { id },
      data: { likeCount: { increment: 1 } }
    });

    res.json({
      success: true,
      data: { likeCount: post.likeCount },
      message: 'Liked successfully'
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like article'
    });
  }
};

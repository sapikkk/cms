import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Forum Controller (FunFact + Public Comments)
 * - FunFact posts serve as forum topics
 * - Public can comment without login (name required)
 * - Rich text support for comments
 */

// ==================== FUNFACT POSTS ====================

/**
 * Get all published FunFacts (forum topics)
 * Public endpoint
 */
export const getAllFunFacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isPublished: true
    };

    if (category) {
      where.category = category;
    }

    const [funFacts, total] = await Promise.all([
      prisma.funFact.findMany({
        where,
        include: {
          _count: {
            select: { comments: true }
          }
        },
        orderBy: {
          [sortBy as string]: order
        },
        skip,
        take: limitNum
      }),
      prisma.funFact.count({ where })
    ]);

    res.json({
      success: true,
      data: funFacts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching fun facts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum topics'
    });
  }
};

/**
 * Get single FunFact with comments
 * Public endpoint
 */
export const getFunFactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const funFact = await prisma.funFact.findUnique({
      where: { id },
      include: {
        comments: {
          where: {
            isVisible: true,
            isApproved: true  // Only show approved comments
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!funFact || !funFact.isPublished) {
      res.status(404).json({
        success: false,
        message: 'Forum topic not found'
      });
      return;
    }

    // Increment view count
    await prisma.funFact.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({
      success: true,
      data: funFact
    });
  } catch (error) {
    console.error('Error fetching fun fact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum topic'
    });
  }
};

/**
 * Create FunFact (Admin only)
 * Protected endpoint
 */
export const createFunFact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, image, category, isPublished } = req.body;

    // Basic validation
    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
      return;
    }

    const funFact = await prisma.funFact.create({
      data: {
        title,
        content,
        image,
        category: category || 'TRIVIA',
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null
      }
    });

    res.status(201).json({
      success: true,
      data: funFact,
      message: 'Forum topic created successfully'
    });
  } catch (error) {
    console.error('Error creating fun fact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create forum topic'
    });
  }
};

/**
 * Update FunFact (Admin only)
 * Protected endpoint
 */
export const updateFunFact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, image, category, isPublished } = req.body;

    const existing = await prisma.funFact.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Forum topic not found'
      });
      return;
    }

    const funFact = await prisma.funFact.update({
      where: { id },
      data: {
        ...( title && { title }),
        ...(content && { content }),
        ...(image !== undefined && { image }),
        ...(category && { category }),
        ...(isPublished !== undefined && {
          isPublished,
          publishedAt: isPublished && !existing.publishedAt ? new Date() : existing.publishedAt
        })
      }
    });

    res.json({
      success: true,
      data: funFact,
      message: 'Forum topic updated successfully'
    });
  } catch (error) {
    console.error('Error updating fun fact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update forum topic'
    });
  }
};

/**
 * Delete FunFact (Admin only)
 * Protected endpoint
 */
export const deleteFunFact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.funFact.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Forum topic deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting fun fact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete forum topic'
    });
  }
};

/**
 * Like FunFact (Public)
 */
export const likeFunFact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const funFact = await prisma.funFact.update({
      where: { id },
      data: { likeCount: { increment: 1 } }
    });

    res.json({
      success: true,
      data: { likeCount: funFact.likeCount },
      message: 'Liked successfully'
    });
  } catch (error) {
    console.error('Error liking fun fact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like topic'
    });
  }
};

// ==================== COMMENTS ====================

/**
 * Add Comment to FunFact (Public - No Login Required)
 * Requires: authorName, text, contentHtml
 */
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { funFactId } = req.params;
    const { authorName, authorEmail, text, contentHtml } = req.body;

    // Basic validation
    if (!authorName || authorName.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters'
      });
      return;
    }

    if (!text || text.trim().length < 1) {
      res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
      return;
    }

    if (!contentHtml) {
      res.status(400).json({
        success: false,
        message: 'Comment content HTML is required'
      });
      return;
    }

    // Check if fun fact exists and is published
    const funFact = await prisma.funFact.findUnique({
      where: { id: funFactId }
    });

    if (!funFact || !funFact.isPublished) {
      res.status(404).json({
        success: false,
        message: 'Forum topic not found or not published'
      });
      return;
    }

    // Create comment (auto-approve for now, can add moderation later)
    const comment = await prisma.comment.create({
      data: {
        funFactId,
        authorName: authorName.trim(),
        authorEmail: authorEmail ? authorEmail.trim() : null,
        text: text.trim(),
        contentHtml: contentHtml.trim(),
        isApproved: true,  // Auto-approve, change to false for moderation
        isVisible: true
      }
    });

    res.status(201).json({
      success: true,
      data: comment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

/**
 * Get Comments for FunFact (Public)
 */
export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { funFactId } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          funFactId,
          isVisible: true,
          isApproved: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.comment.count({
        where: {
          funFactId,
          isVisible: true,
          isApproved: true
        }
      })
    ]);

    res.json({
      success: true,
      data: comments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
};

/**
 * Moderate Comment (Admin only)
 * Approve, reject, or hide comment
 */
export const moderateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isApproved, isVisible } = req.body;

    const comment = await prisma.comment.update({
      where: { id },
      data: {
        ...(isApproved !== undefined && { isApproved }),
        ...(isVisible !== undefined && { isVisible })
      }
    });

    res.json({
      success: true,
      data: comment,
      message: 'Comment moderated successfully'
    });
  } catch (error) {
    console.error('Error moderating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to moderate comment'
    });
  }
};

/**
 * Delete Comment (Admin only)
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.comment.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    });
  }
};

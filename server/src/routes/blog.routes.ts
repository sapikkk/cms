import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';
import { authenticate } from '@middlewares/auth.middleware';
import { requireAnyAdmin } from '@middlewares/rbac.middleware';

const router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/v1/blog
 * @desc    Get all blog posts
 * @access  Public
 */
router.get('/', blogController.getAllPosts);

/**
 * @route   GET /api/v1/blog/:slug
 * @desc    Get single post by slug
 * @access  Public
 */
router.get('/:slug', blogController.getPostBySlug);

/**
 * @route   POST /api/v1/blog/:id/like
 * @desc    Like a post
 * @access  Public
 */
router.post('/:id/like', blogController.likePost);

// ==================== PROTECTED ROUTES (ADMIN) ====================

/**
 * @route   POST /api/v1/blog
 * @desc    Create new post
 * @access  Admin
 */
router.post(
  '/',
  authenticate,
  requireAnyAdmin,
  blogController.createPost
);

/**
 * @route   PUT /api/v1/blog/:id
 * @desc    Update post
 * @access  Admin
 */
router.put(
  '/:id',
  authenticate,
  requireAnyAdmin,
  blogController.updatePost
);

/**
 * @route   DELETE /api/v1/blog/:id
 * @desc    Delete post
 * @access  Admin
 */
router.delete(
  '/:id',
  authenticate,
  requireAnyAdmin,
  blogController.deletePost
);

export default router;

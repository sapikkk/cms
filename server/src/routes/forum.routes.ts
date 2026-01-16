import { Router } from 'express';
import * as forumController from '../controllers/forum.controller';
import { authenticate, optionalAuthenticate } from '@middlewares/auth.middleware';
import { requireAnyAdmin } from '@middlewares/rbac.middleware';

const router = Router();

// ==================== FUN FACTS (FORUM TOPICS) ====================

/**
 * @route   GET /api/v1/forum
 * @desc    Get all published fun facts (forum topics)
 * @access  Public
 */
router.get(
  '/',
  forumController.getAllFunFacts
);

/**
 * @route   GET /api/v1/forum/:id
 * @desc    Get single fun fact with comments
 * @access  Public
 */
router.get(
  '/:id',
  forumController.getFunFactById
);

/**
 * @route   POST /api/v1/forum
 * @desc    Create new fun fact (forum topic)
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  requireAnyAdmin,
  forumController.createFunFact
);

/**
 * @route   PUT /api/v1/forum/:id
 * @desc    Update fun fact
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  requireAnyAdmin,
  forumController.updateFunFact
);

/**
 * @route   DELETE /api/v1/forum/:id
 * @desc    Delete fun fact
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireAnyAdmin,
  forumController.deleteFunFact
);

/**
 * @route   POST /api/v1/forum/:id/like
 * @desc    Like a fun fact
 * @access  Public
 */
router.post(
  '/:id/like',
  forumController.likeFunFact
);

// ==================== COMMENTS ====================

/**
 * @route   GET /api/v1/forum/:funFactId/comments
 * @desc    Get comments for a fun fact
 * @access  Public
 */
router.get(
  '/:funFactId/comments',
  forumController.getComments
);

/**
 * @route   POST /api/v1/forum/:funFactId/comments
 * @desc    Add comment to fun fact (PUBLIC - No login required)
 * @access  Public
 */
router.post(
  '/:funFactId/comments',
  forumController.addComment
);

/**
 * @route   PATCH /api/v1/forum/comments/:id/moderate
 * @desc    Moderate comment (approve/reject/hide)
 * @access  Private (Admin only)
 */
router.patch(
  '/comments/:id/moderate',
  authenticate,
  requireAnyAdmin,
  forumController.moderateComment
);

/**
 * @route   DELETE /api/v1/forum/comments/:id
 * @desc    Delete comment
 * @access  Private (Admin only)
 */
router.delete(
  '/comments/:id',
  authenticate,
  requireAnyAdmin,
  forumController.deleteComment
);

export default router;

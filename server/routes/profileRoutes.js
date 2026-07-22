import express from 'express';
import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileCompletion,
  checkProfileStatus
} from '../controllers/profileController.js';

const router = express.Router();

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 * @access  Public (with user-id header)
 */
router.get('/', getProfile);

/**
 * @route   POST /api/profile
 * @desc    Create new profile
 * @access  Public (with user-id header)
 */
router.post('/', createProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Public (with user-id header)
 */
router.put('/', updateProfile);

/**
 * @route   DELETE /api/profile
 * @desc    Delete user profile
 * @access  Public (with user-id header)
 */
router.delete('/', deleteProfile);

/**
 * @route   GET /api/profile/completion
 * @desc    Get profile completion status
 * @access  Public (with user-id header)
 */
router.get('/completion', getProfileCompletion);

/**
 * @route   GET /api/profile/status
 * @desc    Check profile status
 * @access  Public (with user-id header)
 */
router.get('/status', checkProfileStatus);

export default router;
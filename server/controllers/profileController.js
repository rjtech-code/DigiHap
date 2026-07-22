import { isUsingInMemoryStorage, getInMemoryStorage } from '../config/database.js';
import { calculateProfileCompletion } from '../utils/profileCompletion.js';
import { sendHealthAlertEmail } from '../services/emailService.js';

/**
 * Get user profile by userId
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    
    // Use in-memory storage for development
    if (isUsingInMemoryStorage()) {
      const storage = getInMemoryStorage();
      const profile = storage.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      return res.json({
        success: true,
        data: profile,
        message: 'Profile fetched successfully'
      });
    }

    // Use MongoDB
    const Profile = (await import('../models/Profile.js')).default;
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.json({
      success: true,
      data: profile,
      message: 'Profile fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

/**
 * Create new profile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const createProfile = async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profileData = req.body;
    
    // Use in-memory storage for development
    if (isUsingInMemoryStorage()) {
      const storage = getInMemoryStorage();
      
      // Check if profile already exists
      if (storage.getProfile(userId)) {
        return res.status(409).json({
          success: false,
          message: 'Profile already exists. Use PUT to update.'
        });
      }

      // Create new profile
      const profile = {
        ...profileData,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.setProfile(userId, profile);

      // Send health alert email if disease is selected
      const emailResult = await sendHealthAlertEmail(profile);
      if (emailResult.success && !emailResult.skipped) {
        console.log('✓ Health alert email sent for new profile');
      }

      return res.status(201).json({
        success: true,
        data: profile,
        message: 'Profile created successfully'
      });
    }

    // Use MongoDB
    const Profile = (await import('../models/Profile.js')).default;
    
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Profile already exists. Use PUT to update.'
      });
    }

    // Create new profile
    const profile = new Profile({
      ...profileData,
      userId
    });

    await profile.save();

    // Send health alert email if disease is selected
    const emailResult = await sendHealthAlertEmail(profile);
    if (emailResult.success && !emailResult.skipped) {
      console.log('✓ Health alert email sent for new profile');
    }

    return res.status(201).json({
      success: true,
      data: profile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create profile',
      error: error.message
    });
  }
};

/**
 * Update existing profile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const updates = req.body;
    
    // Use in-memory storage for development
    if (isUsingInMemoryStorage()) {
      const storage = getInMemoryStorage();
      const existingProfile = storage.getProfile(userId);
      
      if (!existingProfile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      const updatedProfile = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      storage.setProfile(userId, updatedProfile);

      // Send health alert email if disease changed
      const emailResult = await sendHealthAlertEmail(updatedProfile, existingProfile);
      if (emailResult.success && !emailResult.skipped) {
        console.log('✓ Health alert email sent for profile update');
      }

      return res.json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      });
    }

    // Use MongoDB
    const Profile = (await import('../models/Profile.js')).default;
    const existingProfile = await Profile.findOne({ userId });
    
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    // Send health alert email if disease changed
    const emailResult = await sendHealthAlertEmail(profile, existingProfile);
    if (emailResult.success && !emailResult.skipped) {
      console.log('✓ Health alert email sent for profile update');
    }

    return res.json({
      success: true,
      data: profile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * Delete user profile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    
    // Use in-memory storage for development
    if (isUsingInMemoryStorage()) {
      const storage = getInMemoryStorage();
      const profile = storage.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      storage.deleteProfile(userId);

      return res.json({
        success: true,
        data: null,
        message: 'Profile deleted successfully'
      });
    }

    // Use MongoDB
    const Profile = (await import('../models/Profile.js')).default;
    const profile = await Profile.findOneAndDelete({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.json({
      success: true,
      data: null,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete profile',
      error: error.message
    });
  }
};

/**
 * Get profile completion status
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const getProfileCompletion = async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    
    // Use in-memory storage for development
    if (isUsingInMemoryStorage()) {
      const storage = getInMemoryStorage();
      const profile = storage.getProfile(userId);
      const completionPercentage = calculateProfileCompletion(profile);

      return res.json({
        success: true,
        data: {
          completionPercentage,
          profile: profile || null
        },
        message: 'Completion status fetched'
      });
    }

    // Use MongoDB
    const Profile = (await import('../models/Profile.js')).default;
    const profile = await Profile.findOne({ userId });
    const completionPercentage = calculateProfileCompletion(profile);

    return res.json({
      success: true,
      data: {
        completionPercentage,
        profile: profile || null
      },
      message: 'Completion status fetched'
    });
  } catch (error) {
    console.error('Error fetching completion status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch completion status',
      error: error.message
    });
  }
};

/**
 * Check profile status
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const checkProfileStatus = async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profile = await Profile.findOne({ userId });
    
    const completionPercentage = calculateProfileCompletion(profile);

    return res.json({
      success: true,
      data: {
        hasProfile: !!profile,
        completionPercentage,
        isComplete: completionPercentage === 100
      },
      message: 'Profile status checked'
    });
  } catch (error) {
    console.error('Error checking profile status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check profile status',
      error: error.message
    });
  }
};

export default {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileCompletion,
  checkProfileStatus
};
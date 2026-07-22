import api from './api';

// Profile API endpoints
const PROFILE_API = import.meta.env.VITE_PROFILE_API || '/profile';
const UPLOAD_API = import.meta.env.VITE_UPLOAD_API || '/profile/upload-image';
const DELETE_IMAGE_API = import.meta.env.VITE_DELETE_IMAGE_API || '/profile/delete-image';
const COMPLETION_API = import.meta.env.VITE_COMPLETION_API || '/profile/completion';

/**
 * Get user profile from backend
 * @returns {Promise<Object>} Profile data
 */
export const getProfile = async () => {
  try {
    const response = await api.get(PROFILE_API);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    // Check if it's a 404 (profile not found) - this is okay, user can create one
    if (error.response?.status === 404) {
      return {
        success: false,
        message: 'Profile not found',
        notFound: true
      };
    }
    
    return {
      success: false,
      message: error.message || 'Failed to fetch profile',
      error: error.response?.data
    };
  }
};

/**
 * Create new profile
 * @param {Object} profileData - Profile data to create
 * @returns {Promise<Object>} Created profile data
 */
export const createProfile = async (profileData) => {
  try {
    const response = await api.post(PROFILE_API, profileData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error creating profile:', error);
    return {
      success: false,
      message: error.message || 'Failed to create profile',
      error: error.response?.data
    };
  }
};

/**
 * Update existing profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put(PROFILE_API, profileData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      message: error.message || 'Failed to update profile',
      error: error.response?.data
    };
  }
};

/**
 * Delete user profile
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProfile = async () => {
  try {
    const response = await api.delete(PROFILE_API);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error deleting profile:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete profile',
      error: error.response?.data
    };
  }
};

/**
 * Upload profile image
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} Upload result with image URL
 */
export const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    const response = await api.post(UPLOAD_API, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      message: error.message || 'Failed to upload image',
      error: error.response?.data
    };
  }
};

/**
 * Delete profile image
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProfileImage = async () => {
  try {
    const response = await api.delete(DELETE_IMAGE_API);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete image',
      error: error.response?.data
    };
  }
};

/**
 * Get profile completion status
 * @returns {Promise<Object>} Completion status
 */
export const getProfileCompletion = async () => {
  try {
    const response = await api.get(COMPLETION_API);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching completion status:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch completion status',
      error: error.response?.data
    };
  }
};

/**
 * Check if profile exists
 * @returns {Promise<Object>} Profile status
 */
export const checkProfileStatus = async () => {
  try {
    const response = await api.get(`${PROFILE_API}/status`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error checking profile status:', error);
    return {
      success: false,
      message: error.message || 'Failed to check profile status',
      error: error.response?.data
    };
  }
};
import { useState, useEffect, useCallback } from 'react';
import { 
  getProfile, 
  createProfile, 
  updateProfile, 
  deleteProfile, 
  uploadProfileImage, 
  deleteProfileImage,
  getProfileCompletion 
} from '../services/profileService';
import { validateProfileForm } from '../utils/validators';
import { calculateProfileCompletion } from '../utils/profileCompletion';

/**
 * Custom hook for profile management with backend integration
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Fetch profile from backend on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Calculate completion percentage when profile changes
  useEffect(() => {
    if (profile) {
      const percentage = calculateProfileCompletion(profile);
      setCompletionPercentage(percentage);
    }
  }, [profile]);

  /**
   * Fetch profile data from backend
   */
  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getProfile();
      
      if (result.success) {
        setProfile(result.data);
      } else {
        // Profile doesn't exist yet - initialize with empty profile
        console.log('No profile found, user can create one');
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create new profile
   */
  const createNewProfile = useCallback(async (profileData) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      // Validate form data
      const validation = validateProfileForm(profileData);
      if (!validation.isValid) {
        setError('Please fix the validation errors');
        setError('Please fix the validation errors');
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Prepare data for backend (map frontend fields to backend fields if needed)
      const backendData = {
        fullName: profileData.fullName,
        mobileNumber: profileData.mobileNumber,
        email: profileData.email,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        wardNumber: profileData.wardNumber,
        emergencyContactName: profileData.emergencyContactName,
        emergencyContactNumber: profileData.emergencyContactNumber,
        bloodGroup: profileData.bloodGroup,
        medicalConditions: profileData.medicalConditions,
        preferredLanguage: profileData.preferredLanguage,
        receiveHeatAlerts: profileData.receiveHeatAlerts,
        receiveEmergencyNotifications: profileData.receiveEmergencyNotifications,
        emailNotifications: profileData.emailNotifications,
        smsNotifications: profileData.smsNotifications,
        profilePhoto: profileData.profilePhoto
      };

      const result = await createProfile(backendData);

      if (result.success) {
        setProfile(result.data);
        setSuccess('Profile created successfully!');
        setTimeout(() => setSuccess(null), 3000);
        return {
          success: true,
          data: result.data
        };
      } else {
        setError(result.message || 'Failed to create profile');
        return {
          success: false,
          message: result.message
        };
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Update existing profile
   */
  const updateUserProfile = useCallback(async (profileData) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      // Validate form data
      const validation = validateProfileForm(profileData);
      if (!validation.isValid) {
        setError('Please fix the validation errors');
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Prepare data for backend
      const backendData = {
        fullName: profileData.fullName,
        mobileNumber: profileData.mobileNumber,
        email: profileData.email,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        wardNumber: profileData.wardNumber,
        emergencyContactName: profileData.emergencyContactName,
        emergencyContactNumber: profileData.emergencyContactNumber,
        bloodGroup: profileData.bloodGroup,
        medicalConditions: profileData.medicalConditions,
        preferredLanguage: profileData.preferredLanguage,
        receiveHeatAlerts: profileData.receiveHeatAlerts,
        receiveEmergencyNotifications: profileData.receiveEmergencyNotifications,
        emailNotifications: profileData.emailNotifications,
        smsNotifications: profileData.smsNotifications,
        profilePhoto: profileData.profilePhoto
      };

      const result = await updateProfile(backendData);

      if (result.success) {
        setProfile(result.data);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
        return {
          success: true,
          data: result.data
        };
      } else {
        setError(result.message || 'Failed to update profile');
        return {
          success: false,
          message: result.message
        };
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Delete user profile
   */
  const deleteUserProfile = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return { success: false, message: 'Cancelled by user' };
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const result = await deleteProfile();

      if (result.success) {
        setProfile(null);
        setSuccess('Profile deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
        return { success: true };
      } else {
        setError(result.message || 'Failed to delete profile');
        return { success: false, message: result.message };
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Upload profile image
   */
  const uploadImage = useCallback(async (file) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      // Validate image file
      const { validateImageFile } = await import('../utils/validators');
      const imageErrors = validateImageFile(file);
      
      if (imageErrors) {
        setError(imageErrors[0]);
        setIsSaving(false);
        return {
          success: false,
          message: imageErrors[0]
        };
      }

      const result = await uploadProfileImage(file);

      if (result.success) {
        // Update profile with new image URL
        const imageUrl = result.data.url;
        setProfile(prev => ({
          ...prev,
          profilePhoto: imageUrl
        }));
        setSuccess('Profile photo updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
        return {
          success: true,
          data: { imageUrl }
        };
      } else {
        setError(result.message || 'Failed to upload image');
        return {
          success: false,
          message: result.message
        };
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Remove profile image
   */
  const removeImage = useCallback(async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) {
      return { success: false, message: 'Cancelled by user' };
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const result = await deleteProfileImage();

      if (result.success) {
        setProfile(prev => ({
          ...prev,
          profilePhoto: ''
        }));
        setSuccess('Profile photo removed successfully');
        setTimeout(() => setSuccess(null), 3000);
        return { success: true };
      } else {
        setError(result.message || 'Failed to remove image');
        return { success: false, message: result.message };
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    profile,
    isLoading,
    isSaving,
    error,
    success,
    completionPercentage,
    createNewProfile,
    updateUserProfile,
    deleteUserProfile,
    uploadImage,
    removeImage,
    clearMessages,
    refreshProfile: fetchProfileData
  };
};

export default useProfile;
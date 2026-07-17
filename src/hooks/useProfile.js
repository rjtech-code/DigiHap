import { useState, useEffect, useCallback } from 'react';
import { useProfile as useProfileContext } from '../context/ProfileContext';
import { validateProfileForm } from '../utils/validators';
import { calculateProfileCompletion } from '../utils/profileCompletion';

/**
 * Custom hook for profile management
 * Frontend-only version using Local Storage
 */
export const useProfile = () => {
  const { profile, saveProfile, updateProfile: updateContextProfile, deleteProfile: deleteContextProfile, isLoading } = useProfileContext();
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Calculate completion percentage when profile changes
  useEffect(() => {
    const percentage = calculateProfileCompletion(profile);
    setCompletionPercentage(percentage);
  }, [profile]);

  // Create new profile (frontend-only)
  const createNewProfile = useCallback((profileData) => {
    setError(null);
    setSuccess(null);

    // Validate form data
    const validation = validateProfileForm(profileData);
    if (!validation.isValid) {
      setError('Please fix the validation errors');
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Add timestamps
    const profileWithMetadata = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProfile(profileWithMetadata);
    setSuccess('Profile created successfully!');
    setTimeout(() => setSuccess(null), 3000);
    
    return {
      success: true,
      data: profileWithMetadata
    };
  }, [saveProfile]);

  // Update profile (frontend-only)
  const updateUserProfile = useCallback((profileData) => {
    setError(null);
    setSuccess(null);

    // Validate form data
    const validation = validateProfileForm(profileData);
    if (!validation.isValid) {
      setError('Please fix the validation errors');
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Update with timestamp
    const updatedProfile = {
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    updateContextProfile(updatedProfile);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
    
    return {
      success: true,
      data: updatedProfile
    };
  }, [updateContextProfile]);

  // Delete profile (frontend-only)
  const deleteUserProfile = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return { success: false, message: 'Cancelled by user' };
    }

    deleteContextProfile();
    setSuccess('Profile deleted successfully');
    setTimeout(() => setSuccess(null), 3000);
    
    return { success: true };
  }, [deleteContextProfile]);

  // Upload profile image (frontend-only - just updates the preview)
  const uploadImage = useCallback((file, preview) => {
    setError(null);

    if (preview) {
      updateContextProfile({ profilePhoto: preview });
      setSuccess('Profile photo updated!');
      setTimeout(() => setSuccess(null), 3000);
      return { success: true, data: { imageUrl: preview } };
    }
    
    return { success: false, message: 'No image provided' };
  }, [updateContextProfile]);

  // Remove profile image (frontend-only)
  const removeImage = useCallback(() => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) {
      return { success: false, message: 'Cancelled by user' };
    }

    updateContextProfile({ profilePhoto: '' });
    setSuccess('Profile photo removed successfully');
    setTimeout(() => setSuccess(null), 3000);
    
    return { success: true };
  }, [updateContextProfile]);

  // Clear messages
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
    clearMessages
  };
};

export default useProfile;
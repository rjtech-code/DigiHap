import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// Default empty profile
const getDefaultProfile = () => ({
  profilePhoto: '',
  fullName: '',
  mobileNumber: '',
  email: '',
  gender: '',
  dateOfBirth: '',
  address: '',
  wardNumber: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  bloodGroup: '',
  medicalConditions: [],
  preferredLanguage: 'english',
  receiveHeatAlerts: true,
  receiveEmergencyNotifications: true,
  emailNotifications: false,
  smsNotifications: false,
});

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('digihap_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
      } catch (error) {
        console.error('Error parsing profile from localStorage:', error);
        localStorage.removeItem('digihap_profile');
        // Initialize with default profile
        const defaultProfile = getDefaultProfile();
        setProfile(defaultProfile);
        localStorage.setItem('digihap_profile', JSON.stringify(defaultProfile));
      }
    } else {
      // Initialize with default profile
      const defaultProfile = getDefaultProfile();
      setProfile(defaultProfile);
      localStorage.setItem('digihap_profile', JSON.stringify(defaultProfile));
    }
    setIsLoading(false);
  }, []);

  const saveProfile = (profileData) => {
    setProfile(profileData);
    localStorage.setItem('digihap_profile', JSON.stringify(profileData));
  };

  const updateProfile = (updates) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('digihap_profile', JSON.stringify(updatedProfile));
  };

  const deleteProfile = () => {
    const defaultProfile = getDefaultProfile();
    setProfile(defaultProfile);
    localStorage.setItem('digihap_profile', JSON.stringify(defaultProfile));
  };

  const calculateCompletion = () => {
    if (!profile) return 0;

    // Required fields (50% total - each field 5%)
    const requiredFields = [
      'fullName', 'mobileNumber', 'email', 'gender', 'dateOfBirth',
      'address', 'wardNumber', 'emergencyContactName', 'emergencyContactNumber'
    ];

    // Optional fields (50% total - each field ~8.33%)
    const optionalFields = [
      'profilePhoto', 'bloodGroup', 'medicalConditions', 'preferredLanguage',
      'receiveHeatAlerts', 'receiveEmergencyNotifications'
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    // Check required fields
    requiredFields.forEach(field => {
      if (profile[field] && profile[field].toString().trim() !== '') {
        completedRequired++;
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      if (field === 'medicalConditions' && Array.isArray(profile[field]) && profile[field].length > 0) {
        completedOptional++;
      } else if (field === 'profilePhoto' && profile[field]) {
        completedOptional++;
      } else if (profile[field] !== undefined && profile[field] !== null && profile[field] !== '') {
        completedOptional++;
      }
    });

    const requiredPercentage = (completedRequired / requiredFields.length) * 50;
    const optionalPercentage = (completedOptional / optionalFields.length) * 50;

    return Math.round(requiredPercentage + optionalPercentage);
  };

  const value = {
    profile,
    isLoading,
    saveProfile,
    updateProfile,
    deleteProfile,
    calculateCompletion
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
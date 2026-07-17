/**
 * Profile Completion Calculator
 * Calculates profile completion percentage based on filled fields
 */

// Required fields that contribute to completion
export const REQUIRED_FIELDS = [
  'fullName',
  'mobileNumber',
  'email',
  'gender',
  'dateOfBirth',
  'address',
  'wardNumber',
  'emergencyContactName',
  'emergencyContactNumber'
];

// Optional fields that improve completion
export const OPTIONAL_FIELDS = [
  'profilePhoto',
  'bloodGroup',
  'medicalConditions',
  'preferredLanguage',
  'receiveHeatAlerts',
  'receiveEmergencyNotifications'
];

// Calculate profile completion percentage
export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  let completedRequired = 0;
  let completedOptional = 0;

  // Check required fields (each worth ~5.56%)
  REQUIRED_FIELDS.forEach(field => {
    if (isFieldCompleted(profile, field)) {
      completedRequired++;
    }
  });

  // Check optional fields (each worth ~8.33%)
  OPTIONAL_FIELDS.forEach(field => {
    if (isFieldCompleted(profile, field)) {
      completedOptional++;
    }
  });

  // Calculate percentages
  const requiredPercentage = (completedRequired / REQUIRED_FIELDS.length) * 50;
  const optionalPercentage = (completedOptional / OPTIONAL_FIELDS.length) * 50;

  return Math.round(requiredPercentage + optionalPercentage);
};

// Check if a specific field is completed
const isFieldCompleted = (profile, field) => {
  const value = profile[field];
  
  if (value === undefined || value === null) {
    return false;
  }
  
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  if (typeof value === 'boolean') {
    return true; // Boolean fields are considered complete if they exist
  }
  
  return true;
};

// Get completion status message
export const getCompletionMessage = (percentage) => {
  if (percentage === 100) {
    return {
      message: '🎉 Your profile is complete!',
      emoji: '🎉',
      isComplete: true
    };
  } else if (percentage >= 75) {
    return {
      message: 'Almost there! Just a few more details needed.',
      emoji: '💪',
      isComplete: false
    };
  } else if (percentage >= 50) {
    return {
      message: 'Good progress! Keep going.',
      emoji: '👍',
      isComplete: false
    };
  } else if (percentage >= 25) {
    return {
      message: 'Getting started! Fill in more details.',
      emoji: '📝',
      isComplete: false
    };
  } else {
    return {
      message: 'Welcome! Let\'s complete your profile.',
      emoji: '👋',
      isComplete: false
    };
  }
};

// Get missing required fields
export const getMissingRequiredFields = (profile) => {
  if (!profile) return REQUIRED_FIELDS;
  
  return REQUIRED_FIELDS.filter(field => !isFieldCompleted(profile, field));
};

// Get missing optional fields
export const getMissingOptionalFields = (profile) => {
  if (!profile) return OPTIONAL_FIELDS;
  
  return OPTIONAL_FIELDS.filter(field => !isFieldCompleted(profile, field));
};

// Get field label for display
export const getFieldLabel = (field) => {
  const labels = {
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number',
    email: 'Email Address',
    gender: 'Gender',
    dateOfBirth: 'Date of Birth',
    address: 'Address',
    wardNumber: 'Ward Number',
    emergencyContactName: 'Emergency Contact Name',
    emergencyContactNumber: 'Emergency Contact Number',
    profilePhoto: 'Profile Photo',
    bloodGroup: 'Blood Group',
    medicalConditions: 'Medical Conditions',
    preferredLanguage: 'Preferred Language',
    receiveHeatAlerts: 'Heat Alerts',
    receiveEmergencyNotifications: 'Emergency Notifications'
  };
  
  return labels[field] || field;
};

// Get completion breakdown
export const getCompletionBreakdown = (profile) => {
  if (!profile) {
    return {
      required: { completed: 0, total: REQUIRED_FIELDS.length },
      optional: { completed: 0, total: OPTIONAL_FIELDS.length },
      total: 0
    };
  }

  let completedRequired = 0;
  let completedOptional = 0;

  REQUIRED_FIELDS.forEach(field => {
    if (isFieldCompleted(profile, field)) {
      completedRequired++;
    }
  });

  OPTIONAL_FIELDS.forEach(field => {
    if (isFieldCompleted(profile, field)) {
      completedOptional++;
    }
  });

  return {
    required: { completed: completedRequired, total: REQUIRED_FIELDS.length },
    optional: { completed: completedOptional, total: OPTIONAL_FIELDS.length },
    total: Math.round(((completedRequired / REQUIRED_FIELDS.length) * 50) + ((completedOptional / OPTIONAL_FIELDS.length) * 50))
  };
};

// Check if profile is complete
export const isProfileComplete = (profile) => {
  return calculateProfileCompletion(profile) === 100;
};

// Get profile status
export const getProfileStatus = (profile) => {
  const completion = calculateProfileCompletion(profile);
  const missingRequired = getMissingRequiredFields(profile);
  
  if (completion === 100) {
    return {
      status: 'complete',
      message: 'Profile Complete',
      color: 'green'
    };
  } else if (missingRequired.length === 0) {
    return {
      status: 'partial',
      message: 'Required Fields Complete',
      color: 'blue'
    };
  } else {
    return {
      status: 'incomplete',
      message: 'Profile Incomplete',
      color: 'orange'
    };
  }
};
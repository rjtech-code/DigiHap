/**
 * Calculate profile completion percentage
 * @param {Object} profile - Profile document
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  
  const requiredFields = [
    'fullName', 'mobileNumber', 'email', 'gender', 'dateOfBirth',
    'address', 'wardNumber', 'emergencyContactName', 'emergencyContactNumber'
  ];
  
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

export default { calculateProfileCompletion };
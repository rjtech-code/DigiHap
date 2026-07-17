/**
 * Validation Utilities
 * Reusable validation functions for form fields
 */

// Validate email format
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null; // No error
};

// Validate mobile number (Indian format)
export const validateMobileNumber = (mobileNumber) => {
  if (!mobileNumber || mobileNumber.trim() === '') {
    return 'Mobile number is required';
  }
  
  // Remove any spaces or special characters
  const cleanedNumber = mobileNumber.replace(/\s+/g, '');
  
  // Check if it's exactly 10 digits
  if (!/^[6-9]\d{9}$/.test(cleanedNumber)) {
    return 'Please enter a valid 10-digit mobile number (starting with 6-9)';
  }
  
  return null; // No error
};

// Validate required field
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null; // No error
};

// Validate image file
export const validateImageFile = (file) => {
  const errors = [];
  
  // Check if file exists
  if (!file) {
    return null; // No file is okay (optional field)
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Please upload JPG, PNG, or WEBP images only');
  }
  
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push('Image size should be less than 5MB');
  }
  
  return errors.length > 0 ? errors : null;
};

// Validate date of birth
export const validateDateOfBirth = (dateString) => {
  if (!dateString) {
    return 'Date of birth is required';
  }
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  
  // Check if date is not in the future
  if (date > today) {
    return 'Date of birth cannot be in the future';
  }
  
  // Check if age is reasonable (not more than 120 years)
  const age = today.getFullYear() - date.getFullYear();
  if (age > 120) {
    return 'Please enter a valid date of birth';
  }
  
  return null; // No error
};

// Validate ward number
export const validateWardNumber = (wardNumber) => {
  if (!wardNumber && wardNumber !== 0) {
    return 'Ward number is required';
  }
  
  const ward = parseInt(wardNumber, 10);
  if (isNaN(ward) || ward < 1 || ward > 60) {
    return 'Please select a valid ward number (1-60)';
  }
  
  return null; // No error
};

// Validate blood group
export const validateBloodGroup = (bloodGroup) => {
  if (!bloodGroup) {
    return null; // Optional field
  }
  
  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!validBloodGroups.includes(bloodGroup)) {
    return 'Please select a valid blood group';
  }
  
  return null; // No error
};

// Validate gender
export const validateGender = (gender) => {
  if (!gender) {
    return 'Gender is required';
  }
  
  const validGenders = ['Male', 'Female', 'Other'];
  if (!validGenders.includes(gender)) {
    return 'Please select a valid gender';
  }
  
  return null; // No error
};

// Validate address
export const validateAddress = (address) => {
  if (!address || address.trim() === '') {
    return 'Address is required';
  }
  
  if (address.trim().length < 10) {
    return 'Please enter a complete address (at least 10 characters)';
  }
  
  return null; // No error
};

// Validate full name
export const validateFullName = (name) => {
  if (!name || name.trim() === '') {
    return 'Full name is required';
  }
  
  if (name.trim().length < 3) {
    return 'Name must be at least 3 characters long';
  }
  
  if (name.trim().length > 100) {
    return 'Name must be less than 100 characters';
  }
  
  // Check if name contains only letters, spaces, and common characters
  const nameRegex = /^[a-zA-Z\s\.\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return 'Name can only contain letters, spaces, dots, hyphens, and apostrophes';
  }
  
  return null; // No error
};

// Validate emergency contact number
export const validateEmergencyContactNumber = (number) => {
  if (!number || number.trim() === '') {
    return 'Emergency contact number is required';
  }
  
  const cleanedNumber = number.replace(/\s+/g, '');
  
  if (!/^[6-9]\d{9}$/.test(cleanedNumber)) {
    return 'Please enter a valid 10-digit mobile number (starting with 6-9)';
  }
  
  return null; // No error
};

// Validate emergency contact name
export const validateEmergencyContactName = (name) => {
  if (!name || name.trim() === '') {
    return 'Emergency contact name is required';
  }
  
  if (name.trim().length < 3) {
    return 'Emergency contact name must be at least 3 characters long';
  }
  
  return null; // No error
};

// Validate entire form
export const validateProfileForm = (formData) => {
  const errors = {};
  
  // Validate required fields
  const fullNameError = validateFullName(formData.fullName);
  if (fullNameError) errors.fullName = fullNameError;
  
  const mobileError = validateMobileNumber(formData.mobileNumber);
  if (mobileError) errors.mobileNumber = mobileError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const genderError = validateGender(formData.gender);
  if (genderError) errors.gender = genderError;
  
  const dobError = validateDateOfBirth(formData.dateOfBirth);
  if (dobError) errors.dateOfBirth = dobError;
  
  const addressError = validateAddress(formData.address);
  if (addressError) errors.address = addressError;
  
  const wardError = validateWardNumber(formData.wardNumber);
  if (wardError) errors.wardNumber = wardError;
  
  const emergencyNameError = validateEmergencyContactName(formData.emergencyContactName);
  if (emergencyNameError) errors.emergencyContactName = emergencyNameError;
  
  const emergencyNumberError = validateEmergencyContactNumber(formData.emergencyContactNumber);
  if (emergencyNumberError) errors.emergencyContactNumber = emergencyNumberError;
  
  // Validate optional fields if provided
  if (formData.bloodGroup) {
    const bloodError = validateBloodGroup(formData.bloodGroup);
    if (bloodError) errors.bloodGroup = bloodError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  const map = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;'
  };
  
  return input.replace(/[&<>"']/g, (m) => map[m]);
};

// Format mobile number for display
export const formatMobileNumber = (mobileNumber) => {
  if (!mobileNumber) return '';
  
  const cleaned = mobileNumber.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
  }
  
  return mobileNumber;
};
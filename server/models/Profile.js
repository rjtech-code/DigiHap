import mongoose from 'mongoose';

/**
 * Profile Schema
 * Defines the structure for user profiles in MongoDB
 */
const profileSchema = new mongoose.Schema({
  // User identification (can be linked to auth system later)
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number (starting with 6-9)']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Please select a valid gender'
    }
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [10, 'Please enter a complete address (at least 10 characters)']
  },
  wardNumber: {
    type: Number,
    required: [true, 'Ward number is required'],
    min: [1, 'Ward number must be at least 1'],
    max: [60, 'Ward number must be at most 60']
  },
  
  // Emergency Contact Information
  emergencyContactName: {
    type: String,
    required: [true, 'Emergency contact name is required'],
    minlength: [3, 'Emergency contact name must be at least 3 characters']
  },
  emergencyContactNumber: {
    type: String,
    required: [true, 'Emergency contact number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number (starting with 6-9)']
  },
  
  // Health Information
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: 'Please select a valid blood group'
    }
  },
  medicalConditions: [{
    type: String,
    enum: {
      values: ['Diabetes', 'Heart Disease', 'Asthma', 'Hypertension', 'Elderly (65+)', 'Pregnant', 'Respiratory Issues', 'Kidney Disease', 'None'],
      message: 'Invalid medical condition'
    }
  }],
  
  // Preferences
  preferredLanguage: {
    type: String,
    enum: {
      values: ['english', 'hindi'],
      message: 'Please select a valid language'
    },
    default: 'english'
  },
  receiveHeatAlerts: {
    type: Boolean,
    default: true
  },
  receiveEmergencyNotifications: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: false
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  
  // Profile Image
  profilePhoto: {
    type: String,
    default: ''
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries (removed duplicate userId index - already defined in schema)
profileSchema.index({ email: 1 });
profileSchema.index({ mobileNumber: 1 });

// Virtual for age calculation
profileSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to update updatedAt
profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to calculate profile completion
profileSchema.statics.calculateCompletion = function(profile) {
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

// Instance method to check if profile is complete
profileSchema.methods.isComplete = function() {
  return this.calculateCompletion(this) === 100;
};

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
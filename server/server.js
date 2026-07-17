import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
});

// In-memory data storage (replace with database in production)
let profiles = {};
let profileImages = {};

// Helper function to generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to calculate profile completion
const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  
  const fields = [
    'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
    'address', 'city', 'state', 'pincode', 'emergencyContact1',
    'emergencyContact2', 'bloodGroup', 'allergies', 'medicalConditions'
  ];
  
  const filledFields = fields.filter(field => profile[field] && profile[field].trim() !== '').length;
  return Math.round((filledFields / fields.length) * 100);
};

// Routes

// Get user profile
app.get('/api/profile', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profile = profiles[userId];
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      data: profile,
      message: 'Profile fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Create new profile
app.post('/api/profile', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profileData = req.body;
    
    const profile = {
      id: generateId(),
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    profiles[userId] = profile;
    
    res.status(201).json({
      success: true,
      data: profile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create profile',
      error: error.message
    });
  }
});

// Update user profile
app.put('/api/profile', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profileData = req.body;
    
    if (!profiles[userId]) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    profiles[userId] = {
      ...profiles[userId],
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: profiles[userId],
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Delete user profile
app.delete('/api/profile', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    
    if (!profiles[userId]) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    delete profiles[userId];
    delete profileImages[userId];
    
    res.json({
      success: true,
      data: null,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile',
      error: error.message
    });
  }
});

// Upload profile image
app.post('/api/profile/upload-image', upload.single('profilePhoto'), (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    profileImages[userId] = {
      filename: req.file.filename,
      path: req.file.path,
      uploadedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Delete profile image
app.delete('/api/profile/delete-image', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    
    if (!profileImages[userId]) {
      return res.status(404).json({
        success: false,
        message: 'No image found'
      });
    }
    
    delete profileImages[userId];
    
    res.json({
      success: true,
      data: null,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Get profile completion status
app.get('/api/profile/completion', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profile = profiles[userId];
    const completion = calculateProfileCompletion(profile);
    
    res.json({
      success: true,
      data: {
        completionPercentage: completion,
        profile: profile || null
      },
      message: 'Completion status fetched'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completion status',
      error: error.message
    });
  }
});

// Update notification preferences
app.put('/api/profile/notifications', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const preferences = req.body;
    
    if (!profiles[userId]) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    profiles[userId].notificationPreferences = {
      ...profiles[userId].notificationPreferences,
      ...preferences,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: profiles[userId].notificationPreferences,
      message: 'Notification preferences updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

// Get emergency contacts
app.get('/api/profile/emergency-contacts', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profile = profiles[userId];
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        emergencyContact1: profile.emergencyContact1,
        emergencyContact2: profile.emergencyContact2
      },
      message: 'Emergency contacts fetched'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency contacts',
      error: error.message
    });
  }
});

// Update emergency contacts
app.put('/api/profile/emergency-contacts', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const contacts = req.body;
    
    if (!profiles[userId]) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    profiles[userId] = {
      ...profiles[userId],
      emergencyContact1: contacts.emergencyContact1,
      emergencyContact2: contacts.emergencyContact2,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: {
        emergencyContact1: profiles[userId].emergencyContact1,
        emergencyContact2: profiles[userId].emergencyContact2
      },
      message: 'Emergency contacts updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update emergency contacts',
      error: error.message
    });
  }
});

// Export profile data
app.get('/api/profile/export', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profile = profiles[userId];
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      data: profile,
      message: 'Profile data exported'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to export profile',
      error: error.message
    });
  }
});

// Check profile status
app.get('/api/profile/status', (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    const profile = profiles[userId];
    const completion = calculateProfileCompletion(profile);
    
    res.json({
      success: true,
      data: {
        hasProfile: !!profile,
        completionPercentage: completion,
        isComplete: completion === 100
      },
      message: 'Profile status checked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check profile status',
      error: error.message
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
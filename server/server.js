import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDatabase } from './config/database.js';
import profileRoutes from './routes/profileRoutes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/profile', profileRoutes);

// Image upload endpoint
app.post('/api/profile/upload-image', upload.single('profilePhoto'), async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // In production, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll return the local file path
    const imageUrl = `/uploads/${req.file.filename}`;

    // Update profile with image URL
    const Profile = (await import('./models/Profile.js')).default;
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { profilePhoto: imageUrl },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.json({
      success: true,
      data: {
        filename: req.file.filename,
        url: imageUrl
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Delete profile image endpoint
app.delete('/api/profile/delete-image', async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'default';

    // Update profile to remove image URL
    const Profile = (await import('./models/Profile.js')).default;
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { profilePhoto: '' },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.json({
      success: true,
      data: null,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

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
const startServer = async () => {
  try {
    // Connect to MongoDB
    const dbConnected = await connectDatabase();
    
    if (!dbConnected) {
      console.error('❌ Server cannot start without MongoDB connection');
      console.error('⚠️  Please configure MONGODB_URI in server/.env file');
      console.error('🛑 Server startup aborted');
      process.exit(1);
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log('✅ Server Running on Port ' + PORT);
      console.log('🔗 API endpoints available at http://localhost:' + PORT + '/api');
      console.log('📊 Health check: http://localhost:' + PORT + '/health');
      console.log('👤 Default user-id header: default');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
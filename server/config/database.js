import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// In-memory storage for development mode (when MongoDB is not available)
let inMemoryProfiles = {};
let useInMemoryStorage = false;

/**
 * Connect to MongoDB Atlas
 * @returns {Promise<boolean>} Connection success status
 */
export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri || mongoUri.includes('<') || mongoUri.includes('>')) {
      console.warn('⚠️  MongoDB URI not configured. Using in-memory storage for development.');
      console.warn('⚠️  Data will be lost when server restarts.');
      console.warn('⚠️  For production, configure MONGODB_URI in server/.env');
      useInMemoryStorage = true;
      return true;
    }

    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(mongoUri, {
      // Modern MongoDB driver options
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name || 'digihap'}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📦 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.warn('⚠️  Falling back to in-memory storage for development');
    console.warn('⚠️  Data will be lost when server restarts');
    useInMemoryStorage = true;
    return true;
  }
};

/**
 * Check if using in-memory storage
 * @returns {boolean}
 */
export const isUsingInMemoryStorage = () => {
  return useInMemoryStorage;
};

/**
 * Get in-memory storage (for development)
 * @returns {Object}
 */
export const getInMemoryStorage = () => {
  return {
    profiles: inMemoryProfiles,
    setProfile: (userId, profile) => {
      inMemoryProfiles[userId] = profile;
    },
    getProfile: (userId) => {
      return inMemoryProfiles[userId];
    },
    deleteProfile: (userId) => {
      delete inMemoryProfiles[userId];
    }
  };
};

/**
 * Check if database is connected
 * @returns {boolean}
 */
export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

# Production-Ready Profile Backend - Setup Guide

## Issues Fixed

### 1. ✅ Duplicate Mongoose Index
**Problem:** `Duplicate schema index on {"userId":1}`
**Root Cause:** Index was defined both in schema definition and explicitly via `profileSchema.index()`
**Fix:** Removed duplicate `profileSchema.index({ userId: 1 })` line from `models/Profile.js`

### 2. ✅ MongoDB Connection Crash
**Problem:** Server crashed on startup when MongoDB URI was not configured
**Root Cause:** `connectDatabase()` called `process.exit(1)` without allowing graceful handling
**Fix:** 
- Modified `connectDatabase()` to return `false` instead of crashing
- Added validation to check if MongoDB URI is configured
- Added helpful error messages with troubleshooting tips
- Modified `server.js` to check database connection before starting

### 3. ✅ Server Startup Flow
**Problem:** Server attempted to start even when database connection failed
**Root Cause:** No validation of database connection status
**Fix:** Added proper startup sequence:
1. Load environment variables
2. Connect to MongoDB
3. Validate connection success
4. Start Express server only if DB is connected

### 4. ✅ Error Handling
**Problem:** Uncaught exceptions could crash the server
**Root Cause:** Missing global error handlers
**Fix:** Added handlers for:
- `unhandledRejection` - Catches unhandled promise rejections
- `uncaughtException` - Catches uncaught exceptions
- Global Express error middleware

## Current Status

### ✅ Completed
- MongoDB Atlas integration with proper connection handling
- Profile model with complete schema and validation
- All CRUD controllers with error handling
- RESTful API routes
- Profile completion calculation
- Image upload/delete endpoints
- React Hooks compliance in frontend
- Event handler fixes for form inputs
- Environment variable configuration
- Production-ready error responses

### ⚠️ Requires Action
You **must** configure MongoDB Atlas before the server can start:

## Setup Instructions

### Step 1: Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free account or log in
3. Create a new cluster (or use existing)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database-name>?retryWrites=true&w=majority`)

### Step 2: Configure Environment Variables

Edit `DigiHap/server/.env`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster-url>/<database-name>?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (for future authentication)
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

**Example:**
```env
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/digihap?retryWrites=true&w=majority
```

### Step 3: Whitelist Your IP in MongoDB Atlas

1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Add your current IP address or use `0.0.0.0/0` for development (allows all IPs)
4. Click "Confirm"

### Step 4: Create Database User

1. In MongoDB Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Grant "Read and write to any database" permissions
5. Click "Add User"

### Step 5: Install Dependencies

```bash
cd DigiHap/server
npm install
```

### Step 6: Start the Server

```bash
npm run dev
```

**Expected Output:**
```
🔄 Connecting to MongoDB Atlas...
✅ MongoDB Connected Successfully
📊 Database: digihap
🔗 Host: cluster0.abc123.mongodb.net
✅ Server Running on Port 3000
🔗 API endpoints available at http://localhost:3000/api
📊 Health check: http://localhost:3000/health
👤 Default user-id header: default
```

### Step 7: Test the Server

```bash
# Health check
curl http://localhost:3000/health

# Create a profile
curl -X POST http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -H "user-id: test-user-123" \
  -d '{
    "fullName": "John Doe",
    "mobileNumber": "9876543210",
    "email": "john@example.com",
    "gender": "Male",
    "dateOfBirth": "1990-01-01",
    "address": "123 Main Street, City, State, 123456",
    "wardNumber": "1",
    "emergencyContactName": "Jane Doe",
    "emergencyContactNumber": "9876543211"
  }'

# Get profile
curl http://localhost:3000/api/profile \
  -H "user-id: test-user-123"

# Update profile
curl -X PUT http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -H "user-id: test-user-123" \
  -d '{
    "fullName": "John Updated",
    "mobileNumber": "9876543210",
    "email": "john.updated@example.com",
    "gender": "Male",
    "dateOfBirth": "1990-01-01",
    "address": "456 Updated Street, City, State, 123456",
    "wardNumber": "2",
    "emergencyContactName": "Jane Doe",
    "emergencyContactNumber": "9876543211"
  }'
```

## API Endpoints

### Profile Endpoints
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create new profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile
- `GET /api/profile/completion` - Get completion status
- `GET /api/profile/status` - Check profile status

### Image Endpoints
- `POST /api/profile/upload-image` - Upload profile image
- `DELETE /api/profile/delete-image` - Delete profile image

### Utility Endpoints
- `GET /health` - Server health check

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "userId": "test-user-123",
    "fullName": "John Doe",
    "email": "john@example.com",
    // ... other fields
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Full name is required",
    "Invalid email address"
  ]
}
```

## Frontend Integration

The frontend is already configured to work with the backend:

1. **API Service** (`src/services/profileService.js`):
   - All API calls use the configured base URL
   - Proper error handling for all responses
   - User-id header automatically added

2. **Custom Hook** (`src/hooks/useProfile.js`):
   - Fetches profile on component mount
   - Handles loading states
   - Manages form state
   - Provides create/update/delete functions

3. **Profile Page** (`src/pages/Profile.jsx`):
   - Displays loading spinner while fetching
   - Shows "Create Profile" state if no profile exists
   - Auto-enables edit mode for new users
   - All form inputs are properly controlled
   - React Hooks compliance maintained

## Troubleshooting

### MongoDB Connection Issues

**Error:** `querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net`

**Solutions:**
1. Check your internet connection
2. Verify the MongoDB Atlas connection string is correct
3. Ensure your IP is whitelisted in MongoDB Atlas
4. Check if MongoDB Atlas cluster is running
5. Verify username and password in connection string

### Server Won't Start

**Error:** `Server cannot start without MongoDB connection`

**Solutions:**
1. Verify `MONGODB_URI` is set in `server/.env`
2. Check for typos in the connection string
3. Ensure MongoDB Atlas cluster is accessible
4. Check firewall/antivirus settings

### Profile Not Loading

**Error:** `GET http://localhost:3000/api/profile 404`

**Solutions:**
1. Ensure backend server is running
2. Check browser console for CORS errors
3. Verify the `user-id` header is being sent
4. Check network tab in DevTools

## Production Deployment

### Environment Variables (Production)

```env
MONGODB_URI=mongodb+srv://<prod-username>:<prod-password>@<prod-cluster>/<prod-database>?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
JWT_SECRET=<strong-random-secret-key>
```

### Additional Production Steps

1. **Enable Authentication:**
   - Implement JWT middleware
   - Add user login/signup endpoints
   - Protect routes with authentication

2. **Cloud Storage:**
   - Replace local file storage with AWS S3 or Cloudinary
   - Update image upload endpoint

3. **Rate Limiting:**
   - Add express-rate-limit middleware
   - Prevent abuse of API endpoints

4. **Logging:**
   - Add Winston or similar for production logging
   - Log to file or logging service

5. **Monitoring:**
   - Add health check monitoring
   - Set up error tracking (Sentry, etc.)
   - Monitor MongoDB performance

## Verification Checklist

- [ ] MongoDB Atlas connection string configured in `server/.env`
- [ ] IP whitelisted in MongoDB Atlas
- [ ] Database user created with proper permissions
- [ ] Server starts without errors
- [ ] Health endpoint responds: `http://localhost:3000/health`
- [ ] Profile can be created via API
- [ ] Profile can be retrieved via API
- [ ] Profile can be updated via API
- [ ] Frontend loads without console errors
- [ ] Form inputs are editable
- [ ] Save button works
- [ ] Profile data persists after refresh
- [ ] No React Hook warnings
- [ ] No network errors in DevTools

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify MongoDB Atlas dashboard shows active connections
4. Check browser DevTools for frontend errors
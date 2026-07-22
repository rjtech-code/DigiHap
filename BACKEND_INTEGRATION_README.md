# User Profile Backend Integration

## Overview
The User Profile module has been fully integrated with a backend API. All profile data is now stored and retrieved from the server instead of localStorage.

## Architecture

### Frontend Structure
```
DigiHap/
├── src/
│   ├── services/
│   │   ├── api.js              # Base axios instance with interceptors
│   │   └── profileService.js   # Profile API service functions
│   ├── hooks/
│   │   └── useProfile.js       # Custom hook with backend integration
│   ├── pages/
│   │   └── Profile.jsx         # Profile page with Edit button in header
│   └── components/
│       └── ProfileForm.jsx     # Form component (buttons moved to page header)
├── .env                        # Environment variables
└── package.json
```

### Backend Structure
```
DigiHap/server/
├── server.js                   # Express server with all API endpoints
├── package.json
└── uploads/                    # Uploaded profile images (created automatically)
```

## Environment Variables

Create a `.env` file in the DigiHap root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_PROFILE_API=/profile
VITE_UPLOAD_API=/profile/upload-image
VITE_DELETE_IMAGE_API=/profile/delete-image
VITE_COMPLETION_API=/profile/completion

# User Authentication (to be implemented)
VITE_USER_ID=default
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Endpoints

1. **GET /profile** - Fetch user profile
   - Headers: `user-id: <user-id>`
   - Response: `{ success: true, data: {...}, message: "..." }`

2. **POST /profile** - Create new profile
   - Headers: `user-id: <user-id>`
   - Body: Profile data object
   - Response: `{ success: true, data: {...}, message: "..." }`

3. **PUT /profile** - Update existing profile
   - Headers: `user-id: <user-id>`
   - Body: Updated profile data
   - Response: `{ success: true, data: {...}, message: "..." }`

4. **DELETE /profile** - Delete user profile
   - Headers: `user-id: <user-id>`
   - Response: `{ success: true, message: "..." }`

5. **POST /profile/upload-image** - Upload profile image
   - Headers: `user-id: <user-id>`
   - Body: FormData with `profilePhoto` field
   - Response: `{ success: true, data: { url: "..." }, message: "..." }`

6. **DELETE /profile/delete-image** - Delete profile image
   - Headers: `user-id: <user-id>`
   - Response: `{ success: true, message: "..." }`

7. **GET /profile/completion** - Get profile completion status
   - Headers: `user-id: <user-id>`
   - Response: `{ success: true, data: { completionPercentage: 75, profile: {...} }, message: "..." }`

## Running the Application

### 1. Start the Backend Server

```bash
cd DigiHap/server
npm install
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Start the Frontend Development Server

```bash
cd DigiHap
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:5173/profile
```

## Features Implemented

### ✅ Backend Integration
- All profile data fetched from backend API
- Real-time updates reflected immediately
- No hardcoded data
- Proper error handling for all API calls

### ✅ Edit Profile Button
- **Location**: Top-right corner of the profile page header
- **Styling**: Green theme matching DigiHap branding
- **Behavior**: 
  - Shows "Edit Profile" button when not editing
  - Transforms to "Save Changes" and "Cancel" buttons in edit mode
  - Loading state during save operations

### ✅ Profile Loading
- Fetches profile data from backend on page load
- Displays loading spinner while fetching
- Handles empty state (no profile exists)
- Calculates and displays completion percentage

### ✅ Profile Update
- Validates all required fields before saving
- Sends only updated data to backend
- Shows loading state during save
- Displays success toast after update
- Refreshes profile data from backend after save

### ✅ Profile Image Upload
- Upload new profile picture
- Preview before upload
- Replace current picture
- Remove profile picture
- Validates file type (JPG, PNG, WEBP)
- Validates file size (max 5MB)

### ✅ Validation
- Full Name: Required, 3-100 characters, letters only
- Mobile Number: Required, 10 digits starting with 6-9
- Email: Required, valid email format
- Gender: Required
- Date of Birth: Required, not in future, reasonable age
- Address: Required, minimum 10 characters
- Ward Number: Required, 1-60
- Emergency Contact Name: Required, minimum 3 characters
- Emergency Contact Number: Required, 10 digits starting with 6-9
- Blood Group: Optional, must be valid blood group
- Image: Optional, JPG/PNG/WEBP, max 5MB

### ✅ Error Handling
- Network failures
- API timeouts
- Unauthorized access (401)
- Server errors (500)
- Invalid responses
- User-friendly error messages displayed
- No infinite loading loops

### ✅ Authentication Ready
- User ID passed in request headers
- Easy to integrate with authentication system
- No major refactoring needed for auth

## Service Layer

### api.js
Base axios instance with:
- Centralized configuration
- Request interceptor for user-id header
- Response interceptor for error handling
- User-friendly error messages

### profileService.js
All profile-related API functions:
- `getProfile()` - Fetch profile
- `createProfile(data)` - Create profile
- `updateProfile(data)` - Update profile
- `deleteProfile()` - Delete profile
- `uploadProfileImage(file)` - Upload image
- `deleteProfileImage()` - Delete image
- `getProfileCompletion()` - Get completion status
- `checkProfileStatus()` - Check if profile exists

## Custom Hook

### useProfile
Complete profile management hook with:
- `profile` - Current profile data
- `isLoading` - Loading state
- `isSaving` - Saving state
- `error` - Error message
- `success` - Success message
- `completionPercentage` - Profile completion %
- `createNewProfile(data)` - Create profile
- `updateUserProfile(data)` - Update profile
- `deleteUserProfile()` - Delete profile
- `uploadImage(file)` - Upload image
- `removeImage()` - Remove image
- `clearMessages()` - Clear error/success messages
- `refreshProfile()` - Refresh profile data

## UI Components

### Profile Page (Profile.jsx)
- Header with Edit Profile button (top-right)
- Success/error message display
- Left panel: Profile photo, completion ring, stats, quick info
- Right panel: Profile form
- Toast notifications

### Profile Form (ProfileForm.jsx)
- Personal Information section
- Contact Information section
- Emergency Information section
- Health Information section
- Notification Preferences section
- All fields properly validated
- Disabled state when not editing

### Image Uploader (ImageUploader.jsx)
- Drag and drop support
- Click to upload
- Preview before upload
- Remove image option
- File validation
- Error display

## Data Flow

### Creating a Profile
1. User fills out form
2. Clicks "Save Changes"
3. Frontend validates all fields
4. Sends POST request to backend
5. Backend creates profile and returns data
6. Frontend updates state with new profile
7. Displays success message
8. Exits edit mode

### Updating a Profile
1. User clicks "Edit Profile"
2. Form becomes editable
3. User makes changes
4. Clicks "Save Changes"
5. Frontend validates all fields
6. Sends PUT request to backend
7. Backend updates profile and returns updated data
8. Frontend refreshes profile data
9. Displays success message
10. Exits edit mode

### Uploading an Image
1. User selects image file
2. Frontend validates file (type, size)
3. Shows preview
4. User clicks "Save Changes"
5. Uploads image to backend via FormData
6. Backend stores image and returns URL
7. Frontend updates profile with image URL
8. Displays success message

## Error Handling

### Network Errors
- Displayed as user-friendly message
- No crash or blank screen
- Retry possible

### Validation Errors
- Displayed below each field
- Prevents form submission
- Clear error messages

### API Errors
- 400: Bad request - check input
- 401: Unauthorized - login required
- 404: Not found - resource doesn't exist
- 500: Server error - try again later
- Network: Check internet connection

## Production Considerations

### Before Deploying
1. Replace in-memory storage with database
2. Implement proper authentication (JWT tokens)
3. Add request rate limiting
4. Add request logging
5. Add input sanitization on backend
6. Configure CORS for production domain
7. Use environment variables for all configs
8. Add HTTPS
9. Add backup strategy
10. Add monitoring and logging

### Security
- Never expose sensitive data in logs
- Validate all input on backend
- Use HTTPS in production
- Implement proper authentication
- Sanitize file uploads
- Limit file size
- Restrict file types

## Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use the provided script
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess | Stop-Process -Force
```

### Profile Not Loading
- Check backend server is running
- Check browser console for errors
- Verify .env file exists and has correct values
- Check network tab in DevTools

### Image Upload Failing
- Check uploads folder exists in server directory
- Check file size (max 5MB)
- Check file type (JPG, PNG, WEBP only)
- Check backend logs for errors

## Testing

### Manual Testing Checklist
- [ ] Profile page loads without errors
- [ ] Loading spinner displays while fetching
- [ ] Edit Profile button visible in top-right
- [ ] Clicking Edit enables form fields
- [ ] Save Changes button shows loading state
- [ ] Success message displays after save
- [ ] Profile data refreshes after save
- [ ] Cancel button resets form
- [ ] Image upload works
- [ ] Image preview displays
- [ ] Validation errors display correctly
- [ ] Error messages display for invalid input
- [ ] Profile completion calculates correctly
- [ ] Delete profile works (if implemented)

## Support

For issues or questions, refer to the main project documentation or create an issue in the repository.
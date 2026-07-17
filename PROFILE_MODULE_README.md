# DigiHap User Profile Module

A complete, production-ready user profile management system for the DigiHap application with backend API integration, modern UI components, and comprehensive validation.

## Features

### Core Functionality
- **Complete Profile Management**: Create, read, update, and delete user profiles
- **Backend API Integration**: Modular service layer for all profile operations
- **Profile Completion Tracking**: Visual progress indicators with animated rings
- **Image Upload**: Drag-and-drop image upload with preview and validation
- **Form Validation**: Comprehensive validation for all fields
- **Responsive Design**: Mobile-first design with smooth animations

### UI Components
- **Profile Avatar**: Circular avatar with initials fallback
- **Completion Ring**: Animated circular progress indicator
- **Image Uploader**: Drag-and-drop image upload with preview
- **Profile Card**: Reusable card component for form sections
- **Notification Settings**: Toggle switches for notification preferences
- **Profile Form**: Complete form with all profile sections

### Profile Sections
1. **Personal Information**
   - Profile photo upload
   - Full name
   - Gender
   - Date of birth

2. **Contact Information**
   - Mobile number
   - Email address
   - Address
   - Ward number (1-60)

3. **Emergency Information**
   - Emergency contact name
   - Emergency contact number

4. **Health Information**
   - Blood group
   - Medical conditions (multi-select)
   - Preferred language

5. **Notification Preferences**
   - Heat alerts
   - Emergency notifications
   - Email notifications
   - SMS notifications

## Project Structure

```
DigiHap/
├── .env                          # Environment configuration
├── .gitignore                    # Git ignore file
├── src/
│   ├── components/
│   │   ├── ProfileAvatar.jsx           # Avatar component
│   │   ├── ProfileCompletionRing.jsx   # Progress ring component
│   │   ├── ImageUploader.jsx           # Image upload component
│   │   ├── ProfileCard.jsx             # Reusable card component
│   │   ├── NotificationSettings.jsx    # Notification toggles
│   │   └── ProfileForm.jsx             # Complete profile form
│   │
│   ├── pages/
│   │   └── Profile.jsx                 # Main profile page
│   │
│   ├── services/
│   │   ├── api.js                      # Axios configuration
│   │   ├── authService.js              # Authentication API
│   │   └── profileService.js           # Profile API operations
│   │
│   ├── hooks/
│   │   ├── useProfile.js               # Profile management hook
│   │   └── useAuth.js                  # Authentication hook
│   │
│   ├── context/
│   │   ├── ProfileContext.jsx          # Profile state management
│   │   └── AuthContext.jsx             # Auth state management
│   │
│   ├── utils/
│   │   ├── validators.js               # Form validation utilities
│   │   └── profileCompletion.js        # Completion calculator
│   │
│   ├── App.jsx                         # Main app with providers
│   ├── components/
│   │   └── Navbar.jsx                  # Updated navbar with avatar
│   └── index.css                       # Global styles
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_DATABASE_API=http://localhost:3000/api/database
   VITE_WEATHER_API_KEY=your_weather_api_key_here
   VITE_UPLOAD_API=http://localhost:3000/api/upload
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

   # Application Configuration
   VITE_APP_NAME=DigiHap
   VITE_APP_VERSION=1.0.0
   VITE_MAX_FILE_SIZE=5242880
   VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

   # Development Mode
   VITE_NODE_ENV=development
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

The profile service expects the following backend endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email

### Profile Operations
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create new profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile
- `POST /api/profile/upload-image` - Upload profile image
- `DELETE /api/profile/delete-image` - Delete profile image
- `GET /api/profile/completion` - Get completion status
- `PUT /api/profile/notifications` - Update notification preferences
- `GET /api/profile/emergency-contacts` - Get emergency contacts
- `PUT /api/profile/emergency-contacts` - Update emergency contacts
- `GET /api/profile/export` - Export profile data
- `GET /api/profile/status` - Check profile status

## Usage

### Using the Profile Hook

```jsx
import { useProfile } from '../hooks/useProfile';

const MyComponent = () => {
  const {
    profile,
    isLoading,
    isSaving,
    error,
    success,
    completionPercentage,
    fetchProfile,
    createNewProfile,
    updateUserProfile,
    deleteUserProfile,
    uploadImage,
    removeImage
  } = useProfile();

  // Use the hook methods and state
};
```

### Using the Auth Hook

```jsx
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  } = useAuth();

  // Use authentication methods
};
```

### Using Profile Components

```jsx
import ProfileAvatar from '../components/ProfileAvatar';
import ProfileCompletionRing from '../components/ProfileCompletionRing';
import ImageUploader from '../components/ImageUploader';

// Avatar
<ProfileAvatar 
  src={profilePhoto} 
  name={userName} 
  size="lg" 
/>

// Completion Ring
<ProfileCompletionRing 
  percentage={75} 
  size={120} 
  strokeWidth={6} 
/>

// Image Uploader
<ImageUploader
  currentImage={currentPhoto}
  onImageSelect={(file, preview) => handleUpload(file, preview)}
  onImageRemove={() => handleRemove()}
  disabled={!isEditing}
/>
```

## Profile Completion Logic

The profile completion percentage is calculated based on:

### Required Fields (50% total)
- Full Name
- Mobile Number
- Email Address
- Gender
- Date of Birth
- Address
- Ward Number
- Emergency Contact Name
- Emergency Contact Number

### Optional Fields (50% total)
- Profile Photo
- Blood Group
- Medical Conditions
- Preferred Language
- Heat Alerts Preference
- Emergency Notifications Preference

Each required field contributes ~5.56% and each optional field contributes ~8.33% to the total completion percentage.

## Validation

### Email Validation
- Required field
- Must be valid email format

### Mobile Number Validation
- Required field
- Must be 10 digits
- Must start with 6-9

### Required Fields
- Full Name (min 3 characters)
- Gender (Male/Female/Other)
- Date of Birth (not in future, max 120 years)
- Address (min 10 characters)
- Ward Number (1-60)
- Emergency Contact Name (min 3 characters)
- Emergency Contact Number (10 digits, starts with 6-9)

### Image Validation
- Supported formats: JPG, PNG, WEBP
- Maximum size: 5MB

## Design System

### Color Palette
- **Primary Green**: #2E7D32, #22c55e, #10b981
- **Secondary Brown/Sand**: #D6B98C
- **Background**: White, #f9fafb
- **Text**: Gray-900, Gray-700, Gray-500
- **Success**: Green-600
- **Error**: Red-600

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Headings: Bold, various sizes
- Body: Regular weight

### Spacing
- Cards: 16-24px border radius
- Padding: 6px (p-6) for cards
- Gap: 8px, 16px, 24px

### Animations
- Smooth transitions: 200-500ms
- Hover effects on interactive elements
- Fade-in animations for messages
- Progress ring animations

## State Management

### ProfileContext
Manages profile state across the application:
- `profile`: Current profile data
- `isLoading`: Loading state
- `saveProfile()`: Save new profile
- `updateProfile()`: Update existing profile
- `deleteProfile()`: Delete profile
- `calculateCompletion()`: Calculate completion percentage

### AuthContext
Manages authentication state:
- `user`: Current user data
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `login()`: Login user
- `register()`: Register user
- `logout()`: Logout user

## Features

### User Experience
- ✅ Auto-fill existing profile data
- ✅ Loading skeletons while fetching data
- ✅ Success and error toast notifications
- ✅ Disabled Save button during processing
- ✅ Confirmation before destructive actions
- ✅ Preserve unsaved changes warning
- ✅ Responsive mobile-first design

### Security
- ✅ Environment variables for API keys
- ✅ Token-based authentication
- ✅ Input sanitization
- ✅ XSS prevention
- ✅ Request/response interceptors

### Scalability
- ✅ Modular service layer
- ✅ Reusable components
- ✅ Custom hooks for logic
- ✅ Context for state management
- ✅ Utility functions for validation
- ✅ Easy to extend with new features

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Profile Fields

1. Update the form in `ProfileForm.jsx`
2. Add validation in `validators.js`
3. Update completion calculation in `profileCompletion.js`
4. Add to API service in `profileService.js`

### Customizing Validation

Edit `src/utils/validators.js` to add or modify validation rules.

### Styling

The project uses Tailwind CSS v4. Modify classes directly in components or extend the configuration in `vite.config.js`.

## Troubleshooting

### Profile not loading
- Check browser console for errors
- Verify API endpoint is correct in `.env`
- Ensure backend server is running

### Image upload failing
- Check file size (max 5MB)
- Verify file format (JPG, PNG, WEBP)
- Check upload API endpoint

### Validation errors
- Review validation rules in `validators.js`
- Check error messages in console
- Ensure all required fields are filled

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Profile photo cropping
- [ ] Social media integration
- [ ] Profile export to PDF
- [ ] Multi-language support
- [ ] Profile analytics
- [ ] Activity log
- [ ] Privacy settings

## License

Part of the DigiHap project.

## Support

For issues or questions, please contact the development team.
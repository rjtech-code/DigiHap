import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useSearchParams } from 'react-router-dom';
import ProfileAvatar from '../components/ProfileAvatar';
import ProfileCompletionRing from '../components/ProfileCompletionRing';
import ProfileForm from '../components/ProfileForm';
import { getCompletionMessage, getCompletionBreakdown } from '../utils/profileCompletion';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const [isEditing, setIsEditing] = useState(isEditMode);
  const fileInputRef = useRef(null);
  
  const { 
    profile, 
    isLoading, 
    isSaving, 
    error, 
    success, 
    completionPercentage,
    createNewProfile,
    updateUserProfile,
    deleteUserProfile,
    uploadImage,
    removeImage,
    clearMessages
  } = useProfile();

  const [formData, setFormData] = useState({
    profilePhoto: '',
    fullName: '',
    mobileNumber: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    wardNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    bloodGroup: '',
    medicalConditions: [],
    preferredLanguage: 'english',
    receiveHeatAlerts: true,
    receiveEmergencyNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
  });

  const [selectedConditions, setSelectedConditions] = useState([]);
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        profilePhoto: profile.profilePhoto || '',
        fullName: profile.fullName || '',
        mobileNumber: profile.mobileNumber || '',
        email: profile.email || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        address: profile.address || '',
        wardNumber: profile.wardNumber || '',
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactNumber: profile.emergencyContactNumber || '',
        bloodGroup: profile.bloodGroup || '',
        medicalConditions: profile.medicalConditions || [],
        preferredLanguage: profile.preferredLanguage || 'english',
        receiveHeatAlerts: profile.receiveHeatAlerts !== undefined ? profile.receiveHeatAlerts : true,
        receiveEmergencyNotifications: profile.receiveEmergencyNotifications !== undefined ? profile.receiveEmergencyNotifications : true,
        emailNotifications: profile.emailNotifications || false,
        smsNotifications: profile.smsNotifications || false,
      });
      setSelectedConditions(profile.medicalConditions || []);
      setHasUnsavedChanges(false);
    }
  }, [profile]);

  // Handle URL parameter for edit mode
  useEffect(() => {
    if (isEditMode && profile) {
      setIsEditing(true);
    }
  }, [isEditMode, profile]);

  // Warn about unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [hasUnsavedChanges]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    setHasUnsavedChanges(true);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleConditionToggle = (condition) => {
    setSelectedConditions(prev => {
      if (condition === 'None') {
        return prev.includes('None') ? [] : ['None'];
      }
      
      const filtered = prev.filter(c => c !== 'None');
      
      if (filtered.includes(condition)) {
        return filtered.filter(c => c !== condition);
      } else {
        return [...filtered, condition];
      }
    });
    setHasUnsavedChanges(true);

    if (errors.medicalConditions) {
      setErrors(prev => ({
        ...prev,
        medicalConditions: ''
      }));
    }
  };

  const handlePhotoUpload = (file, preview) => {
    if (file === null) {
      // Remove photo
      setFormData(prev => ({
        ...prev,
        profilePhoto: ''
      }));
    } else if (preview) {
      // Upload new photo
      setFormData(prev => ({
        ...prev,
        profilePhoto: preview
      }));
    }
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const profileData = {
      ...formData,
      medicalConditions: selectedConditions,
      updatedAt: new Date().toISOString()
    };

    let result;
    if (profile && profile.fullName) {
      result = updateUserProfile(profileData);
    } else {
      result = createNewProfile(profileData);
    }

    if (result.success) {
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setErrors({});
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        return;
      }
    }
    
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setErrors({});
    
    // Reset form to original profile data
    if (profile) {
      setFormData({
        profilePhoto: profile.profilePhoto || '',
        fullName: profile.fullName || '',
        mobileNumber: profile.mobileNumber || '',
        email: profile.email || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        address: profile.address || '',
        wardNumber: profile.wardNumber || '',
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactNumber: profile.emergencyContactNumber || '',
        bloodGroup: profile.bloodGroup || '',
        medicalConditions: profile.medicalConditions || [],
        preferredLanguage: profile.preferredLanguage || 'english',
        receiveHeatAlerts: profile.receiveHeatAlerts !== undefined ? profile.receiveHeatAlerts : true,
        receiveEmergencyNotifications: profile.receiveEmergencyNotifications !== undefined ? profile.receiveEmergencyNotifications : true,
        emailNotifications: profile.emailNotifications || false,
        smsNotifications: profile.smsNotifications || false,
      });
      setSelectedConditions(profile.medicalConditions || []);
    }
  };

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      deleteUserProfile();
      setFormData({
        profilePhoto: '',
        fullName: '',
        mobileNumber: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        wardNumber: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        bloodGroup: '',
        medicalConditions: [],
        preferredLanguage: 'english',
        receiveHeatAlerts: true,
        receiveEmergencyNotifications: true,
        emailNotifications: false,
        smsNotifications: false,
      });
      setSelectedConditions([]);
      setHasUnsavedChanges(false);
    }
  };

  const completionMessage = getCompletionMessage(completionPercentage);
  const completionBreakdown = getCompletionBreakdown(profile);

  // Show loading state only on initial load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fadeIn">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-green-900">Success!</p>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Profile Picture & Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex flex-col items-center">
                {/* Profile Photo with Completion Ring */}
                <div className="relative">
                  <ProfileCompletionRing percentage={completionPercentage} size={140} strokeWidth={6} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProfileAvatar 
                      src={formData.profilePhoto} 
                      name={formData.fullName} 
                      size="lg"
                    />
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {formData.fullName || 'Your Name'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.wardNumber ? `Ward ${formData.wardNumber}` : 'Ward Not Set'}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">
                      {completionPercentage}% Complete
                    </span>
                  </div>
                </div>

                {/* Completion Message */}
                {completionPercentage === 100 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm font-medium text-green-800">{completionMessage.message}</p>
                  </div>
                )}

                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Edit Photo
                  </button>
                )}
              </div>

              {/* Profile Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Required Fields</span>
                    <span className="text-sm font-medium text-gray-900">
                      {completionBreakdown.required.completed}/{completionBreakdown.required.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completionBreakdown.required.completed / completionBreakdown.required.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Optional Fields</span>
                    <span className="text-sm font-medium text-gray-900">
                      {completionBreakdown.optional.completed}/{completionBreakdown.optional.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completionBreakdown.optional.completed / completionBreakdown.optional.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              {profile && profile.fullName && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Information</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Registered Since</span>
                      <span className="font-medium text-gray-900">
                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Current Ward</span>
                      <span className="font-medium text-gray-900">
                        {profile.wardNumber ? `Ward ${profile.wardNumber}` : 'Not Set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Profile Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        completionPercentage === 100 
                          ? 'bg-green-100 text-green-700' 
                          : completionPercentage >= 50 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {completionPercentage === 100 ? 'Complete' : completionPercentage >= 50 ? 'In Progress' : 'Incomplete'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Heat Alerts</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profile.receiveHeatAlerts 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {profile.receiveHeatAlerts ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Profile Button */}
              {profile && profile.fullName && !isEditing && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleDeleteProfile}
                    className="w-full px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Delete Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Profile Form */}
          <div className="lg:col-span-2">
            <ProfileForm
              formData={formData}
              errors={errors}
              isEditing={isEditing}
              onChange={handleInputChange}
              onPhotoUpload={handlePhotoUpload}
              onConditionToggle={handleConditionToggle}
              selectedConditions={selectedConditions}
              onSave={handleSave}
              onCancel={handleCancel}
              onEdit={handleEdit}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn z-50">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Success!</p>
            <p className="text-sm text-green-100">{success}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
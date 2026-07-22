import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import ProfileCard from './ProfileCard';
import ImageUploader from './ImageUploader';
import NotificationSettings from './NotificationSettings';

/**
 * ProfileForm Component
 * Complete profile form with all sections
 * Note: Action buttons (Edit, Save, Cancel) are now in the Profile page header
 */
const ProfileForm = ({ 
  formData, 
  errors, 
  isEditing, 
  onChange, 
  onPhotoUpload, 
  onConditionToggle,
  selectedConditions,
  onSave,
  onCancel,
  onEdit,
  isSaving = false
}) => {
  const { t } = useLanguage();

  const medicalConditionOptions = [
    'Diabetes',
    'Heart Disease',
    'Asthma',
    'Hypertension',
    'Elderly (65+)',
    'Pregnant',
    'Respiratory Issues',
    'Kidney Disease',
    'None',
  ];

  const wardNumbers = Array.from({ length: 60 }, (_, i) => i + 1);

  const handleInputChange = (e) => {
    // Forward the event directly to parent handler
    onChange(e);
  };

  const handleNotificationChange = (key, value) => {
    // Create a synthetic event-like object for checkboxes
    onChange({ target: { name: key, value, type: 'checkbox' } });
  };

  // Map conditions to translation keys
  const getConditionLabel = (condition) => {
    const conditionMap = {
      'Diabetes': t('conditionDiabetes'),
      'Heart Disease': t('conditionHeartDisease'),
      'Asthma': t('conditionAsthma'),
      'Hypertension': t('conditionHypertension'),
      'Elderly (65+)': t('conditionElderly'),
      'Pregnant': t('conditionPregnant'),
      'Respiratory Issues': t('conditionRespiratory'),
      'Kidney Disease': t('conditionKidney'),
      'None': t('conditionNone'),
    };
    return conditionMap[condition] || condition;
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <ProfileCard 
        title={t('personalInformation')} 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      >
        <div className="space-y-4">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profilePhoto')}
            </label>
            <ImageUploader
              currentImage={formData.profilePhoto}
              onImageSelect={(file, preview) => onPhotoUpload(file, preview)}
              onImageRemove={() => onPhotoUpload(null, '')}
              disabled={!isEditing}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fullName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder={t('enterFullName')}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            />
            {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Gender and Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('gender')} <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${!isEditing ? 'bg-gray-50' : ''}`}
              >
                <option value="">{t('selectGender')}</option>
                <option value="Male">{t('male')}</option>
                <option value="Female">{t('female')}</option>
                <option value="Other">{t('other')}</option>
              </select>
              {errors.gender && <p className="text-red-600 text-xs mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dateOfBirth')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.dateOfBirth && <p className="text-red-600 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>
          </div>
        </div>
      </ProfileCard>

      {/* Contact Information */}
      <ProfileCard 
        title={t('contactInformation')} 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        }
      >
        <div className="space-y-4">
          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('mobileNumber')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder={t('enterMobileNumber')}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.mobileNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            />
            {errors.mobileNumber && <p className="text-red-600 text-xs mt-1">{errors.mobileNumber}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('emailAddress')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('enterEmail')}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('address')} <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder={t('enterAddress')}
              rows={3}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Ward Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('wardNumber')} <span className="text-red-500">*</span>
            </label>
            <select
              name="wardNumber"
              value={formData.wardNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.wardNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            >
              <option value="">{t('selectWard')}</option>
              {wardNumbers.map(n => (
                <option key={n} value={n}>{t('ward')} {n}</option>
              ))}
            </select>
            {errors.wardNumber && <p className="text-red-600 text-xs mt-1">{errors.wardNumber}</p>}
          </div>
        </div>
      </ProfileCard>

      {/* Emergency Information */}
      <ProfileCard 
        title={t('emergencyInformation')} 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      >
        <div className="space-y-4">
          {/* Emergency Contact Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('emergencyContactName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              placeholder={t('enterEmergencyName')}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.emergencyContactName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            />
            {errors.emergencyContactName && <p className="text-red-600 text-xs mt-1">{errors.emergencyContactName}</p>}
          </div>

          {/* Emergency Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('emergencyContactNumber')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={handleInputChange}
              placeholder={t('enterEmergencyNumber')}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.emergencyContactNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            />
            {errors.emergencyContactNumber && <p className="text-red-600 text-xs mt-1">{errors.emergencyContactNumber}</p>}
          </div>
        </div>
      </ProfileCard>

      {/* Health Information */}
      <ProfileCard 
        title={t('healthInformation')} 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        }
      >
        <div className="space-y-4">
          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('bloodGroup')}
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.bloodGroup ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            >
              <option value="">{t('selectBloodGroup')}</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.bloodGroup && <p className="text-red-600 text-xs mt-1">{errors.bloodGroup}</p>}
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('medicalConditions')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {medicalConditionOptions.map(condition => (
                <label
                  key={condition}
                  className={`
                    flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all
                    ${selectedConditions.includes(condition)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(condition)}
                    onChange={() => onConditionToggle(condition)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{getConditionLabel(condition)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('preferredLanguage')}
            </label>
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                !isEditing ? 'bg-gray-50' : 'border-gray-300'
              }`}
            >
              <option value="english">{t('languageEnglish')}</option>
              <option value="hindi">{t('languageHindi')}</option>
            </select>
          </div>
        </div>
      </ProfileCard>

      {/* Notification Preferences */}
      <ProfileCard 
        title={t('notificationPreferences')} 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        }
      >
        <NotificationSettings
          settings={{
            receiveHeatAlerts: formData.receiveHeatAlerts,
            receiveEmergencyNotifications: formData.receiveEmergencyNotifications,
            emailNotifications: formData.emailNotifications || false,
            smsNotifications: formData.smsNotifications || false
          }}
          onChange={(key, value) => handleNotificationChange(key, value)}
          disabled={!isEditing}
        />
      </ProfileCard>

    </div>
  );
};

export default ProfileForm;
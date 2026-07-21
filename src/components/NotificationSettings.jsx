import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

/**
 * NotificationSettings Component
 * Displays notification preference toggles
 */
const NotificationSettings = ({ 
  settings = {}, 
  onChange, 
  disabled = false,
  className = '' 
}) => {
  const { t } = useLanguage();

  const handleToggle = (key) => {
    if (!disabled && onChange) {
      onChange({ ...settings, [key]: !settings[key] });
    }
  };

  const notificationOptions = [
    {
      key: 'receiveHeatAlerts',
      label: t('heatAlertNotifications'),
      description: t('receiveHeatAlerts'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      key: 'receiveEmergencyNotifications',
      label: t('emergencyNotifications'),
      description: t('receiveEmergencyNotifs'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      key: 'emailNotifications',
      label: t('emailNotifications'),
      description: t('receiveEmailNotifs'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      key: 'smsNotifications',
      label: t('smsNotifications'),
      description: t('receiveSmsNotifs'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {notificationOptions.map((option) => (
        <div
          key={option.key}
          className={`
            flex items-start gap-4 p-4 rounded-lg border transition-all
            ${disabled ? 'bg-gray-50 opacity-60' : 'bg-gray-50 hover:bg-gray-100'}
            ${settings[option.key] ? 'border-green-200 bg-green-50' : 'border-gray-200'}
          `}
        >
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
            ${settings[option.key] ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}
          `}>
            {option.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                {option.label}
              </label>
              <button
                type="button"
                onClick={() => handleToggle(option.key)}
                disabled={disabled}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  ${settings[option.key] ? 'bg-green-600' : 'bg-gray-200'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                role="switch"
                aria-checked={settings[option.key]}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0
                    transition duration-200 ease-in-out
                    ${settings[option.key] ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSettings;
import React from 'react';

/**
 * ProfileCard Component
 * Reusable card component for profile sections
 */
const ProfileCard = ({ 
  title, 
  icon, 
  children, 
  className = '',
  badge,
  badgeColor = 'green'
}) => {
  const badgeColors = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
          </div>
          {badge && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default ProfileCard;
import React from 'react';

/**
 * ProfileAvatar Component
 * Displays user avatar with fallback to initials
 */
const ProfileAvatar = ({ 
  src, 
  name = 'User', 
  size = 'md', 
  className = '' 
}) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'Profile'}
          className="w-full h-full rounded-full object-cover border-2 border-green-500 shadow-md"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
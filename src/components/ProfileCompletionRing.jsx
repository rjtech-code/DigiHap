import React from 'react';

/**
 * ProfileCompletionRing Component
 * Displays a circular progress ring with profile completion percentage
 */
const ProfileCompletionRing = ({ 
  percentage = 0, 
  size = 120, 
  strokeWidth = 6,
  showPercentage = true,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isComplete = percentage === 100;

  const getColor = () => {
    if (isComplete) return '#10b981'; // green-500
    if (percentage >= 75) return '#22c55e'; // green-500
    if (percentage >= 50) return '#84cc16'; // lime-500
    if (percentage >= 25) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className={`font-bold ${size >= 100 ? 'text-2xl' : 'text-lg'} text-gray-900`}>
            {percentage}%
          </span>
        )}
      </div>

      {/* Checkmark badge for 100% completion */}
      {isComplete && (
        <div className={`absolute -top-1 -right-1 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
          size >= 100 ? 'w-8 h-8' : 'w-6 h-6'
        }`}>
          <svg className={`text-white ${size >= 100 ? 'w-5 h-5' : 'w-3 h-3'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionRing;
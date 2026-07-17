import React from 'react';

const Loader = ({ message = 'Loading weather data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loader;
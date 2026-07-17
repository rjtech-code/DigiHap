import React from 'react';
import { Link } from 'react-router-dom';
import HeatBadge from './HeatBadge';

const WardCard = ({ ward, weather }) => {
  if (!weather) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/ward/${ward.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-semibold text-gray-800 leading-tight">{ward.name}</h3>
          <HeatBadge temperature={weather.temperature} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{weather.temperature}°</span>
            <span className="text-sm text-gray-500">Celsius</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-medium">{weather.condition}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated: {new Date(weather.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WardCard;
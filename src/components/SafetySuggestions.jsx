import React from 'react';

const SafetySuggestions = ({ suggestions, title, icon, alertLevel }) => {
  const getAlertColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'extreme':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'extreme':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className={`rounded-xl border p-6 ${getAlertColor(alertLevel)}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm leading-relaxed">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SafetySuggestions;
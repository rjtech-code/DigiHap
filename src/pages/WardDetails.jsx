import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wards } from '../data/wards';
import { fetchWeather } from '../services/weatherApi';
import { getSafetySuggestions, getGeneralHeatTips } from '../data/safetySuggestions';
import { getHeatLevel } from '../utils/heatLevel';
import { useLanguage } from '../hooks/useLanguage';
import HeatBadge from '../components/HeatBadge';
import SafetySuggestions from '../components/SafetySuggestions';
import Loader from '../components/Loader';

const WardDetails = () => {
  const { id } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, translateWeatherCondition } = useLanguage();

  const ward = wards.find(w => w.id === parseInt(id));

  useEffect(() => {
    if (ward) {
      loadWeatherData();
    }
  }, [ward]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const weatherData = await fetchWeather(ward.latitude, ward.longitude);
      setWeather(weatherData);
    } catch (err) {
      setError(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  if (!ward) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-md mx-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('wardNotFound')}</h2>
          <p className="text-gray-600 mb-6">{t('wardNotFoundDesc')}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            {t('goBackHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loader message={t('loadingWeather')} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start gap-3 mb-4">
              <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('errorLoadingData')}</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadWeatherData}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('retry')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const safetyData = weather ? getSafetySuggestions(weather.temperature) : null;
  const generalTips = getGeneralHeatTips();
  const heatInfo = weather ? getHeatLevel(weather.temperature) : null;

  // Translate the safety data
  const translatedSafetyData = safetyData ? {
    title: t(safetyData.titleKey),
    icon: safetyData.icon,
    suggestions: safetyData.suggestionKeys.map(key => t(key)),
    alertLevel: safetyData.alertLevel
  } : null;

  const translatedGeneralTips = {
    title: t(generalTips.titleKey),
    icon: generalTips.icon,
    suggestions: generalTips.suggestionKeys.map(key => t(key)),
    alertLevel: 'low'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToAllWards')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{ward.name}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{t('currentWeather')}</h2>
              {weather?.isMockData && (
                <p className="text-xs text-amber-600 font-medium">{t('demoData')}</p>
              )}
            </div>
            {heatInfo && <HeatBadge temperature={weather.temperature} />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Temperature */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-5 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t('temperature')}</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{weather.temperature}°C</p>
              <p className="text-sm text-gray-600 mt-1">{t('feelsLike', { temp: weather.feelsLike })}</p>
            </div>

            {/* Condition */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t('condition')}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{translateWeatherCondition(weather.condition)}</p>
              <p className="text-sm text-gray-600 mt-1 capitalize">{weather.description}</p>
            </div>

            {/* Humidity */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-5 border border-cyan-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t('humidity')}</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{weather.humidity}%</p>
            </div>

            {/* Wind Speed */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t('windSpeed')}</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{weather.windSpeed}</p>
              <p className="text-sm text-gray-600 mt-1">{t('kmh')}</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('lastUpdated', { time: new Date(weather.lastUpdated).toLocaleString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              }) })}</span>
            </div>
          </div>
        </div>

        {/* Safety Suggestions */}
        {translatedSafetyData && (
          <div className="mb-6">
            <SafetySuggestions
              title={translatedSafetyData.title}
              icon={translatedSafetyData.icon}
              suggestions={translatedSafetyData.suggestions}
              alertLevel={translatedSafetyData.alertLevel}
            />
          </div>
        )}

        {/* General Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <SafetySuggestions
            title={translatedGeneralTips.title}
            icon={translatedGeneralTips.icon}
            suggestions={translatedGeneralTips.suggestions}
            alertLevel="low"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            {t('footerCopyright')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WardDetails;
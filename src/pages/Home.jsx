import React, { useState, useEffect } from 'react';
import { wards } from '../data/wards';
import { fetchWeather } from '../services/weatherApi';
import WardCard from '../components/WardCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promises = wards.map(async (ward) => {
        try {
          const weather = await fetchWeather(ward.latitude, ward.longitude);
          return { id: ward.id, weather };
        } catch (err) {
          console.error(`Error fetching weather for ward ${ward.id}:`, err);
          return { id: ward.id, weather: null };
        }
      });

      const results = await Promise.all(promises);
      
      const weatherMap = {};
      results.forEach(result => {
        weatherMap[result.id] = result.weather;
      });
      
      setWeatherData(weatherMap);
    } catch (err) {
      setError('Unable to load weather data. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredWards = wards.filter(ward =>
    ward.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome to DigiHap
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Stay informed about heat conditions across all 60 wards of Churu. 
            Get real-time temperature updates and personalized safety recommendations 
            to protect yourself and your family from extreme heat.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search wards by name..."
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-800 font-medium text-sm">Error Loading Data</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={loadWeatherData}
                  className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <Loader message="Loading weather data for all wards..." />}

        {/* Wards Grid */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredWards.length} of {wards.length} wards
            </div>
            
            {filteredWards.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No wards found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredWards.map(ward => (
                  <WardCard
                    key={ward.id}
                    ward={ward}
                    weather={weatherData[ward.id]}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2024 DigiHap - Heat Awareness Platform | Churu, Rajasthan
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
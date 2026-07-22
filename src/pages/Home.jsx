import React, { useState, useEffect, useRef } from 'react';
import { wards } from '../data/wards';
import { fetchAllWardsWeather } from '../services/weatherApi';
import { useLanguage } from '../hooks/useLanguage';
import WardCard from '../components/WardCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

// Lazy load NearbyMap
const NearbyMap = React.lazy(() => import('../components/NearbyMap'));

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [closingMobileMap, setClosingMobileMap] = useState(false);
  const { t } = useLanguage();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    loadWeatherData();
    // Component unmount hone par pending requests cancel kar do
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Load map lazily after initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMap(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadWeatherData = async () => {
    // Pichli koi request chal rahi ho to usse cancel karke nayi shuru karo
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      // Sabhi wards ka weather ek saath — lekin safe batches me — fetch hota hai
      const weatherMap = await fetchAllWardsWeather(wards, { signal: controller.signal });

      if (!controller.signal.aborted) {
        setWeatherData(weatherMap);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(t('errorLoadingData'));
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const filteredWards = wards.filter(ward =>
    ward.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenMobileMap = () => {
    setIsMobileMapOpen(true);
    setClosingMobileMap(false);
  };

  const handleCloseMobileMap = () => {
    setClosingMobileMap(true);
    setTimeout(() => {
      setIsMobileMapOpen(false);
      setClosingMobileMap(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Main Content - Sidebar layout on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Left sidebar - Map (desktop, sticky) */}
          <div className="hidden lg:block lg:w-[380px] xl:w-[420px] flex-shrink-0">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              {showMap ? (
                <React.Suspense fallback={
                  <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-gray-500 text-sm">{t('loadingMap')}</p>
                    </div>
                  </div>
                }>
                  <NearbyMap />
                </React.Suspense>
              ) : (
                <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">{t('loadingMap')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1 min-w-0">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t('welcomeToDigiHap')}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('welcomeDescription')}
              </p>
            </div>

            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('searchPlaceholder')}
            />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-red-800 font-medium text-sm">{t('errorLoadingData')}</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    <button
                      onClick={loadWeatherData}
                      className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('retry')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && <Loader message={t('loadingWeatherData')} />}

            {/* Wards Grid */}
            {!loading && !error && (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {t('showingWards', { count: filteredWards.length, total: wards.length })}
                </div>
                
                {filteredWards.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">{t('noWardsFound')}</p>
                    <p className="text-gray-400 text-sm mt-1">{t('noWardsFoundDescription')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            {t('footerCopyright')}
          </p>
        </div>
      </footer>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenMobileMap}
          className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl hover:scale-105 transition-all duration-200 animate-pulse-green"
          aria-label={t('openMap')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Mobile Map Bottom Sheet */}
      {isMobileMapOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/40 ${closingMobileMap ? 'opacity-0 transition-opacity duration-300' : ''}`}
            onClick={handleCloseMobileMap}
          />
          
          {/* Bottom Sheet */}
          <div className={`relative mt-auto h-[85vh] bg-white rounded-t-2xl shadow-2xl ${closingMobileMap ? 'animate-slideDown' : 'animate-slideUp'}`}>
            {showMap ? (
              <React.Suspense fallback={
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">{t('loadingMap')}</p>
                  </div>
                </div>
              }>
                <NearbyMap isMobileOpen={true} onCloseMobile={handleCloseMobileMap} />
              </React.Suspense>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">{t('loadingMap')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const CHURU_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28104.128043322035!2d74.94619818219174!3d28.297839291449492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39136200b18a66a3%3A0x3e487bf6934c8306!2sChuru%2C%20Rajasthan%20331001!5e0!3m2!1sen!2sin!4v1784623255073!5m2!1sen!2sin";

const NearbyMap = ({ isMobileOpen, onCloseMobile }) => {
  const { t } = useLanguage();

  if (isMobileOpen !== undefined) {
    // Mobile bottom sheet view
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{t('nearbyPlaces') || 'Nearby Places'}</h3>
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map iframe */}
        <div className="flex-1 relative">
          <iframe
            src={CHURU_EMBED_URL}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Churu Map"
          />
          {/* Map Key Overlay */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">🚻</span>
              <span className="text-gray-600">{t('publicToilet') || 'Toilet'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">🌳</span>
              <span className="text-gray-600">{t('publicPark') || 'Park'}</span>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            🛈 {t('searchOnMap') || 'Search for "public toilets" or "parks" on the map to find nearby places'}
          </p>
        </div>
      </div>
    );
  }

  // Desktop sidebar view
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Mini Info Bar */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">📍</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">{t('nearbyPlaces') || 'Nearby Places'}</p>
            <p className="text-xs text-gray-500">Churu, Rajasthan</p>
          </div>
        </div>
      </div>

      {/* Map iframe */}
      <div className="flex-1 relative min-h-[300px]">
        <iframe
          src={CHURU_EMBED_URL}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Churu Map"
        />
        {/* Map Key Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">🚻</span>
            <span className="text-gray-600">{t('publicToilet') || 'Toilet'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">🌳</span>
            <span className="text-gray-600">{t('publicPark') || 'Park'}</span>
          </div>
        </div>
      </div>

      {/* Quick Tips Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          💡 {t('mapEmbedHint') || 'Use the search bar on the map to find public toilets, parks, and other places in Churu'}
        </p>
      </div>
    </div>
  );
};

export default NearbyMap;
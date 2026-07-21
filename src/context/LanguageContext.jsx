import React, { createContext, useState, useEffect, useCallback } from 'react';
import en from '../translations/en';
import hi from '../translations/hi';

const translations = { en, hi };

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('digihap_language');
    return saved || 'en';
  });

  const [t, setT] = useState(() => translations[language] || en);

  useEffect(() => {
    localStorage.setItem('digihap_language', language);
    setT(translations[language] || en);
  }, [language]);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

  // Weather condition mapping
  const translateWeatherCondition = useCallback((condition) => {
    if (!condition) return condition;
    const conditionMap = {
      'Sunny': t.sunny,
      'Cloudy': t.cloudy,
      'Rain': t.rainy,
      'Rainy': t.rainy,
      'Partly Cloudy': t.partlyCloudy,
      'Clear': t.clear,
      'Overcast': t.overcast,
      'Hazy': t.hazy,
      'Hot': t.hot,
      'Very Hot': t.veryHot,
      'Thunderstorm': t.thunderstorm,
      'Windy': t.windy,
      'Foggy': t.foggy,
    };
    return conditionMap[condition] || condition;
  }, [t]);

  // Heat level translation
  const translateHeatLevel = useCallback((level) => {
    const heatMap = {
      'Normal': t.heatLevelNormal,
      'Moderate': t.heatLevelModerate,
      'High': t.heatLevelHigh,
      'Extreme': t.heatLevelExtreme,
    };
    return heatMap[level] || level;
  }, [t]);

  const translateHeatDescription = useCallback((level) => {
    const descMap = {
      'Normal': t.heatDescNormal,
      'Moderate': t.heatDescModerate,
      'High': t.heatDescHigh,
      'Extreme': t.heatDescExtreme,
    };
    return descMap[level] || level;
  }, [t]);

  // Format string with variables: t("Hello {name}", { name: "John" })
  const formatT = useCallback((key, variables = {}) => {
    let text = t[key];
    if (!text) {
      // Fallback to English
      text = en[key];
    }
    if (!text) return key;
    
    Object.entries(variables).forEach(([varKey, varValue]) => {
      text = text.replace(`{${varKey}}`, varValue);
    });
    return text;
  }, [t]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t: formatT,
    translateWeatherCondition,
    translateHeatLevel,
    translateHeatDescription,
    isHindi: language === 'hi',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
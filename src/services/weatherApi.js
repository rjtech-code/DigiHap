import axios from 'axios';

// OpenWeatherMap API configuration
// Note: In production, you would use your own API key
// For demo purposes, we'll use a free tier API key or mock data fallback
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Simple cache to reduce API requests
const weatherCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchWeather = async (latitude, longitude) => {
  const cacheKey = `${latitude},${longitude}`;
  
  // Check cache first
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: 'metric' // Get temperature in Celsius
      },
      timeout: 10000 // 10 second timeout
    });

    const weatherData = {
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      lastUpdated: new Date().toISOString()
    };

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    return weatherData;
  } catch (error) {
    // Silently fall back to mock data for demo purposes
    // In production, you would show an error message to the user
    return getMockWeatherData(latitude, longitude);
  }
};

// Mock weather data for demo/fallback purposes
const getMockWeatherData = (latitude, longitude) => {
  // Generate somewhat realistic mock data based on location
  const baseTemp = 38 + Math.random() * 10; // Base temperature between 38-48°C for Churu
  const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Clear'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    temperature: Math.round(baseTemp),
    feelsLike: Math.round(baseTemp + 2 + Math.random() * 3),
    humidity: Math.round(30 + Math.random() * 40), // 30-70% humidity
    windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
    condition: randomCondition,
    description: randomCondition.toLowerCase(),
    lastUpdated: new Date().toISOString(),
    isMockData: true
  };
};

export const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};
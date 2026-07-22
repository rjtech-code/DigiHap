import axios from 'axios';

// OpenWeatherMap API configuration
// Note: In production, you would use your own API key
// For demo purposes, we'll use a free tier API key or mock data fallback
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Simple cache to reduce API requests
const weatherCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// In-flight request tracker — same coordinates ke liye ek saath 2 calls
// aayein (e.g. Home grid + WardDetails page dono mount ho jayein) to
// dono ek hi promise share karenge, duplicate network call nahi hogi.
const inFlightRequests = new Map();

export const fetchWeather = async (latitude, longitude, { signal } = {}) => {
  const cacheKey = `${latitude},${longitude}`;

  // Check cache first
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  // Agar isi coordinate ke liye request already chal rahi hai, usi ko reuse karo
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const requestPromise = (async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: 'metric' // Get temperature in Celsius
        },
        timeout: 10000, // 10 second timeout
        signal
      });

      const weatherData = {
        temperature: Math.round(response.data.main.temp),
        feelsLike: Math.round(response.data.main.feels_like),
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        lastUpdated: new Date().toISOString(),
        isMockData: false
      };

      // Cache the result
      weatherCache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      if (axios.isCancel(error) || error.name === 'CanceledError') {
        throw error; // cancel ko upar hi propagate hone do, mock data mat do
      }
      // Silently fall back to mock data for demo purposes
      // (console me warning zaroor rehti hai taaki dev ko pata chale)
      console.warn(
        `Weather API fail hua (${latitude}, ${longitude}): ${error.message}. Mock data use ho raha hai.`
      );
      return getMockWeatherData(latitude, longitude);
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

/**
 * Sabhi wards ka weather ek saath fetch karta hai — lekin chunks me,
 * taaki free-tier rate limit (60 calls/min) cross na ho.
 *
 * @param {Array<{id:number, latitude:number, longitude:number}>} wardList
 * @param {object} options
 * @param {number} options.chunkSize kitne parallel calls ek batch me (default 10)
 * @param {AbortSignal} options.signal component unmount hone par cancel karne ke liye
 * @returns {Promise<Record<number, object>>} { [wardId]: weatherData }
 */
export const fetchAllWardsWeather = async (wardList, { chunkSize = 10, signal } = {}) => {
  const result = {};

  for (let i = 0; i < wardList.length; i += chunkSize) {
    if (signal?.aborted) break;

    const chunk = wardList.slice(i, i + chunkSize);

    const chunkResults = await Promise.all(
      chunk.map(async (ward) => {
        try {
          const weather = await fetchWeather(ward.latitude, ward.longitude, { signal });
          return { id: ward.id, weather };
        } catch (err) {
          if (axios.isCancel(err) || err.name === 'CanceledError') {
            return { id: ward.id, weather: null, cancelled: true };
          }
          return { id: ward.id, weather: null };
        }
      })
    );

    if (signal?.aborted) break;

    chunkResults.forEach(({ id, weather, cancelled }) => {
      if (!cancelled) result[id] = weather;
    });
  }

  return result;
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
import { GeocodingResult, WeatherData, WeatherType } from '../types';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export const searchLocation = async (query: string): Promise<GeocodingResult | null> => {
  try {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    return null;
  } catch (error) {
    console.error("Error searching location:", error);
    return null;
  }
};

export const getWeather = async (lat: number, lon: number, locationName: string): Promise<WeatherData | null> => {
  try {
    const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day,
        apparentTemperature: data.current.apparent_temperature,
      },
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
      },
      locationName: locationName,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

export const mapWeatherCodeToType = (code: number): WeatherType => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return WeatherType.Clear;
  if (code === 1 || code === 2 || code === 3) return WeatherType.Cloudy;
  if (code === 45 || code === 48) return WeatherType.Fog;
  if (code >= 51 && code <= 57) return WeatherType.Drizzle;
  if (code >= 61 && code <= 67) return WeatherType.Rain;
  if (code >= 71 && code <= 77) return WeatherType.Snow;
  if (code >= 80 && code <= 82) return WeatherType.Rain;
  if (code >= 85 && code <= 86) return WeatherType.Snow;
  if (code >= 95) return WeatherType.Thunderstorm;
  return WeatherType.Unknown;
};
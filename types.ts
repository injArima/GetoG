export interface WeatherData {
  current: {
    temperature: number;
    windSpeed: number;
    humidity: number;
    weatherCode: number;
    isDay: number;
    apparentTemperature: number;
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
  };
  locationName: string;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export enum WeatherType {
  Clear = 'Clear',
  Cloudy = 'Cloudy',
  Rain = 'Rain',
  Snow = 'Snow',
  Thunderstorm = 'Thunderstorm',
  Drizzle = 'Drizzle',
  Fog = 'Fog',
  Unknown = 'Unknown'
}
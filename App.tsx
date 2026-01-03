import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';
import BentoCard from './components/BentoCard';
import SearchBar from './components/SearchBar';
import { searchLocation, getWeather, mapWeatherCodeToType } from './services/weatherService';
import { WeatherData, WeatherType } from './types';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    handleSearch('New York');
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const location = await searchLocation(query);
      if (!location) {
        setError("Location not found. Please try another city.");
        setLoading(false);
        return;
      }

      const weatherData = await getWeather(location.latitude, location.longitude, location.name);
      if (weatherData) {
        setWeather(weatherData);
      } else {
        setError("Could not fetch weather data.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code: number, size = 24, className = "") => {
    const type = mapWeatherCodeToType(code);
    switch (type) {
      case WeatherType.Clear: return <Sun size={size} className={className} />;
      case WeatherType.Cloudy: return <Cloud size={size} className={className} />;
      case WeatherType.Rain:
      case WeatherType.Drizzle: return <CloudRain size={size} className={className} />;
      case WeatherType.Snow: return <CloudSnow size={size} className={className} />;
      case WeatherType.Thunderstorm: return <CloudLightning size={size} className={className} />;
      case WeatherType.Fog: return <Cloud size={size} className={className} />; // Using Cloud for fog simpler
      default: return <Sun size={size} className={className} />;
    }
  };

  const getWeatherDescription = (code: number): string => {
    const type = mapWeatherCodeToType(code);
    return type;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-brand-purple selection:text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto h-full min-h-screen flex flex-col p-6">
        {/* Header / Search */}
        <div className="mt-8 mb-8 space-y-6">
           <SearchBar onSearch={handleSearch} isLoading={loading} />
           
           {error && (
             <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm backdrop-blur-md animate-fade-in">
               {error}
             </div>
           )}
        </div>

        {weather ? (
          <div className="flex-1 flex flex-col gap-4 pb-8">
            {/* Main Location & Weather Header */}
            <div className="mb-4 animate-slide-up">
              <h1 className="text-5xl font-extrabold tracking-tighter leading-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent break-words">
                {weather.locationName}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-white/60 font-medium text-lg">
                <MapPin size={18} />
                <span>Current Location</span>
              </div>
            </div>

            {/* Top Row: Big Temperature & Condition */}
            <div className="grid grid-cols-2 gap-4">
              {/* Temperature Card (Red/Pink Gradient) */}
              <BentoCard className="bg-gradient-to-bl from-[#FF5F58] to-[#FF4667] text-white flex flex-col justify-between h-48 col-span-1 shadow-lg shadow-red-500/20" delay="0.1s">
                <div className="flex justify-between items-start">
                  <span className="font-semibold opacity-80">Temp</span>
                  <Thermometer size={20} className="opacity-80" />
                </div>
                <div>
                  <div className="text-6xl font-bold tracking-tighter">
                    {Math.round(weather.current.temperature)}°
                  </div>
                  <div className="text-sm font-medium opacity-80 mt-1">
                    Feels {Math.round(weather.current.apparentTemperature)}°
                  </div>
                </div>
              </BentoCard>

              {/* Condition Card (Glass/Dark) */}
              <BentoCard className="bg-white/10 backdrop-blur-xl border border-white/10 flex flex-col justify-between h-48 col-span-1" delay="0.2s">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-white/80">Now</span>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                     {weather.current.isDay ? 'Day' : 'Night'}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                   {getWeatherIcon(weather.current.weatherCode, 56, "text-brand-yellow drop-shadow-lg")}
                   <span className="text-lg font-bold text-center leading-tight">
                     {getWeatherDescription(weather.current.weatherCode)}
                   </span>
                </div>
              </BentoCard>
            </div>

            {/* Middle Row: Wind & Humidity */}
            <div className="grid grid-cols-2 gap-4">
              {/* Wind Card (Yellow) */}
              <BentoCard className="bg-[#FCD34D] text-brand-dark flex flex-col justify-between aspect-square shadow-lg shadow-yellow-500/20" delay="0.3s">
                 <div className="font-bold text-base opacity-70">Wind</div>
                 <div className="self-center">
                    <Wind size={48} strokeWidth={1.5} className="opacity-80" />
                 </div>
                 <div className="text-2xl font-bold tracking-tight">
                   {weather.current.windSpeed} <span className="text-sm font-normal opacity-70">km/h</span>
                 </div>
              </BentoCard>

              {/* Humidity Card (Purple) */}
              <BentoCard className="bg-[#A78BFA] text-white flex flex-col justify-between aspect-square shadow-lg shadow-purple-500/20" delay="0.4s">
                 <div className="font-bold text-base opacity-70">Humidity</div>
                 <div className="self-center">
                    <Droplets size={48} strokeWidth={1.5} className="opacity-80" />
                 </div>
                 <div className="text-2xl font-bold tracking-tight">
                   {weather.current.humidity} <span className="text-sm font-normal opacity-70">%</span>
                 </div>
              </BentoCard>
            </div>

            {/* Bottom Row: 3 Day Forecast List */}
            <BentoCard className="bg-white/5 backdrop-blur-md border border-white/5 flex flex-col gap-4 mt-2" delay="0.5s">
               <h3 className="font-semibold text-white/60 uppercase tracking-wider text-xs">3-Day Forecast</h3>
               <div className="flex flex-col gap-3">
                 {weather.daily.time.slice(0, 3).map((day, index) => (
                   <div key={day} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                     <div className="w-12 font-bold text-white/80">{index === 0 ? 'Today' : formatDate(day)}</div>
                     <div className="flex items-center gap-3 flex-1 justify-center">
                        {getWeatherIcon(weather.daily.weatherCode[index], 20, "text-white/90")}
                        <span className="text-sm text-white/60 font-medium">
                          {getWeatherDescription(weather.daily.weatherCode[index])}
                        </span>
                     </div>
                     <div className="flex gap-3 text-right font-medium">
                        <span className="text-white">{Math.round(weather.daily.temperatureMax[index])}°</span>
                        <span className="text-white/40">{Math.round(weather.daily.temperatureMin[index])}°</span>
                     </div>
                   </div>
                 ))}
               </div>
            </BentoCard>

          </div>
        ) : !loading && !error ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 animate-fade-in">
             <Cloud size={64} className="mb-4" />
             <p className="text-xl font-medium">Type a city to check the weather</p>
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default App;
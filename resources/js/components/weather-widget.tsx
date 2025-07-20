import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  AlertTriangle,
  Leaf,
  MapPin
} from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  uvIndex: number;
  pressure: number;
  visibility: number;
}

interface PlantHealthTip {
  type: 'warning' | 'info' | 'success';
  message: string;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [plantTips, setPlantTips] = useState<PlantHealthTip[]>([]);

  // Mock weather data - in real app, this would come from an API
  useEffect(() => {
    const mockWeather: WeatherData = {
      location: 'Your Farm Location',
      temperature: 24,
      humidity: 68,
      windSpeed: 12,
      description: 'Partly cloudy with light breeze',
      condition: 'cloudy',
      uvIndex: 6,
      pressure: 1013,
      visibility: 10
    };

    setTimeout(() => {
      setWeather(mockWeather);
      setLoading(false);
      generatePlantTips(mockWeather);
    }, 1000);
  }, []);

  const generatePlantTips = (weather: WeatherData) => {
    const tips: PlantHealthTip[] = [];

    if (weather.humidity > 70) {
      tips.push({
        type: 'warning',
        message: 'High humidity may promote fungal diseases. Ensure good air circulation.'
      });
    }

    if (weather.temperature > 30) {
      tips.push({
        type: 'warning',
        message: 'High temperatures detected. Consider providing shade and extra watering.'
      });
    }

    if (weather.windSpeed > 20) {
      tips.push({
        type: 'info',
        message: 'Strong winds may cause plant stress. Check for broken branches.'
      });
    }

    if (weather.condition === 'rainy') {
      tips.push({
        type: 'info',
        message: 'Rainy conditions are good for growth but watch for overwatering.'
      });
    }

    if (weather.uvIndex > 7) {
      tips.push({
        type: 'warning',
        message: 'High UV levels. Young plants may need protection from direct sunlight.'
      });
    }

    if (tips.length === 0) {
      tips.push({
        type: 'success',
        message: 'Weather conditions are ideal for plant growth!'
      });
    }

    setPlantTips(tips);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snowy': return <CloudSnow className="h-8 w-8 text-blue-200" />;
      case 'windy': return <Wind className="h-8 w-8 text-gray-500" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getTipIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'success': return <Leaf className="h-4 w-4 text-green-500" />;
      default: return <Eye className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTipColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-900 border-yellow-600 text-yellow-100';
      case 'info': return 'bg-blue-900 border-blue-600 text-blue-100';
      case 'success': return 'bg-green-900 border-green-600 text-green-100';
      default: return 'bg-gray-900 border-gray-600 text-gray-100';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 border-blue-700 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Weather Conditions
          </CardTitle>
          <p className="text-sm text-blue-200">{weather.location}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Weather Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className="text-3xl font-bold">{weather.temperature}°C</div>
                <div className="text-sm text-blue-200">{weather.description}</div>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-300" />
              <span className="text-sm">
                <span className="text-blue-200">Humidity:</span> {weather.humidity}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-blue-300" />
              <span className="text-sm">
                <span className="text-blue-200">Wind:</span> {weather.windSpeed} km/h
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-blue-300" />
              <span className="text-sm">
                <span className="text-blue-200">UV Index:</span> {weather.uvIndex}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-300" />
              <span className="text-sm">
                <span className="text-blue-200">Visibility:</span> {weather.visibility} km
              </span>
            </div>
          </div>

          {/* Plant Health Tips */}
          {plantTips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-200 flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Plant Care Tips
              </h4>
              {plantTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${getTipColor(tip.type)}`}
                >
                  <div className="flex items-start gap-2">
                    {getTipIcon(tip.type)}
                    <p className="text-xs leading-relaxed">{tip.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherWidget;
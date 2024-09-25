import { WeatherResponse } from "../interfaces/Weather";

const OPENWEATHER_API = import.meta.env.VITE_OPENWEATHER_API;
const OPENWEATHER_BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL;
const OPENWEATHER_GEO_URL = import.meta.env.VITE_OPENWEATHER_GEO_URL;

export const getCurrentWeather = async (city: string, units: string | null): Promise<any> => {
  const response = await fetch(`${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API}&units=${units}`);
  const data = await response.json();

  if (response.status !== 200) {
      throw new Error(data.message || 'Failed to fetch weather data');
  }
  return data;
};
export const getCurrentWeatherByCoordinates = async (lat: number | null, lon: number | null, units: string | null): Promise<any> => {
  const response = await fetch(`${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API}&units=${units}`);
  const data = await response.json();

  if (response.status !== 200) {
      throw new Error(data.message || 'Failed to fetch weather data');
  }
  return data;
};
export const fetchWeather = async (city: string | undefined, units: string | null): Promise<WeatherResponse> => {
    const response = await fetch(`${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API}&units=${units}`);
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    return response.json();
};
export const fetchWeatherByCoordinates = async (lat: number, lon: number, units: string | null): Promise<WeatherResponse> => {
  const url = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API}&units=${units}`;
  const response = await fetch(url);
  const data = await response.json();

  if (response.status !== 200) {
      throw new Error(data.message || 'Failed to fetch weather data');
  }

  return data;
};
export const getUserLocation = async (latitude: number, longitude: number): Promise<string> => {
  const response = await fetch(`${OPENWEATHER_GEO_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${OPENWEATHER_API}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch location data');
  }
  return data[0].name;
};
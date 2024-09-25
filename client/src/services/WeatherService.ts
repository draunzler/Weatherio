import { WeatherResponse } from "../interfaces/Weather";

const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL;

export const getCurrentWeather = async (city: string, units: string | null): Promise<any> => {
  const response = await fetch(`${BASE_URL}/weather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city, units }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch weather data');
  }
  return data.current;
};

export const fetchWeather = async (city: string | undefined, units: string | null): Promise<WeatherResponse> => {
  const response = await fetch(`${BASE_URL}/weather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city, units }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch weather data');
  }
  return data.forecast;
};

export const fetchWeatherByCoordinates = async (lat: number, lon: number, units: string | null): Promise<WeatherResponse> => {
  const response = await fetch(`${BASE_URL}/weather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lat, lon, units }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch weather data');
  }
  return data.forecast;
};

export const getUserLocation = async (latitude: number, longitude: number): Promise<string> => {
  const response = await fetch(`${BASE_URL}/geocode?lat=${latitude}&lon=${longitude}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch location data');
  }
  return data.city;
};
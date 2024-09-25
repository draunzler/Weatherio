import { makeAutoObservable } from "mobx";
import { fetchWeather, fetchWeatherByCoordinates } from "../services/WeatherService";
import { WeatherResponse, WeatherInfo } from "../interfaces/Weather";

class WeatherStore {
    weatherData: WeatherInfo[] = [];
    cityName: string | undefined = undefined;
    loading: boolean = false;
    error: string | null = null;
    units: 'metric' | 'imperial' | null = "metric";

    constructor() {
        makeAutoObservable(this);
    }

    async loadWeather(city: string | undefined, units: 'metric' | 'imperial' | null) {
        this.loading = true;
        this.error = null;
        this.cityName = city;
        this.units = units;

        try {
            const data: WeatherResponse = await fetchWeather(city, units);
            this.weatherData = data.list;
        } catch (error) {
            if (error instanceof Error) {
                this.error = error.message;
            } else {
                this.error = 'An unknown error occurred';
            }
        } finally {
            this.loading = false;
        }
    }

    async loadWeatherByCoordinates(lat: number, lon: number, units: 'metric' | 'imperial' | null) {
        this.loading = true;
        this.error = null;
        this.units = units;

        try {
            const data: WeatherResponse = await fetchWeatherByCoordinates(lat, lon, units);
            this.weatherData = data.list;
        } catch (error) {
            if (error instanceof Error) {
                this.error = error.message;
            } else {
                this.error = 'An unknown error occurred';
            }
        } finally {
            this.loading = false;
        }
    }
}

const weatherStore = new WeatherStore();
export default weatherStore;

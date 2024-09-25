import { makeAutoObservable } from "mobx";
import { fetchWeather, fetchWeatherByCoordinates } from "../services/WeatherService";
import { WeatherResponse, WeatherInfo } from "../interfaces/Weather";

class WeatherStore {
    weatherData: WeatherInfo[] = [];
    cityName: string | undefined = undefined;
    loadingCount: number = 0;
    loading: boolean = false;
    hasLoaded: boolean = false;
    error: string | null = null;
    units: 'metric' | 'imperial' | null = "metric";
    latitude: number | null = null;
    longitude: number | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    updateLoadingState() {
        this.loading = this.loadingCount > 0;
        if (!this.loading) {
            this.hasLoaded = true;
        }
    }

    incrementLoading() {
        this.loadingCount += 1;
        this.updateLoadingState();
    }

    decrementLoading() {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        this.updateLoadingState();
    }

    async loadWeather(city: string | undefined, units: 'metric' | 'imperial' | null) {
        this.cityName = city;
        this.units = units;
        this.error = null;
        this.incrementLoading();

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
            this.decrementLoading();
        }
    }

    async loadWeatherByCoordinates(lat: number, lon: number, units: 'metric' | 'imperial' | null) {
        this.units = units;
        this.error = null;
        this.incrementLoading();

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
            this.decrementLoading();
        }
    }
}

const weatherStore = new WeatherStore();
export default weatherStore;

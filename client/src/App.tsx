import React, { useEffect, useRef, useState } from "react";
import weatherStore from "./stores/WeatherStore";
import WeatherList from "./components/WeatherList";
import CurrentWeather from './components/CurrentWeather';
import Forecast from "./components/Forecast";
import WeatherChart from "./components/WeatherChart";
import "./App.css";
import { getUserLocation } from "./services/WeatherService";
import { observer } from "mobx-react-lite";

const App: React.FC = observer(() => {
    const [useLocation, setUseLocation] = useState<boolean>(true);
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [city, setCity] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleTabChange = (newUnits: 'metric' | 'imperial') => {
        setUnits(newUnits);
    };

    const fetchUserLocation = async (latitude: number, longitude: number) => {
        try {
            const fetchedCity = await getUserLocation(latitude, longitude);
            if (fetchedCity) {
                setCity(fetchedCity);
            } else {
                console.error("Location not found");
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [units, useLocation]);

    const fetchWeather = () => {
        if (useLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchUserLocation(latitude, longitude);
                    weatherStore.loadWeatherByCoordinates(latitude, longitude, units);
                },
                (error) => {
                    console.error("Error fetching location:", error.message);
                    weatherStore.loadWeather("Kolkata", units);
                }
            );
        } else {
            const cityName = inputRef.current?.value;
            if (cityName) {
                setCity(cityName);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setUseLocation(false);
            const cityName = inputRef.current?.value;
            if (cityName) {
                setCity(cityName);
            }
        }
    };

    useEffect(() => {
        if (city) {
            weatherStore.loadWeather(city, units);
        }
    }, [city, units]);

    return (
        <>
            <div className="App">
                <header>
                    <h1>Weatherio</h1>
                    <div className="container">
                        <input
                            type="text"
                            ref={inputRef}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter city name"
                        />
                        <div className="tabs">
                            <input
                                type="radio"
                                id="metric-radio"
                                name="unit"
                                onChange={() => handleTabChange('metric')}
                                checked={units === 'metric'}
                            />
                            <label htmlFor="metric-radio" className="tab">
                                °C, m/s
                            </label>
                            <input
                                type="radio"
                                id="imperial-radio"
                                name="unit"
                                onChange={() => handleTabChange('imperial')}
                                checked={units === 'imperial'}
                            />
                            <label htmlFor="imperial-radio" className="tab">
                                °F, mph
                            </label>
                            <div className="glider"></div>
                        </div>
                    </div>
                </header>
                <CurrentWeather city={city} />
                <WeatherList />
                <div className="metrics">
                    <WeatherChart />
                    <Forecast />
                </div>
            </div>
        </>
    );
});

export default App;

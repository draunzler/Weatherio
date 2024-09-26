import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../services/WeatherService';
import weatherStore from '../stores/WeatherStore';
import styles from "../styles/currentWeather.module.scss";
// import Loader from "./Loader";
import { observer } from 'mobx-react-lite';
import { WeatherData } from '../interfaces/WeatherData';
import { CurrentWeatherProps } from '../interfaces/CurrentWeatherProps';
import moment from 'moment-timezone';

const CurrentWeather: React.FC<CurrentWeatherProps> = observer(({ city }) => {
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { hasLoaded } = weatherStore;

    useEffect(() => {
        const fetchCurrentWeather = async () => {
            setLoading(true);
            try {
                const weatherData = await getCurrentWeather(city, weatherStore.units);
                setCurrentWeather(weatherData);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch weather data');
            } finally {
                setLoading(false);
            }
        };

        if (city) {
            fetchCurrentWeather();
        }
    }, [city, weatherStore.units]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!currentWeather) {
        return (
            <div className={styles.skeletonLoader}>
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
            </div>
        )
    }

    const { temp, feels_like, humidity } = currentWeather.main;
    const { description, icon } = currentWeather.weather[0];
    const { speed } = currentWeather.wind;

    const timezoneOffset = currentWeather.timezone;
    const timezoneString = `Etc/GMT${timezoneOffset >= 0 ? '-' : '+'}${Math.abs(timezoneOffset / 3600)}`;
    
    // Using moment-timezone to get city time
    const cityTime = moment().tz(timezoneString).format('HH:mm');
    // const cityDate = moment().tz(timezoneString).format('dddd, DD MMM \'YY');

    return (
        <>
            {loading && !hasLoaded ? (
                <div className={styles.skeletonLoader}>
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                </div>
            ) : (
                <div className={styles.currentWeather}>
                    <div className={styles.description}>
                        <img
                            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                            alt={description}
                        />
                        <p>{description}</p>
                    </div>
                    <h1>{Math.round(temp)}{weatherStore.units === "metric" ? "°C" : "°F"}</h1>
                    <div>
                        <h2>{currentWeather.name}</h2>
                        <p>Feels Like: {Math.round(feels_like)}{weatherStore.units === "metric" ? "°C" : "°F"}</p>
                        <p>Time: {cityTime}</p>
                    </div>
                    <div className={styles.description}>
                        <h1>{humidity}%</h1>
                        <h3>Humidity</h3>
                    </div>
                    {window.innerWidth > 1000 && (
                        <div className={styles.description}>
                            <h1>{speed} <span style={{ fontSize: "1rem" }}>{weatherStore.units === "metric" ? "m/s" : "mph"}</span></h1>
                            <h3>Wind Speed</h3>
                        </div>
                    )}
                    {/* <div className={styles.cityTime}>
                        <h3>Time: {cityTime}</h3>
                        <h3>Date: {cityDate}</h3>
                    </div> */}
                </div>
            )}
        </>
        
    );
});

export default CurrentWeather;

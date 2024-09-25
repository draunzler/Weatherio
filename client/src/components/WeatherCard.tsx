import React from "react";
import styles from "../styles/weatherCard.module.scss";
import weatherStore from "../stores/WeatherStore";
import { WeatherCardProps } from "../interfaces/WeatherCardProps";

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
    return (
        <div className={styles.weatherCard}>
            <p>{new Date(weather.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
            <p>
                <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                />
            </p>
            <h3>{Math.round(weather.main.temp)} {weatherStore.units === 'metric' ? "°C" : "°F"}</h3>
            {/* <p>Wind Speed: {weather.wind.speed} m/s</p> */}
        </div>
    );
};
export default WeatherCard;
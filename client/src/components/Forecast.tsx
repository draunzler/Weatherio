import React from "react";
import { WeatherInfo } from "../interfaces/Weather";
import styles from "../styles/forecast.module.scss";
import weatherStore from "../stores/WeatherStore";
import { observer } from "mobx-react-lite";

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'short',
        day: '2-digit'
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    const [weekday, month, day] = formattedDate.split(' ');
    return `${weekday.slice(0, 3)}, ${day} ${month}`;
};

const aggregateForecastData = (data: WeatherInfo[]) => {
    const dailyData: { [key: string]: { temps: number[], humidities: number[], icons: string[] } } = {};

    data.forEach(entry => {
        const dateKey = new Date(entry.dt * 1000).toISOString().split('T')[0];
        if (!dailyData[dateKey]) {
            dailyData[dateKey] = { temps: [], humidities: [], icons: [] };
        }
        dailyData[dateKey].temps.push(entry.main.temp);
        dailyData[dateKey].humidities.push(entry.main.humidity); // Collect humidity
        dailyData[dateKey].icons.push(entry.weather[0].icon);
    });

    return Object.entries(dailyData).map(([date, { temps, humidities, icons }]) => ({
        date: date,
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length), // Average humidity
        icon: icons[0],
    }));
};

const Forecast: React.FC = observer(() => {
    const {weatherData, units, loading, error} = weatherStore;

    const aggregatedData = aggregateForecastData(weatherData);
    const fiveDayForecast = aggregatedData.slice(0, 5).map(forecast => ({
        date: formatDate(new Date(forecast.date).getTime() / 1000),
        minTemp: Math.round(forecast.minTemp),
        maxTemp: Math.round(forecast.maxTemp),
        humidity: forecast.humidity,
        icon: forecast.icon,
    }));

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={styles.forecast}>
            <h2 style={{marginLeft: "1rem"}}>Forecast</h2>
            {loading ? (
                <div className={styles.skeletonLoader}>
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
                <div className={styles.skeletonItem} />
            </div>
            ) : (
                <div className={styles.forecastList}>
                    {fiveDayForecast.map((forecast, index) => (
                        <div className={styles.forecastCard} key={index}>
                            <p>{forecast.date}</p>
                            <p>
                                <img style={{height: "5rem"}}
                                    src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                                    alt="Weather icon"
                                />
                            </p>
                            <p style={{ display: "flex", alignItems: "flex-end" }}>
                                <h2>{forecast.maxTemp}° {units === 'metric' ? 'C' : 'F'}</h2> / 
                                {forecast.minTemp}° {units === 'metric' ? 'C' : 'F'}
                            </p>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.5}}>
                                <img style={{height: "1rem"}} src="/humidity.svg" alt="Humidity" />
                                <p>{forecast.humidity}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default Forecast;

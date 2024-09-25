import React from "react";
import { observer } from "mobx-react-lite";
import WeatherCard from "./WeatherCard";
import weatherStore from "../stores/WeatherStore";
import styles from "../styles/weatherList.module.scss";

const WeatherList: React.FC = observer(() => {
    const { weatherData, loading, error } = weatherStore;

    if (error) return <p>{error}</p>;

    return (
        <>
            {loading ? (
                <div className={styles.skeletonLoader}>
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                    <div className={styles.skeletonItem} />
                </div>
            ) : (
                <div className={styles.weatherList}>
                    {weatherData.map((weather) => (
                        <WeatherCard key={weather.dt} weather={weather} />
                    ))}
                </div>
            )}
        </>
    );
});

export default WeatherList;

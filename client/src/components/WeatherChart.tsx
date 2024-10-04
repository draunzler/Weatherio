import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import styles from "../styles/weatherChart.module.scss";
import weatherStore from "../stores/WeatherStore";
import { observer } from "mobx-react-lite";

const WeatherChart: React.FC = observer(() => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [activeChart, setActiveChart] = useState<'temperature' | 'precipitation' | 'humidity'>('temperature');
    const { weatherData, units } = weatherStore;

    useEffect(() => {
        if (chartRef.current) {
            const chartInstance = echarts.init(chartRef.current);
            
            const labels = weatherData.map(data => data.dt * 1000);
    
            let seriesData: number[];
    
            switch (activeChart) {
                case 'temperature':
                    seriesData = weatherData.map(data => Math.round(data.main.temp));
                    break;
                case 'precipitation':
                    seriesData = weatherData.map(data => Math.round(data.pop * 100));
                    break;
                case 'humidity':
                    seriesData = weatherData.map(data => data.main.humidity);
                    break;
                default:
                    seriesData = [];
            }
    
            const option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: (params: { data: any; seriesName: any; name: string }[]) => {
                        const tooltipContent = params.map((param: { data: any; seriesName: any; name: string }) => {
                            const value = param.data;
                            const unit = activeChart === 'temperature' 
                                ? (units === 'metric' ? '°C' : '°F') 
                                : '%';
                            return `${param.name}: ${value} ${unit}`;
                        }).join('<br />');
                        return tooltipContent;
                    },
                },
                xAxis: {
                    type: 'category',
                    data: labels.map(label => new Date(label).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })),
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: (value: number) => {
                            return activeChart === 'temperature' 
                                ? `${value} ${units === 'metric' ? '°C' : '°F'}` 
                                : `${value} %`;
                        },
                    },
                },
                series: [{
                    data: seriesData,
                    type: activeChart === 'precipitation' ? 'bar' : 'line',
                    smooth: true,
                    itemStyle: {
                        color: '#185ee0',
                    },
                    symbolSize: 8,
                    showSymbol: false,
                    emphasis: {
                        showSymbol: true,
                    },
                    barCategoryGap: '1%',
                    barGap: '1%',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#a0c8ff'
                        },
                        {
                            offset: 1,
                            color: '#ffffff80'
                        }])
                    }
                }],
            };
    
            chartInstance.setOption(option);
            return () => {
                chartInstance.dispose();
            };
        }
    }, [weatherData, activeChart, units]);

    const handleChartChange = (chart: 'temperature' | 'precipitation' | 'humidity') => {
        setActiveChart(chart);
    };

    return (
        <div className={styles.weatherChart}>
            <div className={styles.chartHeader}>
                <h2>Overview <span style={{opacity: 0.5, fontSize: "1rem", fontWeight: 400}}>for the next <b>5</b> days</span></h2>
                <div className={styles.tabs}>
                    <input
                        type="radio"
                        id="temperature-radio"
                        name="chart"
                        onChange={() => handleChartChange('temperature')}
                        checked={activeChart === 'temperature'}
                    />
                    <label htmlFor="temperature-radio" className={styles.tab}>
                        Temperature
                    </label>

                    <input
                        type="radio"
                        id="precipitation-radio"
                        name="chart"
                        onChange={() => handleChartChange('precipitation')}
                        checked={activeChart === 'precipitation'}
                    />
                    <label htmlFor="precipitation-radio" className={styles.tab}>
                        Precipitation
                    </label>

                    <input
                        type="radio"
                        id="humidity-radio"
                        name="chart"
                        onChange={() => handleChartChange('humidity')}
                        checked={activeChart === 'humidity'}
                    />
                    <label htmlFor="humidity-radio" className={styles.tab}>
                        Humidity
                    </label>

                    <div className={styles.glider}></div>
                </div>
            </div>
            <div ref={chartRef} style={{ width: '115%', height: '25rem', alignSelf:"center" }}></div>
        </div>
    );
});

export default WeatherChart;

export interface WeatherInfo {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
        deg: number;
    };
    pop: number;
    dt_txt: string;
}

export interface City {
    id: number;
    name: string;
    country: string;
}

export interface WeatherResponse {
    cod: string;
    message: number;
    list: WeatherInfo[];
    city: City;
}

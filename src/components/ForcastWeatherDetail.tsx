import React from 'react'
import Container from './Container'
import WeatherIcon from './WeatherIcon'
import WeatherDetails, { WeatherDetailProps } from './WeatherDetails'
import convertKelvinToCelsius from '@/utils/convertKelvinToCelcius';

export interface ForcastWeatherDetailProps extends WeatherDetailProps {
    weatherIcon: string;
    date: string;
    day: string;
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    description: string;
}
export default function ForcastWeatherDetail(props: ForcastWeatherDetailProps) {
    const {
        weatherIcon = "02d",
        date = "19.09",
        day = "Sunday",
        temp = 298.15,
        feels_like = 303.15,
        temp_min = 297.15,
        temp_max = 298.15,
        description = "Cloudy"
    } = props;

    return (
        <Container className="gap-4">
            {/* Left */}
            <section className="flex items-center gap-4 px-4">
                <div className="flex flex-col gap-1 items-center">
                    <WeatherIcon iconName={weatherIcon} iconDescription={description} />
                    <p>{date}</p>
                    <p className="text-sm">{ day }</p>
                </div>
                <div className="flex flex-col px-4">
                    <span className="text-5xl font-bold">{convertKelvinToCelsius(temp ?? 298.15)}°C</span>
                    <p className="text-xs text-gray-500 space-x-1 whitespace-nowrap">
                        <span>Feels like</span> 
                        <span>{convertKelvinToCelsius(feels_like ?? 298.15)}°C</span>
                    </p>
                    <p className="text-gray-600 capitalize">{description}</p>
                    {/* <p className="capitalized text-sm text-gray-400">Min: {convertKelvinToCelsius(temp_min ?? 298.15)}°C / Max: {convertKelvinToCelsius(temp_max ?? 298.15)}°C</p> */}
                </div>
            </section>
            {/* Right */}
            <section className="overflow-x-auto flex justify-between gap-4 w-full px-4 pr-10">
                <WeatherDetails {...props} />
            </section>
        </Container>
    )
}


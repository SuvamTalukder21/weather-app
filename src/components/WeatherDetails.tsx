import React from 'react'
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";

export interface WeatherDetailProps {
    visability: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
    const {
        visability = "10km",
        humidity = "60%",
        windSpeed = "12.5 km/h",
        airPressure = "1014 hPa",
        sunrise = "05:45 AM",
        sunset = "05:15 PM",
    } = props;

    return (
        <>
            <SingleWeatherDetail icon={ <LuEye /> } description="Visability" value={visability} />
            <SingleWeatherDetail icon={ <FiDroplet /> } description="Humidity" value={humidity} />
            <SingleWeatherDetail icon={ <MdAir /> } description="Wind speed" value={windSpeed} />
            <SingleWeatherDetail icon={ <ImMeter /> } description="Air Pressure" value={airPressure} />
            <SingleWeatherDetail icon={ <LuSunrise /> } description="Sunrise" value={sunrise} />
            <SingleWeatherDetail icon={ <LuSunset /> } description="Sunset" value={sunset} />
        </>
    )
}

export interface SingleWeatherDetailProps {
    icon: React.ReactNode;
    description: string;
    value: string;
}

function SingleWeatherDetail (props: SingleWeatherDetailProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-2 text-xs font-semibold text-black/80">
            <p className="whitespace-nowrap">{props.description}</p>
            <div className="text-3xl">{props.icon}</div>
            <p>{props.value}</p>
        </div>
    );
}
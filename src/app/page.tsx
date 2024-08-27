"use client"

import axios from "axios";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { format } from "date-fns/fp";
import { fromUnixTime, parseISO } from "date-fns";

import Container from "@/components/Container";
import ForcastWeatherDetail from "@/components/ForcastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import convertKelvinToCelsius from "@/utils/convertKelvinToCelcius";
import { convertMetersToKilometers } from "@/utils/convertMetersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { useQuery } from "@tanstack/react-query";
import { loadingCityState, placeHolder } from "./atom";

interface Main {
	temp: number;
	feels_like: number;
	temp_min: number;
	temp_max: number;
	pressure: number;
	sea_level: number;
	grnd_level: number;
	humidity: number;
	temp_kf: number;
}
  
interface Weather {
	id: number;
	main: string;
	description: string;
	icon: string;
}

interface Clouds {
	all: number;
}

interface Wind {
	speed: number;
	deg: number;
	gust: number;
}

interface Rain {
	'3h': number;
}

interface Sys {
	pod: string;
}

interface ListElement {
	dt: number;
	main: Main;
	weather: Weather[];
	clouds: Clouds;
	wind: Wind;
	visibility: number;
	pop: number;
	rain: Rain;
	sys: Sys;
	dt_txt: string;
}

interface City {
	id: number;
	name: string;
	coord: {
		lat: number;
		lon: number;
	};
	country: string;
	population: number;
	timezone: number;
	sunrise: number;
	sunset: number;
}

interface WeatherData {
	cod: string;
	message: number;
	cnt: number;
	list: ListElement[];
	city: City;
}

// let place = "kolkata";
const WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast?";

export default function Home() {
	const [place, setPlace] = useAtom(placeHolder);
	const [loadingState, setLoadingState] = useAtom(loadingCityState);

	const { isPending, error, data, refetch } = useQuery<WeatherData>({
		queryKey: [`weather-data-for-${place}`],
		queryFn: async () => {
			const { data } = await axios.get(`${WEATHER_API_ENDPOINT}q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`);
			return data;
  		}
	});

	useEffect(() =>{
		refetch();
	}, [place, refetch]);
	
	const firstData = data?.list[0];
	console.log("data", data);

	const uniqueDates = data?.list.map(
		(entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
	).filter((date, index, self) => self.indexOf(date) === index);

	// Filtering data to get the first entry after 6 AM for each unique date
	const firstDataForEachDate = uniqueDates?.map((date) => {
		return data?.list.find((entry) => {
			const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
			const entryTime = new Date(entry.dt * 1000).getHours();
			return entryDate === date && entryTime >= 6;
		});
	});

	console.log(uniqueDates);
	console.log(firstDataForEachDate);
	

	if (isPending) return (
		<div className="flex items-center justify-center min-h-screen">
			<p className="animate-bounce">Loading...</p>
		</div>
	);

	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
			<Navbar location={data?.city.name} />
			<main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
				{loadingState ? <WeatherSkeleton /> : (
					<>
						{/* Current day data */}
						<section className="space-y-4">
							<div className="space-y-2">
								<h2 className="flex gap-1 text-2xl items-end">
									<p>{ format("EEEE", parseISO(firstData?.dt_txt ?? "")) }</p>
									<p className="text-lg">({ format("dd.MM.yyyy", parseISO(firstData?.dt_txt ?? "")) })</p>
								</h2>
								<Container className="gap-10 px-6 items-center">
									{/* Temperature */}
									<div className="flex flex-col px-4">
										<span className="text-5xl">
											{convertKelvinToCelsius(firstData?.main.temp ?? 273.15)}°
										</span>

										<p className="text-xs space-x-1 whitespace-nowrap">
											<span>Feels like</span>
											<span>
												{ convertKelvinToCelsius(firstData?.main.feels_like ?? 273.15) }°
											</span>
										</p>

										<p className="text-xs space-x-2">
											<span>
												{ convertKelvinToCelsius(firstData?.main.temp_min ?? 0) }
												°↓{" "}
											</span>
											<span>
												{" "}
												{ convertKelvinToCelsius(firstData?.main.temp_max?? 373.15) }
												°↑
											</span>
										</p>
									</div>
									{/* Time and Weather icon */}
									<div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
										{data?.list.map((d, i) => (
											<div key={i} className="flex flex-col gap-2 items-center justify-between text-xs font-semibold">
												<p className="whitespace-nowrap">
													{format("hh:mm a", parseISO(d.dt_txt?? ""))}
												</p>
												
												<WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} iconDescription={d.weather[0].description} />
												<p className="whitespace-nowrap">
													{convertKelvinToCelsius(d.main.temp?? 273.15)}°C
													{/* {" "}|{" "}
													{d.weather[0].description} */}
												</p>
											</div>
										))}
									</div>
								</Container>
							</div>
							<div className="flex gap-4">
								{/* left */}
								<Container className="px-4 flex-col justify-center items-center w-fit">
									<p className="capitalized text-center">{firstData?.weather[0].description ?? ""}</p>
									<WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "", firstData?.dt_txt ?? "")} iconDescription={firstData?.weather[0].description ?? ""} />
								</Container>
								{/* right */}
								<Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
									<WeatherDetails visability={convertMetersToKilometers(firstData?.visibility ?? 10000)} humidity={`${firstData?.main.humidity}%`} windSpeed={convertWindSpeed(firstData?.wind.speed ?? 3.4)} airPressure={`${firstData?.main.pressure} hPa`} sunrise={format("HH:mm", fromUnixTime(data?.city.sunrise))} sunset={format("HH:mm", fromUnixTime(data?.city.sunset))} />
								</Container>
							</div>
						</section>
						{/* Next 7 days data */}
						<section className="flex flex-col w-full gap-4">
							<p className="text-2xl">5 Days Forcast</p>
							{firstDataForEachDate?.map((d, index) => (
								<ForcastWeatherDetail key={index} weatherIcon={d?.weather[0].icon ?? "01d"} date={d ? format("dd.MM.yy", parseISO(d.dt_txt)) : ""} day={d ? format("EEEE", parseISO(d.dt_txt)) : "EEEE"} temp={d?.main.temp ?? 0} description={d?.weather[0].description ?? ""} feels_like={d?.main.feels_like ?? 0} temp_max={d?.main.temp_max ?? 0} temp_min={d?.main.temp_min ?? 0} visability={`${convertMetersToKilometers(d?.visibility ?? 10000)}`} humidity={`${d?.main.humidity}%`} windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)}`} airPressure={`${d?.main.pressure} hPa`} sunrise={format("HH:mm", fromUnixTime(data?.city.sunrise ?? 1702517657))} sunset={format("HH:mm", fromUnixTime(data?.city.sunset ?? 1702517657))} />
							))}
						</section>
                    </>
				)}
			</main>
		</div>
	);
}

function WeatherSkeleton() {
	return (
	  	<section className="space-y-8 ">
			{/* Today's data skeleton */}
			<div className="space-y-2 animate-pulse">
			{/* Date skeleton */}
			<div className="flex gap-1 text-2xl items-end ">
				<div className="h-6 w-24 bg-gray-300 rounded"></div>
				<div className="h-6 w-24 bg-gray-300 rounded"></div>
			</div>

			{/* Time wise temperature skeleton */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{[1, 2, 3, 4].map((index) => (
				<div key={index} className="flex flex-col items-center space-y-2">
					<div className="h-6 w-16 bg-gray-300 rounded"></div>
					<div className="h-6 w-6 bg-gray-300 rounded-full"></div>
					<div className="h-6 w-16 bg-gray-300 rounded"></div>
				</div>
				))}
			</div>
			</div>

			{/* 7 days forecast skeleton */}
			<div className="flex flex-col gap-4 animate-pulse">
			<p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

			{[1, 2, 3, 4, 5, 6, 7].map((index) => (
				<div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
				<div className="h-8 w-28 bg-gray-300 rounded"></div>
				<div className="h-10 w-10 bg-gray-300 rounded-full"></div>
				<div className="h-8 w-28 bg-gray-300 rounded"></div>
				<div className="h-8 w-28 bg-gray-300 rounded"></div>
				</div>
			))}
			</div>
	  	</section>
	);
}

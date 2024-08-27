"use client"

import React, { useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";

import { HiSun } from "react-icons/hi";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";

import SearchBox from "./SearchBox";
import { loadingCityState, placeHolder } from "@/app/atom";

type Props = { location?: string };

export default function Navbar({location}: Props) {
    // State variables for managing the search input and suggestions //
    const [city, setCity] = useState("");
    const [error, setError] = useState("");

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Atoms for managing the current place and loading state //
    const [place, setPlace] = useAtom(placeHolder);
    const [loadingState, setLoadingState] = useAtom(loadingCityState);

    // Function to handle changes in the search input //
    async function handleInputChange(value: string) {
        setCity(value);
        if (value.length > 0) {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`);

                const suggestions = response.data.list.map((item: any) => item.name);
                setSuggestions(suggestions);
                setError("");
                setShowSuggestions(true);
            } catch (error) {
                setShowSuggestions(false);
                setSuggestions([]);
                // setError("City not found");
            }

            // return;
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    }

    // Function to handle clicking on a suggestion //
    function handleSuggestionClick(value: string) {
        setCity(value);
        setShowSuggestions(false);
    }

    // Function to handle submitting the search form //
    function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
        setLoadingState(true);
        e.preventDefault();
        if (suggestions.length == 0) {
            setError("City not found");
            setLoadingState(false);
        } else {
            setError("");
            setTimeout(() => {
                setPlace(city);
                setShowSuggestions(false);
                setLoadingState(false);
            }, 750);
        }
    }

    // Function to handle getting the user's current location //
    function handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    setLoadingState(true);
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`);
                    setTimeout(() => {
                        setLoadingState(false);
                        setPlace(response.data.name);
                    }, 500);
                } catch (error) {
                    setLoadingState(false);
                    setError("Failed to get location");
                    console.error(error);
                }
            });
        }
    }

    // Render the navigation bar //
    return (
        <>
            <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
                <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
                    <header className="flex items-center justify-center gap-2">
                        <h2 className="text-gray-500 text-3xl">Weather</h2>
                        <HiSun className="text-3xl mt-1 text-yellow-300" />
                    </header>
                    {/*  */}
                    <section className="flex gap-2 items-center">
                        <FaLocationCrosshairs title="Your Current Location" className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer" onClick={handleCurrentLocation} />
                        <MdLocationPin className="text-3xl" />
                        <p className="text-slate-90/80 text-sm">{location}</p>
                        <div className="relative hidden md:flex">
                            <SearchBox onSubmit={handleSubmitSearch} value={city} onChange={(e) => handleInputChange(e.target.value)} />
                            <SuggestionBox {...{showSuggestions, suggestions, handleSuggestionClick, error}} />
                        </div>
                    </section>
                </div>
            </nav>

            {/* For Responsiveness on Mobile Devices */}
            <section className="flex max-w-7xl px-3 md:hidden justify-center items-center">
                <div className="relative max-w-md mx-auto">
                    {/* SearchBox */}
                    <SearchBox value={city} onSubmit={handleSubmitSearch} onChange={(e) => handleInputChange(e.target.value)} />
                    <SuggestionBox {...{ showSuggestions, suggestions, handleSuggestionClick, error }} />
                </div>
            </section>
        </>
    )
}

/**
 * A function to render a suggestion box for city names.
 *
 * @param showSuggestions - A boolean indicating whether to show the suggestion box.
 * @param suggestions - An array of city names to display as suggestions.
 * @param handleSuggestionClick - A function to handle the click event on a suggestion.
 * @param error - An error message to display if there is an error.
 *
 * @returns A React component that renders the suggestion box.
 */

// Component for rendering the suggestion dropdown.
function SuggestionBox({showSuggestions, suggestions, handleSuggestionClick, error}: {showSuggestions: boolean, suggestions: string[], handleSuggestionClick: (item: string) => void, error: string}) {
    return (
        // <div className="absolute top-[100%] left-0 w-full bg-white shadow-md rounded-md">
        <> 
            {((showSuggestions && suggestions.length > 0) || error) && (
                <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-grey-300 rounded-md min-w-[200px] flex flex-col gap-2 p-2">
                {error && suggestions.length > 1 && (
                    <li className="text-red-400 p-1"> {error} </li>
                )}
                {suggestions.map((item, index) => (
                    <li key={index} className="cursor-pointer p-1 rounded hover:bg-gray-100" onClick={() => handleSuggestionClick(item)}>
                        {item}
                    </li>
                ))}
                </ul>
            )}
        </>
        // </div>
    );
}

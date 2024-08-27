import React from "react"
import Image from "next/image"
import { cn } from "@/utils/cn"

export default function WeatherIcon(props: React.HTMLProps<HTMLDivElement> & { iconName: string, iconDescription: string}) {
    return (
        <div {...props} className={cn("relative w-20 h-20")}>
            <Image className="absolute w-full h-full" src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`} alt={props.iconDescription} width={100} height={100} />
        </div>
    )
}

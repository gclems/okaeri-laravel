import { useMemo } from "react";

import Barometer from "@meteocons/svg/fill/barometer.svg";
import ClearDay from "@meteocons/svg/fill/clear-day.svg";
import Humidity from "@meteocons/svg/fill/humidity.svg";
import Sunrise from "@meteocons/svg/fill/sunrise.svg";
import Sunset from "@meteocons/svg/fill/sunset.svg";
import Umbrella from "@meteocons/svg/fill/umbrella.svg";
import UvIndex1 from "@meteocons/svg/fill/uv-index-1.svg";
import UvIndex2 from "@meteocons/svg/fill/uv-index-2.svg";
import UvIndex3 from "@meteocons/svg/fill/uv-index-3.svg";
import UvIndex4 from "@meteocons/svg/fill/uv-index-4.svg";
import UvIndex5 from "@meteocons/svg/fill/uv-index-5.svg";
import UvIndex6 from "@meteocons/svg/fill/uv-index-6.svg";
import UvIndex7 from "@meteocons/svg/fill/uv-index-7.svg";
import UvIndex8 from "@meteocons/svg/fill/uv-index-8.svg";
import UvIndex9 from "@meteocons/svg/fill/uv-index-9.svg";
import UvIndex10 from "@meteocons/svg/fill/uv-index-10.svg";
import UvIndex11 from "@meteocons/svg/fill/uv-index-11.svg";
import Wind from "@meteocons/svg/fill/wind.svg";
import { Card, cn } from "shanty-ui";

import { Meteocon } from "@/components/meteocon";
import { RollingTime } from "@/components/rolling-time";
import { useClock } from "@/features/clock/use-clock";
import { useToday } from "@/features/clock/use-today";
import { useDomoStore } from "@/features/domo/domo-store";
import {
	getWeatherConditionIcon,
	getWeatherConditionLabel,
} from "@/features/weather/weather-condition";

const UV_INDEX_ICONS = [
	UvIndex1,
	UvIndex2,
	UvIndex3,
	UvIndex4,
	UvIndex5,
	UvIndex6,
	UvIndex7,
	UvIndex8,
	UvIndex9,
	UvIndex10,
	UvIndex11,
];

function WeatherCard() {
	const today = useToday();
	const now = useClock();
	const sunPhasesMap = useDomoStore((state) => state.sunPhasesMap);
	const sunPhase = sunPhasesMap.get(today.toISOString());

	const weatherForecastsMap = useDomoStore((state) => state.weatherForecastsMap);
	const weatherForecast = useMemo(
		() => Array.from(weatherForecastsMap.values())[0],
		[weatherForecastsMap],
	);

	return (
		<Card className="@container relative overflow-hidden bg-transparent bg-none! border-none! before:content-none! h-57.5">
			<Card.Body className="text-white">
				{weatherForecast && (
					<div className="flex flex-col-reverse @lg:flex-row items-center justify-end gap-2">
						<div className="flex items-center gap-x-1 justify-center bg-black/20 @xl:bg-transparent rounded-lg w-fit px-4">
							<Meteocon
								src={getWeatherConditionIcon(
									weatherForecast?.condition?.condition ?? null,
								)}
								alt={getWeatherConditionLabel(
									weatherForecast.condition?.condition ?? null,
								)}
								className="size-24"
							/>
							<div className="flex flex-col">
								<span className="text-metric font-semibold text-4xl">
									{weatherForecast.temperature?.value?.toFixed(0) ?? "–"}
									<span className="text-lg">°C</span>
								</span>
								<span className="">
									{getWeatherConditionLabel(
										weatherForecast.condition?.condition ?? null,
									)}
								</span>
							</div>
						</div>

						<div className="bg-black/20 p-4 rounded-lg w-fit">
							<div className="space-x-1 text-metric">
								<span className="">
									{today.toLocaleDateString([], {
										weekday: "short",
									})}
								</span>
								<span className="font-semibold text-lg">
									{today.toLocaleDateString([], {
										day: "2-digit",
									})}
								</span>
								<span className="">
									{today.toLocaleDateString([], {
										month: "short",
									})}
								</span>
								<span className="">
									{today.toLocaleDateString([], {
										year: "numeric",
									})}
								</span>
							</div>
							<div className="flex justify-center">
								<RollingTime date={now} className="text-2xl font-bold" />
							</div>
						</div>
					</div>
				)}
			</Card.Body>
			<Card.Footer className="hidden @xl:flex justify-end items-end text-white gap-x-4">
				{weatherForecast && (
					<>
						<div className="flex bg-black/20 px-4 items-center rounded-lg w-fit gap-x-4">
							<div className="flex gap-x-0.5 items-center">
								<Meteocon src={Humidity} alt="Humidité" className="size-8" />
								{weatherForecast.humidity?.value?.toFixed(0) ?? "–"}%
							</div>
							<div className="flex gap-x-0.5 items-center">
								<Meteocon src={Wind} alt="Vent" className="size-8" />
								{weatherForecast.windSpeed?.value?.toFixed(0) ?? "–"}
								<span className="text-xs">{weatherForecast.windSpeed?.unit}</span>
							</div>
							<div className="flex gap-x-0.5 items-center">
								<Meteocon src={Umbrella} alt="Pluie" className="size-8" />
								{weatherForecast.rainChance?.value?.toFixed(0) ?? "–"}%
							</div>
							<div className="flex gap-x-0.5 items-center">
								<Meteocon
									src={getUvIndexIcon(weatherForecast.uvIndex?.value)}
									alt="Indice UV"
									className="size-8"
								/>
								UV{weatherForecast.uvIndex?.value ?? "–"}
							</div>
							<div className="flex gap-x-0.5 items-center">
								<Meteocon src={Barometer} alt="Pression" className="size-8" />
								{weatherForecast.pressure?.value?.toFixed(0) ?? "–"}
								<span className="text-xs">{weatherForecast.pressure?.unit}</span>
							</div>
						</div>
						<div className="bg-black/20 px-4 rounded-lg w-fit">
							{!!sunPhase && (
								<div className="grid grid-cols-3 gap-4">
									<PhaseBlock
										icon={Sunrise}
										time={new Date(sunPhase.sunrise_starts_at)}
									/>
									<PhaseBlock icon={ClearDay} time={new Date(sunPhase.solar_noon_at)} />
									<PhaseBlock icon={Sunset} time={new Date(sunPhase.sunset_starts_at)} />
								</div>
							)}
						</div>
					</>
				)}
			</Card.Footer>
		</Card>
	);
}

function getUvIndexIcon(value: number | null | undefined): string {
	if (value === null || value === undefined) return UvIndex1;

	const level = Math.min(11, Math.max(1, Math.round(value)));
	return UV_INDEX_ICONS[level - 1];
}

function PhaseBlock({ icon, time }: { icon: string; time: Date }) {
	const now = useClock();
	const isPast = useMemo(() => {
		return time.getTime() < now.getTime();
	}, [time, now]);

	return (
		<div
			className={cn("flex flex-col items-center gap-0.5", {
				"opacity-60": isPast,
			})}
		>
			<Meteocon src={icon} alt="" className="size-6" />
			<div className="text-metric text-sm">
				{time.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</div>
		</div>
	);
}

export { WeatherCard };
